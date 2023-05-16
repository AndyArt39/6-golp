const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')

const styles = () => {
    return src('src/style/**/*.css') // *.scc - любой файл с любым именем .css, **/ - получить все файлы как с 1-го уровня (style) но и из подпапок тоже
    .pipe(concat('main.css')) // пропускаем через трубу и получаем модифицированными на выходе. Т.е. в main.css попадут стили из обоих фаылов
    .pipe(dest('dist')) // с помощью этой трубы определяем в какую папку положить итоговый main.css
}

exports.styles = styles // экспортируй таск styles в котором будет вызываться функция styles