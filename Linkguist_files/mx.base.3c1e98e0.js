"use strict";

function ChainObject(a) {
    var b = this;
    this.fn = {}, a && setTimeout(function() {
        a.call(b);
    }, 1);
}

function updateTime() {
    $('[data-widget="updateTime"]').each(function(a, b) {
        b = $(b);
        var c = b.data("param");
        c && (c = MX.lang.formatDate(c), b.text(c));
    }), setTimeout(updateTime, 6e5);
}

!function(a) {
    function b(a) {
        return "object" == typeof a && a === Object(a);
    }
    function c(a) {
        return j.isDefine(a) ? null != a && a == window ? !1 : 1 === a.nodeType && a.length ? !0 : void 0 !== a.length && b(a) ? !0 : a.toString && a.toString().indexOf("HTMLCollection") > 0 ? !0 : d(a) : !1;
    }
    function d(a) {
        return Array.isArray ? Array.isArray(a) : "[object Array]" === k.call(a);
    }
    function e() {
        var a, c, d = arguments, e = d.length, f = d[0], g = 0;
        for (1 == e && (f = this); e > g; g++) if (a = d[g], f && b(a)) for (c in a) f[c] = a[c];
        return f;
    }
    function f(b, d, e) {
        var f, e = e || a;
        if (c(b)) {
            var g = b.length;
            for (f = 0; g > f && d.call(e, b[f], f) !== !1; f++) ;
        } else for (f in b) if (d.call(e, b[f], f) === !1) break;
    }
    function g() {
        if (q.length) {
            var a = [].concat(q), b = Date.now();
            q = [], s = !0, $.ajax({
                type: "POST",
                url: "/user/log",
                data: a.join("\r\n"),
                contentType: "text/plain; charset=UTF-8",
                success: function() {
                    a = [], r = b, s = !1;
                },
                error: function() {
                    q = a.concat(q), s = !1;
                }
            });
        }
    }
    var h, i = "Moxtra", j = h = a[i], k = Object.prototype.toString, l = Array.prototype.slice, m = /\${([\w\.$-]+)(?:\:([\w\.$]*)(?:\((.*?)?\))?)?\}/g, n = /\{{([\w-]+)(?:\:([\w]*)(?:\((.*?)?\))?)?\}}/g;
    j || (j = a[i] = {
        version: 2.1,
        global: a,
        noConflict: function() {
            return a[i] = h, j;
        }
    }), e(j, {
        regex: {
            simpleTemplate: m
        },
        extend: e,
        isArray: d,
        isObject: b,
        isUndefined: function(a) {
            return void 0 === a;
        },
        isNull: function(a) {
            return null === a;
        },
        isDefine: function(a) {
            return !this.isUndefined(a) && !this.isNull(a);
        },
        isEmpty: function(a) {
            return "" === a || "" === a.trim();
        },
        each: f,
        ns: function(b, c, d) {
            if (j.isString(b)) {
                var g, h = b.split("."), i = [], k = c || a;
                return f(h, function(a, b) {
                    if (g = k[a], i.push(a), j.isUndefined(g)) {
                        if (d) {
                            var c;
                            return (c = k.get && j.isFunction(c)) ? k.get(h.splice(b).join(".")) || null : (g = null, 
                            !1);
                        }
                        g = k[a] = {
                            extend: e
                        };
                    }
                    k = g;
                }), g;
            }
        },
        invoke: function(a, b, c) {
            c = c || window;
            var d = a.split("."), e = d.pop(), f = this.ns(d.join("."), c, !0);
            return f ? f[e].apply(f, b) : !1;
        },
        get: function(a, b) {
            return j.ns(a, b, !0);
        },
        set: function(b, c, d) {
            var e, f = b.split(".");
            if (1 == f.length) a[b] = c; else {
                e = f.pop();
                var g = j.ns(f.join("."), d);
                g[e] = c;
            }
            return c;
        },
        logger: function(a) {
            if (j.Logger[a]) return j.Logger[a];
            var b = new j.Logger(a);
            return j.Logger[a] = b, b;
        },
        format: function(a, c) {
            var e, f = arguments;
            if (a = a || "", 2 === f.length) if (d(c)) e = c; else {
                if (b(c)) {
                    var g = function(a, b) {
                        var d = c[b];
                        return j.isDefine(d) ? d : a;
                    };
                    return a.indexOf("${") >= 0 ? a.replace(m, g) : a.replace(n, g);
                }
                e = l.call(arguments, 1);
            } else e = l.call(arguments, 1);
            return a.replace(/\{(\d+)\}/g, function(a, b) {
                return e[b];
            });
        }
    }), f([ "Function", "String", "Boolean", "Date", "Number" ], function(a) {
        j["is" + a] = function(b) {
            return k.call(b) === "[object " + a + "]";
        };
    }), j.Logger = function(a) {
        this.$name = a;
    };
    var o = null;
    j.Logger.watch = function() {
        if (o || (o = JSON.parse(sessionStorage.getItem("mxLogger") || "{}")), arguments.length) {
            var a = l.call(arguments, 0);
            j.each(a, function(a) {
                o[a] = !0;
            });
            try {
                sessionStorage.setItem("mxLogger", JSON.stringify(o));
            } catch (b) {
                console.error(b);
            }
        }
        this.getWatchList();
    };
    var p = [];
    j.Logger.getWatchList = function() {
        p = [], o || (o = JSON.parse(sessionStorage.getItem("mxLogger") || "{}")), j.each(o, function(a, b) {
            p.push(new RegExp(b));
        });
    }, j.Logger.getWatchList(), j.Logger.isWatch = function(a) {
        var b = !1;
        return j.each(p, function(c) {
            c.test(a) && (b = !0);
        }), b;
    }, j.Logger.clearWatch = function() {
        sessionStorage.removeItem("mxLogger"), this.getWatchList();
    }, f([ "log", "error", "debug", "warn", "info" ], function(a) {
        j.Logger.prototype[a] = function(b) {
            var c = console[a] || console.log || function() {}, d = l.call(arguments, 0);
            if (2 == d.length && j.isString(b) && /(${|{)/.test(b)) {
                var e = "[" + this.$name + "] " + j.format(b, l.call(d, 1));
                d = [ e ];
            } else d = [ "[" + this.$name + "]" ].concat(d);
            return MX.env.isIE && (d = [ d.join("") ]), ("error" == a || j.Logger.isWatch(this.$name)) && (c.apply ? c.apply(console, d) : console && console.error && console.error(d)), 
            d;
        };
    });
    var q = [], r = Date.now(), s = !1;
    f([ "log", "error", "debug", "warn", "info" ], function(a) {
        j.Logger.prototype[a + "Server"] = function(b, c) {
            this[a](b, "");
            this.sync(b, c);
        };
    }), j.Logger.prototype.sync = function(a, b) {
        q.push(a), b ? g() : (q.length >= 10 || Date.now() - r > 6e4) && !s && g();
    }, j.Logger.prototype.sendCrashReport = function(a, b) {
        a && b && $.ajax({
            type: "POST",
            url: "/crashreport/" + encodeURIComponent(a),
            data: b,
            contentType: "text/plain; charset=UTF-8",
            success: function() {},
            error: function() {}
        });
    }, window.addEventListener("beforeunload", g), j.debug = !0, a.MX = j;
}(window), function(a) {
    function b(b, c) {
        if (!a.isDefine(b)) return "";
        var d = b.replace("/", "").trim();
        return c && (d = h[d] || d), d;
    }
    function c(b) {
        return a.isDefine(b) ? b.indexOf(".") > 0 ? (b = b.split("."), Number(b[0])) : parseInt(b, 10) : 0;
    }
    var d = window.navigator.userAgent, e = [ "Chrome/", "Opera/", "MSIE ", "Firefox/", "Safari/", "Trident/" ], f = [ "Gecko/", "AppleWebKit/", "Presto/", "Trident/" ], g = a.ns("MX.env"), h = {
        MSIE: "IE",
        AppleWebKit: "WebKit",
        Firefox: "FF",
        Trident: "IE"
    };
    g.detectBrowser = function(a) {
        var d, g = a.match(new RegExp("((?:" + e.join(")|(?:") + "))([\\d\\._]+)")), h = {};
        return g && 3 == g.length ? (d = b(g[1], !0), h.name = b(g[1], !0), h["is" + d] = !0, 
        "Safari" == d && (g = a.match(/(Version|CriOS)[ \/]([\w.]+)/)), g ? ("Trident" === b(g[1]) && (g = a.match(/(rv:)([\d\\.]+)/)), 
        h.browserVersion = c(g[2])) : (h.isOther = !0, h.browserVersion = 0)) : (h.isOther = !0, 
        h.browserVersion = 0), g = a.match(new RegExp("((?:" + f.join(")|(?:") + "))([\\d\\._]+)")), 
        g && g.length && (d = b(g[1], !0), h.engineName = d, h["is" + d] = !0, h.engineVersion = c(g[2])), 
        g = a.match(/(Edge\/)([\d\._]+)/), g && g.length && (h.isEdge = !0), h;
    }, g.detectFlash = function(a) {
        var b = null, c = [ 0, 0, 0 ], d = [ 10, 0, 0 ], e = {
            isInstalled: !1,
            isMatched: !1,
            isSupported: !1,
            version: ""
        };
        if (a) {
            var f = a.split(".");
            d[0] = f[0] && parseInt(f[0]) || 0, d[1] = f[1] && parseInt(f[1]) || 0, d[2] = f[2] && parseInt(f[2]) || 0;
        }
        if ("undefined" != typeof navigator.plugins && "object" == typeof navigator.plugins["Shockwave Flash"]) b = navigator.plugins["Shockwave Flash"].description, 
        !b || "undefined" != typeof navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] && !navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin || (e.isInstalled = !0, 
        b = b.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), c[0] = parseInt(b.replace(/^(.*)\..*$/, "$1"), 10), 
        c[1] = parseInt(b.replace(/^.*\.(.*)\s.*$/, "$1"), 10), c[2] = /[a-zA-Z]/.test(b) ? parseInt(b.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if ("undefined" != typeof window.ActiveXObject) try {
            var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            g && (b = g.GetVariable("$version"), b && (e.isInstalled = !0, b = b.split(" ")[1].split(","), 
            c = [ parseInt(b[0], 10), parseInt(b[1], 10), parseInt(b[2], 10) ]));
        } catch (h) {}
        return (c[0] > d[0] || c[0] == d[0] && c[1] > d[1] || c[0] == d[0] && c[1] == d[1] && c[2] >= d[2]) && (e.isMatched = !0), 
        e.version = c.join("."), e.isSupported = e.isInstalled && e.isMatched, e;
    }, g.extend(g.detectBrowser(d)), g.name ? g["is" + g.name + g.browserVersion] = !0 : "WebKit" === g.engineName && (g.isSafari = !0, 
    536 === g.engineVersion ? (g.browserVersion = 6, g.isSafari6 = !0) : 537 === g.engineVersion ? (g.browserVersion = 7, 
    g.isSafari7 = !0) : g.engineVersion >= 538 && (g.browserVersion = 8, g.isSafari8 = !0));
    var i = {
        IE: 7,
        FF: 11,
        WebKit: 5,
        Chrome: 19,
        Opera: 11
    }, j = i[g.engineName];
    g.browserVersion < j && (g.isBrowserNotSupport = !0), g.isChromeOniOS = d.indexOf("CriOS") > -1;
}(MX), function(a) {
    var b = window.navigator, c = b.platform, d = b.userAgent, e = [ "Android", "Win", "Linux", "iPhone", "iPad", "iPod", "X11", "Mac", "BlackBerry", "MacIntel" ], f = /Mac|MacIntel|Win|Linux|Unix/, g = {
        X11: "Unix"
    }, h = a.ns("MX.env");
    h.detectOS = function(a, b) {
        var c, d = a.match(new RegExp("((?:" + e.join(")|(?:") + "))|([\\d\\._]+)")), h = {};
        return d && (c = g[d[1]] || d[1]), c || (c = "Other"), h.name = c, "i" == c.substr(0, 1) ? h[c] = !0 : h["is" + c] = !0, 
        "Linux" == c && /Android/.test(b) && (h.isAndroid = !0), f.test(c) && !h.isAndroid ? h.isDesktop = !0 : h.isMobile = !0, 
        /iPhone|iPad|iPod|Mobile/.test(b) && (h.isMobile = !0), h.osVersion = parseInt(navigator.appVersion.split(" ")[0], 10), 
        /Win64/.test(b) && /x64/.test(b) && (h.isWindows64bit = !0), h;
    };
    var i = h.detectOS(c, d);
    h.extend(i);
}(MX), MX.extend({
    camelize: function(a) {
        return a.replace(/[-,_]+(.)?/g, function(a, b) {
            return b ? b.toUpperCase() : "";
        });
    },
    capitalize: function(a) {
        return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase();
    },
    escapeHTML: function(a) {
        return a ? String(a).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\'/g, "&apos;") : a;
    },
    unescapeHTML: function(a) {
        return a ? String(a).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'").replace(/&amp;/g, "&") : a;
    },
    cutStr: function(a, b) {
        if (!a) return "";
        if (!b) return a;
        var c = 0, d = 0, e = "";
        d = a.length;
        for (var f = 0; d > f; f++) {
            var g = a.charAt(f);
            if (c++, escape(g).length > 4 && c++, e = e.concat(g), c >= b) return e = e.concat("...");
        }
        return b > c ? a : void 0;
    },
    equal: function(a, b) {
        var c = !1;
        return MX.each(b, function(b) {
            return a == b ? c = !0 : void 0;
        }), c;
    },
    trimEnd: function(a) {
        return a.replace(/\s*$/, "");
    }
}), MX.extend({
    pick: function(a, b, c) {
        for (var d, e, f = {}, g = function(a) {
            return a;
        }, c = MX.extend({
            format: g,
            parse: g
        }, c), h = 0; h < b.length; h++) e = b[h], d = MX.get(e, a), MX.isDefine(d) && (e = c.format(e, d, f), 
        d = c.parse(d, e, f), void 0 !== d && (f[e] = d));
        return f;
    }
}), MX.extend({
    filter: function(a, b) {
        var c = [];
        if (!b) return a;
        if (!a) return null;
        if ("function" == typeof b) MX.each(a, function(a) {
            b(a) === !0 && c.push(a);
        }); else {
            var d = function(a) {
                var d = !0;
                MX.each(b, function(b, c) {
                    c.indexOf(".") > 0 ? MX.get(c, a) != b && (d = !1) : a.get ? a.get(c) != b && (d = !1) : a[c] != b && (d = !1);
                }), d && c.push(a);
            };
            a.each ? a.each(d) : MX.each(a, d);
        }
        var e = c.length;
        return e ? c : null;
    },
    object: function() {
        var a, b, c, d, e = arguments, f = e.length, g = e[0].length, h = [], i = e[f - 1];
        if (f > 2 && i.length == f - 1) for (b = 0; g > b; b++) {
            for (d = {}, a = 0; a < i.length; a++) c = i[a], d[c] = e[a][b];
            h.push(d);
        } else h = _.object.apply(_, e);
        return h;
    },
    binarySearch: function(a, b) {
        for (var c = 0, d = a.length - 1, e = Math.floor((d + c) / 2); a[e] != b && d > c; ) b < a[e] ? d = e - 1 : b > a[e] && (c = e + 1), 
        e = Math.floor((d + c) / 2);
        return a[e] != b ? -1 : e;
    },
    binarySearchObjects: function(a, b, c) {
        for (var d = 0, e = a.length - 1, f = Math.floor((e + d) / 2); a[f][b] != c && e > d; ) c < a[f] ? e = f - 1 : c > a[f][b] && (d = f + 1), 
        f = Math.floor((e + d) / 2);
        return a[f][b] != c ? -1 : f;
    }
}), MX.ns("MX.lang").extend({
    formatDateTime: function(a, b) {
        return a = a || Date.now(), b = b || "LL LT", moment(Date.now()).isSame(a, "day") && (b = "LT"), 
        this.format(a, b);
    },
    formatDate: function(a, b) {
        return b = b || "l", moment(Date.now()).isSame(a, "day") && (b = "LT"), this.format(a, b);
    },
    format: function(a, b) {
        var c = Moxtra.getMe().timezone;
        if (!c) return moment(a).format(b);
        try {
            return moment(a).tz(c).format(b);
        } catch (d) {
            return moment(a).format(b);
        }
    },
    formatPhone: function(a) {
        return a;
    },
    formatCurrency: function(a) {
        return a;
    },
    formatSize: function(a) {
        var b = Math.ceil(a / 1048576);
        return b >= 1024 ? (b = Math.round(b / 1024 * 100) / 100, b + " GB") : b + " MB";
    }
}), function(a) {
    var b = function(b, c, d) {
        if (this.name = b, this.db = c, d) {
            var e = {};
            a.each(d, function(a) {
                e[a] = !0;
            }), this.variables = e;
        } else this.variables = !1;
    }, c = a.logger("Storage");
    a.extend(b.prototype, {
        data: function(a, b) {
            if (a && this.variables && 0 != this.variables && !this.variables[a]) return c.error("The variables {0} is not allowed in storage {1}", a, this.name), 
            null;
            var d = this.db.getItem(this.name);
            if (d = d ? JSON.parse(d) : {}, void 0 != b) {
                d[a] = b;
                try {
                    this.db.setItem(this.name, JSON.stringify(d));
                } catch (e) {
                    console.error(e);
                }
                return d;
            }
            return a ? d[a] : d;
        },
        get: function(a) {
            return this.data(a);
        },
        set: function(a, b) {
            return this.data(a, b);
        },
        remove: function(a) {
            if (void 0 == a) return this.db.removeItem(this.name);
            var b = this.data();
            delete b[a];
            try {
                this.db.setItem(this.name, JSON.stringify(b));
            } catch (c) {
                console.error(c);
            }
            return this;
        }
    }), a.storage = function(a, c, d) {
        return new b(a, "localStorage" == c ? localStorage : sessionStorage, d);
    };
}(MX), function(a) {
    a.loadStyle = function(a) {
        var b = document.createElement("link");
        b.charset = $.charset, b.rel = "stylesheet", b.type = "text/css", b.href = a, document.getElementsByTagName("head")[0].appendChild(b);
    }, a.getOrigin = function() {
        var a = location.origin;
        return a ? a : (a = location.protocol + "//" + location.hostname, location.port && (a += ":" + location.port), 
        a);
    };
}(MX), function(a) {
    function b(a, b, c) {
        var d = new a(c, b);
        return d;
    }
    function c() {}
    function d(a, b, c) {
        return null != c && "object" == typeof c ? c.get || c.set ? Object.defineProperty(a, "_" + b, {
            writable: !0,
            enumerable: !1
        }) : void 0 === c.value && (c = {
            value: c
        }) : c = {
            value: c
        }, c.get || c.set || (c.writable = !0), void 0 == c.enumerable && (c.enumerable = !0), 
        Object.defineProperty(a, b, c), c;
    }
    var e = Object.create(null, {
        version: {
            writable: !1,
            configurable: !1,
            enumerable: !0,
            value: 2.1
        }
    }), f = Object.create(null), g = Object.create(null), h = 0, i = [], j = {
        writable: !1,
        configurable: !1,
        enumerable: !0
    }, k = function(a, b) {
        if (a) for (var c, d = Object.keys(a), e = 0; e < d.length && (c = d[e], b.call(this, a[c], c) !== !1); e++) ;
    }, l = function() {
        var a = Array.prototype.slice.call(arguments, 0), b = a.shift();
        return k(a, function(a) {
            k(a, function(a, c) {
                b[c] = a;
            });
        }), b;
    };
    f.defineProps = function(a, b, c, d) {
        var e = _.extend({}, j);
        void 0 != c && (e.writable = c), void 0 != d && (e.enumerable = d), k(b, function(b, c) {
            e.value = b, Object.defineProperty(a, c, e);
        });
    }, f.defineProps(f, {
        each: k,
        extend: l
    }), f.defineProps(e, Backbone.Events, !1, !1), f.defineProps(g, {
        uuid: function(a) {
            return a ? i.indexOf(a) : (a = window.uuid(), i.push(a), a);
        },
        getModelInstance: function(a) {
            var c, d, e = a.model, f = a.parent, h = a.data;
            return e.unique ? c = g.cache(e.$name) : a.unique && (c = g.cache(a.unique)), c && (d = c.getModel(h)), 
            d || (d = b(e, f), d.parse(h)), d;
        },
        getInstance: function(a) {
            var c = a.model, d = a.parent, e = a.data;
            if (a.unique || c.unique) {
                var g, h = f.cache(a.model.$name), i = a.attributeId || c.prototype.attributeId, j = c.prototype.secondId;
                return i && i.indexOf(".") > 0 ? i = f.get(i, e) : i && (i = e[i]), i || (i = e[j]), 
                i && (g = h.get(i)) ? g.parse(e) : (g = b(c, d), g.parse(e), h.push(g)), g;
            }
            return b(c, d, e);
        }
    }), f.defineProps(c.prototype, Backbone.Events, !1, !1), f.defineProps(c.prototype, {
        notify: function(a, b, c) {
            a.trigger(this.$name + ":" + b, c || this);
        },
        hasProperty: function(a) {
            return void 0 === this.$props[a] ? !1 : !0;
        },
        getProperty: function(a) {
            return a ? this.$props[a] : this.$props;
        },
        getProperties: function(a) {
            a = a || Object.keys(this.$props);
            var b, c = {}, d = this;
            return a.forEach(function(a) {
                b = a.indexOf(".") > -1 ? f.get(a, d) : d[a], c[a] = b;
            }), c;
        },
        propertyEditable: function(a) {
            if (!a) return !1;
            var b = this.$props[a];
            return void 0 === b ? !1 : b.get && !b.set ? !1 : b.writable === !1 ? !1 : !0;
        }
    }, !1, !1), f.defineProps(e, {
        ajax: function(a) {
            return $.ajax(a);
        },
        define: function(a, b, i) {
            function j() {
                f.defineProps(this, {
                    $id: h++,
                    __initializing: !0
                }, !0, !1), this.init && (this.__initializing = !0, this.init.apply(this, arguments), 
                this.__initializing = !1);
            }
            function k() {}
            var m, n = arguments.length;
            if (1 == n) {
                if (a instanceof Function) return a(e, f, g);
                b = c, i = a, a = null;
            } else 2 == n && (i = b, b = "string" == typeof a ? c : a);
            "string" == typeof a && a.indexOf(".") && (m = a.split("."), a = m.pop(), m = m.join("."));
            var o, p, q = i.properties, r = i.methods, s = i.statics, t = i.validation, u = i.singleton;
            k.prototype = b.prototype, o = new k(), f.defineProps(o, {
                $id: 0,
                __initializing: !1,
                $superClass: b,
                constructor: j,
                $name: i.name || a || "Anonymous",
                validation: t
            }, !0, !1), j.$superClass = o.$superClass, j.$name = o.$name, j.prototype = o;
            var v, w, x;
            for (p in q) x = null, v = q[p], v && v.$name && (x = v, v = null), w = d(j.prototype, p, v), 
            x && (w.cls = x), q[p] = w;
            o.$props && (q = l({}, o.$props, q)), d(j.prototype, "$props", {
                writable: !1,
                configurable: !1,
                enumerable: !1,
                value: q
            });
            for (p in r) o[p] && (r[p]._super = o[p]), Object.defineProperty(j.prototype, p, {
                writable: !1,
                configurable: !1,
                enumerable: !1,
                value: r[p]
            });
            for (p in s) Object.defineProperty(j, p, {
                writable: !1,
                configurable: !1,
                enumerable: !0,
                value: s[p]
            });
            if (u && (j = new j()), a) {
                var y = e;
                m && (y = f.get(m, null, !0)), y[a] = j;
            }
            return o = null, j;
        },
        defineAPI: function(b, c) {
            if ("string" == typeof b) {
                var c = c.call(this, a.Moxtra, f, g);
                Object.defineProperty(e, b, {
                    value: c,
                    writable: !1,
                    configurable: !1
                });
            } else f.defineProps(e, b, !1, !0);
        }
    }, !0, !0), a.Moxtra = e;
}(window), Moxtra.define(function(a, b) {
    function c(a, b) {
        var c, f = d;
        if (b = b || {}, Array.isArray(a)) a.forEach(function(a) {
            c = a, b.formatKey && (c = b.formatKey(c)), f.value = a, Object.defineProperty(e, c, f);
        }); else for (c in a) f.value = a[c], b.formatKey && (c = b.formatKey(c)), Object.defineProperty(e, c, f);
    }
    var d = {
        enumerable: !1,
        writable: !1,
        configurable: !1,
        value: null
    }, e = Object.create(null);
    d.value = {}, Object.defineProperty(e, "__map__", d), c([ "PAGE_TYPE_WHITEBOARD", "PAGE_TYPE_NOT_SUPPORTED", "PAGE_TYPE_IMAGE", "PAGE_TYPE_WEB", "PAGE_TYPE_VIDEO", "PAGE_TYPE_AUDIO", "PAGE_TYPE_PDF", "PAGE_TYPE_URL", "PAGE_TYPE_NOTE", "PAGE_TYPE_DESKTOPSHARE", "PAGE_TYPE_ANY" ]), 
    c([ "BOARD_MEMBER", "BOARD_INVITED", "BOARD_MEMBER_REQUESTED", "BOARD_VISITED" ]), 
    c([ "GROUP_INVITED", "GROUP_MEMBER" ]), c([ "BOARD_NO_ACCESS", "BOARD_READ", "BOARD_READ_WRITE", "BOARD_OWNER" ]), 
    c([ "GROUP_MEMBER_ACCESS", "GROUP_ADMIN_ACCESS", "GROUP_OWNER_ACCESS" ]), c([ "GROUP_TRIAL_SUBSCRIPTION", "GROUP_NORMAL_SUBSCRIPTION", "GROUP_CANCELED_SUBSCRIPTION", "GROUP_EXPIRED_SUBSCRIPTION" ]), 
    c([ "SESSION_ENDED", "SESSION_SCHEDULED", "SESSION_STARTED" ]), c([ "RESPONSE_SUCCESS" ]);
    var f = [ "FEED_INVALID", "FEED_RELATIONSHIP_JOIN", "FEED_RELATIONSHIP_LEAVE", "FEED_RELATIONSHIP_INVITE", "FEED_RELATIONSHIP_DECLINE", "FEED_RELATIONSHIP_CANCEL", "FEED_RELATIONSHIP_REMOVE", "FEED_RELATIONSHIP_CHANGE_ROLE", "FEED_EMAIL_RECEIVE", "FEED_TODO_CREATE", "FEED_TODO_UPDATE", "FEED_TODO_DELETE", "FEED_TODO_ASSIGN", "FEED_TODO_COMMENT", "FEED_TODO_ATTACHMENT", "FEED_TODO_DUE_DATE", "FEED_TODO_COMPLETE", "FEED_TODO_REOPEN", "FEED_TODO_DUE_DATE_ARRIVE", "FEED_BOARD_CREATE", "FEED_BOARD_NAME_CHANGE", "FEED_BOARD_COMMENT", "FEED_PAGES_CREATE", "FEED_PAGES_CREATE_WITH_ANNOTATION", "FEED_PAGES_ANNOTATION", "FEED_PAGES_VIEW", "FEED_PAGES_DELETE", "FEED_PAGES_COMMENT", "FEED_PAGES_UPDATE", "FEED_PAGES_RENAME", "FEED_PAGES_RECYCLE", "FEED_PAGES_MOVE", "FEED_FOLDER_CREATE", "FEED_FOLDER_RENAME", "FEED_FOLDER_RECYCLE", "FEED_FOLDER_DELETE", "FEED_SESSION_SCHEDULE", "FEED_SESSION_RESCHEDULE", "FEED_SESSION_START", "FEED_SESSION_END", "FEED_SESSION_RECORDING_READY", "FEED_SESSION_CANCEL", "FEED_SESSION_RENAME", "FEED_PIN" ], g = new RegExp(f.join("|"));
    b.isSupportFeed = function(a) {
        return g.test(a);
    }, c(f), c([ "BOARD_RESOURCE_STATUS_QUEUED", "BOARD_RESOURCE_STATUS_CONVERTING", "BOARD_RESOURCE_STATUS_CONVERTED", "BOARD_RESOURCE_STATUS_CONVERT_FAILED" ]), 
    c([ "BOARD_RESOURCE_SESSION_AS_VIDEO" ]), c([ "USER_TYPE_NORMAL", "USER_TYPE_FORCE", "USER_TYPE_SSO", "USER_TYPE_WEIBO", "USER_TYPE_TENCENT", "USER_TYPE_GOOGLE", "USER_TYPE_FACEBOOK" ]), 
    c([ "USER_TYPE_SERVICE" ]), c([ "GROUP_TYPE_TEAM" ]), c([ "GROUP_INTEGRATION_SALESFORCE", "GROUP_INTEGRATION_SAML" ]), 
    c([ "RECORDING_STOPPED", "RECORDING_STARTED", "RECORDING_PAUSED", "RECORDING_RESUMED", "RECORDING_SAVED" ]), 
    c([ "RESPONSE_ERROR_INVALID_TOKEN", "RESPONSE_ERROR_PERMISSION", "RESPONSE_ERROR_INVALID_REQUEST" ]), 
    c([ "pro-monthly", "pro-annual", "standard-monthly", "standard-annual" ], {
        formatKey: function(a) {
            return a.toUpperCase().replace("-", "_");
        }
    }), c({
        LIMITED_COMMENTS_DELETE_TIME: 2592e5,
        LIMITED_TODO_FEED_SUPPRESS: 18e4
    }), c({
        PAGE_ELEMENT_TYPE_UNDEFINED: 0,
        PAGE_ELEMENT_TYPE_ARROW: 10,
        PAGE_ELEMENT_TYPE_DOUBLE_ARROW: 20,
        PAGE_ELEMENT_TYPE_SIGNATURE: 30,
        PAGE_ELEMENT_TYPE_AUDIO_TAG: 40,
        PAGE_ELEMENT_TYPE_TEXT_TAG: 50
    }), c({
        BackSpace: 8,
        Tab: 9,
        Clear: 12,
        Enter: 13,
        Shift: 16,
        Control: 17,
        Alt: 18,
        Pause: 19,
        Caps_Lock: 20,
        Escape: 27,
        space: 32,
        Next: 34,
        End: 35,
        Home: 36,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Select: 41,
        Execute: 43,
        Insert: 45,
        Delete: 46,
        Help: 47,
        Z: 90,
        R: 82
    }, {
        formatKey: function(a) {
            return "KEYBOARD_" + a;
        }
    }), c([ "EVENT_DATA_ADD", "EVENT_DATA_REMOVE", "EVENT_DATA_CHANGE", "EVENT_DATA_SORT", "EVENT_DATA_INITED", "EVENT_UI_RENDERED", "EVENT_UI_UPDATE_PAGE", "EVENT_DATA_MODEL_CHANGE", "EVENT_FIRST_SUBSCRIBE", "EVENT_FEED_CHANGE", "EVENT_SYNC_START", "EVENT_SYNC_END" ]);
    var h = d;
    h.value = "c_user", Object.defineProperty(e, "COOKIE_USER_ID", h), h.value = e, 
    Object.defineProperty(a, "const", h);
}), Moxtra.define(function(a, b, c) {
    var d = {}, e = {}, f = {}, g = {
        core: {}
    }, h = {}, i = {}, j = /\${([\w\.$-]+)(?:\:([\w\.$]*)(?:\((.*?)?\))?)?\}/g, k = /\{{([\w-]+)(?:\:([\w]*)(?:\((.*?)?\))?)?\}}/g;
    b.defineProps(b, {
        proxy: function(a, b) {
            return function() {
                return a.apply(b, [].slice.call(arguments));
            };
        },
        configStorage: function(a, c) {
            b.isString(a) && c ? i[a] = c : b.extend(i, a);
        },
        storage: function(b, c) {
            return c || (c = i[b] || {}), c.name = b, e[b] ? (e[b].load(), e[b]) : e[b] = new a.Storage(c);
        },
        processor: function(a, b) {
            if (!b) {
                if (!d[a]) throw "Not find formater " + a;
                return d[a];
            }
            d[a] = b;
        },
        getCacheClass: function(a, b) {
            var c = g.core;
            if (!b) return c[a];
            var d, e = g[a];
            return e && (d = e[b]) ? c[d] : null;
        },
        saveCacheClass: function(c) {
            var d, e, i, j, k, l = c.$name, m = g[l], n = g.core, o = f[l];
            if (m || (m = g[l] = {}, h[l] = new a.util.Array()), e = o.attributeId || c.attributeId, 
            e && e.indexOf(".") > 0 ? e = b.get(e, c) : e && (e = c[e]), !e) throw "cannot get the cache Key for class " + c;
            if (i = h[l], i.indexOf(e) >= 0) return i.remove(e), void i.push(e);
            if (o.instanceCount && o.instanceCount <= i.length) {
                k = i[0];
                var p = a.getMe();
                p.hasSubscribe(k) || (i.shift(), d = m[k], d && (j = n[d], j && j.destroy(), m[k] = null, 
                n[j.$id] = null));
            }
            m[e] = c.$id, n[c.$id] = c, i.push(e);
        },
        removeCacheClass: function(a, c) {
            if (!_.isString(a)) {
                var d = a;
                a = d.$name;
                var e = f[a];
                c = e.attributeId || d.attributeId, c && c.indexOf(".") > 0 ? c = b.get(c, d) : c && (c = d[c]);
            }
            var i, j, k = g[a], l = h[a];
            k && (j = k[c], i = g.core, i[j] = null, l.remove(c), k[c] = null);
        },
        cache: function(a, d, g) {
            var h, g = g || a;
            if (d && (g = g + "_" + d.$id), h = e[g]) return d && !h.owner && (h.owner = d), 
            h;
            var i = f[a], j = c.Collection;
            return i ? (i = _.extend({}, i), i.collection && (j = b.get(i.collection))) : i = {}, 
            e[g] = new j(_.extend(i, {
                owner: d || null
            })), e[g];
        },
        createCache: function(a, d, g) {
            var g = g || a;
            d = d || {};
            var h, i, j = d.owner;
            if (j && (g += j[j.attributeId] || j.$id, (i = j.parent) && (g += i.$id)), h = e[g]) return j && !h.owner && (h.owner = j), 
            h;
            var k = f[a], l = c.Collection;
            return k ? (k = _.extend({}, k), k.collection && (l = b.get(k.collection))) : k = {}, 
            e[g] = new l(_.extend(k, d)), e[g];
        },
        clearCache: function(a) {
            var b;
            a && (b = "_" + a.$id), _.each(e, function(a, c) {
                (!b || b && c.indexOf(b) > 0) && a.destroy && a.destroy();
            }), e = {};
        },
        configCache: function(a) {
            f = a;
        },
        getConfig: function(a) {
            return f[a];
        },
        isDefine: function(a) {
            return !(void 0 === a);
        },
        createClass: function() {},
        set: function(a, b, c) {
            var d = a.split("."), e = d.pop(), a = d.join("."), f = this.get(a, c, !0);
            return f[e] = b, c;
        },
        get: function(a, c, d) {
            var e;
            if (!a) return void 0;
            if (c || (c = window), a.indexOf(".") < 0) {
                if (void 0 === (e = c[a])) {
                    if (!d) return void 0;
                    e = c[a] = {};
                }
                return e;
            }
            var f = a.split("."), g = f.pop(), h = c;
            return b.each(f, function(a) {
                h[a] ? h = h[a] : d ? (h[a] = {}, h = h[a]) : h = {};
            }), e = h[g], !e && d && (h[g] = {}, e = h[g]), e;
        },
        copy: function(a, c, d) {
            b.each(c, function(b) {
                void 0 != a[b] && (d[b] = a[b]);
            });
        },
        pathToTree: function(a, c) {
            var d = a.split("."), e = {}, f = d.pop();
            b.each(d, function(a, b) {
                0 == d[b + 1], e[a] = {};
            }), e[f] = c;
        },
        isNull: function(a) {
            return null === a;
        },
        isObject: function(a) {
            return "object" == typeof a && a === Object(a);
        },
        isUndefined: function(a) {
            return void 0 === a;
        },
        format: function(a, c) {
            var d, e = arguments;
            if (a = a || "", 2 === e.length) if (Array.isArray(c)) d = c; else {
                if (b.isObject(c)) {
                    var f = function(a, d) {
                        var e = c[d];
                        return b.isDefine(e) ? e : a;
                    };
                    return a.indexOf("${") >= 0 ? a.replace(j, f) : a.replace(k, f);
                }
                d = slice.call(arguments, 1);
            } else d = slice.call(arguments, 1);
            return a.replace(/\{(\d+)\}/g, function(a, b) {
                return d[b];
            });
        },
        cookie: function(a, b, c) {
            if ("undefined" == typeof b) {
                var d = null;
                if (document.cookie && "" != document.cookie) for (var e = document.cookie.split(";"), f = 0; f < e.length; f++) {
                    var g = jQuery.trim(e[f]);
                    if (g.substring(0, a.length + 1) == a + "=") {
                        d = decodeURIComponent(g.substring(a.length + 1));
                        break;
                    }
                }
                return d;
            }
            c = c || {}, null === b && (b = "", c = $.extend({}, c), c.expires = -1);
            var h = "";
            if (c.expires && ("number" == typeof c.expires || c.expires.toUTCString)) {
                var i;
                "number" == typeof c.expires ? (i = new Date(), i.setTime(i.getTime() + 24 * c.expires * 60 * 60 * 1e3)) : i = c.expires, 
                h = "; expires=" + i.toUTCString();
            }
            void 0 === c.needEncode && (c.needEncode = !0);
            var j = c.path ? "; path=" + c.path : "", k = c.domain ? "; domain=" + c.domain : "", l = c.secure ? "; secure" : "";
            document.cookie = [ a, "=", c.needEncode ? encodeURIComponent(b) : b, h, j, k, l ].join("");
        },
        lang: function(a) {
            return MX.lang[a] || "";
        },
        makeUrl: function(a, c) {
            var d, e, f = [];
            for (d in c) e = b.getQueryString(a, d), e && e === c[d] || f.push(d + "=" + encodeURIComponent(c[d]));
            return f.length && (a += a.indexOf("?") > -1 ? "&" : "?", a += f.join("&")), a;
        },
        makeAccessTokenUrl: function(c, d) {
            var e = b.storage("integration").get("access_token"), f = a.getMe().sessionId, g = location.href.toString(), d = d || {};
            if (c) {
                if (c = b.makeUrl(c, {
                    sessionid: f
                }), e) c.indexOf("access_token") < 0 && (c = b.makeUrl(c, {
                    access_token: e
                })); else if (d.ignorePublicView) return c;
                if (c.indexOf("t=") < 0 && (g = g.match(/#[\/]?(?:api\.ui\.public)?view\/([^\/]+)/i)) && g.length > 1) {
                    var h = b.getQueryParams(g[0]), i = g[1];
                    i.indexOf("?") > 0 && (i = i.substring(0, i.indexOf("?"))), h.t = i, c = b.makeUrl(c, h);
                }
            }
            return c;
        },
        getQueryParams: function(a) {
            var b, c = {}, d = [];
            return a ? (b = new RegExp("(.*)=(.*)", "i"), a = a.substring(a.indexOf("?") + 1, a.length), 
            d = a.split("&") || [], d.forEach(function(a) {
                var d = a.match(b);
                d && (c[unescape(d[1])] = unescape(d[2]));
            }), c) : c;
        },
        getQueryString: function(a, b) {
            a = a.substring(a.indexOf("?") + 1, a.length);
            var c = new RegExp("(^|&)" + b + "=([^&]*)(&|$)", "i"), d = a.match(c);
            return d ? unescape(d[2]) : null;
        },
        getPublicViewToken: function() {
            var a, b;
            return a = location.href.toString(), b = a.match(/#[\/]?view\/([^\/]+)/), b && b.length > 1 ? b[1] : null;
        },
        wait: function(a, c, d) {
            return a() || 0 >= d ? c() : void setTimeout(function() {
                b.wait(a, c, d - 300);
            }, d);
        }
    }, !1, !1);
    var l = Object.prototype.toString;
    b.each([ "Function", "String", "Boolean", "Date", "Number" ], function(a) {
        b["is" + a] = function(b) {
            return l.call(b) === "[object " + a + "]";
        };
    }), b.isFun = b.isFunction, a.cookie = b.cookie, a.storage = b.storage, a.chatDraft = {}, 
    c.caches = e, a.cache = b.cache, a.util = b;
}), Moxtra.define(function(a, b, c) {
    c.Collection = a.define("Moxtra.Collection", Array, {
        properties: {
            inited: {
                enumerable: !1,
                value: !1
            },
            removeDeleted: {
                enumerable: !1,
                value: !0
            },
            removedFlag: {
                enumerable: !1,
                value: [ "is_deleted" ]
            },
            totalRecords: 0,
            loadedRecords: 0,
            hasNextPage: {
                get: function() {
                    return this.cacheData ? this.cacheData.length > 0 : !1;
                }
            }
        },
        methods: {
            init: function(a) {
                a = a || {}, b.copy(a, [ "storage", "attributeId", "index", "model", "owner", "comparator", "removeDeleted", "isClone", "removedFlag", "maxPageCount", "reverseOrder", "preFilter", "unique", "clearBeforeInit" ], this), 
                this.opts = a, this.index && !Array.isArray(this.index) && (this.index = [ this.index ]), 
                this.storage || (this.storage = sessionStorage), a.filterFn && this.filter(a.filterFn), 
                a.sortFn && this.sort(a.sortFn), this.map = {}, this.model && (this.model = b.get(this.model));
            },
            find: function(a) {
                if (!this.length) return null;
                var c, d = null, e = this.getIndexFields();
                c = b.isObject(a) ? function(b, c) {
                    return a[b] == c;
                } : function(b, c) {
                    return a == c;
                };
                var f, g, h = e.length;
                return this.each(function(a) {
                    for (g = 0; h > g; g++) f = b.get(e[g], a), c(e[g], f) && (d = a);
                }), d;
            },
            getFromAll: function(a) {
                var c, d = a;
                return b.isObject(d) && (d = b.get(this.attributeId, a)), (c = this.get(d)) ? c : (c = this.getDataFromCache(d, this.attributeId)) ? this.push(c) : void 0;
            },
            get: function(a) {
                var c;
                if (a) {
                    if (b.isObject(a)) {
                        var d, e = this.getIndexFields(), f = 0, g = e.length;
                        for (c = a; g > f; f++) if (d = b.get(e[f], c), d && this.map[d]) return this.map[d];
                    } else if (c = this.map[a]) return c;
                    return null;
                }
                return null;
            },
            set: function(b, c) {
                var d = this.map[b];
                d && d instanceof a.model.Model ? d.parse(c) : this.push(c);
            },
            jumpTo: function(a, b) {
                var c, d, e = this.cacheData;
                if (!a || !e || !e.length) return void this.trigger("PageLoaded", "jump");
                for (c = 0; c < e.length; c++) if (e[c].sequence === a) {
                    d = c;
                    break;
                }
                if (d) {
                    for (e = this.cacheData.splice(d, e.length - 1), c = e.length - 1; c >= 0; c--) this.pushItem(e[c], 0, b, !0);
                    this.filter(), this.sort();
                }
                this.trigger("PageLoaded", "jump");
            },
            loadNextPage: function(a) {
                var b;
                if (this.hasNextPage && this.cacheData) {
                    var c, d = this.cacheData.length, e = d > this.maxPageCount ? this.maxPageCount : d;
                    if (c = e > d ? this.cacheData : this.reverseOrder ? this.cacheData.splice(0, e) : this.cacheData.splice(d - e, e), 
                    this.reverseOrder) for (b = 0; b < c.length; b++) this.pushItem(c[b], 0, a); else for (b = c.length - 1; b >= 0; b--) this.pushItem(c[b], 0, a, !0);
                    this.filter(), this.sort(), this.trigger("PageLoaded");
                }
            },
            getDataFromCache: function(a, c, d) {
                var e;
                if (c = c || this.attributeId, !this.cacheData) return null;
                for (var f = 0; f < this.cacheData.length; f++) if (b.get(c, this.cacheData[f]) === a) return d ? (e = this.cacheData.splice(f, 1), 
                e[0]) : e = this.cacheData[f];
                return null;
            },
            include: function(a, b) {
                if (this.inited) {
                    if (!this[b]) {
                        var c = this.getDataFromCache(b, a, !0);
                        c && this.push(c);
                    }
                } else this._includes = {
                    key: a,
                    val: b
                };
            },
            push: function(a, b) {
                var c, d, e = this;
                if (a.forEach) {
                    if (b) {
                        if (this.clearBeforeInit !== !1 && this.clear(), this.preFilter) for (var f = a.length - 1; f >= 0; f--) this.filterFn(a[f]) === !1 && a.splice(f, 1);
                        c = a.length, this.maxPageCount && c > this.maxPageCount && (this.totalRecords = c, 
                        this.cacheData = this.reverseOrder ? a.splice(this.maxPageCount, c - this.maxPageCount) : a.splice(0, c - this.maxPageCount));
                        var g = this._includes;
                        if (g) {
                            var h = this.getDataFromCache(g.val, g.key);
                            this._includes = null, h && a.push(h);
                        }
                    }
                    a.forEach(function(a) {
                        e.pushItem(a, b);
                    }), this.sort(), this.inited ? this.trigger("push", a) : (this.inited = !0, this.trigger("inited"), 
                    0 === e.length && this.trigger("empty"));
                } else d = this.pushItem(a, b), this.sort(), this.inited || 1 !== this.length || (this.inited = !0, 
                this.trigger("inited"));
                return this.trigger("all"), d;
            },
            pushItem: function(a, d, e, f) {
                var g, h = b.get(this.attributeId || this.model.prototype.attributeId, a), i = this, j = !1;
                g = this.get(h ? h : a);
                var k = !1;
                if ((this.removeDeleted && this.isRemoved(a) || this.filterFn && !this.filterFn(a)) && (j = !0), 
                g) {
                    if (j) return g.parse(a), void this.remove(g);
                } else g = a.$name ? a : c.getInstance({
                    model: this.model,
                    data: a,
                    parent: this.owner,
                    attributeId: this.attributeId,
                    unique: this.unique
                }), k = !0;
                if (k || a.$name || g.parse(a, d === c.status.isAllFullData ? d : !1), !k) return "BoardUser" === g.$name && this.buildIndex(g), 
                g;
                if (j) return g;
                if (f ? Array.prototype.splice.call(this, 0, 0, g) : Array.prototype.push.call(this, g), 
                g.link(this), !d) {
                    if (this.inited && k) {
                        var l = e ? "insert" : "add";
                        this.trigger(l, g);
                    }
                    this.trigger("change"), i.bubble("change", g);
                }
                return this.buildIndex(g), g.changed = {}, g;
            },
            buildIndex: function(a) {
                var c = this;
                b.each(this.getIndexFields(), function(d) {
                    (d = b.get(d, a)) && (c.map[d] && a.is_deleted || (c.map[d] = a));
                });
            },
            isRemoved: function(a) {
                var c = !1;
                return this.removedFlag && this.removedFlag.forEach(function(d) {
                    b.get(d, a) && (c = !0);
                }), c;
            },
            getIndexFields: function() {
                var a = [];
                this.index && (a = [].slice.call(this.index));
                var b = this.attributeId || this.model && this.model.prototype.attributeId;
                return a.push(b, "client_uuid"), a;
            },
            clear: function() {
                this.map = {}, this.splice(0, this.length), this.cacheData = null, this.trigger("empty"), 
                this.inited = !1;
            },
            remove: function(a) {
                var c, d, e = this;
                a && (b.isString(a) || b.isNumber(a) ? c = this.map[a] : a.$name ? c = a : b.each(this.getIndexFields(), function(f) {
                    (d = b.get(f, a)) && (e.map[d] && (c = e.map[d]), delete e.map[d]);
                }), c ? b.each(this, function(a, f) {
                    return c == a ? (e.splice(f, 1), e.trigger("remove", a, e, {
                        index: f
                    }), e.trigger("change"), e.notify("remove", a, e, {
                        index: f
                    }), e.bubble("change", a), b.each(e.getIndexFields(), function(c) {
                        (d = b.get(c, a)) && delete e.map[d];
                    }), !1) : void 0;
                }) : this.cacheData && b.each(this.cacheData, function(b, c) {
                    b[e.attributeId] == a && e.cacheData.splice(c, 1);
                }), this.length || this.trigger("empty"), this.trigger("all"));
            },
            filter: function(a) {
                a && (this.filterFn = b.isFunction(a) ? a : function(c) {
                    var d, e = !0;
                    return b.each(a, function(a, f) {
                        return b.isFunction(a) ? void (0 == a(b.get(f, c)) && (e = !1)) : (d = b.get(f, c), 
                        void ("boolean" == typeof a ? (!a && d || !d && a) && (e = !1) : d != a && (e = !1)));
                    }), e;
                });
                var c = this;
                c.filterFn && this.each(function(a) {
                    c.filterFn(a) || c.remove(a);
                });
            },
            originalFilter: function(a) {
                return Array.prototype.filter.call(this, a);
            },
            doModelChange: function(a) {
                var b = this;
                if (b.filterFn && !b.filterFn(a)) return void this.remove(a);
                if (b.sortFn) {
                    var c = b.indexOf(a), d = b[c - 1], e = b[c + 1];
                    this.sortFn && (d && 1 == this.sortFn(d, a) || e && 1 == this.sortFn(a, e)) && this.sort();
                }
                this.trigger("modelChange", a);
            },
            _checkChangedModel: function(a) {
                var b = this;
                if (b.filterFn) if (b.filterFn(a)) if (b.get(a)) {
                    var c = this.indexOf(a), d = this[c - 1], e = this[c + 1];
                    this.sortFn && (d && 1 == this.sortFn(d, a) || e && 1 == this.sortFn(a, e)) && this.sort();
                } else b.push(a), this.sort(); else b.remove(a); else b.push(a);
            },
            sort: function(a) {
                if (a ? this.sortFn = a : a = this.sortFn, this.sortFn) {
                    var b = this;
                    Array.prototype.sort.call(b, b.sortFn), b.trigger("sort");
                }
            },
            reset: function() {
                this.clear();
            },
            each: function(a) {
                this.forEach(a);
            },
            eachAll: function(a) {
                var b, c = this.cacheData;
                if (this.length) for (b = this.length - 1; b >= 0; b--) if (a.call(this, this[b]) === !1) return;
                if (c && c.length) for (b = c.length - 1; b >= 0; b--) if (a.call(this, c[b]) === !1) return;
            },
            clone: function(b, c) {
                function d() {
                    var a = Array.prototype.slice.call(f, 0), b = [];
                    f.cacheData && (a = a.concat(f.cacheData)), g.filterFn && (a.forEach(function(a) {
                        g.filterFn(a) && b.push(a);
                    }), a = b), g.push(a, 1);
                }
                var e = _.extend({
                    isClone: !0
                }, this.opts), f = this;
                c = c !== !1, b && (e = _.extend(e, b));
                var g = new a.Collection(e);
                return c ? (this.on("remove", g.remove, g), this.on("push", function(a) {
                    var b;
                    Array.isArray(a) || a.forEach ? a.forEach(function(a) {
                        b = f.get(a), b ? g._checkChangedModel(b) : g.remove(a);
                    }) : (b = f.get(a), b ? g._checkChangedModel(b) : g.remove(a));
                }), this.on("modelChange", function(a) {
                    g._checkChangedModel(a);
                }), g.on("destroy", function() {
                    f.off(null, null, g);
                }), this.on("inited", d)) : this.once("inited", d), g;
            },
            destroy: function() {
                Array.prototype.splice(0, this.length), this.trigger("destroy");
            },
            notify: function(a, b) {
                this.isClone || c.Root.trigger(this.model.$name + ":" + a, b, this);
            },
            bubble: function(a) {
                this.inited && !this.isClone && this.owner && this.owner.trigger && (this.owner.changed[this.attrName] = !0, 
                this.owner.trigger(a + ":" + this.attrName));
            },
            at: function(a) {
                return this[a];
            }
        }
    }), _.extend(c.Collection.prototype, Backbone.Events), c.Collection.prototype.on = function(a, b, c) {
        "inited" === a && this.inited && (b.call(c || this), this.trigger("all")), this.on._super.call(this, a, b, c);
    }, c.Collection.prototype.on._super = Backbone.Events.on;
}), Moxtra.define(function(a, b, c) {
    var d = a.const;
    c.CacheCollection = a.define("Moxtra.CacheCollection", {
        properties: {
            inited: {
                enumerable: !1,
                value: !1
            },
            removeDeleted: {
                enumerable: !1,
                value: !0
            },
            removedFlag: {
                enumerable: !1,
                value: [ "is_deleted" ]
            },
            totalRecords: 0,
            length: {
                get: function() {
                    return this._data.length;
                }
            }
        },
        methods: {
            init: function(a) {
                var b = this;
                b.opts = a = a || {}, b._data = [], b.attributeId = a.attributeId || a.cache.attributeId, 
                a.copy !== !1 && b._copy(a.cache), a.sync !== !1 && b._link(a.cache);
            },
            _copy: function(a) {
                var c, d = this, e = d.opts.filterFn;
                a.each(function(a) {
                    (!e || e.call(d, a)) && (c = b.get(d.attributeId, a), d._data.push(c));
                }), d.opts.sortFn && d.sort(d.opts.sortFn), this.inited = !0;
            },
            _link: function(a) {
                var c, e = this, f = e.opts.filterFn;
                this.listenTo(a, d.EVENT_DATA_ADD, function(a) {
                    (!f || f.call(e, a)) && (c = b.get(e.attributeId, a), e._data.push(c), e.trigger(d.EVENT_DATA_ADD, c, a), 
                    e.sort(e.opts.sortFn));
                }), this.listenTo(a, d.EVENT_DATA_REMOVE, function(b) {
                    c = a.getKey(b), e.indexOf(c) >= 0 && e.remove(c, b);
                }), this.listenTo(a, d.EVENT_DATA_CHANGE, function(a) {
                    !f || f.call(e, a) ? (e.trigger(d.EVENT_DATA_CHANGE, a), e.sort(e.opts.sortFn)) : (c = b.get(e.attributeId, a), 
                    e.indexOf(c) >= 0 && e.remove(c, a));
                }), this.listenTo(a, d.EVENT_DATA_MODEL_CHANGE, function(b) {
                    c = a.getKey(b);
                    var g = !f || f.call(e, b), h = e.indexOf(c);
                    h >= 0 ? g ? (e.trigger(d.EVENT_DATA_MODEL_CHANGE, c, b), e.sort(e.opts.sortFn, !0), 
                    e.indexOf(c) !== h && _.delay(function() {
                        e.trigger(d.EVENT_DATA_SORT);
                    })) : e.remove(c, b) : g && (e._data.push(c), e.trigger(d.EVENT_DATA_ADD, c, b), 
                    e.sort(e.opts.sortFn));
                });
            },
            sort: function(a, b) {
                var c = this.opts.cache;
                Array.prototype.sort.call(this._data, function(b, d) {
                    return b = c.get(b), d = c.get(d), a(b, d);
                }), b || this.trigger(d.EVENT_DATA_SORT);
            },
            push: function(a) {
                var b, c = this, e = c.opts.cache, f = c.opts.filterFn;
                return Array.isArray(a) ? void a.forEach(function(a) {
                    c.push(a);
                }) : void ((b = e.get(a)) && f && f.call(c, b) && (c._data.push(a), this.trigger(d.EVENT_DATA_ADD, a, b)));
            },
            remove: function(a, b) {
                var c = this;
                a = this.getAttributeId(a), b || (b = c.opts.cache.get(a));
                for (var e = 0; e < c._data.length; e++) if (c._data[e] === a) {
                    c._data.splice(e, 1);
                    break;
                }
                b && c.trigger(d.EVENT_DATA_REMOVE, a, b, e);
            },
            destroy: function() {
                this.stopListening(this.opts.cache);
            },
            at: function(a) {
                return this.opts.cache.getModel(this._data[a]);
            },
            getAttributeId: function(a) {
                return a ? b.isObject(a) ? a[this.attributeId] : a : null;
            },
            each: function(a, b) {
                var c = this;
                b = b || c, this._data.forEach(function(d) {
                    a && a.call(b, c.get(d));
                });
            },
            get: function(a) {
                return this.opts.cache.getModel(a);
            },
            getJson: function(a) {
                return this.opts.cache.get(a);
            },
            getKey: function(a) {
                return this._data[a];
            },
            indexOf: function(a) {
                return this._data.indexOf(a);
            },
            on: function(a, b, c) {
                "inited" === a && this.inited && b.call(c || this), this.on._super.call(this, a, b, c);
            },
            getTransferJson: function(a, b) {
                return this.opts.cache.getTransferJson(a, b);
            },
            clone: function(c) {
                var d = this, e = d.opts.filterFn, f = function(a) {
                    return e.call(d, a) && c.filterFn.call(d, a);
                }, g = b.extend({}, d.opts, c, {
                    filterFn: f,
                    copy: !1
                }), h = new a.CacheCollection(g);
                return h.push(this._data), h._link(d.opts.cache), h;
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.util.Array", Array, {
        methods: {
            init: function(a) {
                this.opts = a || {};
            },
            remove: function(a) {
                for (var b = this.length; b > -1; b--) a === this[b] && this.splice(b, 1);
            },
            each: function(a) {
                this.forEach(a);
            },
            contain: function(a) {
                return this.indexOf(a) >= 0;
            },
            push: function(a) {
                var b = this.opts;
                return b.unique && this.contain(a) ? void (b.sort && this.sort(b.sort)) : (this.push._super.call(this, a), 
                void (b.sort && this.sort(b.sort)));
            },
            sort: function(a) {
                a = a || this.opts.sortFn, this.sort._super.call(this, a);
            }
        }
    });
}), Moxtra.define(function(a, b) {
    b.extend(b, {
        calcSize: function(a) {
            var b = parseInt(a);
            return b > -1 && 1024 > b ? b + " B" : b >= 1024 && 1048576 > b ? Math.round(Math.floor(b / 1024 * 1e3) / 100) / 10 + " KB" : b >= 1048576 && 1073741824 > b ? Math.round(Math.floor(b / 1048576 * 1e3) / 100) / 10 + " MB" : b >= 1073741824 ? Math.round(Math.floor(b / 1073741824 * 1e3) / 100) / 10 + " GB" : "";
        }
    });
}), Moxtra.define(function(a, b) {
    var c = [ {
        name: "Africa/Abidjan"
    }, {
        name: "Africa/Accra"
    }, {
        name: "Africa/Addis_Ababa"
    }, {
        name: "Africa/Algiers",
        display: "Central European Time (Africa/Algiers)"
    }, {
        name: "Africa/Asmera"
    }, {
        name: "Africa/Bamako"
    }, {
        name: "Africa/Bangui"
    }, {
        name: "Africa/Banjul"
    }, {
        name: "Africa/Bissau"
    }, {
        name: "Africa/Blantyre"
    }, {
        name: "Africa/Brazzaville"
    }, {
        name: "Africa/Bujumbura"
    }, {
        name: "Africa/Cairo",
        display: "Eastern European Standard Time (Africa/Cairo)",
        display_DST: "Eastern European Summer Time (Africa/Cairo)"
    }, {
        name: "Africa/Casablanca",
        display: "Western European Time (Africa/Casablanca)"
    }, {
        name: "Africa/Ceuta"
    }, {
        name: "Africa/Conakry"
    }, {
        name: "Africa/Dakar"
    }, {
        name: "Africa/Dar_es_Salaam"
    }, {
        name: "Africa/Djibouti"
    }, {
        name: "Africa/Douala"
    }, {
        name: "Africa/El_Aaiun"
    }, {
        name: "Africa/Freetown"
    }, {
        name: "Africa/Gaborone"
    }, {
        name: "Africa/Harare"
    }, {
        name: "Africa/Johannesburg",
        display: "South Africa Standard Time (Africa/Johannesburg)"
    }, {
        name: "Africa/Kampala"
    }, {
        name: "Africa/Khartoum"
    }, {
        name: "Africa/Kigali"
    }, {
        name: "Africa/Kinshasa"
    }, {
        name: "Africa/Lagos"
    }, {
        name: "Africa/Libreville"
    }, {
        name: "Africa/Lome"
    }, {
        name: "Africa/Luanda"
    }, {
        name: "Africa/Lubumbashi"
    }, {
        name: "Africa/Lusaka"
    }, {
        name: "Africa/Malabo"
    }, {
        name: "Africa/Maputo"
    }, {
        name: "Africa/Maseru"
    }, {
        name: "Africa/Mbabane"
    }, {
        name: "Africa/Mogadishu"
    }, {
        name: "Africa/Monrovia"
    }, {
        name: "Africa/Nairobi",
        display: "East Africa Time (Africa/Nairobi)"
    }, {
        name: "Africa/Ndjamena"
    }, {
        name: "Africa/Niamey"
    }, {
        name: "Africa/Nouakchott"
    }, {
        name: "Africa/Ouagadougou"
    }, {
        name: "Africa/Porto-Novo"
    }, {
        name: "Africa/Sao_Tome"
    }, {
        name: "Africa/Timbuktu"
    }, {
        name: "Africa/Tripoli"
    }, {
        name: "Africa/Tunis"
    }, {
        name: "Africa/Windhoek"
    }, {
        name: "America/Adak",
        display: "Hawaii-Aleutian Standard Time (America/Adak)",
        display_DST: "Hawaii-Aleutian Daylight Time (America/Adak)"
    }, {
        name: "America/Anchorage",
        display: "Alaska Standard Time (America/Anchorage)",
        display_DST: "Alaska Daylight Time (America/Anchorage)"
    }, {
        name: "America/Anguilla"
    }, {
        name: "America/Antigua"
    }, {
        name: "America/Araguaina"
    }, {
        name: "America/Aruba"
    }, {
        name: "America/Asuncion"
    }, {
        name: "America/Barbados"
    }, {
        name: "America/Belem"
    }, {
        name: "America/Belize"
    }, {
        name: "America/Boa_Vista"
    }, {
        name: "America/Bogota",
        display: "Colombia Time (America/Bogota)"
    }, {
        name: "America/Boise"
    }, {
        name: "America/Buenos_Aires",
        display: "Argentina Time (America/Argentina/Buenos_Aires)"
    }, {
        name: "America/Cambridge_Bay"
    }, {
        name: "America/Cancun"
    }, {
        name: "America/Caracas",
        display: "Venezuela Time (America/Caracas)"
    }, {
        name: "America/Catamarca"
    }, {
        name: "America/Cayenne"
    }, {
        name: "America/Cayman"
    }, {
        name: "America/Chicago",
        display: "Central Standard Time (America/Chicago)",
        display_DST: "Central Daylight Time (America/Chicago)"
    }, {
        name: "America/Chihuahua"
    }, {
        name: "America/Cordoba"
    }, {
        name: "America/Costa_Rica"
    }, {
        name: "America/Cuiaba"
    }, {
        name: "America/Curacao"
    }, {
        name: "America/Danmarkshavn"
    }, {
        name: "America/Dawson"
    }, {
        name: "America/Dawson_Creek"
    }, {
        name: "America/Denver",
        display: "Mountain Standard Time (America/Denver)",
        display_DST: "Mountain Daylight Time (America/Denver)"
    }, {
        name: "America/Detroit"
    }, {
        name: "America/Dominica"
    }, {
        name: "America/Edmonton"
    }, {
        name: "America/Eirunepe"
    }, {
        name: "America/El_Salvador",
        display: "Central Standard Time (America/El_Salvador)"
    }, {
        name: "America/Fortaleza"
    }, {
        name: "America/Glace_Bay"
    }, {
        name: "America/Godthab"
    }, {
        name: "America/Goose_Bay"
    }, {
        name: "America/Grand_Turk"
    }, {
        name: "America/Grenada"
    }, {
        name: "America/Guadeloupe"
    }, {
        name: "America/Guatemala"
    }, {
        name: "America/Guayaquil"
    }, {
        name: "America/Guyana"
    }, {
        name: "America/Halifax",
        display: "Atlantic Standard Time (America/Halifax)",
        display_DST: "Atlantic Daylight Time (America/Halifax)"
    }, {
        name: "America/Havana"
    }, {
        name: "America/Hermosillo"
    }, {
        name: "America/Indiana/Indianapolis",
        display: "Eastern Standard Time (America/Indiana/Indianapolis)"
    }, {
        name: "America/Indiana/Knox"
    }, {
        name: "America/Indiana/Marengo"
    }, {
        name: "America/Indiana/Vevay"
    }, {
        name: "America/Indianapolis"
    }, {
        name: "America/Inuvik"
    }, {
        name: "America/Iqaluit"
    }, {
        name: "America/Jamaica"
    }, {
        name: "America/Jujuy"
    }, {
        name: "America/Juneau"
    }, {
        name: "America/Kentucky/Louisville"
    }, {
        name: "America/Kentucky/Monticello"
    }, {
        name: "America/La_Paz"
    }, {
        name: "America/Lima",
        display: "Peru Time (America/Lima)"
    }, {
        name: "America/Los_Angeles",
        display: "Pacific Standard Time (America/Los_Angeles)",
        display_DST: "Pacific Daylight Time (America/Los_Angeles)"
    }, {
        name: "America/Louisville"
    }, {
        name: "America/Maceio"
    }, {
        name: "America/Managua"
    }, {
        name: "America/Manaus"
    }, {
        name: "America/Martinique"
    }, {
        name: "America/Mazatlan",
        display: "Mountain Standard Time (America/Mazatlan)",
        display_DST: "Mountain Daylight Time (America/Mazatlan)"
    }, {
        name: "America/Mendoza"
    }, {
        name: "America/Menominee"
    }, {
        name: "America/Merida"
    }, {
        name: "America/Mexico_City",
        display: "Central Standard Time (America/Mexico_City)"
    }, {
        name: "America/Miquelon"
    }, {
        name: "America/Monterrey"
    }, {
        name: "America/Montevideo"
    }, {
        name: "America/Montreal"
    }, {
        name: "America/Montserrat"
    }, {
        name: "America/Nassau"
    }, {
        name: "America/New_York",
        display: "Eastern Standard Time (America/New_York)",
        display_DST: "Eastern Daylight Time (America/New_York)"
    }, {
        name: "America/Nipigon"
    }, {
        name: "America/Nome"
    }, {
        name: "America/Noronha"
    }, {
        name: "America/North_Dakota/Center"
    }, {
        name: "America/Panama",
        display: "Eastern Standard Time (America/Panama)"
    }, {
        name: "America/Pangnirtung"
    }, {
        name: "America/Paramaribo"
    }, {
        name: "America/Phoenix",
        display: "Mountain Standard Time (America/Phoenix)"
    }, {
        name: "America/Port-au-Prince"
    }, {
        name: "America/Port_of_Spain"
    }, {
        name: "America/Porto_Velho"
    }, {
        name: "America/Puerto_Rico",
        display: "Atlantic Standard Time (America/Puerto_Rico)"
    }, {
        name: "America/Rainy_River"
    }, {
        name: "America/Rankin_Inlet"
    }, {
        name: "America/Recife"
    }, {
        name: "America/Regina"
    }, {
        name: "America/Rio_Branco"
    }, {
        name: "America/Rosario"
    }, {
        name: "America/Santiago",
        display: "Chile Standard Time (America/Santiago)",
        display_DST: "Chile Summer Time (America/Santiago)"
    }, {
        name: "America/Santo_Domingo"
    }, {
        name: "America/Sao_Paulo",
        display: "Brasilia Standard Time (America/Sao_Paulo)",
        display_DST: "Brasilia Summer Time (America/Sao_Paulo)"
    }, {
        name: "America/Scoresbysund",
        display: "East Greenland Standard Time (America/Scoresbysund)",
        display_DST: "East Greenland Summer Time (America/Scoresbysund)"
    }, {
        name: "America/Shiprock"
    }, {
        name: "America/St_Johns",
        display: "Newfoundland Standard Time (America/St_Johns)",
        display_DST: "Newfoundland Daylight Time (America/St_Johns)"
    }, {
        name: "America/St_Kitts"
    }, {
        name: "America/St_Lucia"
    }, {
        name: "America/St_Thomas"
    }, {
        name: "America/St_Vincent"
    }, {
        name: "America/Swift_Current"
    }, {
        name: "America/Tegucigalpa"
    }, {
        name: "America/Thule"
    }, {
        name: "America/Thunder_Bay"
    }, {
        name: "America/Tijuana",
        display: "Pacific Standard Time (America/Tijuana)",
        display_DST: "Pacific Daylight Time (America/Tijuana)"
    }, {
        name: "America/Tortola"
    }, {
        name: "America/Vancouver"
    }, {
        name: "America/Whitehorse"
    }, {
        name: "America/Winnipeg"
    }, {
        name: "America/Yakutat"
    }, {
        name: "America/Yellowknife"
    }, {
        name: "Antarctica/Casey"
    }, {
        name: "Antarctica/Davis"
    }, {
        name: "Antarctica/DumontDUrville"
    }, {
        name: "Antarctica/Mawson"
    }, {
        name: "Antarctica/McMurdo"
    }, {
        name: "Antarctica/Palmer"
    }, {
        name: "Antarctica/South_Pole"
    }, {
        name: "Antarctica/Syowa"
    }, {
        name: "Antarctica/Vostok"
    }, {
        name: "Arctic/Longyearbyen"
    }, {
        name: "Asia/Aden"
    }, {
        name: "Asia/Almaty"
    }, {
        name: "Asia/Amman"
    }, {
        name: "Asia/Anadyr"
    }, {
        name: "Asia/Aqtau"
    }, {
        name: "Asia/Aqtobe"
    }, {
        name: "Asia/Ashgabat"
    }, {
        name: "Asia/Baghdad",
        display: "Arabian Standard Time (Asia/Baghdad)",
        display_DST: "Arabian Daylight Time (Asia/Baghdad)"
    }, {
        name: "Asia/Bahrain"
    }, {
        name: "Asia/Baku",
        display: "Azerbaijan Standard Time (Asia/Baku)",
        display_DST: "Azerbaijan Summer Time (Asia/Baku)"
    }, {
        name: "Asia/Bangkok",
        display: "Indochina Time (Asia/Bangkok)"
    }, {
        name: "Asia/Shanghai",
        display: "China Standard Time (Asia/Beijing)"
    }, {
        name: "Asia/Beirut",
        display: "Eastern European Standard Time (Asia/Beirut)",
        display_DST: "Eastern European Summer Time (Asia/Beirut)"
    }, {
        name: "Asia/Bishkek"
    }, {
        name: "Asia/Brunei"
    }, {
        name: "Asia/Calcutta",
        display: "Asia/Kolkata"
    }, {
        name: "Asia/Choibalsan"
    }, {
        name: "Asia/Chongqing"
    }, {
        name: "Asia/Colombo",
        display: "India Standard Time (Asia/Colombo)"
    }, {
        name: "Asia/Damascus"
    }, {
        name: "Asia/Dhaka",
        display: "Bangladesh Time (Asia/Dhaka)"
    }, {
        name: "Asia/Dili"
    }, {
        name: "Asia/Dubai",
        display: "Gulf Standard Time (Asia/Dubai)"
    }, {
        name: "Asia/Dushanbe"
    }, {
        name: "Asia/Gaza"
    }, {
        name: "Asia/Harbin"
    }, {
        name: "Asia/Hong_Kong",
        display: "Hong Kong Time (Asia/Hong_Kong)"
    }, {
        name: "Asia/Hovd"
    }, {
        name: "Asia/Irkutsk"
    }, {
        name: "Asia/Istanbul"
    }, {
        name: "Asia/Jakarta",
        display: "Western Indonesia Time (Asia/Jakarta)"
    }, {
        name: "Asia/Jayapura"
    }, {
        name: "Asia/Jerusalem",
        display: "Israel Standard Time (Asia/Jerusalem)",
        display_DST: "Israel Daylight Time (Asia/Jerusalem)"
    }, {
        name: "Asia/Kabul",
        display: "Afghanistan Time (Asia/Kabul)"
    }, {
        name: "Asia/Kamchatka",
        display: "Magadan Standard Time (Asia/Kamchatka)",
        display_DST: "Magadan Summer Time (Asia/Kamchatka)"
    }, {
        name: "Asia/Karachi",
        display: "Pakistan Time (Asia/Karachi)"
    }, {
        name: "Asia/Kashgar"
    }, {
        name: "Asia/Katmandu"
    }, {
        name: "Asia/Krasnoyarsk"
    }, {
        name: "Asia/Kuala_Lumpur",
        display: "Malaysia Time (Asia/Kuala_Lumpur)"
    }, {
        name: "Asia/Kuching"
    }, {
        name: "Asia/Kuwait",
        display: "Arabian Standard Time (Asia/Kuwait)"
    }, {
        name: "Asia/Macao"
    }, {
        name: "Asia/Macau"
    }, {
        name: "Asia/Magadan"
    }, {
        name: "Asia/Makassar"
    }, {
        name: "Asia/Manila",
        display: "Philippine Time (Asia/Manila)"
    }, {
        name: "Asia/Muscat"
    }, {
        name: "Asia/Nicosia"
    }, {
        name: "Asia/Novosibirsk"
    }, {
        name: "Asia/Omsk"
    }, {
        name: "Asia/Oral"
    }, {
        name: "Asia/Phnom_Penh"
    }, {
        name: "Asia/Pontianak"
    }, {
        name: "Asia/Pyongyang"
    }, {
        name: "Asia/Qyzylorda"
    }, {
        name: "Asia/Qatar"
    }, {
        name: "Asia/Rangoon",
        display: "Myanmar Time (Asia/Rangoon)"
    }, {
        name: "Asia/Riyadh",
        display: "Arabian Standard Time (Asia/Riyadh)"
    }, {
        name: "Asia/Saigon"
    }, {
        name: "Asia/Sakhalin"
    }, {
        name: "Asia/Samarkand"
    }, {
        name: "Asia/Seoul",
        display: "Korean Standard Time (Asia/Seoul)"
    }, {
        name: "Asia/Singapore",
        display: "Singapore Standard Time (Asia/Singapore)"
    }, {
        name: "Asia/Taipei",
        display: "Taipei Standard Time (Asia/Taipei)"
    }, {
        name: "Asia/Tashkent",
        display: "Uzbekistan Time (Asia/Tashkent)"
    }, {
        name: "Asia/Tbilisi",
        display: "Georgia Standard Time (Asia/Tbilisi)",
        display_DST: "Georgia Summer Time (Asia/Tbilisi)"
    }, {
        name: "Asia/Tehran",
        display: "Iran Standard Time (Asia/Tehran)"
    }, {
        name: "Asia/Thimphu"
    }, {
        name: "Asia/Tokyo",
        display: "Japan Standard Time (Asia/Tokyo)"
    }, {
        name: "Asia/Ujung_Pandang"
    }, {
        name: "Asia/Ulaanbaatar"
    }, {
        name: "Asia/Urumqi"
    }, {
        name: "Asia/Vientiane"
    }, {
        name: "Asia/Vladivostok"
    }, {
        name: "Asia/Yakutsk"
    }, {
        name: "Asia/Yekaterinburg",
        display: "Yekaterinburg Standard Time (Asia/Yekaterinburg)",
        display_DST: "Yekaterinburg Summer Time (Asia/Yekaterinburg)"
    }, {
        name: "Asia/Yerevan",
        display: "Armenia Standard Time (Asia/Yerevan)",
        display_DST: "Armenia Summer Time (Asia/Yerevan)"
    }, {
        name: "Atlantic/Azores",
        display: "Azores Standard Time (Atlantic/Azores)",
        display_DST: "Azores Summer Time (Atlantic/Azores)"
    }, {
        name: "Atlantic/Bermuda",
        display: "Atlantic Standard Time (Atlantic/Bermuda)",
        display_DST: "Atlantic Daylight Time (Atlantic/Bermuda)"
    }, {
        name: "Atlantic/Canary"
    }, {
        name: "Atlantic/Cape_Verde",
        display: "Cape Verde Time (Atlantic/Cape_Verde)"
    }, {
        name: "Atlantic/Faeroe"
    }, {
        name: "Atlantic/Jan_Mayen"
    }, {
        name: "Atlantic/Madeira"
    }, {
        name: "Atlantic/Reykjavik"
    }, {
        name: "Atlantic/South_Georgia",
        display: "South Georgia Time (Atlantic/South_Georgia)"
    }, {
        name: "Atlantic/St_Helena"
    }, {
        name: "Atlantic/Stanley"
    }, {
        name: "Australia/Adelaide",
        display: "Australian Central Standard Time (Australia/Adelaide)",
        display_DST: "Australian Central Daylight Time (Australia/Adelaide)"
    }, {
        name: "Australia/Brisbane",
        display: "Australian Eastern Standard Time (Australia/Brisbane)"
    }, {
        name: "Australia/Broken_Hill"
    }, {
        name: "Australia/Darwin",
        display: "Australian Central Standard Time (Australia/Darwin)"
    }, {
        name: "Australia/Hobart"
    }, {
        name: "Australia/Lindeman"
    }, {
        name: "Australia/Lord_Howe",
        display: "Lord Howe Standard Time (Australia/Lord_Howe)",
        display_DST: "Lord Howe Daylight Time (Australia/Lord_Howe)"
    }, {
        name: "Australia/Melbourne"
    }, {
        name: "Australia/Perth",
        display: "Australian Western Standard Time (Australia/Perth)"
    }, {
        name: "Australia/Sydney",
        display: "Australian Eastern Standard Time (Australia/Sydney)",
        display_DST: "Australian Eastern Daylight Time (Australia/Sydney)"
    }, {
        name: "Europe/Amsterdam",
        display: "Central European Standard Time (Europe/Amsterdam)",
        display_DST: "Central European Summer Time (Europe/Amsterdam)"
    }, {
        name: "Europe/Andorra"
    }, {
        name: "Europe/Athens",
        display: "Eastern European Standard Time (Europe/Athens)",
        display_DST: "Eastern European Summer Time (Europe/Athens)"
    }, {
        name: "Europe/Belfast"
    }, {
        name: "Europe/Belgrade"
    }, {
        name: "Europe/Berlin",
        display: "Central European Standard Time (Europe/Berlin)",
        display_DST: "Central European Summer Time (Europe/Berlin)"
    }, {
        name: "Europe/Bratislava"
    }, {
        name: "Europe/Brussels",
        display: "Central European Standard Time (Europe/Brussels)",
        display_DST: "Central European Summer Time (Europe/Brussels)"
    }, {
        name: "Europe/Bucharest",
        display: "Eastern European Standard Time (Europe/Bucharest)",
        display_DST: "Eastern European Summer Time (Europe/Bucharest)"
    }, {
        name: "Europe/Budapest"
    }, {
        name: "Europe/Chisinau"
    }, {
        name: "Europe/Copenhagen"
    }, {
        name: "Europe/Dublin",
        display: "Irish Standard Time (Europe/Dublin)",
        display_DST: "Irish Summer Time (Europe/Dublin)"
    }, {
        name: "Europe/Gibraltar"
    }, {
        name: "Europe/Helsinki",
        display: "Eastern European Standard Time (Europe/Helsinki)",
        display_DST: "Eastern European Summer Time (Europe/Helsinki)"
    }, {
        name: "Europe/Istanbul",
        display: "Eastern European Standard Time (Europe/Istanbul)",
        display_DST: "Eastern European Summer Time (Europe/Istanbul)"
    }, {
        name: "Europe/Kaliningrad"
    }, {
        name: "Europe/Kiev"
    }, {
        name: "Europe/Lisbon",
        display: "Western European Standard Time (Europe/Lisbon)",
        display_DST: "Western European Summer Time (Europe/Lisbon)"
    }, {
        name: "Europe/Ljubljana"
    }, {
        name: "Europe/London",
        display: "British Standard Time (Europe/London)",
        display_DST: "British Summer Time (Europe/London)"
    }, {
        name: "Europe/Luxembourg"
    }, {
        name: "Europe/Madrid"
    }, {
        name: "Europe/Malta"
    }, {
        name: "Europe/Minsk",
        display: "Moscow Standard Time (Europe/Minsk)",
        display_DST: "Moscow Summer Time (Europe/Minsk)"
    }, {
        name: "Europe/Monaco"
    }, {
        name: "Europe/Moscow",
        display: "Moscow Standard Time (Europe/Moscow)",
        display_DST: "Moscow Summer Time (Europe/Moscow)"
    }, {
        name: "Europe/Nicosia"
    }, {
        name: "Europe/Oslo"
    }, {
        name: "Europe/Paris",
        display: "Central European Standard Time (Europe/Paris)",
        display_DST: "Central European Summer Time (Europe/Paris)"
    }, {
        name: "Europe/Prague",
        display: "Central European Standard Time (Europe/Prague)",
        display_DST: "Central European Summer Time (Europe/Prague)"
    }, {
        name: "Europe/Riga"
    }, {
        name: "Europe/Rome",
        display: "Central European Standard Time (Europe/Rome)",
        display_DST: "Central European Summer Time (Europe/Rome)"
    }, {
        name: "Europe/Samara"
    }, {
        name: "Europe/San_Marino"
    }, {
        name: "Europe/Sarajevo"
    }, {
        name: "Europe/Simferopol"
    }, {
        name: "Europe/Skopje"
    }, {
        name: "Europe/Sofia"
    }, {
        name: "Europe/Stockholm"
    }, {
        name: "Europe/Tallinn"
    }, {
        name: "Europe/Tirane"
    }, {
        name: "Europe/Uzhgorod"
    }, {
        name: "Europe/Vaduz"
    }, {
        name: "Europe/Vatican"
    }, {
        name: "Europe/Vienna"
    }, {
        name: "Europe/Vilnius"
    }, {
        name: "Europe/Warsaw"
    }, {
        name: "Europe/Zagreb"
    }, {
        name: "Europe/Zaporozhye"
    }, {
        name: "Europe/Zurich"
    }, {
        name: "Indian/Antananarivo"
    }, {
        name: "Indian/Chagos"
    }, {
        name: "Indian/Christmas"
    }, {
        name: "Indian/Cocos"
    }, {
        name: "Indian/Comoro"
    }, {
        name: "Indian/Kerguelen"
    }, {
        name: "Indian/Mahe"
    }, {
        name: "Indian/Maldives"
    }, {
        name: "Indian/Mauritius"
    }, {
        name: "Indian/Mayotte"
    }, {
        name: "Indian/Reunion"
    }, {
        name: "Pacific/Apia"
    }, {
        name: "Pacific/Auckland",
        display: "New Zealand Standard Time (Pacific/Auckland)",
        display_DST: "New Zealand Daylight Time (Pacific/Auckland)"
    }, {
        name: "Pacific/Chatham",
        display: "Chatham Standard Time (Pacific/Chatham)",
        display_DST: "Chatham Daylight Time (Pacific/Chatham)"
    }, {
        name: "Pacific/Easter"
    }, {
        name: "Pacific/Efate"
    }, {
        name: "Pacific/Enderbury",
        display: "Phoenix Islands Time (Pacific/Enderbury)"
    }, {
        name: "Pacific/Fakaofo"
    }, {
        name: "Pacific/Fiji",
        display: "Fiji Time (Pacific/Fiji)"
    }, {
        name: "Pacific/Funafuti"
    }, {
        name: "Pacific/Galapagos"
    }, {
        name: "Pacific/Gambier",
        display: "Gambier Time (Pacific/Gambier)"
    }, {
        name: "Pacific/Guadalcanal",
        display: "Solomon Islands Time (Pacific/Guadalcanal)"
    }, {
        name: "Pacific/Guam"
    }, {
        name: "Pacific/Honolulu",
        display: "Hawaii-Aleutian Standard Time (Pacific/Honolulu)"
    }, {
        name: "Pacific/Johnston"
    }, {
        name: "Pacific/Kiritimati",
        display: "Line Islands Time (Pacific/Kiritimati)"
    }, {
        name: "Pacific/Kosrae"
    }, {
        name: "Pacific/Kwajalein"
    }, {
        name: "Pacific/Majuro"
    }, {
        name: "Pacific/Marquesas",
        display: "Marquesas Time (Pacific/Marquesas)"
    }, {
        name: "Pacific/Midway"
    }, {
        name: "Pacific/Nauru"
    }, {
        name: "Pacific/Niue",
        display: "Niue Time (Pacific/Niue)"
    }, {
        name: "Pacific/Norfolk",
        display: "Norfolk Islands Time (Pacific/Norfolk)"
    }, {
        name: "Pacific/Noumea"
    }, {
        name: "Pacific/Pago_Pago",
        display: "Samoa Standard Time (Pacific/Pago_Pago)"
    }, {
        name: "Pacific/Palau"
    }, {
        name: "Pacific/Pitcairn",
        display: "Pitcairn Time (Pacific/Pitcairn)"
    }, {
        name: "Pacific/Ponape"
    }, {
        name: "Pacific/Port_Moresby"
    }, {
        name: "Pacific/Rarotonga"
    }, {
        name: "Pacific/Saipan"
    }, {
        name: "Pacific/Tahiti"
    }, {
        name: "Pacific/Tarawa"
    }, {
        name: "Pacific/Tongatapu",
        display: "Tonga Time (Pacific/Tongatapu)"
    }, {
        name: "Pacific/Truk"
    }, {
        name: "Pacific/Wake"
    }, {
        name: "Pacific/Wallis"
    }, {
        name: "Pacific/Yap"
    } ];
    b.extend(b, {
        getZones: function() {
            var a = [], b = moment(Date.now());
            return c.forEach(function(c) {
                try {
                    var d = b.tz(c.name), e = d.format("Z"), f = d.isDST(), g = "";
                    g = f ? c.display_DST || c.name : c.display || c.name, g = "(GMT" + e + ") " + g, 
                    a.push({
                        name: c.name,
                        display: g,
                        offset: e
                    });
                } catch (h) {
                    console.error(h);
                }
            }), a.sort(function(a, b) {
                var c = parseFloat(a.offset.replace(":", ".")), d = parseFloat(b.offset.replace(":", "."));
                if (d > c) return -1;
                if (c > d) return 1;
                var e = a.display.toLowerCase(), f = b.display.toLowerCase();
                return f > e ? -1 : e > f ? 1 : 0;
            }), a;
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(b, e) {
        var f, g = Object.keys(b), h = {};
        return g.forEach(function(g) {
            f = b[g], Array.isArray(f) ? (h[g] = c.cache(e + "." + g), h[g].push(f)) : h[g] = a.util.isObject(f) && !f.$name ? d(f, e + "." + g) : f;
        }), h;
    }
    var e = a.const, f = a.util, g = function(a, b, d, e) {
        if (a.revision <= b.revision) return !1;
        var h, i, j = Object.keys(a);
        return j.forEach(function(e) {
            h = a[e], i = b[e], Array.isArray(h) ? (i && i.add || (b[e] = c.cache(d + "." + e), 
            i && b[e].push(i), i = b[e]), h.forEach(function(a) {
                i.add(a);
            })) : void 0 === i ? b[e] = h : f.isObject(h) ? g(h, i, d + "." + e) : b[e] = h;
        }), e;
    };
    b.transferJson = d, c.Cache = a.define("Moxtra.Cache", Array, {
        properties: {},
        methods: {
            init: function(a) {
                a = a || {}, b.copy(a, [ "attributeId", "sortFn", "path" ], this), this.indexFields = [], 
                a.index && (this.indexFields = Array.isArray(a.index) ? a.index : [ a.index ]), 
                a.owner && (this.$owner = a.owner), this.indexFields.push(a.attributeId), a.sortFn && this.sort(a.sortFn), 
                a.model && (this.model = b.get(a.model)), this._models = {}, this._map = {};
            },
            getKey: function(a) {
                return f.isString(a) || f.isNumber(a) || (a = b.get(this.attributeId, a)), a;
            },
            getTransferJson: function(a, b) {
                return d(this.get(a), b);
            },
            get: function(a) {
                return this._map[this.getKey(a)];
            },
            getModel: function(a) {
                var b = this.get(a);
                if (!b) return null;
                var d = this.getKey(b), e = this._models[d];
                return e || (e = c.getModelInstance({
                    model: this.model,
                    data: b,
                    parent: this.$owner
                }), this._models[d] = e, e.link(this)), e;
            },
            _buildIndex: function(a) {
                var c = this;
                this.indexFields.forEach(function(d) {
                    d = _.isFunction(d) ? d(a) : b.get(d, a), d && (c._map[d] && a.is_deleted || (c._map[d] = a));
                });
            },
            push: function(a) {
                var b = this;
                Array.isArray(a) ? a.forEach(function(a) {
                    b.add(a);
                }) : b.add(a);
            },
            add: function(a) {
                var b, c, d = this, f = {};
                if (b = d.get(a)) {
                    g(a, b, d.path, f);
                    var h = this.getKey(b);
                    return void ((c = this._models[h]) ? c.parse(a) : d.trigger(e.EVENT_DATA_CHANGE, b));
                }
                Array.prototype.push.call(this, a), d._buildIndex(a), d.trigger(e.EVENT_DATA_ADD, a);
            },
            remove: function(a) {
                var b, c, d, f = this;
                if (b = f.get(a)) {
                    c = f.getKey(b), c && (d = f._models[c]) && delete f._models[c], this.indexFields.forEach(function(a) {
                        delete f[a];
                    });
                    for (var g, h = 0; h < f.length; h++) if (g = f[h], f.getKey(g) === c) {
                        f.splice(h, 1);
                        break;
                    }
                    f.trigger(e.EVENT_DATA_REMOVE, b, d);
                }
            },
            clear: function() {
                _.each(this._models, function(a) {
                    a.destroy && a.destroy();
                }), this._models = {}, this._map = {}, this.splice(0);
            },
            sort: function(a) {
                var b = this;
                a ? b.sortFn = a : a = b.sortFn, a && (Array.prototype.sort.call(b, a), b.trigger(e.EVENT_DATA_SORT));
            },
            each: function(a) {
                this.forEach(a);
            },
            toJSON: function() {},
            clone: function(b) {
                b = _.extend({}, b || {}, {
                    cache: this
                });
                var c = new a.CacheCollection(b);
                return c;
            }
        }
    }), _.extend(c.Cache.prototype, Backbone.Events);
    var h = {};
    c.cache = function(a, b) {
        var d = b;
        if (b && b.$name && (d = b.$name + "_" + a.replace(/\./g, "_") + b.$id), d && h[d]) return h[d];
        var e = c.createCollection(a, b);
        return d && (h[d] = e), e;
    }, c.createCollection = function(a, b, d) {
        var e = c.CacheConfig[a];
        return d = _.extend({
            owner: b
        }, e, d), new c.Cache(d);
    };
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.Storage", {
        properties: {
            db: sessionStorage,
            prefix: "mx",
            allowedVariables: null,
            name: {
                set: function(a) {
                    this._name = a;
                },
                get: function() {
                    return this.prefix ? this.prefix + ":" + this._name : this._name;
                }
            },
            memory: null
        },
        methods: {
            init: function(a) {
                b.copy(a || {}, [ "db", "prefix", "name", "allowedVariables" ], this);
                try {
                    var c = this.db.getItem(this.name);
                    c = c ? JSON.parse(c) : {}, this.memory = c;
                } catch (d) {
                    console.error(d), this.memory = {};
                }
            },
            data: function(a, b) {
                return a && this.allowedVariables && 0 != this.allowedVariables && !this.allowedVariables[a] ? (logger.error("The variables {0} is not allowed in storage {1}", a, this.name), 
                null) : (this.memory || (this.memory = {}), void 0 != b ? (this.memory[a] = b, this.save(), 
                this.memory) : a ? this.memory[a] : this.memory);
            },
            get: function(a) {
                return this.data(a);
            },
            set: function(a, b) {
                return this.data(a, b);
            },
            remove: function(a) {
                if (void 0 == a) return this.memory = null, this.db.removeItem(this.name);
                var b = this.data(), c = this;
                delete b[a];
                try {
                    c.db.setItem(c.name, JSON.stringify(c.memory));
                } catch (d) {
                    console.error(d);
                }
                return this;
            },
            save: function() {
                try {
                    this.db.setItem(this.name, JSON.stringify(this.memory));
                } catch (a) {
                    console.error(a);
                }
            },
            load: function() {
                try {
                    var a = this.db.getItem(this.name);
                    a && (a = JSON.parse(a));
                    for (var b in a) this.memory[b] || (this.memory[b] = a[b]);
                } catch (c) {
                    console.error(c);
                }
            }
        }
    });
}), Moxtra.define(function(a, b) {
    var c = function(a) {
        a || (a = {}), (a.isSucceed || a.isFailed) && (a.isComplete = !0), this.opts = a, 
        b.copy(a || {}, [ "isSucceed", "isFailed", "isComplete", "scope" ], this), a.data && this.send(a.data);
    };
    _.extend(c.prototype, Backbone.Events), b.defineProps(c.prototype, {
        abort: function() {
            var a = this.req;
            a && a.abort();
        },
        message: function() {},
        debug: function() {},
        setErrorMessage: function(a) {
            this._message = a, this.trigger("error");
        },
        send: function(c) {
            var d = this.opts;
            if (!d.before || d.before.call(this) !== !0) return d.url = a.util.makeAccessTokenUrl(d.url, {
                ignorePublicView: d.ignorePublicView
            }), this.req = a.ajax({
                timeout: d.timeout,
                url: d.url,
                data: b.isString(c) ? c : JSON.stringify(c),
                type: d.type || "POST",
                dataType: d.dataType || "json",
                contentType: d.contentType || "application/json",
                success: b.proxy(this._success, this),
                error: b.proxy(this._error, this),
                complete: b.proxy(this._complete, this)
            }), this;
        },
        success: function(a, b) {
            b = b || this.scope || this;
            var c = function() {
                "string" == typeof a ? MX.ui.notifySuccess(a) : a.apply(b, arguments);
            };
            if (this.isSucceed) {
                var d = this.req && this.req.responseJSON || {};
                this.opts.preprocess && (d = this.opts.preprocess()), c(d, "success", this.req);
            } else this.on("success", c);
            return this;
        },
        error: function(a, b) {
            b = b || this.scope || this;
            var c = function() {
                "string" == typeof a ? MX.ui.notifyError(a) : a.apply(b, arguments[0]);
            };
            return this.isFailed ? c() : this.on("error", c), this;
        },
        complete: function(a, b) {
            return b = b || this.scope || this, this.isComplete ? a.apply(b) : this.on("complete", function() {
                a.apply(b, [].slice.call(arguments));
            }), this;
        },
        setScope: function(a) {
            return this.scope = a, this;
        },
        wait: function(a) {
            return this._wait = a, this;
        },
        binding: function(a) {
            this._bindingReq = a;
        },
        invoke: function(a) {
            var b = [].slice.call(arguments);
            return b.shift(), this._mock = {
                status: a,
                data: b
            }, this._doMock(!0), this;
        },
        _doMock: function(a) {
            var b = this;
            if (a) return void setTimeout(function() {
                b._doMock();
            }, 100);
            if (!this._wait || this._wait()) {
                var c = "_" + this._mock.status;
                (c = this[c]) && (c.apply(this, this._mock.data), this._wait = null);
            } else setTimeout(function() {
                b._doMock();
            }, 1e3);
        },
        getErrorMessage: function(a) {
            if (a = a || this.req) {
                var b = a.responseJSON;
                return b.message;
            }
            return "";
        }
    }, !1, !0), b.defineProps(c.prototype, {
        _success: function(b) {
            if (this.isSucceed = !0, b && b.code && b.code !== a.const.RESPONSE_SUCCESS && (this.isSucceed = !1), 
            this._bindingReq && this._bindingReq._success.apply(this._bindingReq, c), this.isSucceed) {
                var c = [].slice.call(arguments);
                this.opts.preprocess && (c[0] = this.opts.preprocess(c[0])), this.opts.success ? this.opts.success.apply(this, c) : this.trigger("success", c[0], c[1], c[2]);
            } else this.opts.error && this.opts.error.call(this, b);
        },
        _error: function(a) {
            var b = this.opts;
            this.isFailed = !0, b.error ? b.error.call(this, a) : this.trigger("error", [].slice.call(arguments)), 
            this._bindingReq && this._bindingReq._error.call(this._bindingReq, a);
        },
        _complete: function(a) {
            var b = this.opts;
            b.complete ? b.complete.call(this, a) : this.trigger("complete", [].slice.call(arguments)), 
            this._bindingReq && this._bindingReq._complete.call(this._bindingReq, a);
        }
    }, !1, !1), b.Request = c;
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.Subscribe", {
        singleton: !0,
        properties: {
            req: null,
            type: "BOARD_REQUEST_SUBSCRIBE_MULTIPLE",
            url: "/user",
            timeout: 6e4,
            isActive: !0,
            inactiveDelayTime: 3e4
        },
        methods: {
            init: function() {
                this.req = new b.Request({
                    url: this.url,
                    timeout: this.timeout
                }), this.req.success(this._onSuccess, this).error(this._onError, this);
            },
            _onError: function(b) {
                this.inPolling = !1;
                var c = a.const, d = this, e = {};
                if (b && b.responseText && b.status < 500) try {
                    e = JSON.parse(b.responseText);
                } catch (f) {
                    console.error(f);
                }
                switch (e.code) {
                  case c.RESPONSE_ERROR_INVALID_REQUEST:
                  case c.RESPONSE_ERROR_INVALID_TOKEN:
                    return console.log("[NSDK] sessionTimeout"), d.context.id = "", a.trigger("sessionTimeout"), 
                    void d.stop();
                }
                this.timeid = setTimeout(function() {
                    d._polling();
                }, 3e4);
            },
            _onSuccess: function(a) {
                var b = this;
                this.inPolling = !1;
                try {
                    b.callback.call(b.context, a);
                } catch (c) {
                    console && console.error(c);
                }
                b.isActive ? b._polling() : b.timeid = setTimeout(function() {
                    b._polling();
                }, b.inactiveDelayTime);
            },
            inactive: function() {
                this.isActive = !1;
            },
            active: function() {
                this.isActive = !0, this.timeid && (clearTimeout(this.timeid), this._polling(), 
                this.timeid = null);
            },
            _polling: function() {
                if (this.inPolling) return void console.log("[NSDK] send user subscribe twice");
                var a = this.context.getSubscribeRequest();
                this.isActive || (a.params || (a.params = []), a.params.push({
                    name: "SUBSCRIBE_REQUEST_NOHANG"
                })), this.inPolling = !0, this.sendTime = Date.now(), this.req.send(a);
            },
            start: function(a, b) {
                this.context || (this._isStoped = !1, this.context = a, this.callback = b, this._daemon(), 
                this._polling());
            },
            _daemon: function() {
                if (!this._isStoped) {
                    var a = this, b = 18e4;
                    Date.now() - a.sendTime >= b && (console.log("[NSDK] subscribe daemon start polling."), 
                    a._polling()), setTimeout(function() {
                        a._daemon();
                    }, b);
                }
            },
            restart: function(a, b) {
                a = a || this.context, b = b || this.callback, this.stop(), this.start(a, b);
            },
            stop: function() {
                console.log("[NSDK] stop user subscribe"), this.req.abort(), this.timeid && (clearTimeout(this.timeid), 
                this.timeid = null), this._isStoped = !0, this.context = null, this.callback = null;
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    c.config = {
        user: {
            avatar: "themes/images/default/avatar-single-360.ceef0e51.png"
        },
        group: {
            avatar: "themes/images/default/avatar-team-300.0cd712e5.png"
        },
        division: {
            avatar: "themes/images/default/avatar-directory-100.3a4ee4da.png"
        },
        defaults: {
            binder_cover: "themes/images/default/default_binder_cover.1653bb1c.png",
            file_cover: "themes/images/icon/page.5f7d73f5.png",
            thumbnail: "themes/images/default/default_binder_cover.1653bb1c.png",
            thumbnail_small: "themes/images/default/default_binder_cover.1653bb1c.png",
            thumbnail_page: "themes/images/file.8677dec6.png",
            thumbnail_whiteboard: "themes/images/default/thumbnail_whiteboard.b78843eb.jpg",
            thumbnail_file: "themes/images/file.8677dec6.png",
            blankImg: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            source: "themes/images/default/avatar_document-320.jpg"
        },
        stripe: {
            public_key: "pk_test_4Pr9zFTnViBvoBxa51yFjS3q"
        }
    }, a.config = c.config, b.configStorage({
        SilentMessage: {
            db: localStorage
        },
        integration: {
            db: sessionStorage,
            prefix: "",
            name: "integration"
        }
    });
}), Moxtra.define(function(a, b) {
    b.extend(b, {
        isLeapYear: function(a) {
            return a % 400 == 0 || a % 4 == 0 && a % 100 != 0;
        },
        getMonthDaysNumber: function(a, b) {
            return [ 31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][b] || (this.isLeapYear(a) ? 29 : 28);
        },
        getPrevMonth: function(a, b) {
            return b--, 0 > b && (b = 11, a--), {
                year: a,
                month: b
            };
        },
        getNextMonth: function(a, b) {
            return b++, b > 11 && (b = 0, a++), {
                year: a,
                month: b
            };
        },
        getMonthDays: function(a, b, c, d) {
            var e, f = this.getMonthDaysNumber(a, b), g = [], h = 0;
            if (c) for (var i = new Date(a, b, 1).getDay(), j = this.getPrevMonth(a, b), k = this.getMonthDaysNumber(j.year, j.month); i > h; h++) e = {
                year: j.year,
                month: j.month,
                day: k - i + h + 1
            }, d && (e = d(e)), g.push(e);
            for (h = 1; f >= h; h++) e = {
                year: a,
                month: b,
                day: h
            }, d && (e = d(e)), g.push(e);
            if (c) {
                var l = this.getNextMonth(a, b), m = 7 - g.length % 7;
                if (7 > m) for (h = 1; m >= h; h++) e = {
                    year: l.year,
                    month: l.month,
                    day: h
                }, d && (e = d(e)), g.push(e);
            }
            return g;
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = {}, e = (a.define("Moxtra.model.Model", {
        properties: {
            validation: {
                enumerable: !1,
                value: null
            },
            parent: {
                enumerable: !1,
                get: function() {
                    return d[this._parent];
                },
                set: function(a) {
                    a && a.$id && (this._parent = a.$id);
                }
            },
            attributeId: {
                enumerable: !1,
                value: "sequence"
            },
            parseOrder: {
                enumerable: !1,
                value: ""
            },
            is_deleted: !1,
            created_time: ""
        },
        methods: {
            getModelById: function(a) {
                return d[a];
            },
            init: function(c, e) {
                b.defineProps(this, {
                    changed: Object.create(null),
                    localChanged: Object.create(null),
                    _events: Object.create(null),
                    _related: new a.util.Array(),
                    _isValid: !1
                }, !0, !1), this.parent = e, d[this.$id] = this, c && this.parse(c);
            },
            destroy: function() {
                d[this.$id] = null;
                var a = this;
                _.each(this._related, function(b) {
                    b.remove(a);
                }), this.destroyed = !0, this._related = null, this._events = null, this.changed = null, 
                this.stopListening();
            },
            get: function(a) {
                if (a.indexOf(".") > 0) return b.get(a, this);
                var c = this[a];
                return 0 == a.indexOf("get") && b.isFun(c) ? this[a]() : c;
            },
            set: function(a, c, d) {
                if (void 0 === c) {
                    if (b.isObject(a)) {
                        var e;
                        for (e in a) this.set(e, a[e], d);
                    }
                } else {
                    var f;
                    if (!this.propertyEditable(a)) return;
                    if (f = this["_" + a] || this[a], f != c) {
                        try {
                            this[a] = c;
                        } catch (g) {
                            console.error(g.stack);
                        }
                        f !== this[a] && (this.changed[a] = this[a], d && d.fromServer || (this.localChanged[a] = c), 
                        d && d.silent || this.trigger("change:" + a, c, this));
                    }
                }
            },
            parse: function(c, d) {
                if (this._cacheData(c), c) {
                    if (c instanceof a.model.Model && c.$id == this.$id) return this;
                    var e, f = this;
                    this.parseOrder && (e = this.parseOrder.split(","), b.each(e, function(a) {
                        void 0 !== c[a] && f.parseItem(c[a], a, d);
                    })), b.each(c, function(a, b) {
                        f.parseOrder.indexOf(b) < 0 && f.parseItem(a, b, d);
                    });
                    var g = Object.keys(this.changed);
                    if (g.length) {
                        var f = this;
                        b.each(this.changed, function(a, b) {
                            f.trigger("change:" + b, a, f);
                        }), this.trigger("change", this), this._notifyCollection(), "Board" === this.$name && this.parent && (this.parent.changed.board = this.changed, 
                        this.parent._notifyCollection()), f.changed = {};
                    }
                    this.afterParse && this.afterParse(d);
                }
                return this;
            },
            _notifyCollection: function() {
                var b = this;
                b._related.forEach(function(c) {
                    c.trigger(a.const.EVENT_DATA_MODEL_CHANGE, b), "Collection" === c.$name && c.doModelChange(b);
                });
            },
            link: function(a) {
                var b = this._related;
                b.indexOf(a) < 0 && (b.push(a), a.on("destroy", function() {
                    b.remove(a);
                }));
            },
            parseItem: function(a, b, d) {
                var e, f, g = this, h = this.getProperty(b);
                if (void 0 !== h) {
                    if (f = {
                        fromServer: !0,
                        isFullData: d,
                        silent: !0
                    }, e = g[b], null == e) {
                        if (!h.cls) return void g.set(b, a, f);
                        e = c.getInstance({
                            model: h.cls,
                            data: a,
                            parent: this
                        }), g[b] = e;
                    }
                    if (h.set) g.set(b, a, f); else if (e.parse) {
                        if (a.revision && a.revision < e.revision) return;
                        e.parse(a, d), this.changed[b] = _.extend({}, e.changed);
                    } else e.push ? (e.attrName || (e.attrName = b), e.push(a, d), this.changed[b] = !0) : void 0 !== e && g.set(b, a, f);
                }
            },
            defineProperty: function(a, b, c, d) {
                Object.defineProperty(this, a, {
                    writable: !0,
                    enumerable: d || !1,
                    value: b
                });
            },
            toJSON: function() {
                return this;
            },
            getParent: function(a) {
                var b = this.parent;
                if (!b) return null;
                if (b.$name == a) return b;
                for (;b.parent && (b = b.parent, b.$name != a); ) ;
                return b.$name == a ? b : null;
            },
            getUpdateData: function() {
                var a = {}, c = this, d = !1;
                return b.each(this.localChanged, function(b, c) {
                    a[c] = b, d = !0;
                }), d ? (c.sequence && (a.sequence = c.sequence), this.localChanged = Object.create(null)) : a = null, 
                a;
            },
            _cacheData: function(a) {
                var b, c = this.cacheConfig;
                this._json || (this._json = {
                    revision: 0
                }), c && (this._json.revision >= a.revision || (c.include ? b = _.pick(a, c.include) : c.exclude && (b = _.omit(a, c.exclude)), 
                b && _.extend(this._json, b)));
            },
            saveToCache: function() {
                var a = this.cacheConfig;
                if (a) {
                    var c = b.storage(a.root);
                    c.set(a.name, this._json), c.save();
                }
            },
            loadFromCache: function() {
                var a = this.cacheConfig;
                if (a) {
                    var c = b.storage(a.root), d = c.get(a.name);
                    this.parse(d);
                }
            },
            isValid: function(a) {
                if (!this.validation) return !0;
                var b = Object.keys(this.validation), c = e(this.getProperties(b));
                return this.attributes = c, a === !0 && this.validate(), delete this.attributes, 
                this.validation ? this._isValid : !0;
            },
            _validate: function(a, b) {
                if (!b.validate || !this.validate) return !0;
                a = _.extend({}, this.attributes, a);
                var c = this.validationError = this.validate(a, b) || null;
                return c ? (this.trigger("invalid", this, c, _.extend(b, {
                    validationError: c
                })), !1) : !0;
            }
        },
        statics: {
            create: function() {}
        }
    }), function(a, b, c) {
        return b = b || {}, c = c || "", _.each(a, function(d, f) {
            a.hasOwnProperty(f) && (d && "object" == typeof d && !(d instanceof Array || d instanceof Date || d instanceof RegExp || d instanceof Backbone.Model || d instanceof Backbone.Collection) ? e(d, b, c + f + ".") : b[c + f] = d);
        }), b;
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.Contact", a.model.Model, {
        properties: {
            validates: {
                enumerable: !1,
                value: {
                    email: [ "required", "email" ],
                    first_name: [ "required" ],
                    last_name: "required"
                }
            },
            attributeId: {
                enumerable: !1,
                value: "id"
            },
            secondId: {
                enumerable: !1,
                value: "email"
            },
            email: "",
            email_verified: !0,
            id: "",
            disabled: !1,
            unique_id: "",
            primaryKey: {
                set: function(a) {
                    this._primaryKey = a;
                },
                get: function() {
                    return this._primaryKey || this.email || this.id;
                }
            },
            first_name: "",
            last_name: "",
            name: {
                set: function(a) {
                    this._name = a;
                },
                get: function() {
                    var a = "";
                    return this.first_name.trim() && (a = this.first_name), this.last_name.trim() && (a && (a += " "), 
                    a += this.last_name), (this._name || a || this.email || "").trim();
                }
            },
            displayName: {
                set: function(a) {
                    this._displayName = a;
                },
                get: function() {
                    return this._displayName || this.first_name || this.name || this.email;
                }
            },
            phone_number: "",
            online: !1,
            picture: 0,
            picture2x: 0,
            picture4x: 0,
            revision: 0,
            local_revision: 0,
            contacts_total: 0,
            boards_owned: 0,
            boards_invited: 0,
            boards_total: 0,
            meet_hosted: 0,
            meet_invited: 0,
            total_cloud_size: 0
        },
        statics: {
            unique: !0
        },
        methods: {
            create: function() {},
            "delete": function() {},
            update: function() {}
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.GroupCap", a.model.Model, {
        properties: {
            is_enterprise: !1,
            has_saml: !0,
            has_salesforce: !1,
            has_branding: !0,
            has_configuration: !0
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.GroupMember", a.model.Model, {
        validation: {
            "user.first_name": {
                required: !0,
                msg: "first_name_is_required"
            },
            "user.email": [ {
                required: !0,
                msg: "email_is_required"
            }, {
                pattern: "email",
                msg: "email_format_error"
            } ]
        },
        properties: {
            created_time: 0,
            revision: 0,
            sequence: 0,
            status: "",
            type: "",
            updated_time: 0,
            is_deleted: !1,
            user: {
                get: function() {
                    return this._user;
                },
                set: function(b) {
                    this._user ? this._user.parse(b) : this._user = new a.model.Contact(b, this);
                }
            },
            plan_code: "",
            division: "",
            department: "",
            isVirtualUser: !1,
            isDivision: !1,
            avatar: {
                get: function() {
                    return this._getAvatarWithSize(this.user.picture4x || this.user.picture2x || this.user.picture);
                }
            },
            roleName: {
                get: function() {
                    var b = MX.lang.member;
                    switch (this.type) {
                      case a.const.GROUP_ADMIN_ACCESS:
                        b = MX.lang.group_admin;
                        break;

                      case a.const.GROUP_OWNER_ACCESS:
                        b = MX.lang.group_owner;
                        break;

                      case a.const.GROUP_MEMBER_ACCESS:
                        b = MX.lang.member;
                    }
                    return b;
                }
            },
            isPending: {
                get: function() {
                    return this.status === a.const.GROUP_INVITED;
                }
            },
            isActive: {
                get: function() {
                    return this.status === a.const.GROUP_MEMBER && this.user && !this.user.disabled;
                }
            },
            isOwner: {
                get: function() {
                    return this.type === a.const.GROUP_OWNER_ACCESS;
                }
            },
            isMe: {
                get: function() {
                    return b.get("user.id", this) === a.getMe().id;
                }
            },
            canUpdate: {
                get: function() {
                    return !(this.status === a.const.GROUP_MEMBER && this.user && this.user.disabled);
                }
            },
            statusText: {
                get: function() {
                    var b = MX.lang.pending;
                    return b = this.status === a.const.GROUP_MEMBER ? this.user && this.user.disabled ? MX.lang.disabled : MX.lang.active : MX.lang.pending;
                }
            }
        },
        methods: {
            _getAvatarWithSize: function(c) {
                var d, e = "/group/{{groupId}}/member/{{sequence}}/{{picture}}", f = this.user, g = a.getMe().branding.getDefaultUserAvatar();
                if (f) {
                    var h = a.getMe();
                    if (h.id === this.user.id) return h.avatar;
                    if (c = c || f.picture) {
                        var i = this.parent.id;
                        return d = b.format(e, {
                            boardId: this.parent.id,
                            sequence: this.sequence,
                            picture: c,
                            groupId: i
                        }), d = a.util.makeAccessTokenUrl(d);
                    }
                    return g;
                }
            },
            updateUserEmail: function(a) {
                return this.parent.operateChild("members", [ {
                    sequence: this.sequence,
                    user: {
                        email: a
                    }
                } ], "GROUP_REQUEST_USER_UPDATE_EMAIL");
            },
            update: function(b) {
                void 0 !== this.localChanged.type && this.set("type", this.type || a.const.GROUP_MEMBER_ACCESS);
                var c = this.getUpdateData(), d = this.user.getUpdateData();
                return d && (c || (c = {
                    sequence: this.sequence
                }), c.user = d), this.parent.operateChild("members", c, b || "GROUP_REQUEST_USER_UPDATE");
            },
            loadUserBoards: function() {
                var d = c.filter;
                return this.parent.operateChild("members", {
                    sequence: this.sequence
                }, "GROUP_REQUEST_USER_READ", {
                    preprocess: function(c) {
                        var e, f, g = b.getConfig("boards") || {};
                        return g = _.extend({}, g, {
                            unique: !1,
                            filterFn: function(a) {
                                return d.isDefault(a) || d.isTimelineData(a) ? !0 : !1;
                            }
                        }), f = b.get("object.user.boards", c), f ? (e = new a.Collection(g), e.push(f), 
                        e) : void 0;
                    }
                });
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const;
    a.define("Moxtra.model.Group", a.model.Model, {
        properties: {
            attributeId: {
                enumerable: !1,
                value: "id"
            },
            name: "",
            id: "",
            type: "",
            created_time: 0,
            avatar: a.config.group.avatar,
            isTeam: {
                set: function(a) {
                    a && (this.type = d.GROUP_TYPE_TEAM);
                },
                get: function() {
                    return this.type === d.GROUP_TYPE_TEAM;
                }
            },
            local_revision: 0,
            members: {
                get: function() {
                    return this._members || (this._members = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.GroupMember",
                        attributeId: "sequence",
                        index: [ "user.id", "user.email" ],
                        sortFn: c.sort.bizDirectory
                    })), this._members;
                }
            },
            availableUsers: {
                get: function() {
                    return this.members.clone({
                        filterFn: {
                            status: d.GROUP_MEMBER
                        }
                    }, !1);
                }
            },
            boards: {
                enumerable: !1,
                get: function() {
                    return c.cache("groupBoards", this);
                }
            },
            plan_code: "",
            plan_quantity: 0,
            revision: {
                get: function() {
                    return this._revision || 0;
                }
            },
            status: "",
            trial_end_time: 0,
            trial_grace_period_time: 0,
            trial_start_time: 0,
            updated_time: 0,
            tags: {
                get: function() {
                    return this._tags || (this._tags = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardTag",
                        attributeId: "name",
                        index: [ "sequence" ],
                        removedFlag: [ "is_deleted" ]
                    })), this._tags;
                }
            },
            group_caps: a.model.GroupCap,
            total_members: {
                get: function() {
                    return this._total_members ? this._total_members : this.members.length;
                },
                set: function(a) {
                    this._total_members = a;
                }
            }
        },
        methods: {
            init: function(a, b) {
                this.init._super.call(this, a, b), this.parse({
                    group_caps: {}
                });
            },
            create: function() {
                return this.operateChild(null, null, this._parseRequestType("create", "GROUP_REQUEST_CREATE"));
            },
            "delete": function() {},
            addUser: function(c, d, e, f) {
                var g = [], h = {};
                f = f || a.const.GROUP_MEMBER_ACCESS, g.push({
                    type: f,
                    division: d,
                    department: e,
                    user: c.getUpdateData()
                });
                var i = this, j = this.operateChild("members", g, "GROUP_REQUEST_INVITE", h);
                return j.success(function(a) {
                    var c = b.get("object.group.members.0", a);
                    g && i.parse({
                        groups: c
                    });
                }), j;
            },
            addTeamMembers: function(a) {
                a = a || [];
                var c, d = [], e = this;
                return b.each(a, function(a) {
                    d.push(a.user ? a : {
                        user: a
                    });
                }), c = this.operateChild("members", d, this._parseRequestType("add")), c.success(function(a) {
                    var c = b.get("object.group.members.0", a);
                    d.length && e.parse({
                        groups: c
                    });
                }), c;
            },
            removeGroupUser: function(a) {
                var b = {};
                return a.sequence ? b.sequence = a.sequence : a.user && (a.user.id ? (b.user = {}, 
                b.user.id = a.user.id) : a.user.email && (b.user = {}, b.user.email = a.user.email)), 
                this.operateChild("members", [ b ], this._parseRequestType("remove", "GROUP_REQUEST_REMOVE_MEMBER"));
            },
            leaveTeam: function() {
                var b = {
                    user: {}
                }, c = a.getMe();
                return c.id ? b.user.id = c.id : c.email && (b.user.email = c.email), this.operateChild("members", [ b ], this._parseRequestType("leave"));
            },
            reassignTeamOwner: function(a) {
                return this.operateChild("members", [ {
                    sequence: a
                } ], this._parseRequestType("reassign"));
            },
            deleteTeam: function() {
                return this.operateChild(null, null, this._parseRequestType("delete"));
            },
            update: function(c) {
                if (c) {
                    var d = this[c], e = [];
                    if (d instanceof a.Collection && (d.each(function(a) {
                        var b = a.getUpdateData();
                        b && (b[d.attributeId] || (b[d.attributeId] = a[d.attributeId]), e.push(b));
                    }), !e.length)) {
                        var f = new b.Request();
                        return f.invoke("complete", null), f;
                    }
                    return this.operateChild(c, e);
                }
            },
            syncTags: function() {
                var a = {
                    type: "GROUP_REQUEST_READ",
                    object: {
                        group: {
                            id: this.id,
                            revision: this.revision || 0
                        }
                    },
                    params: [ {
                        name: "OUTPUT_FILTER_STRING",
                        string_value: "/group/tags"
                    }, {
                        name: "OUTPUT_FILTER_STRING",
                        string_value: "/group/group_caps"
                    }, {
                        name: "OUTPUT_FILTER_STRING",
                        string_value: "/group/local"
                    } ]
                }, d = this._req = new b.Request({
                    url: "/group",
                    data: a,
                    preprocess: function(a) {
                        return c.processGroupSubscribe(a.object && a.object.group, !0);
                    }
                });
                return d;
            },
            operateChild: function(a, c, d, e) {
                var f = {};
                d = d || "GROUP_REQUEST_UPDATE", e = e || {};
                var g = this;
                "GROUP_REQUEST_UPDATE" !== d && this.id || (f = b.set("object.group", this.getUpdateData(), {})), 
                "GROUP_REQUEST_UPDATE" === d && (d = this._parseRequestType("update", "GROUP_REQUEST_UPDATE")), 
                a && c && (Array.isArray(c) || (c = [ c ]), "name" === a && (c = this.name), b.set("object.group." + a, c, f)), 
                this.id && b.set("object.group.id", this.id, f), e.params && (f.params = (f.params || []).concat(e.params)), 
                f.type = d;
                var h = new b.Request({
                    url: "/group",
                    data: f,
                    preprocess: e.preprocess
                });
                return h.success(function(a) {
                    a && a.object && a.object.group && g.parse(a.object.group);
                }), h;
            },
            getTeamUsage: function(a, b) {
                return a = Math.max(0, a), this.operateChild(null, null, "GROUP_REQUEST_USERS_READ", {
                    preprocess: this._handlePagingData,
                    params: [ {
                        name: "GROUP_REQUEST_SEARCH_TEXT",
                        string_value: b || ""
                    }, {
                        name: "GROUP_REQUEST_SEARCH_START",
                        string_value: (a || 0).toString()
                    }, {
                        name: "GROUP_REQUEST_SEARCH_SIZE",
                        string_value: "10"
                    }, {
                        name: "GROUP_REQUEST_READ_GROUP_MEMBER"
                    } ]
                });
            },
            search: function(a) {
                var c = new b.Request({
                    url: "/group",
                    data: {
                        type: "BOARD_REQUEST_SEARCH_GROUP_BOARD",
                        params: [ {
                            name: "BOARD_REQUEST_SEARCH_TEXT",
                            string_value: a
                        }, {
                            name: "BOARD_REQUEST_SEARCH_SIZE",
                            string_value: "100"
                        } ]
                    }
                });
                return c;
            },
            _parseRequestType: function(a, b) {
                if (this.type === d.GROUP_TYPE_TEAM) switch (a) {
                  case "create":
                    b = "GROUP_REQUEST_CREATE_TEAM";
                    break;

                  case "update":
                    b = "GROUP_REQUEST_UPDATE_TEAM";
                    break;

                  case "delete":
                    b = "GROUP_REQUEST_DELETE_TEAM";
                    break;

                  case "add":
                    b = "GROUP_REQUEST_ADD_TEAM_MEMBER";
                    break;

                  case "remove":
                    b = "GROUP_REQUEST_REMOVE_TEAM_MEMBER";
                    break;

                  case "leave":
                    b = "GROUP_REQUEST_LEAVE_TEAM";
                    break;

                  case "reassign":
                    b = "GROUP_REQUEST_REASSIGN_TEAM_OWNER";
                }
                return b;
            },
            cacheConfig: {
                root: "cache",
                name: "group",
                exclude: [ "boards", "members", "contact", "integrations", "resources" ]
            },
            subscribe: function() {
                c.Root.user.subscribe(this);
            },
            unsubscribe: function() {
                c.Root.user.unsubscribe(this);
            },
            loadMembers: function(a, c, d) {
                var e, f = {
                    start: (a - 1) * c,
                    size: c
                };
                return d && (f.text = d), e = b.makeUrl("/group/" + this.id + "/members", f), new b.Request({
                    type: "GET",
                    url: e,
                    preprocess: this._handlePagingData
                }).send();
            },
            searchMembers: function(a, b, c) {
                return b ? this.loadMembers(a, c, b) : void 0;
            },
            _handlePagingData: function(d) {
                var e = b.get("object.group", d), f = e.members, g = new a.Collection({
                    model: "Moxtra.model.GroupMember",
                    index: [ "user.id", "user.email" ]
                });
                return e = c.processGroupSubscribe(e), _.each(f, function(a) {
                    g.push(e.members.get(a.sequence));
                }), g.inited = !0, g;
            }
        },
        statics: {
            unique: !0
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.BoardUser", a.model.Model, {
        properties: {
            created_time: 0,
            revision: 0,
            sequence: 0,
            status: "",
            type: "",
            updated_time: 0,
            is_deleted: !1,
            user: {
                get: function() {
                    var b = this._user;
                    if (this.status === a.const.BOARD_INVITED) {
                        var c = this.getInvitedContact(b);
                        if (c && c.user) return c.user;
                    }
                    return b;
                },
                set: function(b) {
                    this._user ? this._user.parse(b) : this._user = new a.model.Contact(b);
                }
            },
            group: a.model.Group,
            is_notification_off: {
                set: function(b) {
                    if (this.defineProperty("_is_notification_off", b), this.user && this.user.id === a.getMe().id) {
                        var c = this.getParent("UserBoard");
                        c && c.set("is_notification_off", b);
                    }
                },
                get: function() {
                    return this._is_notification_off || !1;
                }
            },
            isGroup: {
                get: function() {
                    return this.group && this.group.id ? !0 : !1;
                }
            },
            online: {
                get: function() {
                    if (!this.user) return !1;
                    if (this.user.id === a.getMe().id) return !0;
                    var b = a.model.Root.user.contacts.get(this.user.id);
                    return b ? b.online : !1;
                }
            },
            isMember: {
                get: function() {
                    return this.status === a.const.BOARD_MEMBER;
                }
            },
            isOwner: {
                get: function() {
                    return this.type === a.const.BOARD_OWNER;
                }
            },
            isEditor: {
                get: function() {
                    return this.type === a.const.BOARD_OWNER || this.type === a.const.BOARD_READ_WRITE || !1;
                }
            },
            isContact: {
                get: function() {
                    if (!this.user) return !1;
                    var b = a.getMe();
                    if (this.user.id === b.id) return !1;
                    var d = c.Root, e = !!d.user.contacts.get(this.user.id), f = !(!d.group || !d.group.members.get(this.user.id));
                    return e || f;
                }
            },
            enableBizCard: {
                get: function() {
                    var b = a.getMe();
                    return b.unique_id ? !1 : this.user && this.user.email && this.user.id !== b.id ? !0 : !1;
                }
            },
            avatar: {
                get: function() {
                    var d, e, f, g = "/board/{{boardId}}/user/{{sequence}}/{{picture}}", h = "/user/board/{{userBoardSeq}}/{{sequence}}/{{picture}}", i = this.user, j = a.getMe().branding.getDefaultUserAvatar();
                    if (this.status === a.const.BOARD_INVITED) return i = this.getInvitedContact(this._user), 
                    i ? i.avatar : j;
                    if ((!i || i && !i.id) && this.group) return c.config.group.avatar;
                    var k = a.getMe();
                    if (k.id === i.id) return k.picture ? (e = b.format("/user/{{picture}}", k), e = a.util.makeAccessTokenUrl(e)) : j;
                    if (d = i.picture4x || i.picture, f = this.getParent("UserBoard"), d && this.sequence) {
                        if (f) {
                            if (i = this.getInvitedContact(this._user)) return i.avatar;
                            e = b.format(h, {
                                userBoardSeq: f.sequence,
                                sequence: this.sequence,
                                picture: d
                            });
                        } else e = b.format(g, {
                            boardId: this.parent.id,
                            sequence: this.sequence,
                            picture: d,
                            groupId: a.getMe().groupId
                        });
                        return e = a.util.makeAccessTokenUrl(e);
                    }
                    return !d && f && (i = this.getInvitedContact(this._user)) ? i.avatar : j;
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "sequence,user,is_deleted,status,type"
            }
        },
        methods: {
            getInvitedContact: function(b) {
                var d = c.Root.user.contacts.get(b.primaryKey);
                if (d) return d;
                if (a.model.Root.group) {
                    var e = a.model.Root.group.members.get(b.primaryKey);
                    if (e) return e;
                }
            },
            update: function() {
                var a = this.getUpdateData(), b = this, c = this.parent.operateChild("users", a);
                return c.success(function() {
                    b.localChanged = {};
                }), c;
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.Comment", a.model.Model, {
        properties: {
            client_uuid: "",
            postType: {
                enumerable: !1,
                value: ""
            },
            validates: {
                enumerable: !1,
                value: ""
            },
            boardId: {
                enumerable: !1,
                value: ""
            },
            created_time: 0,
            text: "",
            rich_text: "",
            rich_text_format: "",
            revision: 0,
            sequence: 0,
            updated_time: 0,
            original_resource_sequence: 0,
            user: {
                get: function() {
                    return this._user || {};
                },
                set: function(a) {
                    this._user = a;
                }
            },
            creator: {
                get: function() {
                    var c, d, e, f, g = this.getParent("Board"), h = "", i = [];
                    return this._creator && (c = this._creator.user), c || (c = this.user), f = g.users.get(c.id, !0), 
                    f || (c.user && (h = c.user.first_name || c.user.name || ""), h || (h = c.first_name || c.name || ""), 
                    e = a.getUserContact(c.id) || {}, d = e.avatar || a.getMe().branding.getDefaultUserAvatar(), 
                    f = {
                        avatar: d,
                        user: c
                    }, c.groups && (b.each(c.groups, function(a) {
                        var c, d, e = b.get("id", a.group);
                        e && (c = g.users.get(e), c && (d = b.get("name", c.group), d && i.push(d)));
                    }), i.length && (h += " (" + i.join(", ") + ")")), f.user.displayName = h), f;
                },
                set: function(a) {
                    this._creator = a;
                }
            },
            isMyComment: {
                get: function() {
                    var b;
                    return b = this.user.user ? this.user.user.id : this.user.id, b === a.model.Root.user.id;
                }
            },
            resource: {
                set: function(a) {
                    this._resource = a, this.parent && (this._voice = [ "/board", this.parent.boardid, this.parent.sequence, a ].join("/"));
                },
                get: function() {
                    return this._resource || "";
                }
            },
            resource_length: 0,
            resource_path: "",
            voice: {
                get: function() {
                    return this._voice || "";
                }
            }
        },
        methods: {
            create: function(d) {
                d && this.defineProperty("parent", d);
                var d = this.parent;
                this.client_uuid || this.set("client_uuid", c.uuid());
                var e = d.operateChild("comments", [ this.getUpdateData() ], this.getPostType("CREATE"));
                return e.success(function(c) {
                    var d, e = b.get("object.board.id", c);
                    (d = a.getBoard(e)) && d.parse(c.object.board);
                }), e;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("comments", [ {
                    sequence: this.sequence,
                    is_deleted: !0
                } ], this.getPostType("DELETE")).success(function() {
                    a.comments.remove(b);
                });
            },
            update: function() {
                var a = this.getUpdateData();
                return this.parent.operateChild("comments", a ? [ a ] : a, this.getPostType("UPDATE"));
            },
            getPostType: function(a) {
                var b = [ "BOARD", "REQUEST", a ];
                return "BoardTodo" == this.parent.$name && b.push("TODO"), b.push("COMMENT"), b.join("_");
            }
        }
    });
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.model.ActionObject", a.model.Model, {
        properties: {
            client_uuid: "",
            revision: 0,
            sequence: 0,
            session_key: "",
            board_id: "",
            topic: "",
            agenda: "",
            is_expired: !1,
            total_rosters: 0,
            is_deleted: !1,
            timestamp: 0,
            scheduled_start_time: 0,
            scheduled_end_time: 0,
            milliseconds_allowed_to_join_before_start: 0,
            original_board_id: "",
            start_time: 0,
            end_time: 0,
            recording: 0,
            created_time: 0,
            updated_time: 0,
            session_status: "",
            user_roster: {
                get: function() {}
            },
            recordings: {
                get: function() {
                    var a = this.getParent("Board"), b = [];
                    return a.resources.each(function(a) {
                        "BOARD_RESOURCE_SESSION_AS_VIDEO" === a.type && "BOARD_RESOURCE_STATUS_CONVERTED" === a.status && b.push(a);
                    }), b;
                }
            },
            host: {
                get: function() {
                    var b = this.getParent("Board"), c = {};
                    return b.users.each(function(b) {
                        return b.type === a.const.BOARD_OWNER ? (c = b.user || {}, !1) : void 0;
                    }), c.name || c.first_name || c.email || "";
                }
            },
            duration: {
                get: function() {
                    var a = this.scheduled_start_time, b = this.scheduled_end_time;
                    return (0 == a || 0 == b) && (a = this.start_time, b = this.end_time), b - a;
                }
            },
            isInvited: {
                get: function() {
                    var b = this.getParent("Board").getMyBoardUserInfo();
                    return b.status === a.const.BOARD_INVITED;
                }
            },
            isPast: {
                get: function() {
                    var b = !1;
                    return this.session_status === a.const.SESSION_STARTED ? b = !1 : this.session_status === a.const.SESSION_SCHEDULED ? this.scheduled_end_time < Date.now() && (b = !0) : this.session_status === a.const.SESSION_ENDED && (this.end_time > this.scheduled_end_time || this.scheduled_end_time < Date.now()) && (b = !0), 
                    b;
                }
            },
            isActive: {
                get: function() {
                    return this.session_status === a.const.SESSION_STARTED;
                }
            },
            isHost: {
                get: function() {
                    var b = this.getParent("Board"), c = {};
                    return b.users.each(function(b) {
                        return b.type === a.const.BOARD_OWNER ? (c = b.user || {}, !1) : void 0;
                    }), c.id === a.getMe().id;
                }
            },
            startable: {
                get: function() {
                    return this.isHost && !this.isPast && !this.isActive;
                }
            },
            joinable: {
                get: function() {
                    return this.isActive ? !0 : this.session_status === a.const.SESSION_SCHEDULED && this.milliseconds_allowed_to_join_before_start && this.scheduled_start_time - Date.now() <= this.milliseconds_allowed_to_join_before_start && this.scheduled_end_time > Date.now() ? !0 : !1;
                }
            },
            viewable: {
                get: function() {
                    return a.getMe().configuration.showScheduleMeet();
                }
            },
            editable: {
                get: function() {
                    return this.viewable && this.startable;
                }
            }
        },
        methods: {
            create: function() {
                var a = this.parent, c = a.operateChild("session", this.getUpdateData(), "SESSION_REQUEST_SCHEDULE", {
                    preprocess: function(c) {
                        var d = a.getParent("Board");
                        return c.object.board && d.parse(c.object.board), b.saveCacheClass(d), d;
                    }
                });
                return c;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("sessions", [ {
                    sequence: a.sequence,
                    is_deleted: !0
                } ], "BOARD_REQUEST_UPDATE").success(function() {
                    a.sessions.remove(b);
                });
            },
            update: function() {
                var a = this.getUpdateData();
                return a && (a.sequence = parent.sequence), this.parent.operateChild("session", a, "BOARD_REQUEST_UPDATE");
            },
            inviteUsers: function(a) {
                return a.forEach(function(b, c) {
                    b.group_id ? (b.id = b.group_id, delete b.group_id, a[c] = {
                        group: b
                    }) : a[c] = {
                        user: b
                    };
                }), new b.Request({
                    url: "/board",
                    data: {
                        action: {
                            session_key: this.session_key,
                            user_roster: a
                        },
                        type: "SESSION_REQUEST_INVITE"
                    }
                });
            },
            operateChild: function(c, d, e) {
                var f = {}, e = e || "BOARD_REQUEST_UPDATE", g = this.getUpdateData();
                if ((g && "BOARD_REQUEST_UPDATE" == e || !this.id) && (f = b.set("object.board", g, {})), 
                "BOARD_REQUEST_UPDATE" != e && (g = !0), c && d) Array.isArray(d) || (d = [ d ]), 
                b.set("object.board." + c, d, f); else if (!g) return new b.Request({
                    isSucceed: !0,
                    isComplete: !0
                });
                return this.id && (b.set("object.board.id", this.id, f), SilentMessage.get(this.id) && (f.params = [ {
                    name: "BOARD_REQUEST_PUSH_NOTIFICATION_OFF"
                } ])), f.type = e, req.success(function(b) {
                    var c, d = a.model.Root.user.boards;
                    if (b.object && (c = b.object.board)) {
                        if (!c.id) return;
                        d.push(b.object);
                    }
                }), req;
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.Category", a.model.Model, {
        properties: {
            validates: {
                enumerable: !1,
                value: {
                    name: [ "required" ]
                }
            },
            created_time: 0,
            name: "",
            revision: 0,
            sequence: 0,
            updated_time: 0,
            boards: {
                enumerable: !1,
                get: function() {
                    return this._boards || (this._boards = new a.util.Array({
                        unique: !0
                    })), this._boards;
                }
            },
            feed_unread_count: 0
        },
        methods: {
            create: function(a) {
                this.defineProperty("parent", a), this.set("client_uuid", c.uuid());
                var d = a.operateChild("categories", this, "USER_REQUEST_CATEGORY_CREATE"), e = this;
                return d.success(function(a) {
                    var c = b.get("object.user.categories.0", a);
                    e.parse(c);
                }), d;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("categories", {
                    sequence: this.sequence
                }, "USER_REQUEST_CATEGORY_DELETE").success(function() {
                    a.categories.remove(b);
                });
            },
            update: function() {
                var a = this.getUpdateData();
                return this.parent.operateChild("categories", a ? [ a ] : a, "USER_REQUEST_CATEGORY_RENAME");
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.BoardTag", a.model.Model, {
        properties: {
            name: "",
            string_value: "",
            client_uuid: "",
            sequence: "",
            uint64_value: "",
            parseOrder: {
                enumerable: !1,
                value: "sequence,client_uuid"
            }
        },
        methods: {
            create: function(a) {
                this.defineProperty("parent", a), this.set("client_uuid", c.uuid());
                var b = a.operateChild("tags", this);
                return b.success(function(b) {
                    a.parse(b);
                }), b;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("tags", {
                    sequence: this.sequence,
                    is_deleted: !0
                }).success(function() {
                    a.tags.remove(b);
                });
            },
            update: function() {
                var a = {
                    sequence: this.sequence
                }, c = this, d = !1;
                b.each(this.localChanged, function(b, e) {
                    a[e] = c[e], d = !0;
                }), d || (a = null);
                var e = this.parent.operateChild("tags", a, null, {
                    parseData: !0
                });
                return e.success(function() {
                    c.localChanged = {};
                }), e;
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.BoardPageElement", a.model.Model, {
        properties: {
            client_uuid: "",
            created_time: 0,
            creator_sequence: 0,
            local_revision: 0,
            revision: 0,
            sequence: 0,
            svg_tag: "",
            updated_time: 0,
            tags: {
                get: function() {
                    return this._tags || (this._tags = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardTag",
                        attributeId: "sequence",
                        index: [ "client_uuid", "name" ],
                        removedFlag: [ "is_deleted" ]
                    })), this._tags;
                }
            },
            type: {
                get: function() {
                    var b = this.tags.get({
                        name: "TYPE"
                    });
                    return b ? b.uint64_value : a.const.PAGE_ELEMENT_TYPE_UNDEFINED;
                }
            }
        },
        methods: {
            update: function() {
                var a = this.getUpdateData();
                return this.parent.operateChild("contents", [ a ]);
            },
            create: function(b, d) {
                var e = a.const.PAGE_ELEMENT_TYPE_ARROW;
                this.defineProperty("parent", b), this.client_uuid || this.set("client_uuid", c.uuid());
                var f = this.getUpdateData();
                d && d === e && (f.tags = [ {
                    name: "TYPE",
                    uint64_value: e
                } ]);
                var g = b.operateChild("contents", [ f ]);
                return g;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("contents", {
                    sequence: this.sequence,
                    is_deleted: !0
                }).success(function() {
                    a.contents.remove(b);
                });
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const, e = c.config.defaults;
    a.define("Moxtra.model.BoardPage", a.model.Model, {
        properties: {
            client_uuid: "",
            created_time: 0,
            isVirtual: !1,
            page_number: {
                get: function() {
                    return this._page_number;
                },
                set: function(a) {
                    parseFloat(a) || (a = this.sequence + ""), this._page_number = a;
                }
            },
            is_deleted: {
                get: function() {
                    return this._is_deleted;
                },
                set: function(a) {
                    var b = this.file;
                    if (b) {
                        var c;
                        b.pages.remove(this), b.pages.length || (c = "Board" == b.parent.$name ? b.parent.page_groups : b.parent.files, 
                        c.push({
                            client_uuid: b.client_uuid,
                            is_deleted: !0
                        }));
                    }
                    this._is_deleted = a;
                }
            },
            page_type: "",
            revision: 0,
            sequence: 0,
            rotate: 0,
            editor: 0,
            editor_time: {
                get: function() {
                    return this._editor_time || 0;
                },
                set: function(a) {
                    this._editor_time = a, this.trigger(this.editor ? "lock" : "unlock");
                }
            },
            total_comments: {
                get: function() {
                    return this.comments.length;
                }
            },
            updated_time: 0,
            name: "",
            url: "",
            pageIndex: {
                get: function() {
                    if (this.page_group) {
                        var a = this.parent.getCacheObject(this.page_group);
                        return a && !a.isVirtual ? 1 === a.pages.length ? 1 : a.pages.indexOf(this) + 1 : 1;
                    }
                    return 1;
                }
            },
            original_resource_sequence: 0,
            isLockByMe: {
                get: function() {
                    if (!this.isLocked) return !1;
                    var a = this.getParent("Board");
                    return a && this.editor && this.editor === a.getMyBoardUserInfo().sequence ? !0 : !1;
                }
            },
            isLocked: {
                get: function() {
                    return this.editor && Date.now() - this.editor_time < 3e5 ? !0 : !1;
                }
            },
            file: {
                get: function() {
                    if (this.page_group) {
                        var a = this.getParent("Board");
                        return a.getCacheObject(this.page_group);
                    }
                }
            },
            page_group: {
                get: function() {
                    return this._page_group;
                },
                set: function(a) {
                    var b, c = this.getParent("Board"), d = this._page_group;
                    d && d !== a && (b = c.getCacheObject(d), b && (b.pages.remove(this), b.pages.length < 1 && b.isVirtual ? b.destroy() : b._notifyCollection())), 
                    this._page_group = a, void 0 !== a && (b = c.getCacheObject(a), b ? (b.pages.push(this), 
                    b._notifyCollection()) : this._mockFileForPage());
                }
            },
            vector: {
                get: function() {
                    return this._vector || 0;
                },
                set: function(a) {
                    (!this._vector || this._vector < a) && (this._vector = a);
                }
            },
            background: "background",
            width: {
                set: function(a) {
                    0 > a || this.defineProperty("_width", a);
                },
                get: function() {
                    return this._width || 1024;
                }
            },
            height: {
                set: function(a) {
                    0 > a || this.defineProperty("_height", a);
                },
                get: function() {
                    return this._height || 768;
                }
            },
            type: {
                get: function() {
                    var a = this.page_type.toLocaleLowerCase();
                    return a.split("_").pop();
                }
            },
            boardid: {
                get: function() {
                    return this.parent.id;
                }
            },
            thumbnail: {
                set: function(a) {
                    this.defineProperty("_thumbnail", a);
                },
                get: function() {
                    var c;
                    if (this._thumbnail) {
                        var f = {
                            boardId: this.parent.id,
                            sequence: this.sequence,
                            thumbnail: this._thumbnail
                        };
                        c = b.format("/board/${boardId}/${sequence}/${thumbnail}", f), c = a.util.makeAccessTokenUrl(c);
                    } else switch (this.page_type) {
                      case d.PAGE_TYPE_WHITEBOARD:
                      case d.PAGE_TYPE_WEB:
                        c = e.thumbnail_whiteboard;
                        break;

                      default:
                        c = e.thumbnail_page;
                    }
                    return c;
                }
            },
            originalResource: {
                get: function() {
                    if (this.original_resource_sequence) {
                        var c = b.format("/board/${boardId}/${resource}", {
                            boardId: this.parent.id,
                            resource: this.original_resource_sequence
                        });
                        return c = a.util.makeAccessTokenUrl(c);
                    }
                    return null;
                }
            },
            source: {
                get: function() {
                    var c, f = this.page_type;
                    return f === d.PAGE_TYPE_WHITEBOARD ? c = e.source : f === d.PAGE_TYPE_NOT_SUPPORTED ? c = e.source : /WEB|URL|VIDEO|AUDIO|NOTE/.test(f) ? (c = b.format("/board/${boardId}/${sequence}/${vector}", {
                        boardId: this.parent.id,
                        sequence: this.sequence,
                        vector: this.vector || ""
                    }), c = a.util.makeAccessTokenUrl(c)) : (c = b.format("/board/${boardId}/${sequence}/${background}", {
                        boardId: this.parent.id,
                        sequence: this.sequence,
                        background: this.background
                    }), c = a.util.makeAccessTokenUrl(c)), c;
                }
            },
            comments: {
                isClass: !0,
                get: function() {
                    return this._comments || (this._comments = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.Comment",
                        attributeId: "sequence",
                        sortFn: function(a, b) {
                            return a.created_time === b.created_time ? a.sequence > b.sequence ? 1 : -1 : a.created_time > b.created_time ? 1 : -1;
                        }
                    })), this._comments;
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "sequence,client_uuid,is_deleted,page_type,editor,thumbnail"
            },
            webdocContent: "",
            contents: {
                isClass: !0,
                get: function() {
                    return this._contents || (this._contents = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardPageElement",
                        attributeId: "sequence",
                        index: "client_uuid"
                    })), this._contents;
                }
            },
            isMedia: {
                get: function() {
                    return [ d.PAGE_TYPE_VIDEO, d.PAGE_TYPE_AUDIO, d.PAGE_TYPE_NOTE ].indexOf(this.page_type) > -1;
                }
            },
            isWeb: {
                get: function() {
                    return this.page_type === d.PAGE_TYPE_WEB;
                }
            },
            isUrl: {
                get: function() {
                    return this.page_type === d.PAGE_TYPE_URL;
                }
            },
            isWhiteBoard: {
                get: function() {
                    return this.page_type === d.PAGE_TYPE_WHITEBOARD;
                }
            }
        },
        methods: {
            init: function(a, b) {
                this.init._super.call(this, a, b), b && this._mockFileForPage();
            },
            _mockFileForPage: function() {
                var a, b = this.getParent("Board"), c = this.page_group, d = this, e = function() {
                    var c = uuid();
                    b.page_groups.push({
                        client_uuid: c,
                        isVirtual: !0,
                        order_number: d.page_number,
                        name: d.name,
                        updated_time: d.updated_time
                    }), a = b.page_groups.get(c), d.set("page_group", c);
                };
                if (!this.is_deleted) if (c) if (a = b.getCacheObject(c), !a || a.is_deleted) e(); else {
                    a.pages.push(this);
                    var f = a.parent;
                    "Board" === f.$name ? f.page_groups.trigger("push", a) : f.files.trigger("push", a);
                } else e();
            },
            create: function(a) {
                if (!a) throw "need a board";
                var c, e = a;
                if ("Board" !== e.$name && (e = e.getParent("Board")), this.defineProperty("parent", a), 
                this.page_type === d.PAGE_TYPE_WEB) return c = this.updateWebDoc({
                    nofeed: !1
                }, !0);
                if (this.page_type === d.PAGE_TYPE_WHITEBOARD) {
                    var f = this, g = f.getUpdateData(), h = uuid();
                    return g.client_uuid = uuid(), g.page_group = h, e.operateChild("pages", g, "BOARD_REQUEST_UPDATE", {
                        beforeSend: function(a) {
                            return b.set("object.board.page_groups", [ {
                                client_uuid: h
                            } ], a), a;
                        },
                        preprocess: function(a) {
                            var c, d = b.get("object.board.pages.0.sequence", a);
                            return d && (e.parse(a.object.board), c = e.pages.get(d)), c;
                        }
                    });
                }
                return e.operateChild("pages", this.getUpdateData(), "BOARD_REQUEST_UPDATE");
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("pages", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_UPDATE").success(function() {
                    a.pages.remove(b);
                });
            },
            update: function() {
                return this.parent.operateChild("pages", this.getUpdateData(), "BOARD_REQUEST_UPDATE");
            },
            lock: function() {
                var a = this.parent.operateChild("pages", {
                    sequence: this.sequence
                }, "BOARD_REQUEST_SET_EDITOR"), b = this;
                return a.success(function() {
                    b._lockTime = Date.now(), b._lockTimer = setTimeout(function() {
                        b.isLocked && b._lockTime > b.editor_time ? b.lock() : clearTimeout(b._lockTimer);
                    }, 12e4);
                }), a;
            },
            unlock: function() {
                if (this.editor) {
                    var a = this;
                    if (a.isLocked && a.isLockByMe && a._lockTime) {
                        var b = this.parent.operateChild("pages", {
                            sequence: this.sequence
                        }, "BOARD_REQUEST_REMOVE_EDITOR");
                        b.success(function() {
                            clearTimeout(a._lockTimer);
                        });
                    }
                }
            },
            updateWebDoc: function(a, c) {
                if (this.page_type !== d.PAGE_TYPE_WEB) return {};
                var e = b.storage("SilentMessage"), f = this.getParent("Board"), g = {
                    nofeed: !0
                }, h = {
                    type: this.sequence ? "vector" : "web",
                    id: f.id,
                    name: (this.name || MX.lang.note) + ".html"
                };
                if (a && (g = b.extend(g, a)), g.nofeed && (h.nofeed = !0), e.get(f.id) && (h.pnoff = !0), 
                this.sequence && (h.seq = this.sequence), "Board" !== this.parent.$name) {
                    for (var i = this.parent, j = []; "Board" !== i.$name; ) j.push(i.sequence), i = i.parent;
                    j.reverse(), h.destfolder = j.join(",");
                }
                var k = b.makeUrl("/board/upload", h), l = this, m = c ? "&newfile&newfilename=" + this.name : "", n = new b.Request({
                    url: k + m,
                    data: this.webdocContent,
                    contentType: "text/html",
                    preprocess: function(a) {
                        var c, d = b.get("object.board", a);
                        if (d) {
                            c = b.get("pages.0.sequence", d);
                            var e = l.getParent("Board");
                            if (d) return e.parse(d), l.localChanged.webdocContent = !1, e.pages.get(c);
                        }
                    }
                });
                return n;
            },
            getResource: function() {
                var c = "/board/{{boardId}}/{{sequence}}/vector?" + Math.random();
                c = b.format(c, {
                    boardId: this.parent.id,
                    sequence: this.sequence
                });
                var d = new b.Request({
                    url: a.util.makeAccessTokenUrl(c),
                    type: "GET",
                    dataType: "text"
                }), e = this;
                return d.success(function(a) {
                    e.webdocContent = a;
                }), d.send(), d;
            },
            getPageInfo: function() {
                var a = this, d = this.parent.operateChild("pages", [ {
                    sequence: this.sequence
                } ], "BOARD_REQUEST_VIEW");
                return d.success(function(d) {
                    var e = b.get("object.board.pages.0", d);
                    a.parse(e, c.status.isAllFullData);
                }), d;
            },
            operateChild: function(a, b, c) {
                var d;
                return b && (d = {}, this.sequence && (d.sequence = this.sequence), d[a] = b), this.parent.operateChild("pages", [ d ], c);
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const;
    a.define("Moxtra.model.References", a.model.Model, {
        properties: {
            sequence: 0,
            client_uuid: "",
            file: null,
            thumbnail: {
                get: function() {
                    return this.file.thumbnail;
                }
            },
            is_deleted: !1,
            reference_links_sequence: 0,
            name: {
                get: function() {
                    return this.file.name;
                }
            }
        }
    }), a.define("Moxtra.model.BoardTodo", a.model.Model, {
        properties: {
            validates: {
                enumerable: !1,
                value: {
                    name: [ "required" ]
                }
            },
            client_uuid: "",
            created_time: 0,
            creator_sequence: 0,
            local_revision: 0,
            name: "",
            revision: 0,
            sequence: 0,
            updated_time: 0,
            order_number: "",
            note: "",
            is_marked: !1,
            assignee_sequence: {
                enumerable: !0,
                set: function(a) {
                    var b = this.getParent("Board").getMyBoardUserInfo();
                    b && b.sequence === a && this.defineProperty("_isAssignToMe", !0), this.defineProperty("_assignee_sequence", a);
                },
                get: function() {
                    return this._assignee_sequence || 0;
                }
            },
            due_date: 0,
            reminders: {
                enumerable: !1,
                set: function(a) {
                    var c = this.getParent("Board").getMyBoardUserInfo(), d = this;
                    Array.isArray(a) ? c && b.each(a, function(a) {
                        a.creator_sequence === c.sequence && d.defineProperty("_reminders", a);
                    }) : this._reminders ? this._reminders.reminder_time = a : this._reminders = {
                        reminder_time: a,
                        creator_sequence: c.sequence
                    };
                },
                get: function() {
                    return this._reminders ? this._reminders.reminder_time : null;
                }
            },
            resource_path: "",
            attachments: {
                enumerable: !0,
                get: function() {
                    return this._attachments || this.defineProperty("_attachments", new a.Collection({
                        attributeId: "sequence",
                        owner: this,
                        model: "Moxtra.model.References",
                        index: [ "client_uuid" ]
                    })), this._attachments;
                }
            },
            references: {
                enumerable: !0,
                set: function(c) {
                    var d = this.parent, e = d.pages, f = d.resources, g = this, h = this.attachments, i = d.reference_links, j = a.const;
                    b.each(c, function(c) {
                        if (c.is_deleted) return void h.remove(c.sequence);
                        var k, l, m = b.get("board.pages.0.sequence", c);
                        if (m) return m = e.get(m), void (m && !m.is_deleted && m.page_group && (k = d.getCacheObject(m.page_group), 
                        l = new a.model.BoardFile({
                            name: k.name,
                            sequence: k.sequence,
                            client_uuid: k.client_uuid
                        }), l.pages.push(m), l.parent = d, h.push({
                            file: l,
                            sequence: c.sequence,
                            client_uuid: c.client_uuid || c.sequence
                        })));
                        var n, o = b.get("board.resources.0.sequence", c);
                        if (o) {
                            if (n = f.get(o), n && !n.is_deleted) {
                                if (d.page_groups.each(function(a) {
                                    a.original === n.sequence && (k = a);
                                }), !k && (k = new a.model.BoardFile({
                                    sequence: n.sequence,
                                    client_uuid: n.client_uuid,
                                    name: n.name,
                                    original: n.sequence
                                }), k.parent = d, n.status === j.BOARD_RESOURCE_STATUS_CONVERTED)) {
                                    var p = MX.filter(e, {
                                        original_resource_sequence: n.sequence
                                    });
                                    p && p.length && k.pages.push(p[0]);
                                }
                                k && h.push({
                                    file: k,
                                    sequence: c.sequence,
                                    client_uuid: c.client_uuid || c.sequence
                                });
                            }
                        } else {
                            k = b.get("board.page_groups.0.client_uuid", c), k && (k = d.page_groups.get(k)) && h.push({
                                file: k,
                                sequence: c.sequence,
                                client_uuid: c.client_uuid || c.sequence
                            });
                            var q, r = b.get("board.reference_links.0.sequence", c);
                            if (r && (r = i.get(r), r && r.source && (q = r.source, q && q.$name && (h.push({
                                file: q,
                                sequence: c.sequence,
                                reference_links_sequence: r.sequence,
                                client_uuid: c.client_uuid || c.sequence
                            }), r.bindRemoveEvent(g), !q.pages.length)))) {
                                var s = function() {
                                    q.changed = {
                                        pages: !0
                                    }, q.trigger("change");
                                };
                                q.pages.on("add", s);
                            }
                        }
                    }), h.inited = !0, this.changed.attachments = !0;
                },
                get: function() {
                    return null;
                }
            },
            is_deleted: {
                set: function(a) {
                    this.defineProperty("_is_deleted", a);
                },
                get: function() {
                    return this._is_deleted || !1;
                }
            },
            is_completed: {
                set: function(a) {
                    this.defineProperty("_is_completed", a);
                },
                get: function() {
                    return this._is_completed || !1;
                }
            },
            comments: {
                get: function() {
                    return this._comments || (this._comments = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.Comment"
                    })), this._comments;
                }
            },
            assignee: {
                set: function(c) {
                    var d = null, e = !1;
                    if (this.assignee_sequence) d = this.parent.users.get(this.assignee_sequence, !0); else {
                        if (c && c.user && c.user.groups) {
                            this.parent && (c.user.displayName = this.parent.getTeamMemberName(c.user.name, c.user.groups));
                            var f = c.user.id, g = b.get("group.id", c.user.groups[0]), h = a.getMe().groups.get(g), i = [ "/group", g, f, "picture" ].join("/");
                            if (h && h.group && h.group.members) {
                                var j = h.group.members.get(f);
                                j && j.avatar && (i = j.avatar);
                            }
                            d = {
                                user: c.user,
                                avatar: i
                            };
                        }
                        d && b.get("id", d.user) === a.getMe().id && (e = !0), this.defineProperty("_isAssignToMe", e);
                    }
                    this.defineProperty("_assignee", d);
                },
                get: function() {
                    return this.assignee_sequence ? this.parent.users.get(this.assignee_sequence, !0) : this._assignee || null;
                }
            },
            isAssignToMe: {
                get: function() {
                    return this._isAssignToMe || !1;
                }
            },
            creator: {
                set: function(a) {
                    this.defineProperty("_creator", a);
                },
                get: function() {
                    var b = this.parent.users.get(this.creator_sequence);
                    return b ? b : this._creator ? new a.model.BoardUser(this._creator) : {
                        user: {}
                    };
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "client_uuid,sequence,name,is_deleted,is_completed,references,comments"
            },
            activitiesCount: {
                get: function() {
                    var a = 0, c = this;
                    return _.each(this.parent.todoHistory, function(e) {
                        b.get("board.todos.0.sequence", e) === c.sequence && e.type !== d.FEED_TODO_DUE_DATE_ARRIVE && a++;
                    }), a;
                }
            }
        },
        methods: {
            create: function() {
                var a = this.parent;
                this.client_uuid || this.set("client_uuid", c.uuid());
                var b = a.operateChild("todos", {
                    client_uuid: this.client_uuid,
                    name: this.name
                }, "BOARD_REQUEST_CREATE_TODO");
                return b;
            },
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("todos", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_DELETE_TODO").success(function() {
                    a.todos.remove(b);
                });
            },
            update: function(a) {
                var c = {
                    sequence: this.sequence
                }, d = this, e = !1;
                a || (a = "BOARD_REQUEST_UPDATE_TODO"), b.each(this.localChanged, function(a, b) {
                    c[b] = "reminders" === b ? d._reminders.reminder_time ? [ {
                        creator_sequence: d._reminders.creator_sequence,
                        reminder_time: d._reminders.reminder_time,
                        sequence: d._reminders.sequence
                    } ] : [ {
                        is_deleted: !0
                    } ] : d[b], e = !0;
                });
                var f;
                if (e) {
                    var g = this._checkSuppressFeed();
                    f = this.parent.operateChild("todos", c, a, g), f.success(function() {
                        d.localChanged = {};
                    });
                } else f = new b.Request(), f.invoke("success", null);
                return f;
            },
            _checkSuppressFeed: function() {
                var b = null, c = Date.now() - this.created_time, d = this.parent.getMyBoardUserInfo();
                return c < a.const.LIMITED_TODO_FEED_SUPPRESS && d.sequence === this.creator_sequence && 1 === this.activitiesCount && (b = {
                    params: [ {
                        name: "BOARD_REQUEST_SUPPRESS_FEED"
                    } ]
                }), b;
            },
            deleteReminder: function() {
                return this.set("reminders", 0), this.update("BOARD_REQUEST_DELETE_TODO_REMINDER");
            },
            updateCompleted: function(a) {
                return this.set("is_completed", a), this.update("BOARD_REQUEST_SET_TODO_COMPLETED");
            },
            updateReminder: function() {
                return this.update("BOARD_REQUEST_UPDATE_TODO_REMINDER");
            },
            updateDueDate: function() {
                return this.update("BOARD_REQUEST_SET_TODO_DUE_DATE");
            },
            updateAssignee: function() {
                var a = {
                    type: "BOARD_REQUEST_SET_TODO_ASSIGNEE",
                    object: {
                        board: {
                            id: this.parent.id,
                            todos: [ {
                                sequence: this.sequence,
                                assignee_sequence: this.assignee_sequence
                            } ]
                        }
                    }
                }, c = this._checkSuppressFeed();
                return c && (a.params = c.params), new b.Request({
                    url: "/board",
                    data: a
                });
            },
            updateAssigneeInTeam: function(a) {
                var c = {
                    type: "BOARD_REQUEST_SET_TODO_ASSIGNEE",
                    object: {
                        board: {
                            id: this.parent.id,
                            todos: [ {
                                sequence: this.sequence,
                                assignee: {
                                    user: {
                                        id: a
                                    }
                                }
                            } ]
                        }
                    }
                }, d = this._checkSuppressFeed();
                return d && (c.params = d.params), new b.Request({
                    url: "/board",
                    data: c
                });
            },
            operateChild: function(a, b, c) {
                var d = {
                    sequence: this.sequence
                };
                d[a] = b;
                var e;
                return "BOARD_REQUEST_CREATE_TODO_COMMENT" !== c && (e = this._checkSuppressFeed()), 
                this.parent.operateChild("todos", d, c, e);
            },
            _addAttachments: function(a, c, d) {
                var e = this, f = [], g = e.parent.id;
                a && b.each(a, function(a) {
                    f.push({
                        client_uuid: uuid(),
                        board: {
                            pages: [ {
                                sequence: a
                            } ],
                            id: g
                        }
                    });
                }), c && b.each(c, function(a) {
                    var b = d.getFolderPath(null, [ {
                        client_uuid: a
                    } ]);
                    b.client_uuid = uuid(), f.push(b);
                });
                var h = {
                    references: f
                };
                e.sequence ? h.sequence = e.sequence : h.client_uuid = e.client_uuid;
                var i = this._checkSuppressFeed();
                return e.parent.operateChild("todos", h, "BOARD_REQUEST_UPDATE_TODO_ATTACHMENT", i);
            },
            addAttachments: function(a, c, d) {
                var e = this.getParent("Board"), f = this, g = new b.Request(), d = d || e;
                return c && !c.length && g.invoke("error"), e.transformVirtualFiles(c, d).success(function() {
                    f._addAttachments(a, c, d).binding(g);
                }).error(function() {
                    g.invoke("error");
                }), g;
            },
            removeAttachments: function(a) {
                var c = [];
                Array.isArray(a) ? b.each(a, function(a) {
                    c.push({
                        sequence: parseInt(a, 10),
                        is_deleted: !0
                    });
                }) : c = [ {
                    sequence: parseInt(a, 10),
                    is_deleted: !0
                } ];
                var d = {
                    sequence: this.sequence,
                    references: c
                }, e = this._checkSuppressFeed();
                return this.parent.operateChild("todos", d, "BOARD_REQUEST_UPDATE_TODO_ATTACHMENT", e);
            }
        }
    });
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.model.BoardFeed", a.model.Model, {
        properties: {
            boardId: {
                get: function() {
                    return this.parent.id;
                }
            },
            created_time: 0,
            revision: 0,
            sequence: 0,
            timestamp: 0,
            type: "",
            is_deleted: !1,
            updated_time: 0,
            is_pinned: !1,
            actor: {
                set: function(a) {
                    this.defineProperty("_actor", a);
                },
                get: function() {
                    if (!this._actor) return {};
                    if (this._actor.type === a.const.USER_TYPE_SERVICE) {
                        var b = a.getService(this._actor.name) || {};
                        return {
                            user: {
                                first_name: this._actor.first_name || b.displayName,
                                displayName: this._actor.first_name || b.displayName,
                                name: this._actor.name
                            },
                            avatar: this._actor.picture_url || "images/service/" + this._actor.name + ".png",
                            isServiceIntegration: !0
                        };
                    }
                    {
                        var c = this._actor.id || this._actor.email;
                        this._actor;
                    }
                    if (c) {
                        var d = this.parent.users.get(c, !0) || a.getUserContact(c) || {};
                        d.user = d.user || {};
                        var e = {
                            user: {
                                id: this._actor.id || d.user.id || "",
                                unique_id: this._actor.unique_id || d.user.unique_id || "",
                                groups: this._actor.groups || "",
                                first_name: this._actor.first_name || d.user.first_name || "",
                                name: this._actor.name || d.user.name || "",
                                email: this._actor.email || d.user.email || ""
                            },
                            online: d.online || !1,
                            avatar: d.avatar || a.getMe().branding.getDefaultUserAvatar(),
                            enableBizCard: d.enableBizCard || !1
                        };
                        return e.user.displayName = e.user.first_name || e.user.name || e.user.email || "", 
                        e;
                    }
                    return {};
                }
            },
            board: {
                set: function(a) {
                    this.defineProperty("_board", a);
                    var c;
                    a.pages && (c = b.get("pages.0.sequence", a) || 0), this.set("page", c);
                },
                get: function() {
                    return this._board || {};
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "sequence,board,source,actor,message"
            },
            todo: {
                get: function() {
                    var a = this.board;
                    if (a.todos) {
                        var c = b.get("0.sequence", a.todos);
                        return this.parent.todos.get(c, !0) || {};
                    }
                }
            },
            resource: {
                get: function() {
                    var a = this.board;
                    if (a.resources) {
                        var c = b.get("0.sequence", a.resources);
                        return this.parent.resources && this.parent.resources.get(c, !0) || {};
                    }
                }
            },
            page: {
                get: function() {
                    var a = this._page;
                    return a ? this.parent.pages && this.parent.pages.get(a, !0) || {} : void 0;
                },
                set: function(a) {
                    this._page = a;
                }
            },
            comment: {
                get: function() {
                    var a = this.board;
                    if (a.comments) {
                        var c = b.get("0.sequence", a.comments);
                        return this.parent.comments && this.parent.comments.get(c, !0) || {};
                    }
                }
            },
            session: {
                get: function() {
                    var a = this.board;
                    if (a.sessions) {
                        var c = b.get("0.sequence", a.sessions), d = this.parent.sessions && this.parent.sessions.get(c, !0);
                        if (d) {
                            var e = {};
                            return d.is_deleted && (e = {
                                is_deleted: !0
                            }), _.extend(e, d.session, a.sessions[0].session);
                        }
                        return _.extend({}, a.sessions[0].session);
                    }
                }
            },
            source: {
                get: function() {
                    if (this._source) return this._source;
                    var a, c = this._board;
                    return c ? c.todos ? (a = b.get("0.sequence", c.todos), this.parent.todos.get(a, !0) || {}) : c.resources ? (a = b.get("0.sequence", c.resources), 
                    this.parent.resources && this.parent.resources.get(a, !0) || {}) : c.pages ? (a = b.get("0.sequence", c.pages), 
                    this.parent.pages.get(a, !0) || {}) : c.comments ? (a = b.get("0.sequence", c.comments), 
                    this.parent.comments.get(a, !0) || {}) : c.sessions ? (a = b.get("0.sequence", c.sessions), 
                    this.parent.sessions.get(a, !0) || {}) : void 0 : null;
                },
                set: function(a) {
                    this.defineProperty("_source", a);
                }
            },
            message: {
                get: function() {
                    function c() {
                        !this.page && this.comment && this.comment.resource ? (g.resource = this.comment, 
                        g.resource.source = a.util.makeAccessTokenUrl("/board/" + h.id + "/" + g.resource.resource), 
                        g.viewType = "media", g.comment = this.comment, g.media_length = this.parent.resources && this.parent.resources.get(this.comment.resource) ? this.parent.resources.get(this.comment.resource).media_length || 0 : this.comment.resource_length || 0, 
                        g.chatMsg = j.feed_board_comment_voice, m.comment = j.feed_board_comment_voice_message) : (g.viewType = "comment", 
                        g.comment = this.comment, m.comment = g.comment.rich_text ? g.comment.rich_text : g.comment.text || ""), 
                        g.actor = m.user, g.showArrow = !0, g.created_time = MX.get("comment.created_time", this), 
                        g.created_user = MX.get("comment.creator.user.displayName", this);
                    }
                    function d() {
                        var a = MX.get("board.pages.0.comments.0.sequence", this);
                        g.comment = this.page.comments && this.page.comments.get(a) || {}, m.comment = g.comment.text, 
                        g.comment.is_deleted || void 0 === g.comment.text ? (g.chatMsg = j.feed_pages_comment_deleted, 
                        g.viewType = "annotate") : g.viewType = g.comment.voice ? "imageAudio" : "image";
                    }
                    function e() {
                        var b = this._getFiles();
                        if (this.board.pages) if (1 === this.board.pages.length) if (this.page = this.page || {}, 
                        this.page.page_type === a.const.PAGE_TYPE_URL) g.viewType = "url", m.target = j.feed_pages_create_url, 
                        g.page = g.page || {}, g.page.url = '<a href="' + this.page.url + '" target="_blank">' + this.page.url + "</a>"; else {
                            switch (this.page.page_type) {
                              case a.const.PAGE_TYPE_AUDIO:
                                m.target = j.feed_an_audio_page;
                                break;

                              case a.const.PAGE_TYPE_VIDEO:
                                m.target = j.feed_a_video_page;
                                break;

                              case a.const.PAGE_TYPE_NOTE:
                                g.chatMsg = j.feed_clip_create, m.target = j.feed_a_moxtra_note;
                                break;

                              case a.const.PAGE_TYPE_PDF:
                              case a.const.PAGE_TYPE_NOT_SUPPORTED:
                                m.target = j.feed_param_a_resource;
                                break;

                              case a.const.PAGE_TYPE_WHITEBOARD:
                                m.target = j.feed_param_a_whiteboard;
                                break;

                              case a.const.PAGE_TYPE_WEB:
                                m.target = j.feed_param_a_note;
                                break;

                              case a.const.PAGE_TYPE_IMAGE:
                                m.target = j.feed_param_an_image;
                                break;

                              default:
                                m.target = j.feed_param_a_resource;
                            }
                            b && !b.isVirtual ? (g.file = b, g.file_id = b.client_uuid, b.name ? m.target += MX.format(j.feed_target_name, {
                                name: b.name
                            }) : b.id || !b.name && !b.displayName || this.page.page_type === a.const.PAGE_TYPE_WHITEBOARD || (m.target += MX.format(j.feed_target_name, {
                                name: b.displayName || b.name
                            }))) : this.page.name && (m.target += MX.format(j.feed_target_name, {
                                name: this.page.name
                            })), g.viewType = "image";
                        } else g.viewType = "image", b ? (g.file = b, g.file_id = b.client_uuid, m.target = j.feed_param_a_resource, 
                        (b.name || b.displayName) && (m.target += ' "' + (b.displayName || b.name) + '"'), 
                        g.showMeetNote = !0) : m.target = MX.format(j.feed_param_file_complex, {
                            count: this.board.pages.length
                        }); else b ? (g.file = b, g.file_id = b.client_uuid, g.viewType = "resource", m.target = j.feed_param_a_resource, 
                        b.name && (m.target += ' "' + b.name + '"'), g.resource = this.resource || {}) : m.target = j.feed_param_one_page;
                    }
                    var f, g = {}, h = this.parent, i = this, j = MX.lang, k = a.const;
                    g.chatMsg = j[this.type.toLowerCase() || k.FEED_INVALID.toLowerCase()] || "";
                    var l = this.actor && this.actor.user || {}, m = {};
                    m.user = l.displayName, g.session = MX.get("board.sessions.0.session", this);
                    var n = a.getMe();
                    switch (n.id === l.id ? (g.isMe = !0, this.actor.isMe = !0) : this.parent && (m.user = this.parent.getTeamMemberName(l.displayName, b.get("groups", l))), 
                    m.board_type = j.feed_conversation, this.type) {
                      case k.FEED_TODO_COMMENT:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_comment;
                        var o = MX.get("board.todos.0.comments.0.sequence", this), p = this.todo.comments.get(o);
                        p && (g.comment = p.text, m.comment = p.text), g.mentionsComment = MX.format(j.timeline_feed_todo_comment + ": {{comment}}", m);
                        break;

                      case k.FEED_TODO_CREATE:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_added, g.todoAction = MX.format(j.timeline_feed_todo_create, m);
                        break;

                      case k.FEED_TODO_UPDATE:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_updated, g.todoAction = MX.format(j.timeline_feed_todo_update, m);
                        break;

                      case k.FEED_TODO_COMPLETE:
                      case k.FEED_TODO_REOPEN:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_updated, g.todoAction = MX.format(j["timeline_" + this.type.toLowerCase()], m);
                        break;

                      case k.FEED_TODO_ATTACHMENT:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_updated;
                        var q = MX.get("todos.0.references.0", this.board);
                        q && (g.todoAction = q.is_deleted ? MX.format(j.feed_todo_attachment_deleted, m) : MX.format(j.feed_todo_attachment, m));
                        break;

                      case k.FEED_TODO_DUE_DATE:
                        var r = b.get("board.todos.0.due_date", this);
                        g.viewType = "todo_due", g.chatMsg = j.feed_todo_updated, g.todoAction = r ? MX.format(j.feed_todo_due_on, {
                            due_date: moment(b.get("board.todos.0.due_date", this)).format("MMMM D, h:mm A")
                        }) : j.feed_todo_due_removed;
                        break;

                      case k.FEED_TODO_ASSIGN:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_updated;
                        var s, t = b.get("board.users.0.sequence", this);
                        if (t && (s = h.members.get(t)), s = s || this.todo.assignee) {
                            var u = "";
                            s.group && s.group.name ? u = s.group.name : s.user && (u = s.user.displayName || s.user.first_name || s.user.name || ""), 
                            g.todoAction = MX.format(MX.lang["timeline_" + this.type.toLowerCase()], {
                                member: u,
                                user: m.user
                            }), m.member = u;
                        } else g.todoAction = MX.format(j.feed_todo_remove_assign, m);
                        break;

                      case k.FEED_TODO_DELETE:
                        g.viewType = "todo", g.chatMsg = j.feed_todo_updated, g.todoAction = j[this.type.toLowerCase()], 
                        this.source = MX.get("board.todos.0", this) || this.source, g.is_deleted = !0;
                        break;

                      case k.FEED_PAGES_UPLOAD:
                        g.viewType = "progress";
                        break;

                      case k.FEED_EMAIL_RECEIVE:
                        g.viewType = "email";
                        var v;
                        if (this._board.resources && (v = this.resource, this.source = this.page), g.emailResource = {}, 
                        g.emailResource.sender = l.email && l.name ? l.name + " <" + l.email + ">" : l.displayName, 
                        g.emailResource.subject = v && v.email_subject, g.emailResource.name = v && v.name, 
                        this.board.resources && this.board.resources.length > 1) {
                            g.showAttachmentList = !0, g.emailAttachments = [], this.board.resources.length > 2 && (g.showAttachmentIndicator = !0);
                            var w = {}, x = !0;
                            MX.each(this.board.pages, function(a) {
                                var b = i.parent.pages.get(a.sequence);
                                b && !w[b.original_resource_sequence] && (w[b.original_resource_sequence] = b.sequence);
                            }), MX.each(this.board.resources, function(a) {
                                if (!x) {
                                    var b = i.parent.resources.get(a.sequence);
                                    b && g.emailAttachments.push({
                                        name: b.name,
                                        resourceSequence: b.sequence,
                                        pageSequence: w[b.sequence]
                                    });
                                }
                                x = !1;
                            });
                        }
                        break;

                      case k.FEED_FOLDER_CREATE:
                        g.viewType = "folder", g.folder = this._getCurrentFolder(), m.folder = g.folder.name;
                        break;

                      case k.FEED_FOLDER_RENAME:
                        g.viewType = "folder", g.folder = this._getCurrentFolder(), m.folder = g.folder.name;
                        break;

                      case k.FEED_FOLDER_DELETE:
                        f = this._getCurrentFolder(), m.folder = f.name;
                        break;

                      case k.FEED_PAGES_MOVE:
                        g.folder = this._getCurrentFolder(), m.folder = this._getRecursiveName(g.folder) || j.root_folder, 
                        m.file = g.folder.files && g.folder.files.length ? g.folder.files[0].name : g.folder.page_groups[0].name, 
                        m.file || (g.chatMsg = j.feed_pages_move_without_name);
                        break;

                      case k.FEED_PAGES_RENAME:
                        f = this._getCurrentFolder(), m.file = f.files && f.files.length ? f.files[0].name : f.page_groups[0].name;
                        break;

                      case k.FEED_PAGES_CREATE_WITH_ANNOTATION:
                      case k.FEED_PAGES_CREATE:
                        e.call(this);
                        break;

                      case k.FEED_PAGES_ANNOTATION:
                        g.viewType = "annotate";
                        break;

                      case k.FEED_PAGES_COMMENT:
                        d.call(this), g.mentionsComment = MX.format(j.feed_pages_comment + ": {{comment}}", m);
                        break;

                      case k.FEED_PAGES_UPDATE:
                        g.viewType = "image";
                        break;

                      case k.FEED_BOARD_COMMENT:
                        c.call(this), g.mentionsComment = MX.format("{{comment}}", m);
                        break;

                      case k.FEED_BOARD_CREATE:
                        h.isconversation ? g.chatMsg = MX.lang.feed_board_create_chat : (g.viewType = "board_create", 
                        g.chatMsg = MX.lang.feed_board_begining, g.description = h.description, m.binder = h.name, 
                        m.created_time = moment(h.created_time).format("LLL"), m.target = j.feed_conversation, 
                        g.chatMsg_bak = MX.format(MX.lang.feed_board_create, m));
                        break;

                      case k.FEED_PAGES_DELETE:
                        m.target = this.board && (this.board.page_groups || this.board.resources || this.board.folders) ? j.feed_param_a_resource : this.board && this.board.pages && this.board.pages.length > 1 ? MX.format(j.feed_param_file_complex, {
                            count: this.board.pages.length
                        }) : j.feed_param_a_resource;
                        var y = this._getFiles();
                        y && y.name && (m.target += MX.format(j.feed_target_name, {
                            name: y.name
                        }));
                        break;

                      case k.FEED_BOARD_NAME_CHANGE:
                        m.newName = this.board.name || this.parent.name;
                        break;

                      case k.FEED_RELATIONSHIP_INVITE:
                        m.invitee = this._getDisplayName(this.board);
                        break;

                      case k.FEED_RELATIONSHIP_CANCEL:
                        m.invitee = this._getDisplayName(this.board);
                        break;

                      case k.FEED_RELATIONSHIP_REMOVE:
                        var z = b.get("board.users.0.sequence", this), A = this.parent.users.get(z);
                        A && (m.member = A.group && A.group.id ? A.group.name || j.name || "" : this._getDisplayName(this.board));
                        break;

                      case k.FEED_RELATIONSHIP_CHANGE_ROLE:
                        g.chatMsg = (this.board.users[0] || this.board.users[0].group).type === k.BOARD_READ ? j.feed_relationship_change_role_viewer : j.feed_relationship_change_role_editor, 
                        m.member = this._getDisplayName(this.board);
                        break;

                      case k.FEED_RELATIONSHIP_DECLINE:
                      case k.FEED_INVALID:
                        g.viewType = "system";
                        break;

                      case k.FEED_RELATIONSHIP_LEAVE:
                      case k.FEED_RELATIONSHIP_JOIN:
                        var B = b.get("board.users", this), C = !1, D = [];
                        B && B.length && (MX.each(B, function(a) {
                            A = i.parent.users.get(a.sequence), A && (A.group && A.group.id ? (D.push(A.group.name || j.team || ""), 
                            C = !0) : A.user && A.user.id !== l.id && (D.push(A.user.first_name || A.user.name || A.user.email || ""), 
                            C = !0));
                        }), C && (g.chatMsg = j.feed_relationship_join_directly), m.member = D.join(", ")), 
                        g.viewType = "system";
                        break;

                      case k.FEED_TODO_DUE_DATE_ARRIVE:
                        g.viewType = "todo", m.todo_name = this.todo.name, g.todoAction = MX.format(g.chatMsg, m), 
                        g.dateArrive = !0;
                        break;

                      case k.FEED_SESSION_SCHEDULE:
                        m.topic = g.session.topic, g.viewType = "sessions_create";
                        break;

                      case k.FEED_SESSION_RESCHEDULE:
                        g.viewType = "sessions_create";
                        break;

                      case k.FEED_SESSION_RENAME:
                        g.isRename = !0;

                      case k.FEED_SESSION_CANCEL:
                      case k.FEED_SESSION_END:
                        m.topic = g.session.topic, g.viewType = "sessions_update";
                        break;

                      case k.FEED_SESSION_START:
                        this.source.session && this.source.session.session_status === a.const.SESSION_ENDED && (g.isMeetEnded = !0), 
                        g.isStart = !0;

                      case k.FEED_SESSION_RECORDING_READY:
                        m.topic = g.session.topic, g.viewType = "sessions_action";
                        break;

                      case k.FEED_PIN:
                        g.isPin = !0, this.board.comments && this.board.comments.length > 0 ? (c.call(this), 
                        m.target = j.feed_pin_a_message) : (p = MX.get("board.pages.0.comments.0", this), 
                        p ? (d.call(this), m.target = j.feed_pin_a_page_message) : (e.call(this), g.chatMsg = j[k.FEED_PIN.toLowerCase()]));
                    }
                    return g.viewType = g.viewType || "system", g.chatMsg = MX.format(g.chatMsg, m), 
                    g.timelineMsg = j["timeline_" + this.type.toLowerCase()] || g.chatMsg, g.notAnnotate = [ k.PAGE_TYPE_VIDEO, k.PAGE_TYPE_AUDIO, k.PAGE_TYPE_WEB, k.PAGE_TYPE_URL, k.PAGE_TYPE_NOTE, k.PAGE_TYPE_DESKTOPSHARE ].indexOf(this.page && this.page.page_type) > -1, 
                    g.showVideoIndicator = g.notAnnotate, this.page && this.page.page_type === k.PAGE_TYPE_WEB && (g.showVideoIndicator = !1, 
                    g.showWebIndicator = !0), this.page && this.page.page_type === k.PAGE_TYPE_WHITEBOARD && (g.showAnnotateIndicator = !0), 
                    g;
                }
            },
            isFavorite: {
                get: function() {
                    if (b.isUndefined(this._isFavorite)) {
                        var c = this.parent.id + "_" + this.sequence, d = a.getMe();
                        this._isFavorite = d.favorites.get(c) ? !0 : !1;
                    }
                    return this._isFavorite;
                },
                set: function(a) {
                    this._isFavorite = a;
                }
            }
        },
        methods: {
            pin: function(a) {
                return this.set("is_pinned", a), this.parent.operateChild("feeds", this.getUpdateData(), "BOARD_REQUEST_PIN");
            },
            favorite: function(b) {
                return this.set("isFavorite", b), b ? a.model.UserFavorite.create(this) : a.model.UserFavorite.remove(this);
            },
            _getCurrentFolder: function() {
                var a;
                if (this.board.folders) for (a = this.board.folders[0]; a && a.folders; ) a = a.folders[0]; else a = this.board;
                return a;
            },
            _getRecursiveName: function(a) {
                var b = a.name;
                return a = this.parent.getCacheObject(a.sequence) || a, b = b || a.name;
            },
            _getFiles: function() {
                var a = this.parent;
                return a.getFileByPath(this.board);
            },
            _getDisplayName: function(b) {
                var c, d = MX.lang, e = b && b.users && b.users.length;
                if (1 >= e) return c = e && this.parent.users.get(MX.get("users.0.sequence", b), !0), 
                c ? c.user ? c = c.user : c.group && (c = c.group) : c = {}, c.id || c.email !== a.getMe().email ? c.displayName || c.name || c.email || d.member.toLowerCase() : d.me_lower_case;
                for (var f = [], g = 0; e > g; g++) {
                    var h = this.parent.users.get(b.users[g].sequence);
                    h.user ? c = h.user : h.group && (c = h.group), c = c || {}, f.push(c.id || c.email !== a.getMe().email ? c.displayName || d.member.toLowerCase() : d.me_lower_case);
                }
                return f.join(", ");
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.BoardSession", a.model.Model, {
        properties: {
            client_uuid: "",
            created_time: 0,
            revision: 0,
            sequence: 0,
            updated_time: 0,
            session: a.model.ActionObject
        },
        methods: {
            operateChild: function(a, b, c, d) {
                var e;
                return b && (e = {}, this.sequence && (e.sequence = this.sequence), e[a] = b), this.parent.operateChild("sessions", e, c, d);
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = c.config.defaults;
    a.define("Moxtra.model.BoardFile", a.model.Model, {
        properties: {
            attributeId: {
                enumerable: !1,
                value: "client_uuid"
            },
            is_recycled: !1,
            original: 0,
            client_uuid: "",
            created_time: 0,
            displayName: {
                get: function() {
                    if (this.name) return this.name;
                    if (this.pages && this.pages.length) {
                        var b = this.pages[0];
                        if (1 === this.pages.length) {
                            if (b.page_type === a.const.PAGE_TYPE_WHITEBOARD) return MX.lang.whiteboard;
                            if (b.page_type === a.const.PAGE_TYPE_WEB) return MX.lang.note;
                            if (b.page_type === a.const.PAGE_TYPE_NOTE) return MX.lang.web_clip;
                            if (b.page_type === a.const.PAGE_TYPE_VIDEO) return MX.lang.video;
                            if (b.page_type === a.const.PAGE_TYPE_AUDIO) return MX.lang.audio;
                            if (b.page_type === a.const.PAGE_TYPE_URL) return MX.lang.url;
                        }
                        if (b.original_resource_sequence) {
                            var c = this.getParent("Board"), d = c.resources.get(b.original_resource_sequence);
                            if (d) return d.name;
                        }
                    }
                    return MX.lang.file;
                }
            },
            name: "",
            revision: 0,
            sequence: 0,
            order_number: 0,
            updated_time: 0,
            isVirtual: !1,
            totalPages: {
                get: function() {
                    return this.pages.length;
                }
            },
            pages: {
                get: function() {
                    this._pages || (this._pages = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardPage",
                        filterFn: function(a) {
                            return a.is_deleted ? !1 : !0;
                        }
                    }), this._pages.inited = !0);
                    var a = this.getParent("Board");
                    return !a || a.__initializing || this.__page_sort_inited || (this.__page_sort_inited = !0, 
                    this._pages.sort(c.sort.boardPage)), this._pages;
                }
            },
            resources: a.model.BoardResource,
            thumbnail: {
                set: function(a) {
                    this._thumbnail = a;
                },
                get: function() {
                    var a = d.thumbnail_file;
                    return this.pages.length > 0 && (a = this.pages[0].thumbnail), a;
                }
            },
            assign_sequence_to_parent_field: "",
            last_modified: {
                get: function() {
                    return moment(this.updated_time).format("LL");
                }
            },
            pageIndex: {
                get: function() {
                    var a, b = 1;
                    a = "BoardFolder" === this.parent.$name ? this.parent.files : this.parent.page_groups;
                    for (var c = 0; c < a.length; c++) {
                        if (a[c].sequence === this.sequence) return b;
                        (a[c].pages.length > 0 || a[c].original) && b++;
                    }
                    return b;
                }
            },
            groupIndex: {
                get: function() {
                    var a;
                    "BoardFolder" === this.parent.$name && (a = this.parent.sequence);
                    for (var b = this.getParent("Board").getFiles(a), c = 1, d = 0; d < b.length; d++) {
                        if (b[d] === this) return c;
                        b[d].pages.length > 1 && c++;
                    }
                }
            },
            fileSize: {
                get: function() {
                    var a, c = this.getParent("Board");
                    return a = c.resources.get(this.original), a ? b.calcSize(a.content_length || 0) : this.pages && 1 === this.pages.length && (a = c.resources.get(this.pages[0].original_resource_sequence)) ? b.calcSize(a.content_length || 0) : "";
                }
            },
            fileSuffix: {
                get: function() {
                    var b, c = this.getParent("Board");
                    if (this.original && (b = c.resources.get(this.original))) return b.name.split(".").pop().toUpperCase() || b.content_type.split("/").pop();
                    if (this.pages && 1 === this.pages.length) {
                        var d = this.pages[0];
                        if (d.page_type === a.const.PAGE_TYPE_WHITEBOARD) return MX.lang.whiteboard;
                        if (d.page_type === a.const.PAGE_TYPE_NOTE) return MX.lang.note;
                        if (d.original_resource_sequence) {
                            if (b = c.resources.get(d.original_resource_sequence)) return b.name.split(".").pop().toUpperCase() || b.content_type.split("/").pop();
                        } else if (d.type) return d.type;
                    }
                    return MX.lang.file;
                }
            }
        },
        methods: {
            init: function(a, b) {
                if (this.init._super.call(this, a, b), b) {
                    var c = this.getParent("Board");
                    c.cacheObject(this, a.client_uuid);
                }
            },
            create: function(a, d) {
                this.defineProperty("parent", a), this.client_uuid || this.set("client_uuid", c.uuid());
                var e = this.client_uuid, f = this.getUpdateData(), g = a.getParent("Board"), h = {
                    preprocess: function(a) {
                        var c = b.get("object.board", a);
                        return c && g.parse(c), g.getCacheObject(e);
                    }
                }, i = "BOARD_REQUEST_CREATE_PAGE_GROUP";
                if (d) {
                    var j = a.$name, k = [], l = [];
                    return "BoardFile" === j ? (k = b.getBatchArray(d, null, {
                        page_group: e
                    }), f = a.parent.getFolderPath(null, [ f ])) : (d.forEach(function(a) {
                        a = g.getCacheObject(a), !a.isVirtual && a.original && l.push({
                            client_uuid: a.client_uuid,
                            is_deleted: !0
                        }), a.pages.each(function(a) {
                            k.push({
                                sequence: a.sequence,
                                page_group: e
                            });
                        });
                    }), f = a.getFolderPath(null, [ f ])), b.set("board.pages", k, f), h.data = f, g.operateChild(null, null, i, h).success(function() {
                        if (l.length) {
                            var b = a.getFolderPath(null, l);
                            g.operateChild(null, null, "BOARD_REQUEST_DELETE_PAGE_GROUP", {
                                data: b,
                                params: [ {
                                    name: "BOARD_REQUEST_SUPPRESS_FEED"
                                } ]
                            });
                        }
                    });
                }
                return a.operateChild(this.getNodeName(), f, i, h);
            },
            "delete": function() {
                var a = this.parent;
                return a.operateChild(this.getNodeName(), {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_DELETE_PAGE_GROUP");
            },
            update: function() {
                if (this.isVirtual) {
                    var a = this.getParent("Board"), c = new b.Request(), d = this, e = Object.keys(this.localChanged);
                    return e.length ? (a.transformVirtualFiles([ this.client_uuid ], this.parent).success(function() {
                        d._update().binding(c);
                    }).error(function(a) {
                        c.invoke("error", a);
                    }), c) : c.invoke("success");
                }
                return this._update();
            },
            _update: function() {
                var a = this.getUpdateData(), c = this;
                if (a) {
                    var d = this.parent.operateChild(this.getNodeName(), a, "BOARD_REQUEST_UPDATE_PAGE_GROUP");
                    return d.success(function() {
                        c.localChanged = {};
                    }), d;
                }
                return new b.Request({
                    isSucceed: !0,
                    isComplete: !0
                });
            },
            getNodeName: function() {
                var a = this.parent, b = "files";
                return "Board" === a.$name && (b = "page_groups"), b;
            },
            addToRecycled: function(a) {
                return this.set("is_recycled", a), this.update();
            },
            createShareToken: function() {
                return this.parent.operateChild(this.getNodeName(), [ {
                    sequence: this.sequence
                } ], "BOARD_REQUEST_CREATE_VIEW_TOKEN");
            },
            rotate: function() {
                var a, b, c = [];
                return this.pages.each(function(d) {
                    a = d.rotate + 90, a %= 360, d.set("rotate", a), b = d.getUpdateData(), c.push(b);
                }), this.parent.operateChild("pages", c);
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.BoardFolder", a.model.Model, {
        validation: {
            name: {
                required: !0,
                msg: MX.lang.name_is_required
            }
        },
        properties: {
            name: "",
            is_recycled: !1,
            folders: {
                get: function() {
                    return this._folders || (this._folders = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardFolder",
                        index: [ "client_uuid" ]
                    })), this._folders;
                }
            },
            files: {
                get: function() {
                    return this._files || (this._files = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardFile",
                        index: [ "sequence" ],
                        sortFn: c.sort.viewPage
                    })), this._files;
                }
            },
            filesLength: {
                get: function() {
                    var a = 0;
                    return this.files.each(function(b) {
                        b.is_deleted || b.is_recycled || b.pages.length < 1 && !b.original || a++;
                    }), a;
                }
            },
            sequence: 0,
            client_uuid: "",
            revision: 0,
            local_revision: 0,
            is_deleted: !1,
            assign_sequence_to_parent_field: "",
            created_time: 0,
            updated_time: 0,
            last_modified: {
                get: function() {
                    return moment(this.updated_time).format("LL");
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "sequence,folders,files"
            }
        },
        methods: {
            init: function(a, b) {
                this.init._super.call(this, a, b);
                var c = this.getParent("Board");
                c && c.cacheObject(this);
            },
            create: function(a) {
                var b = c.uuid(), d = this;
                this.defineProperty("parent", a), this.set("client_uuid", b);
                var e = a.operateChild("folders", this, "BOARD_REQUEST_CREATE_FOLDER", {
                    preprocess: function(a) {
                        c.processBoardSubscribe(a.object.board);
                        var e = d.getParent("Board");
                        return e.getCacheObject(b);
                    }
                });
                return e;
            },
            "delete": function() {
                var a = this.parent;
                return a.operateChild("folders", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_DELETE_FOLDER", {
                    params: [ {
                        name: "BOARD_REQUEST_DELETE_FOLDER_RECURSIVELY"
                    } ]
                });
            },
            update: function() {
                var a = this.getUpdateData(), c = this;
                if (a) {
                    var d = this.parent.operateChild("folders", a, "BOARD_REQUEST_UPDATE_FOLDER");
                    return d.success(function() {
                        c.localChanged = {};
                    }), d;
                }
                return new b.Request({
                    isSucceed: !0,
                    isComplete: !0
                });
            },
            createShareToken: function() {
                return this.parent.operateChild("folders", [ {
                    sequence: this.sequence
                } ], "BOARD_REQUEST_CREATE_VIEW_TOKEN");
            },
            operateChild: function(a, b, c, d) {
                var e = {
                    sequence: this.sequence
                };
                d = d || {}, c || console.error(this.$name + ".operateChild need type parameters");
                var f = this.getUpdateData();
                if (f && (e = f), a) {
                    if (Array.isArray(b)) {
                        if (b[0].getUpdateData) for (var g = 0; g < b.length; g++) b[g] = b[g].getUpdateData();
                    } else b = b.getUpdateData ? [ b.getUpdateData() ] : [ b ];
                    e[a] = b;
                }
                return this.parent.operateChild("folders", e, c, d);
            },
            getFolderPath: function(a, b) {
                var c = {
                    sequence: this.sequence
                };
                return a && (c.folders = a), b && (c.files = b), this.parent.getFolderPath([ c ]);
            }
        }
    });
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.model.BoardLastFeed", a.model.Model, {
        properties: {
            boardId: {
                get: function() {
                    return this.parent.board.id;
                }
            },
            created_time: 0,
            revision: 0,
            sequence: 0,
            timestamp: 0,
            type: "",
            is_deleted: !1,
            updated_time: 0,
            is_pinned: !1,
            actor: {
                set: function(a) {
                    this._actor = a;
                },
                get: function() {
                    if (!this._actor) return {};
                    if (this._actor.type === a.const.USER_TYPE_SERVICE) {
                        var b = a.getService(this._actor.name) || {};
                        return {
                            user: {
                                first_name: this._actor.first_name || b.displayName,
                                displayName: this._actor.first_name || b.displayName,
                                name: this._actor.name
                            },
                            avatar: this._actor.picture_url || "images/service/" + this._actor.name + ".png",
                            isServiceIntegration: !0
                        };
                    }
                    var c = this._actor.id || this._actor.email;
                    if (c) {
                        var d = this.parent.board.users.get(c, !0) || {};
                        d.user = d.user || {};
                        var e = {
                            user: {
                                id: this._actor.id || d.user.id || "",
                                unique_id: this._actor.unique_id || d.user.unique_id || "",
                                groups: this._actor.groups || "",
                                first_name: this._actor.first_name || d.user.first_name || "",
                                name: this._actor.name || d.user.name || "",
                                email: this._actor.email || d.user.email || ""
                            },
                            online: d.online || !1,
                            avatar: d.avatar || a.getMe().branding.getDefaultUserAvatar(),
                            enableBizCard: d.enableBizCard || !1
                        };
                        return e.user.displayName = e.user.first_name || e.user.name || e.user.email || "", 
                        e;
                    }
                    return {};
                }
            },
            board: a.model.Board,
            parseOrder: {
                enumerable: !1,
                value: "sequence,board,source,actor,message"
            },
            comment: {
                get: function() {
                    var a = this.parent.board, c = this.board;
                    if (c.comments) {
                        var d = b.get("0.sequence", c.comments);
                        return a.comments.get(d, !0) || {};
                    }
                }
            },
            pages: {
                get: function() {
                    var a = this.parent.board;
                    return a.pages ? a.pages : void 0;
                }
            },
            page: {
                get: function() {
                    return this.pages && this.pages[0] || {};
                }
            },
            resources: {
                get: function() {
                    var a = this.parent.board;
                    return a.resources ? a.resources : void 0;
                }
            },
            page_groups: {
                get: function() {
                    var a = this.parent.board;
                    return a.page_groups ? a.page_groups : void 0;
                }
            },
            folder: {
                get: function() {
                    var a = this.parent.board, c = this.board;
                    if (c.folders) {
                        var d = b.get("0.sequence", c.folders);
                        return a.folders.get(d, !0) || {};
                    }
                }
            },
            todo: {
                get: function() {
                    var a = this.parent.board, c = this.board;
                    if (c.todos) {
                        var d = b.get("0.sequence", c.todos);
                        return a.todos.get(d, !0) || {};
                    }
                }
            },
            isMe: !1,
            message: {
                get: function() {
                    var c, d = this, e = MX.lang, f = a.const, g = e["timeline_" + this.type.toLowerCase()] || e[this.type.toLowerCase() || f.FEED_INVALID.toLowerCase()] || "", h = this.actor && this.actor.user || {}, i = {};
                    i.user = h.displayName;
                    var j = a.getMe();
                    switch (j.id === h.id ? this.isMe = !0 : this.parent && (i.user = this.parent.board.getTeamMemberName(h.displayName, b.get("groups", h))), 
                    i.board_type = e.feed_conversation, this.type) {
                      case f.FEED_TODO_COMMENT:
                        var k, l = MX.get("board.todos.0.comments.0.sequence", this), m = this.todo.comments.get(l);
                        m && (k = m.text), g += ": " + k;
                        break;

                      case f.FEED_TODO_ATTACHMENT:
                        var n = MX.get("board.todos.0.references.0", this);
                        n && n.is_deleted && (g = e.timeline_feed_todo_attachment_deleted);
                        break;

                      case f.FEED_TODO_DUE_DATE:
                        var o = b.get("board.todos.0.due_date", this);
                        o || (g = e.timeline_feed_todo_due_date_removed);
                        break;

                      case f.FEED_TODO_ASSIGN:
                        var p, q = b.get("board.users.0.sequence", this);
                        if (q && (p = this.parent.board.members.get(q)), p = p || this.todo.assignee) {
                            var r = "";
                            p.group && p.group.name ? r = p.group.name : p.user && (r = p.user.displayName || p.user.first_name || p.user.name || ""), 
                            i.member = r;
                        } else g = e.feed_todo_remove_assign;
                        break;

                      case f.FEED_FOLDER_CREATE:
                      case f.FEED_FOLDER_RENAME:
                      case f.FEED_FOLDER_DELETE:
                        c = this._getCurrentFolder(), i.folder = c.name;
                        break;

                      case f.FEED_PAGES_MOVE:
                        c = this._getCurrentFolder(), i.folder = c.name || e.root_folder, i.file = c.files && c.files.length ? c.files[0].name : c.page_groups[0].name;
                        break;

                      case f.FEED_PAGES_RENAME:
                        c = this._getCurrentFolder(), i.file = c.files && c.files.length ? c.files[0].name : c.page_groups[0].name;
                        break;

                      case f.FEED_PAGES_CREATE_WITH_ANNOTATION:
                      case f.FEED_PAGES_CREATE:
                        var s = this._getFiles();
                        if (this.board.pages) if (1 === this.board.pages.length) if (this.page.page_type === a.const.PAGE_TYPE_URL) i.target = e.feed_pages_create_url; else {
                            switch (this.page.page_type) {
                              case a.const.PAGE_TYPE_AUDIO:
                                i.target = e.feed_an_audio_page;
                                break;

                              case a.const.PAGE_TYPE_VIDEO:
                                i.target = e.feed_a_video_page;
                                break;

                              case a.const.PAGE_TYPE_NOTE:
                                g = e.feed_clip_create;
                                break;

                              case a.const.PAGE_TYPE_PDF:
                              case a.const.PAGE_TYPE_NOT_SUPPORTED:
                                i.target = e.feed_param_a_resource;
                                break;

                              case a.const.PAGE_TYPE_WHITEBOARD:
                                i.target = e.feed_param_a_whiteboard;
                                break;

                              case a.const.PAGE_TYPE_WEB:
                                i.target = e.feed_param_a_note;
                                break;

                              case a.const.PAGE_TYPE_IMAGE:
                                i.target = e.feed_param_an_image;
                                break;

                              default:
                                i.target = e.feed_param_a_resource;
                            }
                            s && !s.isVirtual ? s.name ? i.target += MX.format(e.feed_target_name, {
                                name: s.name
                            }) : s.id || !s.name && !s.displayName || this.page.page_type === a.const.PAGE_TYPE_WHITEBOARD || (i.target += MX.format(e.feed_target_name, {
                                name: s.displayName || s.name
                            })) : this.page.name && (i.target += MX.format(e.feed_target_name, {
                                name: this.page.name
                            }));
                        } else s ? (i.target = e.feed_param_a_resource, (s.name || s.displayName) && (i.target += ' "' + (s.displayName || s.name) + '"')) : i.target = MX.format(e.feed_param_file_complex, {
                            count: this.board.pages.length
                        }); else s ? (i.target = e.feed_param_a_resource, s.name && (i.target += ' "' + s.name + '"')) : i.target = e.feed_param_one_page;
                        break;

                      case f.FEED_PAGES_COMMENT:
                        var t = MX.get("board.pages.0.comments.0.sequence", this), m = this.page.comments && this.page.comments.get(t) || {};
                        i.comment = m.text, m.is_deleted || void 0 === m.text ? g = e.feed_pages_comment_deleted : m.voice ? g = e.feed_pages_voice_comment : g += ": " + m.text;
                        break;

                      case f.FEED_BOARD_COMMENT:
                        var u;
                        !this.page && this.comment && this.comment.resource ? g = e.feed_board_comment_voice : (u = this.comment, 
                        i.comment = u.text || "");
                        break;

                      case f.FEED_BOARD_CREATE:
                        this.board.isconversation ? g = MX.lang.feed_board_create_chat : (g = MX.lang.feed_board_create, 
                        i.target = e.feed_conversation);
                        break;

                      case f.FEED_PAGES_DELETE:
                        i.target = this.board && (this.board.page_groups || this.board.resources || this.board.folders) ? e.feed_param_a_resource : this.board && this.board.pages && this.board.pages.length > 1 ? MX.format(e.feed_param_file_complex, {
                            count: this.board.pages.length
                        }) : e.feed_param_a_resource;
                        var v = this._getFiles();
                        v && v.name && (i.target += MX.format(e.feed_target_name, {
                            name: v.name
                        }));
                        break;

                      case f.FEED_BOARD_NAME_CHANGE:
                        i.newName = this.board.name || this.parent.board.name;
                        break;

                      case f.FEED_RELATIONSHIP_INVITE:
                      case f.FEED_RELATIONSHIP_CANCEL:
                        i.invitee = this._getDisplayName(this.board);
                        break;

                      case f.FEED_RELATIONSHIP_REMOVE:
                        var w = b.get("board.users.0.sequence", this), x = this.parent.board.users.get(w);
                        x && (x.group && x.group.id ? (g = e.feed_relationship_remove, i.member = x.group.name || e.name || "") : i.member = this._getDisplayName(this.board));
                        break;

                      case f.FEED_RELATIONSHIP_CHANGE_ROLE:
                        g = (this.board.users[0] || this.board.users[0].group).type === f.BOARD_READ ? e.feed_relationship_change_role_viewer : e.feed_relationship_change_role_editor, 
                        i.member = this._getDisplayName(this.board);
                        break;

                      case f.FEED_RELATIONSHIP_LEAVE:
                      case f.FEED_RELATIONSHIP_JOIN:
                        var y = b.get("board.users", this), z = !1, A = [];
                        y && y.length && (MX.each(y, function(a) {
                            x = d.parent.board.users.get(a.sequence), x && (x.group && x.group.id ? (A.push(x.group.name || e.team || ""), 
                            z = !0) : x.user && x.user.id !== h.id && (A.push(x.user.first_name || x.user.name || x.user.email || ""), 
                            z = !0));
                        }), z && (g = e.feed_relationship_join_directly), i.member = A.join(", "));
                        break;

                      case f.FEED_TODO_DUE_DATE_ARRIVE:
                        i.todo_name = this.todo.name;
                        break;

                      case f.FEED_SESSION_SCHEDULE:
                      case f.FEED_SESSION_RESCHEDULE:
                      case f.FEED_SESSION_START:
                      case f.FEED_SESSION_END:
                      case f.FEED_SESSION_RECORDING_READY:
                      case f.FEED_SESSION_CANCEL:
                      case f.FEED_SESSION_RENAME:
                        i.topic = MX.get("board.sessions.0.session.topic", this);
                        break;

                      case f.FEED_PIN:
                        this.board.comments && this.board.comments.length > 0 ? i.target = e.feed_pin_a_message : (m = MX.get("board.pages.0.comments.0", this), 
                        i.target = m ? e.feed_pin_a_page_message : e.feed_param_a_resource);
                    }
                    return g = MX.format(g, _.extend({}, i, {
                        user: h.displayName
                    }));
                }
            }
        },
        methods: {
            _getCurrentFolder: function() {
                var a;
                if (this.board.folders) for (a = this.board.folders[0]; a && a.folders; ) a = a.folders[0]; else a = this.board;
                return a;
            },
            _getFiles: function() {
                var a = this.parent.board;
                return a.getFileByPath(this.board);
            },
            _getDisplayName: function(b) {
                var c, d = MX.lang, e = b && b.users && b.users.length;
                if (1 >= e) return c = e && this.parent.board.users.get(MX.get("users.0.sequence", b), !0), 
                c ? c.user ? c = c.user : c.group && (c = c.group) : c = {}, c.id || c.email !== a.getMe().email ? c.displayName || c.name || c.email || d.member.toLowerCase() : d.me_lower_case;
                for (var f = [], g = 0; e > g; g++) {
                    var h = this.parent.board.users.get(b.users[g].sequence);
                    h.user ? c = h.user : h.group && (c = h.group), c = c || {}, f.push(c.id || c.email !== a.getMe().email ? c.displayName || d.member.toLowerCase() : d.me_lower_case);
                }
                return f.join(", ");
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = b.storage("SilentMessage");
    a.define("Moxtra.model.Board", a.model.Model, {
        properties: {
            attributeId: "id",
            client_uuid: "",
            created_time: 0,
            id: "",
            isdefault: !1,
            local_revision: 0,
            is_deleted: !1,
            description: "",
            email_address: "",
            name: {
                set: function(a) {
                    this.defineProperty("_name", a);
                },
                get: function() {
                    var b = c.userBoards.get(this.id);
                    return a.api.util.getBoardName(b, this._name);
                }
            },
            revision: {
                get: function() {
                    return this._revision;
                }
            },
            thumbnail: {
                set: function(a) {
                    this.defineProperty("_thumbnail", a);
                },
                get: function() {
                    if (!this._thumbnail) {
                        var d = a.getMe().branding.getDefaultCover();
                        return d ? d : c.config.defaults.binder_cover;
                    }
                    var e = b.format("/board/{{id}}/{{_thumbnail}}", this);
                    return e = a.util.makeAccessTokenUrl(e, {
                        ignorePublicView: !0
                    });
                }
            },
            thumbnail_source_page: 0,
            thumbnail_source_resource: 0,
            thumbnail_small: {
                get: function() {
                    if (!this._thumbnail) {
                        var d = a.getMe().branding.getDefaultCover();
                        return d ? d : c.config.defaults.binder_cover;
                    }
                    var e = b.format("/board/{{id}}/{{_thumbnail}}", this);
                    return e = a.util.makeAccessTokenUrl(e, {
                        ignorePublicView: !0
                    });
                }
            },
            total_comments: 0,
            total_members: 0,
            total_pages: 0,
            total_size: 0,
            total_open_todos: 0,
            total_todos: 0,
            updated_time: 0,
            has_folder: !1,
            isconversation: {
                set: function(a) {
                    this.defineProperty("_isconversation", a);
                },
                get: function() {
                    return this._isconversation ? 1 === this.members.length ? !1 : !0 : !1;
                }
            },
            is_conversation: {
                get: function() {
                    return this._isconversation || !1;
                }
            },
            is_team: !1,
            islive: !1,
            isnote: !1,
            is_restricted: !1,
            view_token: "",
            feeds: {
                enumerable: !1,
                isClass: !0,
                get: function() {
                    return this._feeds || (this._feeds = new c.Collection({
                        model: "Moxtra.model.BoardFeed",
                        maxPageCount: 20,
                        sortFn: c.sort.feeds,
                        owner: this
                    })), this._feeds;
                }
            },
            todoHistory: {
                enumerable: !1,
                isClass: !0,
                get: function() {
                    return this._todoHistory || (this._todoHistory = new c.Cache({
                        model: "Moxtra.model.BoardFeed",
                        attributeId: "sequence",
                        owner: this
                    })), this._todoHistory;
                }
            },
            pages: {
                enumerable: !1,
                isClass: !0,
                get: function() {
                    return this._pages || (this._pages = new c.Collection({
                        model: "Moxtra.model.BoardPage",
                        owner: this,
                        sortFn: function(a, b) {
                            var c = parseFloat(a.page_number), d = parseFloat(b.page_number);
                            return d > c ? -1 : c > d ? 1 : a.sequence > b.sequence ? 1 : -1;
                        }
                    })), this._pages;
                }
            },
            todos: {
                enumerable: !1,
                isClass: !0,
                get: function() {
                    return this._todos || (this._todos = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardTodo",
                        index: [ "client_uuid", "sequence" ],
                        removeDeleted: !1,
                        sortFn: c.sort.todo
                    })), this._todos;
                }
            },
            resources: {
                get: function() {
                    return this._resources || (this._resources = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardResource"
                    })), this._resources;
                }
            },
            users: {
                get: function() {
                    return this._users || (this._users = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardUser",
                        index: [ "user.id", "user.email", "group.id" ],
                        removeDeleted: !1
                    })), this._users;
                }
            },
            reference_links: {
                get: function() {
                    return this._reference_links || (this._reference_links = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.boardReferenceLink",
                        removeDeleted: !0
                    })), this._reference_links;
                }
            },
            comments: {
                get: function() {
                    return this._comments || (this._comments = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.Comment"
                    })), this._comments;
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "id,users,name,resources,folders,page_groups,pages,comments,reference_links,todos,sessions,feeds,lastFeed,lastFeedTime"
            },
            page_groups: {
                enumerable: !1,
                isClass: !0,
                get: function() {
                    return this._page_groups || (this._page_groups = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardFile",
                        attributeId: "client_uuid",
                        index: [ "sequence", "client_uuid" ]
                    })), this._page_groups;
                }
            },
            sessions: {
                isClass: !0,
                get: function() {
                    return this._sessions || (this._sessions = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardSession",
                        removeDeleted: !1,
                        index: [ "sequence", "session.board_id" ]
                    })), this._sessions;
                }
            },
            session: {
                isClass: !0,
                get: function() {
                    return b.get("sessions.0.session", this);
                }
            },
            members: {
                isClass: !0,
                get: function() {
                    return this._members || (this._members = this.users.clone({
                        filterFn: {
                            is_deleted: !1
                        }
                    })), this._members;
                }
            },
            tags: {
                isClass: !0,
                get: function() {
                    return this._tags || (this._tags = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardTag",
                        index: [ "client_uuid", "name" ],
                        removedFlag: [ "is_deleted" ]
                    })), this._tags;
                }
            },
            owner: {
                get: function() {
                    var b = MX.filter(this.users, {
                        type: a.const.BOARD_OWNER,
                        is_deleted: !1
                    });
                    return b && b.length ? b[0].user : null;
                }
            },
            isSilentMessageOn: {
                get: function() {
                    var a = d.get(this.id);
                    return a === !0;
                },
                set: function(a) {
                    var b = this.id;
                    a ? d.set(b, a) : d.remove(b);
                }
            },
            isNotificationOff: {
                get: function() {
                    var a = this.getMyBoardUserInfo();
                    return a && a.is_notification_off;
                }
            },
            files: {
                enumerable: !1,
                get: function() {
                    return this.page_groups;
                }
            },
            view_tokens: {
                isClass: !0,
                get: function() {
                    return this._view_tokens || (this._view_tokens = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardViewToken"
                    })), this._view_tokens;
                }
            },
            serviceTokens: {
                get: function() {
                    var b = [];
                    return this.view_tokens && this.view_tokens.each(function(c) {
                        c.actor_file_as && c.actor_file_as.type === a.const.USER_TYPE_SERVICE && b.push(c);
                    }), b;
                }
            },
            totalIntegrations: {
                get: function() {
                    return this.serviceTokens.length;
                }
            },
            folders: {
                isClass: !0,
                get: function() {
                    return this._folders || (this._folders = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardFolder",
                        sortFn: c.sort.folder
                    })), this._folders;
                }
            }
        },
        methods: {
            init: function(a, c) {
                this.init._super.call(this, null, c), b.defineProps(this, {
                    syncTime: 0,
                    _revision: 0,
                    _foldersMap: {}
                }, !0, !1), a && this.parse(a);
            },
            parse: function(a, b) {
                if (b) {
                    this._foldersMap = {};
                    var c = this;
                    [ "page_groups", "pages" ].forEach(function(a) {
                        c[a].inited && c[a].clear();
                    }), this.__initializing = !0;
                } else this.__initializing = !1;
                return this.parse._super.call(this, a, b);
            },
            afterParse: function(a) {
                if (a === c.status.isAllFullData) {
                    var b = this;
                    [ "users", "feeds", "pages", "todos", "comments", "resources" ].forEach(function(c) {
                        b[c].inited || b[c].push([], a);
                    });
                }
            },
            cacheObject: function(a, b) {
                b = b || a.sequence, this._foldersMap[b] || (this._foldersMap[b] = a, a.client_uuid && (this._foldersMap[a.client_uuid] = a));
            },
            getCacheObject: function(a) {
                return this._foldersMap[a];
            },
            create: function() {
                this.set("client_uuid", uuid());
                var a = this.operateChild(null, null, "BOARD_REQUEST_CREATE"), c = this;
                return a.success(function(a) {
                    c.parse(a.object.board), b.saveCacheClass(c);
                }), a;
            },
            "delete": function() {
                var a = this;
                return this.operateChild(null, null, "BOARD_REQUEST_DELETE").success(function() {
                    _.defer(function() {
                        c.userBoards.remove(a.id);
                    }, 1e3);
                });
            },
            update: function(a, b) {
                return this.operateChild(a, null, "BOARD_REQUEST_UPDATE", b);
            },
            operateChild: function(c, e, f, g) {
                var h = {};
                g = g || {}, f = f || "BOARD_REQUEST_UPDATE";
                var i = this.getUpdateData();
                (i && "BOARD_REQUEST_UPDATE" === f || !this.id) && (h = b.set("object.board", i, {}));
                var j = function() {
                    return new b.Request({
                        isSucceed: !0,
                        isComplete: !0
                    });
                };
                if ("BOARD_REQUEST_UPDATE" !== f && (i = !0), c) if (e) {
                    if (Array.isArray(e) || (e = [ e ]), e[0].getUpdateData) {
                        var k = e;
                        e = [], _.each(k, function(a) {
                            var b = a.getUpdateData();
                            b && e.push(b);
                        });
                    }
                    b.set("object.board." + c, e, h);
                } else {
                    var l = this[c], m = l.attributeId;
                    if (e = [], l instanceof a.Collection) if (l.each(function(a) {
                        var b = a.getUpdateData();
                        b && (b[m] || (b[m] = a[m]), e.push(b));
                    }), e.length) b.set("object.board." + c, e, h); else if (!i) return j();
                } else if (e) b.set("object.board", e, h); else if (g.data) h.object = g.data; else if (!i) return j();
                g.params && (h.params = (h.params || []).concat(g.params)), this.id && (b.set("object.board.id", this.id, h), 
                d.get(this.id) && (h.params = h.params || [], h.params.push({
                    name: "BOARD_REQUEST_PUSH_NOTIFICATION_OFF"
                }))), h.type = f, g.beforeSend && (h = g.beforeSend(h));
                var n = this;
                if (g.parseData) {
                    var o = g.preprocess;
                    g.preprocess = function(a) {
                        var b = a.object.board;
                        return n.parse(b), o ? o(a) : n;
                    };
                }
                return new b.Request({
                    url: "/board",
                    data: h,
                    preprocess: g.preprocess
                });
            },
            getIndividualInfo: function() {
                var b, c, d = a.model.Root.user, e = this.members;
                if (b = e.get(d.id)) return b;
                for (var f = 0; f < e.length; f++) if (b = e[f], b.user && (d.id && d.id === b.user.id || d.email && d.email === b.user.email)) {
                    c = b;
                    break;
                }
                return c || {};
            },
            getMyBoardUserInfo: function() {
                var b, c, d, e, f, g, h = a.model.Root.user, i = this.members;
                if (b = i.get(h.id), b && (b.type === a.const.BOARD_READ_WRITE || b.type === a.const.BOARD_OWNER)) {
                    if (b.status === a.const.BOARD_MEMBER) return b;
                    d = b;
                }
                for (var j = 0; j < i.length; j++) {
                    if (b = i[j], b.user && (h.id && h.id === b.user.id || h.email && h.email === b.user.email)) if (b.status === a.const.BOARD_MEMBER) {
                        if (b.type === a.const.BOARD_READ_WRITE) {
                            g = b;
                            break;
                        }
                        e = b;
                    } else d = b;
                    if (b.group && (c = h.groups.get(b.group.id))) {
                        if (b.type === a.const.BOARD_READ_WRITE) {
                            g = b;
                            break;
                        }
                        f = b;
                    }
                }
                return g || (g = e || f || d || {}), g;
            },
            addToGroup: function(a, b) {
                var c = this.operateChild("users", {
                    group: {
                        id: a
                    },
                    type: b
                }, "BOARD_REQUEST_INVITE");
                return c;
            },
            removeFromGroup: function(a) {
                var c = this.getMyBoardUserInfo();
                if (c.isGroup) {
                    var d = new b.Request({
                        url: "/board",
                        data: {
                            object: {
                                board: {
                                    id: this.id
                                },
                                group: {
                                    id: a
                                }
                            },
                            type: "GROUP_REQUEST_BOARD_LEAVE"
                        }
                    });
                    return d;
                }
                return this.operateChild("users", {
                    group: {
                        id: a
                    }
                }, "BOARD_REQUEST_EXPEL");
            },
            inviteUsers: function(c, d, e) {
                var f = [], g = {};
                d = d || a.const.BOARD_READ_WRITE, b.each(c, function(a) {
                    a.group_id ? (a.id = a.group_id, delete a.group_id, f.push({
                        type: d,
                        group: a
                    })) : f.push({
                        type: d,
                        user: a
                    }), a && a.unique_id && (g.params = [ {
                        name: "BOARD_REQUEST_INVITE_ADD_DIRECTLY"
                    } ]);
                }), e && (g.params || (g.params = []), g.params.push({
                    name: "BOARD_REQUEST_INVITE_MESSAGE",
                    string_value: e
                }));
                var h = this, i = this.operateChild("users", f, "BOARD_REQUEST_INVITE", g);
                return i.success(function(a) {
                    var c = b.get("object.board.users", a);
                    c && h.parse({
                        users: c
                    });
                }), i;
            },
            removeUser: function(a) {
                var b = this, c = this.operateChild("users", {
                    sequence: a,
                    is_deleted: !0
                }, "BOARD_REQUEST_EXPEL");
                return c.success(function() {
                    b.users.remove(a);
                }), c;
            },
            acceptInvite: function() {
                return this.operateChild(null, null, "BOARD_REQUEST_JOIN");
            },
            declineInvite: function() {
                return this.leave();
            },
            leave: function() {
                var a = this;
                return this.operateChild(null, null, "BOARD_REQUEST_LEAVE").success(function() {
                    _.defer(function() {
                        c.userBoards.remove(a.id);
                    }, 1e3);
                });
            },
            duplicate: function(a) {
                var c = {
                    type: "BOARD_REQUEST_DUPLICATE",
                    object: {
                        user: {
                            boards: [ {
                                board: {
                                    id: this.id
                                }
                            } ]
                        },
                        board: {
                            name: a
                        }
                    }
                };
                return new b.Request({
                    url: "/board",
                    data: c
                });
            },
            assignCategory: function(a) {
                var c = {
                    type: "USER_REQUEST_CATEGORY_ASSIGN",
                    object: {
                        user: {
                            boards: [ {
                                board: {
                                    id: this.id
                                },
                                category: a
                            } ]
                        }
                    }
                };
                return new b.Request({
                    url: "/user",
                    data: c
                });
            },
            sync: function(d) {
                var e = this, f = 0 === this.revision, g = {}, h = a.const;
                if (d = d || {}, Date.now() - this.syncTime < 1e3) return new b.Request({
                    isSucceed: !0,
                    preprocess: function() {
                        return e;
                    }
                });
                b.set("object.board", {
                    id: this.id,
                    revision: e._revision
                }, g), g.params = [ {
                    name: "SUBSCRIBE_REQUEST_NOHANG"
                } ], d.filter && (_.each(d.filter, function(a) {
                    g.params.push({
                        name: "OUTPUT_FILTER_STRING",
                        string_value: "/board/" + a
                    });
                }), g.params.push({
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/board/id"
                }), f = !1), g.type = "BOARD_REQUEST_SUBSCRIBE", _.defer(function() {
                    e.trigger(h.EVENT_SYNC_START);
                }, 100);
                var i = this._req = new b.Request({
                    url: "/board",
                    data: g,
                    ignorePublicView: d.ignorePublicView,
                    preprocess: function(g) {
                        var i;
                        return f && (e.syncTime = Date.now()), i = b.get("object.board", g), i = i && i.id ? c.processBoardSubscribe(i, f, d.withOutCache) : a.getBoard(e.id), 
                        e.trigger(h.EVENT_SYNC_END), i ? i : e;
                    }
                });
                return i;
            },
            subscribe: function() {
                c.Root.user.subscribe(this);
            },
            unsubscribe: function() {
                c.Root.user.unsubscribe(this);
            },
            createViewToken: function(a) {
                var c = this, d = {
                    type: "BOARD_REQUEST_CREATE_VIEW_TOKEN",
                    object: {
                        board: {
                            id: this.id
                        }
                    }
                };
                a && (d.object.board.resources = [ {
                    type: "BOARD_RESOURCE_SESSION_AS_VIDEO"
                } ]);
                var e = new b.Request({
                    url: "/board",
                    data: d
                });
                return e.success(function(a) {
                    c.view_token = b.get("object.board.view_tokens.0.token", a);
                }), e;
            },
            deletePage: function(a, b) {
                var c = {};
                return b && (c.page_groups = [], b.forEach(function(a) {
                    c.page_groups.push({
                        client_uuid: a,
                        is_deleted: !0
                    });
                })), a && (c.pages = [], a.forEach(function(a) {
                    c.pages.push({
                        sequence: a,
                        is_deleted: !0
                    });
                })), this.operateChild(null, c);
            },
            movePage: function(a, b) {
                var c = this.copyPage(a, b), d = this;
                return c.success(function() {
                    d.deletePage(a);
                }), c;
            },
            copyPage: function(a, c) {
                var d = "BOARD_REQUEST_COPY_PAGES", e = c.getFolderPath(), f = {
                    board: {
                        id: this.id,
                        pages: b.getBatchArray(a, "sequence")
                    }
                };
                return b.set("user.boards", [ f ], e), new b.Request({
                    url: "/board",
                    data: {
                        type: d,
                        object: e
                    }
                });
            },
            deleteTodo: function(a) {
                var b = [];
                return Array.isArray(a) ? _.each(a, function(a) {
                    b.push({
                        sequence: a,
                        is_deleted: !0
                    });
                }) : b.push({
                    sequence: a,
                    is_deleted: !0
                }), this.operateChild("todos", b, "BOARD_REQUEST_DELETE_TODO");
            },
            moveTodo: function(a, b) {
                var c = this.copyTodo(a, b), d = this;
                return c.success(function() {
                    d.deleteTodo(a);
                }), c;
            },
            gotoSubFolder: function() {
                for (var a = Array.prototype.slice.call(arguments, 0, arguments.length), b = a.shift(), c = this.folders.get(b); a.length; ) b = a.shift(), 
                c = c.folders.get(b);
                return c;
            },
            copyTodo: function(a, c) {
                var d = [];
                Array.isArray(a) ? _.each(a, function(a) {
                    d.push({
                        sequence: a
                    });
                }) : d.push({
                    sequence: a
                });
                var e = {
                    type: "BOARD_REQUEST_COPY_TODOS",
                    object: {
                        user: {
                            boards: [ {
                                board: {
                                    id: this.id,
                                    todos: d
                                }
                            } ]
                        },
                        board: {
                            id: c
                        }
                    }
                };
                return new b.Request({
                    url: "/board",
                    data: e
                });
            },
            updateChildren: function(a) {
                var c = [];
                if (a && this[a] && this[a].length) {
                    var d, e = this[a];
                    e.each(function(a) {
                        d = a.getUpdateData(), d && c.push(d);
                    });
                }
                if (c.length) return this.operateChild(a, c);
                var f = new b.Request();
                return f.invoke("success", null), f;
            },
            on: function(b, c, d) {
                var e = !1;
                b === a.const.EVENT_FIRST_SUBSCRIBE && 0 !== this.revision && (e = !0), e ? c.call(d || this) : this.on._super.call(this, b, c, d);
            },
            getTeamMemberName: function(a) {
                return a = a || "";
            },
            getFolders: function(a) {
                var b, d, e = this;
                return a ? (d = e.getCacheObject(a)) && (b = d.folders) : b = e.folders, b ? (b.inited || (b.inited = !0), 
                b.clone({
                    filterFn: function(a) {
                        return a.is_deleted || a.is_recycled ? !1 : !0;
                    },
                    sortFn: c.sort.folder
                })) : null;
            },
            getFiles: function(a) {
                var b, d, e = this;
                if (a ? (b = e.getCacheObject(a), d = b.files) : d = e.page_groups, !d) return null;
                d.inited || (d.inited = !0);
                var f = d.clone({
                    sortFn: c.sort.viewPage,
                    filterFn: function(a) {
                        return !a || a.is_deleted || a.is_recycled ? !1 : a.original || !a.pages || a.pages.length ? !0 : !1;
                    }
                });
                return f.each(function(a) {
                    a.pages.sort(function(a, b) {
                        var c = parseFloat(a.page_number), d = parseFloat(b.page_number);
                        return d > c ? -1 : c > d ? 1 : a.sequence > b.sequence ? 1 : -1;
                    });
                }), f;
            },
            getPages: function(b) {
                var c, d, e = this;
                if (b ? (c = e.getCacheObject(b), d = c.files) : d = e.page_groups, !d) return null;
                d.inited || (d.inited = !0);
                var f = new a.Collection({
                    attributeId: "sequence",
                    owner: this,
                    model: "Moxtra.model.BoardPage"
                });
                return _.each(d, function(a) {
                    _.each(a.pages, function(a) {
                        f.push(a);
                    });
                }), f;
            },
            getNodeName: function(a) {
                var b = "files";
                return a && "Board" !== a.$name || (b = "page_groups"), b;
            },
            copyFiles: function(a, c, d, e) {
                function f(a) {
                    return "Board" === d.$name ? d.getCacheObject(a) : d.files.get(a);
                }
                var g, h = [], i = [];
                d = d || this;
                var j = c.getFolderPath();
                e = e || "BOARD_REQUEST_COPY_PAGE_GROUP", _.each(a, function(a) {
                    g = f(a), g && (g.isVirtual ? g.pages.length && i.push({
                        sequence: g.pages[0].sequence
                    }) : h.push(a));
                });
                var k = d.getFolderPath(null, b.getBatchArray(h, "client_uuid"));
                return i.length && b.set("board.pages", i, k), b.set("user.boards", [ k ], j), new b.Request({
                    url: "/board",
                    data: {
                        type: e,
                        object: j
                    }
                });
            },
            copyAndTransformFiles: function(a, c, d, e) {
                var f = new b.Request(), g = this;
                return d = d || this, this.transformVirtualFiles(a, d).success(function() {
                    g.copyFiles(a, c, d, e).binding(f);
                }).error(function(a) {
                    f.invoke("error", a);
                }), f;
            },
            copyResources: function(a, c, d, e) {
                var f = this;
                d = d || this;
                var g = c.getFolderPath();
                return e = e || "BOARD_REQUEST_COPY_RESOURCES", b.set("user.boards", [ {
                    id: f.id,
                    resources: b.getBatchArray(a, "sequence")
                } ], g), new b.Request({
                    url: "/board",
                    data: {
                        type: e,
                        object: g
                    }
                });
            },
            _getFileSequenceFromClientUUID: function(a) {
                var b = [], c = this;
                return _.each(a, function(a) {
                    a = c.getCacheObject(a), a && b.push(a.sequence);
                }), b;
            },
            _getBatchSequence: function(a, b, c) {
                var d = [];
                return b = b || "sequence", _.each(a, function(a) {
                    var e = {};
                    e[b] = a, c && _.extend(e, c), d.push(e);
                }), d;
            },
            transformVirtualFiles: function(a, c) {
                var d, e, f = [], g = [], h = c.getParent("Board");
                return a && a.length && a.forEach(function(a) {
                    d = h.page_groups.get(a), d && d.isVirtual && (e = d.pages[0], e && (e.set("page_group", a), 
                    f.push({
                        client_uuid: a,
                        name: e.name,
                        original: e.original_resource_sequence,
                        order_number: d.order_number
                    }), g.push(e)));
                }), f.length ? this.operateChild("pages", g, null, {
                    params: [ {
                        name: "BOARD_REQUEST_SUPPRESS_FEED"
                    } ],
                    beforeSend: function(a) {
                        return b.set("object.board.page_groups", f, a), a;
                    }
                }) : new b.Request({
                    isSucceed: !0,
                    isComplete: !0
                });
            },
            moveFiles: function(a, b, c) {
                var d = this, e = !0, f = "";
                return b.getParent("Board").id === c.getParent("Board").id && (e = !1, f = "BOARD_REQUEST_MOVE_PAGE_GROUP"), 
                d.copyAndTransformFiles(a, b, c, f).success(function() {
                    e && d.removeFiles(a, null, c, {
                        params: [ {
                            name: "BOARD_REQUEST_SUPPRESS_FEED"
                        } ]
                    });
                });
            },
            removeFiles: function(a, c, d, e) {
                var f = new b.Request(), g = this;
                return e = e || {}, d = d || g, this.transformVirtualFiles(a, d).success(function() {
                    function g() {
                        i++, i >= j && f.invoke("success");
                    }
                    var h, i = 0, j = 0;
                    a = b.getBatchArray(a, "client_uuid", {
                        is_deleted: !0
                    }), c = b.getBatchArray(c, null, {
                        is_deleted: !0
                    }), a.length && j++, c.length && j++, c.length && (h = d.getFolderPath(c), h = {
                        type: "BOARD_REQUEST_DELETE_FOLDER",
                        object: h
                    }, h.params = e.params ? e.params : [ {
                        name: "BOARD_REQUEST_DELETE_FOLDER_RECURSIVELY"
                    } ], new b.Request({
                        url: "/board",
                        data: h
                    }).success(g).error(function(a) {
                        f.invoke("error", a);
                    })), a.length && (h = d.getFolderPath(null, a), e.params && (h.params = e.params), 
                    new b.Request({
                        url: "/board",
                        data: {
                            type: "BOARD_REQUEST_DELETE_PAGE_GROUP",
                            object: h
                        }
                    }).success(g).error(function(a) {
                        f.invoke("error", a);
                    }));
                }).error(function(a) {
                    f.invoke("error", a);
                }), f;
            },
            recycle: function(a, c, d) {
                var e = new b.Request();
                return this.transformVirtualFiles(a, d).success(function() {
                    d = d || this, a = b.getBatchArray(a, "client_uuid", {
                        is_recycled: !0
                    }), c = b.getBatchArray(c, null, {
                        is_recycled: !0
                    });
                    var f = d.getFolderPath(c, a);
                    new b.Request({
                        url: "/board",
                        data: {
                            type: "BOARD_REQUEST_UPDATE_FOLDER",
                            object: f
                        }
                    }).binding(e);
                }).error(function(a) {
                    e.invoke("error", a);
                }), e;
            },
            shareFiles: function(a, c, d) {
                var e = new b.Request();
                d = d || this;
                var f = this;
                return this.transformVirtualFiles(a, d).success(function() {
                    a = b.getBatchArray(f._getFileSequenceFromClientUUID(a)), c = b.getBatchArray(c);
                    var g = d.getFolderPath(c, a);
                    new b.Request({
                        url: "/board",
                        data: {
                            type: "BOARD_REQUEST_CREATE_VIEW_TOKEN",
                            object: g
                        }
                    }).success(function(a) {
                        e.invoke("success", a);
                    }).error(function(a) {
                        e.invoke("error", a);
                    });
                }).error(function(a) {
                    e.invoke("error", a);
                }), e;
            },
            batchUpdate: function(a, b, c) {
                var d, e = [];
                return a.forEach(function(a) {
                    d = a.getUpdateData(), d && e.push(d);
                }), e.length ? b.operateChild(null, e, c) : void 0;
            },
            getFolderPath: function(a, b) {
                var c = {
                    board: {
                        id: this.id
                    }
                };
                return a && a.length && (c.board.folders = a), b && b.length && (c.board.page_groups = b), 
                c;
            },
            getParent: function() {
                return this;
            },
            uploadFromAgent: function(a, b) {
                return this.operateChild(null, null, "AGENT_REQUEST_UPLOAD_RESOURCE", {
                    beforeSend: function(c) {
                        return c.object.entry = {
                            agent_id: a,
                            parent_path: b
                        }, c;
                    }
                });
            },
            uploadFromDropbox: function(a, b) {
                return this.operateChild("resources", [ {
                    name: a,
                    client_uuid: uuid()
                } ], "BOARD_REQUEST_UPLOAD_RESOURCE_URL", {
                    beforeSend: function(a) {
                        return a.params = [ {
                            name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                            string_value: "original"
                        }, {
                            name: "RESOURCE_UPLOAD_RESOURCE_URL",
                            string_value: b
                        } ], a;
                    }
                });
            },
            choosePageAsCover: function(a) {
                return this.operateChild("resources", [ {
                    name: "Binder_Cover",
                    client_uuid: uuid()
                } ], "BOARD_REQUEST_UPLOAD_RESOURCE_URL", {
                    beforeSend: function(b) {
                        return b.params = [ {
                            name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                            string_value: "cover"
                        }, {
                            name: "RESOURCE_UPLOAD_RESOURCE_URL",
                            string_value: a
                        } ], b;
                    }
                });
            },
            getFileByPath: function(a) {
                var b, c = a, d = this;
                if (c.page_groups) b = c.page_groups[0].sequence, b = d.page_groups.get(b) || c.page_groups[0]; else if (c.files) b = c.files[0].sequence, 
                b = d.files.get(b) || c.files[0]; else {
                    for (;c.folders && (c = c.folders[0], d = d.folders.get(c.sequence)); ) ;
                    if (d) {
                        var e;
                        if (c.files) e = c.files[0].sequence; else if (c.pages) {
                            for (var f = c.pages, g = null, h = 0; !g && h < f.length; ) g = d.pages.get(f[h]), 
                            h++;
                            g && (e = g.page_group);
                        }
                        b = d.files.get(e) || c.files && c.files[0];
                    } else {
                        for (;c.folders; ) c = c.folders[0];
                        b = c.files[0];
                    }
                }
                return b;
            },
            shareByEmail: function(a, c, d) {
                var e = new b.Request(), f = this, g = [];
                d = d || f;
                var h = c.files, i = c.folders, j = c.pages, k = c.resources;
                return f.transformVirtualFiles(h, d).success(function() {
                    h = b.getBatchArray(f._getFileSequenceFromClientUUID(h)), i = b.getBatchArray(i);
                    var c = d.getFolderPath(i, h);
                    j && b.set("board.pages", b.getBatchArray(j), c), k && b.set("board.resources", b.getBatchArray(k), c), 
                    Array.isArray(a) || (a = [ a ]), _.each(a, function(a) {
                        g.push({
                            name: "BOARD_REQUEST_INVITEE_EMAIL",
                            string_value: a
                        });
                    });
                    var l = new b.Request({
                        url: "/board",
                        data: {
                            type: "BOARD_REQUEST_EMAIL_VIEW_TOKEN",
                            object: c,
                            params: g
                        }
                    });
                    l.success(function(a) {
                        e.invoke("success", a);
                    }).error(function(a) {
                        e.invoke("error", a);
                    });
                }).error(function(a) {
                    e.invoke("error", a);
                }), e;
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.Agent", a.model.Model, {
        properties: {
            agent_user_id: "",
            created_time: 0,
            id: "",
            local_revision: 0,
            name: "",
            os_type: "",
            revision: 0,
            type: "",
            unique_id: "",
            updated_time: 0,
            passcode_protected: !1
        },
        methods: {
            create: function() {},
            "delete": function() {},
            update: function() {}
        }
    });
}), Moxtra.define(function(a, b, c) {
    {
        var d = b.storage("SilentMessage");
        a.model.Root;
    }
    a.define("Moxtra.model.UserBoard", a.model.Model, {
        properties: {
            accessed_time: 0,
            created_time: 0,
            feed_unread_count: 0,
            is_default: !1,
            order_number: 0,
            revision: 0,
            sequence: 0,
            is_favorite: !1,
            category: {
                get: function() {
                    return this._category || 0;
                },
                set: function(a) {
                    var b = c.Root.user.categories.get(a);
                    this._category = b && !b.is_deleted ? a : 0;
                }
            },
            status: "",
            type: "",
            is_group: "",
            isTeam: !1,
            teamBoards: {
                get: function() {
                    if (!this._teamBoards) {
                        var b = c.userBoards;
                        this._teamBoards = new a.util.Array({
                            unique: !0,
                            sortFn: function(a, d) {
                                var e = b.get(a), f = b.get(d);
                                return c.sort.timeline(e, f);
                            }
                        });
                    }
                    return this._teamBoards;
                }
            },
            updated_time: 0,
            board: {
                isClass: !0,
                set: function(b) {
                    var c;
                    this._board || (this._board = new a.model.Board({}, this)), this._board.feeds.clear(), 
                    this._board.pages.clear(), this._board.todos.clear(), this._board.comments.clear(), 
                    this._board.resources.clear(), this._board.folders.clear(), this._board.page_groups.clear(), 
                    b.feeds && b.feeds.length && (c = b.feeds, this.lastFeed = null, this.parseItem(c[c.length - 1], "lastFeed"), 
                    b.feeds = []), this._board.parse(b), c && (b.feeds = c);
                },
                get: function() {
                    return this._board;
                }
            },
            session: null,
            thumbnail_small: "",
            isSilentMessageOn: {
                get: function() {
                    var a = d.get(this.board.id);
                    return a === !0;
                },
                set: function(a) {
                    var b = this.board.id;
                    a ? d.set(b, a) : d.remove(b);
                    var c = this;
                    _.delay(function() {
                        c._notifyCollection();
                    });
                }
            },
            is_notification_off: !1,
            parseOrder: {
                enumerable: !1,
                value: "sequence,board"
            },
            isInvited: {
                get: function() {
                    return this.status === a.const.BOARD_INVITED;
                }
            },
            isEditor: {
                get: function() {
                    return this.type === a.const.BOARD_OWNER || this.type === a.const.BOARD_READ_WRITE;
                }
            },
            isMember: {
                get: function() {
                    return this.status === a.const.BOARD_MEMBER;
                }
            },
            isOwner: {
                get: function() {
                    return this.type === a.const.BOARD_OWNER;
                }
            },
            lastFeed: a.model.BoardLastFeed
        },
        methods: {
            updateNotificationAsTeam: function(a) {
                var c = b.set("object.user.boards", [ {
                    sequence: this.sequence,
                    is_notification_off: !!a
                } ], {
                    type: "USER_REQUEST_UPDATE_USER_BOARD"
                });
                return new b.Request({
                    url: "/user",
                    data: c
                });
            },
            updateAccessEnterTime: function(a) {
                var c = {
                    accessed_time: 0
                };
                this.sequence ? c.sequence = this.sequence : this.board && this.board.id && (c.board = {
                    id: this.board.id
                });
                var d = b.set("object.user.boards", [ c ], {
                    type: a ? "USER_REQUEST_UPDATE_USER_BOARD" : "USER_REQUEST_UPDATE_USER_BOARD_ENTER"
                });
                return new b.Request({
                    url: "/user",
                    data: d
                });
            },
            updateAccessTime: function() {
                return this.updateAccessEnterTime("USER_REQUEST_UPDATE_USER_BOARD");
            },
            operateChild: function(a, c, e, f) {
                var g = {};
                f = f || {}, e = e || "USER_REQUEST_UPDATE_USER_BOARD";
                var h = this.getUpdateData();
                if ((h && "BOARD_REQUEST_UPDATE" === e || !this.id) && (g = b.set("object.user.boards", [ h ], {})), 
                "USER_REQUEST_UPDATE_USER_BOARD" !== e && (h = !0), a && c) Array.isArray(c) || (c = [ c ]), 
                b.set("object.board." + a, c, g), f.params && (g.params = (g.params || []).concat(f.params)); else if (c) b.set("object.board", c, g); else if (!h) return new b.Request({
                    isSucceed: !0,
                    isComplete: !0
                });
                return this.id && (b.set("object.board.id", this.id, g), d.get(this.id) && (g.params = g.params || [], 
                g.params.push({
                    name: "BOARD_REQUEST_PUSH_NOTIFICATION_OFF"
                }))), g.type = e, new b.Request({
                    url: "/board",
                    data: g,
                    preprocess: f.preprocess
                });
            },
            update: function() {
                return this.operateChild();
            },
            getBoard: function() {
                return a.getBoard(this.board.id);
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.GroupBoard", a.model.UserBoard, {
        properties: {
            accessed_time: {
                get: function() {
                    return this._accessed_time;
                },
                set: function(a) {
                    this._accessed_time = a, this.trigger("change:feed_unread_count"), this.trigger("change");
                }
            },
            feed_unread_count: {
                get: function() {
                    return this.isMember ? this.getValueFromMyUserBoard("feed_unread_count") : this.accessed_time ? this.lastFeed && this.lastFeed.timestamp > this.accessed_time ? 1 : 0 : 1;
                },
                set: function(a) {
                    var b = this;
                    b.changed.feed_unread_count = a, b.trigger("change:feed_unread_count"), b.trigger("change");
                }
            },
            isMember: {
                get: function() {
                    if (!this._isMember) {
                        var b = this, c = a.getMe().id, d = !1;
                        this.board.members.each(function(a) {
                            a.get("user.id") === c && (d = !0);
                        }), b._isMember = d;
                    }
                    return this._isMember;
                }
            }
        },
        methods: {
            getValueFromMyUserBoard: function(a) {
                var b;
                return (b = c.Root.user.boards.getModel(this.board.id)) ? b.get(a) : null;
            },
            updateAccessEnterTime: function(a) {
                if (this.isMember) {
                    var b = this.updateAccessEnterTime._super.call(this, a), c = this;
                    return b.success(function() {
                        c.feed_unread_count = 0;
                    }), b;
                }
                this.setUserTagValue("Board_" + this.board.id, Date.now().toString());
            },
            setUserTagValue: function(b, d) {
                var e, f = c.Root.user, g = f.tags.get(b), h = this;
                return g ? (g.set("string_value", d), e = g.update().success(function(a) {
                    c.processUserSubscribe(a.object.user);
                })) : (g = new a.model.BoardTag(), g.set("name", b), g.set("string_value", d), e = g.create(f)), 
                e.success(function() {
                    h.feed_unread_count = 0;
                }), e;
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.UserCap", a.model.Model, {
        properties: {
            user_boards_max: 0,
            board_users_max: 0,
            board_pages_max: 0,
            session_users_max: 0,
            user_cloud_max: 0,
            monthly_upload_max: 0,
            monthly_upload_current: 0,
            monthly_upload_time_left: 0,
            client_max_body_size: 0,
            meet_duration_max: 0,
            user_agent_max: 0,
            team_users_max: {
                set: function(a) {
                    this.defineProperty("_team_users_max", a);
                },
                get: function() {
                    return this._team_users_max || 40;
                }
            },
            require_domain_suffix: !1,
            allow_meet_recording: !0,
            group_boards_max: 0,
            parseOrder: {
                enumerable: !1,
                value: "sequence"
            }
        },
        methods: {}
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.UserContact", a.model.Model, {
        properties: {
            created_time: 0,
            has_push_notification: !1,
            revision: 0,
            sequence: 0,
            status: "",
            updated_time: 0,
            user: a.model.Contact,
            avatar: {
                get: function() {
                    var c, d = this.user, e = d.picture4x || d.picture2x || d.picture, f = {
                        sequence: this.sequence,
                        picture: e
                    };
                    return c = this.sequence && e ? /^(GROUP_)/gi.test(this.status) ? b.format("/group/${groupId}/member/${sequence}/${picture}", f) : b.format("/user/contact/${sequence}/${picture}", f) : e ? b.format("/user/${picture}", f) : a.getMe().branding.getDefaultUserAvatar(), 
                    c = a.util.makeAccessTokenUrl(c);
                }
            },
            online: {
                set: function(a) {
                    this.defineProperty("_online", a);
                },
                get: function() {
                    return this._online || this.has_push_notification;
                }
            },
            enableBizCard: {
                get: function() {
                    var b = a.getMe();
                    return b.unique_id ? !1 : this.user && this.user.email && this.user.id !== b.id ? !0 : !1;
                }
            }
        },
        methods: {
            "delete": function() {
                var a = this;
                return c.Root.user.operateChild("contacts", [ {
                    sequence: this.sequence,
                    is_deleted: !0
                } ], "USER_REQUEST_DELETE_CONTACT").success(function() {
                    c.Root.user.contacts.remove(a);
                });
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.UserGroup", a.model.Model, {
        properties: {
            validates: {
                enumerable: !1,
                value: {
                    name: [ "required" ]
                }
            },
            created_time: 0,
            group: a.model.Group,
            group_sequence: 0,
            revision: {
                get: function() {
                    return this._revision;
                }
            },
            sequence: 0,
            status: "",
            type: "",
            isOwner: {
                get: function() {
                    return this.type === a.const.GROUP_OWNER_ACCESS;
                }
            },
            updated_time: 0
        },
        methods: {
            create: function() {},
            "delete": function() {},
            reset: function() {
                this.group && this.group.reset && this.group.reset();
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.UserAgent", a.model.Model, {
        properties: {
            created_time: 0,
            revision: 0,
            sequence: 0,
            updated_time: 0,
            online: !1,
            agent: a.model.Agent
        },
        methods: {
            create: function() {},
            "delete": function() {},
            update: function() {}
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const, e = {
        DEFAULT: -1,
        NORMAL_STATUS: 3
    };
    a.define("Moxtra.model.User", a.model.Contact, {
        properties: {
            groups: {
                enumerable: !1,
                get: function() {
                    return b.cache("groups");
                }
            },
            boards: {
                enumerable: !1,
                get: function() {
                    return c.cache("userBoard", "userBoards");
                }
            },
            categories: {
                enumerable: !1,
                get: function() {
                    return this._categories || (this._categories = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.Category",
                        attributeId: "sequence",
                        filterFn: function(a) {
                            return a.is_deleted ? !1 : !0;
                        },
                        sortFn: function(a, b) {
                            var c = (a.name || "").toLowerCase(), d = (b.name || "").toLowerCase();
                            return c >= d ? 1 : d > c ? -1 : 0;
                        }
                    })), this._categories;
                }
            },
            contacts: {
                enumerable: !1,
                get: function() {
                    return this._contacts || (this._contacts = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.UserContact",
                        attributeId: "user.id",
                        index: [ "sequence", "user.email", "client_uuid" ],
                        sortFn: c.sort.contact
                    })), this._contacts;
                }
            },
            favorites: {
                enumerable: !1,
                get: function() {
                    return this._favorites || (this._favorites = c.createCollection("UserFavorite", this)), 
                    this._favorites;
                }
            },
            mentionmes: {
                enumerable: !1,
                get: function() {
                    return this._mentionmes || (this._mentionmes = c.createCollection("UserMentionMe", this)), 
                    this._mentionmes;
                }
            },
            group: {
                get: function() {
                    var a = this, b = null;
                    return a.groups ? (a.groups.each(function(a) {
                        a.status !== d.GROUP_MEMBER || a.group.isTeam || (b = a);
                    }), b) : null;
                }
            },
            avatar: {
                get: function() {
                    if (this.picture) {
                        var b = "/user/" + (this.picture4x || this.picture2x || this.picture);
                        return b = a.util.makeAccessTokenUrl(b);
                    }
                    return this.branding.getDefaultUserAvatar();
                }
            },
            cap: a.model.UserCap,
            email_verified: !1,
            enable_digest_emails: !0,
            language: {
                set: function(a) {
                    this.defineProperty("_language", a, !0, !0);
                },
                get: function() {
                    return this._language ? this._language : (navigator.language || navigator.userLanguage || "en-US").toLowerCase();
                }
            },
            phone_number: "",
            email: "",
            timezone: {
                set: function(a) {
                    this.defineProperty("_timezone", a, !0, !0);
                },
                get: function() {
                    return "Asia/Calcutta" === this._timezone ? "Asia/Kolkata" : this._timezone || "America/Los_Angeles";
                }
            },
            groupId: {
                get: function() {
                    var a = this.group && this.group.group || {};
                    return a.id;
                }
            },
            groupAccessType: {
                get: function() {
                    var a = this.group && this.group.group || {};
                    if (a.members) {
                        var b = a.members.get(this.id);
                        if (b) return b.type;
                    }
                    return "";
                }
            },
            groupStatus: {
                get: function() {
                    var a = this.group || {};
                    return a.status;
                }
            },
            parseOrder: {
                enumerable: !1,
                value: "id,name,timezone,email,contacts,categories,groups,boards"
            },
            revision: {
                get: function() {
                    return this._revision || 0;
                }
            },
            total_cloud_size: 0,
            id: "",
            feed_unread_count: 0,
            group_feed_unread_count: 0,
            sessionId: {
                get: function() {
                    if (!this._sessionId) {
                        var b = "mxweb-" + uuid.v4(), c = a.util.storage("client"), d = c.get("sessionid");
                        d ? this.defineProperty("_sessionId", d) : (c.set("sessionid", b), this.defineProperty("_sessionId", b));
                    }
                    return this._sessionId;
                }
            },
            agents: {
                get: function() {
                    return this._agents || (this._agents = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.UserAgent",
                        attributeId: "sequence",
                        index: "agent.id"
                    })), this._agents;
                }
            },
            role: "",
            server: "",
            zone: "",
            tags: {
                get: function() {
                    return this._tags || (this._tags = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardTag",
                        attributeId: "name",
                        index: [ "sequence" ],
                        removedFlag: [ "is_deleted" ]
                    })), this._tags;
                }
            },
            branding: {
                getDefaultCover: function() {
                    return a.model.Root.get("group.group_caps.has_branding") ? a.api.util.getGroupTag("Default_Binder_Cover") : null;
                },
                getDefaultUserAvatar: function() {
                    return a.model.Root.get("group.group_caps.has_branding") ? a.api.util.getGroupTag("Default_User_Avatar") || a.config.user.avatar : a.config.user.avatar;
                }
            },
            configuration: {
                showScheduleMeet: function() {
                    return a.model.Root.get("group.group_caps.has_configuration") && "0" === a.api.util.getGroupTag("Show_Schedule_Meet") ? !1 : !0;
                }
            },
            hasSubscribeUser: {
                get: function() {
                    return this._subscribeUser;
                }
            },
            preferred_zone: "",
            created_time: 0,
            needVerifyEmail: {
                get: function() {
                    var a = this, b = 25246368e5;
                    return a.type === d.USER_TYPE_NORMAL && a.email && !a.email_verified && a.created_time > b ? !0 : !1;
                }
            },
            type: d.USER_TYPE_NORMAL
        },
        methods: {
            init: function(b, c) {
                this.init._super.call(this, b, c), this._subscribes = new a.util.Array(), this._feedStatus = e.DEFAULT;
            },
            _onSubscribe: function(d) {
                var f, g, h, i, j = !1, k = !1, l = !1;
                try {
                    if (d.object) {
                        var m = a.storage("integration"), n = m.get("group_id");
                        (g = d.object.group) && (n && b.get("object.group.id", d) === n && !c.Root.managedGroup && this.revision && (i = !0), 
                        l = c.processGroupSubscribe(g, !0)), (f = d.object.user) && (0 === this.revision && (i = !0), 
                        n && !c.Root.managedGroup && (i = !1), j = c.processUserSubscribe(f, !0)), (h = d.object.board) && c.processBoardSubscribe(h, !0);
                    }
                    if (k && l && j) return;
                    this.trigger("subscribe", d), i && (this.trigger("firstSubscribe", d), this.server = d.server, 
                    this.zone = d.zone, this._feedStatus = e.NORMAL_STATUS);
                } catch (o) {
                    console && console.error(o.stack);
                }
            },
            on: function(a, b, c) {
                var d = !1;
                "firstSubscribe" === a && 0 !== this.revision && (d = !0), "firstData" === a && this._feedStatus === e.NORMAL_STATUS && (d = !0), 
                d ? b.call(c || this) : this.on._super.call(this, a, b, c);
            },
            loadFirstPageBoards: function(a) {
                var d = this;
                return a = a || {}, new b.Request(d._feedStatus === e.NORMAL_STATUS ? {
                    isSucceed: !0
                } : {
                    url: "/user",
                    data: {
                        type: "USER_REQUEST_READ_FEEDS",
                        params: [ {
                            name: "BOARD_REQUEST_READ_FEEDS_INDEXED"
                        } ]
                    },
                    preprocess: function(f) {
                        var g = b.get("object.user", f);
                        g && c.processUserSubscribe(g), d._feedStatus = e.NORMAL_STATUS, d.trigger("firstData", f), 
                        a.subscribe && d.subscribe();
                    }
                });
            },
            hasSubscribe: function(a) {
                var b = !1;
                return _.each(this._subscribes, function(c) {
                    c.id === a && (b = !0);
                }), b;
            },
            getSubscribeRequest: function() {
                var c, e, f, g, h = this._subscribes, i = [], j = [];
                if (h.length) for (var k = 0; k < h.length; k++) f = h[k], g = b.getCacheClass("Board", f.id), 
                e = {
                    id: f.id,
                    revision: g && g.revision || f.revision || 0
                }, f.islive && (e.sessions = [ {
                    session: {
                        session_key: f.session.session_key,
                        revision: f.session.revision
                    }
                } ]), i.push({
                    board: e
                });
                var l = this.parent, m = l.managedGroup, n = a.storage("integration"), o = this.groupId, p = n.get("group_id"), q = /websdk|sf/.test(n.get("type"));
                return c = {
                    type: "BOARD_REQUEST_SUBSCRIBE_MULTIPLE",
                    object: {
                        user: {}
                    },
                    params: [ {
                        name: "USER_SUBSCRIBE_FILTER_MEET"
                    } ]
                }, this._subscribeUser && (p || b.set("object.user", {
                    revision: this.revision
                }, c), q || p || b.set("object.group", {
                    revision: this.group && this.group.group.revision || 0
                }, c), !q && this.revision > 0 && (this.groups.each(function(a) {
                    a.status === d.GROUP_MEMBER && a.group.id !== o && j.push({
                        group: {
                            revision: a.group.revision,
                            id: a.group.id
                        }
                    });
                }), j.length && b.set("object.user.groups", j, c))), p && (m && m.revision ? j = [ {
                    group: {
                        id: p,
                        revision: m && m.revision || 0
                    }
                } ] : (j = [], b.set("object.user.groups", [], c))), i.length && b.set("object.user.boards", i, c), 
                j.length && b.set("object.user.groups", j, c), c;
            },
            subscribe: function(b, c, d) {
                if (!b || c) {
                    if (!this.id) return;
                    this._subscribeUser = !0;
                }
                b && (this._subscribes.indexOf(b) < 0 ? (this._subscribes.forEach(function(a) {
                    a._subscribeCount = 0;
                }), this._subscribes.length = 0, this._subscribes.push(b), b._subscribeCount = 1) : b._subscribeCount++), 
                this._hasSubscribe ? d && a.Subscribe.restart(this, this._onSubscribe) : a.Subscribe.start(this, this._onSubscribe), 
                this._hasSubscribe = !0;
            },
            unsubscribe: function(a) {
                1 === a._subscribeCount ? (this._subscribes.remove(a), a._subscribeCount = 0) : a._subscribeCount--;
            },
            search: function(a) {
                return new b.Request({
                    url: "/board",
                    data: {
                        type: "BOARD_REQUEST_SEARCH_BOARD",
                        params: [ {
                            name: "BOARD_REQUEST_SEARCH_TEXT",
                            string_value: a
                        }, {
                            name: "BOARD_REQUEST_SEARCH_SIZE",
                            string_value: "100"
                        } ]
                    }
                });
            },
            syncUserCap: function() {
                var a = {
                    type: "USER_REQUEST_READ_CAP",
                    object: {
                        user: {
                            id: this.id
                        }
                    }
                }, c = new b.Request({
                    url: "/user",
                    data: a
                }), d = this;
                return c.success(function(a) {
                    var c = b.get("object.user", a);
                    c && d.parse(c);
                }), c;
            },
            operateChild: function(a, c, d) {
                var e = {};
                d = d || "USER_REQUEST_UPDATE", a && c && (Array.isArray(c) || (c = [ c ]), b.set("object.user." + a, c, e)), 
                e.type = d;
                var f = new b.Request({
                    url: "/user",
                    data: e
                });
                return f;
            },
            resendVerifyEmail: function() {
                return new b.Request({
                    url: "/user",
                    data: {
                        type: "USER_REQUEST_RESEND_VERIFICATION_EMAIL"
                    }
                });
            },
            cacheConfig: {
                root: "cache",
                name: "user",
                exclude: [ "boards", "categories", "groups", "contacts" ]
            },
            inviteContacts: function(a) {
                Array.isArray(a) || (a = [ a ]);
                var b = [];
                return _.each(a, function(a) {
                    b.push({
                        user: {
                            email: a
                        }
                    });
                }), this.operateChild("contacts", b, "USER_REQUEST_CONTACT_INVITE");
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.const, c.config.defaults;
    a.define("Moxtra.model.BoardResource", a.model.Model, {
        properties: {
            client_uuid: "",
            creator: {
                set: function(a) {
                    this._creator = a.id;
                },
                get: function() {
                    return this.getParent("Board").users.get(this._creator);
                }
            },
            is_deleted: !1,
            sequence: 0,
            content_type: "",
            content_length: "",
            media_length: 0,
            height: 0,
            width: 0,
            name: "",
            path: "",
            type: "",
            status: "",
            email_subject: "",
            from_email: "",
            converted_pages: 0,
            total_pages: 0,
            original_resource_sequence: 0,
            parseOrder: {
                enumerable: !1,
                value: "sequence,client_uuid,is_deleted,type"
            },
            is_email_empty: !1
        },
        methods: {
            "delete": function() {
                var a = this.parent, b = this;
                return a.operateChild("resources", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_DELETE_RESOURCE").success(function() {
                    a.resources.remove(b);
                });
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.model.boardReferenceLink", a.model.Model, {
        properties: {
            client_uuid: "",
            sequence: "",
            board: null,
            source: {
                get: function() {
                    var a = this.getParent("Board");
                    return a.getFileByPath(this.board);
                }
            },
            is_deleted: {
                set: function(a) {
                    if (this._is_deleted = a, a) {
                        var b, c, d, e, f = this;
                        this._linkedTodos.each(function(a) {
                            if (b = f.getModelById(a), c = b.attachments.length, c > 0) for (d = c - 1; d >= 0; d--) e = b.attachments[d], 
                            e.reference_links_sequence === f.sequence && b.attachments.remove(e);
                        });
                    }
                },
                get: function() {
                    return this._is_deleted;
                }
            }
        },
        methods: {
            init: function(b, c) {
                this._linkedTodos = new a.util.Array({
                    unique: !0
                }), this.init._super.call(this, b, c);
            },
            bindRemoveEvent: function(a) {
                this._linkedTodos.push(a.$id);
            },
            parse: function() {
                var a = !this.sequence;
                if (this.parse._super.apply(this, arguments), !a) {
                    var b, c, d, e, f = this;
                    this._linkedTodos.each(function(a) {
                        if (b = f.getModelById(a), c = b.attachments.length, c > 0) for (d = c - 1; d >= 0; d--) e = b.attachments[d], 
                        e.reference_links_sequence === f.sequence && (e.file = f.source);
                    });
                }
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.UserFavorite", a.model.Model, {
        properties: {
            board: a.model.Board,
            client_uuid: "",
            sequence: 0,
            is_deleted: !1
        },
        statics: {
            create: function(a) {
                var b = a.getParent("Board");
                return b.operateChild("feeds", [ {
                    sequence: a.sequence
                } ], "BOARD_REQUEST_CREATE_FAVORITE");
            },
            remove: function(a) {
                var d, e, f, g = a;
                if (a && a.$name) {
                    if (f = a.getParent("Board"), e = f.id + "_" + a.sequence, d = c.Root.user.favorites.get(e), 
                    !d) return new b.Request({
                        isFailed: !0
                    });
                    g = d.sequence;
                }
                return new b.Request({
                    url: "/user",
                    data: {
                        type: "USER_REQUEST_REMOVE_FAVORITE",
                        object: {
                            user: {
                                favorites: [ {
                                    sequence: g
                                } ]
                            }
                        }
                    }
                });
            }
        }
    });
}), Moxtra.define(function(a, b) {
    a.define("Moxtra.model.UserMentionMe", a.model.Model, {
        properties: {
            board: a.model.Board,
            client_uuid: "",
            sequence: 0,
            is_deleted: !1
        },
        statics: {
            remove: function(a) {
                var c = [];
                return Array.isArray(a) ? _.each(a, function(a) {
                    c.push({
                        sequence: a
                    });
                }) : c.push({
                    sequence: a
                }), new b.Request({
                    url: "/user",
                    data: {
                        type: "USER_REQUEST_REMOVE_MENTIONME",
                        object: {
                            user: {
                                mentionmes: c
                            }
                        }
                    }
                });
            }
        }
    });
}), Moxtra.define(function(a, b, c) {
    a.define("Moxtra.model.integrationService", a.model.Model, {
        properties: {
            name: "",
            displayName: "",
            type: "",
            picture_url: "",
            first_name: "",
            integrations: {
                get: function() {
                    return this._integrations || (this._integrations = new c.Collection({
                        owner: this,
                        model: "Moxtra.model.BoardViewToken",
                        attributeId: "uniqueId",
                        unique: !0,
                        filterFn: function(a) {
                            return a.is_deleted ? !1 : !0;
                        },
                        sortFn: c.sort.integrations
                    })), this._integrations;
                }
            }
        },
        statics: {
            unique: !0
        },
        methods: {}
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const;
    a.define("Moxtra.model.BoardViewToken", a.model.Model, {
        properties: {
            boardId: {
                get: function() {
                    return this.parent.id;
                }
            },
            boardName: {
                get: function() {
                    return this.parent.name;
                }
            },
            uniqueId: {
                get: function() {
                    return this.boardId + "_" + this.sequence;
                }
            },
            created_time: 0,
            revision: 0,
            sequence: 0,
            note: "",
            description: {
                get: function() {
                    var a = "", b = {};
                    if (this.note) try {
                        b = JSON.parse(this.note), a = b.description || "";
                    } catch (c) {
                        console.error(c);
                    }
                    return a;
                }
            },
            customize_template: {
                get: function() {
                    var a = "", b = {};
                    if (this.note) try {
                        b = JSON.parse(this.note), a = b.customize_template || "";
                    } catch (c) {
                        console.error(c);
                    }
                    return a;
                }
            },
            customize_template2: {
                get: function() {
                    var a = "", b = {};
                    if (this.note) try {
                        b = JSON.parse(this.note), a = b.customize_template2 || "";
                    } catch (c) {
                        console.error(c);
                    }
                    return a;
                }
            },
            post_as: {
                get: function() {
                    var a = "", b = {};
                    if (this.note) try {
                        b = JSON.parse(this.note), a = b.post_as || "";
                    } catch (c) {
                        console.error(c);
                    }
                    return a;
                }
            },
            token: "",
            actor: {
                get: function() {
                    if (this._actor) {
                        var b = this.getParent("Board");
                        return b || (b = a.getBoard(this.boardId)), b ? b.users.get(this._actor) : null;
                    }
                    return null;
                },
                set: function(a) {
                    this._actor = a;
                }
            },
            actor_file_as: a.model.integrationService,
            actor_file_name: {
                get: function() {
                    var a = "";
                    return this.actor_file_as && (a = this.actor_file_as.name), a;
                }
            },
            customize_name: {
                get: function() {
                    var a = "";
                    return this.actor_file_as && (a = this.actor_file_as.first_name || ""), a;
                }
            },
            customize_icon: {
                get: function() {
                    var a = "";
                    return this.actor_file_as && (a = this.actor_file_as.picture_url || "images/service/" + this.actor_file_as.name + ".png"), 
                    a;
                }
            },
            page_groups: null,
            folders: null,
            pages: null
        },
        methods: {
            createIntegration: function(a, e, f) {
                f = f || {}, this.defineProperty("parent", a), this.actor_file_as = e;
                var g, h = this.getUpdateData();
                return h.actor_file_as = {
                    type: e.type,
                    name: e.name
                }, f.first_name && (h.actor_file_as.first_name = f.first_name), f.picture_url && (h.actor_file_as.picture_url = f.picture_url), 
                h.type = "BOARD_READ_WRITE", g = a.operateChild("view_tokens", h, "BOARD_REQUEST_CREATE_VIEW_TOKEN"), 
                g.success(function(e) {
                    {
                        var f, g = b.get("object.board.view_tokens.0", e);
                        b.get("object.board.id", e);
                    }
                    g && g.actor_file_as && g.actor_file_as.type === d.USER_TYPE_SERVICE && (f = c.Root.services.get(g.actor_file_as.name), 
                    f && c.processUserSubscribe({
                        boards: [ {
                            sequence: a.parent.sequence,
                            board: e.object.board
                        } ]
                    }));
                }), g;
            },
            removeIntegration: function(a, c) {
                var d = a.operateChild("view_tokens", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_REMOVE_VIEW_TOKEN");
                return d.success(function(a) {
                    var d = b.get("object.board.view_tokens.0", a), e = b.get("object.board.id", a);
                    c.integrations.remove(e + "_" + d.sequence);
                }), d;
            },
            remove: function() {
                var a = this.parent;
                return a.operateChild("view_tokens", {
                    sequence: this.sequence,
                    is_deleted: !0
                }, "BOARD_REQUEST_REMOVE_VIEW_TOKEN");
            },
            update: function() {}
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const, e = 13752864e5, f = function(a) {
        var c, d, e = a.board.feeds;
        return e && e.length && (c = e[e.length - 1]), a.board.islive && (d = b.get("board.sessions.0.session", a)) ? d.scheduled_start_time || d.start_time : c ? c.timestamp || c.created_time : a.created_time;
    }, g = c.filter = {
        filterUser: function(a, b) {
            var c = !1;
            if (a && a.length > 0) if (a = a.toLowerCase(), MX.isArray(b)) {
                for (var d = 0; d < b.length; d++) if (b[d] && b[d].indexOf(a) >= 0) return !0;
            } else c = b.indexOf(a) >= 0; else c = !0;
            return c;
        },
        isDeleted: function(a) {
            return a ? a.is_deleted ? !0 : a.board ? a.board.is_deleted ? !0 : !1 : !0 : !0;
        },
        isDefault: function(a) {
            var b = a && a.board;
            return a.is_default && 1 * a.created_time >= e ? b.feeds && b.feeds.length || a.lastFeed && a.lastFeed.sequence ? !1 : !0 : !1;
        },
        isMeet: function(a) {
            var b = a && a.board;
            return !b || b.isnote ? !1 : b.islive ? !0 : !1;
        },
        isUsefulData: function(a) {
            var b = a.board;
            return g.isDeleted(a) ? !1 : g.isDefault(a) ? !1 : !b || b.isnote ? !1 : a.status && a.status !== d.GROUP_MEMBER && a.status !== d.BOARD_MEMBER && a.status !== d.BOARD_INVITED ? !1 : !0;
        },
        isTimelineData: function(a) {
            var c, e, f = a.board;
            if (!g.isUsefulData(a)) return !1;
            if (g.isMeet(a)) {
                if (c = b.get("sessions.0.session", f), e = b.get("session_status", c), !e) return !1;
                var h = Date.now();
                if (e === d.SESSION_STARTED) return h - c.start_time > 1728e5 ? !1 : !0;
                if (a.status === d.BOARD_INVITED) {
                    if (e === d.SESSION_SCHEDULED) {
                        if ((c.scheduled_end_time || 0) < h) return !1;
                    } else if ((c.scheduled_end_time || 0) < h || (c.end_time || 0) > (c.scheduled_start_time || 0)) return !1;
                    return !0;
                }
                return !1;
            }
            return !0;
        },
        getMonthMeetFilter: function(c, d, e, f) {
            var h, i, j, k, l, m = a.getTimezoneOffset();
            return function(a) {
                if (!g.isMeet(a)) return !1;
                var n = b.get("board.sessions.0.session", a);
                if (!n) return !1;
                var o = n.scheduled_start_time || n.start_time;
                if (o) {
                    var p = !0;
                    return h = o - m, i = new Date(h), j = i.getFullYear(), k = i.getMonth(), l = i.getDate(), 
                    c && c !== j && (p = !1), d && d !== k && (p = !1), e && e !== l && (p = !1), f && f.call(this, p, j, k, l), 
                    p;
                }
                return !1;
            };
        }
    };
    c.sort = {
        timeline: function(a, b) {
            if (a.status === b.status) {
                var c = f(a), e = f(b);
                return c > e ? -1 : c === e && a.sequence > b.sequence ? -1 : 1;
            }
            return a.status === d.BOARD_INVITED ? -1 : 1;
        },
        meet: function(a, c) {
            var d = b.get("board.sessions.0.session", a), e = b.get("board.sessions.0.session", c);
            if (!d) return -1;
            if (!e) return 1;
            var f = d.scheduled_start_time || d.start_time, g = e.scheduled_start_time || e.start_time;
            if (f > g) return 1;
            if (g > f) return -1;
            var h = (b.get("board.name", a) || "").toLowerCase(), i = (b.get("board.name", c) || "").toLowerCase();
            return i > h ? -1 : h > i ? 1 : 0;
        },
        binderShelf: function(a, b) {
            if (a.status !== b.status) {
                if (a.status === d.BOARD_INVITED) return -1;
                if (b.status === d.BOARD_INVITED) return 1;
            }
            return void 0 == a.order_number && (a.order_number = a.sequence), void 0 == b.order_number && (b.order_number = b.sequence), 
            parseFloat(a.order_number) < parseFloat(b.order_number) ? -1 : parseFloat(a.order_number) > parseFloat(b.order_number) ? 1 : (a.board.name || "").toLowerCase() < (b.board.name || "").toLowerCase() ? -1 : 1;
        },
        groupBinder: function(a, b) {
            return a.sequence > b.sequence ? 1 : -1;
        },
        boardPage: function(a, b) {
            var c = parseFloat(a.page_number), d = parseFloat(b.page_number);
            return d > c ? -1 : c > d ? 1 : a.sequence > b.sequence ? 1 : -1;
        },
        viewPage: function(a, b) {
            var c = parseFloat(a.order_number), d = parseFloat(b.order_number);
            return d > c ? -1 : c > d ? 1 : a.sequence > b.sequence ? 1 : -1;
        },
        folder: function(a, b) {
            return a.created_time < b.created_time ? -1 : 1;
        },
        integrations: function(a, b) {
            var c = a.created_time - b.created_time;
            return c > 0 ? -1 : 0 > c ? 1 : 0;
        },
        contact: function(a, c) {
            var d = (b.get("user.displayName", a) || "").toLowerCase(), e = (b.get("user.displayName", c) || "").toLowerCase();
            return d >= e ? 1 : -1;
        },
        bizDirectory: function(a, c) {
            var d = (b.get("user.name", a) || "").toLowerCase(), e = (b.get("user.name", c) || "").toLowerCase();
            return d >= e ? 1 : -1;
        },
        feeds: function(a, b) {
            return a.timestamp === b.timestamp ? a.sequence > b.sequence ? 1 : -1 : a.timestamp > b.timestamp ? 1 : -1;
        },
        feedTimeDESC: function(a, b) {
            return c.sort.feeds(a, b) > 0 ? -1 : 1;
        },
        todo: function(a, b) {
            if (a.order_number === b.order_number) return a.is_marked === b.is_marked ? a.sequence > b.sequence ? 1 : -1 : a.is_marked ? -1 : 1;
            var c = parseFloat(a.order_number) || Number.NEGATIVE_INFINITY, d = parseFloat(b.order_number) || Number.NEGATIVE_INFINITY;
            return c > d ? 1 : -1;
        },
        feedTime: function(a, b) {
            if (!a || !a.board) return 1;
            if (!b || !b.board) return -1;
            var c, d, e = a.board.feeds;
            return c = e[e.length - 1], e = b.board.feeds, d = e[e.length - 1], c.timestamp < d.timestamp ? 1 : -1;
        }
    }, a.api = {
        sort: c.sort,
        filter: c.filter,
        util: {
            getUserDisplayName: function(a) {
                var b = a.user;
                return b ? b.first_name || b.name || b.email : (b = a.group, "");
            },
            getBoardName: function(b, c) {
                if (!b || !b.board) return c || "";
                var d, e = b.board.users || [], f = c || b.board.name || "", g = [], h = [], i = a.getMe().id, j = a.getMe().displayName;
                if (b.board.isconversation) {
                    if (1 === e.length) return j;
                } else {
                    if (f) return f;
                    if (1 === e.length) return j;
                }
                return e.forEach(function(b) {
                    b.is_deleted || (h.push(b), b.group && b.group.id ? g.push(b.group.name) : b.user && b.user.id !== i && g.push(a.api.util.getUserDisplayName(b)));
                }), b.board.isconversation ? (2 === h.length && (d = !0), (!f || /((^conversation$)|(^new chat$)|(^chat$))/.test(f.trim().toLowerCase())) && (d = !0)) : f || (d = !0), 
                d ? 1 === h.length ? j : g.join(", ") : f;
            },
            getGroupTag: function(b) {
                var c, d = a.model.Root.get("group.tags");
                return d ? (c = d.get(b) || {}, c.string_value || null) : null;
            },
            setMomentLanguage: function(a) {
                a && (a = a.toLowerCase(), a.indexOf("zh") > -1 && "zh-tw" !== a && (a = "zh-cn"), 
                [ "zh-cn", "zh-tw", "es", "ja", "pt", "fr" ].indexOf(a) > -1 && moment && moment.locale && moment.locale() !== a && moment.locale(a));
            }
        }
    }, b.getBatchArray = function(a, b, c) {
        var d = [];
        return b = b || "sequence", _.each(a, function(a) {
            var e = {};
            e[b] = a, c && _.extend(e, c), d.push(e);
        }), d;
    };
}), Moxtra.define(function(a, b, c) {
    var d = a.const;
    c.status = {
        isFullData: 1,
        isAllFullData: 2
    }, a.define("Moxtra.model.Root", a.model.Model, {
        singleton: !0,
        properties: {
            group: a.model.Group,
            user: a.model.User,
            managedGroup: a.model.Group,
            services: {
                get: function() {
                    return b.cache("integrationService", this);
                }
            }
        },
        methods: {
            reset: function() {
                this.user && this.user.reset && this.user.reset();
            }
        }
    }), c.Root = a.model.Root, c.CacheConfig = {
        userBoard: {
            path: "userBoard",
            model: "Moxtra.model.UserBoard",
            attributeId: "sequence",
            index: "board.id"
        },
        "userBoard.board.pages": {
            model: "Moxtra.model.BoardPage",
            attributeId: "sequence"
        },
        "userBoard.board.folders": {
            model: "Moxtra.model.BoardFolder",
            attributeId: "sequence"
        },
        "userBoard.board.page_groups": {
            model: "Moxtra.model.BoardFile",
            attributeId: "client_uuid"
        },
        "userBoard.board.users": {
            model: "Moxtra.model.BoardUser",
            attributeId: "sequence",
            index: [ "user.id", "user.email", "group.id" ]
        },
        "userBoard.board.sessions": {
            model: "Moxtra.model.BoardSession",
            attributeId: "sequence"
        },
        "userBoard.board.todoHistory": {
            model: "Moxtra.model.BoardFeed",
            attributeId: "sequence"
        },
        groupBoards: {
            model: "Moxtra.model.GroupBoard",
            attributeId: "board.id",
            index: "sequence"
        },
        "group.members": {
            model: "Moxtra.model.GroupMember",
            attributeId: "sequence",
            index: [ "user.id", "user.email" ]
        },
        UserFavorite: {
            model: "Moxtra.model.UserFavorite",
            attributeId: "sequence",
            index: [ function(a) {
                return a.board ? a.board.id + "_" + a.board.feeds[0].sequence : null;
            } ]
        },
        UserMentionMe: {
            model: "Moxtra.model.UserMentionMe",
            attributeId: "sequence"
        }
    }, c.userBoards = c.cache("userBoard", "userBoards"), c.groupBoards = c.cache("userBoard", "groupBoards"), 
    c.services = c.cache("integrationService", "integrationService"), b.configCache({
        Group: {
            model: "Moxtra.model.Group",
            attributeId: "id"
        },
        groups: {
            model: "Moxtra.model.UserGroup",
            attributeId: "group.id",
            index: "sequence",
            filterFn: function(a) {
                return a.is_deleted ? !1 : a.status || a.type ? !0 : a.group && (a.group.status || a.group.type) ? !0 : !1;
            },
            sortFn: function(a, c) {
                var d = b.get("name", a.group).toLowerCase(), e = b.get("name", c.group).toLowerCase();
                return d >= e ? 1 : e > d ? -1 : 0;
            }
        },
        groupBoards: {
            model: "Moxtra.model.GroupBoard",
            attributeId: "board.id",
            index: "sequence",
            removedFlag: [ "board.is_deleted", "is_deleted" ],
            filterFn: c.filter.isTimelineData,
            sortFn: c.sort.groupBinder,
            maxPageCount: 20,
            reverseOrder: !0
        },
        boards: {
            model: "Moxtra.model.UserBoard",
            attributeId: "board.id",
            index: "sequence",
            removedFlag: [ "board.is_deleted", "is_deleted" ],
            filterFn: c.filter.isTimelineData,
            sortFn: c.sort.timeline,
            maxPageCount: 20,
            reverseOrder: !0,
            unique: !0
        },
        userTags: {
            model: "Moxtra.model.BoardTag",
            attributeId: "name",
            index: [ "sequence" ],
            removedFlag: [ "is_deleted" ]
        },
        files: {
            model: "Moxtra.model.BoardFile",
            attributeId: "sequence",
            index: [ "client_uuid" ],
            preFilter: !0,
            sortFn: c.sort.viewPage,
            filterFn: function(a) {
                return a.is_deleted ? !1 : !0;
            }
        },
        categories: {
            model: "Moxtra.model.Category",
            attributeId: "sequence",
            filterFn: function(a) {
                return a.is_deleted ? !1 : !0;
            },
            sortFn: function(a, b) {
                var c = (a.name || "").toLowerCase(), d = (b.name || "").toLowerCase();
                return c >= d ? 1 : d > c ? -1 : 0;
            }
        },
        userContacts: {
            model: "Moxtra.model.UserContact",
            attributeId: "user.id",
            index: [ "sequence", "user.email", "client_uuid" ],
            sortFn: c.sort.contact
        },
        Contact: {
            model: "Moxtra.model.Contact",
            attributeId: "email",
            index: [ "id" ]
        },
        UserBoard: {
            model: "Moxtra.model.UserBoard",
            attributeId: "board.id",
            index: [ "client_uuid", "sequence" ],
            removedFlag: [ "board.is_deleted", "is_deleted" ]
        },
        Board: {
            model: "Moxtra.model.Board",
            attributeId: "id",
            index: [ "client_uuid" ],
            removedFlag: [ "is_deleted" ],
            instanceCount: 5
        },
        todoFiles: {
            model: "Moxtra.model.BoardFile",
            attributeId: "sequence"
        },
        userAgents: {
            model: "Moxtra.model.UserAgent",
            attributeId: "sequence",
            index: "agent.id"
        },
        integrations: {
            model: "Moxtra.model.BoardViewToken",
            attributeId: "uniqueId",
            unique: !0,
            filterFn: function(a) {
                return a.is_deleted ? !1 : !0;
            },
            sortFn: c.sort.integrations
        },
        integrationService: {
            model: "Moxtra.model.integrationService",
            attributeId: "name"
        }
    }), c.Root.parse({
        user: {
            id: ""
        }
    }), c.Root.services.push([ {
        name: "incoming",
        displayName: "Incoming Webhooks",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "appsignal",
        displayName: "AppSignal",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "bitbucket",
        displayName: "Bitbucket",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "chargebee",
        displayName: "Chargebee",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "chargify",
        displayName: "Chargify",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "crashlytics",
        displayName: "Crashlytics",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "datadog",
        displayName: "Datadog",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "formstack",
        displayName: "Formstack",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "fulcrum",
        displayName: "Fulcrum",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "github",
        displayName: "Github",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "hubspot",
        displayName: "HubSpot",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "intercom",
        displayName: "Intercom",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "jira",
        displayName: "JIRA",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "librato",
        displayName: "Librato",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "mailchimp",
        displayName: "MailChimp",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "netlify",
        displayName: "Netlify",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "olark",
        displayName: "Olark",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "opbeat",
        displayName: "Opbeat",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "opsgenie",
        displayName: "OpsGenie",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "pagerduty",
        displayName: "PagerDuty",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "paypal",
        displayName: "Paypal",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "pivotaltracker",
        displayName: "Pivotal Tracker",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "postmark",
        displayName: "Postmark",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "quickbooks",
        displayName: "QuickBooks",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "raygun",
        displayName: "Raygun",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "salesforce",
        displayName: "Salesforce",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "stripe",
        displayName: "Stripe",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "supportbee",
        displayName: "SupportBee",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "yo",
        displayName: "Yo",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "zendesk",
        displayName: "Zendesk",
        type: d.USER_TYPE_SERVICE
    }, {
        name: "zoho",
        displayName: "Zoho",
        type: d.USER_TYPE_SERVICE
    } ], 1);
    var e = b.storage("cache");
    window.addEventListener("beforeunload", function() {
        var a = c.Root;
        a.user && a.user.id && a.user.saveToCache && a.user.saveToCache(), a.group && a.group.saveToCache && a.group.saveToCache();
    });
    var f = e.get("user"), g = e.get("group");
    f && c.Root.user.parse(f), g && c.Root.parse({
        group: g
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.const, e = a.model.Root;
    a.defineAPI({
        getMe: function() {
            return a.model.Root.user;
        },
        getMyGroup: function() {
            return e.managedGroup || e.group;
        },
        getUserContact: function(a) {
            var b = e.user.contacts.get(a);
            return b || a !== e.user.email && a !== e.user.id ? b : (e.user.contacts.push({
                user: e.user
            }), e.user.contacts.get(a));
        },
        getUserContacts: function(a) {
            return e.user.contacts.clone({
                filterFn: a
            }, !0);
        },
        getUserBoardsSummaryFromJSON: function(e) {
            e = e || {};
            var f, g = {
                all: function() {
                    return !0;
                },
                binder: function(a) {
                    return a.board.isconversation ? !1 : !0;
                },
                writable: function(a) {
                    return a.type === d.BOARD_READ_WRITE || a.type === d.BOARD_OWNER ? !0 : !1;
                }
            };
            f = e.filter && b.isFunction(e.filter) ? e.filter : g[e.filter || "writable"];
            var h = [], i = a.getMe().id, j = function(a) {
                var b, c = a.board.feeds;
                return c && c.length && (b = c[c.length - 1]), b ? b.timestamp || b.created_time : a.updated_time;
            };
            return c.userBoards.each(function(e) {
                if (!e.is_deleted && e.status === d.BOARD_MEMBER && e.board && !e.board.islive && f(e)) {
                    var g = {
                        id: e.board.id,
                        name: a.api.util.getBoardName(e),
                        total_pages: e.board.total_pages,
                        timestamp: j(e),
                        sequence: e.sequence
                    }, k = !1;
                    if (e.board.isconversation) {
                        var l = e.board.users, m = l.length;
                        if (m > 1) {
                            var n, o = 0, p = 4, q = [];
                            for (o; m > o; o++) {
                                if (n = l[o], !n.is_deleted) {
                                    var r = null, s = null;
                                    n.group ? r = c.config.group.avatar : n.user && n.user.id !== i && (s = n.user.picture4x || n.user.picture2x || n.user.picture, 
                                    r = s ? b.format("/user/board/{{uBoardSeq}}/{{bUserSeq}}/{{picture}}", {
                                        uBoardSeq: e.sequence,
                                        bUserSeq: n.sequence,
                                        picture: s
                                    }) : a.getMe().branding.getDefaultUserAvatar(), r = a.util.makeAccessTokenUrl(r)), 
                                    r && q.push(r);
                                }
                                if (q.length >= p) break;
                            }
                            q.length && (k = !0, g.avatars = q, g.conversation = q.length + 1);
                        }
                    }
                    if (!k) if (e.board.thumbnail) g.thumbnail = a.util.makeAccessTokenUrl(b.format("/board/{{id}}/{{thumbnail}}", e.board), {
                        ignorePublicView: !0
                    }); else {
                        var t = a.getMe().branding.getDefaultCover();
                        g.thumbnail = t ? t : c.config.defaults.binder_cover;
                    }
                    h.push(g);
                }
            }), h.sort(function(a, b) {
                return a.timestamp > b.timestamp ? -1 : a.timestamp === b.timestamp && a.sequence > b.sequence ? -1 : 1;
            }), h;
        },
        getOnlineStatus: function() {
            var a = e.user.contacts, c = e.user.agents, d = new b.Request({
                url: "/user",
                data: {
                    type: "PRESENCE_REQUEST_READ"
                }
            });
            return d.success(function(d) {
                var e = b.get("object.contacts.contacts", d);
                if (e && e.length) for (var f = 0; f < e.length; f++) {
                    var g = a.get(e[f].id) || c.get(e[f].id);
                    g && g.set("online", e[f].online);
                }
            }), d;
        },
        logout: function() {
            var d = a.getMe();
            return d && d.off(), e.user.id = "", sessionStorage.clear(), c.Root.user = a.model.User, 
            c.Root.group = a.model.Group, c.Root.parse({
                user: {
                    id: ""
                }
            }), new b.Request({
                url: "/user",
                data: {
                    type: "USER_REQUEST_LOGOUT"
                }
            });
        },
        verifyToken: function(d) {
            var f, g = {}, h = b.storage("cache"), i = h.get("user");
            return !d && i && i.id ? (e.user.subscribe(), new b.Request({
                isSucceed: !0,
                isComplete: !0
            })) : (d = d || {}, f = new b.Request({
                url: "/user"
            }), g.type = "USER_REQUEST_VERIFY_TOKEN", d.access_token ? f.opts.url = b.makeUrl("/user", {
                access_token: d.access_token
            }) : d.token && d.c_user ? (g.params = [ {
                name: "USER_REQUEST_READ_SET_COOKIE"
            } ], f.opts.url = b.makeUrl("/user", {
                token: d.token,
                c_user: d.c_user
            })) : d.email_token && (g.type = "USER_REQUEST_VERIFY_EMAIL_TOKEN", b.set("object.user.email_verification_token", d.email_token, g)), 
            f.success(function(f) {
                e.user.set("server", f.server), e.user.set("zone", f.zone);
                var g = a.getMe(), i = b.get("object.user", f);
                g.id && g.id !== i.id && (h.remove("user"), c.Root.user = new a.model.User(i, c.Root));
                try {
                    a.api.util.setMomentLanguage(i.language);
                } catch (j) {}
                c.processUserSubscribe(f.object.user), a.getMe().saveToCache(), d.subscribe !== !1 && e.user.subscribe();
            }).error(function(c) {
                d.triggerEvent && a.trigger("invalidToken");
                var f = c && c.responseText;
                if (f) try {
                    f = JSON.parse(f), e.user.set("server", f.server), e.user.set("zone", f.zone), (f = b.get("object.user", f)) && e.user.parse(f);
                } catch (g) {
                    console.error(g);
                }
            }), f.send(g));
        },
        login: function(a) {
            var e = {
                type: "USER_REQUEST_LOGIN",
                object: {
                    user: {
                        pass: a.pass
                    }
                },
                params: [ {
                    name: "USER_REQUEST_LOGIN_OUTPUT_BASIC"
                } ]
            };
            a.email ? e.object.user.email = a.email : e.object.user.type = a.type, a.remember && e.params.push({
                name: "USER_REQUEST_LOGIN_REMEMBER"
            }), a.type === d.USER_TYPE_FORCE && e.params.push({
                name: "USER_REQUEST_SALES_FORCE_CONNECT_URL",
                string_value: a.login_url
            });
            var f = new b.Request({
                url: "/user",
                data: e
            });
            return f.success(function(a) {
                c.processUserSubscribe(a.object.user);
            }), f;
        },
        getTimezoneOffset: function() {
            var a = 0, b = e.user.timezone;
            if (!b) return a;
            try {
                a = 6e4 * (moment().utcOffset() - moment().tz(b).utcOffset());
            } catch (c) {
                console && console.error(c);
            }
            return a;
        },
        signup: function(a) {
            var d, e = {}, f = {
                type: "USER_REQUEST_REGISTER"
            }, g = "";
            b.copy(a, [ "first_name", "last_name", "email", "pass" ], e), e.name = e.first_name + " " + e.last_name, 
            a.phone_number && (e.phone_number = a.phone_number), a.preferred_zone && (e.preferred_zone = a.preferred_zone), 
            a.token && ("group" === a.type ? g = "GROUP_REQUEST_INVITE_TOKEN" : "binder" === a.type && (g = "BOARD_REQUEST_VIEW_TOKEN"), 
            g && (d = [ {
                name: g,
                string_value: a.token
            } ])), a.trial && (d = [ {
                name: "USER_REQUEST_REGISTER_NO_QS_BOARDS"
            }, {
                name: "USER_REQUEST_EMAIL_OFF"
            } ]), f.object = {
                user: e
            }, d && (f.params = d);
            var h = new b.Request({
                url: "/user",
                data: f
            });
            return h.success(function(a) {
                c.processUserSubscribe(a.object.user);
            }), h;
        },
        getGroup: function(c) {
            if (e.get("group.id") === c) {
                var d = new b.Request();
                return d.invoke("success", e.group), d;
            }
            return new b.Request({
                url: "/group/" + c,
                type: "GET",
                preprocess: function(b) {
                    var c = new a.model.Group();
                    return c.parse(b.object.group), c;
                }
            }).send("");
        },
        loadUserBoardInfo: function(c) {
            var d = {
                type: "USER_REQUEST_SUBSCRIBE",
                object: {
                    user: {
                        revision: 0
                    },
                    group: {
                        revision: 0
                    }
                },
                params: [ {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/user/categories"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/user/contacts"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/user/revision"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/user/groups"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/group/members"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: "/group/id"
                }, {
                    name: "OUTPUT_FILTER_STRING",
                    string_value: '/user/boards?(board.id="' + c + '")'
                }, {
                    name: "SUBSCRIBE_REQUEST_NOHANG"
                } ]
            };
            return new b.Request({
                url: "/user",
                data: d,
                preprocess: function(b) {
                    a.getMe()._onSubscribe(b);
                }
            });
        },
        clearFavorites: function() {
            var c = a.getMe(), d = [];
            return c.favorites.forEach(function(a) {
                a.is_deleted || d.push({
                    sequence: a.sequence
                });
            }), new b.Request(d.length ? {
                url: "/user",
                data: {
                    type: "USER_REQUEST_REMOVE_FAVORITE",
                    object: {
                        user: {
                            favorites: d
                        }
                    }
                }
            } : {
                isSucceed: !0
            });
        },
        getFavorites: function(b) {
            var c = a.getMe();
            return b = b || {}, new a.CacheCollection({
                cache: c.favorites,
                sync: !1,
                filterFn: b.filterFn || function(a) {
                    return !a.is_deleted;
                },
                sortFn: b.sortFn || function(a, b) {
                    var c = a.created_time, d = b.created_time;
                    return d > c ? 1 : -1;
                }
            });
        },
        getMentionMes: function(b) {
            var d = a.getMe();
            return b = b || {}, new a.CacheCollection({
                cache: d.mentionmes,
                sync: !1,
                filterFn: b.filterFn || function(a) {
                    return !a.is_deleted;
                },
                sortFn: b.sortFn || c.sort.feedTime
            });
        },
        removeMentionMes: function(b) {
            if (b) return a.model.UserMentionMe.remove(parseInt(b));
            var c = a.getMe(), d = [];
            return c.mentionmes.each(function(a) {
                a.is_deleted || d.push(a.sequence);
            }), a.model.UserMentionMe.remove(d);
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(b) {
        for (var c, d, e = b.length - 1, f = a.getMe(); e > -1; e--) c = b[e], d = Object.keys(c), 
        d && f[d[0]] === c[d[0]] && b.splice(e, 1);
        return b;
    }
    var e = a.model.Root, f = a.const;
    a.defineAPI({
        createBoardTag: function(a, c, d) {
            return new b.Request({
                url: "/board",
                data: {
                    type: "BOARD_REQUEST_UPDATE",
                    object: {
                        board: {
                            id: a,
                            tags: [ {
                                name: c,
                                string_value: d
                            } ]
                        }
                    }
                }
            });
        },
        getUserBoard: function(a) {
            var b = c.userBoards.getModel(a);
            return b || (b = this.getTeamBoard(a)), b;
        },
        getTeamBoard: function(a) {
            return c.Root.group ? c.Root.group.boards.getModel(a) : null;
        },
        loadBoard: function(c, d) {
            var e = b.getCacheClass("Board", c);
            return e ? e.sync(d) : (e = new a.model.Board({
                id: c
            }), e.sync(d));
        },
        loadBoardFeed: function(a) {
            var d = b.getCacheClass("Board", a);
            return d ? new b.Request({
                isSuccess: !0,
                preprocess: function() {
                    return d;
                }
            }) : new b.Request({
                url: "/board/" + a + "/feeds2?count=20&ts=" + Date.now(),
                type: "GET",
                preprocess: function(d) {
                    c.processBoardSubscribe(d.object.board);
                    var e = b.getCacheClass("Board", a);
                    return e;
                }
            }).send();
        },
        getBoard: function(a) {
            return b.getCacheClass("Board", a);
        },
        getBoardPages: function(a) {
            var b = this.getBoard(a);
            return b ? b.pages.clone({
                filterFn: function(a) {
                    return !a.is_deleted;
                }
            }) : null;
        },
        getBoardFeeds: function(a) {
            var b = this.getBoard(a);
            return b ? b.feeds : null;
        },
        getBoardMembers: function(a, b, c) {
            var d = this.getBoard(a);
            return d ? (c = c || function(a, b) {
                var c, d;
                return c = a.user && a.user.name ? a.user.name : a.group.name || "", d = b.user && b.user.name ? b.user.name : b.group.name || "", 
                c.toLowerCase() > d.toLowerCase();
            }, d.users.clone({
                filterFn: b || function(a) {
                    return a.is_deleted !== !0 && !(!a.get("user.name") && !a.get("group.name"));
                },
                sortFn: c
            })) : void 0;
        },
        getSimilarBoards: function(a) {
            a = a || [];
            var d = [], e = a.length;
            return e ? (c.userBoards.each(function(f) {
                var g = b.get("board", f), h = [];
                if (g && !g.islive && g.users.length >= e) {
                    for (var i, j = 0, k = !0, l = 0; l < g.users.length; l++) if (i = g.users[l], i.is_deleted || (h.push(i), 
                    j++), j > e) {
                        k = !1;
                        break;
                    }
                    if (k) {
                        for (var m, n, o, p = 0, q = 0; e > q; q++) {
                            m = a[q], o = !1;
                            for (var r = 0; r < h.length; r++) if (n = h[r], m.group_id) {
                                if (n.group && n.group.id === m.group_id) {
                                    p++, o = !0;
                                    break;
                                }
                            } else if (n.user && (m.id && m.id === n.user.id || m.email && m.email === n.user.email)) {
                                p++, o = !0;
                                break;
                            }
                            if (!o) break;
                        }
                        p === e && d.push(c.userBoards.getModel(g.id));
                    }
                }
            }), d) : d;
        },
        getTeamAndBoardList: function(b, d) {
            d = d || {};
            var e = function(a) {
                if (c.filter.isTimelineData.call(this, a)) {
                    if (d.teamId) {
                        if (!a.is_group) return !1;
                        for (var e, f = a.board.users, g = 0, h = !1; g < f.length; g++) e = f[g], e.group && e.group.id === d.teamId && (h = !0);
                        if (!h) return !1;
                    } else if (a.is_group) return !1;
                    return b ? b.call(this, a) : !0;
                }
                return !1;
            };
            return new a.CacheCollection({
                cache: c.userBoards,
                filterFn: e,
                sortFn: c.sort.timeline
            });
        },
        getTimelinePagingData: function(b) {
            var d = new a.Collection({
                model: "Moxtra.model.UserBoard",
                attributeId: "board.id",
                index: "sequence",
                removedFlag: [ "board.is_deleted", "is_deleted" ],
                filterFn: c.filter.isTimelineData,
                reverseOrder: !0,
                maxPageCount: 10
            }), e = a.const, f = _.filter(c.userBoards, function(a) {
                return a.board && a.board.islive ? !1 : a.type !== e.BOARD_READ_WRITE && a.type !== e.BOARD_OWNER ? !1 : c.filter.isTimelineData(a) ? b && !b(a) ? !1 : !0 : !1;
            });
            return f.sort(c.sort.timeline), d.push(f, 1), d;
        },
        getTimelineList: function(b, d) {
            var e = c.filter.isTimelineData, d = d || {};
            return b && (e = function(a) {
                return c.filter.isTimelineData.call(this, a) ? b.call(this, a) : !1;
            }), new a.CacheCollection({
                cache: c.userBoards,
                filterFn: e,
                sortFn: d.sortFn || c.sort.timeline
            });
        },
        getBoardList: function(d, g) {
            g = g || {};
            var h, i, j, k = c.boardList;
            return "team" !== d || g.teamId || (g.teamId = a.getMyGroup().id), i = c.sort.binderShelf, 
            j = "Moxtra.model.UserBoard", k ? k.sortFn = i : k = c.boardList = new a.Collection({
                model: j,
                attributeId: "board.id",
                index: "sequence",
                removedFlag: [ "board.is_deleted", "is_deleted" ],
                sortFn: i,
                filterFn: c.filter.isTimelineData,
                maxPageCount: 20,
                reverseOrder: !0
            }), k.clear(), e.user.on("firstSubscribe", function() {
                function a(a) {
                    if (a.is_deleted || !a.board || a.board.is_deleted || a.board.islive || a.board.islive || a.board.isconversation) return !1;
                    if (c.filter.isDefault(a)) return !1;
                    if ("all" === d) return a.isTeam ? !1 : !0;
                    if ("team" === d) {
                        if (a.is_group) {
                            var e = g.teamId, f = b.get("users", a.board), h = !1;
                            return f && b.each(f, function(a) {
                                return a.group && a.group.id === e ? (h = !0, !1) : void 0;
                            }), h ? !0 : !1;
                        }
                        return !1;
                    }
                    return void 0 === a.category && (a.category = 0), a.category && i.indexOf(a.category) < 0 && (a.category = 0), 
                    a.isTeam ? !1 : a.category === d ? !0 : !1;
                }
                var i = [];
                c.Root.user.categories.each(function(a) {
                    a.is_deleted || i.push(a.sequence);
                }), k.category = d, k.clear(), k.filter(a), h = e.user.boards;
                var j = _.filter(h, a);
                j = j.sort("team" !== d || g.teamId ? c.sort.binderShelf : c.sort.groupBinder);
                for (var l = 0; l < j.length; l++) j[l] = h.getModel(j[l]);
                k.push(j, c.status.isFullData), k._caches && k.stopListening(k._caches), k.listenTo(h, f.EVENT_DATA_ADD, function(b) {
                    a(b) && k.push(h.getModel(b));
                }), k.listenTo(h, f.EVENT_DATA_REMOVE, function(a) {
                    k.remove(a);
                }), k.listenTo(h, f.EVENT_DATA_CHANGE, function(b) {
                    a(b) || k.remove(b);
                }), k.listenTo(h, f.EVENT_DATA_MODEL_CHANGE, function(b) {
                    a(b) || k.remove(b);
                }), k._caches = h;
            }), k;
        },
        leaveBoardByToken: function(a, c) {
            var d = b.set("object.board.id", c, {});
            return d.params = [ {
                name: "BOARD_REQUEST_VIEW_TOKEN",
                string_value: a
            } ], d.type = "BOARD_REQUEST_LEAVE", new b.Request({
                url: "/board",
                data: d
            });
        },
        loadChatWithUser: function(d) {
            var e, f = [];
            if (_.each(d, function(a) {
                f.push({
                    user: a
                });
            }), f.length > 1) return new b.Request({
                isFailed: !0
            });
            e = {
                type: "USER_REQUEST_BOARD_LOOKUP",
                object: {
                    board: {
                        isconversation: !0,
                        users: f
                    }
                }
            };
            var g = function(a) {
                var b = 0;
                return _.each(a, function(a) {
                    a.is_deleted || !a.user || a.user.is_deleted || b++;
                }), 2 === b ? !0 : !1;
            };
            return new b.Request({
                url: "/user",
                data: e,
                preprocess: function(d) {
                    var e, f, h = b.get("object.user.boards", d);
                    if (h) {
                        for (var i = 0; i < h.length; i++) if (e = h[i], g(e.board.users)) {
                            f = e;
                            break;
                        }
                        if (f) {
                            var j = b.get("object.user", d);
                            return j.boards = [ f ], c.processUserSubscribe(j), a.getUserBoard(f.board.id);
                        }
                    }
                    return null;
                }
            });
        },
        startChat: function(c, e) {
            function f() {
                var b = new a.model.Board();
                b.set("category", 0), b.set("isconversation", !0), b.create().success(function() {
                    h ? b.inviteUsers(c, null, e).success(function() {
                        i.hasSubscribeUser ? g.wait(function() {
                            return a.getUserBoard(b.id);
                        }).invoke("success", b) : g.invoke("success", b);
                    }).error(function(a, c) {
                        g.xhr = a, b.delete(), g.invoke("error", a, c);
                    }) : i.hasSubscribeUser ? g.wait(function() {
                        return a.getUserBoard(b.id);
                    }).invoke("success", b) : g.invoke("success", b);
                }).error(function(a, b) {
                    g.invoke("error", a, b);
                });
            }
            var g, h = !0, i = a.getMe();
            return Array.isArray(c) || (c = [ c ]), c = d(c), c.length || (h = !1), g = new b.Request(), 
            a.loadChatWithUser(c).success(function(b) {
                b ? b.status === a.const.BOARD_INVITED ? b.board.acceptInvite().success(function() {
                    g.invoke("success", b.board);
                }) : g.invoke("success", b.board) : f();
            }).error(function() {
                f();
            }), g;
        },
        verifyInvitationToken: function(c) {
            return new b.Request({
                url: "/board",
                data: {
                    type: "BOARD_REQUEST_VIEW_INVITATION",
                    object: {
                        board: {}
                    },
                    params: [ {
                        name: "BOARD_REQUEST_VIEW_TOKEN",
                        string_value: c
                    } ]
                },
                preprocess: function(c) {
                    if (c = b.get("object.board", c)) {
                        var d = new a.model.Board();
                        if (c.islive && c.resources && c.resources.length) c.resources.forEach(function(b) {
                            b.type === a.const.BOARD_RESOURCE_SESSION_AS_VIDEO && (c.pages || (c.pages = []), 
                            c.pages.push({
                                client_uuid: b.client_uuid,
                                name: b.name,
                                vector: 0,
                                sequence: b.sequence,
                                updated_time: b.updated_time,
                                page_type: a.const.PAGE_TYPE_NOTE,
                                width: b.width,
                                height: b.height,
                                isVirtual: !0
                            }));
                        }); else {
                            var e = c.view_tokens[0];
                            e.pages || e.folders || e.page_groups || !e.resources || c.resources.forEach(function(b) {
                                c.pages || (c.pages = []), c.pages.push({
                                    client_uuid: b.client_uuid,
                                    name: b.name,
                                    original: b.sequence,
                                    sequence: b.sequence,
                                    page_type: a.const.PAGE_TYPE_ANY,
                                    isVirtual: !0
                                });
                            });
                        }
                        return d.parse(c, 2), d;
                    }
                    return c;
                }
            });
        },
        parseBoardData: function(a) {
            c.processBoardSubscribe(a);
        },
        getPinList: function(b) {
            if (c.currPinList && c.currPinList.boardId === b) return c.currPinList;
            var d = a.getBoard(b), e = new a.Collection({
                model: "Moxtra.model.BoardFeed",
                owner: d
            });
            _.each(d.feeds, function(a) {
                a.is_pinned && e.push(a);
            });
            var f = d.feeds.cacheData;
            return f && f.length && _.each(f, function(a) {
                a.is_pinned && e.push(a);
            }), e.inited = !0, e.boardId = b, c.currPinList = e, e.sort(c.sort.feedTimeDESC), 
            e;
        },
        clearAllPin: function(b) {
            var c = a.getPinList(b), d = [];
            c.each(function(a) {
                a.set("is_pinned", !1), d.push(a.getUpdateData());
            });
            var e = a.getBoard(b);
            return e.operateChild("feeds", d, "BOARD_REQUEST_PIN");
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(a) {
        return a = a.toString(), 1 === a.length ? "0" + a : a;
    }
    var e = a.const;
    a.define("Moxtra.model.MeetDay", a.model.Model, {
        properties: {
            id: "",
            day: 0,
            year: 0,
            month: 0,
            count: {
                get: function() {
                    return this.meets ? this.meets.length : 0;
                }
            },
            dayStart: 0,
            dayEnd: 0,
            meets: {
                get: function() {
                    return this._meets;
                },
                set: function(a) {
                    this._meets = a;
                }
            }
        }
    }), a.defineAPI({
        scheduleMeet: function(c, d, e, f) {
            f = f || {}, b.isString(f) && (f = {
                agenda: f
            });
            var g = new a.model.Board();
            g.parse({
                sessions: [ {
                    session: {
                        sequence: 0
                    }
                } ]
            }, !1), g.set("name", c);
            var h = g.sessions[0].session;
            return h.set("scheduled_start_time", d), h.set("scheduled_end_time", e), h.set("agenda", f.agenda || ""), 
            f.joinBeforeHost && h.set("milliseconds_allowed_to_join_before_start", f.joinBeforeHost), 
            f.originalBinderId && h.set("original_board_id", f.originalBinderId), h.create();
        },
        getMonthMeetCount: function(f, g) {
            function h() {
                i.listenTo(y, e.EVENT_DATA_ADD, function(a) {
                    z(a), i.push(s, 1);
                }), i.listenTo(y, e.EVENT_DATA_REMOVE, function(a) {
                    z(a, !0), i.push(s, 1);
                }), i.listenTo(y, e.EVENT_DATA_CHANGE, function(a) {
                    z(a), i.push(s, 1);
                }), i.listenTo(y, e.EVENT_DATA_MODEL_CHANGE, function(a) {
                    z(a, !0), i.push(s, 1);
                });
            }
            var i = c.monthMeetCount, j = [ f, g ].join(".");
            if (i && i.timeKey === j) return i;
            i && i.destroy(), i = c.monthMeetCount = new a.Collection({
                model: "Moxtra.model.MeetDay",
                attributeId: "id"
            }), i.timeKey = j, c.loadedMeet || (c.loadedMeet = {});
            var k, l, m, n, o, p, q = {}, r = {}, s = b.getMonthDays(f, g, !0, function(a) {
                return a.id = [ a.year, d(a.month + 1), d(a.day) ].join("-"), a.count = 0, a.meets = b.createCache("UserBoard", {
                    sortFn: c.sort.meet
                }, a.id), a.meets.push([], 1), q[a.id] = a, a;
            }), t = new Date(s[0].id + "T00:00:00"), u = new Date(s[s.length - 1].id + "T11:59:59"), v = t.getTime(), w = u.getTime(), x = a.getTimezoneOffset(), y = c.cache("userBoard", "userBoards"), z = function(a, e) {
                if (c.filter.isMeet(a)) {
                    var f = b.get("board.sessions.0.session", a);
                    if (f) {
                        var g, h = f.scheduled_start_time || f.start_time;
                        if (g = a.board.id, h && h > v && w > h) {
                            p = h - x, o = new Date(p), l = o.getFullYear(), m = o.getMonth(), n = o.getDate();
                            var i, j = [ l, d(m + 1), d(n) ].join("-"), s = r[g];
                            s && s !== j && (i = q[s], i.meets.remove(g)), (i = q[j]) && (a.is_deleted || a.board.is_deleted ? i.meets.remove(g) : i.meets.indexOf(g) < 0 && (k = y.getModel(g), 
                            i.meets.push(k), e && i.meets.sort()), r[g] = j);
                        }
                    }
                }
            };
            v += x, w += x;
            var A = b.makeUrl("/user/sessions", {
                from: v,
                to: w
            });
            return c.loadedMeet[j] ? (y.each(function(a) {
                z(a);
            }), i.push(s, 1), h(), i) : (new b.Request({
                type: "GET",
                url: A,
                preprocess: function(a) {
                    var d = b.get("object.user", a);
                    d && (c.processUserSubscribe(d), c.loadedMeet[j] = !0, y.each(function(a) {
                        z(a);
                    }), i.push(s, 1)), h();
                }
            }).send(), i.push(s, 1), i);
        },
        getMeetList: function(b) {
            {
                var c;
                a.getMe().timezone;
            }
            b || (c = a.getTimezoneOffset(), b = new Date(Date.now() - c)), b = moment(b);
            var e = a.getMonthMeetCount(b.year(), b.month()), f = e.get([ b.year(), d(b.month() + 1), d(b.date()) ].join("-"));
            return f ? f.meets : null;
        },
        reclaimMeetHost: function(a) {
            return new b.Request({
                url: "/board",
                data: {
                    type: "SESSION_REQUEST_RECLAIM_HOST",
                    object: {
                        session: {
                            session_key: a
                        }
                    }
                }
            });
        },
        publishMeetRecording: function(a, d) {
            return new b.Request({
                url: "/board",
                data: {
                    type: "BOARD_PUBLISH_ACTION",
                    action: {
                        session_key: a,
                        recording_state: [ {
                            id: c.uuid(),
                            status: d
                        } ]
                    }
                }
            });
        }
    });
}), Moxtra.define(function(a, b) {
    var c = (a.const, "/group");
    Stripe.setPublishableKey(a.config.stripe.public_key);
    a.model.Root;
    a.defineAPI({
        changeStripePlan: function(a) {
            var d = {
                type: "GROUP_REQUEST_STRIPE_SUBSCRIBE",
                object: {
                    group: {
                        plan_code: a
                    }
                }
            };
            return new b.Request({
                url: c,
                data: d
            });
        },
        getStripeAvailablePlans: function() {
            var a = {
                type: "GROUP_REQUEST_STRIPE_PLANS"
            };
            return new b.Request({
                url: c,
                data: a
            });
        },
        createStripeToken: function(a, d) {
            function e(a, b) {
                if (b.error) f.invoke("error", f.req, a, b); else {
                    var c = {
                        type: "GROUP_REQUEST_STRIPE_SUBSCRIBE",
                        params: [ {
                            name: "GROUP_REQUEST_STRIPE_SUBSCRIBE_TOKEN",
                            string_value: b.id
                        } ],
                        object: {
                            group: {
                                plan_code: d
                            }
                        }
                    };
                    f.send(c);
                }
            }
            var f = new b.Request({
                url: c
            });
            return Stripe.card.createToken(a, e), f;
        },
        updateCreditCard: function(a) {
            function d(a, b) {
                if (b.error) e.invoke("error", e.req, a, b); else {
                    var c = {
                        type: "GROUP_REQUEST_STRIPE_SUBSCRIBE",
                        params: [ {
                            name: "GROUP_REQUEST_STRIPE_SUBSCRIBE_TOKEN",
                            string_value: b.id
                        } ]
                    };
                    e.send(c);
                }
            }
            var e = new b.Request({
                url: c
            });
            return Stripe.card.createToken(a, d), e;
        },
        getStripeCustomer: function() {
            var a = {
                type: "GROUP_REQUEST_STRIPE_CUSTOMER",
                object: {
                    group: {}
                }
            };
            return new b.Request({
                url: c,
                data: a
            });
        },
        PLAN_CODE: {
            PRO_MONTHLY: "pro-monthly",
            PRO_ANNUAL: "pro-annual",
            STANDARD_MONTHLY: "standard-monthly",
            STANDARD_ANNUAL: "standard-annual"
        }
    });
}), Moxtra.define(function(a, b, c) {
    var d = a.model.Root;
    a.defineAPI({
        createTodoModel: function(e) {
            var f, g, h;
            if (g = new a.model.BoardTodo(), g.set("client_uuid", c.uuid()), b.isString(e) && (h = a.getBoard(e)), 
            h && (g.defineProperty("parent", h), f = h.users)) {
                var i = f.get(d.user.id);
                g.creator_sequence = i && i.sequence;
            }
            return g;
        },
        getBoardTodos: function(b) {
            var c = a.getBoard(b);
            return c ? c.todos : null;
        },
        getTodoComments: function(a) {
            var b = this.getBoardTodos(a);
            return b ? b.comments : void 0;
        },
        createTodoCommentModel: function(b, c) {
            var e, f = new a.model.Comment();
            return "BoardTodo" === b.$name ? e = b.parent : e || (e = a.getBoard(c), b = e.todos.get(b)), 
            b && e ? (f.defineProperty("parent", b), f.set("user", {
                id: d.user.id
            }), f) : void 0;
        },
        getAssignToMe: function() {
            var c = a.getMe().id;
            return a.getTimelineList(function(a) {
                var d, e, f, g, h = a.board, i = !1;
                if (!h || !h.users) return i;
                if (d = h.users, d.$name || (a = this.getTransferJson(a, "userBoard"), h = a.board), 
                e = h.todos, f = h.users.get(c) || {}, e && e.length) for (var j = 0; j < e.length; j++) if (g = e[j], 
                !g.is_deleted && !g.is_completed && (g.assignee_sequence && g.assignee_sequence === f.sequence || g.assignee && b.get("id", g.assignee.user) === c)) {
                    i = !0;
                    break;
                }
                return i;
            });
        },
        markTodo: function(c, d) {
            var e = a.getBoard(c), f = e.todos.clone({
                filterFn: {
                    is_deleted: !1
                }
            }), g = f.get(d);
            if (g) {
                if (g.set("is_marked", !0), f.length > 1) {
                    var h = f[0], i = parseFloat(h.order_number);
                    if (i) g.set("order_number", (i - 100).toString()); else {
                        var j = 100;
                        f.each(function(a) {
                            a.order_number === g.order_number || a.is_completed || (a.set("order_number", j.toString()), 
                            j += 100);
                        }), g.set("order_number", "0"), e.updateChildren("todos");
                    }
                }
                return g.update();
            }
            return new b.Request({
                isFailed: !0
            });
        },
        getTodoFeeds: function(d, e) {
            var f = a.getBoard(d), g = f.todoHistory, h = a.const;
            return g ? g.clone({
                filterFn: function(a) {
                    return b.get("board.todos.0.sequence", a) === e ? a.type === h.FEED_TODO_DUE_DATE_ARRIVE ? !1 : !0 : !1;
                },
                sortFn: c.sort.feeds
            }) : void 0;
        },
        getTodoBinders: function() {
            function b(a) {
                return d.call(this, a) && a.board.total_open_todos ? !0 : !1;
            }
            var d = c.filter.isTimelineData, e = [], f = c.userBoards;
            f.each(function(a) {
                b.call(this, a) && e.push(f.getModel(a.sequence));
            });
            a.getMe();
            e.push({
                sequence: -1,
                board: {
                    id: "assigntome",
                    name: MX.lang.assigned_to_me
                }
            });
            var g = new a.Collection({
                model: "Moxtra.model.UserBoard",
                attributeId: "board.id",
                index: [ "client_uuid", "sequence" ],
                removedFlag: [ "board.is_deleted", "is_deleted" ],
                sortFn: function(a, b) {
                    return -1 === a.sequence ? -1 : -1 === b.sequence ? 1 : c.sort.timeline(a, b);
                }
            }), h = a.const;
            return g.listenTo(f, h.EVENT_DATA_ADD, function(a) {
                b.call(this, a) && g.push(f.getModel(a.sequence));
            }), g.listenTo(f, h.EVENT_DATA_REMOVE, function(a) {
                g.get(a.sequence) && g.remove(a.sequence);
            }), g.listenTo(f, h.EVENT_DATA_CHANGE, function(a) {
                b.call(this, a) ? g.push(f.getModel(a.sequence)) : g.remove(a.sequence);
            }), g.listenTo(f, h.EVENT_DATA_MODEL_CHANGE, function(a) {
                b.call(this, a) ? g.push(f.getModel(a.sequence)) : g.remove(a.sequence);
            }), g.push(e, !0), g.get("assigntome").isAssignToMe = !0, g.sort(), g;
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(a, b, c) {
        var d = b;
        c && (d = c);
        var f = {
            sequence: e--,
            isVirtualUser: !0,
            isDivision: c ? !1 : !0,
            user: {
                name: d,
                id: d
            }
        };
        return b && c && (f.division = b), f;
    }
    var e = -1;
    a.defineAPI({
        getBizDirectory: function(b) {
            var e, f, g = a.getMyGroup(), h = {}, i = [];
            if (!g) return null;
            b = b || {}, e = b.division || "", f = b.department || "";
            var j = function(a) {
                if (!a.isVirtualUser && b.filterFn && !b.filterFn(a)) return !1;
                var c = a.division || "", j = a.department || "";
                return "" === c || h[c] || (h[c] = {
                    value: !0,
                    department: {}
                }, i.push(d(g, c))), "" !== j && ("" !== c ? h[c].department[j] || (h[c].department[j] = !0, 
                i.push(d(g, c, j))) : h[j] || (h[j] = !0, i.push(d(g, null, j)))), c === e && j === f ? b.excludeUser ? a.isVirtualUser : !0 : !1;
            }, k = g.members.clone({
                filterFn: j,
                sortFn: c.sort.bizDirectory
            });
            return k.push(i), k;
        },
        searchBizContact: function(b, d) {
            b = b.toLowerCase();
            var e = a.getMyGroup();
            if (!e || !e.members) return null;
            var f = e.members.clone({
                filterFn: function(a) {
                    if (d && !d(a)) return !1;
                    var c = a.user;
                    if (!c) return !1;
                    var e = (c.displayName || "").toLowerCase(), f = (c.email || "").toLowerCase(), g = c.phone_number, h = (a.division || "").toLowerCase(), i = (a.department || "").toLowerCase();
                    return (e + " " + g.toString() + " " + f + " " + h + " " + i).match(b) ? !0 : !1;
                },
                sortFn: c.sort.bizDirectory
            });
            return f;
        },
        getGroupMembers: function(a) {
            var d = b.cache("Group"), e = d.get(a);
            return e && e.members ? e.members.clone({
                filterFn: function(a) {
                    return a.is_deleted ? !1 : !0;
                },
                sortFn: c.sort.bizDirectory
            }, !0) : null;
        },
        getGroupContact: function(b) {
            var c = a.getMyGroup();
            return c && c.members ? c.members.get(b) : null;
        },
        getTeams: function() {
            var c = a.getMe().groups;
            return c.clone({
                filterFn: function(c) {
                    return b.get("group.type", c) === a.const.GROUP_TYPE_TEAM;
                },
                sortFn: function(a, c) {
                    var d = (b.get("group.name", a) || "").toLowerCase(), e = (b.get("group.name", c) || "").toLowerCase();
                    return d >= e ? 1 : -1;
                }
            }, !0);
        },
        loadTeam: function(a) {
            return new b.Request({
                url: "/group/" + a,
                type: "GET",
                preprocess: function(a) {
                    c.processUserSubscribe({
                        groups: [ {
                            group: a.object.group
                        } ]
                    });
                }
            }).send("");
        },
        loadGroupInfo: function(d) {
            var e = b.cache("Group"), f = e.get(d);
            return f ? f.syncTags() : (f = c.getInstance({
                model: a.model.Group,
                attributeId: "id",
                data: {
                    id: d
                }
            }), f.syncTags());
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(b) {
        if (a.api.filter.isTimelineData(b)) {
            var d, e = b.board, g = e.view_tokens, i = e.id;
            g && g.forEach(function(a) {
                var b, e, g = i + "_" + a.sequence;
                a.actor_file_as && a.actor_file_as.type === h.USER_TYPE_SERVICE && (d || (d = f.user.boards.getModel(i)), 
                e = c.Root.services.get(a.actor_file_as.name), e && (a.is_deleted ? e.integrations.remove(g) : (b = d.board.view_tokens.get(a.sequence), 
                b ? e.parse({
                    integrations: [ b ]
                }) : e.integrations.remove(g))));
            });
        }
    }
    function e(a) {
        var b = f.user.boards.get(a.sequence);
        d(b);
    }
    var f = a.model.Root, g = !1, h = a.const;
    a.defineAPI({
        getServices: function() {
            if (!g) {
                var a = f.user.boards;
                a.each(d), a.on(h.EVENT_DATA_ADD, d), a.on(h.EVENT_DATA_REMOVE, d), a.on(h.EVENT_DATA_CHANGE, d), 
                a.on(h.EVENT_DATA_MODEL_CHANGE, e), g = !0;
            }
            return f.services;
        },
        getService: function(a) {
            return f.services.get(a);
        },
        removeIntegrationTrigger: function(a, c) {
            return new b.Request({
                url: "/triggers/onevent",
                data: {
                    type: "DELETE",
                    token: a,
                    creator_id: c
                }
            });
        }
    });
}), Moxtra.define(function(a, b, c) {
    function d(a) {
        if (a) {
            var b = a.board.view_tokens, d = a.board.id;
            b && _.each(b, function(a) {
                var b, e = d + "_" + a.sequence;
                a.actor_file_as && a.actor_file_as.type === i.USER_TYPE_SERVICE && (b = c.Root.services.get(a.actor_file_as.name), 
                b && b.integrations.remove(e));
            });
        }
    }
    function e(b) {
        var d, e = 0, f = c.userBoards;
        b.each(function(a) {
            d = f.get(a), d.feed_unread_count && (e += d.feed_unread_count);
        }), a.getMe().set("feed_unread_count", e);
    }
    function f(c) {
        var d, e, f, g = new a.util.Array(), h = c.feeds;
        if (c.todoHistory || (c.todoHistory = []), h) for (d = h.length - 1; d >= 0; d--) e = h[d], 
        e.type && e.type.indexOf("TODO") > 0 ? (f = b.get(k.todo, e), c.todoHistory.push(e), 
        g.contain(f) ? h.splice(d, 1) : g.push(f)) : b.isSupportFeed(e.type) || h.splice(d, 1);
    }
    function g(d, e) {
        var f, g = new a.util.Array(), h = new a.util.Array(), i = new a.util.Array(), j = new a.util.Array(), l = new a.util.Array(), m = new a.util.Array(), n = e.feeds;
        e.comments && e.comments.forEach(function(a) {
            a.is_deleted && j.push(a.sequence);
        }), e.pages && e.pages.forEach(function(a) {
            a.comments && a.comments.forEach(function(a) {
                a.is_deleted && l.push(a.sequence);
            }), a.is_deleted && h.push(a.sequence);
        }), e.todos && e.todos.forEach(function(a) {
            a.comments && a.comments.forEach(function(a) {
                a.is_deleted && m.push(a.sequence);
            });
        }), e.resources && e.resources.forEach(function(a) {
            a.is_deleted && i.push(a.sequence);
        }), e.todoHistory || (e.todoHistory = []);
        var o, p, q, r;
        if (n) for (p = n.length - 1; p >= 0; p--) {
            q = n[p], q.type.indexOf("TODO") > 0 ? (e.todoHistory.push(q), o = b.get(k.todo, q), 
            g.indexOf(o) > -1 || b.get("board.todos.0.comments.0.is_deleted", q) ? n.splice(p, 1) : g.push(o)) : b.isSupportFeed(q.type) ? b.get("board.pages.0.is_deleted", q) ? (o = b.get(k.page, q), 
            h.push(o), q.type !== a.const.FEED_PAGES_DELETE && q.type !== a.const.FEED_FOLDER_DELETE && n.splice(p, 1)) : b.get("board.resources.0.is_deleted", q) ? (o = b.get(k.resource, q), 
            i.push(o), n.splice(p, 1)) : b.get("board.comments.0.is_deleted", q) ? n.splice(p, 1) : b.get("board.pages.0.comments.0.is_deleted", q) && n.splice(p, 1) : n.splice(p, 1);
            var s = c.currPinList;
            s && s.boardId === e.id && (q.is_pinned ? s.push(q) : s.remove(q));
        }
        if (j.length || l.length || h.length || g.length || i.length) {
            var t = [];
            d.feeds.each(function(a) {
                (f = b.get(k.comment, a)) ? j.contain(f) && t.push(a.sequence) : (f = b.get(k.pageComment, a)) ? (l.contain(f) && t.push(a.sequence), 
                (r = b.get(k.page, a)) && h.contain(r) && t.push(a.sequence)) : (f = b.get(k.todo, a)) ? g.contain(f) && t.push(a.sequence) : (f = b.get(k.page, a)) ? h.contain(f) && t.push(a.sequence) : (f = b.get(k.resource, a)) ? i.contain(f) && t.push(a.sequence) : (f = b.get(k.todoComment, a)) && m.contain(f) && t.push(a.sequence);
            }), t.forEach(function(a) {
                d.feeds.remove(a);
            });
        }
    }
    var h = {
        map: {}
    }, i = a.const;
    b.defineProps(c, Backbone.Events, !1, !1), c.source = h, a.onReady = function(a) {
        c.Root.user.on("firstSubscribe", a);
    };
    var j = new a.util.Array({
        unique: !0
    });
    c.processUserSubscribe = function(f, g) {
        f = f || {};
        var h, i, k, l, m, n, o, p = c.Root.user, q = 0 === p.revision, r = c.Root.group && c.Root.group.boards, s = c.userBoards, t = !1, u = a.const;
        if (console.time("processUserSubscribe"), f.boards && (i = f.boards, f.boards = null, 
        delete f.boards), p.revision >= f.revision) return !0;
        if (g && f.revision && (p._revision = f.revision), q) if (f.categories || (f.categories = []), 
        f.contacts || (f.contacts = []), f.agents) {
            h = f.agents.length - 1;
            for (var v; h > -1; h--) v = f.agents[h], v.agent && "OS_TYPE_CLOUD" === v.agent.os_type && f.agents.splice(h, 1);
        } else f.agents = [];
        if (p.id && f.id && p.id !== f.id) return p.id = "", void a.trigger("sessionTimeout");
        var w, x, y, z, A;
        f.favorites && _.each(f.favorites, function(a) {
            a.is_deleted ? (A = p.favorites.get(a.sequence), y = b.get("board.id", A), z = !1) : (y = b.get("board.id", a), 
            z = !0, A = a), w = b.getCacheClass("Board", y), w && (x = w.feeds.get(b.get("board.feeds.0.sequence", A)), 
            x && x.parse({
                isFavorite: z
            }));
        }), p.parse(f, q);
        {
            var B;
            c.Root.group;
        }
        if (i && i.length) for (h = i.length - 1; h > -1; h--) if (k = i[h], n = k.sequence || k.board && k.board.id || "", 
        c.filter.isDeleted(k)) q || (s.add(k), j.remove(k.sequence), d(s.get(n)), s.remove(n)); else if (!n || q && !k.board) i.splice(h, 1); else if (c.filter.isUsefulData(k)) {
            if (t = !1, m = s.get(k.sequence), k.board.feeds) {
                var C = k.board.feeds.length;
                o = k.board.feeds[C - 1], o && b.isSupportFeed(o.type) && (m = s.get(k.sequence), 
                m && m.lastFeed && o.sequence !== m.lastFeed.sequence ? t = !0 : m && m.lastFeed || (k.lastFeed = o, 
                t = !0));
            }
            void 0 === k.board.thumbnail && (k.board.thumbnail = 0), B = m && m.category || "", 
            s.add(k), !q && t && p.trigger(u.EVENT_FEED_CHANGE, k), q || t || !c.filter.isMeet(k) || p.trigger(u.EVENT_FEED_CHANGE, k), 
            c.filter.isTimelineData(k) && !c.filter.isMeet(k) && j.push(k.sequence);
        }
        e(j), f.tags && c.Root.group && f.tags.forEach(function(a) {
            if (0 === a.name.indexOf("Board_")) {
                l = a.name.substr(6);
                var b = r.get(l);
                b && r.add({
                    board: {
                        id: l
                    },
                    sequence: b.sequence,
                    accessed_time: Number(a.string_value)
                });
            }
        }), console.timeEnd("processUserSubscribe"), f.boards = i;
    }, c.processBoardSubscribe = function(d, e, h) {
        if (d && d.id) {
            console.time("processBoardSubscribe");
            var i = b.getCacheClass("Board", d.id), j = !1, k = i && i.revision > 0 ? 0 : c.status.isAllFullData;
            return i || (i = new a.model.Board(), j = !0), i.revision >= d.revision ? !0 : (e && (i._revision = d.revision, 
            i.syncTime = Date.now()), k ? (e || (d.feeds && d.feeds.sort(c.sort.feeds), g(i, d)), 
            f(d)) : g(i, d), console.time("boardObject.parse"), i.parse(d, k), console.timeEnd("boardObject.parse"), 
            j && !h && b.saveCacheClass(i), k && i && (Object.keys(i.$props).forEach(function(b) {
                i[b] instanceof a.Collection && (i[b].inited || i[b].push([], k));
            }), i.trigger(a.const.EVENT_FIRST_SUBSCRIBE)), console.timeEnd("processBoardSubscribe"), 
            i);
        }
    };
    var k = {
        todo: "board.todos.0.sequence",
        page: "board.pages.0.sequence",
        resource: "board.resources.0.sequence",
        comment: "board.comments.0.sequence",
        pageComment: "board.pages.0.comments.0.sequence",
        todoComment: "board.todos.0.comments.0.sequence"
    };
    c.processGroupSubscribe = function(d, e) {
        var f, g = d || {}, h = c.Root, i = b.cache("Group"), j = !1, k = a.storage("integration"), l = k.get("group_id"), m = "group";
        f = i.get(g.id);
        var n = g.boards;
        if (delete g.boards, f) {
            if (f.revision >= g.revision) return !0;
            0 === f.revision && (j = !0);
        } else j = !0, f = c.getInstance({
            model: a.model.Group,
            attributeId: "id",
            data: g
        });
        f.parse(g, j), f.syncTime = Date.now(), e && g.revision && (f._revision = g.revision), 
        m = l && g.id === l ? "managedGroup" : "group", f.isTeam || h[m] || (h[m] = f);
        var o = c.filter, p = !1;
        if (n && n.length) for (var q, r = n.length - 1; r > -1; r--) q = n[r], o.isDeleted(q) ? (j || (f.boards.add(q), 
        f.boards.remove(q.sequence)), p = !0) : o.isUsefulData(q) && !o.isMeet(q) ? (q.board.feeds && (q.lastFeed = q.board.feeds[0], 
        delete q.board.feeds, p = !0), f.boards.add(q)) : f && f.boards.remove(q);
        return j && f && (Object.keys(f.$props).forEach(function(b) {
            f[b] instanceof a.Collection && (f[b].inited || f[b].push([], j));
        }), f.trigger(a.const.EVENT_FIRST_SUBSCRIBE)), g.boards = n, f;
    };
}), Moxtra.define(function(a, b, c) {
    c.notification = new a.Storage({
        prefix: "mxsdk",
        name: "notification"
    });
    var d = (a.const, a.model.Root);
    a.defineAPI({
        getUserBoards: function() {
            return d.user.boards;
        },
        parseData: function(b) {
            if (b && a) {
                var c = a.getMe();
                c._onSubscribe(b);
            }
        }
    });
}), Moxtra.define(function(a) {
    a.define("Moxtra.PageCollection", a.Collection, {
        properties: {},
        methods: {
            create: function() {},
            "delete": function() {},
            update: function() {},
            comparator: function(a, b) {
                var c = parseFloat(a.page_number), d = parseFloat(b.page_number);
                return d > c ? -1 : c > d ? 1 : a.sequence > b.sequence ? 1 : -1;
            },
            push: function(a, b) {
                var c = this, d = a.length;
                if (!a.forEach) return this.pushItem(a, b);
                if (b) {
                    if (this.preFilter) for (var e = a.length - 1; e >= 0; e--) this.filterFn(a[e]) || a.splice(e, 1);
                    this.maxPageCount && d > this.maxPageCount && (this.totalRecords = d, this.cacheData = this.reverseOrder ? a.splice(this.maxPageCount, d - this.maxPageCount) : a.splice(0, d - this.maxPageCount));
                    var f = this._includes;
                    if (f) {
                        var g = this.getDataFromCache(f.val, f.key);
                        this._includes = null, g && a.push(g);
                    }
                }
                a.forEach(function(a) {
                    c.push(a, b);
                }), this.sort(this.comparator), !b && this.inited && this.updatePageIndex(), b && !this.inited && (this.inited = !0, 
                this.trigger("inited"), 0 === c.length && this.trigger("empty"), this.processSameData(), 
                this.owner.page_groups && this.owner.page_groups.length > 0 && (this.processTheDirtyData(), 
                this.sort(this.comparator)), this.updatePageIndex()), this.trigger("push", a);
            },
            processSameData: function() {
                var a = 0, b = this, c = b.length;
                b.each(function(d) {
                    var e = 100, f = parseFloat(d.get("pageNumber"));
                    if (f !== a) a = f; else for (var g = 0; c > g; g++) b[g].set({
                        pageNumber: f + e + ""
                    }), e += 100;
                });
            },
            processTheDirtyData: function() {
                var a = this, b = a.length;
                this.owner.page_groups.each(function(c) {
                    for (var d, e = 0, f = 0, g = 0, h = 1, i = 0; b > i; i++) {
                        var j = a[i].get("pageGroup");
                        if (j && (j.client_uuid === c.get("client_uuid") ? (e--, 0 !== g ? (a[i].set({
                            pageNumber: f + d * h + 1
                        }), h++) : f = parseFloat(a[i].get("pageNumber"))) : 0 !== f && 0 === g && (g = parseFloat(a[i].get("pageNumber")), 
                        d = (g - f) / (1 + e)), 0 >= e)) break;
                    }
                });
            },
            updatePageIndex: function() {
                var a = 1, b = {};
                this.each(function(c) {
                    var d = c.page_group;
                    if (d) if (b[d.sequence]) {
                        var e = b[d.sequence] + 1;
                        b[d.sequence] = e, c.set("pageIndex", d.pageIndex + "-" + e);
                    } else b[d.sequence] = 1, d.set("pageIndex", a), c.set("pageIndex", a + "-1"), a++; else c.set("pageIndex", a), 
                    a++;
                });
            }
        }
    });
}), Moxtra.define(function(a) {
    a.filter = {
        isUnavailableBoard: function(b) {
            return b.status !== a.const.BOARD_MEMBER ? !0 : b.board && (b.board.isnote || b.board.islive) ? !0 : a.api.filter.isTimelineData(b) ? !1 : !0;
        },
        canReadBoards: function(b) {
            return a.filter.isUnavailableBoard(b) ? !1 : !0;
        },
        canReadAndWriteBoards: function(b) {
            if (a.filter.isUnavailableBoard(b)) return !1;
            var c = a.const;
            return b.type === c.BOARD_READ_WRITE || b.type === c.BOARD_OWNER ? !0 : !1;
        }
    };
}), function(a) {
    var b, c = function() {}, d = a.MX;
    Moxtra.define(function(a, c) {
        b = c;
    });
    var e = {
        fnBlank: c,
        CONSTS: {
            DEFAULTNS: "MX",
            ID_PREFIX: "uid",
            ISNSREAD: "__ns_read__",
            ISNSUPDATE: "__ns_update__",
            COOKIE_KEYS: "c_user,sessionid,token",
            LOG_LEVEL_ALL: "event_level_all",
            LOG_LEVEL_INFO: "event_level_info",
            LOG_LEVEL_WARN: "event_level_warn",
            LOG_LEVEL_ERROR: "event_level_error",
            RESPONSE_SUCCESS: "RESPONSE_SUCCESS",
            AJAX_TIMEOUT: "AJAX_TIMEOUT",
            UIDEV: "__mx_ui_dev"
        },
        REGS: {
            NS: /^[a-z_\$](?:[0-9a-z_\-\$]*)(\.[0-9a-z_\-\$](?:[0-9a-z_\-\$]*))*$/i,
            SLASHTONS: /\//g,
            ORIGIN: /^([a-z]+:\/\/[a-z0-9\-_\.]+(?::[\d]+)?).*$/i,
            COOKIES: /^([^=]+)=(.*)$/,
            EVENTPATH: /^[^:]+:/,
            APICMD: /^(?:([a-z0-9\-\_\$]+):)?(?:[0-9a-z_\-\$]+)(?:\.[0-9a-z_\-\$](?:[0-9a-z_\-\$]*))*$/i,
            APICMD_TRIM: /^[^:]+:(.*)$/,
            APICMD_MOD: /^\/([^\/\?\#]+).*$/,
            APICMD_METHODS: /GET|POST|PUT|DELETE|PATCH/i,
            API_CATEGORY: /^.*categories$/,
            API_CATEGORY_MGR: /^.*categories\/(\d+)$/,
            API_BOARD: /^.*board\/(\w+)$/,
            API_BOARDLIST: /^.*board$/,
            API_BOARD_INVITE: /^.*\/([^\/]+)\/inviteuser$/,
            API_BOARD_REMOVEUSER: /^.*\/([^\/]+)\/removeuser$/,
            API_PAGE_UPLOAD: /^.*\/([^\/]+)\/pageupload$/,
            API_PAGE_MGR: /^.*\/([^\/]+)\/(\d+)$/,
            UI_NS: /^([^:]+)(?::(.*))$/,
            FILTER: /^(!?)([a-z\.0-9-_]+)([=!><]*)(.*)$/i,
            STRING: /^(['"]).+\1$/,
            LANGNAME: /^langs\.([a-z]{2}-[A-Z]{2}).*$/,
            URL_FILENAME: /^[^\?#&]*(?:\/|^)([^\/\?#&]*)(?:[\?#&].*)?$/,
            DATA_PATH_FEED_PAGES: /^((.*feeds)\.(\d+))\.board\.pages\.\d.*$/,
            DATA_PATH_FEED_COMMENTS: /^((.*feeds)\.(\d+))\.board\.comments\.\d.*$/,
            DATA_PATH_FEED_USER: /^.*feeds\.\d+\.board\.users\.\d+.is_deleted$/
        },
        DATA: {
            stores: {},
            storeStack: []
        },
        defaultConfigs: {
            ajax: {
                timeout: 6e4,
                cache: !1,
                method: "POST",
                async: !0,
                data: void 0,
                dataType: "application/json",
                responseType: "application/json",
                headers: void 0,
                success: c,
                error: c,
                complete: c,
                process: c,
                stream: c
            },
            storage: "session",
            storagePrefix: "mxsdk:"
        },
        genUUID: function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
                var b = 16 * Math.random() | 0, c = "x" == a ? b : 3 & b | 8;
                return c.toString(16);
            });
        },
        release: function(a, b, c) {
            var d;
            if (1 === arguments.length ? (b = a, a = {}) : 2 === arguments.length && "string" == typeof b && (c = b, 
            b = a, a = {}), a = a || {}, e.isObject(a) && e.isObject(b)) for (d in b) void 0 !== d && e.isFunction(b[d]) && ((!c || "string" != typeof c) && 0 !== d.indexOf("_") || c && "string" == typeof c && ("," + c + ",").indexOf("," + d + ",") > -1) ? a[d] = function(a) {
                return function() {
                    return a.apply(b, arguments);
                };
            }(b[d]) : void 0 !== d && e.isObject(b[d]) && (a[d] = b[d]);
            return a;
        },
        isArray: function(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
        },
        isObject: function(a) {
            return "[object Object]" === Object.prototype.toString.call(a);
        },
        isFunction: function(a) {
            return "[object Function]" === Object.prototype.toString.call(a);
        },
        isRegExp: function(a) {
            return "[object RegExp]" === Object.prototype.toString.call(a);
        },
        isString: function(a) {
            return "[object String]" === Object.prototype.toString.call(a);
        },
        ns: function(b, c, d, f) {
            var g, h, i, j = 0;
            if ("string" == typeof b && e.REGS.NS.test(b)) f = d, d = c, c = b, b = a; else if (!e.REGS.NS.test(c) || !b) return b;
            for (d === e.CONSTS.ISNSREAD ? h = !0 : f === e.CONSTS.ISNSUPDATE && (i = !0), g = c.split("."); g[j]; ) {
                if (h) {
                    if (null === b[g[j]] || b[g[j]] !== b[g[j]] || void 0 === b[g[j]]) return b[g[j]];
                    if (!g[j + 1]) return b[g[j]];
                    b = b[g[j]];
                } else if (null !== b[g[j]] && b[g[j]] === b[g[j]] && void 0 !== b[g[j]]) {
                    if (!g[j + 1]) return b[g[j]] = i ? d : b[g[j]], b = b[g[j]];
                    b = b[g[j]];
                } else {
                    if (!g[j + 1]) return b[g[j]] = void 0 !== d ? d : {}, b = b[g[j]];
                    if (b[g[j]] = {}, b = b[g[j]], !b) return b;
                }
                j++;
            }
        },
        extend: function(a) {
            var b, c, d, f;
            return arguments.length && arguments[0] ? (b = 1 === arguments.length ? e : a, c = Array.prototype.slice.call(arguments, 1 === arguments.length ? 0 : 1), 
            f = function(a) {
                if (e.isObject(a) || e.isArray(a)) for (d in a) null == b[d] && null != a[d] && (b[d] = a[d]);
            }, c.forEach(f), b) : arguments[0] || void 0;
        },
        copy: function(a, b) {
            var c, d, f = e.isArray(a), g = e.isObject(a);
            if (c = f && [] || g && {} || void 0) for (d in a) !e.isObject(a[d]) && !e.isArray(a[d]) || b && b.skipedNodes && b.skipedNodes.length && ("," + b.skipedNodes.join(",") + ",").indexOf("," + d + ",") > -1 ? c[d] = a[d] : void 0 !== a[d] && (c[d] = e.copy(a[d]));
            return c || a;
        },
        _getOrigin: function(b) {
            var c;
            return e.REGS.ORIGIN.test(b) || (b = a.location.href), c = b.match(e.REGS.ORIGIN), 
            c && c[1] || "";
        },
        getCookie: function(b) {
            var b, c, d, f, g, h = {}, i = 0;
            if (b || (b = e.CONSTS.COOKIE_KEYS, g = {}), a.document.cookie) {
                for (c = a.document.cookie.split("; "); c[i]; ) d = c[i].match(e.REGS.COOKIES), 
                d && (h[d[1]] = d[2]), i++;
                for (f = b.split(","), i = 0; f[i]; ) {
                    if (!g) {
                        g = h[f[i]];
                        break;
                    }
                    g[f[i]] = h[f[i]], i++;
                }
            }
            var j = JSON.parse(sessionStorage.getItem("mxsdk:auth")) || {};
            return g.c_user = g.c_user || j.c_user, g;
        },
        deleteCookie: function(b, c) {
            var d;
            b += "", c = c || {}, b && (d = new Date(), d.setDate(d.getDate() - 1), d = d.toUTCString(), 
            a.document.cookie = [ b, "=; expires=", d, "; path=", c.path || "/", "; domain=", c.domain || "" ].join(""));
        },
        _CORSSupported: function() {
            var a = new XMLHttpRequest();
            return void 0 !== a.withCredentials;
        },
        _enableJSON: function() {
            if (!a.JSON) {
                var b = a.document.createElement("meta");
                b.setAttribute("http-equiv", "X-UA-Compatible"), b.setAttribute("content", "IE=edge"), 
                (a.document.getElementsByTagName("head")[0] || a.document.documentElement).appendChild(b);
            }
            return a.JSON || !1;
        },
        _preFormatter: function(a) {
            return a;
        },
        ajax: function(c) {
            var d, g, h, i, j, k, l, m, n, o, p, q, r, s = !1;
            if (c && c.url) {
                if (c = e.extend({}, c, e.defaultConfigs.ajax), d = e._getOrigin() !== e._getOrigin(c.url), 
                p = e.getCookie(), o = e.ns(f, "data.cred.authResponse", e.CONSTS.ISNSREAD), (r = b.storage("integration").get("access_token")) && (c.url = b.makeUrl(c.url, {
                    access_token: r
                })), c.url = b.makeUrl(c.url, {
                    sessionid: Moxtra.getMe().sessionId || b.storage("client").get("sessionid")
                }), !d || e._CORSSupported()) {
                    if (c.data && c.data.files && ("[object FileList]" === Object.prototype.toString.call(c.data.files) || "[object Array]" === Object.prototype.toString.call(c.data.files))) {
                        for (m = c.data.files, c.data.files = void 0, n = JSON.stringify(c.data), n = "{}" === n ? void 0 : n, 
                        c.data = new FormData(), h = 0, i = m.length; i > h; h++) m[h] && c.data.append("file" + (h ? "_" + h : ""), m[h]);
                        n && c.data.append("jsonrequest", n), c.dataType = "", l = c.data;
                    } else e.isObject(c.data) || e.isArray(c.data) ? l = JSON.stringify(c.data) : "[object File]" === Object.prototype.toString.call(c.data) ? c.dataType = "application/octet-stream" : "string" != typeof c.data || c.dataType && "text/" !== c.dataType.slice(0, 5) || (l = c.data);
                    if (g = new XMLHttpRequest(), g.open(c.method, c.url, c.async), c.headers) for (j in c.headers) "Content-Type" === j ? c.dataType = c.headers[j] : j && g.setRequestHeader(j, c.headers[j]);
                    return c.dataType && g.setRequestHeader("Content-Type", c.dataType), g.onreadystatechange = function() {
                        if (g.overrideMimeType && !s && c.responseType && c.responseType !== g.getResponseHeader("Content-Type") && g.readyState !== (g.LOADING || 3) && g.readyState !== (g.DONE || 4) && (g.overrideMimeType(c.responseType), 
                        s = !0), g.readyState === (g.DONE || 4)) {
                            if (q && a.clearTimeout(q), g.response && "string" != typeof g.response) k = g.response || g.responseText; else switch (c.responseType = c.responseType || g.getResponseHeader("Content-Type"), 
                            c.responseType && c.responseType.toLowerCase()) {
                              case "application/json":
                              case "text/json":
                              case "json":
                                try {
                                    k = JSON.parse(g.responseText) || g.responseText;
                                } catch (b) {
                                    k = "";
                                }
                                break;

                              case "text/xml":
                              case "application/xml":
                                k = g.responseXML || g.responseText;
                                break;

                              default:
                                k = g.responseText;
                            }
                            k = e._preFormatter(k, null, null, k.type), c.complete(k, g);
                            try {
                                if (g.status >= 200 && g.status < 300) c.success(k, g); else {
                                    if (k = g.response || g.responseText, k && "string" == typeof k) try {
                                        k = JSON.parse(k);
                                    } catch (b) {}
                                    k = c.timeout && !q && e.CONSTS.AJAX_TIMEOUT || k, c.error(k, g);
                                }
                            } catch (d) {
                                console.error(d);
                            }
                        } else g.readyState === (g.LOADING || 3) && 200 == g.status && c.stream();
                    }, g.onprogress = c.progress, g.send(l || null), c.timeout && g.abort && (q = a.setTimeout(function() {
                        g.abort(), q = void 0;
                    }, c.timeout)), g;
                }
                a.XDomainRequest && (g = new XDomainRequest(), g.timeout = c.timeout, g.onprogress = function() {
                    c.progress();
                }, g.ontimeout = function() {
                    c.error();
                }, g.onerror = function() {
                    c.error();
                }, g.onload = function() {
                    switch (c.responseType && c.responseType.toLowerCase()) {
                      case "application/json":
                      case "text/json":
                      case "json":
                        try {
                            k = JSON.parse(g.responseText) || g.responseText;
                        } catch (a) {
                            k = g.responseText;
                        }
                        break;

                      case "text/xml":
                      case "application/xml":
                        k = g.responseXML || g.responseText;
                        break;

                      default:
                        k = g.responseText;
                    }
                    c.success(k);
                }, c.method = (c.method + "").toUpperCase(), "GET" !== c.method && "POST" !== c.method && (c.url += (c.url.indexOf("?") > -1 && "&" || "") + "_method=" + c.method, 
                c.method = "POST"), c.dataType && (c.url += (c.url.indexOf("?") > -1 && "&" || "") + "_contentType=" + encodeURIComponent(c.dataType)), 
                c.cache || (c.url += (c.url.indexOf("?") > -1 && "&" || "") + "r=" + Math.random()), 
                g.open(c.method, c.url), g.send("xxx=xxx"));
            }
        },
        _storeStack: function(b, c, d) {
            var f, g, h, i, j, k, l, m, n = e.defaultConfigs.storagePrefix + "/users/me";
            if (n !== c) if ("timer" === b && c) {
                for (f = 0, g = e.DATA.storeStack.length; g > f; f++) if (e.DATA.storeStack[f] && e.DATA.storeStack[f].key === c) {
                    e.DATA.storeStack[f].time = new Date(), e.DATA.storeStack[f].size = d || e.DATA.storeStack[f].size || 0, 
                    j = !0;
                    break;
                }
                j || c === n || e.DATA.storeStack.push({
                    key: c,
                    time: new Date(),
                    size: d || 0
                });
            } else if ("set" === b && c && void 0 !== d && null !== d && d === d) {
                l = d.length;
                try {
                    return a[e.defaultConfigs.storage + "Storage"].setItem(c, d), e._storeStack("timer", c, l), 
                    d;
                } catch (o) {
                    console && console.error(o), k = m = 0, i = a[e.defaultConfigs.storage + "Storage"];
                    for (h in i) h !== n && h.indexOf(e.defaultConfigs.storagePrefix) > -1 && (j = !1, 
                    e.DATA.storeStack.forEach(function(a) {
                        a && a.key === h && (j = !0);
                    }), j || e.DATA.storeStack.push({
                        key: h,
                        time: -1,
                        size: a[e.defaultConfigs.storage + "Storage"].getItem(h).length
                    }));
                    for (e.DATA.storeStack.length && e.DATA.storeStack.sort(function(a, b) {
                        return a.time > b.time ? 1 : a.time < b.time ? -1 : 0;
                    }), f = 0, g = e.DATA.storeStack.length; g > f; f++) if (e.DATA.storeStack[f] && e.DATA.storeStack[f].size && (k += e.DATA.storeStack[f].size, 
                    k >= l)) {
                        m = f + 1;
                        break;
                    }
                    if (m && g - m > -1) {
                        for (f = 0, g = m; g > f; f++) e.DATA.storeStack[f] && e.DATA.storeStack[f].key && (a[e.defaultConfigs.storage + "Storage"].removeItem(e.DATA.storeStack[0].key), 
                        e.DATA.storeStack.splice(f, 1), f--, g--);
                        try {
                            return a[e.defaultConfigs.storage + "Storage"].setItem(c, d), e._storeStack("timer", c, l), 
                            console && console.log("Storage fulled, and cleaned out some old data to save it."), 
                            d;
                        } catch (p) {
                            return d;
                        }
                    } else console && console.log("Storage fulled, but cannot clean out old data, so not persist it.");
                }
            }
        },
        store: function(b) {
            var c, d, f, g;
            if (b && (b.key || b.clean)) {
                if (b.hasOwnProperty("value")) {
                    if (f = e.defaultConfigs.storagePrefix + b.key, g = b.value, e.isArray(g) || e.isObject(g)) {
                        if (this.DATA.stores[f] = g, b.io !== !1) {
                            try {
                                g = JSON.stringify(g);
                            } catch (h) {
                                g += "";
                            }
                            e._storeStack("set", f, g);
                        }
                        return b.value;
                    }
                    return void 0 !== g && null !== g && g === g ? (this.DATA.stores[f] = JSON.parse(g), 
                    g += "", b.io !== !1 && e._storeStack("set", f, g), b.value) : (delete this.DATA.stores[f], 
                    a[e.defaultConfigs.storage + "Storage"].removeItem(f));
                }
                if (!b.clean) {
                    if (f = e.defaultConfigs.storagePrefix + b.key, this.DATA.stores[f] || "/users/me" === b.key) g = this.DATA.stores[f]; else if (g = a[e.defaultConfigs.storage + "Storage"].getItem(f), 
                    "string" == typeof g) {
                        this._storeStack("timer", f, g.length);
                        try {
                            g = JSON.parse(g), this.DATA.stores[f] = g;
                        } catch (h) {
                            console && console.error(h);
                        }
                    }
                    return g;
                }
                e.DATA.stores = {}, e.DATA.storeStack = [], d = a[e.defaultConfigs.storage + "Storage"];
                for (c in d) a[e.defaultConfigs.storage + "Storage"].removeItem(c);
            }
        },
        define: function(a, b) {
            a && "string" == typeof a ? b = b || a : (b = a, a = "Cons");
            var c = function(a) {
                var b;
                return this.config = e.extend({}, a, this.defaultConfig), b = this._autoInit(), 
                b ? b : void 0;
            };
            return c.prototype = e.extend({}, b, {
                defaultConfig: e.extend({}, b && b.defaultConfig || {}, {
                    name: a,
                    instanceId: void 0
                }),
                extend: function() {
                    Array.prototype.unshift.call(arguments, this), e.extend.apply(e, arguments);
                },
                _autoInit: function() {}
            }), c.extend = function() {
                Array.prototype.unshift.call(arguments, c.prototype), e.extend.apply(e, arguments);
            }, c;
        }
    };
    e.Model = e.define("Model", {
        defaultConfig: {
            localFirst: !0
        },
        proto: void 0,
        data: void 0,
        _autoInit: function() {
            this.extend({
                proto: this.config.context.protos[this.config.name]
            }), this.proto && this.proto.extend && this.extend(this.proto.extend), this.data = {
                meta: {},
                clean: {},
                subscriber: {
                    urls: {}
                }
            }, this.log = a.MX && d.logger("SDK:" + this.config.name) || new e.Log({
                name: "SDK:" + this.config.name
            });
        },
        api: function(b, c, d, f, g) {
            var h, i, j, k, l, m = this, n = arguments;
            d = d || {}, c = c || "GET";
            var o = this.proto[c].dataFormatter || this.proto.dataFormatter || this.config.context.protos.main.dataFormatter;
            if (h = o.call(this, this.proto.name, b, c, this.proto[c].mxType, d && d.data, arguments), 
            !h) return !1;
            var p, q = b.match(/^\/binders\/([^\/]+)/);
            if (q && "GET" !== c && (p = q[1])) {
                var r = JSON.parse(localStorage.getItem("mx:SilentMessage"));
                r && r[p] === !0 && (h.data.params = h.data.params || [], h.data.params && h.data.params.push({
                    name: "BOARD_REQUEST_PUSH_NOTIFICATION_OFF"
                }));
            }
            return d && d.view_token && (h.data = h.data || {}, h.data.params = h.data.params || [], 
            h.data.type && (h.data.type = h.data.type.replace("_READ", "_VIEW")), h.localStore = "disabled", 
            h.data.params.push({
                name: "BOARD_REQUEST_VIEW_TOKEN",
                string_value: d.view_token
            })), k = d.hasOwnProperty("localFirst") ? d.localFirst : h && h.hasOwnProperty("localFirst") ? h.localFirst : this.proto[c].hasOwnProperty("localFirst") ? this.proto[c].localFirst : this.proto.hasOwnProperty("localFirst") ? this.proto.localFirst : this.config.localFirst, 
            l = d.hasOwnProperty("localStore") ? d.localStore : h && h.hasOwnProperty("localStore") ? h.localStore : this.proto[c].hasOwnProperty("localStore") ? this.proto[c].localStore : this.proto.hasOwnProperty("localStore") ? this.proto.localStore : this.config.localStore, 
            d.localStore = l, d.localFirst = k, "GET" === c && k && "disabled" !== l && (j = !(d && d.verify === !0) && m._store(b, null, null, d)) ? (j = m._outputFormatter(m.proto.name, b, c, m.proto[c].mxType, j, d, h, !1, !0), 
            i = m._formatter(m.proto.name, b, c, m.proto[c].mxType, j, d), i = m._filter({
                data: i,
                params: d,
                method: c,
                metaData: j
            }), i = m._sort(i, d && d.sortNS || this.proto[c].sortNS || this.proto.sortNS, d && d.sort || this.proto[c].sort || this.proto.sort, c), 
            i.isFullData = !0, i && e.isFunction(f) && f.call(g || a, i, j), void m.log.info("Got data from local:", b, c, i)) : void e.ajax(e.extend(h, {
                url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                dataType: "application/json",
                method: this.proto[c].method || "POST",
                success: function(j) {
                    h && h.data && "USER_REQUEST_LOGIN" === h.data.type && Moxtra && Moxtra.parseData(j, !0), 
                    (!("/binders" === b && "POST" === c && j && "BOARD_REQUEST_CREATE" === j.type && j.object && j.object.board) || j.object.board.islive || h && h.direct_chat) && (j = m._outputFormatter(m.proto.name, b, c, m.proto[c].mxType, j, d, h, !0, !0), 
                    i = m._formatter(m.proto.name, b, c, m.proto[c].mxType, j, d, h), i = m._filter({
                        data: i,
                        params: d,
                        method: c,
                        metaData: j
                    }), (!h || h.localFirst !== !1) && (i = m._sort(i, d && d.sortNS, d && d.sort, c)), 
                    "GET" === c && !(d && d.verify === !0 && "disabled" !== h.localStore) && m._store(b, c, j, d), 
                    i.isFullData = !0, i && e.isFunction(f) && f.call(g || a, i, j), m.log.info("Got data from ajax:", b, c, i, n));
                },
                error: function(b, c) {
                    e.isFunction(f) && f.call(g || a, e.extend(b, {
                        xhr: c
                    })), m.log.error("Got data failed from ajax.", b && b.message, n);
                }
            }));
        },
        _sort: function(a, b, c, d) {
            var g, h = e.isFunction(c) ? c : this.proto[d].resultSorter || this.proto.resultSorter || f.models.main.proto.resultSorter;
            return b = b || this.proto[d] && this.proto[d].sortNS || this.proto.sortNS || f.models.main.proto.sortNS || "", 
            c = c || this.proto[d] && this.proto[d].sorter || this.proto.sorter || f.models.main.proto.sorter || "", 
            g = b ? e.ns(a && a.data, b, e.CONSTS.ISNSREAD) : a && a.data, h && a && e.isArray(g) && g.sort(function(a, b) {
                return h.call(this, a, b, c);
            }), a;
        },
        _filter: function(a) {
            var b, c, d, g, h, i, j, k, l = a.method;
            if (k = a.params && a.params.resultNS || this.proto[l] && this.proto[l].resultNS || this.proto.resultNS || f.models.main.proto.resultNS || "", 
            c = a.params && a.params.filterNS || this.proto[l] && this.proto[l].filterNS || this.proto.filterNS || f.models.main.proto.filterNS || "", 
            b = a.params && a.params.filter || this.proto[l] && this.proto[l].filter || this.proto.filter || f.models.main.proto.filter || "", 
            g = e.isFunction(b) ? b : this.proto[l] && this.proto[l].resultFilter || this.proto.resultFilter || f.models.main.proto.resultFilter, 
            !b || !a.metaData) return a.data;
            if (j = a.data.data || a.data, e.isArray(j)) {
                for (j = [].concat(j), h = 0, i = j.length; i > h; h++) d = b === g ? void 0 : void 0 !== b ? b : this.proto[l].defaultFilter, 
                j[h] && !g.call(this, j[h], d) && (j.splice(h, 1), h--, i--);
                a.data.data ? a.data.data = j : a.data = j;
            }
            return a.data;
        },
        _storeFormatter: function(a) {
            return a && e.isFunction(f.models.main.proto.storeFormatter) ? (delete a.isFullData, 
            delete a.isFromServer, f.models.main.proto.storeFormatter(a) || a) : a;
        },
        _outputFormatter: function(a, b, c, d, g, h, i, j, k, l) {
            var m;
            return e.isFunction(f.models.main.proto.outputFormatter) ? e.isString(g) ? g : (g = e.copy(g), 
            g.isFromServer = !!j, g.isFullData = !!k, m = f.models.main.proto.outputFormatter(g, l), 
            m && delete m.isFromServer, m || g) : g;
        },
        _formatter: function(a, b, c, d, f, g, h) {
            var i = this.proto[c].resultFormatter || this.proto.resultFormatter || this.config.context.protos.main.resultFormatter;
            return f = e.copy(f, {
                skipedNodes: [ "boards" ]
            }), i.call(this, a, b, c, this.proto[c].mxType, f, g, h);
        },
        _store: function(a, b, c, d) {
            var f, g;
            if (c && d && "disabled" === d.localStore) return c;
            if (c || !d || d.localFirst && "disabled" !== d.localStore) return b = b || "GET", 
            f = "/users/me" === a ? "/users/me" : this.proto[b].localStore || this.proto.localStore || a, 
            f && (f = f.split("../"), f = f.length - 1 && a.replace(new RegExp("(/[^/]+){" + (f.length - 1) + "}$", ""), "")), 
            a = f || this.proto[b].localStore || a, c ? "GET" === b ? (this._storeFormatter(c), 
            e.store({
                key: a,
                value: c,
                io: -1 === a.indexOf("/binders/")
            }), c) : (g = this._merge(e.store({
                key: a
            }), c, d), this._storeFormatter(g), e.store({
                key: a,
                value: g,
                io: -1 === a.indexOf("/binders/")
            }), g) : e.store({
                key: a
            });
        },
        _merge: function(a, b, c, d) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r = "users" !== this.proto.name ? this.proto.name : "user", s = e.isArray(a), t = e.isObject(a), u = e.isArray(b), v = e.isObject(b), w = c && c.skipedMerge || "user.boards.0.board.users,user.boards.0.board.feeds,user.boards.0.board.pages,user.boards.0.board.comments,user.boards.0.board.resources", x = c && c.cleanAttrs || "isconversation";
            if (w = w && w.split(","), d = d || "", c && 1 * c.revision === 0) return b;
            if (arguments.length < 2) return a;
            if (!u && !v && void 0 !== b) return b;
            if (s || t || (u ? (a = [], s = !0) : v && (a = {}, t = !0)), s && u) for (f = 0, 
            g = b.length; g > f; f++) {
                if (l = b[f] && (b[f].sequence || b[f][r] && (b[f][r].id || b[f][r].sequence) || b[f].id) || void 0, 
                m = !1, l) for (i = 0, j = a.length; j > i; i++) if (k = a[i] && (a[i].sequence || a[i][r] && (a[i][r].id || a[i][r].sequence) || a[i].id) || void 0, 
                b[f] === a[i]) m = !0; else if (l === k) {
                    m = !0, n = !1, n ? (a[i].boardId && e.store({
                        key: "/binders/" + a[i].boardId,
                        value: null
                    }), a.splice(i, 1), i--, j--) : this._merge(a[i], b[f], c, (d && d + "." || "") + "0");
                    break;
                }
                m || void 0 === b[f] || "object.board.users" != d && (b[f][r] && b[f][r].is_deleted || b[f].is_deleted) || a.push(b[f]);
            } else {
                if (!t || !v) return b;
                for (h in b) p = !0, q = (d && d + "." || "") + h, q && w && w.every(function(a) {
                    return a && q.slice(-a.length) === a ? (p = !1, !1) : !0;
                }), e.isArray(b[h]) && p || e.isObject(b[h]) ? a[h] = this._merge(a[h], b[h], c, q) : void 0 !== b[h] && "isnote" !== h && (a[h] = b[h]);
                if (x) for (o = x.split(","), f = 0, g = o.length; g > f; f++) o[f] && !a.hasOwnProperty(o[f]) && delete b[o[f]];
            }
            return a;
        },
        _setOrderNumber: function(a) {
            var b, c, d = this, e = [];
            a && a.object && a.object.user && a.object.user.boards && a.object.user.boards.length && (a.object.user.boards.forEach(function(a) {
                !a || a.is_deleted || a.order_number && parseFloat(a.order_number) || !a.board || a.board.islive || e.push(a);
            }), e.length && f.api("/binders", "GET", {
                localFirst: !0,
                sort: function(a, b) {
                    var c = 1 * a.order_number || 1 * a.sequence, d = 1 * b.order_number || 1 * b.sequence;
                    return c === d ? 0 : c > d ? 1 : -1;
                }
            }, function(a) {
                b = a && a.data, c = b && b[0] && (1 * b[0].order_number || 1 * b[0].sequence) || 0, 
                e.forEach(function(a) {
                    c -= 100, d.log.info("Need set order number for", a), f.api("/binders/" + a.sequence, "PUT", {
                        data: {
                            order_number: c + ""
                        }
                    });
                });
            }));
        },
        _simpleSubscribe: function(b, c, d, f, g) {
            if (this.data.subscriber.urls[b]) {
                var h = c.data && "BOARD_REQUEST_SUBSCRIBE" === c.data.type && c.data.action;
                -2 !== d || h ? (!this.data.subscriber.urls[b].active && !this.data.subscriber.urls[b].paused || h) && (a.clearTimeout(this.data.subscriber.urls[b].retry), 
                this.data.subscriber.urls[b].retry = void 0, this.data.subscriber.urls[b].active = f, 
                this.data.subscriber.urls[b].preRevision = c.data.object[g].revision || 0, this.data.subscriber.urls[b].xhr = e.ajax(c)) : (this.data.subscriber.urls[b].retry = void 0, 
                c && e.isFunction(c.error) && c.error({
                    message: "Notloggedin"
                }, {
                    status: 400
                }));
            }
        },
        _stopSubscribe: function(b, c, d) {
            var f, g, h, i, j;
            if (h = c && e.isFunction(c), i = d && e.isObject(d), this.data.subscriber.urls[b]) {
                for (f = 0, g = this.data.subscriber.urls[b].subs.length; g > f; f++) j = !1, h ? c === (this.data.subscriber.urls[b].subs[f] && this.data.subscriber.urls[b].subs[f][0]) ? (j = !0, 
                i && d !== this.data.subscriber.urls[b].subs[f][1] && (j = !1)) : j = !1 : j = !0, 
                j && (this.data.subscriber.urls[b].subs.splice(f, 1), f--, g--, this.log.info("Unsubscribed: from " + b, arguments));
                !this.data.subscriber.urls[b].subs.length && this.data.subscriber.urls[b].xhr && this.data.subscriber.urls[b].xhr.abort && (this.data.subscriber.urls[b].aborting = !0, 
                this.data.subscriber.urls[b].paused = void 0, this.data.subscriber.urls[b].active = void 0, 
                this.data.subscriber.urls[b].retry && (a.clearTimeout(this.data.subscriber.urls[b].retry), 
                this.data.subscriber.urls[b].retry = void 0), this.data.subscriber.urls[b].xhr.abort(), 
                delete this.data.subscriber.urls[b], this.log.info("Purged subscriber: from " + b, arguments));
            }
        },
        _cleanSubscribe: function() {
            var b;
            for (b in this.data.subscriber.urls) if (this.data.subscriber.urls[b] && this.data.subscriber.urls[b].xhr) try {
                a.clearTimeout(this.data.subscriber.urls[b].retry), this.data.subscriber.urls[b].aborting = !0, 
                this.data.subscriber.urls[b].paused = void 0, this.data.subscriber.urls[b].active = void 0, 
                this.data.subscriber.urls[b].retry = void 0, this.data.subscriber.urls[b].xhr.abort();
            } catch (c) {
                this.log.error("stop all subscribe failed", c);
            }
            this.data.subscriber.urls = {}, this.log.info("cleaned all subscribes");
        },
        _pauseAllSubscribe: function() {
            var a, b;
            if (e.isObject(this.data && this.data.subscriber && this.data.subscriber.urls)) for (a in this.data.subscriber.urls) b = this.data.subscriber.urls[a], 
            b && b.xhr && b.xhr.abort && (b.aborting = !0, b.paused = !0, b.active = !0, b.xhr.abort());
            this.log.info("paused all subscribes");
        },
        _resumeAllSubscribe: function() {
            var a, b;
            if (e.isObject(this.data && this.data.subscriber && this.data.subscriber.urls)) {
                for (a in this.data.subscriber.urls) b = this.data.subscriber.urls[a], b.aborting = !1, 
                b.paused = !1, b.active = void 0;
                this.log.info("resumed all subscribes");
            }
        },
        subscribe: function(b, c, d, g) {
            if ("/binders/undefined" !== b) {
                var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C = this, D = "SUBSCRIBE";
                if (b && b.pause === !0) return void this._pauseAllSubscribe();
                if (b && b.pause === !1) return void this._resumeAllSubscribe();
                if (b && b.clean === !0 && e.isObject(this.data && this.data.subscriber && this.data.subscriber.urls)) return void this._cleanSubscribe();
                if (c && (c.hasOwnProperty("stop") || c.hasOwnProperty("pause"))) ; else if (!e.isFunction(d)) return void this.log.error("callback function is required, but cb is", d);
                if (y = this.proto[D].dataFormatter || this.proto.dataFormatter || this.config.context.protos.main.dataFormatter, 
                h = y.call(this, this.proto.name, b, D, this.proto[D].mxType, c && c.data, arguments), 
                !h) return void this.log.error("No subscribe request data found", arguments);
                if (this.proto.urlExp.test(b) ? (i = b.match(this.proto.urlExp)[1], j = c && c.stop || !1, 
                k = c && "boolean" == typeof c.pause ? c.pause : !1) : 1 === arguments.length && (i = b, 
                "string" == typeof i ? j = !1 : i !== !0 ? j = !1 : (j = !0, i = void 0)), "/users/me" === b && (i = e.ns(f, "data.cred.authResponse.c_user", e.CONSTS.ISNSREAD) || e.ns(f, "data.cred.cookie.c_user", e.CONSTS.ISNSREAD)), 
                !i) return void this.log.error("Subscribe failed. No model id provided", arguments);
                if (!this.proto.subscribe) return void this.log.warn('The Model "' + this.config.name + '" not support subscribing.');
                if (this.data.subscriber.urls && this.data.subscriber.urls[b] && this.data.subscriber.urls[b].subs && this.data.subscriber.urls[b].subs.length) {
                    if (k) return void (this.data.subscriber.urls[b].subs.length && this.data.subscriber.urls[b].xhr && this.data.subscriber.urls[b].xhr.abort && (this.data.subscriber.urls[b].aborting = !0, 
                    this.data.subscriber.urls[b].retry && (a.clearTimeout(this.data.subscriber.urls[b].retry), 
                    this.data.subscriber.urls[b].retry = void 0), this.data.subscriber.urls[b].xhr.abort(), 
                    this.data.subscriber.urls[b].paused = !0, this.data.subscriber.urls[b].active = void 0, 
                    this.log.info("Subscribe Paused:", b)));
                    if (c && c.hasOwnProperty("pause")) c.hasOwnProperty("pause") && (this.data.subscriber.urls[b].aborting = !1, 
                    this.data.subscriber.urls[b].paused = !1); else {
                        for (n = 0, o = this.data.subscriber.urls[b].subs.length; o > n; n++) !this.data.subscriber.urls[b].subs[n] || this.data.subscriber.urls[b].subs[n][0] !== d || this.data.subscriber.urls[b].subs[n][1] !== g || (this.data.subscriber.urls[b].subs[n][2] && this.data.subscriber.urls[b].subs[n][2].subject || c && c.subject) && !(this.data.subscriber.urls[b].subs[n][2] && this.data.subscriber.urls[b].subs[n][2].subject && c && c.subject && this.data.subscriber.urls[b].subs[n][2].subject === c.subject) || j || (this.log.warn("Already subscribed:", b), 
                        this.data.subscriber.urls[b].subs[n][2] = c);
                        if (j) return void this._stopSubscribe(b, d, g);
                    }
                } else if (k || j) return void this.log.warn("Not subscribed: " + b, arguments);
                if (this.data.subscriber.urls = this.data.subscriber.urls || {}, this.data.subscriber.urls[b] = this.data.subscriber.urls[b] || {}, 
                this.data.subscriber.urls[b].subs = this.data.subscriber.urls[b].subs || [], this.data.subscriber.urls[b].paused = !1, 
                e.isFunction(d)) {
                    this.data.subscriber.urls[b].subs.push([ d, g, c ]);
                    for (var E in this.data.subscriber.urls) "/users/me" !== E && E !== b && this._stopSubscribe(E);
                }
                l = "users" !== this.proto.name ? this.proto.name : "user", B = e.store({
                    key: b
                });
                var F = !!(c && c.data && c.data.session_key);
                if (!F && B && B.object && B.object[l] && (!c || c.localFirst !== !1)) if (u = B.object[l].revision || 0, 
                s = C._outputFormatter(l, b, D, C.proto[D].mxType, B, c, h, !1, !0), s = C._formatter(l, b, D, C.proto[D].mxType, s, c), 
                c && c.subject) {
                    if (c.subject) {
                        for (w = c.subject.split(","), r = {
                            code: s.code,
                            data: void 0,
                            message: s.message
                        }, n = 0, o = w.length; o > n; n++) x = e.ns(s.data || s, w[n], e.CONSTS.ISNSREAD) || [], 
                        w[n] && x && (r.data = x);
                        r && r.code === e.CONSTS.RESPONSE_SUCCESS && (r.isFullData = !0, r = C._filter({
                            data: r,
                            params: c,
                            method: D,
                            metaData: B
                        }), r = C._sort(r, c && c.sortNS, c && c.sort, D), r && (r.data || r.object || r.action || r.sessions || r.entry) && e.isFunction(d) && d.call(g || a, r));
                    }
                } else s.isFullData = !0, s = C._filter({
                    data: s,
                    params: c,
                    method: D,
                    metaData: B
                }), s = C._sort(s, c && c.sortNS, c && c.sort, D), s && (s.data || s.object || s.action || s.sessions) && e.isFunction(d) && d.call(g || a, s);
                if (this.data.subscriber.urls[b].active) this.log.info("Subscriber running:", b, arguments); else {
                    if (h.data.object = h.data.object || {}, h.data.object[l] = {
                        id: i,
                        revision: this.data.subscriber.urls[b].revision || u || 0
                    }, "/users/me" === b) {
                        var G = this.data.subscriber.urls[b].groupRevision || s && s.object && s.object.group && s.object.group.revision || 0;
                        h.data.object.group = {
                            revision: G
                        };
                    }
                    if (F) {
                        var H = this.data.subscriber.urls[b].actionRevision || s && s.action && s.action.revision || 0;
                        h.data.action = {
                            board_id: i,
                            session_key: c.data.session_key,
                            revision: H
                        };
                    }
                    m = e.extend(h, {
                        success: function(d) {
                            try {
                                Moxtra.parseData(e.copy(d), this);
                            } catch (g) {
                                C.log.error("parseData has error", g);
                            }
                            C.log.info("sub received from server:", d);
                            var j = C.data.subscriber.urls[b];
                            if (j.active = void 0, m.data = m.data || {}, "/users" === b || "/users/me" === b) {
                                z = C._getUserRevision(d), d.object && d.object.group && (j.groupRevision = m.data.object.group.revision = e.ns(d, "object.group.revision", e.CONSTS.ISNSREAD) || j.groupRevision || 0), 
                                d.object && d.object.user && (j.revision = m.data.object.user.revision = Math.max(z, j.revision || 0));
                                var k, n, o, s;
                                if (k = d.object && d.object.group, n = d.object && d.object.user || {}, s = f.data.cred.authResponse, 
                                k) (k.id !== s.groupId || k.name !== s.groupName || k.status !== s.groupStatus) && (k.id && (f.data.cred.authResponse.groupId = k.id), 
                                k.name && (f.data.cred.authResponse.groupName = k.name), k.status && (f.data.cred.authResponse.groupStatus = k.status), 
                                k.type ? f.data.cred.authResponse.groupAccessType = k.type : (o = k.members, o && o.length && o.every(function(a) {
                                    return a.user && a.user.id === (n.id || f.data.cred.authResponse.c_user) ? (f.data.cred.authResponse.groupAccessType = a.type, 
                                    !1) : !0;
                                })), e.store({
                                    key: "auth",
                                    value: f.data.cred.authResponse
                                })); else if (n.groups && n.groups.length) {
                                    var u = _.find(n.groups, function(a) {
                                        return "GROUP_MEMBER" === a.status;
                                    });
                                    u && u.group && (u.group.id && (f.data.cred.authResponse.groupId = u.group.id), 
                                    u.group.name && (f.data.cred.authResponse.groupName = u.group.name), u.status && (f.data.cred.authResponse.groupStatus = u.status), 
                                    u.type && (f.data.cred.authResponse.groupAccessType = u.type)), e.store({
                                        key: "auth",
                                        value: f.data.cred.authResponse
                                    });
                                }
                            } else {
                                d.object && (j.revision = m.data.object[l].revision = e.ns(d, "object.board.revision", e.CONSTS.ISNSREAD) || j.revision || 0);
                                var y, B;
                                B = c && c.data && c.data.session_key || 0, B = B || e.ns(d, "action.session_key", e.CONSTS.ISNSREAD) || 0, 
                                B = B || e.ns(d, "sessions.0.session_key", e.CONSTS.ISNSREAD) || 0, B && (j.actionRevision = y = e.ns(d, "action.revision", e.CONSTS.ISNSREAD) || j.actionRevision || 0, 
                                m.data.action = {
                                    board_id: i,
                                    session_key: B,
                                    revision: y
                                });
                            }
                            for (d = C._outputFormatter(C.proto.name, b, D, C.proto[D].mxType, d, c, h, !0, !C.data.subscriber.urls[b].preRevision, C._store(b, D, d, c)), 
                            F = 0, G = j.subs.length; G > F; F++) if (j.subs[F] && e.isFunction(j.subs[F][0])) if (-1 !== z) if (v = j.subs[F][2] || {}, 
                            r = C._formatter(C.proto.name, b, D, C.proto[D].mxType, d, v), v && v.subject) {
                                if (v && v.subject) {
                                    for (w = v.subject.split(","), t = {
                                        code: r.code,
                                        data: void 0,
                                        message: r.message
                                    }, p = 0, q = w.length; q > p; p++) x = e.ns(r.data || r, w[p], e.CONSTS.ISNSREAD) || [], 
                                    w[p] && x && (t.data = x);
                                    t.data && (t.isFullData = !j.preRevision, t = C._filter({
                                        data: t,
                                        params: v,
                                        method: D,
                                        metaData: d
                                    }), t = C._sort(t, v && v.sortNS, v && v.sort, D), (t && t.data && t.data.length || t.isFullData) && j.subs[F][0].call(j.subs[F][1] || a, t));
                                }
                            } else {
                                if (A = !1, r) for (p in r) if (p && r[p] && "code" !== p) {
                                    A = !0;
                                    break;
                                }
                                A && (r.isFullData = !j.preRevision, r = C._filter({
                                    data: r,
                                    params: v,
                                    method: D,
                                    metaData: d
                                }), r = C._sort(r, v && v.sortNS, v && v.sort, D), r && (r.data || r.object || r.action || r.sessions || r.entry) && j.subs[F][0].call(j.subs[F][1] || a, r));
                            } else -1 === z && C.data.subscriber.urls[b].subs[F][0].call(C.data.subscriber.urls[b].subs[F][1] || a, {
                                code: "USER_CHANGED"
                            });
                            if (C.log.info("sub received and formatted:", r), "/users" === b || "/users/me" === b) {
                                if (f.data.self_created_boards && f.data.self_created_boards.length) {
                                    var E = e.ns(d, "object.user.boards", e.CONSTS.ISNSREAD);
                                    if (E && E.length) for (var F = 0, G = f.data.self_created_boards.length; G > F; F++) {
                                        var H = f.data.self_created_boards[F];
                                        E.every(function(b) {
                                            if (b && b.board && b.board.client_uuid === H.client_uuid) {
                                                var c = {
                                                    isFullData: !0,
                                                    data: b,
                                                    code: e.CONSTS.RESPONSE_SUCCESS
                                                };
                                                return f.data.self_created_boards.splice(F, 1), F--, G--, H.req_data && H.req_data.category ? (C.log.info("create binder with category", H.req_data), 
                                                f.api("/binders/" + b.sequence, "PUT", {
                                                    data: {
                                                        category: 1 * H.req_data.category
                                                    }
                                                }, function(b) {
                                                    b && b.data && (c.data.category = 1 * H.req_data.category), e.isFunction(H.callback) && H.callback.call(H.context || a, c);
                                                })) : e.isFunction(H.callback) && H.callback.call(H.context || a, c), !1;
                                            }
                                            return !0;
                                        });
                                    }
                                }
                                C._setOrderNumber(d);
                            }
                            e.ns(d, "action.is_deleted", e.CONSTS.ISNSREAD) !== !0 && e.ns(d, "object.board.is_deleted", e.CONSTS.ISNSREAD) !== !0 ? (C._simpleSubscribe(b, m, z, i, l), 
                            C.data.subscriber.urls[b].aborting = !1) : (C.log.warn("This binder or meet deleted, auto stopped the subscriber."), 
                            f.unsubscribe(b), e.ns(d, "action.is_deleted", e.CONSTS.ISNSREAD) && (e.ns(f, "models.meet.proto.data.active", void 0, e.CONSTS.ISNSUPDATE), 
                            e.ns(f, "models.meet.proto.data.board", void 0, e.CONSTS.ISNSUPDATE)));
                        },
                        error: function(c, f) {
                            var h = C.data.subscriber.urls[b];
                            if (h.active = void 0, !h.aborting || h.paused || c && c === e.CONSTS.AJAX_TIMEOUT) if (z = C._getUserRevision(), 
                            -1 !== z) {
                                if (h.paused) return a.clearTimeout(h.retry), void (h.retry = a.setInterval(function() {
                                    C._simpleSubscribe(b, m, z, i, l);
                                }, 15e3));
                                if (c && "RESPONSE_ERROR_TIMEOUT" === c.code || 408 === f.status) C.log.info("sub timeout. ts=" + Date()), 
                                C._simpleSubscribe(b, m, z, i, l); else if (0 !== f.status || h.aborting) {
                                    if (403 === f.status || 404 === f.status) {
                                        for (C.log.error("403 or 404 error, so stop subscribe"), r = {
                                            code: c && c.code,
                                            message: c && c.message,
                                            xhr: f
                                        }, n = 0, o = h.subs.length; o > n; n++) h.subs[n] && e.isFunction(h.subs[n][0]) && h.subs[n][0].call(h.subs[n][1] || a, r);
                                        return void C._stopSubscribe(b, d, g);
                                    }
                                    if (C.log.error("subscribe error:" + (c && c.message || f.status)), c && "Notloggedin" === c.message || 400 === f.status) for (C.log.error("Not login or session timout."), 
                                    a.clearTimeout(h.retry), n = 0, o = h.subs.length; o > n; n++) h.subs[n] && e.isFunction(h.subs[n][0]) && h.subs[n][0].call(h.subs[n][1] || a, {
                                        code: "Notloggedin"
                                    }); else C.log.warn("Retry after 15 second."), a.clearTimeout(h.retry), h.retry = a.setTimeout(function() {
                                        C._simpleSubscribe(b, m, z, i, l);
                                    }, 15e3);
                                } else a.clearTimeout(h.retry), h.retry = a.setTimeout(function() {
                                    C._simpleSubscribe(b, m, z, i, l);
                                }, 15e3);
                            } else for (n = 0, o = h.subs.length; o > n; n++) h.subs[n] && e.isFunction(h.subs[n][0]) && h.subs[n][0].call(h.subs[n][1] || a, {
                                code: "USER_CHANGED"
                            });
                            h.aborting = !1;
                        }
                    }), this._simpleSubscribe(b, m, z, i, l), C.log.info(c && c.hasOwnProperty("pause") ? "Restored:" : "Subscribed:", b, arguments);
                }
            }
        },
        processUserSubscribeData: function(b) {
            var c, d, g, h = "/users/me", i = {}, j = this;
            if (j.log.info("sub received from new sdk:", b), "/users" === h || "/users/me" === h) {
                var k, l, m, n;
                if (k = b.object && b.object.group, l = b.object && b.object.user || {}, n = f.data.cred.authResponse, 
                k) (k.id !== n.groupId || k.name !== n.groupName || k.status !== n.groupStatus) && (k.id && (f.data.cred.authResponse.groupId = k.id), 
                k.name && (f.data.cred.authResponse.groupName = k.name), k.status && (f.data.cred.authResponse.groupStatus = k.status), 
                k.type ? f.data.cred.authResponse.groupAccessType = k.type : (m = k.members, m && m.length && m.every(function(a) {
                    return a.user && a.user.id === (l.id || f.data.cred.authResponse.c_user) ? (f.data.cred.authResponse.groupAccessType = a.type, 
                    !1) : !0;
                })), e.store({
                    key: "auth",
                    value: f.data.cred.authResponse
                })); else if (l.groups && l.groups.length) {
                    var o = _.find(l.groups, function(a) {
                        return "GROUP_MEMBER" === a.status;
                    });
                    o && o.group && (o.group.id && (f.data.cred.authResponse.groupId = o.group.id), 
                    o.group.name && (f.data.cred.authResponse.groupName = o.group.name), o.status && (f.data.cred.authResponse.groupStatus = o.status), 
                    o.type && (f.data.cred.authResponse.groupAccessType = o.type)), e.store({
                        key: "auth",
                        value: f.data.cred.authResponse
                    });
                }
            }
            if (b && b.object && b.object.user) {
                if (c = b.object.user, c && c.id && (c.email || c.unique_id)) {
                    var p = f.data.maps.contacts.byId[c.id];
                    p ? (c.hasOwnProperty("email") && c.email !== p.email && (p.email = c.email), c.hasOwnProperty("first_name") && c.first_name !== p.first_name && (p.first_name = c.first_name), 
                    c.hasOwnProperty("last_name") && c.last_name !== p.last_name && (p.last_name = c.last_name), 
                    c.hasOwnProperty("name") && c.name !== p.name && (p.name = c.name), c.hasOwnProperty("phone_number") && c.phone_number !== p.phone_number && (p.phone_number = c.phone_number), 
                    c.hasOwnProperty("email_verified") && c.email_verified !== p.email_verified && (p.email_verified = c.email_verified), 
                    c.hasOwnProperty("picture") && c.picture !== p.picture && (p.picture = c.picture, 
                    p.picture_url = c.picture ? "/user/" + c.picture : ""), c.hasOwnProperty("picture2x") && c.picture2x !== p.picture2x && (p.picture2x = c.picture2x, 
                    p.picture2x_url = c.picture2x ? "/user/" + c.picture2x : ""), c.hasOwnProperty("picture4x") && c.picture4x !== p.picture4x && (p.picture4x = c.picture4x, 
                    p.picture4x_url = c.picture4x ? "/user/" + c.picture4x : ""), f.data.maps.contacts.byEmail[c.email || c.unique_id] = p) : f.data.maps.contacts.byId[c.id] = f.data.maps.contacts.byEmail[c.email || c.unique_id] = {
                        id: c.id,
                        email: c.email,
                        first_name: c.first_name,
                        last_name: c.last_name,
                        name: c.name,
                        phone_number: c.phone_number,
                        email_verified: c.email_verified,
                        picture: c.picture,
                        picture_url: c.picture && "/user/" + c.picture || "",
                        picture2x: c.picture2x,
                        picture2x_url: c.picture2x && "/user/" + c.picture2x || "",
                        picture4x: c.picture4x,
                        picture4x_url: c.picture4x && "/user/" + c.picture4x || ""
                    };
                }
                var q = b.object.user.contacts;
                if (q && q.length) for (d = 0, g = q.length; g > d; d++) c = q[d], c.user = c.user || {}, 
                c.user.picture && (c.user.picture_url = "/user/contact/" + c.sequence + "/" + c.user.picture), 
                c.user.picture2x && (c.user.picture2x_url = "/user/contact/" + c.sequence + "/" + c.user.picture2x), 
                c.user.picture4x && (c.user.picture4x_url = "/user/contact/" + c.sequence + "/" + c.user.picture4x), 
                c.user.id && (f.data.maps.contacts.byId[c.user.id] = c.user), c.user.email ? f.data.maps.contacts.byEmail[c.user.email] = c.user : c.user.unique_id && (f.data.maps.contacts.byEmail[c.user.unique_id] = c.user);
            }
            if (j._store(h, "SUBSCRIBE", b, i), "/users" === h || "/users/me" === h) {
                if (f.data.self_created_boards && f.data.self_created_boards.length) {
                    var r = e.ns(b, "object.user.boards", e.CONSTS.ISNSREAD);
                    if (r && r.length) for (var d = 0, g = f.data.self_created_boards.length; g > d; d++) {
                        var s = f.data.self_created_boards[d];
                        r.every(function(b) {
                            if (b && b.board && b.board.client_uuid === s.client_uuid) {
                                var c = {
                                    isFullData: !0,
                                    data: b,
                                    code: e.CONSTS.RESPONSE_SUCCESS
                                };
                                return f.data.self_created_boards.splice(d, 1), d--, g--, s.req_data && s.req_data.category ? (j.log.info("create binder with category", s.req_data), 
                                f.api("/binders/" + b.sequence, "PUT", {
                                    data: {
                                        category: 1 * s.req_data.category
                                    }
                                }, function(b) {
                                    b && b.data && (c.data.category = 1 * s.req_data.category), e.isFunction(s.callback) && s.callback.call(s.context || a, c);
                                })) : e.isFunction(s.callback) && s.callback.call(s.context || a, c), !1;
                            }
                            return !0;
                        });
                    }
                }
                j._setOrderNumber(b);
            }
        },
        _getUserRevision: function(a) {
            if (!(a && a.object && a.object.board)) {
                var b, c, d, f;
                return b = e.store({
                    key: "/users/me"
                }), c = b && b.object && b.object.user && b.object.user.id || void 0, f = a && a.object && a.object.user && a.object.user.id || void 0, 
                d = a && a.object && a.object.user && a.object.user.revision || b && b.object && b.object.user && b.object.user.revision || 0, 
                c || f ? c && f && c !== f ? -1 : (d || (e.store({
                    key: "/users/me",
                    value: null
                }), e.store({
                    key: "auth",
                    value: null
                })), d) : -2;
            }
        }
    }), e.SDKP = e.define("SDKP", {
        models: {},
        protos: {},
        data: void 0,
        log: a.MX && d.logger("SDKP") || new e.Log({
            name: "SDKP"
        }),
        defaultConfig: {
            apiUrlRoot: "",
            verifyTimeSpan: 15e3
        },
        core: e,
        _mergeGroupInfo: function() {
            var a = this;
            if (!a.data.cred.authResponse.groupId) {
                var b = e.store({
                    key: "/users/me"
                }) || {}, c = {};
                if (b.object && b.object.group) {
                    c.groupId = b.object.group.id, c.groupName = b.object.group.name, c.groupStatus = b.object.group.status;
                    var d = b.object.group.members;
                    d && d.length && _.each(d, function(b) {
                        return b.user && b.user.id === a.data.cred.authResponse.c_user ? void (c.groupAccessType = b.type) : void 0;
                    });
                } else if (b.object && b.object.user && b.object.user.groups && b.object.user.groups.length) {
                    var f = _.find(b.object.user.groups, function(a) {
                        return "GROUP_MEMBER" === a.status;
                    });
                    f && f.group && (c.groupId = f.group.id, c.groupName = f.group.name, c.groupStatus = f.status, 
                    c.groupAccessType = f.type);
                }
                c.groupId && (e.extend(a.data.cred.authResponse, c), e.store({
                    key: "auth",
                    value: a.data.cred.authResponse
                }));
            }
        },
        getMe: function() {
            this.log.info("MX.getMe() is called");
            var a, b = this;
            this.data.cred.authResponse && this.data.cred.authResponse.c_user || (this.data.cred.authResponse = e.store({
                key: "auth"
            }) || {}), b.data.cred.cookie.sessionid || e.ns(b.data, "cred.cookie", e.getCookie(), e.CONSTS.ISNSUPDATE);
            var c = {
                session_id: b.data.cred.cookie.sessionid
            };
            return this.data.verified.getMe_time && Date.now() - this.data.verified.getMe_time < 5e3 ? (this.log.info("MX.getMe() return without group merge"), 
            a = _.extend({}, this.data.cred.authResponse, e.ns(e.store({
                key: "/users/me"
            }), "object.user", e.CONSTS.ISNSREAD), c)) : (e.store({
                key: "auth",
                value: b.data.cred.authResponse
            }), b._mergeGroupInfo(), b.data.verified.getMe_time = Date.now(), a = _.extend({}, this.data.cred.authResponse, e.ns(e.store({
                key: "/users/me"
            }), "object.user", e.CONSTS.ISNSREAD), c), a.c_user = a.id, a);
        },
        getUserBinder: function(a) {
            var b, c = e.ns(e.store({
                key: "/users/me"
            }), "object.user.boards", e.CONSTS.ISNSREAD) || [];
            return c.every(function(c) {
                return c.boardId === a ? (b = c, !1) : !0;
            }), b || (c = e.ns(e.store({
                key: "/users/me"
            }), "object.group.boards", e.CONSTS.ISNSREAD) || [], c.every(function(c) {
                return c && c.board && c.board.id === a ? (b = c, b.boardId = a, !1) : !0;
            })), b || {};
        },
        _autoInit: function() {
            if (!this.data || !this.data.inited) {
                var a, b = this.config.mods + "", c = 0;
                for (this.data = {
                    cred: {
                        cookie: e.getCookie(),
                        authResponse: e.store({
                            key: "auth"
                        })
                    },
                    meta: {},
                    verified: {},
                    inited: !0,
                    maps: {
                        contacts: {
                            byId: {},
                            byEmail: {}
                        },
                        boards: {
                            byId: {}
                        },
                        groupBoards: {
                            byId: {}
                        }
                    },
                    self_created_boards: [],
                    feed_unread_count: 0
                }, a = b.split(","); a[c]; ) this.models[a[c]] = new e.Model({
                    name: a[c],
                    context: this
                }), c++;
            }
        },
        init: function(a) {
            this.inited || (this.config = e.extend({}, a, this.config), this.inited = !0);
        },
        api: function(a, b, c) {
            this.log.info("MX.api() is called", arguments), b = b || "GET";
            var d, g, h = arguments;
            for (d in this.models) if (this.models[d].proto && this.models[d].proto.urlExp && this.models[d].proto.urlExp.test(a)) {
                g = this.models[d];
                break;
            }
            g ? g.proto[b] ? ("GET" === b && g.data && g.data.subscriber && !g.data.subscriber.active && g.proto.subscribeMod && f.models[g.proto.subscribeMod] && f.models[g.proto.subscribeMod].data && f.models[g.proto.subscribeMod].data.subscriber && !f.models[g.proto.subscribeMod].data.subscriber.active && (h = Array.prototype.slice.call(arguments), 
            h[2] = e.extend(c || {}, {
                localFirst: !1
            })), g.api.apply(g, h)) : this.log.error("The API Method is not supported: " + b, arguments) : this.log.error("The API Model not exist: " + a);
        },
        unsubscribe: function(a, b, c) {
            this.log.info("MX.unsubscribe() is called", arguments);
            var d, e;
            for (d in this.models) if (this.models[d].proto && this.models[d].proto.urlExp && this.models[d].proto.urlExp.test(a)) {
                e = this.models[d];
                break;
            }
            e ? e.proto.subscribe ? e.subscribe.call(e, a, {
                stop: !0
            }, b, c) : e.log.error("The API Method is not supported: unsubscribe " + a) : this.log.error("The API Model not exist." + a);
        },
        subscribe: function(a) {
            if (this.log.info("MX.subscribe() is called", arguments), "/users/me" !== a) {
                var b, c;
                if (!a || a.clean !== !0 && !a.hasOwnProperty("pause")) {
                    for (b in this.models) if (this.models[b].proto && this.models[b].proto.urlExp && this.models[b].proto.urlExp.test(a)) {
                        c = this.models[b];
                        break;
                    }
                    c ? c.proto.subscribe ? c.subscribe.apply(c, arguments) : c.log.error("The API Method is not supported: SUBSCRIBE " + a) : this.log.error("The API Model not exist: " + a);
                } else for (b in this.models) this.models[b] && this.models[b].proto.subscribe && this.models[b].subscribe.apply(this.models[b], arguments);
            }
        },
        processUserSubscribeData: function() {
            var a = this.models.user;
            a.processUserSubscribeData.apply(a, arguments);
        },
        _cleanup: function() {
            this.subscribe({
                clean: !0
            }), e.store({
                clean: !0
            }), this.data = {
                cred: {
                    cookie: {},
                    authResponse: {}
                },
                meta: {},
                verified: {},
                inited: !1,
                maps: {
                    contacts: {
                        byId: {},
                        byEmail: {}
                    },
                    boards: {
                        byId: {}
                    },
                    groupBoards: {
                        byId: {}
                    }
                },
                self_created_boards: [],
                feed_unread_count: 0
            }, e.DATA.stores = {}, e.DATA.storeStack = [], e.Model.data = {
                meta: {},
                clean: {},
                subscriber: {
                    revision: void 0,
                    active: !1,
                    xhr: void 0,
                    aborting: !1,
                    urls: {}
                }
            }, this.models.meet.proto.data = {};
        },
        _cleanupCookie: function() {
            e.deleteCookie("token"), e.deleteCookie("c_user"), e.deleteCookie("client_id");
        },
        login: function() {
            this.log.info("MX.login() is called", arguments), this.models.main.login.apply(this.models.main, arguments);
        },
        logout: function(b, c) {
            this.log.info("MX.logout() is called", arguments);
            var d = this;
            d._cleanup(), this.models.main.logout.apply(this.models.main, [ function(f) {
                d._cleanupCookie(), e.isFunction(b) && b.call(c || a, f);
            } ]);
        },
        getAuthResponse: function(a, b, c) {
            return;
        }
    }), e.extend(e.SDKP.prototype.protos, {
        main: {
            name: "main",
            LOGIN: {
                resultNS: "object.user",
                apiUrl: "/user",
                mxType: "USER_REQUEST_LOGIN"
            },
            LOGOUT: {
                resultNS: "object.user",
                apiUrl: "/user",
                mxType: "USER_REQUEST_LOGOUT"
            },
            outputSetting: {
                "object.user": function(a) {
                    var b;
                    a && a.id && (a.email || a.unique_id) && (b = f.data.maps.contacts.byId[a.id], b ? (a.hasOwnProperty("email") && a.email !== b.email && (b.email = a.email), 
                    a.hasOwnProperty("first_name") && a.first_name !== b.first_name && (b.first_name = a.first_name), 
                    a.hasOwnProperty("last_name") && a.last_name !== b.last_name && (b.last_name = a.last_name), 
                    a.hasOwnProperty("name") && a.name !== b.name && (b.name = a.name), a.hasOwnProperty("phone_number") && a.phone_number !== b.phone_number && (b.phone_number = a.phone_number), 
                    a.hasOwnProperty("email_verified") && a.email_verified !== b.email_verified && (b.email_verified = a.email_verified), 
                    a.hasOwnProperty("picture") && a.picture !== b.picture && (b.picture = a.picture, 
                    b.picture_url = a.picture ? "/user/" + a.picture : ""), a.hasOwnProperty("picture2x") && a.picture2x !== b.picture2x && (b.picture2x = a.picture2x, 
                    b.picture2x_url = a.picture2x ? "/user/" + a.picture2x : ""), a.hasOwnProperty("picture4x") && a.picture4x !== b.picture4x && (b.picture4x = a.picture4x, 
                    b.picture4x_url = a.picture4x ? "/user/" + a.picture4x : ""), f.data.maps.contacts.byEmail[a.email || a.unique_id] = b) : f.data.maps.contacts.byId[a.id] = f.data.maps.contacts.byEmail[a.email || a.unique_id] = {
                        id: a.id,
                        email: a.email,
                        first_name: a.first_name,
                        last_name: a.last_name,
                        name: a.name,
                        phone_number: a.phone_number,
                        email_verified: a.email_verified,
                        picture: a.picture,
                        picture_url: a.picture && "/user/" + a.picture || "",
                        picture2x: a.picture2x,
                        picture2x_url: a.picture2x && "/user/" + a.picture2x || "",
                        picture4x: a.picture4x,
                        picture4x_url: a.picture4x && "/user/" + a.picture4x || ""
                    });
                },
                "user.contacts.0": function(a, b, c, d, e, g) {
                    var h = g && g.meta;
                    a && a.user && (a.user.picture && (a.user.picture_url = "/user/contact/" + a.sequence + "/" + a.user.picture), 
                    a.user.picture2x && (a.user.picture2x_url = "/user/contact/" + a.sequence + "/" + a.user.picture2x), 
                    a.user.picture4x && (a.user.picture4x_url = "/user/contact/" + a.sequence + "/" + a.user.picture4x), 
                    (h && h.isFromServer || !f.data.maps.contacts.inited) && (f.data.maps.contacts.byId[a.user.id] = a.user, 
                    f.data.maps.contacts.byEmail[a.user.email || a.user.unique_id] = a.user, d.key === c.length - 1 && (f.data.maps.contacts.inited = !0)));
                },
                "resources.0": function(a, b, c, d, g, h) {
                    var i, j, k, l, m, n = d.fullKey.split(".");
                    a && a.sequence && !a.content_type && (l = "object.board.resources", i = e.ns(h.full || h.meta, l, e.CONSTS.ISNSREAD), 
                    i || (h.full ? (n = n.slice(0, 5), n.push("id"), l = n.join("."), m = e.ns(h.meta, l, e.CONSTS.ISNSREAD), 
                    m && (k = e.ns(h.full, "object.user.boards", e.CONSTS.ISNSREAD), k && k.length && k.every(function(a) {
                        return a && a.board && a.board.id === m ? (i = a.board.resources, !1) : !0;
                    }))) : (n = n.slice(0, 5), n.push("resources"), l = n.join("."), i = e.ns(h.meta, l, e.CONSTS.ISNSREAD))), 
                    i && i.length && (j = void 0, i.every(function(b) {
                        return b && b.sequence === a.sequence ? (j = b, e.extend(a, b), !1) : !0;
                    }), j ? e.extend(a, j) : f.log.info("Server data error: not found resource of feed in binder resource list.", d)));
                },
                page_group: function(a, b, c, d, g, h) {
                    if ("string" == typeof a && c) {
                        var i = h.full || h.meta, j = e.ns(i, "object.board.page_groups", e.CONSTS.ISNSREAD);
                        if (j && j.length) {
                            var k = j.every(function(b) {
                                return b && b.client_uuid === a ? (c.page_group = b, !1) : !0;
                            });
                            k && (f.log.info("not found page_group", a), delete c.page_group);
                        }
                    }
                },
                "users.0": function(a, b, c, d, g, h) {
                    var i, j, k, l, m, n = d.fullKey.split(".");
                    a.sequence && !a.user ? (i = "object.board.users", l = e.ns(h.full || h.meta, i, e.CONSTS.ISNSREAD), 
                    l || (h.full ? (n = n.slice(0, 5), n.push("id"), i = n.join("."), j = e.ns(h.meta, i, e.CONSTS.ISNSREAD), 
                    j && (k = e.ns(h.full, "object.user.boards", e.CONSTS.ISNSREAD), k && k.length && k.every(function(a) {
                        return a && a.board && a.board.id === j ? (l = a.board.users, !1) : !0;
                    }))) : (n = n.slice(0, 5), n.push("users"), i = n.join("."), l = e.ns(h.meta, i, e.CONSTS.ISNSREAD))), 
                    l && l.length && (l.every(function(b) {
                        return b && b.sequence === a.sequence ? (m = b.user && (b.user.id || b.user.email || b.user.unique_id), 
                        e.extend(a, b), !1) : !0;
                    }), a.user = m ? f.data.maps.contacts.byId[m] || f.data.maps.contacts.byEmail[m] || a.user : a.user || {})) : a.user && a.user.picture && !a.user.picture_url && (a.user = f.data.maps.contacts.byId[a.user.id] || f.data.maps.contacts.byEmail[a.user.email || a.user.unique_id] || a.user);
                },
                creator: "actor",
                "contents.0.user": "actor",
                "comments.0.user": "actor",
                actor: function(a) {
                    a && a.id && e.extend(a, f.data.maps.contacts.byId[a.id] || f.data.maps.contacts.byEmail[a.email || a.unique_id]);
                },
                "user.boards.0": function(a, b, c, d, e, g) {
                    var h = g && g.meta || {};
                    a && a.board && "BOARD_REQUEST_SEARCH_BOARD" !== h.type && (!a.board.thumbnail_url && a.board.thumbnail && (a.board.thumbnail_url = "/user/board/" + a.sequence + "/" + a.board.thumbnail), 
                    (h.isFromServer || !f.data.maps.boards.inited) && (f.data.maps.boards.byId[a.board.id] = a.board, 
                    d.key === c.length - 1 && (f.data.maps.boards.inited = !0)));
                },
                "group.boards.0": function(a, b, c, d, e, g) {
                    var h = g && g.meta || {};
                    a && a.board && "BOARD_REQUEST_SEARCH_GROUP_BOARD" !== h.type && (!a.board.thumbnail_url && a.board.thumbnail && (a.board.thumbnail_url = "/user/board/" + a.sequence + "/" + a.board.thumbnail), 
                    (h.isFromServer || !f.data.maps.groupBoards.inited) && (f.data.maps.groupBoards.byId[a.board.id] = a.board, 
                    d.key === c.length - 1 && (f.data.maps.groupBoards.inited = !0)));
                },
                "boards.0": "object.board",
                "object.board": function(a, b, c, d, g, h) {
                    var i, j, k, l, m, n, o, p, q, r, s = h && h.meta || {};
                    if ("BOARD_REQUEST_SEARCH_BOARD" === s.type || "BOARD_REQUEST_SEARCH_GROUP_BOARD" === s.type) return a;
                    switch (b) {
                      case "boards.0":
                        r = a && a.board || void 0, r && (a.boardId = r.id), r && !r.thumbnail_url && r.thumbnail && (r.thumbnail_url = "/user/board/" + a.sequence + "/" + r.thumbnail), 
                        s.isFullData && !s.isFromServer && (!a || a.is_deleted || !r || !r.id || r.islive || r.is_deleted || (a === c[0] ? f.data.feed_unread_count = a.feed_unread_count || 0 : f.data.feed_unread_count += a && "BOARD_INVITED" === a.status ? 1 : a.feed_unread_count || 0));
                        break;

                      default:
                        r = a;
                    }
                    if (r) {
                        if (r && r.feeds) for (l = 0, m = r.feeds.length; m > l; l++) n = r.feeds[l], p = !1, 
                        n && (n.board = n.board || {}, n.board.name = r.name, n.board.isconversation = r.isconversation, 
                        n.board.comments && n.board.comments.length && (n.board.comments.forEach(function(a) {
                            r.comments && r.comments.every(function(b) {
                                return b.sequence === a.sequence ? (b.is_deleted ? n.is_deleted = !0 : e.extend(a, b), 
                                q = !0, !1) : !0;
                            });
                        }), q || (n.is_deleted = !0), q = !1), n.board.pages && n.board.pages.length && (n.board.pages.every(function(a) {
                            return r.pages && r.pages.every(function(b) {
                                if (b.sequence === a.sequence) {
                                    if (b.is_deleted) p = !0, "FEED_PAGES_DELETE" !== n.type && (n.is_deleted = !0); else {
                                        if (a.comments && b.comments) {
                                            for (i = a.comments[0].sequence, o = e.copy(b.comments), j = 0, k = o.length; k > j; j++) o[j] && o[j].sequence === i || (o.splice(j, 1), 
                                            j--, k--);
                                            a.comments = o;
                                        }
                                        e.extend(a, b);
                                    }
                                    return q = !0, !1;
                                }
                                return !0;
                            }), !p;
                        }), q || "FEED_PAGES_DELETE" === n.type || (n.is_deleted = !0), q = !1), n.board.users && n.board.users.length && n.board.users.forEach(function(a) {
                            r.users && r.users.every(function(b) {
                                return b.sequence === a.sequence ? (e.extend(a, b), !1) : !0;
                            });
                        }), n.actor && n.actor.id && r.users && r.users.every(function(a) {
                            return a && a.user && a.user.id === n.actor.id ? (e.extend(n.actor, a.user), !f.data.maps.contacts.byId[a.user.id] && a.is_deleted && a.user.picture && (n.actor.picture_url = [ "/board", r.id, "user", a.sequence, a.user.picture ].join("/"), 
                            n.actor.picture2x_url = [ "/board", r.id, "user", a.sequence, a.user.picture2x || a.user.picture ].join("/"), 
                            n.actor.picture4x_url = [ "/board", r.id, "user", a.sequence, a.user.picture4x || a.user.picture ].join("/")), 
                            !1) : !0;
                        }), n.board.resources && n.board.resources.length && (n.board.resources.forEach(function(a) {
                            r.resources && r.resources.every(function(b) {
                                return b.sequence === a.sequence ? (b.is_deleted && "FEED_PAGES_DELETE" !== n.type && (n.is_deleted = !0), 
                                e.extend(a, b), q = !0, !1) : !0;
                            });
                        }), q || "FEED_PAGES_DELETE" === n.type || (n.is_deleted = !0), q = !1));
                        return a;
                    }
                },
                is_deleted: function(a, b, c, d, f, g) {
                    if (a) {
                        var h = g && g.meta, i = /^(.*)\.board\.(users|todos)\.\d.*$/;
                        h && h.isFullData && d && d.grant && "number" == typeof d.grantKey && (!d.grantKey && e.REGS.DATA_PATH_FEED_PAGES.test(d.fullKey) || !d.grantKey && e.REGS.DATA_PATH_FEED_COMMENTS.test(d.fullKey) || e.REGS.DATA_PATH_FEED_USER.test(d.fullKey) || i.test(d.fullKey) || (!h.isFromServer || h.isFullData) && d.grant.splice(d.grantKey, 1));
                    }
                }
            },
            dataFormatter: function(a, b, c, d, e) {
                var f = {
                    url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                    data: {
                        type: d
                    }
                };
                return void 0 !== e && (f.data.object = {}, f.data.object[a] = e), f;
            },
            resultFilter: function(a, b) {
                var c, d, f, g, h, i, j, k, l, m;
                if (a && b && "string" == typeof b) {
                    for (f = b.split(","), l = !0, c = 0, d = f.length; d > c; c++) if (f[c] && "string" == typeof f[c] && (g = f[c].match(e.REGS.FILTER), 
                    h = g && "!" === g[1], i = g && g[2], j = g && g[3], k = g && g[4], i)) if (m = e.ns(a, i, e.CONSTS.ISNSREAD), 
                    j) {
                        if (k) {
                            switch (k = e.REGS.STRING.test(k) ? k.replace(e.REGS.STRINGTRIM, "") : 1 * k === 1 * k ? 1 * k : k, 
                            j) {
                              case "=":
                                break;

                              case "==":
                                l = m == k;
                                break;

                              case "===":
                                l = m === k;
                                break;

                              case ">=":
                                l = m >= k;
                                break;

                              case "<=":
                                l = k >= m;
                                break;

                              case "!=":
                                l = m != k;
                                break;

                              case "!==":
                                l = m !== k;
                                break;

                              case ">":
                                l = m > k;
                                break;

                              case "<":
                                l = k > m;
                            }
                            if (!l) break;
                        }
                    } else if (l = !m === h, !l) break;
                    return l;
                }
                return !0;
            },
            resultSorter: function(a, b, c) {
                var d, f, g, h, i, j, k, l, m, n, o;
                if ("string" == typeof c) for (d = c.split(","), m = 0, n = d.length; n > m; m++) if (d[m] && (f = d[m].match(e.REGS.FILTER), 
                g = f && "!" === f[1], h = f && f[2], h && (i = e.ns(a, h, e.CONSTS.ISNSREAD), j = e.ns(b, h, e.CONSTS.ISNSREAD), 
                k = 1 * i, l = 1 * j, k === k && l === l && (i = k, j = l), i !== j))) {
                    o = void 0 === i || null === i || i !== i ? 1 : void 0 === j || null === j || j !== j ? -1 : i > j ? g ? -1 : 1 : g ? 1 : -1;
                    break;
                }
                return o = o || 0;
            },
            storeFormatter: function(a) {
                var b, c, d;
                if (a && a.object && a.object.user && a.object.user.boards && !a.object.board) for (f.data.feed_unread_count = 0, 
                b = 0, c = a.object.user.boards.length; c > b; b++) d = a.object.user.boards[b], 
                !d || d.is_deleted || !d.board || !d.board.id || d.board.islive || d.board.is_deleted || "BOARD_INVITED" !== d.status && "BOARD_MEMBER" !== d.status ? (a.object.user.boards.splice(b, 1), 
                b--, c--) : !(d.is_default && d.created_time >= 13752864e5) || d.board.feeds && d.board.feeds.length ? (d.boardId = d.board.id, 
                f.data.feed_unread_count += d && "BOARD_INVITED" === d.status ? 1 : d.feed_unread_count || 0) : (a.object.user.boards.splice(b, 1), 
                b--, c--);
                if (a && a.object && a.object.group && a.object.group.boards && !a.object.board) for (b = 0, 
                c = a.object.group.boards.length; c > b; b++) d = a.object.group.boards[b], d && !d.is_deleted && d.board && d.board.id && !d.board.is_deleted || (a.object.group.boards.splice(b, 1), 
                b--, c--);
                return a;
            },
            outputFormatter: function(a, b, c, d, f, g) {
                var h, i, j, k;
                if (g || (g = {
                    full: b || void 0,
                    meta: a
                }, b = ""), b) for (h in this.outputSetting) h && b.slice(-h.length) === h && c && (k = "string" == typeof this.outputSetting[h] ? this.outputSetting[this.outputSetting[h]] : this.outputSetting[h], 
                e.isFunction(k) && k.call(this, a, h, c, d, f, g));
                if (e.isObject(a)) for (h in a) h && this.outputFormatter(a[h], (b && b + "." || "") + h, a, {
                    grant: c,
                    key: h,
                    grantKey: d && d.key,
                    fullKey: (d && d.fullKey && d.fullKey + "." || "") + h
                }, f, g); else if (e.isArray(a)) for (i = 0, j = a.length; j > i; i++) void 0 !== a[i] && this.outputFormatter(a[i], b && b + ".0" || "0", a, {
                    grant: c,
                    key: i,
                    grantKey: d && d.key,
                    fullKey: d && d.fullKey && d.fullKey + "." + i || i + ""
                }, f, g), j !== a.length && (i += a.length - j, j += a.length - j);
                return a;
            },
            resultFormatter: function(a, b, c, d, g, h, i) {
                var j, k, l, m, n, o = i && void 0 !== i.resultNS ? i.resultNS : this.proto[c] && this.proto[c].resultNS || this.proto.resultNS;
                if (l = o && (e.isArray(g) || e.isObject(g)) ? e.ns(g, o, e.CONSTS.ISNSREAD) : g, 
                l && e.isArray(l.boards)) for (j = 0, k = l.boards.length; k > j; j++) n = l.boards[j] && l.boards[j].board || {}, 
                l.boards[j] && l.boards[j].is_default && l.boards[j].created_time >= 13752864e5 ? n.feeds && n.feeds.length || (l.boards.splice(j, 1), 
                j--, k--) : (n.islive || n.isnote) && (l.boards.splice(j, 1), j--, k--);
                if (e.isArray(l) && "object.user.boards" === o) for (j = 0, k = l.length; k > j; j++) n = l[j] && l[j].board || {}, 
                l[j] && l[j].is_default && l[j].created_time >= 13752864e5 && (n.feeds && n.feeds.length || (l.splice(j, 1), 
                j--, k--));
                if (g && "BOARD_REQUEST_SEARCH_BOARD" === g.type && "object.user.boards" === o && l && l.length) for (j = 0, 
                k = l.length; k > j; j++) n = f.data.maps.boards.byId[l[j].board.id], n ? (l[j].boardId = n.id, 
                l[j].board = n) : (l.splice(j, 1), j--, k--);
                if (g && "BOARD_REQUEST_SEARCH_GROUP_BOARD" === g.type && "object.user.groups.0.group.boards" === o && l && l.length) for (j = 0, 
                k = l.length; k > j; j++) n = f.data.maps.groupBoards.byId[l[j].board.id], n ? (l[j].boardId = n.id, 
                l[j].board = n) : (l.splice(j, 1), j--, k--);
                return m = l && l.code ? g : {
                    code: g && g.code || e.CONSTS.RESPONSE_SUCCESS,
                    message: g && e.code === e.CONSTS.RESPONSE_SUCCESS || g && g.message || void 0,
                    data: l || this.proto[c].defaultResult
                }, "USER_REQUEST_REGISTER" === d && (e.ns(f, "data.cred.authResponse.meta", g), 
                f.models.user._store("/users/me", "GET", g), Moxtra && Moxtra.parseData(g, !0)), 
                m;
            },
            extend: {
                login: function(b, c, d) {
                    var g, h, i, j = this, k = f.models.user;
                    f.data.cred = f.data.cred || {}, f.data.cred.cookie = e.getCookie(), f.data.cred.authResponse = f.data.cred.authResponse || e.store({
                        key: "auth"
                    });
                    var l = function() {
                        return !1;
                    };
                    if (b && (b.email && b.password || b.loginFrom && b.accessToken)) if (l()) {
                        var m = h = e.store({
                            key: "/users/me"
                        });
                        e.isFunction(c) && c.call(d || a, m), j.log.info("Logged in successfully.[local]");
                    } else b.email ? i = {
                        url: this.proto.LOGIN.apiUrl,
                        data: {
                            type: this.proto.LOGIN.mxType,
                            object: {
                                user: {
                                    email: b.email,
                                    pass: b.password
                                }
                            },
                            params: b.remember && [ {
                                name: "USER_REQUEST_LOGIN_REMEMBER"
                            } ] || void 0
                        }
                    } : "facebook" === b.loginFrom ? i = {
                        url: this.proto.LOGIN.apiUrl,
                        data: {
                            type: this.proto.LOGIN.mxType,
                            object: {
                                user: {
                                    type: "USER_TYPE_FACEBOOK",
                                    pass: b.accessToken
                                }
                            }
                        }
                    } : "google" === b.loginFrom && (i = {
                        url: this.proto.LOGIN.apiUrl,
                        data: {
                            type: this.proto.LOGIN.mxType,
                            object: {
                                user: {
                                    type: "USER_TYPE_GOOGLE",
                                    pass: b.accessToken
                                }
                            }
                        }
                    }), e.ajax(e.extend(i, {
                        success: function(b) {
                            try {
                                Moxtra && Moxtra.parseData(b, !0);
                            } catch (h) {
                                j.log.error("parseData has error", h);
                            }
                            f.data.cred.cookie = e.getCookie(), g = {
                                c_user: f.data.cred.cookie && f.data.cred.cookie.c_user || e.ns(b, "object.user.id", e.CONSTS.ISNSREAD),
                                token: f.data.cred.cookie && f.data.cred.cookie.token || e.ns(b, "object.user.tokens.0", e.CONSTS.ISNSREAD),
                                session_id: f.data.cred.cookie && f.data.cred.cookie.sessionid
                            }, e.store({
                                key: "auth",
                                value: g
                            }), f.data.cred.authResponse = g, k._store("/users/me", "GET", b), f._mergeGroupInfo(), 
                            e.isFunction(c) && c.call(d || a, b), j.log.info("Logged in successfully.[fresh]");
                        },
                        error: function(b, f) {
                            e.isFunction(c) && c.call(d || a, e.extend(b, {
                                xhr: f
                            })), j.log.error("Login Failed.", b);
                        }
                    }));
                },
                logout: function(b, c) {
                    var d = this;
                    e.ajax({
                        url: this.proto.LOGOUT.apiUrl,
                        data: {
                            type: this.proto.LOGOUT.mxType
                        },
                        success: function() {
                            e.isFunction(b) && b.call(c || a, !0), d.log.info("Logged out.");
                        },
                        error: function(f) {
                            e.isFunction(b) && b.call(c || a, !1), d.log.error("Logout Failed.", f);
                        }
                    });
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        users: {
            name: "user",
            subscribe: !1,
            urlExp: /^\/users$/,
            apiUrl: "/user",
            POST: {
                mxType: "USER_REQUEST_REGISTER",
                resultNS: "object.user",
                dataFormatter: function(a, b, c, d, e) {
                    if (e) {
                        var f = {
                            url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                            data: {
                                type: this.proto[c].mxType,
                                object: {
                                    user: {
                                        first_name: e.first_name,
                                        last_name: e.last_name,
                                        name: e.name || e.first_name + " " + e.last_name,
                                        email: e.email,
                                        pass: e.pass
                                    }
                                }
                            }
                        };
                        if (e.token) {
                            var g;
                            "group" === e.type ? g = "GROUP_REQUEST_INVITE_TOKEN" : "binder" === e.type && (g = "BOARD_REQUEST_VIEW_TOKEN"), 
                            g && (f.data.params = [ {
                                name: g,
                                string_value: e.token
                            } ]);
                        }
                        return e.trial && (f.data.params = [ {
                            name: "USER_REQUEST_REGISTER_NO_QS_BOARDS"
                        }, {
                            name: "USER_REQUEST_EMAIL_OFF"
                        } ]), f;
                    }
                    this.log.error("Register failed, register infos needed.");
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        user: {
            name: "user",
            subscribe: !0,
            urlExp: /^\/users\/([^\/]+)$/,
            apiUrl: "/user",
            SUBSCRIBE: {
                apiUrl: "/user",
                localStore: "/users/me",
                resultNS: "object.user",
                filterNS: "object.user.boards",
                mxType: "USER_REQUEST_SUBSCRIBE",
                sortNS: "boards",
                resultSorter: function(a, b) {
                    var c = 1 * a.order_number || 1 * a.sequence, d = 1 * b.order_number || 1 * b.sequence;
                    return "BOARD_INVITED" === a.status && "BOARD_INVITED" !== b.status ? -1 : "BOARD_INVITED" === b.status && "BOARD_INVITED" !== a.status ? 1 : c === d ? 0 : c > d ? 1 : -1;
                },
                dataFormatter: function(a, b, c, d, e) {
                    var f = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        data: {
                            type: d,
                            params: [ {
                                name: "BOARD_REQUEST_READ_FEEDS_INDEXED"
                            } ]
                        }
                    };
                    return void 0 !== e && (f.data.object = {}, f.data.object[a] = e), f;
                },
                resultFormatter: function(a, b, c, d, e) {
                    return e = f.models.main.proto.resultFormatter.apply(this, arguments), e.feed_unread_count = f.data.feed_unread_count, 
                    e;
                }
            },
            GET: {
                mxType: "USER_REQUEST_READ",
                mxTypeLogin: "USER_REQUEST_LOGIN",
                mxTypeReadCap: "USER_REQUEST_READ_CAP",
                mxTypeReadSsoOptions: "USER_REQUEST_READ_SSO_OPTIONS",
                mxTypeVerifyEmailToken: "USER_REQUEST_VERIFY_EMAIL_TOKEN",
                localStore: "/users/me",
                apiUrl: "/user",
                resultNS: "object.user",
                sortNS: "boards",
                resultSorter: function(a, b) {
                    var c = 1 * a.order_number || 1 * a.sequence, d = 1 * b.order_number || 1 * b.sequence;
                    return "BOARD_INVITED" === a.status && "BOARD_INVITED" !== b.status ? -1 : "BOARD_INVITED" === b.status && "BOARD_INVITED" !== a.status ? 1 : c === d ? 0 : c > d ? 1 : -1;
                },
                apiMethod: "POST",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h, i = f[2];
                    return f[2] && f[2].verify && (f[2].localFirst = !1, f[2].store = !1), g = b.match(this.proto.urlExp)[1] || "", 
                    g = "me" === g ? "" : g, i && "validate_token" === i.action ? h = {
                        url: "/user?setcookie=1&access_token=" + encodeURIComponent(e.accessToken),
                        method: "GET"
                    } : i && "read_cap" === i.action ? h = {
                        resultNS: "object.user.cap",
                        localFirst: !1,
                        data: {
                            type: this.proto[c].mxTypeReadCap
                        }
                    } : i && "verify_email_token" === i.action ? e && e.token ? h = {
                        resultNS: "object.user",
                        localFirst: !1,
                        data: {
                            type: this.proto[c].mxTypeVerifyEmailToken,
                            object: {
                                user: {
                                    email_verification_token: e.token
                                }
                            }
                        }
                    } : void this.log.error("The email verify token must be passed.") : i && "read_sso_options" === i.action ? h = {
                        resultNS: "object.user.groups",
                        localFirst: !1,
                        data: {
                            type: this.proto[c].mxTypeReadSsoOptions,
                            object: {
                                user: {
                                    email: e && e.email || ""
                                }
                            }
                        }
                    } : i && "salesforce_login" === i.action ? e && e.login_url && e.token ? h = {
                        resultNS: "object.user",
                        localFirst: !1,
                        data: {
                            type: this.proto[c].mxTypeLogin,
                            object: {
                                user: {
                                    type: "USER_TYPE_FORCE",
                                    pass: e.token
                                }
                            },
                            params: [ {
                                name: "USER_REQUEST_SALES_FORCE_CONNECT_URL",
                                string_value: e.login_url
                            } ]
                        }
                    } : void this.log.error("The login_url and token is needed.", f) : (h = {
                        url: f[2] && f[2].verify && "/user/me" || (this.proto[c].apiUrl || this.proto.apiUrl || b) + (g && "/" + g || ""),
                        method: f[2] && f[2].verify && "GET" || this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            id: g || void 0
                        }
                    }, void 0 !== e && (h.data.object = {}, h.data.object[a] = e), h);
                }
            },
            PUT: {
                mxType: "USER_REQUEST_UPDATE",
                mxTypeUpdateEmail: "USER_REQUEST_UPDATE_EMAIL",
                mxTypeUpdatePassword: "USER_REQUEST_CHANGE_PASSWORD",
                mxTypeReverify: "USER_REQUEST_RESEND_VERIFICATION_EMAIL",
                mxTypeResetPass: "USER_REQUEST_RESET_PASSWORD",
                mxTypeFeedback: "USER_REQUEST_FEEDBACK",
                resultNS: "object.user",
                defaultResult: {},
                dataFormatter: function(a, b, c, f, g, h) {
                    var i, j, k, l, m = h[2];
                    if (i = b.match(this.proto.urlExp)[1] || "", i = "me" === i ? void 0 : i, m && "remove_photo" === m.action) return j = {
                        data: {
                            type: "USER_REQUEST_UPDATE_PICTURES",
                            object: {
                                user: {
                                    picture: 0,
                                    picture2x: 0,
                                    picture4x: 0
                                }
                            }
                        }
                    };
                    if (m && "send_feedback" === m.action) return g && g.message ? (j = {
                        data: {
                            type: this.proto[c].mxTypeFeedback,
                            params: [ {
                                name: "USER_REQUEST_FEEDBACK_MESSAGE",
                                string_value: g.message
                            } ]
                        }
                    }, g.subject && j.data.params.push({
                        name: "USER_REQUEST_FEEDBACK_SUBJECT",
                        string_value: g.subject
                    }), j) : void this.log.error("Message is required when send feedback");
                    if (m && "reset_password" === m.action) return g && (g.email || g.verify_token && g.pass) ? j = {
                        data: {
                            type: this.proto[c].mxTypeResetPass,
                            object: {
                                user: {
                                    email: g.email,
                                    pass: g.pass,
                                    email_verification_token: g.verify_token
                                }
                            }
                        }
                    } : void this.log.error("Reset password: user email/pass is required.");
                    if (m && "change_password" === m.action) return g && g.old_password && g.new_password ? j = {
                        data: {
                            type: this.proto[c].mxTypeUpdatePassword,
                            object: {
                                user: {
                                    pass: g.new_password,
                                    old_pass: g.old_password
                                }
                            }
                        }
                    } : void this.log.error("change_password needs both old password and new password");
                    if (m && "resend_verify_email" === m.action) return d.api("/users/me", "GET", null, function(a) {
                        l = a && a.data && a.data.email;
                    }), j = {
                        data: {
                            type: this.proto[c].mxTypeReverify,
                            object: {
                                user: {
                                    email: l
                                }
                            }
                        }
                    };
                    if (m && "update_email" === m.action && g && g.email) return j = {
                        data: {
                            type: this.proto[c].mxTypeUpdateEmail,
                            object: {
                                user: {
                                    email: g.email
                                }
                            }
                        }
                    };
                    if (g && g.hasOwnProperty("avatar")) {
                        if (!g.avatar) return j = {
                            data: {
                                type: this.proto[c].special.avatar.mxType,
                                object: {
                                    user: {
                                        id: i && "me" !== i ? i : e.ns(this.config.context.models.main.data.cred, "authResponse.c_user", e.CONSTS.ISNSREAD),
                                        picture: 0,
                                        picture2x: 0,
                                        picture4x: 0
                                    }
                                }
                            }
                        }, delete h[2].data.avatar, "{}" !== JSON.stringify(h[2].data) && this.api.apply(this, h), 
                        j;
                        k = g.avatar, delete h[2].data.avatar, "{}" !== JSON.stringify(h[2].data) && this.api.apply(this, h), 
                        g.file = k;
                    }
                    return g && g.file ? j = {
                        url: this.proto[c].special.avatar.apiUrl + "?type=original&name=" + g.file.name,
                        data: g.file
                    } : (j = {
                        url: (this.proto[c].apiUrl || this.proto.apiUrl || b) + (i && "/" + i || ""),
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: f
                        }
                    }, void 0 !== g && (j.data.object = {}, j.data.object[a] = g)), j;
                },
                special: {
                    avatar: {
                        apiUrl: "/user/upload"
                    }
                }
            },
            CHAT: {
                dataFormatter: function(b, c, g, h, i, j) {
                    var k, l, m, n;
                    k = c.match(this.proto.urlExp)[1] || "", k === d.getMe().email ? f.api("/binders", "GET", {
                        filter: function(a) {
                            if (a.board.isconversation && 1 === a.board.users.length) for (l = 0, m = a.board.users.length; m > l; l++) if (k && a.board.users[l].user.email === k) return !0;
                            return !1;
                        },
                        sort: "board.users.length"
                    }, function(b) {
                        b && b.data && (b.data[0] ? e.isFunction(j[3]) && j[3].call(j[4] || a, {
                            code: e.CONSTS.RESPONSE_SUCCESS,
                            data: b.data[0] && b.data[0].board
                        }) : f.api("/binders", "POST", {
                            data: {
                                isconversation: !0,
                                direct_chat: !0
                            }
                        }, function(b) {
                            e.isFunction(j[3]) && j[3].call(j[4] || a, {
                                code: e.CONSTS.RESPONSE_SUCCESS,
                                data: b.data,
                                message: ""
                            });
                        }));
                    }) : k ? f.api("/binders", "GET", {
                        filter: function(a) {
                            if (a.board.isconversation && 2 === a.board.users.length) for (l = 0, m = a.board.users.length; m > l; l++) if (k && a.board.users[l].user.email === k) return !0;
                            return !1;
                        },
                        sort: "board.users.length"
                    }, function(b) {
                        b && b.data && (b.data[0] ? e.isFunction(j[3]) && j[3].call(j[4] || a, {
                            code: e.CONSTS.RESPONSE_SUCCESS,
                            data: b.data[0] && b.data[0].board
                        }) : f.api("/binders", "POST", {
                            data: {
                                isconversation: !0,
                                direct_chat: !0
                            }
                        }, function(b) {
                            b && b.data && (n = {
                                data: {
                                    users: [ {} ]
                                }
                            }, n.data.users[0] = {
                                email: k
                            }, f.api("/binders/" + b.data.id + "/users", "POST", n, function(c) {
                                c.data && b.data.users.push(c.data[0]), Moxtra.parseData({
                                    code: "RESPONSE_SUCCESS",
                                    object: {
                                        board: b.data
                                    }
                                }), c && c.data && e.isFunction(j[3]) && j[3].call(j[4] || a, {
                                    code: e.CONSTS.RESPONSE_SUCCESS,
                                    data: b.data,
                                    message: ""
                                });
                            }));
                        }));
                    }) : this.log.error("email is required to start chat");
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        groups: {
            name: "user",
            subscribe: !1,
            urlExp: /^\/groups$/,
            apiUrl: "/user",
            localStore: "disabled",
            rootUrl: "",
            GET: {
                mxType: "USER_REQUEST_READ",
                apiMethod: "POST",
                localStore: "/users/me",
                resultNS: "object.user.groups"
            },
            POST: {
                mxType: "GROUP_REQUEST_CREATE",
                mxTypeJoinViaInvitation: "GROUP_REQUEST_JOIN_VIA_INVITATION",
                apiMethod: "POST",
                resultNS: "object.group",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h = f[2];
                    return h && "join_via_invitation" === h.action ? e && e.token ? g = {
                        url: "/group",
                        data: {
                            type: this.proto[c].mxTypeJoinViaInvitation,
                            params: [ {
                                name: "GROUP_REQUEST_INVITE_TOKEN",
                                string_value: e.token
                            } ]
                        }
                    } : void this.log.error("Join via invitation: token is required.") : e && e.name && e.plan_code ? g = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    name: e.name,
                                    plan_code: e.plan_code,
                                    plan_quantity: e.plan_quantity || 1
                                }
                            }
                        }
                    } : void this.log.error("The Group name and plan code is required.");
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        group: {
            name: "group",
            subscribe: !0,
            urlExp: /^\/groups\/([^\/]+)$/,
            apiUrl: "/group",
            localStore: "disabled",
            resultNS: "object.group",
            GET: {
                mxType: "GROUP_REQUEST_READ",
                localStore: "disabled",
                actions: {
                    view_invitation: {
                        mxType: "GROUP_REQUEST_VIEW_INVITATION",
                        localStore: "disabled"
                    }
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j = g[2];
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, j && j.action ? "view_invitation" === j.action ? f && f.token ? i = {
                        url: this.proto.apiUrl,
                        localStore: "disabled",
                        data: {
                            type: this.proto[c].actions[j.action].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            },
                            params: [ {
                                name: "GROUP_REQUEST_INVITE_TOKEN",
                                string_value: f.token
                            } ]
                        }
                    } : void this.log.error("View Invitation: token is required.") : i = {
                        url: this.proto.apiUrl,
                        localStore: "disabled",
                        responseType: this.proto[c].actions[j.action].responseType,
                        data: {
                            type: this.proto[c].actions[j.action].mxType,
                            object: {
                                group: {
                                    id: h,
                                    plan_code: f && f.plan_code || void 0
                                }
                            }
                        }
                    } : i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            }
                        }
                    };
                }
            },
            PUT: {
                mxType: "GROUP_REQUEST_UPDATE",
                actions: {
                    join: {
                        mxType: "GROUP_REQUEST_JOIN"
                    },
                    leave: {
                        mxType: "GROUP_REQUEST_LEAVE"
                    },
                    resend_invitation_email: {
                        mxType: "GROUP_REQUEST_RESEND_INVITATION_EMAIL",
                        resultNS: ""
                    }
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j = g[2];
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, !j || "join" !== j.action && "leave" !== j.action && "request_group_sync" !== j.action ? j && "resend_invitation_email" === j.action ? f && f.login_url && f.token ? i = {
                        url: this.proto[c].actions[j.action].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].actions[j.action].mxType,
                            params: [ {
                                name: "USER_REQUEST_SALES_FORCE_CONNECT_URL",
                                string_value: f.login_url
                            } ],
                            object: {
                                user: {
                                    type: "USER_TYPE_FORCE",
                                    pass: f.token
                                }
                            }
                        }
                    } : void this.log.error("Resend invitation email: The login_url and token is required.") : f ? i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h,
                                    name: f.name,
                                    plan_code: f.plan_code || void 0,
                                    plan_quantity: f.plan_quantity || void 0
                                }
                            }
                        }
                    } : void this.log.error("No group data provided for GROUP_REQUEST_UPDATE.") : i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].actions[j.action].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "GROUP_REQUEST_CANCEL",
                dataFormatter: function(a, b, c, d, f, g) {
                    {
                        var h, i;
                        g[2];
                    }
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            }
                        }
                    }, f && f.message && (i.data.params = [ {
                        name: "GROUP_REQUEST_CANCEL_MESSAGE",
                        string_value: f.message
                    } ]), i;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "group.binders": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/groups\/([^\/]+)\/binders$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            POST: {
                mxType: "BOARD_REQUEST_INVITE",
                apiMethod: "POST",
                resultNS: "object.board",
                dataFormatter: function(a, b, c, f, g, h) {
                    {
                        var i, j, k;
                        h[2];
                    }
                    return i = b.match(this.proto.urlExp)[1], (i = "current" === i ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : i) ? j = {
                        url: "/board",
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g.binder_id,
                                    users: [ {
                                        type: g.access_type || "BOARD_READ",
                                        group: {
                                            id: k || i
                                        }
                                    } ]
                                }
                            }
                        }
                    } : void d.api("/groups", "GET", {
                        filter: "group.status!==GROUP_CANCELED_SUBSCRIPTION,group.status!==GROUP_EXPIRED_SUBSCRIPTION"
                    }, function(a) {
                        a && a.data && a.data.length && (k = a.data[0].group.id, d.api(b.replace("current", k), c, h[2], h[3], h[4]));
                    }, this);
                }
            },
            GET: {
                mxType: "GROUP_REQUEST_READ",
                mxTypeSearch: "BOARD_REQUEST_SEARCH_GROUP_BOARD",
                apiMethod: "POST",
                resultNS: "object.group.boards",
                defaultResult: [],
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j = g[2];
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, j && "search" === j.action ? (f && void 0 !== f.text ? i = {
                        url: "/group",
                        resultNS: "object.user.groups.0.group.boards",
                        localFirst: !1,
                        localStore: "disabled",
                        data: {
                            type: this.proto[c].mxTypeSearch,
                            params: [ {
                                name: "BOARD_REQUEST_SEARCH_TEXT",
                                string_value: f.text
                            }, {
                                name: "BOARD_REQUEST_SEARCH_SIZE",
                                string_value: "100"
                            } ]
                        }
                    } : this.log.error("Search in Group: the keyword(data.text) must be set."), i) : i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            }
                        }
                    };
                }
            },
            PUT: {
                mxType: "GROUP_REQUEST_UPDATE",
                mxTypeTransfer: "GROUP_REQUEST_USER_TRANSFER",
                apiMethod: "POST",
                resultNS: "object.user.boards",
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j = g[2], k = [];
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, j && "transfer" === j.action && f && f.user && f.binders && f.member ? (f.binders.forEach(function(a) {
                        a && a.id && k.push({
                            board: a
                        });
                    }), i = {
                        url: "/user",
                        data: {
                            type: this.proto[c].mxTypeTransfer,
                            object: {
                                group: {
                                    id: h,
                                    members: [ {
                                        user: f.member
                                    } ]
                                },
                                user: {
                                    id: f.user.id || void 0,
                                    board: k
                                }
                            }
                        }
                    }) : void 0;
                }
            },
            DELETE: {
                mxType: "GROUP_REQUEST_BOARD_LEAVE",
                apiMethod: "POST",
                resultNS: "object.board",
                dataFormatter: function(a, b, c, f, g, h) {
                    {
                        var i, j, k;
                        h[2];
                    }
                    return i = b.match(this.proto.urlExp)[1], (i = "current" === i ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : i) ? j = {
                        url: "/board",
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g.binder_id
                                },
                                group: {
                                    id: k || i
                                }
                            }
                        }
                    } : void d.api("/groups", "GET", {
                        filter: "group.status!==GROUP_CANCELED_SUBSCRIPTION,group.status!==GROUP_EXPIRED_SUBSCRIPTION"
                    }, function(a) {
                        a && a.data && a.data.length && (k = a.data[0].group.id, d.api(b.replace("current", k), c, h[2], h[3], h[4]));
                    }, this);
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "group.integration": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/groups\/([^\/]+)\/integrations\/(\d+)$/,
            apiUrl: "/board",
            apiMethod: "POST",
            PUT: {
                mxType: "GROUP_REQUEST_UPDATE_INTEGRATION",
                mxTypeVerify: "GROUP_REQUEST_VERIFY_INTEGRATION",
                apiMethod: "POST",
                apiUrl: "/group",
                resultNS: "object.group.integrations",
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j, k, l = g[2];
                    return h = b.match(this.proto.urlExp), i = h && h[1], j = h && 1 * h[2], i = "current" === i ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : i, l && "verify" === l.action ? k = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxTypeVerify,
                            object: {
                                group: {
                                    id: i,
                                    integrations: [ {
                                        sequence: j
                                    } ]
                                }
                            }
                        }
                    } : f ? (f.type && "GROUP_INTEGRATION_SALESFORCE" !== f.type ? "GROUP_INTEGRATION_SAML" === f.type && (k = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: i,
                                    integrations: [ {
                                        sequence: j,
                                        enable_auto_provision: f.enable_auto_provision === !1 ? !1 : !0,
                                        idp_conf: f.idp_conf,
                                        saml_email_domain: f.saml_email_domain
                                    } ]
                                }
                            }
                        }
                    }) : k = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: i,
                                    integrations: [ {
                                        sequence: j,
                                        enable_auto_provision: f.enable_auto_provision
                                    } ]
                                }
                            }
                        }
                    }, k) : void this.log("Update integration: data is required");
                }
            },
            DELETE: {
                mxType: "GROUP_REQUEST_DELETE_INTEGRATION",
                apiMethod: "POST",
                apiUrl: "/group",
                resultNS: "object.group.integrations",
                dataFormatter: function(a, b, c, d, f, g) {
                    {
                        var h, i, j, k;
                        g[2];
                    }
                    return h = b.match(this.proto.urlExp), i = h && h[1], j = h && 1 * h[2], i = "current" === i ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : i, k = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: i,
                                    integrations: [ {
                                        sequence: j
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "group.integrations": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/groups\/([^\/]+)\/integrations$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "GROUP_REQUEST_READ",
                apiMethod: "POST",
                apiUrl: "/user",
                resultNS: "object.group.integrations",
                dataFormatter: function(a, b, c, d, f, g) {
                    {
                        var h, i;
                        g[2];
                    }
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, i = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "GROUP_REQUEST_CREATE_INTEGRATION",
                apiMethod: "POST",
                apiUrl: "/group",
                resultNS: "object.group.integrations",
                dataFormatter: function(a, b, c, d, f, g) {
                    {
                        var h, i;
                        g[2];
                    }
                    return h = b.match(this.proto.urlExp)[1], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, f.type && "GROUP_INTEGRATION_SALESFORCE" !== f.type ? "GROUP_INTEGRATION_SAML" === f.type ? i = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h,
                                    integrations: [ {
                                        type: f.type,
                                        idp_conf: f.idp_conf,
                                        enable_auto_provision: f.enable_auto_provision === !1 ? !1 : !0,
                                        saml_email_domain: f.saml_email_domain
                                    } ]
                                }
                            }
                        }
                    } : void 0 : i = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: h,
                                    integrations: [ {
                                        type: f.type,
                                        sf_org_id: f.sf_org_id,
                                        enable_auto_provision: f.enable_auto_provision
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "group.member": {
            name: "group",
            subscribe: !1,
            urlExp: /^\/groups\/([^\/]+)\/members\/(\d+|[a-zA-Z]+)$/,
            apiUrl: "/group",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "GROUP_REQUEST_USER_READ",
                dataFormatter: function(a, b, c, d) {
                    var f, g, h, i;
                    return i = b.match(this.proto.urlExp), f = i[1], g = 1 * i[2], f = "current" === f ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : f, h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: d,
                            object: {
                                group: {
                                    id: f,
                                    members: [ {
                                        sequence: g
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "GROUP_REQUEST_EXPEL",
                resultNS: "object.group.members.0",
                dataFormatter: function(a, b, c, d) {
                    var f, g, h, i;
                    return i = b.match(this.proto.urlExp), f = i[1], g = 1 * i[2], f = "current" === f ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : f, h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: d,
                            object: {
                                group: {
                                    id: f,
                                    members: [ {
                                        sequence: g
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            PUT: {
                resultNS: "object.group.members.0",
                mxTypeUsers: {
                    update_user: {
                        mxType: "GROUP_REQUEST_USER_UPDATE"
                    },
                    enable: {
                        mxType: "GROUP_REQUEST_USER_ENABLE"
                    },
                    disable: {
                        mxType: "GROUP_REQUEST_USER_DISABLE"
                    },
                    transfer: {
                        mxType: "GROUP_REQUEST_USER_TRANSFER"
                    }
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j, k, l, m;
                    l = g[2] || {}, l.action = l.action || "update_user", f && (f.user = f.user || {});
                    var n = function(a) {
                        return a.user.first_name && a.user.last_name && a.user.first_name + " " + a.user.last_name || a.user.first_name || a.user.last_name;
                    };
                    if (m = this.proto.PUT.mxTypeUsers[l.action], k = b.match(this.proto.urlExp), h = k[1], 
                    i = k[2], h = "current" === h ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : h, isNaN(1 * i)) return void this.log.error("Invalid sequence in URL = " + b);
                    switch (i = 1 * i, j = {
                        url: this.proto.apiUrl,
                        data: {
                            type: m.mxType,
                            object: {
                                group: {
                                    id: h,
                                    members: [ {
                                        sequence: i
                                    } ]
                                }
                            }
                        }
                    }, l.action) {
                      case "transfer":
                        var o = [];
                        if (!(f.binderIds && e.isArray(f.binderIds) && f.target_sequence)) return void this.log.error("Invalid params data for transfer API", f);
                        f.binderIds.forEach(function(a) {
                            o.push({
                                board: {
                                    id: a
                                }
                            });
                        }), j.data.object.group.members[0].user = {
                            boards: o
                        }, j.data.object.group.members[1] = {
                            sequence: 1 * f.target_sequence
                        };
                        break;

                      case "update_user":
                        j.data.object.group.members[0].user = {
                            name: n(f),
                            first_name: f.user.first_name,
                            last_name: f.user.last_name
                        }, j.data.object.group.members[0].type = f.user.type ? "GROUP_ADMIN_ACCESS" : "GROUP_MEMBER_ACCESS";
                        break;

                      case "enable":
                      case "disable":                    }
                    return j;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "group.members": {
            name: "group",
            subscribe: !1,
            urlExp: /^\/groups\/([^\/]+)\/members$/,
            apiUrl: "/group",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "GROUP_REQUEST_READ",
                resultNS: "object.group.members",
                dataFormatter: function(a, b, c) {
                    var d, f;
                    return d = b.match(this.proto.urlExp)[1], d = "current" === d ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : d, f = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                group: {
                                    id: d
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "GROUP_REQUEST_INVITE",
                resultNS: "object.group.members.0",
                dataFormatter: function(a, b, c, d, f) {
                    var g, h;
                    g = b.match(this.proto.urlExp)[1], g = "current" === g ? (e.ns(e.store({
                        key: "/users/me"
                    }), "object.group", e.CONSTS.ISNSREAD) || {}).id : g;
                    var i = function(a) {
                        return a.user.first_name && a.user.last_name && a.user.first_name + " " + a.user.last_name || a.user.first_name || a.user.last_name;
                    };
                    return f && f.user && f.user.email ? h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: d,
                            object: {
                                group: {
                                    id: g,
                                    members: [ {
                                        user: {
                                            email: f.user.email,
                                            name: i(f),
                                            first_name: f.user.first_name,
                                            last_name: f.user.last_name
                                        },
                                        type: void 0 !== f.user.type ? f.user.type ? "GROUP_ADMIN_ACCESS" : "GROUP_MEMBER_ACCESS" : void 0
                                    } ]
                                }
                            }
                        }
                    } : void this.log.error("User information is required for add to group.");
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        categories: {
            name: "user",
            subscribe: !1,
            urlExp: /^.*\/users\/([^\/]+)\/categories$/,
            apiUrl: "/user",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "",
                apiUrl: "/user",
                apiMethod: "GET",
                localStore: "/users/me",
                resultNS: "object.user.categories"
            },
            POST: {
                mxType: "USER_REQUEST_CATEGORY_CREATE",
                resultNS: "object.user.categories",
                dataFormatter: function(a, b, c, d, f) {
                    var g = {
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                user: {
                                    categories: [ {
                                        name: f && f.name,
                                        client_uuid: e.genUUID()
                                    } ]
                                }
                            }
                        }
                    };
                    return g;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        category: {
            name: "user",
            subscribe: !1,
            urlExp: /^.*\/users\/([^\/]+)\/(?:categories\/([^\/?]+))$/,
            apiUrl: "/user",
            localStore: "../../",
            apiMethod: "POST",
            GET: {
                dataFormatter: function(b, c, d, g, h, i) {
                    var j, k = c.match(this.proto.urlExp)[2], l = i[3], m = i[4];
                    j = "sequence===" + k, f.api("/users/me/categories", "GET", {
                        filter: j
                    }, function(b) {
                        b && b.data && b.data[0] && b.data[0] && b.data[0].sequence ? f.api("/binders", "GET", {
                            filter: "category===" + k
                        }, function(c) {
                            c && c.data && (b.data[0].binders = c.data), e.isFunction(l) && l.call(m || a, {
                                code: e.CONSTS.RESPONSE_SUCCESS,
                                data: b.data[0]
                            });
                        }) : e.isFunction(l) && l.call(m || a, {
                            code: e.CONSTS.RESPONSE_SUCCESS
                        });
                    });
                }
            },
            PUT: {
                mxType: "USER_REQUEST_CATEGORY_RENAME",
                resultNS: "object.user.categories",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h, i;
                    return i = b.match(this.proto.urlExp), g = i[1], g = "me" === g ? "" : g, h = 1 * i[2], 
                    f = {
                        url: (this.proto[c].apiUrl || this.proto.apiUrl) + (g ? "/" + g : ""),
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                user: {
                                    categories: [ {
                                        name: e && e.name,
                                        sequence: h
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "USER_REQUEST_CATEGORY_DELETE",
                resultNS: "object.user.categories",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g;
                    return g = b.match(this.proto.urlExp), e = g[1], e = "me" === e ? "" : e, f = 1 * g[2], 
                    d = {
                        url: (this.proto[c].apiUrl || this.proto.apiUrl) + (e ? "/" + e : ""),
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                user: {
                                    categories: [ {
                                        sequence: f
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        binders: {
            name: "board",
            subscribe: !1,
            urlExp: /^(?:\/users\/([^\/]+))?\/binders$/,
            apiUrl: "/board",
            apiMethod: "POST",
            GET: {
                mxType: "USER_REQUEST_READ",
                mxTypeSearch: "BOARD_REQUEST_SEARCH_BOARD",
                mxTypeSearchText: "BOARD_REQUEST_SEARCH_TEXT",
                apiUrl: "/user",
                apiMethod: "POST",
                localStore: "/users/me",
                resultNS: "object.user.boards",
                defaultResult: [],
                defaultFilter: "!board.islive",
                resultSorter: function(a, b) {
                    var c = 1 * a.order_number || 1 * a.sequence, d = 1 * b.order_number || 1 * b.sequence;
                    return "BOARD_INVITED" === a.status && "BOARD_INVITED" !== b.status ? -1 : "BOARD_INVITED" === b.status && "BOARD_INVITED" !== a.status ? 1 : c === d ? 0 : c > d ? 1 : -1;
                },
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h, i = f[2];
                    return g = b.match(this.proto.urlExp)[1] || "", g = "me" === g ? "" : g, h = {
                        url: g ? this.proto[c].apiUrl + "/" + g : this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d
                        }
                    }, void 0 !== e && (h.object = {}, h.object[a] = e), i && "search" === i.action && e && e.text && (h = {
                        localStore: "disabled",
                        localFirst: !1,
                        skipDefaultFilter: !0,
                        url: "/board",
                        method: this.proto[c].apiMethod,
                        data: {
                            type: this.proto[c].mxTypeSearch,
                            params: [ {
                                name: this.proto[c].mxTypeSearchText,
                                string_value: e && e.text
                            }, {
                                name: "BOARD_REQUEST_SEARCH_SIZE",
                                string_value: "100"
                            } ]
                        }
                    }), h;
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_CREATE",
                mxTypeSave: "BOARD_REQUEST_COPY_PAGES",
                apiUrl: "/board",
                resultNS: "object.board",
                special: {
                    clone: {
                        mxType: "BOARD_REQUEST_DUPLICATE"
                    }
                },
                dataFormatter: function(a, b, c, d, g, h) {
                    var i, j = h[2];
                    if (j && "saveFrom" === j.action) {
                        if (!g || !g.idFromBinder) return void this.log.error("Save binder from meet: the meet's binder id is required.");
                        i = {
                            url: this.proto[c].apiUrl,
                            data: {
                                type: this.proto[c].mxTypeSave,
                                object: {
                                    user: {
                                        boards: [ {
                                            board: {
                                                id: g.idFromBinder
                                            }
                                        } ]
                                    },
                                    board: {
                                        name: g && g.name || ""
                                    }
                                }
                            }
                        };
                    } else if (g && g.clone) i = {
                        url: this.proto[c].apiUrl,
                        data: {
                            type: this.proto[c].special.clone.mxType,
                            object: {
                                user: {
                                    boards: [ {
                                        board: {
                                            id: g.clone
                                        }
                                    } ]
                                },
                                board: {
                                    name: g && g.name,
                                    client_uuid: e.genUUID()
                                }
                            }
                        }
                    }; else {
                        var k = e.genUUID();
                        g.islive || g.isnote || g.direct_chat || f.data.self_created_boards.push({
                            req_data: g,
                            client_uuid: k,
                            callback: h[3],
                            context: h[4]
                        }), i = {
                            url: this.proto[c].apiUrl,
                            data: {
                                type: this.proto[c].mxType,
                                object: {
                                    board: {
                                        name: g && g.name,
                                        client_uuid: k,
                                        isconversation: g && g.isconversation,
                                        islive: g && void 0 !== g.islive ? g.islive : void 0,
                                        isnote: g && void 0 !== g.isnote ? g.isnote : void 0
                                    },
                                    users: g && g.users,
                                    params: g && g.params
                                }
                            }
                        }, g.direct_chat && (i.direct_chat = !!g.direct_chat);
                    }
                    return g && g.isnote && i && i.data && (i.data.params = i.data.params || [], i.data.params.push({
                        name: "BOARD_REQUEST_CREATE_AS_TEMP"
                    })), i;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        binder: {
            name: "board",
            subscribe: !0,
            urlExp: /^\/binders\/(([a-zA-Z][^\/]+)|invitation)$/,
            apiUrl: "/board",
            apiMethod: "POST",
            SUBSCRIBE: {
                apiUrl: "/board",
                resultNS: "",
                mxType: "BOARD_REQUEST_SUBSCRIBE",
                sortNS: "object.board.pages",
                resultSorter: function(a, b) {
                    var c = 1 * a.page_number || 1 * a.sequence, d = 1 * b.page_number || 1 * b.sequence;
                    return c === d ? 0 : c > d ? 1 : -1;
                },
                dataFormatter: function(a, b, c, d) {
                    var e = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        data: {
                            type: d,
                            params: [ {
                                name: "BOARD_REQUEST_READ_FEEDS_INDEXED"
                            } ]
                        }
                    };
                    return e;
                },
                resultFormatter: function(a, b, c, d, e) {
                    var g = f.models.meet && f.models.meet.proto.data, h = g && g.active && e && e.object && g.active.board_id === e.object.board.id;
                    return e = f.models.main.proto.resultFormatter.apply(this, arguments), h && (g.board = this._merge(g.board || {}, e && e.object.board || void 0)) && (g.active = this._merge(g.active || {}, e && e.action || void 0)), 
                    e;
                }
            },
            GET: {
                mxType: "BOARD_REQUEST_READ",
                mxTypeSearch: "BOARD_REQUEST_SEARCH_BOARD",
                mxTypeSearchText: "BOARD_REQUEST_SEARCH_TEXT",
                resultNS: "",
                dataFormatter: function(b, c, d, f, g, h) {
                    var i, j, k, l = h[2], m = h[3], n = h[4], o = "pdf";
                    if (i = c.match(this.proto.urlExp)[1] || "", k = 1 * i === 1 * i ? "session_key" : "board_id", 
                    "board_id" === k) {
                        if (j = {
                            url: this.proto.apiUrl,
                            data: {
                                type: f,
                                object: {
                                    board: {
                                        id: "invitation" === i ? void 0 : i
                                    }
                                }
                            }
                        }, "invitation" === i && (j.data.type = "BOARD_REQUEST_VIEW_INVITATION"), l && "download" === l.action) return j = {
                            code: e.CONSTS.RESPONSE_SUCCESS,
                            data: "/board/" + i + "/download?d=&type=" + (g && g.type || o) + (g && g.pages && "?pages=" + g.pages || ""),
                            message: ""
                        }, this.log.info("Got data from local:", c, d, j), void (e.isFunction(m) && m.call(n || a, j));
                        l && "search" === l.action && g && g.text && (j.data.type = this.proto[d].mxTypeSearch, 
                        j.localFirst = !1, j.localStore = "disabled", j.data.params = [ {
                            name: this.proto[d].mxTypeSearchText,
                            string_value: g && g.text
                        }, {
                            name: "BOARD_REQUEST_SEARCH_SIZE",
                            string_value: "100"
                        } ]);
                    } else "session_key" === k && (j = {
                        url: this.proto[d].apiUrl || this.proto.apiUrl || c,
                        method: this.proto[d].apiMethod || this.proto.apiMethod || d,
                        data: {
                            type: f,
                            action: {
                                session_key: i
                            }
                        }
                    });
                    return j;
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE",
                mxTypeJoin: "BOARD_REQUEST_JOIN",
                mxTypeLeave: "BOARD_REQUEST_LEAVE",
                mxTypeShare: "BOARD_REQUEST_CREATE_VIEW_TOKEN",
                mxTypeShareEmail: "BOARD_REQUEST_EMAIL_VIEW_TOKEN",
                resultNS: "object.board",
                dataFormatter: function(b, c, f, g, h, i) {
                    var j, k, l, m, n = i[2], o = this, p = i[3], q = i[4];
                    if (j = c.match(this.proto.urlExp)[1] || "", n && "silent_message" === n.action) {
                        var r = e.store({
                            key: "notification"
                        }) || [], s = r.indexOf(j);
                        return h.value ? s > -1 ? "" : r.push(j) : s > -1 ? r.splice(s, 1) : "", e.store({
                            key: "notification",
                            value: r
                        }), k = {
                            code: e.CONSTS.RESPONSE_SUCCESS,
                            data: h.value,
                            message: ""
                        }, void (e.isFunction(p) && p.call(q || a, k));
                    }
                    if (h && void 0 !== h.notification && (l = Moxtra.getMe().id, d.api(c, "GET", null, function(a) {
                        return a && a.object && a.object.board && a.object.board.users ? (a.object.board.users.every(function(a) {
                            return a && !a.is_deleted && a.user && a.user.id === l ? (m = a.sequence, !1) : !0;
                        }), m ? k = {
                            url: o.proto.apiUrl,
                            data: {
                                type: o.proto[f].mxType,
                                object: {
                                    board: {
                                        id: j,
                                        users: [ {
                                            sequence: 1 * m,
                                            is_notification_off: !h.notification
                                        } ]
                                    }
                                }
                            }
                        } : void 0) : void 0;
                    })), k = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[f].mxType,
                            object: {
                                board: {
                                    id: j,
                                    name: h && h.name || void 0,
                                    isconversation: h && void 0 !== h.isconversation ? !!h.isconversation : void 0,
                                    users: h && void 0 !== h.notification && void 0 !== m ? [ {
                                        sequence: 1 * m,
                                        is_notification_off: !h.notification
                                    } ] : void 0,
                                    pages: h && h.pages && h.pages.length ? h.pages : void 0,
                                    thumbnail_source_resource: h && void 0 !== h.cover ? 1 * h.cover : void 0
                                }
                            },
                            params: h && h.firstPageChanged ? [ {
                                name: "BOARD_REQUEST_UPDATE_COVER"
                            } ] : void 0
                        }
                    }, !n || "accept" !== n.action && "join" !== n.action) if (!n || "decline" !== n.action && "leave" !== n.action) if (n && "share" === n.action) k.data.type = this.proto[f].mxTypeShare, 
                    h.users && h.users.length && (h.users.forEach(function(a) {
                        k.data.type = this.proto[f].mxTypeShareEmail, k.data.params = k.data.params || [], 
                        k.data.params.push({
                            name: "BOARD_REQUEST_INVITEE_EMAIL",
                            string_value: a
                        });
                    }, this), h.message && (k.data.params = k.data.params || [], k.data.params.push({
                        name: "BOARD_REQUEST_INVITE_MESSAGE",
                        string_value: h.message
                    }))); else {
                        if (n && "chat" === n.action && h && h.text) return void d.api("/binders/" + j + "/comments", "POST", {
                            data: n.data
                        }, i[3], i[4]);
                        n && "create_group" === n.action && h && h.name && (k = {
                            url: this.proto[f].apiUrl || this.proto.apiUrl || c,
                            data: {
                                type: "BOARD_REQUEST_CREATE_PAGE_GROUP",
                                object: {
                                    board: {
                                        id: j,
                                        page_groups: []
                                    }
                                }
                            }
                        });
                    } else k.data.type = this.proto[f].mxTypeLeave; else k.data.type = this.proto[f].mxTypeJoin;
                    return k;
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_DELETE",
                resultNS: "object.board",
                dataFormatter: function(a, b, c) {
                    var d, e;
                    return d = b.match(this.proto.urlExp)[1] || "", e = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: d
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.users": {
            name: "board",
            subscribe: !1,
            urlExp: /^.*\/binders(?:\/([^\/]+))\/users$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.users",
                localStore: "../",
                resultSorter: function(a, b) {
                    var c, d;
                    return c = a && a.user && (a.user.name || a.user.email) || "", d = b && b.user && (b.user.name || b.user.email) || "", 
                    c > d ? 1 : d > c ? -1 : 0;
                },
                dataFormatter: function(a, b, c, d) {
                    var e, f;
                    return e = b.match(this.proto.urlExp)[1] || "", f = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            object: {
                                board: {
                                    id: e
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_INVITE",
                mxTypePermission: "BOARD_READ_WRITE",
                mxTypeMsg: "BOARD_REQUEST_INVITE_MESSAGE",
                resultNS: "object.board.users",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h;
                    for (f = b.match(this.proto.urlExp)[1] || "", g = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: f,
                                    users: []
                                }
                            }
                        }
                    }, h = 0; e.users[h]; ) g.data.object.board.users.push({
                        type: e.users[h] && e.users[h].type || this.proto[c].mxTypePermission,
                        user: {
                            id: e.users[h].id,
                            email: e.users[h].email
                        }
                    }), h++;
                    return e.message && (g.data.params = [ {
                        name: this.proto[c].mxTypeMsg,
                        string_value: e.message + ""
                    } ]), g;
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_EXPEL",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h;
                    for (f = b.match(this.proto.urlExp)[1] || "", g = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: f,
                                    users: []
                                }
                            }
                        }
                    }, h = 0; e.users[h]; ) g.data.object.board.users.push({
                        type: this.proto[c].mxTypePermission,
                        user: {
                            email: e.users[h].email
                        },
                        sequence: e.users[h].id
                    }), h++;
                    return g;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.user": {
            name: "board",
            subscribe: !1,
            urlExp: /^.*\/binders(?:\/([^\/]+))\/users\/(\d+)$/,
            apiUrl: "/board",
            apiMethod: "POST",
            PUT: {
                mxType: "BOARD_REQUEST_SET_ACCESS_TYPE",
                apiUrl: "/board",
                resultNS: "object.board.users",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h, i;
                    return f = b.match(this.proto.urlExp), g = f[1], h = 1 * f[2], e && e.type ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g,
                                    users: [ {
                                        sequence: h,
                                        type: e.type
                                    } ]
                                }
                            }
                        }
                    } : void 0;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.comment": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/comments\/([\d]+)$/,
            apiUrl: "/board",
            localStore: "../../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.comments.0",
                filter: function(a, b, c) {
                    var d = 1 * c.match(this.proto.urlExp)[2] || "";
                    return !a || a.sequence !== d;
                },
                dataFormatter: function(a, b, c, d, e) {
                    var f, g;
                    return f = b.match(this.proto.urlExp)[1] || "", g = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            object: {
                                board: {
                                    id: f
                                }
                            }
                        }
                    }, void 0 !== e && (g.object = {}, g.object[a] = e), g;
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_DELETE_COMMENT",
                resultNS: "object.board.comments",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h, i;
                    return f = b.match(this.proto.urlExp), g = f && f[1], h = f && 1 * f[2], i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            object: {
                                board: {
                                    id: g,
                                    comments: [ {
                                        sequence: h,
                                        is_deleted: !0
                                    } ]
                                }
                            }
                        }
                    }, void 0 !== e && (i.object = {}, i.object[a] = e), i;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.comments": {
            name: "board",
            subscribe: !0,
            urlExp: /^\/binders\/([^\/]+)\/comments$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.comments",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g;
                    return f = b.match(this.proto.urlExp)[1] || "", g = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            object: {
                                board: {
                                    id: f
                                }
                            }
                        }
                    }, void 0 !== e && (g.object = {}, g.object[a] = e), g;
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_CREATE_COMMENT",
                resultNS: "object.board.comments",
                special: {
                    upload: {
                        mxType: "BOARD_REQUEST_UPLOAD_RESOURCE",
                        resultNS: "object.board.pages"
                    },
                    comments: {
                        resultNS: "object.board.comments.0"
                    }
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j, k, l;
                    if (h = b.match(this.proto.urlExp)[1] || "", h = "me" === h ? "" : h, !f || !(f.text || f.files && f.files.length)) return void this.log.warn("The chat message or page must be provided.");
                    if (!(f.files && f.files.length > 1)) return i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: f.files && f.files.length ? this.proto[c].special.upload.mxType : d,
                            files: f.files,
                            params: f.files && f.files.length ? [ {
                                name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                                string_value: "original"
                            } ] : void 0,
                            object: {
                                board: {
                                    id: h,
                                    resources: f.files && f.files.length ? [ {
                                        name: f.files[0].name
                                    } ] : void 0,
                                    comments: f && f.text ? [ {
                                        text: f.text,
                                        client_uuid: e.genUUID()
                                    } ] : void 0
                                }
                            }
                        }
                    }, f.files && f.files.length ? (i.data.params = [ {
                        name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                        string_value: "original"
                    } ], i.data.object.board.resources = [ {
                        name: f.files[0].name
                    } ], this.proto[c].resultNS = this.proto[c].special.upload.resultNS) : this.proto[c].resultNS = this.proto[c].special.comments.resultNS, 
                    i;
                    for (j = f.files, k = 0, l = j.length; l > k; k++) j[k] && (g[2].data.files = [ j[k] ], 
                    this.api.apply(this, g));
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.page_group": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/page_groups\/([^\/]+)$/,
            apiUrl: "/board",
            localStore: "../../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                localStore: "../",
                resultNS: "object.board.page_groups",
                dataFormatter: function(b, c, f, g, h, i) {
                    var j, k, l, m;
                    j = c.match(this.proto.urlExp), k = j && j[1], l = j && j[2], m = 1 * l === 1 * l ? "sequence" : "client_uuid", 
                    k && l && d.api("/binders/" + k + "/page_groups", "GET", {
                        filter: "sequence" === m ? "sequence===" + l : "client_uuid===" + l
                    }, function(b) {
                        b && b.data && b.data[0] && (b = e.extend({}, b), b.data = b.data[0], e.isFunction(i[3]) && i[3].call(i[4] || a, b));
                    }, this);
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE_PAGE_GROUP",
                resultNS: "object.board.page_groups.0",
                dataFormatter: function(a, b, c, f, g, h) {
                    var i, j, k, l, m;
                    return i = b.match(this.proto.urlExp), j = i && i[1], k = i && i[2], l = 1 * k === 1 * k ? "sequence" : "client_uuid", 
                    g && g.name ? (m = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: j,
                                    page_groups: [ {
                                        name: g.name
                                    } ]
                                }
                            }
                        }
                    }, m.data.object.board.page_groups[0][l] = "sequence" === l ? 1 * k : k, m) : void (g && g.pages && "client_uuid" === l && (g = e.copy(g), 
                    g.pages.forEach(function(a) {
                        a && (a.page_group = k);
                    }), d.api("/binders/" + j + "/pages", "PUT", {
                        data: g
                    }, h[3], h[4])));
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_UPDATE_PAGE_GROUP",
                resultNS: "object.board.page_groups.0",
                dataFormatter: function(a, b, c) {
                    var e, f, g, h, i;
                    return e = b.match(this.proto.urlExp), f = e && e[1], g = e && e[2], i = 1 * g === 1 * g ? "sequence" : "client_uuid", 
                    h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: f,
                                    page_groups: [ {
                                        client_uuid: g,
                                        is_deleted: !0
                                    } ]
                                }
                            }
                        }
                    }, d.api("/binders/" + f + "/pages", "GET", {
                        filter: "page_group.client_uuid==" + g
                    }, function(a) {
                        var b = a.data;
                        if (b && b.length) {
                            var c = [];
                            b.forEach(function(a) {
                                c.push({
                                    sequence: a.sequence,
                                    page_group: ""
                                });
                            }), d.api("/binders/" + f + "/pages", "PUT", {
                                data: {
                                    pages: c
                                }
                            });
                        }
                    }), h;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.page_groups": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/page_groups$/,
            apiUrl: "/board",
            localStore: "../../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                localStore: "../",
                resultNS: "object.board.page_groups",
                dataFormatter: function(a, b, c, d) {
                    var e, f;
                    return e = b.match(this.proto.urlExp)[1] || "", f = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: d,
                            object: {
                                board: {
                                    id: e
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_CREATE_PAGE_GROUP",
                resultNS: "object.board.page_groups",
                dataFormatter: function(a, b, c, d, f) {
                    var g, h;
                    return g = b.match(this.proto.urlExp)[1] || "", f && f.name && (h = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: "BOARD_REQUEST_CREATE_PAGE_GROUP",
                            object: {
                                board: {
                                    id: g,
                                    page_groups: [ {
                                        name: f && f.name,
                                        client_uuid: e.genUUID()
                                    } ]
                                }
                            }
                        }
                    }), h;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.resources": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/resources$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.resources",
                defaultResult: [],
                dataFormatter: function(a, b, c, d, e, f) {
                    {
                        var g, h;
                        f[2];
                    }
                    return g = b.match(this.proto.urlExp)[1], h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxTypeCopy: "BOARD_REQUEST_COPY_RESOURCES",
                mxTypeUploadUrl: "BOARD_REQUEST_UPLOAD_RESOURCE_URL",
                resultNS: "object.board.resources",
                dataFormatter: function(b, c, d, f, g, h) {
                    var i, j, k, l, m, n, o, p = h[2];
                    if (i = c.match(this.proto.urlExp)[1], g = e.extend({}, g), p && ("moveFrom" === p.action || "moving" === p.action || "copyFrom" === p.action) && g && (g.resources && g.resources.length || g.idFromBinder)) {
                        if (g.idFromBinder = g.idFromBinder || i, j = {
                            url: this.proto.apiUrl,
                            data: {
                                type: this.proto[d].mxTypeCopy,
                                object: {
                                    user: {
                                        boards: [ {
                                            board: {
                                                id: g.idFromBinder
                                            }
                                        } ]
                                    },
                                    board: {
                                        id: i
                                    }
                                }
                            }
                        }, k = [], l = [], g && g.resources && g.resources.length) {
                            for (n = 0, o = g.resources.length; o > n; n++) m = 1 * g.resources[n], m === m && (k.push({
                                sequence: m
                            }), l.push({
                                sequence: m
                            }));
                            j.data.object.user.boards[0].board.resources = k;
                        }
                        if ("moveFrom" === p.action) return p.action = "moving", this.api.call(this, h[0], h[1], h[2], function() {
                            var b = arguments;
                            this.api("/binders/" + g.idFromBinder + "/resources", "DELETE", {
                                data: {
                                    resources: l
                                }
                            }, function() {
                                e.isFunction(h[3]) && h[3].apply(h[4] || a, b);
                            }, this);
                        }, this), void (p.action = "moveFrom");
                    } else {
                        if (g && g.url) return j = {
                            url: this.proto[d].apiUrl || this.proto.apiUrl || c,
                            method: this.proto[d].apiMethod || this.proto.apiMethod || d,
                            resultNS: "object.board",
                            data: {
                                type: this.proto[d].mxTypeUploadUrl,
                                object: {
                                    board: {
                                        id: i,
                                        resources: [ {
                                            name: g.name || decodeURIComponent(g.url.match(e.REGS.URL_FILENAME)[1] || "unnamed.file"),
                                            client_uuid: g.client_uuid || e.genUUID()
                                        } ]
                                    }
                                },
                                params: [ {
                                    name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                                    string_value: g.type || "original"
                                }, {
                                    name: "RESOURCE_UPLOAD_RESOURCE_URL",
                                    string_value: g.url
                                } ]
                            }
                        };
                        this.log.error("Upload resource by URL: the URL is required.");
                    }
                    return j;
                },
                resultFormatter: function(a, b, c, d, g) {
                    var h = f.models.main.proto.resultFormatter.apply(this, arguments);
                    return h.data || (h.data = e.ns(g, "object.board.pages", e.CONSTS.ISNSREAD) || []), 
                    h;
                }
            },
            PUT: {
                mxTypeShare: "BOARD_REQUEST_CREATE_VIEW_TOKEN",
                mxTypeShareEmail: "BOARD_REQUEST_INVITEE_EMAIL",
                mxTypeSendEmail: "BOARD_REQUEST_EMAIL_VIEW_TOKEN",
                mxTypeShareMessage: "BOARD_REQUEST_INVITE_MESSAGE",
                resultNS: "object.board",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h, i = f[2];
                    return g = b.match(this.proto.urlExp)[1], i && "share" === i.action && e && e.resources && e.resources.length ? (h = {
                        url: "/board",
                        data: {
                            type: this.proto[c].mxTypeShare,
                            params: [],
                            object: {
                                board: {
                                    id: g,
                                    resources: []
                                }
                            }
                        }
                    }, e.resources.forEach(function(a) {
                        h.data.object.board.resources.push({
                            sequence: 1 * a
                        });
                    }), e.users && e.users.length ? (h.data.type = this.proto[c].mxTypeSendEmail, e.users.forEach(function(a) {
                        h.data.params.push({
                            name: "BOARD_REQUEST_INVITEE_EMAIL",
                            string_value: a
                        });
                    }), e.message && h.data.params.push({
                        name: "BOARD_REQUEST_INVITE_MESSAGE",
                        string_value: e.message
                    })) : h.data.params = void 0, h) : void 0;
                }
            },
            DELETE: {
                mxTypeDelete: "BOARD_REQUEST_DELETE_RESOURCE",
                resultNS: "object.board.resources",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h;
                    if (f = b.match(this.proto.urlExp)[1], e && e.resources) for (g = {
                        url: "/board",
                        data: {
                            type: this.proto[c].mxTypeDelete,
                            object: {
                                board: {
                                    id: f,
                                    resources: []
                                }
                            }
                        }
                    }, h = 0; e.resources[h]; ) g.data.object.board.resources.push({
                        sequence: 1 * e.resources[h],
                        is_deleted: !0
                    }), h++;
                    return g;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.feeds": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/feeds$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ_FEEDS",
                resultNS: "object.board.feeds",
                defaultResult: [],
                dataFormatter: function(a, b, c, d, e, f) {
                    {
                        var g, h;
                        f[2];
                    }
                    return g = b.match(this.proto.urlExp)[1], h = {
                        url: this.proto.apiUrl,
                        localFirst: !1,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g
                                }
                            },
                            params: [ {
                                name: "BOARD_REQUEST_READ_COUNT",
                                string_value: e && e.count && e.count + "" || "20"
                            }, {
                                name: "BOARD_REQUEST_READ_FEEDS_INDEXED"
                            } ]
                        }
                    }, e && e.timestamp && h.data.params.push({
                        name: "BOARD_REQUEST_READ_TIMESTAMP",
                        string_value: e.timestamp && e.timestamp + "" || ""
                    }), h;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        pages: {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.pages",
                defaultResult: [],
                dataFormatter: function(a, b, c, d, e, f) {
                    {
                        var g, h;
                        f[2];
                    }
                    return g = b.match(this.proto.urlExp)[1], this.proto[c].filter = f[2] && f[2].filter ? function(a) {
                        return ("," + f[2].filter + ",").indexOf("," + a.sequence + ",") > -1;
                    } : void 0, h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_UPDATE",
                mxTypeAgent: "AGENT_REQUEST_UPLOAD_RESOURCE",
                special: {
                    upload: {
                        mxType: "BOARD_REQUEST_UPLOAD_RESOURCE"
                    },
                    copy: {
                        mxType: "BOARD_REQUEST_COPY_PAGES"
                    }
                },
                resultNS: "object.board.pages",
                dataFormatter: function(b, c, d, f, g, h) {
                    var i, j, k, l, m, n, o, p, q = h[2];
                    if (i = c.match(this.proto.urlExp)[1], g = e.extend({}, g), !(g && g.files && g.files.length > 1)) {
                        if (g.files && g.files.length) j = {
                            url: this.proto[d].apiUrl || this.proto.apiUrl,
                            method: this.proto[d].apiMethod || this.proto.apiMethod || d,
                            data: {
                                type: g.files && g.files.length ? this.proto[d].special.upload.mxType : f,
                                files: g.files,
                                params: g.files && g.files.length ? [ {
                                    name: "RESOURCE_REQUEST_RESOURCE_TYPE",
                                    string_value: "original"
                                } ] : void 0,
                                object: {
                                    board: {
                                        id: i,
                                        resources: g.files && g.files.length ? [ {
                                            name: g.files[0].name
                                        } ] : void 0
                                    }
                                }
                            }
                        }; else if (q && "agent" === q.action) g && g.agent_id && g.file ? (j = {
                            url: "/agent",
                            data: {
                                type: this.proto[d].mxTypeAgent,
                                object: {
                                    board: {
                                        id: i
                                    }
                                },
                                entry: {
                                    agent_id: g.agent_id,
                                    parent_path: g.file
                                }
                            }
                        }, g.auth && _.extend(j.data.entry, g.auth)) : this.log.error("Data agent_id and file is required.", h); else if (q && "webdoc" === q.action) j = {
                            url: "/board/upload?type=web&id=" + i + "&name=" + encodeURIComponent(g && g.name || "webdoc") + ".html",
                            method: this.proto[d].apiMethod || this.proto.apiMethod || d,
                            dataType: "text/html",
                            data: g && g.html || "<HTML><HEAD></HEAD><BODY></BODY></HTML>"
                        }, g && g.page_group && (j.url = "/board/upload?type=web&page_group=" + encodeURIComponent(g.page_group) + "&id=" + i + "&name=" + encodeURIComponent(g && g.name || "webdoc") + ".html"); else if (q && "whiteboard" === q.action) j = {
                            url: this.proto.apiUrl,
                            data: {
                                type: this.proto[d].mxType,
                                object: {
                                    board: {
                                        id: i,
                                        pages: [ {
                                            client_uuid: g && g.client_uuid || e.genUUID(),
                                            height: g && g.height || 560,
                                            width: g && g.width || 720,
                                            page_type: "PAGE_TYPE_WHITEBOARD",
                                            page_number: g && g.page_number || void 0,
                                            page_group: g && g.page_group || void 0
                                        } ]
                                    }
                                }
                            }
                        }; else if (q && ("moveFrom" === q.action || "moving" === q.action || "copyFrom" === q.action) && g && (g.pages && g.pages.length || g.idFromBinder)) {
                            if (g.idFromBinder = g.idFromBinder || i, j = {
                                url: this.proto.apiUrl,
                                data: {
                                    type: this.proto[d].special.copy.mxType,
                                    object: {
                                        user: {
                                            boards: [ {
                                                board: {
                                                    id: g.idFromBinder
                                                }
                                            } ]
                                        },
                                        board: {
                                            id: i
                                        }
                                    }
                                }
                            }, g.page_groups && g.page_groups.length && (j.data.object.user.boards[0].board.page_groups = g.page_groups), 
                            k = [], l = [], g && g.pages && g.pages.length) {
                                for (n = 0, o = g.pages.length; o > n; n++) m = 1 * g.pages[n], m === m && (k.push({
                                    sequence: m
                                }), l.push(m));
                                j.data.object.user.boards[0].board.pages = k;
                            }
                            if ("moveFrom" === q.action) return q.action = "moving", this.api.call(this, h[0], h[1], h[2], function() {
                                var b = arguments;
                                this.api("/binders/" + g.idFromBinder + "/pages", "DELETE", {
                                    data: {
                                        pages: l
                                    }
                                }, function() {
                                    e.isFunction(h[3]) && h[3].apply(h[4] || a, b);
                                }, this);
                            }, this), void (q.action = "moveFrom");
                        }
                        return j;
                    }
                    for (n = 0, p = g.files, o = p.length; o > n; n++) h[2].data.files = [ p[n] ], this.api.apply(this, h);
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE_PAGE",
                mxTypeShare: "BOARD_REQUEST_CREATE_VIEW_TOKEN",
                mxTypeSendEmail: "BOARD_REQUEST_EMAIL_VIEW_TOKEN",
                mxTypeShareEmail: "BOARD_REQUEST_INVITEE_EMAIL",
                mxTypeShareMessage: "BOARD_REQUEST_INVITE_MESSAGE",
                resultNS: "object.board",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g = !1;
                    if (e.files && (e.pages = e.files, g = !0), e && e.pages) {
                        var h, i, j = f[2];
                        return h = b.match(this.proto.urlExp)[1], j && "share" === j.action && e.pages.length ? (i = {
                            url: "/board",
                            data: {
                                type: this.proto[c].mxTypeShare,
                                params: [],
                                object: {
                                    board: {
                                        id: h,
                                        pages: []
                                    }
                                }
                            }
                        }, g ? (delete i.data.object.board.pages, i.data.object.board.page_groups = [], 
                        e.pages.forEach(function(a) {
                            i.data.object.board.page_groups.push({
                                client_uuid: a
                            });
                        })) : e.pages.forEach(function(a) {
                            i.data.object.board.pages.push({
                                sequence: 1 * a
                            });
                        }), e.users && e.users.length && (i.data.type = this.proto[c].mxTypeSendEmail, e.users.forEach(function(a) {
                            i.data.params.push({
                                name: "BOARD_REQUEST_INVITEE_EMAIL",
                                string_value: a
                            });
                        }), e.message && i.data.params.push({
                            name: "BOARD_REQUEST_INVITE_MESSAGE",
                            string_value: e.message
                        })), i) : i = e.hasOwnProperty("rotate") && e.pages.length ? {
                            url: "/board",
                            data: {
                                type: "BOARD_REQUEST_UPDATE",
                                object: {
                                    board: {
                                        id: h,
                                        pages: e.pages
                                    }
                                }
                            }
                        } : {
                            url: "/board",
                            data: {
                                type: this.proto[c].mxType,
                                object: {
                                    board: {
                                        id: h,
                                        pages: e.pages
                                    }
                                }
                            }
                        };
                    }
                }
            },
            DELETE: {
                mxType: "",
                resultNS: "object.board.pages",
                special: {
                    batch: {
                        mxType: "BOARD_REQUEST_UPDATE",
                        apiUrl: "/board"
                    }
                },
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h;
                    if (f = b.match(this.proto.urlExp)[1], e && e.pages) for (g = {
                        url: this.proto[c].special.batch.apiUrl,
                        data: {
                            type: this.proto[c].special.batch.mxType,
                            object: {
                                board: {
                                    id: f,
                                    pages: []
                                }
                            }
                        }
                    }, h = 0; e.pages[h]; ) g.data.object.board.pages.push({
                        sequence: 1 * e.pages[h],
                        is_deleted: !0
                    }), h++;
                    return g;
                }
            },
            dataFormatter: function(a, b, c, d, e) {
                var f, g;
                return f = b.match(this.proto.urlExp)[1], g = {
                    url: (this.proto[c].apiUrl || this.proto.apiUrl || b) + (f && "/" + f || ""),
                    method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                    data: {
                        type: d
                    }
                }, void 0 !== e && (g.object = {}, g.object[a] = e), g;
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        page: {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages\/([^\/]+)$/,
            apiUrl: "/board",
            apiMethod: "POST",
            localStore: "disabled",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                apiUrl: "/board",
                resultNS: "object.board.pages.0",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h, i, j, k = f[2];
                    return g = b.match(this.proto.urlExp), h = g[1], i = 1 * g[2], j = k && "webdoc" === k.action ? {
                        url: this.proto.apiUrl + "/" + h + "/" + i + "/vector?" + Math.random(),
                        localStore: "disabled",
                        method: "GET",
                        responseType: "text/html"
                    } : {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: h,
                                    pages: [ {
                                        sequence: i
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h, i, j, k = f[2];
                    return j = b.match(this.proto.urlExp), g = j[1], h = j[2], k && "webdoc" === k.action ? (e && "string" == typeof e.html ? i = {
                        url: "/board/upload?type=vector&id=" + g + "&seq=" + h + "&name=" + encodeURIComponent(e && e.name || "webdoc") + ".html",
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "object.board",
                        dataType: "text/html",
                        data: e.html
                    } : this.log.error("Save WebDoc: data.html is requied."), i) : i = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g,
                                    pages: [ {
                                        sequence: 1 * h,
                                        rotate: e && 1 * e.rotate || void 0,
                                        page_number: e && e.page_number || void 0,
                                        name: e && e.name || ""
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages",
                apiUrl: "/board",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g = b.match(this.proto.urlExp);
                    return d = g[1], e = g[2], f = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: d,
                                    pages: [ {
                                        sequence: 1 * e,
                                        is_deleted: !0
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "page.comments": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages\/([^\/]+)\/comments$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.pages.0.comments",
                localStore: "../",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g;
                    return d = b.match(this.proto.urlExp), e = d[1], f = 1 * d[2], g = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: e,
                                    pages: [ {
                                        sequence: f
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages.0.comments",
                dataFormatter: function(a, b, c, d, f) {
                    var g, h, i, j;
                    return g = b.match(this.proto.urlExp), h = g[1], i = 1 * g[2], j = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: h,
                                    pages: [ {
                                        sequence: i,
                                        comments: [ {
                                            text: f && f.text,
                                            client_uuid: e.genUUID()
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "page.comment": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages\/([^\/]+)\/comments\/([^\/]+)$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "object.board.pages.0.comments.0",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g, h;
                    return d = b.match(this.proto.urlExp), e = d[1], f = 1 * d[2], g = 1 * d[3], h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: e,
                                    pages: [ {
                                        sequence: f,
                                        comments: [ {
                                            sequence: g
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages.0.comments",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h, i, j;
                    return f = b.match(this.proto.urlExp), g = f[1], h = 1 * f[2], i = 1 * f[3], j = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g,
                                    pages: [ {
                                        sequence: h,
                                        comments: [ {
                                            sequence: i,
                                            text: e && e.text
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages.0.comments",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g, h;
                    return d = b.match(this.proto.urlExp), e = d[1], f = 1 * d[2], g = 1 * d[3], h = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: e,
                                    pages: [ {
                                        sequence: f,
                                        comments: [ {
                                            sequence: g,
                                            is_deleted: !0
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "page.annotations": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages\/([^\/]+)\/annotations$/,
            apiUrl: "/board",
            localStore: "../",
            apiMethod: "POST",
            GET: {
                resultNS: "object.board.pages.0.contents",
                mxType: "BOARD_REQUEST_READ",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g;
                    return g = b.match(this.proto.urlExp), e = g[1], f = 1 * g[2], d = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: e,
                                    pages: [ {
                                        sequence: f
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            POST: {
                resultNS: "object.board.pages.0.contents",
                mxType: "BOARD_REQUEST_UPDATE",
                dataFormatter: function(a, b, c, d, f) {
                    var g, h, i, j;
                    return j = b.match(this.proto.urlExp), h = j[1], i = 1 * j[2], g = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: h,
                                    pages: [ {
                                        sequence: i,
                                        contents: [ {
                                            svg_tag: f.svg,
                                            client_uuid: f && f.client_uuid || e.genUUID()
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {}
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "page.annotation": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders\/([^\/]+)\/pages\/([^\/]+)\/annotations\/([^\/]+)$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages.0.contents",
                dataFormatter: function(a, b, c, d, e) {
                    var f, g, h, i, j, k;
                    return k = b.match(this.proto.urlExp), g = k[1], h = 1 * k[2], i = k[3], j = 1 * i === 1 * i ? "sequence" : "client_uuid", 
                    f = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: g,
                                    pages: [ {
                                        sequence: h,
                                        contents: [ {
                                            sequence: "sequence" === j && 1 * i || void 0,
                                            client_uuid: "client_uuid" === j && i || void 0,
                                            svg_tag: e.svg
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            },
            DELETE: {
                mxType: "BOARD_REQUEST_UPDATE",
                resultNS: "object.board.pages.0.contents",
                dataFormatter: function(a, b, c) {
                    var d, e, f, g, h, i;
                    return h = b.match(this.proto.urlExp), e = h[1], f = 1 * h[2], g = h[3], i = 1 * g === 1 * g ? "sequence" : "client_uuid", 
                    d = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: e,
                                    pages: [ {
                                        sequence: f,
                                        contents: [ {
                                            sequence: "sequence" === i && 1 * g || void 0,
                                            client_uuid: "client_uuid" === i && g || void 0,
                                            is_deleted: !0
                                        } ]
                                    } ]
                                }
                            }
                        }
                    };
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        contacts: {
            name: "contacts",
            subscribe: !0,
            urlExp: /^\/contacts$/,
            apiUrl: "/user",
            localStore: "disabled",
            apiMethod: "POST",
            SUBSCRIBE: {
                dataFormatter: function(a, b, c, d, e, g) {
                    f.subscribe("/users/me", g[1], g[2], g[3]);
                }
            },
            GET: {
                mxType: "USER_REQUEST_READ",
                mxTypePresence: "PRESENCE_REQUEST_READ",
                apiUrl: "/user",
                localStore: "/users/me",
                apiMethod: "GET",
                resultNS: "object.user.contacts",
                dataFormatter: function(a, b, c, d, e, f) {
                    var g, h = f[2];
                    return g = h && "presence" === h.action ? {
                        localFirst: !1,
                        localStore: "disabled",
                        resultNS: "object.contacts.contacts",
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxTypePresence
                        }
                    } : {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType
                        }
                    };
                },
                resultSorter: function(a, b) {
                    var c, d;
                    return c = a && a.user && (a.user.name || a.user.email) || "", d = b && b.user && (b.user.name || b.user.email) || "", 
                    c > d ? 1 : d > c ? -1 : 0;
                }
            },
            POST: {
                mxType: {
                    INVITE: "USER_REQUEST_CONTACT_INVITE",
                    ACCEPT: "USER_REQUEST_CONTACT_ACCEPT"
                },
                localStore: "/users/me",
                resultNS: "object.user.contacts",
                dataFormatter: function(b, c, d, g, h, i) {
                    if (h && h.users && h.users.length && /^(invite|accept)$/gi.test(h.type)) {
                        var j;
                        return j = {
                            url: this.proto.apiUrl,
                            data: {
                                type: this.proto[d].mxType[h.type.toUpperCase()],
                                object: {
                                    user: {
                                        contacts: []
                                    }
                                }
                            }
                        }, f.api("/contacts", "GET", {
                            localFirst: !0
                        }, function(a) {
                            for (var b in h.users) {
                                var c = !1;
                                if (a && a.data && a.data.length) for (var d in a.data) if (a.data[d].user && a.data[d].user.email == h.users[b].email && "CONTACT_NORMAL" === a.data[d].status) {
                                    c = !0;
                                    break;
                                }
                                c || j.data.object.user.contacts.push({
                                    user: {
                                        email: h.users[b].email
                                    }
                                });
                            }
                        }, this), j.data.object.user.contacts.length ? j : (e.isFunction(i[3]) && i[3].call(i[4] || a, {
                            message: "contact count is not expected"
                        }), null);
                    }
                }
            },
            DELETE: {
                mxType: {
                    CANCEL: "USER_REQUEST_CONTACT_CANCEL",
                    DENY: "USER_REQUEST_CONTACT_DENY"
                },
                localStore: "/users/me",
                resultNS: "object.user.contacts",
                dataFormatter: function(a, b, c, d, e) {
                    if (e && e.users && e.users.length && /^(cancel|deny)$/gi.test(e.type)) {
                        var f;
                        f = {
                            url: this.proto.apiUrl,
                            data: {
                                type: this.proto[c].mxType[e.type.toUpperCase()],
                                object: {
                                    user: {
                                        contacts: []
                                    }
                                }
                            }
                        };
                        for (var g in e.users) f.data.object.user.contacts.push({
                            user: {
                                email: e.users[g].email
                            }
                        });
                        return f;
                    }
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "contact.binders": {
            name: "user",
            subscribe: !1,
            urlExp: /^\/contacts\/([^\/]+)\/binders$/,
            rootUrl: "",
            apiUrl: "/user",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                apiUrl: "/user",
                localStore: "/users/me",
                dataFormatter: function(b, c, d, g, h, i) {
                    var j, k, l = c.match(this.proto.urlExp)[1] || "", m = i[3], n = i[4];
                    j = 1 * l === 1 * l ? "sequence===" + l : "string" == typeof l && l.indexOf("@") > -1 ? "user.email===" + l : "user.id===" + l, 
                    f.api("/contacts", "GET", {
                        filter: j
                    }, function(b) {
                        b && b.data && b.data[0] && b.data[0].user && b.data[0].user.id && f.api("/binders", "GET", {
                            filter: function(a) {
                                return a && a.board && !a.board.islive && !a.board.isconversation && a.board.users && a.board.users.length && (k = !1, 
                                a.board.users.every(function(a) {
                                    return a && a.user && a.user.id && a.user.id === b.data[0].user.id && !a.is_deleted && !a.user.is_deleted ? (k = !0, 
                                    !1) : !0;
                                }), k) ? !0 : !1;
                            }
                        }, function(b) {
                            e.isFunction(m) && m.call(n || a, b);
                        });
                    });
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "binder.settings": {
            name: "board",
            subscribe: !1,
            urlExp: /^\/binders(?:\/([\d]+))$/,
            apiUrl: "/user",
            apiMethod: "POST",
            PUT: {
                mxType: "USER_REQUEST_UPDATE",
                mxTypeFavorite: "USER_REQUEST_UPDATE_USER_BOARD",
                resultNS: "object.user",
                apiMethod: "POST",
                special: {
                    category: {
                        mxType: "USER_REQUEST_CATEGORY_ASSIGN",
                        apiUrl: "/user",
                        resultNS: "object.user.boards"
                    },
                    accessedTime: {
                        resultNS: "object.user"
                    }
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j, k = g[2];
                    return h = b.match(this.proto.urlExp), i = 1 * h[1], k && "batchUpdateOrderNumber" === k.action ? (j = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: "USER_REQUEST_CATEGORY_ASSIGN",
                            object: {
                                user: {
                                    boards: []
                                }
                            }
                        }
                    }, e.isArray(f.userBinders) && f.userBinders.forEach(function(a) {
                        j.data.object.user.boards.push({
                            sequence: a.binderSequence,
                            order_number: a.order_number + ""
                        });
                    }), j) : i ? (j = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                user: {
                                    boards: [ {
                                        sequence: i,
                                        accessed_time: f.accessed ? 0 : void 0
                                    } ]
                                }
                            }
                        }
                    }, f && (f.hasOwnProperty("category") || f.hasOwnProperty("order_number")) ? (j = {
                        url: this.proto[c].special.category.apiUrl,
                        method: this.proto[c].apiMethod,
                        data: {
                            type: this.proto[c].special.category.mxType,
                            object: {
                                user: {
                                    boards: [ {
                                        sequence: i
                                    } ]
                                }
                            }
                        }
                    }, f.hasOwnProperty("category") && (j.data.object.user.boards[0].category = f.category), 
                    f.hasOwnProperty("order_number") && (j.data.object.user.boards[0].order_number = f.order_number + "")) : f && f.hasOwnProperty("is_favorite") && (j = {
                        url: this.proto.apiUrl,
                        method: this.proto[c].apiMethod,
                        data: {
                            type: this.proto[c].mxTypeFavorite,
                            object: {
                                user: {
                                    boards: [ {
                                        sequence: i,
                                        is_favorite: f.is_favorite
                                    } ]
                                }
                            }
                        }
                    }), j) : void 0;
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        meet: {
            name: "board",
            subscribe: !1,
            urlExp: /^\/meets\/([^\/]+)$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            SUBSCRIBE: {
                mxType: "BOARD_REQUEST_SUBSCRIBE",
                localStore: "disabled"
            },
            data: {},
            GET: {
                mxType: "BOARD_REQUEST_READ",
                resultNS: "",
                dataFormatter: function(a, b, c, d) {
                    var e, f;
                    return (e = b.match(this.proto.urlExp)[1]) ? f = {
                        url: this.proto.apiUrl,
                        method: this.proto.apiMethod,
                        data: {
                            type: d,
                            action: {
                                session_key: e
                            }
                        }
                    } : void this.log.error("Invalid meet ID", e);
                }
            },
            PUT: {
                mxType: "BOARD_REQUEST_UPDATE",
                mxTypeJoin: "SESSION_REQUEST_JOIN",
                mxTypeLeave: "SESSION_REQUEST_LEAVE",
                mxTypeStart: "SESSION_REQUEST_START",
                mxTypeEnd: "SESSION_REQUEST_END",
                mxTypeSetPresenter: "SESSION_REQUEST_SET_PRESENTER",
                mxTypeWebRtcOffer: "SESSION_REQUEST_WEBRTC_OFFER",
                mxTypeAction: "BOARD_PUBLISH_ACTION",
                resultNS: "object.board",
                mxCMDS: {
                    play: "VIDEO_PLAYING",
                    pause: "VIDEO_PAUSED",
                    end: "VIDEO_STOPPED"
                },
                mxCMDS_Record: {
                    start: "RECORDING_STARTED",
                    stop: "RECORDING_STOPPED",
                    pause: "RECORDING_PAUSED",
                    resume: "RECORDING_RESUMED",
                    save: "RECORDING_SAVED",
                    cancel: "RECORDING_CANCELLED"
                },
                dataFormatter: function(a, b, c, d, f, g) {
                    var h, i, j, k, l = g[2], m = this.proto.data;
                    if (h = b.match(this.proto.urlExp)[1] || "", j = 1 * h === 1 * h ? "seesionKey" : "boardId", 
                    "seesionKey" === j ? (k = h, h = f && f.binder_id || m && m.board && m.board.id) : k = f && f.session_key || m && m.active && m.active.session_key, 
                    l && "join" === l.action) return i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeJoin,
                            action: {
                                session_key: f && f.session_key || k,
                                topic: f && f.topic || m.board && m.board.name || "Moxtra Meet",
                                user_roster: f && f.name && [ {
                                    user: {
                                        name: f.name
                                    }
                                } ] || void 0
                            }
                        }
                    }, l && l.joinInvisible && (i.data.params = [ {
                        name: "SESSION_REQUEST_JOIN_INVISIBLE"
                    } ]), i;
                    if (l && "leave" === l.action) return i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeLeave,
                            action: {
                                board_id: h,
                                session_key: k
                            }
                        }
                    }, l.async === !1 && (i.async = !1), i;
                    if (l && "start" === l.action) return i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeStart,
                            action: {
                                board_id: h,
                                topic: f && f.topic || m.board && m.board.name || "Moxtra Meet"
                            }
                        }
                    }, f && f.original_board_id && (i.data.action.original_board_id = f.original_board_id), 
                    l && l.autoRecord && (i.data.params = [ {
                        name: "SESSION_REQUEST_RECORDING"
                    } ]), i;
                    if (!k) return void this.log.error("Not in meet.", g);
                    if (l && "end" === l.action) return i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeEnd,
                            action: {
                                board_id: h,
                                session_key: k
                            }
                        }
                    }, l.async === !1 && (i.async = !1), i;
                    if (l && "page_action" === l.action) return f && f.sequence && f.cmd && this.proto[c].mxCMDS[f.cmd] ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeAction,
                            action: {
                                board_id: h,
                                session_key: k,
                                video_state: [ {
                                    action_timestamp: 1e3 * (f.currentTime || 0),
                                    page_sequence: f.sequence,
                                    video_sequence: f.sequence,
                                    status: this.proto[c].mxCMDS[f.cmd]
                                } ]
                            }
                        }
                    } : this.log.error("Page actions: data.sequence and data.cmd is requied."), i;
                    if (l && "page_switch" === l.action) return f && void 0 !== f.sequence ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeAction,
                            action: {
                                board_id: h,
                                session_key: k,
                                page_switch: {
                                    page_sequence: 1 * f.sequence
                                }
                            }
                        }
                    } : this.log.error("Page switch: data.sequence is requied."), i;
                    if (l && "webrtc_offer" === l.action) {
                        var n = f && f.channels || e.ns(m, "active.user_roster.0.audio_status.channels", e.CONSTS.ISNSREAD);
                        return n && n.length ? i = {
                            url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                            method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                            resultNS: "action",
                            data: {
                                type: this.proto[c].mxTypeAction,
                                action: {
                                    board_id: h,
                                    session_key: k,
                                    user_roster: [ {
                                        audio_status: {
                                            channels: n
                                        }
                                    } ]
                                }
                            }
                        } : this.log.error("Page actions: data.currentTime, data.sequence and data.cmd is requied."), 
                        i;
                    }
                    if (l && "laser_pointer" === l.action) return f && f.sequence && void 0 !== f.x && void 0 !== f.y ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "action",
                        data: {
                            type: this.proto[c].mxTypeAction,
                            action: {
                                board_id: h,
                                session_key: k,
                                laser_pointer: {
                                    page_sequence: 1 * f.sequence,
                                    px: 1 * f.x,
                                    py: 1 * f.y
                                }
                            }
                        }
                    } : this.log.error("Laser pointer: data.sequence, data.x and data.y is requied."), 
                    i;
                    if (l && "recording_control" === l.action) {
                        var o = (o = e.getCookie()) && o.sessionid;
                        if (f && f.cmd && o) {
                            if ("save" === f.cmd && !f.destination_binder_id) return void this.log.error("Save recording: board.destination_binder_id is requied.");
                            i = {
                                url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                                method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                                resultNS: "action",
                                data: {
                                    type: this.proto[c].mxTypeAction,
                                    action: {
                                        board_id: h,
                                        session_key: k,
                                        recording_state: [ {
                                            id: o,
                                            status: this.proto[c].mxCMDS_Record[f.cmd],
                                            recording_name: "save" === f.cmd ? f.name : void 0,
                                            destination_board_id: "save" === f.cmd ? f.destination_binder_id : void 0
                                        } ]
                                    }
                                }
                            };
                        } else this.log.error("Recording control: data.cmd, sessionid is required.");
                        return i;
                    }
                    return l && "publish" === l.action && f ? (i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        resultNS: "",
                        data: {
                            type: this.proto[c].mxTypeAction,
                            action: {
                                board_id: h,
                                session_key: f.session_key || k
                            }
                        }
                    }, e.extend(i.data.action, f), i) : l && "start_share" === l.action ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                board: {
                                    id: h,
                                    pages: [ {
                                        client_uuid: e.genUUID(),
                                        height: f && f.height || 560,
                                        width: f && f.width || 720,
                                        page_type: "PAGE_TYPE_DESKTOPSHARE"
                                    } ]
                                }
                            }
                        }
                    } : l && "set_presenter" === l.action && f && f.roster_id ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: this.proto[c].mxTypeSetPresenter,
                            action: {
                                board_id: h,
                                session_key: k,
                                user_roster: [ {
                                    id: f.roster_id,
                                    is_presenter: !0
                                } ]
                            }
                        }
                    } : l && "audio_start" === l.action && f && f.channels && f.channels.length ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: this.proto[c].mxTypeWebRtcOffer,
                            action: {
                                session_key: k,
                                user_roster: [ {
                                    audio_status: {
                                        channels: f.channels
                                    }
                                } ]
                            }
                        }
                    } : l && "audio_stop" === l.action ? i = {
                        url: this.proto[c].apiUrl || this.proto.apiUrl || b,
                        method: this.proto[c].apiMethod || this.proto.apiMethod || c,
                        data: {
                            type: this.proto[c].mxTypeWebRtcOffer,
                            action: {
                                session_key: k,
                                user_roster: [ {
                                    audio_status: {
                                        is_in_session: !1,
                                        ssrc: ""
                                    }
                                } ]
                            }
                        }
                    } : void 0;
                },
                resultFormatter: function(a, b, c, d, e, g) {
                    var h = this.proto.data;
                    return !g || "start" !== g.action && "join" !== g.action ? !g || "end" !== g.action && "leave" !== g.action || (this.proto.data = {}) : h.active = e && e.action || {}, 
                    f.models.main.proto.resultFormatter.apply(this, arguments);
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        "meet.users": {
            name: "board",
            subscribe: !1,
            urlExp: /^.*\/meets(?:\/([^\/]+))\/users$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            POST: {
                mxType: "SESSION_REQUEST_INVITE",
                dataFormatter: function(a, b, c, d, e, g) {
                    var h, i, j, k, l, m = (g[2], f.models.meet.proto.data);
                    if (h = b.match(this.proto.urlExp)[1] || "", k = 1 * h === 1 * h ? "seesionKey" : "boardId", 
                    h = "boardId" === k ? h : m && m.board && m.board.id, l = e && e.session_key || "sessionKey" === k && h || m && m.active && m.active.session_key, 
                    !l) return void this.log.error("Not in meet.", g);
                    if (e && e.users && e.users.length) {
                        for (i = {
                            url: this.proto[c].apiUrl || this.proto.apiUrl,
                            data: {
                                type: this.proto[c].mxType,
                                action: {
                                    session_key: l,
                                    user_roster: []
                                }
                            }
                        }, j = 0; e.users[j]; ) i.data.action.user_roster.push(e.users[j] && e.users[j].group_id ? {
                            group: {
                                id: e.users[j] && e.users[j].group_id
                            }
                        } : {
                            user: {
                                email: e.users[j] && e.users[j].email || void 0,
                                id: e.users[j] && e.users[j].id || void 0
                            }
                        }), j++;
                        return i;
                    }
                    return void this.log.error("Users must be provided.", g);
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        meets: {
            name: "board",
            subscribe: !1,
            urlExp: /^\/meets$/,
            apiUrl: "/board",
            localStore: "disabled",
            apiMethod: "POST",
            SUBSCRIBE: {
                mxType: "BOARD_REQUEST_SUBSCRIBE"
            },
            GET: {
                mxType: "USER_REQUEST_READ",
                resultNS: "object.user.boards",
                defaultResult: [],
                defaultFilter: "board.islive",
                dataFormatter: function(a, b, c) {
                    var d;
                    return d = {
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxType
                        }
                    };
                }
            },
            POST: {
                mxType: "BOARD_REQUEST_CREATE",
                resultNS: "object.board",
                defaultResult: [],
                dataFormatter: function(b, c, f, g, h, i) {
                    d.api("/binders", "POST", {
                        data: e.extend({}, h, {
                            islive: !0
                        })
                    }, function(b) {
                        b && b.data && h && h.idFromBinder ? d.api("/binders/" + b.data.id + "/pages", "POST", {
                            action: "copyFrom",
                            data: {
                                idFromBinder: h.idFromBinder,
                                pages: h.pages
                            }
                        }, function() {
                            e.isFunction(i[3]) && i[3].call(i[3] || a, b);
                        }) : e.isFunction(i[3]) && i[3].call(i[3] || a, b);
                    }, this);
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        agents: {
            name: "agents",
            subscribe: !1,
            urlExp: /^\/agents$/,
            apiUrl: "/user",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxType: "USER_REQUEST_READ",
                mxTypePresence: "PRESENCE_REQUEST_READ",
                apiUrl: "/user",
                localStore: "/users/me",
                apiMethod: "GET",
                resultNS: "entry",
                dataFormatter: function(b, c, d, g, h, i) {
                    var j, k, l, m, n = this, o = i[3], p = i[4];
                    f.api("/users/me", "GET", null, function(b) {
                        if (b && b.data) {
                            if (k = b.data.agents, k && k.length) for (l = 0, m = k.length; m > l; l++) k[l].agent && "OS_TYPE_CLOUD" === k[l].agent.os_type && (k.splice(l, 1), 
                            l--, m--);
                            k && k.length ? e.ajax({
                                url: "/user",
                                data: {
                                    type: n.proto[d].mxTypePresence
                                },
                                success: function(b) {
                                    j = e.ns(b, "object.contacts.contacts", e.CONSTS.ISNSREAD), j && j.length && k.forEach(function(a) {
                                        a && a.agent && a.agent.id && j.every(function(b) {
                                            return b && b.hasOwnProperty("online") && b.id === a.agent.id ? (a.agent.online = b.online, 
                                            !1) : !0;
                                        });
                                    }), e.isFunction(o) && o.call(p || a, {
                                        code: e.CONSTS.RESPONSE_SUCCESS,
                                        data: k
                                    });
                                },
                                error: function(b, c) {
                                    e.isFunction(o) && o.call(p || a, {
                                        message: b && b.message || b,
                                        xhr: c
                                    });
                                }
                            }) : e.isFunction(o) && o.call(p || a, {
                                code: e.CONSTS.RESPONSE_SUCCESS,
                                data: []
                            });
                        } else e.isFunction(o) && o.call(p || a, b);
                    });
                }
            }
        }
    }), e.extend(e.SDKP.prototype.protos, {
        agent: {
            name: "agent",
            subscribe: !1,
            urlExp: /^\/agents\/([^\/]+)$/,
            apiUrl: "/agent",
            localStore: "disabled",
            apiMethod: "POST",
            GET: {
                mxTypeListFolder: "AGENT_REQUEST_LIST_FOLDER",
                apiUrl: "/user",
                localStore: "disabled",
                resultNS: "entry",
                dataFormatter: function(a, b, c, d, f, g) {
                    {
                        var h, i, j;
                        g[2];
                    }
                    return f && (j = f.parent_path && f.name ? f.parent_path + "\\" + f.name : f.parent_path || f.name || ""), 
                    i = b.match(this.proto.urlExp)[1] || "", h = {
                        localFirst: !1,
                        localStore: "disabled",
                        url: this.proto.apiUrl,
                        data: {
                            type: this.proto[c].mxTypeListFolder,
                            entry: {
                                agent_id: i,
                                parent_path: j
                            }
                        }
                    }, f && f.auth && e.extend(h.data.entry, f.auth), h;
                }
            },
            DELETE: {
                mxType: "USER_REQUEST_UNREGISTER_AGENT",
                localStore: "disabled",
                dataFormatter: function(a, b, c) {
                    var d, e = b.match(this.proto.urlExp)[1] || "";
                    return d = {
                        localFirst: !1,
                        localStore: "disabled",
                        url: "/user",
                        data: {
                            type: this.proto[c].mxType,
                            object: {
                                user: {
                                    id: e
                                }
                            }
                        }
                    };
                }
            }
        }
    });
    var f = new e.SDKP({
        mods: [ "main", "user", "users", "category", "categories", "binder", "binder.users", "binder.user", "binder.comment", "binder.comments", "binder.feeds", "binders", "page", "pages", "page.comment", "page.comments", "page.annotation", "page.annotations", "binder.page_group", "binder.page_groups", "binder.resources", "contacts", "contact.binders", "binder.settings", "meet", "meet.users", "meets", "group", "groups", "group.binders", "group.integration", "group.integrations", "group.member", "group.members", "agents", "agent" ].join(",")
    }), d = e.release(f, "_api,api,login,logout,subscribe,unsubscribe,getAuthResponse,init,core,getMe,getUserBinder,processUserSubscribeData");
    a.MX = a.MX ? e.extend(a.MX, d) : d, d.getMe(), a.sdkp = f;
}(this, this), MX.Model = Backbone.Model, MX.Model.prototype.sync = function() {}, 
MX.Collection = Backbone.Collection.extend({
    name: "",
    url: function() {
        return "/" + this.name || "";
    },
    binding: function(a) {
        this._bindingObj && this.stopListening(this._bindingObj), this.listenTo(a, "add", this.add), 
        this.listenTo(a, "remove", this.remove), this._bindingObj = a;
    }
}), MX.Controller = Backbone.View.extend({
    initialize: function(a) {
        a = a || {}, _.extend(this, _.pick(a, [ "request", "name", "renderType" ])), this._variable = [], 
        this.$scope = {}, this._trash = [], a.renderTo && (this.container = a.renderTo), 
        this.init.call(this, a), !a.cid && a.renderTo && this.renderTo(a.renderTo);
    },
    registerObject: function(a, b) {
        var c = this[a];
        c && c.destroy && c.destroy(), this._variable.indexOf(a) < 0 && this._variable.push(a), 
        this[a] = b;
    },
    registerTimer: function(a, b, c) {
        var d = this._timer[a];
        d && clearTimeout(d), this._timer[a] = setTimeout(b, c || 1e3);
    },
    recovery: function(a) {
        return this._trash.push(a), a;
    },
    delegateAction: function() {
        "click.delegateEvents" + this.cid;
        this.handleEventMethod = _.bind(this._handleAction, this), this.$el.on("click", "*[data-action]", this.handleEventMethod);
    },
    _handleAction: function(a) {
        var b = $(a.currentTarget);
        if (b.hasClass("disabled")) return !1;
        var c = b.data("action"), d = b.data("param"), e = b.data("stopPropagation");
        e && a.stopPropagation(), void 0 !== d ? (d = String(d), d.indexOf(",") > -1 && (d = d.split(",")), 
        MX.isString(d) && (d = [ d ])) : d = null;
        var f = MX.get(c, this);
        _.isFunction(f) && (this.handleEvent = a, f.apply(this, d), this.handleEvent = null);
    },
    rendered: function() {},
    init: function() {},
    setParent: function(a) {
        this.__parent = a;
    },
    getParent: function() {
        return this.__parent;
    },
    renderTo: function(a) {
        var b = this;
        if (this.render(), this.renderType) switch (this.renderType) {
          case "prepend":
            $(a).prepend(this.$el);
            break;

          default:
            this.$el.appendTo(a);
        } else this.$el.appendTo(a);
        this.rendered(), setTimeout(function() {
            b.$el.find('[autofocus="autofocus"]').focus();
        }, 300);
    },
    renderView: function(a) {
        a && a.toJSON && (a = a.toJSON());
        var b, a = $.extend({}, this.$scope, a, this.model && this.model.toJSON());
        return b = this.template ? this._tpl = Handlebars.compile(this.template) : this._tpl, 
        b ? $(b(a)) : this.$el;
    },
    render: function(a) {
        var b = this.renderView(a);
        return b && this.setElement(b, !1), this.handleAction && this.delegateAction(), 
        this;
    },
    updateView: function(a) {
        var b = this.renderView(a);
        this.$el.replaceWith(b), this.setElement(b, !1), this.afterUpdate && this.afterUpdate();
    },
    destroy: function() {
        if (this.undelegateEvents(), this.off(), this.stopListening(), this._trash) for (var a, b = this._trash.length - 1, c = b; c >= 0; c--) a = this._trash[c], 
        MX.isFunction(a) ? a() : a && a.destroy && a.destroy(), this._trash[c] = null;
        var d = this;
        _.each(this._variable, function(a) {
            var b = d[a];
            b && b.destroy && b.destroy(), d[a] = null;
        }), _.each(this._timer, function(a) {
            a && clearTimeout(a);
        }), this._timer = null, this.handleAction && this.$el.off("click", "*[data-action]", this.handleEventMethod), 
        this.remove();
    },
    progress: function(a) {
        var b = this;
        return 0 == a ? void b.$el.loading(!1) : void setTimeout(function() {
            b.$el.loading({
                length: 7
            });
        }, 1);
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    }
}), MX.Controller.prototype.add = MX.Controller.prototype.recovery, MX.Validation = Backbone.Validation;

var methods = [ "success", "error", "complete" ];

MX.each(methods, function(a) {
    ChainObject.prototype[a] = function(b, c) {
        return b ? this.fn[a] = b : this.fn[a] && this.fn[a].call(this.scope || this, c), 
        this;
    };
}), MX.extend(ChainObject.prototype, {
    scope: function(a) {
        return this.scope = a, this;
    },
    callback: function(a) {
        a && "RESPONSE_SUCCESS" == a.code ? this.success(null, a) : this.error(null, a), 
        this.complete(null, a);
    },
    stop: function() {}
}), MX.ChainObject = ChainObject, MX.ns("MX.ui"), function() {
    MX.Binding = function(a) {
        a || (a = {}), this.opts = {}, _.extend(this.opts, _.pick(a, [ "source", "sourcePath", "target", "targetPath" ]));
        var b, c, d = this, e = a.target, f = "change";
        (b = a.source) && (d.createGetterAndSetter(b, a.sourcePath, "source"), f += ":" + a.sourcePath), 
        e && (d.createGetterAndSetter(e, a.targetPath, "target"), c = "change keyup");
        var g = !1;
        b.on(f, function() {
            if (!g) {
                var a = d.sourceGetter();
                d.targetSetter(a);
            }
        }), a.twoway && e.on(c, function() {
            var a = d.targetGetter();
            g = !0, d.sourceSetter(a), _.delay(function() {
                g = !1;
            });
        });
    }, MX.extend(MX.Binding.prototype, {
        createGetterAndSetter: function(a, b, c) {
            var d = c + "Getter", e = c + "Setter";
            a instanceof MX.Model || a instanceof Moxtra.model.Model ? (this[d] = function() {
                return a.get(b);
            }, this[e] = function(c) {
                var d = a;
                if (b.indexOf(".") > 0) {
                    var e = b.lastIndexOf("."), f = b.substr(e + 1), g = b.substr(0, e);
                    return d = MX.get(g, a), d.set(f, c);
                }
                return a.set(b, c);
            }, this[c + "Listen"] = "change:" + b) : (a.tagName || a.jquery) && (this[d] = function() {
                return this.getElementValue(a);
            }, this[e] = function(b) {
                return this.setElementValue(a, b);
            }, this[c + "Listen"] = "change");
        },
        setElementValue: function(a, b) {
            var c, d = a.get(0).tagName.toLowerCase();
            if ("input" == d) switch (c = a.attr("type").toLowerCase()) {
              case "checkbox":
                var e = a.val(), f = !1;
                f = "boolean" == typeof b ? b : e === b || "true" === b ? !0 : !1, a.prop("checked", f);
                break;

              case "radio":
                var g = this.getElementValue(a);
                a.prop("checked", g == b ? !0 : !1);
                break;

              case "password":
              case "text":
              case "email":
                a.val(b);
            }
            "textarea" == d && a.val(b), "select" == d && a.find("option").each(function(c, d) {
                var e = $(d);
                e.attr("value") == b && (a.get(0).selectedIndex = c);
            });
        },
        getElementValue: function(a) {
            var b, c = a.get(0).tagName.toLowerCase(), d = $.trim(a.val());
            if ("input" == c) switch (b = a.attr("type").toLowerCase()) {
              case "checkbox":
                d = a.prop("checked") ? a.attr("value") || !0 : a.attr("value") ? "" : !1;
                break;

              case "radio":
                "true" == d && (d = !0), "false" == d && (d = !1);
            }
            return d;
        }
    }), $.fn.binding = function(a) {
        return $(this).each(function() {
            var b = $.extend({}, a, {
                source: this,
                twoway: !0
            });
            new MX.Binding(b);
        }), this;
    };
}(), function() {
    var a = [ "model", "submit", "id", "scope", "form" ];
    MX.Form = function(b) {
        var c = this;
        b || (b = {}), _.extend(this, _.pick(b, a)), c.$el = $(c.form ? c.form : c.id);
        var d = MX.logger("Form");
        return c.$el.size() ? (c.form = c.$el.get(0), c.$el.on("submit.mxForm", _.bind(c._submit, c)), 
        setTimeout(function() {
            c.binding(c.model);
        }, 100), Backbone.Validation.bind(c), void (b.parent && b.parent.recovery && b.parent.recovery(this))) : void d.error("form {0} not find!", c.id);
    }, _.extend(MX.Form.prototype, Backbone.Events, {
        $: function(a) {
            return this.$el.find(a);
        },
        valid: function() {
            this.$(".alert").hide(), this.$(".alert-success").fadeIn();
        },
        invalid: function() {
            this.$(".alert").hide(), this.$(".alert-error").fadeIn();
        },
        _submit: function(a) {
            a.preventDefault();
            var b = this, c = this.form;
            return MX.each(c.elements, function(a) {
                var c = $(a), d = c.attr("name"), e = $.trim(c.val());
                "password" == c.attr("type") && e && b.model.set(d, e);
            }), this.model.isValid(!0) && this.submit.call(this.scope), !1;
        },
        disable: function(a) {
            MX.each(this.form.elements, function(b) {
                var c = b.tagName.toLowerCase(), d = $(b), e = d.attr("type");
                (/submit|button/.test(e) || "button" == c) && $(b).prop("disabled", a);
            });
        },
        binding: function(a) {
            var b = this.form;
            MX.each(b.elements, function(b) {
                var c, d = (b.tagName.toLowerCase(), $(b)), e = d.attr("name"), f = d.attr("type");
                if (e) {
                    "password" == f && (d.attr("autocapitalize", "off"), d.attr("autocomplete", "off"), 
                    d.attr("autocorrect", "off")), c = $.trim(d.val()), /text|password/.test(f) && c && a.set(e, c);
                    var g = new MX.Binding({
                        target: d,
                        targetPath: "value",
                        source: a,
                        sourcePath: e,
                        twoway: !0
                    });
                    MX.env.isIE && d.placeholder && /input|textarea/i.test(d[0].tagName) && d.placeholder(), 
                    c = a.get(e), void 0 != c ? g.targetSetter(c) : (c = g.targetGetter()) && g.sourceSetter(c);
                }
            });
        },
        showError: function(a) {
            this.showInfo(a, "alert-danger");
        },
        showSuccess: function(a) {
            this.showInfo(a, "alert-success");
        },
        showInfo: function(a, b) {
            var c = this.$(".mxForm-info");
            c.size() || (c = $('<div class="mxForm-info alert ' + b + '"></div>'), c.prependTo(this.$el)), 
            c.html(a), c.fadeIn();
        },
        hideError: function() {
            var a = this.$(".mxForm-info");
            a.empty(), a.fadeOut();
        },
        destroy: function() {
            var a = this;
            a.$el.off(".mxForm"), $(a.form.elements).off(".mxForm");
        }
    });
}(), MX.List = MX.Controller.extend({
    tagName: "ul",
    className: "mx-list",
    unifyLazyload: !0,
    initialize: function(a) {
        a = a || {
            speedup: !1
        }, _.extend(this, _.pick(a, [ "tagName", "template", "emptyTemplate", "getSortItems", "collection", "list", "sortable", "lazyload", "renderTo", "$scope", "syncModel", "onAddItem", "onSortItem", "unifyLazyload", "speedup", "onModelChange", "filterFn", "syncField", "hideLoading" ])), 
        this._itemTpl = Handlebars.compile(this.template), this._emptyTpl = Handlebars.compile(this.emptyTemplate || ""), 
        a.parent && a.parent.recovery && a.parent.recovery(this);
        var b = this.collection;
        b && this.binding(b), this.render();
    },
    binding: function(a, b) {
        var c = this, d = $(this.renderTo), e = d.parent();
        if (b || (this._originalCollection = null), this.collection && (this.stopListening(this.collection), 
        this.showAutoPager(!1)), this._collection && (this._collection.destroy && this._collection.destroy(), 
        this._collection = null), this.empty(), this.collection = a, "CacheCollection" === a.$name) {
            var f = Moxtra.const;
            this.listenTo(a, f.EVENT_DATA_ADD, function(b) {
                c.addItem(a.get(b));
            }), this.listenTo(a, f.EVENT_DATA_REMOVE, function(b) {
                c.removeItem(a.get(b));
            }), this.listenTo(a, f.EVENT_DATA_SORT, this.sortAll), c.updateAll(), c.speedup ? (c.speedup = !1, 
            c.render()) : c.unifyLazyload = !0, c.initLazyLoad();
        } else this.listenTo(a, "reset", this.updateAll), (a.sortField || a.$name) && this.listenTo(a, "sort", this.sortAll), 
        e.loading(!1), this.listenTo(a, "add", function(a) {
            c.addItem(a);
        }), this.listenTo(a, "remove", this.removeItem), this.listenTo(a, "complete", function() {
            e.loading(!1), c.speedup && (c.speedup = !1, c.render()), c.initLazyLoad();
        }, this), this.listenTo(a, "PageLoaded", function() {
            c.pager && c.pager.loading(!1);
        }), this.listenTo(a, "inited", function() {
            e.loading(!1), c.updateAll(), c.speedup ? (c.speedup = !1, c.render()) : c.unifyLazyload = !0, 
            c.initLazyLoad();
        }, this), this.listenTo(a, "empty", function() {
            c.showEmptyView(!0), c.showAutoPager(!1), e.loading(!1);
        }), this.listenTo(a, "processing", function() {
            c.empty(), e.loading(!0);
        }, this);
        !a.$name || a.inited || this.hideLoading || a.isClone || e.loading({
            color: "#999"
        }), !a.$name && a.length && (this.updateAll(), c.speedup && (c.speedup = !1, c.render()), 
        this.initLazyLoad()), a.$name && a.inited && !a.length && this.showEmptyView(!0);
    },
    empty: function() {
        this.$el.empty();
    },
    render: function() {
        this.speedup || this.$el.appendTo(this.renderTo);
    },
    addItem: function(a) {
        function b(a, b, c) {
            return function() {
                var f = !0;
                if (MX.isArray(a) && (f = !1, MX.each(a, function(a) {
                    void 0 !== c.changed[a] && (f = !0);
                })), f) {
                    e.filterFn && !e.filterFn(b) && d.remove();
                    var g = $(e._itemTpl(_.extend({}, e.$scope, b.toJSON())));
                    g.attr("id", b.cid || b.$id), g.get(0).className = d.get(0).className, d.replaceWith(g), 
                    d.find(".ellipsis-2line,.ellipsis").tooltip({
                        placement: "bottom"
                    }), d = g, e.onAddItem && e.onAddItem(g, b), e.initLazyLoad(d);
                }
                e.onModelChange && e.onModelChange(b);
            };
        }
        var c = a;
        if (this.isShowEmptyView && this.showEmptyView(!1), a.toJSON && (c = a.toJSON()), 
        !this.filterFn || this.filterFn(a)) {
            var d = $(this._itemTpl(_.extend({
                cid: a.cid || a.$id
            }, this.$scope, c))), e = this;
            this.isEmptyShow && this.empty(), d.attr("id", a.cid || a.$id), this.pager ? this.pager.before(d) : this.$el.append(d), 
            this.syncModel && a.on("change", b(this.syncModel, a, a)), this.syncField && MX.each(this.syncField, function(c, d) {
                var e = MX.get(d, a);
                e && e.on("change", b(c, a, e));
            }), e.onAddItem && e.onAddItem(d, a), e.lazyload && !e.unifyLazyload && e.initLazyLoad(d);
        }
    },
    filter: function(a) {
        this._originalCollection || (this._originalCollection = this.collection);
        var b, c = this._originalCollection;
        MX.isUndefined(a) ? this.binding(c) : (b = c.$name ? c.clone({
            filterFn: a
        }, !0) : c.clone(), this.binding(b, !0)), this.trigger("filter");
    },
    initLazyLoad: function(a) {
        var b = this;
        if (!MX.isUndefined(b.lazyload) && b.lazyload !== !1) {
            var c = b.lazyload === !0 ? b.$el : b.lazyload;
            a || (a = b.$el, b.unifyLazyload = !1), c && setTimeout(function() {
                a.find("img.lazy").lazyload({
                    container: c
                }), c.trigger("scroll");
            }, 300), $(c).find('[data-toggle="collapse"]').on("click", function() {
                setTimeout(function() {
                    c.trigger("scroll");
                }, 300);
            });
        }
    },
    sortAll: function() {
        if (!this.inSort) {
            this.inSort = !0;
            for (var a, b, c, d = this.collection, e = 0; e < d.length; e++) a = d.at ? d.at(e) : d[e], 
            b = this.$("#" + (a.cid || a.$id)).get(0), c = this.el.children[e], b && c !== b && $(b).insertBefore(c);
            this.inSort = !1, this.trigger("sort");
        }
    },
    updateAll: function() {
        var a = this.collection, b = this;
        b.empty(), this.pager = null, a && (a.each(function(a) {
            b.addItem(a, !1);
        }), a.hasNextPage && b.showAutoPager(!0), a.length > 0 ? b.lazyload && b.unifyLazyload && b.initLazyLoad() : this.showEmptyView(!0)), 
        this.initSortable();
    },
    showAutoPager: function(a) {
        var b = this.lazyload, c = this.collection;
        if ((!b || MX.isBoolean(b)) && (b = this.renderTo), a) {
            var d = this.pager;
            d || (d = this.pager = $('<li class="placeholder-item"><div class="nextPagePlaceholder"></div></li>'), 
            d.appendTo(this.$el)), b.on("scroll.pager", function() {
                var a = d.position();
                b[0].offsetHeight > a.top && (c.hasNextPage ? d.loading() : d.hide(), c.loadNextPage());
            });
        } else b.off && b.off(".pager"), this.pager = null;
    },
    showEmptyView: function(a) {
        this.empty(), a && this.$el.append(this._emptyTpl(this.$scope)), this.isShowEmptyView = a;
    },
    initSortable: function() {
        var a = this, b = MX.isFunction(this.sortable) ? this.sortable() : this.sortable;
        b && require([ "sortable" ], function(b) {
            a.getSortItems ? new b(a.$el[0], {
                filter: a.getSortItems(),
                onEnd: function(b) {
                    a.onSortItem($(b.item));
                }
            }) : new b(a.$el[0], {
                onEnd: function(b) {
                    a.onSortItem($(b.item));
                }
            });
        });
    },
    removeItem: function(a) {
        this.$("#" + (a.cid || a.$id)).remove(), this.collection.length || this.showEmptyView(!0);
    }
}), function(a) {
    a.fn.mxCheckbox = function(b) {
        b = b || {};
        var c = {
            checkboxCls: b.checkboxCls || "mx-checkbox",
            radioCls: b.radioCls || "mx-radio",
            checkedCls: b.checkedCls || "mx-checked",
            selectedCls: b.selectedCls || "mx-selected",
            hideCls: "mx-hide",
            checkIcon: b.checkIcon || " micon-circle-checkbox",
            checkedIcon: b.checkedIcon || "micon-circle-checkmark"
        };
        return this.each(function() {
            var b = a(this), d = "checkbox" === b.attr("type") ? '<div class="' + c.checkboxCls + '">' : '<div class="' + c.radioCls + '">';
            b.addClass(c.hideCls).wrap(d).change(function() {
                "checkbox" === b.attr("type") ? a(this).is(":checked") ? (a(this).parent().addClass(c.checkedCls), 
                a(this).parent().children("i").removeClass(c.checkIcon).addClass(c.checkedIcon)) : (a(this).parent().removeClass(c.checkedCls), 
                a(this).parent().children("i").addClass(c.checkIcon).removeClass(c.checkedIcon)) : "radio" === b.attr("type") && a('input[name="' + a(this).attr("name") + '"]').each(function() {
                    a(this).is(":checked") ? (a(this).parent().addClass(c.selectedCls), a(this).parent().children("i").removeClass(c.checkIcon).addClass(c.checkedIcon)) : (a(this).parent().removeClass(c.selectedCls), 
                    a(this).parent().children("i").addClass(c.checkIcon).removeClass(c.checkedIcon));
                });
            }), b.parent().prepend('<i class="' + c.checkIcon + '"></i>'), b.is(":checked") && (b.parent().addClass(c.checkedCls), 
            a(this).parent().children("i").removeClass(c.checkIcon).addClass(c.checkedIcon));
        });
    };
}(jQuery), function(a) {
    a.fn.mxModal = function(b) {
        b = b || {}, b.close ? a(this).addClass("hide").prev(".mx-modal-backdrop").remove() : (a(this).removeClass("hide").before('<div class="mx-modal-backdrop"></div>'), 
        a(this).prev(".mx-modal-backdrop").click(function() {
            b.closeCb && b.closeCb(), a(this).next().addClass("hide"), a(this).remove();
        }));
    };
}(jQuery), function(a) {
    a.fn.splashScreen = function(b) {
        function c(c) {
            var d = a("<div>", {
                css: {
                    color: "#bebebe",
                    fontSize: 140,
                    fontWeight: "bold"
                }
            }).hide(), f = a("<div>", {
                "class": "img-circle",
                css: {
                    "background-color": "rgba(0, 0, 0, 0.6)",
                    border: "10px solid #8e8e8e",
                    width: 180,
                    height: 180,
                    margin: "0 auto"
                }
            });
            f.append('<div style="margin-top:-25px;">' + b.textLayers[c] + "</div>"), d.append(f), 
            d.fadeIn("slow").delay(b.textShowTime).fadeOut("slow", function() {
                d.remove(), e.trigger("ss:change", [ c + 1 ]);
            }), e.append(d);
        }
        b = a.extend({
            textLayers: [],
            textShowTime: 1e3,
            textTopOffset: 80,
            callback: function() {},
            css: {
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                "background-color": "#252525",
                "background-repeat": "no-repeat",
                "text-align": "center",
                "z-index": "20000"
            }
        }, b, {
            css: {
                position: "absolute",
                top: "50%",
                left: "50%",
                height: "180px",
                width: "180px",
                "margin-top": "-90px",
                "margin-left": "-90px",
                "text-align": "center",
                "z-index": "20000"
            }
        });
        var d = a.extend(b.css, {}), e = a("<div>", {
            id: "xe_splashScreen",
            css: d
        });
        return a("body").append(e), e.bind("ss:end", function() {
            e.fadeOut("slow"), e.remove(), b.callback();
        }), e.bind("ss:change", function(a, d) {
            b.textLayers[d] ? (console && console.log && console.log(d), c(d)) : (console && console.log && console.log("ss:end"), 
            e.trigger("ss:end"));
        }), e.trigger("ss:change", 0), this;
    };
}(jQuery), function(a) {
    function b(a, b) {
        return function() {
            return a += b;
        };
    }
    function c(a) {
        return (10 > a ? "0" : "") + a;
    }
    function d(a) {
        var b, d, e, f;
        return b = a / 1e3, d = Math.floor(b % 60), b /= 60, e = Math.floor(b % 60), b /= 60, 
        f = Math.floor(b % 24), [ c(f), c(e), c(d) ].join(":");
    }
    function e(a, b) {
        var c;
        return c = "function" == typeof jintervals ? function(a, b) {
            return jintervals(a / 1e3, b.format);
        } : d, (e = function(a, b) {
            return c(a, b);
        })(a, b);
    }
    var f = {
        init: function(c) {
            var d = {
                updateInterval: 1e3,
                startTime: 0,
                format: "{HH}:{MM}:{SS}",
                formatter: e
            };
            return this.each(function() {
                var e = a(this), f = e.data("stopwatch");
                if (!f) {
                    var g = a.extend({}, d, c);
                    f = g, f.active = !1, f.target = e, f.elapsed = g.startTime, f.incrementer = b(f.startTime, f.updateInterval), 
                    f.tick_function = function() {
                        var a = f.incrementer();
                        f.elapsed = a, f.target.trigger("tick.stopwatch", [ a ]), f.target.stopwatch("render");
                    }, e.data("stopwatch", f);
                }
            });
        },
        start: function() {
            return this.each(function() {
                var b = a(this), c = b.data("stopwatch");
                c.active = !0, c.timerID = setInterval(c.tick_function, c.updateInterval), b.data("stopwatch", c);
            });
        },
        stop: function() {
            return this.each(function() {
                var b = a(this), c = b.data("stopwatch");
                clearInterval(c.timerID), c.active = !1, b.data("stopwatch", c);
            });
        },
        destroy: function() {
            return this.each(function() {
                {
                    var b = a(this);
                    b.data("stopwatch");
                }
                b.stopwatch("stop").unbind(".stopwatch").removeData("stopwatch");
            });
        },
        render: function() {
            var b = a(this), c = b.data("stopwatch");
            try {
                b.html(c.formatter(c.elapsed, c));
            } catch (d) {
                console && console.info && console.info("ignorable error: " + d);
            }
        },
        getTime: function() {
            var b = a(this), c = b.data("stopwatch");
            return c.elapsed;
        },
        toggle: function() {
            return this.each(function() {
                var b = a(this), c = b.data("stopwatch");
                b.stopwatch(c.active ? "stop" : "start");
            });
        },
        reset: function() {
            return this.each(function() {
                var c = a(this);
                data = c.data("stopwatch"), data.incrementer = b(data.startTime, data.updateInterval), 
                data.elapsed = data.startTime, c.data("stopwatch", data);
            });
        }
    };
    a.fn.stopwatch = function(b) {
        return f[b] ? f[b].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? void a.error("Method " + b + " does not exist on jQuery.stopwatch") : f.init.apply(this, arguments);
    };
}(jQuery), _.extend(Backbone.Validation.callbacks, {
    valid: function(a, b, c) {
        c = "id" == c ? "#" + b : "[" + c + '="' + b + '"]';
        var d = a.$(c), e = d.parents(".form-group");
        e.removeClass("has-error"), "tooltip" === d.data("error-style") ? d.data("tooltip") && d.tooltip("hide") : "inline" === d.data("error-style") ? e.find(".help-inline").empty() : e.find(".help-block").empty();
    },
    invalid: function(a, b, c, d) {
        d = "id" == d ? "#" + b : "[" + d + '="' + b + '"]';
        var e = a.$(d), f = e.parents(".form-group");
        if (f.addClass("has-error"), a.model.$name && (c = MX.lang[c] || c), "tooltip" === e.data("error-style")) {
            var g = e.data("tooltip-position") || "right";
            e.tooltip({
                placement: g,
                trigger: "manual",
                title: c
            }), e.tooltip("show");
        } else if ("inline" === e.data("error-style")) {
            0 === f.find(".help-inline").length && f.append('<span class="help-inline error-message"></span>');
            var h = f.find(".help-inline");
            h.text(c);
        } else {
            0 === f.find(".help-block").length && f.append('<p class="help-block error-message"></p>');
            var h = f.find(".help-block");
            h.text(c);
        }
    }
}), Handlebars.registerHelper("html", function(a) {
    return new Handlebars.SafeString((a || "").replace(/\n/g, "<br/>"));
}), Handlebars.registerHelper("formatDueDate", function(a) {
    a = a || Date.now();
    var b = MX.lang.format(a, "LL"), c = !1, d = "";
    return (moment(a).isBefore(Date.now(), "day") || moment(a).isSame(Date.now(), "day")) && (c = !0), 
    d += "<span ", c && (d += 'class="mx-expired-date"'), d += ">", d += b, d += "</span>", 
    new Handlebars.SafeString(d);
}), Handlebars.registerHelper("formatDatetime", function(a) {
    return a = a || Date.now(), new Handlebars.SafeString(MX.lang.formatDate(a));
}), Handlebars.registerHelper("formatPageName", function(a) {
    return new Handlebars.SafeString(a.name ? a.name : MX.format(MX.lang.page_index_bracket, a.pageIndex));
}), Handlebars.registerHelper("format", function(a) {
    var b = a.src || a.source || "", c = (a.data || {}, Handlebars.compile(b));
    return c(a.data);
}), Handlebars.registerHelper("bbcode", function(a) {
    var b = function(a) {
        function b(a, b) {
            this.bbtag = a, this.etag = b;
        }
        function c(a) {
            return a && a.length ? j.test(a) : !1;
        }
        function d(a, d, e, j, n, o, p) {
            if (d && d.length) {
                if (!g) return a;
                switch (d) {
                  case "\r":
                    return "";

                  case "\n":
                    return "<br>";
                }
            }
            if (c(e)) {
                if (h) return "[" + e + "]";
                if (f.length && "url" == f[f.length - 1].bbtag && i >= 0) return "[" + e + "]";
                switch (e) {
                  case "code":
                    return f.push(new b(e, "</code></pre>")), g = !1, "<pre><code>";

                  case "pre":
                    return f.push(new b(e, "</pre>")), g = !1, "<pre>";

                  case "color":
                  case "colour":
                    return j && k.test(j) || (j = "inherit"), f.push(new b(e, "</span>")), '<span style="color: ' + j + '">';

                  case "size":
                    return j && l.test(j) || (j = "1"), f.push(new b(e, "</span>")), '<span style="font-size: ' + Math.min(Math.max(j, .7), 3) + 'em">';

                  case "s":
                    return f.push(new b(e, "</span>")), '<span style="text-decoration: line-through">';

                  case "noparse":
                    return h = !0, "";

                  case "url":
                    return f.push(new b(e, "</a>")), j && m.test(j) ? (i = -1, '<a target="_blank" href="' + j + '">') : (i = a.length + o, 
                    '<a target="_blank" href="');

                  case "q":
                  case "blockquote":
                    return f.push(new b(e, "</" + e + ">")), j && j.length && m.test(j) ? "<" + e + ' cite="' + j + '">' : "<" + e + ">";

                  default:
                    return f.push(new b(e, "</" + e + ">")), "<" + e + ">";
                }
            }
            return c(n) ? h ? "noparse" == n ? (h = !1, "") : "[/" + n + "]" : f.length && f[f.length - 1].bbtag == n ? "url" == n ? i > 0 ? '">' + p.substr(i, o - i) + f.pop().etag : f.pop().etag : (("code" == n || "pre" == n) && (g = !0), 
            f.pop().etag) : '<span style="color: red">[/' + n + "]</span>" : a;
        }
        function e(a) {
            var b, c;
            if (g = !0, (null == f || f.length) && (f = new Array(0)), b = a.replace(n, d), 
            h && (h = !1), f.length) for (c = new String(), "url" == f[f.length - 1].bbtag && (f.pop(), 
            c += '">' + a.substr(i, a.length - i) + "</a>"); f.length; ) c += f.pop().etag;
            return c ? b + c : b;
        }
        var f, g = !0, h = !1, i = -1, j = /^\/?(?:b|i|u|pre|samp|code|colou?r|size|noparse|url|s|q|blockquote)$/, k = /^(:?black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|orangered|darkorange|gold|#(?:[0-9a-f]{3})?[0-9a-f]{3})$/i, l = /^[\\.0-9]{1,8}$/i, m = /^[-;\/\?:@&=\+\$,_\.!~\*'\(\)%0-9a-z]{1,512}$/i, n = /([\r\n])|(?:\[([a-z]{1,16})(?:=([^\x00-\x1F"'\(\)<>\[\]]{1,256}))?\])|(?:\[\/([a-z]{1,16})\])/gi;
        return e(a);
    }, c = b(a);
    return new Handlebars.SafeString(c);
}), $.fn.MoxtraPowerBy = function(a) {
    var b = $(".moxtra-poweredby");
    return b.remove(), a ? (b = $('<span class="moxtra-poweredby mxbrand-powered-by-moxtra active"></span>').appendTo(this), 
    b.show()) : b.hide(), b;
}, $.fn.widgetTimer = function() {
    setTimeout(updateTime, 6e5);
}, Moxtra.define(function(a, b) {
    var c = a.const;
    a.List = Backbone.View.extend({
        tagName: "div",
        className: "moxtra-list",
        initialize: function(b) {
            if (this.opts = _.extend({
                maxRecord: 50,
                pageSize: 10
            }, b), this._views = {}, this.loaded = new a.util.Array(), this.currentPage = -1, 
            this.scrollTop = 0, this._itemView = Handlebars.compile(b.itemView), this._emptyTpl = Handlebars.compile(b.emptyTemplate || ""), 
            b.parent && b.parent.recovery && b.parent.recovery(this), $(this.opts.renderTo).is(":visible")) this.build(b); else {
                var c = this;
                setTimeout(function() {
                    c.build(b);
                }, 300);
            }
        },
        build: function(a) {
            var b = this;
            $('<div class="list-wrap"><div class="list-header"></div><div class="list-body"><div class="list-placeholder-up"></div> <div class="list-records"></div><div class="list-placeholder-down"></div>  </div> </div>').appendTo(b.$el), 
            b.recordsEl = b.$(".list-records"), b.bodyEl = b.$(".list-body"), b.bodyEl.on("scroll", _.bind(b._onScroll, b)), 
            b.placeholderUp = b.$(".list-placeholder-up"), b.placeholderDown = b.$(".list-placeholder-down"), 
            b.opts.renderTo && b.$el.appendTo(b.opts.renderTo), b.startIndex = -1, b.endIndex = 0, 
            a.collection && this.binding(a.collection);
        },
        pageSize: function() {
            return this.opts.pageSize;
        },
        viewportHeight: function() {
            return this.bodyEl.get(0).offsetHeight;
        },
        totalPage: function() {
            var a = this, b = a.collection.length, c = a.pageSize(), d = Math.ceil(b / c);
            return d;
        },
        _onScroll: function() {
            this.refresh();
        },
        refresh: function() {
            var a, b = this, c = b.bodyEl.scrollTop(), d = b.opts.itemHeight, e = b.pageSize(), f = 0, g = b.collection.length, h = Math.floor((b.opts.maxRecord - b.pageSize()) / 2), i = (Math.floor(b.opts.maxRecord / e), 
            Math.abs(c - b.scrollTop) >= b.viewportHeight()), j = b.startIndex < 0;
            (j || i) && (j ? (f = 0, a = Math.min(2 * e, g)) : (f = Math.floor(c / d), a = f + e, 
            f -= h, a += h, f = Math.max(0, f), a = Math.min(a, g)), this.renderTimer && (clearTimeout(this.renderTimer), 
            this.renderTimer = null), b.renderItem(f, a, j), b.renderTimer = null, b.scrollTop = c);
        },
        rerenderCurrPage: function() {
            var a, b = this, d = Math.max(b.endIndex, b.pageSize()), e = Math.max(b.startIndex, 0);
            d = Math.min(d, b.collection.length), b.recordsEl.empty();
            for (var f = e; d > f; f++) a = b.collection.getKey(f), this.addItem(a, f, !1);
            this.trigger(c.EVENT_UI_UPDATE_PAGE);
        },
        renderItem: function(a, b, d) {
            var e, f, g = this;
            if (a < g.startIndex) {
                for (e = g.startIndex - 1; e >= a; e--) f = g.collection.getKey(e), this.addItem(f, e, !0);
                g.startIndex = a, g.removeLastPage();
            }
            if (b > g.endIndex) {
                var h = g.endIndex;
                for (e = h; b > e; e++) f = g.collection.getKey(e), this.addItem(f, e, !1);
                g.endIndex = b, d && (g.startIndex = a), g.removeFirstPage();
            }
            g.trigger(c.EVENT_UI_RENDERED);
        },
        removeLastPage: function() {
            for (var a = this, b = a.collection.length - 1, c = a.recordsEl.children(), d = c.size(), e = [], f = d; f > 0 && !(a.endIndex - a.startIndex <= a.opts.maxRecord); f--) e.push("#" + a.cid + "_" + a.endIndex), 
            a.endIndex--;
            $(e.join(",")).remove(), a.placeholderDown.height((b - a.endIndex) * a.opts.itemHeight);
        },
        removeFirstPage: function() {
            for (var a = this, b = a.recordsEl.children(), c = b.size(), d = [], e = c; e >= 0 && !(a.endIndex - a.startIndex <= a.opts.maxRecord); e--) d.push("#" + a.cid + "_" + a.startIndex), 
            a.startIndex++;
            $(d.join(",")).remove(), a.placeholderUp.height(a.startIndex * a.opts.itemHeight);
        },
        reset: function(a) {
            var b = this;
            b.loaded.length = 0, b.startIndex = -1, b.endIndex = 0, b.scrollTop = 0, a && (b.placeholderUp.height(0), 
            b.placeholderDown.height(0)), b._views = {}, b.recordsEl.empty();
        },
        binding: function(a) {
            if (a) {
                var d = this;
                d.collection && (d.reset(!0), d.stopListening(d.collection)), d.collection = a, 
                d.listenTo(a, c.EVENT_DATA_REMOVE, function(a) {
                    d.removeItem(a);
                }), d.listenTo(a, c.EVENT_DATA_ADD, function(b) {
                    var c = a.indexOf(b);
                    c >= d.startIndex && c <= d.endIndex && d.rerenderCurrPage();
                }), d.listenTo(a, c.EVENT_DATA_SORT, function() {
                    d.rerenderCurrPage();
                });
                var e = d.opts.syncField;
                d.listenTo(a, c.EVENT_DATA_MODEL_CHANGE, function(c) {
                    {
                        var f, g, h, i = a.get(c), j = !1;
                        a.indexOf(c);
                    }
                    if (e) {
                        for (var k = Object.keys(e), l = 0; l < k.length; l++) if (h = k[l], g = e[h], Array.isArray(g)) {
                            if (f = "" !== h ? b.get(h, i.changed) : i.changed) {
                                for (var m = 0; m < g.length; m++) if (void 0 !== b.get(g[m], f)) {
                                    j = !0;
                                    break;
                                }
                                if (j) break;
                            }
                        } else if (b.get(g, f)) {
                            j = !0;
                            break;
                        }
                        j && d.updateItem(c);
                    }
                }), this.refresh();
            }
        },
        scrollTo: function(a) {
            var b, c = this.collection.indexOf(a);
            if (this.startIndex > c || this.endIndex <= c) b = this.opts.itemHeight * (c - 2), 
            this.bodyEl.scrollTop(b); else {
                var d, e = this._getItemEl(a);
                e.size() && (d = e.get(0).offsetTop), b = this.bodyEl.scrollTop(), (b > d || d + this.opts.itemHeight > this.viewportHeight() + b) && this.bodyEl.scrollTop(d - 2 * this.opts.itemHeight);
            }
        },
        isItemInView: function(a) {
            var b, c, d = this._getItemEl(a);
            return d.size() ? (b = d.get(0).offsetTop, c = this.bodyEl.scrollTop(), c > b || b + this.opts.itemHeight > this.viewportHeight() + c ? !1 : !0) : !1;
        },
        updateItem: function(a) {
            var b, c, d = (this.opts, this), e = this.$el.find("[data-" + d.collection.attributeId + '="' + a + '"]');
            e.size() && (b = d.collection.get(a), c = $(d._itemView(_.extend({}, d.opts.$scope, b))), 
            c.get(0).className = e.get(0).className, c.attr("data-" + d.collection.attributeId, a), 
            c.attr("id", e.attr("id")), e.replaceWith(c));
        },
        addItem: function(a, b, c) {
            var d = this, e = this.opts, f = d.collection.get(a);
            if (f) {
                var g = $(d._itemView(_.extend({}, d.opts.$scope, f)));
                g.attr("id", this.cid + "_" + b), g.attr("data-" + d.collection.attributeId, a), 
                this._focus === a && g.addClass("active"), c ? (g.prependTo(d.recordsEl), d.placeholderUp.height(b * e.itemHeight)) : (g.appendTo(d.recordsEl), 
                d.placeholderDown.height((d.collection.length - 1 - b) * e.itemHeight)), e.onAddItem && e.onAddItem.call(this, g);
            }
        },
        filter: function(a) {
            var b = this;
            if (a) {
                b._originalCollection ? b.collection.destroy() : b._originalCollection = b.collection;
                var c = this._originalCollection.clone({
                    filterFn: a
                });
                b.binding(c);
            } else b.collection.destroy(), b.binding(b._originalCollection), b._originalCollection = null;
        },
        removeItem: function(a) {
            this._getItemEl(a).remove();
        },
        _getItemEl: function(a) {
            return this.$el.find("[data-" + this.collection.attributeId + '="' + a + '"]');
        },
        focus: function(a) {
            function c() {
                e++, _.delay(function() {
                    var b = d._getItemEl(a);
                    b ? (d._focus && d.$(".active").removeClass("active"), b.addClass("active"), d._focus = a) : 3 > e && c();
                }, 600);
            }
            var d = this;
            if (b.isObject(a) && (a = b.get(this.collection.attributeId, a)), this.collection.get(a)) {
                this.scrollTo(a);
                var e = 0;
                c();
            }
        }
    });
}), Moxtra.define(function(a) {
    a.SimpleList = MX.Controller.extend({
        tagName: "div",
        className: "mx-simple-list",
        init: function(a) {
            var b = this.opts = _.extend({
                pageSize: 10,
                loadingTemplate: '<div class="mx-list-loading"></div>'
            }, a);
            this._itemView = Handlebars.compile(b.template), this._emptyTpl = Handlebars.compile(b.emptyTemplate || ""), 
            this.render_index = -1;
            var c = $(b.scrollElement);
            c || (c = $(b.renderTo)), c.on("scroll.simpleList", _.bind(this._onScroll, this)), 
            this.scrollEl = c, b.total_items && (this.total_items = b.total_items), b.collection && (this.total_items = b.collection.length, 
            this.loadNextPage()), b.onLoadNextPage && b.onLoadNextPage.call(this, this.render_index, _.bind(this.renderPage, this), this);
        },
        _onScroll: function() {
            var a = this.$(".mx-list-loading"), b = this.opts;
            if (a.size()) {
                if (this.render_index + 1 > this.total_items) return void this._hidePaging();
                var c = a.position();
                this.scrollEl.get(0).offsetHeight > c.top && (this._scrollTime = Date.now(), b.onLoadNextPage ? b.onLoadNextPage.call(this, this.render_index + 1, _.bind(this.renderPage, this), this) : this.loadNextPage());
            }
        },
        renderPage: function(a) {
            var b, c = this;
            if (a && a.length) {
                this._openCache();
                for (var d = 0; d < a.length; d++) b = a[d], b && this._renderItem(b), this.render_index++;
                this._clearCache();
            }
            this.render_index + 1 < this.total_items ? (this._showPaging(), _.defer(function() {
                c._onScroll();
            }, 200)) : this._hidePaging();
        },
        loadNextPage: function() {
            if (!this.total_items || this.total_items < 1) return void this._checkAndShowEmptyView();
            if (this._hidePaging(), !(this.render_index >= this.total_items)) {
                var a, b, c = this.opts, d = this.render_index + 1, e = this.render_index + c.pageSize;
                for (e = Math.min(e, this.total_items - 1), this._openCache(), a = d; e >= a; a++) b = c.collection.at(a), 
                b && this._renderItem(b);
                if (this._clearCache(), this.render_index = e, e + 1 < this.total_items) {
                    this._showPaging();
                    var f = this;
                    _.defer(function() {
                        f._onScroll();
                    }, 1e3);
                } else this._hidePaging();
            }
        },
        _checkAndShowEmptyView: function() {
            var a = !1;
            if (this.total_items < 1 && (a = !0), this.$el.children().length || (a = !0), a) {
                var b = this.opts.emptyTemplate || "";
                return void this.$el.append('<div class="mx-list-empty-wrap">' + b + "</div>");
            }
            this.$(".mx-list-empty-wrap").remove();
        },
        removeItem: function(a) {
            this.$("#" + a.$id).remove(), this._checkAndShowEmptyView(), this._onScroll();
        },
        _showPaging: function() {
            var a = $(".mx-list-loading"), b = this.opts.loadingTemplate;
            a.size() && a.remove(), a = $(b), a.appendTo(this.$el), a = a.find(".mx-list-loading"), 
            a.loading();
        },
        _hidePaging: function() {
            var a = $(".mx-list-loading");
            a.remove();
        },
        _renderItem: function(a, b) {
            var c, d = this, e = this.opts;
            if (a) {
                var f = $(d._itemView(_.extend({}, e.$scope, a)));
                a.$id && (f.attr("id", a.$id), c = a.get(a.attributeId), f.attr("data-" + a.attributeId, c)), 
                b ? f.prependTo(d._cacheDiv) : f.appendTo(d._cacheDiv);
            }
        },
        _openCache: function() {
            this._cacheDiv = document.createDocumentFragment();
        },
        _clearCache: function() {
            this.$el.append(this._cacheDiv), this._cacheDiv = null;
        },
        destroy: function() {
            this.scrollEl.off("scroll.simpleList"), this.$el.remove();
        }
    });
}), define("moxtra", [ "jquery", "backbone", "backbone-validation", "handlebars", "validation-helper", "uuid", "jqlazyload", "mediaelement", "moment", "moment-timezone", "bootstrapTransition", "bootstrapAlert", "bootstrapButton", "bootstrapCollapse", "bootstrapDropdown", "bootstrapModal", "bootstrapTab", "bootstrapTooltip", "datetimePicker", "pageVisibility", "spin", "placeholder", "jqueryBase64", "stupidtable", "touchSwipe", "jquery-autosize", "stripe" ], function(a) {
    return function() {
        var b;
        return b || a.MX;
    };
}(this)), MX.Painter = function() {}, MX.extend(MX.Painter, {
    MOUSE: {
        DEFAULT: "default",
        MOVE: "move",
        ZOOMIN: "-webkit-zoom-in",
        ZOOMOUT: "-webkit-zoom-out",
        CROSSHAIR: "crosshair",
        CELL: "cell",
        TEXT: "text",
        POINTER: "pointer",
        RESIZE: [ "nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize" ]
    },
    KEYBOARD: {
        Delete: 46,
        Left: 37,
        Up: 38,
        Right: 39,
        Enter: 13,
        Down: 40
    },
    COMMAND: {},
    __command__: {},
    __view__: {},
    __model__: {},
    uuids: [],
    FONT: {
        "American Typewriter": 19.363,
        Arial: 18.992,
        "Arial Hebrew": 18.105,
        "Bangla Sangam MN": 22.968,
        Baskerville: 19.448,
        Chalkduster: 21.47,
        Cochin: 19.499,
        Copperplate: 17.187,
        Courier: 17,
        "Courier New": 19.257,
        "Euphemia UCAS": 22.437,
        Futura: 22.071,
        "Geeza Pro": 20.842,
        Georgia: 19.315,
        "Gill Sans": 19.523,
        "Gujarati Sangam MN": 20.187,
        "Gurmukhi MN": 19.921,
        "Heiti SC": 17,
        "Heiti TC": 17,
        Helvetica: 19.55,
        "Helvetica Neue": 22.06,
        "Hoefler Text": 17,
        "Kannada Sangam MN": 25.342,
        "Malayalam Sangam MN": 20.187,
        Marion: 17,
        Noteworthy: 27.2,
        Optima: 20.179,
        "Oriya Sangam MN": 20.187,
        Palatino: 18.701,
        Papyrus: 26.23,
        "Party LET": 19.83,
        "Sinhala Sangam MN": 18.353,
        "Snell Roundhand": 21.437,
        "Tamil Sangam MN": 17,
        "Telugu Sangam MN": 25.342,
        "Times New Roman": 18.826,
        "Trebuchet MS": 19.739,
        Verdana: 20.66,
        "Zapf Dingbats": 16.842,
        Zapfino: 57.417
    },
    registerModel: function(a, b) {
        this.__model__[a] = b;
    },
    registerModelView: function(a, b) {
        this.__view__[a] = b;
    },
    registerCommand: function(a, b) {
        this.__command__[a] = b, MX.Painter.COMMAND[a] = a;
    },
    getCommand: function(a) {
        if (!a) return this.__command__;
        var b = this.__command__[a];
        if (!b) throw "Cannot find the command:" + a;
        return b;
    },
    getModelView: function(a, b) {
        var c = this.__view__[a];
        return b ? new c(b) : c;
    },
    getView: function(a, b) {
        var c = a.get("name");
        return b.model = a, this.getModelView(c, b);
    },
    getModel: function(a, b) {
        var c = this.__model__[a];
        if (!c) throw "Cannot find the Model:" + a;
        return b ? (b.name = a, new c(b)) : c;
    },
    getEntity: function(a) {
        if (!a || !a.parentNode) return a;
        a.parentNode;
    },
    log: function(a) {
        this.uuids.push(a);
    },
    hasLog: function(a) {
        return this.uuids.indexOf(a) >= 0;
    }
}), MX.Painter.Model = Backbone.Model.extend({
    defaults: {
        id: "",
        name: "",
        selected: !1,
        editing: !1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotate: 0
    },
    initialize: function() {
        if (!this.get("id")) {
            var a = uuid.v4();
            this.set("id", a), MX.Painter.log(a);
        }
    },
    registerChangeControl: function(a) {
        this._changeControl = a;
    },
    save: function() {
        this._changeControl && this._changeControl(this);
    },
    checkBround: function(a) {
        var b = this.getBround();
        return b.x1 <= 0 || b.y1 <= 0 ? !1 : b.x2 >= a.width || b.y2 >= a.height ? !1 : !0;
    },
    getBround: function() {
        var a = this.toJSON();
        return {
            x1: a.x,
            y1: a.y,
            x2: a.x + a.width,
            y2: a.y + a.height
        };
    },
    resize: function(a, b, c, d) {
        var e = this.getBround(), f = [ e.x1, e.y1 ], g = [ e.x2, e.y2 ], f = MX.Painter.Calculate.resize(a, b, c, f, d), g = MX.Painter.Calculate.resize(a, b, c, g, d), h = g[0] - f[0], i = g[1] - f[1];
        20 > h && (h = 20, [ 0, 7, 6 ].indexOf(d) < 0 ? g[0] = f[0] + h : f[0] = g[0] - h), 
        20 > i && (i = 20, [ 0, 1, 2 ].indexOf(d) < 0 ? g[1] = f[1] + i : f[1] = g[1] - i), 
        this.set("width", h), this.set("height", i), this.set("x", f[0]), this.set("y", f[1]), 
        this.set("x", f[0]);
    },
    syncResize: function(a) {
        var b = a.toJSON();
        this.set("width", b.width), this.set("height", b.height), this.set("x", b.x), this.set("y", b.y);
    },
    move: function(a, b) {
        var c = this.get("x"), d = this.get("y");
        this.set("x", c + a), this.set("y", d + b);
    },
    syncMove: function(a) {
        var b = a.get("x"), c = a.get("y");
        this.set("x", b), this.set("y", c);
    },
    getCenterPoint: function() {
        var a = this.getBround(), b = a.x1 + (a.x2 - a.x1) / 2, c = a.y1 + (a.y2 - a.y1) / 2;
        return [ b, c ];
    },
    get9GridPoints: function() {
        var a = this.getBround(), b = [], c = (a.x2 - a.x1) / 2, d = (a.y2 - a.y1) / 2;
        return b.push([ a.x1, a.y1 ]), b.push([ a.x1 + c, a.y1 ]), b.push([ a.x2, a.y1 ]), 
        b.push([ a.x2, a.y1 + d ]), b.push([ a.x2, a.y2 ]), b.push([ a.x1 + c, a.y2 ]), 
        b.push([ a.x1, a.y2 ]), b.push([ a.x1, a.y1 + d ]), b;
    },
    get2GridPoints: function() {
        var a = this.getBround(), b = [];
        b.push([ a.x1, a.y1 ]), b.push([ a.x2, a.y2 ]);
    },
    sync: function() {},
    toJSON: function() {
        return $.extend(!0, {}, this.attributes);
    },
    rotate: function(a) {
        return a && this.set("rotate", a), parseInt(this.get("rotate"), 10);
    }
}), function(a) {
    a.View = Backbone.View.extend({
        tagName: "svg:g",
        renderTo: null,
        initialize: function(a) {
            if (this.options = a, !this.model) throw "Painter View Need a model";
            this.listenTo(this.model, "destroy", this.destroy), this.listenTo(this.model, "change", this.update), 
            this.options.inGroup || this.svg.attr("id", "view_" + this.model.get("id")).attr("class", "p-item"), 
            a.renderTo && this.draw(a.renderTo);
        },
        listen: function(a, b, c) {
            a.on && a.on(b, $.proxy(c, this));
        },
        _ensureElement: function() {
            if (!this.el) {
                var a, b = this.attributes;
                a = _.isObject(b) ? b.svg ? b.svg : b.append ? b : d3.select(b) : d3.select(b);
                var c = a.append(_.result(this, "tagName"));
                this.svg = c, this.setElement(c[0][0], !1);
            }
        },
        update: function() {
            throw "you need rewrite update method";
        },
        destroy: function() {
            this.model && (this.stopListening(this.model), this.model.destroy()), this.trigger("destroy"), 
            this.$el.remove();
        },
        getPage: function() {
            var a = this.options.renderTo || this.options.attributes;
            return a && a.svg ? a : void 0;
        },
        getSvgNode: function() {
            return this.svg;
        },
        getSVGText: function() {
            return this.svg.select(".p-entity").node().outerHTML;
        }
    });
}(MX.Painter), function(a) {
    var b = MX.logger("Painter");
    a.Page = Backbone.View.extend({
        tagName: "div",
        className: "mx-painter",
        defaults: {
            Line: {
                stroke: "#0066de",
                "stroke-width": "6",
                fill: "none",
                "stroke-linecap": "round",
                "stroke-opacity": 1,
                "stroke-linejoin": "round"
            },
            HighLighter: {
                stroke: "#FFFF00",
                "stroke-width": "12",
                fill: "none",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-opacity": "0.5"
            },
            Text: {
                fill: "#FF0000",
                "font-size": 16,
                "background-color": "none",
                "font-family": "Helvetica"
            },
            Shape: {
                fill: "none",
                "stroke-width": 2,
                stroke: "#FF0000",
                "data-shape": "rectangle"
            },
            Arrow: {
                fill: "#FF0000",
                stroke: "#FF0000",
                "stroke-width": "1",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            }
        },
        initialize: function(b) {
            this.options = b, this.__elements__ = {}, this.__model__ = {}, this.id = "Page" + +new Date(), 
            this._editable = !1;
            var c = d3.select(this.el), d = this.svg = c.append("svg");
            d.attr("class", "painter-bg").attr("xmlns", "http://www.w3.org/2000/svg").attr("version", 1.1).attr("oncontextmenu", "return false;"), 
            d.attr("width", b.displayWidth || b.width).attr("height", b.displayHeight || b.height).attr("id", this.id).attr("viewBox", MX.format("0 0 {0} {1}", b.width, b.height)), 
            b.left && this.$el.css({
                left: b.left,
                top: b.top,
                position: "absolute"
            }), this.helper = this.svg.append("rect").attr("width", b.width).attr("height", b.height).attr("fill", "#fff").attr("fill-opacity", 0), 
            b.renderTo && this.$el.appendTo(b.renderTo), this.initCommand(), this.controlView = new a.ControlView({
                parent: this
            });
            var e, f, g = this, h = d3.behavior.drag();
            h.on("dragstart", function() {
                e = d3.mouse(g.svg.node()), g._notify("mousedown", this);
            }).on("drag", function() {
                g._notify("mousemove", this);
            }).on("dragend", function() {
                f = d3.mouse(g.svg.node()), "Select" === g.command && (Math.abs(e[0] - f[0]) < 5 || Math.abs(e[1] - f[1]) < 5) && g.select(), 
                g._notify("mouseup", this);
            }), d.call(h), this.$el.show();
        },
        initCommand: function() {
            var b, c = a.getCommand();
            this._cmds = {};
            for (var d in c) b = c[d], this._cmds[d] = new b(this);
        },
        resize: function(a, b) {
            this.svg.attr(a), 1 == b && (this.helper.attr(a), this.svg.attr("viewBox", "0 0 " + a.width + " " + a.height)), 
            this.size = a, this.viewScale = b, this.trigger("resize");
        },
        activeCommand: function(a) {
            this.command && (this._cmds[this.command].unactive(this), this.trigger("unactiveCommand", this.command, a)), 
            b.debug("activeCommand", a), this.command = a;
            var c = this._cmds[this.command];
            c && c.active ? (c.active(this), this.trigger("activeCommand", this.command)) : "Select" != a && this.select();
        },
        runCommand: function(a) {
            var b = this._cmds[a], c = arguments;
            return c[0] = this, b && b.run ? b.run.apply(b, c) : void 0;
        },
        getCommand: function(a) {
            return this._cmds[a];
        },
        lock: function() {
            this._lock = !0;
        },
        unlock: function() {
            this._lock = !1;
        },
        setMouse: function(a) {
            a || (a = "default"), this.$el.css("cursor", a);
        },
        getModel: function(a) {
            return this.__model__[a];
        },
        getView: function(a) {
            return this.__elements__[a];
        },
        addElement: function(c) {
            if (!c || !c.get) return void b.error("Painter Error:expect model but it's " + c);
            var d = c.get("name"), e = c.get("id"), f = this;
            if (this.__model__[e]) {
                if (this._selected && this._selected.get("id") === e) return;
                this.__model__[e].set(c.toJSON());
            } else this.__elements__[e] = a.getModelView(d, {
                attributes: this,
                model: c
            }), this.__elements__[e].svg.on("mouseover", function() {
                f._itemNotify("mouseover", this);
            }).call(this.getDragMoveListener()), this.__model__[e] = c, this.__model__[e].set(c.toJSON());
            return this.__elements__[e];
        },
        commit: function(a, c, d) {
            c && (this.trigger(a, c, d), b.debug("trigger", a));
        },
        getSvgNode: function() {
            return this._svg;
        },
        getContentNode: function() {
            return this.svg;
        },
        update: function(a) {
            if (a = $.extend({}, a), this._selected) {
                var b = this._selected.clone();
                this._selected.set(a), this.trigger("changeElement", this._selected, b);
            }
        },
        select: function(a) {
            !this._lock && this._editable && (this._selected && (!a || a && this._selected.get("id") != a.get("id")) && (this._selected.set({
                selected: !1
            }), this.trigger("unselectElement", this._selected), this._selected = null), a ? (1 != a.get("selected") && a.set("selected", !0), 
            "Select" != this.command && this.activeCommand("Select"), this._selected = a, this.controlView.show(a), 
            this.trigger("selectElement", a)) : (this.controlView.hide(), this.trigger("selectElement")));
        },
        getSelectedModel: function() {
            return this._selected;
        },
        deleteElement: function(a) {
            var b;
            if ((a || this._selected) && (a ? b = this.getModel(a) : (b = this._selected, this._selected = null, 
            a = b.get("id")), b)) {
                this.trigger("deleteElement", b);
                var c = this.__elements__[a];
                c.destroy(), b.destroy(), this.__model__[a] = null, this.__elements__[a] = null, 
                this.controlView.hide();
            }
        },
        clear: function() {
            for (var a in this.__elements__) {
                var b = this.__elements__[a];
                b && b.destroy && b.destroy();
            }
            this.__model__ = [];
        },
        destroy: function() {
            for (var a in this.__elements__) {
                var b = this.__elements__[a];
                b && b.destroy && b.destroy();
            }
            this.$el.remove();
        },
        exit: function() {
            this.select(), this.destroy(), this.stopListen(), this.trigger("exit");
        },
        _onHoverItem: function() {},
        getDragMoveListener: function() {
            if (!this._elementDragListener) {
                var a, b, c = d3.behavior.drag(), d = this, e = [], f = [], g = !1;
                c.on("dragstart", function() {
                    if (d.canEditItem()) {
                        d3.event.sourceEvent.stopPropagation();
                        var c = $(this), f = c.attr("id");
                        if (f ? (f = f.substr(5), this._model = d.getModel(f), d.select(this._model)) : this._model = d.getSelectedModel(), 
                        !this._model) return void (g = !1);
                        g = !0, e = d3.mouse(d.svg.node()), a = this._model.clone(), b = this._model.clone();
                    }
                }).on("drag", function() {
                    if (d.canEditItem() && g) {
                        d3.event.sourceEvent.stopPropagation(), f = d3.mouse(d.svg.node());
                        var a = f[0] - e[0], c = f[1] - e[1];
                        b.move(a, c), b.checkBround(d.options) && (this._model.move(a, c), e = f);
                    }
                }).on("dragend", function() {
                    if (d.canEditItem() && g) {
                        var b = a.toJSON(), c = this._model.toJSON(), e = b.x - c.x, f = b.y - c.y;
                        d3.event.sourceEvent.stopPropagation(), (Math.abs(e) > 5 || Math.abs(f) > 5) && d.trigger("changeElement", this._model, a);
                    }
                }), this._elementDragListener = c;
            }
            return this._elementDragListener;
        },
        startListen: function() {
            if (!this._listening) {
                var a = this, b = Moxtra.const, c = b.KEYBOARD_Delete;
                MX.env.isMac && (c = b.KEYBOARD_BackSpace), $(window).on("keyup.painter", function(d) {
                    if (d.keyCode === c) return void a.deleteElement();
                    if (d.ctrlKey) switch (d.keyCode) {
                      case b.KEYBOARD_Z:
                        a.runCommand("Undo");
                        break;

                      case b.KEYBOARD_R:
                        a.runCommand("Redo");
                    }
                }), this.$el.addClass("edit-model"), this._listening = !0;
            }
        },
        selectedModel: function(a) {
            a ? this.$el.addClass("selected-model") : this.$el.removeClass("selected-model");
        },
        stopListen: function() {
            this.helper.on(".painter", null), this.$el.off(".painter"), this.select(), $(window).off(".painter"), 
            this.$el.removeClass("edit-model"), this._listening = !1;
        },
        _itemNotify: function(a, b) {
            b = $(b);
            var c = b.attr("id").substr(5), d = this.getModel(c);
            d && this.trigger("item" + MX.capitalize(a), d, this);
        },
        _notify: function(a, b) {
            var c = d3.mouse(b);
            c = [ Math.floor(c[0]), Math.floor(c[1]) ], this._editable && this.trigger(a, c, this);
        },
        canEditItem: function() {
            return this._editable && this._itemEditable;
        },
        itemEditable: function(a) {
            this._itemEditable = a;
        },
        editable: function(b) {
            b === !1 ? (this.stopListen(), this.setMouse(a.MOUSE.DEFAULT)) : this.startListen(), 
            this._editable = b;
        }
    });
}(MX.Painter), function(a) {
    a.ControlView = Backbone.View.extend({
        tagName: "div",
        className: "mx-control",
        initialize: function(a) {
            var b = d3.select(this.el), c = this.svg = b.append("svg");
            this.parent = a.parent, c.attr("class", "painter-control").attr("xmlns", "http://www.w3.org/2000/svg").attr("version", 1.1);
            var d = this.getPageSize();
            c.attr("width", d.width).attr("height", d.height).attr("viewBox", MX.format("0 0 {0} {1}", d.width, d.height)), 
            this.parent.on("resize", this._onResize, this), this._onResize(), this.controls = {}, 
            this.currentControl = null, this.$el.appendTo(this.parent.el);
        },
        getPageSize: function() {
            var a = this.parent.options;
            return {
                width: a.width,
                height: a.height
            };
        },
        getModel: function() {
            return this.parent.getSelectedModel();
        },
        _onResize: function() {
            var a = this.parent.svg, b = a.attr("width"), c = a.attr("height");
            this.svg.attr("width", b).attr("height", c).attr("viewBox", MX.format("0 0 {0} {1}", b, c)), 
            this.scale = this.parent.viewScale, this._type && this.controls[this._type].draw();
        },
        show: function(b, c) {
            var d = b.get("name"), e = "defaultControl";
            /Arrow/.test(d) && (e = "lineControl"), this._type && this._type != e && this.controls[this._type].hide(), 
            this.controls[e] || (this.controls[e] = new a[e]({
                attributes: this.svg,
                model: b,
                parent: this
            })), this.controls[e].show(b, c), this._type = e, this.$el.show();
        },
        hide: function() {
            this._type && (this.controls[this._type].hide(), this._type = null), this.$el.hide();
        }
    }), a.defaultControl = a.View.extend({
        tagName: "svg:g",
        clsName: "painter-control ",
        initialize: function(b) {
            a.View.prototype.initialize.apply(this, arguments), this.parent = b.parent, this.draw();
        },
        draw: function() {
            var a = this.model, b = this.adjustPoint(a.get9GridPoints()), c = a.rotate(), d = a.getBround(), e = [];
            e.push(d.x1 + (d.x2 - d.x1) / 2), e.push(d.y1 + (d.y2 - d.y1) / 2), e = this.adjustPoint([ e ]), 
            this.drawBoundary(b), this.drawContrlPoint(b), this.supportRotate() && this.drawRotatePoint(b);
            var f = [ c || 0 ];
            f = f.concat(e), this.svg.attr("transform", "rotate(" + f.join(", ") + ")");
        },
        supportRotate: function() {
            var a = this.model.get("name");
            return !/Shape|Line|Text|HighLighter/.test(a);
        },
        getDragRotateListener: function() {
            function a(a, b) {
                return a[0] === b[0] && a[1] === b[1] ? Math.PI / 2 : Math.atan2(b[1] - a[1], b[0] - a[0]);
            }
            function b(a) {
                return a * (180 / Math.PI);
            }
            var c, d, e, f = this, g = f.parent.parent, h = f.model, i = d3.behavior.drag().on("dragstart", function() {
                d3.event.sourceEvent.stopPropagation(), h = f.parent.getModel(), c = parseInt(h.get("rotate") || 0), 
                d = f.adjustPoint([ h.getCenterPoint() ]), e = h.clone();
            }).on("drag", function() {
                var e = [ d3.event.x, d3.event.y ], f = a(d, e);
                c += b(f + Math.PI / 2), c = parseInt(parseInt(c).toFixed(2)), h.rotate(c);
            }).on("dragend", function() {
                d3.event.sourceEvent.stopPropagation(), g.trigger("changeElement", f.model, e);
            });
            return i;
        },
        drawRotatePoint: function(a) {
            var b, c = 5, d = this.parent.scale;
            d > 1 && (c += c * (d - 1)), b = [ a[1][0], a[1][1] - 20 ], this.svg.selectAll("circle");
            var e = this.svg.selectAll("circle.angle"), f = e.data([ b ]);
            e.size() || f.enter().append("circle").call(this.getDragRotateListener()), f.attr("class", "angle").attr("stroke", 1).attr("cx", function(a) {
                return a[0];
            }).attr("cy", function(a) {
                return a[1];
            }).attr("r", c);
        },
        getDragResizeListener: function() {
            if (this._dragListener) return this._dragListener;
            var a, b, c, d, e, f, g = this, h = g.parent.parent, i = h.svg, j = [ 4, 5, 6, 7, 0, 1, 2, 3 ], k = g.parent.getPageSize();
            return this._dragListener = d3.behavior.drag().on("dragstart", function() {
                d3.event.sourceEvent.stopPropagation(), a = d3.mouse(i.node()), c = d3.select(this).attr("data-index"), 
                f = g.model.get9GridPoints(), b = f[j[c]], d = g.model.clone(), e = g.model.clone();
            }).on("drag", function() {
                var e = d3.mouse(i.node());
                e[0] = Math.min(k.width, Math.max(0, e[0])), e[1] = Math.min(k.height, Math.max(0, e[1])), 
                d.resize(b, a, e, parseInt(c, 10)), g.model.syncResize(d), a = e;
            }).on("dragend", function() {
                d3.event.sourceEvent.stopPropagation(), h.trigger("changeElement", g.model, e);
            }), this._dragListener;
        },
        drawContrlPoint: function(a) {
            var b = 4.5, c = 9, d = this.parent.scale;
            d > 1 && (b = 4.5 + 4.5 * (d - 1), c = 9 + 9 * (d - 1)), this.svg.selectAll("rect").attr("width", c).attr("height", c);
            var e = this.svg.selectAll("rect"), f = e.data(a);
            e.size() || f.enter().append("rect").attr("width", c).attr("height", c).attr("class", function(a, b) {
                return "point point" + b;
            }).attr("data-index", function(a, b) {
                return b;
            }).call(this.getDragResizeListener()), f.attr("x", function(a) {
                return a[0] - c / 2;
            }).attr("y", function(a) {
                return a[1] - c / 2;
            });
        },
        drawBoundary: function(a) {
            var b, c = d3.svg.line(), d = a[0];
            a = a.slice(), this.supportRotate() ? (b = [ a[1][0], a[1][1] - 20 ], a[0] = b, 
            a.push(d), a.push(a[1])) : a = a.concat([ a[0] ]);
            var e = this.svg.selectAll(".boundary");
            if (e.size()) return void this.svg.selectAll(".boundary").attr("d", c(a));
            this.svg.append("path").attr("class", "line").attr("d", c(a)).attr("class", "boundary").attr("stroke-width", 1);
            this.hit = this.svg.append("path").attr("class", "boundary boundary-hit").attr("stroke-width", 20).attr("opacity", 0).call(this.parent.parent.getDragMoveListener());
        },
        adjustPoint: function(a, b) {
            var c = [], d = this.parent.scale || 1;
            return MX.each(a, function(a) {
                c.push(b ? [ a[0] / d, a[1] / d ] : [ d * a[0], d * a[1] ]);
            }), c.length > 1 ? c : c[0];
        },
        update: function(a) {
            a ? this.show(a) : this.hide();
        },
        hide: function() {
            this.svg.attr("opacity", 0), this.model && (this.stopListening(this.model), this.model = null), 
            this.svg.attr("style", "display:none");
        },
        show: function(a) {
            if (a) {
                var b = this.svg;
                b.selectAll("path").remove(), b.selectAll("rect").remove(), b.selectAll("circle").remove(), 
                this.model && a != this.model && this.stopListening(this.model), this.svg.attr("opacity", 1), 
                this.model = a, this.listenTo(a, "change", this.draw), this.draw(), this.svg.attr("style", "");
            }
        }
    });
}(MX.Painter), function(a) {
    a.lineControl = a.View.extend({
        tagName: "svg:g",
        clsName: "painter-control ",
        initialize: function(b) {
            a.View.prototype.initialize.apply(this, arguments), this.parent = b.parent, this.draw();
        },
        draw: function() {
            !this.model || !this.parent.getModel(), this.drawContrlPoint(this.model);
        },
        getDragListener: function() {
            if (this._dragListener) return this._dragListener;
            var a, b = this, c = b.parent.parent, d = c.svg, e = b.parent.getPageSize();
            return this._dragListener = d3.behavior.drag().on("dragstart", function(c) {
                this.__origin__ = c, d3.event.sourceEvent.stopPropagation(), this._model = b.parent.getModel(), 
                a = this._model;
            }).on("drag", function() {
                d3.event.sourceEvent.stopPropagation();
                var a = d3.mouse(d.node());
                a[0] = Math.min(e.width, Math.max(0, a[0])), a[1] = Math.min(e.height, Math.max(0, a[1]));
                var b = d3.select(this).attr("data-index"), c = "endPoint";
                0 === parseInt(b) && (c = "startPoint"), d3.select(this).attr("cx", a[0]).attr("cy", a[1]), 
                this._model && this._model.set(c, a);
            }).on("dragend", function() {
                d3.event.sourceEvent.stopPropagation(), c.trigger("changeElement", this._model, a), 
                delete this.__origin__, delete this._model;
            }), this._dragListener;
        },
        adjustPoint: function(a, b) {
            var c = [], d = this.parent.scale || 1;
            return MX.each(a, function(a) {
                c.push(b ? [ a[0] / d, a[1] / d ] : [ d * a[0], d * a[1] ]);
            }), c.length > 1 ? c : c[0];
        },
        drawContrlPoint: function() {
            var a, b = "#5da2ff", c = this;
            a = c.parent.getModel().toJSON();
            var d = c.adjustPoint([ a.startPoint, a.endPoint ]), e = this.svg.selectAll("circle"), f = e.data(d);
            e.size() || f.enter().append("circle").attr("class", "arrow").attr("stroke", "#fff").attr("stroke-width", 1).attr("fill", b).attr("r", 5).attr("data-index", function(a, b) {
                return b;
            }).call(this.getDragListener()), f.attr("cx", function(a) {
                return a[0];
            }).attr("cy", function(a) {
                return a[1];
            });
        },
        update: function(a) {
            a ? this.show(a) : this.hide();
        },
        hide: function() {
            this.svg.attr("opacity", 0), this.model && (this.stopListening(this.model), this.model = null), 
            this.svg.attr("style", "display:none");
        },
        show: function(a) {
            a && (this.model && a != this.model && this.stopListening(this.model), this.svg.attr("opacity", 1), 
            this.model = a, this.listenTo(a, "change", this.draw), this.draw(), this.svg.attr("style", ""));
        }
    });
}(MX.Painter), MX.Painter.Command = function(a) {
    this.initialize(a);
}, MX.Painter.Command.extend = Backbone.Model.extend, MX.extend(MX.Painter.Command.prototype, Backbone.Events, {
    initialize: function() {},
    handlePageEvent: function(a, b, c) {
        this[a] && this[a](b, c);
    },
    getPage: function() {}
}), MX.Painter.Calculate = {
    resize: function(a, b, c, d, e) {
        for (var f = 0; 2 > f; f++) a[f] = parseFloat(a[f]), b[f] = parseFloat(b[f]), c[f] = parseFloat(c[f]), 
        d[f] = parseFloat(d[f]);
        var g, h, i, j, k, l, m;
        h = g = d[0], m = c[0] - b[0];
        var n = [ 0, 6, 7 ], o = [ 0, 1, 2 ];
        return [ 1, 5 ].indexOf(e) < 0 && (k = m / Math.max(Math.abs(b[0] - a[0]), 1), g = n.indexOf(e) > -1 ? h - (h - a[0]) * k : h + (h - a[0]) * k), 
        j = i = d[1], m = c[1] - b[1], [ 3, 7 ].indexOf(e) < 0 && (l = m / Math.max(Math.abs(b[1] - a[1]), 1), 
        i = o.indexOf(e) > -1 ? j - (j - a[1]) * l : j + (j - a[1]) * l), [ this.roundTo(g, 3), this.roundTo(i, 3) ];
    },
    rotate: function(a, b, c, d, e) {
        e = e / 180 * Math.PI;
        var f, g;
        return f = a + c * Math.cos(e) - d * Math.sin(e), g = b + d * Math.cos(e) + c * Math.sin(e), 
        [ f, g ];
    },
    getAngleByPoints: function(a, b, c) {
        var d, e, f, g, h, i;
        return d = b[0] - a[0], e = b[1] - a[1], f = c[0] - a[0], g = c[1] - a[1], h = Math.sqrt(d * d + e * e) * Math.sqrt(f * f + g * g), 
        0 === h ? -1 : (i = Math.acos((d * f + e * g) / h), i = b[0] < c[0] || b[1] < c[1] ? 180 * i / Math.PI : -(180 * i / Math.PI), 
        Math.floor(100 * i) / 100);
    },
    adjustPoint: function(a, b, c) {
        var d = [];
        return b = b || 1, MX.each(a, function(a) {
            d.push(c ? [ a[0] / b, a[1] / b ] : [ b * a[0], b * a[1] ]);
        }), d.length > 1 ? d : d[0];
    },
    roundTo: function(a, b) {
        a = parseFloat(a), b = parseInt(b, 10);
        var c = Math.pow(10, b);
        return Math.round(a * c) / c;
    }
}, function(a) {
    function b(a) {
        return function(b) {
            return MX.format(a, b);
        };
    }
    function c(a) {
        if (!d) {
            var b = $(Moxtra.util.format(f, {
                source: a || ""
            })).appendTo("body");
            b.css({
                top: -1e3,
                position: "absolute"
            }), d = new MediaElement("audioTagAudio", {
                enablePluginDebug: !1,
                pluginPath: "lib/mediaelement/build/",
                flashName: "flashmediaelement.swf",
                success: function() {},
                error: function(a) {
                    console.error(a);
                }
            });
        }
        return d;
    }
    var d, e = MX.logger("Painter:Helper"), f = '<audio id="audioTagAudio" controls="controls"><source src="{{source}}" type="audio/x-m4a"><source src="{{source}}" type="audio/mpeg"></audio>';
    a.Helper = {
        svgToModel: function(a, b, c, d) {
            var e, f = $(a), g = f.get(0);
            return g && g.tagName ? (e = g.tagName.toLowerCase(), this["_parse" + MX.capitalize(e)] ? this["_parse" + MX.capitalize(e)](f, b, c, d, a) : null) : !1;
        },
        _parsePolygon: function(b, c) {
            var d = b.css("fill"), e = {
                id: c,
                points: b.attr("points"),
                style: {
                    fill: "transparent" === d ? "none" : d,
                    "stroke-width": b.css("stroke-width"),
                    stroke: b.css("stroke"),
                    "data-shape": "pentagon"
                }
            };
            return a.getModel("Shape", e);
        },
        _parseEllipse: function(b, c) {
            var d = b.css("fill"), e = {
                id: c,
                cx: b.attr("cx"),
                cy: b.attr("cy"),
                rx: b.attr("rx"),
                ry: b.attr("ry"),
                style: {
                    fill: "transparent" === d ? "none" : d,
                    "stroke-width": b.css("stroke-width"),
                    stroke: b.css("stroke"),
                    "data-shape": "ellipse"
                }
            };
            return a.getModel("Shape", e);
        },
        _parseRect: function(b, c) {
            var d = b.css("fill"), e = {
                id: c,
                x: b.attr("x"),
                y: b.attr("y"),
                width: b.attr("width"),
                height: b.attr("height"),
                rx: b.attr("rx"),
                ry: b.attr("ry"),
                style: {
                    fill: "transparent" === d ? "none" : d,
                    "stroke-width": b.css("stroke-width"),
                    stroke: b.css("stroke"),
                    "data-shape": "rectangle"
                }
            };
            return a.getModel("Shape", e);
        },
        _parseLine: function(b, c) {
            var d = {
                id: c,
                x1: b.attr("x1"),
                y1: b.attr("y1"),
                x2: b.attr("x2"),
                y2: b.attr("y2"),
                style: {
                    "stroke-width": b.css("stroke-width"),
                    stroke: b.css("stroke"),
                    "data-shape": "line"
                }
            };
            return a.getModel("Shape", d);
        },
        _parsePath: function(b, c, d) {
            for (var e, f = b.attr("d"), g = [], h = this.parsePathData(f), i = [], j = 0; j < h.length; j++) if (i.push({
                name: h[j].command,
                count: h[j].points.length / 2,
                start: g.length
            }), h[j].points.length > 0) for (var k = 0; k < h[j].points.length; k++) g.push([ h[j].points[k], h[j].points[k + 1] ]), 
            k++;
            var l = 0, m = b.attr("transform"), n = b.css("stroke-opacity");
            if (m && (l = m.replace("rotate(", "").split(",")[0]), e = {
                id: c,
                style: {
                    stroke: b.attr("stroke") || b.css("stroke") || "blue",
                    "stroke-opacity": n || 1,
                    "stroke-width": parseInt(b.attr("stroke-width") || b.css("stroke-width")) || 1,
                    fill: b.css("fill")
                },
                rotate: l
            }, b.attr("fill") && (e.fill = b.attr("fill")), e.style.fill || (e.style.fill = e.fill), 
            d.type === Moxtra.const.PAGE_ELEMENT_TYPE_ARROW) {
                e.style.stroke = e.fill || e.style.fill;
                var o = this._parseArrowPoint(i, g);
                return e.startPoint = o.firstPoint, e.endPoint = o.lastPoint, a.getModel("Arrow", e);
            }
            e.points = g, e.command = i;
            var p = n ? "HighLighter" : "Line";
            return "1" === n && (p = "Line"), a.getModel(p, e);
        },
        _parseArrowPoint: function(a, b) {
            function c(a, b) {
                return [ .5 * (a[0] + b[0]), .5 * (a[1] + b[1]) ];
            }
            for (var d, e = (b[0], b[a[2].start]), f = b[13], g = b[0], h = 0, i = 0, j = a.length - 1; j >= 0; j--) switch (d = a[j], 
            d.name) {
              case "L":
                h++, 3 === h && (f = b[d.start]);
                break;

              case "C":
                i++, 2 === i && (e = b[d.start + d.count], g = c(g, e));
            }
            return {
                firstPoint: g,
                lastPoint: f
            };
        },
        parsePathData: function(a) {
            if (!a) return [];
            var b = a, c = [ "m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A" ];
            b = b.replace(new RegExp(" ", "g"), ",");
            for (var d = 0; d < c.length; d++) b = b.replace(new RegExp(c[d], "g"), "|" + c[d]);
            var e, f, g, h = b.split("|"), i = [], j = 0, k = 0;
            for (d = 1; d < h.length; d++) {
                var l = h[d], m = l.charAt(0);
                l = l.slice(1), l = l.replace(new RegExp(",-", "g"), "-"), l = l.replace(new RegExp("-", "g"), ",-"), 
                l = l.replace(new RegExp("e,-", "g"), "e-");
                var n = l.split(",");
                n.length > 0 && "" === n[0] && n.shift();
                for (var o = 0; o < n.length; o++) n[o] = parseFloat(n[o]);
                for (;n.length > 0 && !isNaN(n[0]); ) {
                    var p = null, q = [], r = j, s = k;
                    switch (m) {
                      case "l":
                        j += n.shift(), k += n.shift(), p = "L", q.push(j, k);
                        break;

                      case "L":
                        j = n.shift(), k = n.shift(), q.push(j, k);
                        break;

                      case "m":
                        j += n.shift(), k += n.shift(), p = "M", q.push(j, k), m = "l";
                        break;

                      case "M":
                        j = n.shift(), k = n.shift(), p = "M", q.push(j, k), m = "L";
                        break;

                      case "h":
                        j += n.shift(), p = "L", q.push(j, k);
                        break;

                      case "H":
                        j = n.shift(), p = "L", q.push(j, k);
                        break;

                      case "v":
                        k += n.shift(), p = "L", q.push(j, k);
                        break;

                      case "V":
                        k = n.shift(), p = "L", q.push(j, k);
                        break;

                      case "C":
                        q.push(n.shift(), n.shift(), n.shift(), n.shift()), j = n.shift(), k = n.shift(), 
                        q.push(j, k);
                        break;

                      case "c":
                        q.push(j + n.shift(), k + n.shift(), j + n.shift(), k + n.shift()), j += n.shift(), 
                        k += n.shift(), p = "C", q.push(j, k);
                        break;

                      case "S":
                        e = j, f = k, g = i[i.length - 1], "C" === g.command && (e = j + (j - g.points[2]), 
                        f = k + (k - g.points[3])), q.push(e, f, n.shift(), n.shift()), j = n.shift(), k = n.shift(), 
                        p = "C", q.push(j, k);
                        break;

                      case "s":
                        e = j, f = k, g = i[i.length - 1], "C" === g.command && (e = j + (j - g.points[2]), 
                        f = k + (k - g.points[3])), q.push(e, f, j + n.shift(), k + n.shift()), j += n.shift(), 
                        k += n.shift(), p = "C", q.push(j, k);
                        break;

                      case "Q":
                        q.push(n.shift(), n.shift()), j = n.shift(), k = n.shift(), q.push(j, k);
                        break;

                      case "q":
                        q.push(j + n.shift(), k + n.shift()), j += n.shift(), k += n.shift(), p = "Q", q.push(j, k);
                        break;

                      case "T":
                        e = j, f = k, g = i[i.length - 1], "Q" === g.command && (e = j + (j - g.points[0]), 
                        f = k + (k - g.points[1])), j = n.shift(), k = n.shift(), p = "Q", q.push(e, f, j, k);
                        break;

                      case "t":
                        e = j, f = k, g = i[i.length - 1], "Q" === g.command && (e = j + (j - g.points[0]), 
                        f = k + (k - g.points[1])), j += n.shift(), k += n.shift(), p = "Q", q.push(e, f, j, k);
                    }
                    i.push({
                        command: p || m,
                        points: q,
                        start: {
                            x: r,
                            y: s
                        }
                    });
                }
                ("z" === m || "Z" === m) && i.push({
                    command: "z",
                    points: [],
                    start: void 0,
                    pathLength: 0
                });
            }
            return i;
        },
        _parseText: function(b, c, d, e, f) {
            var g, h, i, j = {};
            f && f.match && (h = f.match(/<textarea[^>]+?style="([^"]+)/i)[1], h = h.split(";"), 
            MX.each(h, function(a) {
                i = a.split(":"), "" != i[1] && (j[i[0]] = i[1]);
            }));
            var k = parseInt(j["font-size"] || 20, 10);
            return g = {
                id: c,
                style: {
                    fill: j.fill || j.color || "blue",
                    "background-color": j["background-color"],
                    "font-family": j["font-family"] || "Arial",
                    "font-size": k,
                    "font-weight": j["font-weight"] || "normal",
                    "font-style": j["font-style"] || "normal",
                    "text-align": j["text-align"] || "start",
                    "line-height": b.attr("lineHeight") || 0
                },
                opacity: j["stroke-opacity"] || 1,
                x: parseInt(b.attr("x")),
                y: parseInt(b.attr("y")),
                text: b.text(),
                width: parseInt(b.attr("width")),
                height: parseInt(b.attr("height")),
                isNote: "1" == b.attr("line") ? !0 : !1
            }, a.getModel("Text", g);
        },
        _parseTextarea: function(a, b, c, d, e) {
            return this._parseText(a, b, c, d, e);
        },
        _parseAudio: function(b, c, d, e) {
            var f, g, h = e.toJSON(), i = b.attr("xlink:href");
            return h.hash = i, g = MX.format("/board/{{boardid}}/{{sequence}}/{{hash}}", h), 
            g = Moxtra.util.makeAccessTokenUrl(g), f = {
                id: c,
                url: i,
                source: g
            }, a.getModel("Audio", f);
        },
        _parseG: function(b, c, d, f, g) {
            c.indexOf("_") && (c = c.split("_").pop());
            var h, i, j = {
                id: c
            }, k = b.attr("id");
            k && k.indexOf("_") && (i = k.split("_"), k = i.shift(), /textTag|audioTag|audioBubble/.test(k) ? (j.imgIndex = i.shift(), 
            "audioBubble" !== k && (j.flipped = i.shift())) : k = "Group");
            var l, m, n, o = {
                rotate: /rotate\(([^\)]*?)\)/,
                translate: /translate\(([^\)]*?)\)/,
                scale: /scale\(([^\)]*?)\)/
            }, p = g.match(/<g[^>]*?>/i), q = {};
            if (p.length) {
                p = p[0];
                for (n in o) if (l = p.match(o[n])) {
                    if (m = l[1], m.indexOf(",") > 0) {
                        m = m.split(",");
                        for (var r = 0; r < m.length; r++) m[r] = parseFloat(m[r]);
                    } else m = parseFloat(m);
                    "rotate" === n && (m = m[0]), q[n] = m;
                }
                j.transform = q;
            }
            return h = a.getModel(k || "Group", j), g.replace(/<g[^>]*?>/i, "").replace("</g>", "").replace(/<[^>]+>/g, function(b) {
                if ("</textArea>" !== b) {
                    if (0 === b.indexOf("<textArea")) {
                        var c = g.indexOf(b);
                        b = g.substr(c), c = b.indexOf("</textArea>"), b = b.substr(0, c + 11);
                    }
                    var i = a.Helper.svgToModel(b, $(b).attr("id"), d, f);
                    if (i) {
                        var j = i.get("name");
                        if ("Audio" === j) {
                            var k = h.getCenterPoint();
                            i.set({
                                x: k[0],
                                y: k[1]
                            });
                        }
                        h.addChildren(i);
                    } else e.log(b);
                }
            }), h;
        },
        _parseImg: function(b, c, d, e) {
            if (e) {
                var f, g, h, i = 0, j = b.attr("transform");
                return j && (i = j.replace("rotate(", "").split(",")[0]), f = e.$name ? {
                    boardid: e.boardid,
                    sequence: e.sequence
                } : e.toJSON(), f.file = b.attr("xlink:href"), h = MX.format("/board/{{boardid}}/{{sequence}}/{{file}}", f), 
                f.token && (h += "?t=" + f.token), h = Moxtra.util.makeAccessTokenUrl(h), g = {
                    id: c,
                    x: parseInt(b.attr("x")),
                    y: parseInt(b.attr("y")),
                    width: parseInt(b.attr("width")),
                    height: parseInt(b.attr("height")),
                    file: b.attr("xlink:href"),
                    rotate: i,
                    url: h
                }, a.getModel("Image", g);
            }
        },
        toSVGText: function(a, b) {
            var c = a.get("name");
            /textTag|audioTag|audioBubble/.test(c) && (c = "Group");
            var d = this["_" + c](a, b);
            return d && (d = d.replace(/<\?XML:[^>]*?>/gi, function() {
                return "";
            })), d;
        },
        _create: function(a) {
            return $(document.createElement(a));
        },
        _Image: function(a) {
            var b = a.toJSON(), c = b.rotate;
            if (c && 0 !== c) {
                var d = a.getCenterPoint();
                b.transform = "rotate(" + c + "," + d[0] + "," + d[1] + " )";
            } else b.transform = "rotate(0,0,0)";
            var e = Handlebars.compile('<image x="{{x}}" y="{{y}}" width="{{width}}" height="{{height}}" xlink:href="{{{file}}}" preserveAspectRatio="none" transform="{{transform}}"/>');
            return e(b);
        },
        _Text: function(a) {
            var b = Handlebars.compile('<textArea line="{{line}}" x="{{x}}" y="{{y}}" width="{{width}}" height="{{height}}" style="fill:{{style.fill}};font-family:{{style.font-family}};font-size:{{style.font-size}}px;font-style:{{style.font-style}};font-weight:{{style.font-weight}};text-align:{{style.text-align}};" stroke="{{style.stroke}}" >{{text}}</textArea>'), c = a.toJSON();
            return "" === $.trim(c.text) ? null : (c.isNote && (c.line = 1), b(c));
        },
        _Group: function(b, c) {
            var d, e = b.get("id"), f = b.get("imgIndex"), g = b.get("flipped");
            switch (b.get("name")) {
              case "textTag":
                e = [ "textTag", f, g, e ].join("_"), d = e + ".click";
                break;

              case "audioTag":
                e = [ "audioTag", f, g, e ].join("_");
                break;

              case "audioBubble":
                e = [ "audioBubble", f, e ].join("_");
            }
            var h = [ '<g id="', e, '"' ];
            d && h.push(' view="' + d + '" ');
            var i, j, k = "", l = b.toJSON();
            for (j in l.transform) i = l.transform[j], "rotate" == j && (i = [ i ].concat(b.getCenterPoint())), 
            k += j + "(" + (Array.isArray(i) ? i.join(", ") : i) + ")";
            k && h.push(' transform="' + k + '" '), h.push(" >");
            b.get("x"), b.get("y");
            return b.each(function(b) {
                h.push(a.Helper.toSVGText(b, c.getView(b)));
            }), h.push("</g>"), h.join("");
        },
        _Audio: function(a) {
            return '<audio audioLevel="1.0" begin="audioBubble_' + a.get("id") + '.click" type="audio/x-caf" xlink:href="' + a.get("url") + '" />';
        },
        _Shape: function(a) {
            var b = a.toJSON();
            b.shape = b.style["data-shape"];
            var c, d = b.rotate;
            if (d && 0 !== d) {
                var e = a.getCenterPoint();
                b.transform = "rotate(" + d + "," + e[0] + "," + e[1] + " )";
            } else b.transform = "rotate(0,0,0)";
            return "undefined" != typeof b.points ? c = Handlebars.compile('<polygon points="{{points}}" style="fill:{{style.fill}};stroke-width:{{style.stroke-width}};stroke:{{style.stroke}}" data-shape="{{shape}}" transform="{{transform}}" />') : "undefined" != typeof b.width ? c = Handlebars.compile('<rect x="{{x}}" y="{{y}}"  rx="4" ry="4" width="{{width}}" height="{{height}}" style="fill:{{style.fill}};stroke-width:{{style.stroke-width}};stroke:{{style.stroke}}" data-shape="{{shape}}"  transform="{{transform}}" />') : "undefined" != typeof b.x1 ? c = Handlebars.compile('<line x1="{{x1}}" y1="{{y1}}" x2="{{x2}}" y2="{{y2}}" style="stroke-width:{{style.stroke-width}};stroke:{{style.stroke}}" data-shape="{{shape}}"  transform="{{transform}}" />') : "undefined" != typeof b.cx && (c = Handlebars.compile('<ellipse cx="{{cx}}" cy="{{cy}}" rx="{{rx}}" ry="{{ry}}" style="fill:{{style.fill}};stroke-width:{{style.stroke-width}};stroke:{{style.stroke}}" data-shape="{{shape}}"  transform="{{transform}}" />')), 
            c(b);
        },
        _Arrow: function(a, b) {
            return this._Line(a, b);
        },
        _Line: function(a, c) {
            var d = this._create("path"), e = a.toJSON(), f = b("fill:${fill};stroke:${stroke};stroke-opacity:${stroke-opacity};stroke-width:${stroke-width}px;stroke-linecap:${lineCap};stroke-linejoin:${lineJoin};"), g = a.getCenterPoint(), h = e.rotate, i = c.svg.select(".p-entity").attr("d");
            return e.style.lineJoin = "round", e.style.lineCap = "round", d.attr({
                style: f(e.style),
                d: i
            }), h && 0 !== h && d.attr({
                transform: "rotate(" + h + "," + g[0] + "," + g[1] + " )"
            }), d[0].outerHTML;
        },
        playAudio: function(a) {
            var b = c();
            b && b.setSrc && b.play && (b.setSrc(a), b.play());
        },
        stopPlay: function() {
            var a = c();
            a && a.stop && a.stop();
        }
    }, a.Helper._HighLighter = a.Helper._Line;
}(MX.Painter), function(a) {
    var b = a.Command.extend({
        active: function(b) {
            b.setMouse(a.MOUSE.DEFAULT), b.$el.addClass("edit-model"), b.on("itemMousedown", this.mousedown, this).on("mouseup", this.mouseup, this), 
            b.selectedModel(!0);
        },
        unactive: function(a) {
            a.setMouse(), a.$el.removeClass("edit-model"), a.off(null, null, this), a.selectedModel(!1);
        },
        mousedown: function(a, b) {
            b.select(a);
        }
    });
    a.registerCommand("Select", b);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            points: [ [ 10, 10 ], [ 60, 100 ] ],
            command: {},
            style: {
                stroke: "red",
                "stroke-width": "2",
                fill: "none",
                "stroke-opacity": 1,
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            },
            rotate: 0
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            for (var a, b, c = this.get("points"), d = {
                x: 0,
                y: 0
            }, e = {
                x: 0,
                y: 0
            }, f = 0; f < c.length; f++) a = c[f][0], b = c[f][1], 0 == f && (d.x = a, d.y = b, 
            e.x = a, e.y = b), d.x = Math.max(a, d.x), d.y = Math.max(b, d.y), e.x = Math.min(a, e.x), 
            e.y = Math.min(b, e.y);
            return {
                x1: e.x,
                y1: e.y,
                x2: d.x,
                y2: d.y
            };
        },
        setBround: function(a, b, c, d) {
            var e, f, g, h, i = this.getBround();
            c == i.x2 ? (e = (a - i.x1) / Math.max(i.x2 - i.x1, 1), f = (b - i.y1) / Math.max(i.y2 - i.y1, 1)) : (e = (c - i.x2) / Math.max(i.x2 - i.x1, 1), 
            f = (d - i.y2) / Math.max(i.y2 - i.y1, 1));
            for (var j = [], k = this.get("points"), l = 0; l < k.length; l++) g = k[l][0], 
            h = k[l][1], j.push([ g + (g - a) * e, h + (h - b) * f ]);
            this.set({
                points: j
            });
        },
        resizeNew: function(a, b, c) {
            function d(a, b) {
                return a = (a + 4) % 8, b[a];
            }
            var e, f = this.get9GridPoints();
            a = parseFloat(a, 10), e = f[a], console.debug("resize", a, "xMovedDistance:", b, "yMovedDistance", c);
            var g, h, i = d(a, f), j = b ? b / (i[0] - e[0]) : 1, k = c ? c / (i[1] - e[1]) : 1, l = [], m = this.get("points");
            console.debug("averageIncrementX:", j, "averageIncrementY:", k);
            for (var n = 0; n < m.length; n++) h = m[n], g = (parseFloat(h[0]) - parseFloat(i[0])) * j, 
            [ 1, 5 ].indexOf(a) > -1 ? h[1] = parseFloat(h[1]) + (parseFloat(h[1]) - parseFloat(i[1])) * k : [ 7, 3 ].indexOf(a) > -1 && (h[0] = parseFloat(h[0]) + (parseFloat(h[0]) - parseFloat(i[0])) * j), 
            l.push(h);
        },
        resize: function(b, c, d, e) {
            for (var f = [], g = this.get("points"), h = 0; h < g.length; h++) f.push(a.Calculate.resize(b, c, d, g[h], e));
            this.set({
                points: f
            });
        },
        syncResize: function(a) {
            this.syncMove(a);
        },
        syncMove: function(a) {
            for (var b = a.get("points"), c = [], d = 0; d < b.length; d++) c.push(b[d]);
            this.set({
                points: c
            });
        },
        move: function(b, c) {
            var d, e, f = this.get("points"), g = [];
            b = parseFloat(b), c = parseFloat(c);
            for (var h = 0; h < f.length; h++) d = parseFloat(f[h][0]), e = parseFloat(f[h][1]), 
            g.push([ a.Calculate.roundTo(d + b, 3), a.Calculate.roundTo(e + c, 3) ]);
            this.set({
                points: g
            });
        }
    });
    a.registerModel("Line", b);
}(MX.Painter), function(a) {
    var b = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.__line = d3.svg.line().interpolate("cardinal"), 
            this.draw();
        },
        _line: function(a) {
            var b = [], c = this.model.toJSON();
            if ("{}" != JSON.stringify(c.command)) {
                for (var d, e, f = 0; f < c.command.length; f++) {
                    e = [], d = c.command[f];
                    for (var g = 0; g < d.count; g++) c.points[d.start + g] && e.push(c.points[d.start + g].join(","));
                    b.push(d.name + e.join(","));
                }
                return b.join(" ");
            }
            return this.__line(a);
        },
        draw: function() {
            this.svg.append("svg:g").append("path").attr("class", "p-line p-helper cursor-move").attr("fill", "none").attr("stroke", "#5da2ff").attr("stroke-opacity", "0.6").attr("stroke-width", 8), 
            this.svg.append("path").attr("class", "p-line p-entity").attr("fill", "none"), this.update();
        },
        getHitNode: function() {
            return this.svg;
        },
        _mousedown: function() {},
        update: function() {
            var a = this._line(this.model.get("points")), b = this.svg.select(".p-entity").attr("d", a), c = this.model.get("rotate");
            if (0 != c) {
                var d = this.model.getCenterPoint();
                this.svg.selectAll("path").attr("transform", "rotate(" + c + "," + d[0] + "," + d[1] + " )");
            }
            var e = this.model.get("style");
            "none" != e.fill && (e.fill = e.stroke), $.each(e, function(a, c) {
                b.attr(a, c);
            });
            var f = this.model.get("style"), g = parseInt(f["stroke-width"], 10), h = this.svg.select(".p-helper").attr("d", a).attr("stroke-width", g + 6), i = this.model.get("selected");
            h.attr("stroke-opacity", i ? .6 : 0);
        }
    });
    a.registerModelView("Line", b);
}(MX.Painter), function(a) {
    function b(a) {
        var b = [], c = 0;
        b.push(a[0]);
        for (var d = 1; d < a.length - 1; d++) c >= 3 ? (b.push(a[d]), c = 0) : c++;
        return b.push(a[a.length - 1]), b;
    }
    function c(a) {
        var b = f[0];
        return a && b && (Math.abs(a[0] - b[0]) > 10 || Math.abs(a[1] - b[1]) > 10) ? !0 : !1;
    }
    var d, e, f = [], g = a.Command.extend({
        defaultStyle: a.Page.prototype.defaults.Line,
        initialize: function(a) {
            e = a;
        },
        active: function(b) {
            e = b, e.setMouse(a.MOUSE.CROSSHAIR), e.itemEditable(!1), b.on("mousedown", this.mousedown, this).on("mousemove", this.mousemove, this).on("mouseup", this.mouseup, this);
        },
        unactive: function(a) {
            a.setMouse(), a.itemEditable(!0), a.off(null, null, this);
        },
        mousedown: function(a) {
            var b = a;
            f = [], f.push(b);
        },
        mouseup: function(c) {
            var g = c;
            f = $.extend([], f), f.length < 2 || (d ? (f.push(g), d.set({
                points: b(f)
            })) : (f.push([ g[0] + 5, g[1] ]), d = a.getModel("Line", {
                points: f,
                style: $.extend({}, e.defaults.Line)
            }), e.addElement(d)), e.commit("addElement", d), f = [], d = null);
        },
        mousemove: function(b) {
            var g = b, h = f.length;
            1 == h ? c(g) && (f.push(g), d = a.getModel("Line", {
                points: f,
                style: this.defaultStyle
            }), e.addElement(d)) : c(g) && (f = $.extend([], f), f.push(g), d.set({
                points: f
            }));
        }
    });
    a.registerCommand("Line", g);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            points: [ [ 10, 10 ], [ 60, 100 ] ],
            command: {},
            style: {
                stroke: "yellow",
                "stroke-width": "2",
                fill: "none",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-opacity": "0.5"
            },
            rotate: 0
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            for (var a, b, c = this.get("points"), d = {
                x: 0,
                y: 0
            }, e = {
                x: 0,
                y: 0
            }, f = 0; f < c.length; f++) a = c[f][0], b = c[f][1], 0 == f && (d.x = a, d.y = b, 
            e.x = a, e.y = b), d.x = Math.max(a, d.x), d.y = Math.max(b, d.y), e.x = Math.min(a, e.x), 
            e.y = Math.min(b, e.y);
            return {
                x1: e.x,
                y1: e.y,
                x2: d.x,
                y2: d.y
            };
        },
        setBround: function(a, b, c, d) {
            var e, f, g, h, i = this.getBround();
            c == i.x2 ? (e = (a - i.x1) / Math.max(i.x2 - i.x1, 1), f = (b - i.y1) / Math.max(i.y2 - i.y1, 1)) : (e = (c - i.x2) / Math.max(i.x2 - i.x1, 1), 
            f = (d - i.y2) / Math.max(i.y2 - i.y1, 1));
            for (var j = [], k = this.get("points"), l = 0; l < k.length; l++) g = k[l][0], 
            h = k[l][1], j.push([ g + (g - a) * e, h + (h - b) * f ]);
            this.set({
                points: j
            });
        },
        resize: function(b, c, d, e) {
            for (var f = [], g = this.get("points"), h = 0; h < g.length; h++) f.push(a.Calculate.resize(b, c, d, g[h], e));
            this.set({
                points: f
            });
        },
        syncResize: function(a) {
            this.syncMove(a);
        },
        syncMove: function(a) {
            for (var b = a.get("points"), c = [], d = 0; d < b.length; d++) c.push(b[d]);
            this.set({
                points: c
            });
        },
        move: function(a, b) {
            for (var c, d, e = this.get("points"), f = [], g = 0; g < e.length; g++) c = e[g][0], 
            d = e[g][1], f.push([ c + a, d + b ]);
            this.set({
                points: f
            });
        }
    });
    a.registerModel("HighLighter", b);
}(MX.Painter), function(a) {
    var b = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.__line = d3.svg.line().interpolate("cardinal"), 
            this.draw();
        },
        _line: function(a) {
            var b = [], c = this.model.toJSON();
            if ("{}" != JSON.stringify(c.command)) {
                for (var d, e, f = 0; f < c.command.length; f++) {
                    e = [], d = c.command[f];
                    for (var g = 0; g < d.count; g++) c.points[d.start + g] && e.push(c.points[d.start + g].join(","));
                    b.push(d.name + e.join(","));
                }
                return b.join(" ");
            }
            return this.__line(a);
        },
        draw: function() {
            this.svg.append("path").attr("class", "p-line p-entity").attr("fill", "none"), this.update();
        },
        getHitNode: function() {
            return this.svg;
        },
        update: function() {
            var a = this._line(this.model.get("points")), b = this.svg.select(".p-entity").attr("d", a), c = this.model.get("rotate");
            if (0 != c) {
                var d = this.model.getCenterPoint();
                this.svg.selectAll("path").attr("transform", "rotate(" + c + "," + d[0] + "," + d[1] + " )");
            }
            var e = this.model.get("style");
            "none" != e.fill && (e.fill = e.stroke), $.each(e, function(a, c) {
                b.attr(a, c);
            });
        }
    });
    a.registerModelView("HighLighter", b);
}(MX.Painter), function(a) {
    var b = a.getCommand("Line").extend({
        defaultStyle: a.Page.prototype.defaults.HighLighter,
        active: function(b) {
            a.getCommand("Line").prototype.active.call(this, b), b.setMouse(a.MOUSE.TEXT), b.itemEditable(!1);
        }
    });
    a.registerCommand("HighLighter", b);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            x: 0,
            y: 0,
            width: 100,
            height: 24,
            text: "",
            padding: 10,
            rotate: 0,
            isNote: !1,
            style: {
                fill: "red",
                "font-size": 14,
                "font-family": "menu",
                "stroke-opacity": 1,
                "font-style": "",
                stroke: "none"
            }
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            var a = this.toJSON();
            return {
                x1: a.x - 6,
                y1: a.y - 4,
                x2: a.x + a.width + 6,
                y2: a.y + a.height + 4
            };
        },
        resize: function(b, c, d, e) {
            var f = this.getBround(), g = a.Calculate.resize(b, c, d, [ f.x1, f.y1 ], e), h = a.Calculate.resize(b, c, d, [ f.x2, f.y2 ], e), i = h[0] - g[0] - 12, j = h[1] - g[1] - 8;
            this.set({
                x: g[0] + 6,
                y: g[1] + 4,
                width: i,
                height: j
            });
        }
    });
    a.registerModel("Text", b);
}(MX.Painter), function(a) {
    var b = MX.logger("Painter:text"), c = Moxtra.const, d = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.draw();
        },
        draw: function() {
            var a = this, b = a.model.toJSON();
            this.hit = this.svg.append("svg:rect").attr("class", "p-helper cursor-move ").attr("fill", "#cccccc").attr("opacity", 0), 
            a.createTextEl(), a.textarea.attr("id", b.id), this.oldModel = this.model.clone(), 
            a.update();
        },
        createTextEl: function() {
            var a = function(a) {
                var b = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
                b.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + a + "</svg>";
                for (var c = document.createDocumentFragment(); b.firstChild.firstChild; ) c.appendChild(b.firstChild.firstChild);
                return c;
            };
            this.svg.node().appendChild(a('<foreignObject overflow="visible" width="300" height="100" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" x="100" y="100"><textArea class="text-entity" resizeable=false xmlns="http://www.w3.org/1999/xhtml"  ></textArea></foreignObject>')), 
            this.text = this.$el.find("foreignObject"), this.textarea = this.$el.find("textArea");
            var b = this;
            this.textarea.on("blur", $.proxy(this._syncModel, this)).on("keydown", function(a) {
                (a.keyCode === c.KEYBOARD_Enter || a.keyCode === c.KEYBOARD_Delete || a.keyCode === c.KEYBOARD_BackSpace) && (b.autoHeight(), 
                a.stopPropagation());
            }).on("keyup", function(a) {
                a.stopPropagation();
            });
        },
        _syncModel: function() {
            var a = this.textarea.val();
            a.length > 0 && a != this.model.get("text") && (this.model.set("text", a), this.commit());
        },
        autoHeight: function() {
            var a = this.textarea, b = a[0].scrollHeight;
            a.height(b), this.model.set("height", b);
        },
        commit: function() {
            var a = this.model.toJSON();
            a.adding ? (this.getPage().commit("addElement", this.model), this.model.set("adding", !1)) : this.getPage().commit("changeElement", this.model, this.oldModel), 
            b.debug("commit text"), this.oldModel = this.model.clone();
        },
        getHitNode: function() {
            return this.hit;
        },
        update: function() {
            var c = this.model.toJSON();
            if (b.debug("update text"), this.text && this.text.attr("width", c.width).attr("height", c.height).attr("x", c.x).attr("y", c.y), 
            this.hit.attr("width", c.width).attr("height", c.height).attr("x", c.x).attr("y", c.y), 
            this.textarea) {
                if (c.style.color = c.style.fill, delete c.style.fill, !c.style["line-height"]) {
                    var d = c.style["font-family"], e = a.FONT[d], f = c.style["font-size"] || 17;
                    c.style["line-height"] = (f * (e / 17)).toFixed() + "px";
                }
                this.textarea.css(c.style).text(c.text), this.textarea.css({
                    width: c.width,
                    height: c.height
                }), this.textarea.attr("readonly", !c.selected);
            }
            c.selected && this.focus();
        },
        focus: function() {
            this.textarea.focus();
        },
        isInGroup: function() {
            return !!this.model.parent;
        }
    });
    if (a.registerModelView("Text", d), MX.env.isIE) {
        var e = d.extend({
            initialize: function() {
                d.prototype.initialize.apply(this, arguments);
            },
            createTextEl: function() {
                this.isInGroup() ? this.createText() : this.createTextarea();
            },
            createText: function() {
                this.textarea = this.svg.append("svg:text");
            },
            createTextarea: function() {
                var a = this.attributes.$el, b = this.getPage();
                this.isInGroup() && (b = b.getPage()), this.attributes.attributes && (a = this.attributes.attributes.$el), 
                this.$el = this.textarea = $('<textarea class="text-entity"></textarea>').appendTo(a);
                var d = this;
                this.textarea.on("blur", $.proxy(this._syncModel, this)).on("keyup", function(a) {
                    (a.keyCode === c.KEYBOARD_Enter || a.keyCode === c.KEYBOARD_Delete || a.keyCode === c.KEYBOARD_BackSpace) && a.stopPropagation();
                }).on("keydown", function(a) {
                    (a.keyCode === c.KEYBOARD_Delete || a.keyCode === c.KEYBOARD_BackSpace) && a.stopPropagation();
                }).on("click", function() {
                    b.select(d.model);
                }), d.attributes.on("resize", this.update, this);
            },
            update: function() {
                var a = this.model.toJSON(), b = this.model.get9GridPoints(), c = d3.svg.line();
                if (b.push(b[0]), this.svg.select("path").attr("d", c(b)), this.textarea) {
                    a.style.color = a.style.fill, delete a.style.fill;
                    var d, e = this.attributes.viewScale, f = MX.Painter.Calculate.adjustPoint([ [ a.x, a.y ] ], e), g = this.model.parent;
                    if (g) {
                        var h = g.get("transform");
                        d = Moxtra.util.format("rotate({{rotate}}deg) translate({{centerX}}px,{{centerY}}px) scale({{scale}})", {
                            rotate: h.rotate,
                            scale: h.scale,
                            centerX: h.translate[0],
                            centerY: h.translate[1]
                        });
                    }
                    if (this.isInGroup()) {
                        var i = Moxtra.util.format("fill:{{color}};font-family:{{font-family}};font-size:{{font-size}}px;font-style:{{font-style}};font-weight:{{font-weight}};text-align:{{text-align}}", a.style);
                        this.textarea.attr("width", a.width).attr("height", a.height).attr("x", a.x).attr("y", a.y).text(a.text).attr("style", i);
                    } else this.textarea.css(a.style).text(a.text).css({
                        width: a.width,
                        height: a.height,
                        left: f[0] + "px",
                        top: f[1] + "px",
                        position: "absolute",
                        overflow: "auto",
                        "line-height": 1.125 * parseInt(a.style["font-size"]) + "px",
                        transform: d
                    });
                }
                this.isChange && !a.selected && (a.adding ? this.getPage().commit("addElement", this.model) : this.getPage().commit("changeElement", this.model, this.oldModel), 
                this.isChange = !1);
            },
            destroy: function() {
                this.textarea && this.textarea.remove(), a.View.prototype.destroy.apply(this);
            }
        });
        a.registerModelView("Text", e);
    }
}(MX.Painter), function(a) {
    var b, c, d, e = a.Command.extend({
        initialize: function(a) {
            d = a;
        },
        active: function(b) {
            d = b, b.setMouse(a.MOUSE.TEXT), b.on("mousedown", this.mousedown, this), b.on("mouseup", this.mouseup, this), 
            b.itemEditable(!1);
        },
        unactive: function(a) {
            a.setMouse(), a.off(null, null, this), a.itemEditable(!0);
        },
        mousedown: function(d, e) {
            var f = d;
            d3.event.sourceEvent.stopPropagation(), b = a.getModel("Text", {
                text: "",
                adding: !0,
                x: f[0] - 10,
                y: f[1] - 10,
                width: 200,
                height: 80,
                style: $.extend({}, e.defaults.Text),
                selected: !0
            }), c = e.addElement(b);
        },
        mouseup: function(d, e) {
            e.activeCommand(a.COMMAND.Select), e.select(b), setTimeout(function() {
                c.focus(), b = c = null;
            }, 100);
        }
    });
    a.registerCommand("Text", e);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            x: 0,
            y: 0,
            width: 100,
            height: 24,
            file: "",
            url: "",
            style: {},
            rotate: 0,
            percent: 100,
            client_uuid: ""
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            var a = this.toJSON();
            return {
                x1: a.x,
                y1: a.y,
                x2: a.x + a.width,
                y2: a.y + a.height
            };
        }
    });
    a.registerModel("Image", b);
}(MX.Painter), function(a) {
    var b = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.model.get("isClone") || this.draw();
        },
        draw: function() {
            var a = this.model.toJSON();
            return this.svg.append("svg:image").attr("class", "p-image p-entity").attr("preserveAspectRatio", "none"), 
            a.percent < 100 ? this.drawProgress() : void this.update();
        },
        getHitNode: function() {
            return this.svg.select("image");
        },
        drawProgress: function() {
            this.inprogress = !0, this.svg.select("image").attr("opacity", 0);
            var a;
            this.progress = a = this.svg.append("g"), a.append("path").attr("d", "M0 25v162.5h200v-162.5h-200zM187.5 175h-175v-137.5h175v137.5zM137.5 68.75c0-10.355 8.395-18.75 18.75-18.75s18.75 8.395 18.75 18.75c0 10.355-8.395 18.75-18.75 18.75-10.355 0-18.75-8.395-18.75-18.75zM175 162.5h-150l37.5-100 50 62.5 25-18.75z").attr("fill", "#ccc"), 
            a.attr("transform", "translate(200,130)"), a = this.progress.append("g").attr("transform", "translate(130,100)"), 
            this.textGroup = a, this.text = a.append("text").attr("text-anchor", "middle").attr("dy", ".35em");
        },
        updateProgress: function() {
            var a = this.model.toJSON(), b = this, c = d3.format(".0%");
            if (a.percent < 100) {
                {
                    this.model.getCenterPoint();
                }
                b.text.text(MX.escapeHTML(c(a.percent / 100))), b.progress.attr("transform", "translate(" + (a.x + 20) + "," + (a.y - 20) + ")");
            } else this.inprogress = !1, this.svg.select("image").attr("opacity", 1), this.progress.remove();
        },
        update: function() {
            var a = this.model.toJSON();
            this.inprogress && this.updateProgress();
            var b = this.svg.select("image").attr("width", a.width).attr("height", a.height).attr("opacity", 1).attr("x", a.x).attr("y", a.y).attr("xlink:href", a.url);
            if (0 != a.rotate) {
                var c = this.model.getCenterPoint();
                b.attr("transform", "rotate(" + a.rotate + "," + c[0] + "," + c[1] + " )");
            }
        }
    });
    a.registerModelView("Image", b);
}(MX.Painter), function(a) {
    function b(b, d) {
        var e = location.href;
        e.indexOf("index.html") && (e = e.split("index.html")[0]);
        var f = a.getModel("Image", {
            url: e + "temp/th.jpg",
            x: d[0],
            y: d[1],
            width: 100,
            height: 150
        });
        c.addElement(f), c.activeCommand(a.COMMAND.Select), c.select(f), c.commit("addElement", f);
    }
    var c, d = a.Command.extend({
        initialize: function(a) {
            c = a;
        },
        active: function(c) {
            c.setMouse(a.MOUSE.POINTER), c.getSvgNode().on("mousedown", b);
        },
        unactive: function(a) {
            a.setMouse(), a.getSvgNode().on("mousedown", null);
        },
        run: function(b, c) {
            var d = a.getModel("Image", c);
            return b.addElement(d), b.activeCommand(a.COMMAND.Select), b.select(d), b.commit("addElement", d), 
            d;
        }
    });
    a.registerCommand("Image", d);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            x: 0,
            y: 0,
            width: 80,
            height: 24,
            source: "",
            url: "",
            style: {},
            rotate: 0,
            progress: 0,
            playing: !1
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            var a = this.toJSON();
            return {
                x1: a.x,
                y1: a.y,
                x2: a.x + a.width,
                y2: a.y + a.height
            };
        }
    });
    a.registerModel("Audio", b);
}(MX.Painter), function(a) {
    var b = {
        play: "M256,92.481c44.433,0,86.18,17.068,117.553,48.064C404.794,171.411,422,212.413,422,255.999s-17.206,84.588-48.448,115.455c-31.372,30.994-73.12,48.064-117.552,48.064s-86.179-17.07-117.552-48.064C107.206,340.587,90,299.585,90,255.999s17.206-84.588,48.448-115.453C169.821,109.55,211.568,92.481,256,92.481 M256,52.481c-113.771,0-206,91.117-206,203.518c0,112.398,92.229,203.52,206,203.52c113.772,0,206-91.121,206-203.52C462,143.599,369.772,52.481,256,52.481L256,52.481z M206.544,357.161V159.833l160.919,98.666L206.544,357.161z",
        stop: "M335.084,339.042H178.916V172.958h156.168V339.042z M256,92.481c44.433,0,86.18,17.068,117.553,48.064C404.794,171.411,422,212.413,422,255.999s-17.206,84.588-48.448,115.455c-31.372,30.994-73.12,48.064-117.552,48.064s-86.179-17.07-117.552-48.064C107.206,340.587,90,299.585,90,255.999s17.206-84.588,48.448-115.453C169.821,109.55,211.568,92.481,256,92.481 M256,52.481c-113.771,0-206,91.117-206,203.518c0,112.398,92.229,203.52,206,203.52c113.772,0,206-91.121,206-203.52C462,143.599,369.772,52.481,256,52.481L256,52.481z",
        pause: "M256,92.481c44.433,0,86.18,17.068,117.553,48.064C404.794,171.411,422,212.413,422,255.999s-17.206,84.588-48.448,115.455c-31.372,30.994-73.12,48.064-117.552,48.064s-86.179-17.07-117.552-48.064C107.206,340.587,90,299.585,90,255.999s17.206-84.588,48.448-115.453C169.821,109.55,211.568,92.481,256,92.481 M256,52.481c-113.771,0-206,91.117-206,203.518c0,112.398,92.229,203.52,206,203.52c113.772,0,206-91.121,206-203.52C462,143.599,369.772,52.481,256,52.481L256,52.481z M240.258,346h-52.428V166h52.428V346z M326.17,346h-52.428V166h52.428V346z"
    }, c = a.View.extend({
        tagName: "svg:g",
        className: "mx-painter-item ",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments);
        },
        draw: function() {
            var a = this;
            a.svg.append("path").attr("class", "p-audio-control").attr("fill", "#333").attr("opacity", "0.6").attr("transform", "scale(0.05)");
        },
        getHitNode: function() {
            return this.svg.select("image");
        },
        update: function() {
            var a, c = this.model.toJSON();
            a = c.playing ? b.pause : b.play, this.svg.select("path").attr("d", a), this.svg.attr("transform", "translate(" + c.x + "," + c.y + " )");
        }
    });
    a.registerModelView("Audio", c);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            x: 0,
            y: 0,
            width: 100,
            height: 24,
            children: null,
            svg: "",
            transform: null
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this), this.set("children", []);
        },
        addChildren: function(b, c) {
            var d = b;
            "string" == typeof b && (d = a.getModel(b, c)), d.parent = this, this.attributes.children.push(d), 
            this.set(this.calculateGroupInfo());
        },
        each: function(a) {
            for (var b = this.attributes.children, c = 0; c < b.length && a.call(this, b[c], c) !== !1; c++) ;
        },
        calculateGroupInfo: function() {
            var a = 1024, b = 768, c = 0, d = 0;
            return this.each(function(e) {
                var f = e.getBround();
                a = Math.min(a, f.x1), b = Math.min(b, f.y1), c = Math.max(c, f.x2), d = Math.max(d, f.y2);
            }), {
                x: a,
                y: b,
                width: c - a,
                height: d - b
            };
        },
        rotate: function(a) {
            var b = this.get("transform");
            return b || (b = {}), a ? (b.rotate = a, this.set("transform", b), this.set("rotate", a), 
            void 0) : b.rotate;
        },
        getBround: function() {
            var a = this.toJSON();
            return {
                x1: a.x,
                y1: a.y,
                x2: a.x + a.width,
                y2: a.y + a.height
            };
        },
        move: function(a, b) {
            var c = this.get("x"), d = this.get("y");
            c += a, d += b;
            var e = this.get("children");
            this.set("x", c), this.set("y", d), e.forEach(function(e) {
                if ("Text" === e.get("name")) {
                    var f = e.toJSON();
                    e.set({
                        x: f.x + a,
                        y: f.y + b
                    });
                } else e.set({
                    x: c,
                    y: d
                });
            });
        }
    });
    a.registerModel("Group", b);
}(MX.Painter), function(a) {
    var b = a.View.extend({
        tagName: "svg:g",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.children = {}, this.draw(), 
            this.originalModel = this.model.clone();
        },
        draw: function() {
            var b = this;
            this.model.each(function(c) {
                var d = c.get("name"), e = c.get("id"), f = a.getModelView(d, {
                    attributes: b,
                    inGroup: !0,
                    model: c
                });
                b.children[e] = f;
            }), this.update(), this.afterDraw();
        },
        afterDraw: function() {},
        getChildren: function(a, b) {
            var c;
            return this.model.each(function(d) {
                d.get(a) === b && (c = d);
            }), c ? this.children[c.get("id")] : null;
        },
        getView: function(a) {
            return this.children[a.get("id")];
        },
        getHitNode: function() {
            return this.svg.select("image");
        },
        update: function() {
            var a = this.model.toJSON();
            if (a.transform) {
                var b, c, d = "";
                for (c in a.transform) b = a.transform[c], "rotate" == c && (b = [ b ].concat(this.model.getCenterPoint())), 
                d += c + "(" + (Array.isArray(b) ? b.join(",") : b) + ")";
                this.svg.attr("transform", d);
            }
        },
        destroy: function() {
            _.invoke(this.children, "destroy"), a.View.prototype.destroy.apply(this);
        },
        createTooltip: function(b) {
            var c = this.attributes, d = $('<div class="popover top" style="left: 50%;top:50%"><div class="arrow"></div><div class="popover-content"><p>' + b + "</p></div></div>").appendTo(c.$el), e = d3.select(d[0]), f = this.model.get9GridPoints(), g = f[1];
            return g = a.Calculate.adjustPoint([ g ], c.viewScale), g = [ g[0] - d.width() / 2, g[1] - d.height() ], 
            e.style("opacity", ".9").style("z-index", 1e5), setTimeout(function() {
                e.style("left", g[0] + "px").style("top", g[1] + "px").style("display", "block");
            }, 10), e;
        }
    });
    a.registerModelView("Group", b);
}(MX.Painter), function(a) {
    var b = a.Command.extend({
        initialize: function() {},
        run: function(a) {
            var b = a.getSelectedModel();
            b && (b = b.clone()), a.deleteElement();
        }
    });
    a.registerCommand("Delete", b);
    var c = !1, d = a.Command.extend({
        active: function(b) {
            b.setMouse(a.MOUSE.POINTER), b.on("itemMouseover", this.mouseover, this).on("mousedown", this.mousedown, this).on("mouseup", this.mouseup, this);
            var c = b.getSelectedModel();
            c && b.deleteElement(), b.selectedModel(!0);
        },
        unactive: function(a) {
            a.setMouse(), a.off(null, null, this), a.selectedModel(!1);
        },
        mousedown: function(a, b) {
            c = !0, b.$el.addClass("edit-model");
        },
        mouseup: function(a, b) {
            c = !1, b.$el.removeClass("edit-model");
        },
        mouseover: function(a, b) {
            c && b.deleteElement(a.get("id"));
        }
    });
    a.registerCommand("Rubber", d);
}(MX.Painter), function(a) {
    function b() {
        return e++, e >= d.length ? void (e = d.length) : d[e];
    }
    function c() {
        return e--, -1 > e ? (e = -1, null) : d[e + 1];
    }
    var d = [], e = 0, f = !1;
    window.actionHistory = d;
    var g = a.Command.extend({
        run: function(c) {
            var d, g, h, i = b();
            if (!i) return void console.log("Already reach the end of history, prevent user from doing this.");
            switch (console.debug("historyIndex", e), d = i.data, i.name) {
              case "remove":
                g = a.getModel(d.name, d), c.deleteElement(d.id), f = !0, c.commit("deleteElement", g), 
                f = !1, c.select();
                break;

              case "add":
                d.id = uuid.v4(), g = a.getModel(d.name, d), c.addElement(g), c.select(g), f = !0, 
                c.commit("addElement", g), f = !1;
                break;

              case "change":
                if (g = c.getModel(d.id, d), !g) return;
                f = !0, h = g.clone(), g.set(d), c.commit("changeElement", g, h), f = !1, c.select(g);
            }
        }
    });
    a.registerCommand("Redo", g);
    var h = a.Command.extend({
        initialize: function(a) {
            var b = this;
            a.on("addElement", function(a) {
                f || b.push("add", a.toJSON());
            }), a.on("deleteElement", function(a) {
                f || b.push("remove", a.toJSON());
            }), d = [], e = 0, a.on("changeElement", function(a, c) {
                f || b.push("change", a.toJSON(), c.toJSON());
            });
        },
        push: function(a, b, c) {
            var f = a;
            "string" == typeof f && (f = {
                name: a,
                data: b,
                oldModel: c
            }), d.push(f), e = d.length - 1, console.debug("historyIndex", e);
        },
        run: function(b) {
            var d = c();
            if (d) {
                var g, h = d.data;
                switch (d.name) {
                  case "add":
                    if (g = b.getModel(h.id), !g) return;
                    f = !0, b.deleteElement(h.id), b.commit("deleteElement", g), f = !1, b.select();
                    break;

                  case "remove":
                    delete h.id, g = a.getModel(h.name, h), f = !0, b.addElement(g), b.commit("addElement", g), 
                    f = !1, b.select(g);
                    break;

                  case "change":
                    if (g = b.getModel(h.id), !g) return;
                    var i = g.clone();
                    g.set(d.oldModel), f = !0, b.commit("changeElement", g, i), f = !1, b.select(g);
                }
                console.debug("historyIndex", e);
            }
        }
    });
    a.registerCommand("Undo", h);
}(MX.Painter), function(a) {
    var b, c, d = 30, e = a.Command.extend({
        initialize: function(a) {
            c = a;
        },
        active: function(b) {
            b.setMouse(a.MOUSE.POINTER), b.on("mousedown", this.mousedown, this).on("mousemove", this.mousemove, this).on("mouseup", this.mouseup, this), 
            this._initPointer(!0), b.lock(), b.itemEditable(!1);
        },
        unactive: function(a) {
            a.setMouse(), this.pointer && this.pointer.attr("opacity", 0), a.off(null, null, this), 
            a.trigger("hideLaserPointer"), a.unlock(), a.itemEditable(!0), this.hideLaserPointer();
        },
        mousedown: function(a, c) {
            var d = a;
            this.pointer.attr("cx", d[0]).attr("cy", d[1]), b = d, c.trigger("updateLaserPointer", d);
        },
        mousemove: function(a, c) {
            var e = a;
            "undefined" != typeof b && (Math.abs(e[0] - b[0]) > d || Math.abs(e[1] - b[1]) > d) && (this.pointer.attr("cx", e[0]).attr("cy", e[1]), 
            c.trigger("updateLaserPointer", e));
        },
        mouseup: function(a, b) {
            var c = a;
            this.pointer.attr("cx", c[0]).attr("cy", c[1]), b.trigger("updateLaserPointer", c);
        },
        _initPointer: function(a) {
            if (!this.pointer) {
                var b = c.options.width / 2, d = c.options.height / 2;
                this.pointer = c.svg.append("circle").attr("fill", "red").attr("cx", b).attr("cy", d).attr("r", 8).attr("opacity", 1), 
                a && c.trigger("showLaserPointer", [ b, d ]);
            }
        },
        showLaserPointer: function(a) {
            this._initPointer(a);
        },
        hideLaserPointer: function(a) {
            this.pointer && this.pointer.remove(), this.pointer = null, a && c && c.trigger("hideLaserPointer");
        },
        updateLaserPointer: function(a, b) {
            this.pointer.attr("cx", a).attr("cy", b);
        }
    });
    a.registerCommand("LaserPointer", e);
}(MX.Painter), function(a) {
    var b, c, d, e, f = a.Page.prototype.defaults.Shape["data-shape"], g = function(a, b) {
        var c = parseFloat(a.x), d = parseFloat(a.y), e = parseFloat(a.width), f = parseFloat(a.height), g = parseFloat(a.start[0]), h = parseFloat(a.start[1]), i = parseFloat(a.end[0]), j = parseFloat(a.end[1]), k = {
            triangle: [ c + e / 2 + "," + d, c + "," + (d + f), c + e + "," + (d + f) ],
            pentagon: [ c + "," + (d + .381966 * f), c + e / 2 + "," + d, c + e + "," + (d + .381966 * f), c + .809017 * e + "," + (d + f), c + .190983 * e + "," + (d + f) ]
        };
        return "undefined" != typeof k[b] ? {
            points: k[b].join(" ")
        } : "rectangle" == b ? {
            x: c,
            y: d,
            width: e,
            height: f
        } : "line" == b ? {
            x1: g,
            y1: h,
            x2: i,
            y2: j
        } : "ellipse" == b ? {
            cx: c + e / 2,
            cy: d + f / 2,
            rx: e / 2,
            ry: f / 2
        } : void 0;
    }, h = a.Command.extend({
        defaultStyle: a.Page.prototype.defaults.Shape,
        initialize: function(a) {
            e = a;
        },
        active: function(b) {
            e = b, e.setMouse(a.MOUSE.CROSSHAIR), b.on("mousedown", this.mousedown, this).on("mousemove", this.mousemove, this).on("mouseup", this.mouseup, this), 
            b.itemEditable(!1);
        },
        unactive: function(a) {
            a.setMouse(), a.off(null, null, this), a.itemEditable(!0);
        },
        mousedown: function(b) {
            c = b, d = b, f = a.Page.prototype.defaults.Shape["data-shape"];
        },
        mouseup: function() {
            if (b) {
                var a = c[0] < d[0] ? c[0] : d[0], h = c[1] < d[1] ? c[1] : d[1], i = {
                    start: c,
                    end: d,
                    x: a,
                    y: h,
                    width: Math.abs(c[0] - d[0]),
                    height: Math.abs(c[1] - d[1])
                };
                b.set(g(i, f)), c = d = null, e.commit("addElement", b), b = null;
            }
        },
        mousemove: function(h) {
            if (d = h, c && !(Math.abs(c[0] - d[0]) < 10 && Math.abs(c[1] - d[1]) < 10)) {
                var i = c[0] < d[0] ? c[0] : d[0], j = c[1] < d[1] ? c[1] : d[1], k = {
                    start: c,
                    end: d,
                    x: i,
                    y: j,
                    width: Math.abs(c[0] - d[0]),
                    height: Math.abs(c[1] - d[1])
                };
                b ? b.set(g(k, f)) : (b = a.getModel("Shape", {
                    style: $.extend({}, e.defaults.Shape)
                }), b.set(g(k, f)), e.addElement(b));
            }
        }
    });
    a.registerCommand("Shape", h);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            rx: 0,
            ry: 0,
            command: {},
            style: {
                stroke: "red",
                "stroke-width": "2",
                fill: "none",
                "stroke-opacity": 1,
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            },
            rotate: 0
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            var a, b, c, d, e, f = this.toJSON();
            switch (f.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                if ("undefined" != typeof f.points) {
                    for (var g = f.points.split(" "), h = 0; h < g.length; h++) {
                        var i = g[h].split(","), j = parseFloat(i[0]), k = parseFloat(i[1]);
                        0 == h ? (a = j, b = k, c = j, d = k) : (a = Math.min(j, a), b = Math.min(k, b), 
                        c = Math.max(j, c), d = Math.max(k, d));
                    }
                    return {
                        x1: a,
                        y1: b,
                        x2: c,
                        y2: d
                    };
                }
                break;

              case "rectangle":
                if ("undefined" != typeof f.width) return a = parseFloat(f.x), b = parseFloat(f.y), 
                c = a + parseFloat(f.width), d = b + parseFloat(f.height), {
                    x1: a,
                    y1: b,
                    x2: c,
                    y2: d
                };
                break;

              case "line":
                if ("undefined" != typeof f.x1) return a = parseFloat(f.x1), b = parseFloat(f.y1), 
                c = parseFloat(f.x2), d = parseFloat(f.y2), a > c && (e = a, a = c, c = e), b > d && (e = b, 
                b = d, d = e), {
                    x1: a,
                    y1: b,
                    x2: c,
                    y2: d
                };
                break;

              case "ellipse":
                if ("undefined" != typeof f.cx) {
                    var l = parseFloat(f.cx), m = parseFloat(f.cy), n = parseFloat(f.rx), o = parseFloat(f.ry);
                    return {
                        x1: l - n,
                        y1: m - o,
                        x2: l + n,
                        y2: m + o
                    };
                }
            }
        },
        resize: function(b, c, d, e) {
            var f, g, h, i, j, k = this.toJSON();
            switch (k.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                if ("undefined" != typeof k.points) {
                    for (var l = [], m = k.points.split(" "), n = 0; n < m.length; n++) {
                        var o = m[n].split(",");
                        l.push(a.Calculate.resize(b, c, d, o, e).join(","));
                    }
                    this.set({
                        points: l.join(" ")
                    });
                }
                break;

              case "rectangle":
                if ("undefined" != typeof k.width) {
                    f = parseFloat(k.x), g = parseFloat(k.y), h = f + parseFloat(k.width), i = g + parseFloat(k.height), 
                    j = a.Calculate.resize(b, c, d, [ f, g ], e);
                    var p = a.Calculate.resize(b, c, d, [ h, i ], e);
                    this.set({
                        x: j[0],
                        y: j[1],
                        width: p[0] - j[0],
                        height: p[1] - j[1]
                    });
                }
                break;

              case "line":
                if ("undefined" != typeof k.x1) {
                    f = parseFloat(k.x1), g = parseFloat(k.y1), h = parseFloat(k.x2), i = parseFloat(k.y2);
                    var q = a.Calculate.resize(b, c, d, [ f, g ], e), r = a.Calculate.resize(b, c, d, [ h, i ], e);
                    this.set({
                        x1: q[0],
                        y1: q[1],
                        x2: r[0],
                        y2: r[1]
                    });
                }
                break;

              case "ellipse":
                if ("undefined" != typeof k.cx) {
                    var s = parseFloat(k.cx), t = parseFloat(k.cy), u = parseFloat(k.rx), v = parseFloat(k.ry), w = a.Calculate.resize(b, c, d, [ s, t ], e);
                    j = a.Calculate.resize(b, c, d, [ s - u, t - v ], e), this.set({
                        cx: w[0],
                        cy: w[1],
                        rx: w[0] - j[0],
                        ry: w[1] - j[1]
                    });
                }
            }
        },
        syncResize: function(a) {
            this.syncMove(a);
        },
        syncMove: function(a) {
            var b = a.toJSON();
            switch (b.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                "undefined" != typeof b.points && this.set({
                    points: b.points
                });
                break;

              case "rectangle":
                "undefined" != typeof b.width && this.set({
                    x: b.x,
                    y: b.y,
                    width: b.width,
                    height: b.height
                });
                break;

              case "line":
                "undefined" != typeof b.x1 && this.set({
                    x1: b.x1,
                    y1: b.y1,
                    x2: b.x2,
                    y2: b.y2
                });
                break;

              case "ellipse":
                "undefined" != typeof b.cx && this.set({
                    cx: b.cx,
                    cy: b.cy,
                    rx: b.rx,
                    ry: b.ry
                });
            }
        },
        move: function(a, b) {
            var c = this.toJSON();
            switch (a = parseFloat(a), b = parseFloat(b), c.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                if ("undefined" != typeof c.points) {
                    for (var d = c.points.split(" "), e = [], f = 0; f < d.length; f++) {
                        var g = d[f].split(","), h = parseFloat(g[0]), i = parseFloat(g[1]);
                        e.push(h + a + "," + (i + b));
                    }
                    this.set({
                        points: e.join(" ")
                    });
                }
                break;

              case "rectangle":
                "undefined" != typeof c.width && this.set({
                    x: parseFloat(c.x) + a,
                    y: parseFloat(c.y) + b,
                    width: c.width,
                    height: c.height
                });
                break;

              case "line":
                "undefined" != typeof c.x1 && this.set({
                    x1: parseFloat(c.x1) + a,
                    y1: parseFloat(c.y1) + b,
                    x2: parseFloat(c.x2) + a,
                    y2: parseFloat(c.y2) + b
                });
                break;

              case "ellipse":
                "undefined" != typeof c.cx && this.set({
                    cx: parseFloat(c.cx) + a,
                    cy: parseFloat(c.cy) + b,
                    rx: c.rx,
                    ry: c.ry
                });
            }
        }
    });
    a.registerModel("Shape", b);
}(MX.Painter), function(a) {
    var b = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.model.get("isClone") || this.draw();
        },
        draw: function() {
            var a = this.model.toJSON();
            switch (a.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                "undefined" != typeof a.points && this.svg.append("svg:polygon").attr("class", "p-rect p-entity");
                break;

              case "rectangle":
                "undefined" != typeof a.width && this.svg.append("svg:rect").attr("class", "p-rect p-entity");
                break;

              case "line":
                "undefined" != typeof a.x1 && this.svg.append("svg:line").attr("class", "p-rect p-entity");
                break;

              case "ellipse":
                "undefined" != typeof a.cx && this.svg.append("svg:ellipse").attr("class", "p-rect p-entity");
            }
            this.hit = this.svg.append("svg:rect").attr("class", "p-rect p-helper cursor-move").attr("opacity", 0), 
            this.update();
        },
        getHitNode: function() {
            return this.svg;
        },
        update: function() {
            var a = this.model.toJSON(), b = this.model.getBround(), c = this.svg.selectAll("rect").attr("x", b.x1).attr("y", b.y1).attr("width", b.x2 - b.x1).attr("height", b.y2 - b.y1);
            $.each(a.style, function(a, b) {
                c.attr(a, b);
            });
            var d;
            switch (a.style["data-shape"]) {
              case "triangle":
              case "pentagon":
                "undefined" != typeof a.points && (d = this.svg.selectAll("polygon").attr("points", a.points));
                break;

              case "rectangle":
                "undefined" != typeof a.width && (d = this.svg.selectAll("rect").attr("x", a.x).attr("y", a.y).attr("width", a.width).attr("height", a.height).attr("rx", 4).attr("ry", 4));
                break;

              case "line":
                "undefined" != typeof a.x1 && (d = this.svg.selectAll("line").attr("x1", a.x1).attr("y1", a.y1).attr("x2", a.x2).attr("y2", a.y2));
                break;

              case "ellipse":
                "undefined" != typeof a.cx && (d = this.svg.selectAll("ellipse").attr("cx", a.cx).attr("cy", a.cy).attr("rx", a.rx).attr("ry", a.ry));
            }
            if ($.each(a.style, function(a, b) {
                d.attr(a, b);
            }), this.hit.attr("stroke-width", 20), 0 != a.rotate) {
                var e = this.model.getCenterPoint();
                c.attr("transform", "rotate(" + a.rotate + "," + e[0] + "," + e[1] + " )"), d.attr("transform", "rotate(" + a.rotate + "," + e[0] + "," + e[1] + " )");
            } else c.attr("transform", null), d.attr("transform", null);
        }
    });
    a.registerModelView("Shape", b);
}(MX.Painter), function(a) {
    var b = a.getModel("Group"), c = _.extend({
        imgIndex: 0
    }, b.prototype.defaults), d = b.extend({
        defaults: c
    });
    a.registerModel("audioBubble", d), c = _.extend({
        flipped: 0
    }, c), d = b.extend({
        defaults: c
    }), a.registerModel("audioTag", d), c = _.extend({}, c), d = b.extend({
        defaults: c
    }), a.registerModel("textTag", d);
}(MX.Painter), function(a) {
    var b = a.getModelView("Group").extend({
        afterDraw: function() {
            var b = this.getChildren("name", "Image");
            if (b) {
                var c = this.getChildren("name", "Audio");
                b.svg.on("mousedown", function() {
                    if (c) {
                        var b = c.model.get("source");
                        return b && a.Helper.playAudio(b), !1;
                    }
                });
            }
        }
    });
    a.registerModelView("audioBubble", b);
}(MX.Painter), function(a) {
    var b = a.getModelView("Group").extend({
        afterDraw: function() {
            var b = this.getChildren("name", "Image");
            if (b) {
                var c = this.getChildren("name", "Audio");
                b.svg.on("mousedown", function() {
                    var b = c.model.get("source");
                    return b && a.Helper.playAudio(b), !1;
                });
            }
        }
    });
    a.registerModelView("audioTag", b);
}(MX.Painter), function(a) {
    var b = a.getModelView("Group").extend({
        afterDraw: function() {
            var b = this, c = this.getChildren("name", "Image");
            if (c) {
                var d, e, f, g = this.getChildren("name", "Text");
                c.svg.on("mouseover", function() {
                    e = g.model.get("text");
                    var c = b.attributes;
                    f = $('<div class="popover top" style="left: 50%;top:50%"><div class="arrow"></div><div class="popover-content"><p>' + e + "</p></div></div>").appendTo(c.$el), 
                    d = d3.select(f[0]);
                    var h = b.model.get9GridPoints(), i = h[1];
                    i = a.Calculate.adjustPoint([ i ], c.viewScale), i = [ i[0] - f.width() / 2, i[1] - f.height() ], 
                    d.style("opacity", ".9").style("z-index", 1e5), setTimeout(function() {
                        d.style("left", i[0] + "px").style("top", i[1] + "px").style("display", "block");
                    }, 10);
                }).on("mouseout", function() {
                    d && d.remove();
                }).on("mousedown", function() {
                    d && d.remove();
                });
            }
        },
        getHitNode: function() {
            return this.svg.select("image");
        }
    });
    a.registerModelView("textTag", b);
}(MX.Painter), function(a) {
    var b, c, d, e, f = a.Command.extend({
        defaultStyle: a.Page.prototype.defaults.Arrow,
        initialize: function(a) {
            e = a;
        },
        active: function(b) {
            e = b, e.setMouse(a.MOUSE.CROSSHAIR), e.itemEditable(!1), b.on("mousedown", this.mousedown, this).on("mousemove", this.mousemove, this).on("mouseup", this.mouseup, this);
        },
        unactive: function(a) {
            a.setMouse(), a.off(null, null, this), a.itemEditable(!0);
        },
        mousedown: function(a) {
            c = a, d = a;
        },
        mouseup: function(a) {
            d = a, b && (b.set({
                endPoint: d
            }), e.commit("addElement", b), b = null);
        },
        mousemove: function(f) {
            c || (c = f), d = f, Math.abs(c[0] - d[0]) < 10 && Math.abs(c[1] - d[1]) < 10 || (b ? b.set({
                endPoint: d
            }) : (b = a.getModel("Arrow", {
                startPoint: c,
                endPoint: d,
                style: _.extend({}, this.defaultStyle)
            }), e.addElement(b)));
        }
    });
    a.registerCommand("Arrow", f);
}(MX.Painter), function(a) {
    var b = a.Model.extend({
        defaults: {
            startPoint: null,
            endPoint: null,
            command: {},
            style: {
                stroke: "red",
                "stroke-width": "2",
                fill: "none",
                "stroke-opacity": 1,
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            },
            rotate: 0
        },
        initialize: function() {
            a.Model.prototype.initialize.apply(this);
        },
        getBround: function() {
            var a = this.get("startPoint"), b = this.get("endPoint");
            return {
                x1: a[0],
                y1: a[1],
                x2: b[0],
                y2: b[1]
            };
        },
        resize: function(b, c, d, e) {
            for (var f = [], g = this.get("points"), h = 0; h < g.length; h++) f.push(a.Calculate.resize(b, c, d, g[h], e));
            this.set({
                points: f
            });
        },
        syncResize: function(a) {
            this.syncMove(a);
        },
        syncMove: function(a) {
            for (var b = a.get("points"), c = [], d = 0; d < b.length; d++) c.push(b[d]);
            this.set({
                points: c
            });
        },
        move: function(a, b) {
            var c = this.toJSON();
            this.set({
                startPoint: [ c.startPoint[0] + a, c.startPoint[1] + b ],
                endPoint: [ c.endPoint[0] + a, c.endPoint[1] + b ]
            });
        }
    });
    a.registerModel("Arrow", b);
}(MX.Painter), function(a) {
    function b(a, b) {
        var c, f, i, t, u, v, w, x, y, z, A, B, C, D, E, F = g(a, b);
        B = F / j, p > B ? B = p : B > m && (B = m), C = F / k, p > C ? C = p : C > n && (C = n), 
        D = F / l, p > D ? D = p : D > o && (D = o), q * B > F && (E = F / B / q, q *= E, 
        r *= E, s *= E);
        var G, H = h(a, b, C);
        return c = H[0], f = H[1], G = s * B / F, x = e(b, a, G), H = h(x, b, D), v = H[0], 
        i = H[1], G = q * B / F, w = e(b, a, G), H = h(w, b, B * r), u = H[0], t = H[1], 
        y = d(c, f, a, b), z = [ y[0] - a[0] + c[0], y[1] - a[1] + c[1] ], A = [ y[0] - a[0] + f[0], y[1] - a[1] + f[1] ], 
        [ c, f, i, t, u, v, w, x, y, z, A ];
    }
    function c(a) {
        return [ a[0].toFixed(2), a[1].toFixed(2) ].join(",");
    }
    function d(a, b, c, d) {
        var e = [], f = Math.abs((b[1] - a[1]) / 2), g = Math.abs((b[0] - a[0]) / 2);
        return e[0] = c[0] - d[0] > 0 ? c[0] + f : c[0] - f, e[1] = c[1] - d[1] > 0 ? c[1] + g : c[1] - g, 
        e;
    }
    function e(a, b, c) {
        var d = [];
        return c >= 0 && 1 >= c ? (d.push((1 - c) * a[0] + c * b[0]), d.push((1 - c) * a[1] + c * b[1])) : d = f(a, b), 
        d;
    }
    function f(a, b) {
        return [ .5 * (a[0] + b[0]), .5 * (a[1] + b[1]) ];
    }
    function g(a, b) {
        var c = a[0] - b[0], d = a[1] - b[1];
        return Math.sqrt(c * c + d * d);
    }
    function h(a, b, c) {
        c /= 2;
        var d = {}, e = {}, f = {};
        d.x = b[0] - a[0], d.y = b[1] - a[1], e.x = -d.y, e.y = +d.x, f.x = +d.y, f.y = -d.x;
        var h = g(a, b);
        if (0 === h) return [ a, a ];
        var i = [], j = [];
        return i.push(a[0] + c / h * e.x), i.push(a[1] + c / h * e.y), j.push(i), i = [], 
        i.push(a[0] + c / h * f.x), i.push(a[1] + c / h * f.y), j.push(i), j;
    }
    function i(a, b, d) {
        return c(f(a, b)) + " " + c(f(b, d)) + " " + c(d);
    }
    var j = 15, k = 30, l = 8, m = 10, n = 6, o = 25, p = 2, q = 6, r = 6, s = 5, t = a.View.extend({
        tagName: "svg:g",
        clsName: "editer",
        initialize: function() {
            a.View.prototype.initialize.apply(this, arguments), this.__line = d3.svg.line().interpolate("cardinal"), 
            this.draw();
        },
        getSVGText: function() {
            return this.svg.select(".p-entity").node().outerHTML;
        },
        draw: function() {
            var a = "#5da2ff";
            this.svg.append("path").attr("class", "p-line p-entity").attr("fill", "none").attr("stroke", a).attr("stroke-width", 3).attr("stroke-opacity", 0), 
            this.svg.append("svg:g").append("path").attr("class", "p-line p-helper cursor-move").attr("fill", "none").attr("stroke", a).attr("stroke-opacity", "0.6").attr("stroke-width", 8), 
            this.update();
        },
        _mousedown: function() {},
        update: function() {
            var a = this.model.toJSON(), d = b(a.startPoint, a.endPoint), e = this.svg.select("path"), f = [ "M", c(d[0]), "L", c(d[0]), "C", i(d[0], d[9], d[8]), "L", c(d[8]), "C", i(d[8], d[10], d[1]), "L", c(d[2]), "L", c(d[3]), "L", c(a.endPoint), "L", c(d[4]), "L", c(d[5]), "z" ].join(" ");
            e.attr("d", f);
            var g = this.svg.selectAll(".p-entity");
            a.style.stroke = a.style.fill, MX.each(a.style, function(a, b) {
                g.attr(b, a);
            });
            var h = this.svg.selectAll(".p-helper");
            a.selected ? h.attr("stroke-opacity", .6) : h.attr("stroke-opacity", 0);
        }
    });
    a.registerModelView("Arrow", t);
}(MX.Painter), define("painter", [ "d3", "uuid" ], function(a) {
    return function() {
        var b;
        return b || a.MX;
    };
}(this)), define("mx.base", function() {});