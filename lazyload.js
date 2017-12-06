(function() { //立即执行函数
    let imgList = [],
        delay, time = 250,
        offset = 0;

    function _delay() { //函数节流
        clearTimeout(delay);
        delay = setTimeout(() => {
            _loadImg();
        }, time)
    };

    function _loadImg() { //执行图片加载
        for (let i = 0, len = imgList.length; i < len; i++) {
            if (_isShow(imgList[i])) {
                setTimeout(function() {
                    imgList[i].src = imgList[i].getAttribute('data-src');
                    // console.log(44);
                    // $(imgList[i]).fadeIn(1000);
                    imgList.splice(i, 1); //将已经加载出来的图片从列表中删除
                }, 500);
            }
        }
    };

    function _isShow(el) { //判断img是否出现在可视窗口
        let coords = el.getBoundingClientRect();
        // console.log(coords);
        return (coords.left >= 0 && coords.left >= 0 && coords.top) <= (document.documentElement.clientHeight || window.innerHeight) + parseInt(offset);
    };

    function imgLoad(selector) { //获取所有需要实现懒加载图片对象引用并设置window监听事件scroll
        _selector = selector || '.imgLazyLoad';
        let nodes = document.querySelectorAll(selector);
        imgList = Array.apply(null, nodes);
        window.addEventListener('scroll', _delay, false)
    };
    imgLoad('.imgLazyLoad')
})()