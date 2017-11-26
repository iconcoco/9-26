(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.TBSorder = {
        init: function() {
            this._event();
        },
        _event: function() {
            var that = this;
            //表单提交按钮的事件
            $("form .order-submit").click(function() {
                //1.验证省市

                //2.验证面积

                //3.验证手机号

                //4.验证房屋户型

                //5.提交表单
            });

            //选择城市
            $("form select.province").on("change", function() {
                var $city = $(this).parents("form").find("select.city");
                that.getCity($(this), $city);
            });
            return this;
        },
        /**
         * 参数 ele 省份select元素
                 target 城市的select元素
         */
        getCity: function(ele, target) {
            var id = ele.val(), //省份的id
                _arr = []; //用来装城市的数组
            var districtList = positionDataCity[id]; //获取城市的数组对象

            target.html("");

            $(districtList).each(function(i, v) {
                var optionLi = '<option value=' + v.id + ' data-citygrade = ' + v.city_grade + '>' + v.name + '</option>';
                _arr.push(optionLi);
            });
            target.append('<option value="0">选择城市</option>');
            target.append(_arr);
        },
        textTel: function(tel) {
            //验证不能为空
            if (!tel) { alter("手机号码不能为空!"); return false; }
            //检查手机号码是否正确
            var reg = /^1[3-9][0-9]{9}$/;
            if (!reg.test(tel)) { alert("手机号码错误"); return false; }

            return true;
        },
        textArea: function(area) {
            //不能为空
            if (!area) { alert("房屋面积不能为空"); return false; }
            return true;
        },
        checkName: function(username) {
            var name = $.trim(username);
            //验证空
            if (!name) { alter("称呼不能为空!"); return false; }
            //验证称呼不能为字母
            var reg = /[0-9a-zA-z]/g;
            if (reg.test(name)) { alter("称呼不能为数字或字母!"); return false; }
            return true;
        },
        clacPrice: function() {
            // 

        },
        showPrice: function() {
            /**
             * 随机生成的价钱
             */
            setInterval(function() {
                // 材料费
                var total = Math.floor(Math.random() * 110000 + 2000);


            }, 200);
        }
    }
    TBSorder.init();
})