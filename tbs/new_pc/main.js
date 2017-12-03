/**
 * TBS pc站改版 主体body部分js  2017-11-23  lichengxiang 
 */
(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.TBSindex = {
        init: function() {
            this.onload()
                ._event()
                .slider()
                .scorll()
                .shadowDir()
                .submit()
                .alert();
        },
        onload: function() {
            //设置轮播图的宽度
            var width = $(".swiper-container").outerWidth();
            $(".swiper-container ul li").css("width", width);
            return this;
        },
        _event: function() {
            var that = this;
            //banner轮播图上的发单入口 切换发单入口
            $(".search-value .order .tab a").click(function() {
                tabSwitch(this, ".search-value .order form");
            });

            //点击弹窗发单入口 (装修公司或装修案例的点击发单弹窗)
            $(".alert-design").click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                var type = $(this).attr("type");
                that.showOrder(type);
            });

            //看攻略
            $(".guide .content .title li").hover(function() {
                $(this).addClass("active").siblings("li").removeClass("active");
                tabSwitch(this, ".guide .article");
            });

            //tab切换的函数
            function tabSwitch(selt, target) {
                var val = $(selt).attr("data-value");
                $(selt).addClass("active").siblings("a").removeClass("active");
                $(target + "[data-value=" + val + "]").css("display", "block").siblings(target).css("display", "none");
            }
            return this;
        },
        showOrder: function(type) {
            //发单入口的弹屏
            $("#alert_order").css("display", "block");
            $("#alert_order .bill .tab a[data-value=" + type + "]").addClass("active").siblings("a").removeClass("active");
            $("#alert_order .bill .content .order-content[data-value=" + type + "]").css("display", "block").siblings(".order-content").css("display", "none");
        },
        scorll: function() {
            //页面滚动的时候
            var height = $(".header").height() + $(".slider").height();

            $(document).scroll(function() {
                var value = $(this).scrollTop();
                //返回顶部的按钮
                if (value > height) {
                    $(".fixed-nav .back-top").fadeIn(200);
                } else {
                    $(".fixed-nav .back-top").fadeOut(200);
                };
            });
            return this;
        },
        slider: function() {
            //调用封装的轮播图插件
            // 轮播
            $(".slider .swiper-container").mySwiper({
                speed: 500,
                looper: 3000,
            });
            // 装修公司的轮播图
            $(".company .content").mySwiper({
                speed: 800,
                looper: 3000,
            });
            //装修案例下面的轮播图;
            $(".decoration-case .carouse").mySwiper({
                speed: 500,
                looper: false,
            });
            //广告位的轮播图
            $(".advertisement .banner").mySwiper({
                speed: 500,
                looper: 3000
            })
            return this;
        },
        submit: function() {
            //轮播图中发单的提交
            $("input.submit").click(function(e) {
                e.preventDefault();

                var that = this;
                var form = $(this).parents("form");
                var province = form.find("select[name='province']").val(),
                    city = form.find("select[name='city']").val(),
                    area = form.find("input[name='housearea']").val(),
                    tel = form.find("input[name='cellphone']").val(),
                    name = form.find("input[name='ownername']").val();

                //1.验证省市
                if (!TBSorder.testProvice(province).code) { alert(TBSorder.testProvice(province).msg); return; };
                if (!TBSorder.testCity(city).code) { alert(TBSorder.testCity(city).msg); return; };
                //2.验证面积
                if (form.find("input[name='housearea']").length) {
                    if (!TBSorder.testArea(area).code) { alert(TBSorder.testArea(area).msg); return; };
                };
                //3.验证手机号
                if (!TBSorder.testTel(tel).code) { alert(TBSorder.testTel(tel).msg); return; };
                //4.验证名字
                if (form.find("input[name='ownername']").length) {
                    if (!TBSorder.testName(name).code) { alert(TBSorder.testName(name).msg); return; };
                };
                //5.提交表单
                var flag = +$(this).attr("data-flag");
                if (!flag) { return alert("请勿重复申请!"); }
                $(this).attr("data-flag", "0");

                //给comeurl字段添加url
                form.find("input[name='comeurl']").val(window.location.href);

                //给decarate-price添加价钱
                var type = +$(that).parents("form").attr("data-value");
                if (type == 1) {
                    //弹窗报价结果要给decarate-price字段赋值
                    //计算价格
                    var grade = form.find("select[name='city']").attr("data-citygrade");
                    var obj = TBSorder.clacPrice({
                        grade: grade,
                        area: area
                    });
                    form.find("input[name='decorate_price']").val(obj.total);
                }

                var formData = form.serialize();
                TBSorder.submit({
                    data: formData,
                    success: function(res) {
                        //成功之后的代码!;
                        $(that).attr("data-flag", "1");

                        form[0].reset();
                        //成功
                        if (!res.error_code) {
                            switch (type) {
                                case 1:
                                    { //弹窗报价结果
                                        /**
                                         * total,material,manMake,design,quality
                                         */
                                        var ele = $(".count-result");
                                        ele.css("display", "block").find(".meterial").html(obj.material);
                                        ele.find(".total").html(obj.total);
                                        ele.find(".man-make").html(obj.manMake);
                                        ele.find(".design").html(obj.design + "元");
                                        ele.find(".quality").html(obj.quality + "元");
                                    }
                                    break;
                                case 2:
                                    { //弹窗微信号
                                        $(".forcus-us").css("display", "block");
                                    }
                                    break;
                            }
                        } else {
                            alert(res.msg);
                        }

                    }
                });
            });

            return this;
        },
        shadowDir: function() {

            return this;
        },
        alert: function() {
            $(".alert-model .close").click(function() {
                $(this).parents(".alert-model").css("display", "none");
            });
            $(".count-result .close").click(function() {
                $(this).parents(".count-result").css("display", "none");
            });
            $(".follow-wechat .close").click(function() {
                $(this).parents(".forcus-us").css("display", "none");
            });
            return this;
        }
    };
    win.alert = function(msg) {
        $(".alert-model").css("display", "block").children(".content").html(msg);
    }

    TBSindex.init();
});