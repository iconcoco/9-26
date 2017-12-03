  $(document).ready(function() {
      //去除页面中多余的文件
      function removeMore() {
          var name = arguments[0],
              tag = document.querySelectorAll(name),
              condition = arguments[1] ? arguments[1] : [], //筛选条件的数组
              type = null;

          //类型
          switch (name) {
              case "script":
                  {
                      type = "src";
                  }
                  break;
              case "link":
                  {
                      type = "href";
                  }
                  break;
          }
          //循环
          for (var j = 0; j < tag.length; j++) {
              var ele = tag[j],
                  source = ele.getAttribute(type);

              function judge() {
                  for (var i = 0; i < condition.length; i++) {
                      source ? source : source = "";
                      if (source.indexOf(condition[i]) != -1) {
                          return false;
                      }
                  };
                  return true;
              };
              //移除节点
              if (!judge()) {
                  $(ele).remove();
              }
          }
      }

      removeMore("script", ["try.js"]);
      removeMore("link", ["base_li.css", "base.css"]);
  });