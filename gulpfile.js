const { src, dest, series, watch } = require('gulp'),
    concat = require('gulp-concat'),
    htmlMin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    svgSprite = require('gulp-svg-sprite'),
    image = require('gulp-image'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify-es').default,
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    browserSync = require('browser-sync').create()

const clean = () => {
    return del(['dist'])
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const styles = () => {
    return src('src/style/**/*.css') // *.scc - любой файл с любым именем .css, **/ - получить все файлы как с 1-го уровня (style) но и из подпапок тоже
        .pipe(sourcemaps.init())
        .pipe(concat('main.css')) // пропускаем через трубу и получаем модифицированными на выходе. Т.е. в main.css попадут стили из обоих фаылов
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist')) // с помощью этой трубы определяем в какую папку положить (destination) итоговый main.css
        .pipe(browserSync.stream()) // с помощью этой трубы browserSync будет получать все изменения в файлах выше
}

const htmlMinify = () => {
    return src('src/**/*.html') // для начала получим файл с которым будем работать(любой html из src)
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
}

const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify().on('error', notify.onError()))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg'
    ])
        .pipe(image()) // если ничего не передавать в аргументе, то настройки по умолчанию
        .pipe(dest('dist/images'))
}

watch('src/**/*.html', htmlMinify)
watch('src/style/**/*.css', styles)
watch('src/images/svg/**/*.svg', svgSprites)
watch('src/js/**/*.js', scripts)
watch('src/resources/**', resources)

exports.styles = styles // экспортируем таск styles в котором будет вызываться функция styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.default = series(clean, resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles)