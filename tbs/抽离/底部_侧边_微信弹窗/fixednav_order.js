(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.Nav_order = {
        init: function() {
            this._event()
                .submit();
        },
        _event: function() {
            var that = this;
            //点击弹窗发单入口
            $(".alert-design").click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                var type = $(this).attr("type");
                that.showOrder(type);
            });
            //右侧联系客服
            $(".fixed-nav .contact-qq").click(function() {
                var qq = $(this).data('qq');
                if (qq) {
                    var url = 'http://wpa.qq.com/msgrd?v=3&uin=' + qq + '&site=qq&menu=yes';
                    if (qq == '4006062221') {
                        url = 'http://b.qq.com/webc.htm?new=0&sid=4006062221&eid=218808P8z8p8y8K808Q8K&o=www.tobosu.com&q=7&ref=' + document.location;
                    }
                    javascript: window.open(url, '_blank', 'height=544, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');
                    return;
                }
                javascript: window.open('http://b.qq.com/webc.htm?new=0&sid=4006062221&eid=218808P8z8p8y8K808Q8K&o=www.tobosu.com&q=7&ref=' + document.location, '_blank', 'height=544, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');

            });

            //返回顶部
            $(".fixed-nav .back-top").click(function() {
                $("html, body").animate({
                    "scrollTop": 0
                }, 200);
            });

            //弹屏发单窗口
            var alertOrder = {
                init: function() {
                    this._event();
                },
                _event: function() {
                    //发单切换窗口
                    $("#alert_order .bill .tab a").click(function() {
                        tabSwitch(this, "#alert_order .bill .content .order-content");
                    });
                    //点击关闭发单弹屏消失
                    $("#alert_order .content .close").click(function() {
                        $("#alert_order").css("display", "none");
                    });
                    //弹屏发单完善信息的关闭按钮
                    $("#alert_order .consument .close").click(function() {
                        var parent = $(this).parents(".consument");
                        parent.css("display", "none").siblings(".bill").css("display", "block");
                        //清空填写的数据
                        parent.find("a").removeClass("active");
                        parent.find("input").val("");
                        parent.find(".btn").addClass("formbit")
                        $("#alert_order").css("display", "none");
                    });
                    //禁止鼠标滚动
                    $("#alert_order,.forcus-us,.count-result").on("mousewheel", function(e) {
                        e.preventDefault();
                    });
                    $("#alert_order,.forcus-us,.count-result").on("DOMMouseScroll", function(e) {
                        e.preventDefault();
                    });
                    return this;
                }
            }
            alertOrder.init();

            //发单完善信息
            var consument = {
                init: function() {
                    this.select();
                },
                select: function() {
                    //点击选择
                    $(".consument .items a").click(function() {
                        //移除禁止变为可点击
                        $(this).parents(".consument").find(".btn").removeClass("formbit");

                        var value = $(this).attr("data-value")
                        $(this).addClass("active").parents("li").siblings("li").find("a").removeClass("active");
                        $(this).parents(".items").find("input").val(value);
                    });

                    //点击提交
                    $(".consument .perfect .btn").click(function() {
                        if ($(this).hasClass("formbit")) return;

                        var data = $(this).parents("form").serialize(),
                            that = this;
                        // return;
                        $.post("/tapi/order/improve_info", data, function(res) {
                            if (res.status == 200) { //成功!
                                //弹微信关注的窗口
                                $(".forcus-us").css("display", "block");
                            } else {
                                alert(res.msg);
                            }
                        }, "json");

                    });

                    return this;
                }
            };
            consument.init();

            //底部发单弹窗 收起和拉下
            $(".bottom-order .drop").click(function() {
                var flag = +$(this).attr("data-flag");
                if (flag) {
                    //上拉
                    $(this).attr("data-flag", "0");

                    $(".bottom-order .redbg").animate({
                        //231
                        "height": "50px"
                    });
                    $(".bottom-order").addClass("active").animate({
                        //532
                        "height": "95px"
                    });
                    $(".bottom-order .pic").css("z-index", "1000");
                    $(".bottom-order .pic").animate({
                        //0
                        "bottom": "345px",
                        //9
                    });
                } else {
                    //变小
                    $(this).attr("data-flag", "1");

                    $(".bottom-order .redbg").animate({
                        //231
                        "height": "231px"
                    });
                    $(".bottom-order").animate({
                        //532
                        "height": "532px"
                    }, function() {
                        $(this).removeClass("active");
                    });
                    $(".bottom-order .pic").animate({
                        //0
                        "bottom": "0px",
                        //9
                        "z-index": "9"
                    });
                }
            });

            //底部完善信息关闭按钮
            $(".bottom-order .consument .close").click(function() {
                var parent = $(this).parents(".consument");
                parent.css("display", "none").siblings(".content").css("display", "block").siblings(".drop").css("display", "block").siblings(".pic").css({ "z-index": "9", "bottom": "0" });
                parent.find("a").removeClass("active").end().find(".btn").addClass("formbit");
            });


            //表单中获取焦点的时候要吧边框变为原来的颜色
            $("form select,form input").on("focus", function() {
                $(this).parents(".items").siblings(".cue").html("");
                $(this).css("border-color", "#d8d8d8");
            });


            //tab切换的函数
            function tabSwitch(selt, target) {
                var val = $(selt).attr("data-value");
                $(selt).addClass("active").siblings("a").removeClass("active");
                $(target + "[data-value=" + val + "]").css("display", "block").siblings(target).css("display", "none");
            }

            return this;
        },
        submit: function() {
            //底部跟侧边的发单提交
            $("a.submit").click(function(e) {

                var that = this;
                var form = $(this).parents("form");
                var province = form.find("select[name='province']").val(),
                    city = form.find("select[name='city']").val(),
                    housearea = form.find("input[name='housearea']").val(),
                    cellphone = form.find("input[name='cellphone']").val(),
                    ownername = form.find("input[name='ownername']").val();

                //1.验证省市
                if (!TBSorder.testProvice(province).code) {
                    form.find("select[name='province']").css("border-color", "red").parents(".items").siblings(".cue").html(TBSorder.testProvice(province).msg);
                    return;
                };
                if (!TBSorder.testCity(city).code) {
                    form.find("select[name='city']").css("border-color", "red").parents(".items").siblings(".cue").html(TBSorder.testCity(city).msg);
                    return;
                };
                //2.验证面积
                if (form.find("input[name='housearea']").length) {
                    if (!TBSorder.testArea(housearea).code) {
                        form.find("input[name='housearea']").css("border-color", "red").parents(".items").siblings(".cue").html(TBSorder.testArea(housearea).msg);
                        return;
                    };
                };
                //3.验证手机号
                if (!TBSorder.testTel(cellphone).code) {
                    form.find("input[name='cellphone']").css("border-color", "red").parents(".items").siblings(".cue").html(TBSorder.testTel(cellphone).msg);
                    return;
                };
                //4.验证名字
                if (form.find("input[name='ownername']").length) {
                    if (!TBSorder.testName(ownername).code) {
                        form.find("input[name='ownername']").css("border-color", "red").parents(".items").siblings(".cue").html(TBSorder.testName(ownername).msg);
                        return;
                    };
                };

                var flag = +$(this).attr("data-flag");
                if (!flag) { return alert("请勿重复申请!"); }
                $(this).attr("data-flag", "0");
                //5.提交表单

                //添加隐藏
                form.find("input[name='comeurl']").val(window.location.href);
                // 报价单要把报价结果丢到
                var type = +$(that).attr("data-value");
                if (type == 1 || type == 3) {
                    var grade = form.find("select[name='city']").attr("data-citygrade");
                    var obj = TBSorder.clacPrice({
                        grade: grade,
                        area: housearea
                    });
                    form.find("input[name='decorate_price']").val(obj.total);
                }

                //发送发单数据给后台
                var formData = form.serialize();
                TBSorder.submit({
                    data: formData,
                    success: function(res) {
                        //成功之后的代码!;
                        $(that).attr("data-flag", "1");
                        if (!res.error_code) {
                            //清掉表单中的数据
                            form[0].reset();
                            switch (type) {
                                case 1:
                                    { //
                                        var consument = $("#alert_order .consument");
                                        $(that).parents(".bill").css("display", "none").siblings(".consument").css("display", "block");

                                        //计算报价结果

                                        consument.find(".meterial").html(obj.material);
                                        consument.find(".total").html(obj.total);
                                        consument.find(".man-make").html(obj.manMake);
                                        consument.find(".design").html(obj.design + "元");
                                        consument.find(".quality").html(obj.quality + "元");

                                        //将发挥的orderid 存在完善信息的页面中
                                        consument.find("input[name='order_id']").val(res.data.orderid);
                                    }
                                    break;
                                case 2:
                                    { //免费设计
                                        $(".forcus-us").css("display", "block");
                                    }
                                    break;
                                case 3: //底部的发单页
                                    {
                                        $(that).parents(".content").css("display", "none").siblings(".consument").css("display", "block").siblings(".drop").css("display", "none").siblings(".pic").css({ "z-index": "1002", "bottom": "-44px" });
                                        //计算结果的页面
                                        var con = $(that).parents(".content").siblings(".consument");
                                        //
                                        con.find(".meterial").html(obj.material);
                                        con.find(".total").html(obj.total);
                                        con.find(".man-make").html(obj.manMake);
                                        con.find(".design").html(obj.design + "元");
                                        con.find(".quality").html(obj.quality + "元");

                                        //发单id 传给下一个展示页面
                                        con.find("input[name='order_id']").val(res.data.orderid);
                                    }
                                    break;
                            }

                        } else {
                            alert(res.msg);
                        };

                    }
                });
            });
            return this;
        },
        showOrder: function(type) {
            //发单入口的弹屏
            $("#alert_order").css("display", "block");
            $("#alert_order .bill .tab a[data-value=" + type + "]").addClass("active").siblings("a").removeClass("active");
            $("#alert_order .bill .content .order-content[data-value=" + type + "]").css("display", "block").siblings(".order-content").css("display", "none");
        }
    }
    Nav_order.init();
})