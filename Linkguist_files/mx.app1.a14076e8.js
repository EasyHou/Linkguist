define("text!template/api/inlineMessage.html", [], function() {
    return '<div class="inline-message {{messageType}}">\n    <div class="message-wrap">\n        {{messageInfo}}\n    </div>\n</div>';
}), define("api/inlineMessage", [ "moxtra", "app", "lang", "text!template/api/inlineMessage.html" ], function(a, b, c, d) {
    return a.Controller.extend({
        template: d,
        init: function(a) {
            this.$scope.messageInfo = a.message;
        },
        updateMessage: function(a) {
            this.$(".message-wrap").text(a);
        }
    });
}), define("api/annotate", [ "moxtra", "app", "lang", "viewer/viewer", "api/inlineMessage", "binder/binderActions" ], function(a, b, c, d, e, f) {
    "use strict";
    return a.Controller.extend({
        template: "<div></div>",
        init: function(a) {
            var c = b.request, d = this;
            d._opts = a, MX.loading(!0), $(a.renderTo).MoxtraPowerBy(!0), Moxtra.verifyToken(c.params()).success(function() {
                var a = c.page();
                a ? Moxtra.loadBoard(a).success(function() {
                    d.showViewer(a);
                }).error(function() {}) : d.createBinder(c.params().binder_name);
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        showViewer: function(a) {
            var f = this;
            MX.loading(!1);
            var g = Moxtra.getBoard(a);
            if (!a || !g) return new e({
                renderTo: f._opts.renderTo,
                message: c.binder_not_found
            }), void b.sendMessage({
                action: "fail",
                binder_id: a,
                session_id: Moxtra.getMe().sessionId,
                error_code: 404,
                error_message: c.binder_not_found
            });
            g.createViewToken().success(function() {
                f.view_token = g.view_token;
            }), b.sendMessage({
                action: "start_annotate",
                binder_id: a,
                session_id: Moxtra.getMe().sessionId
            });
            var h = g.getMyBoardUserInfo().type;
            if (!f.viewer) {
                var i = g.pages, j = b.request.sequence();
                f.viewer = new d({
                    renderTo: "body",
                    userRole: h,
                    roleContext: "annotate",
                    collection: i,
                    disableESC: !0
                }), f.viewer.$el.addClass("websdk"), f.listenTo(f.viewer, "switchPage", function(a) {
                    b.request.sequence(a.page_sequence, !1);
                }), f.listenTo(f.viewer, "close", function() {
                    b.request.sequence(""), g.unsubscribe(), b.sendMessage({
                        action: "stop_annotate",
                        binder_id: a,
                        session_id: Moxtra.getMe().sessionId,
                        share_url: MX.format("{0}/v/{1}", location.origin, f.view_token),
                        download_url: MX.format("{0}/board/{1}/download?d=&type=pdf&t={2}", location.origin, a, f.view_token)
                    });
                });
                var k = function() {
                    if (f.hasAutoJump) return !0;
                    if (i.length) {
                        if (!j) {
                            var a = i.at(0);
                            j = a.sequence;
                        }
                        return f.hasAutoJump = !0, f.viewer.open(j, "annotate"), f.viewer.setUserRole(h || Moxtra.const.BOARD_READ), 
                        f.stopListening(i, "push"), !0;
                    }
                    return !1;
                };
                f.viewer.setUserRole(h || Moxtra.const.BOARD_READ), f.viewer.customPluginByRole(""), 
                f.recovery(f.viewer), MX.subscribe("/binders/" + g.id, {
                    subject: "object.board.pages"
                }, function() {
                    f.listenTo(i, "inited", function() {
                        k() || f.listenTo(i, "push", k);
                    });
                }, f);
            }
        },
        createBinder: function(a) {
            var d = this;
            a || (a = MX.format("{0} - {1}", c.annotate, MX.lang.formatDateTime()));
            var e = new Moxtra.model.Board(), g = new Moxtra.util.Request();
            e.set("name", a), e.set("category", 0), e.create().success(function() {
                e.id && (f.addPageBlank("", e.id, Moxtra.const.PAGE_TYPE_WHITEBOARD), g.success(function() {
                    b.request.page(e.id, !1), d.showViewer(e.id);
                }), g.wait(function() {
                    return Moxtra.getUserBoard(e.id);
                }).invoke("success", e));
            }).error(function() {
                b.sendMessage({
                    action: "fail",
                    binder_id: null,
                    session_id: Moxtra.getMe().sessionId,
                    error_code: 400,
                    error_message: c.create_binder_failed
                });
            });
        }
    });
}), define("api/calendar", [ "moxtra", "app", "lang", "meet/meetIntro" ], function(a, b, c, d) {
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = a.renderTo;
            delete a.renderTo, MX.loading(!0);
            var g = $(f).MoxtraPowerBy(!0);
            g.addClass("for-calendar"), Moxtra.verifyToken(e.params()).success(function() {
                return MX.loading(!1), e.params().header ? void e.navigate("meetintro") : (d.prototype.init.call(c, a), 
                void c.renderTo(f));
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                }), MX.loading(!1);
            });
        }
    });
}), define("text!template/binder/binderDetail.html", [], function() {
    return '<div class="page-body">\n    {{#if uiOpts.showHeader}}\n	<div id="binderDetailTab">\n		<!--   <div class="binder-blur-cover" >\n		<div class="binder-blur-cover-wrap" >\n		<img  class="blur" id="binderCover">\n		</div>\n		</div>-->\n		<div class="binder-cover-info">\n\n			{{#if branding.showBinderName}}\n			<div class="pull-left binder-name ellipsis mx-restricted"></div>\n			{{/if}}\n			<div class="pull-right ">\n				{{#if branding.showBinderOptions}}\n				<a class="mouse-hand btn micon-btn float-right mx-restricted disabled JS_BinderOptions" data-action="openBinderOptions" title="{{lang.options}}" data-placement="left"> <i class="micon-user-setting gray"/> </a>\n				{{/if}}\n            </div>\n{{!--\n            {{#unless enableIntegration}}\n            <div class="pull-right mx-pin-container">\n                <a class="mouse-hand btn micon-btn float-right" data-action="showPin" ><i class="micon-pin-empty gray"></i></a>\n                <div class="mx-brief hide">\n                    <div class="mx-brief-header">\n                        <button type="button" class="close" data-action="hidePin" aria-hidden="true">×</button>\n                        <h4>{{lang.pin_header}}</h4>\n                    </div>\n                    <div class="mx-brief-container">\n\n                    </div>\n                </div>\n            </div>\n            {{/unless}}\n            --}}\n			<div class="binder-cover-action">\n				<ul class="mx-branding-binder-tabs tabs-brandingStyle{{brandingStyle}} mx-tab" >\n					<li class="active" >\n						<a class="tab_chat JS_Tab" data-toggle="" data-target="#tab_chat" > {{#if custom_tab_chat}}{{custom_tab_chat}}{{else}}{{lang.binder_chats}}{{/if}} </a>\n					</li>\n					<li>\n						<a class="tab_pages JS_Tab" data-toggle="" data-target="#tab_pages"> {{#if custom_tab_page}}{{custom_tab_page}}{{else}}{{lang.tab_pages}}{{/if}} </a>\n					</li>\n\n					{{#if branding.showTodoTab}}\n					<li>\n						<a class="tab_todo JS_Tab" data-toggle="" data-target="#tab_todo"> {{#if custom_tab_todo}}{{custom_tab_todo}}{{else}}{{lang.to_do}}{{/if}} </a>\n					</li>\n					{{/if}}\n\n					{{#if branding.showMeetTab}}\n					<li>\n						<a class="tab_meet JS_Tab" data-toggle="" data-target="#tab_meet"> {{#if custom_tab_meet}}{{custom_tab_meet}}{{else}}{{lang.meet}}{{/if}} </a>\n					</li>\n					{{/if}}\n				</ul>\n			</div>\n		</div>\n\n	</div>\n	{{/if}}\n\n    {{#if uiOpts.showHeader}}\n	<div class="mx-tab-content">\n	{{/if}}\n		<div class="mx-todo-mask" data-action="closeTodoDetail"></div>\n		<div class="hide" id="todoDetail"></div>\n		<div class="tab-pane active" id="tab_chat"></div>\n		<div class="tab-pane" id="tab_pages"></div>\n		<div class="tab-pane" id="tab_todo"></div>\n		<div class="tab-pane" id="tab_meet"></div>\n        {{#if branding.showAddFile}}\n		<div class="mx-add-page-bar dropdown">\n			<a href="javascript:;" class="pull-right add-page" title="{{lang.add_file}}" data-toggle="dropdown" data-action="refreshUploader" data-placement="top" data-param=""><i class="micon-plus-with-circle circle white"></i></a>\n			{{addPageMenu }}\n		</div>\n		{{/if}}\n		<a id="uploadDragDropInBinderHidden" class="hide"></a>\n    {{#if uiOpts.showHeader}}\n	</div>\n	{{/if}}\n</div>\n';
}), define("text!template/binder/pinItem.html", [], function() {
    return '<li>\n    <div class="brief-item-header size12">\n        {{actor.user.displayName}} · {{formatter \'formatDate\' created_time}}\n        <span class="pull-right micon-pin brief-item-action-remove clickable size14" data-action="removePin" data-param="{{sequence}}"></span>\n    </div>\n    <div class="brief-item-content" data-action="gotoFeedItem" data-param="{{sequence}}">\n        {{message.chatMsg}}\n    </div>\n</li>\n';
}), define("text!template/chat/main.html", [], function() {
    return '<div class="mx-chat">\n    <div class="mx-chat-unread-badge" data-action="gotoUnreadItem" style="display:none;">\n        {{lang.feed_unread_message_count_tips}}\n    </div>\n    <div class="mx-chat-msgbox-wrap">\n        <div class="mx-chat-msgbox ">\n\n	    </div>\n        <span class="moxtra-poweredby mxbrand-powered-by-moxtra active for-chat" ></span>\n    </div>\n    <div class="at-input-helper">\n    </div>\n    <div class="mx-action-bar {{#unless branding.showAddFile}}branding-addfile{{/unless}}">\n            <textarea placeholder="{{lang.chat_placeholder_write_comment}}" autofocus="autofocus" name="postComment" class="noOutline"></textarea>\n            <textarea placeholder="{{lang.add_to_do_item}}" autofocus="autofocus" class="todo-input noOutline" name="addTodo"></textarea>\n            {{#if branding.showTodo}}\n            <input type="checkbox" class="mx-hide" title="{{lang.toggle_todo}}" data-action="switchTodo">\n            {{/if}}\n            <span class="viewer-tips">{{lang.you_are_viewer_of_this_binder}}</span>\n    </div>\n</div>\n';
}), define("text!template/chat/feedProgressView.html", [], function() {
    return '<div id="{{client_uuid}}" class="mx-chat-item-wrap to-right">\r\n	 {{avatarView actor}}\r\n    <div class="mx-chat-item">\r\n        <div  >\r\n        	<div class="mx-file-name">\r\n        		{{name}}\r\n        	</div>\r\n        	<div class="mx-progress">\r\n        		<div class="bar">\r\n        		</div>\r\n    		</div>\r\n    		<div class="percent pull-right">\r\n        	</div>\r\n        \r\n    </div>\r\n</div>';
}), define("binder/chat/feedProgress", [ "moxtra", "lang", "text!template/chat/feedProgressView.html" ], function(a, b, c) {
    var d = MX.logger("Chat:progress");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function(a) {
            var c = this;
            this.$scope.lang = b, this.$scope.name = a.model.get("name"), this.$scope.client_uuid = a.model.get("client_uuid"), 
            this.model = a.model, this.model.on("change", function(a) {
                {
                    var b = a.get("percent");
                    a.get("sequence");
                }
                c.$(".mx-progress .bar").css("width", b + "%"), c.$(".percent").html(b + "%"), 100 == b && c.$el.remove(), 
                d.debug("update progress", b);
            });
        }
    });
}), define("text!template/chat/feedAudioView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item chat-audio-comment {{#if isMe}}{{else}}left-comment{{/if}}">\n        {{#if message.isPin}}\n            <div class="mx-message">{{message.chatMsg}}</div>\n            <div class="mx-pinned-information">\n                <span class="micon-pin pinned"></span> {{message.created_user}} · {{formatter \'formatDate\' message.created_time}}\n            </div>\n        {{/if}}\n        {{#unless message.isPin}}\n            {{#if message.isMe}}\n                <button type="button" class="delete" aria-hidden="true" data-action="deleteCommentFeed" data-param="{{message.comment.sequence}},{{sequence}}"><i class="micon-trash size14"></i></button>\n            {{/if}}\n        {{/unless}}\n        <div class="audio-box">\n        	<a class="action-btn" href="javascript:;"><i class="micon-play-with-circle"></i></a>\n        	<div class="mx-progress" style="width:{{durationWitdh}}px">\n        		<div class="bar">\n        		</div>\n    		</div>\n        	<span class="audio-time">\n                {{duration}}\n        	</span>\n        	<div style="display:none;">\n        		<audio controls="controls">\n        			<source src="{{message.resource.source}}" type="audio/x-m4a">\n        			<source src="{{message.resource.source}}" type="audio/mpeg">\n        				{{lang.browser_not_support_audio_tag}}\n				</audio>\n			</div>\n            <!-- <div class="hide"><small class="alert-warning">{{lang.browser_can_not_play}}</small></div> -->\n        </div>\n\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact mx-chat-binder-comment">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n            {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("binder/chat/feedAudio", [ "moxtra", "lang", "text!template/chat/feedAudioView.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        events: {
            "click .action-btn": "play"
        },
        init: function(a) {
            this.$scope.lang = b;
            var c = this.model.message.media_length;
            c = (c - c % 100) / 1e3, this.$scope.duration = 3 === (c + "").length ? "0" + c : c, 
            this.$scope.durationWitdh = 2 * c + 60, this.onAudioPlayed = a.onAudioPlayed, this.listenTo(this.model, "change", this.updateView);
        },
        updateView: function() {
            this.player.setSrc(this.model.message.resource.source);
        },
        rendered: function() {
            var a = this, b = this.$el;
            b.find(".bar").css({
                width: "0%"
            }), this.update(), b.find("audio").mediaelementplayer({
                iPadUseNativeControls: !0,
                iPhoneUseNativeControls: !0,
                success: function(b) {
                    a.player = b, b.addEventListener("loadedmetadata", function(b) {
                        a._updateDuration(b.currentTarget.duration);
                    }), b.addEventListener("timeupdate", function(b) {
                        a._updateProgress(b.currentTarget.currentTime);
                    }), b.addEventListener("ended", function() {
                        a._endedPlayer();
                    }), b.addEventListener("pause", function() {
                        a._resetPlayer();
                    });
                }
            });
        },
        update: function() {},
        remove: function() {
            this.$el.closest(".mx-chat-msg").loading({
                length: 5,
                radius: 5,
                width: 3
            });
        },
        play: function(a) {
            var b = $(a.target).closest("a").find(".micon-play-with-circle");
            b.hasClass("micon-stop") ? (this.player && this.player.stop(), this._resetPlayer()) : (this.player && this.player.play(), 
            b.addClass("micon-stop"));
        },
        _updateDuration: function(a) {
            this.duration = Math.floor(10 * parseFloat(a)) / 10;
            var b = this.duration + "";
            3 === b.length && (b = "0" + b), this.$el.find(".audio-time").html(b), this.$el.find(".mx-progress").css({
                width: 60 + 2 * b + "px"
            });
        },
        _updateProgress: function(a) {
            if (this.duration && 0 !== this.duration) {
                var b = 100 * a / this.duration + "%";
                this.$el.find(".bar").css({
                    width: b
                });
            }
        },
        _endedPlayer: function() {
            this._resetPlayer(), this.onAudioPlayed && this.onAudioPlayed();
        },
        _resetPlayer: function() {
            this.player.setCurrentTime(0), this.$el.find(".micon-play-with-circle").removeClass("micon-stop"), 
            this.$el.find(".bar").css({
                width: "0%"
            });
        }
    });
}), define("text!template/chat/feedImageView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n\n        <div class="mx-message">\n            {{message.chatMsg}}\n        </div>\n        {{#if message.isPin}}\n        <div class="mx-pinned-information">\n            <span class="micon-pin pinned"></span>\n        </div>\n        {{/if}}\n        <div class="mx-hit" data-action="{{#if message.comment}}viewCommentPage{{else}}viewPage{{/if}}"\n             data-param="{{page.sequence}}">\n            <a class="chat-img-link">\n                {{#if message.showVideoIndicator}}\n                    <i class="micon-play gray size24"></i>\n                {{/if}}\n                {{#if message.showWebIndicator}}\n                    <i class="micon-text gray size24"></i>\n                {{/if}}\n                {{#if message.showAnnotateIndicator}}\n                    <i class="micon-highlighter size24 gray"></i>\n                {{/if}}\n            </a>\n            {{#if message.comment}}\n                {{#if message.comment.voice}}\n                    <div class="audio-box page-comment">\n                        <a class="action-btn" href="javascript:;"><i class="micon-play-with-circle"></i></a>\n\n                        <div class="mx-progress" style="width:{{durationWitdh}}px">\n                            <div class="bar">\n                            </div>\n                        </div>\n                        <span class="audio-time">\n                            {{duration}}\n                        </span>\n\n                        <div style="display:none;">\n                            <audio controls="controls">\n                                <source src="{{message.comment.voice}}" type="audio/x-m4a">\n                                <source src="{{message.comment.voice}}" type="audio/mpeg">\n                                {{lang.browser_not_support_audio_tag}}\n                            </audio>\n                        </div>\n                        <!-- <div class="hide"><small class="alert-warning">{{lang.browser_can_not_play}}</small></div> -->\n                    </div>\n                {{else}}\n                    <div class="page-comment ellipsis-3line"\n                         title="{{message.comment.text}}">{{linkMode message.comment.text}}</div>\n                {{/if}}\n                <div>\n                    <div class="page-comment-mask"></div>\n                    <div class="chat-img-cover">\n                        <div class="chat-img-wrap">\n                            <span class="hook"></span>\n                            {{#if hasIndicator}}\n                                {{#when page.thumbnail \'!=\' defaultFileThumbail}}<img src="{{page.thumbnail}}"/>{{/when}}\n                            {{else}}\n                                <img src="{{page.thumbnail}}"/>\n                            {{/if}}\n\n                        </div>\n                    </div>\n                </div>\n            {{else}}\n                <div class="chat-img-cover">\n                    <div class="chat-img-wrap">\n                        <span class="hook"></span>\n                        {{#if hasIndicator}}\n                            {{#when page.thumbnail \'!=\' defaultFileThumbail}}<img src="{{page.thumbnail}}"/>{{/when}}\n                        {{else}}\n                            <img src="{{page.thumbnail}}"/>\n                        {{/if}}\n                    </div>\n                </div>\n            {{/if}}\n\n        </div>\n        {{feedItemActionView this}}\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("binder/chat/feedPageAudio", [ "moxtra", "lang", "text!template/chat/feedImageView.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        events: {
            "click .action-btn": "play"
        },
        init: function() {
            this.$scope.lang = b;
            var a = this.model.message.comment.resource_length;
            a = (a - a % 100) / 1e3, this.$scope.duration = 3 === (a + "").length ? "0" + a : a, 
            this.listenTo(this.model, "change", this.updateView);
        },
        updateView: function() {
            this.player.setSrc(this.model.message.comment.voice);
        },
        rendered: function() {
            var a = this, b = this.$el;
            b.find(".bar").css({
                width: "0%"
            }), this.update(), b.find("audio").mediaelementplayer({
                iPadUseNativeControls: !0,
                iPhoneUseNativeControls: !0,
                success: function(b) {
                    a.player = b, b.addEventListener("loadedmetadata", function(b) {
                        a._updateDuration(b.currentTarget.duration);
                    }), b.addEventListener("timeupdate", function(b) {
                        a._updateProgress(b.currentTarget.currentTime);
                    }), b.addEventListener("ended", function() {
                        a._endedPlayer();
                    }), b.addEventListener("pause", function() {
                        a._resetPlayer();
                    });
                }
            });
        },
        update: function() {},
        remove: function() {
            this.$el.closest(".mx-chat-msg").loading({
                length: 5,
                radius: 5,
                width: 3
            });
        },
        play: function(a) {
            a.stopPropagation();
            var b = $(a.target).closest("a").find(".micon-play-with-circle");
            b.hasClass("micon-stop") ? (this.player && this.player.stop(), this._resetPlayer()) : (this.player && this.player.play(), 
            b.addClass("micon-stop"));
        },
        _updateDuration: function(a) {
            this.duration = Math.floor(10 * parseFloat(a)) / 10;
            var b = this.duration + "";
            3 === b.length && (b = "0" + b), this.$el.find(".audio-time").html(b), this.$el.find(".mx-progress").css({
                width: 60 + 2 * b + "px"
            });
        },
        _updateProgress: function(a) {
            if (this.duration && 0 !== this.duration) {
                var b = 100 * a / this.duration + "%";
                this.$el.find(".bar").css({
                    width: b
                });
            }
        },
        _endedPlayer: function() {
            this._resetPlayer(), this.onAudioPlayed && this.onAudioPlayed();
        },
        _resetPlayer: function() {
            this.player.setCurrentTime(0), this.$el.find(".micon-play-with-circle").removeClass("micon-stop");
        }
    });
}), define("text!template/chat/emptyView.html", [], function() {
    return '<div class="mx-chat-empty">\n</div>';
}), define("text!template/chat/feedCommentView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item chat-binder-comment {{#if message.isMe}}self-comment{{else}}left-comment{{/if}}" data-param="{{sequence}}">\n        {{#if message.isPin}}\n            <div class="mx-message">{{message.chatMsg}}</div>\n            <div class="mx-pinned-information">\n                <span class="micon-pin pinned"></span> {{message.created_user}} · {{formatter \'formatDate\' message.created_time}}\n            </div>\n        {{/if}}\n        {{#unless message.isPin}}\n        {{#if message.isMe}}\n            {{#if sequence}}\n    	        <button type="button" class="delete" aria-hidden="true" data-action="deleteCommentFeed" data-param="{{message.comment.sequence}},{{sequence}}"><i class="micon-close size12"></i></button>\n    	    {{/if}}\n        {{/if}}\n        {{/unless}}\n        <div class="mx-message">\n            {{#unless message.isPin}}\n                {{#unless message.isMe}}\n                    <div class="feed-actor">\n                        <span>{{message.actor}}</span>\n                    </div>\n                {{/unless}}\n            {{/unless}}\n            <span {{#if message.isPin}}class="add-quote"{{/if}}>{{#if message.comment.rich_text}}{{chatFormat message.comment.rich_text true}}{{else}}{{chatFormat message.comment.text true}}{{/if}}<span class="hide resend"> {{lang.delivery_failed}} <a class="btn-link">{{lang.resend}}</a></span></span>\n\n        </div>\n        {{#if message.isMe}}\n        {{#unless sequence}}\n        <div class="sending">\n            <button class="micon-svg-text-bubble4 send-fail hide" title="{{lang.send_message_failed}}"></button>\n        </div>\n        {{/unless}}\n        {{/if}}\n    </div>\n{{#unless message.isPin}}\n    {{#unless isIntegration}}\n        <div class="mx-chat-item-interact mx-chat-binder-comment">\n        <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n            {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n    </div>\n    {{/unless}}\n{{/unless}}\n</div>\n';
}), define("text!template/chat/feedAnnotateView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item type-annotate">\n        <a href="javascript:;" data-action="viewPage" data-param="{{source.sequence}},{{boardId}}">\n            <img src="{{source.thumbnail}}"/>\n            <span>{{message.chatMsg}}</span>\n        </a>\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedSystemView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n	 {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n        <div class="mx-message">\n        {{#if message.chatMsg_bak}}\n            {{message.chatMsg_bak}}\n        {{else}}\n            {{message.chatMsg}}\n        {{/if}}\n        </div>\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedEmailView.html", [], function() {
    return '{{!-- we make feedEmailview always on the left as it is another type of integration --}}\n{{!-- to be consistent as iOS behavior, 3/10/2015 --}}\n<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item type-email">\n\n       <div class="mx-message">\n		 <div class="pull-right"><i class="micon-email size24 blue"></i></div>\n	   </div>\n       <div class="mx-message ellipsis">\n           {{message.emailResource.sender}}\n       </div>\n       <div class="mx-message ta-email-subject ellipsis">\n       	   {{message.emailResource.subject}}\n       </div>\n\n    {{#if source.sequence}}\n       <hr />\n\n       <div {{#if page}}class="mx-hit" data-action="{{#if comment}}viewCommentPage{{else}}viewPage{{/if}}"{{/if}} data-param="{{source.sequence}}">\n       	<a {{#if page}}href="javascript:;"{{/if}} class="chat-img-link" >\n       		{{#if message.showVideoIndicator}}\n                <i class="micon-play gray size24"></i>\n			{{/if}}\n       	</a>\n	       	{{#if message.comment}}\n       		<div class="page-comment ellipsis-3line">{{message.comment.text}}</div>\n       		<div>\n       			<div class="page-comment-mask"> </div>\n                <div class="chat-img-cover">\n       			<div class="chat-img-wrap">\n       				<span class="hook"></span><img src="{{source.thumbnail}}" />\n                </div></div>\n       		</div>\n       		{{else}}\n           <div class="chat-img-cover">\n       		<div class="chat-img-wrap">\n   				<span class="hook"></span>{{#if source.is_email_empty}}<span class="empty-email-content">{{lang.feed_empty_email}}</span>{{else}}<img src="{{source.thumbnail}}" />{{/if}}\n   			</div>\n           </div>\n		   {{/if}}\n       </div>\n    {{/if}}\n\n       {{#if message.showAttachmentList}}\n       <hr />\n       <div class="mx-message">\n       		{{#if message.showAttachmentIndicator}}\n       		<div class="attachments mouse-hand" data-action="showEmailAttachments"><i class="glyphicon glyphicon-paperclip pull-left"></i> <span class="email-attachment ellipsis">{{emailAttachments.length}} {{lang.attachments}} <i class="caret"></i></span></div>\n       		{{/if}}\n       		{{#each message.emailAttachments}}\n       		<div class="row attachment-item {{#if ../message.showAttachmentIndicator}}hide{{/if}}">\n       			{{#if pageSequence}}\n       			<i class="micon-page blue pull-left mouse-hand" data-action="viewPage" data-param="{{pageSequence}}"></i>\n       			<span class="email-attachment ellipsis mouse-hand" data-action="viewPage" data-param="{{pageSequence}}">{{name}}</span>\n       			{{else}}\n       			<i class="micon-page blue pull-left"></i>\n       			<span class="email-attachment ellipsis">{{name}}</span>\n       			{{/if}}\n                <a class="micon-share blue pull-right mouse-hand mxbrand-action-share" title="{{../lang.share}}" data-action="shareFiles" data-param="{{resourceSequence}}"></a>\n                <a class="micon-download blue pull-right mouse-hand marginRight5" title="{{../lang.download}}" data-action="downloadResource" data-param="{{resourceSequence}}"></a>\n            </div>\n       		{{/each}}\n\n       </div>\n       {{/if}}\n    </div>\n{{#unless isIntegration}}\n        <div class="mx-chat-item-interact">\n        <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n        {{!--\n                    {{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}\n        --}}\n    </div>\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedResourceView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n        {{#if message.isPin}}\n            <div class="mx-message">\n                {{message.chatMsg}}\n            </div>\n            <div class="mx-pinned-information">\n                <span class="micon-pin pinned"></span>\n            </div>\n        {{/if}}\n        <div class=" pull-right" style="position: relative">\n            {{feedItemActionView this}}\n        </div>\n        <div>\n        	<span class="resource-name mouse-hand" data-action="viewPage" data-param="{{message.file.client_uuid}}" >\n        		<i class="micon-page marginRight5"></i>\n        		<span title="{{message.file.name}}">{{message.file.name}}</span>\n        	</span>\n        </div>\n    </div>\n{{#unless message.isPin}}\n    {{#unless isIntegration}}\n        <div class="mx-chat-item-interact">\n            <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n            {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n        </div>\n    {{/unless}}\n{{/unless}}\n</div>\n';
}), define("text!template/chat/feedUrlView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n	 {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n\n        <div>\n        	<div class="resource-name">\n        		<i class="micon-page-url pull-left marginRight5"> </i>\n        		<div>{{message.chatMsg}} </div>\n        		<div class="url">\n        			{{{linkMode source.url}}}\n        		</div>\n        	</div>\n    	</div>\n\n    </div>\n{{#unless isIntegration}}\n    <div class="mx-chat-item-interact">\n        <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n        {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n    </div>\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedVideoView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n    {{videoView source}}\n   </div>\n{{#unless isIntegration}}\n        <div class="mx-chat-item-interact">\n        <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n            {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n    </div>\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedTodoView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#unless message.dateArrive}}{{#if message.isMe}}to-right{{/if}}{{/unless}}">\n	{{#unless message.dateArrive}}{{avatarView actor openBizCard}}{{/unless}}\n	<div class="mx-chat-item">\n        {{#unless message.dateArrive}}\n            {{#unless message.isMe}}\n            <div class="mx-message todo-message">\n                {{message.chatMsg}}\n            </div>\n            {{/unless}}\n        {{/unless}}\n		<div class="mx-message-todo {{#unless message.is_deleted}}mx-hit{{/unless}}" {{#unless message.is_deleted}}data-action="viewTodo" data-param="{{source.sequence}}"{{/unless}}>\n\n			<div class="todo-action"><strong>{{#if message.comment}} {{html message.comment}} {{else}} {{message.todoAction}} {{/if}}</strong></div>\n\n			<div {{#if source.is_completed}}class="todo-completed"{{else}}{{#if source.is_deleted}}class="todo-deleted"{{/if}}{{/if}}>\n				{{#if source.is_completed}}\n				<i class="micon-todo gray pull-left"></i>\n				{{else}}\n                    {{#if source.is_deleted}}\n                        <i class="micon-square gray pull-left"></i>\n                    {{else}}\n				<i class="micon-square blue pull-left"></i>\n                        {{/if}}\n				{{/if}}\n				<span class="todo-item" title="{{source.name}}">{{source.name}}</span>\n			</div>\n		</div>\n	</div>\n</div>\n';
}), define("text!template/chat/feedTodoDueView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if message.isMe}}to-right{{/if}}">\n	{{avatarView actor openBizCard}}\n	<div class="mx-chat-item">\n\n		<div class="mx-message todo-message">\n			{{message.chatMsg}}\n		</div>\n\n		<div class="mx-message-todo message-due-date {{#unless is_deleted}}mx-hit{{/unless}}" {{#unless is_deleted}}data-action="viewTodo" data-param="{{source.sequence}}"{{/unless}}>\n\n            <i class="micon-calendar blue pull-left"></i>\n            <div class="todo-due-date">\n                <strong>{{message.todoAction}}</strong>\n            <hr />\n            <div {{#if source.is_completed}}class="todo-completed"{{/if}}>\n                {{#if source.is_completed}}\n                <i class="micon-todo gray pull-left"></i>\n                {{else}}\n                <i class="micon-square blue pull-left"></i>\n                {{/if}}\n                <span class="ellipsis-2line todo-item" title="{{source.name}}">{{source.name}}</span>\n            </div>\n        </div>\n		</div>\n\n	</div>\n</div>\n';
}), define("text!template/chat/feedItemActionView.html", [], function() {
    return '<div class="feed-actions">\n    {{#unless message.comment}}\n    <div class=" pull-right dropup">\n\n        <a data-toggle="dropdown"  title="{{lang.more_options}}"  class="micon-more"></a>\n        <ul class="dropdown-menu" role="menu" >\n            {{#each top_menus}}\n            <li><a  data-action="addCustomActions" data-param="{{menu_name}},{{../download_url}},{{../download_name}}"><i class="micon-page size16"></i><span>{{menu_name}}</span></a></li>\n            {{/each}}\n\n            {{#if message.file}}\n                {{#if message.file_id}}\n                    <li><a data-action="downloadFiles" data-param="{{message.file_id}}" ><i class="micon-download size16"></i><span>{{lang.download}}</span></a></li>\n                    <li><a data-action="copyFiles" data-param="{{message.file_id}}" ><i class="micon-copy size16"></i><span>{{lang.copy_to}}</span></a></li>\n                    {{#unless isViewer}}\n                        {{#if branding.showTodo}}\n                            <li><a data-action="createTodoWithFile" data-param="{{message.file_id}}" ><i class="micon-todo-empty size16"></i><span>{{lang.create_todo}}</span></a></li>\n                        {{/if}}\n                        <li><a data-action="shareFiles" data-param="{{message.file_id}}" class="mxbrand-action-share"><i class="micon-share size16"></i><span>{{lang.share}}</span></a></li>\n                        <li><a data-action="deleteFiles" data-param="{{message.file_id}}" ><i class="micon-trash size16"></i><span>{{lang.delete}}</span></a></li>\n                    {{/unless}}\n                {{else}}\n                    <li><a data-action="downloadResource" data-param="{{resource.sequence}}" ><i class="micon-download size16"></i><span>{{lang.download}}</span></a></li>\n                    <li><a data-action="copyResource" data-param="{{resource.sequence}}" ><i class="micon-copy size16"></i><span>{{lang.copy_to}}</span></a></li>\n                    {{#unless isViewer}}\n                        <li><a data-action="shareFiles" data-param="{{resource.sequence}}" class="mxbrand-action-share"><i class="micon-share size16"></i><span>{{lang.share}}</span></a></li>\n                        <li><a data-action="deleteResource" data-param="{{resource.sequence}}" ><i class="micon-trash size16"></i><span>{{lang.delete}}</span></a></li>\n                    {{/unless}}\n                {{/if}}\n            {{else}}\n                <li><a data-action="downloadPages" data-param="{{sequence}}" ><i class="micon-download size16"></i><span>{{lang.download}}</span></a></li>\n                <li> <a data-action="copyPages" data-param="{{sequence}}" ><i class="micon-copy size16"></i><span>{{lang.copy_to}}</span></a></li>\n                {{#unless isViewer}}\n                    {{#if branding.showTodo}}\n                        <li><a data-action="createTodoWithPage" data-param="{{sequence}}" ><i class="micon-todo-empty size16"></i><span>{{lang.create_todo}}</span></a></li>\n                    {{/if}}\n                    <li><a data-action="sharePages" data-param="{{sequence}}" class="mxbrand-action-share"><i class="micon-share size16"></i><span>{{lang.share}}</span></a></li>\n                    <li><a data-action="deletePages" data-param="{{sequence}}" ><i class="micon-trash size16"></i><span>{{lang.delete}}</span></a></li>\n                {{/unless}}\n            {{/if}}\n\n            {{#each bottom_menus}}\n            <li><a data-action="addCustomActions" data-param="{{menu_name}},{{../download_url}},{{../download_name}}"><i class="micon-page size16"></i><span>{{menu_name}}</span></a></li>\n            {{/each}}\n        </ul>\n\n    </div>\n    {{/unless}}\n    {{#unless message.resource}}\n    <div class="btn-group image-view-actions">\n        {{#unless isViewer}}\n            {{#if message.showWebIndicator}}\n            <a class="micon-edit" title="{{lang.edit}}" data-action="editWebdoc" data-param="{{page.sequence}}"></a>\n            {{else}}\n            <a title="{{lang.annotate}}" class="micon-annotate {{#if message.notAnnotate}}hidden{{/if}}" data-action="annotate" data-param="{{page.sequence}}"></a>\n            {{/if}}\n            <a class="micon-comment" title="{{lang.comment}}" data-action="comment" data-param="{{page.sequence}}">\n            <span class="mx-chat-comment-count">{{#if page.total_comments}}{{page.total_comments}}{{/if}}</span></a>\n        {{/unless}}\n        {{! Create note logic is: 1. if it is not resource, it should be show the button, 2. when it is a resource, and it has page/pages, also show the button here.}}\n\n        {{#unless hideRec}}\n            {{#if message.resource}}\n                {{#if message.showMeetNote}}\n                    <a data-action="startNote" class="micon-rec-empty" data-param="{{page.sequence}}" title="{{lang.create_note}}"></a>\n                {{/if}}\n            {{else}}\n                <a data-action="startNote" class="micon-rec-empty" title="{{lang.create_note}}" data-param="{{page.sequence}}"></a>\n            {{/if}}\n        {{/unless}}\n    </div>\n    {{/unless}}\n\n</div>\n';
}), define("text!template/chat/feedTimeItemView.html", [], function() {
    return '<div class="feed-time">\n    <span>{{displayTime}}</span>\n</div>';
}), define("text!template/chat/feedViewMoreView.html", [], function() {
    return '<div class="feed-view-more">\r\n    <a href="javascript:;">\r\n    	{{lang.loading}}\r\n    </a>\r\n</div>';
}), define("text!template/chat/feedBoardCreateView.html", [], function() {
    return '<div id="feed{{sequence}}" class="chat-first-feed">\n    <div class="mx-message">\n        {{#unless message.description}}<span class="message">{{message.chatMsg}}</span>{{/unless}}\n        {{#if message.description}}<div class="board_description"><span class="description">{{chatFormat message.description true}}</span>{{#if isOwner}}<a class="mouse-hand size12 marginLeft5" data-action="addDescription" data-param="true">{{lang.edit}}</a>{{/if}}</div>{{/if}}\n        {{#if branding.showBinderOptions}}\n            <hr />\n            <div>\n                {{#if isViewer}}\n                    <div>{{lang.you_are_viewer_of_this_binder}}</div>\n                {{else}}\n                <ul>\n                    <li>\n                        <a class="mouse-hand" data-action="addMemberInSettings">\n                            <i class="micon-user-add size16"></i>\n                            <span>{{lang.invite_member}}</span>\n                        </a>\n                    </li>\n                    {{#if showWebhook}}\n                    <li>\n                        <a class="mouse-hand" href="#integrations?binderid={{binderId}}">\n                            <i class="micon-integration size16"></i>\n                            <span>{{lang.add_a_service_integrations}}</span>\n                        </a>\n                    </li>\n                    {{/if}}\n                    {{#if isOwner}}\n                        {{#unless message.description}}\n                        <li>\n                            <a class="mouse-hand" data-action="addDescription">\n                                <i class="micon-edit size16"></i>\n                                <span>{{lang.add_description}}</span>\n                            </a>\n                        </li>\n                        {{/unless}}\n                    {{/if}}\n                </ul>\n                {{/if}}\n            </div>\n        {{/if}}\n    </div>\n</div>\n';
}), define("text!template/chat/feedFolderView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#if showArrow}}arrow{{/if}} {{#if message.isMe}}to-right{{/if}}">\n    {{avatarView actor openBizCard}}\n    <div class="mx-chat-item">\n        <div>\n        	<span  class="mx-message" data-action="viewFolder" data-param="{{folder}}" >\n        		<span title="{{message.chatMsg}}">{{message.chatMsg}}</span>\n        	</span>\n        </div>\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedSessionsUpdateView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#unless message.dateArrive}}{{#if message.isMe}}to-right{{/if}}{{/unless}}">\n    {{#unless message.dateArrive}}{{avatarView actor openBizCard}}{{/unless}}\n    <div class="mx-chat-item mx-chat-meet {{#if session.is_deleted}}removed_meet{{/if}}">\n        <div class="mx-chat-meet-header">\n            {{message.chatMsg}}\n        </div>\n        <hr />\n        <div class="{{#unless session.is_deleted}}mx-hit{{/unless}}{{#if message.isRename}} mx-chat-meet-title{{/if}}" {{#unless session.is_deleted}}data-action="viewMeet" data-param="{{session.board_id}}"{{/unless}}><span class="micon-meet size18"></span><span class="ellipsis">{{session.topic}}</span></div>\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedSessionsCreateView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#unless message.dateArrive}}{{#if message.isMe}}to-right{{/if}}{{/unless}}">\n    {{#unless message.dateArrive}}{{avatarView actor openBizCard}}{{/unless}}\n    <div class="mx-chat-item mx-chat-meet {{#if session.is_deleted}}removed_meet{{/if}}">\n        <div class="mx-chat-meet-header">\n            {{message.chatMsg}}\n        </div>\n        <hr />\n        <div class="{{#unless session.is_deleted}}mx-hit {{/unless}}mx-chat-meet-title" {{#unless session.is_deleted}}data-action="viewMeet" data-param="{{session.board_id}}"{{/unless}}>\n            <span class="micon-meet size18"></span><span class="ellipsis">{{session.topic}}</span>\n            <div class="mx-chat-meet-time">\n            {{#if session.scheduled_start_time}}\n                {{formatFullDateTime session.scheduled_start_time}}\n            {{else}}\n                {{formatFullDateTime session.start_time}}\n            {{/if}}  · {{formatDuration session.duration}}</div>\n        </div>\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/chat/feedSessionsActionView.html", [], function() {
    return '<div id="feed{{sequence}}" class="mx-chat-item-wrap {{#unless message.dateArrive}}{{#if message.isMe}}to-right{{/if}}{{/unless}}">\n    {{#unless message.dateArrive}}{{avatarView actor openBizCard}}{{/unless}}\n    <div class="mx-chat-item mx-chat-meet {{#if session.is_deleted}}removed_meet{{/if}}">\n        <div class="mx-chat-meet-header">\n            {{message.chatMsg}}\n        </div>\n        <hr />\n        <div {{#unless session.is_deleted}}data-action="viewMeet" data-param="{{session.board_id}}"{{/unless}} class="{{#unless session.is_deleted}}mx-hit {{/unless}}{{#if message.isStart}}{{#unless message.isMeetEnded}}mx-chat-meet-title{{/unless}}{{/if}}">\n            <span class="micon-meet size18"></span><span class="ellipsis">{{session.topic}}</span>\n        </div>\n        {{#unless session.is_deleted}}\n\n        <div class="mx-chat-meet-action">\n            {{#if message.isStart}}\n                {{#if message.isMeetEnded}}\n                    <span class="mx-chat-meet-time">{{#if session.scheduled_start_time}}\n                        {{formatFullDateTime session.scheduled_start_time}}\n                    {{else}}\n                        {{formatFullDateTime session.start_time}}\n                    {{/if}}  · {{formatDuration session.duration}}</span>\n                {{else}}\n                    <a type="button" class="btn mx-chat-start-meet" target="{{target}}" href="#mymeet?action=join_from_calendar&binderid={{session.board_id}}">{{lang.join_now}}</a>\n                {{/if}}\n            {{else}}\n                <button type="button" class="btn mx-chat-play-record" data-action="playRecording" data-param="{{session.board_id}},{{session.recording}},{{session.topic}}">{{lang.play_recording}}</button>\n            {{/if}}\n        </div>\n        {{/unless}}\n    </div>\n    {{#unless message.isPin}}\n        {{#unless isIntegration}}\n            <div class="mx-chat-item-interact">\n                <span class="mx-chat-item-favorite size14 {{#if isFavorite}}favorited micon-star{{else}}micon-star-empty{{/if}}" data-action="favoriteItem" data-param="{{sequence}}"></span>\n                {{!--{{#unless isViewer}}<span class="mx-chat-item-pin  size14 {{#if is_pinned}}pinned micon-pin{{else}}micon-pin-empty{{/if}}" data-action="pinItem" data-param="{{sequence}}"></span>{{/unless}}--}}\n            </div>\n        {{/unless}}\n    {{/unless}}\n</div>\n';
}), define("text!template/todo/todoDetail.html", [], function() {
    return '<div class="mx-todo-detail {{#if is_completed}}todo-completed{{/if}}" xmlns="http://www.w3.org/1999/html">\n        <button class="btn btn-link close-action todo-switch" data-action="closeDetail" >\n            <i class="glyphicon glyphicon-chevron-right"></i>\n        </button>\n	<div class="todo-detail-wrap">\n		<div class="detail-header {{#if is_marked}}marked{{/if}}">\n			<span class="pull-left mouse-hand action-close paddingTop5" data-action="closeTodo" data-param="{{sequence}}">\n				<i class="micon-square blue"></i>\n			</span>\n			<span class="pull-left mouse-hand action-reopen" data-action="reopenTodo" data-param="{{sequence}}">\n				<i class="micon-todo gray"></i>\n			</span>\n\n			<span class="pull-right mouse-hand action-unmark " data-action="unmarkTodo" data-param="{{sequence}}">\n				<i class="micon-flag blue"></i>\n			</span>\n			<span class="pull-right mouse-hand action-mark {{#if is_completed}}disabled{{/if}}" data-action="markTodo" data-param="{{sequence}}">\n				<i class="micon-flag-empty gray"></i>\n			</span>\n			<span class="pull-right action-marked">\n				<i class="micon-flag gray"></i>\n			</span>\n\n			<span>\n				<div class="todo-name action-name {{#if is_completed}}disabled{{/if}}" data-action="editTodoName" data-param="{{sequence}}">{{name}}</div>\n			</span>\n		</div>\n\n		<div class="detail-body">\n            <form class="form-horizontal" role="form">\n                <div class="form-group">\n                    <label for="assign" class="col-sm-1 control-label">\n                        <i class="micon-user-with-arrow blue  pull-left {{#if assignee}}hide{{/if}}"></i>\n                        <span class=" mx-user contact-avatar avatar32 {{#unless assignee}}hide{{/unless}}">\n                        <img id="assignAvatar" class="img-circle" src="{{assignee.avatar}}" onerror="this.onerror=null;this.src=\'{{defaultUserAvatar}}\'" title="{{assignee.user.name}}">\n                    </span>\n                    </label>\n                    <div class="col-sm-11">\n\n                        <input type="text" class="form-control" id="assign" value="{{#if assignee.user.name}}{{assignee.user.name}}{{else}}{{assignee.group.name}}{{/if}}" name="assign" placeholder="{{lang.assign_to}}" {{#if is_completed}}disabled{{/if}}>\n                        <button id="assign_clear" type="button" class="close {{#if assignee}}active{{/if}}" data-action="removeAssignee" aria-hidden="true"><i class="micon-close size12"></i></button>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="due_date" class="col-sm-1 control-label"><i class="micon-calendar blue  pull-left"></i></label>\n                    <div class="col-sm-11">\n                        <input type="text" class="form-control" id="due_date" name="due_date" placeholder="{{lang.set_due_date}}" {{#if is_completed}}disabled{{/if}}>\n                        <button id="due_date_clear" type="button" class="close {{#if due_date}}active{{/if}}" data-action="removeDueDate" aria-hidden="true"><i class="micon-close size12"></i></button>\n                    </div>\n                </div>\n\n                <div class="form-group">\n                    <label for="reminders" class="col-sm-1 control-label"><i class="micon-clock blue  pull-left"></i></label>\n                    <div class="col-sm-11">\n                        <input type="text" class="form-control" id="reminders" value="{{reminders}}"  name="reminders" placeholder="{{lang.remind_me}}" {{#if is_completed}}disabled{{/if}}>\n                        <button id="remind_date_clear" type="button" class="close {{#if reminders}}active{{/if}}" data-action="removeRemindDate" aria-hidden="true"><i class="micon-close size12"></i></button>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="attachments" class="col-sm-1 control-label"><i class="micon-plus-with-circle blue  pull-left"></i></label>\n                    <div class="col-sm-11">\n                        <div class="" style="position: relative">\n                            <a id="attachments" class="btn btn-link todo-attachments-title action-attachment {{#if is_completed}}disabled{{/if}}" data-action="refreshTodoUploader" data-toggle="dropdown">\n                                <span> {{lang.add_attachment}}</span>\n                                <span class="caret"></span>\n                            </a>\n                            <ul class="dropdown-menu" role="menu" aria-labelledby="btnGroupVerticalDrop2">\n                                <li><a href="javascript:;"  data-action="addAttachments">{{lang.binder}}</a></li>\n                                <li><a href="javascript:;" id="uploadTodoAttachment">{{lang.desktop}}</a></li>\n                            </ul>\n                        </div>\n                        <!--<a id="attachments" class="btn btn-link todo-attachments-title action-attachment {{#if is_completed}}disabled{{/if}}" data-action="addAttachments">\n                           <span> {{lang.add_attachment}}</span>\n                       </a>\n                        </div>-->\n                        <div class="todo-attachments">\n\n                        </div>\n                    </div>\n\n                </div>\n                <div class="form-group">\n                    <label class="col-sm-1 control-label" for="copyTodo"><i class="micon-todo-copy  blue size24 pull-left"></i></label>\n                    <div class="col-sm-11">\n                        <a id="copyMove" class="btn btn-link todo-copy-title action-copy {{#if is_completed}}disabled{{/if}}" data-toggle="dropdown">\n                            <span>{{lang.copy}}/{{lang.move}}</span>\n                            <span class="caret"></span>\n                        </a>\n                        <ul class="dropdown-menu" role="menu" aria-labelledby="btnGroupVerticalDrop2">\n                            <li><a href="javascript:" data-action="copyTo">{{lang.copy_to}}</a></li>\n                            <li><a href="javascript:" data-action="moveTo">{{lang.move_to}}</a></li>\n                        </ul>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label for="delete" class="col-sm-1 control-label"><i class="micon-trash  blue  pull-left"></i></label>\n                    <div class="col-sm-11">\n                        <a class="btn btn-link delete-option-title" data-action="deleteTodo">\n                            <span>{{lang.delete}}</span>\n                        </a>\n                        <div class="created-date">{{createdDate}}</div>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <div class="col-sm-12">\n                        <textarea name="note" id="note" placeholder="{{lang.add_todo_description}}" class="form-control todo-note">{{note}}</textarea>\n                        <a href="javascript:;" data-action="zoomNoteText"><i class="micon-full-screen"></i></a>\n                    </div>\n                </div>\n            </form>\n\n	        <div class="todo-activity">\n                <div>\n                    <a data-action="showCompleteActivities" class="activities-count btn-link"></a>\n                    <div class="last-activity">\n\n                    </div>\n                </div>\n	        </div>\n        </div>\n	</div>\n    <div class="todo-comment-typeahead-helper" style="display:none"></div>\n	<div class="todo-detail-footer">\n		<div class="comment-bar">\n			<textarea id="todoComment" autofocus="autofocus" class="noResize noOutline" placeholder="{{lang.add_comment}}" ></textarea>\n		</div>\n	</div>\n    <div class="activityContainer hide"></div>\n</div>\n';
}), define("text!template/todo/todoNote.html", [], function() {
    return '<div>\n<textarea class="form-control todo-note-zoom vertResize" value="{{note}}" placeholder="{{lang.add_todo_description}}" autofocus>{{note}}</textarea></div>';
}), define("text!template/todo/todoAttachment.html", [], function() {
    return '<li>\n	<button type="button" class="delete marginTop5" data-action="removeAttachments" data-param="{{sequence}}" aria-hidden="true"><i class="micon-trash size14"></i></button>\n	<span class="page ellipsis" data-action="viewAttachment" data-param="{{client_uuid}}">\n	    <img src="{{file.thumbnail}}" {{#when file.thumbnail \'==\' defaultFileThumbnail}}class="mx-noborder"{{/when}}>\n	    <span title="{{file.displayName}}">{{file.displayName}}</span>\n    </span>\n</li>\n';
}), define("text!template/todo/todoComment.html", [], function() {
    return '<li class="todo-comment-item">\n	<span class="pull-left mx-user"> <img class="" src="{{creator.avatar}}" /> </span>\n\n	<div class="todo-wrap">\n        {{#if isMyComment}}\n            <button  type="button" class="delete" data-action="removeTodoComment" data-param="{{sequence}}" aria-hidden="true">\n                <i class="micon-close size12"></i>\n            </button>\n            <button class="edit-comment pull-right" data-action="editTodoComment" data-param="{{sequence}}" aria-hidden="true">\n                <i class="micon-pencil size12"></i>\n            </button>\n        {{/if}}\n		<div class="todo-commentator">\n			<strong>{{creator.user.name}}</strong>\n		</div>\n		<div class="todo-comment">\n			{{linkMode text}}\n		</div>\n		<div class="todo-comment">\n			{{formatDatetime created_time}}\n		</div>\n	</div>\n</li>\n';
}), define("component/autocomplete/autocomplete", [ "moxtra" ], function() {
    return MX.ui.Autocomplete = Backbone.View.extend({
        tagName: "ul",
        className: "autocomplete dropdown-menu",
        wait: 300,
        queryParameter: "query",
        minKeywordLength: 1,
        currentText: "",
        itemView: null,
        collection: [],
        multiSections: !1,
        input: null,
        initialize: function(a) {
            _.extend(this, a), this.filter = _.debounce(this.filter, this.wait), MX.isString(this.itemView) && (this.itemTemplate = Handlebars.compile(this.itemView));
        },
        render: function() {
            var a = "", b = this;
            return this.input ? (this.input.attr("autocomplete", "off"), this.$el.width(this.input.outerWidth()), 
            this.input.keyup(_.bind(this.keyup, this)).keydown(_.bind(this.keydown, this)).focus(function() {
                b.input.val() && (a = b.input.val()), b.input.val(""), b.loadResult(b.collection);
            }).blur(function() {
                setTimeout(function() {
                    b.input.val() || (b.input.val(a), a = ""), b.hide();
                }, 200);
            }).after(this.$el)) : b.loadResult(b.collection), this;
        },
        keydown: function(a) {
            return 38 == a.keyCode ? this.move(-1) : 40 == a.keyCode ? this.move(1) : 13 == a.keyCode ? this.onEnter() : 27 == a.keyCode ? this.hide() : void 0;
        },
        keyup: function() {
            var a = this.input.val();
            if (this.isChanged(a)) if (this.isValid(a)) {
                this.filter(a);
                var b = this;
                setTimeout(function() {
                    b.move(1);
                }, 500);
            } else this.hide();
        },
        filter: function(a) {
            var a = a.toLowerCase();
            if (this.collection.url) {
                var b = {};
                b[this.queryParameter] = a, this.collection.fetch({
                    success: function() {
                        this.loadResult(this.collection.models, a);
                    }.bind(this),
                    data: b
                });
            } else {
                var c = this, d = [];
                this.multiSections ? MX.each(this.collection, function(b) {
                    var e = [];
                    MX.each(b.collection, function(b) {
                        c.searchKeys.forEach(function(c) {
                            a || e.push(b);
                            var d;
                            try {
                                d = MX.get(c, b);
                            } catch (f) {}
                            d && d.toLowerCase().indexOf(a) >= 0 && e.push(b);
                        });
                    }), d.push({
                        title: b.title,
                        action: b.action,
                        collection: e
                    });
                }) : this.collection.each(function(b) {
                    c.searchKeys.forEach(function(c) {
                        d.length > 10 || (a || d.push(b), MX.get(c, b).toLowerCase().indexOf(a) >= 0 && d.push(b));
                    });
                }), this.loadResult(d, a);
            }
        },
        isValid: function(a) {
            return a.length > this.minKeywordLength;
        },
        isChanged: function(a) {
            return this.currentText != a;
        },
        move: function(a) {
            var b = this.$el.children(".active"), c = this.$el.children(), d = b.index() + a;
            return c.eq(d).length && (b.removeClass("active"), c.eq(d).addClass("active")), 
            !1;
        },
        onEnter: function() {
            return this.$el.children(".active").click(), !1;
        },
        loadResult: function(a, b) {
            if (this.currentText = b, this.show().reset(), a.length) {
                if (this.multiSections) {
                    var c = this;
                    a.forEach(function(a) {
                        a.collection.length && MX.each(a.collection, function(b) {
                            c.addItem(b, a.options);
                            var d, e, f = a.mappingKey, g = a.mappings || {};
                            if (f) {
                                try {
                                    d = MX.get(f, b);
                                } catch (h) {}
                                d && g[d] && (e = g[d], MX.each(e.collection, function(a) {
                                    c.addItem(a, e.options);
                                }));
                            }
                        });
                    });
                } else _.forEach(a, this.addItem, this);
                this.show();
            } else this.hide();
        },
        addItem: function(a, b) {
            var c = {
                model: a,
                parent: this
            };
            _.extend(c, b), MX.isString(this.itemView) ? (_.extend(c, _.clone(a.toJSON())), 
            this.$el.append(this.itemTemplate(c))) : this.$el.append(new this.itemView(c).render().$el);
        },
        select: function(a) {
            for (var b, c = 0; c < this.searchKeys.length; c++) try {
                if (b = MX.get(this.searchKey[c], a)) break;
            } catch (d) {}
            b = b || "", this.input.val(b), this.currentText = b, this.onSelect(a);
        },
        reset: function() {
            return this.$el.empty(), this;
        },
        hide: function() {
            return this.$el.hide(), this;
        },
        show: function() {
            return this.$el.show(), this;
        },
        onSelect: function() {}
    }), MX.ui.Autocomplete;
}), define("text!template/user/userMenuItem.html", [], function() {
    return '{{#if group}}\n<div class="mx-user contact-avatar ellipsis" \n	data-id="{{group.id}}" data-action="{{action}}" \n	data-seq="{{sequence}}" data-primary="sequence">\n		<img class="img-circle mx-noborder mx-noborder-radius mx-nobox-shadow" src="{{avatar}}"><span title="{{group.name}}">{{group.name}}</span>\n</div>\n{{else}}\n<div class="mx-user contact-avatar ellipsis {{clsName}}" \n	data-id="{{user.id}}" {{#if isInTeam}}{{#unless isPending}}data-action="{{action}}"{{/unless}}{{else}}data-action="{{action}}"{{/if}}\n	data-seq="{{sequence}}" {{#if isInTeam}}{{#if isPending}}style="color:#ccc;cursor:not-allowed;"{{/if}}{{/if}} {{#unless user.id}}data-primary="sequence"{{/unless}}>\n		<img class="img-circle " src="{{avatar}}"><span title="{{user.name}}">{{user.name}}</span>\n</div>\n{{/if}}\n';
}), define("text!template/todo/todoActivities.html", [], function() {
    return '<div class="activity-header">\n    <a class="btn-link pull-right activity-close" data-action="closeActivity"><span>{{lang.close}}</span></a>\n    <h4 class="activity-title">{{lang.activities_capitalize}}</h4>\n</div>\n<div class="mx-activity-msgbox-wrap">\n    <div class="mx-activity-msgbox ">\n    </div>\n</div>\n';
}), define("text!template/todo/todoCommentActivity.html", [], function() {
    return '<div class="todo-comment-item todo-comments">\n    <span class="pull-left mx-user"> <img class="" src="{{actor.avatar}}" /> </span>\n\n    <div class="todo-wrap">\n        <div class="todo-commentator">\n            <strong>{{actor.user.name}}</strong>\n        </div>\n        <div class="todo-comment">\n            {{linkMode message.comment}}\n        </div>\n        <div class="todo-comment">\n            {{formatDatetime created_time}}\n        </div>\n    </div>\n</div>\n';
}), define("text!template/todo/todoDueDateActivity.html", [], function() {
    return '<div class="activity-item">\n\n    <span class="pull-left mx-icon"><i class="micon-calendar"></i></span>\n    <div class="activity-wrap">\n        <span class="actor">{{message.chatMsg}}</span> <span>{{message.todoAction}}</span>\n        <div>{{formatDatetime created_time}}</div>\n    </div>\n</div>\n';
}), define("text!template/todo/todoActionActivity.html", [], function() {
    return '<div class="activity-item">\n    <span class="pull-left mx-icon">\n        {{#when type \'==\' const.feed.TODO_COMPLETE}}<i class="micon-todo"></i>{{/when}}\n        {{#when type \'!=\' const.feed.TODO_COMPLETE}}<i class="micon-square"></i>{{/when}}\n    </span>\n    <div class="activity-wrap">\n        <span class="actor">{{message.todoAction}}</span>\n        <div>{{formatDatetime created_time}}</div>\n    </div>\n</div>\n';
}), define("text!template/todo/todoUpdateNoteActivity.html", [], function() {
    return '<div class="activity-item">\n\n    <span class="pull-left mx-icon"><i class="micon-square"></i></span>\n    <div class="activity-wrap">\n        <span class="actor">{{message.todoAction}}</span>\n        <div>{{formatDatetime created_time}}</div>\n    </div>\n</div>\n';
}), define("text!template/todo/todoAttachmentActivity.html", [], function() {
    return '<div class="activity-item">\n    <span class="pull-left mx-icon"><i class="micon-paperclip"></i></span>\n    <div class="activity-wrap">\n        <span class="actor">{{message.todoAction}}</span>\n        <div>{{formatDatetime created_time}}</div>\n    </div>\n</div>\n';
}), define("text!template/todo/todoAssignActivity.html", [], function() {
    return '<div class="activity-item">\n\n    <span class="pull-left mx-icon"><i class="micon-user-with-arrow"></i></span>\n    <div class="activity-wrap">\n        <span>{{message.todoAction}}</span>\n        <div>{{formatDatetime created_time}}</div>\n    </div>\n</div>\n';
}), define("binder/todo/todoActivity", [ "moxtra", "lang", "const", "text!template/todo/todoActivities.html", "app", "text!template/todo/todoCommentActivity.html", "text!template/todo/todoDueDateActivity.html", "text!template/todo/todoActionActivity.html", "text!template/todo/todoUpdateNoteActivity.html", "text!template/todo/todoAttachmentActivity.html", "text!template/todo/todoAssignActivity.html" ], function(a, b, c, d, e, f, g, h, i, j, k) {
    "use strict";
    function l(d) {
        return a.Controller.extend({
            template: d,
            init: function() {
                this.$scope.lang = b, this.$scope.const = c;
            },
            rendered: function() {}
        });
    }
    var m = MX.logger("chat"), n = {
        FEED_TODO_COMMENT: l(f),
        FEED_TODO_UPDATE: l(i),
        FEED_TODO_DUE_DATE: l(g),
        FEED_TODO_ATTACHMENT: l(j),
        FEED_TODO_ASSIGN: l(k),
        DEFAULT: l(h)
    };
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        rendered: function() {
            this.updateAll(), this.listenTo(this.collection, Moxtra.const.EVENT_DATA_ADD, this.addOneActivity);
        },
        init: function(a) {
            this.$scope.lang = b, this.collection = a.collection;
        },
        addOneActivity: function(a) {
            a = this.collection.get(a), m.log("add one feed : " + a.sequence + " from " + e.request.page());
            {
                var b;
                this.$el.find(".mx-activity-msgbox");
            }
            this.renderFeedView(a, null, b), this.scrollToBottom();
        },
        updateAll: function() {
            var a = this;
            this.collection.each(function(b) {
                a.renderFeedView(b);
            }), this.scrollToBottom();
        },
        renderFeedView: function(a) {
            var b = this.$el.find(".mx-activity-msgbox"), c = n[a.type];
            c || (c = n.DEFAULT);
            var d = new c({
                model: a,
                renderTo: b
            });
            this.recovery(d);
        },
        scrollToBottom: function() {
            var a = this;
            setTimeout(function() {
                a.$el.scrollTop(a.$el.scrollHeight);
            }, 100);
        },
        closeActivity: function() {
            this.$el.parent().addClass("hide");
        }
    });
}), define("binder/todo/todoBiz", [ "moxtra", "app" ], function() {
    "use strict";
    return {
        getAssignees: function(a, b) {
            a = a, b = b || {};
            var c, d = Moxtra.getMe().groups, e = {};
            return c = Moxtra.getBoardMembers(a, function(a) {
                return a.is_deleted ? !1 : !0;
            }, function(a, b) {
                var c, d;
                return a.group && b.group ? (c = (MX.get("name", a.group) || "").toLowerCase(), 
                d = (MX.get("name", b.group) || "").toLowerCase(), c > d ? 1 : -1) : a.group && !b.group ? 1 : !a.group && b.group ? -1 : (c = (MX.get("name", a.user) || "").toLowerCase(), 
                d = (MX.get("name", b.user) || "").toLowerCase(), c > d ? 1 : -1);
            }), e = {
                options: {
                    action: b.memberAction
                },
                collection: c,
                mappingKey: "group.id",
                mappings: {}
            }, MX.each(c, function(a) {
                a.group && a.group.id && d.get(a.group.id) && (e.mappings[a.group.id] = {
                    options: {
                        action: b.teamAction,
                        clsName: "subitem",
                        isInTeam: !0
                    },
                    collection: a.group.members
                });
            }), [ e ];
        }
    };
}), define("binder/todo/todoDetail", [ "moxtra", "app", "lang", "const", "text!template/todo/todoDetail.html", "text!template/todo/todoNote.html", "text!template/todo/todoAttachment.html", "text!template/todo/todoComment.html", "component/editor/inlineEditor", "../../component/selector/fileSelector", "component/autocomplete/autocomplete", "text!template/user/userMenuItem.html", "binder/newBinderOptions", "binder/binderActions", "binder/todo/todoActivity", "binder/todo/todoBiz", "component/uploader/uploader", "component/selector/inputTextSelector", "viewer/viewer", "component/templateHelper", "text!template/todo/todoCommentActivity.html", "text!template/todo/todoDueDateActivity.html", "text!template/todo/todoActionActivity.html", "text!template/todo/todoUpdateNoteActivity.html", "text!template/todo/todoAttachmentActivity.html", "text!template/todo/todoAssignActivity.html" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
    "use strict";
    var A = MX.logger("todoDetail"), B = Backbone.View.extend({
        tagName: "li",
        template: Handlebars.compile(l),
        events: {
            click: "select"
        },
        initialize: function(a) {
            this.options = a;
        },
        render: function() {
            var a = this.options || {}, b = this.model.toJSON();
            return this.$el.html(this.template(_.extend(_.clone(b), a))), this;
        },
        select: function() {
            return this.options.parent.hide().select(this.model), !1;
        }
    });
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        events: {
            "keydown #todoComment": "createComment",
            "keyup #todoComment": "typeAhead"
        },
        init: function(a) {
            this.model = a.model, this.model.creator.user = this.model.creator.user || {}, this.$scope.createdDate = MX.format(c.todo_created_date, {
                name: this.model.creator && this.model.creator.user && this.model.creator.user.displayName || "",
                date: moment(this.model.created_time).format("l")
            }), this.$scope.lang = c, this.$scope.defaultUserAvatar = Moxtra.getMe().branding.getDefaultUserAvatar(), 
            this.listenTo(this.model, "change", this.updateDatail), this.listenTo(this.model.comments, "change", this.updateComments), 
            this.listenTo(b.request, "change:page", this.closeDetail);
        },
        rendered: function() {
            var b = this, e = this.model, f = !1, h = !1, i = !1, j = !1, l = this.model.getParent("Board"), m = p.getAssignees(l.id);
            this.recovery(m[0].collection), new k({
                input: this.$("#assign"),
                itemView: B,
                multiSections: !0,
                collection: m,
                searchKeys: [ "user.name", "group.name" ],
                onSelect: function(a) {
                    if (a.status.indexOf("GROUP_") > -1) {
                        var c = MX.get("id", a.user);
                        c && b._updateAssigneeInTeam(c);
                    } else b._updateAssignee(a.sequence);
                }
            }).render(), this.$("#due_date").datetimepicker({
                timepicker: !0,
                scrollInput: !1,
                lang: Moxtra.getMe().language,
                format: this._getPickerFormat(e.due_date),
                formatTime: "HH:mm",
                formatDate: "YYYY-MMMM-DD",
                step: 30,
                value: e.due_date ? this._formatDate(e.due_date) : "",
                onSelectTime: function() {
                    f = !0;
                },
                onSelectDate: function() {
                    h = !0;
                },
                onClose: function(a) {
                    if ((f || h) && (f = !1, h = !1, a)) {
                        var c = a.getTime();
                        c !== e.due_date && (b._updateDueDate(c), this.setOptions({
                            format: b._getPickerFormat(c),
                            value: b._formatDate(c)
                        }));
                    }
                }
            }), this.$("#reminders").datetimepicker({
                timepicker: !0,
                scrollInput: !1,
                lang: Moxtra.getMe().language,
                format: this._getPickerFormat(e.reminders),
                formatTime: "HH:mm",
                formatDate: "YYYY-MMMM-DD",
                step: 30,
                value: e.reminders ? this._formatDate(e.reminders) : "",
                onSelectTime: function() {
                    i = !0;
                },
                onSelectDate: function() {
                    j = !0;
                },
                onClose: function(a) {
                    if ((i || j) && (i = !1, j = !1, a)) {
                        var c = a.getTime();
                        c !== e.reminders && (b._updateRemindDate(c), this.setOptions({
                            format: b._getPickerFormat(c),
                            value: b._formatDate(c)
                        }));
                    }
                }
            }), this.$("#note").on("blur", function(a) {
                var c = a.currentTarget.value;
                c !== b.model.note && b._updateNote(c);
            }), this.$(".detail-options").off("scroll.todo_detail").on("srcroll.todo_detail", function() {
                $(window).trigger("resize.xdsoft");
            }), this.attachmentsList = new a.List({
                parent: this,
                renderTo: this.$(".todo-attachments"),
                collection: this.model.attachments,
                template: g,
                sortable: !1,
                unifyLazyload: !1,
                hideLoading: !0,
                syncField: {
                    file: [ "name", "thumbnail", "pages" ]
                },
                $scope: {
                    lang: c,
                    blankImg: d.defaults.blankImg,
                    todoId: e.client_uuid,
                    defaultFileThumbnail: Moxtra.config.defaults.thumbnail_file
                }
            }), this.activityContainer = this.$el.find(".activityContainer"), this.activities = Moxtra.getTodoFeeds(this.model.parent.id, this.model.sequence), 
            this._updateActivities(), this.listenTo(this.activities, Moxtra.const.EVENT_DATA_ADD, function() {
                this._updateActivities();
            }), this.$("#todoComment").autosize(), this._dueDate(this.model.due_date), this._remindDate(this.model.reminders), 
            this.initUploader(), this.model.is_completed && this.$(".todo-wrap .close , .todo-wrap .edit-comment").addClass("disabled"), 
            $('[data-action="refreshTodoUploader"]').parent().on("hide.bs.dropdown", function() {
                q.hide("uploadTodoAttachment");
            }), this.recovery(function() {
                b.$("#due_date").datetimepicker("destroy"), b.$("#reminders").datetimepicker("destroy");
            });
        },
        _updateActivities: function() {
            function b(b) {
                return a.Controller.extend({
                    template: b,
                    init: function() {
                        this.$scope.lang = c, this.$scope.const = d;
                    },
                    rendered: function() {}
                });
            }
            this.$el.find(".activities-count").text(this.activities.length > 1 ? MX.format(c.many_activities, {
                count: this.activities.length
            }) : c.one_activity);
            var e = {
                FEED_TODO_COMMENT: b(u),
                FEED_TODO_UPDATE: b(x),
                FEED_TODO_DUE_DATE: b(v),
                FEED_TODO_ATTACHMENT: b(y),
                FEED_TODO_ASSIGN: b(z),
                DEFAULT: b(w)
            }, f = this.activities.length, g = 5;
            this.$el.find(".last-activity").empty();
            for (var h = f - 1; h >= 0 && !(0 >= g); h--) {
                var i = this.activities.at(h), j = e[i && i.type];
                j || (j = e.DEFAULT), this.recovery(new j({
                    model: i,
                    renderTo: this.$el.find(".last-activity"),
                    renderType: "prepend"
                })), g--;
            }
        },
        showCompleteActivities: function() {
            this.todoActivity && this.todoActivity.destroy(), this.activityContainer.empty().removeClass("hide"), 
            this.todoActivity = new o({
                collection: this.activities,
                renderTo: this.activityContainer
            }), this.recovery(this.todoActivity);
        },
        refreshTodoUploader: function() {
            setTimeout(function() {
                q.refresh("uploadTodoAttachment", $("#uploadTodoAttachment"));
            }, 100);
        },
        initUploader: function() {
            var a = this, b = this.model.parent.id;
            q.register("uploadTodoAttachment", {
                browse_button: "uploadTodoAttachment",
                url: function(c, d) {
                    return MX.format("/board/{{boardid}}/todo/{{sequence}}/{{resource_name}}?type=original", {
                        boardid: b,
                        sequence: a.model.sequence,
                        resource_name: encodeURIComponent(d.name)
                    });
                },
                success: function(a, b) {
                    var c = JSON.parse(b.response);
                    console.log(a, c);
                }
            }), this.recovery(function() {
                q.hide("uploadTodoAttachment");
            }), this.recovery(function() {
                q.hide("uploadTodoAttachment");
            });
        },
        removeAssignee: function() {
            this._updateAssignee(0);
        },
        _updateAssignee: function(a) {
            var b = this;
            this.model.set("assignee_sequence", a), this.model.updateAssignee().success(function() {
                b._assignTo(b.model.assignee);
            }).error(c.assign_todo_failed);
        },
        _updateAssigneeInTeam: function(a) {
            var b = this;
            this.model.updateAssigneeInTeam(a).success(function() {
                b._assignTo(b.model.assignee);
            }).error(c.assign_todo_failed);
        },
        _updateNote: function(a) {
            this.model.set("note", a), this.model.update();
        },
        removeDueDate: function() {
            this._updateDueDate(0);
        },
        removeRemindDate: function() {
            var a = this;
            this.model.deleteReminder().success(function() {
                a._remindDate(0);
            }).error(c.set_remind_date_failed);
        },
        _updateDueDate: function(a) {
            var b = this;
            this.model.set("due_date", a), this.model.updateDueDate().success(function() {
                b._dueDate(a);
            }).error(c.set_due_date_failed);
        },
        _updateRemindDate: function(a) {
            var b = this;
            this.model.set("reminders", a), this.model.updateReminder().success(function() {
                b._remindDate(a);
            }).error(c.set_remind_date_failed);
        },
        addAttachments: function() {
            var a = this.model.parent.id, b = this;
            this.recovery(new MX.ui.Dialog(new j({
                boardId: a,
                multiple: !0,
                style: "form",
                buttons: [ {
                    text: c.cancel,
                    position: "left",
                    click: function() {
                        this.close();
                    }
                }, {
                    text: c.add,
                    position: "right",
                    className: "btn-primary",
                    click: "addPageToTodo"
                } ],
                addPageToTodo: function() {
                    var a = [], d = null, e = this.value();
                    e && e.length && (d = e[0].parent, e.forEach(function(b) {
                        b && a.push(b.client_uuid);
                    }), b.model.addAttachments(null, a, d).success(a.length ? c.add_attachments_success : c.add_attachment_success).error(a.length ? c.add_attachments_failed : c.add_attachment_failed)), 
                    this.dialog.close();
                }
            })));
        },
        removeAttachments: function(a) {
            var b = this.model;
            MX.ui.Confirm(c.confirm_remove_attachment, function() {
                b.removeAttachments(a).error(c.remove_attachment_failed);
            });
        },
        editTodoName: function() {
            var b, c = this.model.name, d = a.Model.extend({
                name: ""
            }), e = this;
            b = new d({
                name: c
            }), this.recovery(new i({
                replaceElement: this.$(".todo-name"),
                model: b,
                bindingPath: "name",
                onSubmit: function() {
                    var a = b.get("name"), d = this;
                    c === a ? d.exitEdit() : (e.model.set("name", a), e.model.update().success(function() {
                        d.exitEdit(), e.$(".todo-name").html(MX.escapeHTML(a));
                    }).error(function() {}));
                }
            }));
        },
        closeTodo: function() {
            var a = this;
            this.model.updateCompleted(!0).success(function() {
                a._completed(!0);
            }).error(function() {});
        },
        reopenTodo: function() {
            var a = this;
            this.model.updateCompleted(!1).success(function() {
                a._completed(!1);
            }).error(function() {});
        },
        markTodo: function() {
            Moxtra.markTodo(this.model.parent.id, this.model.sequence);
        },
        unmarkTodo: function() {
            var a = this;
            this.model.set("is_marked", !1), this.model.update().success(function() {
                a._marked(!1);
            });
        },
        createComment: function(a) {
            this.typeAheadMode && this.inputSelector.handleKeyDown(a);
            var b = $(a.target);
            if (a.stopPropagation(), a.keyCode === d.keys.Enter && !a.shiftKey && (a.preventDefault(), 
            !this.typeAheadMode)) {
                var c = $.trim(b.val());
                if (c.length > 0) {
                    var e = Moxtra.createTodoCommentModel(this.model);
                    e.set("text", c), e.create().success(function() {}).error(function() {}), this.$el.find(".last-activity").append(Handlebars.compile(u)({
                        sequence: e.client_uuid,
                        message: {
                            comment: c
                        },
                        actor: {
                            user: Moxtra.getMe(),
                            avatar: Moxtra.getMe().avatar
                        }
                    })), b.val(""), b.trigger("autosize.resize");
                }
            }
        },
        deleteTodo: function() {
            var a = this;
            this.recovery(new MX.ui.Dialog({
                width: 300,
                title: c.confirm,
                buttons: [ {
                    text: c.cancel,
                    click: function() {
                        this.close();
                    }
                }, {
                    text: c.ok,
                    className: "btn-primary",
                    click: function() {
                        this.close(), a.model.delete().success(function() {
                            MX.ui.notifySuccess(c.delete_todo_success), setTimeout(a.closeDetail(), 2e3);
                        }).error(function() {
                            MX.ui.notifyError(c.delete_todo_failed);
                        });
                    }
                } ],
                content: c.delete_to_do_confirm
            }));
        },
        updateComments: function() {
            this.model.comments.length ? this.$(".todo-comments").addClass("active") : this.$(".todo-comments").removeClass("active");
        },
        updateDatail: function() {
            this._completed(this.model.is_completed ? !0 : !1), this._marked(this.model.is_marked ? !0 : !1), 
            this.model.is_deleted && this.closeDetail(), this._assignTo(this.model.assignee), 
            this._dueDate(this.model.due_date), this._remindDate(this.model.reminders);
        },
        _completed: function(a) {
            a ? (this.$el.addClass("todo-completed"), this.$("input").attr("disabled", !0), 
            this.$(".action-name").addClass("disabled"), this.$(".action-attachment").addClass("disabled"), 
            this.$(".action-copy").addClass("disabled"), this.$(".todo-wrap .close , .todo-wrap .edit-comment").addClass("disabled")) : (this.$el.removeClass("todo-completed"), 
            this.$("input").attr("disabled", !1), this.$(".action-name").removeClass("disabled"), 
            this.$(".action-attachment").removeClass("disabled"), this.$(".action-copy").removeClass("disabled"), 
            this.$(".todo-wrap .close , .todo-wrap .edit-comment, .todo-wrap .action-copy").removeClass("disabled"));
        },
        removeTodoComment: function(a) {
            var b = this.handleEvent;
            b.stopPropagation();
            var d = this.model.comments.get(a);
            d.delete().error(c.remove_comment_failed);
        },
        editTodoComment: function(a) {
            var b = this.handleEvent, d = $(b.currentTarget).parent();
            b.stopPropagation();
            var e = this.model.comments.get(a);
            this.recovery(new i({
                replaceElement: d,
                model: e,
                bindingPath: "text",
                onSubmit: function() {
                    e.update().error(c.update_comment_failed), this.exitEdit();
                }
            }));
        },
        _marked: function(a) {
            a ? this.$(".detail-header").addClass("marked") : this.$(".detail-header").removeClass("marked");
        },
        _assignTo: function(a) {
            var b = this.$("#assign_clear"), c = "";
            a ? (b.addClass("active"), c = MX.get("name", a.user) || MX.get("name", a.group) || "", 
            this.$("#assign").val(c), this.$("#assignAvatar").attr("src", a.avatar).parent().removeClass("hide").prev().addClass("hide")) : (b.removeClass("active"), 
            this.$("#assign").val(""), this.$("#assignAvatar").parent().addClass("hide").prev().removeClass("hide"));
        },
        _dueDate: function(a) {
            a ? this.$("#due_date_clear").addClass("active") : (this.$("#due_date_clear").removeClass("active"), 
            this.$("#due_date").val("")), a && this._isDateExpired(a) ? this.$("#due_date").addClass("mx-expired-date") : this.$("#due_date").removeClass("mx-expired-date");
        },
        _remindDate: function(a) {
            a ? this.$("#remind_date_clear").addClass("active") : (this.$("#remind_date_clear").removeClass("active"), 
            this.$("#reminders").val("")), a && this._isDateExpired(a) ? this.$("#reminders").addClass("mx-expired-date") : this.$("#reminders").removeClass("mx-expired-date");
        },
        _isDateExpired: function(a) {
            return moment(a).isBefore(Date.now(), "day") || moment(a).isSame(Date.now(), "day");
        },
        _getPickerFormat: function() {
            return "LLL";
        },
        _formatDate: function(a) {
            return MX.lang.format(a, "LLL");
        },
        closeDetail: function() {
            $("#todoDetail").addClass("hide"), $(".mx-tab-content").removeClass("todo-detail"), 
            $(".mx-todos").removeClass("detail-action"), $(".mx-binder-todos li").removeClass("active"), 
            $(".mx-binder-todos-completed li").removeClass("active"), $("#due_date").datetimepicker("destroy"), 
            $("#reminders").datetimepicker("destroy"), this.isClosed = !0;
        },
        viewAttachment: function(a) {
            var b = this.model, c = b.parent, d = c.getMyBoardUserInfo(), e = b.attachments.get(a), f = new Moxtra.Collection({
                model: "Moxtra.model.BoardFile",
                attributeId: "sequence"
            });
            b.attachments.each(function(a) {
                f.push(a.file);
            });
            var g = e.file.pages;
            a = g && g.length ? e.file.pages[0].sequence : e.file.client_uuid;
            var h = new s({
                collection: f,
                renderTo: "body",
                userRole: d.type,
                roleContext: "binder",
                keepInstance: !1
            });
            h.open(a), h.setUserRole(d.type);
        },
        downloadResources: function(a) {
            n.downloadResource(this.model.parent.id, a);
        },
        copyTo: function() {
            var a = this.model.parent.id, b = this;
            return new MX.ui.Dialog({
                content: new MX.ui.BinderSelector({
                    title: c.binder_copy_a_todo_to,
                    buttons: [ {
                        text: c.copy,
                        position: "right",
                        className: "btn-primary",
                        click: "copyTodoToBinder"
                    } ],
                    onChange: function() {
                        A.debug(this, arguments);
                    },
                    newBinder: function() {
                        var a = this;
                        this.dialog.push(new m({
                            onCreatedBinder: function(b) {
                                a.copyTodo(b);
                            }
                        }));
                    },
                    copyTodoToBinder: function() {
                        var a = this.value();
                        this.copyTodo(a[0]);
                    },
                    copyTodo: function(d) {
                        var e = Moxtra.getBoard(a);
                        e.copyTodo(b.model.sequence, d).success(function() {
                            MX.ui.notifySuccess(c.binder_copy_todo_success);
                        }).error(function() {
                            MX.ui.notifyError(c.binder_copy_todo_fail);
                        }), this.dialog.close();
                    }
                })
            });
        },
        moveTo: function() {
            var a = this.model.parent.id, b = this;
            return new MX.ui.Dialog({
                content: new MX.ui.BinderSelector({
                    title: c.binder_move_a_todo_to,
                    buttons: [ {
                        text: c.move,
                        position: "right",
                        className: "btn-primary",
                        click: "moveTodoToBinder"
                    } ],
                    onChange: function() {
                        A.debug(this, arguments);
                    },
                    newBinder: function() {
                        var a = this;
                        this.dialog.push(new m({
                            onCreatedBinder: function(b) {
                                a.moveTodo(b);
                            }
                        }));
                    },
                    moveTodoToBinder: function() {
                        var a = this.value();
                        this.moveTodo(a[0]);
                    },
                    moveTodo: function(d) {
                        var e = Moxtra.getBoard(a);
                        e.moveTodo(b.model.sequence, d).success(function() {
                            MX.ui.notifySuccess(c.binder_move_todo_success);
                        }).error(function() {
                            MX.ui.notifyError(c.binder_move_todo_fail);
                        }), this.dialog.close();
                    }
                })
            });
        },
        zoomNoteText: function() {
            var a = this.$("#note").val(), b = this, d = this.model.name, e = Handlebars.compile(f), g = new MX.ui.Dialog({
                content: $(e(_.extend({
                    note: a,
                    lang: c
                }))).html(),
                title: d,
                className: "note-container"
            });
            g.on("close", function() {
                var c = this.$("textarea").val();
                c !== a && (b._updateNote(c), b.$("#note").val(c));
            });
        },
        typeAhead: function(a) {
            var c = $(a.target), d = c.val(), e = this, f = /(?:^|[\b\s]+)@(\S*)$/, g = this.model.getParent("Board");
            if (50 === a.keyCode || this.typeAheadMode && a.keyCode !== b.const.keys.Enter && a.keyCode !== b.const.keys.Up && a.keyCode !== b.const.keys.Down && a.keyCode !== b.const.keys.Escape) if (d && f.test(d)) {
                this.inputSelector || (this.inputSelector = new r({
                    collection: g.members,
                    renderTo: ".todo-comment-typeahead-helper",
                    textarea: c,
                    contextBox: $(".todo-detail-wrap")
                }), this.inputSelector.onAutoInput(function(a) {
                    c.val(c.val().replace(/@[^\s@]*$/, "@" + a + " ")).focus(), e.$(".todo-comment-typeahead-helper").hide(), 
                    e.typeAheadMode = !1;
                }), this.recovery(this.inputSelector)), this.$(".todo-comment-typeahead-helper").show(), 
                this.typeAheadMode = !0;
                var h = d.match(f)[1];
                this.inputSelector.filter(h), "" === this.inputSelector.selectedText() && this.$(".todo-comment-typeahead-helper").hide();
            } else this.typeAheadMode && (this.$(".todo-comment-typeahead-helper").hide(), this.typeAheadMode = !1); else a.keyCode !== b.const.keys.Enter || a.shiftKey ? a.keyCode === b.const.keys.Escape && (this.$(".todo-comment-typeahead-helper").hide(), 
            this.typeAheadMode = !1) : (a.preventDefault(), this.typeAheadMode ? (c.val(c.val().replace(/@\w*$/g, "@" + this.inputSelector.selectedText() + " ")), 
            this.$(".todo-comment-typeahead-helper").hide(), this.typeAheadMode = !1) : this.typeAheadMode = !1);
        }
    });
}), define("text!template/common/bizCard.html", [], function() {
    return '<div class="arrow"></div>\r\n<div class="mx-bizcard">\r\n    <div class="user-panel">\r\n        <ul class="user-info">\r\n            <li>\r\n                <span class="user-name ellipsis">{{user.name}}</span>\r\n            </li>\r\n            <li class="ellipsis-2line">\r\n                {{user.email}}\r\n            </li>\r\n            {{#if user.email}}\r\n                {{#unless user.email_verified}}\r\n                <li>\r\n                    <i>{{lang.not_verified_with_parentheses}}</i>\r\n                </li>\r\n                {{/unless}}\r\n            {{/if}}\r\n            <li>\r\n                {{user.phone_number}}\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <div class="contact-actions">\r\n        <a class="mx-btn mx-blue mouse-hand" title="{{lang.start_chat}}" data-action="startChat" data-param="{{user.email}},{{user.id}},{{user.unique_id}}">\r\n            <span class="mx-cricle"><i class="micon-chat-big mx-blue size32"></i></span><label>{{lang.chat}}</label>\r\n        </a>\r\n\r\n        <a class="mx-btn mx-orange mouse-hand" title="{{lang.start_meet}}" href="#mymeet?action=start_with_contact&email={{user.email}}&unique_id={{user.unique_id}}" target="{{meetTabName}}" oncontextmenu="return false;">\r\n            <span class="mx-cricle"><i class="micon-meet-big mx-orange size32"></i></span><label>{{lang.meet}}</label>\r\n        </a>\r\n    </div>\r\n    <div></div>\r\n</div>';
}), define("common/bizCard", [ "moxtra", "lang", "app", "text!template/common/bizCard.html", "meet/meet" ], function(a, b, c, d, e) {
    "use strict";
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            this.users = Moxtra.getMe().contacts;
            var d = MX.filter(this.users, {
                "user.id": a.id
            });
            if (!d) {
                var e = Moxtra.getBoard(c.request.page());
                e && (d = MX.filter(e.users, {
                    "user.id": a.id
                }));
            }
            d = d && d[0], d && (this.model = new Moxtra.model.Contact(d.user), this.$scope.user = this.model.toJSON(), 
            this.$scope.lang = b, this.$scope.meetTabName = c.config.global.meetTabName);
        },
        rendered: function() {},
        _buildUserInfo: function(a, b, c) {
            var d = {};
            return a ? d.email = a : b ? d.id = b : d.uniqueId = c, d;
        },
        startChat: function(a, d, e) {
            function f() {
                h.loading(!1), h.removeClass("disabled");
            }
            var g = this.handleEvent, h = $(g.currentTarget);
            h.loading(), h.addClass("disabled");
            var i = this._buildUserInfo(a, d, e);
            Moxtra.startChat(i).success(function(a) {
                f(), c.request.page(a.id);
            }).error(function() {
                f(), MX.ui.notifyError(b.contact_start_meet_failed);
            });
        },
        startMeet: function(a, c, d) {
            function f() {
                h.loading(!1), h.removeClass("disabled");
            }
            var g = this.handleEvent, h = $(g.currentTarget);
            h.loading(), h.addClass("disabled");
            var i = this._buildUserInfo(a, c, d);
            e.start({
                forceStart: !0,
                users: [ i ],
                success: function() {
                    f();
                },
                error: function() {
                    f(), MX.ui.notifyError(b.contact_start_chat_failed);
                }
            });
        }
    });
}), define("component/popover", [ "moxtra" ], function() {
    $.fn.popover = function(a) {
        if (a === !1) return void $("#tab_chat").undelegate('[data-view="bizCardView"]', "click.popover");
        var b = $("<div></div>"), c = "";
        $("#tab_chat").delegate('[data-view="bizCardView"]', "click.popover", function(d) {
            return $(window).on("click.popover", function(a) {
                b.find(a.target).length || ($('[data-view="bizCardView"]').removeClass("open"), 
                c = "", $(window).off("click.popover"));
            }), b.find(d.target).length ? void 0 : (c = $(this).attr("data-param"), b.html(""), 
            new a.view({
                id: c,
                renderTo: b
            }), b.addClass("dropdown-menu popover right").appendTo($(this).addClass("open")), 
            !1);
        });
    };
}), define("binder/chat", [ "moxtra", "lang", "const", "text!template/chat/main.html", "app", "binder/binderBiz", "binder/binderActions", "binder/chat/feedProgress", "binder/chat/feedAudio", "binder/chat/feedPageAudio", "meet/management/meetInfo", "meet/management/scheduleForm", "text!template/chat/emptyView.html", "text!template/chat/feedCommentView.html", "text!template/chat/feedAnnotateView.html", "text!template/chat/feedSystemView.html", "text!template/chat/feedEmailView.html", "text!template/chat/feedImageView.html", "text!template/chat/feedResourceView.html", "text!template/chat/feedUrlView.html", "text!template/chat/feedVideoView.html", "text!template/chat/feedAudioView.html", "text!template/chat/feedTodoView.html", "text!template/chat/feedTodoDueView.html", "text!template/chat/feedItemActionView.html", "text!template/chat/feedTimeItemView.html", "text!template/chat/feedViewMoreView.html", "text!template/chat/feedBoardCreateView.html", "text!template/chat/feedFolderView.html", "text!template/chat/feedSessionsUpdateView.html", "text!template/chat/feedSessionsCreateView.html", "text!template/chat/feedSessionsActionView.html", "common/loadingDialog", "meet/player", "component/textarea", "binder/todo/todoDetail", "component/selector/userSelector", "component/uploader/uploader", "component/selector/inputTextSelector", "binder/newBinderOptions", "common/share", "common/bizCard", "common/userCap", "admin/branding/helper", "component/popover" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R) {
    "use strict";
    function S(d) {
        return a.Controller.extend({
            template: d,
            init: function(a) {
                this.$scope.lang = b, this.$scope.branding = {
                    showAddFile: R.isShowAddFile(),
                    showTodo: R.isShowTodo(),
                    showBinderOptions: R.isShowBinderOptions()
                }, this.$scope.openBizCard = {
                    openBizCard: !0,
                    isWebsdk: U
                }, this.$scope.isIntegration = X, this._buildCustomFeedActions();
                var f = this;
                if (this.model.on && this.listenTo(this.model, "change", this.updateView), d === B) {
                    var g = e.request.page(), h = Moxtra.getBoard(g);
                    this.$scope.binderId = g, this.$scope.showWebhook = !X, this.listenTo(h, "change:description", function() {
                        this.updateView();
                    });
                }
                if (d === F && this.model.message.isStart && this.model.source && "BoardSession" === this.model.source.$name && (this.$scope.target = e.config.global.meetTabName, 
                this.listenTo(this.model.source, "change", function(a) {
                    a.session.session_status === Moxtra.const.SESSION_ENDED && this.updateView();
                })), this.model.source && "BoardResource" === this.model.source.$name && this.listenTo(this.model.resource, "change", function(a) {
                    a.status === Moxtra.const.BOARD_RESOURCE_STATUS_CONVERTED && this.updateView();
                }), this.model.type !== c.feed.PAGES_CREATE || this.model.page || this.model.on("change:board", function(a) {
                    a.pages && (f.model.off("change:board"), setTimeout(function() {
                        var a = $(".mx-chat-msgbox-wrap"), b = $("#feed" + f.model.sequence);
                        if (b) {
                            var c = a.scrollTop(), d = a.height(), e = b.position().top, g = b.height(), h = c > e && e + g > c || e > c && c + d > e;
                            h && a.scrollTop(a[0].scrollHeight);
                        }
                    }, 500));
                }), this.model.page && "BoardPage" === this.model.page.$name && (this.listenTo(this.model.page, "change:thumbnail", function() {
                    this.updateView();
                }), this.listenTo(this.model.page.comments, "change", function() {
                    this.updateView();
                })), this.model.type === c.feed.PAGES_COMMENT) {
                    var i = this.model.message.comment.sequence;
                    i && this.listenToOnce(this.model.page.comments, "remove", function(a) {
                        a.sequence === i && f.switchView(o);
                    });
                }
                var j;
                if (a.binderModel) j = a.binderModel.type; else {
                    var k = Moxtra.getBoard(this.model.boardId).getMyBoardUserInfo() || {};
                    j = k.type;
                }
                var l = j !== Moxtra.const.BOARD_READ_WRITE && j !== Moxtra.const.BOARD_OWNER;
                (this.model.message.showAnnotateIndicator || this.model.message.showVideoIndicator || this.model.message.showWebIndicator) && (this.$scope.hasIndicator = !0, 
                this.$scope.defaultFileThumbail = c.defaults.binder.thumbnail_file), this.$scope.isOwner = j === Moxtra.const.BOARD_OWNER, 
                this.$scope.isViewer = l, this.$scope.hideRec = l || e.isMacAgentAppstore() || e.isMacAgentLocal();
            },
            rendered: function() {
                MX.env.isIE && $("textarea,:text").placeholder(), this.$el.find('a[class^="micon-"]').tooltip(), 
                $(".add-page").tooltip(), d === r && this.$el.find(".page-comment a").click(function(a) {
                    a.stopPropagation();
                });
            },
            afterUpdate: function() {
                this.$el.find('a[class^="micon-"]').tooltip();
            },
            _buildCustomFeedActions: function() {
                var a = [], b = [];
                if (X) {
                    var d, f = e.integration.get("extension");
                    if (f) {
                        try {
                            d = JSON.parse(0 === f.indexOf("{") ? f : decodeURIComponent(f));
                        } catch (g) {
                            console.error(g);
                        }
                        var h = d && d.menus && d.menus[0].page_action || [];
                        MX.each(h, function(c) {
                            "top" === c.position && a.push(c), "bottom" === c.position && b.push(c);
                        });
                    }
                }
                if (this.$scope.top_menus = a, this.$scope.bottom_menus = b, a.length || b.length) {
                    var i, j = "";
                    if (this.model.page) {
                        var k = this.model.page;
                        k.original_resource_sequence ? i = k.original_resource_sequence : (i = k.original || k.vector, 
                        k.page_type === c.binder.pageType.image && (i = i || k.background), j = k.sequence);
                    } else if (this.model.resource) {
                        var l = this.model.resource;
                        i = l.sequence;
                    }
                    var m = Moxtra.getBoard(e.request.page()), n = m.name + ".pdf";
                    j ? (this.$scope.download_url = location.origin + "/board/" + e.request.page() + "/" + j + "/" + i + "?d=", 
                    this.$scope.download_name = encodeURIComponent(this.model.page.name ? this.model.page.name + ".pdf" : n)) : (this.$scope.download_url = location.origin + "/board/" + e.request.page() + "/" + i + "?d=", 
                    this.$scope.download_name = encodeURIComponent(this.model.resource && this.model.resource.name || n));
                }
            },
            switchView: function(a) {
                this.template = a, this.updateView();
            }
        });
    }
    var T = MX.logger("chat"), U = e.isIntegrationWebsdk(), V = {
        annotate: S(o),
        comment: S(n),
        system: S(p),
        resource: S(s),
        url: S(t),
        progress: h,
        email: S(q),
        image: S(r),
        todo: S(w),
        todo_due: S(x),
        media: i,
        imageAudio: j,
        board_create: S(B),
        folder: S(C),
        sessions_create: S(E),
        sessions_update: S(D),
        sessions_action: S(F)
    }, W = Handlebars.compile(y), X = e.isIntegrationEnabled();
    Handlebars.registerHelper("feedItemActionView", function(a) {
        var c = W(MX.extend({
            lang: b
        }, a));
        return new Handlebars.SafeString(c);
    }), z = Handlebars.compile(z), A = Handlebars.compile(A);
    var Y = Handlebars.compile(m);
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        events: {
            "keydown [name=postComment]": "postComment",
            "keydown [name=addTodo]": "createTodo",
            "keyup textarea": "typeAhead"
        },
        rendered: function() {
            var a = this;
            this.$el.find('input[type="checkbox"]').mxCheckbox(), this.$el.find('input[type="checkbox"]').tooltip(), 
            this.$("[name=addTodo]").hide(), this.$("textarea").autosize({
                callback: function() {
                    if ($(this).is(":visible")) {
                        var a = $(".mx-chat-msgbox-wrap"), b = parseInt(a.css("bottom")), c = $(this).outerHeight() + 15;
                        a.css("bottom", c + "px"), c > b && a.scrollTop(a.scrollTop() + c - b);
                    }
                }
            }).val(Moxtra.chatDraft[a.binderid] || "").on("keyup", function() {
                var a = $(this).parent().children(".mx-checkbox");
                $(this).val().length > 0 ? a.hide() : a.show();
            }), this.recovery(function() {
                Moxtra.chatDraft[a.binderid] = a.$("textarea").val();
            }), this.$el.delegate(".self-comment", "mouseenter", function() {
                var b = parseInt($(this).attr("data-param")), c = a.msgs.get(b);
                c && (Date.now() - c.created_time <= Moxtra.const.LIMITED_COMMENTS_DELETE_TIME ? $(this).find(".delete").css("opacity", "0.8") : $(this).find(".delete").hide());
            }), this.$el.delegate(".self-comment", "mouseleave", function() {
                $(this).find(".delete").css("opacity", "0");
            }), $(".mx-chat-msgbox").on("click", function(a) {
                var b = $(a.target).parents(".dropup");
                1 === b.length && b.find(".dropdown-menu").css(b.offset().top - b.parents(".mx-chat-msgbox-wrap").offset().top < 140 ? {
                    bottom: "auto"
                } : {
                    bottom: "100%"
                });
            });
            a.$el.find(".mx-chat-msgbox-wrap").offset().top;
            this.listenTo(this.msgs, "inited", function() {
                this.$el.find(".mx-chat-msgbox-wrap").off("scroll.viewMore"), clearTimeout(this.emptyUITimer), 
                a.$(".mx-chat-msgbox").empty();
                var c = this.msgs.slice(0, this.msgs.length).reverse(), d = document.createDocumentFragment();
                MX.each(c, function(b) {
                    a.prependMsg(b, d), a.parent.unreadFeedCount && a._appendGuideline(b, d);
                }), this.$el.find(".mx-chat-msgbox").prepend(d), a.msgs.length > 0 ? (a.$el.find(".mx-chat-msgbox>:first-child").hasClass("feed-time") || "board_create" === a.msgs[0].message.viewType || (a.$el.find(".mx-chat-msgbox").prepend(z({
                    displayTime: MX.lang.formatDateTime(a.msgs[0].created_time)
                })), a.partialLastTime = this.msgs[0].created_time), this.msgs.hasNextPage && this.$el.find(".mx-chat-msgbox").prepend(A(b))) : a.$el.find(".mx-chat-msgbox").html(m);
                var f = e.request.params();
                f && f.seq ? a.gotoFeedProcessed || (a.gotoFeedProcessed = !0, a.gotoFeedItem(f.seq, function() {
                    setTimeout(function() {
                        a._bindingViewMoreEvent.call(a);
                    }, 50);
                })) : a.scrollToBottom(function() {
                    setTimeout(function() {
                        a._bindingViewMoreEvent.call(a);
                    }, 50);
                });
            }), this.listenTo(e.request, "change:params.seq", function() {
                var b = e.request.params();
                b.seq && a.gotoFeedItem(b.seq);
            }), this.listenTo(this.msgs, "add", this.addOneFeed), this.listenTo(this.msgs, "insert", this.cacheMsg), 
            this.listenTo(this.msgs, "PageLoaded", this.renderCacheMsg), this.listenTo(this.msgs, "remove", this.removeItem), 
            this.listenTo(this.msgs, "empty", function() {
                a.$el.loading(!1), this.emptyUITimer = setTimeout(function() {
                    var b = a.$(".mx-chat-msgbox");
                    b.empty(), b.append(Y(a.$scope));
                }, 200);
            }, this), a.listenTo(this.binder, Moxtra.const.EVENT_SYNC_START, function() {
                a.isLoadingNewMessage = !0;
            }), a.listenTo(this.binder, Moxtra.const.EVENT_SYNC_END, function() {
                a.isLoadingNewMessage = !1, setTimeout(function() {
                    a._isShowUnreadButton();
                }, 500);
            });
        },
        init: function(a) {
            var c = a.parent && a.parent.binderId || e.request.page();
            this.binder = Moxtra.getBoard(c), this.binderid = c, T.log("chat view init : " + c), 
            this.$scope.lang = b, this.$scope.config = e.config.global, this.$scope.branding = {
                showAddFile: R.isShowAddFile(),
                showTodo: R.isShowTodo()
            }, this.isLoad = a.isLoad, this.parent = a.parent, this.msgs = Moxtra.getBoardFeeds(c), 
            this.recovery(this.msgs), this.cacheCol = [], this.partialLastTime = 0, this.maxHistory = Q.getMaxHistory();
            var d = Moxtra.getMe();
            d.unique_id || this.initBizCard(), U && this.initBizCardMessager();
        },
        update: function() {
            var a = this;
            this.partialLastTime = 0, this.isViewingMore = 0, setTimeout(function() {
                a.$el.find('[autofocus="autofocus"]').focus();
            }, 300), this.$el.find(".at-input-helper").empty(), this.$el.find(".at-input-helper").hide(), 
            this.inputSelector && this.inputSelector.destroy(), this.inputSelector = null, this.typeAheadMode = !1;
        },
        removeItem: function(a) {
            var b = this.$el.find("#feed" + a.get("sequence"));
            b && (b.prev().hasClass("feed-time") && b.prev().remove(), b.remove());
        },
        addOneFeed: function(a) {
            T.log("add one feed : " + a.sequence + " from " + e.request.page());
            var c, d = this.$el.find(".mx-chat-msgbox");
            1 === this.msgs.length && d.empty();
            var f = a;
            a.comment && a.comment.client_uuid && (c = this.$el.find("#feed" + a.comment.client_uuid), 
            c = c.length > 0 ? c.eq(0) : null);
            var g;
            this.msgs && this.msgs.length >= 2 && (g = this.msgs.at(this.msgs.length - 2));
            var h = g && g.created_time || 0, i = 3e5, j = !1;
            if (moment(Date.now()).isSame(f.created_time, "day") ? f.created_time - h > i && (j = !0) : j = !0, 
            f.lang = b, j && !c && d.append(z({
                displayTime: MX.lang.formatDateTime(f.created_time)
            })), this.renderFeedView(null, a, null, c), this.isLoadingNewMessage) {
                if ($(".mx-new-feed-divide").length) return;
                if (a.created_time >= this.parent.lastAccessTime && this.parent.unreadFeedCount) {
                    var k = this.$("#feed" + a.sequence);
                    k.prev(".feed-time").length && (k = k.prev(".feed-time")), k.before(this._getGuideline());
                }
            }
            var l = $(".mx-chat-msgbox-wrap"), m = $("#feed" + g.sequence), n = !0;
            if (m.length) {
                var o = l.scrollTop(), p = l.height(), q = m.position().top, r = m.height();
                n = o > q && q + r > o || q > o && o + p > q;
            } else T.log("this feed can not find on chat stream, sequece is:" + g.sequence + ", type is: " + g.type + ", is_deleted:" + g.is_deleted);
            n && this.scrollToBottom();
        },
        renderFeedView: function(a, b, c, d) {
            var e = b.message.viewType, f = this, g = b.sequence;
            a = a || this.$el.find(".mx-chat-msgbox"), X && "board_create" === e && (e = "system");
            var h = V[e], j = new h({
                model: b,
                renderTo: a,
                renderType: c,
                binderModel: Moxtra.getUserBoard(b.boardId)
            });
            j.$el.attr("id", "feed" + g), b.once("change:emailAttachments", function() {
                f.renderFeedView(null, b, c, $("#feed" + g));
            }), b.once("change:page", function() {
                T.log("message page changed"), f.renderFeedView(null, b, c, $("#feed" + g));
            }), d && d.replaceWith(j.el), j instanceof i && (j.onAudioPlayed = function() {
                var a = f.msgs.indexOf(b);
                if (a > -1 && a < f.msgs.length - 1) {
                    var c = f.msgs.at(a + 1).toJSON(), d = b.get("actor");
                    "media" === c.message.viewType && c.actor.id === d.id && f.$("#feed" + c.sequence + " .action-btn").trigger("click");
                }
            }), this.recovery(j);
        },
        prependMsg: function(a, b) {
            T.log("prepend one feed : " + a.sequence + " from " + e.request.page());
            var c = a.toJSON();
            this.showPartialFeedTime(c, b), this.renderFeedView(b, a, "prepend");
        },
        showPartialFeedTime: function(a, b) {
            var c = 3e5;
            b = $(b).length ? $(b) : this.$el.find(".mx-chat-msgbox");
            var d = !1;
            if (moment(this.partialLastTime).isSame(a.created_time, "day") ? this.partialLastTime - a.created_time > c && (d = !0) : this.partialLastTime > 0 && (d = !0), 
            d) {
                var e = this.$el.find(".mx-chat-msgbox>:first-child").hasClass("feed-view-more");
                e && this.$el.find(".mx-chat-msgbox>:nth-child(2)").hasClass("feed-time") || (T.log("show this time feed when pagination : " + this.partialLastDisplayTime), 
                b.prepend(z({
                    displayTime: this.partialLastDisplayTime
                })));
            }
            this.partialLastTime = a.created_time, this.partialLastDisplayTime = MX.lang.formatDateTime(a.created_time);
        },
        scrollToBottom: function(a) {
            var b = this;
            if (_.isFunction(a)) {
                var c = a;
                a = 100;
            }
            setTimeout(function() {
                var a = b.$el.find(".mx-chat-msgbox-wrap");
                a.length && a.scrollTop(a[0].scrollHeight), c && c.call(b);
            }, a || 100);
        },
        viewMore: function() {
            var a = this;
            return this.REACHED_MAX_HISTORY ? void (this.maxHistoryShown || (this.maxHistoryShown = !0, 
            MX.ui.notifyWarning(MX.format(b.cap_chat_max_history_alert, {
                maxHistory: this._getDays(this.maxHistory)
            })), setTimeout(function() {
                a.maxHistoryShown = !1;
            }, 3e3))) : void a.msgs.loadNextPage(!0);
        },
        cacheMsg: function(a) {
            return T.log("insert one feed : " + a.sequence + " from " + e.request.page()), this.maxHistory && a.created_time < Date.now() - this.maxHistory ? void (this.REACHED_MAX_HISTORY = !0) : void this.cacheCol.push(a);
        },
        renderCacheMsg: function(a) {
            T.log("cacheMsg : " + e.request.page());
            var c = this;
            if (this.$el.find(".feed-view-more").loading(!1), !this.cacheCol.length) {
                var d = e.request.params();
                return void (d && d.seq && c.scrollToBottom(function() {
                    setTimeout(function() {
                        c._bindingViewMoreEvent.call(c);
                    }, 50);
                }));
            }
            this.showPartialFeedTime(this.cacheCol[0]), MX.each(this.cacheCol, function(a) {
                c.prependMsg(a), c.parent.unreadFeedCount && c._appendGuideline(a);
            }), this.$el.find(".mx-chat-msgbox>:first-child").hasClass("feed-time") || "board_create" === this.cacheCol[this.cacheCol.length - 1].message.viewType || (this.$el.find(".mx-chat-msgbox").prepend(z({
                displayTime: MX.lang.formatDateTime(this.msgs[0].created_time)
            })), this.partialLastTime = this.msgs[0].created_time);
            var f = this.$el.find(".feed-view-more");
            if (f.length) {
                if (a && "jump" === a) {
                    c.$el.find(".mx-chat-msgbox-wrap").off("scroll.viewMore");
                    var g = c.$el.find(".mx-chat-item-wrap").eq(0);
                    g.addClass("mx-chat-item-transition-before"), setTimeout(function() {
                        g.addClass("mx-chat-item-transition");
                    }, 100);
                } else {
                    var h = f.offset() && f.offset().top;
                    this.$el.find(".mx-chat-msgbox-wrap").scrollTop(h - 60);
                }
                f.remove(), this.msgs.hasNextPage && !this.REACHED_MAX_HISTORY && (this.$el.find(".mx-chat-msgbox").prepend(A(b)), 
                a && "jump" === a && (this.$el.find(".mx-chat-msgbox-wrap").scrollTop(30), this._bindingViewMoreEvent(), 
                c.$el.loading(!1)));
            }
            this.cacheCol = [];
        },
        leave: function() {
            T.log("leave this chat : " + e.request.page()), this.closeTodoDetail();
        },
        initBizCard: function() {
            $('[data-view="bizCardView"]').popover({
                view: P
            }), this.recovery(function() {
                $('[data-view="bizCardView"]').popover(!1);
            });
        },
        initBizCardMessager: function() {
            var a = this.binderid;
            $("#tab_chat").delegate('[data-messager="bizCardMessager"]', "click", function() {
                var b = $(this).data("userid"), c = $(this).data("uniqueid");
                e.sendMessage({
                    action: "request_view_member",
                    binder_id: a,
                    user_id: b,
                    unique_id: c,
                    session_key: null,
                    session_id: Moxtra.getMe().sessionId
                });
            }), this.recovery(function() {
                $("#tab_chat").undelegate('[data-messager="bizCardMessager"]', "click");
            });
        },
        typeAhead: function(a) {
            var b = $(a.target), c = b.val(), d = this, f = /(?:^|[\b\s]+)@(\S*)$/;
            if (50 === a.keyCode || this.typeAheadMode && a.keyCode !== e.const.keys.Enter && a.keyCode !== e.const.keys.Up && a.keyCode !== e.const.keys.Down && a.keyCode !== e.const.keys.Escape) if (c && f.test(c)) {
                this.inputSelector || (this.inputSelector = new M({
                    collection: this.binder.members,
                    renderTo: ".at-input-helper",
                    textarea: b,
                    contextBox: $(".mx-chat-msgbox-wrap")
                }), this.inputSelector.onAutoInput(function(a) {
                    b.val(b.val().replace(/@[^\s@]*$/, "@" + a + " ")).focus(), d.$(".at-input-helper").hide(), 
                    d.typeAheadMode = !1;
                }), this.recovery(this.inputSelector)), this.$(".at-input-helper").show(), this.typeAheadMode = !0;
                var g = c.match(f)[1];
                this.inputSelector.filter(g), "" === this.inputSelector.selectedText() && this.$(".at-input-helper").hide();
            } else this.typeAheadMode && (this.$(".at-input-helper").hide(), this.typeAheadMode = !1); else a.keyCode !== e.const.keys.Enter || a.shiftKey ? a.keyCode === e.const.keys.Escape && (this.$(".at-input-helper").hide(), 
            this.typeAheadMode = !1) : (a.preventDefault(), this.typeAheadMode ? (b.val(b.val().replace(/@\w*$/g, "@" + this.inputSelector.selectedText() + " ")), 
            this.$(".at-input-helper").hide(), this.typeAheadMode = !1) : this.typeAheadMode = !1);
        },
        sendComment: function(a, b) {
            var c, d = Moxtra.getBoard(this.binderid), e = this;
            if (b) {
                c = e.$el.find("#feed" + a.client_uuid), c.find(".resend").addClass("hide"), c.find(".send-fail").addClass("hide"), 
                c.find(".sending").loading({
                    length: 4,
                    width: 2,
                    line: 8,
                    radius: 3
                });
                var f = a;
                a = new Moxtra.model.Comment(), a.set("text", f.text), a.set("rich_text", f.rich_text), 
                a.set("rich_text_format", f.rich_text_format), a.set("client_uuid", f.client_uuid);
            }
            a.create(d).error(function() {
                T.log("error"), setTimeout(function() {
                    c = c || e.$el.find("#feed" + a.client_uuid), c.find(".sending").loading(!1), c.find(".send-fail").tooltip().removeClass("hide"), 
                    c.find(".resend").removeClass("hide").find(".btn-link").one("click", function() {
                        e.sendComment(a, !0);
                    });
                }, 500);
            }).success(function() {
                c = c || e.$el.find("#feed" + a.client_uuid), c.find(".sending").loading(!1);
            });
        },
        postComment: function(a) {
            var b = this, c = $(a.target);
            if (this.typeAheadMode && this.inputSelector.handleKeyDown(a), a.keyCode === e.const.keys.Enter && !a.shiftKey && (a.preventDefault(), 
            !this.typeAheadMode)) {
                var d = $.trim(c.val());
                if (d.length > 0) {
                    var f = {
                        sequence: 0,
                        boardId: this.binderid,
                        message: {
                            isMe: !0,
                            showArrow: !0,
                            comment: {
                                text: d
                            },
                            viewType: "comment",
                            actor: Moxtra.getMe().name
                        },
                        actor: Moxtra.getMe(),
                        toJSON: function() {
                            return this;
                        }
                    }, g = new Moxtra.model.Comment();
                    g.set("text", d);
                    var h = d.replace(/\[\/?(i|b|u|s|url(=[^\]]+)?)\]/g, "");
                    h !== d && (g.set("rich_text", d), g.set("text", h), g.set("rich_text_format", "TEXT_FORMAT_BBCODE"));
                    var i;
                    this.msgs && this.msgs.length > 0 && (i = this.msgs.at(this.msgs.length - 1));
                    var j = i && i.created_time || 0;
                    this.sendComment(g);
                    var k = this.$el.find(".mx-chat-msgbox"), l = Date.now(), m = 3e5;
                    l - j > m && k.append(z({
                        displayTime: MX.lang.formatDateTime(l)
                    }));
                    var n = V.comment, o = new n({
                        model: f,
                        renderTo: b.$el.find(".mx-chat-msgbox"),
                        binderModel: Moxtra.getUserBoard(this.binderid)
                    });
                    o.$el.attr("id", "feed" + g.client_uuid), o.$el.find(".sending").loading({
                        length: 4,
                        width: 2,
                        line: 8,
                        radius: 3
                    }), this.scrollToBottom(), c.val(""), delete Moxtra.chatDraft[this.binderid], c.trigger("autosize.resize");
                }
            }
        },
        switchTodo: function() {
            var a, b = this.handleEvent, c = $(b.currentTarget).prop("checked"), d = $("#tab_chat");
            c ? (a = d.find("[name=postComment]").val(), d.find("[name=addTodo]").val(a), d.find("[name=postComment]").val("")) : (a = d.find("[name=addTodo]").val(), 
            d.find("[name=postComment]").val(a), d.find("[name=addTodo]").val("")), d.find(".mx-action-bar textarea").toggle().focus(), 
            d.find(".mx-action-bar textarea:visible").trigger("autosize.resize");
        },
        gotoFeedItem: function(a, b) {
            var c = this.$("#feed" + a), d = this.$(".mx-chat-msgbox-wrap"), e = this;
            c && c.length ? (d.scrollTop(c.position().top - 30), c.addClass("mx-chat-item-transition-before"), 
            setTimeout(function() {
                c.addClass("mx-chat-item-transition");
            }, 100), b && b.call(this), e.$el.loading(!1)) : (e.$el.loading(!0), this.listenToOnce(this.binder, Moxtra.const.EVENT_FIRST_SUBSCRIBE, function() {
                e.msgs.jumpTo(parseInt(a), !0), e.$el.loading(!1);
            }));
        },
        gotoUnreadItem: function() {
            var a, b = this.parent.lastAccessTime;
            this.msgs.eachAll(function(c) {
                return c.created_time < b ? !1 : void (a = c);
            }), this.gotoFeedItem(a.sequence), this.$el.find(".mx-chat-unread-badge").hide(), 
            this.$el.find(".mx-chat-msgbox-wrap").off(".unread");
        },
        createTodo: function(a) {
            var d = $(a.target), f = this;
            if (a.keyCode === c.keys.Enter && !a.shiftKey) {
                a.preventDefault();
                var g = $.trim(d.val());
                if (g.length > 0) {
                    var h = Moxtra.createTodoModel(e.request.page());
                    h.set("name", g), h.create().error(function() {
                        MX.ui.notifyError(b.create_todo_fail);
                    }).success(function() {
                        MX.ui.notifySuccess(b.create_todo_success);
                    }), d.val(""), d.trigger("autosize.resize"), f.$(".mx-action-bar input").click();
                }
            }
        },
        createTodoWithPage: function(a) {
            var b, c = this.msgs.get(a), d = [], f = Moxtra.getBoard(e.request.page());
            if (c) {
                if (MX.each(c.board.pages, function(a) {
                    d.push(a.sequence);
                }), d.length) {
                    var h = f.pages.get(d[0]);
                    h && h.page_group && (b = f.getCacheObject(h.page_group));
                }
                b ? g.createTodo(e.request.page(), null, [ b.client_uuid ], b.parent) : g.createTodo(e.request.page(), d);
            }
        },
        createTodoWithFile: function(a) {
            var b = this.binder.getCacheObject(a);
            b && g.createTodo(e.request.page(), null, [ b.client_uuid ], b.parent);
        },
        addCustomActions: function(a, b, c) {
            g.addCustomActions(a, b, decodeURIComponent(c));
        },
        downloadFiles: function(a) {
            g.downloadResources(e.request.page(), [ a ]);
        },
        downloadResource: function(a) {
            g.downloadResource(e.request.page(), a);
        },
        downloadPages: function(a) {
            var b = this.msgs.get(a);
            if (b) {
                var c = [];
                MX.each(b.board.pages, function(a) {
                    c.push(a.sequence);
                }), g.downloadPages(e.request.page(), c);
            }
        },
        shareFiles: function(a) {
            var b = this.binder.getCacheObject(a);
            this.recovery(b ? g.shareFiles(e.request.page(), [ b.client_uuid ], null, b.parent) : g.shareResource(e.request.page(), a));
        },
        sharePages: function(a) {
            var b = this.msgs.get(a);
            if (b) {
                var c = [];
                MX.each(b.board.pages, function(a) {
                    c.push(a.sequence);
                }), this.recovery(g.sharePages(this.binderid || e.request.page(), c));
            }
        },
        _getFile: function(a) {
            var b, c = a.board, d = this.binder;
            if (a) if (c.page_groups) b = c.page_groups[0].sequence, b = d.page_groups.get(b); else if (c.folders || c.files) {
                for (;c.folders; ) c = c.folders[0], d = d.folders.get(c.sequence);
                b = d.files.get(c.files[0].sequence);
            }
            return b;
        },
        copyFiles: function(a) {
            var b = this.binder.getCacheObject(a);
            b && g.copyFilesTo([ b.client_uuid ], e.request.page(), b.parent);
        },
        copyResource: function(a) {
            g.copyResourceTo(e.request.page(), [ a ]);
        },
        copyPages: function(a) {
            var b = this.msgs.get(a);
            if (b) {
                var c = b.board.pages[0];
                if (c = this.binder.pages.get(c)) {
                    var d = this.binder.getCacheObject(c.page_group);
                    if (d) return void g.copyFilesTo([ d.client_uuid ], e.request.page(), d.parent);
                }
                var f = [];
                MX.each(b.board.pages, function(a) {
                    f.push(a.sequence);
                }), g.copyPageTo(e.request.page(), f, []);
            }
        },
        deleteFiles: function(a) {
            var b = this, c = this.binder.getCacheObject(a);
            g.removeFiles(b.binder.id, [ a ], [], c.parent);
        },
        deleteResource: function(a) {
            g.removeResource(this.binder.id, a);
        },
        deletePages: function(a) {
            var b, c = this.msgs.get(a), d = [];
            if (c) {
                b = c.board.pages || [];
                for (var f = 0; f < b.length; f++) d.push(b[f].sequence);
                g.removePages(e.request.page(), d, []);
            }
        },
        viewTodo: function(a) {
            var b = this.binder.id;
            $("#todoDetail").closest(".mx-tab-content").addClass("todo-detail"), $("#todoDetail").empty().removeClass("hide"), 
            this.todoDetailView = new J({
                model: Moxtra.getBoardTodos(b).get(a),
                renderTo: $("#todoDetail")
            }), this.recovery(this.todoDetailView);
        },
        favoriteItem: function(a) {
            var c = this.msgs.get(a);
            c.isFavorite ? c.favorite(!1).success(function() {
                MX.ui.notifySuccess(b.remove_favorite_success);
            }).error(function() {
                MX.ui.notifyError(b.remove_favorite_failed);
            }) : c.favorite(!0).success(function() {
                MX.ui.notifySuccess(b.favorite_success);
            }).error(function(a) {
                console.error(a), MX.ui.notifyError(b.favorite_failed);
            });
        },
        pinItem: function(a) {
            var c = this.msgs.get(a);
            c.is_pinned ? c.pin(!1).success(function() {
                MX.ui.notifySuccess(b.remove_pin_success);
            }).error(function() {
                MX.ui.notifyError(b.remove_pin_failed);
            }) : c.pin(!0).success(function() {
                MX.ui.notifySuccess(b.pin_success);
            }).error(function() {
                MX.ui.notifyError(b.pin_failed);
            });
        },
        playRecording: function(a, c, d) {
            var e = MX.format("/board/{0}/{1}", a, c);
            e = Moxtra.util.makeAccessTokenUrl(e), this.recovery(new MX.ui.Dialog({
                disableKeyboard: !0,
                content: new H({
                    title: d,
                    source: e,
                    buttons: [ {
                        text: b.done,
                        className: "btn-primary",
                        click: function() {
                            this.close();
                        }
                    } ]
                })
            }));
        },
        viewMeet: function(a) {
            var c = this.binder.sessions.get(a);
            if (!c || c.is_deleted) return void MX.ui.notifyWarning(b.meet_has_canceled);
            var d = this, e = G.genDialog({
                title: b.meet_info,
                disableKeyboard: !0
            }), f = function() {
                var b = new k({
                    model: Moxtra.getBoard(a),
                    onActionEdit: function(a) {
                        d.editMeet(a);
                    }
                });
                d.recovery(b), e.push({
                    content: b
                });
            };
            Moxtra.loadBoard(a).success(function() {
                f();
            }).error(function() {
                f();
            });
        },
        editMeet: function(a) {
            var c = this, d = G.genDialog({
                title: b.schedule_meet,
                disableKeyboard: !0
            });
            Moxtra.loadBoard(a).success(function() {
                var b = new l({
                    allowRecording: Q.isAllowMeetRecording(),
                    customizedOffset: Moxtra.getTimezoneOffset(),
                    model: Moxtra.getBoard(a),
                    editable: !0
                });
                c.recovery(b), d.push({
                    content: b
                });
            }).error(function() {
                MX.ui.notifyError(b.system_unknown_error), setTimeout(function() {
                    d.close();
                }, 800);
            });
        },
        closeTodoDetail: function() {
            this.todoDetailView && (this.todoDetailView.closeDetail(), this.todoDetailView = null), 
            this.$el.find(".mx-tab-content").removeClass("todo-detail");
        },
        showEmailAttachments: function() {
            var a = $(this.handleEvent.currentTarget);
            a.closest(".mx-message").find(".attachment-item").removeClass("hide"), a.remove();
        },
        addDescription: function() {
            var a = this.binder.description, c = this, d = new I({
                message: a,
                title: b.add_description,
                onClose: function(b) {
                    b !== a && (c.binder.set("description", b), c.binder.update()), e.close();
                }
            }), e = new MX.ui.Dialog({
                content: d,
                className: "message-container",
                hideHeader: !0
            });
        },
        addMemberInSettings: function() {
            if (X) {
                e.sendMessage({
                    action: "invite",
                    binder_id: this.binderid,
                    session_key: null,
                    session_id: Moxtra.getMe().sessionId
                });
                var a = e.integration.get("extension");
                if (!a) return;
                var d = JSON.parse(a);
                if (!d.show_dialogs || !d.show_dialogs.member_invite) return;
            }
            var f = this;
            this.recovery(new MX.ui.Dialog(new MX.ui.UserSelector({
                title: b.invite_member,
                needMessage: !0,
                buttons: [ {
                    position: "right",
                    text: b.invite,
                    className: "btn-primary",
                    click: "onSelectDone",
                    id: "inviteUser",
                    disabled: !0
                } ],
                onChange: function() {
                    var a = this.dialog.getButton("inviteUser");
                    this.value().length > 0 ? a.removeClass("disabled") : a.addClass("disabled");
                },
                onSelectDone: function() {
                    f.addUsers = [];
                    var a = this.value();
                    a.each(function(a) {
                        var b = a.toJSON();
                        f.addUsers.push(MX.isUndefined(b.isTeam) ? {
                            type: c.binder.role.Editor,
                            email: b.email
                        } : {
                            type: c.binder.role.Editor,
                            group_id: b.id
                        });
                    });
                    var d = f.binder;
                    d.inviteUsers(f.addUsers, null, this.invitationMessage()).success(function() {
                        MX.ui.notifySuccess(b.member_invited), f.addUsers = [];
                    }).error(function() {
                        MX.ui.notifyError(b.invite_user_failed);
                    }), this.dialog.close();
                }
            })));
        },
        _getDays: function(a) {
            var c = Math.ceil(a / 864e5);
            return c + " " + (c > 1 ? b.days : b.day);
        },
        _appendGuideline: function(a, b) {
            var c = this._getGuideline();
            if (a) {
                if ($(".mx-new-feed-divide").length || $(b).children(".mx-new-feed-divide").length) return;
                var d = this.msgs[this.msgs.indexOf(a) + 1];
                if (!d || d.created_time <= this.parent.lastAccessTime) return;
                a.created_time <= this.parent.lastAccessTime && (b ? $(b).children("#feed" + a.sequence).after(c) : this.$("#feed" + a.sequence).after(c));
            } else this.$(".feed-view-more").after(c);
        },
        _getGuideline: function() {
            var a = '<div class="mx-new-feed-divide-border"></div><div class="mx-new-feed-divide"><span>' + b.new_messages + "</span></div>";
            return a;
        },
        _makeUnreadTips: function(a) {
            var b = this;
            if (a) return b.$el.find(".mx-chat-unread-badge").html("").hide(), void b.$el.find(".mx-chat-msgbox-wrap").off(".unread");
            if (this.parent.unreadFeedCount) {
                var c, d = e.request.params();
                if (d.seq) {
                    var f = parseInt(d.seq);
                    if (this.msgs.eachAll(function(a) {
                        return a.sequence === f ? (c = a, !1) : void 0;
                    }), c.created_time <= this.parent.lastAccessTime) return;
                }
                this.$el.find(".mx-chat-unread-badge").html('<span class="micon-double-arrow-top size12"></span> ' + this._getUnreadTips()).show(), 
                this.$el.find(".mx-chat-msgbox-wrap").on("scroll.unread", function() {
                    b._isUnreadDivideVisible() && (b.$el.find(".mx-chat-unread-badge").html("").hide(), 
                    b.$el.find(".mx-chat-msgbox-wrap").off(".unread"));
                });
            }
        },
        _getUnreadTips: function() {
            var a, c = this.parent.unreadFeedCount;
            return a = c > 1 ? MX.format(b.feed_new_messages, {
                count: this.parent.unreadFeedCount
            }) : MX.format(b.feed_new_message, {
                count: this.parent.unreadFeedCount
            });
        },
        _isUnreadDivideVisible: function() {
            var a = this.$(".mx-new-feed-divide"), b = this.$(".mx-chat-msgbox-wrap");
            if (a.length > 0) {
                var c = a.position().top, d = b.scrollTop();
                if (c > d && c < d + b.height()) return !0;
            }
            return !1;
        },
        _isShowUnreadButton: function() {
            e.isIntegrationEnabled() || this._isUnreadDivideVisible() ? this._makeUnreadTips(!0) : this._makeUnreadTips();
        },
        _bindingViewMoreEvent: function() {
            var a = this, b = a.$el.find(".mx-chat-msgbox-wrap").offset().top;
            a.$el.find(".mx-chat-msgbox-wrap").on("scroll.viewMore", function() {
                if (!a.isViewingMore) {
                    var c = a.$el.find(".feed-view-more");
                    c && c.length > 0 && c.offset().top >= b && a.msgs.hasNextPage && (c.loading({
                        length: 5,
                        color: "#000000"
                    }), a.isViewingMore++, setTimeout(function() {
                        a.viewMore(), a.isViewingMore--;
                    }, 500));
                }
            });
        }
    });
}), define("text!template/binder/binderPagesList.html", [], function() {
    return '<div class="mx-pages">\n    <div class="mx-pages-nav-bar">\n        <div class="mx-files-navigator pull-left"></div>\n        <ul class="mx-files-view-model pull-right">\n            <li data-action="show-thumbnail" class="mx-pages-show-thumbnail"><a data-action="showThumbnail"\n                                                                                class="micon-thumbnail"></a></li>\n            <li data-action="show-list" class="mx-pages-show-list"><a data-action="showList" class="micon-list"></a>\n            </li>\n        </ul>\n    </div>\n    <div class="mx-pages-wrap">\n        <ul class="mx-folders-list">\n\n        </ul>\n        <ul class="mx-pages-list">\n\n        </ul>\n    </div>\n    <span class="moxtra-poweredby mxbrand-powered-by-moxtra active for-chat" ></span>\n    <div class="mx-pages-empty">\n        <div>\n\n\n            <div class="row mx-pages-empty-description">\n                <div class="col-md-1 col-xs-2 mx-pages-empty-icon"><img src="{{empty_pages}}"/></div>\n                <div class="col-md-11 col-xs-10 mx-pages-empty-notes">\n                    {{#if isPublic}}\n                        <span class="mx-pages-empty-title">{{lang.folder_is_empty}}</span>\n                    {{else}}\n                        {{#if isViewer}}\n                            <span class="mx-pages-empty-title">{{lang.you_are_viewer_of_this_binder}}</span>\n                        {{else}}\n                            <span class="mx-pages-empty-title">{{lang.binder_pages_empty_headline}}</span>\n                            <span>{{lang.binder_pages_empty_subtitle}}</span>\n                        {{/if}}\n                    {{/if}}\n                </div>\n            </div>\n\n        </div>\n    </div>\n    {{#unless disableActions}}\n    {{!--\n        For now, we just disable all action for viewer.\n        Add by Jee, v2.9\n    --}}\n            <div class="mx-action-bar">\n                <div class="edit-bar">\n                    <a class="mouse-hand pull-left font-bold" data-action="exitEditModel">{{lang.cancel}}</a>\n\n                    <a class="mouse-hand pull-right font-bold" data-action="selectAll">{{lang.select_all}}</a>\n\n                    <div class="mx-center">\n                        <a class="micon-download blue mouse-hand disabled" title="{{lang.download}}" data-action="downloadPages"></a>\n                        <a class="micon-copy blue mouse-hand disabled " title="{{lang.copy_to}}" data-action="copyPages"></a>\n                        <a class="micon-page-copy blue mouse-hand disabled hide" title="{{lang.move_to}}" data-action="movePages"></a>\n                        <a class="micon-group  blue mouse-hand disabled hide" title="{{lang.group}}" data-action="groupPage"></a>\n                        <a class="micon-folder-empty blue mouse-hand disabled hide" title="{{lang.create_folder}}" data-action="createFolder"></a>\n                        {{#if branding.showTodoTab}}\n                            <a class="micon-todo-empty blue mouse-hand disabled hide" title="{{lang.create_todo}}" data-action="createTodo"></a>\n                        {{/if}}\n                        <a class="micon-share blue mouse-hand disabled hide mxbrand-action-share" title="{{lang.share}}" data-action="sharePages"></a>\n                        <a class="micon-trash blue mouse-hand disabled hide" title="{{lang.delete}}" data-action="removePages"></a>\n\n                    </div>\n\n                </div>\n                <div class="default-bar">\n                    <div class="pull-right">\n                        <a class="btn btn-default new-folder" data-action="createFolder">{{lang.create_folder}}</a>\n                    </div>\n                    <a class="edit-model mouse-hand pull-left font-bold ta-select-page"\n                       data-action="enterEditModel">{{lang.tool_select}}</a>\n                </div>\n            </div>\n    {{/unless}}\n</div>\n';
}), define("text!template/binder/binderPageItem.html", [], function() {
    return '<li class="page-item" ta-param="{{name}}">\n    <input type="checkbox" class="mx-hide" name="selectPages"  value="{{sequence}}" />\n    <a class="page-hint" data-action="viewPage" title="{{name}}" data-param="{{sequence}},{{boardid}}">\n    <div class="page-cover">\n        <div class="page-cover-wrap">\n    	{{#if isMedia}}\n    	<div class="media-indicator">\n    		<i class="micon-play size24 gray"></i>\n		</div>\n		{{/if}}\n        {{#if isWeb}}\n        <div class="web-indicator">\n            <i class="micon-text size24 gray"></i>\n        </div>\n        {{/if}}\n        {{#if isUrl}}\n        <div class="url-indicator">\n            <i class=" micon-web-link size24 gray"></i>\n        </div>\n        {{/if}}\n        {{#if isWhiteBoard}}\n        <div class="whiteboard-indicator">\n            <i class="micon-highlighter size24 gray"></i>\n        </div>\n        {{/if}}\n        <img data-seq="{{sequence}}" data-rotate="{{rotate}}"\n              src="{{thumbnail}}">\n        </div>\n    </div>\n</a>\n    <div class="page-info">\n        {{#unless isPublic}}\n            <span class="label label-primary page-total-comments pull-right">{{#if total_comments}}{{total_comments}}{{/if}}</span>\n        {{/unless}}\n        <span class="ellipsis" > <span class="page-index " >{{pageIndex}} </span><span class="page-name">{{name}}</span></span>\n\n    </div>\n</li>\n';
}), define("text!template/binder/binderPageLVItem.html", [], function() {
    return '<li class="page-item" ta-param="{{name}}">\n    <input type="checkbox" class="mx-hide" name="selectPages"  value="{{sequence}}" />\n    <a class="page-hint" data-action="viewPage" title="{{name}}" data-param="{{sequence}},{{boardid}}">\n        <div class="page-cover">\n            <div class="page-cover-wrap">\n                {{#if isMedia}}\n                <div class="media-indicator">\n                    <i class="micon-play size24 gray"></i>\n                </div>\n                {{/if}}\n                {{#if isWeb}}\n                <div class="web-indicator">\n                    <i class="micon-text size24 gray"></i>\n                </div>\n                {{/if}}\n                {{#if isUrl}}\n                <div class="url-indicator">\n                    <i class=" micon-web-link size24 gray"></i>\n                </div>\n                {{/if}}\n                {{#if isWhiteBoard}}\n                <div class="whiteboard-indicator">\n                    <i class="micon-highlighter size24 gray"></i>\n                </div>\n                {{/if}}\n                <img class="lazy" data-seq="{{sequence}}" data-rotate="{{rotate}}"\n                     data-original="{{thumbnail}}">\n            </div>\n        </div>\n    </a>\n    <div class="page-info">\n        {{#unless isPublic}}\n        <span class="label label-primary page-total-comments pull-right">{{#if total_comments}}{{total_comments}}{{/if}}</span>\n        {{/unless}}\n        <span class="ellipsis" > <span class="page-index " >{{pageIndex}} </span><span class="page-name">{{name}}</span></span>\n\n    </div>\n</li>\n';
}), define("text!template/binder/binderPageGroup.html", [], function() {
    return '<li class="page-group contraction group-bg-{{bgColor}}" ta-param="{{displayName}}" id="page{{client_uuid}}">\n    <a class="page-hint" {{#when totalPages \'<=\' 1}}data-action="viewPage"\n       data-param="{{client_uuid}}"{{/when}}{{#when totalPages \'>\' 1}}data-action="showPageGroup"\n       data-param="{{client_uuid}}"{{/when}} />\n\n    <div class="group-cover">\n        {{#when totalPages \'==\' 0}}\n            <div class="page-cover">\n                <div class="page-cover-wrap">\n                    {{#if thumbnail}}\n                        <img src="{{#if thumbnail}}{{thumbnail}}{{else}}{{pages.0.thumbnail}}{{/if}}">\n                    {{else}}\n                        <img src="{{defaultThumbnail}}">\n                        <span class="ellipsis">{{fileType}}</span>\n                    {{/if}}\n                </div>\n            </div>\n        {{/when}}\n        {{#when totalPages \'==\' 1}}\n            <div class="page-cover">\n                <div class="page-cover-wrap">\n                    {{#if totalPages}}\n                        {{#if pages.0.isMedia}}\n                            <div class="media-indicator">\n                                <i class="micon-play size24 gray"></i>\n                            </div>\n                        {{/if}}\n                        {{#if pages.0.isWeb}}\n                            <div class="web-indicator">\n                                <i class="micon-text size24 gray"></i>\n                            </div>\n                        {{/if}}\n                        {{#if pages.0.isUrl}}\n                            <div class="url-indicator">\n                                <i class=" micon-web-link size24 gray"></i>\n                            </div>\n                        {{/if}}\n                        {{#if pages.0.isWhiteBoard}}\n                            <div class="whiteboard-indicator">\n                                <i class="micon-highlighter size24 gray"></i>\n                            </div>\n                        {{/if}}\n                        <img src="{{#when thumbnail \'!=\' defaultThumbnail}}{{thumbnail}}{{/when}}">\n                    {{else}}\n                        <span class="ellipsis">{{fileType}}</span>\n                    {{/if}}\n                </div>\n            </div>\n        {{/when}}\n        {{#when totalPages \'>\' 1}}\n            <div class="page-cover multiple-pages">\n                <div class="page-cover-wrap">\n                    <img src="{{thumbnail}}"/>\n                </div>\n            </div>\n        {{/when}}\n    </div>\n    <div class="group-actions">\n        <input type="checkbox" class="mx-hide" data-action="selectGroup" name="group" data-param="{{client_uuid}}"/>\n            {{#unless isPublic}}\n                <div class="pull-right dropdown">\n                    <a data-toggle="dropdown" class="pull-right mouse-hand noOutline"><i class="micon-help size14"></i></a>\n                    <ul class="dropdown-menu" role="menu">\n                        <li><a data-action="downloadFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-download"></i><span>{{lang.download}}</span></a></li>\n                        <li><a data-action="copyFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-copy"></i><span>{{lang.copy_to}}</span></a></li>\n                    {{#unless isViewer}}\n                        <li><a data-action="moveFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-page-copy"></i><span>{{lang.move_to}}</span></a></li>\n                        <li><a data-action="createTodoWithSingleFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-todo-empty"></i><span>{{lang.create_todo}}</span></a></li>\n                        <li><a data-action="shareFile" data-param="{{client_uuid}}"\n                               class="btn btn-link mxbrand-action-share"><i class="micon-share"></i><span>{{lang.share}}</span></a></li>\n                        <li><a data-action="renameGroup" data-param="{{client_uuid}}"\n                                   class="btn btn-link"><i class="micon-pencil"></i><span>{{lang.rename}}</span></a></li>\n                        <li><a data-action="removeFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-trash"></i><span>{{lang.delete}}</span></a></li>\n                        <li><a data-action="rotateFile" data-param="{{client_uuid}}"\n                               class="btn btn-link"><i class="micon-rotate"></i><span>{{lang.rotate}}</span></a></li>\n                    {{/unless}}\n                    </ul>\n                </div>\n            {{/unless}}\n    </div>\n    <div class="group-info ">\n        <span class="page-name {{#ifCond totalPages \'>\' 1}}ellipsis-3line{{/ifCond}}{{#ifCond totalPages \'<=\' 1}}ellipsis{{/ifCond}}" title="{{displayName}}">{{displayName}}</span>\n        <em>{{#if fileSize}}\n            {{fileSize}}\n        {{/if}}\n            {{#ifCond totalPages \'>\' 1}}\n                <i> {{totalPages}}</i> {{lang.pages}}\n            {{/ifCond}}\n            {{#when totalPages \'==\' 1}}\n                {{#if pages.0.total_comments}}\n                    {{pages.0.total_comments}} {{#when pages.0.total_comments \'>\' 1}}{{lang.comments}}{{/when}}{{#when pages.0.total_comments \'==\' 1}}{{lang.comment}}{{/when}}\n                {{/if}}\n            {{/when}}\n        </em>\n    </div>\n</li>\n';
}), define("text!template/binder/binderFolder.html", [], function() {
    return '<li class="mx-folder-item row" ta-param="{{name}}" id="folder{{sequence}}">\n    <span class="mx-folder-icon col-md-1 col-xs-1 blue"><i class="micon-folder"></i></span>\n\n    <div class="col-md-10 col-xs-10" data-action="accessSubFolder" data-param="{{sequence}}">\n        <div title="{{name}}" class="mx-folder-name ellipsis">{{name}}</div>\n    </div>\n\n    <div class="folder-actions">\n        <input type="checkbox" class="mx-hide" data-action="selectFolder" name="folder" data-param="{{sequence}}"/>\n        {{#unless isViewer}}\n            {{#unless isPublic}}\n                <div class="pull-right dropdown">\n                    <a data-toggle="dropdown" class="pull-right mouse-hand noOutline"><i class="micon-help size14"></i></a>\n                    <ul class="dropdown-menu" role="menu">\n                        <li><a data-action="shareFolder" data-param="{{sequence}}"\n                               class="btn btn-link mxbrand-action-share"><i class="micon-share"></i><span>{{lang.share}}</span></a></li>\n                        <li><a data-action="renameFolder" data-param="{{sequence}}"\n                               class="btn btn-link"><i class="micon-pencil"></i><span>{{lang.rename}}</span></a></li>\n                        <li><a data-action="removeFolder" data-param="{{sequence}}"\n                               class="btn btn-link"><i class="micon-trash"></i><span>{{lang.delete}}</span></a></li>\n                    </ul>\n                </div>\n\n            {{/unless}}\n        {{/unless}}\n    </div>\n</li>\n';
}), define("text!template/binder/binderFolderLVItem.html", [], function() {
    return '<li class="mx-folder-listview-item row" ta-param="{{name}}" id="folder{{sequence}}">\n    <div class="col-md-1 col-xs-1"><span class="mx-folder-icon blue"><i class="micon-folder"></i></span></div>\n    <div class="col-md-5 col-xs-5" data-action="accessSubFolder" data-param="{{sequence}}">\n        <div class="mx-folder-name ellipsis">{{name}}</div>\n    </div>\n    <div class="col-md-2 col-xs-2 update-field">\n        <span>{{last_modified}}</span>\n    </div>\n    <div class="col-md-2 col-xs-2 size-field">\n        <span></span>\n    </div>\n    <div class="col-md-1 col-xs-1 type-field">\n        {{lang.folder}}\n    </div>\n\n    <div class="folder-actions col-md-1 col-xs-1">\n        <input type="checkbox" class="mx-hide" data-action="selectFolder" name="folder" data-param="{{sequence}}" />\n        {{#unless isViewer}}\n        {{#unless isPublic}}\n            <div class="pull-right dropdown">\n                <a data-toggle="dropdown" class="pull-right mouse-hand noOutline"><i class="micon-help size14"></i></a>\n                <ul class="dropdown-menu" role="menu">\n                    <li><a data-action="shareFolder" data-param="{{sequence}}"\n                           class="btn btn-link mxbrand-action-share"><i class="micon-share"></i><span>{{lang.share}}</span></a></li>\n                    <li><a data-action="renameFolder" data-param="{{sequence}}"\n                           class="btn btn-link"><i class="micon-pencil"></i><span>{{lang.rename}}</span></a></li>\n                    <li><a data-action="removeFolder" data-param="{{sequence}}"\n                           class="btn btn-link"><i class="micon-trash"></i><span>{{lang.delete}}</span></a></li>\n                </ul>\n            </div>\n        {{/unless}}\n        {{/unless}}\n    </div>\n</li>\n';
}), define("text!template/binder/binderPageGroupLVItem.html", [], function() {
    return '<li class="mx-file-listview-item row" ta-param="{{displayName}}" id="page{{client_uuid}}">\n    <div class="col-md-1 col-xs-1">\n        <div class="group-cover">\n            {{#when totalPages \'==\' 0}}\n                <div class="page-cover">\n                    <div class="page-cover-wrap">\n                        <img src="{{defaultThumbnail}}" class="mx-noborder">\n                    </div>\n                </div>\n            {{/when}}\n            {{#when totalPages \'==\' 1}}\n                <div class="page-cover">\n                    <div class="page-cover-wrap">\n                        <img src="{{pages.0.thumbnail}}">\n                    </div>\n                </div>\n            {{/when}}\n            {{#when totalPages \'>\' 1}}\n                <div class="page-cover multiple-pages">\n                    <div class="page-cover-wrap">\n                        <img src="{{thumbnail}}"/>\n                    </div>\n                </div>\n            {{/when}}\n        </div>\n    </div>\n    <div class="col-md-5 col-xs-5" {{#when totalPages \'<=\' 1}}data-action="viewPage"\n         data-param="{{client_uuid}}"{{/when}}{{#when totalPages \'>\' 1}}data-action="showPageGroup"\n         data-param="{{client_uuid}}"{{/when}}>\n        <div class="mx-folder-name">\n            <span class="page-name ellipsis" title="{{displayName}}">{{displayName}}</span>\n        </div>\n    </div>\n    <div class="col-md-2 col-xs-2 update-field">\n        <span>{{last_modified}}</span>\n    </div>\n    <div class="col-md-2 col-xs-2 size-field">\n        <span>{{#if fileSize}}{{fileSize}}{{/if}}</span>\n    </div>\n    <div class="col-md-1 col-xs-1 type-field ellipsis">\n        {{fileSuffix}}\n    </div>\n    <div class="group-actions col-md-1 col-xs-1">\n        <input type="checkbox" class="mx-hide" data-action="selectGroup" name="group" data-param="{{client_uuid}}"/>\n\n            {{#unless isPublic}}\n                <div class="pull-right dropdown">\n                    <a data-toggle="dropdown" class="pull-right mouse-hand noOutline"><i class="micon-help size14"></i></a>\n                    <ul class="dropdown-menu" role="menu">\n\n                        <li><a data-action="downloadFile" data-param="{{client_uuid}}"\n                                                             class="btn btn-link"><i class="micon-download"></i><span>{{lang.download}}</span></a></li>\n                        <li><a data-action="copyFile" data-param="{{client_uuid}}"\n                                                         class="btn btn-link"><i class="micon-copy"></i><span>{{lang.copy_to}}</span></a></li>\n                {{#unless isViewer}}\n                        <li><a data-action="moveFile" data-param="{{client_uuid}}"\n                                                              class="btn btn-link"><i class="micon-page-copy"></i><span>{{lang.move_to}}</span></a></li>\n                        <li><a data-action="createTodoWithSingleFile" data-param="{{client_uuid}}"\n                                                               class="btn btn-link"><i class="micon-todo-empty"></i><span>{{lang.create_todo}}</span></a></li>\n                        <li><a data-action="shareFile" data-param="{{client_uuid}}"\n                                                          class="btn btn-link mxbrand-action-share"><i class="micon-share"></i><span>{{lang.share}}</span></a></li>\n                        <li><a data-action="renameGroup" data-param="{{client_uuid}}"\n                                   class="btn btn-link"><i class="micon-pencil"></i><span>{{lang.rename}}</span></a></li>\n                        <li><a data-action="removeFile" data-param="{{client_uuid}}"\n                                                          class="btn btn-link"><i class="micon-trash"></i><span>{{lang.delete}}</span></a></li>\n                        <li><a data-action="rotateFile" data-param="{{client_uuid}}"\n                           class="btn btn-link"><i class="micon-rotate"></i><span>{{lang.rotate}}</span></a></li>\n                {{/unless}}\n                    </ul>\n                </div>\n            {{/unless}}\n\n\n    </div>\n</li>\n';
}), define("text!template/binder/binderGroupPages.html", [], function() {
    return '<div class="group-pages group-bg-{{bgColor}}"  id="{{client_uuid}}">\n    <div class="group-info-wrap">\n        <button type="button"  data-action="hidePageGroup" class="btn btn-default pull-right" aria-hidden="true">{{lang.close}}</button>\n        <span class="">{{name}}</span>\n    </div>\n    <ul class="page-group-wrap">\n\n    </ul>\n</div>';
}), define("text!template/binder/binderPagesEmpty.html", [], function() {
    return '<div class="mx-empty-view mx-binder-empty">\n	{{#if branding.showAddFile}}\n    <div class="center"><img src="themes/images/empty-icon-pages.fd81a753.png"></div>\n    <div class="center title">{{lang.binder_pages_empty_headline}}</div>\n    <div class="center size20">{{lang.drop_your_file_to_upload}}</div>\n    <!-- <div class="center subtitle">{{lang.binder_pages_empty_subtitle}}</div> -->\n    <div class="extra">\n        <hr/>\n        <!-- <div class="notes">Lorem ipsum dolor sit amet, consectetur elit, sed do elusmod tempor incididunt ut labore et dolore</div>\n        <div class="links">\n            <a class="mouse-hand">Elusmod Tempor</a>\n            &bull;\n            <a class="mouse-hand">Incididunt Ut</a>\n        </div> -->\n        <div class="arrow-on-right"><i class="micon-download gray size32" ></i> </div>\n    </div>\n    {{/if}}\n</div>';
}), define("text!template/binder/pageListHeader.html", [], function() {
    return '<div class="mx-page-header"><div class="mx-folder-listview-item mx-list-header row" ta-param="{{name}}" id="folder{{sequence}}">\n    <div class="col-md-1 col-xs-1"></div>\n    <div class="col-md-5 col-xs-5">{{lang.name}}</div>\n    <div class="col-md-2 col-xs-2 update-field">\n        <span>{{lang.last_modified}}</span>\n    </div>\n    <div class="col-md-2 col-xs-2 size-field">\n        <span>{{lang.size}}</span>\n    </div>\n    <div class="col-md-1 col-xs-1 type-field">\n        {{lang.type}}\n    </div>\n    <div class="folder-actions col-md-1 col-xs-1">\n\n    </div>\n</div>\n</div>\n';
}), define("binder/pageGroupModel", [ "moxtra", "lang", "const" ], function(a, b) {
    return a.Model.extend({
        idAttribute: "client_uuid",
        defaults: {
            client_uuid: "",
            name: "",
            sequence: 0,
            totalPages: 0,
            bgColor: "",
            firstPageSequence: 0
        },
        validation: {
            name: [ {
                required: !0,
                msg: b.name_is_required
            } ]
        }
    });
}), define("binder/pages", [ "moxtra", "app", "lang", "const", "binder/binderBiz", "binder/binderActions", "text!template/binder/binderPagesList.html", "text!template/binder/binderPageItem.html", "text!template/binder/binderPageLVItem.html", "text!template/binder/binderPageGroup.html", "text!template/binder/binderFolder.html", "text!template/binder/binderFolderLVItem.html", "text!template/binder/binderPageGroupLVItem.html", "text!template/binder/binderGroupPages.html", "text!template/binder/binderPagesEmpty.html", "text!template/binder/pageListHeader.html", "text!template/binder/pagePathNode.html", "component/dialog/inputDialog", "binder/pageGroupModel", "admin/branding/helper", "sortable", "component/dialog/dialog", "ui" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
    "use strict";
    var v = a.logger("pages");
    o = Handlebars.compile(o), n = Handlebars.compile(n), j = Handlebars.compile(j), 
    k = Handlebars.compile(k), h = Handlebars.compile(h), l = Handlebars.compile(l), 
    m = Handlebars.compile(m), i = Handlebars.compile(i), p = Handlebars.compile(p);
    var w = Handlebars.compile(q), x = 'input[type="checkbox"]:checked[name="selectPages"]', y = {
        thumbnailView: j,
        listView: m
    }, z = {
        thumbnailView: h,
        listView: i
    }, A = {
        thumbnailView: k,
        listView: l
    };
    return a.Controller.extend({
        template: g,
        handleAction: !0,
        events: {
            'change input[type="checkbox"]': "notifyPageSelected"
        },
        init: function(a) {
            this.board = a.board, this.viewMode = "thumbnailView", this.board ? this._updateCollection() : this.board = Moxtra.getBoard(b.request.page()), 
            this.parent = a.parent, this.binderActions = f, this.$scope.lang = c, this.$scope.isPublic = !1, 
            this.$scope.disableActions = !1, this.$scope.empty_pages = d.defaults.binder.thumbnail_empty_page, 
            a.isPublic && (this.isPublic = !0, this.$scope.isPublic = !0, this.publicToken = a.token || "", 
            this.$scope.publicToken = a.token || "", this.$scope.disableActions = !0), a.disableActions && (this.$scope.disableActions = !0);
            var e = this.board.getMyBoardUserInfo();
            e.type === d.binder.role.Viewer && (this.$scope.isViewer = !0, this.isViewer = !0), 
            this.$scope.branding = {
                showAddFile: t.isShowAddFile(),
                showTodoTab: t.isShowTodo()
            }, this.parentFolder = null;
        },
        rendered: function() {
            var a = this;
            this.listContainer = this.$(".mx-pages-list"), this.folderContainer = this.$(".mx-folders-list");
            var b = !1;
            this.isPublic || new u(this.listContainer[0], {
                onEnd: $.proxy(a.onSortItem, a)
            }), this.collection || (this._updateCollection(), this.collection.$name = "files", 
            this.folders.$name = "folders", b = !0), this.groups = this.board.page_groups, b ? this.inlineCollection = !0 : this.isPublic && this.bindingEvent(), 
            $('a[class^="micon-"]').tooltip(), $(".add-page").tooltip();
        },
        onSubscribe: function() {},
        update: function() {
            var a = b.request.page(), c = this;
            a && (c.board && (c.stopListening(c.board), c.stopListening(c.collection), c.stopListening(c.folders)), 
            this.board = Moxtra.getBoard(a), this.currentFolder = null, this.updateFolderMap(), 
            this.inlineCollection && (this._updateCollection(), this.groups = this.board.page_groups, 
            this.bindingEvent()), this.exitEditModel(), this.binderid = a, setTimeout(function() {
                c.$(".mx-pages-wrap").trigger("scroll"), c.$(".page-group-wrap").trigger("scroll");
            }, 100));
        },
        addFile: function() {
            $(".add-page").dropdown("toggle"), this.handleEvent.stopPropagation();
        },
        _removeEmptyUI: function() {
            this.$el.find(".mx-pages-nav-bar").show(), this.$el.find(".mx-pages-wrap").show(), 
            this.$el.find(".mx-pages-empty").hide();
        },
        addEmptyUI: function() {
            this.currentFolder || this.$el.find(".mx-pages-nav-bar").hide(), this.$el.find(".mx-pages-empty").show(), 
            this.$el.find(".mx-pages-wrap").hide();
        },
        bindingEvent: function() {
            var a = this;
            this.stopListening(this.board), this.collection && (this.stopListening(this.collection), 
            _.each(this.collection, function(b) {
                a.stopListening(b), a.stopListening(b.pages), b.pages && 1 === b.pages.length && a.stopListening(b.pages[0]);
            })), this.folders && this.stopListening(this.folders), a.exitEditModel(), a.$(".edit-model").hide(), 
            a.listContainer.empty(), a.folderContainer.empty(), a.collection.length || a.folders.length ? (a._removeEmptyUI(), 
            this.$el.loading(), a.$(".edit-model").show(), setTimeout(function() {
                a.renderFolders(), a.renderAllFile(), a.$el.loading(!1), a.isPublic && b.sendMessage({
                    action: "view_share_link",
                    session_id: Moxtra.getMe().sessionId,
                    token: a.publicToken
                });
            }, 200)) : (a.$el.loading(!1), a.exitEditModel(), a.$(".edit-model").hide(), a.listContainer.empty(), 
            a.addEmptyUI()), a.listenTo(a.folders, "add", this.renderOneFolder), a.listenTo(a.folders, "remove", this.removeOneFolder), 
            a.listenTo(a.collection, "add", this.renderOneFile), a.listenTo(a.collection, "remove", this.removeOneFile), 
            a.listenTo(a.collection, "sort", this.onFileSorted), a.listenTo(a.folders, "sort", this.renderFolders), 
            this.listenTo(this.collection, "empty", function() {
                if (!a.folders.length) {
                    var b = this.listContainer;
                    a.exitEditModel(), a.$(".edit-model").hide(), b.empty(), a.addEmptyUI();
                }
            }, this);
        },
        onModelChange: function(a) {
            v.debug("changed", a.previousAttributes(), a.toJSON());
        },
        onPageChange: function(a) {
            var b = this.board.getCacheObject(a.page_group);
            this.onFileChange(null, b);
        },
        onFileChange: function(a, b) {
            var c = this.$el.find(".mx-pages-list");
            c.find("#page" + b.client_uuid).length && this.renderOneFile(b);
        },
        onGroupRemove: function(a) {
            var b = a.get("client_uuid"), c = this.$("#" + b);
            c.remove(), $("#page" + a.client_uuid).remove(), f.page_group && f.clearGroupInfo();
        },
        removeOneFile: function(a) {
            0 === this.collection.length && 0 === this.folders.length && this._showEmpty();
            var b = a.toJSON(), c = this.$("#page" + b.client_uuid);
            c && (c.hasClass("page-group") && (f.clearGroupInfo(), $("#" + b.client_uuid).remove()), 
            c.remove());
        },
        _showEmpty: function() {
            this.$(".edit-model").hide();
        },
        removeOneFolder: function(a) {
            0 === this.collection.length && 0 === this.folders.length && this._showEmpty();
            var b = this.$("#folder" + a.sequence);
            b.size() && b.remove();
        },
        renderFolders: function() {
            var a = this;
            a.folderContainer.empty(), a.$(".mx-page-header").remove(), "listView" === this.viewMode && a.folderContainer.before(p(a.$scope)), 
            a.folderContainer.hide(), this.folders.each(function(b) {
                a.renderOneFolder(b);
            }), a.folderContainer.show(), this.updateFolderMap();
        },
        renderOneFolder: function(a) {
            var b = this.folderContainer, d = $(A[this.viewMode](_.extend(a, {
                lang: c,
                isPublic: this.isPublic,
                isViewer: this.isViewer
            })));
            0 === b.children().length && this._removeEmptyUI(), this.$(".edit-model").show();
            var e = this.folders.indexOf(a);
            if (0 === e) b.prepend(d); else if (e === this.folders.length - 1) b.append(d); else {
                var f = this._getPrePositionDom(e, this.folders, "folder");
                f && f.length ? f.after(d) : b.prepend(d);
            }
            this.listenTo(a, "change:name", this.updateFolderName, this), d.find('input[type="checkbox"]').mxCheckbox();
        },
        onFileSorted: function() {
            var a = this.listContainer.children(), b = this;
            $.each(this.collection, function(c, d) {
                var e = a[c], f = b.listContainer.find("#page" + d.client_uuid);
                f && f !== e && b.renderOneFile(d);
            });
        },
        renderAllFile: function() {
            var a = this;
            a.listContainer.empty(), a.listContainer.hide(), this.fileDoms = [], this.collection.each(function(b) {
                a.renderOneFile(b, !0);
            }), a.listContainer.append(this.fileDoms.join("")), a.listContainer.find('input[type="checkbox"]').mxCheckbox(), 
            a.listContainer.show(), $(".mx-pages-wrap").find("img.lazy").lazyload({
                container: ".mx-pages-wrap"
            });
        },
        renderOnePage: function(a) {
            var b, d, e, f = a, g = this.$(".page-group-wrap");
            if (e = g.find("#page" + f.sequence), e && e.remove(), f.pages && f.pages.length && (f = f.pages[0]), 
            this.stopListening(f), d = $(z[this.viewMode](_.extend(f, {
                lang: c,
                isPublic: this.isPublic
            }))), d.attr("id", "page" + f.sequence), d.attr("page-sequence", f.sequence), f.page_group) {
                var h = f.page_group, i = this.board.getCacheObject(h), j = i.pages.get(f.sequence), k = i.pages.indexOf(j);
                if (b = this.$("#" + h), 0 === k) b.find("ul").prepend(d); else if (k === i.pages.length - 1) b.find("ul").append(d); else {
                    var l = this._getPrePositionDom(k, i.pages);
                    l && l.length ? l.after(d) : b.find("ul").prepend(d);
                }
            } else this.insertOnePage(a, d, g);
            d.find('input[type="checkbox"]').mxCheckbox(), this.listenTo(f.comments, "change", function() {
                this.updateTotalComment(f);
            }), this.listenTo(f, "change:name", this.updatePageName, this), this.listenTo(f, "change:thumbnail", this.updateThumbnail);
        },
        _getPrePositionDom: function(a, b, c) {
            c = c || "page";
            for (var d, e, f = a - 1; f > -1 && (d = b[f], e = this.$("#" + c + d.sequence), 
            !e.length) && (e = this.$("#" + c + d.client_uuid), !e.length); ) f--;
            return e;
        },
        _getGroupIndex: function(a) {
            for (var b = this.collection, c = 1, d = 0; d < b.length; d++) {
                if (b[d] === a) return c;
                b[d].pages.length > 1 && c++;
            }
        },
        renderOneFile: function(a, b) {
            this.stopListening(a), this.stopListening(a.pages);
            var e, g = this.listContainer, h = a.toJSON(), i = this;
            if (!b) {
                this.$(".edit-model").show(), 0 === g.children().length && this._removeEmptyUI();
                var j = g.find("#page" + a.client_uuid);
                j && j.remove(), f.page_group === a.client_uuid && ($("#" + a.client_uuid).find("li.page-item").remove(), 
                a.pages && a.pages.length > 1 && a.pages.each(function(a) {
                    i.renderOnePage(a);
                }));
            }
            if (h.lang = c, h.isViewer = this.isViewer, h.isPublic = this.isPublic, h.defaultThumbnail = d.defaults.binder.thumbnail_file, 
            !h.totalPages && !h.thumbnail && h.original) {
                var k = this.board.resources.get(h.original);
                h.fileType = k && k.name ? k.name.split(".").pop().toUpperCase() : "UNKNOWN";
            }
            var l;
            if (a.totalPages > 1 ? (l = 0, h.bgColor || (h.bgColor = (this._getGroupIndex(a) - 1) % 5 + 1)) : delete h.bgColor, 
            b) this.fileDoms.push(y[this.viewMode](h)); else {
                if (l = this.collection.indexOf(a), 0 === l) g.prepend(y[this.viewMode](h)); else if (l === this.collection.length - 1) g.append(y[this.viewMode](h)); else {
                    var m = this._getPrePositionDom(l, this.collection);
                    m && m.length ? m.after(y[this.viewMode](h)) : g.prepend(y[this.viewMode](h));
                }
                e = g.find("#page" + h.client_uuid), e.closest("li").find('input[type="checkbox"]').mxCheckbox();
            }
            this.listenTo(a.pages, "add", function(b) {
                a.pages.length >= 1 && i.onPageAdd(a), i.isPublic || f.page_group !== b.page_group || (i.renderOnePage(b), 
                setTimeout(function() {
                    $("#page" + b.client_uuid).find("img.lazy").lazyload({
                        container: "#page" + b.client_uuid
                    });
                }, 100));
            }), this.listenTo(a.pages, "remove", function() {
                1 === a.pages.length && f.page_group && ($("#" + a.client_uuid).remove(), f.clearGroupInfo()), 
                i.onPageAdd(a);
            }), this.listenTo(a.pages, "sort", function() {
                f.page_group === a.client_uuid && a.pages.each(function(a) {
                    i.renderOnePage(a);
                });
            });
            var n = a.pages[0];
            1 === a.pages.length && this.listenToOnce(n, "change:comments add:comments remove:comments", function() {
                i.onPageChange(n);
            }, this), a.pages.length >= 1 && this.listenTo(n, "change:thumbnail change:rotate", function() {
                i.onFileChange(null, a);
            }), this.listenTo(a, "change:pages change:name", this.onFileChange, this), v.debug("add group", a.toJSON());
        },
        onPageAdd: function(a) {
            if (this.$(".mx-empty-view").remove(), this.$(".edit-model").show(), !a.is_deleted) {
                var b = this.listContainer.find("#page" + a.client_uuid);
                b && b.length && this.renderOneFile(a);
            }
            setTimeout(function() {
                $(".mx-pages-wrap").find("#page" + a.sequence).find("img.lazy").lazyload({
                    container: "#page" + a.sequence
                });
            }, 100);
        },
        insertOnePage: function(a, b, c) {
            var d = this.collection.indexOf(a);
            if (0 === d) c.prepend(b); else if (d === this.collection.length - 1) c.append(b); else {
                var e = this._getPrePositionDom(d, this.collection);
                e && e.length ? e.after(b) : c.prepend(b);
            }
        },
        updateThumbnail: function(a, b) {
            var c = this.$("#page" + b.sequence), d = c.find(".page-cover img");
            d.is(":visible") ? d.attr("src", a) : d.attr("data-original", a), d.data("rotate", b.rotate), 
            $(".mx-pages-wrap").trigger("scroll");
        },
        updatePageIndex: function(a) {
            var b = this;
            a.each(function(a) {
                var d = a.toJSON(), e = b.$("#page" + d.sequence);
                a.pages.length ? e.find("em").text(d.pageIndex + " - " + d.totalPages + " " + (d.totalPages > 1 ? c.pages : c.page)) : e.find(".page-info .page-index").text(d.pageIndex);
            });
        },
        _refreshView: function() {
            this.stopListening(this.folders), this.stopListening(this.collection), this.bindingEvent();
        },
        showList: function() {
            "listView" !== this.viewMode && (this.listContainer.empty(), this.viewMode = "listView", 
            $(".mx-pages").addClass("list-view-mode"), this._refreshView());
        },
        showThumbnail: function() {
            "thumbnailView" !== this.viewMode && (this.listContainer.empty(), this.viewMode = "thumbnailView", 
            $(".mx-pages").removeClass("list-view-mode"), this._refreshView());
        },
        updateTotalComment: function(a) {
            var b = a, c = this.$("#page" + b.sequence);
            c.find(".page-info .page-total-comments").text(b.total_comments);
        },
        updatePageName: function(a, b) {
            var c = this.$("#page" + b.sequence);
            c.find(".page-info .page-name").text(a);
        },
        updateFolderName: function(a, b) {
            var c = this.$("#folder" + b.sequence);
            c.find(".mx-folder-name").text(a);
        },
        scrollToBottom: function() {
            var a = this.$el.find(".mx-pages-wrap");
            setTimeout(function() {
                a.scrollTop(a[0].scrollHeight);
            }, 10);
        },
        getThePrevNumber: function(a, b) {
            var c, d = a.prev(), e = '[data-action="viewPage"],[data-action="showPageGroup"]';
            return d.length ? b ? (c = parseInt(d.attr("page-sequence")), parseFloat(this.board.pages.get(c).page_number)) : (c = d.find(e).attr("data-param"), 
            parseFloat(this.collection.get(c).order_number)) : void 0;
        },
        getTheNextNumber: function(a, b) {
            var c, d = a.next(), e = '[data-action="viewPage"],[data-action="showPageGroup"]';
            return d.length ? b ? (c = parseInt(d.attr("page-sequence")), parseFloat(this.board.pages.get(c).page_number)) : (c = d.find(e).attr("data-param"), 
            parseFloat(this.collection.get(c).order_number)) : void 0;
        },
        onSortItem: function(a) {
            var b = this, c = $(a.item), d = b.getThePrevNumber(c), e = b.getTheNextNumber(c);
            isNaN(e) ? e = d + 100 : isNaN(d) && (d = e - 100);
            var f, g = c.find('[data-action="viewPage"],[data-action="showPageGroup"]').attr("data-param");
            f = this.collection.get(g), f.set("order_number", (e + d) / 2 + ""), f.update();
        },
        onPageSortItem: function(a) {
            var b = this, c = $(a.item), d = !1, e = b.getThePrevNumber(c, !0), f = b.getTheNextNumber(c, !0);
            isNaN(f) ? f = e + 100 : isNaN(e) && (d = !0, e = f - 100);
            var g, h = c.attr("page-sequence");
            g = this.board.pages.get(parseInt(h)), g.set("page_number", (f + e) / 2 + ""), g.update();
        },
        enterEditModel: function() {
            this.editable = !0, this.$el.addClass("edit-model"), $(".mx-add-page-bar").hide();
        },
        exitEditModel: function() {
            this.editable && (this.editable = !1, f.page_group || $(".mx-add-page-bar").show(), 
            $('.mx-action-bar .edit-bar a[class^="micon-"]').addClass("disabled"), this.$el.removeClass("edit-model"), 
            this.$el.find('[data-action="selectAll"]').removeClass("checked").html(c.select_all), 
            $("#tab_pages").find('input[type="checkbox"]').prop("checked", ""), $("#tab_pages").find('input[type="checkbox"]').prev("i").removeClass("micon-circle-checkmark").addClass("micon-circle-checkbox"));
        },
        showPageGroup: function(a) {
            var b = this.handleEvent, d = $(b.currentTarget), e = this, g = this.collection.get(a);
            if (!g.totalPages) return void b.stopPropagation();
            if ($(".mx-add-page-bar").hide(), $(".new-folder").hide(), this.editable) {
                b.stopPropagation();
                var h = d.closest(".page-group").find(".group-actions input"), i = h.prop("checked");
                h.prop("checked", !i).trigger("change");
            } else {
                g.lang = c, this.openedGroup = n(g), this.$el.append(this.openedGroup), g.pages && g.pages.each(function(a) {
                    e.renderOnePage(a);
                });
                var j = $("#" + a), k = this.$(".mx-pages-wrap").offset(), l = this.$el.closest(".page-body").offset();
                if (this.isPublic && !this.$el.parents(".api-public-view-pages").length) {
                    k.top = l.top + 68 + 18, j.find(".page-group-wrap").css(_.extend(k, {
                        bottom: "0px"
                    })).trigger("scroll"), j.find(".group-info-wrap").css({
                        left: k.left,
                        top: l.top + 34
                    });
                    var m = [];
                    j.find("ul li").each(function() {
                        var a = 1 * $(this).attr("page-sequence");
                        MX.isNumber(a) && m.push(a);
                    }), this.trigger("showPageGroup", {
                        pageGroup: g.client_uuid,
                        pages: m
                    });
                } else k.top = l.top + 34 + 18, j.find(".page-group-wrap").css(k).trigger("scroll"), 
                j.find(".group-info-wrap").css({
                    left: k.left,
                    top: l.top
                });
                f.setGroupInfo(a), this.isPublic || (this.pageSort = new u(document.querySelector(".page-group-wrap"), {
                    onEnd: $.proxy(e.onPageSortItem, e)
                })), $(".page-group-wrap").find("img.lazy").lazyload({
                    container: ".page-group-wrap"
                }), this.isPublic || $(".mx-pages-list").children("li").find(":checkbox").prop("checked", !1).trigger("change");
            }
        },
        hidePageGroup: function() {
            this.editable || ($(".mx-add-page-bar").show(), $(".new-folder").show()), f.clearGroupInfo(), 
            this.pageSort && this.pageSort.destroy(), $(".group-pages").remove(), this.isPublic && this.trigger("hidePageGroup");
        },
        viewPage: function() {
            var a = this.handleEvent;
            if (this.editable) {
                a.stopPropagation();
                var b = $(a.currentTarget), c = b.closest("li").find(":checkbox"), d = c.prop("checked");
                c.prop("checked", !d).trigger("change");
            }
        },
        removePages: function() {
            if (f.page_group) return void this._removePage();
            var a = this._getSelectedFolders(), b = this._getSelectedGroups(), d = a.length;
            if (0 >= d && b.length <= 0) return void MX.ui.Alert(c.binder_action_needs_one_or_more_files);
            var e = this;
            f.removeFiles(this.board.id, b, a).success(function() {
                e.exitEditModel();
            });
        },
        _removePage: function() {
            var a = this.getSelectedPages(), b = this;
            f.removePages(this.board.id, a, [], function() {
                b.exitEditModel();
            });
        },
        createFolder: function() {
            var a = this._getSelectedGroups(), b = this;
            this.recovery(new MX.ui.Dialog(new r({
                model: new Moxtra.model.BoardFolder({
                    validation: {
                        name: [ {
                            required: !0,
                            msg: c.name_is_required
                        } ]
                    }
                }),
                title: c.create_folder,
                input: {
                    name: "name",
                    placeholder: c.name_is_required
                },
                buttons: [ {
                    text: c.cancel,
                    className: "btn-default",
                    position: "left",
                    click: function() {
                        this.close();
                    }
                }, {
                    text: c.create,
                    className: "btn-primary",
                    loadingText: c.creating_ellipsis,
                    id: "btnCreateFolder",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    var d = this;
                    if (this.model.isValid(!0)) {
                        var e = this.dialog.getButton("btnCreateFolder");
                        e.button("loading"), this.model.create(b.currentFolder || b.board).success(function(e) {
                            a && a.length ? b.board.moveFiles(a, e, b.currentFolder || b.board).success(function() {
                                b.exitEditModel(), MX.ui.notifySuccess(c.create_folder_success), d.dialog.close();
                            }) : (MX.ui.notifySuccess(c.create_folder_success), d.dialog.close());
                        }).error(function() {
                            e.button("reset"), MX.ui.notifyError(c.create_folder_failed);
                        });
                    }
                }
            })));
        },
        accessSubFolder: function(a) {
            var b, c = this.handleEvent;
            if (c && (b = $(c.currentTarget)), !this.editable || (c.stopPropagation(), b.parents(".mx-pages-nav-bar").length)) {
                var d = this.board.getCacheObject(a);
                this.stopListening(this.folders), this.stopListening(this.collection), d ? (this.currentFolder = d, 
                this._updateCollection(d.sequence)) : (this.currentFolder = null, this._updateCollection()), 
                0 === this.folders.length && 0 === this.collection.length && this.$(".edit-model").hide(), 
                this.bindingEvent(), this.updateFolderMap();
            } else if (!$(c.target).is(":checkbox")) {
                var e = b.closest(".mx-folder-item").find(".folder-actions input"), f = e.prop("checked");
                e.prop("checked", !f).trigger("change");
            }
        },
        _updateCollection: function(a) {
            this.folders = this.board.getFolders(a), this.collection = this.board.getFiles(a), 
            this.recovery(this.folders), this.recovery(this.collection);
        },
        updateFolderMap: function() {
            var a = $(".mx-files-navigator");
            if (a.empty(), this.currentFolder) {
                var b = $(w(_.extend({
                    currentPosition: "currentPosition",
                    name: this.currentFolder.name,
                    sequence: this.currentFolder.sequence
                }))), d = [ this.currentFolder.sequence ];
                a.prepend(b);
                for (var e = this.currentFolder, g = 1; "BoardFolder" === e.parent.$name; ) e = e.parent, 
                d.unshift(e.sequence), e.client_uuid && e.name && (5 > g && (a.prepend('<span class="mx-map-divide">></span>'), 
                4 > g && a.prepend($(w(_.extend(e))))), g++);
                g >= 5 && a.prepend("<span>...</span>"), f.destFolder = d.join(","), this.parent && !this.isPublic && (this.parent.destFolder = d.join(","), 
                this.parent.refreshUploader()), f.currentObj = this.currentFolder, a.prepend('<span class="mx-map-divide">></span>');
            } else f.currentObj = this.board, f.destFolder = null, this.parent && !this.isPublic && (this.parent.destFolder = null, 
            this.parent.refreshUploader());
            a.children().length && a.prepend($(w({
                name: c.all,
                sequence: 0
            })));
        },
        rotate: function(a, b) {
            b % 90 !== 0 && (b = 0);
            var c = "rotate(" + b + "deg)";
            a.css({
                "-o-transform": c,
                "-webkit-transform": c,
                "-moz-transform": c,
                "-ms-transform": c,
                transform: c
            }), a.data("rotate", b), v.debug("Rotate ", b);
        },
        sharePages: function() {
            var a = this._getSelectedGroups(), c = this._getSelectedFolders(), d = this.getSelectedPages();
            d.length ? f.sharePages(b.request.page(), d) : f.shareFiles(b.request.page(), a, c);
        },
        downloadPages: function() {
            var a = this.getSelectedPages(), d = this._getSelectedGroups(), e = a.length + d.length;
            return 0 >= e ? void MX.ui.Alert(c.binder_action_needs_one_or_more_files) : void (a.length ? f.downloadPages(b.request.page(), a) : f.downloadResources(b.request.page(), d));
        },
        copyPages: function() {
            var a = this, d = this.getSelectedPages(), e = this._getSelectedGroups(), g = d.length + e.length;
            return 0 >= g ? void MX.ui.Alert(c.binder_action_needs_one_or_more_files) : void (d.length ? f.copyPageTo(b.request.page(), d).on("close", function() {
                a.exitEditModel();
            }) : f.copyFilesTo(e, b.request.page()).on("close", function() {
                a.exitEditModel();
            }));
        },
        movePages: function() {
            var a = this._getSelectedGroups(), d = this, e = this.getSelectedPages(), g = e.length + a.length;
            return 0 >= g ? void MX.ui.Alert(c.binder_action_needs_one_or_more_files) : void (e.length ? f.movePageTo(b.request.page(), e).on("close", function() {
                d.exitEditModel();
            }) : f.moveFileTo(b.request.page(), a).success(function() {
                d.exitEditModel();
            }).error(function() {}));
        },
        createTodo: function() {
            var a = this.handleEvent, b = this;
            a.stopPropagation();
            var d = this._getSelectedGroups();
            return d.length <= 0 ? void MX.ui.Alert(c.binder_action_needs_one_or_more_files) : void f.createTodo(this.binderid, null, d).success(function() {
                b.exitEditModel();
            });
        },
        groupPage: function() {
            var a, b = this;
            a = f.page_group ? this.getSelectedPages() : this._getSelectedGroups(), f.groupPage(this.binderid, a).success(function() {
                b.exitEditModel();
            });
        },
        selectAll: function() {
            var a, b = this.handleEvent, d = $(b.currentTarget);
            a = this.$(f.page_group ? ".page-group-wrap" : ".mx-pages-wrap");
            var e = a.find('input[type="checkbox"]');
            d.hasClass("checked") ? (d.removeClass("checked"), e.prop("checked", ""), e.prev("i").removeClass("micon-circle-checkmark").addClass("micon-circle-checkbox"), 
            d.html(c.select_all)) : (d.addClass("checked"), e.prop("checked", "checked"), e.parent().addClass("mx-checkbox"), 
            e.prev("i").removeClass("micon-circle-checkbox").addClass("micon-circle-checkmark"), 
            d.html(c.unselect_all)), this.notifyPageSelected();
        },
        getSelectedPages: function(a) {
            var b = [], c = x;
            return f.page_group && (c = "#" + f.page_group + " " + x), this.$el.find(c).each(function(c, d) {
                if (a && "group" === $(d).attr("name")) for (var e = $(d).parents("ul").eq(0).attr("id"), f = this.groups.get(e), g = f.get("totalPages"), h = this.collection, i = h.length, j = 0; i > j && g; j++) h[j].get("pageGroup") && h[j].get("pageGroup").client_uuid === e && (b.push(h[j].get("sequence")), 
                g--); else "group" !== $(d).attr("name") && b.push(1 * $(d).val());
            }), b;
        },
        _getSelectedGroups: function() {
            var a = [];
            return this.$el.find("ul.mx-pages-list").find(":checked[name=group]").each(function(b, c) {
                a.push($(c).attr("data-param"));
            }), a;
        },
        _getSelectedFolders: function() {
            var a = [];
            return this.$el.find("ul.mx-folders-list").find(":checked[name=folder]").each(function(b, c) {
                a.push(parseInt($(c).attr("data-param")));
            }), a;
        },
        getGroupInfos: function() {
            var a = [];
            return this.groups.each(function(b) {
                a.push(MX.pick(b.toJSON(), [ "sequence", "name", "client_uuid" ]));
            }), a;
        },
        notifyPageSelected: function() {
            var a = {
                download: $("a.micon-download"),
                move: $("a.micon-page-copy"),
                copy: $("a.micon-copy"),
                createTodo: $("a.micon-todo-empty"),
                share: $("a.micon-share"),
                remove: $("a.micon-trash"),
                createFolder: $("a.micon-folder-empty"),
                group: $("a.micon-group")
            }, c = this.getSelectedPages(), d = this._getSelectedGroups(), e = this._getSelectedFolders();
            if (b.isIntegrationEnabled()) {
                var f = b.request.page(), g = [];
                _.each(c, function(a) {
                    isNaN(parseInt(a, 10)) || g.push({
                        sequence: 1 * a
                    });
                });
                var h = {
                    action: "selectpage",
                    binder_id: f,
                    binder_pages: g.length ? g : null,
                    session_key: null,
                    session_id: Moxtra.getMe().sessionId || null
                };
                b.sendMessage(h);
            }
            if ($('.mx-action-bar .edit-bar a[class^="micon-"]').addClass("disabled"), e.length + c.length + d.length > 0) if (e.length) a.remove.removeClass("disabled"), 
            a.share.removeClass("disabled"); else if (c.length) a.share.removeClass("disabled"), 
            a.remove.removeClass("disabled"), a.download.removeClass("disabled"), a.copy.removeClass("disabled"), 
            a.move.removeClass("disabled"), c.length >= 2 && a.group.removeClass("disabled"); else if (d.length && (a.share.removeClass("disabled"), 
            a.remove.removeClass("disabled"), a.move.removeClass("disabled"), a.createFolder.removeClass("disabled"), 
            a.copy.removeClass("disabled"), a.createTodo.removeClass("disabled"), a.download.removeClass("disabled"), 
            d.length >= 2)) {
                for (var i = 0; i < d.length; i++) {
                    var j = this.board.getCacheObject(d[i]);
                    if (!j.pages || j.pages.length < 1) return;
                }
                a.group.removeClass("disabled");
            }
        },
        removeFolder: function(a) {
            f.removeFiles(this.board.id, [], [ parseInt(a) ]);
        },
        removeFile: function(a) {
            f.removeFiles(this.board.id, [ a ], []);
        },
        renameFolder: function(a) {
            var b, d = this.folders.get(a);
            d.validation = {
                name: [ {
                    required: !0,
                    msg: c.name_is_required
                } ]
            }, b = new MX.ui.Dialog(new r({
                model: d,
                title: c.rename,
                input: {
                    name: "name",
                    placeholder: c.name_is_required
                },
                buttons: [ {
                    text: c.cancel,
                    className: "btn-default",
                    position: "left",
                    click: function() {
                        this.close();
                    }
                }, {
                    text: c.update,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    if (d.isValid(!0)) {
                        var a = this;
                        a.dialog.progress(), d.update().success(function() {
                            MX.ui.notifySuccess(c.rename_folder_success), a.dialog.progress(!1), a.dialog.close();
                        }).error(function() {
                            MX.ui.notifyError(c.rename_folder_failed), a.dialog.progress(!1);
                        });
                    }
                }
            }));
        },
        downloadFile: function(a) {
            f.downloadResources(b.request.page(), [ a ]);
        },
        copyFile: function(a) {
            f.copyFilesTo([ a ], this.binderid);
        },
        moveFile: function(a) {
            f.moveFileTo(this.binderid, [ a ]);
        },
        createTodoWithSingleFile: function(a) {
            f.createTodo(this.binderid, null, [ a ]);
        },
        shareFile: function(a) {
            f.shareFiles(this.binderid, [ a ], []);
        },
        shareFolder: function(a) {
            f.shareFiles(this.binderid, [], [ parseInt(a) ]);
        },
        renameGroup: function(a) {
            var b, d = this.board.getCacheObject(a);
            d.validation = {
                name: [ {
                    required: !0,
                    msg: c.name_is_required
                } ]
            }, b = new MX.ui.Dialog(new r({
                model: d,
                title: c.rename,
                input: {
                    name: "name",
                    placeholder: c.name_is_required
                },
                buttons: [ {
                    text: c.cancel,
                    className: "btn-default",
                    position: "left",
                    click: function() {
                        this.close();
                    }
                }, {
                    text: c.update,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    if (d.isValid(!0)) {
                        var a = this;
                        a.dialog.progress(), d.update().success(function() {
                            MX.ui.notifySuccess(c.rename_file_success), a.dialog.progress(!1), a.dialog.close();
                        }).error(function() {
                            MX.ui.notifyError(c.rename_file_failed), a.dialog.progress(!1);
                        });
                    }
                }
            }));
        },
        rotateFile: function(a) {
            var b = this.board.getCacheObject(a);
            b.rotate().success(function() {
                MX.ui.notifySuccess(c.rotate_file_success);
            }).error(function() {
                MX.ui.notifySuccess(c.rotate_files_failed);
            });
        },
        updateDirtyData: function() {
            if (this.collection.needUpdate) {
                var a = [];
                this.collection.each(function(b) {
                    b.get("needUpdate") && a.push({
                        sequence: b.get("sequence"),
                        page_number: b.get("pageNumber") + ""
                    });
                }), e.updatePageNumber(b.request.page(), a), this.collection.needUpdate = !1;
            }
        },
        leave: function() {
            f.page_group && (f.clearGroupInfo(), this.hidePageGroup()), f.currentObj = null, 
            this.parent && !this.isPublic && (this.parent.destFolder = null, this.parent.refreshUploader());
        },
        destroy: function() {
            f.currentObj = null;
        }
    });
}), define("text!template/todo/main.html", [], function() {
    return '<div class="mx-todos">\n    <div class="mx-todos-wrap">\n        <div class="todo-filter">\n            <div class="input-group clearfix J-filter">\n                <div class="input-group-btn" id="todoFilter">\n                    <button type="button" data-action="renderFilterMembers" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span></span> <i class="caret"></i></button>\n                    <ul class="dropdown-menu">\n                        <li><a href="javascript:;" data-action="filterTodos" data-param="all">{{lang.all_todos}}</a></li>\n                        <li><a  href="javascript:;"  data-action="filterTodos" data-param="my">{{lang.my_todos}}</a></li>\n                        <li><a  href="javascript:;"  data-action="filterTodos" data-param="unassigned">{{lang.unassigned_todos}}</a></li>\n                        <li class="divider"></li>\n                        <li id="binderMembersList" >\n\n                        </li>\n                    </ul>\n                </div><!-- /btn-group -->\n                <div class="form-with-icon ">\n                    <i class="micon-search icon-control"></i>\n                    <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                        <span>×</span>\n                    </button>\n                    <input type="text" id="searchTodo" class="form-control pull-left" placeholder="{{lang.search_todo}}">\n                </div>\n            </div>\n        </div>\n        <div class="mx-binder-todos">\n\n        </div>\n        <div class="">\n        <div class="mx-todos-completed-title hide">\n            <a data-toggle="collapse" data-parent=".mx-todos-wrap" href="#completedTodos" >\n                <i class="micon-arrow-right" />\n                <strong>{{lang.completed}} (<span class="completed-todos-count"></span>)</strong>\n            </a>\n        </div>\n\n        <div id="completedTodos" class="mx-binder-todos-completed collapse ">\n\n        </div></div>\n    </div>\n    <span class="moxtra-poweredby mxbrand-powered-by-moxtra active for-chat" ></span>\n    <div class="mx-todo-empty hide">\n        <div>\n            <div class="row mx-todo-empty-description">\n                <div class="col-md-12">\n                    <span class="mx-todo-empty-title">{{lang.todo_empty_headline}}</span>\n                    <span>{{lang.todo_empty_subtitle}}</span>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="mx-action-bar">\n        <div class="pull-left dropup sort-action">\n            <a data-toggle="dropdown" title="{{lang.sort_todo}}" class="micon-sort"></a>\n            <ul class="dropdown-menu" role="menu" >\n                <li><a data-action="sortTodos" data-param="priority"><i class="micon-flag"></i><span>{{lang.sort_by_priority}}</span></a></li>\n                <li><a data-action="sortTodos" data-param="duedate"><i class="micon-calendar"></i><span>{{lang.sort_by_due_date}}</span></a></li>\n                <li><a data-action="sortTodos" data-param="alpha"><i class="micon-sort-by-alphabet"></i><span>{{lang.sort_by_alphabetically}}</span></a></li>\n                <li><a data-action="sortTodos" data-param="assignee"><i class="micon-user-with-arrow"></i><span>{{lang.sort_by_assignee}}</span></a></li>\n            </ul>\n        </div>\n        <span class="viewer-tips">{{lang.you_are_viewer_of_this_binder}}</span>\n        <textarea autofocus="autofocus" id="todoInput" class="todo-input noOutline" placeholder="{{lang.add_to_do_item}}"></textarea>\n    </div>\n\n</div>\n';
}), define("text!template/todo/todoItem.html", [], function() {
    return '<li class="mx-item mx-hover-effect " data-param="{{sequence}}">\n    <div class="mx-todo-item mouse-hand " id="todo_{{sequence}}" data-action="viewTodoDetail"\n         data-param="{{sequence}},{{boardId}}">\n        <div class="pull-left todo-loading"></div>\n        <div class="todo-list-info pull-right">\n            <table>\n                <tr>\n                    <td>\n                        <div class=" todo-other-info">\n                            {{#if attachments.length}}\n            <span class="gray">\n                <i class="micon-paperclip size14" titile="{{lang.attachments}}"></i>\n                {{attachments.length}}\n            </span>\n                            {{/if}}\n                            {{#if comments.length}}\n			<span class="marginLeft5 gray">\n	            <i class="micon-comment size14 " title="{{lang.comments}}"></i>\n	           {{comments.length}}\n			</span>\n                            {{/if}}\n\n                        </div>\n                    </td>\n                    <td>\n                        <span class=" mouse-hand mx-user">\n                        	{{isAssigneeToMe}}\n			{{#if assignee}}\n			<img class="todo-assignee  {{#if assignee.group}}mx-noborder mx-noborder-radius mx-nobox-shadow{{/if}}" src="{{assignee.avatar}}" onerror="this.onerror=null;this.src=\'{{defaultUserAvatar}}\'"  title="{{assignee.user.name}}"/>\n			{{/if}}\n		</span>\n                    </td>\n\n                    <td>\n                        <span class=" btn micon-btn mouse-hand" {{#unless\n                              is_completed}}data-action="{{#if is_marked}}unmarkTodo{{else}}markTodo{{/if}}" {{/unless}}\n                        data-param="{{sequence}},{{boardId}}">\n                        {{#if is_marked}}\n                        {{#if is_completed}}\n                        <i class="micon-flag  gray"></i>\n                        {{else}}\n                        <i class="micon-flag  blue" title="{{lang.flag_important_remove}}"></i>\n                        {{/if}}\n                        {{else}}\n                        <i class="micon-flag-empty  gray" title="{{lang.flag_important}}"></i>\n                        {{/if}}\n                        </span>\n                    </td>\n                </tr>\n            </table>\n\n        </div>\n        <div class="col-md-10">\n            <span class="todo-status" data-action="{{#if is_completed}}reopenTodo{{else}}closeTodo{{/if}}"\n                  data-param="{{sequence}},{{boardId}}">\n			{{#if is_completed}}\n			<i class="micon-todo  gray"></i>\n			{{else}}\n			<i class="micon-square  blue"></i>\n			{{/if}}\n            <i class="micon-svg-text-bubble4 add-fail hide"></i>\n		</span>\n            <span class="mouse-hand todo-title">\n			<div class="ellipsis todo-name" data-param="{{name}}">{{name}}</div>\n			<div class="todo-extra">\n                {{#if due_date}}\n                {{formatDueDate due_date}}\n                {{/if}}\n                <a class="retry hide" title="retry">{{lang.retry}}</a>\n            </div>\n		</span>\n        </div>\n\n\n\n\n    </div>\n</li>\n';
}), define("text!template/todo/emptyView.html", [], function() {
    return '<div class="mx-empty-view mx-todo-empty">\n    <div class="center"><img src="themes/images/empty-icon-todos.42328c2c.png"></div>\n    <div class="center title">{{lang.todo_empty_headline}}</div>\n    <div class="center subtitle">{{lang.todo_empty_subtitle}}</div>\n    <div class="extra">\n        <hr/>\n        <!-- <div class="notes">Lorem ipsum dolor sit amet, consectetur elit, sed do elusmod tempor incididunt ut labore et dolore</div>\n        <div class="links">\n            <a class="mouse-hand">Elusmod Tempor</a>\n            &bull;\n            <a class="mouse-hand">Incididunt Ut</a>\n        </div> -->\n        <div class="text-center" style="margin-top: 20px"><i class="micon-download gray size32" ></i> </div>\n    </div>\n</div>';
}), define("binder/todo", [ "moxtra", "app", "lang", "const", "text!template/todo/main.html", "text!template/todo/todoItem.html", "text!template/todo/emptyView.html", "binder/todo/todoDetail", "binder/todo/todoBiz", "text!template/user/userMenuItem.html", "component/autocomplete/autocomplete", "component/templateHelper" ], function(a, b, c, d, e, f, g, h, i, j, k) {
    "use strict";
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        events: {
            "keydown textarea": "createTodo",
            "keyup #searchTodo": "searchTodo"
        },
        init: function() {
            this.$scope.lang = c;
            var a = Moxtra.getBoard(b.request.page());
            a.type === d.binder.role.Viewer && (this.$scope.isViewer = !0), this.$scope.empty_todos = d.defaults.binder.thumbnail_empty_todo;
        },
        rendered: function() {
            var e = this;
            this.isDefaultSort = !0, this.list = new a.List({
                parent: this,
                renderTo: ".mx-binder-todos",
                collection: this.todos,
                template: f,
                sortable: !0,
                unifyLazyload: !1,
                syncModel: [ "is_completed", "is_marked", "due_date", "attachments", "name", "assignee_sequence", "assignee", "comments", "references" ],
                $scope: {
                    lang: c,
                    defaultUserAvatar: Moxtra.getMe().branding.getDefaultUserAvatar(),
                    blankImg: d.defaults.blankImg
                },
                onSortItem: $.proxy(e.onSortTodo, this)
            }), this.completedList = new a.List({
                parent: this,
                renderTo: ".mx-binder-todos-completed",
                collection: this.completedTodos,
                template: f,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: [ "is_completed", "is_marked", "due_date", "attachments", "name", "assignee_sequence", "assignee", "comments", "references" ],
                $scope: {
                    lang: c,
                    blankImg: d.defaults.blankImg
                },
                onAddItem: function() {}
            });
            var g = this.$(".mx-todos-completed-title");
            g.on("click", function() {
                var a = g.find("a i");
                $("#completedTodos").hasClass("in") ? a.removeClass("micon-arrow-down").addClass("micon-arrow-right") : a.removeClass("micon-arrow-right").addClass("micon-arrow-down");
            }), $("#todoInput").autosize(), this.$(".micon-sort").tooltip({
                placement: "right"
            }), "assigntome" === b.request.page() && $("#completedTodos").parent().hide(), this.detailContainer = $("#todoDetail"), 
            this.detailContainer.size() || (this.detailContainer = $('<div id="todoDetail"></div>'), 
            this.detailContainer.insertBefore(this.$el)), this.switchBoard(), this.listenTo(b.request, "change:params.seq", this.jumpToDetail);
        },
        onSubscribe: function() {},
        jumpToDetail: function() {
            var a = b.request.params();
            a.seq && this.viewTodoDetail(a.seq), this.stopListening(this.all);
        },
        update: function() {
            var a = b.request.page(), c = this;
            this.$el.removeClass("detail-action"), this.board && this.stopListening(this.board), 
            this.board = Moxtra.getBoard(a), this.switchBoard(), $(".mx-add-page-bar").hide(), 
            setTimeout(function() {
                c.$el.find('[autofocus="autofocus"]').focus();
                var a = b.request.params();
                a.seq && c.listenTo(c.all, "inited", c.jumpToDetail);
            }, 300);
        },
        closeTodo: function(a) {
            var b = this.all.get(a), c = this.handleEvent;
            c.stopPropagation(), b && b.updateCompleted(!0).success(function() {}).error(function() {});
        },
        reopenTodo: function(a) {
            var b = this.handleEvent;
            b.stopPropagation();
            var c = this.all.get(a);
            c && c.updateCompleted(!1).success(function() {});
        },
        markTodo: function(a) {
            var c = this.handleEvent;
            c && c.stopPropagation(), Moxtra.markTodo(b.request.page(), a);
        },
        unmarkTodo: function(a) {
            var b = this.handleEvent;
            b && b.stopPropagation();
            var c = this.todos.get(a);
            c && (c.set("is_marked", !1), c.update().success(function() {}));
        },
        getCurrentTodo: function() {
            return this.todoModel;
        },
        viewTodoDetail: function(a) {
            var b = this.all.get(a), c = $("#todo_" + a).closest("li");
            b && (this.todoDetail && this.todoDetail.destroy(), this.detailContainer.empty().removeClass("hide"), 
            this.todoDetail = new h({
                model: b,
                renderTo: this.detailContainer,
                parent: this
            }), this.recovery(this.todoDetail), this.todoModel = b, $(".mx-binder-todos li").removeClass("active"), 
            $(".mx-binder-todos-completed li").removeClass("active"), c.addClass("active"));
        },
        _createTodo: function(a, b) {
            var d = this;
            if (!b) {
                a.order_number = Number.POSITIVE_INFINITY;
                var e = Handlebars.compile(f), g = $(e(_.extend({}, a.toJSON(), {
                    lang: c
                })));
                g.attr("id", a.$id), this.list.$el.append(g);
            }
            var h = $("#" + a.$id);
            h.find(".mx-todo-item").removeAttr("data-action"), h.removeClass("create-fail"), 
            h.addClass("creating").find(".add-fail").addClass("hide"), h.find(".todo-loading").loading({
                length: 4,
                width: 2,
                line: 8,
                radius: 3
            }), setTimeout(function() {
                a.create().error(function() {
                    MX.ui.notifyError(c.create_todo_fail), h.removeClass("creating").addClass("create-fail"), 
                    h.find(".todo-loading").loading(!1).end().find(".add-fail").removeClass("hide"), 
                    h.find(".retry").removeClass("hide").one("click", function() {
                        $(this).addClass("hide"), d._createTodo(a, !0);
                    });
                }).success(function(a) {
                    if (MX.ui.notifySuccess(c.create_todo_success), h.remove(), d.todoDetail && !d.todoDetail.isClosed) {
                        var b = MX.get("object.board.todos.0.sequence", a);
                        b && d.viewTodoDetail(b);
                    }
                    d.scrollToBottom();
                });
            }, 100);
        },
        createTodo: function(a) {
            var c = $(a.target);
            if (a.keyCode === d.keys.Enter && !a.shiftKey) {
                a.preventDefault();
                var e = $.trim(c.val());
                if (e.length > 0) {
                    var f = Moxtra.createTodoModel(b.request.page());
                    f.set("name", e), f.set("created_time", Date.now()), f.set("sequence", f.client_uuid), 
                    this._createTodo(f), c.val(""), c.trigger("autosize.resize");
                }
            }
        },
        handleCompletedTodos: function() {
            this.completedTodos.length ? this.$(".mx-todos-completed-title").removeClass("hide") : this.$(".mx-todos-completed-title").addClass("hide"), 
            this._updateCompletedCount(this.completedTodos.length);
        },
        scrollToBottom: function() {
            var a = this;
            setTimeout(function() {
                var b = a.$el.find(".mx-todos-wrap"), c = a.$el.find(".mx-binder-todos")[0].clientHeight;
                b.scrollTop(c - 55);
            }, 500);
        },
        handleAllTodos: function() {
            this._updateAllCount(this.all.length);
        },
        todosSortFn: function(a, b) {
            if (a.order_number === b.order_number) return a.is_marked === b.is_marked ? a.sequence > b.sequence ? 1 : -1 : a.is_marked ? -1 : 1;
            var c = parseFloat(a.order_number) || Number.NEGATIVE_INFINITY, d = parseFloat(b.order_number) || Number.NEGATIVE_INFINITY;
            return c > d ? 1 : -1;
        },
        prioritySortFn: function(a, b) {
            return a.is_marked === b.is_marked ? a.sequence > b.sequence ? 1 : -1 : a.is_marked ? -1 : 1;
        },
        assigneeSortfn: function(a, b) {
            return a.assignee === b.assignee ? a.sequence > b.sequence ? 1 : -1 : (a = Moxtra.util.get("assignee.user.name", a) || Moxtra.util.get("assignee.group.name", a) || "", 
            b = Moxtra.util.get("assignee.user.name", b) || Moxtra.util.get("assignee.group.name", a) || "", 
            a && !b ? -1 : !a && b ? 1 : a.toLowerCase() > b.toLowerCase() ? 1 : -1);
        },
        dueDateSortFn: function(a, b) {
            return a.due_date === b.due_date ? a.sequence > b.sequence ? 1 : -1 : a.due_date > b.due_date ? 1 : -1;
        },
        alphaSortFn: function(a, b) {
            return a = a.name.trim().toLowerCase(), b = b.name.trim().toLowerCase(), a === b ? a.created_time === b.created_time ? a.sequence < b.sequence ? 1 : -1 : a.created_time < b.created_time ? 1 : -1 : a > b ? 1 : -1;
        },
        sortCompletedFn: function(a, b) {
            return a.updated_time < b.updated_time ? 1 : -1;
        },
        updateEmptyView: function() {
            var a = this, b = $(".mx-todo-empty"), c = $(".mx-todos-wrap"), d = !1;
            d = "assigntome" === a.binderid ? !a.todos.length : !a.todos.length && !a.completedTodos.length, 
            d ? (c.hide(), b.removeClass("hide")) : (c.show(), b.addClass("hide"));
        },
        switchBoard: function() {
            var a, d = b.request.page(), e = this;
            if (this.binderid = d, this._filterFn = null, this.all && (this.stopListening(this.all), 
            this.stopListening(this.todos), this.stopListening(this.completedTodos), this.todos.destroy(), 
            this.completedTodos.destroy()), "assigntome" === d) {
                var f = Moxtra.getTodoBinders();
                this.all = f.board.todos, this.$(".mx-action-bar").hide(), this.$(".J-filter").removeClass("input-group"), 
                this.$(".input-group-btn").hide();
            } else this.all = Moxtra.getBoardTodos(d), this.$(".mx-action-bar").show(), setTimeout(function() {
                $("#todoInput").trigger("autosize.resize");
            }, 0), this.$(".J-filter").addClass("input-group"), this.$(".input-group-btn").show();
            if ($("#todoFilter button span").text(c.all_todos), $("#searchTodo").val(""), this.$(".todo-filter .close").addClass("hide"), 
            this.$(".mx-todos-completed-title").addClass("hide"), this.$el.removeClass("detail-action"), 
            this.detailContainer.empty().addClass("hide"), this.all) {
                a = this.todos = this.all.clone({
                    filterFn: {
                        is_completed: !1,
                        is_deleted: !1
                    },
                    sortFn: this.todosSortFn
                }), this.completedTodos = this.all.clone({
                    filterFn: {
                        is_completed: !0,
                        is_deleted: !1
                    },
                    sortFn: this.sortCompletedFn
                }), this.listenTo(this.all, "inited", this.updateEmptyView), this.listenTo(this.all, "push", this.updateEmptyView), 
                this.listenTo(this.all, "modelChange", function(b) {
                    if (e.all.get(b)) {
                        var c = b.changed;
                        void 0 !== c.is_completed && (b.is_completed ? (e.todos.remove(b), e.completedTodos.push(b)) : (e.todos.push(b), 
                        e.completedTodos.remove(b))), void 0 !== c.is_marked && a.sort(), void 0 !== c.is_deleted && (e.todos.remove(b), 
                        e.completedTodos.remove(b)), e.updateEmptyView();
                    }
                });
                var g = this.$(".mx-todos-completed-title");
                this.completedTodos.length && g.removeClass("hide"), this.listenTo(this.completedTodos, "change", this.handleCompletedTodos), 
                this.listenTo(this.all, "change", this.handleAllTodos), this.list.binding(this.todos), 
                this.completedList.binding(this.completedTodos), this._updateCompletedCount(this.completedTodos.length), 
                this._updateAllCount(this.all.length);
            }
        },
        leave: function() {
            this.todoDetail && (this.todoDetail.closeDetail(), this.todoDetail = null, b.request.params({
                seq: ""
            }, !1));
        },
        _updateCompletedCount: function(a) {
            this.$(".completed-todos-count").html(a);
            var c = "assigntome" === b.request.page();
            a && !c ? $("#completedTodos").parent().show() : $("#completedTodos").parent().hide();
        },
        _updateAllCount: function(a) {
            $(".all-todos-count").html(a);
        },
        _reorderAll: function(a, c, d, e) {
            var f, g, h = 100, i = this;
            this.todos.each(function(b) {
                b.order_number !== a.order_number && (b.set("order_number", h.toString()), h += 100);
            }), c && (f = parseFloat(c.order_number)), d && (g = parseFloat(d.order_number)), 
            f = f || g - 100, g = g || f + 100, a.set("order_number", ((g + f) / 2).toString());
            var j = Moxtra.getBoard(b.request.page());
            j && (e && (i.todos.sort(i.todosSortFn), this.isDefaultSort = !0), j.updateChildren("todos"));
        },
        onSortTodo: function(a) {
            var b, c, d = a.prev(), e = a.next(), f = this.todos.get(a.attr("data-param"));
            d = this.todos.get(d.attr("data-param")), e = this.todos.get(e.attr("data-param")), 
            this.isDefaultSort ? (d && (b = parseFloat(d.order_number)), e && (c = parseFloat(e.order_number)), 
            b || c ? (b = b || c - 100, c = c || b + 100, f.set("order_number", ((c + b) / 2).toString()), 
            f.update()) : this._reorderAll(f, d, e)) : this._reorderAll(f, d, e, !0);
        },
        renderFilterMembers: function() {
            var a, c, d = $("#binderMembersList"), e = b.request.page();
            a = i.getAssignees(e, {
                memberAction: "filterTodos",
                teamAction: "filterTodos"
            }), a && a.length && this.recovery(a[0].collection), c = new k({
                tagName: "div",
                className: "",
                itemView: j,
                multiSections: !0,
                collection: a
            }).render(), d.empty().append(c.$el), this.recovery(c);
        },
        removeSearchKey: function() {
            this.list.sortable = !0, $("#searchTodo").val("").focus();
            var a = this.getFilterFn();
            this.$(".todo-filter .close").addClass("hide"), delete a.name, this._filterTodos(a);
        },
        searchTodo: function(a) {
            var b = this.getFilterFn(), c = $(a.currentTarget), d = c.val();
            d.length ? (d = d.toLowerCase(), b.name = function(a) {
                return a ? a.toLowerCase().indexOf(d) >= 0 : !1;
            }, this.$(".todo-filter .close").removeClass("hide"), this.list.sortable = !1) : (this.$(".todo-filter .close").addClass("hide"), 
            delete b.name, this.list.sortable = !0), this._filterTodos(b);
        },
        getFilterFn: function() {
            return this._filterFn ? this._filterFn : {
                is_completed: !1,
                is_deleted: !1
            };
        },
        _filterTodos: function(a, b) {
            b = b || this.todosSortFn, this._filterFn = a, this.todos.destroy();
            var c = this.all.clone({
                filterFn: a,
                sortFn: b
            });
            this.todos = c, this.list.binding(this.todos), this.recovery(c), a = _.extend({}, a, {
                is_completed: !0
            }), c = this.all.clone({
                filterFn: a,
                sortFn: this.sortCompletedFn
            }), this.completedTodos = c, this.completedList.binding(c), this._updateCompletedCount(c.length);
        },
        filterTodos: function(a) {
            var b = $(this.handleEvent.currentTarget), c = this.getFilterFn();
            this.list.sortable = !1, delete c["assignee.sequence"], "all" === a ? (this.list.sortable = !0, 
            delete c["assignee.user.id"]) : "my" === a ? c["assignee.user.id"] = Moxtra.model.Root.user.id : "unassigned" === a ? c["assignee.user.id"] = void 0 : "sequence" === b.data("primary") ? c["assignee.sequence"] = 1 * b.data("seq") : c["assignee.user.id"] = b.data("id"), 
            this._filterTodos(c), $("#todoFilter button span").text(b.text());
        },
        sortTodos: function(a) {
            this.isDefaultSort = !1;
            var b = this.prioritySortFn;
            switch (a) {
              case "assignee":
                b = this.assigneeSortfn;
                break;

              case "duedate":
                b = this.dueDateSortFn;
                break;

              case "alpha":
                b = this.alphaSortFn;
            }
            this._filterTodos(this.getFilterFn(), b);
        },
        hoverTodoInput: function() {
            $("#todoInput").focus();
        }
    });
}), define("text!template/binder/meet.html", [], function() {
    return '<div class="mx-binder-meet">\n	<div class="mx-binder-meet-actions">\n		<div class="binder-meet-enable">\n			<div class="row">\n	            <div class="col-md-12 col-xs-12">\n	                <div class="size20">{{lang.binder_meet_tab_description_title}}</div>\n	                <div class="marginTop5">{{lang.binder_meet_tab_description}}</div>\n	            </div>\n	        </div>\n	        <div class="row">\n	        	<div class="col-md-12 col-xs-12">\n	        		<hr />\n	        	</div>\n	        </div>\n	        <div class="row">\n	        	<div class="col-md-12 col-xs-12">\n	        		{{#if enableIntegration}}\n	        		<a class="mouse-hand action" data-action="postMeetNow"><i class="micon-start-meet size20"></i> {{lang.meet_now}}</a>\n	        		{{else}}\n		        		{{#if branding.showMeetNowButton}}\n		        		<a class="mouse-hand action" id="mxMeetNowInBinder"><i class="micon-start-meet size20"></i> {{lang.meet_now}}</a>\n		        		{{/if}}\n\n		        		{{#if branding.showScheduleButton}}\n		        		<a class="mouse-hand action" data-action="scheduleMeet"><i class="micon-schedule size20"></i> {{lang.schedule_meet}}</a>\n		        		{{/if}}\n	        		{{/if}}\n	        	</div>\n	        </div>\n        </div>\n        <div class="binder-meet-disable">\n        	<div class="row">\n        		<div class="col-md-12 col-xs-12">\n	                <div>{{lang.binder_meet_tab_viewer_tip}}</div>\n	            </div>\n        	</div>\n        </div>\n	</div>\n    <span class="moxtra-poweredby mxbrand-powered-by-moxtra active " ></span>\n\n</div>\n';
}), define("binder/meet", [ "moxtra", "app", "lang", "const", "text!template/binder/meet.html", "common/userCap", "meet/meet", "meet/meetUtil", "meet/management/scheduleForm", "admin/branding/helper" ], function(a, b, c, d, e, f, g, h, i, j) {
    "use strict";
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function(a) {
            a = a || {}, this.parent = a.parent;
            var d = {
                showMeetNowButton: j.isShowMeetNow(),
                showScheduleButton: j.isShowScheduleMeet()
            };
            this.$scope.lang = c, this.$scope.branding = d, this.$scope.enableIntegration = b.isIntegrationEnabled();
        },
        rendered: function() {},
        update: function() {
            this.updateMeetAction();
        },
        updateMeetAction: function() {
            var a = b.request.page(), c = Moxtra.getBoard(a);
            if (c) {
                var d = c.members.length, e = "#mymeet?action=start_with_contacts&binderid=" + a + "&index=" + parseInt(1e3 * Math.random(), 10), f = b.config.global.meetTabName, g = this.$("#mxMeetNowInBinder");
                if (!b.isIntegrationEnabled()) if (1 === d || c.isconversation && 2 === d) {
                    if (e = "#mymeet?action=start_with_contact", 2 === d) {
                        var h = "", i = Moxtra.getMe().id;
                        MX.each(c.members, function(a) {
                            a.user && a.user.id !== i && (h = a.user.email || "");
                        }), e += "&email=" + h, e += "&originalboardid=" + a;
                    }
                    g.attr("href", e).attr("target", f), g.removeAttr("data-action");
                } else b.isMacAgentAppstore() ? (e += "&select_user=true", e += "&originalboardid=" + a, 
                g.attr("href", e).attr("target", f), g.removeAttr("data-action")) : (g.attr("data-action", "startMeet"), 
                g.removeAttr("href"));
            }
        },
        leave: function() {},
        postMeetNow: function() {
            g.start({
                boardId: b.request.page()
            });
        },
        startMeet: function() {
            var a = b.request.page(), d = Moxtra.getBoardMembers(a), e = Moxtra.getMe().email, f = "", g = parseInt(1e3 * Math.random(), 10), i = [ {
                position: "left",
                text: c.unselect_all,
                click: "unselectAll"
            }, {
                position: "left",
                text: c.select_all,
                className: "hide",
                click: "selectAll"
            }, {
                position: "left",
                text: c.invite,
                click: "onSelectMore"
            } ];
            f = "#mymeet?action=start_with_contacts&binderid=" + a + "&index=" + g, i.push({
                position: "right",
                href: f,
                hrefTarget: b.config.global.meetTabName,
                text: c.start_meet,
                className: "btn-primary",
                click: "onSelectDone"
            });
            var j = new MX.ui.UserSelector({
                inputPanel: !1,
                teamsPanel: !1,
                contactsPanel: !1,
                groupsPanel: !1,
                defaultSelected: MX.filter(d, function(a) {
                    return a.user && a.user.email !== e || a.isGroup ? !0 : void 0;
                }),
                title: c.meet_invite_participants,
                selectUser: function() {
                    var a = this.$(this.handleEvent.target);
                    if ("checkbox" !== a.attr("type") || "selected" !== a.data("type") || "selectedUser" !== a.attr("name")) {
                        this.handleEvent.preventDefault(), this.handleEvent.stopPropagation();
                        var b = this.$(this.handleEvent.currentTarget), c = b.find(".mx-checkbox"), d = b.find(".mx-checkbox >i"), e = b.find(".mx-checkbox input");
                        d.removeAttr("class"), c.hasClass("mx-checked") ? (c.removeClass("mx-checked"), 
                        d.addClass("micon-circle-checkbox"), e.prop("checked", !1)) : (c.addClass("mx-checked"), 
                        d.addClass("micon-circle-checkmark"), e.prop("checked", !0));
                    }
                },
                value: function() {
                    var a = [];
                    return this.$('input[name="selectedUser"]:checked').each(function() {
                        var b = $(this).val();
                        if (b) if ($(this).data("team")) a.push({
                            group_id: b
                        }); else {
                            var c = $(this).data("email");
                            a.push(c ? {
                                email: c
                            } : {
                                id: b
                            });
                        }
                    }), a;
                },
                members: function() {
                    var a = this, b = [];
                    return this.$('input[name="selectedUser"]:checked').each(function() {
                        var c = a.selected.get($(this).val());
                        c && b.push(c);
                    }), b;
                },
                selectAll: function() {
                    this.$(".mx-checkbox").each(function() {
                        var a = $(this);
                        a.hasClass("mx-checked") || a.find("input").trigger("click");
                    }), this.dialog.$("#unselectAll").removeClass("hide"), this.dialog.$("#selectAll").addClass("hide");
                },
                unselectAll: function() {
                    this.$(".mx-checkbox").each(function() {
                        var a = $(this);
                        a.hasClass("mx-checked") && a.find("input").trigger("click");
                    }), this.dialog.$("#unselectAll").addClass("hide"), this.dialog.$("#selectAll").removeClass("hide");
                },
                buttons: i,
                onSelectMore: function() {
                    var a = this;
                    this.dialog.push(new MX.ui.UserSelector({
                        title: c.meet_invite_participants,
                        buttons: [ {
                            position: "left",
                            text: c.back,
                            click: function() {
                                this.pop();
                            }
                        }, {
                            id: "inviteMembers",
                            position: "right",
                            text: c.invite,
                            className: "btn-primary",
                            click: "onInvite",
                            disabled: !0
                        } ],
                        onInvite: function() {
                            var b = this.completeValues();
                            b.each(function(b) {
                                a.selected.push(b);
                            }), this.dialog.pop();
                        },
                        onChange: function() {
                            var a = this.dialog.getButton("inviteMembers");
                            a && (this.value().length > 0 ? a.removeClass("disabled") : a.addClass("disabled"));
                        }
                    }));
                },
                onSelectDone: function() {
                    var c = this.value() || [], d = {}, e = this, f = a + "_" + g + "_" + Moxtra.getMe().id;
                    d[f] = c, b.localStatus.set("mxMeetInvitees", d);
                    var i = [];
                    if (MX.each(c, function(a) {
                        i.push(a.group_id ? {
                            group: {
                                id: a.group_id
                            }
                        } : a.email ? {
                            email: a.email
                        } : {
                            id: a.id
                        });
                    }), h.showMeetFeed(a, i)) {
                        var j = {};
                        j[f] = a, b.localStatus.set("mxMeetOriginalId", j);
                    }
                    setTimeout(function() {
                        e.dialog.close();
                    }, 100);
                }
            });
            this.recovery(new MX.ui.Dialog({
                content: j
            }));
        },
        scheduleMeet: function() {
            var a = b.request.page(), c = new i({
                allowRecording: f.isAllowMeetRecording(),
                customizedOffset: Moxtra.getTimezoneOffset(),
                daysDiff: 0,
                originalBinderId: a,
                members: Moxtra.getBoardMembers(a)
            });
            new MX.ui.Dialog({
                content: c
            }), this.recovery(c);
        }
    });
}), define("text!template/binder/binderSettings.html", [], function() {
    return '<div class="settings-members">\n\n    <div class="btn-group btn-group-justified settings-tab" data-toggle="buttons">\n        <label class="btn active" data-action="switchSubView" data-param="members">\n            <input type="radio" name="options" >{{lang.members}}\n        </label>\n        <label class="btn " data-action="switchSubView" data-param="binder">\n            <input type="radio" name="options" >{{lang.settings}}\n        </label>\n        <!--{{#unless isConversation}}\n        	{{#if isEditor}}\n	        <label class="btn " data-action="switchSubView" data-param="share" >\n	            <input type="radio" name="options">{{lang.share}}\n	        </label>\n	        {{/if}}\n        {{/unless}}-->\n    </div>\n\n    <div class=" settings-subview">\n\n    </div>\n    <div class="actions">\n\n    </div>\n\n</div>\n';
}), define("text!template/binder/binderMembers.html", [], function() {
    return '<div>\n    {{#unless isViewer}}\n    <a href="javascript:;" class="icon-btn" class="add-members" style="margin-top:-10px;" data-action="addMemberInSettings">\n        <i class="micon-user-add size24"/>\n        <strong>{{lang.invite_member}}</strong>\n    </a>\n    {{/unless}}\n    <div class="mx-container mx-box  binder-members">\n\n    </div>\n\n\n</div>';
}), define("text!template/binder/binderMemberItem.html", [], function() {
    return '\n    <div id="{{sequence}}" class="mx-item mx-contacts-item row">\n        <div class="col-md-2 col-xs-2">\n            {{avatarView this}}\n        </div>\n        <div class="mx-user-info col-md-5 col-xs-5" >\n        	{{#if isGroup}}\n        	<div class="user-name marginTop15">{{group.name}} <em>{{subTitle}}</em></div>\n        	{{else}}\n        	<div class="user-name">{{#if user.name}}{{user.name}}{{else}}{{user.email}}{{/if}} <em>{{subTitle}}</em></div>\n        	<span class="user-email">{{user.email}}</span>\n        	{{/if}}\n        </div>\n        {{#if isOwner}}\n        <div class="col-md-5 top-p10 col-xs-5">\n            {{lang.binder_owner}}\n        </div>\n        {{else}}\n            {{#if isMe}}\n                <div class="col-md-5 col-xs-5 top-p10">\n                    {{#if isEditor}}\n                        {{lang.binder_editor}}\n                    {{else}}\n                        {{lang.binder_viewer}}\n                    {{/if}}\n                </div>\n            {{else}}\n                <div class="col-md-4 col-xs-4">\n\n                    <div class="btn-group btn-group-xs btn-group-justified settings-tab {{#unless mySelfCanEditor}}disabled{{/unless}}" data-toggle="buttons" data-action="setBinderMemberRole" data-param="{{sequence}}">\n                        <label class="btn {{#if isEditor}}active {{/if}} {{canBeEdit}}"  >\n                            <input type="radio" name="userRole" value="{{role.Editor }}" {{#if isEditor}}checked=true {{/if}}> {{lang.binder_editor}}\n                        </label>\n                        <label class="btn {{#unless isEditor}}active{{/unless}} {{#unless mySelfCanEditor}}disabled{{/unless}}"  >\n                            <input type="radio" name="userRole" value="{{role.Viewer}}" {{#unless isEditor}}checked=true {{/unless}}> {{lang.binder_viewer}}\n                        </label>\n                    </div>\n\n                </div>\n                <div class="col-md-1 col-xs-1 top-p10">\n                    {{#if mySelfCanEditor}}\n                    <a class="micon-trash blue  {{canBeEdit}}" data-action="removeMemberFormBinder" data-param="{{sequence}}"  href="javascript:;" title="{{lang.remove}}"></a>\n                    {{/if}}\n                </div>\n            {{/if}}\n        {{/if}}\n    </div>\n';
}), define("binder/binderMembers", [ "moxtra", "lang", "app", "text!template/binder/binderMembers.html", "text!template/binder/binderMemberItem.html", "component/selector/userSelector", "binder/binderBiz", "const" ], function(a, b, c, d, e, f, g, h) {
    "use strict";
    var i = MX.logger("binderMembers");
    return e = Handlebars.compile(e), a.Controller.extend({
        template: d,
        title: b.binder_options,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, _.extend(this, a);
            var c = this.model.getMyBoardUserInfo();
            this.mySelfCanEditor = !1, this.mySelfBoardOwner = c.isOwner, (c.isEditor || c.isOwner) && c.isMember ? this.mySelfCanEditor = !0 : this.$scope.isViewer = !0;
        },
        rendered: function() {
            this.collection = Moxtra.getBoardMembers(this.binderId, function(a) {
                return !a.is_deleted;
            }, function(a, b) {
                var c = "", d = "", e = function(a) {
                    if (a.isGroup) {
                        if (a.group) return (a.group.name || "").toLowerCase();
                    } else if (a.user) return (a.user.displayName || "").toLowerCase();
                    return "";
                };
                return a.isOwner ? -1 : b.isOwner ? 1 : a.user && Moxtra.getMe().id === a.user.id ? -1 : b.user && Moxtra.getMe().id === b.user.id ? 1 : (c = e(a), 
                d = e(b), d > c ? -1 : c > d ? 1 : 0);
            }), this.collection.creator = "binderMember", this.listenTo(this.collection, "inited", this.updateAll), 
            this.listenTo(this.collection, "add", function(a) {
                this.addMemberToView(a);
            }), this.listenTo(this.collection, "remove", this.removeMemberFormView), this.recovery(this.collection);
        },
        updateAll: function() {
            this.$(".binder-members").empty();
            var a = this.collection, b = this;
            a.each(function(a) {
                b.addMemberToView(a);
            });
        },
        removeMemberFormView: function(a) {
            this.$("#" + a.sequence).remove();
        },
        addMemberToView: function(a, c) {
            var d = this.$(".binder-members"), f = a;
            f.role = h.binder.role, f.lang = b, f.user && Moxtra.getMe().primaryKey === f.user.primaryKey ? (f.subTitle = b.me_with_parentheses, 
            f.iCannotEditorClass = "disabled", f.isMe = !0) : MX.equal(f.status, [ Moxtra.const.BOARD_INVITED ]) ? (f.subTitle = b.pending_with_parentheses, 
            f.isPending = !0) : (f.subTitle = "", f.isPending = !1), f.mySelfCanEditor = this.mySelfCanEditor, 
            f.mySelfBoardOwner = this.mySelfBoardOwner, c ? c.replaceWith($(e(f))) : (d.append(e(f)), 
            this.listenTo(a, "change", this.updateMember));
        },
        updateMember: function(a) {
            var b = this.$("#" + a.sequence);
            this.addMemberToView(a, b);
        },
        addMemberInSettings: function() {
            if (c.isIntegrationEnabled()) {
                c.sendMessage({
                    action: "invite",
                    binder_id: this.model.id,
                    session_key: null,
                    session_id: Moxtra.getMe().sessionId
                });
                var a = c.integration.get("extension");
                if (!a) return;
                var b = JSON.parse(a);
                if (!b.show_dialogs || !b.show_dialogs.member_invite) return;
            }
            var d = 2 === this.collection.length && this.model.isconversation;
            this.addMemberToBinder(d);
        },
        _getNewBinderMembers: function(a) {
            var b = this, c = [], d = Moxtra.getMe().id, e = function(b) {
                return a.some(function(a) {
                    return a && a.email === b;
                });
            };
            return b.collection.each(function(a) {
                a.user.id === d || e(a.user.email) || c.push({
                    type: a.type,
                    email: a.user.email
                });
            }), a.concat(c);
        },
        transformChat: function() {
            var a = this, d = new Moxtra.model.Board();
            d.set("name", ""), d.set("isconversation", !0), d.create().success(function(d) {
                var e = d.object.board.id;
                a.addUsers = a._getNewBinderMembers(a.addUsers), i.debug(a.addUsers), g.inviteMembers(e, a.addUsers).success(function() {
                    a.addUsers = [];
                }).error(function() {
                    MX.ui.notifyError(b.invite_user_failed);
                }), c.request.navigate("timeline", e);
            }).error(function(a) {
                MX.ui.notifyError(a && a.xhr && 413 === a.xhr.status ? b.common_msg_reach_limit_binders : b.create_binder_failed);
            }), a.dialog.pop();
        },
        addMemberToBinder: function(a) {
            var d = this;
            this.dialog.push(new MX.ui.UserSelector({
                title: b.invite_member,
                needMessage: !0,
                buttons: [ {
                    position: "left",
                    text: b.back,
                    click: function() {
                        this.pop();
                    }
                }, {
                    position: "right",
                    text: b.invite,
                    className: "btn-primary",
                    click: "onSelectDone",
                    id: "inviteUser"
                } ],
                onSelectDone: function() {
                    d.addUsers = [];
                    var e, f, g, i, j = this.value(), k = Moxtra.getBoard(d.model.id), l = this.invitationMessage();
                    return j.length ? 1 === j.length && a && (e = j[0], f = e.toJSON(), k.members.get(f.primaryKey)) ? void d.dialog.pop() : (j.each(function(a) {
                        f = a.toJSON(), d.addUsers.push(MX.isUndefined(f.isTeam) ? {
                            type: h.binder.role.Editor,
                            email: f.email
                        } : {
                            type: h.binder.role.Editor,
                            group_id: f.id
                        });
                    }), g = function(a) {
                        a.inviteUsers(d.addUsers, null, l).success(function() {
                            MX.ui.notifySuccess(b.member_invited), d.addUsers = [], d.dialog.progress(!1);
                        }).error(function(a) {
                            MX.ui.notifyError(409 === a.status ? d.addUsers.length > 1 ? b.invite_binder_members_conflict : b.invite_binder_member_conflict : b.invite_user_failed);
                        });
                    }, void (a ? (i = new Moxtra.model.Board(), i.create().success(function() {
                        MX.each(k.members, function(a) {
                            a.user && a.user.primaryKey !== Moxtra.getMe().primaryKey && (a.user.email ? d.addUsers.push({
                                type: h.binder.role.Editor,
                                email: a.user.email
                            }) : a.user.id && d.addUsers.push({
                                type: h.binder.role.Editor,
                                id: a.user.id
                            }));
                        }), g(i), c.navigate("/timeline/" + i.id, !0), d.dialog.close();
                    }).error(function() {
                        MX.ui.notifyError(b.create_binder_failed);
                    })) : (k.is_conversation && 1 === k.members.length ? (k.set("isconversation", !1), 
                    k.update().success(function() {
                        g(k);
                    }).error(function() {
                        MX.ui.notifyError(b.invite_user_failed);
                    })) : g(k), d.dialog.pop()))) : void d.dialog.pop();
                }
            }));
        },
        removeMemberFormBinder: function(a) {
            var d, e, f = this.collection.get(a), h = this;
            if (f) {
                var i = h.model.id;
                f.user && f.user.id === Moxtra.getMe().id ? MX.ui.Confirm(h.isConversation ? b.confirm_leave_chat : b.confirm_leave_binder, function() {
                    h.dialog.progress(), g.leaveBinder(i).success(function() {
                        MX.ui.notifySuccess(h.isConversation ? b.leave_chat_success : b.leave_binder_success), 
                        h.dialog.progress(!1), h.dialog.close(), c.sendMessage({
                            action: "leave_binder",
                            binder_id: i,
                            session_id: Moxtra.getMe().sessionId
                        });
                    }).error(function() {
                        MX.ui.notifyError(h.isConversation ? b.leave_chat_failed : b.leave_binder_failed), 
                        h.dialog.progress(!1);
                    });
                }) : (d = f.user && f.user.email, e = f.user && f.user.name || f.group && f.group.name || "", 
                MX.ui.Confirm(MX.format(b.confirm_remove_user, e), function() {
                    g.removeMember(h.binderId, d, f.sequence).success(function() {
                        h.collection.remove(f), c.sendMessage({
                            action: "remove_binder_user",
                            binder_id: i,
                            id: f.user.id,
                            user_id: f.user.id,
                            email: f.user.email,
                            unique_id: f.user.unique_id,
                            session_id: Moxtra.getMe().sessionId
                        });
                    }).error(function() {
                        MX.ui.notifyError(MX.format(b.remove_username_failed, e));
                    });
                }));
            }
        },
        setBinderMemberRole: function(a) {
            var c, d = this.handleEvent, e = $(d.currentTarget).find('input[name="userRole"]'), f = this;
            setTimeout(function() {
                e.each(function(a, b) {
                    b = $(b), b.prop("checked") && (c = b.val());
                });
                var d = f.collection.get(a);
                i.debug("setrole", c, a), g.setMemberRole(f.binderId, d.sequence, c).error(function() {
                    var a = d.user && d.user.displayName || d.group && d.group.name;
                    f.recovery(new MX.ui.Notify({
                        type: "error",
                        content: MX.format(b.change_user_role_failed, MX.escapeHTML(a))
                    }));
                }).success(function() {
                    f.recovery(new MX.ui.Notify({
                        type: "success",
                        content: b.change_user_role_success
                    }));
                });
            }, 10);
        }
    });
}), define("text!template/binder/binderSetting.html", [], function() {
    return '<div>\n    <form role="form" class="form-horizontal " style="margin-left: 70px; margin-right:40px;">\n		{{#if showBinderName}}\n		    {{#if isOwner}}\n	        <div class="mx-form-sm-label">{{lang.name}}</div>\n	        <div class="col-sm-11 ">\n	                <div class="form-group">  <input type="text" value="{{name}}" name="name" data-error-style="inline"  class="form-control " id="topic"\n	                   placeholder="{{lang.please_enter_binder_name}}" {{#if isViewer}}readonly{{/if}}>\n	                </div>\n	        </div>\n	        <div class="form-group">\n\n	            <div class="col-sm-11   ">\n	                <div class="mx-form-sm-label">{{lang.cover_image}}</div>\n	                <div class="form-control form-control-cover">\n	                    <div class="pull-right" style="position: relative;">\n	                        <a id="removeCoverAction" class="btn btn-default btn-sm {{#unless thumbnail_source_resource}}hide{{/unless}}" data-action="removeCover">{{lang.remove}}</a>\n\n	                        <a class="btn btn-default btn-sm {{#unless isEditor}}disabled{{/unless}}" data-toggle="dropdown" data-action="refreshUploader">\n				                {{lang.change}}\n				                <span class="caret"></span>\n				            </a>\n				            <ul class="dropdown-menu" role="menu">\n				                <li>\n				                    <a class="mouse-hand" id="bindercover_flash">\n				                        <span>{{lang.settings_upload_photo}}</span>\n				                    </a>\n				                </li>\n				                <li>\n				                    <a class="mouse-hand" data-action="chooseCover">\n				                        <span>{{lang.choose_photo}}</span>\n				                    </a>\n				                </li>\n				            </ul>\n\n	                    </div>\n	                    <div class="mx-cover-wrap mx-cover-sm">\n	                        <span class="mx-cover-img ">\n	                        <img id="binderThumbnail" src="{{thumbnail_small}}" style="margin-left: 0;"/>\n	                       </span>\n	                </div>\n	            </div>\n	            </div>\n	        </div>\n		    {{/if}}\n		{{/if}}\n\n        {{#unless isConversation}}\n        	{{#if isMember}}\n	        <div class="form-group">\n                <div class="col-sm-11 mx-form-sm-label">{{lang.category}}</div>\n	            <div class="col-sm-11 ">\n	                <button type="button" class="form-control " value="{{categoryName}}" data-action="updateCategory"  id="category" placeholder="{{lang.category}}">\n	                    <span class="col-sm-11">{{categoryName}}</span>\n	                    <span class="col-sm-1">\n	                   <span class="micon-arrow-right category-arrow size16 pull-right"></span></span>\n	                    </button>\n	            </div>\n	        </div>\n	        {{else}}\n	        {{!-- keep this, otherwise js error --}}\n	        <input type="hidden" value="{{categoryName}}" />\n        	{{/if}}\n        {{/unless}}\n\n        {{#if showWebhook}}\n        	{{#when totalIntegrations \'==\' 0}}\n        	<div class="form-group">\n        		<div class="col-sm-11">\n        			<a class="mouse-hand btn btn-link" data-action="addServiceIntegration" data-param="{{id}}">{{lang.add_a_service_integrations}}</a>\n        		</div>\n        	</div>\n        	{{/when}}\n	        {{#when totalIntegrations \'>\' 0}}\n	        <div class="form-group">\n				<div class="col-sm-11 ">\n					<button type="button" class="form-control" data-action="manageService">\n						<span class="pull-left">{{lang.integrations}} ({{totalIntegrations}})</span>\n						<span class="micon-arrow-right size16 pull-right"></span>\n					</button>\n				</div>\n			</div>\n			{{/when}}\n		{{/if}}\n\n        {{#if isMember}}\n            {{#if showBinderEmailAddress}}\n	        <div class="form-group">\n	            <div class="col-sm-12">\n	                <strong>{{lang.binder_email_address}}</strong>\n	                <button type="button" id="binderEmailTooltip" class="micon-help-with-circle mouse-hand size14 marginLeft5" data-toggle="tooltip" data-placement="top" title="{{lang.binder_email_help}}"></button>\n	            </div>\n	        	<div class="col-sm-11">\n	        		<a id="copyBinderEmail" class="pull-left binderEmail ellipsis-2line mouse-hand btn-link" style="padding-left: 0;">{{binderEmail}}</a>\n	        	</div>\n	        </div>\n            {{/if}}\n	        <div class="form-group">\n	            <div class="col-sm-11   ">\n	                <label for="notification"  class="control-label">{{lang.push_notification}}</label>\n	                <div class="col-sm-5 pull-right paddingTop5" style="padding-right: 0">\n	                    <div id="notification" class="btn-group btn-group-xs btn-group-justified settings-tab {{canBeEdit}}" data-toggle="buttons" data-action="updateNotification" data-param="{{userid}}">\n	                        <label class="btn {{#unless notificationOff}}active {{/unless}} "  >\n	                            <input type="radio"  value="0" {{#unless notificationOff}}checked=true {{/unless}}> {{lang.on}}\n	                        </label>\n	                        <label class="btn {{#if notificationOff}}active{{/if}} {{canBeEdit}}"  >\n	                            <input type="radio"  value="1" {{#if notificationOff}}checked=true {{/if}}> {{lang.off}}\n	                        </label>\n	                    </div>\n	                </div>\n	            </div>\n	            <div class="col-sm-11   ">\n	                <label for="silentMessage"  class="control-label">{{lang.silent_message}}</label>\n	                <div class="col-sm-5 pull-right paddingTop5" style="padding-right: 0">\n	                    <div id="silentMessage" class="btn-group btn-group-xs btn-group-justified settings-tab {{canBeEdit}}" data-toggle="buttons" data-action="toggleNotification" data-param="{{userid}}">\n	                        <label class="btn {{#if isSilentMessageOn}}active {{/if}} "  >\n	                            <input type="radio"  value="1" {{#if isSilentMessageOn}}checked=true {{/if}}> {{lang.on}}\n	                        </label>\n	                        <label class="btn {{#unless isSilentMessageOn}}active{{/unless}} {{canBeEdit}}"  >\n	                            <input type="radio"  value="0" {{#unless isSilentMessageOn}}checked=true {{/unless}}> {{lang.off}}\n	                        </label>\n	                    </div>\n	                </div>\n	            </div>\n	        </div>\n	    {{/if}}\n\n        <div class="form-group marginTopNeg15 marginBottomNeg15">\n            <ul class="col-sm-11   ">\n                {{#unless isConversation}}\n	                {{!-- v2.9.0, merge it to member list\n	                {{#if hasGroup}}\n	                	{{#if inBusinessLibrary}}\n	                		{{#if canRemove}}\n	                		<li id="bizlibAction" class="bottom-line">\n	                        	<a type="button" id="btnBLRemove" data-action="removeFromBusinessLibrary"  class="btn btn-link">{{lang.remove_from_library}}</a>\n		                    </li>\n		                    {{/if}}\n	                	{{else}}\n		                	{{#if isOwner}}\n		                	<li id="bizlibAction" class="bottom-line">\n	                        	<a type="button" id="btnBLAdd" data-action="addToBusinessLibrary"  class="btn btn-link">{{lang.add_to_library}}</a>\n	                        </li>\n		                    {{/if}}\n	                	{{/if}}\n	                {{/if}}\n	                --}}\n\n	                {{#if hasPages}}\n	                <li class="bottom-line">\n	                	<a type="button" data-action="downloadThisBinder" data-loading-text="{{lang.download_started}}" class="btn btn-link">{{lang.download_binder}}</a>\n	                </li>\n	                {{/if}}\n	                <li {{#if isIndividualMember}}class="bottom-line"{{/if}}>\n	                <a type="button" data-action="duplicateThisBinder" class="btn btn-link">{{lang.duplicate_binder}}</a>\n	                </li>\n                {{/unless}}\n\n                {{#if isIndividualMember}}\n	                {{#if isOwner}}\n	                <li >\n	                    <a type="button" data-action="deleteThisBinder" class=" btn btn-link">\n	                        {{#if isConversation}}\n	                            {{lang.delete_chat}}\n	                        {{else}}\n	                            {{lang.delete_binder}}\n	                        {{/if}}\n	                    </a>\n	                </li>\n	                {{else}}\n		                <li >\n		                 <a type="button" data-action="leaveThisBinder" class="btn btn-link">\n		                     {{#if isConversation}}\n		                     {{lang.leave_chat}}\n		                     {{else}}\n		                     {{lang.leave_binder}}\n		                     {{/if}}</a>\n		                </li>\n	                {{/if}}\n                {{/if}}\n            </ul>\n        </div>\n    </form>\n    <div >\n\n\n    </div>\n</div>\n';
}), define("text!template/binder/binderServices.html", [], function() {
    return '<div>\n	<div class="binder-services">\n		\n	</div>\n	<div class="binder-service-new">\n		<a class="mouse-hand" data-action="addServiceIntegration" data-param="{{binderId}}" style="text-decoration: none;">{{lang.add_a_service_integrations}}</a>\n	</div>\n</div>';
}), define("text!template/binder/binderServiceItem.html", [], function() {
    return '<li>\n	<div>\n		<div class="pull-left">\n			<img src="{{customize_icon}}" class="service-logo pull-left" />\n			<div class="service-name">\n				<div class="size14">{{formatPostAsFrom post_as actor_file_name customize_name}}</div>\n				<div class="size12">{{formatCreatedByOnDate actor.user.displayName created_time}}</div>\n				{{#if description}}\n				<div class="size12">{{description}}</div>\n				{{/if}}\n			</div>\n		</div>\n		<div class="pull-right">\n			{{#if isEditor}}\n			<a class="mouse-hand pull-right remove" data-action="removeIntegration" data-param="{{sequence}}">\n				<i class="micon-trash size20"></i>\n			</a>\n			{{/if}}\n		</div>\n	</div>\n</li>';
}), define("binder/binderServices", [ "moxtra", "lang", "app", "text!template/binder/binderServices.html", "text!template/binder/binderServiceItem.html" ], function(a, b, c, d, e) {
    "use strict";
    return a.Controller.extend({
        title: b.integrations,
        buttons: [ {
            position: "left",
            text: b.cancel,
            className: "btn-defalut",
            click: function() {
                this.pop();
            }
        } ],
        template: d,
        handleAction: !0,
        init: function(a) {
            this.userBoard = a.userBoard, this.services = this.userBoard.board.serviceTokens, 
            this.$scope.lang = b, this.$scope.isEditor = this.userBoard.isEditor, this.$scope.binderId = this.userBoard.board.id, 
            this.$scope.services = this.services;
        },
        rendered: function() {
            this.integrations = this.userBoard.board.view_tokens.clone({
                sortFn: function(a, b) {
                    return a.created_time - b.created_time > 0 ? -1 : 1;
                },
                filterFn: function(a) {
                    return a.actor_file_as ? a.actor_file_as.type === Moxtra.const.USER_TYPE_SERVICE : !1;
                }
            });
            var c = this;
            setTimeout(function() {
                c.list = new a.List({
                    renderTo: ".binder-services",
                    collection: c.integrations,
                    template: e,
                    sortable: !1,
                    unifyLazyload: !1,
                    $scope: {
                        lang: b,
                        isEditor: c.userBoard.isEditor
                    }
                }), c.list.binding(c.integrations);
            }, 300);
        },
        addServiceIntegration: function(a) {
            this.dialog && this.dialog.close(), setTimeout(function() {
                c.request.navigate("integrations?binderid=" + a, null, null, null);
            }, 300);
        },
        removeIntegration: function(a) {
            this.handleEvent.preventDefault(), this.handleEvent.stopPropagation();
            var c = this;
            MX.ui.Confirm(b.delete_service_integration_confirm, function() {
                var d = c.userBoard.board.view_tokens.get(a);
                [ "salesforce", "quickbooks" ].indexOf(d.actor_file_name) > -1 ? Moxtra.removeIntegrationTrigger(d.token, MX.get("actor.user.id", d)).success(function() {
                    d.remove().success(function() {
                        MX.ui.notifySuccess(b.delete_service_integration_success);
                    }).error(function() {
                        MX.ui.notifyError(b.delete_service_integration_failed);
                    });
                }).error(function() {
                    MX.ui.notifyError(b.delete_service_integration_failed);
                }) : d.remove().success(function() {
                    MX.ui.notifySuccess(b.delete_service_integration_success);
                }).error(function() {
                    MX.ui.notifyError(b.delete_service_integration_failed);
                });
            });
        }
    });
}), define("binder/binderSetting", [ "moxtra", "lang", "app", "binder/binderBiz", "text!template/binder/binderSetting.html", "component/selector/categorySelector", "component/dialog/inputDialog", "component/uploader/uploader", "binder/binderActions", "binder/binderServices", "admin/branding/helper", "const", "zeroclipboard" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    "use strict";
    var n = (MX.logger("binderSetting"), MX.Model.extend({
        defaults: {
            newName: ""
        },
        validation: {
            newName: [ {
                required: !0,
                msg: b.please_enter_binder_name
            } ]
        }
    }));
    return a.Controller.extend({
        template: e,
        title: b.binder_options,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, _.extend(this, a);
            var e = Moxtra.getMe(), f = this.model.getMyBoardUserInfo(), g = this.model.getIndividualInfo(), h = Moxtra.getUserBoard(this.model.id);
            this.$scope.isFirstPage = this.model.thumbnail && !this.model.thumbnail_source_resource, 
            this.$scope.hasPages = this.model.pages && this.model.pages.length > 0, h && (this.$scope.categoryName = this.getCategoryName(e, h.category)), 
            this.$scope.isMember = f.isMember, this.$scope.isOwner = this.isOwner = f.isOwner, 
            this.$scope.isEditor = f.isEditor, this.$scope.showBinderEmailAddress = k.isShowBinderEmailAddress(), 
            this.$scope.showBinderName = k.isShowBinderName();
            var i = this.model.owner.email.replace("@", "_"), j = this.model.email_address, l = "";
            l = j ? j : MX.format("{0}_{1}", i, this.model.id), l += c.config.global.mx_production || location.host.toLowerCase().indexOf("moxtra.com") > 0 ? "@moxtra.me" : "@grouphour.com", 
            this.$scope.binderEmail = l, this.isConversation = this.model.isconversation, this.$scope.isConversation = this.isConversation, 
            this.biz = d, this.currentBinderName = this.model.name, c.isIntegrationEnabled() || f.isMember && f.isEditor && (this.$scope.showWebhook = !0), 
            this.$scope.isIndividualMember = g.isMember;
            var m = this.model.getMyBoardUserInfo();
            this.$scope.notificationOff = g.isNotificationOff || m.is_notification_off || !1;
            var n = MX.filter(this.model.users, function(a) {
                return a.group || a.is_deleted ? !1 : !0;
            });
            n && 2 === n.length && this.isConversation && (this.$scope.showBinderName = !1);
        },
        getCategoryName: function(a, c) {
            var d = b.default_category;
            return a.categories.each(function(a) {
                a.sequence === c && (d = a.name);
            }), d;
        },
        rendered: function() {
            var e = this;
            if (this.form = new a.Form({
                parent: this,
                form: this.$("form"),
                model: this.model,
                submit: this.updateBinderName,
                scope: this
            }), e.nameChanged = !1, this.model.on("change:name", function() {
                e.nameChanged = !0;
            }), this.$("#topic").on("blur", function() {
                e.updateBinderName();
            }), this.listenTo(this.model, "change:thumbnail", function() {
                e.model.isconversation && (e.model.set("isconversation", !1), e.model.update()), 
                e.$("#binderThumbnail").attr("src", e.model.thumbnail_small);
            }), this.isOwner && (h.register("binderCover", {
                browse_button: "bindercover_flash",
                filters: {
                    mime_types: [ {
                        title: b.image_files,
                        extensions: "jpeg,jpg,gif,png"
                    } ]
                },
                showNotification: !0,
                multi_selection: !1,
                url: function() {
                    var a = e.model.id;
                    return "/board/upload?type=cover&id=" + a + (d.isSilentMessageOn(a) ? "&pnoff=1" : "");
                },
                success: function(a, b) {
                    var c = JSON.parse(b.response);
                    c && c.object && c.object.board && (c = e.model.parse(c.object.board), e.$(".mx-cover-img img").attr("src", c.thumbnail_small), 
                    e.$("#removeCoverAction").removeClass("hide")), h.refresh("binderCover", e.$("#bindercover_flash"));
                },
                error: function() {
                    h.refresh("binderCover", e.$("#bindercover_flash"));
                }
            }), MX.env.isIE && $(document).off("focusin.bs.modal"), this.on("show", function() {
                h.refresh("binderCover", e.$("#bindercover_flash"));
            }), this.on("hide", function() {
                h.hide("binderCover");
            }), this.dialog.$el.on("hidden.bs.modal", function() {
                h.hide("binderCover");
            })), this.$("#binderEmailTooltip").tooltip(), c.isMacAgentAppstore() || c.isMacAgentLocal()) {
                var f = this.$el.find(".binderEmail").text();
                this.$("#copyBinderEmail").on("click", function() {
                    c.sendMessage({
                        action: "request_copy_text",
                        text: f,
                        session_id: Moxtra.getMe().sessionId
                    }), setTimeout(function() {
                        MX.ui.notifySuccess(b.email_copied_to_clipboard);
                    }, 300);
                });
            } else if (!c.isIntegrationAgent() || navigator.userAgent.indexOf(l.flags.windowsAgent) > 0) try {
                m.config({
                    swfPath: "lib/zeroclipboard/dist/ZeroClipboard.a573941f.swf"
                });
                var g = new m($(".binderEmail"));
                g.setText(this.$el.find(".binderEmail").text()), g.on("ready", function(a) {
                    a.client.setText(e.$el.find(".binderEmail").text()), a.client.on("aftercopy", function() {
                        MX.ui.notifySuccess(b.email_copied_to_clipboard);
                    });
                }), this.recovery(function() {
                    try {
                        m.destroy();
                    } catch (a) {}
                });
            } catch (i) {
                console.error(i);
            }
        },
        refreshUploader: function() {
            setTimeout(function() {
                h.refresh("binderCover", $("#bindercover_flash"));
            }, 100);
        },
        chooseCover: function() {
            var a, c = this;
            a = new MX.ui.BinderSelector({
                showCheckbox: !1,
                title: b.choose_cover_image,
                filter: "all",
                buttons: [ {
                    text: b.back,
                    position: "left",
                    click: function() {
                        this.pop();
                    }
                } ],
                onSelect: function() {
                    var a = this.value()[0], d = this.handleEvent;
                    if (d) {
                        var e = $(d.currentTarget), f = this.getFormElements(e), g = f.prop("checked");
                        "INPUT" !== d.target.tagName && (g = !g, f.prop("checked", g).trigger("change"));
                    }
                    this.dialog.push(new MX.ui.FileSelector({
                        title: b.choose,
                        boardId: a,
                        allowSelectPage: !0,
                        multiple: !1,
                        style: "form",
                        buttons: [ {
                            text: b.back,
                            position: "left",
                            click: function() {
                                this.pop();
                            }
                        }, {
                            text: b.choose,
                            position: "right",
                            className: "btn-primary",
                            click: "choosePageAsCover"
                        } ],
                        choosePageAsCover: function() {
                            var a, b = this.value(), d = this;
                            b && (a = b[0], a && (c.$("#binderThumbnail").attr("src", a.thumbnail), c.$("#removeCoverAction").removeClass("hide"), 
                            c.model.choosePageAsCover(a.thumbnail))), this.dialog.pop(), setTimeout(function() {
                                d.dialog.pop();
                            }, 1);
                        }
                    }));
                }
            }), c.dialog.push({
                content: a
            });
        },
        removeCover: function() {
            var a = this;
            MX.ui.Confirm(b.confirm_remove_cover, function() {
                a.model.set("thumbnail_source_resource", 0), a.model.update(), a.$("#binderThumbnail").attr("src", Moxtra.getMe().branding.getDefaultCover() || Moxtra.config.defaults.binder_cover), 
                a.$("#removeCoverAction").addClass("hide");
            });
        },
        updateBinderName: function() {
            var a = this, d = this.model.toJSON(), e = d.name.trim();
            this.isConversation && (e = this.dialog.$("#topic").val().trim()), e.length && e !== this.currentBinderName ? (this.isConversation && (this.model.name = e, 
            this.model.localChanged = {
                name: e
            }), this.dialog.progress(), this.model.update().success(function() {
                $("#binderDetailTab .binder-name").text(e), a.dialog.$("h4.modal-title").text(e), 
                a.dialog.progress(!1), a.currentBinderName = e, MX.ui.notifySuccess(b.update_binder_name_success), 
                a.isConversation && (c.request.page(d.boardId), a.dialog.close());
            }).error(function() {
                a.dialog.progress(!1), MX.ui.notifyError(b.update_binder_name_failed);
            })) : e.length || (this.model.name = this.currentBinderName, $("#binderDetailTab .binder-name").text(this.currentBinderName), 
            this.dialog.$("#topic").val(this.currentBinderName));
        },
        updateCategory: function() {
            var a = this;
            this.dialog.push(new f({
                buttons: [ {
                    position: "left",
                    text: b.back,
                    className: "btn-primary",
                    click: function() {
                        this.pop();
                    }
                } ],
                onSelect: function(b) {
                    var c = a.model.get("category");
                    c !== b.sequence && a.commitUpdateCategory(b), a.dialog.pop();
                }
            }));
        },
        manageService: function() {
            var a = Moxtra.getUserBoard(this.model.id);
            this.dialog.push(new j({
                userBoard: a
            }));
        },
        addServiceIntegration: function(a) {
            this.dialog && this.dialog.close(), setTimeout(function() {
                c.request.navigate("integrations?binderid=" + a, null, null, null);
            }, 300);
        },
        commitUpdateCategory: function(a) {
            var c = this, e = Moxtra.getUserBoard(this.model.id);
            c.dialog.progress(), d.assignCategoryToBinder(e.sequence, a.sequence).success(function() {
                c.$("#category .col-sm-11").text(a.name), MX.ui.notifySuccess(b.update_category_success), 
                c.dialog.progress(!1);
            }).error(function() {
                MX.ui.notifyError(b.update_category_failed), c.dialog.progress(!1);
            });
        },
        updateNotification: function() {
            var a = this;
            setTimeout(function() {
                var c = "1" === a.$("#notification .active input").val() ? !0 : !1, d = a.model.getIndividualInfo(), e = function() {
                    a.dialog.progress(!1), a.model.set("isNotificationOff", c), MX.ui.notifySuccess(c ? b.notification_off : b.notification_on);
                }, f = function() {
                    a.dialog.progress(!1), MX.ui.notifyError(b.update_notification_failed);
                };
                if (a.dialog.progress(), d.isMember) d.set("is_notification_off", c), d.update().success(e).error(f); else {
                    var g = Moxtra.getUserBoard(a.model.id);
                    g && (g.set("is_notification_off", c), g.updateNotificationAsTeam(c).success(e).error(f));
                }
            }, 10);
        },
        toggleNotification: function() {
            var a = this;
            setTimeout(function() {
                var b = "1" === a.$("#silentMessage .active input").val() ? !0 : !1, c = a.model.id, d = Moxtra.getUserBoard(c);
                d && d.set("isSilentMessageOn", b);
            }, 10);
        },
        deleteThisBinder: function() {
            var a = this;
            MX.ui.Confirm(a.isConversation ? b.confirm_delete_chat : b.confirm_delete_binder, function() {
                a.dialog.progress();
                var c = a.model.id;
                a.model.delete().success(function() {
                    a.dialog.progress(!1), a.dialog.close(), MX.ui.notifySuccess(a.isConversation ? b.delete_chat_success : b.delete_binder_success), 
                    a._sendBinderActionMsg("delete_binder", c);
                }).error(function() {
                    MX.ui.notifyError(a.isConversation ? b.delete_chat_failed : b.delete_binder_failed), 
                    a.dialog.progress(!1);
                });
            });
        },
        leaveThisBinder: function() {
            var a = this;
            MX.ui.Confirm(a.isConversation ? b.confirm_leave_chat : b.confirm_leave_binder, function() {
                a.dialog.progress();
                var c = a.model.id;
                a.model.leave().success(function() {
                    MX.ui.notifySuccess(a.isConversation ? b.leave_chat_success : b.leave_binder_success), 
                    a.dialog.progress(!1), a.dialog.close(), a._sendBinderActionMsg("leave_binder", c);
                }).error(function() {
                    MX.ui.notifyError(a.isConversation ? b.leave_chat_failed : b.leave_binder_failed), 
                    a.dialog.progress(!1);
                });
            });
        },
        downloadThisBinder: function() {
            var a = $(this.handleEvent.currentTarget);
            a.button("loading"), setTimeout(function() {
                a.button("reset");
            }, 3e3), i.downloadBinder(this.model.id);
        },
        duplicateThisBinder: function() {
            var a = this, c = new n();
            this.dialog.push(new g({
                model: c,
                title: b.duplicate_binder,
                input: {
                    name: "newName",
                    placeholder: b.please_enter_binder_name
                },
                buttons: [ {
                    text: b.back,
                    position: "left",
                    click: function() {
                        this.pop();
                    }
                }, {
                    text: b.duplicate,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    c.isValid(!0) && (a.inProgress || (a.inProgress = !0, a.dialog.progress(), a.model.duplicate(c.get("newName")).success(function(c) {
                        MX.ui.notifySuccess(b.duplicate_binder_success), a.inProgress = !1, a.dialog.progress(!1), 
                        a.dialog.close(), c && c.data && c.data.id && a._sendBinderActionMsg("create_binder", c.data.id);
                    }).error(function() {
                        a.inProgress = !1, MX.ui.notifyError(b.duplicate_binder_failed), a.dialog.progress(!1);
                    })));
                }
            }));
        },
        selectCoverFromPages: function() {
            var a = this, c = a.$(".mx-cover-img img");
            this.dialog.push(new MX.ui.FileSelector({
                boardId: a.model.id,
                buttons: [ {
                    text: b.back,
                    position: "left",
                    click: function() {
                        this.pop();
                    }
                } ],
                onSelect: function(b) {
                    var d = b[0];
                    c.attr("src", d.get("thumbnail_small")), a.dialog.pop();
                }
            }));
        },
        _sendBinderActionMsg: function(a, b) {
            c.sendMessage({
                action: a,
                binder_id: b,
                session_id: Moxtra.getMe().sessionId
            });
        }
    });
}), define("binder/binderSettings", [ "moxtra", "lang", "text!template/binder/binderSettings.html", "binder/binderMembers", "binder/binderSetting", "binder/binderActions" ], function(a, b, c, d, e, f) {
    var g = (MX.logger("binderMembers"), {
        binder: e,
        members: d
    });
    return a.Controller.extend({
        template: c,
        title: b.binder_options,
        handleAction: !1,
        init: function(a) {
            this.$scope.lang = b, _.extend(this, a), this.views = {}, this.model = Moxtra.getBoard(this.binderId);
            var c = this.model.getMyBoardUserInfo();
            this.isConversation = this.model.isconversation, this.title = this.model.name, this.$scope.isConversation = this.isConversation, 
            this.$scope.isEditor = c.isEditor;
        },
        rendered: function() {
            this.switchSubView(this.defaultView || "members");
        },
        switchSubView: function(a) {
            var b = this.views[a];
            if (this.highlight(a), this.currView && (this.currView.$el.hide(), this.currView.trigger("hide")), 
            "share" === a && f.needSuppressShareDialog()) return f.sharePages(this.binderId, null), 
            void this.dialog.close();
            if (!b) {
                var c = g[a];
                b = this.views[a] = new c({
                    dialog: this.dialog,
                    binderId: this.binderId,
                    model: this.model,
                    parent: this,
                    isConversation: this.isConversation
                }), this.recovery(b), b.renderTo(this.$(".settings-subview"));
            }
            this.currView = b;
            var d = this.$(".btn-container");
            return "share" === a ? d.hide() : d.show(), b.$el.show(), b.trigger("show"), !1;
        },
        highlight: function(a) {
            this.$el.find('label[data-action="switchSubView"]').removeClass("active"), this.$el.find("label[data-param=" + a + "]").addClass("active");
        }
    });
}), define("component/uploader/dragger", [ "moxtra", "component/uploader/base" ], function(a, b) {
    return MX.ui.dragger || (MX.ui.dragger = new b({
        className: "mx_swf_container_dragdrop"
    })), MX.ui.dragger;
}), define("binder/binderDetail", [ "moxtra", "app", "lang", "text!template/binder/binderDetail.html", "text!template/binder/pinItem.html", "binder/chat", "binder/pages", "binder/todo", "binder/meet", "binder/binderBiz", "viewer/viewer", "binder/binderSettings", "meet/meet", "component/uploader/uploader", "component/uploader/dragger", "binder/binderActions", "binder/binderModel", "const", "component/selector/userSelector", "admin/branding/helper" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    "use strict";
    var u = a.logger("binderDetail"), v = {
        tab_chat: f,
        tab_todo: h,
        tab_pages: g,
        tab_meet: i
    };
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function(a) {
            var d = this;
            d.tabs = {}, d.destFolder = "", d.$scope.lang = c, d.$scope.config = b.config.global, 
            d.$scope.boardId = b.request.page(), d.$scope.enableIntegration = b.isIntegrationEnabled(), 
            d.$scope.uiOpts = a && a.uiOpts || {
                showHeader: !0
            };
            var e = {
                showAddFile: t.isShowAddFile(),
                showBinderName: t.isShowBinderName(),
                showBinderOptions: t.isShowBinderOptions(),
                showTodoTab: t.isShowTodo(),
                showMeetTab: t.isShowMeetInBinder()
            }, f = [];
            if (d.$scope.branding = e, MX.each([ e.showTodoTab, e.showMeetTab ], function(a) {
                f.push(a ? 1 : 0);
            }), d.$scope.brandingStyle = parseInt(f.join(""), 2), b.isIntegrationEnabled()) {
                var g, h = b.integration.get("extension");
                if (h) {
                    try {
                        g = JSON.parse(0 === h.indexOf("{") ? h : decodeURIComponent(h));
                    } catch (i) {
                        console.error(i);
                    }
                    var j = g && g.tabs || [];
                    MX.each(j, function(a) {
                        d.$scope["custom_tab_" + a.id] = a.name;
                    });
                }
            }
            d.isLoad = a.isLoad, this.binderActions = p, d.currTab = b.request.get("params.tab") || b.request.get("params.defaultTab"), 
            d.currTab && v[d.currTab] || (d.currTab = a.defaultTab || "tab_pages"), d.binderId = b.request.page(), 
            d.listenTo(b.request, "change:sequence", d._onSequenceChange), d.listenTo(b.request, "change:params.tab", d._checkTabStatus), 
            d.$scope.uiOpts.showHeader || d.listenTo(b.request, "change:params.tab", function() {
                d.switchTab(b.request.params().tab);
            }), this.recovery(function() {
                var a, b;
                d.binderId && (a = Moxtra.getUserBoard(d.binderId)) && (b = a.getBoard(), b && b.unsubscribe(), 
                a.updateAccessTime());
            });
        },
        _checkTabStatus: function() {
            var a = b.request.get("params.tab");
            a && v[a] && a !== this.currTab && ($("." + a).tab("show"), this.switchTab(a));
        },
        _onSequenceChange: function() {
            var a = b.request.sequence();
            a ? this.viewPage(a) : this.viewer && this.viewer.close();
        },
        _onPageChange: function() {
            var a = this.binderId, c = b.request.page();
            if (this.loadBinder(c), this.binderId = c, c) {
                var d = b.request.params().tab || "tab_chat";
                if (this.$('#binderDetailTab a[data-target="#' + d + '"]').tab("show"), b.request.page() !== a) {
                    var e = this.tabs.tab_chat;
                    if (e && (e.leave(), e.destroy(), e = this.tabs.tab_chat = new f({
                        renderTo: this.$("#tab_chat"),
                        parent: this,
                        isLoad: this.isLoad
                    }), this.recovery(e)), "tab_chat" !== this.currTab) {
                        var g = this.tabs[this.currTab];
                        g && g.update();
                    }
                }
            }
            this.binderActions.clearGroupInfo();
        },
        updateBinderInfo: function(a) {
            var b = this;
            a && a.is_restricted ? $(".mx-restricted").hide() : $(".mx-restricted").show();
            var c = Moxtra.const;
            if (this.listenTo(a, "change:name", function() {
                b.$el.find(".binder-name").text(a.name).attr("title", a.name);
            }), a) {
                var d = a.getMyBoardUserInfo();
                !d || d.type !== c.BOARD_OWNER && d.type !== c.BOARD_READ_WRITE ? (d.type === c.BOARD_READ ? this.$el.addClass("viewer-view") : this.$el.removeClass("viewer-view"), 
                this.$el.removeClass("owner-view"), $(".mx-comment-input").hide()) : (this.$el.addClass("owner-view"), 
                $(".mx-comment-input").show(), this.$(".mx-action-bar textarea:visible").trigger("autosize.resize")), 
                this.$el.find(".binder-name").text(a.name).attr("title", a.name), "tab_meet" === this.currTab && this.tabs && this.tabs.tab_meet && this.tabs.tab_meet.updateMeetAction();
            }
        },
        loadBinder: function(a) {
            function d(d) {
                if (d.is_deleted) return void MX.ui.Alert(c.binder_not_found).on("close", function() {
                    b.request.page("");
                });
                if (g.req = null, b.request.page() === a) {
                    console.timeEnd("loadBoard");
                    var e = Moxtra.getUserBoard(a);
                    if (e) e.updateAccessEnterTime(), g.listenTo(e, "change:type", function() {
                        g.updateBinderInfo(d);
                    }); else {
                        var f = new Moxtra.model.UserBoard({
                            board: {
                                id: a
                            }
                        });
                        f.updateAccessEnterTime();
                    }
                    var h = b.request.params().tab || "tab_chat";
                    g.$el.find(".JS_Tab").attr("data-toggle", "tab"), g.$('#binderDetailTab a[data-target="#' + h + '"]').tab("show"), 
                    _.defer(function() {
                        g.$el.find(".JS_BinderOptions").removeClass("disabled");
                    }, 500), g.updateBinderInfo(d), d.subscribe(), g.switchTab();
                    var i = b.request.sequence();
                    i && g.viewPage(i);
                }
            }
            function e() {
                g.req = Moxtra.loadBoard(a).success(function(a) {
                    var b = !1;
                    _.each(a.members, function(a) {
                        a.isGroup && (b = !0);
                    }), b ? Moxtra.onReady(function() {
                        d(a);
                    }) : d(a);
                }).error(function(a) {
                    g.req = null, a && a.responseJSON && "RESPONSE_ERROR_NOT_FOUND" === a.responseJSON.code && MX.ui.Alert(c.binder_not_found);
                });
            }
            var f, g = this;
            g.$el.find(".binder-name").text(c.loadingText).attr("title", ""), g._checkTabStatus(), 
            b.sendMessage({
                action: "view",
                binder_id: a,
                session_key: null,
                session_id: Moxtra.getMe().sessionId
            });
            var h = b.request.params().tab || "tab_chat", i = !1, j = "tab_chat" === h;
            f = Moxtra.getBoard(a);
            var k = Moxtra.getUserBoard(a);
            k && (g.lastAccessTime = k.accessed_time, g.unreadFeedCount = k.feed_unread_count), 
            f && (i = !0), j ? i ? (g.switchTab(), e()) : (g.$el.loading(), Moxtra.loadBoardFeed(a).success(function(a) {
                g.$el.loading(!1), g.updateBinderInfo(a), g.switchTab(), e();
            })) : e(), g.recovery(function() {
                g.req && g.req.abort();
            });
        },
        rendered: function() {
            function a(e, f, g, h) {
                var i, j = f.length, k = !0, l = b.request.page(), m = Moxtra.getBoard(l);
                if (m) if (d.destFolder) {
                    var n = d.destFolder.split(",").pop();
                    i = m.getFiles(n);
                } else i = m.getFiles();
                if (j - e === 0) return void g();
                var o = !1, p = f[e];
                i.every(function(b) {
                    return b.name === p.name ? (e++, o = !0, d.recovery(new MX.ui.Dialog({
                        title: c.replace,
                        content: MX.format(c.upload_file_has_same_file_name, b.name),
                        buttons: [ {
                            text: c.cancel,
                            position: "left",
                            className: "ta-confirm-cancel",
                            click: function() {
                                k = !1, h.uploader.removeFile(p), h.collection.remove(p.id), a(e, f, g, h), this.close();
                            }
                        }, {
                            text: c.keep_both,
                            className: "ta-confirm-cancel",
                            click: function() {
                                k = !0, a(e, f, g, h), this.close();
                            }
                        }, {
                            text: c.replace,
                            className: "btn-primary",
                            click: function() {
                                k = !0, b.delete(), a(e, f, g, h), this.close();
                            }
                        } ]
                    })), !1) : !0;
                }), o || (e++, a(e, f, g, h));
            }
            var d = this, e = b.request.page();
            e && d.loadBinder(e), n.register("addPageToBinder", {
                browse_button: "addpage_flashuploader",
                url: function(a) {
                    var c = b.request.toJSON();
                    return "/board/upload?type=original&newfile&id=" + c.page + (a ? "&destfolder=" + a : "") + (j.isSilentMessageOn(c.page) ? "&pnoff=1" : "");
                },
                beforeUpload: function(b, c) {
                    a(0, b, c, this);
                }
            }), this.recovery(function() {
                n.unregister("addPageToBinder");
            }), this.$(".mx-add-page-bar.dropdown").on("hide.bs.dropdown", function() {
                n.hide("addPageToBinder");
            }), Moxtra.onReady(function() {
                t.isShowAddFile() && (console.log("register_dragger"), o.register("dragPageToBinder", {
                    browse_button: "uploadDragDropInBinderHidden",
                    drop_element: "mxBody",
                    drop_message: c.drop_your_file_to_binder,
                    url: function(a) {
                        var c = b.request.toJSON();
                        return "/board/upload?type=original&newfile&id=" + c.page + (a ? "&destfolder=" + a : "") + (j.isSilentMessageOn(c.page) ? "&pnoff=1" : "");
                    },
                    beforeUpload: function(b, c) {
                        a(0, b, c, this);
                    }
                }), setTimeout(function() {
                    o.refresh("dragPageToBinder", d.$("#uploadDragDropInBinderHidden"));
                }, 300), d.recovery(function() {
                    console.log("unregister_dragger"), o.unregister("dragPageToBinder");
                }));
            }), this.$(".mx-tab .JS_Tab").on("shown.bs.tab", function() {
                d.$(".mx-action-bar textarea:visible").trigger("autosize.resize");
            }), this.$("#binderDetailTab .JS_Tab").on("shown.bs.tab", function(a) {
                var b = $(a.target).data("target"), c = b.substr(1);
                d.switchTab(c);
            }), this.$("a.micon-btn").tooltip();
        },
        refreshUploader: function() {
            var a = this;
            setTimeout(function() {
                n.refresh("addPageToBinder", a.$("#addpage_flashuploader"), a.destFolder), o.refresh("dragPageToBinder", a.$("#uploadDragDropInBinderHidden"), a.destFolder);
            }, 100);
        },
        changeStatus: function() {
            u.debug("changeStatus"), this.switchTab();
            var a = b.request.get("sequence");
            a ? this.viewPage(a) : this.viewer && this.viewer.close();
        },
        switchTab: function(a) {
            var c = this.tabs[this.currTab];
            c && c.leave(), a = a || this.currTab;
            var d = this.tabs[a];
            if (d || (console.time("new_" + a), d = this.tabs[a] = new v[a]({
                renderTo: this.$("#" + a),
                parent: this
            }), console.timeEnd("new_" + a), this.recovery(this.tabs[a])), this.currTab = a, 
            !this.$scope.uiOpts.showHeader) {
                for (var e in this.tabs) this.tabs.hasOwnProperty(e) && this.$("#" + e).removeClass("active");
                for (var e in v) this.$("#" + e).removeClass("active");
                this.$("#" + a).addClass("active");
            }
            d.update(), "tab_todo" === a || "tab_meet" === a ? this.$(".mx-add-page-bar").hide() : this.$(".mx-add-page-bar").show(), 
            b.request.params({
                tab: this.currTab
            }, !1);
        },
        openBinderOptions: function() {
            var a = b.request.page(), d = Moxtra.getBoard(a);
            if (!d) return void MX.ui.Alert(c.binder_not_found);
            var e = new MX.ui.Dialog(new l({
                binderId: a
            }));
            this.recovery(function() {
                e.close();
            });
        },
        viewPage: function(a, c) {
            function d() {
                f.viewer ? f.viewer.binding(l) : (f.viewer = new k({
                    renderTo: "body",
                    collection: l,
                    userRole: m.type,
                    roleContext: "binder"
                }), f.listenTo(f.viewer, "switchPage", function(a) {
                    b.request.sequence(a.page_sequence, !1);
                }), f.listenTo(f.viewer, "close", function() {
                    b.request.sequence(""), l && l.destroy(), f.stopListening(h.pages);
                }), f.recovery(f.viewer)), f.viewer.open(a, c), f.viewer.setUserRole(m.type || r.binder.role.Viewer);
            }
            if (a) {
                var e, f = this, g = !1;
                _.isString(a) && a.indexOf("-") > 0 && (g = !0, e = a);
                var h = Moxtra.getBoard(b.request.page());
                if (h) {
                    var i, j, l, m = h.getMyBoardUserInfo();
                    g ? (j = h.getCacheObject(e), l = "BoardFolder" === j.parent.$name ? h.getFiles(j.parent.sequence) : h.getFiles(), 
                    j.pages.length && (a = j.pages[0].sequence)) : (i = h.pages.get(a), i && (e = i.page_group, 
                    j = h.getCacheObject(e), l = "BoardFolder" === j.parent.$name ? h.getFiles(j.parent.sequence) : h.getFiles())), 
                    d();
                }
            }
        },
        viewCommentPage: function(a) {
            this.comment(a);
        },
        comment: function(a) {
            this.viewPage(a, "comments");
        },
        annotate: function(a) {
            this.viewPage(a, "annotate");
        },
        editWebdoc: function(a) {
            this.viewPage(a, "editWebdoc");
        },
        viewResource: function(a) {
            this.viewPage(a);
        },
        viewUrl: function(a) {
            this.viewPage(a);
        },
        _getCurrentFolderPages: function(a) {
            var c, d = Moxtra.getBoard(b.request.page()), e = new Moxtra.Collection({
                model: "Moxtra.model.BoardPage"
            }), f = d.getCacheObject(a.page_group);
            return f && f.parent && (c = "BoardFolder" === f.parent.$name ? d.getFiles(f.parent.sequence) : d.getFiles()), 
            c && c.length > 0 && _.each(c, function(a) {
                a.pages && _.each(a.pages, function(a) {
                    e.push(a);
                });
            }), e;
        },
        startNote: function(a) {
            a = parseInt(a, 10);
            var c, d = this, e = b.request.page(), f = 0;
            c = Moxtra.getBoard(e);
            var g = c.pages.get(a), h = this._getCurrentFolderPages(g), f = h.indexOf(g), i = [];
            MX.each(h, function(a) {
                i.push(a.sequence);
            }), d.$el.loading(), m.start({
                isNote: !0,
                boardId: e,
                currPage: f,
                pages: i,
                success: function() {
                    d.$el.loading(!1);
                }
            });
        },
        closeTodoDetail: function() {
            this.tabs[this.currTab].closeTodoDetail && this.tabs[this.currTab].closeTodoDetail();
        },
        deleteCommentFeed: function(d, e) {
            var f = this;
            f.recovery(new a.ui.Dialog({
                title: c.binder_delete_a_comment,
                content: c.binder_delete_a_comment_confirm,
                buttons: [ {
                    text: c.yes,
                    className: "btn-primary",
                    click: function() {
                        var a = this;
                        j.deleteBinderComment(b.request.page(), d).success(function() {
                            f.recovery(new MX.ui.Notify({
                                type: "success",
                                content: c.binder_delete_a_comment_succeed
                            })), a.close();
                            var b = f.$el.find("#feed" + e);
                            b.prev().hasClass("feed-time") && b.prev().remove(), b.remove();
                        }).error(function() {
                            f.recovery(new MX.ui.Notify({
                                type: "error",
                                content: c.binder_delete_a_comment_failed
                            })), a.close();
                        });
                    }
                }, {
                    text: c.no,
                    click: function() {
                        this.close();
                    }
                } ]
            }));
        },
        showPin: function() {
            var b = this;
            this.$(".mx-brief").mxModal({
                closeCb: function() {
                    b.$(".mx-brief").mxModal({
                        close: !0
                    });
                }
            }), this.pinList || (this.pins = Moxtra.getPinList(this.binderId), this.pinList = new a.List({
                renderTo: this.$(".mx-brief-container"),
                collection: this.pins,
                syncModel: !0,
                template: e,
                emptyTemplate: c.empty_pin_list,
                $scope: {
                    lang: c
                }
            }));
        },
        hidePin: function() {
            this.$(".mx-brief").mxModal({
                close: !0
            });
        },
        removePin: function(a) {
            var b = this.pins.get(a);
            b.pin(!1).success(function() {
                MX.ui.notifySuccess(c.remove_pin_success);
            }).error(function() {
                MX.ui.notifyError(c.remove_pin_failed);
            });
        },
        gotoFeedItem: function(a) {
            b.request.navigate("timeline", this.binderId, null, {
                tab: "tab_chat",
                seq: a
            }), this.$(".mx-brief").mxModal({
                close: !0
            });
        }
    });
}), define("api/chat", [ "moxtra", "app", "lang", "binder/binderDetail", "api/inlineMessage" ], function(a, b, c, d, e) {
    "use strict";
    return d.extend({
        init: function(a) {
            var c = b.request, d = c.params(), e = c.page(), f = this;
            this._renderTo = a.renderTo, delete a.renderTo, a.defaultTab = "tab_chat", this._opts = a, 
            MX.loading(!0);
            var g = $(this._renderTo).MoxtraPowerBy(!0);
            d.subscribe = !1, Moxtra.verifyToken(d).success(function() {
                var a = Moxtra.getMe();
                a.group ? a.group.group.syncTags().success(function() {
                    f.showUI(e, g);
                }) : f.showUI(e, g);
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        showUI: function(a, b) {
            var f = this;
            Moxtra.loadBoard(a).success(function() {
                MX.loading(!1), d.prototype.init.call(f, f._opts), f.renderTo(f._renderTo), b.remove(), 
                f.$el.addClass("mx-api-ui");
                var c = Moxtra.getMe();
                c.group && "PBnongjBOJsEg7rwtYqj3c9" === MX.get("group.id", c.group) ? c.subscribe(Moxtra.getBoard(a)) : c.subscribe(Moxtra.getBoard(a), !0), 
                Moxtra.loadUserBoardInfo(a);
            }).error(function() {
                MX.loading(!1), new e({
                    renderTo: f._renderTo,
                    message: c.binder_not_found
                });
            });
        }
    });
}), define("api/endMeet", [ "moxtra", "app", "lang", "api/inlineMessage", "meet/meet" ], function(a, b, c, d, e) {
    "use strict";
    return d.extend({
        init: function(a) {
            var c = this, e = b.request.params();
            d.prototype.init.call(c, a), this._renderTo = a.renderTo, MX.loading(!0), $(this._renderTo).MoxtraPowerBy(!0), 
            Moxtra.verifyToken(e).success(function() {
                c.exitMeet();
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        exitMeet: function() {
            var a, c, d = b.request.page();
            isNaN(1 * d) ? a = d : c = 1 * d;
            var f = {
                isHost: !0,
                sessionKey: c,
                success: function() {
                    b.sendMessage({
                        action: "end",
                        session_key: c || null,
                        session_id: Moxtra.getMe().sessionId
                    });
                },
                error: function() {}
            };
            c ? e.exit(f) : b.sendMessage({
                action: "fail",
                cmd: "end",
                error_code: "400",
                error_message: "Invalid session_key",
                session_key: c || null,
                session_id: Moxtra.getMe().sessionId
            }), MX.loading(!1);
        }
    });
}), define("api/joinMeet", [ "moxtra", "app" ], function(a, b) {
    "use strict";
    return a.Controller.extend({
        init: function() {
            var a = b.request, c = a.params(), d = {};
            d.session_key = a.page(), d.name = c.name || "", c.invisible && (d.invisible = c.invisible), 
            c.c_user && (d.c_user = c.c_user), c.token && (d.token = c.token), b.request.navigate("join", null, null, d);
        }
    });
}), define("api/joinUrl", [ "moxtra", "app", "meet/meet" ], function(a, b, c) {
    return a.Controller.extend({
        template: "<div></div>",
        init: function() {
            var a, d = "#mymeet?action=default", e = b.request.get("params.session_key"), f = b.request.get("params.name"), g = b.request.get("params.c_user"), h = b.request.get("params.token"), i = !!b.request.get("params.invisible"), j = b.request.page();
            return j ? void (1 * j === 1 * j ? b.navigate("joinmeet/" + j, !0) : b.navigate("joinbinder/" + j, !0)) : void (e ? (a = function() {
                c.join({
                    sessionKey: e,
                    userName: f,
                    invisible: i,
                    forceStart: !0,
                    backHref: d
                });
            }, g && h ? Moxtra.verifyToken({
                c_user: g,
                token: h,
                subscribe: !1
            }).complete(function() {
                a();
            }) : a()) : b.navigate("joinmeet", !0));
        }
    });
}), define("api/leaveMeet", [ "moxtra", "app", "lang", "api/inlineMessage", "meet/meet" ], function(a, b, c, d, e) {
    "use strict";
    return d.extend({
        init: function(a) {
            {
                var c = this;
                b.request.params();
            }
            d.prototype.init.call(c, a), this._renderTo = a.renderTo, MX.loading(!0), $(this._renderTo).MoxtraPowerBy(!0), 
            this.exitMeet();
        },
        exitMeet: function() {
            var a, c, d = b.request.page();
            isNaN(1 * d) ? a = d : c = 1 * d;
            var f = {
                sessionKey: c,
                success: function() {
                    b.sendMessage({
                        action: "leave",
                        session_key: c || null,
                        session_id: Moxtra.getMe().sessionId
                    });
                }
            };
            c ? e.exit(f) : b.sendMessage({
                action: "fail",
                cmd: "leave",
                error_code: "400",
                error_message: "Invalid session_key",
                session_key: c || null,
                session_id: Moxtra.getMe().sessionId
            }), MX.loading(!1);
        }
    });
}), define("api/selectorUrl", [ "moxtra", "app", "lang", "component/selector/binderSelector", "binder/binderBiz", "common/shareBiz" ], function(a, b, c, d, e, f) {
    var g = MX.logger("api:selectorUrl");
    return a.Controller.extend({
        init: function() {
            Moxtra.verifyToken().success(function() {
                var a = new d({
                    filter: "binder",
                    onSelect: function(a) {
                        if (a) {
                            MX.isArray(a) && a.length && (a = a[0]);
                            var d, h, i;
                            e.getBinder(a).success(function(e) {
                                var j = e && e.object && e.object.board;
                                g.log(e), j && (d = j.name, i = [ location.origin, "board", a, j.thumbnail ].join("/")), 
                                f.getShareBinderToken(a).success(function(c) {
                                    g.log(c), j = c && c.data, j && j.view_tokens && j.view_tokens.length && (h = [ location.origin, "v", j.view_tokens[0].token ].join("/")), 
                                    b.sendMessage({
                                        action: "select",
                                        binder_name: d,
                                        binder_id: a,
                                        binder_viewUrl: h,
                                        binder_imageUrl: i
                                    });
                                }).error(function(a) {
                                    g.log(a), MX.ui.notifyError(a && a.xhr && 403 === a.xhr.status ? c.choose_binder_permission_error : c.choose_binder_failed);
                                });
                            }).error(function(a) {
                                g.log(a), MX.ui.notifyError(c.choose_binder_failed);
                            });
                        }
                    }
                });
                a.renderTo("#mxPageBody");
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        }
    });
}), define("api/startChat", [ "moxtra", "app", "lang", "api/inlineMessage", "component/selector/userSelector" ], function(a, b, c, d) {
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = e.params();
            d.prototype.init.call(c, a), this._renderTo = a.renderTo, f.subscribe = !1, Moxtra.verifyToken(f).success(function() {
                if (f.binder_id) return void c.jumpToView(f.binder_id);
                if (f.binder_name) return void c.createBinder(!1);
                var a = (Moxtra.getMe(), f.email), b = [], d = f.unique_id;
                a ? a.indexOf(",") ? (a = a.split(","), a.forEach(function(a) {
                    b.push({
                        email: a
                    });
                })) : b.push({
                    email: a
                }) : d ? d.indexOf(",") ? (d = d.split(","), d.forEach(function(a) {
                    b.push({
                        unique_id: a
                    });
                })) : b.push({
                    unique_id: d
                }) : c.createBinder(), b.length && Moxtra.startChat(b).success(function(a) {
                    c.jumpToView(a.id);
                }).error(function(a) {
                    MX.loading(!1), c.updateMessage(this.getErrorMessage(a));
                });
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        jumpToView: function(a) {
            var c = b.request.params(), d = c.view || "chat";
            c.header || (d = "api." + d), MX.loading(!1), b.request.navigate(d, a);
        },
        createBinder: function(a) {
            var b = Moxtra.getMe(), c = this;
            b.subscribe(), b.on("firstSubscribe", function() {
                c._createBinder(a);
            });
        },
        _createBinder: function(a) {
            var c = b.request.params(), d = !0, e = "";
            c.binder_name && (d = !1, e = c.binder_name);
            var f = new Moxtra.model.Board(), g = this;
            f.set("name", e), f.set("category", 0), f.set("isconversation", d), c.email ? (MX.loading(!0), 
            f.create().success(function() {
                var a = [], b = [];
                a = c.email.indexOf(",") ? c.email.split(",") : [ c.email ];
                for (var d = 0; d < a.length; d++) b.push({
                    email: a[d]
                });
                f.inviteUsers(b).success(function() {
                    g.jumpToView(f.id);
                });
            })) : a === !1 ? f.create().success(function() {
                g.jumpToView(f.id);
            }) : (MX.loading(!1), g._selectUserToChat(function(a) {
                MX.loading(!0), Moxtra.loadChatWithUser(a).success(function(b) {
                    b ? g.jumpToView(b.board.id) : f.create().success(function() {
                        f.inviteUsers(a).success(function() {
                            g.jumpToView(f.id);
                        });
                    });
                }).error(function() {
                    f.create().success(function() {
                        f.inviteUsers(a).success(function() {
                            g.jumpToView(f.id);
                        });
                    });
                });
            }));
        },
        _selectUserToChat: function(a) {
            MX.loading(!1);
            var b = new MX.ui.UserSelector({
                title: c.invite_member,
                teamsPanel: !1,
                buttons: [ {
                    position: "left",
                    text: c.cancel,
                    click: function() {
                        this.close();
                    }
                }, {
                    position: "right",
                    text: c.ok,
                    className: "btn-primary",
                    click: "onSelectDone",
                    id: "inviteUser",
                    disabled: !0
                } ],
                onChange: function() {
                    var a = this.dialog.getButton("inviteUser");
                    this.value().length > 0 ? a.removeClass("disabled") : a.addClass("disabled");
                },
                onSelectDone: function() {
                    var b = this.value(), c = [], d = this.dialog;
                    b.each(function(a) {
                        var b = {}, d = a.toJSON();
                        d.id && (b.id = d.id), d.email && (b.email = d.email), c.push(b);
                    }), d.close(), a(c);
                }
            });
            new MX.ui.Dialog({
                content: b
            });
        }
    });
}), define("api/startChatUrl", [ "moxtra", "app", "lang", "component/selector/userSelector", "binder/binderDetail" ], function(a, b, c, d, e) {
    return a.Controller.extend({
        _createChat: function(a) {
            var d = this;
            MX.api("/users/" + a, "CHAT", {}, function(a) {
                a && a.data && a.data.id ? (b.request.navigate("chat", a.data.id), d._createChatView()) : MX.ui.notifyError(c.start_chat_failed);
            });
        },
        _createChatView: function() {
            $("#mxPage").empty();
            var a = new e({
                renderTo: "#mxPage",
                request: b.request,
                defaultTab: "tab_chat"
            });
            b.request.sequence() || (a.viewPage = function(a) {
                window.open(location.href + "/" + a);
            });
        },
        init: function() {
            if (b.request.page()) return void this._createChatView();
            var a = this, e = b.request.get("params.email");
            Moxtra.verifyToken().success(function() {
                e ? a._createChat(e) : new MX.ui.Dialog({
                    content: new d({
                        title: c.add_user,
                        buttons: [ {
                            position: "right",
                            text: c.invite,
                            className: "btn-primary",
                            click: "shareByEmail"
                        } ],
                        shareByEmail: function() {
                            var b = [], c = this.value();
                            c.each(function(a) {
                                b.push(a.get("email"));
                            }), a._createChat(b[0]), this.dialog.pop();
                        }
                    })
                });
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        }
    });
}), define("api/startMeet", [ "moxtra", "app", "lang", "const", "api/inlineMessage", "meet/meet" ], function(a, b, c, d, e, f) {
    return e.extend({
        init: function(a) {
            {
                var c = this, d = b.request;
                d.params(), d.page();
            }
            e.prototype.init.call(c, a), this._renderTo = a.renderTo, MX.loading(!0), $(this._renderTo).MoxtraPowerBy(!0), 
            Moxtra.verifyToken(d.params()).success(function() {
                c.startMeet();
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        startMeet: function() {
            var a = "#mymeet?action=default", c = b.request.get("params.binder_id"), e = b.request.get("params.schedule_binder_id"), g = b.request.params(), h = g.email || g.unique_id, i = [], j = g.options, k = [];
            h && (i = h.split(","));
            var l, m = "unique_id";
            h && g.email && (m = "email");
            for (var n = 0; n < i.length; n++) l = {}, l[m] = i[n], i[n] = l;
            if (j) try {
                j = JSON.parse(j);
            } catch (o) {
                console.error(o);
            }
            MX.each(j, function(a, b) {
                var c = b.toUpperCase();
                [ d.meet.tags.endPage, d.meet.tags.videoQuality ].indexOf(c) > -1 ? (c === d.meet.tags.endPage && (/^(http|https):/gi.test(a) || (a = "blank")), 
                c === d.meet.tags.videoQuality && (a = "" + (d.video.quality[a] || d.video.quality.normal)), 
                k.push({
                    name: c,
                    string_value: a
                })) : [ !1, 0, "false", "0" ].indexOf(a) < 0 && k.push({
                    name: c,
                    string_value: "1"
                });
            });
            var p = {
                boardId: c || e,
                forceStart: !0,
                backHref: a
            };
            i.length && (p.users = i), k.length && (p.tags = k), e ? f.startAssigned(p) : f.start(p), 
            MX.loading(!1);
        }
    });
}), define("api/startNoteUrl", [ "moxtra", "app", "meet/meet" ], function(a, b, c) {
    return a.Controller.extend({
        template: "<div></div>",
        init: function() {
            var a = MX.format("{0}//{1}{2}#timeline", location.protocol, location.host, location.pathname), d = b.request.get("params.binder_id"), e = b.request.get("params.page_index");
            Moxtra.verifyToken().success(function() {
                c.start({
                    boardId: d,
                    forceStart: !0,
                    isNote: !0,
                    currPage: e,
                    backHref: a
                });
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        }
    });
}), define("api/startUrl", [ "moxtra", "app", "meet/meet" ], function(a, b, c) {
    return a.Controller.extend({
        template: "<div></div>",
        init: function() {
            var a = "#mymeet?action=default", d = b.request.get("params.binder_id"), e = b.request.get("params.email"), f = [];
            e && (f = e.split(","));
            var g = {
                boardId: d,
                forceStart: !0,
                backHref: a
            };
            f.length && (g.users = f), Moxtra.verifyToken().success(function() {
                c.start(g);
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        }
    });
}), define("text!template/api/video.html", [], function() {
    return '<div id="mxApiStartVideo" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;">\n	<div id="mxMeetPlugin" style="position:absolute;top:0;width:100%;height:100%;">\n		\n	</div>\n	<div style="position:absolute;bottom:0;height:0;width:100%;">\n		<div id="mxApiVoice" class="hide" style="position: absolute; bottom:2px;right:2px;text-align: center;">\n			\n		</div>\n	</div>\n</div>';
}), define("api/videoView", [ "moxtra", "lang", "app", "const", "text!template/api/video.html", "meet/meet", "meet/meetBiz", "meet/brandingCache" ], function(a, b, c, d, e, f, g, h) {
    "use strict";
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function() {
            this.mode = c.request.get("params.mode") || 0, this.sessionKey = c.request.get("params.session_key"), 
            this.invisible = !!c.request.get("params.invisible"), this.ended = "ended" === c.request.get("params.action"), 
            this.name = c.request.get("params.name");
        },
        rendered: function() {
            if (this.$el.MoxtraPowerBy(!0), !this.ended) {
                this.$el.loading();
                var a = this;
                this.sessionKey ? f.join({
                    sessionKey: this.sessionKey,
                    invisible: this.invisible,
                    userName: this.name,
                    silence: !0,
                    success: function(b) {
                        a._meetOnReady(b);
                    },
                    error: function() {
                        a.$el.loading(!1), MX.ui.notifyError(b.meet_join_video_failed);
                    }
                }) : f.start({
                    forceStart: !0,
                    silence: !0,
                    success: function(b) {
                        a._meetOnReady(b);
                    },
                    error: function() {
                        a.$el.loading(!1), MX.ui.notifyError(b.meet_start_video_failed);
                    }
                });
            }
        },
        _meetOnReady: function(a) {
            var b = this;
            this.$el.MoxtraPowerBy(!1), this.sessionKey = a.session_key, this.boardId = a.board_id, 
            location.href = "#api.video?mode=" + this.mode + "&session_key=" + this.sessionKey, 
            this.meetModel = g.getMeetModel(), this.audioModel = g.getAudioModel(), this.videoModel = g.getVideoModel(), 
            this.meetModel.on("change:isEnded", function(a) {
                a.get("isEnded") && (b._leaveVideo(), b._leaveAudio());
            }), this.meetModel.on("change:noPermission", function() {
                b._leaveVideo(), b._leaveAudio();
            }), this.meetModel.on("change:selfLeft", function(a) {
                a.get("selfLeft") && (b._leaveVideo(), b._leaveAudio());
            }), this.audioModel.once("change:audioConf", function() {
                setTimeout(function() {
                    g.joinVideo(!0, {
                        layout: b.mode,
                        quality: d.video.quality.normal,
                        audiobutton: !0
                    }), b.invisible || g.joinAudio();
                }, 100);
            }), this.videoModel.on("change:isJoined", function(a) {
                b.$el.loading(!1);
                var c = a.toJSON();
                c.isJoined ? (b.$el.addClass("ta-api-video-joined"), g.setVideoLayout(b.mode), b._postMessage("video_joined")) : (b.$el.removeClass("ta-api-vieo-joined"), 
                b._postMessage("video_left"));
            }), this.videoModel.on("change:isBroadcast", function(a) {
                var c = a.toJSON();
                b._postMessage(c.isBroadcast ? "video_broadcasted" : "video_unbroadcasted");
            }), g.start(this.boardId, this.sessionKey), g.setAppConfig(h.getAppConfig("api.video"));
        },
        _postMessage: function(a) {
            c.sendMessage({
                action: a,
                binder_id: this.boardId,
                session_key: this.sessionKey,
                session_id: Moxtra.getMe().sessionId
            });
        },
        _leaveVideo: function() {
            g.leaveVideo(!1);
            try {
                g.stop(this.boardId);
            } catch (a) {
                console.error(a);
            }
            location.href = "#api.video?action=ended";
            var b = this;
            setTimeout(function() {
                b.$("#mxMeetPlugin").empty(), b.$("#mxApiVoice").empty(), b.$el.MoxtraPowerBy(!0);
            }, 200);
        },
        enableAudio: function() {
            g.joinAudio();
        },
        mute: function() {
            g.muteAudio();
        },
        unmute: function() {
            g.unmuteAudio();
        },
        _leaveAudio: function() {
            g.leaveAudio();
        }
    });
}), define("api/video", [ "moxtra", "lang", "app", "api/videoView" ], function(a, b, c, d) {
    "use strict";
    return a.Controller.extend({
        template: "<div></div>",
        rendered: function() {
            this.recovery(new d({
                renderTo: "body"
            }));
        }
    });
}), define("text!template/contacts/contactList.html", [], function() {
    return '<div class="page-body">\n	<div id="mxPageBody_Col_1">\n		<div class="mx-contacts">\n			<div class="top-bar form-with-icon input-with-search">\n				<i class="micon-search icon-control"></i>\n                <button type="button" class="close input-close hide" data-action="reset" aria-hidden="true">\n                    <span>×</span>\n                </button>\n                <input type="text" autofocus="autofocus" class="form-control" placeholder="{{lang.search_or_enter_to_invite}}" />\n\n                <div class="new-contact">\n\n				</div>\n			</div>\n			<div class="mx-contact-list">\n				<div class="mx-contact-team panel-group">\n					<div class="mx-panel panel-default">\n						<div class="panel-heading">\n							<h4 class="panel-title">\n								<a data-toggle="collapse" href="#collapseTeam" class="collapsed">\n                                    <i class="micon-arrow-right"></i><span class="item-title">{{lang.teams}}</span> <span class="team-count"></span>\n								</a>\n							</h4>\n						</div>\n						<div id="collapseTeam" class="panel-collapse collapse">\n							<div class="new-team-item mouse-hand" data-action="addNewTeam">\n								<div class="">\n									<h4 class="blue size14"><strong>{{lang.create_team}}</strong></h4>\n								</div>\n							</div>\n							<div class="team-list">\n\n							</div>\n						</div>\n					</div>\n				</div>\n\n				<div class="mx-contact-business panel-group hide">\n					<div class="mx-panel panel-default">\n						<div class="panel-heading">\n							<h4 class="panel-title">\n								<a data-toggle="collapse" href="#collapseBusiness" class="collapsed">\n                                    <i class="micon-arrow-right" /><span class="item-title">{{lang.business_directory}}</span> <span class="business-count"></span>\n								</a>\n							</h4>\n                            <div class="biz-back hide"><button class="btn-xs btn btn-primary" data-action="returnBizLibrary">{{lang.back}}</button></div>\n						</div>\n						<div id="collapseBusiness" class="panel-collapse collapse">\n							<div class="business-contact-list">\n\n							</div>\n						</div>\n					</div>\n				</div>\n\n				<div class="mx-contact-invitation panel-group hide">\n					<div class="mx-panel panel-default">\n						<div class="panel-heading">\n							<h4 class="panel-title">\n								<a data-toggle="collapse" href="#collapseInvited" class="collapsed">\n                                    <i class="micon-arrow-right" /><span class="item-title">{{lang.pending_invitations}} <span class="invitation-count"></span></span>\n								</a>\n							</h4>\n						</div>\n						<div id="collapseInvited" class="panel-collapse collapse">\n							<div class="invitation-contact-list">\n\n							</div>\n						</div>\n					</div>\n				</div>\n\n\n\n				<div class="mx-contact-normal panel-group">\n					<div class="mx-panel  panel-default">\n						<div class="panel-heading">\n							<h4 class="panel-title">\n								<a data-toggle="collapse" href="#collapseNormal" class="">\n                                    <i class="micon-arrow-right" /><span class="item-title">{{lang.contacts}} <span class="normal-count"></span></span>\n								</a>\n							</h4>\n						</div>\n						<div id="collapseNormal" class="panel-collapse collapse in">\n							<div class="normal-contact-list">\n\n							</div>\n							<div class="mx-contact-empty">\n								<div class="container">\n									<div class="row">\n										<div class="col-md-12 contact-loading">{{lang.loading}}</div>\n									</div>\n								</div>\n							</div>\n						</div>\n\n					</div>\n				</div>\n\n			</div>\n		</div>\n	</div>\n	<div id="mxPageBody_Col_2">\n\n	</div>\n</div>\n';
}), define("text!template/contacts/contactListItem.html", [], function() {
    return '<li data-action="showContactDetail" data-param="{{user.id}},{{user.email}}">\n    <div class="mx-item normal-item">\n		<img src="{{avatar}}" />\n		{{#if online}}\n		<i class="icon-presence online"></i>\n		{{/if}}\n		<div class="user-info">\n			<div class="user-name"><strong>{{user.name}}</strong></div>\n			<div class="user-email">{{user.email}}</div>\n			<div class="user-phone">{{user.phone_number}}</div>\n		</div>\n	</div>\n</li>\n';
}), define("text!template/contacts/bizDirectoryListItem.html", [], function() {
    return '<li {{#if isVirtualUser}}data-action="showSubList" data-param="{{division}},{{sequence}}"{{else}}data-action="showBizContactDetail" data-param="{{user.primaryKey}}"{{/if}}>\n<div class="mx-item biz-item">\n    <img src="{{#if isVirtualUser}}{{directory}}{{else}}{{avatar}}{{/if}}" />\n    {{#if isVirtualUser}}<a class="pull-right"><i class="micon-arrow-right"/></a>{{/if}}\n    <div class="user-info">\n        {{#if isVirtualUser}}\n            <div class="org-name"><strong>{{user.name}}</strong></div>\n        {{else}}\n        <div class="user-name"><strong>{{user.name}}</strong></div>\n        <div class="user-email">{{user.email}}</div>\n        <div class="user-phone">\n            {{#if division}}\n                {{division}}{{#if department}} - {{department}}{{/if}}\n            {{else}}\n                {{#if department}}\n                    {{department}}\n                {{else}}\n                    {{user.phone}}\n                {{/if}}\n            {{/if}}\n        </div>\n        {{/if}}\n    </div>\n</div>\n</li>\n';
}), define("text!template/contacts/addContact.html", [], function() {
    return '<div class="new-contact-wrap">\r\n	<span class="new-contact-item">{{contact}}</span> \r\n	{{#if format}}\r\n	<a data-action="invite" data-param="{{contact}}" class="mouse-hand pull-right"><i class="glyphicon glyphicon-plus-sign add-contact"></i></a>\r\n	{{else}}\r\n	<span class="pull-right"><i class="glyphicon glyphicon-plus-sign add-contact disabled"></i></span>\r\n	{{/if}}\r\n	<div class="new-contact-tip">{{lang.invite_by_email}}</div>\r\n</div>';
}), define("text!template/contacts/team/teamItem.html", [], function() {
    return '<li data-action="showTeam" data-param="{{group.id}}">\n	<div class="mx-item team-item">\n		<img src="{{group.avatar}}" class="mx-noborder mx-noborder-radius"/>\n\n		<div class="team-action">\n			<div class="team-name" ta-param="{{group.name}}"><strong>{{group.name}}</strong> {{#if isOwner}}<span class="team-owner-flag" title="{{lang.team_owner_responsibility_description}}" data-placement="top">{{lang.owned}}</span>{{/if}}</div>\n			<div class="team-member-count">{{i18nCount group.members.length lang.member lang.members}}</div>\n		</div>\n	</div>\n</li>';
}), define("text!template/contacts/contactDetail.html", [], function() {
    return '<div class="mx-contact-detail">\n	{{#if isBiz}}\n	<div class="biz linear-red-bg pull-right"><span class="pull-right biz-name">{{bizName}}</span></div>\n	{{/if}}\n	<div class="user-panel">\n		<ul class="user-info">\n			<li>\n				<span class="user-name">{{user.user.name}}</span>\n			</li>\n			<li>\n				{{user.user.email}}\n			</li>\n			{{#if user.user.email}}\n				{{#unless user.user.email_verified}}\n				<li>\n					<i>{{lang.not_verified_with_parentheses}}</i>\n				</li>\n				{{/unless}}\n			{{/if}}\n			<li>\n				{{user.user.phone_number}}\n			</li>\n            {{#if user.division}}\n                <li>\n                    {{user.division}}{{#if user.department}} - {{user.department}}{{/if}}\n                </li>\n            {{else}}\n                <li>\n                {{#if user.department}}\n                    {{user.department}}\n                {{/if}}\n                </li>\n            {{/if}}\n\n			{{#unless isBiz}}\n			<li class="marginTop5">\n				<a class="mouse-hand action-delete" data-action="deleteContact" data-param="{{user.sequence}},{{user.user.id}}"><i class="micon-trash size12"></i> {{lang.delete}}</a>\n			</li>\n			{{/unless}}\n		</ul>\n		<div class="mx-user contact-avatar">\n			<img class="img-circle" src="{{user.avatar}}">\n			{{#if user.online}}\n			<i class="icon-presence online"></i>\n			{{/if}}\n		</div>\n	</div>\n	<div class="contact-actions">\n		<a class="mx-btn mx-blue mouse-hand" data-action="startChat" data-param="{{user.user.email}}">\n            <span class="mx-cricle"><i class="micon-chat-big size32"></i></span><label>{{lang.chat}}</label>\n        </a>\n\n        <a class="mx-btn mx-orange mouse-hand" href="#mymeet?action=start_with_contact&email={{user.user.email}}" target="{{meetTabName}}" oncontextmenu="return false;">\n            <span class="mx-cricle"><i class="micon-meet-big size32"></i></span><label>{{lang.meet}}</label>\n        </a>\n	</div>\n	<div class="shared-binders">\n		<div class="shared-title">\n\n		</div>\n		<div class="shared-list">\n\n		</div>\n	</div>\n	<div></div>\n</div>\n';
}), define("text!template/contacts/sharedBinderItem.html", [], function() {
    return '<div class="clearfix">\n	<div class="mx-item shared-item" data-action="gotoBinder" data-param="{{boardId}}">\n		<div class="mx-cover-wrap mx-cover-sm pull-left shared-item-cover" data-action="gotoBinder" data-param="{{boardId}}">\n			<span class="mx-cover-img ">\n				<!-- <img src="{{blankImg}}" class="lazy" data-original="{{thumbnail_small}}"/> -->\n				<img src="{{thumbnail_small}}"   class="lazy"/>\n			</span>\n		</div>\n		<span class="shared-item-title">{{name}}</span>\n    </div>\n</div>\n';
}), define("contacts/sharedBinderCollection", [ "moxtra", "binder/binderModel", "const" ], function(a, b, c) {
    return a.Collection.extend({
        model: b,
        fetch: function(a) {
            new MX.ChainObject(function() {
                MX.api(MX.format("/contacts/{0}/binders", a), "GET", null, this.callback, this);
            }).scope(this).success(this._parseData);
        },
        comparator: function(a) {
            var b = a.get("name") || "";
            return b.toLowerCase();
        },
        _parseData: function(a) {
            a.data = MX.filter(a.data, function(a) {
                return a.board && a.board.name || (a.board.name = Moxtra.api.util.getBoardName(a)), 
                a.status === c.binder.status.member;
            }), this.reset(a.data, {
                parse: !0
            });
        }
    });
}), define("contacts/contactDetail", [ "moxtra", "lang", "const", "app", "text!template/contacts/contactDetail.html", "text!template/contacts/sharedBinderItem.html", "contacts/sharedBinderCollection", "meet/meet" ], function(a, b, c, d, e, f, g, h) {
    var i = Handlebars.compile(e), j = Handlebars.compile(f);
    return a.Controller.extend({
        template: '<div class="page-body contact"></div>',
        handleAction: !0,
        init: function() {
            this.sharedBinders = new g(), this.listenTo(this.sharedBinders, "reset", this.updateBinders);
        },
        rendered: function() {},
        updateView: function(a) {
            var c = Moxtra.getMyGroup() || {}, e = a.status === Moxtra.const.GROUP_MEMBER || a.status === Moxtra.const.GROUP_INVITED;
            this.$el.empty(), this.$el.html($(i({
                lang: b,
                user: a.toJSON(),
                meetTabName: d.config.global.meetTabName,
                isBiz: e,
                bizName: c.name
            }))), e || a.user.id && this.sharedBinders.fetch(a.user.id);
        },
        updateBinders: function(a) {
            var d = this.$(".shared-list"), e = a.length, f = "";
            f = MX.format(b.shared_binders_with_parentheses, e), this.$(".shared-title").html(MX.escapeHTML(f)), 
            d.empty(), MX.each(a.models, function(a) {
                var b = a.toJSON();
                d.append($(j({
                    boardId: b.boardId,
                    thumbnail_small: b.thumbnail_small,
                    blankImg: c.defaults.blankImg,
                    defaultBoardAvatar: Moxtra.config.defaults.binder_cover,
                    name: b.name
                })));
            });
        },
        gotoBinder: function(a) {
            d.navigate("/timeline/" + a, !0);
        },
        deleteContact: function(a, c) {
            if (a) {
                var d = Moxtra.getUserContact(a), e = this;
                d && MX.ui.Confirm(b.confirm_delete_contact, function() {
                    e.$el.loading(), d.delete().success(function() {
                        MX.ui.notifySuccess(b.contact_delete_success), e.$el.empty(), e.trigger("deleted", c);
                    }).error(function() {
                        MX.ui.notifyError(b.contact_delete_failed);
                    }).complete(function() {
                        e.$el.loading(!1);
                    });
                });
            }
        },
        startChat: function(a) {
            function c() {
                f.loading(!1), f.removeClass("disabled");
            }
            var e = this.handleEvent, f = $(e.currentTarget);
            f.hasClass("disabled") || (f.loading(), f.addClass("disabled"), Moxtra.startChat({
                email: a
            }).success(function(a) {
                c(), d.navigate("/timeline/" + a.id);
            }).error(function() {
                c(), MX.ui.notifyError(b.contact_start_meet_failed);
            }));
        },
        startMeet: function(a) {
            function c() {
                e.loading(!1), e.removeClass("disabled");
            }
            var d = this.handleEvent, e = $(d.currentTarget);
            e.hasClass("disabled") || (e.loading(), e.addClass("disabled"), h.start({
                users: [ a ],
                success: function() {
                    c();
                },
                error: function() {
                    c(), MX.ui.notifyError(b.contact_start_chat_failed);
                }
            }));
        }
    });
}), define("text!template/contacts/teamDetail.html", [], function() {
    return '<div class="mx-contact-detail">\n	<div class="contact-team-title">\n		<h3>\n			<span class="team-name">{{team.name}}</span>\n			{{#if isOwner}}\n			<a class="action mouse-hand size14 blue" data-action="editName">\n				<i class="micon-pencil size12 blue"></i> {{lang.edit}}\n			</a>\n			<a class="action mouse-hand size14 blue marginLeft5" data-action="deleteTeam">\n				<i class="micon-trash size12 blue"></i> {{lang.delete}}\n			</a>\n			{{/if}}\n		</h3>\n	</div>\n	{{!-- Don\'t show Chat/Meet --}}\n	{{!--\n	<div class="contact-actions">\n		<a class="mx-btn mx-blue mouse-hand" data-action="startChat" data-param="">\n            <span class="mx-cricle"><i class="micon-chat-big size32"></i></span><label>{{lang.chat}}</label>\n        </a>\n\n        <a class="mx-btn mx-orange mouse-hand" href="#mymeet?action=start_with_contacts&index={{meetIndex}}" target="{{meetTabName}}" data-action="startMeet" oncontextmenu="return false;">\n            <span class="mx-cricle"><i class="micon-meet-big size32"></i></span><label>{{lang.meet}}</label>\n        </a>\n	</div>\n	--}}\n	<div class="detail-section">\n		<div class="detail-section-title">\n			<span>{{lang.team_members}} (<span class="members-count">{{team.members.length}}</span>)</span>\n			<span class="pull-right">\n				<a class="btn btn-link" data-action="addMember">{{lang.add_member}}</a>\n			</span>\n		</div>\n		<div class="team-members detail-section-list">\n			\n		</div>\n	</div>\n	{{!-- Don\'t show Shared Binders --}}\n	{{!--\n	<div class="detail-section">\n		<div class="detail-section-title">\n			<span>{{sharedBindersCount}}</span>\n			<!-- <span class="pull-right">\n				<i class="micon-arrow-down"></i>\n			</span> -->\n		</div>\n		<div class="team-shared-binders detail-section-list">\n			<ul class="mx-list">\n				<li class="mx-item mouse-hand">\n					<div class="section-item">\n						<img src="themes/images/binder/cover_project-websm.7f70d3f8.png" />\n\n						<div class="section-info">\n							Shared binder A\n						</div>\n					</div>\n				</li>\n				<li class="mx-item mouse-hand">\n					<div class="section-item">\n						<img src="themes/images/binder/cover_project-websm.7f70d3f8.png" />\n\n						<div class="section-info">\n							Shared binder B\n						</div>\n					</div>\n				</li>\n			</ul>\n		</div>\n	</div>\n	--}}\n</div>';
}), define("text!template/contacts/team/memberItem.html", [], function() {
    return '<li class="mx-item" ta-param="{{user.email}}">\n	<div class="section-item">\n		<img src="{{avatar}}" />\n\n		<div class="section-info">\n			<div>\n				<strong>{{user.name}}</strong> \n				{{#if isOwner}}\n					({{lang.group_owner}}{{#if isMe}}, {{lang.me_lower_case}}{{/if}})\n				{{else}}\n					{{#if isMe}}\n					{{lang.me_with_parentheses}}\n					{{/if}}\n				{{/if}}\n			</div>\n			<div>{{user.email}}</div>\n		</div>\n		<div class="section-action">\n			<span class="pull-right">\n				{{#unless isOwner}}\n					{{#if isMe}}\n					<a class="btn btn-link" data-action="leaveTeam">{{lang.leave}}</a>\n					{{else}}\n					<a class="btn btn-link" data-action="deleteMember" data-param="{{sequence}}">{{lang.delete}}</a>\n					{{/if}}\n				{{/unless}}\n			</span>\n			{{#if isTeamOwner}}\n				{{#if user.id}}\n				{{#unless isOwner}}\n				<span class="pull-right">\n					<a class="btn btn-link" data-action="reassignTeamOwner" data-param="{{sequence}}">{{lang.set_as_team_owner}}</a>\n				</span>\n				{{/unless}}\n				{{/if}}\n			{{/if}}\n		</div>\n	</div>\n</li>';
}), define("contacts/teamDetail", [ "moxtra", "lang", "const", "app", "text!template/contacts/teamDetail.html", "text!template/contacts/team/memberItem.html", "component/dialog/inputDialog" ], function(a, b, c, d, e, f, g) {
    "use strict";
    var h = Handlebars.compile(e);
    return a.Controller.extend({
        template: '<div class="page-body team hide"></div>',
        handleAction: !0,
        init: function() {},
        rendered: function() {},
        updateView: function(a) {
            this.model = a, this.$el.empty();
            var b = this;
            this.stopListening(), this.listenTo(a.group, "change:name", function() {
                b.$(".team-name").html(a.group.name);
            }), this.listenTo(a.group, "change:members", function() {
                b.$(".members-count").html(a.group.members.length);
            }), this.listenTo(a, "change:type", function() {
                b._renderDetail();
            }), this.$el.loading(), Moxtra.loadTeam(a.group.id).success(function() {
                b.$el.loading(!1), b._renderDetail();
            }).error(function() {
                b.$el.loading(!1);
            });
        },
        _renderDetail: function() {
            this.$el.html($(h({
                lang: b,
                isOwner: this.model.isOwner,
                team: this.model.group
            }))), this._renderMembers();
        },
        _renderMembers: function() {
            this.memberList = new a.List({
                renderTo: ".team-members",
                template: f,
                sortable: !1,
                $scope: {
                    lang: b,
                    isTeamOwner: this.model.isOwner
                }
            });
            var c = this.model.group.members.clone({
                sortFn: function(a, b) {
                    if (a.isOwner) return -1;
                    if (b.isOwner) return 1;
                    if (a.isMe) return -1;
                    if (b.isMe) return 1;
                    var c = (a.user.name || a.user.email || "").toLowerCase(), d = (b.user.name || b.user.email || "").toLowerCase();
                    return d > c ? -1 : c > d ? 1 : 0;
                }
            });
            this.memberList.binding(c), this.recovery(this.memberList), this.recovery(c);
        },
        editName: function() {
            var c = this.model.group, d = c.name, e = a.Model.extend({
                idAttribute: "name",
                defaults: {
                    name: ""
                },
                validation: {
                    name: {
                        required: !0
                    }
                }
            }), f = new e();
            f.set("name", c.name);
            var h = new g({
                model: f,
                title: b.update,
                input: {
                    name: "name",
                    value: d,
                    placeholder: b.team_name
                },
                buttons: [ {
                    text: b.cancel,
                    position: "left",
                    click: function() {
                        this.pop();
                    }
                }, {
                    id: "btnUpdateName",
                    text: b.update,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    var a = this, e = function() {
                        c.set("name", d), a.dialog.close();
                    };
                    this.dialog.progress(), f.isValid(!0) && f.get("name") !== d && (c.set("name", f.get("name")), 
                    c.update("name").success(function() {
                        MX.ui.notifySuccess(b.update_team_name_success), a.dialog.close();
                    }).error(function() {
                        MX.ui.notifyError(b.update_team_name_failed), e();
                    }));
                }
            });
            new MX.ui.Dialog({
                content: h
            });
        },
        deleteTeam: function() {
            var a = this.model.group.members.length, c = this;
            if (1 === a) MX.ui.Confirm(b.confirm_delete_team, function() {
                c.model.group.deleteTeam().success(function() {
                    MX.ui.notifySuccess(b.delete_team_success), c.$el.empty(), c.trigger("deleted");
                }).error(function() {
                    MX.ui.notifyError(b.delete_team_failed);
                });
            }); else {
                if (!(a > 1)) return;
                MX.ui.Alert(b.delete_team_condition_warning);
            }
        },
        addMember: function() {
            var a, c = this;
            return c._exceedLimit() ? void c._alertExceedLimit() : (a = new MX.ui.UserSelector({
                title: b.add_member,
                teamsPanel: !1,
                buttons: [ {
                    position: "left",
                    text: b.cancel,
                    click: function() {
                        this.pop();
                    }
                }, {
                    position: "right",
                    text: b.add,
                    className: "btn-primary",
                    click: "onSelectDone",
                    id: "btnAddMember",
                    disabled: !0
                } ],
                onChange: function() {
                    var a = this.dialog.getButton("btnAddMember");
                    this.value().length > 0 ? a.removeClass("disabled") : a.addClass("disabled");
                },
                onSelectDone: function() {
                    var a = this.value(), d = [];
                    return c._exceedLimit(a.length) ? (c._alertExceedLimit(), void this.dialog.close()) : (a.each(function(a) {
                        d.push({
                            email: a.get("email")
                        });
                    }), c.model.group.addTeamMembers(d).success(function() {
                        MX.ui.notifySuccess(b.add_member_success);
                    }).error(function() {
                        MX.ui.notifyError(b.add_member_failed);
                    }), void this.dialog.close());
                }
            }), void new MX.ui.Dialog({
                content: a
            }));
        },
        deleteMember: function(a) {
            var c = this;
            MX.ui.Confirm(b.confirm_delete_member, function() {
                c.model.group.removeGroupUser({
                    sequence: parseInt(a)
                }).success(function() {
                    MX.ui.notifySuccess(b.delete_member_success);
                }).error(function() {
                    MX.ui.notifyError(b.delete_member_failed);
                });
            });
        },
        leaveTeam: function() {
            var a = this;
            MX.ui.Confirm(b.confirm_leave_team, function() {
                a.model.group.leaveTeam().success(function() {
                    MX.ui.notifySuccess(b.leave_team_success), a.$el.empty(), a.trigger("deleted", a.model);
                }).error(function() {
                    MX.ui.notifyError(b.leave_team_failed);
                });
            });
        },
        reassignTeamOwner: function(a) {
            var c = this;
            MX.ui.Confirm(b.confirm_reassing_team_owner, function() {
                c.model.group.reassignTeamOwner(parseInt(a)).success(function() {
                    MX.ui.notifySuccess(b.set_team_owner_success);
                }).error(function() {
                    MX.ui.notifyError(b.set_team_owner_failed);
                });
            });
        },
        startChat: function() {},
        startMeet: function() {},
        _getUsers: function() {},
        _exceedLimit: function(a) {
            a = a || 0;
            var b = !1, c = Moxtra.getMe().cap.team_users_max, d = this.model.group.members.length;
            return d + a > c && (b = !0), b;
        },
        _alertExceedLimit: function() {
            MX.ui.notifyError(MX.format(b.common_msg_reach_limit_team_members, Moxtra.getMe().cap.team_users_max));
        }
    });
}), define("text!template/contacts/newTeamForm.html", [], function() {
    return '<div class="new-team">\n	<div id="newTeamForm">\n		<div class="form-group">\n			<input id="newTeamName" type="text" placeholder="{{lang.team_name}}" data-error-style="inline" class="form-control" name="teamName" autofocus>\n		</div>\n	</div>\n	<div class="user-selector">\n		\n	</div>\n</div>';
}), define("contacts/newTeamForm", [ "moxtra", "lang", "app", "text!template/contacts/newTeamForm.html", "component/selector/userSelector" ], function(a, b, c, d) {
    "use strict";
    return a.Controller.extend({
        title: b.create_team,
        template: d,
        handleAction: !0,
        buttons: [ {
            position: "left",
            text: b.cancel,
            className: "btn-default",
            click: "onCancel"
        }, {
            id: "btnAddTeam",
            position: "right",
            loadingText: b.creating_ellipsis,
            text: b.create,
            className: "btn-primary disabled",
            click: "onAdd"
        } ],
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {
            var a = this;
            this.userSelector = new MX.ui.UserSelector({
                autoFocus: !1,
                expandSelected: !1,
                notifySelected: !0,
                needMessage: !1,
                teamsPanel: !1,
                onChange: function() {
                    a.selectedMembers = this.value();
                }
            }), this.userSelector.renderTo(this.$(".user-selector")), this.$("input#newTeamName").on("keyup mouseleave", function() {
                a.teamName = $(this).val().trim(), a._detectCondition();
            });
        },
        onCancel: function() {
            this.dialog.close();
        },
        onAdd: function() {
            var a = new Moxtra.model.Group(), c = this.dialog.getButton("btnAddTeam"), d = this;
            a.set("name", this.teamName), a.set("isTeam", !0), c.button("loading"), a.create().success(function() {
                var c = d._members();
                c.length && a.addTeamMembers(c).success(function() {}).error(function() {}), MX.ui.notifySuccess(b.create_team_success), 
                setTimeout(function() {
                    $('.mx-contact-team .team-list li[data-param="' + a.id + '"]').trigger("click");
                }, 500), d.dialog.close();
            }).error(function() {
                c.button("reset"), MX.ui.notifyError(b.create_team_failed);
            });
        },
        _detectCondition: function() {
            var a = this.dialog.getButton("btnAddTeam");
            this.teamName ? a.removeClass("disabled") : a.addClass("disabled");
        },
        _members: function() {
            var a = [];
            return this.selectedMembers && this.selectedMembers.each(function(b) {
                a.push({
                    email: b.get("email")
                });
            }), a;
        }
    });
}), define("contacts/contacts", [ "moxtra", "lang", "app", "const", "text!template/contacts/contactList.html", "text!template/contacts/contactListItem.html", "text!template/contacts/bizDirectoryListItem.html", "text!template/contacts/addContact.html", "text!template/contacts/team/teamItem.html", "contacts/contactDetail", "contacts/teamDetail", "contacts/newTeamForm", "contacts/contactBiz" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n = MX.logger("contacts"), o = Handlebars.compile(h), p = "({0})";
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        NORMAL: "1",
        BIZ: "3",
        TEAM: "4",
        init: function() {
            this.$scope.lang = b, this.contactId = c.request.page(), this.contactType = c.request.sequence();
            var a = this;
            a.listenTo(c.request, "change:page", function() {
                c.request.changed.page && c.request.sequence() && (a.contactId = c.request.page(), 
                a.contactType = c.request.sequence(), a._handleRefresh(a.contactType));
            }), $(this.container).addClass("mx-layout-three");
        },
        rendered: function() {
            var c = this;
            this.view || (this.view = new j({
                renderTo: "#mxPageBody_Col_2"
            }), this.view.on("deleted", function(a) {
                c._onContactDeleted(a);
            })), this.teamDetail || (this.teamDetail = new k({
                renderTo: "#mxPageBody_Col_2"
            }), this.teamDetail.on("deleted", function(a) {
                c._onTeamDeleted(a);
            })), MX.env.isIE && this.$(".top-bar input").placeholder(), this.list = new a.List({
                renderTo: ".normal-contact-list",
                template: f,
                sortable: !1,
                $scope: {
                    lang: b,
                    blankImg: d.defaults.blankImg
                }
            }), this.teamList = new a.List({
                renderTo: ".team-list",
                template: i,
                hideLoading: !0,
                syncField: {
                    group: [ "name", "members" ]
                },
                sortable: !1,
                $scope: {
                    lang: b
                }
            }), MX.loading(!0), Moxtra.onReady(function() {
                MX.loading(!1), c.registerObject("bizContacts", Moxtra.getBizDirectory()), c.bizContacts && (c.bizList = new a.List({
                    parent: c,
                    renderTo: ".business-contact-list",
                    template: g,
                    sortable: !1,
                    $scope: {
                        lang: b,
                        blankImg: d.defaults.blankImg,
                        directory: d.defaults.directory.avatar
                    }
                }), c.bizContacts.once("inited", function() {
                    c.$(".contact-loading").html(b.no_contacts), c.bizContacts.length && (c.myGroup = Moxtra.getMyGroup(), 
                    c.$(".business-count").html(MX.format(p, c.bizContacts.length)), c.$(".mx-contact-business").removeClass("hide").find(".item-title").attr("title", c.myGroup.name).text(c._ellipsisBusinessDirectory(c.myGroup.name)), 
                    c.$(".mx-contact-empty").addClass("hide"), c.$(".mx-contact-business").find(".item-title").tooltip()), 
                    c._handleRefresh(c.BIZ);
                }), c.bizList.binding(c.bizContacts), c.recovery(c.bizContacts)), c.contacts = Moxtra.getUserContacts(), 
                c.contacts.once("inited", function() {
                    c.$(".contact-loading").html(b.no_contacts), c.contacts.length && (c.$(".normal-count").html(MX.format(p, c.contacts.length)), 
                    c.$(".mx-contact-normal").removeClass("hide"), c.$(".mx-contact-empty").addClass("hide"), 
                    c.contactId || setTimeout(function() {
                        c.$(".normal-contact-list ul li:eq(0)").trigger("click");
                    }, 500)), c._handleRefresh(c.NORMAL);
                }), c.list.binding(c.contacts), c.recovery(c.contacts), c.teams = Moxtra.getTeams(), 
                c.teams.once("inited", function() {
                    c._updateTeams(), c._handleRefresh(c.TEAM);
                }), c.listenTo(c.teams, "add", c._updateTeams), c.listenTo(c.teams, "remove", c._updateTeams), 
                c.teamList.binding(c.teams), c.recovery(c.teams);
            }), this.$(".mx-contacts input").on("keyup", $.proxy(this.filterContact, this)), 
            c.$el.tooltip({
                selector: ".team-owner-flag"
            });
        },
        filterContact: function(a) {
            var c = ($(a.target).val() || "").toLowerCase();
            c.length > 0 ? this.$(".input-close").removeClass("hide") : this.$(".input-close").addClass("hide");
            var d = !1, e = !1, f = !1, g = function(a) {
                var b = a.user, d = (b.displayName || "").toLowerCase(), e = (b.email || "").toLowerCase(), g = b.phone_number, h = m.filterUser(c, [ d, e, g ]);
                return !f && h && (f = !0), h;
            };
            if (this.list && (this.list.filter(g), this.list.collection.length ? (this.$(".mx-contact-normal").removeClass("contact-hide"), 
            this.$(".normal-count").html(MX.format(p, this.list.collection.length))) : (this.$(".mx-contact-normal").addClass("contact-hide"), 
            d = !0)), this.bizList && (c.length > 0 ? this.registerObject("bizContacts", Moxtra.searchBizContact(c)) : this.registerObject("bizContacts", Moxtra.getBizDirectory()), 
            this.bizContacts && this.bizContacts.length ? (this.bizList.binding(this.bizContacts), 
            this.$(".mx-contact-business").removeClass("contact-hide"), this.$(".mx-contact-business").find(".item-title").attr("title", this.myGroup.name).text(this._ellipsisBusinessDirectory(this.myGroup.name)), 
            this.$(".business-count").html(MX.format(p, this.bizContacts.length)), this.$(".biz-back").addClass("hide")) : (this.$(".mx-contact-business").addClass("contact-hide"), 
            e = !0)), !f && c) {
                var h = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                this.$(".new-contact").html($(o({
                    contact: c,
                    format: h.test(c),
                    lang: b
                }))), this.$(".mx-contact-empty").addClass("contact-hide");
            } else this.$(".new-contact").empty(), this.$(".mx-contact-empty").removeClass("contact-hide");
        },
        reset: function() {
            var a = this.$(".mx-contacts input");
            a.val("").focus(), a.trigger("keyup");
        },
        showBizContactDetail: function(a) {
            var b = Moxtra.getMyGroup().members.get(a);
            this.$(".mx-list li").removeClass("active"), this.$("#" + b.$id).addClass("active");
            var d = b.toJSON();
            c.request.page(d.user.primaryKey, !1), c.request.sequence(this.BIZ, !1), this.view.updateView(b);
        },
        showSubList: function(a, b) {
            var c = this.bizContacts.get(b);
            c.isDivision ? this.registerObject("bizContacts", Moxtra.getBizDirectory({
                division: c.user.name
            })) : this.registerObject("bizContacts", Moxtra.getBizDirectory({
                division: a,
                department: c.user.name
            })), this.bizContacts.length && this._updateBizTitle(c.user.name);
        },
        _updateBizTitle: function(a) {
            this.$(".mx-contact-business").find(".item-title").attr("title", a).text(this._ellipsisBusinessDirectory(a)), 
            this.$(".business-count").html(MX.format(p, this.bizContacts.length)), this.bizList.binding(this.bizContacts), 
            this.$(".biz-back").removeClass("hide");
        },
        returnBizLibrary: function() {
            var a = this.handleEvent;
            a && a.stopPropagation();
            var b = this.bizContacts[0];
            return b.department && b.division ? (this.registerObject("bizContacts", Moxtra.getBizDirectory({
                division: b.division
            })), void this._updateBizTitle(b.division)) : (this.registerObject("bizContacts", Moxtra.getBizDirectory()), 
            this.bizList.binding(this.bizContacts), this.$(".mx-contact-business").find(".item-title").attr("title", this.myGroup.name).text(this._ellipsisBusinessDirectory(this.myGroup.name)), 
            this.$(".business-count").html(MX.format(p, this.bizContacts.length)), void this.$(".biz-back").addClass("hide"));
        },
        showContactDetail: function(a, b) {
            var c = a || b;
            if (c) {
                var d = this.contacts.get(c);
                d && this._showDetail(d, c);
            }
        },
        invite: function(a) {
            var d = this.handleEvent, e = this, f = $(d.target), g = f.closest("div.new-contact");
            f.hasClass("disabled") || (f.addClass("disabled"), g.loading({
                length: 4
            }), Moxtra.startChat({
                email: a
            }).success(function(d) {
                MX.ui.notifySuccess(b.contact_invite_success), f.removeClass("disabled"), g.loading(!1), 
                e.reset(), d && d.id && c.request.navigate("timeline", d.id), Moxtra.getMe().inviteContacts(a);
            }).error(function() {
                MX.ui.notifyError(b.contact_invite_failed), f.removeClass("disabled"), g.loading(!1);
            }));
        },
        resend: function(a) {
            var c = this;
            c._detailProgress(!0), m.resend(a).success(function() {
                MX.ui.notifySuccess(b.contact_resend_success), c._detailProgress(!1);
            }).error(function() {
                MX.ui.notifyError(b.contact_resend_failed), c._detailProgress(!1);
            });
        },
        accept: function(a) {
            var c = this.handleEvent, d = this, e = $(c.target), f = e.closest("li");
            e.addClass("disabled"), f.loading({
                length: 4
            }), m.accept(a).success(function() {
                MX.ui.notifySuccess(b.invite_accept_success), e.removeClass("disabled"), f.loading(!1), 
                model.set({
                    isNormal: !0,
                    isInvited: !1
                }), d.contacts.add(model), d.$("#" + model.cid).trigger("click");
            }).error(function() {
                MX.ui.notifyError(b.invite_accept_failed), e.removeClass("disabled"), f.loading(!1);
            });
        },
        decline: function(a) {
            var c = this.handleEvent, d = $(c.target), e = d.closest("li");
            MX.ui.Confirm(b.invite_decline_confirm, function() {
                d.addClass("disabled"), e.loading({
                    length: 4
                }), m.decline(a).success(function() {
                    MX.ui.notifySuccess(b.invite_decline_success), d.removeClass("disabled"), e.loading(!1);
                }).error(function() {
                    MX.ui.notifyError(b.invite_decline_failed), d.removeClass("disabled"), e.loading(!1);
                });
            });
        },
        showTeam: function(a) {
            var b = this.teams.get(a);
            b && ($("#mxPageBody_Col_2 .page-body.contact").addClass("hide"), $("#mxPageBody_Col_2 .page-body.team").removeClass("hide"), 
            this.$(".mx-list li").removeClass("active"), this.$("#" + b.$id).addClass("active"), 
            c.request.page(a, !1), c.request.sequence(this.TEAM, !1), this.teamDetail.updateView(b));
        },
        addNewTeam: function() {
            var a = new l();
            this.recovery(a), new MX.ui.Dialog({
                content: a,
                disableKeyboard: !0
            });
        },
        _showDetail: function(a, b) {
            $("#mxPageBody_Col_2 .page-body.contact").removeClass("hide"), $("#mxPageBody_Col_2 .page-body.team").addClass("hide"), 
            this.$(".mx-list li").removeClass("active"), this.$("#" + a.$id).addClass("active"), 
            c.request.page(b, !1), c.request.sequence(this.NORMAL, !1), this.view.updateView(a);
        },
        _detailProgress: function(a) {
            this.view && this.view.progress(a ? !0 : !1);
        },
        _updateTeams: function() {
            this.$(".team-count").html(MX.format(p, this.teams.length));
        },
        _handleRefresh: function(a) {
            if (this.contactId && this.contactType && this.contactType === a) {
                var b, c, d = this;
                switch (this.contactType) {
                  case this.NORMAL:
                    b = this.contacts.get(this.contactId);
                    break;

                  case this.BIZ:
                    b = Moxtra.getMyGroup().members.get(this.contactId), c = function() {
                        d.$(".mx-contact-business h4 a").trigger("click");
                    };
                    break;

                  case this.TEAM:
                    b = this.teams.get(this.contactId), c = function() {
                        var a = d.$(".mx-contact-team h4 a");
                        a.hasClass("collapsed") && a.trigger("click");
                    };
                }
                if (b) {
                    var e = "", f = "", g = !1;
                    b.division && (e = b.division, g = !0), b.department && (f = b.department, g = !0), 
                    g && (this.registerObject("bizContacts", Moxtra.getBizDirectory({
                        division: e,
                        department: f
                    })), this.bizContacts.length && this._updateBizTitle(f || e)), setTimeout(function() {
                        n.log("trigger item after refresh"), c && c();
                        var a = d.$("#" + b.$id);
                        a.trigger("click"), $("#mxPageBody_Col_1").scrollTop(a.offset().top);
                    }, 500);
                }
            }
        },
        _onContactDeleted: function() {
            var a;
            this.$(".normal-count").html(MX.format(p, this.contacts.length)), this.contacts.length > 0 ? (a = "#" + this.contacts.at(0).$id, 
            this.$(a).trigger("click"), $(a).length && $("#mxPageBody_Col_1").scrollTop($("#mxPageBody_Col_1").scrollTop() + $(a).offset().top - $(a).height())) : (this.$(".mx-contact-normal").addClass("hide"), 
            c.request.page("", !1), c.request.sequence("", !1), this.bizContacts && this.bizContacts.length || this.$(".mx-contact-empty").removeClass("hide"));
        },
        _onTeamDeleted: function(a) {
            a && this.teams.remove(a);
            var b = this.teams.length;
            if (this.$(".team-count").html(MX.format(p, b)), b) {
                var c = $("#" + this.teams.at(0).$id);
                c.trigger("click"), c.length && $("#mxPageBody_Col_1").scrollTop($("#mxPageBody_Col_1").scrollTop() + c.offset().top - c.height());
            } else this._onContactDeleted();
        },
        _ellipsisBusinessDirectory: function(a) {
            var b = 20;
            return a > b && (a = a.substr(0, 20) + "..."), a;
        }
    });
}), define("api/team", [ "moxtra", "app", "lang", "contacts/contacts" ], function(a, b, c, d) {
    "use strict";
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = a.renderTo, g = e.params(), h = e.page();
            delete a.renderTo, MX.loading(!0);
            var i = $(f).MoxtraPowerBy(!0), j = function() {
                MX.loading(!1), i.addClass("for-chat"), d.prototype.init.call(c, a), c.renderTo(f), 
                h && e.page(h + "/4", !0);
            };
            Moxtra.verifyToken(g).success(function() {
                Moxtra.onReady(function() {
                    return g.header ? (MX.loading(!1), void b.request.navigate("contacts", h, 4)) : void j(Moxtra.getMe());
                });
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                }), MX.loading(!1);
            });
        }
    });
}), define("text!template/timeline/timelineList.html", [], function() {
    return '<div class="page-body ">\r\n    <div id="mxPageBody_Col_1">\r\n        <div class="list-head">\r\n            <div class="timeline-filter mx-branding-newbinder">\r\n\r\n                <div class="btn-group" id="timelineFilter">\r\n                    <button type="button" class="btn btn-default dropdown-toggle marginRight5" data-toggle="dropdown">\r\n                        <span class="dropmenu-label current-category ellipsis">{{lang.all_binders}}</span> <span class="caret"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu category-list" role="menu">\r\n                        <li class="default-category">\r\n                            <a class="mouse-hand" data-action="filterTimeline" data-param="all"><i class="micon-binder"/>{{lang.all_binders}}</a>\r\n                        </li>\r\n                        <li class="default-category">\r\n                            <a class="mouse-hand" data-action="filterTimeline" data-param="favorite"><i class="micon-star-empty"/>{{lang.favorites}}</a>\r\n                        </li>\r\n                        <li class="default-category">\r\n                            <a class="mouse-hand" data-action="filterTimeline" data-param="unread"><i class="micon-unread"/>{{lang.unread}}</a>\r\n                        </li>\r\n                        {{!-- show teams --}}\r\n                        <li class="teams">\r\n                        	\r\n                        </li>\r\n                        {{!-- show categories --}}\r\n                        <li class="categories">\r\n                        	\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n\r\n            {{#if branding.showNewBinder}}\r\n            <button type="button" data-action="newBinder" class="btn btn-primary btn-sm hide  ellipsis new-binder">\r\n                <i class="micon-plus size16"></i> {{lang.new}}\r\n            </button>\r\n            {{/if}}\r\n        </div>\r\n        \r\n        <div class="mx-timeline-list mx-timeline-thumb">\r\n\r\n        </div>\r\n    </div>\r\n    <div id="mxPageBody_Col_2">\r\n        {{lang.loading}}\r\n    </div>\r\n    <div class="emptyContent"></div>\r\n</div>\r\n';
}), define("text!template/timeline/timelineItem.html", [], function() {
    return '<div class="mx-timeline-item {{#when status \'!=\' consts.BOARD_INVITED}}{{#unless board.islive}}clickable{{/unless}}{{/when}}" {{#when status \'!=\' consts.BOARD_INVITED}}{{#unless board.islive}}data-action="gotoDetail" data-param="{{board.id}}"{{/unless}}{{/when}}>\n    <div id="{{board.id}}" class="mx-item row timeline-item">\n\n        <div class="item-thumb" >\n            {{#if board.isconversation}}\n            <div class="timeline-avatars timeline-avatar-{{avatarCount board.members.length}}">\n            {{else}}\n            <div class="timeline-avatars">\n            {{/if}}\n\n        	{{#unless board.islive}}\n            {{#if feed_unread_count}}\n            <span class="badge badge-important">{{feed_unread_count}}</span>\n            {{/if}}\n            {{/unless}}\n\n            {{#if board.isconversation}}\n                {{!--  conversation, meet and binder UI display are different --}}\n                {{#when board.members.length \'>=\' 2}}\n                    {{#each board.members}}\n                        {{#when ../../myself \'!=\' user.primaryKey}}\n                        {{#if ../../showCount}}\n                        <span class="mx-presence">\n                            <span class="avatar-wrap img-polaroid img-circle {{#if group}}mx-noborder mx-noborder-radius{{/if}}">\n                                <img src="{{avatar}}" class="lazy"/>\n                            </span>\n                            <i class="icon {{#if online}}online{{/if}}" data-online="{{user.id}}"></i>\n                        </span>\n                        {{/if}}\n                        {{/when}}\n                    {{/each}}\n                    {{showCount 0}}\n                {{/when}}\n\n                {{#when board.members.length \'<=\' 1}}\n                    {{#each board.members}}\n                        <span class="mx-presence">\n                            <span class="avatar-wrap img-polaroid img-circle">\n                                <img src="{{avatar}}" class="lazy"/>\n                            </span>\n                        </span>\n                    {{/each}}\n                {{/when}}\n            {{else}}\n                {{#if board.islive}}\n                    <i class="micon-meet size48"></i>\n                {{else}}\n                <div class="cover-wrap">\n                    <span class="wrap-outer">\n                        <span class="wrap-inner">\n                            <img src="{{board.thumbnail_small}}" />\n                        </span>\n                    </span>\n                </div>\n                {{/if}}\n            {{/if}}\n            </div>\n        </div>\n        <div class="item-content">\n            {{#unless board.islive}}\n                {{#when status \'!=\' consts.BOARD_INVITED}}\n                    {{#if is_favorite}}\n                        <span class="pull-right timeline-item-favorite favorite" data-action="removeFavorite" data-param="{{sequence}}" data-stopPropagation="true"><i class="micon-star size16"></i></span>\n                    {{else}}\n                        <span class="pull-right timeline-item-favorite" data-action="addFavorite" data-param="{{sequence}}" data-stopPropagation="true"><i class="micon-star-empty gray size16"></i></span>\n                    {{/if}}\n                {{/when}}\n            {{/unless}}\n            <div class="wrap-info">\n                <div class="item-main">\n                    <span class="ellipsis {{#if board.islive}}orange{{/if}}" title="{{board.name}}"><strong ta-param="{{board.name}}">{{board.name}}</strong></span>\n                    {{#if board.islive}}\n                        <span class="ellipsis size14 color-secondary">{{lang.meet_host}}: {{board.session.host}}</span>\n                        <span class="ellipsis size14 color-secondary">\n                            {{#if board.session.isActive}}\n                                {{lang.in_progress}}\n                            {{else}}\n                                {{#if board.session.scheduled_start_time}}\n                                    {{formatFullDateTime board.session.scheduled_start_time}}\n                                {{else}}\n                                    {{formatFullDateTime board.session.start_time}}\n                                {{/if}}\n                            {{/if}}\n                        </span>\n                    {{else}}\n                        <span class="item-feed ellipsis-2line size14 color-secondary" title="{{lastFeed.message}}">{{chatFormat lastFeed.message false}}</span>\n                    {{/if}}\n\n                    {{!-- action buttons, show Join button for in_progress meet --}}\n\n                </div>\n            </div>\n            <div class="sub-wrap-info">\n            {{#unless board.islive}}\n                {{#when status \'!=\' consts.BOARD_INVITED}}\n                <span class="pull-right update-time" data-widget="updateTime" data-param="{{#if lastFeed}}{{lastFeed.timestamp}}{{else}}{{board.created_time}}{{/if}}">\n                    {{#if lastFeed}}\n                        {{formatter \'formatDate\' lastFeed.timestamp}}\n                    {{else}}\n                        {{formatter \'formatDate\' board.created_time}}\n                    {{/if}}\n                </span>\n                <span>\n                {{#if is_notification_off}}<i class="micon-notification-off size16 gray marginRight5" title="{{lang.notification_off}}"></i>{{/if}}\n                {{#if isSilentMessageOn}}<i class="micon-bell-disabled size16 gray marginRight5" title="{{lang.silent_message_on}}"></i>{{/if}}\n                {{#if board.total_open_todos}}<i class="micon-todo-empty-fine size16 gray" title="{{lang.open_todos}}"></i> <span class="ta-open-todos gray size12">{{board.total_open_todos}}</span>{{/if}}\n                </span>\n\n                {{/when}}\n            {{/unless}}\n            {{#ifCond board.islive \'&&\' board.session.isActive}}\n                <div class="actions pull-right">\n                    {{#if autoJoinMeet}}\n                        <a href="#mymeet?action=join_from_calendar&binderid={{board.id}}" target="{{meetTabName}}" oncontextmenu="return false;" class="btn btn-warning btn-xs pull-right">{{lang.join}}</a>\n                    {{else}}\n                        <a class="btn btn-warning btn-xs pull-right" data-action="joinMeet" data-param="{{board.id}},{{board.session.session_key}}">{{lang.join}}</a>\n                    {{/if}}\n                </div>\n            {{else}}\n                {{#when status \'==\' consts.BOARD_INVITED}}\n                    <div class="actions pull-right">\n                        <a href="javascript:;" class="btn btn-warning btn-xs pending-accept" data-action="accept" data-param="{{board.id}},{{board.islive}}">{{lang.accept}}</a>\n                        <a href="javascript:;" class="btn btn-xs pending-accept" data-action="decline" data-param="{{board.id}}"><i class="glyphicon glyphicon-remove-circle gray" title="{{lang.decline}}"></i></a>\n                    </div>\n                {{/when}}\n            {{/ifCond}}\n             </div>\n        </div>\n\n    </div>\n\n</div>\n';
}), define("text!template/timeline/timelineEmpty.html", [], function() {
    return '<div class="mx-timeline-empty">\r\n        {{lang.no_owned_binder}}\r\n</div>\r\n';
}), define("text!template/timeline/categoryItem.html", [], function() {
    return '<li class="mouse-hand row" data-action="filterTimeline" data-param="category,{{sequence}}">\n	{{!-- TODO: feed_unread_count seems not trigger UI change\n	{{#if feed_unread_count}}\n	<span class="badge badge-important bgRed pull-right">{{feed_unread_count}}</span>\n	{{/if}}\n	--}}\n\n	{{!-- TODO: we should reuse category codes/template for both timeline and Binder shelf\n		now it is duplicate in categoryList.html template and this html, hard to maintain --}}\n	<div class="micon-category size14 col-xs-2"></div>\n	<div class="col-xs-10 name">{{name}}</div>\n</li>';
}), define("text!template/timeline/teamItem.html", [], function() {
    return '{{!--\n<li class="mouse-hand ellipsis" data-action="filterTimeline" data-param="team,{{group.id}}">\n	<span class="micon-group-users size14 marginRight5"></span>&nbsp;{{group.name}}\n</li>\n--}}\n\n<li class="mouse-hand row" data-action="filterTimeline" data-param="team,{{group.id}}">\n	<div class="micon-group-users size14 col-xs-2"></div>\n	<div class="col-xs-10 name">{{group.name}}</div>\n</li>';
}), define("text!template/binder/noBinderGuide.html", [], function() {
    return '<div class="nobinder-guide">\n	<div class="popover bottom">\n		<div class="arrow"></div>\n\n		<div class="popover-content">\n			<h4>{{lang.create_binder_to_get_started}}</h4>\n			<p class="guide-desc">\n				{{lang.add_new_binder_tagline}}\n			</p>\n			<div class="close-guide">\n				<a class="close" data-action="closeGuide">&times;</a>\n			</div>\n		</div>\n	</div>\n</div>';
}), define("binder/noBinderGuide", [ "moxtra", "lang", "text!template/binder/noBinderGuide.html" ], function(a, b, c) {
    "use strict";
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
        },
        rendered: function() {},
        closeGuide: function() {
            this.$el.remove(), $(".list-head").css("min-height", "0").removeAttr("style"), $(".mx-timeline-list").removeAttr("style");
        }
    });
}), define("timeline/timelineBiz", [ "moxtra" ], function(a) {
    return {
        accept: function(a, b) {
            MX.api("/binders/" + a, "PUT", {
                action: "accept"
            }, function(a) {
                _.isFunction(b) && b(a && "RESPONSE_SUCCESS" === a.code);
            });
        },
        decline: function(a, b) {
            MX.api("/binders/" + a, "PUT", {
                action: "decline"
            }, function(a) {
                _.isFunction(b) && b(a && "RESPONSE_SUCCESS" === a.code);
            });
        },
        toggleFavoriteBinder: function(b, c) {
            return "boolean" == typeof c ? new a.ChainObject(function() {
                MX.api(a.format("/binders/{0}", b), "PUT", {
                    data: {
                        is_favorite: !!c
                    }
                }, this.callback, this);
            }) : void 0;
        }
    };
}), define("text!template/common/groupInviteAlert.html", [], function() {
    return '<div class="maskAlert">\n    <div class="alert alert-warning fade in alertx-warning">\n        <button type="button" class="close" data-action="closeAlert" data-dismiss="alert" aria-hidden="true">&times;</button>\n      <span>\n			<div class="alert-content">\n                <h4 class="alert-heading">{{lang.admin_label_invitation_to_join}} {{name}}</h4>\n                <p>{{bbcode title}}</p>\n                <p>{{bbcode acknowledge}}</p>\n\n            </div>\n			<div class="alert-action">\n                <a href="javascript:;"  data-action="acceptInvite" class="btn btn-primary btn-sm " >{{lang.accept}}</a>\n                <a href="javascript:;" data-action="declineInvite" class="btn btn-default btn-sm">{{lang.decline}}</a>\n                <a href="javascript:;" data-action="closeAlert" class="btn btn-default btn-sm">{{lang.remind_me_later}}</a>\n                <div class="pull-right actions mx-hide">\n                    <a href="javascript:;" class="btn btn-link btn-prev">\n                    &lt; {{lang.back}}\n                </a>\n                    <a href="javascript:;" class="btn btn-link btn-next">\n                        {{lang.next}} &gt;\n                    </a>\n                    (<span>0</span>)\n                </div>\n            </div>\n		</span>\n    </div>\n</div>';
}), define("group/groupModel", [ "moxtra", "const", "lang" ], function(a, b, c) {
    return a.Model.extend({
        defaults: {
            id: "",
            name: "",
            isOwner: !1,
            picture: b.defaults.group.avatar,
            plan_code: "",
            plan_quantity: 0,
            status: "",
            member_count: 0,
            trial_grace_period_time: 0,
            partner: null,
            isFreeTrial: !0,
            accountType: ""
        },
        parse: function(a) {
            var d = MX.pick(a, [ "id", "name", "plan_code", "plan_quantity", "status", "trial_grace_period_time", "partner", "tags" ]);
            d.member_count = a && a.members && a.members.length || 0;
            var e = b.group.status;
            switch (d.status) {
              case e.trial:
                d.isFreeTrial = !0, d.accountType = c.business_edition_trial + " " + this._getMessage(d);
                break;

              case e.normal:
              case e.canceled:
              case e.expired:
                d.isFreeTrial = !1, d.accountType = c.business_edition;
            }
            var f = MX.filter(a.members, {
                type: b.group.userRole.owner
            });
            return f = f && f[0].user || {}, f.id && f.id == Moxtra.getMe().id && (d.isOwner = !0), 
            d;
        },
        _getMessage: function(a) {
            var b = new Date().getTime(), d = a.trial_grace_period_time;
            if (b > d) return c.admin_label_business_edition_trial_expired;
            var e = 0, f = d - b;
            return e = Math.ceil(f / 864e5), e > 1 ? MX.format(c.admin_label_business_edition_trial_n_days, e) : c.admin_label_business_edition_trial_1_day;
        },
        save: function() {
            var a = MX.storage("integration", "sessionStorage"), b = a.get("group_id"), c = this.get("name");
            return new MX.ChainObject(function() {
                MX.api("/groups/" + (b ? b : "current"), "PUT", {
                    data: {
                        name: c
                    }
                }, this.callback, this);
            });
        },
        getInfoFromServer: function() {
            var a = this, b = MX.storage("integration", "sessionStorage"), c = b.get("group_id");
            return new MX.ChainObject(function() {
                MX.api("/groups/" + (c ? c : "current"), "GET", null, this.callback, this);
            }).success(function(b) {
                var c = a.parse(b.data);
                a.set(c), a.trigger("success", a), a.trigger("complete", a);
            }).error(function() {
                a.trigger("complete", a);
            });
        }
    });
}), define("group/integrationModel", [ "moxtra", "lang" ], function(a) {
    return a.Model.extend({
        idAttribute: "sequence",
        defaults: {
            sequence: "",
            type: "",
            enable_auto_provision: !1,
            sf_org_id: "",
            sso_flow: "sp",
            idpConf_name: "",
            idpConf_idpid: "",
            idpConf_spid: "http://www.moxtra.com",
            idpConf_authncontextclassref: "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
            idpConf_targetparameter: "RelayState",
            idpConf_idploginurl: "",
            idpConf_cert: "",
            idpConf_nameidformat: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            idpConf_idpinitiated: !1,
            idpConf_postprofile: !1,
            idpConf_authnrequestsigned: !1,
            saml_email_domain: "",
            saml_email_domain_token: "",
            saml_email_domain_verified: !1
        },
        parse: function(a) {
            var b = MX.pick(a, [ "sequence", "type", "enable_auto_provision", "sf_org_id", "saml_email_domain_token", "saml_email_domain_verified" ]);
            MX.each(a.idp_conf, function(a, c) {
                b["idpConf_" + c] = a;
            });
            var c = a.saml_email_domain;
            return c && c.length && (b.saml_email_domain = c.join(",")), b;
        },
        toServerJSON: function() {
            var a = this.toJSON(), b = this, c = {
                idp_conf: {}
            };
            return MX.each(a, function(d, e) {
                0 == e.indexOf("idpConf") ? (e = e.substr(8), c.idp_conf[e] = d) : "saml_email_domain" == e ? void 0 === b.changed.saml_email_domain && a.sequence || (c.saml_email_domain = d ? d.split(",") : []) : c[e] = d;
            }), c;
        }
    });
}), define("group/groupBiz", [ "moxtra", "group/groupModel", "group/integrationModel" ], function(a) {
    "use strict";
    var b = MX.storage("integration", "sessionStorage"), c = function() {
        return "/groups/" + (b.get("group_id") || "current");
    }, d = function() {
        return b.get("group_id") || "current";
    };
    return {
        getGroup: function() {
            return new a.ChainObject(function() {
                MX.api(c(), "GET", null, this.callback, this);
            });
        },
        createGroup: function(b) {
            return new a.ChainObject(function() {
                MX.api("/groups", "POST", {
                    data: b
                }, this.callback, this);
            });
        },
        getGroupInvite: function(b) {
            return new a.ChainObject(function() {
                MX.api(c(), "GET", {
                    data: {
                        token: b
                    },
                    action: "view_invitation"
                }, this.callback, this);
            });
        },
        joinInvitation: function(b) {
            return new a.ChainObject(function() {
                MX.api("/groups", "POST", {
                    data: {
                        token: b
                    },
                    action: "join_via_invitation"
                }, this.callback, this);
            });
        },
        acceptGroupInvite: function(b) {
            var d = b ? "/groups/" + b : c();
            return new a.ChainObject(function() {
                MX.api(d, "PUT", {
                    action: "join"
                }, this.callback, this);
            });
        },
        declineGroupInvite: function(b) {
            var d = b ? "/groups/" + b : c();
            return new a.ChainObject(function() {
                MX.api(d, "PUT", {
                    action: "leave"
                }, this.callback, this);
            });
        },
        getIntegrationList: function() {
            return new a.ChainObject(function() {
                MX.api(c() + "/integrations", "GET", null, this.callback, this);
            });
        },
        createIntegration: function(b) {
            return new a.ChainObject(function() {
                MX.api(c() + "/integrations", "POST", {
                    data: b
                }, this.callback, this);
            });
        },
        updateIntegration: function(b, c) {
            return new a.ChainObject(function() {
                MX.api(a.format("/groups/{0}/integrations/{1}", c || d() || "current", b.sequence), "PUT", {
                    data: b
                }, this.callback, this);
            });
        },
        deleteIntegration: function(b, c) {
            return new a.ChainObject(function() {
                MX.api(a.format("/groups/{0}/integrations/{1}", c || d() || "current", b), "DELETE", null, this.callback, this);
            });
        },
        verifyIntegrationDomain: function(b, c) {
            return new a.ChainObject(function() {
                MX.api(a.format("/groups/{0}/integrations/{1}", c || d() || "current", b), "PUT", {
                    action: "verify"
                }, this.callback, this);
            });
        },
        getUser: function(b) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "GET", null, this.callback, this);
            });
        },
        addUser: function(b) {
            return new a.ChainObject(function() {
                MX.api(c() + "/members", "POST", {
                    data: {
                        user: b
                    }
                }, this.callback, this);
            });
        },
        updateUser: function(b, d) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "PUT", {
                    data: {
                        user: d
                    }
                }, this.callback, this);
            });
        },
        deleteUser: function(b) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "DELETE", null, this.callback, this);
            });
        },
        activateUser: function(b) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "PUT", {
                    action: "enable"
                }, this.callback, this);
            });
        },
        deactivateUser: function(b) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "PUT", {
                    action: "disable"
                }, this.callback, this);
            });
        },
        transferBinders: function(b, d, e) {
            return new a.ChainObject(function() {
                MX.api(a.format(c() + "/members/{0}", b), "PUT", {
                    action: "transfer",
                    data: {
                        binderIds: d,
                        target_sequence: e
                    }
                }, this.callback, this);
            });
        }
    };
}), define("common/groupInviteAlert", [ "moxtra", "lang", "text!template/common/groupInviteAlert.html", "group/groupBiz", "const" ], function(a, b, c, d, e) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function(a) {
            var c = "";
            a.invites[0] && a.invites[0].group && (c = a.invites[0].group.name || ""), this.$scope.lang = b, 
            this.$scope.title = MX.format(b.join_group_accept_title, c), this.$scope.acknowledge = MX.format(b.join_group_accept_acknowledge, c), 
            this.opts = a;
        },
        rendered: function() {},
        closeAlert: function() {
            this.opts.status.set("closeGroupInviteAlert", !0), this.destroy();
        },
        acceptInvite: function() {
            var a = this, c = this.opts.invites[0].type === e.group.userRole.admin;
            d.acceptGroupInvite(this.opts.invites[0].group.id).success(function() {
                new MX.ui.Notify({
                    type: "info",
                    content: MX.format(b.join_group_be_member, this.opts.invites[0].group.name)
                }), a.navigate(c ? "admin" : "timeline");
            }).error(function(c) {
                MX.ui.notifyError(403 === c.xhr.status ? b.user_verify_email_required_for_join_group : b.join_group_token_invited_or_expired), 
                a.navigate("timeline");
            }), this.destroy();
        },
        declineInvite: function() {
            var a = this;
            d.declineGroupInvite(this.opts.invites[0].group.id).success(function() {
                new MX.ui.Notify({
                    type: "info",
                    content: b.invite_decline_success
                }), a.navigate("timeline");
            }).error(function() {
                MX.ui.notifyError(b.invite_decline_failed), a.navigate("timeline");
            }), this.destroy();
        },
        navigate: function(a, b, c, d) {
            this.opts.request.navigate(a, b, c, d);
        }
    });
}), define("text!template/common/storageUsageAlert.html", [], function() {
    return '<div class="maskAlert">\n    <div class="alert alert-warning fade in alertx-warning">\n        <button type="button" class="close" data-action="closeAlert" data-dismiss="alert" aria-hidden="true">&times;</button>\n      <span>\n			<div class="alert-content">\n                <h4 class="alert-heading">{{lang.storage_usage}}</h4>\n                <p>{{bbcode message}}</p>\n\n            </div>\n			<div class="alert-action">\n                <a href="javascript:;" data-action="closeAlert" class="btn btn-default btn-sm pull-right">{{lang.remind_me_later}}</a>\n            </div>\n		</span>\n    </div>\n</div>';
}), define("common/storageUsageAlert", [ "moxtra", "lang", "text!template/common/storageUsageAlert.html", "const" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = b, this.$scope.message = MX.format(b.cap_storage_usage_used_up_alert, {
                percent: a.percent + "%",
                maxSize: MX.lang.formatSize(a.maxSize)
            }), this.status = a.status;
        },
        rendered: function() {},
        closeAlert: function() {
            this.status.set("closeStorageUsageAlert", !0), this.destroy();
        }
    });
}), define("timeline/timeline", [ "moxtra", "lang", "text!template/timeline/timelineList.html", "text!template/timeline/timelineItem.html", "text!template/timeline/timelineEmpty.html", "text!template/timeline/categoryItem.html", "text!template/timeline/teamItem.html", "binder/binderDetail", "binder/newBinderOptions", "binder/noBinderGuide", "timeline/timelineBiz", "common/groupInviteAlert", "common/storageUsageAlert", "common/search", "common/userCap", "app", "const", "meet/meet", "admin/branding/helper" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    {
        var e = Handlebars.compile(e);
        MX.logger("Timeline");
    }
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.$scope.branding = {
                showNewBinder: s.isShowNewBinder()
            }, $(this.container).addClass("mx-layout-three");
            var a = this, c = p.request;
            this.listenTo(p.request, "change:page", function() {
                if (c.changed.page) {
                    var b = c.page();
                    a.gotoDetail(b), console.info("gotoDetail in change page event");
                } else a.gotoFirst();
            }), this.listenTo(p.request, "change:params.category", function() {
                a.filterTimeline(p.request.params().category);
            });
        },
        checkGroupInvite: function() {
            var a = p.router.status, b = p.router.integration;
            if (!b.get("group_id")) {
                var c = Moxtra.getMe(), d = MX.filter(c.groups, {
                    status: q.group.userStatus.invited
                });
                d && 1 != a.get("closeGroupInviteAlert") && this.recovery(new l({
                    renderTo: $("#mxPageBody"),
                    parent: this,
                    status: a,
                    invites: d,
                    request: p.request
                }));
            }
        },
        checkStorageUsage: function() {
            var a = this, b = p.router.status, c = Moxtra.getMe(), d = o.getMaxCloudSize(), e = 0;
            d && (e = Math.round(c.total_cloud_size / d * 1e3) / 10, e >= p.config.thresholds.storageAlert && 1 != b.get("closeStorageUsageAlert") && setTimeout(function() {
                a.recovery(new m({
                    renderTo: $("#mxPageBody"),
                    percent: e,
                    maxSize: d,
                    status: b
                }));
            }, 1e3));
        },
        changePage: function() {
            var a = this, b = p.request.page(), c = p.request.params();
            return c.category ? void this._filterTimeline(c.category) : void (this.currBoard !== b && (b ? (this.collection.get(b) || this.filterTimeline(), 
            setTimeout(function() {
                a.gotoDetail(b), console.info("gotoDetail in changePage");
            }, 500)) : this.gotoFirst()));
        },
        getNextBoard: function(a) {
            var b, c, d = this, e = d.collection;
            for (a || (b = e.get(p.request.page()), b && (a = e.indexOf(b.sequence), a++)), 
            c = a, b = e.at(c); b && b.status === Moxtra.const.BOARD_INVITED || b && b.board && b.board.islive; ) c++, 
            b = e.at(c);
            if (!b && a > 0) for (c = a, b = e.at(c); b && b.status === Moxtra.const.BOARD_INVITED || b && b.board && b.board.islive; ) c--, 
            b = e.at(c);
            return b;
        },
        removeOne: function(a, b, c) {
            this._isShowGuide() && this._showGuide();
            var d = this.getNextBoard(c);
            if (!d) return void (this.detailController && (this.detailController.destroy(), 
            this.detailController = null, this._currBinder = null, p.request.page("")));
            var e = b.board.id;
            p.request.page() === e && d && this.gotoDetail(d.board.id);
        },
        addOne: function() {
            var a = this;
            setTimeout(function() {
                a._isShowGuide() ? a._showGuide() : a._hideGuide();
            }, 300);
        },
        gotoFirst: function() {
            for (var a = this, b = a.collection.at(0), c = 0; b && b.status === Moxtra.const.BOARD_INVITED || b && b.board && b.board.islive; ) c++, 
            b = a.collection.at(c);
            if (b) {
                if (b.isTeam) return;
                a.gotoDetail(b.board.id), console.info("gotoDetail in gotoFirst");
            }
        },
        gotoDetail: function(a) {
            var b = this;
            if (a && (p.request.page() !== a && p.request.page(a, !1), this._currBinder !== a)) {
                var c = Moxtra.getUserBoard(a);
                c && b.list.focus(c.sequence), a === p.request.page() && (b.detailController && b.detailController.destroy(), 
                b.detailController = new h({
                    renderTo: "#mxPageBody_Col_2",
                    request: p.request,
                    defaultTab: "tab_chat",
                    isLoad: !0
                }), b.detailController.$el.on("click", function() {
                    var a = p.request.page(), c = Moxtra.getUserBoard(a);
                    c && b.list.isItemInView(c.sequence) && (b._autoScrollToFocus = !0);
                }), this._autoScrollToFocus = !0, b._currBinder = a);
            }
        },
        rendered: function() {
            function c() {
                var c = p.request.params(), e = p.isAutoJoinMeet();
                h.registerObject("collection", Moxtra.getTimelineList(h._getFilterFn(c.category))), 
                h._filterField = "all", h.list || (h.list = new Moxtra.List({
                    parent: this,
                    renderTo: ".mx-timeline-list",
                    itemView: d,
                    itemHeight: 100,
                    pageSize: 10,
                    syncField: {
                        "": [ "status", "is_favorite", "lastFeed", "name", "feed_unread_count", "action", "openTodos", "is_notification_off", "isSilentMessageOn" ],
                        board: [ "thumbnail", "total_open_todos", "users" ],
                        "board.session": [ "session_status", "scheduled_start_time", "start_time", "scheduled_end_time", "end_time" ]
                    },
                    $scope: {
                        lang: b,
                        blankImg: q.defaults.blankImg,
                        defaultUserAvatar: q.defaults.user.avatar,
                        defaultBoardAvatar: Moxtra.config.defaults.binder_cover,
                        consts: Moxtra.const,
                        meetTabName: p.config.global.meetTabName,
                        autoJoinMeet: e,
                        myself: function() {
                            return Moxtra.getMe().primaryKey;
                        },
                        avatarCount: function(a) {
                            return 1 === a ? 1 : a > 5 ? 5 : a;
                        },
                        showCount: function(a) {
                            return 0 === a ? (h._showCountForAvatar = 0, !1) : (h._showCountForAvatar ? h._showCountForAvatar++ : h._showCountForAvatar = 1, 
                            h._showCountForAvatar <= 4);
                        }
                    }
                }), h.recovery(h.list), h.list.$el.find(".list-placeholder-down").height(80).loading()), 
                p.sendMessage({
                    action: "list",
                    binder_id: null,
                    session_key: null,
                    session_id: Moxtra.getMe().sessionId
                }), h.list.collection = h.collection, h.list.refresh(), h._autoScrollToFocus = !0, 
                h.categories = Moxtra.getMe().categories, h.categoryList = new a.List({
                    renderTo: ".categories",
                    template: f,
                    sortable: !1,
                    hideLoading: !0,
                    syncModel: [ "feed_unread_count" ],
                    $scope: {
                        lang: b,
                        blankImg: q.defaults.blankImg
                    }
                }), h.categoryList.binding(h.categories), h.recovery(h.categoryList), h.teams = Moxtra.getMe().groups, 
                h.teamList = new a.List({
                    renderTo: ".teams",
                    template: g,
                    sortable: !1,
                    hideLoading: !0,
                    syncField: {
                        group: [ "name" ]
                    },
                    $scope: {
                        lang: b
                    }
                }), h.teamList.binding(h.teams), h.recovery(h.teamList);
                var i, j = p.request.page();
                if (j) {
                    h.gotoDetail(j), console.info("gotoDetail in firstDataCallback");
                    var i = h.collection.get(j);
                    i && h.list.focus(i.sequence);
                } else h.gotoFirst();
                Moxtra.getMe().subscribe();
            }
            var e = this;
            this.checkGroupInvite(), $("#mxPageBody_Col_2").empty(), $("#mxPageBody_Col_1").addClass("noScroll");
            var h = this;
            this.recovery(function() {
                h.collection && h.collection.destroy(), h.detailController && h.detailController.destroy(), 
                $("mxPageBody_Col_1").removeClass("noScroll"), MX.loading(!1);
            }), Moxtra.getMe().on("firstData", c), Moxtra.onReady(function() {
                if (h.list || c(), h.collection) {
                    h.list.binding(h.collection), h.list.$(".list-body").on("scroll", function() {
                        h._autoScrollToFocus = !1;
                    }), h.listenTo(h.list, Moxtra.const.EVENT_UI_UPDATE_PAGE, function() {
                        if (h._autoScrollToFocus) {
                            var a = p.request.page();
                            if (!a) return;
                            var b = h.collection.get(a);
                            b && h.list.scrollTo(b.sequence);
                        }
                    }), h.listenTo(h.collection, Moxtra.const.EVENT_DATA_REMOVE, h.removeOne), h.listenTo(h.collection, Moxtra.const.EVENT_DATA_ADD, h.addOne), 
                    h.list.$el.find(".list-placeholder-down").loading(!1), s.isShowNewBinder() ? (e.$(".head-search").removeClass("mx-branding-newbinder"), 
                    e.$(".new-binder").removeClass("hide")) : e.$(".new-binder").remove();
                    var a = p.request.page();
                    if (a) {
                        var b = h.collection.get(a);
                        b && h.list.focus(b.sequence);
                    }
                    h.onDataInited(), MX.loading(!1);
                }
            }), $("body").widgetTimer();
        },
        filterTimeline: function(a, b) {
            p.request.page(""), this._filterTimeline(a, b);
        },
        _getFilterFn: function(a) {
            var b, c = [];
            switch (a) {
              case "favorite":
                b = function(a) {
                    return a.is_favorite;
                };
                break;

              case "unread":
                b = function(a) {
                    return c.indexOf(a.sequence) > -1 ? !0 : a.feed_unread_count && !a.board.islive ? (c.push(a.sequence), 
                    !0) : !1;
                };
                break;

              case "all":
              default:
                b = null;
            }
            return b;
        },
        _filterTimeline: function(a, c) {
            var d, e = this._getFilterFn(a);
            switch (this._filterField = a || "all", d = this.$('[data-param="' + a + '"]').html(), 
            a) {
              case "favorite":
                d = b.favorites;
                break;

              case "unread":
                d = b.unread;
                break;

              case "team":
                var f = this.teams.get(c);
                f && (d = f.group.name, e = function(a) {
                    var b = !1, d = MX.get("users", a.board);
                    return d && MX.each(d, function(a) {
                        return !a.is_deleted && a.group && a.group.id === c ? (b = !0, !1) : void 0;
                    }), b;
                });
                break;

              case "category":
                c = 1 * c;
                var g = this.categories.get(c);
                g && (e = function(a) {
                    return a.category === c;
                }, d = g.name);
                break;

              case "all":
              default:
                d = b.all_binders;
            }
            this.$(".dropmenu-label").html(d);
            var h = this;
            h.collection.destroy(), h.registerObject("collection", Moxtra.getTimelineList(e)), 
            h.list.binding(h.collection), h.collection.length ? this.gotoFirst() : h.detailController && (h.detailController.destroy(), 
            h.detailController = null, h._currBinder = null);
        },
        onDataInited: function() {
            this.$el.removeClass("hide"), this._isShowGuide() && this._showGuide(), MX.loading(!1), 
            0 == this.collection.length && this.detailController && (this.detailController.destroy(), 
            this.detailController = null);
        },
        focusToOneItem: function() {
            var a = this, b = p.request.page();
            b ? a.gotoDetail(b) : a.gotoFirst();
        },
        accept: function(a, b) {
            var c = this, d = $(this.handleEvent.currentTarget);
            d.hasClass("disabled") || (d.addClass("disabled"), c.acceptBinder(a, b));
        },
        acceptBinder: function(a, c) {
            var d = this;
            k.accept(a, function(e) {
                e ? (MX.ui.notifySuccess(b.invite_accept_success), c || d.gotoDetail(a)) : MX.ui.notifyError(b.invite_accept_failed);
            });
        },
        decline: function(a) {
            var c = $(this.handleEvent.currentTarget);
            c.hasClass("disabled") || (c.addClass("disabled"), k.decline(a, function(a) {
                c.removeClass("disabled"), a ? MX.ui.notifySuccess(b.invite_decline_success) : MX.ui.notifyError(b.invite_decline_failed);
            }));
        },
        joinMeet: function(a, b) {
            p.sendMessage({
                action: "request_join_meet",
                binder_id: a,
                session_key: b,
                session_id: Moxtra.getMe().sessionId
            });
        },
        addFavorite: function(a) {
            k.toggleFavoriteBinder(a, !0), this.handleEvent.stopPropagation();
        },
        removeFavorite: function(a) {
            k.toggleFavoriteBinder(a, !1), this.handleEvent.stopPropagation();
        },
        newBinder: function() {
            var a = this, b = new i({
                onCreatedBinder: function(b) {
                    Moxtra.util.wait(function() {
                        return Moxtra.getUserBoard(b);
                    }, function() {
                        a.gotoDetail(b);
                    }, 5e3);
                }
            });
            this.recovery(b), new MX.ui.Dialog({
                content: b
            });
        },
        _isShowGuide: function() {
            if (!s.isShowNewBinder()) return !1;
            var a = !0;
            return Moxtra.getMe().boards.each(function(b) {
                return b && Moxtra.api.filter.isTimelineData(b) && b.type === q.binder.role.Owner ? (a = !1, 
                !1) : void 0;
            }), a;
        },
        _showGuide: function() {
            if (!this.$(".nobinder-guide").length) {
                this.recovery(new j({
                    renderTo: this.$(".list-head")
                }));
                var a = this;
                setTimeout(function() {
                    var b = a.$(".nobinder-guide .popover").height() + 72 + "px";
                    a.$(".list-head").css("min-height", b), a.$(".mx-timeline-list").css("top", b);
                }, 100);
            }
        },
        _hideGuide: function() {
            this.$(".nobinder-guide").remove(), this.$(".list-head").css("min-height", "0").removeAttr("style"), 
            this.$(".mx-timeline-list").removeAttr("style");
        }
    });
}), define("api/timeline", [ "moxtra", "app", "lang", "timeline/timeline" ], function(a, b, c, d) {
    "use strict";
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = a.renderTo, g = e.params(), h = e.page();
            delete a.renderTo, MX.loading(!0);
            var i = $(f).MoxtraPowerBy(!0);
            g.subscribe = !1;
            var j = function(b) {
                c.listenTo(b, "firstData", function() {
                    MX.loading(!1), i.remove(), $("body").addClass("mx-api-ui"), h && e.page(h), d.prototype.init.call(c, a), 
                    c.renderTo(f);
                }), b.loadFirstPageBoards({
                    subscribe: !0
                });
            };
            Moxtra.verifyToken(g).success(function() {
                if (g.header) return MX.loading(!1), void b.request.navigate("timeline", h);
                var a = Moxtra.getMe();
                a.group ? a.group.group.syncTags({
                    sync: !0
                }).success(function() {
                    j(a);
                }) : j(a);
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                }), MX.loading(!1);
            });
        }
    });
}), define("text!template/binder/binderList.html", [], function() {
    return '<div class="page-body" >\n    <div id="mxPageBody_Col_1">\n        <div class="mx-binder-list {{contextClass}}">\n            <div class="top-bar hide">\n                <div class="binder-category"></div>\n            </div>\n            <div class="list-container">\n\n            </div>\n\n        </div>\n    </div>\n    <div id="mxPageBody_Col_2">\n    </div>\n</div>\n';
}), define("text!template/todo/binderItem.html", [], function() {
    return '<li>\n    <div id="{{board.id}}" class="todo-board-item" data-action="showTodo" data-param="{{board.id}}">\n        <i class="micon-todo todo-flag"/>\n        <div class="item-thumb">\n\n            {{#if isAssignToMe}}\n                <span class="user-avatar">\n                    <span class="avatar-wrap img-circle">\n                        <img src="{{myAvatar}}" class="lazy"/>\n                    </span>\n                </span>\n            {{/if}}\n\n            {{#unless isAssignToMe}}\n\n            {{#if board.isconversation}}\n            {{#when board.users.length \'>\' 1}}\n            {{#each board.users}}\n                    {{#when  user.id \'!=\' ../../myId}}\n	    				<span class="user-avatar">\n	    					<span class="avatar-wrap img-circle">\n	    						<img src="{{../../blankImg}}" data-original="{{avatar}}" class="lazy"/>\n	    						{{#if presence}}\n	    						<i class="icon online"></i>\n	    						{{/if}}\n	    					</span>\n	    				</span>\n                        <span style="width: 5px; display: inline-block"></span>\n                {{/when}}\n            {{/each}}\n            {{/when}}\n            {{#when board.users.length \'==\' 1}}\n	    				<span class="user-avatar">\n	    					<span class="avatar-wrap img-circle">\n	    						<img src="{{defaultUserAvatar}}" class="lazy"/>\n	    					</span>\n	    				</span>\n            {{/when}}\n            {{else}}\n            <div class="thumb-wrap">\n            <span class="thumb-wrap-inner">\n                <img  src="{{board.thumbnail_small}}"/>\n            </span>\n            </div>\n\n            {{/if}}\n\n            {{/unless}}\n        </div>\n        <div class="todo-name">\n            {{#when board.id \'!=\' \'assigntome\'}}\n            <span class="pull-right marginLeft10">({{board.total_open_todos }})</span>\n            {{/when}}\n            <span class="ellipsis" ta-param="{{board.name}}">{{board.name}}</span>\n\n        </div>\n    </div>\n\n\n\n</li>\n\n';
}), define("text!template/todo/todoList.html", [], function() {
    return '<div style="width: 100%;height: 100%">\n    <div id="todoDetail"></div>\n    <div class="mx-todos">\n    <div class="mx-todos-wrap">\n\n        <div class="mx-binder-todos">\n\n        </div>\n\n        <div class="mx-todos-completed-title hide">\n            <a data-toggle="collapse" data-parent=".mx-todos-wrap" href="#completedTodos" ><strong>{{lang.completed}} (<span class="completed-todos-count"></span>)</strong></a>\n        </div>\n\n        <div id="completedTodos" class="mx-binder-todos-completed collapse in">\n\n        </div>\n    </div>\n    </div>\n\n\n</div>';
}), define("text!template/settings/mytodo.html", [], function() {
    return '<div class="mx-todos">\n    <div class="mx-todos-wrap">\n        <div class="todo-filter">\n            <div class=" clearfix J-filter">\n\n                <div class="form-with-icon ">\n                    <i class="micon-search icon-control"></i>\n                    <button type="button" class="close input-close hide" data-action="removeSearchKey" aria-hidden="true">\n                        <span>×</span>\n                    </button>\n                    <input type="text" id="searchTodo" class="form-control pull-left" placeholder="{{lang.search_todo}}">\n                </div>\n            </div>\n        </div>\n\n\n    </div>\n\n</div>\n';
}), define("text!template/settings/mytodoItem.html", [], function() {
    return '<div class="panel-default" id="{{board.id}}_body">\n    <div class="panel-heading">\n        <h4 class="panel-title">\n            <a data-toggle="collapse" data-parent=".mx-todos-wrap" href="#{{board.id}}_mytodo" class="ellipsis collapsed">\n                <i class="micon-arrow-right"></i>\n              {{board.name}}\n            </a>\n            <button class="btn btn-default btn-xs open-binder" data-action="openBinder" data-param="{{board.id}}">{{lang.open}}</button>\n        </h4>\n    </div>\n    <div id="{{board.id}}_mytodo" data-id=\'{{board.id}}\' class="panel-collapse collapse" style="height: 0px;">\n        <div class="panel-body">\n\n        </div>\n    </div>\n</div>\n';
}), define("settings/mytodo", [ "moxtra", "lang", "app", "const", "text!template/settings/mytodo.html", "text!template/settings/mytodoItem.html", "text!template/todo/todoItem.html", "binder/todo/todoDetail" ], function(a, b, c, d, e, f, g, h) {
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.filterFn = {
                is_completed: !1,
                is_deleted: !1,
                isAssignToMe: !0
            }, this._itemTpl = Handlebars.compile(f);
        },
        rendered: function() {
            var a = this;
            Moxtra.onReady(function() {
                if (a.renderBinder(), a.binders.length) {
                    var b = a.binders.at(0).board.id;
                    setTimeout(function() {
                        $("#" + b + "_mytodo").collapse("show");
                    }, 100);
                }
            }), this.detailContainer = $("#todoDetail"), this.detailContainer.size() || (this.detailContainer = $('<div id="todoDetail" class="hide"></div>'), 
            this.detailContainer.insertBefore(this.$el)), this.$(".mx-todos-wrap").on("show.bs.collapse", _.bind(this.onShowCollabse, this)), 
            this.$("#searchTodo").on("keyup", _.bind(this.searchTodo, this));
        },
        expansionBoard: function(c) {
            {
                var e = this.$("#" + c + "_mytodo"), f = e.find(".panel-body"), h = e.data("todos"), i = this.binders.get(e.data("id")), j = this;
                e.parent().find(".indicator");
            }
            h || (h = new a.List({
                parent: this,
                renderTo: f,
                template: g,
                sortable: !1,
                unifyLazyload: !1,
                syncModel: [ "is_completed", "is_marked", "due_date", "attachments", "name", "assignee_sequence", "assignee", "comments", "references" ],
                $scope: {
                    lang: b,
                    blankImg: d.defaults.blankImg,
                    defaultUserAvatar: Moxtra.getMe().branding.getDefaultUserAvatar(),
                    boardId: i.board.id
                }
            }), e.data("todos", h)), Moxtra.loadBoard(i.board.id, {
                filter: [ "todos", "resources", "pages", "page_groups", "folders", "users" ]
            }).success(function(a) {
                var b = i.board.getMyBoardUserInfo(), c = Moxtra.getMe(), d = a.todos.clone({
                    filterFn: function(a) {
                        return a.is_deleted || a.is_completed ? !1 : a.assignee_sequence && a.assignee_sequence === b.sequence || a.assignee && Moxtra.util.get("id", a.assignee.user) === c.id ? !0 : void 0;
                    }
                });
                h.binding(d), j.recovery(d), a.subscribe();
            }).error(function() {});
        },
        onShowCollabse: function(a) {
            var b = $(a.target), c = b.data("id");
            this.expansionBoard(c);
        },
        renderBinder: function() {
            var a = this.binders = Moxtra.getAssignToMe(), b = Moxtra.const;
            this.listenTo(a, b.EVENT_DATA_ADD, this.addBinder), this.listenTo(a, b.EVENT_DATA_REMOVE, this.removeBinder), 
            this.listenTo(a, b.EVENT_DATA_MODEL_CHANGE, this.changeBinder), a.each(this.addBinder, this);
        },
        addBinder: function(a) {
            var b = this.binders.get(a), c = $(this._itemTpl(_.extend({}, this.$scope, b)));
            c.appendTo(this.$(".mx-todos-wrap"));
        },
        removeBinder: function(a) {
            var b = this.binders.get(a), c = b.board.id;
            this.$("#" + c + "_body").remove();
        },
        changeBinder: function() {},
        removeSearchKey: function() {
            $("#searchTodo").val("");
            var a = this.filterFn;
            this.$(".todo-filter .close").addClass("hide"), delete a.name, this._filterTodos(a);
        },
        searchTodo: function(a) {
            var b = this.filterFn, c = $(a.currentTarget), d = c.val();
            d.length ? (d = d.toLowerCase(), b.name = function(a) {
                return a ? a.toLowerCase().indexOf(d) >= 0 : !1;
            }, this.$(".todo-filter .close").removeClass("hide")) : (this.$(".todo-filter .close").addClass("hide"), 
            delete b.name), this._filterTodos(b);
        },
        _filterTodos: function(a) {
            var b = this;
            this.binders.each(function(c) {
                var d = c.board.id, e = b.$("#" + d + "_mytodo").data("todos"), f = (c.board.getMyBoardUserInfo(), 
                c.board.todos.clone({
                    filterFn: _.extend({
                        isAssignToMe: !0
                    }, a)
                }));
                e && e.binding(f);
                var g = b.$("#" + d + "_body");
                f.length ? g.show() : g.hide();
            });
        },
        viewTodoDetail: function(a, b) {
            var c, d = $(this.handleEvent.currentTarget).parent(), e = this, f = Moxtra.getBoard(b);
            f && (c = f.todos.get(a)), this.todoDetail && this.todoDetail.destroy(), e.todoModel && e.stopListening(e.todoModel), 
            this.todoModel = c, this.detailContainer.empty().removeClass("hide"), this.todoDetail = new h({
                model: c,
                renderTo: this.detailContainer
            }), this.listenTo(c, "change", function() {
                (!c.isAssignToMe || c.is_completed || c.is_deleted) && (e.todoDetail.destroy(), 
                e.detailContainer.empty().addClass("hide"), e.stopListening(e.todoModel), e.$el.removeClass("detail-action"));
            }), this.recovery(this.todoDetail), this.$el.addClass("detail-action"), $(".mx-todos .mx-item").removeClass("active"), 
            d.addClass("active");
        },
        getTodo: function(a, b) {
            var c = this.binders.get(b);
            return c ? c.board.todos.get(a) : null;
        },
        closeTodo: function(a, b) {
            var c = this.getTodo(a, b), d = this.handleEvent;
            d.stopPropagation(), c && c.updateCompleted(!0);
        },
        reopenTodo: function(a, b) {
            var c = this.handleEvent;
            c.stopPropagation();
            var d = this.getTodo(a, b);
            d && d.updateCompleted(!1);
        },
        markTodo: function(a, b) {
            var c = this.handleEvent;
            c.stopPropagation(), Moxtra.markTodo(b, a);
        },
        unmarkTodo: function(a, b) {
            var c = this.handleEvent;
            c.stopPropagation();
            var d = this.getTodo(a, b);
            d && (d.set("is_marked", !1), d.update());
        },
        openBinder: function(a) {
            c.request.navigate("timeline", a);
        }
    });
}), define("todo/binderList", [ "moxtra", "lang", "text!template/binder/binderList.html", "text!template/todo/binderItem.html", "text!template/todo/todoList.html", "app", "binder/todo", "viewer/viewer", "settings/mytodo" ], function(a, b, c, d, e, f, g, h, i) {
    MX.logger("Todo");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
            var a = this;
            this.recovery(function() {
                a.model && a.model.unsubscribe();
            });
        },
        scrollToBinder: function(a) {
            var b = this.$("#" + a).parent(), c = $("#mxPageBody_Col_1");
            if (b.size()) {
                var d = b.position(), e = d.top, f = c.scrollTop(), g = c.height(), h = b.outerHeight();
                0 > e ? c.scrollTop(f + e) : e + h > g && c.scrollTop(f + e - g + h);
            }
        },
        focusItem: function(a) {
            a = a || f.request.page();
            var b = this.$(".active").removeClass("active").find(".todo-board-item").attr("id");
            return this.$("#" + a).closest("li").addClass("active"), b;
        },
        emptyFn: function() {},
        showTodo: function(a) {
            var b = "assigntome";
            a || (a = f.request.page() || b);
            var c, d = this.focusItem(a), e = this;
            d && (c = Moxtra.getBoard(d), c && c.unsubscribe()), f.request.page(a, !1), d !== a && this.todosView && (this.todosView.destroy(), 
            this.todosView = null), a === b ? this.todosView = new i({
                renderTo: "#mxPageBody_Col_2"
            }) : ($("#mxPageBody_Col_2").loading(), Moxtra.loadBoard(a).success(function(a) {
                $("#mxPageBody_Col_2").loading(!1), e.todosView = new g({
                    renderTo: "#mxPageBody_Col_2"
                }), e.todosView.update(), a.subscribe();
            }));
        },
        rendered: function() {
            this.$el.parent().addClass("mx-layout-three");
            var c = this;
            this.binders = Moxtra.getTodoBinders(), this.boardsList = new a.List({
                renderTo: this.$(".list-container"),
                className: "todo-board-list mx-list",
                template: d,
                speedup: !0,
                lazyload: $("#mxPageBody_Col_1"),
                syncField: {
                    board: [ "name", "total_open_todos" ]
                },
                $scope: {
                    lang: b,
                    blankImg: f.const.defaults.blankImg,
                    defaultUserAvatar: f.const.defaults.user.avatar,
                    defaultThumbnail: Moxtra.config.defaults.thumbnail_small,
                    myId: Moxtra.getMe().id,
                    myAvatar: Moxtra.getMe().avatar
                }
            }), this.boardsList.binding(this.binders), this.recovery(this.boardsList), MX.loading(!0), 
            $("#mxPageBody_Col_2").html('<div id="todoDetail" class="hide"></div>'), this.listenTo(Moxtra.getMe(), "firstSubscribe", function() {
                c.showTodo(), MX.loading(!1);
            });
        },
        viewPage: function(a) {
            var b = this.todosView.getCurrentTodo(), c = b.parent, d = c.id, e = this.binders.get(d), f = this, g = new Moxtra.Collection({
                attributeId: "sequence",
                owner: b,
                model: "Moxtra.model.BoardPage"
            });
            b.attachments.each(function(a) {
                g.push(a.page);
            }), f.viewer ? f.viewer.binding(g) : (f.viewer = new h({
                collection: g,
                renderTo: "body",
                userRole: e.type,
                roleContext: "binder"
            }), f.recovery(f.viewer)), f.viewer.open(a), f.viewer.setUserRole(e.type);
        }
    });
}), define("api/todo", [ "moxtra", "app", "lang", "todo/binderList" ], function(a, b, c, d) {
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = a.renderTo;
            delete a.renderTo, MX.loading(!0), $(f).MoxtraPowerBy(!0), Moxtra.verifyToken(e.params()).success(function() {
                var b = Moxtra.getMe();
                c.listenTo(b, "firstSubscribe", function() {
                    var b = e.page();
                    b && e.page(b), d.prototype.init.call(c, a), c.renderTo(f), MX.loading(!1), $(f).MoxtraPowerBy(!0).addClass("for-todo");
                });
            }).error(function() {
                b.request.navigate("login", null, null, {
                    backUrl: location.href
                }), MX.loading(!1);
            });
        }
    });
}), define("api/data/timeline", [ "moxtra", "app", "lang", "api/inlineMessage" ], function(a, b, c, d) {
    "use strict";
    return d.extend({
        init: function(a) {
            var c = this, e = b.request, f = e.params();
            d.prototype.init.call(c, a), this._renderTo = a.renderTo, MX.loading(!0), $(this._renderTo).MoxtraPowerBy(!0), 
            this.baseUrl = location.protocol + "//" + location.host, Moxtra.verifyToken(f).success(function() {
                var a = Moxtra.getMe();
                Moxtra.onReady(function() {
                    var d = function() {
                        MX.loading(!1), b.sendMessage({
                            action: "api",
                            method: "inited"
                        }), c.listenTo(a, Moxtra.const.EVENT_FEED_CHANGE, c._onUpdated), c.listenTo(a.boards, Moxtra.const.EVENT_DATA_REMOVE, c._onRemoved), 
                        c.listenTo(a.boards, Moxtra.const.EVENT_DATA_ADD, c._onAdded), c.listenTo(a.boards, Moxtra.const.EVENT_DATA_CHANGE, c._onAdded), 
                        c.feedMapping = {}, c.unreadMapping = {}, c.revisionMapping = {}, c.processedMapping = {};
                        var d = c._process(Moxtra.getUserBoards());
                        c._sendMessage("all_binders", d);
                    };
                    if (a.group) if (Moxtra.getMyGroup() && Moxtra.getMyGroup().tags) d(); else try {
                        a.group.group.syncTags().success(function() {
                            d();
                        }).error(function() {
                            d();
                        });
                    } catch (e) {
                        d();
                    } else d();
                });
            }).error(function() {
                MX.loading(!1);
            });
        },
        _onUpdated: function(a) {
            var b = a.board.id, c = !1;
            this.revisionMapping[b] || (c = !0);
            var d, e, f = this._process([ a ], !0), g = "updated_binders";
            d = this._getLastObj(a.board.feeds), e = d.type, (c || !this.processedMapping[b] && e === Moxtra.const.FEED_BOARD_CREATE) && (g = "added_binders"), 
            f.length && this._sendMessage(g, f);
        },
        _onRemoved: function(a) {
            var b = a.board.id;
            this._removeFromComparator(b), delete this.processedMapping[b], this._sendMessage("removed_binders", {
                id: b
            });
        },
        _onAdded: function(a) {
            try {
                var b = a.board.id, c = Moxtra.model.Root.user.boards.get(b), d = this._getLastObj(c.board.feeds);
                c && this.feedMapping[b] && this.feedMapping[b] === d.sequence && this._onUpdated(c);
            } catch (e) {}
        },
        _process: function(a, b) {
            var c = [], d = this;
            return MX.each(a, function(a) {
                Moxtra.api.filter.isTimelineData(a) ? d._isChanged(a) && (d._setComparator(a), c.push(d._parse(a))) : b && a.board.islive && !a.board.isnote && d._isChanged(a) && c.push(d._parse(a));
            }), c.length > 1 && c.sort(function(a, b) {
                if (a.status === b.status) {
                    var c = a.timestamp, d = b.timestamp;
                    return c > d ? -1 : c === d && a.sequence > b.sequence ? -1 : 1;
                }
                return a.status === Moxtra.const.BOARD_INVITED ? -1 : 1;
            }), MX.each(c, function(a) {
                d.processedMapping[a.id] = a.sequence;
            }), c;
        },
        _parse: function(a) {
            var b = {};
            return b.id = a.board.id, b.sequence = a.sequence, b.feed_unread_count = a.feed_unread_count || 0, 
            b.status = a.status, b.type = a.type, b.title = Moxtra.api.util.getBoardName(a), 
            b.thumbnail = this._getThumbnail(a), b.binder_type = this._getBinderType(a), a.board.islive && (b.meet = this._getMeetSession(a)), 
            b.timestamp = this._getTimestamp(a), b.message = this._getFeed(a), b;
        },
        _isChanged: function(a) {
            var b = !1, c = a.board.id, d = this._getLastObj(a.board.feeds);
            return a.board.islive && !a.board.sessions ? !1 : ((!this.revisionMapping[c] || a.revision > this.revisionMapping[c] && (a.board.islive || this.feedMapping[c] !== d.sequence || this.unreadMapping[c] !== a.feed_unread_count)) && (b = !0), 
            b);
        },
        _setComparator: function(a) {
            var b = a.board.id, c = this._getLastObj(a.board.feeds);
            this.feedMapping[b] = c.sequence, this.unreadMapping[b] = a.feed_unread_count, this.revisionMapping[b] = a.revision;
        },
        _removeFromComparator: function(a) {
            delete this.feedMapping[a], delete this.unreadMapping[a], delete this.revisionMapping[a];
        },
        _getThumbnail: function(a) {
            var b = this.baseUrl, c = function(a) {
                return /^\//gi.test(a) || (a = /^themes/gi.test(a) ? location.pathname + a : "/" + a), 
                b + a;
            }, d = [];
            if (a.board.islive) ; else if (a.board.isconversation) {
                var e = a.board.users, f = e.length, g = Moxtra.getMe().id, h = Moxtra.getMe().branding.getDefaultUserAvatar();
                if (f > 1) {
                    var i, j = 0, k = 4;
                    for (j; f > j; j++) {
                        if (i = e[j], !i.is_deleted) {
                            var l = null, m = null;
                            i.group ? l = Moxtra.config.group.avatar : i.user && i.user.id !== g && (m = i.user.picture4x || i.user.picture2x || i.user.picture, 
                            l = m ? MX.format("/user/board/{{uBoardSeq}}/{{bUserSeq}}/{{picture}}", {
                                uBoardSeq: a.sequence,
                                bUserSeq: i.sequence,
                                picture: m
                            }) : h), l && d.push(Moxtra.util.makeAccessTokenUrl(c(l)));
                        }
                        if (d.length >= k) break;
                    }
                }
            } else {
                var n = "";
                n = a.board.thumbnail ? MX.format("/board/{{boardId}}/{{thumbnail}}", {
                    boardId: a.board.id,
                    thumbnail: a.board.thumbnail
                }) : Moxtra.getMe().branding.getDefaultCover() || Moxtra.config.defaults.binder_cover, 
                d.push(Moxtra.util.makeAccessTokenUrl(c(n)));
            }
            return d;
        },
        _getBinderType: function(a) {
            return a.board.islive ? "meet" : a.board.isconversation ? "chat" : "binder";
        },
        _getMeetSession: function(a) {
            var b = this._getLastObj(a.board.sessions);
            return MX.get("session", b);
        },
        _getTimestamp: function(a) {
            var b, c, d = a.board.feeds;
            return d && d.length && (b = this._getLastObj(d)), a.board.islive && (c = MX.get("board.sessions.0.session", a)) ? c.scheduled_start_time || c.start_time : b ? b.timestamp || b.created_time : a.created_time;
        },
        _getFeed: function(a) {
            var b, d = a.board.feeds, e = "";
            if (a.board.islive) {
                var f = "";
                MX.each(a.board.users, function(a) {
                    a.type === Moxtra.const.BOARD_OWNER && a.user && (f = a.user.name || a.user.first_name || a.user.email || "");
                }), e = c.meet_host + ": " + f;
            } else if (d && d.length && (b = this._getLastObj(d)), b) {
                e = c[b.type.toLowerCase() || Moxtra.const.FEED_INVALID.toLowerCase()] || "";
                var g = {};
                switch (g.board_type = c.feed_conversation, g.user = this._getActorName(b.actor, a.board.users), 
                b.type) {
                  case Moxtra.const.FEED_BOARD_CREATE:
                    a.board.isconversation && (e = c.feed_board_create_chat), g.target = c.feed_conversation;
                    break;

                  case Moxtra.const.FEED_BOARD_NAME_CHANGE:
                    g.newName = MX.get("name", b.board) || MX.get("name", a) || "";
                    break;

                  case Moxtra.const.FEED_BOARD_COMMENT:
                    if (b.board && b.board.comments) {
                        var h = this._getLastObj(b.board.comments);
                        h.resource && (e = c.feed_board_comment_voice), g.comment = this._getBoardComment(h, a.board.comments);
                    }
                    break;

                  case Moxtra.const.FEED_PAGES_CREATE_WITH_ANNOTATION:
                  case Moxtra.const.FEED_PAGES_CREATE:
                    e = c[Moxtra.const.FEED_PAGES_CREATE.toLowerCase()];
                    var i = this._getPagesCreate(b.board, a.board);
                    i.feed && (e = i.feed), g.target = i.target;
                    break;

                  case Moxtra.const.FEED_PAGES_RENAME:
                    g.file = this._getPagesRename(b.board);
                    break;

                  case Moxtra.const.FEED_PAGES_UPDATE:
                  case Moxtra.const.FEED_PAGES_COMMENT:
                  case Moxtra.const.FEED_PAGES_ANNOTATION:
                    break;

                  case Moxtra.const.FEED_PAGES_MOVE:
                    var j = this._getPagesMove(b.board);
                    g.file = j.file, g.folder = j.folder;
                    break;

                  case Moxtra.const.FEED_PAGES_DELETE:
                    g.target = this._getPagesDelete(b.board);
                    break;

                  case Moxtra.const.FEED_FOLDER_CREATE:
                  case Moxtra.const.FEED_FOLDER_RENAME:
                  case Moxtra.const.FEED_FOLDER_DELETE:
                    g.folder = this._getFolderName(b.board);
                    break;

                  case Moxtra.const.FEED_TODO_CREATE:
                    break;

                  case Moxtra.const.FEED_TODO_UPDATE:
                  case Moxtra.const.FEED_TODO_COMPLETE:
                  case Moxtra.const.FEED_TODO_REOPEN:
                  case Moxtra.const.FEED_TODO_DELETE:
                    e = c["timeline_" + b.type.toLowerCase()];
                    break;

                  case Moxtra.const.FEED_TODO_COMMENT:
                    e = c.timeline_feed_todo_comment, e += ": " + this._getTodoComment(b.board, a.board.todos);
                    break;

                  case Moxtra.const.FEED_TODO_ASSIGN:
                    var k = this._getTodoAssignee(b.board, a.board);
                    k ? (e = c.timeline_feed_todo_assign, g.member = k) : e = c.feed_todo_remove_assign;
                    break;

                  case Moxtra.const.FEED_TODO_DUE_DATE:
                    var l = MX.get("todos.0.due_date", b.board);
                    e = l ? c.timeline_feed_todo_due_date : c.timeline_feed_todo_due_date_removed;
                    break;

                  case Moxtra.const.FEED_TODO_DUE_DATE_ARRIVE:
                    g.todo_name = this._getTodoName(b.board, a.board);
                    break;

                  case Moxtra.const.FEED_TODO_ATTACHMENT:
                    var m = MX.get("todos.0.references.0", b.board);
                    m && (e = m.is_deleted ? c.timeline_feed_todo_attachment_deleted : c.timeline_feed_todo_attachment);
                    break;

                  case Moxtra.const.FEED_EMAIL_RECEIVE:
                    break;

                  case Moxtra.const.FEED_RELATIONSHIP_INVITE:
                  case Moxtra.const.FEED_RELATIONSHIP_CANCEL:
                    g.invitee = this._getBoardUserDisplayName(b.board, a.board);
                    break;

                  case Moxtra.const.FEED_RELATIONSHIP_REMOVE:
                    g.member = this._getBoardUserDisplayName(b.board, a.board);
                    break;

                  case Moxtra.const.FEED_RELATIONSHIP_LEAVE:
                  case Moxtra.const.FEED_RELATIONSHIP_DECLINE:
                  case Moxtra.const.FEED_RELATIONSHIP_JOIN:
                    this._isInvitedTeam(b.board, a.board) ? (e = c.feed_relationship_join_directly, 
                    g.member = this._getBoardUserDisplayName(b.board, a.board)) : g.user = this._getBoardUserDisplayName(b.board, a.board);
                    break;

                  case Moxtra.const.FEED_RELATIONSHIP_CHANGE_ROLE:
                    e = (b.board.users[0] || b.board.users[0].group).type === Moxtra.const.BOARD_READ ? c.feed_relationship_change_role_viewer : c.feed_relationship_change_role_editor, 
                    g.member = this._getBoardUserDisplayName(b.board, a.board);
                    break;

                  case Moxtra.const.FEED_INVALID:                }
                e = MX.format(e, g);
            }
            return e;
        },
        _getActorName: function(a, b) {
            var c = "";
            return c = a.first_name || a.name || a.email || "", !c && a.id && MX.each(b, function(b) {
                return b.user && b.user.id === a.id ? (c = b.user.first_name || b.user.name || b.user.email || "", 
                !1) : void 0;
            }), c;
        },
        _getBoardComment: function(a, b) {
            var c = "";
            return MX.each(b, function(b) {
                a.sequence === b.sequence && (c = b.text);
            }), c;
        },
        _getPagesCreate: function(a, b) {
            var d = "", e = "";
            if (!a) return {
                target: d
            };
            if (a.pages) {
                var f = !1;
                if (1 === a.pages.length) {
                    f = !0;
                    var g = this._getObjFromBoard(a.pages[0].sequence, b.pages);
                    if (g.page_type === Moxtra.const.PAGE_TYPE_URL) d = c.feed_pages_create_url; else switch (g.page_type) {
                      case Moxtra.const.PAGE_TYPE_AUDIO:
                        d = c.feed_an_audio_page;
                        break;

                      case Moxtra.const.PAGE_TYPE_VIDEO:
                        d = c.feed_a_video_page;
                        break;

                      case Moxtra.const.PAGE_TYPE_NOTE:
                        e = c.feed_clip_create;
                        break;

                      case Moxtra.const.PAGE_TYPE_PDF:
                      case Moxtra.const.PAGE_TYPE_NOT_SUPPORTED:
                        d = c.feed_param_a_resource;
                        break;

                      case Moxtra.const.PAGE_TYPE_WHITEBOARD:
                        d = c.feed_param_a_whiteboard;
                        break;

                      case Moxtra.const.PAGE_TYPE_WEB:
                        d = c.feed_param_a_note;
                        break;

                      case Moxtra.const.PAGE_TYPE_IMAGE:
                        d = c.feed_param_an_image;
                        break;

                      default:
                        d = c.feed_param_a_resource;
                    }
                }
                var h = "";
                if (a.page_groups && a.page_groups.length) {
                    f || (d = c.feed_param_a_resource);
                    var i = this._getLastObj(a.page_groups);
                    if (i.name) h = i.name; else {
                        var j = this._getObjFromBoard(i.sequence, b.page_groups);
                        j.name && (h = j.name);
                    }
                } else f ? g.name && (h = g.name) : d = MX.format(c.feed_param_file_complex, {
                    count: a.pages.length
                });
                h && (d += MX.format(c.feed_target_name, {
                    name: h
                }));
            } else if (a.resources && a.resources.length) {
                d = c.feed_param_a_resource;
                var k = this._getObjFromBoard(a.resources[0].sequence, b.resources);
                k.name || (k = this._getLastObj(a.page_groups) || {}), k.name && (d += MX.format(c.feed_target_name, {
                    name: k.name
                }));
            } else d = c.feed_param_one_page;
            return {
                feed: e,
                target: d
            };
        },
        _getPagesRename: function(a) {
            var b = "", c = this._getLastObj(a.folders);
            return b = c.files && c.files.length ? c.files[0].name : MX.get("page_groups.0.name", a) || "";
        },
        _getPagesMove: function(a) {
            var b, c = {
                file: "",
                folder: ""
            };
            return a.folders && a.folders.length && (c.folder = a.folders[0].name, b = a.folders[0].files || a.folders[0].page_groups), 
            b && b.length && (c.file = b[0].name), c;
        },
        _getPagesDelete: function(a) {
            var b = "";
            if (b = a && (a.page_groups || a.resources || a.folders) ? c.feed_param_a_resource : a && a.pages && a.pages.length ? MX.format(c.feed_param_file_complex, {
                count: a.pages.length
            }) : c.feed_param_a_resource, a && a.page_groups) {
                var d = this._getLastObj(a.page_groups);
                d.name && (b += MX.format(c.feed_target_name, {
                    name: d.name
                }));
            }
            return b;
        },
        _getFolderName: function(a) {
            var b = "";
            return a.folders && a.folders.length && (b = a.folders[0].name), b;
        },
        _getTodoComment: function(a, b) {
            var c = this._getLastObj(a.todos), d = "";
            if (c) {
                var e = this._getLastObj(c.comments);
                e && MX.each(b, function(a) {
                    return a.sequence === c.sequence ? (MX.each(a.comments, function(a) {
                        return a.sequence === e.sequence ? (d = a.text, !1) : void 0;
                    }), !1) : void 0;
                });
            }
            return d;
        },
        _getTodoAssignee: function(a) {
            var b, c;
            return a.users && a.users.length && (c = a.users[0], (c.sequence || c.group || c.user) && (c.group ? b = c.group.name || "" : c.user && (b = this._getDisplayName(c.user)))), 
            b;
        },
        _getTodoName: function(a, b) {
            var c, d = "";
            return c = this._getLastObj(a.todos), MX.each(b.todos, function(a) {
                return a.sequence === c.sequence ? (d = a.name, !1) : void 0;
            }), d;
        },
        _getBoardUserDisplayName: function(a, b) {
            var c = "", d = this, e = d._getLastObj(a.users);
            return MX.each(b.users, function(a) {
                return a.sequence === e.sequence ? (c = d._getDisplayName(a.group || a.user), !1) : void 0;
            }), c;
        },
        _isInvitedTeam: function(a, b) {
            var c = this._getLastObj(a.users), d = !1;
            return MX.each(b.users, function(a) {
                return a.sequence === c.sequence ? (a.group && (d = !0), !1) : void 0;
            }), d;
        },
        _getObjFromBoard: function(a, b) {
            var c = {};
            return MX.each(b, function(b) {
                return b.sequence === a ? (c = b, !1) : void 0;
            }), c;
        },
        _getLastObj: function(a) {
            return a && a.length ? a[a.length - 1] : {};
        },
        _getDisplayName: function(a) {
            return a ? a.first_name || a.name || a.email || "" : "";
        },
        _sendMessage: function(a, c) {
            b.sendMessage({
                action: a,
                data: c,
                session_id: Moxtra.getMe().sessionId
            });
        }
    });
}), define("text!template/api/ui/timelineList.html", [], function() {
    return '<div class="page-body ">\n    <div class="mx-timeline-list mx-timeline-thumb">\n\n    </div>\n    <div class="emptyContent"></div>\n</div>\n';
}), define("api/ui/timeline", [ "app", "timeline/timeline", "text!template/api/ui/timelineList.html" ], function(a, b, c) {
    "use strict";
    return b.extend({
        template: c,
        init: function(c) {
            var d = this, e = a.request.params();
            MX.loading(!0), e.subscribe = !1, Moxtra.verifyToken(e).success(function() {
                if (e.header) return void MX.loading(!1);
                var a = Moxtra.getMe();
                a.loadFirstPageBoards({
                    subscribe: !0
                }), d.listenTo(a, "firstData", function() {
                    MX.loading(!1), b.prototype.init.call(d, c), d.$el.addClass("mx-timeline-only");
                });
            }).error(function() {
                Moxtra.getMe().off(), a.request.navigate("login", null, null, {
                    backUrl: location.href
                }), MX.loading(!1);
            });
        },
        gotoDetail: function(b) {
            var c = Moxtra.getUserBoard(b);
            c && this.list.focus(c.sequence), a.sendMessage({
                action: "request_view_binder",
                binder_id: b || null,
                session_id: Moxtra.getMe().sessionId
            });
        }
    });
}), define("api/ui/binder", [ "moxtra", "app", "lang", "binder/binderDetail", "api/inlineMessage" ], function(a, b, c, d, e) {
    "use strict";
    return d.extend({
        init: function(a) {
            var d = b.request, f = d.params(), g = d.page(), h = this;
            if (!g) return void new e({
                renderTo: h._renderTo,
                message: c.binder_not_found
            });
            this._renderTo = a.renderTo, delete a.renderTo, a.defaultTab = a.tabName || "tab_chat", 
            a.uiOpts = {
                showHeader: !1
            }, a.powerByClass = this.getPowerByClass(f.tab), this._opts = a, MX.loading(!0);
            var i = $(this._renderTo).MoxtraPowerBy(!0);
            f.subscribe = !1, Moxtra.verifyToken(f).success(function() {
                var a = Moxtra.getMe();
                a.group ? a.group.group.syncTags().success(function() {
                    h.showUI(g, i);
                }) : h.showUI(g, i);
            }).error(function() {
                MX.loading(!1), b.request.navigate("login", null, null, {
                    backUrl: location.href
                });
            });
        },
        showUI: function(a, f) {
            var g = this;
            g.listenTo(b.request, "change:params.tab", function() {
                f && (f.removeClass("for-chat for-todo"), f.addClass(g.getPowerByClass(b.request.changed["params.tab"])));
            }), Moxtra.loadBoard(a).success(function() {
                MX.loading(!1), d.prototype.init.call(g, g._opts), g.renderTo(g._renderTo), f && f.addClass(g._opts.powerByClass), 
                Moxtra.getMe().subscribe(Moxtra.getBoard(a), !0);
            }).error(function() {
                MX.loading(!1), new e({
                    renderTo: g._renderTo,
                    message: c.binder_not_found
                });
            });
        },
        getPowerByClass: function(a) {
            return "tab_todo" === a ? "for-todo" : "for-chat";
        }
    });
}), define("mx.app1", function() {});