/**
 * 效果图详情页js
 * 
 */

(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.impression_detail = {
        init: function() {
            this.onload()
                ._event()
                .selectPic();
        },
        onload: function() {

            //顶部图册标题划入的时候设置他的宽度
            function submenu() {

                var lis = $(".show-mian .show-title li.sub-menu li"),
                    ulWidth = 0;

                lis.each(function(i, v) {
                    //v是li li宽度通过dd的个数来*100px
                    var a = $(v).find(".left a"),
                        b = Math.ceil(a.length / 8), //dd的数量
                        liWidth = b * 100; //当前li的宽度

                    ulWidth += liWidth; //累计ul的宽度

                    $(v).css("width", liWidth + 'px'); //给当前的li设置宽度

                    for (var i = 0; i < b - 1; i++) {
                        var dd = $("<dd class='clearfix'></dd>");
                        //dd中添加html
                        var c = a.splice(8, 8);
                        dd.append(c).appendTo($(v).find("dl"));
                    }

                    $(v).find(".left a:eq(7)").nextAll().remove();
                });
                //先给li宽度 再给 ul 宽度
                $(".show-title li.sub-menu .second").css({
                    width: (ulWidth + 40) + 'px'
                });
            }

            submenu();

            return this;
        },
        _event: function() {
            //动态给大图片的盒子一个宽度 这个宽度就是图片的宽度
            $(".show-b-pic .img").hover(function() {
                // console.log(111)
            }, function() {
                // console.log(222);
            });

            $(".show-b-pic .img").on("click", function() {
                // console.log("图片图片");
            });
            //点击收藏
            $(".show-b-pic .img span").click(function(e) {
                e.stopPropagation();

                // console.log("收藏收藏!");
            });

            return this;
        },
        selectPic: function() {
            //左右滑动看图片
            var pre = $(".preview .show-m-pic .pre"), //上一张按钮
                next = $(".preview .show-m-pic .next"), //下一张按钮
                client = $(".preview .show-m-pic .m-content").width(), //可视区 
                parent = $(".preview .show-m-pic .m-content ul"), //ul
                eles = parent.children(), //所有的li
                index = 0,
                flag = 1;

            var width = eles.outerWidth(true),
                quantity = Math.ceil(client / width); //计算显示的数量

            var hide = eles.slice(quantity, eles.length);
            hide.each(function(i, v) {
                $(v).removeClass("display-block").addClass("display-none");
            });

            var picSwiper = {
                changeInfo: function(target) {
                    //更改url 标题  tilte  右边的发单窗口 等等
                    var designerInfo = JSON.parse(target.find(".designerInfo").html()), //图片的相关信息   
                        tagList = JSON.parse(target.find(".tagList").html()), //右侧关于该图片的相关标签
                        imgType = target.find(".imgType").html(), //图片的类型 单图还是套图
                        currentImg = target.find("img"); //当前要显示的图片

                    //一.判断图片的类型
                    switch (imgType) {
                        case "mt": //单图
                            {
                                var container = $(".infomation"); //右侧的通栏
                                //1.设计的页面就要隐藏了
                                container.find(".impression-designer").addClass("display-none");
                                //2.判断标签内容
                                if (tagList.length) { //如果有相关标签
                                    container.find(".relevant-label").removeClass("display-none");
                                    //给标签添加内容
                                    var tag = "";
                                    tagList.forEach(function(v) {
                                        tag += "<a href=" + v.url + ">" + v.title + "</a>";
                                    });
                                    //相关标签填充内容
                                    container.find(".relevant-label").children("div").html(tag);

                                } else {
                                    container.find(".relevant-label").addClass("display-none");
                                }
                            }
                            break;
                        case "tc": //套图
                            {}
                            break;
                    }
                    //二.改变大图的src 标题 已经 关键词
                    var title = currentImg.attr("alt"),
                        src = currentImg.attr("src"),
                        imgId = currentImg.data("id"),
                        rUrl = imgId + ".html";
                    //标题
                    $("#current_img_title").html(title);
                    //图片的路径
                    $(".show-b-pic .img img").attr({
                        "src": src,
                        "alt": title
                    });
                    //网页的标题
                    $("title").html(title);
                    //网页的url
                    window.history.pushState({}, 0, rUrl);

                },
                nextPic: function() {
                    //防多点
                    if (!flag) return;
                    flag = 0;
                    //1.索引自增
                    index++;
                    //所有li
                    var show = parent.children().not(".display-none"),
                        ele = show.eq(index); //当前ul下可以点击的所有li

                    // 1.1判断是否最后一张
                    if (index >= show.length) { //视图中的最后一张
                        //添加最后的元素的
                        show.eq(0).addClass("display-none");
                        show.eq(show.length - 1).next().removeClass("display-none");
                        //重新找最后的元素
                        show = parent.children().not(".display-none");
                        index = show.length - 1;
                        ele = show.eq(index);

                        if (ele.index() >= eles.length - 1) { //如果是最后一张
                            //请求加载更多
                            var that = $(this),
                                url = that.data("url");

                            $.get(url, {}, function(res) {
                                var data = res.data,
                                    nextUrl = data.next,
                                    preUrl = data.prev,
                                    dataList = data.data,
                                    arr = [];

                                //改变接口地址
                                that.attr("data-url", nextUrl);
                                that.siblings(".pre").attr("data-url", preUrl);

                                dataList.forEach(function(v) {
                                    var str = "<li class='display-none'><div class='show'>" +
                                        "<img src=" + v.img + " alt=" + v.title + " data-id='" + v.id + "'/>" +
                                        "<div class='hide-info'>" +
                                        "<span class='designerInfo'>" + JSON.stringify(v.designerInfo) + "</span>" +
                                        "<span class='tagList'>" + JSON.stringify(v.tagList) + "</span>" +
                                        "<span class='imgType'>" + v.imgType + "</span>" +
                                        "</div></div></li>";

                                    arr.push(str);
                                });
                                //添加到父元素中
                                parent.append(arr.join(""));

                                ele.addClass("active").siblings("li").removeClass("active");
                                picSwiper.changeInfo(ele);
                                //重新获取父元素的子元素
                                eles = parent.children();
                                //继续点击
                                flag = 1;
                            });

                            return;
                        };

                        ele.addClass("active").siblings("li").removeClass("active");
                        picSwiper.changeInfo(ele);

                        flag = 1;
                        return;
                    };
                    //2.增加边框 改变设计师信息 改变title 改变keyword

                    ele.addClass("active").siblings("li").removeClass("active");
                    picSwiper.changeInfo(ele);

                    // 继续点击
                    flag = 1;
                },
                prePic: function() {
                    //防多点
                    if (!flag) return;
                    flag = 0;
                    //1.索引自增
                    index--;
                    //所有li
                    var show = parent.children().not(".display-none"); //当前ul下可以点击的所有li
                    // 1.1判断是否是第一张
                    if (index < 0) { //视图中的第一张

                        //添加第一个的元素的 让当前的视图显示的个数是一样的;
                        show.eq(show.length - 1).addClass("display-none");
                        show.eq(0).prev().removeClass("display-none");
                        //重新找最后的元素
                        show = parent.children().not(".display-none");
                        index = 0;
                        var ele = show.eq(index);

                        if (ele.index() <= 0) { //子元素中的第一张
                            //请求获取上一套数据
                            //请求加载更多
                            var that = $(this),
                                url = that.data("url");

                            $.get(url, {}, function(res) {
                                var data = res.data,
                                    nextUrl = data.next,
                                    preUrl = data.prev,
                                    dataList = data.data,
                                    arr = [];

                                //改变接口地址
                                that.attr("data-url", preUrl);
                                that.siblings(".next").attr("data-url", nextUrl);

                                dataList.forEach(function(v) {
                                    var str = "<li class='display-none'><div class='show'>" +
                                        "<img src=" + v.img + " alt=" + v.title + " data-id='" + v.id + "'/>" +
                                        "<div class='hide-info'>" +
                                        "<span class='designerInfo'>" + JSON.stringify(v.designerInfo) + "</span>" +
                                        "<span class='tagList'>" + JSON.stringify(v.tagList) + "</span>" +
                                        "<span class='imgType'>" + v.imgType + "</span>" +
                                        "</div></div></li>";

                                    arr.push(str);
                                });
                                //添加到父元素中
                                // parent.append(arr.join(""));
                                ele.before(arr.join(""))

                                ele.addClass("active").siblings("li").removeClass("active");
                                picSwiper.changeInfo(ele);
                                //重新获取父元素的子元素
                                eles = parent.children();
                                //继续点击
                                flag = 1;
                            });

                            return;
                        }
                        //移除类名
                        ele.addClass("active").siblings("li").removeClass("active");
                        picSwiper.changeInfo(ele);
                        //继续点击
                        flag = 1
                        return;
                    };
                    var ele = show.eq(index);
                    //2.增加边框 改变设计师信息 改变title 改变keyword

                    ele.addClass("active").siblings("li").removeClass("active");
                    picSwiper.changeInfo(ele);

                    // 继续点击
                    flag = 1;
                }
            }

            //下一张事件
            next.on("click", picSwiper.nextPic);
            //上一张
            pre.on("click", picSwiper.prePic);
            //点击缩略图目标的图片
            parent.on("click", "li .show", function() {
                $(this).parents("li").addClass("active").siblings("li").removeClass('active');

                var show = parent.children().not(".display-none"),
                    arr = Array.apply(null, show);
                index = arr.indexOf($(this).parents("li")[0]);

                //更改url 标题  tilte  右边的发单窗口
                picSwiper.changeInfo($(this));
            });

            //预览大图的中的左右点击事件
            $(".show-b-pic .pre").click(function() {
                pre.trigger("click");
            });
            $(".show-b-pic .next").click(function() {
                next.trigger("click");
            });
            return this;
        }
    }

    impression_detail.init();
});