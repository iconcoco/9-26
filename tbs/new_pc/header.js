/**
 * TBS pc站改版 头部js  2017-11-23  lichengxiang 
 */

(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.TBSheader = {
        init: function() {
            this.onload()
                ._event()
                .scroll();
        },
        onload: function() {
            //页面一加载需要进行的事件
            this.cur_url = $("header").attr("data-cityurl");
            this.www_url = $("header").attr("data-wwwurl");

            var that = this;
            //请登录的href
            var uherf = window.location.href;
            if (uherf.indexOf('register') > 0 || uherf.indexOf('login') > 0) {
                $("#login").attr('href', 'http://' + that.www_url + '/passport/login.html');
                $("#login").attr('href', 'http://' + that.www_url + '/passport/login.html');
            } else {
                $("#login").attr('href', 'http://' + that.www_url + '/passport/login.html?r=' + encodeURIComponent(uherf));
                $("#login").click(function() {
                    window.location.href = 'http://' + that.www_url + '/passport/login.html?r=' + encodeURIComponent(uherf);
                })
            }

            //用户登陆的时候显示的是个人中心和消息中心
            try {
                // var userInfo = {
                //     account_type: 2,
                //     call_name: "shishishis",
                //     city_code: "www",
                //     city_id: "61",
                //     city_name: "深圳",
                //     full_name: "生神色我呵呵",
                //     id: "4545",
                //     notice: {
                //         ask_count: 2,
                //         comment_count: "0",
                //         system_count: 4
                //     },
                //     uid: 641616451,
                //     username: "神经病"
                // }


                if (userInfo != null && typeof userInfo != "undefined") {
                    var type = userInfo.account_type, //登陆身份
                        logo = userInfo.logo, //
                        name = userInfo.username, //用户名
                        fullName = userInfo.full_name, //全部名字
                        askmsg = userInfo.notice.ask_count, //问答提醒
                        msg = userInfo.notice.comment_count, //系统消息
                        sysmsg = userInfo.notice.system_count; //留言评论
                    if (fullName == '') { //简化注册后，设计师这项为空
                        fullName = name;
                    }


                    //如果用户登陆
                    var type = userInfo.account_type;
                    if (type == 1) {
                        $("input[name='userid']").val(userInfo.uid);
                    }


                    try {
                        if (name.length > 4) {
                            name = name.substring(0, 3) + '…';
                        }
                    } catch (e) {
                        name = '(未填写)';
                    }
                    if (askmsg != 0 || msg != 0 || sysmsg != 0) {
                        $(".personal-news i").addClass("msg-icon");
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
                        $('#ask').parent('p').hide();
                        $('#orders').parent('p').hide();
                        $('#askRemind').parent().remove();
                    }
                    //设计师 2	
                    if (type == 2) {
                        $("header .personal-news").hide(); //消息
                        $('.has-login-user-name').attr('href', 'http://' + that.www_url + '/user/designerindex/index/'); //名字超链接
                        $('#personCenter').attr('href', 'http://' + that.www_url + '/user/designerindex/index/'); //个人中心地址
                        $('#ask').attr('href', 'http://' + that.www_url + '/user/publicask/my_answer'); //装修问答
                        $('#orders').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer/orderpiclist'); //装修订单
                        $('#askRemind').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer_faq/myInvite'); //问答提醒
                        $('#msgCommet').parent('p').css({
                            display: 'none'
                        }); //设计师登录不显示留言评论
                        $('#systemmsg').attr('href', 'http://member.tobosu.com/designeradmin/ca_designer/bulletin/'); //系统消息
                        $('#ask').parent('p').hide(); //装修问答
                        $('#orders').parent('p').hide(); //装修问答
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
                    $(".login .already").show();
                    $(".login .pleace-login").hide();
                    $('.login .user-name').html(name);
                    $('#askRemind span').html(askmsg);
                    $('#msgCommet span').html(sysmsg)
                    $('#systemmsg span').html(msg); //系统消息		            
                }
            } catch (e) {}




            return this;
        },
        _event: function() {
            var that = this;
            //搜索框下拉的选择搜索
            $(".search>div").hover(function() {
                $(this).addClass("active");
            }, function() {
                $(this).removeClass("active");
            })
            $("#search").click(function() {
                var keyType = +$(".search .key").attr("data-value"),
                    keyVal = $("#search_ipt").val();
                doSearch(keyType, keyVal);
            });
            $(".search .down-select li").click(function() {
                var key = $(".search .key"),
                    html = $(this).children("a").html(),
                    val = $(this).children("a").attr("data-value");
                key.attr("data-value", val), key.children(".txt").html(html);

                $(".search>div").removeClass("active");
            })
            var doSearch = function(keyType, keyVal) {
                //cur_url(城市站的url)  www_url(全国站的url)
                switch (keyType) {
                    case 1:
                        { //搜索效果图
                            window.location.href = 'http://' + that.www_url + '/pic/search.html?key=' + keyVal;
                        }
                        break;
                    case 2:
                        { //搜索装修公司
                            window.location.href = 'http://' + that.cur_url + '/zx/search.html?kw=' + keyVal;
                        }
                        break;
                    case 3:
                        { //搜索楼盘案例
                            window.location.href = 'http://' + that.city_val + '.tobosu.com/search/1_' + keyVal;
                        }
                        break;
                    case 4:
                        { //搜索装修问答
                            window.location.href = 'http://wenda.tobosu.com/search?k=' + keyVal;
                        }
                        break;
                    case 5:
                        { //搜索装修知识
                            window.location.href = 'http://' + that.www_url + '/article/sreach.html?kw=' + keyVal;
                        }
                        break;
                }

            }

            //头部鼠标移入显示二级菜单
            $("nav li a").on("mouseenter", function() {
                var type = +$(this).attr("data-type");
                $(this).addClass("hover").parent("li").siblings("li").children("a").removeClass("hover");

                if (type) {
                    $(".menu .nav-list").addClass("active");

                    $(".menu .nav-show ul[data-type=" + type + "]").css("display", "block").siblings("ul").css("display", "none");
                } else {
                    $(".menu .nav-list").removeClass("active");
                }
            });
            $(".nav-list").on("mouseleave", function() {
                $("nav li a").removeClass("hover");

                $(this).removeClass("active");
            });

            //联系客服
            $(".login li a.contact-tobosu-qq").click(function() {
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

            //退出登陆
            $("#logout").click(function() {
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
            return this;
        },
        scroll: function() {
            // 页面滚动顶部的登陆注册要收起来
            $(document).scroll(function() {
                var value = $(this).scrollTop();
                if (value) { //菜单固定
                    $('header').css("display", 'none');
                    $('.menu').addClass("active");
                } else {
                    //当页面滚去的距离为零的时候要出现
                    $('header').css("display", 'block');
                    $('.menu').removeClass("active");
                }
            });

            return this;
        }
    }
    win.TBSheader.init();
});