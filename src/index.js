require("./stylesheets/main.less");

var Q = codebox.require("q");
var commands = codebox.require("core/commands");
var File = codebox.require("models/file");
var Tab = require("./tab");

var openFile = function(f) {
    if (f.isDirectory()) return Q.reject(new Error("Could not open a folder"));

    return codebox.tabs.add(Tab, {
        model: f
    }, {
        type: "image-previewer",
        title: f.get("name"),
        uniqueId: "file://"+f.get("path")
    });
};

// Add command to open a file
commands.register({
    id: "file.open.(png|jpg|jpeg|gif)",
    title: "File: Open as image",
    run: function(args) {
        return Q()
        .then(function() {
            if (args.file) return args.file;
            if (args.path) return File.get(args.path);
            throw "No file";
        })
        .then(openFile);
    }
});

