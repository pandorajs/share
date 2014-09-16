define(function(require, exports, module) {

    /**
     * 可飘浮分享
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        Core = require('./core');

    var importStyle1 = require('./share-theme-drop-simple.css');
    var importStyle2 = require('./share-theme-drop.css');

    /**
     * 可飘浮的分享
     *
     * @class FloatShare
     * @extends Core
     * @constructor
     */
    var FloatShare = Core.extend({
        defaults: {

            /**
             * 关联显示时弹层的位置，支持top、bottom、left、right
             * @type {String}
             */
            popPosition: 'bottom',

            /**
             * 尺寸 s,m,l,xl
             * @type {String}
             */
            size: 'l',

            /**
             * 风格 有1和2两种
             * @type {String}
             */
            styleType: '2',

            /**
             * 偏移位,单位px
             * @type {Object}
             */
            offset: {
                x: -5,
                y: 5
            },

            /**
             * 主元素的className
             * @type {String}
             */
            classPrefix: 'ue-component ue-float-share',

            container: 'body',

            autoShow: false,

            css: {
                position: 'absolute'
            },

            showLabel: true,

            events: {
                render: '_renderCss'
            }
        },

        initialize: function(param) {
            var self = this;
            self.on('initialize', function() {
                self.relateDom = param.baseElement = $(param.element);
                param.element = '<div></div>';
            });

            FloatShare.superclass.initialize.call(self, param, FloatShare);
        },

        setup: function() {
            var self = this;

            self.offset = $.extend({}, self.option('offset'));
            self.importStyle = self.option('importStyle');
            self.styleType = $.trim(self.option('styleType'));

            FloatShare.superclass.setup.apply(this, arguments);

            if (self.importStyle) {
                switch (self.styleType) {
                    case '1':
                        {
                            importStyle1();
                            break;
                        }
                    default:
                        {
                            importStyle2();
                        }
                }
            }
        },

        /**
         * 设置浮层显示位置
         * @private
         */
        setPosition: function() {
            var self = this;
            var main = self.role('main');
            var x, y;
            x = (self.relateDom.width() - main.width()) / 2,
            y = (self.relateDom.height() - main.height()) / 2;
            switch (self.option('popPosition')) {
                case 'right':
                    x = self.relateDom.width();
                    break;
                case 'top':
                    y = 0 - main.height();
                    break;
                case 'bottom':
                    y = self.relateDom.height();
                    break;
                default: //left
                    x = 0 - main.width();
                    break;
            }
            self.option('offset', {
                x: x + self.offset.x,
                y: y + self.offset.y
            });
            FloatShare.superclass.setPosition.apply(this, arguments);
        },

        /**
         * 初值化事件
         * @private
         */
        _initEvent: function() {
            var self = this;

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
            self.relateDom.click(function(event) {
                self.element.css('left', '0px'); //防止换行后高度测量不准确
                self.show();
                $(document).on('click', outClick);
            });

            FloatShare.superclass._initEvent.apply(this, arguments);
        },

        /**
         * 处理样式名
         * @private
         */
        _renderCss: function() {
            var self = this;
            var size;
            var className;
            var styleType =  self.styleType == '2' ? '' : '-simple';
            if (!self.importStyle) {
                return;
            }
            size = self.option('size');
            className = ['gb-share-', size,' gb-share-drop', styleType].join('');
            self.role('main').addClass(className);
        }

    });

    module.exports = FloatShare;

});
