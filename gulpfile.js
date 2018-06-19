var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browsersync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		cache 		    = require('gulp-cache'),
		pngquant 	    = require('imagemin-pngquant'),
		del 		      = require('del'),
		imagemin 	    = require('gulp-imagemin');

gulp.task('browser-sync', function() {
	browsersync({
		server: {
			baseDir: 'app'
		}
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	})
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} ))
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src(['app/libs/bootstrap-grid/bootstrap-grid.min.css', 'app/libs/normalize.css/normalize.css'])
	.pipe(cleancss())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

/* gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/jquery-3.3.1.slim.min.js',
		'app/libs/powerange-master/dist/powerange.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browsersync.reload({ stream: true }))
}); */

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});


gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('watch', ['sass', 'css-libs', /* 'js', */ 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browsersync.reload)
});

gulp.task('build', ['clean', 'img', 'css-libs', /* 'js' */], function() {
	var buildCSS = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/*',
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	//var buildFA = gulp.src('app/libs/font-awesome-4.7.0/**/*')
	//.pipe(gulp.dest('dist/fonts'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

/* 	var jsDist = gulp.src('app/js/*.js')
	.pipe(gulp.dest('dist/js')); */
});

gulp.task('default', ['watch']);