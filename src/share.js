define(function(require, exports, module) {

  'use strict';

  var Widget = require('widget');

  // require('http://ue8.17173.itc.cn/cache/my.app-01/share-news-1.1.0.js');

  var Share = Widget.extend({

    defaults: {
      container: null,
      content: '<div class="bdsharebuttonbox"><a href="#" class="bds_more" data-cmd="more"></a><a href="#" class="bds_tsohu" data-cmd="tsohu" title="分享到搜狐微博"></a><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_kaixin001" data-cmd="kaixin001" title="分享到开心网"></a><a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网"></a><a href="#" class="bds_t163" data-cmd="t163" title="分享到网易微博"></a><a href="#" class="bds_mshare" data-cmd="mshare" title="分享到一键分享"></a></div>'
    },

    setup: function() {
      this.render();

      window._bd_share_config = {
        'common': {
          'bdSnsKey': {},
          'bdText': '',
          'bdMini': '2',
          'bdMiniList': false,
          'bdPic': '',
          'bdStyle': '1',
          'bdSize': '16'
        },
        'share': {}
      };
      (document.getElementsByTagName('head')[0] || document.body)
        .appendChild(document.createElement('script')).src =
          'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
    }

  });

  module.exports = Share;

});
