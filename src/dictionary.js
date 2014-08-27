define(function(require, exports, module) {

    /**
     * 分享字典
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        Overlay = require('overlay');

    var weixinOverlay;

    module.exports = {

        //新浪微博
        'tsina': {
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
            label: '搜狐微博',
            target: 'http://t.sohu.com/third/post.jsp?url={{url}}&title={{title}}&content=utf8'
        },

        //QQ空间
        'qzone': {
            label: 'QQ空间',
            target: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{url}}&site={{source}}&title={{title}}&summary={{summary}}&desc={{summary}}'
        },

        //腾讯微博
        'tqq': {
            label: '腾讯微博',
            appkey: 'ad502caa0e0f4110943a32734e79a594',
            target: 'http://v.t.qq.com/share/share.php?url={{url}}&appkey={{appkey}}&pic={{img}}&site={{source}}&title={{title}}'
        },

        //人人网
        'renren': {
            label: '人人网',
            target: 'http://widget.renren.com/dialog/share?resourceUrl={{url}}&srcUrl={{source}}&title={{title}}&description={{summary}}'
        },

        //微信
        'weixin': {
            label: '微信',
            template: ['<div>',
                '<span data-role="close">&times;</span>',
                '<p>',
                '<img data-role="qrcode"></img>',
                '<br/>',
                '<span>扫一扫，分享到朋友圈</span>',
                '</p>',
                '</div>'
            ].join(''),

            target: function(shareInfo, options, currentDom) {
                if (!weixinOverlay) {
                    weixinOverlay = new Overlay({
                        content: options.template,
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

                /*
                function outClick(event) {
                    if (event.target == currentDom || $.contains(currentDom, event.target)) {
                        return;
                    }
                    weixinOverlay.hide();
                    $(document).off('click', outClick);
                }

                $(document).on('click', outClick);
                */

                return false;
            }
        }
    };
});
