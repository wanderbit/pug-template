"use strict";

var gulp = require('gulp'),
	pug = require('gulp-pug'),
	scss = require('gulp-sass'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	prefix = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	cssImport = require('gulp-cssimport'),
	cmq = require('gulp-group-css-media-queries'),
	spritesmith  = require('gulp.spritesmith'),
	iconfont= require('gulp-iconfont'),
	iconfontCss  = require('gulp-iconfont-css'),
	svgSprite    = require('gulp-svg-sprite'),
	svgmin       = require('gulp-svgmin'),
	browserSync = require('browser-sync').create();
var useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rimraf = require('rimraf'),
	notify = require('gulp-notify'),
	ftp = require('vinyl-ftp');

var paths = {
	blocks: 'blocks/',
	devDir: 'app/',
	outputDir: 'build/'
};

/*********************************
 Developer tasks
 *********************************/

//pug compile
gulp.task('pug', function() {
	return gulp.src([paths.blocks + '*.pug', '!' + paths.blocks + 'template.pug' ])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(paths.devDir))
		.pipe(browserSync.stream())
});

//scss compile
gulp.task('scss', function() {
	return gulp.src(paths.blocks + '*.scss')
		.pipe(plumber())
		.pipe(scss().on('error', scss.logError))
		.pipe(cssImport())
		.pipe(cmq())
		.pipe(prefix({
			browsers: ['last 10 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(paths.devDir + 'css/'))
		.pipe(browserSync.stream());
});

/*make png sprite*/
gulp.task('sprites', function () {
	var spriteData = gulp.src( paths.devDir + 'assets/sprites/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprites.scss',
		imgPath: '../img/sprite.png'
	}));

	spriteData.img.pipe(gulp.dest(paths.devDir + 'img'));
	spriteData.css.pipe(gulp.dest(paths.blocks + '_base'));
});

/*make icon font */
gulp.task('iconfont', function(){
	gulp.src(paths.devDir + 'assets/icons/*.svg')
		.pipe(iconfontCss({
			fontName: 'icons',
			path: paths.blocks + '_base/templates/icons_template.scss',
			targetPath: '_icons.scss',
			fontPath: '../fonts/icons/'
		}))
		.pipe(iconfont({
			fontName: 'icons'
		}))
		.pipe(gulp.dest(paths.devDir + 'fonts/icons'));
});

/*make svg sprite */
gulp.task('svgsprites', function () {
	return gulp.src(paths.devDir + "assets/svg/*.svg")
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))


		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg',
				}
			}
		}))
		.pipe(gulp.dest(paths.devDir + 'svg-sprites'));
});

//js compile
gulp.task('scripts', function() {
	return gulp.src([
		paths.blocks + '**/*.js',
		'!' + paths.blocks + '_assets/**/*.js'
	])
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.devDir + 'js/'))
		.pipe(browserSync.stream());
});

//watch
gulp.task('watch', function() {
	gulp.watch(paths.blocks + '**/*.pug', ['pug']);
	gulp.watch(paths.blocks + '**/*.scss', ['scss']);
	gulp.watch(paths.blocks + '**/*.js', ['scripts']);
});

//server
gulp.task('browser-sync', function() {
	browserSync.init({
		port: 3006,
		server: {
			baseDir: paths.devDir
		}
	});
});


/*********************************
 Production tasks
 *********************************/

//clean
gulp.task('clean', function(cb) {
	rimraf(paths.outputDir, cb);
});

//css + js
gulp.task('build', ['clean'], function () {
	return gulp.src(paths.devDir + '*.html')
		.pipe( useref() )
		.pipe( gulpif('*.js', uglify()) )
		.pipe( gulpif('*.css', cssmin()) )
		.pipe( gulp.dest(paths.outputDir) );
});

//copy images to outputDir
gulp.task('imgBuild', ['clean'], function() {
	return gulp.src(paths.devDir + 'img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.outputDir + 'img/'));
});

//copy fonts to outputDir
gulp.task('fontsBuild', ['clean'], function() {
	return gulp.src(paths.devDir + '/fonts/**/*')
		.pipe(gulp.dest(paths.outputDir + 'fonts/'));
});



//copy svg-sprites to outputDir
gulp.task('svgSpriteBuild', ['clean'], function() {
	return gulp.src(paths.devDir + '/svg-sprites/*')
		.pipe(gulp.dest(paths.outputDir + 'svg-sprites/'));
});

//ftp
gulp.task('send', function() {
	var conn = ftp.create({
		host:     '',
		user:     '',
		password: '',
		parallel: 5
	});

	/* list all files you wish to ftp in the glob variable */
	var globs = [
		'build/**/*',
		'!node_modules/**' // if you wish to exclude directories, start the item with an !
	];

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/' ) ) // only upload newer files
		.pipe( conn.dest( '/' ) )
		.pipe(notify("Dev site updated!"));

});


//default
gulp.task('default', ['browser-sync', 'watch', 'pug', 'scss', 'scripts']);

//production
gulp.task('prod', ['build', 'imgBuild', 'fontsBuild','svgSpriteBuild']);
