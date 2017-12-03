var interVal;
var Orders = {
    currentEle: null,
    parentEle: null,
    countDown: null,
    doubleEleven: null,
    doubleTwelve: null,
    sideOrder: null,
    orderId: null,
    uid: null,
    init: function() {
        if (typeof cityInfo != 'undefined') {
            this.city_id = cityInfo["city_id"];
            this.city_val = cityInfo["city_code"];
            this.city_txt = cityInfo["simple_name"];
        };
        // 初始化城市
        this.initCity();
        // 初始化事件
        this._event();
    },
    initCity: function() {
        //根据省选择市
        $(".province").change(function() {
            Orders.getCity($(this), $(this).next());
        });
        //根据市选择区县
        $(".city").change(function() {
            Orders.getCity($(this), $(this).next());
        });
    },
    // 请求城市或者县
    getCity: function(ele, obj) {
        //计算的走这里
        if ($(".quotation-form, .zx-baojia-form, .zx-buget-form").length > 0) {
            var id = ele.val();
            var _arr = [];
            var districtList = positionDataCity[id];
            obj.html("");
            $(districtList).each(function(i, v) {
                var optionLi = '<option value=' + v.id + ' data-citygrade = ' + v.city_grade + '>' + v.name + '</option>';
                _arr.push(optionLi);
            });
            obj.append('<option value="0">选择城市</option>');
            obj.append(_arr);
        } else {
            //普通
            var url = "/tapi/order/get_c",
                flag = obj.attr("class"),
                data = { "id": ele.val(), "flag": flag };
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(msg) {
                    var _arr = [];
                    if (flag == "city") {
                        _arr.push('<option value="0">选择城市</option>');
                    } else if (flag == "district") {
                        _arr.push('<option value="0">选择区县</option>');
                    }
                    $.each(msg, function(i, v) {
                        if (flag == "city") {
                            _arr.push('<option value=' + v.cityID + '>' + v.cityName + '</option>')
                        }
                        if (flag == "district") {
                            _arr.push('<option value=' + v.districtID + '>' + v.districtName + '</option>');
                        }
                    });
                    obj.html(_arr.join(""));
                    url = null, flag = null, data = null;
                }
            });
        }
    },
    // 初始化事件
    _event: function() {
        var $btn = $(".order-btn"),
            that = this;
        if (!$btn.length) return false;
        $btn.bind("click", function() {
            var $me = $(this),
                authCodeV = $(".authCodeText").val(),
                authCode = $me.parents(".order-form").find(".txt_mathcode").attr("data-value");
            if ($me.hasClass("placeholder")) return;
            var $parent = $me.parents(".order-form"),
                tele = $parent.find(".inpt-tel").val();
            userName = $parent.find("input[name='ownername']").val(),
                housearea = $parent.find("input[name='housearea']").val();
            that.currentEle = $me;
            that.parentEle = $parent;
            that.quotation = $me.parents('.quotation-form').length;
            that.zxBuget = $me.parents('.zx-buget-form').length; //装修预算  /order_page/
            that.zxBaojia = $me.parents('.zx-baojia-form').length; //装修报价 /quotation/
            //底部计算
            that.bqOrder = $me.parents('.b-q-order').length;
            if (!that.checkName(userName)) return false;
            //计算
            if (that.quotation > 0 || that.zxBaojia > 0 || that.zxBuget > 0) {
                var money, livingRoom, bedroom,
                    kitchen, toilet, balcony, other, areas, area, moneys, tel, area,
                    city_grade, selCity,
                    zx_type = $('#zx_type').val(); //获取装修类型（全包、半包）（7.14新增）
                if (that.bqOrder > 0) {
                    area = $parent.find('.b-inpt-area').val();
                    tel = $parent.find('.inpt-tel').val();
                    selCity = $parent.find('.city').val();
                    city_grade = $parent.find('.city').find('option:selected').attr('data-citygrade');
                } else {
                    area = $('#inpt_area').val();
                    tel = $('#quotation_tel').val();
                    selCity = $parent.find('.city').val();
                    city_grade = $('.city').find('option:selected').attr('data-citygrade');
                }
                //全包（7.20新增）
                if (zx_type == 2) {
                    //自定义下拉选择城市等级
                    if (city_grade == 4) { //一线城市
                        money = 1050;
                    } else if (city_grade == 3) { //二线城市
                        money = 980;
                    } else if (city_grade == 2) { //三线城市
                        money = 860;
                    } else { //其它城市
                        money = 750;
                    }
                } else {
                    //半包
                    if (city_grade == 4) {
                        money = 550;
                    } else if (city_grade == 3) {
                        money = 480;
                    } else if (city_grade == 2) {
                        money = 440;
                    } else {
                        money = 380;
                    }
                }
                if (that.zxBuget > 0) {
                    if (selCity == 0) {
                        alert('请选择城市！');
                        return false;
                    }
                    if ($('.js-order').length > 0) {
                        $('#jszx').text($('#zx_grade').find("option:selected").text());
                        $('#jsType').text($('#zx_type').find("option:selected").text());
                    }
                }
                if (area == '') {
                    alert('请输入房屋面积');
                    return false;
                }
                if (selCity == 0) {
                    alert('请选择城市！');
                    return false;
                }
                //检查手机号码是否正确
                var reg = /^1[3-9][0-9]{9}$/;
                if (tel == '' || !reg.test(tel)) {
                    alert('请输入正确的手机号码!');
                    return false;
                }
                areas = area * money; //面积*半包/全包价格
                var zx_grade = $('#zx_grade').val() //装修级别（7.20新增）
                    //装修级别
                if (zx_grade == 1) { //普通装修
                    areas *= 0.78;
                } else if (zx_grade == 3) { //精装修
                    areas *= 1.58;
                }
                livingRoom = Math.round(areas * 0.22); //客厅
                bedroom = Math.round(areas * 0.2637); //卧室
                kitchen = Math.round(areas * 0.0919); //厨房
                toilet = Math.round(areas * 0.1263); //卫生间
                balcony = Math.round(areas * 0.09); //阳台
                other = Math.round(areas * 0.2); //其它
                //总价
                //moneys = livingRoom + bedroom + kitchen + toilet + balcony + other;
                moneys = Math.round(areas);
                that.moneys = moneys;
                that.livingRoom = livingRoom;
                that.bedroom = bedroom;
                that.kitchen = kitchen;
                that.toilet = toilet;
                that.balcony = balcony;
                that.other = other;
                $('#decorate_price').val(moneys);
                /*计算后添加结果*/
                if (that.bqOrder > 0) {
                    var $bpResult = $('.b-p-result');
                    $bpResult.show();
                    $bpResult.find('.decorate-price').val(moneys);
                    $bpResult.find('.moneys').text(moneys);
                    $bpResult.find('.living_room').text(livingRoom);
                    $bpResult.find('.bedroom').text(bedroom);
                    $bpResult.find('.kitchen').text(kitchen);
                    $bpResult.find('.toilet').text(toilet);
                    $bpResult.find('.balcony').text(balcony);
                    $bpResult.find('.other').text(other);
                } else {
                    $("#decoratePrice").val(moneys);
                    $('#moneys').text(moneys);
                    $('#living_room').text(livingRoom);
                    $('#bedroom').text(bedroom);
                    $('#kitchen').text(kitchen);
                    $('#toilet').text(toilet);
                    $('#balcony').text(balcony);
                    $('#other').text(other);
                    //新增的预算（全包简约）
                    setTimeout(xinYu, 2000);

                    function xinYu() {
                        //预算费用全包简约
                        $('#ke_ting02').text(parseInt(livingRoom * 2));
                        $('#wei_sheng_jian02').text(parseInt(toilet * 2));
                        $('#chu_fang02').text(parseInt(kitchen * 2));
                        $('#yang_tai02').text(parseInt(balcony * 2));
                        $('#wo_shi02').text(parseInt(bedroom * 2));
                        $('#other02').text(parseInt(other * 2));
                        //预算费用全包轻奢
                        $('#ke_ting03').text(parseInt(livingRoom * 2 * 1.5));
                        $('#wei_sheng_jian03').text(parseInt(toilet * 2 * 1.5));
                        $('#chu_fang03').text(parseInt(kitchen * 2 * 1.5));
                        $('#yang_tai03').text(parseInt(balcony * 2 * 1.5));
                        $('#wo_shi03').text(parseInt(bedroom * 2 * 1.5));
                        $('#other03').text(parseInt(other * 2 * 1.5));
                    }
                }
            }
            // 检测手机
            if (!that.testTel(tele)) return false;
            if (!that.testHousearea(housearea)) return false;
            $parent.find("input[name='comeurl']").val(window.location.href);
            if (userInfo != null && typeof userInfo != "undefined") {
                var type = userInfo.account_type;
                if ($('.popup-circle-click').length > 0) {
                    $('.popup-circle').removeClass('down').addClass("up");
                }
                //设计师
                if (type == 2) {
                    $(".pop-parents").remove();
                    $(".designer-account .err-has-login-tips").html("您已注册设计师账户！");
                    $(".designer-account").show().wrap("<div class='pop-box'></div>");
                    interVal = setTimeout(function() { $(".designer-account").unwrap(".pop-box").fadeOut(); }, 5000);
                    setTimeout(function() {
                        $(".pop-box").addClass('is-visible');
                    }, 50);
                    return false;
                }
                //企业账户
                if (type == 3) {
                    $(".pop-parents").remove();
                    $(".enterprise-account .err-has-login-tips").html("您已注册企业账户！");
                    $(".enterprise-account").show().wrap("<div class='pop-box'></div>");
                    interVal = setTimeout(function() { $(".enterprise-account").unwrap(".pop-box").fadeOut(); }, 5000);
                    setTimeout(function() {
                        $(".pop-box").addClass('is-visible');
                    }, 50);
                    return false;
                }
            }
            that.countDown = $me.parents(".count-down").length;
            that.doubleEleven = $me.parents(".double11-form").length;
            that.doubleTwelve = $me.parents(".double12-form").length;
            that.sideOrder = $me.parents("#side_order").length;
            var formId = $parent.attr("id"),
                _value = $me.parents(".self-design").attr("id"),
                $city = $parent.find("input[name='city']"),
                $select = $parent.find("select[name='city']"),
                selectValue = $select.val(),
                selectTxt = $select.find("option:selected").text();
            if (_value > 0) $parent.find("input[name='source']").val(_value);
            if (_value == '835' || _value == '836') {
                $parent.find("input[name='comid']").val($("input[name='comid']").val());
            };
            if (authCode != undefined) {
                if (authCodeV.length < 0 || authCodeV == '') {
                    $(".err-code-tip").show();
                    return false;
                };
            }
            //业主已登录赋值userid
            if (userInfo != null && typeof userInfo != "undefined") {
                var type = userInfo.account_type;
                if (type == 1) {
                    $("input[name='userid']").val(userInfo.uid);
                }
            }
            $(".collect-close-r").trigger("click"); //关闭弹窗
            var url_city_match_tmp = location.href.match(/citycode=(\w+)/),
                url_city_match_tmp2 = $.cookie('locate').match(/citycode=(\w+)/);
            //设置订单城市，优先级为 用户选择->url判断->默认ip
            if ($city.val() > 0) {
                that.submitOrder();
            } else if ($select.length && selectValue != 0) {
                $(".not-open-city").html(selectTxt);
                that.submitOrder();
            } else if (url_city_match_tmp || url_city_match_tmp2) {
                var citycode_url = '';
                if (url_city_match_tmp)
                    citycode_url = url_city_match_tmp[1];
                if (url_city_match_tmp2)
                    citycode_url = url_city_match_tmp2[1];
                that.getCityByCode(citycode_url, function(cityid, cityname) {
                    if ($select.length > 0) {
                        var $sele = $select.find("option");
                        $sele.val(cityid);
                    } else if ($city.val() > 0) {
                        return false;
                    } else {
                        $(".not-open-city").html(cityname);
                        $city.val(cityid);
                    }
                    that.submitOrder();
                });
            } else if ($select.length > 0) {
                // 没有选择城市
                var $sele = $select.find("option");
                $(".not-open-city").html(cityInfo["simple_name"]);
                $sele.val(cityInfo["city_id"]);
                that.submitOrder();
            } else {
                $(".not-open-city").html(cityInfo["simple_name"]);
                $city.val(cityInfo["city_id"]);
                that.submitOrder();
            }
            $me.addClass("placeholder");
        });
        // 释放内存
        $btn = null;
    },
    getCityByCode: function(citycode_url, callback) {
        $.ajax({
            type: "post",
            url: "/tapi/passport/get_city_id_by_code/",
            data: { "citycode": citycode_url },
            success: function(msg) {
                var cityid = msg.data["city_id"];
                callback(cityid);
            }
        })
    },
    getCityByIp: function(callback) {
        // 根据ip选择  
        ipUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
        $.getScript(ipUrl, function() {
            try {
                $.ajax({
                    type: "post",
                    url: "/tapi/passport/m_get_city_code/",
                    data: { "cityname": remote_ip_info.city },
                    success: function(msg) {
                        var cityid = msg.data["cityid"];
                        cityName = msg.data["cityname"];
                        callback(cityid, cityName);
                    }
                })
            } catch (e) {}
        });
    },
    submitOrder: function() {
        // 提交表单
        this.parentEle.ajaxSubmit({
            beforeSubmit: this.showRequest, //提交前的回调函数
            success: this.showResponse, //提交后的回调函数
            error: this.showError, //提交失败后回调函数
            timeout: 10000 //限制请求的时间，当请求大于10秒后，跳出请求
        });
    },
    testTel: function(tele) {
        var that = this,
            $ele = that.parentEle.find(".err-tel-tip");
        if (tele == '' || tele == "您的电话" || tele == "我的联系电话" || tele == "联系电话" || tele == "电话号码（必填）" || tele == "您的手机号码" || tele == "手机号码" || tele == "手机号码( 必填)" || tele == "请输入您的联系号码" || tele == "请填写手机号码（必填）" || tele == "输入手机号") {
            //hy
            alert("手机号码不能为空");
            return false;
        }
        //检查手机号码是否正确
        var reg = /^1[3-9][0-9]{9}$/;
        if (!reg.test(tele)) {
            //hy
            alert("手机号码错误");
            return false;
        }
        var reg = /(\d{3})\d{4}(\d{4})/,
            regTel = tele.replace(reg, '$1****$2');
        $(".my-tel-number").html(regTel).attr("data-tel", tele);
        return true;
    },
    testHousearea: function(housearea) {
        var that = this;
        //检查房屋面积是否正确
        var reg = /^[0-9]*$/;
        if ((housearea != undefined) && !reg.test(housearea)) {
            alert('请输入正确的房屋面积(只能是数字)！');
            return false;
        }
        return true;
    },
    checkName: function(username) {
        if (username == '' || username == '您的称呼') {
            alert("称呼不能为空！");
            return false;
        }
        var reg = /[0-9a-zA-z]/g;
        if ((typeof username != 'undefined') && reg.test(username)) {
            alert("称呼不允许输入字母和数字!");
            return false;
        }
        return true;
    },
    showRequest: function(formData, jqForm, options) {},
    showResponse: function(responseText, statusText) {
        var that = this,
            _order = Orders,
            error = responseText.error_code,
            msg = responseText.msg,
            data = responseText.data,
            $bkOrder = $('.js-order'),
            flag = responseText.type_flag;
        if (!msg) {
            msg = '网络异常，请稍候再试！';
        }
        if (error == 0 && data != undefined) {
            if (flag == 1) {
                //alert('请勿重复发单')
            }
            _order.orderId = data.orderid;
            $.cookie('yijiao', '1');
            Common.free_count();
            if (_order.zxBuget > 0) {
                if ($bkOrder.length <= 0) {
                    clearInterval(Quote.zxQuoteTimer);
                }
                if ($bkOrder.length > 0) {
                    _order.moneys = (_order.moneys / 10000).toFixed(1);
                    $bkOrder.fadeOut();
                    $('.zx-budget-result').fadeIn('slow');
                }
                $('#result_val').text(_order.moneys);
                $('#ke_ting').text(_order.livingRoom);
                $('#wo_shi').text(_order.bedroom);
                $('#chu_fang').text(_order.kitchen);
                $('#wei_sheng_jian').text(_order.toilet)
                $('#yang_tai').text(_order.balcony);
                $('#other').text(_order.other);



                //2017.11.6新增发单页面
                order_id = data.orderid;
                //              console.log(order_id);
                $('.cai_liao').text(parseInt($('#result_val').text() * 2 / 5));
                $('.ren_gong').text(parseInt($('#result_val').text() * 3 / 5));
                $('.she_ji').text(0);
                $('.zhi_jian').text(0);
                $(".she_ji_m").text(parseInt(parseInt($("#inpt_area").val()) * 100));
                $(".zhi_jian_m").text(3500);

                $(".zx-budget-tit").addClass("hide");
                $(".zx-budget-sele").removeClass("hide");
                $(".price").text(_order.moneys);


                $('.result-h').animate({
                    top: -42
                }, 1000)
                return false;
            } else if (data.isopen == 0) { //未开通城市是为0
                $(".no-city-pop").before('<div class="pop-parents"></div>').show();
                $(".order-form").resetForm();
                $(".show-city .cur-city").html("选择城市");
                $("input[name='city']").val('');
                return false;
            } else if (_order.doubleEleven > 0) {
                $(".red-paper-pop").before('<div class="pop-parents"></div>').show();
                //计算
            } else if ($('.order-succ-push').length > 0) {
                $('.order-succ-push').show();
            } else if (_order.quotation > 0) {
                if (_order.bqOrder > 0) {} else {
                    $('.calculate-popup-overlay').show();
                }
            } else if (_order.zxBaojia > 0) {
                $('#budget_result_page').show();
                $('#fitting_calculation_page').hide();
                return false;
            } else if (_order.doubleTwelve > 0) {
                $(".twelve-order").hide();
                $(".pop-paper").show();
            } else if (userInfo != null && typeof userInfo != "undefined") {
                var type = userInfo.account_type;
                _order.uid = userInfo.uid;
                if (type == 1) {
                    $(".has-apply-success").show().wrap("<div class='pop-box'></div>");
                    $(".pop-box").addClass('is-visible'); //
                    return false;
                }
            } else {
                Common.getCode(_order.orderId, _order.uid);
                $(".look-orders-pop").before('<div class="pop-parents"></div>').show();
            }
            setTimeout(function() {
                $(".pop-box").addClass('is-visible');
            }, 50);
            $(".photo_bottom").slideUp("slow");
            $(".order-form").resetForm();
            $(".show-city .cur-city").html("选择城市");
            $("input[name='city']").val('');
            $(".pop-order-bg,.i-wrant-order,.coupon-pop").hide();
            $('.first_layer,.red-paper-bg').hide();
            if (_order.sideOrder > 0) {
                if (Common.supportCss3('animation')) {
                    $('.popup-circle').removeClass('down').addClass('up');
                } else {
                    $('.popup-circle').removeClass('down');
                }
            }
            Common.setCookie('first', '1', 1);
            // 释放内存
            _order.currentEle.removeClass("placeholder"); // 移除class，恢复点击
            _order._freeMemory();
            //防止城市获取失败,修正订单城市
            if (data.orderid) {
                if (!data.city_id) {
                    $.ajax({
                        dataType: "jsonp",
                        url: '/tapi/order/fix_order_city',
                        data: data,
                        success: function(data) {}
                    });
                }
            }
        } else {
            $(".order-btn").removeClass("placeholder");
            alert(msg);
            return false;
        }
    },
    showError: function() {
        var msg = "网络异常,请稍候再试!";
        Orders._freeMemory();
    },
    _freeMemory: function() {
        this.currentEle = null;
        this.parentEle = null;
        this.countDown = null;
    }
};
//计算
var Quotation = {
    init: function() {
        this.events();
    },
    events: function() {
        $('#inpt_area').on('keyup', function(e) {
            var area = $(this).focus().val();
            if (area >= 0 && area <= 59) {
                //室
                $('#shi').val(1);
                //厅
                $('#ting').val(1);
                //卫
                $('#wei').val(1);
                //厨
                $('#chu').val(1);
                //阳台
                $('#yangtai').val(1);
            }
            if (area >= 60 && area <= 89) {
                //室
                $('#shi').val(2);
                //厅
                $('#ting').val(1);
                //卫
                $('#wei').val(1);
                //厨
                $('#chu').val(1);
                //阳台
                $('#yangtai').val(1);
            }
            if (area >= 90 && area <= 149) {
                //室
                $('#shi').val(3);
                //厅
                $('#ting').val(2);
                //卫
                $('#wei').val(2);
                //厨
                $('#chu').val(1);
                //阳台
                $('#yangtai').val(1);
            }
            if (area >= 150) {
                //室
                $('#shi').val(4);
                //厅
                $('#ting').val(2);
                //卫
                $('#wei').val(2);
                //厨
                $('#chu').val(1);
                //阳台
                $('#yangtai').val(2);
            }
        })
        $('.popup-ok-btn').bind('click', function() {
            $('.calculate-popup-overlay').hide();
        })
    }
}
var Common = {
    init: function() {
        var $cur_data = $(".comm-url");
        this.city_url = $cur_data.attr("data-cityurl");
        this.www_url = $cur_data.attr("data-wwwurl");
        if (typeof cityInfo != 'undefined') {
            this.city_id = cityInfo["city_id"];
            this.city_val = cityInfo["city_code"];
            this.city_txt = cityInfo["simple_name"];
        };
        this.chkIndexof();
        this.userInfo();
        this.checkBrowser();
        this.events();
        this.initClickCodeBtn();
        this.photo();
        //this.newVillage(); 新小区入口
        this.free_count();
        this.loginOut();
        this.showInfo();
        this.scrollFun();
    },
    events: function() {
        var that = this,
            curhref = window.location.href,
            isHome = $(".home-main").val(),
            order = $(".order-main").attr("data-value"),
            nowDate = new Date(),
            nowMonth, nowDay, orderNum;
        //免费装修设计 开始
        nowMonth = (nowDate.getMonth() + 1) + "";
        nowDay = nowDate.getDate() + "";
        if (nowDay < 10) {
            nowDay = "0" + nowDay;
        };
        orderNum = nowMonth + nowDay;
        orderNum = orderNum * 281 + 1999987;
        $(".self-design .title a").html(orderNum);
        $(".owner-wrap .show-info .color").html(orderNum);
        //免费装修设计 结束
        if (isHome == undefined) {
            $(".nav-l li").eq(0).removeClass("active");
        }
        $(".no-city-pop .close-btn").bind("click", function() {
            $(".no-city-pop").hide();
            $(".pop-parents").remove();
        })
        $(".form-item input,.search-input input").bind("focus", function() {
            var value = $(this).val();
            var _value = $(this).attr("data-value");
            if (value == _value) {
                $(this).val("");
            }
        }).bind("blur", function() {
            var value = $(this).val();
            var _value = $(this).attr("data-value");
            if (value == "" || value == _value) {
                $(this).val(_value);
            }
        });
        $(".link-names").find("a").bind("click", function(e) {
                $(this).addClass("active").siblings("a").removeClass("active");
                var index = $(this).index();
                $(".link-items").children().eq(index).show().siblings().hide();
            })
            /*头部内容滚动*/
        setInterval(function() {
            $(".order-info li:first").slideUp(500, function() {
                $(this).remove();
            }).clone().appendTo(".order-info");;
        }, 3000);
        //导航栏订单电话号码输入框获取焦点隐藏错误提示
        $(".inptshang").focus(function() {
                $(".errshang").html('<i class="err-ico"></i><sapn>手机号码不可以为空</sapn>');
                $(".errshang").hide();
            })
            //免费户型设计弹出框中电话号码获取焦点隐藏错误提示
        $(".inp-tel").focus(function() {
                $(".errxia").html('<i class="err-ico"></i><sapn>手机号码不可以为空</sapn>');
                $(".errxia").hide();
            })
            /*免费申请四份装修报价鼠标经过改变图标*/
        $('.nav-r').hover(function() {
            $("i").addClass("ico-up");
        }, function() {
            $("i").removeClass("ico-up");
        });
        /*免费装修设计*/
        $(".wrap-img").find(".fl").bind("click", function() {
                $(".self-design").modal({
                    opacity: 70,
                    dataId: 403
                });
            })
            /*业主中心-订单*/
        $(".menu-order-wrap .order-btn").bind("click", function() {
                $(".self-design").modal({
                    opacity: 70,
                    dataId: 904
                });
                $("input[name='userid']").val($(".owner-order-userid").attr("data-userid"));
            })
            /*头部搜索下拉选项效果*/
        $("#searchVal").find("a").bind("click", function() {
            var value = $(this).text(),
                conValue = $(this).attr('value'),
                showValue = $(this).attr('showtxt');
            $(".search-input>input").val(showValue);
            $(".search-input>input").attr("value", showValue);
            $(".search-input>input").attr("data-value", showValue);
            $("#showPic").attr("data-value", conValue);
            $("#showPic").find(".value").text(value);
            $("#searchVal").hide();
        });
        /*头部效果图选项卡切换*/
        $("#showPic").hover(function() {
            var cur = $(this);
            $("#searchVal").show();
            setTimeout(function() {
                $(document).one("click", function(e) {
                    var target = e.target;
                    if (!$(e.target).is("#searchVal a")) {
                        $("#searchVal").hide();
                    }
                });
            }, 200);
        });
        /*鼠标离开效果图选项卡隐藏*/
        $(".search-l").mouseleave(function() {
            $("#searchVal").hide();
        });
        $("ul.c-parent li").hover(function() {
            $(this).find("div.tips").show();
        }, function() {
            $(this).find("div.tips").hide();
        });
        $("div.case-screen li").on("click", function() {
            $(this).siblings().removeClass("on").end().addClass("on");
        });
        /*过滤注册页*/
        var uherf = window.location.href;
        if (uherf.indexOf('register') > 0 || uherf.indexOf('login') > 0) {
            $("#login").attr('href', 'http://' + that.www_url + '/passport/login.html');
            $(".login").attr('href', 'http://' + that.www_url + '/passport/login.html');
        } else {
            $(".login").attr('href', 'http://' + that.www_url + '/passport/login.html?r=' + encodeURIComponent(curhref));
            $(".login").click(function() {
                window.location.href = 'http://' + that.www_url + '/passport/login.html?r=' + encodeURIComponent(curhref);
            })
        }
        $(".inpt-tel").bind("focus", function() {
            $(".double11-form .inpt-tel").css("border", "1px solid #d7d7d7");
            $(".err-tel-tip").hide();
        });
        $(".authCodeText,.inpt-sms-code").bind("focus", function() {
                $(".inpt-sms-code").css("border", "1px solid #dfdfdf");
                $(".sms-verif .error-tips").html('');
                $(".none-apply-success .code-error").hide();
                $(".err-code-tip").hide();
                $(".simplemodal-data .code-error").hide();
                $(".apply-success-pop .auth_code").css("top", "23px");
                $(".login-content .auth_code").css("top", "65px");
                $(".pop-update-tel .auth_code").css("top", "-93px"); //个人中心修改手机号
                $(".bind-cellphone-pop .auth_code").css("top", "-93px"); //个人中心的绑定手机
            })
            /*学装修*/
        $(".header-nav .xzx").hover(function() {
            $(".header-nav-bg").show();
        }, function() {
            $(".header-nav-bg").hide();
        })
        $(".header-middle .search-submit").hover(function() {
            $(".header-middle .search-wrap").css("border", "1px solid #ff500b");
        }, function() {
            $(".header-middle .search-wrap").css("border", "1px solid #a2a2a2");
        })
        $(".side1").bind("click", function() {
            $(this).hide().animate({ width: '45px' }, 1000)
            $(".side2").show().animate({ width: '111px' }, 500)
        });
        $(".side2 .close-btn").bind("click", function() {
            $(".side2").hide().animate({ width: '111px' }, 1000)
            $(".side1").show().animate({ width: '45px' }, 500)
        });
        // 返回顶部动画
        $("#backtop_new").click(function() {
            $("html, body").animate({
                "scrollTop": 0
            }, 200);
        })
        $(".sele-tabs span").bind("click", function() {
            var $that = $(this);
            $that.addClass("on").siblings().removeClass("on");
            $("input[name='h_shi']").val($that.attr("data-id"));
            $("input[name='roomnumber']").val($that.attr("data-value"));
        });
        if (order != undefined) {
            $(".free-li").addClass("active").siblings().removeClass("active");
        };
        $(".woyaojiedang,.do-detail .pop-btn").bind("click", function() {
            var $popOrder = $(".i-wrant-order");
            $popOrder.before("<div class='pop-order-bg'></div>");
            $popOrder.show();
        })
        $(".i-wrant-order .close-ico").bind("click", function() {
                $('.i-wrant-order').hide();
                $('.pop-order-bg').hide();
            })
            //发单框成功与否关闭
        $(".apply-success-pop .close-btn,.vertif-success-pop .close-btn").bind("click", function() {
            window.clearInterval(interVal);
            $(".none-apply-success,.apply-success-pop,.vertif-success-pop").unwrap(".pop-box").fadeOut();
            //重置
            $(".none-apply-success .auth_code").hide().css("top", "23px");
            $(".none-apply-success .code-error").hide();
            $(".my-tel-number").attr("data-tel", "").attr("data-orderid", "").html('');
            $(".inpt-sms-code,.authCodeText").val('');
            $(".auth_code").hide();
            $(".inpt-sms-code").css("border", "1px solid #dfdfdf");
            $(".sms-verif .error-tips").html('');
            $(".pop-parents").remove();
        })
        $(".ident-code-js").bind("click", function() {
            var codeJs = $(".ident-code-js").html();
            if (typeof(codeJs) != 'undefined') {
                $(".auth_code").show();
            }
        })
        $(".sms-code-btn").bind("click", function() {
            that.loginByOrder();
        })
        $(".next").bind("click", function() {
            var imgSrc = $(".validate-h").attr("src") + "?" + Math.random();
            $(".validate-h").attr("src", imgSrc);
        });
        $(".tbszx-app-pop .close-btn").bind("click", function() {
            $(".tbszx-app-pop").hide();
            $(".pop-parents").remove();
        })
        $(".side-ul li").hover(function() {
            $(this).find(".side-sub").stop().show().animate({ "right": "50px", "opacity": "1" }, 300);
        }, function() {
            $(this).find(".side-sub").stop().show().animate({ "right": "106px", "opacity": "0" }, 300, function() {
                $(this).hide();
            });
        });
        $(".structure-f .structure").bind("click", function() {
            $(this).addClass("on").siblings().removeClass("on");
            $("#shi_num").attr("value", $(this).attr("data-value"));
        })
        $(".popup-circle .apply-btn").hover(function() {
            $(this).attr("value", "提交");
        }, function() {
            $(this).attr("value", "免费领取");
        });
        $("#free_design_btn").bind("click", function() {
            $('.popup-circle').removeClass('up').addClass('down').addClass('popup-circle-click').before('<div class="pop-parents"></div>').show();;
        });
        $('.popup-circle .close-btn').bind('click', function() {
            if (that.supportCss3('animation')) {
                $('.popup-circle').removeClass('down').addClass('up');
            } else {
                $('.popup-circle').removeClass('down');
            }
            $(".pop-parents").remove();
        })
        $(".look-orders-pop .close-btn").click(function() {
            $(".look-orders-pop").hide();
            $(".pop-parents").remove();
        })
        $(".look-orders-pop .refresh-code-btn").click(function() {
            $(".look-orders-expired").hide();
            that.getCode(Orders.orderId, Orders.uid);
        })
    },
    /*发单框悬浮HY*/
    scrollFun: function() {
        $(window).scroll(function() {
            var topHeight = $(document).scrollTop(),
                botHeight = $(document).height() - topHeight;
            if (topHeight > 1000) {
                $(".js_hang_form").css({ "position": "fixed", "top": "0" });
            } else {
                $(".js_hang_form").css("position", "");
            }
        })
    },
    getCode: function(orderid, uid) {
        $.post('/tapi/wechat/get_qrcode_ralation', function(info) {
            var qrcodeData = info;
            if (qrcodeData.error_code == 0) {
                $(".look-orders-pop img").attr("src", 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qrcodeData.ticket);
                $('.look-orders-pop .tbs-icon').css("background-image", "url(http://aliyun.tbscache.com/res/member/images/logo_30.png)");
                Common.codeRequest(qrcodeData.qrcode_id, qrcodeData.token_str, orderid, uid);
            }
        })
    },
    codeRequest: function(qrcodeId, token_str, orderid, userid) {
        var i = 45; //45
        var countDown = null;

        function getRTime() {
            i--;
            $.get('/tapi/wechat/run_ralation', { 'id': qrcodeId, 'token_str': token_str, "orderid": orderid }, function(msg) {
                if (msg.error_code == 0) {
                    $(".my-tel-number").attr("data-orderid", orderid);
                    clearInterval(countDown);
                    $(".look-orders-pop").hide();
                    $(".none-apply-success").show();
                }
            });
            if (i < 1) {
                clearInterval(countDown);
                $(".look-orders-expired").show();
            }
        }
        countDown = setInterval(getRTime, 2000);
    },
    chkIndexof: function() {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt /*, from*/ ) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0) ?
                    Math.ceil(from) :
                    Math.floor(from);
                if (from < 0)
                    from += len;
                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }
    },
    supportCss3: function(style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function(string) {
                return string.replace(/-(\w)/g, function($0, $1) {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix)
            humpString.push(_toHumb(prefix[i] + '-' + style));
        humpString.push(_toHumb(style));
        for (i in humpString)
            if (humpString[i] in htmlStyle) return true;
        return false;
    },
    setTimeoutFun: function(msg) {
        $('body').append('<p class="success-tips-common"></p>');
        $(".success-tips-common").html(msg).animate({
            "line-height": "35px",
            "height": "35px"
        }, 300);
        setTimeout(function() {
            $(".success-tips-common").css("height", "0");
            location.reload();
        }, 1000)
    },
    loginByOrder: function() {
        var $data = $(".none-apply-success .my-tel-number"),
            tel = $data.attr("data-tel"),
            orderid = $data.attr("data-orderid"),
            smsCode = $(".none-apply-success .inpt-sms-code").val();
        $.ajax({
            type: "post",
            url: "/tapi/passport/login_by_puborder",
            data: { "cellphone": tel, "sms_code": smsCode, "orderid": orderid },
            success: function(msg) {
                $(".inpt-sms-code").val('');
                if (msg.error_code == 0) {
                    $(".none-apply-success").hide();
                    if (msg.msg == 1) {
                        $(".individual-account").show();
                        var num = 5;
                        interVal = setInterval(function() {
                            num--;
                            if (num < 1) {
                                $(".individual-account").hide();
                                $(".none-apply-success").unwrap(".pop-box").hide();
                                window.location.href = "http://www.tobosu.com/user/ownerorder/index/";
                                window.clearInterval(interVal);
                            } else {
                                $(".outtime-number").html(num);
                            }
                        }, 1000);
                        return false;
                    }
                    if (msg.msg == 2) {
                        $(".designer-account").show();
                        interVal = setTimeout(function() {
                            $(".designer-account").hide();
                            $(".none-apply-success").unwrap(".pop-box");
                        }, 5000);
                    }
                    if (msg.msg == 3) {
                        $(".enterprise-account").show();
                        interVal = setTimeout(function() {
                            $(".enterprise-account").hide();
                            $(".none-apply-success").unwrap(".pop-box");
                        }, 5000);
                    }
                } else {
                    $(".inpt-sms-code").css("border", "1px solid red");
                    $(".sms-verif .error-tips").html(msg.msg);
                }
            }
        })
    },
    initClickCodeBtn: function() {
        var that = this;
        //判断验证码是否正确
        $(".autoCodeBtn").bind("click", function() {
            //SendCode.add();
            var $that = $(this),
                mobile = $("#cellphone").val();
            code = $that.prev().val().toLowerCase();
            if (typeof mobile == 'undefined' || mobile == '') {
                mobile = $that.parents(".tel-row").find(".my-tel-number").attr("data-tel");
                if (!mobile) {
                    mobile = $that.parents(".qm-con-items").find(".new-cellphone").val();
                }
                if (!mobile) {
                    mobile = $that.parents(".bind-cellphone-pop").find(".inpt-tel").val();
                }
                if (!mobile) {
                    mobile = $that.parents(".update-tel-wrap").find(".new-cellphone").val();
                }
                if (!mobile) {
                    mobile = $that.parents(".qm-con-items").find(".new-cellphone").val();
                };
            }
            $.ajax({
                type: "POST", //用POST方式传输
                dataType: "JSON", //数据格式:JSON
                url: '/tapi/passport/send_sms_code', //目标地址
                data: { "mobile": mobile, "code": code },
                error: function(XMLHttpRequest, textStatus, errorThrown) {},
                success: function(msg) {
                    if (msg.error_code != 0) {
                        var imgSrc = $(".validate-h").attr("src") + "?" + Math.random();
                        $(".validate-h").attr("src", imgSrc);
                        $("#auth_code").addClass("not-access");
                        $(".auth_code .code-error").html(msg.msg).attr("title", msg.msg).show().parents(".auth_code").css("top", "65px"); //top:14px
                        $(".bind-cellphone-pop .auth_code").css("top", "-116px"); //个人中心的绑定手机
                        //$(".bind-cellphone-pop .code-error").css("top", "116px");//个人中心
                        $(".simplemodal-data .auth_code").css("top", "243px");
                        $(".none-apply-success .auth_code").css("top", "0");
                        $("#form-register-des .auth_code").css("top", "243px"); //注册新设计师
                        $(".pop-update-tel .auth_code").css("top", "-116px"); //个人中心修改手机号
                        $(".auth_code.not-access .code-error").css("height", "auto"); //个人中心修改手机号
                        $('#txt_mathcode').one("focus", function() {
                            $(this).val("");
                            $("#auth_code").removeClass("not-access");
                        })
                    } else {
                        $("#auth_code").hide();
                        $(".qm-con-items .tip").hide(); //注册新设计师
                        SendCode.add();
                        $('.auth_code').hide();
                        $('.txt_mathcode').val('');
                        $('#jsSendCode').attr('disabled', 'disabled');
                    }
                }
            });
        });
    },
    checkBrowser: function() {
        var _IE = (function() {
            var v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
            return v > 4 ? v : false;
        }());
        if (_IE && _IE < 8) {
            $("body").prepend("<div class='browser-tips'>提示：浏览器版本太低，将无法使用，建议升级或将浏览器调成极速模式，推荐<a target='_blank' href='http://rj.baidu.com/soft/detail/14744.html?ald'>【谷歌】</a>或<a target='_blank' href='http://chrome.360.cn/'>【360极速】</a></div>");
        }
    },
    //悬浮框
    photo: function() {
        var that = this,
            colse = $(".photo_cosle"),
            submitb = $(".photo_btn"),
            kai = submitb.attr('cookies'),
            kai_val = that.getCookie(kai);
        if (kai_val == 'hied') {
            $(".photo_bottom02").css({ 'left': '-100%' });
            $(".photo_bottom_kai").css({ 'left': '0' });
        } else {
            $(".photo_bottom02").css({ 'left': '0' });
            $(".photo_bottom_kai").css({ 'left': '-160px' });
        }
        colse.bind('click', function() {
            $(".photo_bottom").animate({ 'left': '-100%' }, 800, function() {
                $(".photo_bottom_kai").animate({ 'left': '0' }, 200);
                that.setCookie(kai, 'hied', 1);
            });
        });
        $(".photo_bottom_kai").bind('click', function() {
            $(".photo_bottom_kai").animate({ 'left': '-160px' }, 200, function() {
                $(".photo_bottom").animate({ 'left': '0' }, 800);
                $.removeCookie(kai);
            });
        });
        $('.photo_bottom').find('input').eq(1).focus(function() {
            $('.photo_err').hide();
        });
    },
    //新小区导航入口
    newVillage: function() {
        var that = this,
            city,
            xiaoquhtml = '<a class="w_35b"  href="http://' + that.city_url + '/xiaoqu/">新小区<i class="free new" >新</i></a>',
            internalXiaoQu = '<a href="http://' + that.city_url + '/xiaoqu/">新小区</a>',
            tbscity = that.getCookie('tbscity'),
            loc_url = location.href;
        if (loc_url == "http://www.tobosu.com/" || loc_url == "http://www.dev.tobosu.com/") {
            $('#xiaoqu').hide();
        };
        if (that.city_id == 88) {
            var xiaoqua = $('#xiaoqu').find('a'),
                ihXiaoqu = $('#ih_xiaoqu');
            if (xiaoqua.length == 0) {
                $('#xiaoqu').append(xiaoquhtml).show();
            }
            if (ihXiaoqu != undefined) {
                $('#ih_xiaoqu').append(internalXiaoQu).show();
            };
        }
    },
    getCookie: function(name) {
        //切割成数组
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            //再次切割成数组
            var shu = arr[i].indexOf('='),
                arrb1 = arr[i].substring(0, shu),
                arrb2 = arr[i].substring(shu + 1);
            if (arrb1 == name) {
                return arrb2;
            }
        }
        return; //没有找到为空
    },
    //设置cookie，（名称，值，过期时间天为单位）
    setCookie: function(name, value, iDay) {
        var oDate = new Date();
        //设置时间
        oDate.setDate(oDate.getDate() + iDay);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    },
    userInfo: function() {
        var that = this;
        try {
            if (userInfo != null && typeof userInfo != "undefined") {
                var type = userInfo.account_type,
                    logo = userInfo.logo,
                    name = userInfo.username,
                    fullName = userInfo.full_name,
                    askmsg = userInfo.notice.ask_count,
                    msg = userInfo.notice.comment_count, //系统消息
                    sysmsg = userInfo.notice.system_count; //留言评论
                if (fullName == '') { //简化注册后，设计师这项为空
                    fullName = name;
                }
                try {
                    if (name.length > 4) {
                        name = name.substring(0, 3) + '…';
                    }
                } catch (e) {
                    name = '(未填写)';
                }
                if (askmsg != 0 || msg != 0 || sysmsg != 0) {
                    $(".msg-icon").addClass("yes");
                    $(".msg-ico").addClass(".has-msg-ico");
                }
                //业主1  	
                if (type == 1) {
                    $('.has-login-user-name').attr('href', 'http://' + that.www_url + '/user/ownerindex/index/'); //名字超链接
                    $('#personCenter').attr('href', 'http://' + that.www_url + '/user/ownerindex/index/'); //个人中心地址
                    $('#ask').attr('href', 'http://' + that.www_url + '/user/publicask/my_answer/'); //装修问答
                    $('#orders').attr('href', 'http://' + that.www_url + '/user/ownerorder/index/'); //装修订单
                    $('#msgCommet').attr('href', 'http://' + that.www_url + '/user/publicmsg/comment_reply/'); //留言评论
                    $('#systemmsg').attr('href', 'http://' + that.www_url + '/user/publicmsg/system_msg/'); //系统消息
                    //$('#sysmsg').html(msg);//系统消息
                    $('#ask').parent('li').hide();
                    $('#orders').parent('li').hide();
                    $('#askRemind').parent().remove();
                }
                //设计师 2	
                if (type == 2) {
                    $(".ih-msg,.login-yes-ul .msg").hide(); //消息
                    $('.has-login-user-name').attr('href', 'http://' + that.www_url + '/user/designerindex/index/'); //名字超链接
                    $('#personCenter').attr('href', 'http://' + that.www_url + '/user/designerindex/index/'); //个人中心地址
                    $('#ask').attr('href', 'http://' + that.www_url + '/user/publicask/my_answer'); //装修问答
                    $('#orders').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer/orderpiclist'); //装修订单
                    $('#askRemind').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer_faq/myInvite'); //问答提醒
                    $('#msgCommet').parent('li').css({
                        display: 'none'
                    }); //设计师登录不显示留言评论
                    $('#systemmsg').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer/bulletin/'); //系统消息
                    $('#ask').parent('li').hide(); //装修问答
                    $('#orders').parent('li').hide(); //装修问答
                }
                //装修公司3
                if (type == 3) {
                    $('.has-login-user-name').attr('href', 'http://' + that.www_url + '/user/companyindex/index'); //名字超链接
                    $('#personCenter').attr('href', 'http://' + that.www_url + '/user/companyindex/index'); //个人中心地址				
                    $('#ask').attr('href', 'http://' + that.www_url + '/user/publicask/my_answer'); //装修问答
                    $('#orders').attr('href', 'http://' + that.www_url + '/user/companyorder/order_auth'); //装修订单
                    $('#askRemind').attr('href', 'http://' + that.www_url + '/user/publicask/my_answer'); //问答提醒
                    $('#msgCommet').attr('href', 'http://' + that.www_url + '/user/publicmsg/comment_reply'); //留言评论
                    $('#systemmsg').attr('href', 'http://' + that.www_url + '/user/publicmsg/system_msg'); //系统消息	
                    //$('#sysmsg').html(msg);//留言评论
                }
                //登录成功后，删除注册页
                $('#registered').remove();
                $(".ht-login-yes,.internal-login-yes").show();
                $(".ht-not-login,.internal-login-no").hide();
                $(".my-head-img img").attr("src", logo);
                $('.login-name').html(name);
                $('.login-full-name').html(fullName);
                $('#askmsg').html(askmsg);
                $('#msg').html(sysmsg)
                $('#sysmsg').html(msg); //系统消息		            
            }
        } catch (e) {}
    },
    loginOut: function() {
        //顶部js登出
        $('a[id="jslogout"]').click(function() {
            //清除cookie信息
            var parentDomain = '.tobosu.com',
                currentDomain = 'tobosu.com';
            $.removeCookie('hasLogin', { expires: -1, path: '/' });
            $.removeCookie('affDomain', { expires: -1, path: '/' });
            $.removeCookie('affID', { expires: -1, path: '/' });
            $.removeCookie('newuid', { expires: -1, path: '/' });
            $.removeCookie('nickname', { expires: -1, path: '/' });
            $.removeCookie('realname', { expires: -1, path: '/' });
            $.removeCookie('affIcon', { expires: -1, path: '/' });
            $.removeCookie('tbsinfo', { domain: parentDomain, path: '/' });
            allFavid = -1;
            $('.ht-login-yes,.internal-login-yes').hide();
            $('.ht-not-login,.internal-login-yes').show();
            $.removeCookie('isuplogo', { domain: parentDomain, path: '/' });
            $.removeCookie('uplogo', { domain: parentDomain, path: '/' });
            $.removeCookie('bind_cellphone', { domain: parentDomain, path: '/' });
            $.removeCookie('peoplebindorder', { domain: parentDomain, path: '/' });
            $.removeCookie('autobindorder', { domain: parentDomain, path: '/' });
            location.reload();
        });
    },
    //计数
    free_count: function() {
        try {
            var shu, yijiao = $.cookie('yijiao'),
                twelve_num;
            if (typeof cityInfo != 'undefined') {
                shu = cityInfo.free_count;
            }
            if (yijiao) {
                shu = shu - 1;
            }
            twelve_num = 1200 - shu;
            $(".paper-img-wrap .num").html(twelve_num);
            $(".home-head-order .tips .color").html(shu);
            $(".form-btn .red").html(973 - shu);
            $(".places").html(shu);
            $(".sp_form .oncolor").html(shu);
            $(".js-pc-surplus").html(shu);
            $(".os-tip .color").html(shu);
            $("#company_list_num").html(2631 - shu);
        } catch (e) {}
    },
    showInfo: function() {
        var that = this,
            cur_url,
            arr;
        if (that.city_url != undefined) {
            arr = that.city_url.split(".");
            arr[0] = that.city_val;
            cur_url = arr.join(".");
        };
        $(".cur-city-flag").html(that.city_txt).attr("href", "http://" + cur_url + "");
        $("#nav_cur_city").html(that.city_txt);
        $(".notepad").attr("href", "http://" + that.city_val + ".tobosu.com/foreground/");
        $(".header-middle .logo-a").attr("href", "http://" + cur_url + "/");
        $(".header-content .logo").attr("href", "http://" + cur_url + "/");
        $(".nav-l li a").each(function() {
            var $that = $(this),
                that_val = $that.html();
            switch (that_val) {
                case "首页":
                    link = "http://" + cur_url + "/";
                    $that.attr("href", link);
                    break;
                case "新小区<i class=\"free new\">NEW</i>":
                    link = "http://" + cur_url + "/xiaoqu/";
                    $that.attr("href", link);
                    break;
                case "找装修公司":
                    link = "http://" + cur_url + "/zx/";
                    $that.attr("href", link);
                    break;
                default:
                    break;
            }
        });
        $(".page-menu li a").each(function() {
            var $that = $(this),
                that_val = $that.html();
            switch (that_val) {
                case "首页":
                    link = "http://" + cur_url + "/";
                    $that.attr("href", link);
                    break;
                case "找装修公司":
                    link = "http://" + cur_url + "/zx/";
                    $that.attr("href", link);
                    break;
                default:
                    break;
            }
        });
        //头部搜索
        $('.header-middle').find('#dosearch').click(function() {
            var keyVal = $(this).parents('.search-wrap').find('.search-input').find('input').val();
            if (keyVal) {
                var keyType = $(this).parents('.search-wrap').find('#showPic').attr('data-value');
                doSearch(keyType, keyVal);
            }
        });
        //头部输入框回车触发搜索
        $('.header-middle').find('.search-wrap').find('.search-input').keydown(function(e) {
            if (e.keyCode == 13) {
                var keyVal = $(this).find('input').val();
                var keyType = $('.header-middle').find('.search-wrap').find('#showPic').attr('data-value');
                if (keyVal != '') {
                    doSearch(keyType, keyVal);
                }
            }
        });
        //执行搜索跳转函数
        var doSearch = function(keyType, keyVal) {
            if (keyType == 1) {
                //搜索效果图
                window.location.href = 'http://' + that.www_url + '/pic/search.html?key=' + keyVal;
            }
            if (keyType == 2) {
                //搜索装修公司
                window.location.href = 'http://' + cur_url + '/zx/search.html?kw=' + keyVal;
            }
            if (keyType == 3) {
                //搜索楼盘案例
                window.location.href = 'http://' + that.city_val + '.tobosu.com/search/1_' + keyVal;
            }
            if (keyType == 4) {
                //搜索装修问答
                if (keyVal == '3万业主和装修公司帮你解决问题') {
                    keyVal = '';
                }
                window.location.href = 'http://' + that.www_url + '/ask/search.html?q=' + keyVal;
            }
            if (keyType == 5) {
                //搜索装修知识
                if (keyVal == '3万业主和装修公司帮你解决问题') {
                    keyVal = '';
                }
                window.location.href = 'http://' + that.www_url + '/article/sreach.html?kw=' + keyVal;
            }
        }
    }
};
var SendCode = {
    eles: {},
    timeIds: {},
    counts: {},
    add: function(ele) {
        if (this.eles == null) {
            this.eles = ele;
            this.counts = 60; // 默认60秒
            this.timeIds = null; // 初始化 id
        } else {
            if (this.counts > 0) return;
            this.counts = 90; // 默认60秒
            this.timeIds = null; // 初始化 id
        }
        $("#jsSendCode").attr("disabled", "true").css("background-color", "gray");
        this.timeStart();
    },
    timeStart: function() {
        var me = this;
        me.timeRun();
        me.timeIds = setInterval(function() {
            me.timeRun();
        }, 1000);
    },
    timeRun: function() {
        var me = this;
        var time = me.counts;
        time--;
        me.counts = time;
        if (time <= 0) {
            me.timeIds = window.clearInterval(me.timeIds);
            // 恢复
            $("#jsSendCode").removeAttr("disabled").css("background", "#f4f4f4").css("border", "1px solid #ccc;").css("color", "#808080");
            $(".login-phone-item #jsSendCode").html("发送动态密码");
            //个人中心的
            $(".get-message-btn").val('获取短信').css("background-color", "#ff9c00").css("color", "#fff");
            $(".pop-update-tel #jsSendCode").val('发送验证码').css("background-color", "#71cfc5").css("color", "#fff");
            $(".design-team-code").hide();
            $(".verif-code-btn").show();
            $(".ident-code-tit").html("获取验证码").css("cursor", "pointer");
            $(".get-ident-code").addClass("ident-code-js");
            $("#txt_mathcode").val('');
            $(".qm-con-items .tip").html('<input class="get-code verif-code-btn" type="button" value="获取">'); //注册新设计师
            $(".login-phone-item .code-wrap").addClass("pr");
            return;
        }
        $("#jsSendCode").css('color', 'white');
        $("#jsSendCode").val(time);
        $(".ident-code-tit").css("cursor", "default").html("已发送(" + time + ")");
        $(".qm-con-items .tip").html("已发送(" + time + ")").show(); //注册新设计师
        $(".get-ident-code").removeClass("ident-code-js");
        $(".dongtai").attr('disabled', 'disabled');
    }
}
$(function() {
    Common.init();
    Orders.init();
    //qq弹窗
    $('.contact-tobosu-qq').click(function() {
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
    //省钱装修
    var suib = Math.round(Math.random() * 10) % 4 + 1;
    var first_val = Common.getCookie('first');
    var award = location.href.indexOf('award');
    if (first_val != "1" && award < 0) {
        setTimeout(function() {
            $(".red-paper-bg").show();
            $('.first_layer').show();
            $('.first_colse,.red-paper-bg').click(function() {
                Common.setCookie('first', '1', 1);
                $(".red-paper-bg").hide();
                $('.first_layer').hide();
            });
            $('.jiegou li').click(function() {
                $('.jiegou li').removeClass('on');
                $(this).addClass('on');
            });
        }, 5000);
        $('.renwenma_img .on').prepend('<img src="http://aliyun.tbscache.com/res/impression/images/weixin_' + suib + '.jpg" width="140" height="140">');
    }
});
//双11活动广告
$(document).ready(function() {
    var www_urlb = $('.comm-url').attr('data-wwwurl');
    var top = '<div class="top_ad"><a href="http://' + www_urlb + '/zhuti/newyear" target="_blank"></a></div>';
    var banner = '<div class="top_banner"><a href="http://' + www_urlb + '/zhuti/newyear"  target="_blank"></a></div>';
    var home_main = $('#index_sou').attr('bar');
    var ad11 = getCookie('ad11');
    var url = window.location.href;
    if (url.indexOf('newyear') > 0) {
        return;
    } else if (home_main == 'yes' && ad11 != "hide") {
        $('#shuang11').prepend(banner);
        $('#shuang11').prepend(top);
        $('.top_ad').slideDown();
        setTimeout(function() {
            $('.top_banner').slideUp(600, function() {
                $(".top_ad").slideDown();
                setCookie('ad11', 'hide', 30);
            });
        }, 5000);
    } else {
        $('#shuang11').prepend(top);
        $(".top_ad").slideDown();
    }
});

function getCookie(name) {
    //切割成数组
    var arr = document.cookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
        //再次切割成数组
        var shu = arr[i].indexOf('=');
        var arrb1 = arr[i].substring(0, shu);
        var arrb2 = arr[i].substring(shu + 1);
        if (arrb1 == name) {
            return unescape(arrb2);
        }
    }
    return; //没有找到为空
}
//设置cookie，（名称，值，过期时间分钟为单位）
function setCookie(name, value, iDay) {
    var oDate = new Date();
    //设置时间
    oDate.setMinutes(oDate.getMinutes() + iDay);
    document.cookie = name + '=' + escape(value) + ';expires=' + oDate;
}
//删除除cookie
function removeCookie(name) {
    setCookie(name, 1, -1);
}
(function($) {
    var popupName = 'dialog',
        tplBtn = '<button class="popup-btn" type="button"></button>',
        tpl_dialog = '<div class="popup-wrap">' +
        '<div class="popup-top">' +
        '<span>提示</span>' +
        '<a class="popup-close-btn"></a>' +
        '</div>' +
        '<div class="popup-tips">' + '</div>' +
        '<div class="popup-btns">' + '</div>' +
        '</div>',
        default_options = {
            title: false,
            buttons: {},
            closeBtn: true,
            closeOnEsc: true,
            zIndex: 99999999,
            modal: true,
            shown: true,
            removeOnHide: true
        };

    function createCallbackHandler(callback, popupWrap) {
        return function(event) {
            if (!callback || callback.call(popupWrap, event, this) !== false) {
                popupWrap[popupName]('hide');
            }
        };
    }

    function makeButtons(buttons, tplBtn, popupBtns, popupWrap) {
        var title, btn, k = 0;
        if (buttons !== undefined) {
            popupBtns.empty();
        }
        if (buttons && $.isPlainObject(buttons)) {
            for (title in buttons) {
                if (buttons.hasOwnProperty(title)) {
                    if (buttons[title] instanceof $) {
                        btn = buttons[title];
                    } else {
                        btn = $(tplBtn).html(title);
                        if (!k) {
                            btn.addClass('popup-ok-btn');
                        }
                        btn.click(createCallbackHandler($.isFunction(buttons[title]) ? buttons[title] : ((buttons[title].click && $.isFunction(buttons[title].click)) ? buttons[title].click : false), popupWrap));
                        if ($.isPlainObject(buttons[title])) {
                            if (buttons[title].className) {
                                btn.addClass(buttons[title].className);
                            }
                            if (buttons[title].primary) {
                                popupBtns.find('button').removeClass('popup-ok-btn');
                                btn.addClass('popup-ok-btn');
                            }
                            if (buttons[title].title) {
                                btn = btn.html(title);
                            }
                        }
                    }
                    popupBtns.append(btn);
                    k += 1;
                }
            }
        }
    }

    function makeTitle(text, title, popupWrap, options) {
        if (!text && text !== '') {
            //title.hide();
            popupWrap.find('div.popup-wrap>.popup-close-btn').show();
        } else {
            popupWrap.find('div.popup-wrap>.popup-close-btn').hide();
            title.show().find('span').html(text);
        }
        if (!options.closeBtn) {
            popupWrap.find('.popup-close-btn').hide();
        }
    }
    $.fn[popupName] = function(_options, second, third) {
        var that = this,
            popupWrap = that,
            options = $.extend(true, {}, default_options, $.isPlainObject(_options) ? _options : {}),
            dialog = popupWrap.find('.popup-wrap'),
            popupBtns = popupWrap.find('.popup-btns'),
            event;
        if (popupWrap.hasClass('popup-overlay') && popupWrap.data('options')) {
            options = popupWrap.data('options');
            if ($.type(_options) === 'string' && _options.length) {
                if (options['onBefore' + _options] && $.isFunction(options['onBefore' + _options])) {
                    options['onBefore' + _options].call(that, options, _options);
                }
                switch (_options.toLowerCase()) {
                    case 'ok':
                        if (popupWrap.is(':visible')) {
                            if (second !== 'enter' || options.clickDefaultButtonOnEnter) {
                                popupBtns.find('.popup-ok-btn').trigger('click');
                            }
                            if (second === 'enter' && options.clickDefaultButtonOnEnter && third) {
                                third.stopPropagation();
                                third.preventDefault();
                            }
                        }
                        break;
                    case 'hide':
                        if (popupWrap.is(':visible')) {
                            if (second !== 'esc' || options.closeOnEsc) {
                                $(".popup-overlay").hide();
                                popupWrap.remove();
                            }
                        }
                        break;
                    case 'show':
                        if (!popupWrap.is(':visible')) {
                            $(".popup-overlay").show();
                        }
                        break;
                    case 'title':
                        makeTitle(second, popupWrap.find('.popup-top'), popupWrap, options);
                        break;
                    case 'content':
                        popupWrap.find('.popup-tips').html(second);
                        break;
                }
                if (_options.toLowerCase() !== 'hide' && _options.toLowerCase() !== 'show') {
                    if (options['onAfter' + _options] && $.isFunction(options['onAfter' + _options])) {
                        options['onAfter' + _options].call(that, options, _options);
                    }
                }
            } else {
                makeTitle(options.title, popupWrap.find('.popup-top'), popupWrap, options);
                makeButtons(options.buttons, tplBtn, popupWrap.find('.popup-btns'), popupWrap);
            }
            return popupWrap;
        }
        if ($.type(_options) === 'string') {
            return this;
        }
        popupWrap = $('<div class="popup-overlay popup-modal"></div>');
        popupWrap.css('zIndex', options.zIndex);
        popupWrap.data('options', options);
        dialog = $(tpl_dialog);
        popupBtns = dialog.find('.popup-btns');
        popupWrap.append(dialog);
        popupWrap.dialog('content', that.length ? that[0] : '<div>' + that.selector + '</div>');
        dialog.find('.popup-close-btn').click(function() {
            popupWrap[popupName]('hide');
            $(".popup-overlay").remove();
        });
        makeTitle(options.title, dialog.find('.popup-top'), popupWrap, options);
        makeButtons(options.buttons, tplBtn, popupBtns, popupWrap);
        $('body').append(popupWrap);
        if (options.shown) {
            popupWrap.dialog('show');
        }
        return popupWrap;
    };
    $.fn[popupName].default_options = default_options;
    window.alert = function(msg, callback, title) {
        return $('<div>' + msg + '</div>')[popupName]({
            title: title,
            buttons: {
                '确定': function() {
                    if (callback && $.isFunction(callback)) {
                        return callback.call(this);
                    }
                    this.dialog('hide');
                }
            }
        });
    };
    window.confirm = function(msg, callback, title) {
        if ($('.js-yzss').length > 0) {
            return $('<div>' + msg + '</div>')[popupName]({
                title: title,
                buttons: {
                    '去创建': callback || function() {
                        window.location = '/user/companycase/add_index'
                    },
                    '取消': true
                }
            });
        } else {
            return $('<div>' + msg + '</div>')[popupName]({
                title: title,
                buttons: {
                    '确定': callback || function() {},
                    '取消': true
                }
            });
        }
    };
}(jQuery));
/////////////GrowingIO////////////////////////////
var _vds = _vds || [];
window._vds = _vds;
(function() {
    Quotation.init();
    _vds.push(['setAccountId', '9e24e0e584b6271b']);
    (function() {
        var vds = document.createElement('script');
        vds.type = 'text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
    })();
    //双11
    //小挂件订单滚动效果
    setInterval(function() {
        $("#s11_gua_ul li:first").slideUp(500, function() {
            $(this).remove();
        }).clone().appendTo("#s11_gua_ul").height(39);
    }, 3000);
    if (window.location == "http://www.tobosu.com/activity/double_eleven" || window.location == "http://www.dev.tobosu.com/activity/double_eleven") {
        $(".look-orders-tips").text("您的装修申请已经提交，客服将在24小时之内与您联系");
        $(".look-orders-succes").text("关注土拨鼠微信公众号：确认量房后，发送收货地址+量房的装修公司名称到公众号。超值豪华大礼即刻到家。");
        $(".look-orders-succes").css({ "width": "85%", "margin": "0 auto" });
        $(".look-orders-tips").css("font-size", "16px");
    }
})();

//提交
$(".home p").click(function() {
    var num = parseInt($(this).index());
    switch (num) {
        case 0:
            {
                $(".inp-num").val(num);
                break;
            }
        case 1:
            {
                $(".inp-num").val(num);
                break;
            }
        case 2:
            {
                $(".inp-num").val(1);
                break;
            }
    }
    $(this).addClass("home-active").siblings().removeClass("home-active")
});
$(".money p").click(function() {
    var num = parseInt($(this).index());
    switch (num) {
        case 0:
            {
                $(".money-num").val(num + 1);
                break;
            }
        case 1:
            {
                $(".money-num").val(num + 1);
                break;
            }
        case 2:
            {
                $(".money-num").val(num + 1);
                break;
            }
        case 3:
            {
                $(".money-num").val(num + 1);
                break;
            }
    }
    $(this).addClass("home-active").siblings().removeClass("home-active");
});
//去掉遮罩层
$(".price-Close,.mask").click(function() {
    $(".mask").addClass("hide");
    $(".price-pop").addClass("hide");
})
var url_host = window.location.host;
$(".tijiao").click(function() {
    var house_name = $(".sele-name").val();
    var start_time = $(".money-num").val();
    var is_old = $(".inp-num").val();
    var info_url = "http://" + url_host + "/tapi/order/improve_info";
    if ($(".home p").hasClass("home-active") || $(".money p").hasClass("home-active") || !$(".sele-name").val() == "") {
        $.ajax({
            url: info_url,
            type: 'POST',
            data: { "order_id": order_id, "house_name": house_name, "start_time": start_time, "is_old": is_old },
            dataType: "json",
            success: function(data) {
                if (data.status == 200) {
                    $(".mask").removeClass("hide");
                    $(".price-pop").removeClass("hide");
                } else {
                    console.log(data.msg);
                }
            }
        });
    } else {
        return false;
    }
});

//SEO截取判断
$(function() {
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        var strValue = "";
        if (r != null) {
            strValue = unescape(r[2]);
        }
        return strValue;
    }
    //URL参数传参
    var port_code = parseInt($("input[name='source']").val());
    var seoUrl = window.location.href;
    var url_host = window.location.host;
    var record_url = "http://" + url_host + "/tapi/orderPageViewRecord/record";
    if (getUrlParam('channel') || getUrlParam('subchannel') || getUrlParam('chcode')) {
        $.ajax({
            url: record_url,
            type: 'POST',
            data: { "url": seoUrl, "port_code": port_code },
            dataType: "json",
            success: function(data) {
                if (data.status == 200) {
                    console.log(data.msg)
                } else {
                    console.log(data.msg);
                }
            }
        });
    }

    //修改页面source的值
    var source = getUrlParam('tbs_source');
    if (source != undefined && source != '' && source != null) {
        $("input[name='source']").val(source);
    }
});