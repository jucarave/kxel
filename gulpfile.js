var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');

gulp.task("bundle", function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/App.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("default", ["bundle"]);