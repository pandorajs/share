define(function(require, exports, module) {

    /**
     * 分享字典
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        Overlay = require('overlay'),
        weixinTemplate = require('./weixin.handlebars');

    var weixinOverlay;

    module.exports = {

        //新浪微博
        'tsina': {
            iconText: 's',
            appkey: '2765446859',
            label: '新浪微博',
            //imgSplit : '||', //配置多张图片的分割字符
            /**
             * 点击后分享的回调方法或字符串，字符串使用占位符:如 http://www.xxx.com?url={{url}}&title={{title}}
             */
            target: 'http://service.t.sina.com.cn/share/share.php?appkey={{appkey}}&title={{title}}&url={{url}}&pic={{img}}'
        },

        //搜狐微博
        'tsohu': {
            iconText: 'h',
            label: '搜狐微博',
            target: 'http://t.sohu.com/third/post.jsp?url={{url}}&title={{title}}&content=utf8'
        },

        //QQ空间
        'qzone': {
            iconText: 'z',
            label: 'QQ空间',
            height: 500,
            width: 700,
            target: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{url}}&site={{source}}&title={{title}}&summary={{summary}}&desc={{desc}}&pics={{img}}'
        },

        //腾讯微博
        'tqq': {
            iconText: 't',
            label: '腾讯微博',
            appkey: 'ad502caa0e0f4110943a32734e79a594',
            target: 'http://v.t.qq.com/share/share.php?url={{url}}&appkey={{appkey}}&pic={{img}}&site={{source}}&title={{title}}'
        },

        //分享到QQ好友
        'qq' : {
          iconText : 'q',
          label: 'QQ好友',
          target : 'http://connect.qq.com/widget/shareqq/index.html?url={{url}}&title={{title}}&desc={{desc}}&summary={{summary}}&pics={{img}}&site={{source}}'
        },

        //人人网
        'renren': {
            iconText: 'r',
            label: '人人网',
            target: 'http://widget.renren.com/dialog/share?resourceUrl={{url}}&srcUrl={{source}}&title={{title}}&description={{summary}}&images={{img}}'
        },

        //网易
        't163': {
            iconText: 'w',
            label: '网易微博',
            imgSplit : ',',
            target: 'http://t.163.com/article/user/checkLogin.do?sourceUrl={{sourceUrl}}&source={{source}}&info={{title}}  {{url}}&link={{url}}&images={{img}}&togImg=true'
        },

        //开心网
        'kaixin': {
            iconText: 'k',
            label: '开心网',
            imgSplit : ',',
            target: 'http://www.kaixin001.com/rest/records.php?&content={{summary}}&title={{title}}&url={{url}}&pic={{img}}&style=11'
        },

        //微信
        'weixin': {
            iconText: 'x',
            label: '微信',
            target: function(shareInfo, options, currentDom) {
                if (!weixinOverlay) {
                    weixinOverlay = new Overlay({
                        template: weixinTemplate,
                        autoShow: false,
                        css: {
                            position: (!!window.ActiveXObject && !window.XMLHttpRequest) ? 'absolute' : 'fixed'
                        },
                        offset: {
                            y: 70
                        },
                        selfXY: {
                            x: 0.5
                        },
                        baseXY: {
                            x: 0.5
                        },
                        delegates: {
                            'click [data-role=close]': function() {
                                weixinOverlay.hide();
                            }
                        }
                    });
                }
                weixinOverlay.role('qrcode').attr('src', 'http://s.jiathis.com/qrcode.php?url=' + shareInfo.url);
                weixinOverlay.show();
                return false;
            }
        }
    };
});
