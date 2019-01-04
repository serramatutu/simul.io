import { series, parallel, dest, src } from 'gulp';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import less from 'gulp-less';
import minifyCss from 'gulp-minify-css';
import rollup from 'rollup-stream';
import rollupConfig from './rollup.config';
import del from 'del';
import uglify from 'gulp-uglify';

function clean(callback) {
    del.sync('./dist/**/*');
    callback();
}

function js(callback) {
    rollup(rollupConfig)
        .pipe(source('simul-io-app.js', './src/scripts'))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(dest('./dist/scripts/'));
    callback();
}

function css(callback) {
    src('./src/css/style.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(dest('./dist/css/'))
    callback();
}

function html(callback) {
    src('./src/index.html')
        .pipe(dest('./dist/'));
    callback();
}

var build = series(
    clean,
    parallel(
        js, css, html
    )
);

export default build;