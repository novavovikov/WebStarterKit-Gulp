'use strict';

const   gulp = require('gulp'),
        pug = require('gulp-pug'), //шаблонизатор Pug aka Jade
        sourcemaps = require('gulp-sourcemaps'), //создаёт sourcemap
        del = require('del'), //удаление файлов
        newer = require('gulp-newer'), //запускает таски только для изменившихся файлов.
        debug = require('gulp-debug'), //отобржает какие файлы пропускаются через gulp и что с ними происходит
        browserSync = require('browser-sync').create(), //локальный сервер с livereload
        notify = require('gulp-notify'), //уведомление об ошибках
        plumber = require('gulp-plumber'), //отлавливаем ошибки на потоке
        include = require('gulp-include'), // для склейки файлов
        imagemin = require('gulp-imagemin'), //минификация изображений
        pngquant = require('imagemin-pngquant'), //минификация изображений
        svgSprite = require("gulp-svg-sprites"), //SVG спрайты
        postcss = require('gulp-postcss'), //post Css для CSS
        mqpacker = require("css-mqpacker"), //Пакуем медиа-зпросы в конце css
        importcss = require('postcss-smart-import'), //импорт файлов CSS
        precss = require('precss'), //синтаксис Sass
        calc = require('postcss-calc'), //синтаксис Sass
        autoprefixer = require('autoprefixer'), //вендорные префиксы
        cleanCSS = require('gulp-clean-css'), //Чистим и сжимаем CSS
        rename = require('gulp-rename'), //переименовываем файл
        uglify = require('gulp-uglify'), //Минфицируем JS
        beautify = require('gulp-beautify'), //Наводим красоту в JS
        babel = require('gulp-babel'), //транспилер для JS (ES-6)

        //react 
        gutil = require('gulp-util'),
        browserify = require('browserify'),
        babelify = require('babelify'),
        source = require('vinyl-source-stream');

// Очистка директории ------------------------------------------------------
gulp.task('clean', function() {
    return del('build');
});


// Таски для основных файлов, css, js , шрифтов и картинок -----------------
//html
gulp.task('html', function() {
    return gulp.src('src/html/*.html', {since: gulp.lastRun('html')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(include())
    .pipe(newer('build'))
    .pipe(debug({ title: 'html:' }))
    .pipe(gulp.dest('build'))
});

gulp.task('includes', function() {
    return gulp.src('src/html/**/*.html', {since: gulp.lastRun('includes')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(include())
    .pipe(debug({ title: 'includes:' }))
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

//mixin and includes
gulp.task('mixins', function() {
    return gulp.src('src/pug/mixins/*.pug', {since: gulp.lastRun('mixins')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(newer('build/mixins'))
    .pipe(debug({ title: 'mixins:' }))
});

gulp.task('pug:includes', function() {
    return gulp.src('src/pug/includes/*.pug', {since: gulp.lastRun('pug:includes')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(newer('build/includes'))
    .pipe(debug({ title: 'includes:' }))
});


//css
gulp.task('css', function() {
    var processors = [
                    importcss,
                    precss,
                    calc,
                    autoprefixer,
                    mqpacker                    
    ];
    return gulp.src('src/css/main.css')
    .pipe(plumber({ errorHandler: notify.onError() }))
    // .pipe(newer('build/css'))
    .pipe(postcss(processors))
    .pipe(gulp.dest('build/css'))
    .pipe(rename('main.min.css'))    .pipe(cleanCSS({debug: true}, function(details) {
            console.log('original: ' + (details.stats.originalSize/1024).toFixed(2) + 'kb');
            console.log('minified: ' + (details.stats.minifiedSize/1024).toFixed(2) + 'kb');
        }))
    .pipe(debug({ title: 'css:' }))
    .pipe(gulp.dest('build/css'))
});

//pics for css
gulp.task('pics', function() {
    return gulp.src('src/css/pics/**/*.{jpg,jpeg,png,svg}', {since: gulp.lastRun('pics')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(newer('build/css/pics'))
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
    .pipe(include())
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    // .pipe(gulp.dest('build/js'))
    .pipe(rename(function (path) {
        path.basename += ".min";
    }))
    .pipe(uglify())
    .pipe(debug({ title: 'js:' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('js:vendor', function() {
    return gulp.src('src/js/vendor.js')
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(beautify())
    // .pipe(gulp.dest('build/js'))
    .pipe(rename(function (path) {
        path.basename += ".min";
    }))
    .pipe(uglify())
    .pipe(debug({ title: 'vendor(js):' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('js:custom', function() {
    return gulp.src('src/js/custom.js')
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe(babel({
        presets: ['es2015']
    }))
    // .pipe(gulp.dest('build/js'))
    .pipe(rename(function (path) {
        path.basename += ".min";
    }))
    .pipe(uglify())
    .pipe(debug({ title: 'custom(js):' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

//jsx
gulp.task('jsx', () => {
    return browserify({
            entries: './src/jsx/app.jsx',
            extensions: ['.jsx'],
            debug: true
        })
        .transform('babelify', {
            presets: ['es2015', 'react'],
            plugins: ['transform-class-properties']
        })
        .bundle()
        .on('error', function(err){
            gutil.log(gutil.colors.red.bold('[browserify error]'));
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(source('bundle.min.js'))
        .pipe(gulp.dest('build/js'));
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
    return gulp.src('src/sprites/**/*.svg', {since: gulp.lastRun('svg:sprite')})
    .pipe(plumber({ errorHandler: notify.onError() }))
    .pipe(newer('build/sprites/*.svg'))
    .pipe(svgSprite({
        cssFile: "../../src/css/includes/preset/sprites.css",
        preview: false,
        common: "ico",
        selector: "_%f",
        svg: {
            sprite: "sprite.svg"
        }
    }))
    .pipe(debug({ title: 'svg:sprite:' }))
    .pipe(gulp.dest("build/sprites/"));
});

//source
gulp.task('source', function() {
    return gulp.src('src/source/**/*.*', {since: gulp.lastRun('source')})
    .pipe(debug({ title: 'source:' }))
    .pipe(gulp.dest('build/'))
});


//fonts
gulp.task('fonts', function() {
    return gulp.src('src/css/fonts/**/*.{ttf,eot,woff,woff2}', {since: gulp.lastRun('fonts')})
    .pipe(debug({ title: 'fonts:' }))
    .pipe(gulp.dest('build/css/fonts'))
});


// Отслеживание файлов--------------------------------------------
gulp.task('watch', function() {
    gulp.watch(['src/css/*.css', 'src/css/includes/blocks/*.css', 'src/css/includes/elements/*.css', 'src/css/includes/layout/*.css', 'src/css/includes/preset/*.css', 'src/css/includes/animation/*.css'], gulp.series('css'));
    gulp.watch('src/css/pics/**/*.*', gulp.series('pics'));
    gulp.watch('src/css/pics/sprite/svg/**/*.svg', gulp.series('svg:sprite'));
    gulp.watch('src/html/*.html', gulp.series('html'));
    gulp.watch('src/html/includes/**/*.html', gulp.series('includes'));
    gulp.watch('src/pug/*.pug', gulp.series('pug'));
    gulp.watch('src/pug/mixins/*.pug', gulp.series('mixins', 'pug:all'));
    gulp.watch('src/pug/includes/*.pug', gulp.series('pug:includes', 'pug:all'));
    gulp.watch('src/js/vendor/*.js', gulp.series('js:vendor'));
    gulp.watch('src/js/custom/*.js', gulp.series('js:custom'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/jsx/*.jsx', gulp.series('jsx'));
    gulp.watch('src/img/*.*', gulp.series('img'));
    gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
    gulp.watch('src/source/**/*.*', gulp.series('source'));
});

// Для продакшна -------------------------------------------------
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('css', 'html', 'pug', 'svg:sprite', 'js', 'jsx', 'fonts', 'pics', 'img', 'source')));


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
