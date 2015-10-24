var JS_FILE_PATH = window.Moxtra_CDN && "CDN_DOMAIN" !== window.Moxtra_CDN ? window.Moxtra_CDN + "/scripts/app/" : "scripts/app/";

require.config({
    paths: {
        jquery: "../../lib/jquery/jquery",
        bootstrapAlert: "../../lib/sass-bootstrap/js/alert",
        bootstrapButton: "../../lib/sass-bootstrap/js/button",
        bootstrapCollapse: "../../lib/sass-bootstrap/js/collapse",
        bootstrapDropdown: "../../lib/sass-bootstrap/js/dropdown",
        bootstrapModal: "../../lib/sass-bootstrap/js/modal",
        bootstrapTab: "../../lib/sass-bootstrap/js/tab",
        bootstrapTooltip: "../../lib/sass-bootstrap/js/tooltip",
        bootstrapTransition: "../../lib/sass-bootstrap/js/transition",
        template: "../../template",
        nls: "../nls",
        customize: "../customize",
        viewer: "../framework/viewer",
        painter: "../framework/painter",
        moxtra: "../framework/moxtra",
        ui: "component/ui",
        uuid: "../../lib/node-uuid/uuid",
        underscore: "../../lib/underscore/underscore",
        backbone: "../../lib/backbone/backbone",
        "backbone-validation": "../../lib/backbone-validation/dist/backbone-validation",
        text: "../../lib/requirejs-text/text",
        i18n: "../../lib/requirejs-i18n/i18n",
        handlebars: "../../lib/handlebars.js/dist/handlebars",
        "validation-helper": "../framework/ui/helper",
        tinymce: "../../lib/tinymce/tinymce.min",
        crypto: "../../vendor/crypto/crypto-sha1-hmac-pbkdf2",
        jqueryBase64: "../../vendor/crypto/jquery.base64",
        jqlazyload: "../../lib/jquery.lazyload/jquery.lazyload",
        pageVisibility: "../../lib/jquery-visibility/jquery-visibility",
        placeholder: "../../lib/jquery-placeholder/jquery.placeholder.min",
        sortable: "../../lib/Sortable/Sortable.min",
        stupidtable: "../../lib/stupid-jquery-table-sort/stupidtable.min",
        touchSwipe: "../../lib/jquery-touchswipe/jquery.touchSwipe.min",
        spin: "../../vendor/spin.js/spin",
        fullscreen: "../../lib/screenfull/dist/screenfull",
        mediaelement: "../../lib/mediaelement/build/mediaelement-and-player",
        "jquery-autosize": "../../lib/jquery-autosize/jquery.autosize",
        d3: "../../lib/d3/d3",
        moment: "../../lib/moment/min/moment-with-locales.min",
        "moment-timezone": "../../lib/moment-timezone/builds/moment-timezone-with-data-2010-2020.min",
        plupload: "../../lib/plupload/js/plupload.full.min",
        zeroclipboard: "../../lib/zeroclipboard/dist/ZeroClipboard",
        datetimePicker: "../../vendor/datetimepicker/jquery.datetimepicker",
        tinycon: "../../lib/tinycon/tinycon",
        dropins: "../../vendor/dropins/index",
        stripe: "../../vendor/stripe/stripe",
        notify: "../../lib/notify.js/notify",
        draggabilly: "../../lib/draggabilly/dist/draggabilly.pkgd.min",
        Long: "../../vendor/protobuf/Long",
        ByteBuffer: "../../vendor/protobuf/ByteBuffer",
        ProtoBuf: "../../vendor/protobuf/ProtoBuf"
    },
    shim: {
        bootstrapAlert: {
            deps: [ "jquery", "bootstrapTransition" ]
        },
        bootstrapButton: {
            deps: [ "jquery" ]
        },
        bootstrapCollapse: {
            deps: [ "jquery", "bootstrapTransition" ]
        },
        bootstrapDropdown: {
            deps: [ "jquery" ]
        },
        bootstrapModal: {
            deps: [ "jquery", "bootstrapTransition" ]
        },
        bootstrapTab: {
            deps: [ "jquery", "bootstrapTransition" ]
        },
        bootstrapTooltip: {
            deps: [ "jquery", "bootstrapTransition" ]
        },
        bootstrapTransition: {
            deps: [ "jquery" ]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: [ "underscore", "jquery" ],
            exports: "Backbone"
        },
        jquery: {
            exports: "$"
        },
        painter: {
            deps: [ "d3", "uuid" ],
            exports: "MX"
        },
        pageVisibility: {
            deps: [ "jquery" ]
        },
        mediaelement: {
            deps: [ "jquery" ]
        },
        "backbone-validation": {
            deps: [ "backbone" ]
        },
        "validation-helper": {
            deps: [ "underscore", "backbone-validation" ]
        },
        ui: {
            deps: [ "moxtra", "component/notify/notify", "component/selector/binderSelector", "component/selector/userSelector" ]
        },
        jqlazyload: {
            deps: [ "jquery" ],
            exports: "$.fn.lazyload"
        },
        "moment-timezone": {
            deps: [ "moment" ]
        },
        datetimePicker: {
            deps: [ "jquery" ]
        },
        stripe: {
            exports: "Stripe"
        },
        moxtra: {
            deps: [ "jquery", "backbone", "backbone-validation", "handlebars", "validation-helper", "uuid", "jqlazyload", "mediaelement", "moment", "moment-timezone", "bootstrapTransition", "bootstrapAlert", "bootstrapButton", "bootstrapCollapse", "bootstrapDropdown", "bootstrapModal", "bootstrapTab", "bootstrapTooltip", "datetimePicker", "pageVisibility", "spin", "placeholder", "jqueryBase64", "stupidtable", "touchSwipe", "jquery-autosize", "stripe" ],
            exports: "MX"
        },
        sortable: {
            exports: "Sortable"
        },
        zeroclipboard: {
            exports: "ZeroClipboard"
        },
        ByteBuffer: {
            deps: [ "Long" ]
        },
        ProtoBuf: {
            exports: "ProtoBuf",
            deps: [ "Long", "ByteBuffer" ]
        },
        "jquery-autosize": {
            deps: [ "jquery" ]
        },
        placeholder: {
            deps: [ "jquery" ]
        },
        jqueryBase64: {
            deps: [ "jquery" ]
        },
        stupidtable: {
            deps: [ "jquery" ],
            exports: "$.fn.stupidtable"
        },
        touchSwipe: {
            deps: [ "jquery" ],
            exports: "$.fn.swipe"
        },
        draggabilly: {
            exports: "Draggabilly"
        }
    },
    waitSeconds: 0
}), require([ JS_FILE_PATH + "mx.lib.1e0d846f.js?v=" ], function() {
    try {
        sessionStorage && (sessionStorage.setItem("testapp", Date.now()), sessionStorage.removeItem("testapp"));
    } catch (a) {
        return void (location.href = "412.html");
    }
    require([ JS_FILE_PATH + "mx.base.3c1e98e0.js?v=", JS_FILE_PATH + "mx.meet.82ff2c56.js?v=", JS_FILE_PATH + "mx.app1.a14076e8.js?v=", JS_FILE_PATH + "mx.app2.294d71e2.js?v=", JS_FILE_PATH + "mx.app3.81453afe.js?v=", JS_FILE_PATH + "mx.app4.cd84de8b.js?v=" ], function() {
        require([ "router", "app", "moxtra" ], function(a, b) {
            "use strict";
            var c = new a();
            b.router = c, b.integration = c.integration, b.request = c.request, b.status = c.status, 
            b.localStatus = c.localStatus, Backbone.history.start();
        });
    });
});