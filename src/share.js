define(function(require, exports, module) {

    /**
     * 静态分享
     *
     * @module Share
     */

    'use strict';

    var $ = require('$'),
        Core = require('./core');

    var importStyleSim = require('./share-theme-simple.css'); //风格1

    var importStyleCir = require('./share-theme-cir.css'); //圆形
    var importStyleRec = require('./share-theme-rec.css'); //方形

    /**
     * 直接显示分享
     *
     * @class Share
     * @extends Core
     * @constructor
     */
    var Share = Core.extend({
        defaults: {

            /**
             * 风格 有1和2两种
             * @attribute styleType
             * @default '2'
             * @type {String}
             */
            styleType: '2',

            /**
             * 尺寸 s,m,l,xl(方形没有XL)
             * @attribute size
             * @default 'm'
             * @type {String}
             */
            size: 'm',

            /**
             * 形状 rec为方形，cir为圆形。
             * @attribute shape
             * @default 'rec'
             * @type {String}
             */
            shape: 'rec',

            /**
             * 主元素的className
             * @type {String}
             */
            classPrefix: 'ue-component ue-share',

            css: {
                position: 'static'
            },

            events: {
                render: '_renderCss'
            }
        },

        initialize: function(param) {
            Share.superclass.initialize.call(this, param, Share);
        },

        setup: function() {
            var self = this;

            self.importStyle = self.option('importStyle');
            self.size = self.option('size').toLocaleLowerCase();
            self.shape = self.option('shape').toLocaleLowerCase();
            self.styleType = self.option('styleType');

            if (self.importStyle) {
                self.styleType == '1' ? importStyleSim() : self.shape == 'cir' ? importStyleCir() : importStyleRec();
            }
            Share.superclass.setup.apply(this, arguments);
        },

        /**
         * 处理样式名
         * @private
         */
        _renderCss: function() {
            var self = this;
            var className;
            if (!self.importStyle) {
                return;
            }
            if(self.styleType == '1'){
              className = ['gb-share-', self.size, ' gb-share-simple'].join('');
            }else{
              className = ['gb-share-', self.size, ' gb-share-', self.shape, ' gb-share-', self.size, '-', self.shape].join('');
            }
            self.role('main').addClass(className);
        }
    });

    module.exports = Share;

});
