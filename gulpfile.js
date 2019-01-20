var gulp = require("gulp")
var fs = require("fs")
var url = require("url")
var path = require("path")
var sass = require("gulp-sass")
var webserver = require("gulp-webserver");
var data = require("./data/data.json")

gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
})

gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
})
gulp.task("webserver", function() {
    return gulp.src("./src/")
        .pipe(webserver({
            open: true,
            port: 8087,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == "/favicon.ico") {
                    return res.end()
                }
                if (pathname == "/api/list") {
                    var target = [];
                    var key = url.parse(req.url, true).query.key;
                    var type = url.parse(req.url, true).query.type;
                    var page = url.parse(req.url, true).query.page;
                    var limit = url.parse(req.url, true).query.limit;

                    data.forEach(function(item) {
                        if (item.title.match(key) != null) {
                            target.push(item)
                        }
                    })
                    var newArr = [];
                    if (type == "normal") {
                        newArr = target;
                    } else if (type == "sale") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return a.sale - b.sale
                        })
                    } else if (type == "asort") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return a.price - b.price
                        })
                    } else if (type == "desort") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return b.price - a.price
                        })
                    } else if (type == "credit") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return a.credit - b.credit
                        })
                    }
                    var total = Math.ceil(newArr.length / limit);
                    console.log(total)
                    endArr = newArr.slice((page - 1) * limit, page * limit)
                    res.end(JSON.stringify({ code: 1, msg: endArr, total: total }))
                        //对接口
                } else {
                    pathname = pathname == "/" ? "index.html" : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})
gulp.task("dev", gulp.series("sass", "webserver", "watch"))