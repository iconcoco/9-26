(function(global, factory) {
    factory(global);
})(this, function(win) {
    win.TBSorder = {
        init: function() {
            this._event()
                .showPrice();
        },
        _event: function() {
            var that = this;
            //表单提交按钮的事件
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
        testProvice: function(num) {
            num = +num
            if (!num) {
                return {
                    code: false,
                    msg: "请选择省份"
                };
            };
            return {
                code: true,
                msg: null
            };
        },
        testCity: function(num) {
            num = +num
            if (!num) {
                return {
                    code: false,
                    msg: "请选择城市"
                };
            };
            return {
                code: true,
                msg: null
            };
        },
        testTel: function(tel) {
            //检测中文
            var z = /[\u4e00-\u9fa5]/;
            if (z.test(tel)) {
                return {
                    code: false,
                    msg: "电话号码不能为中文"
                }
            }
            //验证不能为空
            if (tel == "") {
                return {
                    code: false,
                    msg: "请输入您的手机号码"
                };
            }
            //检查手机号码是否正确
            var reg = /^1[3-9][0-9]{9}$/;
            if (!reg.test(tel)) {
                return {
                    code: false,
                    msg: "请输入正确的手机号码"
                };
            }

            return {
                code: true,
                msg: null
            };
        },
        testArea: function(area) {
            var z = /[\u4e00-\u9fa5]/;
            if (z.test(area)) {
                return {
                    code: false,
                    msg: "面积不能为中文"
                }
            };
            var r = /^-?[1-9]\d*$/; //有空格
            if (!r.test(area)) {
                return {
                    code: false,
                    msg: "请输入正确的房屋面积"
                }
            }
            //不能为空

            if (area == "") {
                return {
                    code: false,
                    msg: "房屋面积不能为空"
                };
            }
            if (area < 1 || area > 9999) {
                return {
                    code: false,
                    msg: "面积只能是1-9999之间的数字"
                }
            }
            return {
                code: true,
                msg: null
            };
        },
        testName: function(username) {
            var name = $.trim(username);
            //验证空
            if (!name) {
                return {
                    code: false,
                    msg: "称呼不能为空"
                };
            }
            //验证称呼不能为字母
            var reg = /[0-9a-zA-z]/g;
            if (reg.test(name)) {
                return {
                    code: false,
                    msg: "称呼不能为数字或字母"
                };
            }
            return {
                code: true,
                msg: null
            };
        },
        submit: function(params) {
            //params {data ,success }

            // console.log(params.data);
            $.post("/tapi/order/pub_order", params.data, function(res) {
                params.success(res);
            });
        },
        clacPrice: function(params) {
            //{grade, type, mode, area}
            // grade 等級  type 半包 全包   mode 装修方式 精装还是普通装修
            var obj = {
                grade: 0,
                type: 0,
                mode: null,
                area: 0
            }

            $.extend(obj, params);

            var money = null;
            if (obj.type == 2) {
                //自定义下拉选择城市等级
                switch (obj.grade) {
                    case 2:
                        { money = 860; }
                        break;
                    case 3:
                        { money = 980; }
                        break;
                    case 4:
                        { money = 1050; }
                        break;
                    default:
                        money = 750;
                        break;
                };
            } else {
                //半包
                switch (obj.grade) {
                    case 2:
                        { money = 440; }
                        break;
                    case 3:
                        { money = 480; }
                        break;
                    case 4:
                        { money = 550; }
                        break;
                    default:
                        money = 380;
                        break;
                };
            }

            var total = money * obj.area;

            switch (obj.mode) {
                case 1:
                    {
                        total *= 0.78
                    }
                    break;
                case 3:
                    {
                        total *= 1.58
                    }
                    break;
            }

            return {
                total: total,
                material: Math.round(total * 2 / 5),
                manMake: Math.round(total * 3 / 5),
                design: obj.area * 100,
                quality: 3500
            }

        },
        showPrice: function() {
            /**
             * 随机生成的价钱
             */
            this.timer = setInterval(function() {
                // 材料费
                var meterial = Math.floor(Math.random() * 50000 + 2000),
                    manMake = Math.floor(Math.random() * 40000 + 2000),
                    design = Math.floor(Math.random() * 2000 + 2000),
                    quality = Math.floor(Math.random() * 3500 + 1000),
                    tatle = meterial + manMake + design + quality;
                $(".budget-result #meterial").html(meterial);
                $(".budget-result #man_make").html(manMake);
                $(".budget-result #design").html(design);
                $(".budget-result #quality").html(quality);
                $(".budget-result #tatle").html(tatle);;

            }, 200);

            return this;
        }
    }
    TBSorder.init();
})