define(function(require, exports, module) {

    /**
     * 分享
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        Overlay = require('overlay'),
        dictionary = require('./dictionary');

    var importStyle = require('./share.css');

    /**
     * 分享的基础类
     *
     * @class Core
     * @extends Overlay
     * @uses dictionary
     * @constructor
     */
    var Core = Overlay.extend({
        defaults: {

            template: require('./share.handlebars'),

            /**
             * 要显示的分享类型，以及排列顺序。
             * @attribute shareList
             * @default 'tsohu,qzone,tsina,tqq,kaixin,renren,t163'
             * @type {String}
             */
            shareList: 'tsohu,qzone,tsina,tqq,kaixin,renren,t163',

            /**
             * 是否在弹窗中打开分享，否则在新页面中打开
             * @attribute openWindow
             * @default false
             * @type {Boolean}
             */
            openWindow: false,

            /**
             * 分享的标题,function或String。
             * @attribute shTitle
             * @default 当前页面标题
             * @type {String|Function}
             * @return {String} 要分享的标题
             */
            shTitle: function() {
                return this._match().title || document.title;
            },

            /**
             * 分享的URL，默认为本页URL
             * @attribute shTitle
             * @default 当前页面标题
             * @type {String|Function}
             * @return {String} 要分享的URL
             */
            shUrl: function() {
                return this._match().url || window.location.href;
            },

            /**
             * 分享的摘要，默认为当前选中的文本。
             * @attribute shSummary
             * @default 默认为当前选中的文本
             * @type {String|Function}
             * @return {String} 要分享摘要
             */
            shSummary: function() {
                return (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text).toString();
            },

            /**
             * 分享理由, 某些分享如QQ空间等，有这一项。
             * @attribute shDesc
             * @default 空字符串
             * @type {String|Function}
             * @return {String} 分享理由
             */
            shDesc: '',

            /**
             * 需要分享的图片,一般会自动抓取页面上的图片,所以无需配置
             * @attribute shImg
             * @default null
             * @type {Array|Function}
             * @return {Array} 图片列表
             */
            shImg: null,

            /**
             * 分享来源URL
             * @attribute sourceUrl
             * @default http://www.17173.com
             * @type {String}
             */
            sourceUrl: 'http://www.17173.com',

            /**
             * 来源名称
             * @attribute source
             * @default 17173游戏第一门户
             * @type {String}
             */
            source: encodeURIComponent('17173游戏第一门户'),

            /**
             * 自定义或重载分享类型
             * @attribute customShare
             * @default {}
             * @type {Object}
             */
            customShare: {},

            /**
             * 列表模式下的选择器，配置后会渲染到每个选中的元素上
             * @attribute selector
             * @default 空字符
             * @type {Sting}
             */
            selector: '',

            /**
             * 是否使用自定义DOM
             * @attribute customDom
             * @default false
             * @type {Boolean}
             */
            customDom: false,

            /**
             * 是否导入样式
             * @attribute importStyle
             * @default true
             * @type {Boolean}
             */
            importStyle: true,

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

            /**
             * 要渲染的元素
             * @attribute element
             * @type {String|Jquery}
             */
            element: null,
            container: null,
            css: {
                position: 'static'
            },
            effect: 'none',

            /**
             * 是否显示“分享到：”
             * @attribute showLabel
             * @default true
             * @type {Boolean}
             */
            showLabel : true
        },

        initialize: function(param, TargetCalss) {
            if (param.selector) {
                $(param.element).find(param.selector).each(function(i, dom) {
                    new TargetCalss($.extend(param, {
                        element: dom,
                        selector: ''
                    }));
                });
                return false;
            }
            this.fire('initialize');
            Core.superclass.initialize.apply(this, arguments);
        },

        setup: function() {
            var self = this;
            self.dictionary = $.extend(true, dictionary, self.option('customShare'));
            if (!self.option('customDom')) {
                self._createData();
                self.render();
            }
            if (self.option('importStyle')) {
                importStyle();
            }
            self._initEvent();
        },

        /**
         * 组装显示数据
         * @private
         */
        _createData: function() {
            var self = this;
            var shareItem;
            var shareMap = self.dictionary;
            var shareList = self.option('shareList').split(/\s*,\s*/);
            var viewData = {
                showLabel: self.option('showLabel'),
                sharelist: []
            };
            for (var i = 0; i < shareList.length; i++) {
                shareItem = shareMap[shareList[i]];
                if (shareItem) {
                    viewData.sharelist.push({
                        shareType: shareList[i],
                        label: shareItem.label,
                        iconText: shareItem.iconText
                    });
                }
            }
            self.option('data', viewData);
        },

        /**
         * 初始化事件
         * @private
         */
        _initEvent: function() {
            var self = this;
            var currentType;
            var currentShare;
            var shareMap = self.dictionary;
            var updateHitsCount = self.option('updateHitsCount');

            //点击分享
            self.element.delegate('[data-site]', 'click', function(event) {
                currentType = $(this).attr('data-site');
                currentShare = shareMap[currentType];
                if (!currentShare) {
                    return false;
                }
                //触发分享事件
                self.fire(Core.EVENTS.SHARE, currentType, currentShare);
                //更新统计
                if (updateHitsCount) {
                    updateHitsCount.call(self, currentType);
                }
                //分享
                self._doShare(currentType, currentShare, event.currentTarget);
            });
        },

        /**
         * [执行分享]
         * @param  {string} currentType 分享类型
         * @param  {object} currentShare 当前分享的配置数据
         * @param  {element} currentDom  分享的currentTarget
         * @private
         */
        _doShare: function(currentType, currentShare, currentDom) {
            var self = this;
            var url;
            //string 或 function
            var target = currentShare.target;
            var shareInfo = self._createShareInfo(currentShare);
            if (typeof target === 'function') {
                url = target.call(self, shareInfo, currentShare, currentDom);
                if (!url) {
                    return false;
                }
            } else {
                url = target.replace(/\{\{(\w+)\}\}/g, function(substr, str1) {
                    var value = shareInfo[str1] || '';
                    if (value && str1 == 'img') {
                        return value;
                    }
                    return encodeURIComponent(value);
                });
            }
            self._openWindow(url, currentShare);
        },

        /**
         * 要分享的数据
         * @private
         */
        _createShareInfo: function(currentShare) {
            var self = this;
            return {
                title: self._createAttr(self.option('shTitle')),
                img: self._createImg(self.option('shImg'), currentShare),
                url: self._createAttr(self.option('shUrl')),
                summary: self._createAttr(self.option('shSummary')),
                desc: self._createAttr(self.option('shDesc')),
                appkey: self.option('appkey'),
                sourceUrl: self.option('sourceUrl'),
                source: self.option('source')
            };
        },

        /**
         * 列表模式下的获取url和title
         * @return {object} url和title信息
         * @private
         */
        _match: function() {
            var self = this;
            var info = {};
            var match = self.option('match');
            var relativeDom = self.relateDom || self.element;
            var targetDom;
            var matchArray;
            if (match) {
                matchArray = match.split(/\s+/);
                targetDom = relativeDom.parents(matchArray.shift()).eq(0).find(matchArray.join(' ')).eq(0);
                info = {
                    url: targetDom.attr('href'),
                    title: targetDom.attr('title') || targetDom.text()
                };
            }
            return info;
        },

        /**
         * 解析配置项，如果是function则返回执行后的值，否则直接返回
         * @param  {function|string} attr 方法或字符串
         * @return {string}    分析后的值
         * @private
         */
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

        _createImg: function(preImg, currentShare) {
            var self = this;
            var imgArray;
            var img = self._createAttr(preImg);
            if (typeof img === 'string') {
                return encodeURIComponent(img);
            } else if (img) {
                imgArray = [];
                for (var i = 0; i < img.length; i++) {
                    imgArray[i] = encodeURIComponent(img[i]);
                }
                return imgArray.join(currentShare.imgSplit || '||');
            } else {
                return '';
            }
        },

        /**
         * 打开方式，弹窗或新窗口
         * @param  {String} targetLink
         * @param  {Object} currentShare
         * @private
         */
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
    Core.EVENTS = {
        SHARE: 'share'
    };

    module.exports = Core;

});
