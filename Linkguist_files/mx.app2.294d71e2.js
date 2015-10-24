define("text!template/binder/binderItem.html", [], function() {
    return '<li id="{{cid}}">\n    <div class="mx-item {{#if isInvited}}mx-invited-binder{{/if}}" id="{{board.id}}">\n        {{#unless isInvited}}\n        <a class="mx-binder-hit" data-action="showBinderDetail" data-param="{{board.id}}"></a>\n        {{/unless}}\n\n        {{#if isInvited}}\n        <div class="mx-action">\n            <button type="button" data-action="acceptBinder" data-param="{{board.id}}"\n                        class="btn btn-warning btn-xs">{{lang.accept}}</button>\n            <button type="button" data-action="declineBinder" data-param="{{board.id}}"\n                        class="btn btn-gray btn-xs">{{lang.decline}}</button>\n        </div>\n        {{/if}}\n\n        <div class="mx-mask"></div>\n        <div class="mx-cover-wrap">\n            <img src="{{blankImg}}"\n                 class="lazy"\n                 data-original="{{board.thumbnail}}"\n                    />\n        </div>\n        <div class="mx-info">\n            <span class="ellipsis-2line board-title" title="{{board.name}}"\n                  ta-param="{{board.name}}">{{board.name}}</span>\n\n            <span>\n                <i class="micon-user size12"/>{{board.total_members}}\n\n                {{!-- We limit page number to 4 digits for UI display 5/11/2015 --}}\n                {{#ifCond board.total_pages \'>\' 999}}\n                <i class="micon-page size12"/>999+\n                {{/ifCond}}\n                {{#ifCond board.total_pages \'<\' 1000}}\n                <i class="micon-page size12"/>{{board.total_pages}}\n                {{/ifCond}}\n\n                <i class="micon-todo-empty-fine size12" />{{board.total_open_todos}}\n\n                {{!-- v2.9.0, removed isTeamBinder\n                {{#if isTeamBinder}}\n                    {{#when feed_unread_count \'>\' 0}}\n                <i class="bizlib-unread-indicator pull-right"></i>\n                {{/when}}\n                {{/if}}\n                --}}\n            </span>\n        </div>\n    </div>\n</li>';
}), define("text!template/binder/binderListEmpty.html", [], function() {
    return '<div class="binderlist-empty-list">\n	<div class="empty-container">\n		<p>{{lang.no_binder_in_shelf}}</p>\n		<p>{{lang.what_can_do_in_shelf}}</p>\n		<p>\n			<div>\n				- {{lang.what_can_do_in_shelf_1st}}\n			</div>\n			<div>\n				- {{lang.what_can_do_in_shelf_2nd}}\n			</div>\n		</p>\n	</div>\n</div>';
}), define("text!template/binder/categories.html", [], function() {
    return '<div class="btn-group" id="mx-categories">\r\n    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">\r\n       <span class="dropmenu-label current-category ellipsis" data-seq="0"> {{lang.default_category}}</span> <span class="caret"></span>\r\n    </button>\r\n    <ul class="dropdown-menu category-list" role="menu" >\r\n\r\n    </ul>\r\n</div>';
}), define("text!template/binder/categoryList.html", [], function() {
    return '<li><a class="mouse-hand" data-action="showAllBinders"><i class="micon-binder"></i> {{lang.all_binders}}</a></li>\r\n\r\n{{#each teams}}\r\n<li id="group_{{group.id}}">\r\n	<a data-action="filterBinderByTeam" class="mouse-hand ellipsis" data-param="{{group.id}},{{group.name}}"><i class="micon-group-users"></i> {{group.name}}</a>\r\n</li>\r\n{{/each}}\r\n\r\n<li class="default-category" ><a class="mouse-hand" data-action="filterBinderByCategory" data-param="0"><i class="micon-category"></i> {{lang.default_category}}</a></li>\r\n\r\n{{#each categories}}\r\n<li id="category_{{sequence}}">\r\n	<a data-action="filterBinderByCategory" class="mouse-hand ellipsis" data-param="{{sequence}}"><i class="micon-category"></i> {{name}}</a>\r\n</li>\r\n{{/each}}\r\n\r\n<li class="divider"></li>\r\n\r\n<li><a class="mouse-hand" data-action="manageCategory"><i class="micon-setting-empty"></i> {{lang.manage_category}}</a></li>';
}), define("binder/categories", [ "moxtra", "lang", "app", "text!template/binder/categories.html", "text!template/binder/categoryList.html", "binder/binderBiz", "component/selector/categorySelector" ], function(a, b, c, d, e, f, g) {
    var h = Handlebars.compile(e);
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, this.groupId = a.groupId, this.binders = a.binders, this.categories = Moxtra.getMe().categories, 
            this.teams = Moxtra.getMe().groups;
        },
        rendered: function() {
            this.categories.inited === !0 ? this.renderCategories() : this.listenTo(this.categories, "inited", this.renderCategories);
        },
        getCurrentCategory: function() {
            return this.$(".current-category").data("seq");
        },
        renderCategories: function() {
            this.$(".category-list").empty().append(h({
                lang: b,
                groupId: this.groupId,
                teams: this.teams,
                categories: this.categories
            })), this.teams.length && this.$(".teams-divider").removeClass("hide"), this.listenTo(this.categories, "remove", this.removeCategory), 
            this.listenTo(this.categories, "add", this.addCategory), this.listenTo(this.teams, "remove", this.removeTeam), 
            this.listenTo(this.teams, "add", this.addTeam);
        },
        removeCategory: function(a) {
            var b = this, c = a.get("sequence"), d = this.$(".current-category").data("seq");
            this.renderCategories(), c == d && (MX.each(this.binders.models, function(a) {
                a.get("category") == c && a.set("category", 0);
            }), setTimeout(function() {
                b.$(".default-category a").trigger("click");
            }, 400));
        },
        addCategory: function() {
            this.renderCategories();
        },
        filterBinderByCategory: function(a) {
            a = 1 * a, this.setCategoryTo(a);
        },
        setCategoryTo: function(a) {
            var c = b.default_category;
            a && this.categories.get(a) ? c = this.categories.get(a).get("name") : a = 0, Moxtra.getBoardList(a), 
            this.$(".current-category").text(c), this.$(".current-category").data("team", "").data("seq", a);
        },
        removeTeam: function(a) {
            var b = this.$(".current-category").data("team"), c = MX.get("id", a.group), d = this;
            this.renderCategories(), b === c && setTimeout(function() {
                d.$(".default-category a").trigger("click");
            }, 400);
        },
        addTeam: function() {
            this.renderCategories();
        },
        filterBinderByTeam: function(a, b) {
            if (this.$(".current-category").data("team") !== a) {
                var c = this.teams.get(a);
                c && (Moxtra.getBoardList("team", {
                    teamId: a
                }), this.$(".current-category").text(b), this.$(".current-category").data("team", a));
            }
        },
        manageCategory: function() {
            new MX.ui.Dialog(new g({
                title: b.manage_category,
                buttons: [ {
                    position: "right",
                    text: b.done,
                    className: "btn-primary",
                    click: function() {
                        this.close();
                    }
                } ]
            }));
        }
    });
}), define("binder/binder", [ "moxtra", "lang", "text!template/binder/binderList.html", "text!template/binder/binderItem.html", "text!template/binder/binderListEmpty.html", "binder/binderDetail", "binder/binderBiz", "app", "binder/newBinderOptions", "binder/binderSettings", "binder/binderModel", "admin/branding/helper", "binder/categories", "sortable" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n = MX.logger("Binder"), o = Handlebars.compile(e);
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function(a) {
            a = a || {}, this.biz = g, this.$scope.lang = b, this.listenTo(h.request, "change:page", this.jumpToDetail), 
            this.$scope.myId = Moxtra.getMe().id, this.$scope.groupId = this.groupId = Moxtra.getMe().groupId, 
            this.$scope.contextClass = "shelf-only", this.recovery(this.categories);
        },
        onCollectionSort: function() {
            var a = this;
            h.request.page() && setTimeout(function() {
                a.scrollToBinder(h.request.page());
            }, 100);
        },
        onParamsChange: function() {
            var a = h.request.params();
            if ("team" == a.category) this.showTeamBinders(); else if (a.category && this.categoryList) {
                this.categoryList.setCategoryTo(1 * a.category), this.highlightBinder();
                var b = h.request.page();
                this.scrollToBinder(b);
            }
        },
        showAllBinders: function() {
            Moxtra.getBoardList("all"), this.categoryList.$el.find(".current-category").data("team", "").data("seq", "").text(b.all);
        },
        showTeamBinders: function() {
            Moxtra.getBoardList("team"), this.categoryList.$el.find(".current-category").data("seq", "").text(b.business_library);
        },
        scrollToBinder: function(a) {
            var b = this.$("#" + a).parent(), c = $("#mxPageBody_Col_1");
            if (b.size()) {
                var d = b.position(), e = d.top, f = c.scrollTop(), g = c.height(), h = b.outerHeight();
                0 > e ? c.scrollTop(f + e) : e + h > g && c.scrollTop(f + e - g + h);
            }
        },
        onRemoveBinder: function(a) {
            var b = MX.get("board.id", a);
            if (h.request.page() === b && this.binders.length > 0) {
                for (var a = this.binders[0], c = 0; a && a.get("isInvite"); ) c++, a = this.binders[c];
                a && h.request.page(MX.get("board.id", a), !0);
            }
        },
        jumpToDetail: function() {
            n.info("binder jump to detail");
            var a = h.request.page();
            if (a) {
                var b, c = Moxtra.getUserBoard(a);
                if (!c) return void h.request.page("");
                var d = this.categoryList.getCurrentCategory();
                b = c.category ? c.category : 0, b !== d && this.categoryList.setCategoryTo(b), 
                this.showBinderDetail(a, !0), $(this.container).addClass("mx-layout-three"), this.isShowDetail = !0, 
                this.scrollToBinder(a);
            } else this.boardid = null, this.isShowDetail = !1, $(this.container).removeClass("mx-layout-three"), 
            h.sendMessage({
                action: "list",
                binder_id: null,
                session_key: null,
                session_id: Moxtra.getMe().sessionId
            });
            this.highlightBinder();
        },
        highlightBinder: function() {
            var a = h.request.page(), b = this.currBoard, c = this;
            if (b && b != a && this.$("#" + b).parent().removeClass("active"), a) {
                var d = c.$("#" + a).parent();
                d.addClass("active");
            }
            this.currBoard = a;
        },
        rendered: function() {
            {
                var c = this, e = h.request.page();
                h.request.sequence();
            }
            e || $(this.container).removeClass("mx-layout-three"), MX.loading(!0), Moxtra.onReady(function() {
                if (MX.loading(!1), c.binders = Moxtra.getBoardList(0), c.userBoards = Moxtra.getUserBoards(), 
                c.listenTo(c.binders, "remove", c.onRemoveBinder), c.listenTo(c.binders, "sort", c.onCollectionSort), 
                c.categoryList = new m({
                    renderTo: c.$(".top-bar .binder-category"),
                    groupId: c.groupId,
                    binders: c.binders
                }), c.recovery(c.categoryList), c.listenTo(h.request, "change:params.category", c.onParamsChange), 
                c.list = new a.List({
                    renderTo: c.$(".list-container"),
                    className: "mx-binder-thumb mx-list",
                    template: d,
                    emptyTemplate: "",
                    sortable: function() {
                        return "team" !== this.collection.category;
                    },
                    speedup: !0,
                    getSortItems: function() {
                        return ".mx-invited-binder";
                    },
                    lazyload: c.$(".list-container "),
                    syncFiled: {
                        board: [ "total_members", "total_pages", "thumbnail", "total_comments", "name" ]
                    },
                    syncModel: [ "status", "category", "feed_unread_count", "lastFeed" ],
                    $scope: {
                        lang: b,
                        blankImg: h.const.defaults.blankImg,
                        myId: Moxtra.getMe().id,
                        defaultBoardAvatar: Moxtra.config.defaults.binder_cover_project
                    },
                    onSortItem: $.proxy(c.onSortBinder, c)
                }), c.list.binding(c.binders), c.recovery(c.list), c.listenToOnce(c.binders, "inited", function() {
                    c.jumpToDetail(), h.request.params().category && c.onParamsChange();
                }), c.userBoards) {
                    var e = Moxtra.const;
                    c.listenTo(c.userBoards, e.EVENT_DATA_MODEL_CHANGE, c._handleEmptyUI), c.listenTo(c.userBoards, e.EVENT_DATA_ADD, c._handleEmptyUI), 
                    c.listenTo(c.userBoards, e.EVENT_DATA_REMOVE, c._handleEmptyUI), c._handleEmptyUI();
                }
            }), this.$(".top-bar").removeClass("hide");
        },
        onSortBinder: function(a) {
            var b, c, d, e, f, h = this, i = this.binders.get(a.children().attr("id")).toJSON(), j = a.prev().children().attr("id"), k = a.next().children().attr("id");
            if (j) if (c = this.binders.get(j).toJSON(), k) {
                if (b = this.binders.get(k).toJSON(), d = parseFloat(b.order_number || b.sequence), 
                e = parseFloat(c.order_number || c.sequence), d == e) {
                    var l = 100, m = [];
                    MX.each(this.binders, function(a) {
                        if (a.get("sequence") !== i.sequence) {
                            var b = parseFloat(a.get("order_number")) + l;
                            m.push({
                                binderSequence: a.get("sequence"),
                                order_number: b + ""
                            }), a.set("orderNumber", b), l += 100;
                        }
                    }), c = this.binders.get(j).toJSON(), b = this.binders.get(k).toJSON(), d = parseFloat(b.order_number || b.sequence), 
                    e = parseFloat(c.order_number || c.sequence);
                    var n = (d + e) / 2;
                    return m.push({
                        binderSequence: i.sequence,
                        order_number: n + ""
                    }), void g.updateBindersOrderNumber(m).success(function() {
                        h.binders.get(a.children(0).attr("id")).set("order_number", n, {
                            silent: !0
                        });
                    });
                }
                f = (d + e) / 2;
            } else f = parseFloat(c.orderNumber || c.sequence), f += 50; else b = this.binders.get(k).toJSON(), 
            f = parseFloat(b.orderNumber || b.sequence), f -= 50;
            g.updateBinderOrderNumber(i.sequence, f + "").success(function() {
                h.binders.get(a.children(0).attr("id")).set("order_number", f, {
                    silent: !0
                });
            });
        },
        showBinderDetail: function(a, b) {
            if (this.boardid != a) {
                this.boardid = a;
                var c = this;
                h.request.page() != a && h.request.page(a, !!b), c.detailController && c.detailController.destroy(), 
                c.detailController = new f({
                    renderTo: "#mxPageBody_Col_2",
                    request: h.request,
                    defaultTab: "tab_chat",
                    isLoad: !0
                });
            }
        },
        binderOptions: function(a) {
            return this.binderInfo = Moxtra.getUserBoard(a), this.binderInfo && this.binderInfo.board ? void new MX.ui.Dialog(new j({
                binderId: a
            })) : void MX.ui.Alert(b.binder_not_found);
        },
        acceptBinder: function(a) {
            {
                var c = this;
                c.binders.get(a);
            }
            g.acceptBinder(a).success(function() {
                MX.ui.notifySuccess(b.invite_accept_success);
            }).error(function() {
                MX.ui.notifyError(b.invite_accept_failed);
            });
        },
        declineBinder: function(a) {
            {
                var c = this;
                c.binders.get(a);
            }
            g.declineBinder(a).success(function() {
                c.binders.remove(a), MX.ui.notifySuccess(b.invite_decline_success);
            }).error(function() {
                MX.ui.notifyError(b.invite_decline_failed);
            });
        },
        newBinder: function() {
            var a;
            a = new MX.ui.Dialog({
                content: new i({
                    onCreatedBinder: function(b) {
                        h.request.page(b), a.close();
                    }
                })
            });
        },
        _handleEmptyUI: function() {
            var a = this;
            _.delay(function() {
                var c = a.$(".list-container .binderlist-empty-list");
                a._hasBinder() ? c.remove() : (a.$(".list-container .mx-list").empty(), c.size() || a.$(".list-container").append(o({
                    lang: b
                })));
            }, 300);
        },
        _hasBinder: function() {
            var a = !1;
            return this.userBoards && this.userBoards.each(function(b) {
                return Moxtra.api.filter.isTimelineData(b) ? Moxtra.util.get("board.is_team", b) || !Moxtra.util.get("board.isconversation", b) ? (a = !0, 
                !1) : void 0 : !1;
            }), a;
        }
    });
}), define("binder/binderCollection", [ "moxtra", "binder/binderModel", "binder/binderBiz" ], function(a, b) {
    var c = MX.logger("binderCollection");
    return a.Collection.extend({
        model: b,
        filterCategoryFn: null,
        onlyBinder: !0,
        sortField: [ "isInvite", "orderNumber" ],
        comparator: function(a, b) {
            if (a.get("isInvite") && !b.get("isInvite")) return -1;
            if (!a.get("isInvite") && b.get("isInvite")) return 1;
            var c = parseFloat(a.get("orderNumber") || a.get("sequence")), d = parseFloat(b.get("orderNumber") || b.get("sequence"));
            return d >= c ? -1 : 1;
        },
        subscribe: function() {
            c.debug("subscribe /users/me on binder list");
        },
        destroy: function() {
            this.reset(), this._collection = null;
        },
        filterCategory: function(a) {
            var b = this._collection;
            if (this.filterCategoryFn = a, a) {
                var c = _.filter(b.models, a);
                this.reset(c);
            } else this.reset(b.models);
            this._collection = b;
        },
        defaultCategoryFilter: function(a) {
            return !a.get("category");
        },
        processItem: function(a, b) {
            var c = this._collection, d = this;
            if (!this.onlyBinder || !a.board || 1 != a.board.isconversation && 1 != a.board.islive) {
                var e = MX.filter(this, {
                    sequence: a.sequence
                });
                if (!a.is_deleted) {
                    var f = e && e[0].get("category") != (a.category ? a.category : 0), g = c.add(a, {
                        parse: !0,
                        merge: !0
                    });
                    return d.sortField && g.changed && MX.each(d.sortField, function(a) {
                        void 0 != g.changed[a] && (d.needSort = !0);
                    }), f && this.filterCategoryFn && !this.filterCategoryFn(g) ? this.remove(e[0]) : b || this.filterCategoryFn && !this.filterCategoryFn(g) || this.add(a, {
                        parse: !0,
                        merge: !0
                    }), g;
                }
                e && (this.remove(e[0]), c.remove(e[0]));
            }
        },
        checkCategory: function(a) {
            var b = {};
            MX.each(Moxtra.getMe().categories, function(a) {
                b[a.sequence] = a.name;
            }), MX.each(a, function(a) {
                a.category && !b[a.category] && (a.category = 0);
            });
        },
        processData: function(a, b) {
            var c = this, d = (this._collection, []);
            if (this.onlyBinder && this.checkCategory(a), b) {
                this.trigger("processing"), this._collection = this.clone(), this.filterCategoryFn = this.defaultCategoryFilter;
                var e = JSON.parse(localStorage.getItem("mx:SilentMessage"));
            }
            MX.each(a, function(a) {
                if (a && (a.boardId || a.is_deleted)) {
                    var f = c.processItem(a, b);
                    b && f && c.filterCategoryFn && c.filterCategoryFn(f) && (e && f.set("isSilentMessageOn", e[f.id] === !0), 
                    d.push(f));
                }
            }), this._collection && 0 != this._collection.length || this.trigger("empty"), b ? (d = d.sort(this.comparator), 
            this.reset(d)) : c.needSort && (this.sort(this.comparator), c.needSort = !1), this.trigger("complete", b);
        },
        onSubscribe: function(a) {
            this.processData(a && a.data && a.data.boards, a.isFullData);
        },
        fetch: function() {
            this.subscribe();
        },
        search: function(b) {
            var d = this;
            new a.ChainObject(function() {
                MX.api("/binders", "GET", {
                    action: "search",
                    data: {
                        text: b
                    }
                }, this.callback, this);
            }).success(function(a) {
                c.debug(a), d.reset(a.data, {
                    parse: !0
                });
            }).error(function() {
                d.trigger("error");
            });
        }
    });
}), define("binder/binderMemberModel", [ "moxtra", "lang", "const", "user/userModel" ], function(a, b, c, d) {
    MX.logger("binderUserModel");
    return d.extend({
        defaults: {
            isEditor: !1,
            isOwner: !1,
            isPending: !1,
            subTitle: "",
            canBeEdit: "",
            isGroup: !1
        },
        parse: function(a, e) {
            var f, g = c.binder.role, h = c.binder.status;
            return a.group ? (f = MX.pick(a, [ "group.id", "group.name", "status", "sequence", "type" ], {
                format: function(a) {
                    return MX.camelize(a.split(".").pop());
                }
            }), f.avatar = c.defaults.group.avatar, f.displayName = f.name, f.isGroup = !0, 
            f.userid = f.sequence) : a.user && (f = d.prototype.parse(a, e), Moxtra.getMe().id === f.userid && (f.subTitle = b.me_with_parentheses, 
            f.iCannotEditorClass = "disabled", f.isMe = !0), MX.equal(f.status, [ h.invite ]) && (f.subTitle = b.pending_with_parentheses, 
            f.isPending = !0, f.userid = f.sequence)), f.type == g.Owner && (f.isOwner = !0), 
            MX.equal(f.type, [ g.Editor, g.Owner ]) && (f.isEditor = !0), f;
        }
    });
}), define("binder/binderMemberCollection", [ "moxtra", "binder/binderMemberModel" ], function(a, b) {
    var c = MX.logger("binderMemberCollection");
    return a.Collection.extend({
        model: b,
        _subscribe: function(b) {
            b && (MX.subscribe(a.format("/binders/{0}", b), {
                subject: "object.board.users"
            }, this.onSubscribe, this), this.binderId = b, this.cache = {});
        },
        destroy: function() {
            MX.unsubscribe(a.format("/binders/{0}", this.binderId), this.onSubscribe, this), 
            this.binderId = null;
        },
        onSubscribe: function(a) {
            c.debug("binderMemberCollection onSubscribe complete:/binders/" + this.boardid);
            var d = this;
            if (a && !a.isFullData) MX.each(a.data, function(a) {
                if (a.is_deleted) {
                    var c = a.user && a.user.id || a.group && a.group.id, e = d.get(c);
                    d.remove(e);
                } else {
                    var f, g = new b(a, {
                        parse: !0
                    }), h = !0;
                    a.user && !a.user.id ? d.cache[a.sequence] = g : a.user && (f = d.cache[a.sequence], 
                    f && (f.set(g.toJSON()), h = !1, delete d.cache[a.sequence])), h && d.add(g, {
                        merge: !0
                    });
                }
            }); else if (a.data) {
                var e = [];
                MX.each(a.data, function(a) {
                    a.is_deleted || e.push(a);
                }), this.reset(e, {
                    parse: !0,
                    merge: !0
                });
            }
        },
        fetch: function(a) {
            this.binderId && this.destroy(), this._subscribe(a);
        },
        comparator: function(a, b) {
            var c = a.toJSON(), d = b.toJSON(), e = (c.displayName || "").toLowerCase(), f = (d.displayName || "").toLowerCase();
            return c.isOwner ? -1 : d.isOwner ? 1 : Moxtra.getMe().id === c.userid ? -1 : Moxtra.getMe().id === d.userid ? 1 : f > e ? -1 : e > f ? 1 : 0;
        },
        _parseData: function(a) {
            this.reset(a.data, {
                parse: !0
            });
        }
    });
}), define("binder/pageGroupCollection", [ "moxtra", "binder/pageGroupModel" ], function(a, b) {
    MX.logger("binderCollection");
    return a.Collection.extend({
        model: b,
        sortField: [ "name" ],
        comparator: function(a, b) {
            var c = a.get("name") && a.get("name").toLowerCase(), d = b.get("name") && b.get("name").toLowerCase();
            return d >= c ? -1 : 1;
        }
    });
}), define("binder/binderPageCollection", [ "moxtra", "const", "binder/binderPageModel", "binder/pageGroupCollection", "binder/binderBiz" ], function(a, b, c, d) {
    var e = MX.logger("binderPages"), f = [ 1, 2, 3, 4, 5 ];
    return a.Collection.extend({
        model: c,
        initialize: function() {
            this.groups = new d(), this.comparator = function(a, b) {
                var c = parseFloat(a.get("pageNumber")), d = parseFloat(b.get("pageNumber"));
                return d > c ? -1 : c > d ? 1 : a.get("sequence") > b.get("sequence") ? 1 : -1;
            }, e.debug("new page collection", this.$name);
        },
        subscribe: function(a, b) {
            var c = this;
            c.boardid && (MX.unsubscribe("/binders/" + c.boardid, c.onSubscribe, c), MX.unsubscribe("/binders/" + c.boardid, c.onGroupSubscribe, c), 
            e.debug("unsubscribe", c.boardid)), a && (c.groups ? c.groups.reset([]) : (e.error("me.groups is null"), 
            c.groups = new d()), c.reset([]), c.trigger("processing"), c.boardid = a, MX.subscribe("/binders/" + a, {
                subject: "object.board.pages",
                data: {
                    session_key: b
                }
            }, c.onSubscribe, c), MX.subscribe("/binders/" + a, {
                subject: "object.board.page_groups",
                data: {
                    session_key: b
                }
            }, c.onGroupSubscribe, c));
        },
        destroy: function() {
            MX.unsubscribe("/binders/" + this.boardid, this.onSubscribe, this), MX.unsubscribe("/binders/" + this.boardid, this.onGroupSubscribe, this), 
            this.groups = null, this.boardid = null;
        },
        processSameData: function() {
            var a = 0, b = this, c = b.models, d = c.length;
            b.each(function(e) {
                var f = 100, g = parseFloat(e.get("pageNumber"));
                if (g != a) a = g; else {
                    b.needUpdate = !0;
                    for (var h = 0; d > h; h++) c[h].set({
                        pageNumber: g + f + "",
                        needUpdate: !0
                    }), f += 100;
                }
            });
        },
        processTheDirtyData: function() {
            var a = this, b = a.models, c = b.length;
            a.groups.each(function(d) {
                for (var e, f = d.get("totalPages"), g = 0, h = 0, i = 1, j = 0; c > j; j++) {
                    var k = b[j].get("pageGroup");
                    if (k && (k.client_uuid == d.get("client_uuid") ? (f--, 0 !== h ? (a.needUpdate = !0, 
                    b[j].set({
                        pageNumber: g + e * i + 1,
                        needUpdate: !0
                    }), i++) : g = parseFloat(b[j].get("pageNumber"))) : 0 !== g && 0 === h && (h = parseFloat(b[j].get("pageNumber")), 
                    e = (h - g) / (1 + f)), 0 >= f)) break;
                }
            });
        },
        onSubscribe: function(a) {
            if (e.debug("binderPageCollection onSubscribe complete:/binders/" + this.boardid), 
            a && "RESPONSE_SUCCESS" == a.code) {
                var b = this, c = a.isFullData;
                MX.each(a.data, function(a) {
                    (a.is_deleted || a.local_revision) && b.processItem(a, {
                        isFullData: c
                    }), !c && a.contents && b.trigger("annotate", a.sequence, a.contents);
                }), b.sort(), c && (b.processSameData(), b.groups.models.length > 0 && (b.processTheDirtyData(), 
                b.sort())), b.updatePageIndex(), b.removeEmptyPageGroup(), c && this.trigger("firstComplete");
            }
            this.trigger("complete"), this.length || this.trigger("empty");
        },
        onGroupSubscribe: function(a) {
            if (e.debug("binderPageCollection onGroupSubscribe complete:/binders/" + this.boardid), 
            a && "RESPONSE_SUCCESS" == a.code) {
                if (a.isFullData) return;
                var b = a.data[0];
                this.groups.get(b.client_uuid) && !b.is_deleted && this.groups.add(b, {
                    boardid: this.boardid,
                    merge: !0
                });
            }
        },
        processSinglePageGroup: function() {
            var a = this;
            this.each(function(b) {
                var c = b.get("pageGroup");
                if (c) {
                    var d = a.groups.get(c.client_uuid);
                    d && 1 === d.get("totalPages") && (a.groups.remove(d), b.set("pageGroup", null), 
                    a.trigger("ungroup", b));
                }
            });
        },
        removeEmptyPageGroup: function() {
            var a = this, b = {};
            this.each(function(a) {
                var c = a.get("pageGroup");
                c && (b[c.client_uuid] = !0);
            });
            for (var c = 0; c < a.groups.length; c++) {
                var d = a.groups.models[c];
                b[d.get("client_uuid")] || a.groups.remove(d);
            }
        },
        removeItem: function(a, b, c) {
            if (this.remove(c), b && b.pageGroup) {
                var d = this.groups.get(b.pageGroup.client_uuid), e = d.get("totalPages") - 1;
                if (0 >= e) return void this.groups.remove(d);
                d.set("totalPages", e);
            }
        },
        processItem: function(a, c) {
            c = c || {};
            var d, e, g, h, i = this.get(a.sequence);
            if (i && (d = i.toJSON()), a.is_deleted) return void this.removeItem(a, d, i);
            if (a.page_group) if (e = a.page_group.client_uuid, g = this.groups.get(e)) d && d.pageGroup && d.pageGroup.client_uuid == e || (h = g.get("totalPages"), 
            h++, g.set("totalPages", h)); else {
                var j = a.page_group;
                j.firstPageSequence = a.sequence, j.bgColor = f[this.groups.length % 5];
                var k = MX.getUserBinder(this.boardid || c.boardid);
                j.totalPages = 1, j.isViewer = k && k.type === b.binder.role.Viewer || !!c.viewer, 
                this.groups.add(j, {
                    boardid: this.boardid || c.boardid,
                    merge: !0,
                    silent: c.isFullData
                });
            } else d && d.pageGroup && (e = d.pageGroup.client_uuid, g = this.groups.get(e), 
            g && (h = g.get("totalPages"), h--, g.set("totalPages", h), 0 >= h && this.groups.remove(g)));
            var l = this.add(a, {
                parse: !0,
                boardid: this.boardid || c.boardid,
                token: c.token,
                merge: !0,
                sort: c.isFullData ? !1 : !0,
                silent: c.isFullData
            });
            c.isFullData || (!a.page_group || !d || d.pageGroup && a.page_group.client_uuid == d.pageGroup.client_uuid ? !a.page_group && d && d.pageGroup && (l.set("pageGroup", null), 
            this.trigger("ungroup", l)) : this.trigger("group", l));
        },
        updatePageIndex: function() {
            var a = this, b = 1, c = {};
            this.each(function(d) {
                var e = d.get("pageGroup");
                if (e) {
                    var f = a.groups.get(e.client_uuid);
                    if (c[e.client_uuid]) {
                        var g = c[e.client_uuid] + 1;
                        c[e.client_uuid] = g, d.set("pageIndex", f.get("pageIndex") + "-" + g);
                    } else c[e.client_uuid] = 1, f.set("pageIndex", b), d.set("pageIndex", b + "-1"), 
                    b++;
                } else d.set("pageIndex", b + ""), b++;
            });
        }
    });
}), define("binder/fileProgress", [ "moxtra", "lang", "text!template/component/fileProgress.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        className: "file-progress",
        init: function(a) {
            this.$scope.lang = b, _.extend(this, a), this.listenTo(a.model, "change", this.update);
        },
        update: function(a) {
            var b = a.get("percent");
            if (this.$(".progress-bar").width(b + "%"), this.$(".sr-only").text(b + "%"), 100 == b) {
                var c = this.parent;
                setTimeout(function() {
                    c.close();
                }, 2e3);
            }
        }
    });
}), define("text!template/binder/joinBinder.html", [], function() {
    return '<div class="container2">\r\n    <h1 class="page-title">{{lang.invitation}}</h1>\r\n    \r\n    <div id="mxJoinBinder">\r\n    	\r\n    </div>\r\n</div>';
}), define("text!template/binder/joinBinderConflict.html", [], function() {
    return '<div class="alert alert-warning">\r\n	<span>{{bbcode conflict}}</span>\r\n	<br/>\r\n	<span>{{bbcode conflict_note}}</span>\r\n	<br/>\r\n	<div class="container2 row">\r\n		<br/>\r\n		<div class="col-md-12">\r\n			<button class="btn btn-primary pull-right" data-action="goHome">{{lang.ok}}</button>\r\n		</div>\r\n	</div>\r\n</div>';
}), define("text!template/binder/joinBinderView.html", [], function() {
    return '<div class="row">\n    <div class="col-xs-4 join-binder-left">\n        {{#if isChat}}\n            <div class="conversation-thumb">\n                <h3 class="ellipsis-3line">{{ownerName}}</h3>\n			<span class="img-circle img-polaroid">\n				<img src="{{ownerAvatar}}" class="chat-img img-circle"/>\n			</span>\n            </div>\n        {{else}}\n            <div class="mx-binder-thumb">\n                <div class="mx-item">\n                    <div class="mx-mask"></div>\n                    <div class="mx-cover-wrap">\n					<span class="mx-cover-img">\n					   <img src="{{thumbnail}}" class="lazy" data-original="{{thumbnail}}" style="display: inline;">\n					</span>\n                    </div>\n                    <div class="mx-info">\n                 <span class="ellipsis-2line board-title" title="{{name}}"\n                       ta-param="{{name}}">{{name}}</span>\n                    </div>\n                </div>\n            </div>\n        {{/if}}\n    </div>\n    <div class="col-xs-8 join-binder-right">\n        <div class="mx-join-binder-form">\n\n        </div>\n    </div>\n</div>\n';
}), define("text!template/common/signupForm.html", [], function() {
    return '<form id="signupForm" class="form-signin">\r\n	{{#unless fullForm}}\r\n	<div class="form-group">\r\n		<span class="invitee-email">{{email}}</span>\r\n	</div>\r\n	{{/unless}}\r\n\r\n	<div class="form-group" >\r\n		{{#if firstNameReadyonly}}\r\n			{{#if first_name}}\r\n			<strong>{{lang.first_name}}: </strong> <span style="word-break: break-all;">{{first_name}}</span>\r\n			{{/if}}\r\n		{{else}}\r\n		<input type="text" name="first_name" class="form-control" data-error-style="inline" placeholder="{{lang.first_name}}" autofocus>\r\n		{{/if}}\r\n	</div>\r\n\r\n	<div class="form-group" >\r\n		{{#if lastNameReadyonly}}\r\n			{{#if last_name}}\r\n			<strong>{{lang.last_name}}: </strong> <span style="word-break: break-all;">{{last_name}}</span>\r\n			{{/if}}\r\n		{{else}}\r\n		<input type="text" name="last_name" class="form-control" data-error-style="inline" placeholder="{{lang.last_name}}">\r\n		{{/if}}\r\n	</div>\r\n\r\n	{{#if phone_number}}\r\n	<div class="form-group" >\r\n		<strong>{{lang.phone_number}}: </strong> <span style="word-break: break-all;">{{phone_number}}</span>\r\n	</div>\r\n	{{/if}}\r\n\r\n	{{#if fullForm}}\r\n	<div class="form-group">\r\n		<input type="text" name="email" class="form-control" data-error-style="inline" placeholder="{{lang.email}}">\r\n	</div>\r\n	{{/if}}\r\n\r\n	<div class="form-group" >\r\n		<input type="password" name="pass" class="form-control" data-error-style="inline" placeholder="{{lang.password}}" autocomplete="off">\r\n	</div>\r\n\r\n	<div class="form-group" >\r\n		<input type="password" name="confpass" class="form-control" data-error-style="inline" placeholder="{{lang.confirm_password}}" autocomplete="off">\r\n	</div>\r\n\r\n	{{#unless hideDisclaimer}}\r\n	<div class="form-group">\r\n		<span>{{bbcode lang.signup_disclaimer}}</span>\r\n	</div>\r\n	{{/unless}}\r\n\r\n	<div class="form-group">\r\n		<button class="btn btn-lg btn-primary btn-block"  type="submit">{{btnText}}</button>\r\n	</div>\r\n\r\n	{{#if fullForm}}\r\n	<div class="form-group">\r\n		<span>{{lang.signup_does_have_account}} <a class="mouse-hand" data-action="gotoLogin">{{lang.signup_login_here}}</a></span>\r\n	</div>\r\n	{{/if}}\r\n</form>\r\n';
}), define("common/signupForm", [ "moxtra", "lang", "app", "text!template/common/signupForm.html", "identity/userModel", "identity/identityBiz" ], function(a, b, c, d, e) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.fullForm = a.fullForm || !1, this.isTrial = a.trial || !1, this.$scope.fullForm = this.fullForm, 
            this.$scope.hideDisclaimer = a.hideDisclaimer || !1, this.$scope.btnText = a.btnText || b.sign_up_and_accept, 
            this.$scope.email = a.email, this.$scope.firstNameReadyonly = a.firstNameReadyonly || !1, 
            this.$scope.lastNameReadyonly = a.lastNameReadyonly || !1, this.token = a.token, 
            this.tokenType = a.tokenType, this.preferredZone = a.preferredZone, this.callback = a.callback || function() {}, 
            this.$scope.lang = b;
            var c = e.extend({
                validation: {
                    first_name: {
                        required: !0,
                        msg: b.first_name_is_required
                    },
                    email: [ {
                        required: !0,
                        msg: b.email_is_required
                    }, {
                        pattern: "email",
                        msg: b.email_format_error
                    } ],
                    pass: {
                        minLength: 6,
                        msg: b.password_min_characters_required
                    },
                    confpass: {
                        equalTo: "pass",
                        msg: b.password_confirm
                    }
                }
            });
            this.model = new c(), this.fullForm || this.model.set({
                email: a.email,
                first_name: a.firstName || "",
                last_name: a.lastName || "",
                phone_number: a.phoneNumber || ""
            });
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                form: this.$el,
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        _success: function() {
            this.callback();
        },
        _error: function(a) {
            a = a || {}, this.form.showError("ERROR_EMAIL_DOMAIN_LOCKED" === a.detail_code ? b.sso_signup_fail : a.xhr && 409 === a.xhr.status ? b.signup_conflict : b.sign_up_failed);
        },
        submit: function() {
            var a = this.form, b = this.model.toJSON(), c = this;
            a.disable(!0), b.trial = this.isTrial, b.type = this.tokenType, b.token = this.token, 
            b.preferred_zone = this.preferredZone, Moxtra.signup(b).setScope(c).success(c._success).error(c._error).complete(function() {
                a.disable(!1);
            });
        }
    });
}), define("binder/joinBinderView", [ "moxtra", "lang", "app", "text!template/binder/joinBinderView.html", "common/loginForm", "common/signupForm", "binder/binderBiz" ], function(a, b, c, d, e, f, g) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {
            var a = this.model.toJSON(), b = this;
            return a.tokenAccepted ? void this.recovery(new e({
                email: a.tokenAcceptor,
                callback: function() {
                    c.navigate("/timeline/" + a.boardId, !0);
                },
                renderTo: ".mx-join-binder-form"
            })) : void this.recovery(a.inviteeExist ? new e({
                email: a.inviteeEmail,
                callback: function() {
                    b._accept(a.boardId);
                },
                renderTo: ".mx-join-binder-form"
            }) : new f({
                email: a.inviteeEmail,
                token: a.token,
                tokenType: "binder",
                callback: function() {
                    b._accept(a.boardId);
                },
                renderTo: ".mx-join-binder-form"
            }));
        },
        _accept: function(a) {
            this.model.get("isChat");
            g.acceptBinder(a).success(function() {
                c.navigate("/timeline/" + a, !0);
            }).error(function() {
                new MX.ui.Notify({
                    type: "error",
                    content: b.join_binder_token_invited_or_expired
                }), c.navigate("/timeline");
            });
        }
    });
}), define("binder/joinBinder", [ "moxtra", "lang", "app", "text!template/binder/joinBinder.html", "text!template/binder/joinBinderConflict.html", "binder/binderBiz", "binder/joinBinderModel", "binder/joinBinderView" ], function(a, b, c, d, e, f, g, h) {
    var i = Handlebars.compile(e);
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.token = c.request.page(), this.token || (this._showError(), 
            this._invalidHandle());
        },
        rendered: function() {
            function a() {
                f.verifyInvitationToken(d).success(function(a) {
                    b._success(a, d);
                }).error(function(a) {
                    b._error(a);
                });
            }
            if (this.token && this.token.length <= 26) c.navigate("/timeline/" + this.token, !0); else if (this.token) {
                this.loading();
                var b = this, d = this.token;
                Moxtra.verifyToken().complete(a);
            }
        },
        _success: function(a, d) {
            this.loading(!1), this.model = new g(), this.model.setData(a.object.board, d);
            var e = Moxtra.getMe(), j = this, k = e.id, l = e.email, m = j.model.toJSON(), n = m.inviteeId, o = m.boardId;
            return this.$(".page-title").html(m.isChat ? b.chat_invitation : b.binder_invitation), 
            m.tokenAccepted ? void (k ? m.boardMembers[k] ? c.navigate("/timeline/" + o, !0) : (this._showError(), 
            c.navigate("/timeline")) : this.recovery(new h({
                model: this.model,
                renderTo: "#mxJoinBinder"
            }))) : void (k ? k === n ? f.acceptBinder(o).success(function() {
                c.navigate("/timeline/" + o, !0);
            }).error(function() {
                j._showError(), c.navigate("/timeline");
            }) : this.$("#mxJoinBinder").html($(i({
                conflict: MX.format(b.join_binder_conflict, l, m.inviteeEmail),
                conflict_note: MX.format(b.join_binder_conflict_note, m.inviteeEmail),
                lang: b
            }))) : this.recovery(new h({
                model: this.model,
                renderTo: "#mxJoinBinder"
            })));
        },
        _error: function() {
            this.loading(!1), this._showError(), this._invalidHandle();
        },
        _invalidHandle: function() {
            c.navigate(Moxtra.getMe().id ? "/timeline" : "/login");
        },
        _showError: function() {
            new MX.ui.Notify({
                type: "error",
                content: b.join_binder_token_invited_or_expired
            });
        },
        goHome: function() {
            c.navigate("/timeline");
        },
        loading: function(a) {
            void 0 === a || a ? this.$("#mxJoinBinder").loading() : void 0 === a || a || this.$("#mxJoinBinder").loading(!1);
        }
    });
}), define("text!template/binder/leaveBinderView.html", [], function() {
    return '<div class="row">\r\n	<div class="col-xs-4  join-binder-left">\r\n		{{#if isChat}}\r\n		<div class="conversation-thumb">\r\n			<h3 class="ellipsis-3line">{{ownerName}}</h3>\r\n			<span class="img-circle img-polaroid">\r\n				<img src="{{ownerAvatar}}" class="chat-img img-circle"/>\r\n			</span>\r\n		</div>\r\n		{{else}}\r\n		<div class="mx-binder-thumb">\r\n			<div class="mx-item">\r\n		        <div class="mx-info">\r\n		            <h2 class="ellipsis-3line">{{name}}</h2>\r\n		        </div>\r\n				<div class="mx-mask"></div>\r\n				<div class="mx-cover-wrap">\r\n					<span class="mx-cover-img">\r\n					   <img src="{{thumbnail}}" class="lazy" data-original="{{thumbnail}}" style="display: inline;">\r\n					</span>\r\n				</div>\r\n			</div>\r\n		</div>\r\n		{{/if}}\r\n	</div>\r\n	<div class="col-xs-6 col-xs-offset-1">\r\n		<div class="turn-off-message">\r\n			<h3>\r\n				{{lang.turn_off_email_messages_confirm}}\r\n			</h3>\r\n			<br>\r\n			\r\n			<div class="turn-off-btn">\r\n				<button class="btn btn-default btn-lg btn-primary" data-action="turnOff">{{lang.ok}}</button>\r\n			</div>\r\n		</div>\r\n		\r\n	</div>\r\n			\r\n</div>';
}), define("binder/leaveBinderView", [ "moxtra", "lang", "app", "text!template/binder/leaveBinderView.html", "binder/binderBiz" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, this.token = a.token;
        },
        turnOff: function() {
            var a = this, c = this.model.toJSON();
            Moxtra.leaveBoardByToken(this.token, c.boardId).success(function() {
                var c = '<div class="alert alert-success"><span>' + b.email_messages_are_turned_off + "</span></div>";
                a.$(".turn-off-message").html(c);
            }).error(function() {
                var c = '<div class="alert alert-success"><span>' + b.email_messages_are_turned_off + "</span></div>";
                a.$(".turn-off-message").html(c);
            });
        }
    });
}), define("text!template/binder/leaveBinder.html", [], function() {
    return '<div class="container2">\r\n    <h1 class="page-title">{{lang.email_preference}}</h1>\r\n    \r\n    <div id="mxleaveMessage">\r\n    </div>\r\n</div>';
}), define("binder/leaveBinder", [ "moxtra", "lang", "app", "binder/binderBiz", "binder/joinBinderModel", "binder/leaveBinderView", "text!template/binder/leaveBinder.html" ], function(a, b, c, d, e, f, g) {
    var h = MX.logger("leaveBinder");
    return a.Controller.extend({
        template: g,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.token = c.request.page();
        },
        rendered: function() {
            var a = this;
            if (this.token) {
                this.loading();
                var b = this.token;
                d.verifyInvitationToken(b).success(function(b) {
                    var c = a.board = b.object.board;
                    a._success(c);
                }).error(function() {
                    a.loading(!1), a._showError();
                });
            } else this._showError();
        },
        _success: function(a) {
            var b = new e();
            b.setData(a), this.recovery(new f({
                model: b,
                token: this.token,
                renderTo: "#mxleaveMessage"
            })), this.loading(!1);
        },
        _handleError: function(a) {
            h.error(a), this.loading(!1);
        },
        _showError: function() {
            var a = '<div class="alert alert-warning"><span>' + b.email_messages_are_turned_off + "</span></div>";
            this.$("#mxleaveMessage").html(a);
        },
        goHome: function() {
            c.navigate("/timeline", !0);
        },
        loading: function(a) {
            void 0 === a || a ? this.$("#mxleaveMessage").loading({
                length: 7
            }) : void 0 === a || a || this.$("#mxleaveMessage").loading(!1);
        }
    });
}), define("binder/pageGroupSetting", [ "moxtra", "lang", "binder/binderBiz", "const" ], function(a, b, c) {
    MX.logger("binderSetting"), MX.Model.extend({
        defaults: {
            newName: ""
        },
        validation: {
            newName: [ {
                required: !0,
                msg: b.please_enter_binder_name
            } ]
        }
    });
    return a.Controller.extend({
        title: b.binder_options,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, _.extend(this, a), this.biz = c;
        },
        rendered: function() {
            var b = this;
            this.form = new a.Form({
                parent: this,
                form: this.$("form"),
                model: this.model,
                submit: this.updateBinderName,
                scope: this
            }), b.nameChanged = !1, this.model.on("change:name", function() {
                b.nameChanged = !0;
            }), this.$("#topic").on("blur", function() {
                b.updateBinderName();
            });
        }
    });
}), define("text!template/binder/publicView.html", [], function() {
    return '<div class="page-body" >\r\n    <div id="mxPageBody_Col_1">\r\n    	<div class="page-body" id="mxPublicView">\r\n			\r\n        </div>\r\n    </div>\r\n</div>\r\n';
}), define("text!template/binder/publicViewPages.html", [], function() {
    return '<div class="public-view-container {{#if hideHeader}}api-public-view-pages{{/if}}">\n	{{#unless hideHeader}}\n        {{#if contentCount}}\n    <header>\n	    <a href="{{logoHref}}" class="pull-left mouse-hand logo-icon {{#if isMobile}}mobile{{/if}}"><i class="micon-logo-moxtra size20"></i></a>\n	    <span class="pull-left title">{{displayName}}</span>\n	    <span class="btn-group pull-right marginRight10">\n	    	{{#if isMobile}}\n				<a class="btn btn-primary btn-sm dropdown-toggle marginTop5 {{#if disableAction}}disabled{{/if}} " data-action="downloadAction">{{lang.download}}</a>\n	    	{{else}}\n		    <a class="btn btn-primary btn-sm dropdown-toggle marginRight10 marginTop5 {{#if disableAction}}disabled{{/if}} {{#if isMobile}}hide{{/if}}" data-toggle="dropdown">{{lang.download}} <span class="caret"></span></a>\n			<ul class="dropdown-menu marginRight10" role="menu">\n				<li>\n					<a class="mouse-hand" data-action="downloadAction"><i class="micon-download size14"></i> {{lang.direct_download}}</a>\n				</li>\n				<li>\n					<a class="mouse-hand" data-action="copyAction"><i class="micon-logo-moxtra size14"></i> {{lang.save_to_my_moxtra}}</a>\n				</li>\n			</ul>\n			{{/if}}\n		</span>\n	</header>\n            {{/if}}\n    {{/unless}}\n	<div class="page-viewer">\n\n	</div>\n	<div class="mx-tab-content mx-public-view-content">\n\n	</div>\n</div>\n';
}), define("text!template/binder/publicViewEmpty.html", [], function() {
    return '<div class="mx-public-view-empty">\r\n	<div class="empty-info">\r\n		{{bbcode lang.binder_is_empty}}\r\n	</div>\r\n</div>';
}), define("text!template/binder/publicViewError.html", [], function() {
    return '<div class="mx-public-view-empty">\r\n	<div class="empty-info">\r\n		{{lang.binder_not_found}} <b>:)</b>\r\n	</div>\r\n</div>';
}), define("binder/publicViewPages", [ "moxtra", "lang", "app", "const", "text!template/binder/publicViewPages.html", "text!template/binder/publicViewEmpty.html", "text!template/binder/publicViewError.html", "common/loadingDialog", "binder/binderBiz", "binder/binderActions", "binder/binderPageCollection", "binder/pages", "binder/newBinderOptions", "viewer/viewer", "component/selector/binderSelector", "component/templateHelper" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    "use strict";
    var o = Handlebars.compile(f), p = Handlebars.compile(g);
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function(a) {
            this.board = this.model || new Moxtra.model.Board(), this.originalModel = a.originalModel || this.model, 
            this.token = a.token, this.$scope.hideHeader = a.hideHeader, this.$scope.lang = b, 
            this.$scope.displayName = this.board.name, this.$scope.contentCount = this.board.id && this.model.getFiles().length + this.model.getFolders().length, 
            this.$scope.disableAction = 0 === this.board.getFolders().length && 0 === this.board.getFiles().length, 
            this.$scope.isMobile = !!MX.env.isAndroid, this.$scope.logoHref = MX.env.isMobile ? c.config.global.appstore_url : "http://www.moxtra.com", 
            this.viewState = {
                action: "default",
                sequences: [],
                folder: "",
                pageGroup: ""
            };
            var d = c.request.get("params.action"), e = c.request.get("params.state");
            if ("save" === d) {
                this.preproccess = !0;
                try {
                    e = JSON.parse(e), _.extend(this.viewState, e);
                } catch (f) {
                    console.error(f);
                }
                c.request.sequence("", !1);
            }
        },
        rendered: function() {
            var a = this.board.toJSON(), b = this;
            if (!a.id) return void this._showError();
            this.collection = this.model.getFiles(), this.folders = this.model.getFolders();
            var d = this.collection.length + this.folders.length;
            if (!d) return void this._showEmpty();
            var e = c.request.sequence();
            if (this.pagesView = new l({
                isPublic: !0,
                token: this.token,
                board: this.model,
                syncModel: !0,
                renderTo: ".mx-public-view-content",
                parent: this
            }), this.listenTo(this.pagesView, "showPageGroup", function(a) {
                b._setViewState("pageGroup", a.pages, a.pageGroup);
            }), this.listenTo(this.pagesView, "hidePageGroup", function() {
                b._setViewState();
            }), this.recovery(this.pagesView), e ? this.viewPage(e) : 1 === this.board.files.length && this.board.folders.length < 1 && this.viewPage(this.board.files[0].client_uuid), 
            this.preproccess && !MX.env.isMobile) {
                switch (this.viewState.action) {
                  case "default":
                    break;

                  case "viewer":
                    this.viewPage(this.viewState.sequences[0]);
                    break;

                  case "pageGroup":
                    this.$('li.page-group a[data-param="' + this.viewState.pageGroup + '"]').click();
                    break;

                  case "file":                }
                this.copyAction();
            }
            this._scrollMobile(), MX.env.isMobile && setTimeout(function() {
                $(".spinner").remove();
            }, 3e3);
        },
        viewPage: function(a, b) {
            if (a) {
                var c, e = !1, f = !1;
                _.isString(a) && a.indexOf("-") > 0 && (e = !0, c = a);
                var g, h, i, j = this.board;
                e ? (h = j.getCacheObject(c), i = "BoardFolder" === h.parent.$name ? j.getFiles(h.parent.sequence) : j.getFiles(), 
                a = h.pages.length ? h.pages[0].sequence : h.client_uuid) : (g = j.pages.get(a), 
                g && (c = g.page_group, h = j.getCacheObject(c), i = "BoardFolder" === h.parent.$name ? j.getFiles(h.parent.sequence) : j.getFiles())), 
                "pageGroup" === this.viewState.action && (f = !0);
                var k = this, l = 0, m = [], o = [];
                this.viewer ? this.viewer.binding(i) : (MX.env.isMobile ? (m = [ "pager", "fullscreen" ], 
                o = [ "close" ]) : (m = [ "pager", "zoom", "thumbnails", "fullscreen" ], o = [ "close" ]), 
                this.viewer = new n({
                    skin: "",
                    plugins: m,
                    commands: o,
                    collection: i,
                    renderTo: ".page-viewer",
                    userRole: d.binder.role.PublicViewer,
                    roleContext: d.roleContext.public,
                    token: this.token
                }), this.listenTo(this.viewer, "close", function() {
                    f ? k._setViewState("pageGroup", [], c) : k._setViewState();
                })), this.viewer.open(a, b), this.viewer.model && (l = this.viewer.model.get("sequence") || 0), 
                a === l && this._setViewState("viewer", [ l ], c);
            }
        },
        downloadAction: function() {
            var a = this, b = a.board, c = this.viewState.action, d = (this.viewState.sequences[0], 
            this.viewState.pageGroup);
            switch (c) {
              case "default":
                var e = a.model.folders && a.model.folders.length, f = a.model.files && a.model.files.length;
                0 === e && 1 === f ? j.downloadResources(b, [ a.model.files[0].client_uuid ], a.token) : j.downloadBinder(b.id, a.token);
                break;

              case "viewer":
                var g = this.viewer.model, h = g.file || g.parent;
                h && "BoardFile" === h.$name && !h.isVirtual && h.original ? j.downloadResources(b, [ h.client_uuid ], a.token) : j.downloadBinder(b.id, a.token);
                break;

              case "pageGroup":
                j.downloadResources(b, [ d ], a.token);
            }
        },
        copyAction: function() {
            var a, d = h.genDialog({
                title: b.loading
            }), e = this, f = this, g = f.board, i = MX.get("view_tokens.0.token", g), k = f.originalModel, l = this.viewState.action, m = this.viewState.sequences[0], n = this.viewState.pageGroup, o = {
                token: i,
                title: b.save_to,
                btnText: b.save
            };
            Moxtra.verifyToken().success(function() {
                if (d.close(), 1 === g.pages.length && g.pages[0].isVirtual) return void f._copyFile(k, [ m ]);
                switch (l) {
                  case "default":
                    var b, c = [], h = g.getFiles();
                    _.each(h, function(a) {
                        c.push(a.client_uuid);
                    }), h && h[0] && (b = g.getCacheObject(h[0].parent.sequence)), j.copyFilesTo(c, k, b, o);
                    break;

                  case "viewer":
                    var p = g.getCacheObject(m);
                    p && "BoardFile" === p.$name && !p.isVirtual && p.original ? j.copyFilesTo([ m ], k, p.parent, o) : j.copyPageTo(k, [ m ], f.token);
                    break;

                  case "pageGroup":
                    e.pagesView && (a = e.pagesView.getGroupInfos());
                    var q, r = [];
                    MX.each(a, function(a) {
                        return a.client_uuid === n ? (q = a, !1) : void 0;
                    }), q && (p = g.getCacheObject(q.client_uuid), _.each(p.pages, function(a) {
                        r.push(a.sequence);
                    })), j.copyPageTo(k, r, i);
                }
            }).error(function() {
                d.close(), c.request.navigate("login", null, null, {
                    backUrl: "#view/" + i + "?action=save&state=" + JSON.stringify(e.viewState)
                });
            });
        },
        showBinder: function(a) {
            c.navigate("/binder/" + a, !0);
        },
        _copyFile: function(a, c) {
            var d = this;
            return new MX.ui.Dialog({
                content: new MX.ui.folderSelector({
                    title: b.save_to,
                    buttons: [ {
                        text: b.save,
                        position: "right",
                        className: "btn-primary",
                        click: "copyPageToBinder"
                    } ],
                    newBinder: function() {
                        var a = this;
                        this.dialog.push(new m({
                            onCreatedBinder: function(b) {
                                var c = Moxtra.getBoard(b);
                                a.copyResourceTo(c);
                            }
                        }));
                    },
                    copyPageToBinder: function() {
                        var a = this.value();
                        this.copyResourceTo(a);
                    },
                    copyResourceTo: function(a) {
                        d.board.copyResources(c, a, d.board).success(function() {
                            MX.ui.notifySuccess(b.binder_copy_page_success);
                        }).error(function() {
                            MX.ui.notifyError(b.binder_copy_page_fail);
                        }), this.dialog.close();
                    }
                })
            });
        },
        _showError: function() {
            this.$(".mx-public-view-content").html($(p({
                lang: b
            }))), this._scrollMobile();
        },
        _showEmpty: function() {
            this.$(".mx-public-view-content").html($(o({
                lang: b
            }))), this._scrollMobile();
        },
        _scrollMobile: function() {
            MX.env.isMobile && setTimeout(function() {
                document.body.style.height = window.outerHeight + 100 + "px", setTimeout(function() {
                    window.top.scrollTo(0, 1);
                }, 0);
            }, 400);
        },
        _setViewState: function(a, b, c) {
            this.viewState = a ? {
                action: a,
                sequences: b || [],
                pageGroup: c || ""
            } : {
                action: "default",
                sequences: [],
                pageGroup: ""
            };
        },
        _calcSize: function(a) {
            var b = parseInt(a);
            return b > -1 && 1024 > b ? b + " B" : b >= 1024 && 1048576 > b ? Math.round(Math.floor(b / 1024 * 1e3) / 100) / 10 + " KB" : b >= 1048576 && 1073741824 > b ? Math.round(Math.floor(b / 1048576 * 1e3) / 100) / 10 + " MB" : b >= 1073741824 ? Math.round(Math.floor(b / 1073741824 * 1e3) / 100) / 10 + " GB" : "";
        }
    });
}), define("binder/publicViewModel", [ "moxtra", "lang", "app", "const" ], function(a, b, c, d) {
    "use strict";
    return a.Model.extend({
        idAttribute: "boardId",
        defaults: {
            boardId: "",
            name: "",
            displayName: "",
            isPages: !0,
            page_groups: [],
            pageSequences: [],
            folders: [],
            token: "",
            pages: []
        },
        setData: function(a, b) {
            var c = [];
            if (this.set({
                boardId: a.id,
                name: a.name,
                token: b,
                page_groups: a.page_groups,
                folders: a.folders
            }), a.pages.length || a.folders.length) ; else if (a.resources && MX.each(a.resources, function(a) {
                a.status && c.push(a);
            }), c.length) {
                var e = c[0];
                "BOARD_RESOURCE_SESSION_AS_VIDEO" === e.type ? (this.set({
                    pages: [ {
                        page_type: d.binder.pageType.note,
                        sequence: e.sequence,
                        vector: "",
                        name: e.name,
                        width: e.width || 0,
                        height: e.height || 0
                    } ]
                }), this.set({
                    pageSequences: [ e.sequence ],
                    copyAsResource: !0
                })) : this.set({
                    isPages: !1,
                    files: c
                });
            }
            c.length && this.set({
                displayName: c[0].name
            });
        }
    });
}), define("binder/publicView", [ "moxtra", "lang", "app", "text!template/binder/publicView.html", "binder/publicViewPages", "binder/binderBiz", "binder/publicViewModel" ], function(a, b, c, d, e) {
    var f = MX.logger("publicView");
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.container && this.container.removeClass("mx-layout-three"), this.hideHeader = a && a.hideHeader, 
            c.isIntegrationEnabled() && (this.hideHeader = !0);
        },
        rendered: function() {
            var a = c.request.page(), b = this;
            if (a) {
                this.$el.loading();
                {
                    Moxtra.verifyInvitationToken(a).success(function(c) {
                        b._success(c, a);
                    }).error(function(a) {
                        b._error(a);
                    }).complete(function() {
                        b.$el.loading(!1);
                    });
                }
            } else c.navigate(Moxtra.getMe().id ? "/timeline" : "/login");
            this.recovery(function() {
                b.resetDefine();
            });
        },
        _success: function(b, d) {
            this.model = b, this.originalModel = new Moxtra.model.Board(b.toJSON());
            var f = this.model.get("boardId"), g = this, h = b.view_tokens[0];
            if (!h.page_groups && h.folders) {
                var i = h.folders;
                if (1 === i.length) for (var j = i[0], k = this.model.folders[0]; j.folders || j.files; ) {
                    if (j.files || j.folders.length > 1) {
                        this.model._folders = k.folders, this.model._page_groups = k.files;
                        break;
                    }
                    j = j.folders[0], this.model._folders = k.folders, k = k.folders[0];
                }
            }
            this.getFnClone = c.request.get, c.request.get = function(b) {
                return "page" === b ? f : a.Model.prototype.get.call(this, b);
            }, g.recovery(new e({
                model: g.model,
                originalModel: this.originalModel,
                token: d,
                renderTo: "#mxPublicView",
                hideHeader: g.hideHeader
            }));
        },
        _error: function() {
            this.recovery(new e({
                renderTo: "#mxPublicView"
            }));
        },
        resetDefine: function() {
            f.log("resetDefine"), this.getFnClone && (c.request.get = this.getFnClone);
        },
        goHome: function() {
            c.navigate("/timeline");
        }
    });
}), define("binder/viewer", [ "moxtra", "lang", "app", "viewer/viewer", "binder/binderPageCollection" ], function(a, b, c, d, e) {
    return a.Controller.extend({
        tagName: "div",
        rendered: function() {
            var a = new e(), b = new d({
                collection: a,
                renderTo: this.el
            }), f = c.request.sequence();
            a.on("reset", function() {
                b.open(f);
            }), a.subscribe(c.request.page()), this.recovery(a), this.recovery(b);
        }
    });
}), define("binder/chat/feedItem", [ "moxtra", "lang", "text!template/user/avatarView.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.listenTo(this.model, "change", this.updateView);
        }
    });
}), define("binder/chat/feedMedia", [ "moxtra", "lang", "text!template/chat/feedVideoView.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.listenTo(this.model, "change", this.updateView);
        }
    });
}), define("text!template/group/admin.html", [], function() {
    return '<div class="page-body" >\n    <div id="mxPageBody_Col_1">\n        <div class="mx-settings mx-list">\n            <ul class="mx-sub-nav">\n                <li id="user"><a class="mouse-hand" data-action="setCurrSubView" data-param="user">{{lang.user_management}}</a></li>\n\n\n                <li id="report" class=""><a class="mouse-hand" data-action="setCurrSubView" data-param="report">{{lang.usage_report}}</a></li>\n\n\n                <li id="settings" class="hide"><a class="mouse-hand"  data-action="setCurrSubView" data-param="settings">{{lang.sso_form_title}}</a></li>\n\n                {{!--\n                <li id="salesforce" class="hide"><a class="mouse-hand"  data-action="setCurrSubView" data-param="salesforce">{{lang.salesforce_integration}}</a></li>\n\n                <li id="billing" class="hide"><a href="javascript:;" data-action="setCurrSubView" data-param="billing">{{lang.billing}}</a></li>\n                --}}\n\n                <li id="branding" class="hide"><a href="javascript:;" data-action="setCurrSubView" data-param="branding">{{lang.branding}}</a></li>\n\n                {{!--\n                <li id="configuration" class="hide"><a href="javascript:;" data-action="setCurrSubView" data-param="configuration">{{lang.configuration}}</a></li>\n                --}}\n            </ul>\n        </div>\n    </div>\n    <div id="mxPageBody_Col_2">\n        {{lang.loading}}\n    </div>\n</div>\n';
}), define("text!template/group/memberListHeader.html", [], function() {
    return '<div class="members-header">\n	<div class="section">\n		<span><strong>{{group.name}}</strong></span>\n	</div>\n	<div class="section">\n		{{#if isDebug}}\n			<span class="pull-left marginRight10">Your Plan: <strong>{{group.plan.name}} - {{group.plan.billingCycle}}</strong></span>\n			{{#if group.showChange}}\n			<span class="pull-left"><a class="mouse-hand title" data-action="changePlan">{{lang.change}}</a></span>\n			{{/if}}\n			{{#if group.showUpgrade}}\n			<span class="pull-left"><a class="mouse-hand title" data-action="purchase">{{lang.buy}}</a></span>\n			{{/if}}\n		{{/if}}\n	</div>\n	<div class="section">\n		<ul class="total-users">\n			<li>{{lang.total_users}}: <strong>{{group.totalUsers}}</strong></li>\n			{{#if group.activeUsers}}\n			<li>{{lang.active_users}}: <strong>{{group.activeUsers}}</strong></li>\n			{{/if}}\n			{{#if group.inactiveUsers}}\n			<li>{{lang.inactive_users}}: <strong>{{group.inactiveUsers}}</strong></li>\n			{{/if}}\n			{{#if group.pendingUsers}}\n			<li>{{lang.pending_users}}: <strong>{{group.pendingUsers}}</strong></li>\n			{{/if}}\n		</ul>\n	</div>\n</div>\n';
}), define("text!template/group/memberList.html", [], function() {
    return '<div class="admin-user user-management">\n    <div class="admin-header">\n        <!-- <table>\n            <tr class="title">\n                <td width="200"> {{lang.active_licenses}}</td>\n                <td> {{lang.settings_account_type}}</td>\n            </tr>\n            <tr>\n                <td id="Licenses"></td>\n                <td id="accountType"></td>\n            </tr>\n        </table> -->\n    </div>\n\n    <div class="admin-body">\n        <div class="pull-left search-panel">\n\n        <form class="form-inline search-form" role="form" autocomplete="false" onsubmit="return false;">\n            <div class="btn-group pull-right hide" id="pager" role="group">\n                <a class="btn btn-default" id="prev" data-action="prevPage">{{lang.prev_page}}</a>\n                <a class="btn btn-default" id="next" data-action="nextPage">{{lang.next_page}}</a>\n            </div>\n\n            <a class="btn btn-primary {{#unless email_verified}}hide{{/unless}} js-verified-action" id="createGroupUser" data-action="createGroupUser" href="javascript:;">{{lang.add_user}}</a>\n\n            <div class="form-group form-with-icon input-with-search">\n                <i class="micon-search icon-control" style="top:2px;"></i>\n                <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                    <span>×</span>\n                </button>\n                <input type="text" id="usersearch_key" class="form-control" placeholder="{{lang.search}}"/>\n            </div>\n\n            <a class="btn btn-link {{#unless email_verified}}hide{{/unless}} js-verified-action" id="importGroupUser" data-action="importGroupUser" href="javascript:;">{{lang.csv_import}}</a>\n            <a class="btn-link show-helper {{#unless email_verified}}hide{{/unless}}" href="javascript:;" data-action="showHelp"> <i class="micon-help-with-circle size14"/></a>\n\n        </form>\n        <div class="div-table-header paddingTop5 clearfix">\n            <ul class="mx-list"><li>\n            <div class="col-md-5">\n                <strong>{{lang.name}}</strong>\n            </div>\n            <div class="col-md-1">\n\n            </div>\n            <div class="col-md-3">\n                <strong>{{lang.user_role}}</strong>\n            </div>\n            <div class="col-md-3">\n                <strong>{{lang.user_status}}</strong>\n            </div>\n                </li>\n            </ul>\n        </div>\n        </div>\n        <div class="div-table">\n\n        <div class="mx-container mx-box">\n            <div class="mx-member-list bottom-line">\n\n            </div>\n        </div>\n        </div>\n    </div>\n\n</div>\n';
}), define("text!template/group/memberItem.html", [], function() {
    return ' <li class="mx-item" data-action="editGroupMember" data-param="{{sequence}}" >\n    <div class="row" >\n      <div class="col-md-1">\n          {{avatarView this}}\n      </div>\n        <div class="mx-user-info col-md-5" >\n            <div class="user-name"> {{user.name}}</div>\n            <div class="user-email">{{user.email}}</div>\n            <div class="user-phone">{{#if division}}\n                {{division}}{{#if department}} - {{department}}{{/if}}\n            {{else}}\n                {{#if department}}\n                    {{department}}\n                {{else}}\n                    {{user.phone}}\n                {{/if}}\n            {{/if}}\n                </div>\n        </div>\n        <div class="col-md-3">\n            {{roleName}}\n        </div>\n        <div class="col-md-3">\n            {{statusText}}\n\n            <a class="btn btn-link pull-right mx-circle">\n                {{lang.edit}}\n            </a>\n\n        </div>\n\n    </div>\n</li>\n';
}), define("text!template/group/createGroupUser.html", [], function() {
    return '<div>\n    <form role="form" id="createGroupUserForm">\n        <div class="form-group">\n            {{#unless sequence}} <label for="username">{{lang.first_name}}</label>{{/unless}}\n            <input type="text" {{#unless canUpdate}}readonly{{/unless}} class="form-control" autofocus data-error-style="inline" name="user.first_name" id="username" placeholder="{{lang.first_name}}">\n        </div>\n        <div class="form-group">\n            {{#unless sequence}}  <label for="lastname">{{lang.last_name}}</label>{{/unless}}\n            <input type="text" {{#unless canUpdate}}readonly{{/unless}} class="form-control"  data-error-style="inline" name="user.last_name" id="lastname" placeholder="{{lang.last_name}}">\n        </div>\n        <div class="form-group">\n            {{#unless sequence}}   <label for="email">{{lang.email}}</label>{{/unless}}\n            <input type="text" {{#if sequence}}readonly{{/if}} class="form-control"  data-error-style="inline" name="user.email" id="email" placeholder="{{lang.email}}">\n        </div>\n\n        {{!-- remove division and department to avoid confusion to major small business administrators\n            but for backward compatible, we still keep for edit user if there is division/department 8/27/2015 --}}\n\n        {{!-- previous logic caused confusion to some partner admins, so we decided to competely hide division and department\n            unless admin added ?type=admin&show_more=1 parameters 9/14/2015 --}}\n\n        {{#if showMore}}\n        <div class="form-group">\n            {{#unless sequence}}<label for="division">{{lang.division}}</label>{{/unless}}\n            <input name="division" id="division" type="text" class="form-control" placeholder="{{lang.division}}" />\n        </div>\n        <div class="form-group">\n            {{#unless sequence}}<label for="department">{{lang.department}}</label>{{/unless}}\n            <input name="department" id="department" type="text" class="form-control" placeholder="{{lang.department}}" />\n        </div>\n        {{/if}}\n\n        <div class="checkbox form-group">\n            <label>\n                <input type="checkbox" {{#unless canUpdate}}disabled="disabled"{{/unless}} name="type" value="GROUP_ADMIN_ACCESS"> {{lang.administrator}}\n            </label>\n        </div>\n\n        {{#if plan.price}}\n        <div class="form-group">\n        	{{lang.note}}: {{plan.price}}\n        </div>\n        {{/if}}\n\n        {{#if canUpdate}}\n        {{#if sequence}}\n        <div class="form-group"><button type="submit" class="btn btn-primary" >{{lang.update}}</button></div>\n        {{/if}}\n        {{/if}}\n    </form>\n</div>\n';
}), define("group/groupUserModel", [ "moxtra", "lang", "const", "user/userModel" ], function(a, b, c, d) {
    var e = (MX.logger("groupUserModel"), c.group.userRole), f = d.extend({
        idAttribute: "sequence",
        defaults: {
            roleName: "",
            statusText: "",
            isOwner: !1,
            canUpdate: !0,
            isPending: !1
        },
        parse: function(a, f) {
            var g = d.prototype.parse(a, f);
            switch (g.status == c.group.userStatus.invited ? (g.statusText = b.pending, g.isPending = !0) : a.user.disabled ? (g.canUpdate = !1, 
            g.statusText = b.disabled) : (g.isActive = !0, g.statusText = b.active), g.type) {
              case e.member:
                g.roleName = b.member;
                break;

              case e.admin:
                g.roleName = b.group_admin;
                break;

              case e.owner:
                g.roleName = b.group_owner, g.isOwner = !0;
            }
            return g;
        }
    });
    return _.extend(f.prototype.defaults, d.prototype.defaults), f;
}), define("buy/helper", [ "moxtra", "lang" ], function(a, b) {
    var c = {
        std_monthly: Moxtra.const.STANDARD_MONTHLY,
        std_annual: Moxtra.const.STANDARD_ANNUAL,
        pro_monthly: Moxtra.const.PRO_MONTHLY,
        pro_annual: Moxtra.const.PRO_ANNUAL
    }, d = {}, e = "{0} - {1}";
    d[Moxtra.const.STANDARD_MONTHLY] = {
        title: MX.format(e, b.buy, b.standard),
        name: b.standard,
        price: "",
        billingCycle: b.billed_monthly
    }, d[Moxtra.const.STANDARD_ANNUAL] = {
        title: MX.format(e, b.buy, b.standard),
        name: b.standard,
        price: "",
        billingCycle: b.billed_annual
    }, d[Moxtra.const.PRO_MONTHLY] = {
        title: MX.format(e, b.buy, b.pro),
        name: b.pro,
        price: "",
        billingCycle: b.billed_monthly
    }, d[Moxtra.const.PRO_ANNUAL] = {
        title: MX.format(e, b.buy, b.pro),
        name: b.pro,
        price: "",
        billingCycle: b.billed_annual
    };
    var f = {};
    f[Moxtra.const.STANDARD_MONTHLY] = 1, f[Moxtra.const.STANDARD_ANNUAL] = 1, f[Moxtra.const.PRO_MONTHLY] = 2, 
    f[Moxtra.const.PRO_ANNUAL] = 2;
    var g = {}, h = {
        usd: "$"
    }, i = {
        month: b.per_month,
        year: b.per_year
    };
    return {
        getPrices: function() {
            return g;
        },
        setPrices: function(a) {
            var b = MX.get("data", a) || [], e = _.invert(c), f = 0;
            MX.each(b, function(a) {
                g[a.id] = a.amount / 100;
                var b = MX.format("{0}{1} {2}", h[a.currency], a.amount / 100, i[a.interval]);
                e[a.id] && (g[e[a.id]] = b), d[a.id] && (d[a.id].price = b, f++);
            }), f && (g.length = f);
        },
        planDefines: function() {
            return c;
        },
        planValid: function(a) {
            return !!d[a];
        },
        planDetail: function(a) {
            return d[a] || {};
        },
        planTitle: function(a) {
            return d[a].title;
        },
        checkGrade: function(a, b) {
            return f[b] - f[a];
        }
    };
}), define("group/createGroupUser", [ "moxtra", "lang", "app", "text!template/group/createGroupUser.html", "group/groupUserModel", "group/groupBiz", "buy/helper" ], function(a, b, c, d, e, f, g) {
    MX.logger("createGroupUser");
    return a.Controller.extend({
        template: d,
        title: b.add_user,
        handleAction: !0,
        buttons: [ {
            text: b.add,
            className: "btn-primary",
            click: "onClickCreate",
            disable: !0
        } ],
        init: function(a) {
            if (a.showPlan) {
                var d = MX.get("plan_code", Moxtra.getMyGroup());
                this.$scope.plan = g.planDetail(d);
            }
            this.$scope.lang = b, this.$scope.canUpdate = !0, "admin" === c.integration.get("type") && (this.$scope.showMore = "1" === c.integration.get("show_more")), 
            this.model = new Moxtra.model.GroupMember(), this.model.user = new Moxtra.model.Contact(), 
            _.extend(this, a);
        },
        rendered: function() {
            var b = this;
            b.form = new a.Form({
                parent: b,
                form: b.$("#createGroupUserForm"),
                model: b.model,
                submit: b.submit,
                scope: b
            });
        },
        onClickCreate: function() {
            this.model.isValid(!0) && this.submit();
        },
        submit: function() {
            var a = this, c = MX.filter(a.groupUsers, function(b) {
                return b.user && b.user.email.toLowerCase() === a.model.user.email.toLowerCase();
            });
            if (c) return c.length && (c = c[0]), void MX.ui.Alert(b.invite_user_existing_member);
            a.$el.loading();
            var d = Moxtra.getMyGroup();
            a.model.user.email = a.model.user.email.toLowerCase(), d.addUser(this.model.user, this.model.division, this.model.department, this.model.type).success(function(b) {
                if (a.$el.loading(!1), a.onCreated) {
                    var c = a.model;
                    a.onCreated(b.object.group.id, c);
                }
            }).error(function() {
                MX.ui.notifyError(b.invite_user_failed), a.$el.loading(!1);
            });
        }
    });
}), define("text!template/help/csvimport.html", [], function() {
    return '<ul>\n<li><strong>{{lang.to_add_users_in_bulk}}:</strong></li>\n<li>(1) {{lang.csv_file_note_1}}</li>\n<li>(2) {{lang.csv_file_note_2}}</li>\n<li>(3) {{lang.csv_file_note_3}}</li>\n<li>(4) {{lang.csv_file_note_4}}</li>\n<li>\n<p>\n<p><strong>{{lang.sample_csv_format}}:</strong></p>\n</li>\n<li>FullName,LastName,FirstName,Email,Admin,Division,Department</li>\n<li>John Doe,Doe,John,john@sample.com,TRUE,AJP,Sales</li>\n<li>Bob Cat,Cat,Bob,bob@sample.com,FALSE,European,Marketing</li>\n</ul>\n<p></p>\n<p><a href="./sample.csv" download>{{lang.donwload_sample_csv_file}}</a></p>';
}), define("text!template/group/editGroupUser.html", [], function() {
    return '<div class="admin-user detail">\n    <div class="admin-header">\n        <a class="btn btn-link pull-right mx-circle" data-action="exitEdit" >\n            {{lang.close}}\n        </a>\n        {{avatarView this}}\n        <span class="user-name">{{user.name}}</span>\n\n    </div>\n    <div class="admin-body">\n       <div class="mx-box mx-container">\n           {{#unless isOwner}}\n           <div class="row detail-info">\n               <div class="col-md-5">\n                   {{editGroupUserView this}}\n               </div>\n               <div class="col-md-5 col-md-offset-1">\n                   <ul class="bottom-line">\n                       {{#if isPending}}\n\n                       <li>\n                           <a class="btn btn-link" data-action="resendInvitation" data-param="{{sequence}}">{{lang.resend_invitation}}</a>\n                       </li>\n\n                       {{else}}\n                          <li>\n                               <a class="btn btn-link" data-action="changeEmail" data-param="{{sequence}}">{{lang.change_user_email}}</a>\n                          </li>\n                          <li>\n                            <a class="btn btn-link tooltips" data-toggle="tooltip" data-placement="top" title="{{lang.remove_user_tip}}" data-action="removeUserFromGroup" data-param="{{sequence}}">{{lang.remove_user}}\n                            </a>\n                          </li>\n                           {{#if isActive}}\n                           <li>\n                               <a class="btn btn-link tooltips"  data-toggle="tooltip" data-placement="top" title="{{lang.deactivate_user_tip}}" data-action="deactivateUser" data-param="{{sequence}}">{{lang.deactivate_user}}\n                            </a>\n                           </li>\n                           {{else}}\n                           <li>\n                               <a class="btn btn-link tooltips" data-toggle="tooltip" data-placement="top" title="{{lang.activate_user_tip}}" data-action="activateUser" data-param="{{sequence}}">{{lang.activate_user}}\n\n                               </a>\n                           </li>\n                           {{/if}}\n\n                       {{/if}}\n                       <li>\n                          <a class="btn btn-link tooltips" data-toggle="tooltip" data-placement="top" title="{{lang.delete_user_tip}}"  data-action="deleteUser" data-param="{{sequence}}">{{lang.delete_user}}\n\n                          </a>\n                      </li>\n\n                   </ul>\n               </div>\n           </div>\n           {{/unless}}\n\n           {{#unless isPending}}\n           <div class="row binder-list">\n                   <div class="panel panel-default">\n                       <div class="panel-heading">\n                           <h4 class="panel-title">\n                               <a data-toggle="collapse" data-action="triggerScroll" data-parent="#accordion" href="#ownedBinders">\n                                   <i class="micon-arrow-right"></i><span id="ownedCount"></span>\n                               </a>\n                           </h4>\n                       </div>\n                       <div id="ownedBinders" class="panel-collapse collapse in">\n                           <div class="panel-body">\n                               <form class="form-inline" role="form" onsubmit="return false" style="margin-top: 2px">\n                                   <div class="form-group">\n                                       <i class="micon-search icon-control"></i>\n                                       <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                                           <span>×</span>\n                                       </button>\n                                       <input type="text" class="form-control input-sm search-input" name="ownedList" placeholder="{{lang.search}}">\n                                   </div>\n                                    <div class="pull-right">\n                                       <button type="button" id="transfer" data-action="transferBinders" class="btn btn-link">{{lang.transfer_all}}</button>\n                                    </div>\n                               </form>\n                           </div>\n                       </div>\n                   </div>\n                   <div class="panel panel-default">\n                       <div class="panel-heading">\n                           <h4 class="panel-title">\n                               <a data-toggle="collapse" data-action="triggerScroll" data-parent="#accordion" href="#sharedBinders" class="collapsed">\n                                   <i class="micon-arrow-right"></i><span id="sharedCount"></span>\n                               </a>\n                           </h4>\n                       </div>\n                       <div id="sharedBinders" class="panel-collapse collapse">\n                           <div class="panel-body">\n                               <form class="form-inline" onsubmit="return false" role="form" style="margin-top: 2px">\n                                   <div class="form-group">\n                                       <i class="micon-search icon-control"></i>\n                                       <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                                           <span>×</span>\n                                       </button>\n                                       <input type="text" class="form-control input-sm search-input" name="sharedList" placeholder="{{lang.search}}">\n                                   </div>\n\n                               </form>\n                           </div>\n                       </div>\n                   </div>\n\n           </div>\n       </div>\n        {{/unless}}\n\n    </div>\n</div>\n';
}), define("text!template/component/binderItem.html", [], function() {
    return '\n    <div class="mx-item row" >\n        <div class="col-md-1">\n            {{binderCover this.board}}\n        </div>\n        <div class="col-md-8">\n            <div class="marginTop15 ellipsis">{{board.name}}</div>\n        </div>\n        <div class="col-md-3">\n        {{#if isShared}}\n            <div class="ellipsis marginTop15">\n                {{lang.binder_owner}}:{{board.owner.name}}\n            </div>\n        {{else}}\n            <input type="checkbox" value="{{board.id}}" data-action="selectBinder" class="pull-right"  name="binderSelector">\n            {{/if}}\n        </div>\n    </div>\n';
}), define("group/editGroupUser", [ "moxtra", "lang", "text!template/group/editGroupUser.html", "app", "group/groupBiz", "binder/binderCollection", "const", "text!template/component/binderItem.html", "user/userModel", "component/selector/userSelector", "component/dialog/inputDialog", "group/groupUserModel" ], function(a, b, c, d, e, f, g, h, i, j, k, l) {
    "use strict";
    var m = MX.logger("editGroupUser");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        events: {
            "keyup .search-input": "searchBinder"
        },
        init: function(a) {
            if (this.$scope.lang = b, _.extend(this.$scope, a.model.toJSON()), this.model = a.model, 
            this.listenTo(this.model, "change:disabled", this.updateView), this.model.user) {
                var c = this;
                this.listenTo(this.model.user, "change", function() {
                    c.$(".user-name").text(c.model.user.name), c.$("#email").val(c.model.user.email);
                });
            }
            this.ownedBinders = new Moxtra.Collection({
                model: "Moxtra.model.UserBoard",
                attributeId: "board.id",
                index: "sequence",
                removedFlag: [ "board.is_deleted", "is_deleted" ],
                unique: !0
            }), this.sharedBinders = new Moxtra.Collection({
                model: "Moxtra.model.UserBoard",
                attributeId: "board.id",
                index: "sequence",
                removedFlag: [ "board.is_deleted", "is_deleted" ],
                unique: !0
            }), a.model.status !== g.group.userStatus.invited && this.updateBinders(), "admin" === d.integration.get("type") && (this.$scope.showMore = "1" === d.integration.get("show_more"));
        },
        removeSearchKey: function() {
            var a = this.handleEvent;
            a.preventDefault();
            var b = $(a.target).closest(".form-group").find("input");
            b.val("").trigger("keyup");
        },
        searchBinder: function(a) {
            var b = $(a.currentTarget), c = b.attr("name"), d = b.val().toLowerCase(), e = this[c], f = b.parent().find(".input-close");
            d.length > 0 ? (f.removeClass("hide"), e.filter(function(a) {
                var b = a.board.name.toLowerCase();
                return b.indexOf(d) > -1 ? !0 : !1;
            })) : (e.filter(), f.addClass("hide"));
        },
        updateBinders: function() {
            var a = this;
            this.model.loadUserBoards().success(function(b) {
                var c = g.binder.role.Owner;
                b && b.length && b.each(function(b) {
                    b.type === c ? a.ownedBinders.push(b) : a.sharedBinders.push(b);
                }), a.updateBindersInfo();
            }).error(function() {});
        },
        updateView: function() {
            var a = this.renderView();
            this.$el.replaceWith(a);
        },
        exitEdit: function() {
            this.destroy(), d.request.sequence("");
        },
        updateUser: function() {
            var a = this;
            if (this.$el.loading(), this.model.isValid(!0)) {
                var c = MX.get("user.first_name", a.model) + " " + MX.get("user.last_name", a.model);
                a.model.user.set("name", c), a.model.update().success(function() {
                    MX.ui.notifySuccess(b.update_user_success), a.model.set("displayName", c), a.$el.loading(!1);
                }).error(function() {
                    MX.ui.notifyError(b.update_user_failed), a.$el.loading(!1);
                });
            }
        },
        deleteUser: function(a) {
            if (this.ownedBinders.length > 0) return void MX.ui.Alert(b.admin_msg_removeuser_warning);
            var c = this;
            MX.ui.Confirm(b.confirm_delete_user, function() {
                c.$el.loading(), e.deleteUser(a).success(function() {
                    MX.ui.notifySuccess(b.delete_user_success), c.collection.remove(c.model), c.exitEdit(), 
                    c.$el.loading(!1);
                }).error(function() {
                    MX.ui.notifyError(b.delete_user_failed), c.$el.loading(!1);
                });
            });
        },
        removeUserFromGroup: function() {
            var a = MX.format(b.confirm_remove_user, MX.escapeHTML(this.model.user.name)), c = this;
            MX.ui.Confirm(a, function() {
                c.$el.loading();
                var a = Moxtra.getMyGroup();
                a.removeGroupUser(c.model).success(function() {
                    MX.ui.notifySuccess(b.remove_user_success), c.exitEdit(), c.$el.loading(!1);
                }).error(function() {
                    MX.ui.notifyError(b.remove_user_failed), c.$el.loading(!1);
                });
            });
        },
        activateUser: function(a) {
            var c = this, d = this.handleEvent.currentTarget;
            c.$el.loading(), e.activateUser(a).success(function() {
                MX.ui.notifySuccess(b.activate_user_success), c.$el.loading(!1), $(d).text(b.deactivate).data("action", "deactivateUser").attr({
                    title: b.deactivate_user_tip,
                    "data-original-title": b.deactivate_user_tip
                });
                var a = l.prototype.parse({
                    user: {
                        disabled: !1
                    }
                });
                c.model.set("statusText", a.statusText), c.model.set("isActive", a.isActive);
            }).error(function() {
                MX.ui.notifyError(b.activate_user_failed), c.$el.loading(!1);
            });
        },
        deactivateUser: function(a) {
            var c = this, d = this.handleEvent.currentTarget;
            c.$el.loading(), e.deactivateUser(a).success(function() {
                MX.ui.notifySuccess(b.deactivate_user_success), c.$el.loading(!1), $(d).text(b.activate).data("action", "activateUser").attr({
                    title: b.activate_user_tip,
                    "data-original-title": b.activate_user_tip
                });
                var a = l.prototype.parse({
                    user: {
                        disabled: !0
                    }
                });
                c.model.set("statusText", a.statusText), c.model.set("isActive", a.isActive);
            }).error(function() {
                MX.ui.notifyError(b.deactivate_user_failed), c.$el.loading(!1);
            });
        },
        rendered: function() {
            var a = this.updateUser, c = this;
            this.$("#createGroupUserForm").length && this.recovery(new MX.Form({
                parent: this,
                form: this.$("#createGroupUserForm"),
                model: c.model,
                submit: a,
                scope: this
            })), this.model.status !== g.group.userStatus.pending && (this.ownedList = new MX.List({
                parent: this,
                tagName: "div",
                template: h,
                collection: this.ownedBinders,
                renderTo: this.$("#ownedBinders .panel-body "),
                sortable: !1,
                emptyTemplate: b.no_owned_binder,
                lazyload: !1,
                $scope: {
                    lang: b,
                    blankImg: g.defaults.blankImg
                }
            }), this.sharedList = new MX.List({
                parent: this,
                tagName: "div",
                template: h,
                collection: this.sharedBinders,
                renderTo: this.$("#sharedBinders .panel-body "),
                emptyTemplate: b.no_shared_binder,
                sortable: !1,
                lazyload: !1,
                $scope: {
                    isShared: !0,
                    lang: b,
                    blankImg: g.defaults.blankImg
                }
            }), this.adjustUI(), $(window).on("resize.group", function() {
                c.adjustUI();
            }), this.recovery(function() {
                $(window).off("resize.group");
            }), this.$el.find(".tooltips").tooltip());
        },
        updateBindersInfo: function() {
            var a = this.ownedBinders.length;
            this.$("#ownedCount").text(MX.format(b.owned_binders_with_parentheses, a)), 1 > a && this.$("#ownedBinders .panel-body").html('<div class="padding15">' + b.no_owned_binder + "</div>"), 
            a = this.sharedBinders.length, this.$("#sharedCount").text(MX.format(b.shared_binders_with_parentheses, a)), 
            1 > a && this.$("#sharedBinders .panel-body").html('<div class="padding15">' + b.no_shared_binder + "</div>");
            var c = this;
            setTimeout(function() {
                c.ownedBinders.trigger("inited"), c.sharedBinders.trigger("inited");
            }, 1e3);
        },
        adjustUI: function() {
            var a = this.$(".mx-container").height();
            this.$(".panel-body .mx-list").height(a - 340);
        },
        selectBinder: function() {
            var a = this.$("#transfer"), c = this.getSelectedBinders();
            a.text(c.length ? b.transfer : b.transfer_all);
        },
        getSelectedBinders: function() {
            var a = [];
            return this.$el.find('#ownedBinders input[type="checkbox"]').each(function(b, c) {
                var d = $(c);
                d.prop("checked") && a.push(d.val());
            }), a;
        },
        transferBinders: function() {
            var a = this.getSelectedBinders(), b = this;
            a.length || b.ownedBinders.each(function(b) {
                a.push(b.board.id);
            }), 0 !== a.length && b.transferBindersTo(a);
        },
        transferBindersTo: function(a) {
            var c = this.model.get("sequence"), d = this, f = a && a.length;
            return 0 === f ? void m.error("no binder selected when transfer binder.") : void this.recovery(new MX.ui.Dialog({
                content: new j({
                    teamsPanel: !1,
                    groupsPanel: !0,
                    contactsPanel: !1,
                    selectedPanel: !0,
                    supportInputEmail: !1,
                    multiple: !1,
                    filterFn: function(a) {
                        return "GROUP_INVITED" !== a.status;
                    },
                    title: b.transfer_binders_to,
                    buttons: [ {
                        text: b.transfer,
                        position: "right",
                        className: "btn-primary",
                        click: "onSelectDone"
                    } ],
                    onSelectDone: function() {
                        var g, h = [], i = this.completeValues();
                        i.each(function(a) {
                            h.push(a.get("sequence")), g = a.sequence;
                        }), 1 === h.length ? (this.dialog.pop(), MX.ui.Confirm(MX.format(f > 1 ? b.confirm_transfer_binders : b.confirm_transfer_binder, f), function() {
                            e.transferBinders(c, a, g).success(function() {
                                MX.ui.notifySuccess(f > 1 ? b.transfer_binders_success : b.transfer_binder_success), 
                                d.removeOwnedBinders(a), d.selectBinder();
                            }).error(function() {
                                MX.ui.notifyError(f > 1 ? b.transfer_binders_failed : b.transfer_binder_failed);
                            });
                        })) : MX.ui.notifyError(b.please_select_one_user), d.$el.loading(!1);
                    }
                })
            }));
        },
        removeOwnedBinders: function(a) {
            var b = this.ownedBinders;
            MX.each(a, function(a) {
                b.remove(a);
            }), this.updateBindersInfo();
        },
        triggerScroll: function() {
            var a = $(this.handleEvent.currentTarget);
            setTimeout(function() {
                a.closest(".panel-group").find(".mx-list").trigger("scroll");
            }, 100);
        },
        resendInvitation: function() {
            var a = this.model.user;
            a && e.addUser({
                email: a.email,
                first_name: a.firstName,
                last_name: a.lastName,
                type: a.type
            }).success(function() {
                MX.ui.notifySuccess(b.contact_invite_success);
            }).error(function() {
                MX.ui.notifyError(b.contact_invite_failed);
            });
        },
        changeEmail: function() {
            var a = this.model, c = this;
            this.recovery(new MX.ui.Dialog(new k({
                model: c.model,
                title: b.settings_change_email,
                input: {
                    name: "user.email",
                    placeholder: b.settings_please_enter_your_new_email
                },
                buttons: [ {
                    text: b.change,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    var d = this;
                    d.dialog.progress();
                    var e = Moxtra.getMyGroup().members.get(a.sequence);
                    e.updateUserEmail(c.model.user.email).success(function() {
                        MX.ui.notifySuccess(b.change_email_success), d.dialog.progress(!1), d.dialog.close();
                    }).error(function(a) {
                        MX.ui.notifyError(a && a.xhr && 409 === a.xhr.status ? b.change_email_conflict : b.change_email_failed), 
                        d.dialog.progress(!1);
                    });
                }
            })));
        }
    });
}), define("group/user", [ "moxtra", "lang", "app", "text!template/group/memberList.html", "text!template/group/memberItem.html", "group/createGroupUser", "text!template/group/createGroupUser.html", "text!template/help/csvimport.html", "group/editGroupUser", "component/uploader/uploader", "component/templateHelper" ], function(a, b, c, d, e, f, g, h, i, j) {
    "use strict";
    var k = Handlebars.compile(g), l = Handlebars.compile(h);
    Handlebars.registerHelper("editGroupUserView", function(a) {
        var c = k(MX.extend({
            lang: b
        }, a));
        return new Handlebars.SafeString(c);
    });
    var m = c.config.ADMIN_USER_PAGE_SIZE;
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        events: {
            "keyup #usersearch_key": "onKeyUp"
        },
        init: function(a) {
            this.collection = a.collection, this.$scope.lang = b, this.parent = a.parent, this.listenTo(c.request, "change:sequence", this.jumpToDetail), 
            this.$scope.email_verified = Moxtra.getMe().email_verified;
        },
        removeSearchKey: function() {
            var a = this.handleEvent;
            a.preventDefault();
            var b = $(a.target).closest(".form-group").find("input");
            b.val("").trigger("keyup").focus();
        },
        onKeyUp: function(a) {
            a.preventDefault();
            var b = $(a.target).val();
            b = $.trim(b), b.length ? this.$(".input-close").removeClass("hide") : this.$(".input-close").addClass("hide");
            var d = c.integration && c.integration.get("group_id") || "";
            d ? this.gotoPage(-1, b) : this.list.filter(function(a) {
                var c = a.user.name.toLowerCase(), d = a.user.email.toLowerCase(), e = (a.division || "").toLowerCase(), f = (a.department || "").toLowerCase();
                return b.length > 0 ? c.indexOf(b) >= 0 || d.indexOf(b) >= 0 || e.indexOf(b) >= 0 || f.indexOf(b) >= 0 : !0;
            });
        },
        rendered: function() {
            var d = this.$("#importGroupUser"), f = this, g = c.integration && c.integration.get("group_id") || "";
            f.list = new a.List({
                parent: this,
                renderTo: ".mx-member-list",
                template: e,
                collection: this.collection,
                syncModel: !0,
                $scope: {
                    lang: b,
                    blankImg: c.const.defaults.blankImg
                }
            }), this.currentPage = 1, f.recovery(f.list), f.collection && (f.list.binding(f.collection), 
            this.listenTo(this.collection, "all", this.updateLicenses), this.parent.updateLicenses()), 
            g && ($("#pager").removeClass("hide"), this.gotoPage(-1)), MX.env.isIE && $("#usersearch_key").placeholder(), 
            c.on("checkEmailVerifySuccess", function() {
                $(".js-verified-action").removeClass("hide");
            }), this.recovery(function() {
                c.off("checkEmailVerifySuccess");
            });
            var h = c.integration.get("group_id") || Moxtra.getMe().groupId || "";
            j.register("addUserToGroup", {
                browse_button: "importGroupUser",
                filters: {
                    mime_types: [ {
                        title: b.csv_file,
                        extensions: "csv"
                    } ]
                },
                showNotification: !0,
                multi_selection: !1,
                skip_client_uuid: !0,
                url: function() {
                    return h ? "/group/" + h + "/csvimport" : "/group/csvimport";
                },
                success: function() {
                    j.refresh("addUserToGroup", d), setTimeout(function() {
                        MX.ui.notifySuccess(b.import_csv_success);
                    }, 3e3);
                },
                error: function(a) {
                    MX.ui.notifyError(a && 409 === a.status ? b.import_csv_conflict : a && 400 === a.status ? b.import_csv_invalid_format : b.import_csv_failed), 
                    j.refresh("addUserToGroup", d);
                }
            }), setTimeout(function() {
                j.refresh("addUserToGroup", d);
            }, 500), this.recovery(function() {
                j.hide("addUserToGroup");
            });
            var i = c.request.sequence();
            i && this.jumpToDetail();
        },
        createGroupUser: function() {
            var a = this;
            this.recovery(new MX.ui.Dialog({
                content: new f({
                    showPlan: !c.config.global.mx_production,
                    groupUsers: a.collection,
                    onCreated: function(b, c) {
                        this.dialog.close(), a.collection.push(c);
                    }
                })
            }));
        },
        prevPage: function() {
            this.gotoPage(-1);
        },
        nextPage: function() {
            this.gotoPage(1);
        },
        updatePager: function(a, b) {
            1 >= a ? $("#pager").addClass("hide") : $("#pager").removeClass("hide"), $("#prev ,#next").removeClass("disabled"), 
            1 === b && $("#prev").addClass("disabled"), b === a && $("#next").addClass("disabled");
        },
        gotoPage: function(a, b) {
            function c(a) {
                f.collection = a, f.list.binding(a), f.currentPage = d, b || f.parent.updateLicenses(), 
                e = Math.ceil(f.model.total_members / m), f.updatePager(e, d);
            }
            var d, e = Math.ceil(this.model.total_members / m), f = this;
            d = (this.currentPage || 0) + a, d > e && (d = e), 0 >= d && (d = 1), this.updatePager(e, d), 
            b ? this.model.searchMembers(d, b, m).success(c) : this.model.loadMembers(d, m).success(c);
        },
        editGroupMember: function(a) {
            c.request.sequence(a);
        },
        jumpToDetail: function() {
            var a = c.request.sequence();
            if (this.collection) if (a) {
                var b = this.collection.get(a);
                $(this.container).addClass("mx-layout-three"), this.$el.hide(), this.detail = new i({
                    model: b,
                    renderTo: this.container,
                    collection: this.collection
                }), j.hide("addUserToGroup");
            } else {
                $(this.container).removeClass("mx-layout-three"), $(this.container).find(".detail").remove(), 
                this.detail && this.detail.destroy(), this.detail = null, this.$el.show();
                var d = this.$("#importGroupUser");
                j.refresh("addUserToGroup", d);
            }
        },
        showHelp: function() {
            this.recovery(new MX.ui.Dialog({
                width: 500,
                content: l({
                    lang: b
                }),
                buttons: [ {
                    position: "right",
                    text: b.close,
                    click: function() {
                        this.close();
                    }
                } ]
            }));
        }
    });
}), define("text!template/admin/settings.html", [], function() {
    return '<div class="mx-container admin-settings">\n    <div class="panel-group " id="accordion">\n        <div id="settings_content">\n\n        </div>\n        {{#if isSAML}}\n        <div class="panel panel-large panel-default">\n\n            <div class="panel-heading">\n                <button data-action="addNewItem" class="btn btn-link pull-right">{{lang.configure_new}}</button>\n                <h4 class="panel-title">\n                    <span>{{lang.sso_form_title}}</span>\n                </h4>\n            </div>\n\n        </div>\n        {{/if}}\n    </div>\n</div>\n';
}), define("group/integrationCollection", [ "moxtra", "group/integrationModel", "app" ], function(a, b) {
    return a.Collection.extend({
        model: b,
        fetch: function() {
            var a = MX.storage("integration", "sessionStorage"), b = a.get("group_id");
            new MX.ChainObject(function() {
                MX.api("/groups/" + (b ? b : "current") + "/integrations", "GET", null, this.callback, this);
            }).scope(this).success(this._parseData);
        },
        _parseData: function(a) {
            this.reset(a.data, {
                parse: !0
            }), this.trigger("complete");
        }
    });
}), define("text!template/admin/salesforceItem.html", [], function() {
    return '<div id="item{{sequence}}" class="panel panel-default panel-large">\n    <div class="panel-heading">\n        <h4 class="panel-title">\n            {{#if sequence}}\n            <button type="button" class="btn btn-link pull-right" data-action="deleteIntegration" data-param="{{sequence}}">{{lang.remove}}</button>\n            {{/if}}\n            <a data-toggle="collapse" href="#Salesforce">\n                <i class="micon-arrow-right"/>\n                {{lang.salesforce_integration}}\n            </a>\n        </h4>\n    </div>\n    <div id="Salesforce" class="panel-collapse collapse in">\n        <div class="panel-body">\n\n\n                    <form class="form-horizontal" role="form" id="salesforceForm">\n                        <div class="form-group">\n                            <label for="orgid" class="col-sm-3 control-label"  >{{lang.org_id_colon}} <span class="micon-help-with-circle blue size16" data-placement="right" data-toggle="tooltip" title="{{lang.admin_msg_sf_find_orgID}}"></span></label>\n                            <div class="col-sm-9">\n                                <input type="text" id="orgid" data-error-style="inline"  class="form-control" {{#if sequence}}readonly{{/if}}  name="sf_org_id">\n                                <span class="help-inline control-label"></span>\n\n                            </div>\n                            <input type="hidden" name="sequence" value="{{sequence}}">\n                            <input type="hidden" name="type" value="{{integrationType.salesforce}}">\n                        </div>\n                        <div class="form-group">\n                            <div class="col-sm-offset-3 col-sm-9">\n                                <div class="checkbox">\n                                    <label>\n                                        <input type="checkbox" name="enable_auto_provision"   > {{lang.enable_auto_account_provisioning}}\n                                    </label>\n                                    <span class="micon-help-with-circle blue size16"  data-toggle="tooltip" data-placement="right" title="{{lang.admin_msg_sf_learn_auto_provision}}"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="form-group">\n                            <div class="col-sm-offset-3 col-sm-9">\n                                <a href="https://www.moxtra.com/secure/sfdc/download-sfdc-app/" target="_blank">{{lang.admin_label_sf_download}}</a>\n                            </div>\n                        </div>\n                        <div class="form-group">\n                            <div class="col-sm-offset-3 col-sm-9">\n                                <a href="https://www.moxtra.com/secure/sfdc/installation_guide/" target="_blank">{{lang.admin_label_sf_install_guide}}</a>\n                            </div>\n                        </div>\n                        <div class="form-group">\n                            <div class="col-sm-offset-3 col-sm-9">\n\n                                <button type="submit" class="btn btn-primary">\n                                    {{#if sequence}}\n                                         {{lang.update}}\n                                    {{else}}\n                                        {{lang.link}}\n                                    {{/if}}\n                                </button>\n\n                            </div>\n                        </div>\n                    </form>\n\n        </div>\n    </div>\n</div>';
}), define("text!template/admin/ssoItem.html", [], function() {
    return '<div id="item{{sequence}}" class="panel panel-default panel-large">\n    <div class="panel-heading">\n        {{#if sequence}}\n            <button class="btn btn-link pull-right" data-action="deleteIntegration" data-param="{{sequence}}">{{lang.remove}}</button>\n        {{/if}}\n        <h4 class="panel-title">\n            <a data-toggle="collapse" href="#sso{{sequence}}" class="collapsed">\n                <i class="micon-arrow-right"/>\n                {{#if idpConf_name}}\n                {{idpConf_name}}\n                {{else}}\n                {{lang.sso_form_title}}\n                {{/if}}\n            </a>\n        </h4>\n    </div>\n    <div id="sso{{sequence}}" class="panel-collapse collapse">\n        <div class="panel-body">\n            <form class="form-horizontal" role="form">\n                <div class="form-group">\n                    <label for="idpConf_name" class="col-sm-3 control-label">{{lang.name}}:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="idpConf_name" name="idpConf_name" placeholder="">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_idpid" class="col-sm-3 control-label">IdP Entity ID:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="idpConf_idpid" name="idpConf_idpid" placeholder="">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_spid" class="col-sm-3 control-label">SP Entity ID:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="idpConf_spid" name="idpConf_spid" placeholder="{{default_spid}}">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_idploginurl"\n                           class="col-sm-3 control-label">Login URL:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="idpConf_idploginurl" name="idpConf_idploginurl"\n                               placeholder="">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_authncontextclassref" class="col-sm-3 control-label">AuthnContextClassRef:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="idpConf_authncontextclassref"\n                               name="idpConf_authncontextclassref" placeholder="">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_nameidformat"\n                           class="col-sm-3 control-label">NameID Format:</label>\n\n                    <div class="col-sm-9">\n\n                        <select id="idpConf_nameidformat" name="idpConf_nameidformat" class="form-control">\n                            <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</option>\n                            <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</option>\n                            <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName"> urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName</option>\n                            <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:entity"> urn:oasis:names:tc:SAML:2.0:nameid-format:entity</option>\n                            <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"> urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</option>\n                        </select>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">SSO Flow:</label>\n\n                    <div class="col-sm-9">\n                        <label class="checkbox-inline">\n                            <input type="radio" name="idpConf_idpinitiated" value="true"> IdP-Initiated\n                        </label>\n                        <label class="checkbox-inline">\n                            <input type="radio" name="idpConf_idpinitiated" value="false"> SP-Initiated\n                        </label>\n                    </div>\n                </div>\n\n                <div class="form-group idp-param" style="display: none">\n                    <label for="idpConf_targetparameter"\n                           class="col-sm-3 control-label">Target Parameter (for IdP-Initiated):</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" id="idpConf_targetparameter"\n                               name="idpConf_targetparameter" placeholder="">\n                    </div>\n                </div>\n                <div class="sp-param" >\n                    <div class="form-group sdp-param">\n                        <label class="col-sm-3 control-label">Protocol Binding:</label>\n\n                        <div class="col-sm-9">\n                            <label class="checkbox-inline">\n                                <input type="radio" name="idpConf_postprofile" value="true"> Http Post\n                            </label>\n                            <label class="checkbox-inline">\n                                <input type="radio" name="idpConf_postprofile" value="false"> Http Redirect\n                            </label>\n                        </div>\n                    </div>\n                    <div class="form-group ">\n                        <label for="idpConf_authnrequestsigned"\n                               class="col-sm-3 control-label">AuthnRequest Signed:</label>\n\n                        <div class="col-sm-9">\n                            <label class="checkbox-inline" >\n                                <input type="checkbox" style="margin-left: 0" id="idpConf_authnrequestsigned"\n                                       name="idpConf_authnrequestsigned" >&nbsp;\n                            </label>\n\n                        </div>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="idpConf_cert" class="col-sm-3 control-label">{{lang.admin_idpConf_cert}}:</label>\n\n                    <div class="col-sm-9">\n                        <textarea class="form-control vertResize" data-error-style="inline" name="idpConf_cert" id="idpConf_cert" rows="3" placeholder="-----BEGIN CERTIFICATE-----\n\n-----END CERTIFICATE-----"></textarea>\n                        <span class="help-inline control-label"></span>\n                         <div>\n                                    {{lang.admin_cert_info}}\n                                </div>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="saml_email_domain" class="col-sm-3 control-label">{{lang.saml_email_domain}}:</label>\n\n                    <div class="col-sm-9">\n                        <input type="text" class="form-control" data-error-style="inline" id="saml_email_domain" name="saml_email_domain" placeholder="example.com">\n                        <span class="help-inline control-label"></span>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="saml_email_domain" class="col-sm-3 control-label">{{lang.admin_moxtra_org_id}}:</label>\n\n                    <div class="col-sm-9">\n                        <p class="form-control-static">{{groupId}}</p>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <div class="col-sm-offset-4 col-sm-9">\n                        <button type="submit" class="btn btn-primary">{{lang.update}}</button>\n                        {{#unless sequence}}\n                             <button type="button" class="btn btn-default" data-action="cancelNewSSO">{{lang.cancel}}</button>\n\n                        {{/unless}}\n                    </div>\n\n                </div>\n                {{#unless saml_email_domain_verified}}\n                {{#if saml_email_domain_token}}\n                <div class="verify-group">\n                <hr/>\n\n                    <div class="alert alert-warning">\n                        {{lang.domain_not_verified}} <a href="javascript:;" class="help-link" data-action="showHelp"> <i class="micon-help-with-circle blue size16"/></a>\n                    </div>\n\n                <div class="form-group">\n                    <label for="saml_email_domain_token"\n                           class="col-sm-3 control-label">{{lang.saml_email_domain_token}}</label>\n\n                    <div class="col-sm-9">\n                        <div class="row">\n                            <div class="col-sm-9">\n                                <input type="text" class="form-control" id="saml_email_domain_token"\n                                       name="saml_email_domain_token" readonly>\n                            </div>\n                            <div class="col-sm-3">\n                                <button type="button" data-action="verifyDoman" data-param="{{sequence}}"\n                                        class="btn btn-primary">{{lang.verify}}\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                </div>\n                {{/if}}\n                {{/unless}}\n            </form>\n        </div>\n    </div>\n</div>';
}), define("text!template/help/domainVerification.html", [], function() {
    return '<ul>\n    <li>\nSign in to the domain host\'s administrative console for your domain.\n    </li>\n    <li>\nLocate the page on which you can update the domain DNS records.\n    </li>\n    <li>\nThe page is typically called something like DNS Management, Name Server Management, or Advanced Settings.\n    </li>\n    <li>\nLocate the TXT records for your domain. You may have one or more TXT records resembling:\n<table class="table table-bordered" >\n    <thead>\n<td>Name / Host / Alias</td><td>Time to Live (TTL)</td><td>Record Type</td><td>Value / Answer / Destination</td>\n    </thead>\n<tr><td>Blank or @</td><td>	86400	 </td><td>TXT	</td><td>v=spf1 ip4:123.123.123.123 ~all</td></tr>\n</table>\n    </li>\n    <li>\nOptionally, reduce the Time to Live (TTL) to 300 seconds for every existing TXT record. This tells name servers across the internet to check every 300 seconds (or five minutes) whether you updated these DNS records. This allows you to apply changes to your DNS records much more quickly. Also, if necessary, you can revert any DNS record changes a lot quicker when you’ve set a low TTL.\n    </li>\n    <li>\nAny DNS record change will apply only after the initial TTL of that record expires. For example, a value of 86400 seconds = 1440 minutes = 24 hours before any update will be applied. This also means that you need to wait 24 hours after the TTL of a DNS record is updated once you change it to 300 from 86400.\n    </li>\n    <li>\nEither update an existing TXT record to reuse it or create a new record with the name and value shown for your use as shown in the below table.\n\n<table  class="table table-bordered">\n    <thead>\n<td>Purpose	</td><td> Name/Host/Alias	</td><td> Time to Live (TTL)</td><td>	 Record Type</td><td>	 Value/Answer/Destination</td></thead>\n    <tr>\n<td>Domain verification</td><td>	Blank or @</td><td>	 3600</td><td>	TXT</td><td>	 Your unique Moxtra security token, provided in the Moxtra SSO settings verification instructions.\n\nThe token is a string that begins with moxtra-site-verification=, followed by a unique string with 43 additional characters.\n\nFor example: moxtra-site-verification=rXOxyZounnZasA8Z7oaD3c14JdjS9aKSWvsR1EbUSIQ</td>\n    </tr></table>\n    </li>\n<li>\nSave your changes and wait until they take effect. Sometimes it may take up to 72 hours before changes are propagated, depending on the TTL that was configured for your TXT records. When the changes are in effect click "Verify" to complete the domain verification.\n</li>\n</ul>';
}), define("admin/settings", [ "moxtra", "lang", "const", "text!template/admin/settings.html", "group/groupBiz", "group/integrationModel", "group/integrationCollection", "text!template/admin/salesforceItem.html", "text!template/admin/ssoItem.html", "text!template/help/domainVerification.html" ], function(a, b, c, d, e, f, g, h, i, j) {
    var k = MX.logger("Admin:setting"), l = {
        salesforce: Handlebars.compile(h),
        sso: Handlebars.compile(i)
    }, m = MX.storage("integration", "sessionStorage"), n = c.group.integrationType;
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        name: "GROUP_INTEGRATION_SAML",
        init: function() {
            this.$scope.isSAML = this.name == Moxtra.const.GROUP_INTEGRATION_SAML, this.$scope.lang = b, 
            this.$scope.integrationType = c.group.integrationType, this.collection = new g(), 
            this.listenTo(this.collection, "add", this.addItem), this.listenTo(this.collection, "reset", this.renderAllItem), 
            this.listenTo(this.collection, "remove", this.removeItem), this.listenTo(this.collection, "complete", function() {
                this.itemContainer.loading(!1);
            }), this.collection.fetch(), this.currPanel = "Salesforce", this.recovery(this.collection);
        },
        rendered: function() {
            this.itemContainer = this.$("#settings_content"), this.itemContainer.loading();
        },
        removeItem: function(a) {
            this.$("#item" + a.get("sequence")).remove(), a.get("type") == n.salesforce && this.addNewItem(n.salesforce);
        },
        renderAllItem: function() {
            var a = this;
            this.itemContainer.empty(), this.collection.each(function(b) {
                a.name == b.get("type") && a.renderItem(b);
            }), this.name == Moxtra.const.GROUP_INTEGRATION_SALESFORCE && (this.hasSalesforce || this.addNewItem(n.salesforce));
        },
        addItem: function(a) {
            this.renderItem(a);
        },
        renderItem: function(a, c) {
            var d = a.toJSON(), e = l.sso, f = this;
            d.groupId = m.get("group_id") || Moxtra.getMe().groupId;
            var g = f.itemContainer;
            d.type == n.salesforce ? (e = l.salesforce, a.validation = {
                sf_org_id: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ]
            }) : a.validation = {
                idpConf_name: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ],
                idpConf_idpid: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ],
                idpConf_spid: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ],
                idpConf_cert: [ {
                    required: !0,
                    pattern: /^-----BEGIN CERTIFICATE-----(.|\n)+-----END CERTIFICATE-----$/,
                    msg: b.invalid_certificate_format
                } ],
                idpConf_authncontextclassref: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ],
                idpConf_idploginurl: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ],
                saml_email_domain: [ {
                    required: !0,
                    msg: b.this_field_is_required
                } ]
            }, d.default_spid = "http://" + location.hostname;
            var h = $(e(_.extend(d, this.$scope)));
            if (new MX.Form({
                parent: this,
                form: h.find("form"),
                model: a,
                submit: function() {
                    f.saveForm(a);
                },
                scope: this
            }), d.type == n.salesforce) g.prepend(h), g.find(".micon-help-with-circle").tooltip({
                container: "body"
            }), this.hasSalesforce = !0; else {
                c ? c.replaceWith(h) : g.append(h), MX.env.isIE && $(".form-horizontal").placeholder();
                var i = function() {
                    1 == a.get("idpConf_idpinitiated") ? (h.find(".idp-param").show(), h.find(".sp-param").hide()) : (h.find(".idp-param").hide(), 
                    h.find(".sp-param").show()), a.changed.sequence && (h.remove(), delete a.changed.sequence, 
                    f.renderItem(a)), a.changed.saml_email_domain_verified && 1 == a.get("saml_email_domain_verified") && h.find(".verify-group").remove();
                };
                i(), a.on("change", i);
            }
        },
        _findDuplicateIdpId: function(a) {
            var b = !1;
            return "GROUP_INTEGRATION_SAML" === a.get("type") && this.collection.each(function(c) {
                c.get("sequence") !== a.get("sequence") && c.get("idpConf_idpid") === a.get("idpConf_idpid") && (b = !0);
            }), b;
        },
        saveForm: function(a) {
            if (this._findDuplicateIdpId(a)) return void MX.ui.notifyError(b.admin_idpid_conflict);
            var c = a.toServerJSON();
            c.sequence ? e.updateIntegration(c).success(function() {
                MX.ui.notifySuccess(b.update_config_success);
            }).error(function() {
                MX.ui.notifyError(b.update_config_failed);
            }) : e.createIntegration(c).success(function(c) {
                MX.ui.notifySuccess(b.create_config_success);
                var c = MX.get("data.0", c);
                a.set(c), setTimeout(function() {
                    $('a[href="#sso' + c.sequence + '"]').click();
                }, 300);
            }).error(function(a) {
                k.error(a), MX.ui.notifyError(a && a.xhr && a.xhr.status ? MX.format("{0} ({1})", b.create_config_failed, a.xhr.status) : b.create_config_failed);
            });
        },
        addNewItem: function(a) {
            a = a || n.saml;
            var b = new f({
                type: a,
                sequence: a == n.saml ? 0 : void 0,
                enable_auto_provision: a == n.saml ? !0 : !1
            });
            this.collection.add(b), this.newModel = b, setTimeout(function() {
                var b = a == n.saml ? "sso0" : "Salesforce";
                $('a[href="#' + b + '"]').click();
            }, 100);
        },
        verifyDoman: function(a) {
            var c = this.collection.get(a);
            e.verifyIntegrationDomain(a).success(function() {
                MX.ui.notifySuccess(b.verify_domain_success), c.set("saml_email_domain_verified", !0);
            }).error(function() {
                MX.ui.notifyError(b.verify_domain_failed);
            });
        },
        showPanel: function(a) {
            this.currPanel && this.hidePanel(this.currPanel);
            var b = this.$("#" + a);
            b.removeClass("collapse").addClass("in"), this.currPanel = a, b.closest(".panel").addClass("open");
        },
        hidePanel: function(a) {
            var b = this.$("#" + a);
            b.removeClass("in").addClass("collapse"), this.currPanel = null, b.closest(".panel").removeClass("open");
        },
        togglePanel: function(a) {
            return this.currPanel == a ? void this.hidePanel(a) : (this.hidePanel(this.currPanel), 
            void this.showPanel(a));
        },
        deleteIntegration: function(a) {
            var c = this;
            MX.ui.Confirm(b.confirm_remove_config, function() {
                e.deleteIntegration(a).success(function() {
                    var d = c.collection.get(a);
                    d && c.collection.remove(d), MX.ui.notifySuccess(b.remove_config_success);
                }).error(function() {
                    MX.ui.notifyError(b.remove_config_failed);
                });
            });
        },
        cancelNewSSO: function() {
            this.collection.remove(this.newModel), this.newModel = null;
        },
        showHelp: function() {
            new MX.ui.Dialog({
                width: 850,
                content: j,
                buttons: [ {
                    position: "right",
                    text: b.close,
                    click: function() {
                        this.close();
                    }
                } ]
            });
        }
    });
}), define("text!template/admin/branding.html", [], function() {
    return '<div class="mx-container admin-settings admin-branding">\n    <div class="panel-group " id="accordion">\n    	<div class="brand-web">\n    		\n    	</div>\n    	<div class="brand-mobile">\n    		\n    	</div>\n    	<div class="brand-email">\n    		\n    	</div>\n    	<div class="brand-misc">\n    		\n    	</div>\n    </div>\n</div>\n';
}), define("text!template/admin/branding/web.html", [], function() {
    return '<div class="panel-group">\n	<div class="mx-panel panel panel-default panel-large">\n		<div class="panel-heading">\n			<h4 class="panel-title">\n				<a data-toggle="collapse" href="#collapseWeb" class="collapsed"> <i class="micon-arrow-right"></i>{{lang.web}}</a>\n			</h4>\n		</div>\n		<div id="collapseWeb" class="panel-collapse collapse">\n			<div class="panel-body branding-settings">\n				\n			</div>\n		</div>\n	</div>\n</div>\n';
}), define("text!template/admin/branding/webSettings.html", [], function() {
    return '<form class="form-horizontal branding-web-form" role="form">\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.header_logo}}:<div><i class="size12">( {{lang.size}}: {{webHeaderLogoSize.width}} x {{webHeaderLogoSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="webHeaderLogo_flash" data-name="webHeaderLogo" data-triggerchange="true" >\n				{{#if webHeaderLogo}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless webHeaderLogo}}hide{{/unless}} {{#when webHeaderLogo \'==\' DefaultLogo.webLogo.url}}hide{{/when}}" data-action="removeImg" data-param="web,webHeaderLogo" data-triggerchange="true">{{lang.remove}}</a>\n			<span class="setting-demo-img change-by-webHeaderBgColor demo-logo demo-pl20 {{#unless webHeaderLogo}}hide{{/unless}} {{brandDemoHighlightBorder webHeaderBgColor}}" style="display:block;background-color: {{webHeaderBgColor}};">\n				<img src="{{webHeaderLogo}}" style="width: {{DefaultLogo.webLogo.previewSize.width}}px; height: {{DefaultLogo.webLogo.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.header_background_color}}:</label>\n		<div class="col-sm-9 branding-item">\n			<div class="branding-setting-color">\n				<input type="text" class="form-control pull-left marginRight10" value="{{webHeaderBgColor}}"\n						data-type="color"\n						data-name="webHeaderBgColor"\n						data-module="web"\n						data-triggerchange="true"\n						data-demo="bgcolor"/>\n				<a class="close mouse-hand pull-left {{#unless webHeaderBgColor}}hide{{/unless}}" data-action="clearText" data-param="web,webHeaderBgColor,true">&times;</a>\n				<span class="setting-demo-color pull-left {{#unless webHeaderBgColor}}hide{{/unless}} {{brandDemoHighlightBorder webHeaderBgColor}}">\n					<span class="demo" style="background-color: {{webHeaderBgColor}};"></span>\n				</span>\n			</div>\n	    </div>\n	</div>\n	<div class="legend-title">\n		<legend>{{lang.meet}}</legend>\n	</div>\n	<div class="form-group {{#unless webHeaderLogo}}hide{{/unless}}">\n		<label for="" class="col-sm-3 control-label">{{lang.header_logo}}:<div><i class="size12">({{lang.preview}})</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<span class="setting-demo-img change-by-webMeetHeaderBgColor change-by-webHeaderLogo demo-logo demo-pl20 {{#unless webHeaderLogo}}hide{{/unless}} {{brandDemoHighlightBorder webHeaderBgColor}}" style="margin-top:0; background-color: {{webMeetHeaderBgColor}};">\n				<img src="{{webHeaderLogo}}" style="width: {{DefaultLogo.webLogo.previewSize.width}}px; height: {{DefaultLogo.webLogo.previewSize.height}}px;"/>\n			</span>\n        </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label">{{lang.header_background_color}}:</label>\n		<div class="col-sm-9 branding-item">\n			<div class="branding-setting-color">\n				<input type="text" class="form-control pull-left marginRight10" value="{{webMeetHeaderBgColor}}"\n						data-type="color"\n						data-name="webMeetHeaderBgColor"\n						data-module="web"\n						data-triggerchange="true"\n						data-demo="bgcolor"/>\n				<a class="close mouse-hand pull-left {{#unless webMeetHeaderBgColor}}hide{{/unless}}" data-action="clearText" data-param="web,webMeetHeaderBgColor,true">&times;</a>\n				<span class="setting-demo-color pull-left {{#unless webMeetHeaderBgColor}}hide{{/unless}} {{brandDemoHighlightBorder webMeetHeaderBgColor}}">\n					<span class="demo" style="background-color: {{webMeetHeaderBgColor}};"></span>\n				</span>\n			</div>\n        </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label">{{lang.header_text_color}}:</label>\n		<div class="col-sm-9 branding-item">\n			<div class="branding-setting-color">\n				<input type="text" class="form-control pull-left marginRight10" value="{{webMeetHeaderTextColor}}" data-type="color" data-name="webMeetHeaderTextColor" data-module="web" data-demo="textcolor"/>\n				<a class="close mouse-hand pull-left {{#unless webMeetHeaderTextColor}}hide{{/unless}}" data-action="clearText" data-param="web,webMeetHeaderTextColor">&times;</a>\n				<span class="setting-demo-color change-by-webMeetHeaderBgColor pull-left paddingTop2 {{#unless webMeetHeaderTextColor}}hide{{/unless}}" style="background-color: {{webMeetHeaderBgColor}};">\n					<i class="demo micon-text size20" style="color: {{webMeetHeaderTextColor}};"></i>\n				</span>\n			</div>\n        </div>\n	</div>\n	<div class="legend-title">\n		<legend>{{lang.note_renamed_to_clip}}</legend>\n	</div>\n	<div class="form-group {{#unless webHeaderLogo}}hide{{/unless}}">\n		<label for="" class="col-sm-3 control-label">{{lang.header_logo}}:<div><i class="size12">({{lang.preview}})</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<span class="setting-demo-img change-by-webNoteHeaderBgColor change-by-webHeaderLogo demo-logo demo-pl20 {{#unless webHeaderLogo}}hide{{/unless}} {{brandDemoHighlightBorder webHeaderBgColor}}" style="margin-top:0; background-color: {{webNoteHeaderBgColor}};">\n				<img src="{{webHeaderLogo}}" style="width: {{DefaultLogo.webLogo.previewSize.width}}px; height: {{DefaultLogo.webLogo.previewSize.height}}px;"/>\n			</span>\n        </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label">{{lang.header_background_color}}:</label>\n		<div class="col-sm-9 branding-item">\n			<div class="branding-setting-color">\n				<input type="text" class="form-control pull-left marginRight10" value="{{webNoteHeaderBgColor}}"\n						data-type="color"\n						data-name="webNoteHeaderBgColor"\n						data-module="web"\n						data-triggerchange="true"\n						data-demo="bgcolor"/>\n				<a class="close mouse-hand pull-left {{#unless webNoteHeaderBgColor}}hide{{/unless}}" data-action="clearText" data-param="web,webNoteHeaderBgColor,true">&times;</a>\n				<span class="setting-demo-color pull-left {{#unless webNoteHeaderBgColor}}hide{{/unless}} {{brandDemoHighlightBorder webNoteHeaderBgColor}}">\n					<span class="demo" style="background-color: {{webNoteHeaderBgColor}};"></span>\n				</span>\n			</div>\n        </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label">{{lang.header_text_color}}:</label>\n		<div class="col-sm-9 branding-item">\n			<div class="branding-setting-color">\n				<input type="text" class="form-control pull-left marginRight10" value="{{webNoteHeaderTextColor}}" data-type="color" data-name="webNoteHeaderTextColor" data-module="web" data-demo="textcolor"/>\n				<a class="close mouse-hand pull-left {{#unless webNoteHeaderTextColor}}hide{{/unless}}" data-action="clearText" data-param="web,webNoteHeaderTextColor">&times;</a>\n				<span class="setting-demo-color change-by-webNoteHeaderBgColor pull-left paddingTop2 {{#unless webNoteHeaderTextColor}}hide{{/unless}}" style="background-color: {{webNoteHeaderBgColor}};">\n					<i class="demo micon-text size20" style="color: {{webNoteHeaderTextColor}};"></i>\n				</span>\n			</div>\n        </div>\n	</div>\n	<div class="legend-title">\n		<legend> </legend>\n	</div>\n	<div class="form-group">\n		<div class="col-sm-offset-3 col-sm-9">\n			<a class="btn btn-primary marginRight10" data-action="save" data-param="web">{{lang.save}}</a>\n			<a class="btn btn-default" data-action="reset" data-param="web">{{lang.reset}}</a>\n		</div>\n	</div>\n</form>\n';
}), define("admin/branding/web", [ "moxtra", "lang", "app", "const", "text!template/admin/branding/web.html", "text!template/admin/branding/webSettings.html", "admin/branding/helper" ], function(a, b, c, d, e, f, g) {
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function(a) {
            this.model = a.model, this.collection = g.genCollection(a.model), this.$scope.lang = b;
        },
        rendered: function() {
            this.list = new a.List({
                parent: this,
                renderTo: this.$(".branding-settings"),
                collection: this.collection,
                template: f,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: !0,
                $scope: {
                    lang: b,
                    blankImg: d.defaults.blankImg
                }
            });
        }
    });
}), define("text!template/admin/branding/email.html", [], function() {
    return '<div class="panel-group">\n	<div class="mx-panel panel panel-default panel-large">\n		<div class="panel-heading">\n			<h4 class="panel-title">\n				<a data-toggle="collapse" href="#collapseEmail" class="collapsed"> <i class="micon-arrow-right"></i>{{lang.email}}</a>\n			</h4>\n		</div>\n		<div id="collapseEmail" class="panel-collapse collapse">\n			<div class="panel-body branding-settings">\n				\n			</div>\n		</div>\n	</div>\n</div>\n';
}), define("text!template/admin/branding/emailSettings.html", [], function() {
    return '<form class="form-horizontal branding-email-form" role="form">\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.header_logo}}:<div><i class="size12">( {{lang.size}}: {{emailHeaderLogoSize.width}} x {{emailHeaderLogoSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="emailHeaderLogo_flash" data-name="emailHeaderLogo">\n				{{#if emailHeaderLogo}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless emailHeaderLogo}}hide{{/unless}} {{#when emailHeaderLogo \'==\' DefaultLogo.emailLogo.url}}hide{{/when}}" data-action="removeImg" data-param="email,emailHeaderLogo">{{lang.remove}}</a>\n			<span class="setting-demo-img demo-logo {{#unless emailHeaderLogo}}hide{{/unless}}">\n				<img src="{{emailHeaderLogo}}" style="width: {{DefaultLogo.emailLogo.previewSize.width}}px; height: {{DefaultLogo.emailLogo.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<!-- <div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">Company Name: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{emailCompanyName}}" data-type="string" data-name="emailCompanyName" data-module="email"/>\n			<a class="close mouse-hand pull-left {{#unless emailCompanyName}}hide{{/unless}}" data-action="clearText" data-param="email,emailCompanyName">&times;</a>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">Footer Copyright: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{emailFooterCopyright}}" data-type="string" data-name="emailFooterCopyright" data-module="email"/>\n			<a class="close mouse-hand pull-left {{#unless emailFooterCopyright}}hide{{/unless}}" data-action="clearText" data-param="email,emailFooterCopyright">&times;</a>\n	    </div>\n	</div> -->\n	<!-- <div class="legend-title">\n		<legend>Daily Digest Email</legend>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">From Name: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{emailFromName}}" data-type="string" data-name="emailFromName" data-module="email"/>\n			<a class="close mouse-hand pull-left {{#unless emailFromName}}hide{{/unless}}" data-action="clearText" data-param="email,emailFromName">&times;</a>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">From Email: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{emailFromEmail}}" data-type="string" data-name="emailFromEmail" data-module="email"/>\n			<a class="close mouse-hand pull-left {{#unless emailFromEmail}}hide{{/unless}}" data-action="clearText" data-param="email,emailFromEmail">&times;</a>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">Subject: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{emailSubject}}" data-type="string" data-name="emailSubject" data-module="email"/>\n			<a class="close mouse-hand pull-left {{#unless emailSubject}}hide{{/unless}}" data-action="clearText" data-param="email,emailSubject">&times;</a>\n	    </div>\n	</div>\n	<div class="legend-title">\n		<legend> </legend>\n	</div> -->\n	<div class="form-group">\n		<div class="col-sm-offset-3 col-sm-9">\n			<a class="btn btn-primary marginRight10" data-action="save" data-param="email">{{lang.save}}</a>\n			<a class="btn btn-default" data-action="reset" data-param="email">{{lang.reset}}</a>\n		</div>\n	</div>\n</form>\n';
}), define("admin/branding/email", [ "moxtra", "lang", "app", "const", "text!template/admin/branding/email.html", "text!template/admin/branding/emailSettings.html", "admin/branding/helper" ], function(a, b, c, d, e, f, g) {
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function(a) {
            this.model = a.model, this.collection = g.genCollection(a.model), this.$scope.lang = b;
        },
        rendered: function() {
            this.list = new a.List({
                parent: this,
                renderTo: this.$(".branding-settings"),
                collection: this.collection,
                template: f,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: !0,
                $scope: {
                    lang: b,
                    blankImg: d.defaults.blankImg
                }
            });
        }
    });
}), define("text!template/admin/branding/misc.html", [], function() {
    return '<div class="panel-group">\n	<div class="mx-panel panel panel-default panel-large">\n		<div class="panel-heading">\n			<h4 class="panel-title">\n				<a data-toggle="collapse" href="#collapseMisc" class="collapsed"> <i class="micon-arrow-right"></i>{{lang.other}}</a>\n			</h4>\n		</div>\n		<div id="collapseMisc" class="panel-collapse collapse">\n			<div class="panel-body branding-settings">\n				\n			</div>\n		</div>\n	</div>\n</div>\n';
}), define("text!template/admin/branding/miscSettings.html", [], function() {
    return '<form class="form-horizontal branding-misc-form" role="form">\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.default_binder_cover}}:<div><i class="size12">( {{lang.size}}: {{defaultBinderCoverSize.width}} x {{defaultBinderCoverSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="defaultBinderCover_flash" data-name="defaultBinderCover">\n				{{#if defaultBinderCover}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless defaultBinderCover}}hide{{/unless}} {{#when defaultBinderCover \'==\' DefaultLogo.binderCover.url}}hide{{/when}}" data-action="removeImg" data-param="misc,defaultBinderCover">{{lang.remove}}</a>\n			<span class="setting-demo-img demo-logo {{#unless defaultBinderCover}}hide{{/unless}}">\n				<img src="{{defaultBinderCover}}" style="width: {{DefaultLogo.binderCover.previewSize.width}}px; height: {{DefaultLogo.binderCover.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.default_user_avatar}}:<div><i class="size12">( {{lang.size}}: {{defaultUserAvatarSize.width}} x {{defaultUserAvatarSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="defaultUserAvatar_flash" data-name="defaultUserAvatar">\n				{{#if defaultUserAvatar}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless defaultUserAvatar}}hide{{/unless}} {{#when defaultUserAvatar \'==\' DefaultLogo.userAvatar.url}}hide{{/when}}" data-action="removeImg" data-param="misc,defaultUserAvatar">{{lang.remove}}</a>\n			<span class="setting-demo-img demo-logo {{#unless defaultUserAvatar}}hide{{/unless}}">\n				<img src="{{defaultUserAvatar}}" class="img-circle" style="width: {{DefaultLogo.userAvatar.previewSize.width}}px; height: {{DefaultLogo.userAvatar.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.web_notification_icon}}:<div><i class="size12">( {{lang.size}}: {{notificationIconSize.width}} x {{notificationIconSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="notificationIcon_flash" data-name="notificationIcon">\n				{{#if notificationIcon}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless notificationIcon}}hide{{/unless}} {{#when notificationIcon \'==\' DefaultLogo.notification.url}}hide{{/when}}" data-action="removeImg" data-param="misc,notificationIcon">{{lang.remove}}</a>\n			<span class="setting-demo-img demo-logo {{#unless notificationIcon}}hide{{/unless}}">\n				<img src="{{notificationIcon}}" style="width: {{DefaultLogo.notification.previewSize.width}}px; height: {{DefaultLogo.notification.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_clip_watermark}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showNoteWatermark" data-module="misc" {{#when showNoteWatermark \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.clip_watermark_image}}:<div><i class="size12">( {{lang.size}}: {{noteWatermarkImageSize.width}} x {{noteWatermarkImageSize.height}} )</i></div></label>\n		<div class="col-sm-9 branding-item">\n			<a class="uploader mouse-hand pull-left" id="noteWatermarkImage_flash" data-name="noteWatermarkImage">\n				{{#if noteWatermarkImage}}\n				{{lang.change}}\n				{{else}}\n				{{lang.upload}}\n				{{/if}}\n			</a>\n			<a class="remover mouse-hand pull-left marginLeft10 {{#unless noteWatermarkImage}}hide{{/unless}} {{#when noteWatermarkImage \'==\' DefaultLogo.noteWatermarkImage.url}}hide{{/when}}" data-action="removeImg" data-param="misc,noteWatermarkImage">{{lang.remove}}</a>\n			<span class="setting-demo-img demo-logo {{#unless noteWatermarkImage}}hide{{/unless}}">\n				<img src="{{noteWatermarkImage}}" style="width: {{DefaultLogo.noteWatermarkImage.previewSize.width}}px; height: {{DefaultLogo.noteWatermarkImage.previewSize.height}}px;"/>\n			</span>\n	    </div>\n	</div>\n	<div class="form-group">\n		<div class="col-sm-offset-3 col-sm-9">\n			<a class="btn btn-primary marginRight10" data-action="save" data-param="misc">{{lang.save}}</a>\n			<a class="btn btn-default" data-action="reset" data-param="misc">{{lang.reset}}</a>\n		</div>\n	</div>\n</form>\n';
}), define("admin/branding/misc", [ "moxtra", "lang", "app", "const", "text!template/admin/branding/misc.html", "text!template/admin/branding/miscSettings.html", "admin/branding/helper" ], function(a, b, c, d, e, f, g) {
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function(a) {
            this.model = a.model, this.collection = g.genCollection(a.model), this.$scope.lang = b;
        },
        rendered: function() {
            this.list = new a.List({
                parent: this,
                renderTo: this.$(".branding-settings"),
                collection: this.collection,
                template: f,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: !0,
                $scope: {
                    lang: b,
                    blankImg: d.defaults.blankImg
                }
            });
        }
    });
}), define("admin/branding", [ "moxtra", "lang", "const", "app", "text!template/admin/branding.html", "admin/branding/web", "admin/branding/email", "admin/branding/misc", "admin/branding/helper", "component/uploader/base", "component/templateHelper" ], function(a, b, c, d, e, f, g, h, i, j) {
    return a.Controller.extend({
        Modules: {
            web: f,
            email: g,
            misc: h
        },
        Files: {
            web: [ "webHeaderLogo", "webMeetHeaderLogo", "webNoteHeaderLogo" ],
            email: [ "emailHeaderLogo" ],
            misc: [ "notificationIcon", "defaultBinderCover", "defaultUserAvatar", "noteWatermarkImage" ]
        },
        name: "branding",
        template: e,
        handleAction: !0,
        init: function() {},
        rendered: function() {
            var a = this;
            MX.ui.brandingUploader = new j({
                className: "mx_swf_container_branding",
                container: this.$el
            });
            var b = MX.get("tags", Moxtra.getMyGroup());
            a._buildModels(b), a._buildViews(), a._initTextPicker(), a._initBooleanPicker(), 
            a._initFileUploader(), a._initListener(), a.recovery(function() {
                MX.ui.brandingUploader = null;
            });
        },
        _buildModels: function(a) {
            var b = this;
            MX.each(this.Modules, function(c, d) {
                b[d + "Model"] = i.genModel(d, a);
            });
        },
        _buildViews: function() {
            var a = this;
            MX.each(this.Modules, function(b, c) {
                a.recovery(new b({
                    model: a[c + "Model"],
                    renderTo: ".brand-" + c
                }));
            });
        },
        _initTextPicker: function() {
            var a = this, b = function(b, c) {
                var d = b.val(), e = b.data("name"), f = b.data("module"), g = b.data("type") || "string", h = b.data("demo"), j = b.data("triggerchange"), k = a[f + "Model"], l = {}, m = b.closest(".branding-item").find(".setting-demo-color"), n = b.closest(".branding-item").find(".setting-demo-color .demo"), o = b.closest(".branding-item").find("a.close");
                if (d ? o.removeClass("hide") : o.addClass("hide"), "string" == g) {
                    if (!c) return;
                    l[e] = MX.escapeHTML(d), k && k.set(l, {
                        silent: !0
                    });
                } else if ("color" == g) {
                    var p = "", q = !1;
                    switch (p = i.checkColor(d) || "", l[e] = p.toUpperCase(), p ? m.removeClass("hide") : m.addClass("hide"), 
                    [ "#FFF", "#FFFFFF" ].indexOf(p.toUpperCase()) > -1 && (q = !0), h) {
                      case "bgcolor":
                        n.css("background-color", p), q ? m.addClass("highlight-border") : m.removeClass("highlight-border");
                        break;

                      case "textcolor":
                        n.css("color", p);
                    }
                    j && (a.$(".change-by-" + e).css("background-color", p), q ? a.$(".change-by-" + e).addClass("highlight-border") : a.$(".change-by-" + e).removeClass("highlight-border")), 
                    k && k.set(l, {
                        silent: !0
                    }), c && (b.val(p), p || o.addClass("hide"));
                }
            };
            this.$el.delegate('.branding-item input[type="text"]', "keyup", function() {
                b($(this));
            }).delegate('.branding-item input[type="text"]', "blur", function() {
                b($(this), !0);
            });
        },
        _initBooleanPicker: function() {
            var a = this;
            this.$el.delegate('.branding-item input[type="checkbox"]', "click", function() {
                var b, c = $(this), d = c.data("name"), e = c.data("subname"), f = c.data("module"), g = c.data("type"), h = c.data("triggerchange"), i = a[f + "Model"], j = {};
                if (b = c.prop("checked") ? "1" : "0", i) if ("json" == g && e) {
                    var k = _.extend({}, i.get(d));
                    k && (k[e] = b, j[d] = k, i.set(j, {
                        silent: !0
                    }));
                } else j[d] = b, i.set(j, {
                    silent: !0
                }), h && ("1" === b ? a.$(".change-by-" + d).removeAttr("disabled") : a.$(".change-by-" + d).attr("disabled", "disabled"));
            });
        },
        _initFileUploader: function() {
            var a = this;
            setTimeout(function() {
                MX.each(a.Files, function(b, c) {
                    a._buildUploader(c);
                }), a.$el.delegate(".branding-item a.uploader", "mouseover", function() {
                    var a = $(this).data("name");
                    i.refreshUploader(a, $(this));
                });
            }, 300);
        },
        _buildUploader: function(a, c) {
            var e = this, f = this.Files[a];
            f && MX.each(f, function(f) {
                var g = f + "_flash";
                c && i.destroyUploader(f), i.genUploader({
                    name: f,
                    button: g,
                    size: d.config.branding[f + "Size"] || {
                        width: 0,
                        height: 0
                    },
                    success: function(c) {
                        var d = {};
                        d[f] = c;
                        var h = e[a + "Model"];
                        h && h.set(d, {
                            silent: !0
                        });
                        var i = e.$("#" + g), j = i.closest(".branding-item").find(".setting-demo-img"), k = i.closest(".branding-item").find(".setting-demo-img img"), l = i.closest(".branding-item").find("a.remover"), m = i.data("triggerchange"), n = e.$(".change-by-" + f);
                        c ? (i.text(b.change), j.removeClass("hide"), l.removeClass("hide"), m && (n.removeClass("hide"), 
                        n.closest(".form-group").removeClass("hide")), e._update("save", a, l)) : (i.text(b.upload), 
                        j.addClass("hide"), l.addClass("hide"), m && (n.addClass("hide"), n.closest(".form-group").addClass("hide"))), 
                        k.attr("src", c), m && n.find("img").attr("src", c);
                    },
                    error: function() {}
                });
            });
        },
        _initListener: function() {
            var a = this;
            MX.each(this.Modules, function(b, c) {
                a.listenTo(a[c + "Model"], "change", function() {
                    a._buildUploader(c, !0);
                });
            });
        },
        removeImg: function(a, c) {
            var d, e = this[a + "Model"], f = {}, g = $(this.handleEvent.currentTarget), h = g.data("triggerchange");
            e && (f[c] = "", e.set(f, {
                silent: !0
            }), g.addClass("hide"), d = g.closest(".branding-item").find(".uploader"), d.text(b.upload), 
            g.closest(".branding-item").find(".setting-demo-img").addClass("hide"), h && (this.$(".change-by-" + c).addClass("hide"), 
            this.$(".change-by-" + c).closest(".form-group").addClass("hide")), this._update("save", a, d, {
                complete: function() {
                    var b = i.getDefaults(a);
                    f[c] = b[c], e.set(f);
                }
            }));
        },
        clearText: function(a, b, c) {
            var d = this[a + "Model"], e = {}, f = $(this.handleEvent.currentTarget);
            d && (e[b] = "", d.set(e, {
                silent: !0
            }), f.addClass("hide"), f.closest(".branding-item").find("input").val(""), f.closest(".branding-item").find(".setting-demo-color").addClass("hide"), 
            c && this.$(".change-by-" + b).css("background-color", "").removeClass("highlight-border"));
        },
        save: function(a) {
            var b = $(this.handleEvent.currentTarget);
            this._update("save", a, b);
        },
        reset: function(a) {
            var c = this, d = (this[a + "Model"], $(this.handleEvent.currentTarget));
            MX.ui.Confirm(b.confirm_reset_branding, function() {
                c._update("reset", a, d);
            });
        },
        _update: function(a, c, d, e) {
            e = e || {};
            var f = this[c + "Model"];
            if (f) {
                d.loading(), d.addClass("disabled"), "reset" == a && f.set(i.getDefaults(c));
                var g = Moxtra.getMyGroup(), h = f.toJSON(), j = i.buildTags(g, c, h, "reset" == a);
                j.length && (g.tags.push(j), g.update("tags").success(function() {
                    i.loadStyle(), MX.ui.notifySuccess("reset" == a ? b.reset_branding_success : b.update_config_success), 
                    e.success && e.success();
                }).error(function() {
                    MX.ui.notifyError("reset" == a ? b.reset_branding_failed : b.update_config_failed), 
                    e.error && e.error();
                }).complete(function() {
                    d.loading(!1), d.removeClass("disabled"), e.complete && e.complete();
                }));
            }
        }
    });
}), define("text!template/admin/configuration.html", [], function() {
    return '<div class="mx-container admin-settings admin-branding admin-configuration">\n	<div class="brand-configuration">\n		\n	</div>\n</div>';
}), define("text!template/admin/configuration/cfg.html", [], function() {
    return '<div class="panel-group">\n	<div class="mx-panel panel panel-default">\n		<div id="collapseCfg" class="panel-collapse in">\n			<div class="panel-body configuration-settings">\n\n			</div>\n		</div>\n	</div>\n</div>';
}), define("text!template/admin/configuration/cfgSettings.html", [], function() {
    return '<form class="form-horizontal configuration-form" role="form">\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_add_file}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand"\n				data-name="showAddFile"\n				data-module="configuration"\n				data-triggerchange="true"\n				{{#when showAddFile \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.add_file_options}}: </label>\n		<div class="col-sm-9 branding-item">\n			<div class="table-responsive">\n				<table class="table table-bordered table-striped">\n					<thead>\n						<tr>\n							<td></td>\n							<th>{{lang.web}}</th>\n							<th>{{lang.ios_app}}</th>\n							<th>{{lang.android_app}}</th>\n						</tr>\n					</thead>\n					<tbody>\n						<tr>\n							<th>{{lang.whiteboard}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusNewPage" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusNewPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusNewPage" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusNewPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusNewPage" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusNewPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.binder}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusBinderPage" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusBinderPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusBinderPage" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusBinderPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusBinderPage" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusBinderPage \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.desktop_local}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusDesktopLocal" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusDesktopLocal \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.desktop_remote}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusDesktopRemote" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusDesktopRemote \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusDesktopRemote" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusDesktopRemote \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusDesktopRemote" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusDesktopRemote \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.note}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusWebDoc" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusWebDoc \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusWebDoc" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusWebDoc \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.gallery}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusGallery" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusGallery \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusGallery" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusGallery \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.camera}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusCamera" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusCamera \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusCamera" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusCamera \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.web_clip}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusWebClip" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusWebClip \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.box}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusBox" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusBox \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.dropbox}}</th>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="webAddFileOptions" data-subname="plusDropbox" data-module="configuration" data-type="json" {{#when webAddFileOptions.plusDropbox \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusDropbox" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusDropbox \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusDropbox" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusDropbox \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.evernote}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusEvernote" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusEvernote \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.google_drive}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusGoogleDrive" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusGoogleDrive \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="androidAddFileOptions" data-subname="plusGoogleDrive" data-module="configuration" data-type="json" {{#when androidAddFileOptions.plusGoogleDrive \'==\' \'1\'}}checked{{/when}} />\n							</td>\n						</tr>\n						<tr>\n							<th>{{lang.icloud_drive}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusICloudDrive" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusICloudDrive \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n						<tr>\n							<th>{{lang.webdav}}</th>\n							<td>-</td>\n							<td>\n								<input type="checkbox" class="mouse-hand change-by-showAddFile" {{#when showAddFile \'!=\' \'1\'}}disabled{{/when}} data-name="iosAddFileOptions" data-subname="plusWebDAV" data-module="configuration" data-type="json" {{#when iosAddFileOptions.plusWebDAV \'==\' \'1\'}}checked{{/when}} />\n							</td>\n							<td>-</td>\n						</tr>\n					</tbody>\n				</table>\n			</div>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_todo}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showTodo" data-module="configuration" {{#when showTodo \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.start_meet_from_binder}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="startMeetFromBinder" data-module="configuration" {{#when startMeetFromBinder \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_app_review}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showAppReview" data-module="configuration" {{#when showAppReview \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_send_feedback}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showSendFeedback" data-module="configuration" {{#when showSendFeedback \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_binder_options}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showBinderOptions" data-module="configuration" {{#when showBinderOptions \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_binder_name}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showBinderName" data-module="configuration" {{#when showBinderName \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_binder_email_address}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showBinderEmailAddress" data-module="configuration" {{#when showBinderEmailAddress \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_new_binder}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showNewBinder" data-module="configuration" {{#when showNewBinder \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_meet_now}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showMeetNow" data-module="configuration" {{#when showMeetNow \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_schedule_meet}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showScheduleMeet" data-module="configuration" {{#when showScheduleMeet \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_meet_share_screen}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showMeetShareScreen" data-module="configuration" {{#when showMeetShareScreen \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_meet_audio}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showMeetAudio" data-module="configuration" {{#when showMeetAudio \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.show_meet_video}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="showMeetVideo" data-module="configuration" {{#when showMeetVideo \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.enable_meet_telephony}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="enableMeetTelephony" data-module="configuration" {{#when enableMeetTelephony \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.disable_auto_join_audio}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="checkbox" class="mouse-hand" data-name="disableAutoJoinAudio" data-module="configuration" {{#when disableAutoJoinAudio \'==\' \'1\'}}checked{{/when}} />\n	    </div>\n	</div>\n\n\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.webdav_url}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{webdavUrl}}" data-type="string" data-name="webdavUrl" data-module="configuration"/>\n			<a class="close mouse-hand pull-left {{#unless webdavUrl}}hide{{/unless}}" data-action="clearText" data-param="configuration,webdavUrl">&times;</a>\n	    </div>\n	</div>\n	<div class="form-group">\n		<label for="" class="col-sm-3 control-label mouse-hand" title="">{{lang.webdav_domain}}: </label>\n		<div class="col-sm-9 branding-item">\n			<input type="text" class="form-control pull-left" value="{{webdavDomain}}" data-type="string" data-name="webdavDomain" data-module="configuration"/>\n			<a class="close mouse-hand pull-left {{#unless webdavDomain}}hide{{/unless}}" data-action="clearText" data-param="configuration,webdavDomain">&times;</a>\n	    </div>\n	</div>\n	<div class="form-group">\n		<div class="col-sm-offset-3 col-sm-9">\n			<a class="btn btn-primary marginRight10" data-action="save" data-param="configuration">{{lang.save}}</a>\n			<a class="btn btn-default" data-action="reset" data-param="configuration">{{lang.reset}}</a>\n		</div>\n	</div>\n</form>';
}), define("admin/configuration/cfg", [ "moxtra", "lang", "const", "text!template/admin/configuration/cfg.html", "text!template/admin/configuration/cfgSettings.html", "admin/branding/helper" ], function(a, b, c, d, e, f) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.model = a.model, this.collection = f.genCollection(a.model), this.$scope.lang = b;
        },
        rendered: function() {
            this.list = new a.List({
                parent: this,
                renderTo: this.$(".configuration-settings"),
                collection: this.collection,
                template: e,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: !0,
                $scope: {
                    lang: b,
                    blankImg: c.defaults.blankImg
                }
            });
        }
    });
}), define("admin/configuration", [ "moxtra", "lang", "const", "app", "text!template/admin/configuration.html", "admin/configuration/cfg", "admin/branding", "admin/branding/helper" ], function(a, b, c, d, e, f, g) {
    return g.extend({
        Modules: {
            configuration: f
        },
        name: "configuration",
        template: e,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {
            var a = this, b = MX.get("tags", Moxtra.getMyGroup());
            a._buildModels(b), a._buildViews(), a._initTextPicker(), a._initBooleanPicker();
        }
    });
}), define("text!template/admin/report.html", [], function() {
    return '<div class="admin-report">\n	<div class="report-header">\n		<div>\n			<strong>{{groupName}}</strong>\n		</div>\n		<h4>{{lang.usage_report}}</h4>\n	</div>\n	<div class="report-body">\n		<div class="mx-container">\n			<div class="summary-report">\n                <div class="table-responsive">\n                    <div class="form-group form-with-icon input-with-search">\n                        <i class="micon-search icon-control" style="top:2px;"></i>\n                        <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                            <span>×</span>\n                        </button>\n                        <input type="text" autocapitalize="off" autocorrect="off" autocomplete="off" id="usersearch_key" class="form-control" placeholder="{{lang.search}}"/>\n                    </div>\n                    <table id="reportTable" class="table table-bordered table-striped summary-table">\n                        <thead>\n                        <tr>\n                            <th data-sort="string-ins" class=" default-sort">{{lang.name}}</th>\n                            <th data-sort="int" class="">{{lang.start_date}}</th>\n                            <th class="cell-table">\n                                <!-- NOTE: NEVER use th in this table if wanna trigger table sort -->\n                                <table class="table">\n                                    <tr>\n                                        <td colspan="2" class="center borderBottom "  data-param="#thBinders">{{lang.num_of_binders}}</td>\n                                    </tr>\n                                    <tr>\n                                        <td class="borderRight wp50 "  data-param="#thOwnedBinders">{{lang.owned}}</td>\n                                        <td class=""  data-param="#thInvitedBinders">{{lang.invited}}</td>\n                                    </tr>\n                                </table>\n                            </th>\n                            <th class="cell-table">\n                                <table class="table">\n                                    <tr>\n                                        <td colspan="2" class="center borderBottom "  data-param="#thMeets">{{lang.num_of_meets}}</td>\n                                    </tr>\n                                    <tr>\n                                        <td class="borderRight wp50 "  data-param="#thHostedMeets">{{lang.hosted}}</td>\n                                        <td class=""  data-param="#thInvitedMeets">{{lang.invited}}</td>\n                                    </tr>\n                                </table>\n                            </th>\n                            <th data-sort="int" class="">{{lang.num_of_contacts}}</th>\n                            <th data-sort="int" class="">{{lang.storage_used}}</th>\n                            <!-- hidden th/td for sort use -->\n                            <th id="thBinders" data-sort="int" class="hide">{{lang.num_of_binders}}</th>\n                            <th id="thOwnedBinders" data-sort="int" class="hide">{{lang.owned}}</th>\n                            <th id="thInvitedBinders" data-sort="int" class="hide">{{lang.invited}}</th>\n                            <th id="thMeets" data-sort="int" class="hide">{{lang.num_of_meets}}</th>\n                            <th id="thHostedMeets" data-sort="int" class="hide">{{lang.hosted}}</th>\n                            <th id="thInvitedMeets" data-sort="int" class="hide">{{lang.invited}}</th>\n                        </tr>\n                        </thead>\n\n                    </table>\n                </div>\n\n            </div>\n		</div>\n	</div>\n</div>\n';
}), define("text!template/admin/reportItem.html", [], function() {
    return '<tr>\n    <td data-sort-value="{{name}}">\n        <div class="cell-user">\n            <img src="{{avatar}}"/>\n            <div class="info">\n                <div class="info-name">\n                    {{name}}\n                </div>\n                <div class="info-email">\n                    {{email}}\n                </div>\n            </div>\n        </div>\n    </td>\n    <td data-sort-value="{{startDateSort}}">{{startDate}}</td>\n    <td class="cell-table">\n        <table class="table table-bordered">\n            <tr>\n                <td colspan="2" class="center borderBottom">{{binders}}</td>\n            </tr>\n            <tr>\n                <td class="borderRight wp50">{{ownedBinders}}</td>\n                <td>{{invitedBinders}}</td>\n            </tr>\n        </table>\n    </td>\n    <td class="cell-table">\n        <table class="table table-bordered">\n            <tr>\n                <td colspan="2" class="center borderBottom">{{meets}}</td>\n            </tr>\n            <tr>\n                <td class="borderRight wp50">{{hostedMeets}}</td>\n                <td>{{invitedMeets}}</td>\n            </tr>\n        </table>\n    </td>\n    <td data-sort-value="{{contactsSort}}">{{contacts}}</td>\n    <td data-sort-value="{{storageSort}}">{{storage}}</td>\n    <!-- hidden th/td for sort use -->\n    <td data-sort-value="{{bindersSort}}" class="hide">{{bindersSort}}</td>\n    <td data-sort-value="{{ownedBindersSort}}" class="hide">{{ownedBindersSort}}</td>\n    <td data-sort-value="{{invitedBindersSort}}" class="hide">{{invitedBindersSort}}</td>\n    <td data-sort-value="{{meetsSort}}" class="hide">{{meetsSort}}</td>\n    <td data-sort-value="{{hostedMeetsSort}}" class="hide">{{hostedMeetsSort}}</td>\n    <td data-sort-value="{{invitedMeetsSort}}" class="hide">{{invitedMeetsSort}}</td>\n</tr>\n';
}), define("text!template/admin/reportFooter.html", [], function() {
    return '<tfoot>\n<tr>\n    <th>{{lang.total}}</th>\n    <th>-</th>\n    <th class="cell-table">\n        <table class="table table-bordered">\n            <tr>\n                <th class="borderBottom borderRight">{{lang.owned}}</th>\n                <th class="borderBottom">{{lang.invited}}</th>\n            </tr>\n            <tr>\n                <td class="borderRight wp50">{{totalOwnedBinders}}</td>\n                <td>{{totalInvitedBinders}}</td>\n            </tr>\n        </table>\n    </th>\n    <th class="cell-table">\n        <table class="table table-bordered">\n            <tr>\n                <th class="borderBottom borderRight">{{lang.hosted}}</th>\n                <th class="borderBottom">{{lang.invited}}</th>\n            </tr>\n            <tr>\n                <td class="borderRight wp50">{{totalHostedMeets}}</td>\n                <td>{{totalInvitedMeets}}</td>\n            </tr>\n        </table>\n    </th>\n    <th>{{totalContacts}}</th>\n    <th>{{totalStorage}}</th>\n    <!-- hidden th/td for sort use -->\n    <th class="hide"></th>\n    <th class="hide"></th>\n    <th class="hide"></th>\n    <th class="hide"></th>\n    <th class="hide"></th>\n    <th class="hide"></th>\n</tr>\n</tfoot>\n';
}), define("admin/report", [ "moxtra", "lang", "text!template/admin/report.html", "text!template/admin/reportItem.html", "text!template/admin/reportFooter.html" ], function(a, b, c, d, e) {
    var f = function(a) {
        return Math.ceil(a / 1048576);
    }, g = function(a) {
        return a >= 1024 ? (a = Math.round(a / 1024 * 100) / 100, a + " GB") : a + " MB";
    }, h = function(a) {
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(a)) return a;
        var b = RegExp.$1, c = RegExp.$2, d = RegExp.$3, e = new RegExp();
        for (e.compile("(\\d)(\\d{3})(,|$)"); e.test(c); ) c = c.replace(e, "$1,$2$3");
        return [ b, c, d ].join("");
    };
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        events: {
            "keyup #usersearch_key": "onKeyUp"
        },
        init: function() {
            this.$scope.lang = b, this.$scope.groupName = MX.get("name", Moxtra.getMyGroup()), 
            this.footerTpl = Handlebars.compile(e);
        },
        rendered: function() {
            if (Moxtra.getMyGroup()) {
                this.$el.loading();
                var a = Moxtra.getMyGroup();
                this.showList(), this.recovery(function() {
                    var b = Moxtra.storage("integration");
                    b.get("group_id") && a.members.clear();
                });
            }
        },
        showList: function(a) {
            var c = Moxtra.getMyGroup(), e = this;
            this.list && this.list.destroy(), this.list = new Moxtra.SimpleList({
                tagName: "tbody",
                renderTo: this.$("#reportTable"),
                template: d,
                scrollElement: this.$(".mx-container"),
                emptyTemplate: b.empty_favorite_list,
                loadingTemplate: '<tr><td  class="mx-list-loading" colspan="20" ></td></tr>',
                $scope: {
                    lang: b
                },
                total_items: c.total_members,
                itemTag: "tr",
                onLoadNextPage: function(d, i, j) {
                    c.getTeamUsage(d, a || "").success(function(b) {
                        var c = [];
                        return _.each(b, function(a) {
                            c.push({
                                avatar: a.avatar,
                                name: a.user.name,
                                email: a.user.email,
                                startDate: moment(a.created_time).format("L"),
                                binders: h(a.user.boards_total),
                                ownedBinders: h(a.user.boards_owned),
                                invitedBinders: h(a.user.boards_invited),
                                meets: h(a.user.meet_hosted + a.user.meet_invited),
                                hostedMeets: h(a.user.meet_hosted),
                                invitedMeets: h(a.user.meet_invited),
                                contacts: h(a.user.contacts_total),
                                storage: g(f(a.user.total_cloud_size))
                            });
                        }), i(c), b.length < 10 ? (j.total_items = d - 2, i(), void (a || e.showFooter())) : void 0;
                    }).error(function() {
                        MX.ui.notifyError(b.need_refresh_browser);
                    }).complete(function() {
                        e.$el.loading(!1);
                    });
                }
            });
        },
        removeSearchKey: function() {
            var a = this.handleEvent;
            a.preventDefault();
            var b = $(a.target).closest(".form-group").find("input");
            b.val("").trigger("keyup").focus();
        },
        onKeyUp: function(a) {
            a.preventDefault();
            var b = $(a.target).val();
            b = $.trim(b), b.length ? (this.$(".input-close").removeClass("hide"), this.hideFooter()) : this.$(".input-close").addClass("hide"), 
            this.showList(b);
        },
        hideFooter: function() {
            this.$("#reportTable tfoot").remove();
        },
        showFooter: function() {
            var a = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = Moxtra.getMyGroup();
            _.each(i.availableUsers, function(b) {
                a += b.user.boards_owned, c += b.user.boards_invited, d += b.user.meet_hosted, e += b.user.meet_invited, 
                g += b.user.contacts_total, h += f(b.user.total_cloud_size);
            }), this.$("#reportTable").append(this.footerTpl({
                lang: b,
                totalOwnedBinders: a,
                totalInvitedBinders: c,
                totalHostedMeets: d,
                totalInvitedMeets: e,
                totalContacts: g,
                totalStorage: h
            }));
        },
        search: function() {}
    });
}), define("text!template/common/emailVerifyAlert.html", [], function() {
    return '<div class="maskAlert">\n    <div class="alert alert-warning fade in alertx-warning">\n        <button type="button" class="close" data-action="closeAlert" data-dismiss="alert" aria-hidden="true">&times;</button>\n      <span>\n            <div class="alert-content">\n            <h4 class="alert-heading">{{lang.settings_verify_email}}</h4>\n            {{lang.user_verify_email_undo_tip}}<strong>{{email}}</strong> {{lang.user_verify_email_undo_tip_2}}\n            </div>\n			<div class="alert-action">\n                <a href="javascript:;" data-action="checkVerifyStatus" class="btn btn-primary btn-sm">{{lang.user_verify_email_have_comfirmed}}</a>\n                <a href="javascript:;"  data-action="resendVerifyEmail" class="btn btn-default btn-sm " data-loading-text="{{lang.common_label_sending}}">{{lang.user_verify_email_resend_tip}}</a>\n                <a href="javascript:;" data-action="closeAlert" class="btn btn-default btn-sm">{{lang.remind_me_later}}</a>\n\n            </div>\n		</span>\n    </div>\n</div>';
}), define("common/emailVerifyAlert", [ "moxtra", "lang", "app", "text!template/common/emailVerifyAlert.html", "identity/identityBiz" ], function(a, b, c, d, e) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, this.opts = a;
        },
        resendVerifyEmail: function() {
            $(this.handleEvent.target);
            e.resendVerifyEmail().success(function() {
                MX.ui.notifySuccess(b.user_verify_email_resend_success);
            }).error(function() {
                MX.ui.notifyError(b.user_verify_email_resend_failed);
            });
        },
        checkVerifyStatus: function() {
            var a = this;
            Moxtra.getMe().email_verified ? (c.trigger("checkEmailVerifySuccess"), a.destroy()) : MX.ui.notifyError(b.user_email_not_verified);
        },
        closeAlert: function() {
            this.opts.status.set("closeEmailVerifyAlert", !0), this.destroy();
        }
    });
}), define("group/memberCollection", [ "moxtra", "group/groupUserModel" ], function(a, b) {
    return a.Collection.extend({
        model: b,
        fetch: function() {
            var a = MX.storage("integration", "sessionStorage"), b = a.get("group_id"), c = this;
            new MX.ChainObject(function() {
                MX.api(MX.format("/groups/{0}/members", b || "current"), "GET", null, this.callback, this);
            }).scope(this).success(this._parseData).error(function() {
                c.trigger("complete");
            });
        },
        comparator: function(a) {
            var b = a.get("displayName") || "";
            return b.toLowerCase();
        },
        _parseData: function(a) {
            a.data && (a = MX.filter(a.data, function(a) {
                return !a.is_deleted;
            }), this.reset(a, {
                parse: !0
            })), this.trigger("complete");
        }
    });
}), define("text!template/buy/changePlan.html", [], function() {
    return '<div class="payment-change-plan">\n	<div class="title">\n		<span class="pull-left marginRight5">{{lang.your_current_plan}}:</span> <strong class="pull-left">{{plan.name}}</strong>\n	</div>\n	<div class="title">\n		<span class="pull-left marginRight5">{{lang.your_billing_cycle}}:</span> <strong class="pull-left">{{plan.billingCycle}}</strong>\n	</div>\n	<div class="title">\n		<label class="mouse-hand fontNormal">\n	        {{lang.change_my_plan_to}}\n	    </label>\n	</div>\n	<div class="plan-selector">\n		{{#when planCode \'!=\' defines.std_monthly}}\n		<div>\n			<label class="mouse-hand fontNormal">\n                <input type="radio" name="plan" value="{{defines.std_monthly}}" data-action="choosePlan" data-param="std_monthly,{{defines.std_monthly}}"> {{lang.standard}} - {{lang.monthly}}\n                <span>({{prices.std_monthly}})</span>\n            </label>\n            <!-- <span><i class="glyphicon glyphicon-question-sign mouse-hand gray marginLeft10 size12"></i></span> -->\n		</div>\n		{{/when}}\n		{{#when planCode \'!=\' defines.std_annual}}\n		<div>\n			<label class="mouse-hand fontNormal">\n                <input type="radio" name="plan" value="{{defines.std_annual}}" data-action="choosePlan" data-param="std_annual,{{defines.std_annual}}" > {{lang.standard}} - {{lang.annual}}\n                <span>({{prices.std_annual}})</span>\n            </label>\n            <!-- <span><i class="glyphicon glyphicon-question-sign mouse-hand gray marginLeft10 size12"></i></span> -->\n		</div>\n		{{/when}}\n		{{#when planCode \'!=\' defines.pro_monthly}}\n		<div>\n			<label class="mouse-hand fontNormal">\n                <input type="radio" name="plan" value="{{defines.pro_monthly}}" data-action="choosePlan" data-param="pro_monthly,{{defines.pro_monthly}}" > {{lang.pro}} - {{lang.monthly}}\n                <span>({{prices.pro_monthly}})</span>\n            </label>\n            <!-- <span><i class="glyphicon glyphicon-question-sign mouse-hand gray marginLeft10 size12"></i></span> -->\n		</div>\n		{{/when}}\n		{{#when planCode \'!=\' defines.pro_annual}}\n		<div>\n			<label class="mouse-hand fontNormal">\n                <input type="radio" name="plan" value="{{defines.pro_annual}}" data-action="choosePlan" data-param="pro_annual,{{defines.pro_annual}}" > {{lang.pro}} - {{lang.annual}}\n                <span>({{prices.pro_annual}})</span>\n            </label>\n            <!-- <span><i class="glyphicon glyphicon-question-sign mouse-hand gray marginLeft10 size12"></i></span> -->\n		</div>\n		{{/when}}\n	</div>\n	<div class="plan-grade-tips">\n		<div class="section downgrade-tip hide">\n			<div class="alert alert-danger">\n				<span>\n					{{lang.plan_downgrade_alert}}\n				</span>\n			</div>\n		</div>\n		<div class="section upgrade-tip hide">\n			<div class="alert alert-success">\n				<span>\n					{{lang.paln_upgrade_alert}}\n				</span>\n			</div>\n		</div>\n	</div>\n</div>';
}), define("buy/changePlan", [ "moxtra", "lang", "text!template/buy/changePlan.html", "buy/helper" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        title: b.change_plan,
        buttons: [ {
            text: b.cancel,
            className: "btn-default",
            click: "onClickCancel"
        }, {
            id: "btnChangePlan",
            loadingText: b.changing_ellipsis,
            text: b.change,
            className: "btn-primary",
            click: "onClickChange"
        } ],
        init: function(a) {
            this.rawPlanCode = a.planCode, this.planCode = a.planCode, this.onActionDone = a.onActionDone, 
            this.$scope.lang = b, this.$scope.planCode = a.planCode, this.$scope.plan = d.planDetail(a.planCode), 
            this.$scope.defines = d.planDefines(), this.$scope.prices = d.getPrices();
        },
        rendered: function() {},
        choosePlan: function(a, b) {
            if (!d.planValid(b)) return void (this.planCode = this.rawPlanCode);
            this.planCode = b;
            var c = d.checkGrade(this.rawPlanCode, this.planCode);
            switch (this.$(".plan-grade-tips .section").addClass("hide"), c) {
              case -1:
                this.$(".downgrade-tip").removeClass("hide");
                break;

              case 0:
                break;

              case 1:
                this.$(".upgrade-tip").removeClass("hide");
            }
        },
        onClickCancel: function() {
            this.dialog.close();
        },
        onClickChange: function() {
            var a = this;
            this.planCode == this.rawPlanCode ? (this.dialog.close(), MX.ui.notifyInfo(b.keep_current_plan)) : (this.dialog.progress(), 
            this.dialog.getButton("btnChangePlan").button("loading"), Moxtra.changeStripePlan(this.planCode).success(function() {
                a.dialog.close(), a.onActionDone && a.onActionDone(a.planCode), MX.ui.notifySuccess(b.change_plan_success);
            }).error(function() {
                MX.ui.notifyError(b.change_plan_failed);
            }).complete(function() {
                a.dialog.progress(!1), a.dialog.getButton("btnChangePlan").button("reset");
            }));
        }
    });
}), define("admin/admin", [ "moxtra", "lang", "text!template/group/admin.html", "text!template/group/memberListHeader.html", "app", "const", "common/groupCap", "common/loadingDialog", "group/user", "admin/settings", "admin/branding", "admin/configuration", "admin/report", "common/emailVerifyAlert", "group/groupModel", "group/memberCollection", "buy/changePlan", "buy/helper", "group/groupBiz" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    "use strict";
    var s = {
        user: i,
        report: m,
        settings: j,
        salesforce: j.extend({
            name: "GROUP_INTEGRATION_SALESFORCE"
        }),
        branding: k,
        configuration: l
    }, t = Handlebars.compile(d), u = MX.logger("admin");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, $(this.container).addClass("mx-layout-three");
        },
        rendered: function() {
            var a = e.request.page(), c = this, d = e.integration && e.integration.get("group_id") || "", h = function(a, b) {
                b ? c.$("#" + a).removeClass("hide") : (c.$("#" + a).remove(), delete s[a]);
            };
            d ? Moxtra.loadGroupInfo(d).success(function(a) {
                var b = a.group_caps;
                h("settings", b.is_enterprise && b.has_saml), h("salesforce", !1), h("branding", b.has_branding), 
                h("configuration", b.has_configuration), c.listenTo(e.request, "change:page", c.showSubView), 
                c.group = a, Moxtra.getMe().subscribe(), c.showSubView();
            }).error(function() {}) : Moxtra.onReady(function() {
                var i, j, k = Moxtra.getMe(), l = [ f.group.userRole.admin, f.group.userRole.owner ];
                if (i = k.groupId, j = k.groupAccessType, !(d || i && -1 !== l.indexOf(j))) return void e.request.navigate("timeline", null, null, null);
                c.group = Moxtra.getMyGroup(), c.collection = Moxtra.getGroupMembers(c.group.id), 
                c.recovery(c.collection), a || (a = "user", e.request.page(a, !1)), c.listenTo(c.collection, "inited", c.updateLicenses), 
                c.listenTo(c.collection, "add", function() {
                    c.updateLicenses();
                }), c.listenTo(c.collection, "remove", function() {
                    c.updateLicenses();
                }), c.listenToOnce(c.group, "success", function(a) {
                    "admin" === e.integration.get("type") && $(".adminTitle").text(a.get("name") || b.group_admin);
                });
                var m = c.collection && c.collection.length;
                100 >= m && m > 0 && h("report", !0), d || (h("settings", g.hasSaml()), h("salesforce", g.hasSF()), 
                h("branding", g.hasBranding()), h("configuration", g.hasConfiguration()), c.listenTo(e.request, "change:page", c.showSubView), 
                c.showSubView());
            }), Moxtra.verifyToken({
                subscribe: !1
            }).success(function() {
                var a = Moxtra.getMe();
                if (a.email_verified) e.trigger("checkEmailVerifySuccess"); else if (!e.status.get("closeEmailVerifyAlert")) {
                    var b = new n({
                        parent: c,
                        renderTo: document.body,
                        mask: $(".page-body"),
                        status: e.status
                    });
                    c.recovery(b);
                }
            });
        },
        showSubView: function() {
            this._showSubView(), this.highlight();
        },
        _showSubView: function(a) {
            var b = this.subView;
            a = a || e.request.page(), s[a] || (a = "user", e.request.page(a, !1));
            var c = s[a];
            if (c) {
                if (b) if (b instanceof c) {
                    if (b.name === c.name) return;
                    this.subView.destroy(), b.destroy();
                } else this.subView.destroy(), b.destroy();
                $("#mxPageBody_Col_2").empty(), b = this.subView = new c({
                    parent: this,
                    collection: this.collection,
                    renderTo: "#mxPageBody_Col_2",
                    model: this.group
                }), this.recovery(b);
            }
        },
        highlight: function() {
            var a, b = e.request.page(), c = this.currPage, d = this;
            return u.debug("highlight", c, b), "upgrade" === b && (b = "billing"), c && c !== b && this.$("#" + c).removeClass("active"), 
            b && (a = d.$("#" + b), a.addClass("active")), this.currPage = b, a;
        },
        setCurrSubView: function(a) {
            e.request.page(a, !1);
        },
        updateLicenses: function() {
            var a = this.group;
            "" === a.get("id") && a.on("change", $.proxy(this.updateLicenses, this)), this.userCount = a.total_members;
            var c = a.get("plan_code"), d = this.userCount, g = MX.filter(this.collection, function(a) {
                return a.isActive;
            }), h = MX.filter(this.collection, function(a) {
                return !a.isActive && !a.isPending;
            }), i = MX.filter(this.collection, function(a) {
                return a.isPending;
            });
            $(".admin-user .admin-header").html($(t({
                lang: b,
                isDebug: !e.config.global.mx_production,
                group: {
                    name: a.get("name"),
                    plan: r.planDetail(c),
                    showChange: a.get("isOwner") && a.get("status") === f.group.status.normal,
                    showUpgrade: a.get("isOwner") && a.get("status") !== f.group.status.normal,
                    totalUsers: d,
                    activeUsers: g && g.length || 0,
                    inactiveUsers: h && h.length || 0,
                    pendingUsers: i && i.length || 0
                }
            })));
        },
        changePlan: function() {
            var a = this, c = new q({
                planCode: this.group.get("plan_code"),
                onActionDone: function(b) {
                    a.group.set("plan_code", b), a.updateLicenses();
                }
            });
            if (this.recovery(c), r.getPrices().length) this.recovery(new MX.ui.Dialog({
                content: c
            })); else {
                var d = h.genDialog({
                    title: b.change_plan
                });
                Moxtra.getStripeAvailablePlans().success(function(a) {
                    r.setPrices(a), d.push({
                        content: c
                    });
                }).error(function() {
                    MX.ui.notifyError(b.need_refresh_browser), d.close();
                });
            }
        },
        purchase: function() {
            e.request.navigate("upgrade", null, null, null);
        }
    });
}), define("text!template/admin/billing.html", [], function() {
    return '<div class="billing mx-scroll">\n    <div class="admin-header">\n        <table>\n            <tr class="title">\n                <td width="200"> {{lang.active_licenses}}</td>\n                <td>  {{lang.billing_plan}}</td>\n            </tr>\n            <tr>\n                <td id="Licenses"> 1/10</td>\n                <td id="planCode">  {{userBillingPlan}}</td>\n            </tr>\n        </table>\n    </div>\n    <div class="billing-wrap admin-body">\n        <div class="panel-group" id="accordion">\n\n            <div class="panel panel-default">\n                <div class="panel-heading">\n                        <a data-toggle="collapse" data-action="showBillingInfo"  data-parent="#accordion" href="#billingUpdate">\n                            {{lang.billing_information}}\n                        </a>\n                </div>\n                <div id="billingUpdate" class="panel-collapse collapse">\n                    <div class="panel-body mx-upgrade">\n\n                    </div>\n                </div>\n            </div>\n            <div class="panel panel-default">\n                <div class="panel-heading">\n                        <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">\n                            {{lang.cancel_plan}}\n                        </a>\n                </div>\n                <div id="collapseThree" class="panel-collapse collapse">\n                    <div class="panel-body">\n                        {{lang.cancel_plan_message}}\n                        <form id="cancelService" class="form-horizontal" role="form">\n                            <div class=" col-sm-10">\n                            <div class="form-group">\n                                <textarea name="text" class="form-control vertResize"  rows="3"></textarea>\n                            </div></div>\n\n                            <div class="form-group">\n                                <div class="col-sm-10">\n                                    <button type="submit" class="btn btn-primary">{{lang.cancel_service}}</button>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';
}), define("admin/salesforceItem", [ "moxtra", "lang", "text!template/admin/billing.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {
            new MX.Form({
                parent: this,
                form: this.$("#salesforceForm"),
                model: this.model,
                submit: this.saveSelesforce,
                scope: this
            });
        }
    });
}), define("text!template/buy/billing.html", [], function() {
    return '<div class="mx-container payment-plan-and-billing">\n	<div class="payment-load-error">\n		\n	</div>\n	<div class="payment-plan">\n		\n	</div>\n	<div class="payment-billing">\n		\n	</div>\n	<div class="payment-cancel">\n		\n	</div>\n</div>';
}), define("text!template/buy/billing/error.html", [], function() {
    return '<div class="padding15">\n	<div class="alert alert-warning">\n		<div>{{lang.need_refresh_browser}}</div>\n		<div class="paddingTop5"><a class="btn btn-default btn-primary btn-sm" data-action="tryAgain">{{lang.try_again}}</a></div>\n	</div>\n</div>';
}), define("text!template/buy/billing/plan.html", [], function() {
    return '<div class="">\n	<div class="col-sm-12 section">\n		<h4>{{plan.name}} - {{plan.billingCycle}}</h4>\n	</div>\n	<div class="col-sm-12 section">\n		<span class="pull-left">\n			{{lang.seats_used}}: <strong>{{quantity}}</strong>\n		</span>\n		<span class="pull-right">\n			{{#if planCode}}\n			<a class="mouse-hand btn btn-primary btn-xs" data-action="changePlan" data-param="{{planCode}}">{{lang.change}}</a>\n			{{/if}}\n		</span>\n	</div>\n	<div class="col-sm-12">\n		<hr />\n	</div>\n</div>';
}), define("buy/billing/plan", [ "moxtra", "lang", "text!template/buy/billing/plan.html", "common/loadingDialog", "buy/changePlan", "buy/helper" ], function(a, b, c, d, e, f) {
    var g = Handlebars.compile(c);
    return a.Controller.extend({
        tagName: "div",
        handleAction: !0,
        init: function(a) {
            this.subscription = a.subscription || {}, this.parent = a.parent;
        },
        rendered: function() {
            this._update();
        },
        changePlan: function(a) {
            var c = this, g = new e({
                planCode: a,
                onActionDone: function(a) {
                    c._update(a), c.parent.onPlanChanged();
                }
            });
            if (this.recovery(g), f.getPrices().length) new MX.ui.Dialog({
                content: g
            }); else {
                var h = d.genDialog({
                    title: b.change_plan
                });
                Moxtra.getStripeAvailablePlans().success(function(a) {
                    f.setPrices(a), h.push({
                        content: g
                    });
                }).error(function() {
                    MX.ui.notifyError(b.need_refresh_browser), h.close();
                });
            }
        },
        _update: function(a) {
            a = a || MX.get("plan.id", this.subscription) || "";
            var c = MX.get("quantity", this.subscription);
            this.$el.empty(), this.$el.html($(g({
                lang: b,
                planCode: a,
                plan: f.planDetail(a),
                quantity: c
            })));
        }
    });
}), define("text!template/buy/billing/card.html", [], function() {
    return '<div class="card-info">\n	<div class="col-sm-12">\n		<ul>\n			<li><h4>{{lang.payment}}</h4></li>\n			<li>\n				<div class="clearfix item">\n					<span class="pull-left">{{lang.recurring_amount}}:</span>\n					<span class="pull-right">{{currency}} {{amount}}</span>\n				</div>\n			</li>\n			<li>\n				<div class="clearfix item">\n					<span class="pull-left">{{lang.last_payment_date}}:</span>\n					<span class="pull-right">{{lastPayDate}}</span>\n				</div>\n			</li>\n			<li>\n				<div class="clearfix item">\n					<span class="pull-left">{{lang.next_payment_date}}:</span>\n					<span class="pull-right">{{nextPayDate}}</span>\n				</div>\n			</li>\n			<li>\n				<div class="clearfix item">\n					<span class="pull-left">{{card}}</span>\n					<span class="pull-right">\n						<a class="mouse-hand btn btn-default btn-xs edit-card" data-action="editCard">{{lang.edit}}</a>\n						<a class="mouse-hand btn btn-default btn-xs reload-card hide" data-action="reloadCard">{{lang.refresh}}</a>\n					</span>\n				</div>\n			</li>\n		</ul>\n	</div>\n</div>';
}), define("text!template/buy/payForm.html", [], function() {
    return '<form id="payForm" class="form-horizontal {{#if editable}}editable{{/if}}" role="form">\n	<div class="form-group">\n		<input type="text" size="20" name="number" data-error-style="inline" class="form-control pull-left" style="width: 72%;" placeholder="{{lang.card_number}}" data-stripe="number"/>\n		<input type="text" size="4" name="cvc" data-error-style="inline" class="form-control pull-right" style="width: 25%;" placeholder="{{lang.cvc}}" data-stripe="cvc"/>\n	</div>\n	<div class="form-group">\n		<span class="pull-left" style="width: 48%;display: inline-block;padding-top: 10px;">{{lang.expiration_date}}: </span>\n		<select name="exp_month" data-error-style="inline" class="form-control pull-left" style="width: 24%;">\n			<option value="">{{lang.month}}</option>\n			<option value="01">1</option>\n			<option value="02">2</option>\n			<option value="03">3</option>\n			<option value="04">4</option>\n			<option value="05">5</option>\n			<option value="06">6</option>\n			<option value="07">7</option>\n			<option value="08">8</option>\n			<option value="09">9</option>\n			<option value="10">10</option>\n			<option value="11">11</option>\n			<option value="12">12</option>\n		</select>\n		<select name="exp_year" data-error-style="inline" class="form-control pull-right" style="width: 25%;">\n			<option value="">{{lang.year}}</option>\n			<option value="2014">2014</option>\n			<option value="2015">2015</option>\n			<option value="2016">2016</option>\n			<option value="2017">2017</option>\n			<option value="2018">2018</option>\n			<option value="2019">2019</option>\n			<option value="2020">2020</option>\n			<option value="2021">2021</option>\n			<option value="2022">2022</option>\n			<option value="2023">2023</option>\n			<option value="2024">2024</option>\n			<option value="2025">2025</option>\n			<option value="2026">2026</option>\n			<option value="2027">2027</option>\n			<option value="2028">2028</option>\n			<option value="2029">2029</option>\n			<option value="2030">2030</option>\n		</select>\n	</div>\n	<div class="form-group">\n		<input type="text" name="address_line1" data-error-style="inline" class="form-control" placeholder="{{lang.address}}" data-stripe="address_line1"/>\n	</div>\n	<div class="form-group">\n		<input type="text" name="address_line2" data-error-style="inline" class="form-control" placeholder="{{lang.apt_or_suite}}" data-stripe="address_line2"/>\n	</div>\n	<div class="form-group">\n		<input type="text" name="address_city" data-error-style="inline" class="form-control" placeholder="{{lang.city}}" data-stripe="address_city"/>\n	</div>\n	<div class="form-group">\n		<input type="text" name="address_state" data-error-style="inline" class="form-control pull-left" style="width: 72%;" placeholder="{{lang.state}}" data-stripe="address_state"/>\n		<input type="text" name="address_zip" data-error-style="inline" class="form-control pull-right" style="width: 25%;" placeholder="{{lang.zip}}" data-stripe="address_zip"/>\n	</div>\n</form>';
}), define("buy/payModel", [ "moxtra" ], function(a) {
    return a.Model.extend({
        idAttribute: "number",
        defaults: {
            number: "",
            cvc: "",
            exp_month: "",
            exp_year: "",
            address_line1: "",
            address_line2: "",
            address_city: "",
            address_state: "",
            address_zip: ""
        },
        validation: {
            cvc: [ {
                required: !0,
                msg: "Please enter CVC number"
            }, {
                fn: function(a) {
                    return !Stripe.card.validateCVC(a);
                },
                msg: "CVC invalid"
            } ],
            number: [ {
                required: !0,
                msg: "Please enter card number"
            }, {
                fn: function(a) {
                    return !Stripe.card.validateCardNumber(a);
                },
                msg: "Card number invalid"
            } ],
            exp_year: [ {
                required: !0,
                msg: "Please select expiration year"
            }, {
                fn: function(a) {
                    var b = this.attributes.exp_month;
                    return !Stripe.card.validateExpiry(b, a);
                },
                msg: "Expiration date invalid"
            } ],
            exp_month: [ {
                required: !0,
                msg: "Please select expiration month"
            }, {
                fn: function(a) {
                    var b = this.attributes.exp_year;
                    return !Stripe.card.validateExpiry(a, b);
                },
                msg: "Expiration date invalid"
            } ]
        }
    });
}), define("buy/payForm", [ "moxtra", "lang", "text!template/buy/payForm.html", "buy/payModel" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: c,
        init: function(a) {
            a = a || {}, this.$scope.lang = b, this.$scope.editable = a.editable || !1, this.model = new d(), 
            a.card && this.model.set(a.card), (a.editable || !a.renderTo) && _.extend(this, a);
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                form: this.$el,
                model: this.model,
                submit: function() {},
                scope: this
            });
        },
        submit: function(a) {
            this.isValid() && (this.model.set("name", Moxtra.getMe().email), Moxtra.createStripeToken(this.model.toJSON(), a.planCode).success(function(b) {
                a.success && a.success(b);
            }).error(function() {
                a.error && a.success();
            }));
        },
        isValid: function() {
            return this.model.isValid(!0);
        },
        onActionDone: function() {},
        onActionBegin: function() {},
        onClickUpdate: function() {
            if (this.isValid()) {
                this.onActionBegin();
                var a = this, b = this.model.toJSON();
                Moxtra.updateCreditCard(b).success(function() {
                    a.onActionDone({
                        code: "SUCCESS"
                    });
                }).error(function() {
                    a.onActionDone({
                        code: "ERROR"
                    });
                });
            }
        }
    });
}), define("buy/billing/card", [ "moxtra", "lang", "text!template/buy/billing/card.html", "buy/payForm" ], function(a, b, c, d) {
    var e = Handlebars.compile(c);
    return a.Controller.extend({
        tagName: "div",
        handleAction: !0,
        init: function(a) {
            this.subscription = a.subscription || {}, this.card = a.card || {}, this.parent = a.parent;
        },
        rendered: function() {
            this._update();
        },
        editCard: function() {
            var a = {}, c = this;
            MX.each([ "name", "exp_month", "exp_year", "address_line1", "address_line2", "address_city", "address_state", "address_zip" ], function(b) {
                c.card[b] && (a[b] = c.card[b]);
            }), a.name || (a.name = Moxtra.getMe().email);
            var e = new d({
                editable: !0,
                card: a,
                title: b.edit_credit_card,
                buttons: [ {
                    text: b.cancel,
                    className: "btn-default",
                    click: function() {
                        this.close();
                    }
                }, {
                    id: "btnUpdateCard",
                    loadingText: b.updating_ellipsis,
                    text: b.update,
                    className: "btn-primary",
                    click: "onClickUpdate"
                } ],
                onActionBegin: function() {
                    this.dialog.getButton("btnUpdateCard").button("loading"), this.dialog.progress();
                },
                onActionDone: function(a) {
                    a = a || {}, this.dialog.progress(!1), "SUCCESS" === a.code ? (this.dialog.close(), 
                    MX.ui.notifySuccess(b.edit_credit_card_success), c._reload()) : (this.dialog.getButton("btnUpdateCard").button("reset"), 
                    MX.ui.notifyError(b.edit_credit_card_failed));
                }
            });
            this.recovery(e), new MX.ui.Dialog({
                width: 350,
                content: e
            });
        },
        handleError: function() {
            this.$(".edit-card").addClass("hide"), this.$(".reload-card").removeClass("hide");
        },
        reloadCard: function() {
            this.parent.onPlanChanged();
        },
        _update: function() {
            var a = {
                usd: "$"
            }, c = MX.get("plan.amount", this.subscription) / 100, d = MX.get("plan.currency", this.subscription) || "usd", f = moment(1e3 * this.subscription.current_period_start).format("M/D/YY"), g = moment(1e3 * this.subscription.current_period_end).format("M/D/YY"), h = MX.format("{0}: ****-{1}", this.card.brand, this.card.last4);
            this.$el.empty(), this.$el.html($(e({
                lang: b,
                currency: a[d],
                amount: c,
                lastPayDate: f,
                nextPayDate: g,
                card: h
            })));
        },
        _reload: function() {
            this.$el.loading({
                top: 200
            }), this.$("a.edit-card").addClass("disabled");
            var a = this;
            Moxtra.getStripeCustomer().success(function(b) {
                a.subscription = MX.get("subscriptions.data.0", b) || {}, a.card = MX.get("cards.data.0", b), 
                a._update();
            }).error(function() {
                MX.ui.notifyError(b.load_credit_card_failed), a.handleError();
            }).complete(function() {
                a.$el.loading(!1);
            });
        }
    });
}), define("text!template/buy/billing/cancel.html", [], function() {
    return '<div class="">\n	<div class="col-sm-12">\n		<a class="mouse-hand pull-left marginTop15" data-action="toggleForm">{{lang.cancel_plan}}</a>\n	</div>\n	<div class="cancel-form marginTop5 hide">\n		<div class="col-sm-12 marginTop5">\n			<hr />\n		</div>\n		<div class="col-sm-12">\n			<div>{{lang.cancel_plan_message}}</div>\n			<textarea class="marginTop5 vertResize"></textarea>\n		</div>\n		<div class="col-sm-12">\n			<a class="btn btn-default btn-xs pull-right marginTop15" data-action="cancelService">{{lang.cancel}}</a>\n		</div>\n		<div class="col-sm-12">\n			<br/> <br/>\n		</div>\n	</div>\n</div>';
}), define("buy/billing/cancel", [ "moxtra", "lang", "text!template/buy/billing/cancel.html", "user/userBiz", "group/groupBiz" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {},
        toggleForm: function() {
            var a = this.$(".cancel-form");
            a.hasClass("hide") ? a.removeClass("hide") : a.addClass("hide");
        },
        cancelService: function() {
            var a = this.$("textarea").val();
            MX.ui.Confirm(b.confirm_cancel_service, function() {
                d.sendFeedback(a).success(function() {}).error(function() {});
            });
        }
    });
}), define("buy/billing", [ "moxtra", "lang", "text!template/buy/billing.html", "text!template/buy/billing/error.html", "buy/billing/plan", "buy/billing/card", "buy/billing/cancel" ], function(a, b, c, d, e, f, g) {
    var h = Handlebars.compile(d);
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {},
        rendered: function() {
            this._load();
        },
        _load: function() {
            var a = this;
            this.$(".payment-load-error").empty(), this.$el.loading({
                top: 100,
                length: 15
            }), Moxtra.getStripeCustomer().success(function(b) {
                var c = MX.get("subscriptions.data.0", b), d = MX.get("cards.data.0", b);
                a.recovery(new e({
                    parent: a,
                    subscription: c,
                    renderTo: ".payment-plan"
                })), a.cardView = new f({
                    parent: a,
                    subscription: c,
                    card: d,
                    renderTo: ".payment-billing"
                }), a.recovery(a.cardView), a.recovery(new g({
                    renderTo: ".payment-cancel"
                }));
            }).error(function() {
                a.$(".payment-load-error").html($(h({
                    lang: b
                })));
            }).complete(function() {
                a.$el.loading(!1);
            });
        },
        tryAgain: function() {
            this._load();
        },
        onPlanChanged: function() {
            var a = this;
            this.$el.loading({
                top: 100,
                length: 15
            }), Moxtra.getStripeCustomer().success(function(b) {
                var c = MX.get("subscriptions.data.0", b), d = MX.get("cards.data.0", b);
                a.$(".payment-billing").empty(), a.cardView = new f({
                    parent: a,
                    subscription: c,
                    card: d,
                    renderTo: ".payment-billing"
                }), a.recovery(a.cardView);
            }).error(function() {
                a.cardView && (MX.ui.notifyError(b.load_credit_card_failed), a.cardView.handleError());
            }).complete(function() {
                a.$el.loading(!1);
            });
        }
    });
}), define("text!template/buy/pricing.html", [], function() {
    return '<div class="alert alert-pricing">\n	{{#if inactive}}\n	<h4 class="plan" >{{plan.name}}</h4>\n	{{else}}\n	<div class="dropdown">\n		<h4 class="plan mouse-hand" data-toggle="dropdown" data-placement="bottom">{{plan.name}} <span class="caret"></h4>\n		<ul class="dropdown-menu" aria-labelledby="" style="left: 50%; margin-left: -80px; text-align: right;">\n			<li><a class="mouse-hand" data-action="changePlan" data-param="{{plans.std_annual}}">{{lang.standard}} - {{lang.annual}}</a></li>\n			<li><a class="mouse-hand" data-action="changePlan" data-param="{{plans.std_monthly}}">{{lang.standard}} - {{lang.monthly}}</a></li>\n			<li class="divider"></li>\n			<li><a class="mouse-hand" data-action="changePlan" data-param="{{plans.pro_annual}}">{{lang.pro}} - {{lang.annual}}</a></li>\n			<li><a class="mouse-hand" data-action="changePlan" data-param="{{plans.pro_monthly}}">{{lang.pro}} - {{lang.monthly}}</a></li>\n		</ul>\n	</div>\n	{{/if}}\n	<div><strong>{{plan.price}}</strong></div>\n	<div>{{plan.billingCycle}}</div>\n	<br />\n	<div class="plan-detail"></div>\n</div>';
}), define("text!template/buy/pricing/std.html", [], function() {
    return "<div>\n	<ul>\n		<li>{{lang.plan_desc_messaging}}</li>\n		<li>{{lang.plan_desc_binder}}</li>\n		<li>{{lang.plan_desc_page}}</li>\n		<li>{{lang.plan_desc_meet_limited}}</li>\n		<li>{{lang.plan_desc_storage_10G}}</li>\n		<li>{{lang.plan_desc_search}}</li>\n		<li><br /></li>\n		<li>{{lang.plan_desc_team_management}}</li>\n		<li>{{lang.plan_desc_team_ownership}}</li>\n		<li>{{lang.plan_desc_team_shelf}}</li>\n		<li>{{lang.plan_desc_team_usage}}</li>\n	</ul>\n</div>";
}), define("text!template/buy/pricing/pro.html", [], function() {
    return "<div>\n	<ul>\n		<li>{{lang.plan_desc_messaging}}</li>\n		<li>{{lang.plan_desc_binder}}</li>\n		<li>{{lang.plan_desc_page}}</li>\n		<li>{{lang.plan_desc_meet}}</li>\n		<li>{{lang.plan_desc_storage_1T}}</li>\n		<li>{{lang.plan_desc_search}}</li>\n		<li><br /></li>\n		<li>{{lang.plan_desc_team_management}}</li>\n		<li>{{lang.plan_desc_team_ownership}}</li>\n		<li>{{lang.plan_desc_team_shelf}}</li>\n		<li>{{lang.plan_desc_team_usage}}</li>\n	</ul>\n</div>";
}), define("buy/pricing", [ "moxtra", "lang", "text!template/buy/pricing.html", "text!template/buy/pricing/std.html", "text!template/buy/pricing/pro.html", "buy/helper" ], function(a, b, c, d, e, f) {
    var g = Handlebars.compile(c), h = Handlebars.compile(d), i = Handlebars.compile(e), j = {};
    return j[Moxtra.const.STANDARD_MONTHLY] = h, j[Moxtra.const.STANDARD_ANNUAL] = h, 
    j[Moxtra.const.PRO_MONTHLY] = i, j[Moxtra.const.PRO_ANNUAL] = i, a.Controller.extend({
        tagName: "div",
        handleAction: !0,
        init: function(a) {
            this.plan_code = a.plan_code, this.parent = a.parent;
        },
        rendered: function() {
            var a = this, b = f.getPrices();
            b.length ? this._update() : (this.$el.loading(), Moxtra.getStripeAvailablePlans().success(function(b) {
                f.setPrices(b), a._update();
            }).error(function() {
                a._update();
            }).complete(function() {
                a.$el.loading(!1);
            }));
        },
        changePlan: function(a) {
            this.plan_code = a, this.parent.setPlan(a), this._update();
        },
        inActive: function() {
            this._update(!0);
        },
        _update: function(a) {
            a = a || !1, this.$el.empty(), this.$el.append($(g({
                lang: b,
                inactive: a,
                plan: f.planDetail(this.plan_code),
                plans: f.planDefines()
            })));
            var c = this, d = j[this.plan_code];
            setTimeout(function() {
                c.$(".plan-detail").html($(d({
                    lang: b
                })));
            }, 100);
        }
    });
}), define("text!template/buy/upgrade.html", [], function() {
    return '<div class="container2">\n	<h1 class="page-title">{{title}}</h1>\n	\n	<div class="col-md-6 upgrade-form">\n		\n	</div>\n	<div class="col-md-6 upgrade-pricing">\n		\n	</div>\n</div>';
}), define("text!template/buy/purchaseComplete.html", [], function() {
    return '<div>\n	<h4>{{lang.purchase_complete}}</h4>\n	<br />\n	<div>\n		{{lang.purchase_complete_welcome}}\n	</div>\n	<br/>\n	<div>\n		<a class="btn btn-primary" data-action="gotoBilling">{{lang.go_to_my_account}}</a>\n	</div>\n</div>';
}), define("text!template/buy/upgradeForm.html", [], function() {
    return '<div class="upgrade-form-wrap">\n	<div class="section">\n		<form id="companyForm" class="form-horizontal" role="form">\n			<div class="form-group">\n				<span>{{lang.email}}: <strong style="word-break: break-all;">{{info.email}}</strong></span>\n			</div>\n			{{#if info.groupName}}\n			<div class="form-group">\n				<span>{{lang.company_name}}: <strong style="word-break: break-all;">{{info.groupName}}</strong></span>\n				<input type="hidden" name="company" value="{{info.groupName}}">\n			</div>\n			{{else}}\n			<div class="form-group">\n				<input type="text" name="company" class="form-control" data-error-style="inline" placeholder="{{lang.company_name}}" autofocus>\n			</div>\n			{{/if}}\n		</form>\n	</div>\n	\n	<div class="section pay-form">\n		\n	</div>\n	\n	<div class="paddingTop5">\n		<span>{{bbcode lang.signup_disclaimer}}</span>\n	</div>\n	\n	<div class="paddingTop5">\n		<button id="upgradeSubscribe" class="btn btn-lg btn-primary btn-block" data-action="subscribe" data-loading-text="{{lang.subscribing_ellipsis}}">{{lang.subscribe}}</button>\n	</div>\n</div>\n';
}), define("buy/upgradeForm", [ "moxtra", "lang", "const", "text!template/buy/upgradeForm.html", "buy/payForm" ], function(a, b, c, d, e) {
    var f = a.Model.extend({
        idAttribute: "id",
        defaults: {
            id: "",
            company: ""
        },
        validation: {
            company: {
                required: !0,
                msg: "Please enter company name"
            }
        }
    });
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.parent = a.parent;
            var c = Moxtra.getMe(), d = a.group || Moxtra.getMyGroup() || {}, e = d.id && d.name || "";
            MX.isString(e) || (e = ""), this.companyModel = new f(), this.companyModel.set({
                id: d.id || "",
                company: e
            }, {
                silent: !0
            }), this.$scope.lang = b, this.$scope.info = {
                email: c.email,
                groupName: e
            };
        },
        rendered: function() {
            this.payForm = new e({
                renderTo: ".pay-form"
            }), this.recovery(this.payForm), this.companyForm = new a.Form({
                parent: this,
                form: this.$("#companyForm"),
                model: this.companyModel,
                submit: function() {},
                scope: this
            });
        },
        subscribe: function() {
            var a = this;
            if (this.companyModel.isValid(!0) && this.payForm.isValid()) if (this._btnLoading(), 
            this.companyModel.get("id")) a._purchase(); else {
                var c = new Moxtra.model.Group();
                c.set("name", this.companyModel.get("company")), c.set("plan_code", this.parent.getPlan()), 
                c.create().success(function() {
                    a.companyModel.set({
                        id: c.id
                    }, {
                        silent: !0
                    }), a._purchase();
                }).error(function() {
                    MX.ui.notifyError(b.buy_subscribe_failed), a._btnLoading(!1);
                });
            }
        },
        _purchase: function() {
            var a = this;
            this.payForm.submit({
                planCode: a.parent.getPlan(),
                success: function(d) {
                    var e, f = Moxtra.getMyGroup() || {};
                    e = f.status || MX.get("object.group.status", d), e === c.group.status.normal ? (a.parent.complete(), 
                    MX.ui.notifySuccess(b.buy_subscribe_success)) : MX.ui.notifyError(b.buy_subscribe_failed), 
                    a._btnLoading(!1);
                },
                error: function() {
                    MX.ui.notifyError(b.buy_subscribe_failed), a._btnLoading(!1);
                }
            });
        },
        _btnLoading: function(a) {
            this.$("#upgradeSubscribe").button(a === !1 ? "reset" : "loading");
        }
    });
}), define("buy/upgrade", [ "moxtra", "lang", "app", "const", "text!template/buy/upgrade.html", "text!template/buy/purchaseComplete.html", "common/signupForm", "buy/upgradeForm", "buy/pricing", "buy/helper" ], function(a, b, c, d, e, f, g, h, i, j) {
    var k = Handlebars.compile(f);
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function() {
            return c.config.global.mx_production ? void c.request.navigate("timeline", null, null, null) : (this.plan_code = c.request.get("params.plan_code") || Moxtra.const.STANDARD_MONTHLY, 
            j.planValid(this.plan_code) || (this.plan_code = Moxtra.const.STANDARD_MONTHLY), 
            this.$scope.lang = b, this.$scope.title = j.planTitle(this.plan_code), void c.request.page("", !1));
        },
        rendered: function() {
            this.$el.loading({
                top: 100
            });
            var a = this;
            Moxtra.verifyToken().success(function() {
                Moxtra.onReady(function() {
                    var c = Moxtra.getMe(), e = Moxtra.getMyGroup() || {};
                    if (e.id) {
                        if (c.group.type !== d.group.userRole.owner) return void a.$(".upgrade-form").html(MX.format(b.upgrade_but_not_be_owner, e.name));
                        if ("GROUP_NORMAL_SUBSCRIPTION" === e.status) return void a.gotoBilling();
                    }
                    a.recovery(new h({
                        parent: a,
                        group: e,
                        renderTo: ".upgrade-form"
                    }));
                });
            }).error(function() {
                a.recovery(new g({
                    fullForm: !0,
                    hideDisclaimer: !0,
                    trial: !0,
                    btnText: b["continue"],
                    callback: function() {
                        a.$(".upgrade-form").empty(), a.recovery(new h({
                            parent: a,
                            renderTo: ".upgrade-form"
                        }));
                    },
                    renderTo: ".upgrade-form"
                }));
            }).complete(function() {
                a.pricingView = new i({
                    parent: a,
                    plan_code: a.plan_code,
                    renderTo: ".upgrade-pricing"
                }), a.recovery(a.pricingView), a.$el.loading(!1);
            });
        },
        gotoLogin: function() {
            c.request.navigate("login", null, null, {
                backUrl: "#upgrade"
            });
        },
        setPlan: function(a) {
            a && (this.plan_code = a, this.$("h1.page-title").html(j.planTitle(a)));
        },
        getPlan: function() {
            return this.plan_code;
        },
        complete: function() {
            this.pricingView.inActive(), this.$(".upgrade-form").empty(), this.$(".upgrade-form").html($(k({
                lang: b
            })));
        },
        gotoBilling: function() {
            c.request.navigate("settings/billing", null, null, null);
        }
    });
}), define("text!template/common/flashAlert.html", [], function() {
    return "<div>\r\n	{{#if show}}\r\n		{{#if install}}\r\n		<div>{{bbcode lang.flash_not_installed}}</div>\r\n		{{else}}\r\n		<div>{{bbcode lang.flash_version_out_of_date}}</div>\r\n		{{/if}}\r\n		<br/>\r\n		<div>{{lang.flash_installed_refresh_page}}</div>\r\n	{{/if}}\r\n</div>";
}), define("common/flashAlert", [ "moxtra", "app", "lang", "text!template/common/flashAlert.html" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: d,
        init: function(a) {
            this.$scope.lang = c, this.$scope.show = !a.isMatched, this.$scope.install = !a.isInstalled;
        }
    });
}), define("mx.app2", function() {});