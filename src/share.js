define(function(require, exports, module) {

    /**
     * 分享
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        handlebars = require('handlebars'),
        Overlay = require('overlay'),
        dictionary = require('./dictionary');

    var Share = Overlay.extend({
        defaults: {

            template: require('./share.handlebars'),

            /**
             * 要渲染的元素
             * @type {[type]}
             */
            element: null,

            /**
             * 列表模式下的选择器，配置后会渲染到每个选中的元素上
             * @type {Sting}
             */
            selector: '',

            /**
             * 关联显示,默认直接显示
             * @type {Boolean}
             */
            relateShow: false,

            /**
             * 关联显示时弹层的位置，支持top、bottom、left、right
             * @type {String}
             */
            popPosition: 'left',

            container: null,

            css: {
                position: 'static'
            },

            /**
             * 主元素的className
             * @type {String}
             */
            classPrefix: 'ue-component ue-share',

            /**
             * 是否显示标签
             * @type {Boolean}
             */
            showLabel: false,

            /**
             * 是否在小窗口中显示分享，否则在新页面中显示
             * @type {Boolean}
             */
            openWindow: false,

            /**
             * 分享的标题,function或String。
             * @type {String}
             */
            shTitle: function() {
                return document.title;
            },

            /**
             * 分享的URL，默认为本页URL
             * @return {String} [description]
             */
            shUrl: function() {
                return window.location.href;
            },

            /**
             * 分享的摘要，默认为当前选中的文本。
             * @return {String} [description]
             */
            shSummary: function() {
                return (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text).toString();
            },

            /**
             * 需要分享的图片,一般会自动抓取页面上的图片,所以无需配置
             * @return {Array} 图片列表
             */
            shImg: null,

            /**
             * 分享来源
             * @type {String}
             */
            sourceUrl: 'http://www.17173.com',

            /**
             * 来源名称
             * @type {String}
             */
            source: encodeURIComponent('17173游戏第一门户'),

            /**
             * 注册或重载分享类型
             * @type {Object}
             */
            customShare: {},

            /**
             * 要显示的分享类型，以及排列顺序。
             * @type {Array}
             */
            shareList: ['qzone', 'tsina', 'tqq', 'tsohu', 'renren', 'weixin'],

            /**
             * 预留获取总分享次数接口
             * @return {Number} 返回总分享次数
             */
            getCount: null,

            /**
             * 预留保存分享次数接口
             * @param  {String} shareType 当前点击的分享类型
             */
            updateHitsCount: null,

            effect: 'none'
        },

        initialize: function(param) {
            if (param.selector) {
                $(param.element).find(param.selector).each(function(i, dom) {
                    new Share($.extend(param, {
                        element: dom,
                        selector: ''
                    }));
                });
                return false;
            }
            this._initParam(param);
            Share.superclass.initialize.apply(this, arguments);
        },

        setup: function() {
            var self = this;
            self._createData();
            self.render();
            self._initEvent();
        },

        setPosition: function() {
            var self = this;
            var x, y;
            if (!self.option('relateShow')) {
                return;
            }
            x = (self.relateDom.width() - self.element.width()) / 2,
            y = (self.relateDom.height() - self.element.height()) / 2;
            switch (self.option('popPosition')) {
                case 'right':
                    x = self.relateDom.width();
                    break;
                case 'top':
                    y = 0 - self.element.height();
                    break;
                case 'bottom':
                    y = self.relateDom.height();
                    break;
                default: //left
                    x = 0 - self.element.width();
                    break;
            }
            self.option('offset', {
                x: x,
                y: y
            });
            Share.superclass.setPosition.apply(this, arguments);
        },

        //关联显示时重置参数
        _initParam: function(param) {
            if (param.relateShow) {
                this.relateDom = $(param.element);
                param.element = '<div></div>';
                param.container = 'body';
                param.autoShow = false;
                param.css = {
                    position: 'absolute'
                };
                param.baseElement = this.relateDom;
            }
        },

        //组装显示数据
        _createData: function() {
            var self = this;
            var shareItem;
            var shareMap = $.extend(true, self.option('customShare'), dictionary);
            var shareList = self.option('shareList');
            var viewData = {
                showLabel: self.option('showLabel'),
                sharelist: []
            };
            for (var i = 0; i < shareList.length; i++) {
                shareItem = shareMap[shareList[i]];
                if (shareItem) {
                    viewData.sharelist.push({
                        shareType: shareList[i],
                        label: shareItem.label
                    });
                }
            }
            self.option('data', viewData);
        },

        //初始化事件
        _initEvent: function() {
            var self = this;
            var currentType;
            var currentShare;
            var shareMap = self.option('customShare');
            var updateHitsCount = self.option('updateHitsCount');

            //鼠标外部点击
            var outClick = function(event) {
                if (self.relateDom[0] == event.target ||
                    $.contains(self.relateDom[0], event.target) ||
                    self.element[0] == event.target ||
                    $.contains(self.element[0], event.target)) {
                    return false;
                }
                self.hide();
                $(document).off('click', outClick);
            };

            self.show(function() {
                self.setPosition();
            });

            //点击关联的DOM
            if (self.relateDom) {
                self.relateDom.click(function(event) {
                    self.element.css('left', '0px'); //防止换行后高度测量不准确
                    self.show();
                    $(document).on('click', outClick);
                });
            }

            //点击分享
            self.element.delegate('[data-role]', 'click', function(event) {
                currentType = $(this).attr('data-role');
                currentShare = shareMap[currentType];
                if (!currentShare) {
                    return false;
                }

                //触发分享事件
                self.fire(Share.EVENTS.SHARE, currentType, currentShare);

                //更新统计
                if (updateHitsCount) {
                    updateHitsCount.call(self, currentType);
                }

                //分享
                self._doShare(currentType, currentShare, event.currentTarget);
            });
        },

        //执行分享
        _doShare: function(currentType, currentShare, currentDom) {
            var self = this;
            var url;
            //string 或 function
            var target = currentShare.target;
            var shareInfo = self._createShareInfo();
            if (typeof target === 'function') {
                url = target.call(self, shareInfo, currentShare, currentDom);
                if (!url) {
                    return false;
                }
            } else {
                url = target.replace(/\{\{(\w+)\}\}/g, function(substr, str1) {
                    var value = shareInfo[str1] || '';
                    if (value && str1 == 'img') {
                        value = value.join(currentShare.imgSplit || '||');
                    }
                    return encodeURIComponent(value);
                });
            }
            self._openWindow(url, currentShare);
        },

        //要分享的数据
        _createShareInfo: function() {
            var self = this;
            return {
                title: self._createAttr(self.option('shTitle')),
                img: self._createAttr(self.option('shImg')),
                url: self._createAttr(self.option('shUrl')),
                summary: self._createAttr(self.option('shSummary')),
                appkey: self.option('appkey'),
                sourceUrl: self.option('sourceUrl'),
                source: self.option('source')
            };
        },

        _createAttr: function(attr) {
            var self = this;
            if (typeof attr === 'function') {
                return attr.call(self, self.relateDom || self.element);
            } else if (attr) {
                return attr;
            } else {
                return '';
            }
        },

        //打开方式，弹窗或新窗口
        _openWindow: function(targetLink, currentShare) {
            var self = this;
            var width = currentShare.width || 600;
            var height = currentShare.height || 450;
            var left = (screen.width - width) / 2;
            var top = (screen.height - height) / 2;
            var winStyle = ['toolbar=0,status=0,resizable=1,width=', width, ',height=', height, ',left=', left, ',top=', top].join('');
            if (self.option('openWindow')) {
                window.open(targetLink, 'share', winStyle);
            } else {
                window.open(targetLink);
            }
        }
    });

    //事件列表
    Share.EVENTS = {
        SHARE: 'share'
    };

    module.exports = Share;

});
