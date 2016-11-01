'use strict';

const gulp = require('gulp'),
    pug = require('gulp-pug'), //шаблонизатор Pug aka Jade
    sourcemaps = require('gulp-sourcemaps'), //создаёт sourcemap
    del = require('del'), //удаление файлов
    newer = require('gulp-newer'), //запускает таски только для изменившихся файлов.
    debug = require('gulp-debug'), //отобржает какие файлы пропускаются через gulp и что с ними происходит
    browserSync = require('browser-sync').create(), //локальный сервер с livereload
    notify = require('gulp-notify'), //уведомление об ошибках
    plumber = require('gulp-plumber'), //отлавливаем ошибки на потоке
    rigger = require('gulp-rigger'), // для склейки файлов
    imagemin = require('gulp-imagemin'), //минификация изображений
    pngquant = require('imagemin-pngquant'), //минификация изображений
    svgSprite = require("gulp-svg-sprites"), //SVG спрайты
    postcss = require('gulp-postcss'), //post Css для CSS
    mqpacker = require("css-mqpacker"), //Пакуем медиа-зпросы в конце css
    simplevars = require('postcss-simple-vars'), //работа с переменными
    nestedcss = require('postcss-nested'), //работа с вложенностями как в Sass
    scss = require('postcss-scss'), //синтаксис Sass
    cssnext = require('postcss-cssnext'), //синтаксис Sass
    importcss = require('postcss-import'); //импорт файлов CSS

// Очистка директории ------------------------------------------------------
gulp.task('clean', function() {
    return del('build');
});


// Таски для основных файлов, css, js , шрифтов и картинок -----------------
//html
gulp.task('html', function() {
    return gulp.src('src/html/*.html', {since: gulp.lastRun('html')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(rigger())
    .pipe(newer('build'))
    .pipe(debug({ title: 'html:' }))
    .pipe(gulp.dest('build'))
});

gulp.task('widgets', function() {
    return gulp.src('src/html/**/*.html', {since: gulp.lastRun('widgets')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(rigger())
    .pipe(debug({ title: 'widgets:' }))
    .pipe(gulp.dest('build'))
});

//Pug(HTML templates)
gulp.task('pug', function() {
    return gulp.src('src/pug/*.pug', {since: gulp.lastRun('pug')})
    .pipe(plumber({ errorHandler: notify.onError() }))    
    .pipe(pug({
        pretty: true
    }))
    .pipe(newer('build'))
    .pipe(debug({ title: 'pug:' }))
    .pipe(gulp.dest('build'))
});

//Pug(HTML ALl)
gulp.task('pug:all', function() {
    return gulp.src('src/pug/*.pug')
    .pipe(plumber({ errorHandler: notify.onError() }))    
    .pipe(pug({
        pretty: true
    }))
    .pipe(debug({ title: 'pug:' }))
    .pipe(gulp.dest('build'))
});

//mixin and widgets
gulp.task('mixins', function() {
    return gulp.src('src/pug/mixins/*.pug', {since: gulp.lastRun('mixins')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(newer('build/mixins'))
    .pipe(debug({ title: 'mixins:' }))
    .pipe(gulp.dest('build/mixins'))
});

gulp.task('pug:widgets', function() {
    return gulp.src('src/pug/widgets/*.pug', {since: gulp.lastRun('pug:widgets')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(newer('build/widgets'))
    .pipe(debug({ title: 'widgets:' }))
    .pipe(gulp.dest('build/widgets'))
});


//css
gulp.task('css', function() {
    var processors = [
                    nestedcss,
                    simplevars,
                    importcss,
                    cssnext,
                    mqpacker
    ];
    return gulp.src('src/css/main.css')
    .pipe(plumber({ errorHandler: notify.onError() }))
    // .pipe(newer('build/css'))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors, {syntax: scss}))
    .pipe(debug({ title: 'css:' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
});

//pics for css
gulp.task('pics', function() {
    return gulp.src('src/css/pics/**/*.{jpg,jpeg,png,svg}', {since: gulp.lastRun('pics')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    // .pipe(newer('build/css/pics'))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(debug({ title: 'pics:' }))
    .pipe(gulp.dest('build/css/pics'))
});

//js
gulp.task('js', function() {
    return gulp.src('src/js/*.js', {since: gulp.lastRun('js')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemaps.init())
    .pipe(newer('build/js'))
    .pipe(rigger())
    .pipe(debug({ title: 'js:' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('js:vendor', function() {
    return gulp.src('src/js/vendor.js')
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(debug({ title: 'vendor(js):' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('js:custom', function() {
    return gulp.src('src/js/custom.js')
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(debug({ title: 'custom(js):' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

//img for html
gulp.task('img', function() {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,svg}', {since: gulp.lastRun('img')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(newer('build/img'))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(debug({ title: 'img:' }))
    .pipe(gulp.dest('build/img'))
});

//svg
gulp.task('svg:sprite', function () {
    return gulp.src('src/css/pics/sprite/svg/**/*.svg', {since: gulp.lastRun('svg:sprite')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(newer('build/sprites/**/*.svg'))
    .pipe(svgSprite({
        cssFile: "../../src/css/includes/preset/sprite.css",
        svgPath: "../sprites/%f",
        baseSize: 16,
        preview: false,
        padding: 5,
        common: "ico",
        selector: "ico--%f",
    }))
    .pipe(debug({ title: 'svg:sprite:' }))
    .pipe(gulp.dest("build/sprites/"));
});


//fonts
gulp.task('fonts', function() {
    return gulp.src('src/css/fonts/**/*.{ttf,eot,woff,woff2}', {since: gulp.lastRun('fonts')})
    .pipe(debug({ title: 'fonts:' }))
    .pipe(gulp.dest('build/css/fonts'))
});


// Отслеживание файлов--------------------------------------------
gulp.task('watch', function() {
    gulp.watch('src/css/**/*.css', gulp.series('css'));
    gulp.watch('src/css/pics/**/*.*', gulp.series('pics'));
    gulp.watch('src/css/pics/sprite/svg/**/*.svg', gulp.series('svg:sprite'));
    gulp.watch('src/html/*.html', gulp.series('html'));
    gulp.watch('src/html/widgets/**/*.html', gulp.series('widgets'));
    gulp.watch('src/pug/*.pug', gulp.series('pug'));
    gulp.watch('src/pug/mixins/*.pug', gulp.series('mixins', 'pug:all'));
    gulp.watch('src/pug/widgets/*.pug', gulp.series('pug:widgets', 'pug:all'));
    gulp.watch('src/js/vendor/**/*.js', gulp.series('js:vendor'));
    gulp.watch('src/js/custom/**/*.js', gulp.series('js:custom'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
    gulp.watch('src/img/**/*.*', gulp.series('img'));
});

// Для продакшна -------------------------------------------------
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('css', 'html', 'pug', 'js', 'fonts', 'pics', 'img', 'svg:sprite')));


// Для запуска сервера--------------------------------------------
gulp.task('webserver', function() {
    browserSync.init({
        server: 'build'
    })

    browserSync.watch('build/**/*').on('change', browserSync.reload);
})


// Для разработки ----------------------------------------
gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'webserver'))
    );


// Default ----------------------------------------
gulp.task('default',
    gulp.series(gulp.parallel('watch', 'webserver'))
    );
