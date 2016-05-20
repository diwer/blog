var gulp = require('gulp');
var markdown = require('gulp-markdown');

gulp.task('markdown', function() {
    return gulp.src('**/*.md')
        .pipe(markdown())
        .pipe(gulp.dest(function(f) {
            console.log("继续中/n");
            return f.base;
        }));
});

gulp.task('default', function() {
    gulp.watch('**/*.md', ['markdown']);
});