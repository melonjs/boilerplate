module.exports = function (grunt) {
    function task() {
        var path = require("path"),
            options = this.options({
                "varname" : "game.resources"
            });
            res = [];

        grunt.log.debug("options: " + JSON.stringify(options));
        grunt.log.debug("files: " + JSON.stringify(this.files));

        this.files.forEach(function (file) {
            file.src.forEach(function (src) {
                res.push({
                    "name"  : path.basename(src, path.extname(src)),
                    "type"  : file.type,
                    "src"   : (
                        file.type === "audio" ?
                        path.dirname(src) :
                        src
                    )
                });
            });
        });

        grunt.log.debug(JSON.stringify(res));

        grunt.file.write(
            options.dest,
            options.varname + "=" + JSON.stringify(res) + ";"
        );
        grunt.log.ok(options.dest)
    }

    grunt.registerMultiTask("resources", "Build melonJS resources.js", task);
};
