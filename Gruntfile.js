module.exports = function(grunt) {

  grunt.initConfig({

    uglify: {
      options: { mangle: false },
      dist: {
        files: {
          'dist/content-editable.directive.min.js': ['dist/content-editable.directive.js']
        }
      }
    }

  })

  grunt.registerTask('default', ['uglify:dist'])
  grunt.loadNpmTasks('grunt-contrib-uglify')
}
