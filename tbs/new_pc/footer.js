(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.TBSfooter = {
        init: function() {
            this._event();
        },
        _event: function() {
            $("footer .link .tab a").click(function() {
                tabSwitch(this, "footer .link .content>div");
            });

            //联系客服
            $("footer a.contact-qq").click(function() {
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
            })

            function tabSwitch(selt, target) {
                var val = $(selt).attr("data-value");
                $(selt).addClass("active").siblings("a").removeClass("active");
                $(target + "[data-value=" + val + "]").css("display", "block").siblings(target).css("display", "none");
            }
            return this;
        }
    }
    TBSfooter.init();
});