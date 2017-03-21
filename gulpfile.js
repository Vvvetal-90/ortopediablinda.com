'use strict';
 
var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		browserSync 	= require('browser-sync'),
		reload 				= browserSync.reload,
		autoprefixer 	= require('gulp-autoprefixer'),
		rename        = require('gulp-rename'),
		bourbon       = require('node-bourbon'),
		notify        = require("gulp-notify"),
		cleanCSS 			= require('gulp-clean-css'),
		gutil         = require('gulp-util' ),
		ftp           = require('vinyl-ftp');
 
gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		//.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		//.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
 

// watch files for changes and reload
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('watch', ['sass', 'browser-sync' ], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('upload', function() {

	var conn = ftp.create({
		host:      'granit17.ftp.ukraine.com.ua',
		user:      'granit17_test',
		password:  '2c452pat',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'app/**',
	];
	return gulp.src(globs, {buffer: false})
//	.pipe( conn.newer( '/' ) ) // only upload newer files 
  .pipe( conn.dest( '/' ) );

});

gulp.task('default', ['watch']);