var gulp = require('gulp');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

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

function bundleWatchify(bundle) {
    console.log("Creating new bundle: " + (new Date()).toISOString());

    bundle.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest("dist/js"))
}

gulp.task("watch", function() {
    var bundle = browserify({
        basedir: '.',
        debug: true,
        entries: ['src/App.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .plugin(watchify);

    bundle.on('update', function(){
        bundleWatchify(bundle);
    });

    bundle.on("log", function(msg) {
        console.log(msg);
    });

    bundleWatchify(bundle);
});

gulp.task("default", ["bundle"]);