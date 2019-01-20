require(["./config"], function() {
    require(["jquery", "BScroll"], function($, BScroll) {
        function dom(ele) {
            return document.querySelector(ele)
        }

        function Index() {
            this.key = "";
            this.type = "normal";
            this.page = 1
            this.limit = 6;
            this.total = 0;
            this.arr = [];
            this.init()
        }
        Index.prototype = {
            constructor: Index,
            init: function() {
                this.ajax()
                this.Bs()
                this.bindEvent()
            },
            Bs: function() {
                var _this = this;
                var height = dom("#pullDown").offsetHeight;
                var MyBs = new BScroll(".list-wrap", {
                    click: true,
                    probeType: 2,
                    scrollY: true
                })
                MyBs.on("scroll", function() {
                    if (this.y < this.maxScrollY - height) {
                        if (_this.page < _this.total) {
                            dom("#pullUp").innerHTML = "释放加载更多"
                        } else {
                            dom("#pullUp").innerHTML = "没有更多数据了"
                        }
                    } else if (this.y < this.maxScrollY - height / 2) {
                        if (_this.page < _this.total) {
                            dom("#pullUp").innerHTML = "上拉加载"
                        } else {
                            dom("#pullUp").innerHTML = "没有更多数据了"
                        }
                    }
                    if (this.y > height) {
                        dom("#pullDown").innerHTML = "释放刷新"
                    } else if (this.y > height / 2) {
                        dom("#pullDown").innerHTML = "下拉刷新"
                    }

                })
                MyBs.on("touchEnd", function() {
                    if (dom("#pullUp").innerHTML == "释放加载更多") {
                        console.log(_this.page, _this.total)
                        if (_this.page < _this.total) {
                            _this.page++;
                            _this.ajax()
                            dom("#pullUp").innerHTML = "上拉加载"
                        } else {
                            dom("#pullUp").innerHTML = "没有更多数据了"
                        }
                    }


                })

            },
            ajax: function() {
                _this = this
                $.ajax({
                    url: "/api/list",
                    dataType: "json",
                    data: {
                        key: _this.key,
                        type: _this.type,
                        page: _this.page,
                        limit: _this.limit
                    },
                    success: function(data) {
                        if (data.code == 1) {

                            _this.total = data.total;
                            _this.render(data.msg)
                        }
                    }
                })
            },
            render: function(data) { //页面渲染
                var html = "";
                data.forEach(function(item) {
                    html += ` <dl>
                    <dt>
                        <img src="img/1.png" alt="">
                    </dt>
                    <dd>
                        <p> ${item.title} </p>
                        <p>销量：<b> ${item.sale}</b></p>
                        <p>价格：<b> ${item.price}</b></p>
                        <p>信用：<b> ${item.credit}</b></p>
                    </dd>
                </dl>`
                })
                dom(".dl-box").innerHTML += html;
            },
            bindEvent: function() {
                var _this = this;
                //切换视图
                dom(".changeView").onclick = function(e) {
                        console.log(this)
                        if (dom(".dl-box").classList.contains("table")) {
                            dom(".dl-box").classList.remove("table")
                        } else {
                            dom(".dl-box").classList.add("table")
                        }
                    }
                    //模糊搜素
                dom(".search-btn").onclick = function() {
                        dom(".dl-box").innerHTML = "";
                        _this.key = dom(".search").value;
                        console.log(_this.key)
                        _this.ajax()

                        console.log(_this.arr)
                        var isSave = _this.arr.some(function(item) {
                            return item == dom(".search").value
                        })
                        if (!isSave) {
                            _this.arr.push(dom(".search").value);
                            localStorage.setItem("arr", JSON.stringify(_this.arr))
                        }

                    }
                    //销量排序

                dom('.sale').onclick = function() {
                    dom(".dl-box").innerHTML = "";

                    _this.key = dom(".search").value;
                    _this.type = "sale";
                    _this.ajax()
                }

                dom(".all").addEventListener("click", function(e) {
                    dom(".dl-box").innerHTML = "";

                    dom(".type").classList.remove("none");
                    if (e.target.nodeName == "B") {
                        _this.type = e.target.className;
                        dom(".type").classList.add("none");
                        _this.key = dom(".search").value;
                        _this.ajax()
                    }
                })
            }
        }
        new Index()
    })
})