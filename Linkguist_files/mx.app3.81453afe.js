define("text!template/contacts/joinContact.html", [], function() {
    return '<div class="container2">\r\n    <h1 class="page-title">{{lang.conatct_invitation}}</h1>\r\n    \r\n    <div id="mxJoinContact" class="page-body">\r\n    	\r\n    </div>\r\n</div>';
}), define("text!template/contacts/joinContactConflict.html", [], function() {
    return '<div class="alert alert-warning">\r\n	<span>{{bbcode conflict}}</span>\r\n	<br/>\r\n	<span>{{bbcode conflict_note}}</span>\r\n	<br/>\r\n	<div class="container2 row">\r\n		<br/>\r\n		<div class="col-md-12">\r\n			<button class="btn btn-primary pull-right" data-action="goHome">{{lang.ok}}</button>\r\n		</div>\r\n	</div>\r\n</div>';
}), define("contacts/joinContactModel", [ "moxtra", "lang", "app", "const" ], function(a) {
    return a.Model.extend({
        idAttribute: "userId",
        defaults: {
            userId: "",
            inviterName: "",
            inviterEmail: "",
            inviteeEmail: "",
            inviteeExist: !1,
            isPending: !0,
            token: ""
        },
        setData: function(a, b) {
            a = a || {}, this.set({
                inviteeExist: !!a.id,
                inviteeId: a.id,
                inviteeEmail: a.email,
                token: b
            }), a.contacts && a.contacts[0] && this.set({
                userId: a.contacts[0].user.id,
                inviterName: a.contacts[0].user.name || a.contacts[0].user.first_name || a.contacts[0].user.email,
                inviterEmail: a.contacts[0].user.email,
                isPending: "CONTACT_INVITED" === a.contacts[0].status && !a.contacts[0].is_deleted
            });
        }
    });
}), define("text!template/contacts/joinContactView.html", [], function() {
    return '<div class="form-signin">\n	<div style="padding-left: 15px; font-size: 18px;color:#666;">\n		{{bbcode title}}\n	</div>\n	<div class="mx-join-contact-form">\n		\n	</div>\n</div>';
}), define("contacts/joinContactView", [ "moxtra", "lang", "app", "text!template/contacts/joinContactView.html", "common/loginForm", "common/signupForm", "contacts/contactBiz" ], function(a, b, c, d, e, f, g) {
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.$scope.title = MX.format(b.contact_invitation_title, this.model.get("inviterName"));
        },
        rendered: function() {
            var a = this.model.toJSON(), b = this;
            this.recovery(a.inviteeExist ? new e({
                email: a.inviteeEmail,
                callback: function() {
                    b._accept(a.inviterEmail);
                },
                renderTo: ".mx-join-contact-form"
            }) : new f({
                email: a.inviteeEmail,
                callback: function() {
                    b._accept(a.inviterEmail);
                },
                renderTo: ".mx-join-contact-form"
            }));
        },
        _accept: function(a) {
            g.accept(a).success(function() {
                c.navigate("/contacts", !0);
            }).error(function() {
                new MX.ui.Notify({
                    type: "error",
                    content: b.join_binder_token_invited_or_expired
                }), c.navigate("/timeline");
            });
        }
    });
}), define("contacts/joinContact", [ "moxtra", "lang", "app", "text!template/contacts/joinContact.html", "text!template/contacts/joinContactConflict.html", "contacts/joinContactModel", "contacts/joinContactView", "contacts/contactBiz" ], function(a, b, c, d, e, f, g, h) {
    var i = Handlebars.compile(e);
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.token = c.request.page(), this.token || (this._showError(), 
            this._invalidHandle());
        },
        rendered: function() {
            if (this.token) {
                this.loading();
                var a = this, b = this.token;
                Moxtra.verifyToken().complete(function() {
                    var c = Moxtra.getMe();
                    a.c_user = c.id, a.email = c.email;
                    var d = {
                        type: "USER_REQUEST_CONTACT_VIEW_INVITATION",
                        params: [ {
                            name: "USER_REQUEST_CONTACT_INVITE_TOKEN",
                            string_value: b
                        } ]
                    };
                    $.ajax({
                        url: "/user",
                        data: JSON.stringify(d),
                        global: !1,
                        type: "POST",
                        dataType: "json",
                        timeout: 6e4,
                        contentType: "application/json; charset=UTF-8",
                        success: function(c) {
                            a._success(c, b);
                        },
                        error: function(b) {
                            a._error(b);
                        }
                    });
                });
            }
        },
        _success: function(a, d) {
            this.loading(!1), this.model = new f(), this.model.setData(a.object.user, d);
            var e = this, j = e.c_user, k = e.model.toJSON();
            return k.isPending ? void (j ? j === k.inviteeId ? h.accept(k.inviterEmail).success(function() {
                c.navigate("/timeline", !0);
            }).error(function() {
                e._showError(), c.navigate("/timeline");
            }) : this.$("#mxJoinContact").html($(i({
                conflict: MX.format(b.join_binder_conflict, e.email, k.inviteeEmail),
                conflict_note: MX.format(b.join_binder_conflict_note, k.inviteeEmail),
                lang: b
            }))) : this.recovery(new g({
                model: this.model,
                renderTo: "#mxJoinContact"
            }))) : void (j ? c.navigate("/timeline", !0) : (this._showError(), c.navigate("/login")));
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
            c.navigate("/timeline", !0);
        },
        loading: function(a) {
            void 0 === a || a ? this.$("#mxJoinContact").loading({
                length: 7
            }) : void 0 === a || a || this.$("#mxJoinContact").loading(!1);
        }
    });
}), define("text!template/group/joinGroup.html", [], function() {
    return '<div class="container2">\r\n    <h1 class="page-title">{{lang.invitation}}</h1>\r\n    \r\n    <div id="mxJoinGroup">\r\n    	\r\n    </div>\r\n</div>';
}), define("text!template/group/joinGroupTokenInfo.html", [], function() {
    return '<div class="alert alert-{{type}}">\n	{{#if email}}\n	<div><strong>{{email}}</strong></div>\n	{{/if}}\n	{{message}}\n</div>';
}), define("text!template/group/joinGroupConflict.html", [], function() {
    return '<div class="alert alert-warning">\r\n	<span>{{bbcode conflict}}</span>\r\n	<span>{{bbcode conflict_note}}</span>\r\n</div>';
}), define("group/joinGroupModel", [ "moxtra", "const" ], function(a, b) {
    return a.Model.extend({
        idAttribute: "groupId",
        defaults: {
            groupId: "",
            name: "",
            joinable: !1,
            groupMembers: {},
            inviteeEmail: "",
            inviteeFirstName: "",
            inviteeLastName: "",
            inviteeId: "",
            inviteeExist: !0,
            preferredZone: "",
            isManager: !1,
            tokenAcceptor: "",
            tokenAccepted: !1,
            isAcceptorManager: !1,
            token: "",
            tokenFrom: ""
        },
        setData: function(a, c) {
            this.set({
                groupId: a.id,
                name: a.name,
                token: c
            }), (a.status === b.group.status.trial || a.status === b.group.status.normal) && this.set({
                joinable: !0
            });
            var d = MX.filter(a.members, {
                status: b.group.userStatus.invited
            });
            this.set("isManager", d && d[0] && d[0].type === b.group.userRole.admin), d = d && d[0].user || {}, 
            this.set({
                inviteeEmail: d.email,
                inviteeFirstName: d.first_name || "",
                inviteeLastName: d.last_name || "",
                inviteeId: d.id,
                inviteeExist: !!d.id,
                phoneNumber: d.phone_number || "",
                preferredZone: d.preferred_zone || ""
            });
            var e = MX.filter(a.members, {
                status: b.group.userStatus.member
            }), f = {}, g = "", h = !1;
            MX.each(e, function(a) {
                a.isManager = a.type === b.group.userRole.admin || a.type === b.group.userRole.owner, 
                f[a.user.id] = a, a.type !== b.group.userRole.owner && (g = a.user.email, h = a.type === b.group.userRole.admin);
            }), this.set({
                groupMembers: f
            }), this.set({
                tokenAcceptor: g,
                tokenAccepted: !d.email,
                isAcceptorManager: h
            });
        }
    });
}), define("text!template/group/joinGroupView.html", [], function() {
    return '<div class="row">\n	<div class="col-xs-6 join-group-left">\n		<div class="invitation-message">\n			{{bbcode title}}\n			<br/><br/>\n			{{bbcode acknowledge}}\n		</div>\n	</div>\n	<div class="col-xs-6 join-group-right">\n		<div class="mx-join-group-form">\n			\n		</div>\n	</div>\n</div>';
}), define("text!template/group/joinGroupAccept.html", [], function() {
    return '<form class="form-signin">\n	<div class="form-group">\n		<span class="invitee-email">{{email}}</span>\n	</div>\n    <a class="btn btn-lg btn-primary btn-block" data-action="accept">{{lang.accept}}</a>\n</form>';
}), define("text!template/group/joinGroupAcceptResult.html", [], function() {
    return '<form class="form-signin">\n	<div class="alert alert-{{messageType}}">\n		{{message}}\n	</div>\n	{{#if isSF}}\n	<div class="alert alert-info">{{bbcode lang.join_sf_group_success}}</div>\n	{{/if}}\n</form>';
}), define("group/joinGroupView", [ "moxtra", "lang", "app", "text!template/group/joinGroupView.html", "text!template/group/joinGroupAccept.html", "text!template/group/joinGroupAcceptResult.html", "common/loginForm", "common/signupForm", "group/groupBiz", "component/templateHelper" ], function(a, b, c, d, e, f, g, h, i) {
    var j = Handlebars.compile(e), k = Handlebars.compile(f);
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.isSF = "SF" == this.model.get("tokenFrom").toUpperCase();
            var a = this.model.get("name");
            this.$scope.title = MX.format(b.join_group_accept_title, a), this.$scope.acknowledge = MX.format(b.join_group_accept_acknowledge, a);
        },
        rendered: function() {
            var a = this.model.toJSON(), c = this;
            a.inviteeExist ? this.$(".mx-join-group-form").html(j({
                lang: b,
                email: a.inviteeEmail
            })) : this.recovery(new h({
                email: a.inviteeEmail,
                firstName: a.inviteeFirstName,
                lastName: a.inviteeLastName,
                phoneNumber: a.phoneNumber,
                preferredZone: a.preferredZone,
                token: a.token,
                firstNameReadyonly: !0,
                lastNameReadyonly: !0,
                tokenType: "group",
                callback: function() {
                    c._accept();
                },
                renderTo: ".mx-join-group-form"
            }));
        },
        accept: function() {
            this._accept();
        },
        _accept: function() {
            var a = this.model.toJSON(), d = this;
            i.joinInvitation(a.token).success(function() {
                d.isSF ? d.$(".mx-join-group-form").html(k({
                    messageType: "success",
                    message: MX.format(b.join_group_be_member, a.name),
                    isSF: d.isSF,
                    lang: b
                })) : (MX.ui.notifyInfo(MX.format(b.join_group_be_member, MX.escapeHTML(a.name))), 
                c.navigate(a.isManager ? "/admin" : "/timeline"));
            }).error(function(a) {
                var c = a && a.xhr;
                d.$(".mx-join-group-form").html(k({
                    messageType: "danger",
                    message: c && 409 === c.status ? b.join_group_conflict : b.join_group_token_invited_or_expired
                }));
            });
        }
    });
}), define("group/joinGroup", [ "moxtra", "lang", "app", "text!template/group/joinGroup.html", "text!template/group/joinGroupTokenInfo.html", "text!template/group/joinGroupConflict.html", "group/groupBiz", "group/joinGroupModel", "group/joinGroupView" ], function(a, b, c, d, e, f, g, h, i) {
    var j = Handlebars.compile(e), k = Handlebars.compile(f), l = MX.logger("group");
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.token = c.request.page();
        },
        rendered: function() {
            if (this.token) {
                this.loading();
                var a = this, c = this.token;
                Moxtra.verifyToken().complete(function(b) {
                    a.current_user = b, g.getGroupInvite(c).success(function(b) {
                        a._success(b, c);
                    }).error(function(b) {
                        a._handleError(b);
                    });
                });
            } else this._showMessage(b.join_group_token_invited_or_expired, "danger");
        },
        _success: function(a, c) {
            this.loading(!1), this.model = new h(), this.model.setData(a.data, c), this.update(), 
            this.current_user = Moxtra.getMe();
            var d = this, e = (d.current_user.id, d.current_user.email || ""), f = this.model.toJSON();
            this.$(".page-title").html(MX.format(b.join_group_title, MX.escapeHTML(f.name))), 
            f.joinable ? f.tokenAccepted ? this._showMessage(MX.format(b.join_group_already_member, MX.escapeHTML(f.name)), "info", f.tokenAcceptor) : e && f.inviteeEmail !== e ? this.$("#mxJoinGroup").html($(k({
                conflict: MX.format(b.join_binder_conflict, e, f.inviteeEmail),
                conflict_note: MX.format(b.join_binder_conflict_note, f.inviteeEmail),
                lang: b
            }))) : this._showView() : this._showMessage(b.join_group_subscription_invited_or_expired, "warning");
        },
        _handleError: function(a) {
            l.error(a), this._showMessage(b.join_group_token_invited_or_expired, "danger"), 
            this.loading(!1);
        },
        _showMessage: function(a, b, c) {
            this.$("#mxJoinGroup").html($(j({
                type: b,
                message: a,
                email: c
            })));
        },
        _showView: function() {
            this.recovery(new i({
                model: this.model,
                renderTo: "#mxJoinGroup"
            }));
        },
        update: function() {},
        _update: function(a) {
            a && this.model.set("tokenFrom", a);
        },
        loading: function(a) {
            void 0 === a || a ? this.$("#mxJoinGroup").loading({
                length: 7
            }) : void 0 === a || a || this.$("#mxJoinGroup").loading(!1);
        }
    });
}), define("group/joinSalesforceGroup", [ "moxtra", "lang", "app", "group/joinGroup" ], function(a, b, c, d) {
    MX.logger("group");
    return d.extend({
        update: function() {
            this._update("SF");
        }
    });
}), define("text!template/identity/changepass.html", [], function() {
    return '<div class="container2">\r\n	<h1 class="page-title">{{lang.changepass_form_label}}</h1>\r\n	<form id="changePassForm" class="form-signin">\r\n		<div class="form-group" >\r\n			<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="pass" class="form-control" data-error-style="inline" placeholder="{{lang.new_password}}" autocomplete="off">\r\n		</div>\r\n\r\n		<div class="form-group" >\r\n			<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="confpass" class="form-control" data-error-style="inline" placeholder="{{lang.confirm_password}}" autocomplete="off">\r\n		</div>\r\n\r\n		<div class="form-group">\r\n			<button class="btn btn-lg btn-primary btn-block"  type="submit">{{lang.change_password}}</button>\r\n		</div>\r\n\r\n	</form>\r\n</div>';
}), define("identity/changepass", [ "moxtra", "lang", "app", "text!template/identity/changepass.html", "identity/userModel", "app", "identity/identityBiz" ], function(a, b, c, d, e, c) {
    MX.logger("ChangePass");
    return a.Controller.extend({
        template: d,
        init: function() {
            var a = e.extend({
                validation: {
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
            this.model = new a(), this.$scope.lang = b;
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                id: "#changePassForm",
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        success: function() {
            MX.ui.notifySuccess(b.changepass_success), c.navigate("/login");
        },
        error: function() {
            MX.ui.notifyError(b.changepass_failed);
        },
        submit: function() {
            var b = c.request.page();
            if (b) {
                this.model.set("token", b);
                var d = this.form, e = this;
                d.disable(!0), a.identify.changePass(e.model).scope(e).success(e.success).error(e.error).complete(function() {
                    d.disable(!1);
                });
            }
        }
    });
}), define("text!template/identity/forgetpass.html", [], function() {
    return '<div class="container2">\r\n	<h1 class="page-title">{{lang.forgetpass_form_label}}</h1>\r\n	<form id="forgetPassForm" class="form-signin">\r\n		<div class="alert alert-info">\r\n            <strong class="help-block">{{lang.forgetpass_label_note}}</strong>\r\n        </div>\r\n\r\n		<div class="form-group" >\r\n			<input type="email" name="email" class="form-control" data-error-style="inline" placeholder="{{lang.email_address}}" autofocus>\r\n		</div>\r\n\r\n		<button class="btn btn-lg btn-primary btn-block"  type="submit">{{lang.reset_password}}</button>\r\n	</form>\r\n</div>';
}), define("text!template/identity/forgetpassSuccess.html", [], function() {
    return '<div class="alert">\r\n	<div class="alert alert-warning">\r\n		<h4><strong class="help-block">{{format title}}</strong></h4>\r\n		{{lang.check_email_spam_folder}}\r\n	</div>\r\n</div>';
}), define("identity/forgetpass", [ "moxtra", "lang", "text!template/identity/forgetpass.html", "text!template/identity/forgetpassSuccess.html", "identity/userModel", "app", "identity/identityBiz" ], function(a, b, c, d, e) {
    MX.logger("ForgetPass");
    return a.Controller.extend({
        template: c,
        init: function() {
            var a = e.extend({
                validation: {
                    email: [ {
                        required: !0,
                        msg: b.email_is_required
                    }, {
                        pattern: "email",
                        msg: b.email_format_error
                    } ]
                }
            });
            this.model = new a(), this.$scope.lang = b;
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                id: "#forgetPassForm",
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        success: function() {
            var a = Handlebars.compile(d), c = {
                lang: b,
                title: {
                    src: b.forgetpass_reset_success_title,
                    data: {
                        email: this.model.get("email")
                    }
                }
            };
            this.$el.html($(a(c)));
        },
        error: function(a) {
            MX.ui.notifyError("ERROR_EMAIL_DOMAIN_LOCKED" === a.detail_code ? b.sso_signup_fail : a.message);
        },
        submit: function() {
            var b = this.form, c = this;
            b.disable(!0), a.identify.resetPass(c.model).scope(c).success(c.success).error(c.error).complete(function() {
                b.disable(!1);
            });
        }
    });
}), define("text!template/identity/login.html", [], function() {
    return '<div class="container2 hide">\n    <h1 class="page-title">{{lang.login_form_label}}</h1>\n\n    <form id="loginForm" class="form-signin">\n        <!-- <div class="alert alert-danger" style="display:none">\n            <strong class="help-block">Ooops!</strong> You did not pass the validation.\n        </div>\n        <div class="alert alert-success" style="display:none">\n            <strong class="help-block">Success!</strong> You passed the validation.\n        </div>\n -->\n        <div class="form-group">\n            <input type="email" name="email" class="form-control" data-error-style="inline"\n                   placeholder="{{lang.email_address}}" autofocus>\n        </div>\n        <div class="form-group">\n            <input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="password"\n                   class="form-control" data-error-style="inline" placeholder="{{lang.password}}">\n        </div>\n        <label class="checkbox">\n            <input type="checkbox" name="remember_me" value="1"> {{lang.login_remember_me}}\n        </label>\n        <button class="btn btn-lg btn-primary btn-block" type="submit">{{lang.sign_in}}</button>\n        <br/>\n\n        <div class="form-group">\n            <a href="javascript:;" data-action="gotoForgetPass">{{lang.forgot_password}}</a><br/>\n            <a href="javascript:;" data-action="gotoSignup">{{lang.login_link_sign_up}}</a>\n        </div>\n\n        {{#unless isIntegrationEnabled}}\n        <div class="socialLogin hide">\n            <hr>\n            <div>\n                <a href="javascript:;" data-action="facebookLogin" id="btn_fb_login"\n                   class="btn btn-default btn-block mx-btn-social">\n                    <i class="micon-logo-facebook size20 facebook-blue"></i>\n                    <span>{{lang.login_with_facebook}}</span>\n                </a>\n            </div>\n\n            <div class="marginTop15 ">\n                <a href="javascript:;" data-action="googleLogin" id="btn_gapi_login"\n                   class="btn btn-default btn-block mx-btn-social">\n                    <i class="micon-logo-google size20 google-blue"></i>\n                    <span>{{lang.login_with_google}}</span>\n                </a>\n            </div>\n        </div>\n\n            {{#if showSSOLogin}}\n            <hr>\n            <div>\n                <a href="javascript:;" data-action="gotoSSOLogin"><span>{{lang.login_other_options}}</span></a>\n            </div>\n            {{/if}}\n        {{/unless}}\n    </form>\n\n</div>';
}), define("identity/gapi", [ "moxtra", "lang", "app" ], function(a, b, c) {
    function d() {
        this.loadGapi();
    }
    var e = a.logger("google_api");
    return _.extend(d.prototype, Backbone.Events), d.prototype.init = function() {
        function a() {
            window.setTimeout(b, 100);
        }
        function b() {
            gapi.auth.authorize({
                client_id: c.config.google_api.clientId,
                scope: c.config.google_api.scopes,
                immediate: !1
            }, d);
        }
        function d(a) {
            a && !a.error ? (e.info("sign in success", a), f.trigger("success", a)) : a && a.error && (e.error("Unable to sign in:", a.error), 
            f.trigger("error", a));
        }
        var f = this;
        this.checkAuth = function() {
            gapi.auth.authorize({
                client_id: c.config.google_api.clientId,
                scope: c.config.google_api.scopes,
                immediate: !1
            }, d);
        }, a();
    }, d.prototype.loadGapi = function() {
        var a = this;
        return "undefined" != typeof gapi ? this.init() : void require([ c.config.google_api.endpoint ], function() {
            function b() {
                gapi && gapi.client ? a.init() : setTimeout(b, 100);
            }
            b();
        });
    }, d;
}), define("identity/login", [ "moxtra", "app", "lang", "text!template/identity/login.html", "identity/userModel", "identity/gapi", "component/dialog/dialog", "identity/identityBiz" ], function(a, b, c, d, e, f) {
    "use strict";
    var g = Moxtra.storage("integration");
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            var a = this;
            if ("facebook" === b.request.get("params.from")) return void Moxtra.login({
                type: Moxtra.const.USER_TYPE_FACEBOOK,
                pass: b.request.get("params.access_token")
            }).setScope(a).success(a.loginSuccess).error(a.loginError);
            if (b.request.get("params.loginUrl")) return void b.request.navigate("sflink", null, null, b.request.params());
            var d = e.extend({
                validation: {
                    email: [ {
                        required: !0,
                        msg: c.email_is_required
                    }, {
                        pattern: "email",
                        msg: c.email_format_error
                    } ],
                    password: [ {
                        required: !0,
                        msg: c.password_is_required
                    } ]
                }
            });
            this.model = new d(), this.$scope.lang = c, this.$scope.isIntegrationEnabled = b.isIntegrationEnabled();
            var f = b.request.get("params.backUrl");
            this.$scope.showSSOLogin = !f || f.indexOf(location.pathname) > -1, a._showLoading();
            var h = b.request.params();
            Moxtra.verifyToken({
                triggerEvent: !0,
                subscribe: !1,
                token: h.token,
                c_user: h.c_user,
                access_token: h.access_token
            }).success(function() {
                h.access_token && g.set("access_token", h.access_token), a.loginSuccess(!0);
            }).error(function() {
                g.remove("access_token"), a.initLogin();
            }).complete(function() {
                a._hideLoading();
            });
        },
        initLogin: function() {
            var a = this;
            setTimeout(function() {
                $(".container2").removeClass("hide");
            }, 100), b.accessFromChina() || require([ b.config.global.fb_sdk_endpoint ], function() {
                FB.init({
                    appId: b.config.global.fb_app_id,
                    status: !0,
                    cookie: !0,
                    xfbml: !0,
                    version: "v2.2"
                }), a.$(".socialLogin").removeClass("hide");
            });
        },
        rendered: function() {
            this.model && (this.form = new a.Form({
                parent: this,
                form: this.$("#loginForm"),
                model: this.model,
                submit: this.submit,
                scope: this
            }));
        },
        loginSuccess: function(a) {
            var c = b.request.get("params.backUrl");
            if (c) c = b.routingToUserDataCenter(c), location.replace(c), c.match(/#[\/]?timeline\/([^\/]+)/) || Moxtra.getMe().subscribe(); else {
                var d = b.routingToUserDataCenter(location.href.toString());
                location.replace(d.split("#").shift() + "#timeline"), a !== !0 && location.reload();
            }
        },
        loginError: function(b) {
            this.form.showError(b && 400 === b.status ? c.login_failed_user_pass : a.format(c.login_failed_unexpected, {
                code: b.status || 999
            })), this.form.disable(!1), this.form.$el.find(":password").focus();
        },
        submit: function() {
            var a = this;
            a._showLoading();
            var b = a.model.toJSON();
            Moxtra.login({
                email: b.email,
                pass: b.password,
                remember: b.remember_me
            }).setScope(a).success(a.loginSuccess).error(a.loginError).complete(a._hideLoading);
        },
        gotoForgetPass: function() {
            b.navigate("/forgetpass");
        },
        gotoSignup: function() {
            b.request.get("params.backUrl") ? b.request.navigate("signup", null, null, b.request.params()) : b.navigate("/signup");
        },
        gotoSSOLogin: function() {
            b.navigate("/ssologin");
        },
        facebookLogin: function() {
            var a = this;
            a._showLoading(), FB.login(function(b) {
                if ("connected" === b.status) {
                    var d = b.authResponse.accessToken;
                    Moxtra.login({
                        type: Moxtra.const.USER_TYPE_FACEBOOK,
                        pass: d
                    }).setScope(a).success(a.loginSuccess).error(a.loginError);
                } else a.form.showError(c.Facebook_login_failed), a.form.disable(!1);
                a._hideLoading();
            }, {
                scope: "email"
            });
        },
        googleLogin: function() {
            var a = this;
            this.apiManager = new f(), a._showLoading(), this.apiManager.on("success", function(b) {
                Moxtra.login({
                    type: Moxtra.const.USER_TYPE_GOOGLE,
                    pass: b.access_token
                }).setScope(a).success(a.loginSuccess).error(a.loginError), a._hideLoading();
            }).on("error", function() {
                a.loginError(), a._hideLoading();
            });
        },
        _showLoading: function() {
            $(".outer-container").loading(), this.form && this.form.disable(!0);
        },
        _hideLoading: function() {
            $(".outer-container").loading(!1), this.form && this.form.disable(!1);
        }
    });
}), define("identity/logout", [ "moxtra", "app" ], function(a, b) {
    "use strict";
    return a.Controller.extend({
        init: function() {
            var a = b.request.get("params.backUrl");
            MX.logout(function() {
                Moxtra.logout(), a ? location.replace(a) : (b.navigate("login", !0), location.reload());
            });
        }
    });
}), define("text!template/identity/sflink.html", [], function() {
    return '<div>\n    <div id="pending_invite" class="panel alert alert-block fade in hide">\n        <div id="ERROR_INTEGRATION_PENDING_GROUP_MEMBER">\n            <p>{{lang.admin_msg_sflink_one_step_left }} {{group_user_email}}, {{lang.admin_msg_sflink_inviting_of }} <b>{{group_name}}</b>. {{lang.admin_msg_sflink_click_to_validate }}</p>\n            <p>\n                {{lang.check_email_spam_folder }}</p>\n            <div id="accept_invite_msg"></div>\n            <p>\n                <a class="btn btn-small" href="javascript:;" data-action="resendInviteEmail" >{{lang.resend_invitation }}</a>\n                <a class="btn btn-small" href="javascript:;" data-action="sflogin">{{lang.admin_msg_sflink_have_accepted }}</a>\n            </p>\n        </div>\n    </div>\n\n    <div id="error_invite" class="panel alert alert-warning fade in hide">\n        <p>\n        <div id="ERROR_INTEGRATION_EXCEED_GROUP_MEMBER_QUANTITY" class="hide">\n            {{ reach_limits }} <br>\n            {{lang.admin_msg_sflink_contact_admin }} ({{group_owner_email}}).\n        </div>\n        <div id="ERROR_INTEGRATION_NOT_GROUP_MEMBER" class="hide">\n            {{lang.admin_msg_sflink_warn_not_have_account }}<br>\n            {{lang.admin_msg_sflink_contact_admin }} ({{group_owner_email}}).\n        </div>\n        <div id="ERROR_INTEGRATION_INVALID_GROUP" class="hide">\n            {{lang.admin_msg_sflink_require_business_account }}<br>\n            {{bbcode lang.admin_msg_sflink_for_more_details }}\n        </div>\n        <div id="ERROR_INTEGRATION_EXPIRED_GROUP_SUBSCRIPTION" class="hide">\n            {{lang.admin_msg_sflink_business_account_expired }}<br>\n            {{lang.admin_msg_sflink_contact_admin }}.\n        </div>\n        <div id="ERROR_INTEGRATION_INVALID_EXTERNAL_RESPONSE" class="hide">\n            {{lang.admin_msg_sflink_sf_session_expired }} <br>\n            {{lang.need_refresh_browser }}\n        </div>\n        <div id="ERROR_INTEGRATION_GENERAL" class="hide">\n            {{lang.need_refresh_browser }}\n        </div>\n        <div id="ERROR_INTEGRATION_ALREADY_LOGIN" class="hide">\n            {{lang.admin_msg_sflink_logged_outside_of_sf }}<br>\n            {{lang.admin_msg_sflink_logout_retry }}\n        </div>\n        </p>\n    </div>\n\n    <div>\n        <iframe src="https://www.moxtra.com/secure/sfdc/moxtra-for-sales-overview/" width="100%" height="475" border="0" scrolling="auto" style="border:0;"></iframe>\n    </div>\n</div>';
}), define("identity/sflink", [ "moxtra", "lang", "text!template/identity/sflink.html", "identity/identityBiz", "app" ], function(a, b, c, d, e) {
    var f = MX.logger("sflink");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.sflogin();
        },
        sflogin: function() {
            var a = this, c = e.request.params(), d = $("#mxPageBody");
            d.loading(), Moxtra.login({
                pass: c.token,
                type: Moxtra.const.USER_TYPE_FORCE,
                login_url: c.loginUrl
            }).setScope(a).success(function() {
                d.loading(!1), c.backUrl ? top.location = c.backUrl : e.request.navigate("timeline");
            }).error(function(c) {
                if (d.loading(!1), c.responseText) {
                    var e = JSON.parse(c.responseText), f = e.object && e.object.group || {}, g = {
                        group_owner_email: f.members && f.members[0].user.email || "",
                        group_name: e.object && e.object.group && e.object.group.name || b.admin_label_moxtra_business_edition,
                        group_user_email: e.object && e.object.user && e.object.user.email || "",
                        lang: b
                    };
                    switch (g.reach_limits = b.admin_msg_sflink_users_reach_limits.replace("{0}", g.group_name), 
                    a.render(g), $("#mxPageBody").empty().append(a.$el), 400 === c.status && (e.detail_code = "ERROR_INTEGRATION_ALREADY_LOGIN"), 
                    e.detail_code || "ERROR_INTEGRATION_GENERAL") {
                      case "ERROR_INTEGRATION_PENDING_GROUP_MEMBER":
                        a.$("#pending_invite").removeClass("hide"), a.$("#error_invite").addClass("hide");
                        break;

                      case "ERROR_INTEGRATION_GENERAL":
                        a.$("#pending_invite").addClass("hide"), a.$("#error_invite").removeClass("hide").find("div").addClass("hide"), 
                        a.$("#error_invite").find("#ERROR_INTEGRATION_GENERAL").removeClass("hide");
                        break;

                      default:
                        a.$("#pending_invite").addClass("hide"), a.$("#error_invite").removeClass("hide").find("div").addClass("hide"), 
                        a.$("#error_invite").find("#" + e.detail_code).removeClass("hide");
                    }
                }
            });
        },
        resendInviteEmail: function() {
            var a = this;
            GroupMgr.resendGroupInviteEmail(a.options, {
                success: function() {
                    a.$("#accept_invite_msg").alertSuccess(b.group_invite_send_ok, {
                        autoClose: !0
                    });
                },
                error: function(c) {
                    f.error("resend invite email failed", c), a.$("#accept_invite_msg").alertError(b.group_invite_send_fail, {
                        autoClose: !0
                    });
                }
            });
        }
    });
}), define("text!template/identity/signup.html", [], function() {
    return '<div class="container2">\r\n	<h1 class="page-title">\r\n        {{#if isTrial}}\r\n            {{lang.label_free_trial}}\r\n        {{else}}\r\n\r\n            {{lang.signup_form_label}}\r\n        {{/if}}\r\n    </h1>\r\n    {{#if isTrial}}\r\n    <div class="row">\r\n        <div class="col-md-6">\r\n     {{/if}}\r\n\r\n	<form id="signupForm" class="form-signin">\r\n        {{#unless isLogin}}\r\n		<div class="form-group" >\r\n			<input type="text" name="first_name" class="form-control" data-error-style="inline" placeholder="{{lang.first_name}}" autofocus>\r\n		</div>\r\n\r\n		<div class="form-group" >\r\n			<input type="text" name="last_name" class="form-control" data-error-style="inline" placeholder="{{lang.last_name}}">\r\n		</div>\r\n    {{/unless}}\r\n		<div class="form-group" >\r\n			<input type="text" name="email" class="form-control " {{#if isLogin}}readonly{{/if}} value="{{loginEmail}}" data-error-style="inline" placeholder="{{lang.email_address}}">\r\n		</div>\r\n        {{#unless isLogin}}\r\n		<div class="form-group" >\r\n			<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="pass" class="form-control" data-error-style="inline" placeholder="{{lang.password}}" autocomplete="off">\r\n		</div>\r\n\r\n		<div class="form-group" >\r\n			<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="confpass" class="form-control" data-error-style="inline" placeholder="{{lang.confirm_password}}" autocomplete="off">\r\n		</div>\r\n        {{/unless}}\r\n        {{#if isTrial}}\r\n        <div class="form-group" >\r\n            <input type="text" name="company" class="form-control" data-error-style="inline" placeholder="{{lang.company_name}}" >\r\n        </div>\r\n        <!--div class="form-group" >\r\n            <input type="text" name="company" class="form-control" data-error-style="inline" placeholder="{{lang.phone_number}}" autofocus>\r\n        </div-->\r\n        {{/if}}\r\n        {{#unless isLogin}}\r\n		<div class="form-group">\r\n			<span>{{bbcode lang.signup_disclaimer}}</span>\r\n		</div>\r\n        {{/unless}}\r\n\r\n		<div class="form-group">\r\n			<button class="btn btn-lg btn-primary btn-block"  type="submit">{{#if isTrial}}{{lang.start_free_trial}}{{else}}{{lang.sign_up}}{{/if}}</button>\r\n		</div>\r\n        {{#unless isLogin}}\r\n		<div class="form-group">\r\n			<span>{{lang.signup_does_have_account}} <a href="javascript:;" data-action="gotoLogin">{{lang.signup_login_here}}</a></span>\r\n		</div>\r\n        {{/unless}}\r\n	</form>\r\n            {{#if isTrial}}\r\n        </div>\r\n        <div class="col-md-6 ">\r\n            {{#if isIntegrationSalesforce}}\r\n                <div><img class="marginTop15" src=\'themes/images/salesforcebanner.7fa3f49b.jpg?v=1\'/></div>\r\n            {{else}}\r\n                {{#unless isLogin}}\r\n                <div class="alert alert-info " style=" color: #222;  text-align: left; margin-top: 15px">\r\n                    <div><strong>{{lang.label_free_trial_login_tip}}</strong></div>\r\n                    <div><a id="viewLogin" href="javascript:;" data-action="gotoLogin">{{lang.label_free_trial_login_to_get_started}}</a></div>\r\n\r\n                </div>\r\n                {{/unless}}\r\n                <div class="alert  alert-warning alert-trial">\r\n                    <div><strong>{{lang.label_30_days}} {{lang.label_free_trial}}</strong></div>\r\n                    <div><strong>{{lang.business_edition}}</strong></div>\r\n                    <div>{{lang.label_more_binders}}.</div>\r\n                    <div>{{lang.label_large_meets}}.</div>\r\n                    <div>{{lang.label_user_management}}.</div>\r\n                    <div>{{lang.label_binder_management}}.</div>\r\n                </div>\r\n            {{/if}}\r\n        </div>\r\n    </div>\r\n    {{/if}}\r\n</div>';
}), define("identity/signup", [ "moxtra", "lang", "text!template/identity/signup.html", "identity/userModel", "app", "identity/identityBiz", "group/groupBiz" ], function(a, b, c, d, e, f, g) {
    MX.logger("Signup");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            var a = e.request.module(), c = {
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
            };
            if ("trial" == a) {
                this.isTrial = !0;
                var f = Moxtra.getMe();
                f.id && (this.$scope.loginEmail = f.email || "", this.$scope.isLogin = this.isLogin = !0, 
                f.email || Moxtra.verifyToken().success(function(a) {
                    $('input[name="email"]').val(a.email);
                }), c = {}), c.company = {
                    required: !0,
                    msg: b.company_required
                }, this.$scope.isTrial = !0, this.$scope.isIntegrationSalesforce = !!e.isIntegrationSalesforce();
            }
            var g = d.extend({
                validation: c
            });
            this.model = new g(), this.$scope.lang = b;
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                id: "#signupForm",
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        success: function() {
            return e.request.get("params.backUrl") ? void location.replace(e.request.get("params.backUrl")) : void (this.isTrial ? this.createGroup(this.model.get("company")) : e.navigate("/timeline"));
        },
        error: function(a) {
            err = a && JSON.parse(a.responseText) || {}, this.form.showError("ERROR_EMAIL_DOMAIN_LOCKED" === err.detail_code ? b.sso_signup_fail : a && 409 === a.status ? b.signup_conflict : b.sign_up_failed);
        },
        createGroup: function(a) {
            var c = this;
            g.createGroup({
                name: a,
                plan_code: "moxtrabusiness-monthly"
            }).success(function() {
                e.navigate(c.$scope.isIntegrationSalesforce ? "/admin/settings" : "/admin/user");
            }).error(function() {
                MX.ui.notifyError(b.create_business_account_failed), c.form.disable(!1);
            });
        },
        submit: function() {
            var a = this.form, b = this;
            if (a.disable(!0), b.isLogin && b.isTrial) this.createGroup(this.model.get("company")); else {
                var c = b.model.toJSON();
                b.isTrial && (c.trial = b.isTrial), Moxtra.signup(c).setScope(b).success(b.success).error(b.error).complete(function() {
                    a.disable(!1);
                });
            }
        },
        gotoLogin: function() {
            this.isTrial ? e.request.navigate("login", null, null, {
                backUrl: "#trial"
            }) : e.navigate("/login");
        }
    });
}), define("text!template/identity/ssologin.html", [], function() {
    return '<div class="container2">\n    <h1 class="page-title">{{lang.login_other_options}}</h1>\n\n    <form id="loginForm" class="form-signin"  >\n        <div class="form-group" >\n            <input type="email" name="email" class="form-control" data-error-style="inline" placeholder="{{lang.email_address}}" autofocus>\n        </div>\n        <div class="form-group hide">\n            <select id="sso_option">\n            </select>\n        </div>\n\n        <div class="form-group">\n        <button class="btn btn-lg btn-primary btn-block"  type="submit">{{lang.continue}}</button>\n        </div>\n        <div class="form-group">\n            <span><a href="javascript:;" data-action="gotoLogin">{{lang.cancel}}</a></span>\n        </div>\n\n    </form>\n\n</div>';
}), define("identity/ssologin", [ "moxtra", "lang", "text!template/identity/ssologin.html", "identity/userModel", "app", "user/userBiz" ], function(a, b, c, d, e, f) {
    var g = MX.logger("Login");
    return a.Controller.extend({
        template: c,
        handleAction: !0,
        init: function() {
            this.options = e.request.params();
            var c = a.Model.extend({
                defaults: {
                    sso_option: "",
                    email: ""
                },
                validation: {
                    email: [ {
                        required: !0,
                        msg: b.email_is_required
                    }, {
                        pattern: "email",
                        msg: b.email_format_error
                    } ]
                }
            });
            this.model = new c(), this.$scope.lang = b;
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                form: this.$("#loginForm"),
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        loginSuccess: function() {
            e.navigate("/timeline");
        },
        loginError: function(c) {
            g.error(c), this.form.showError(c && c.xhr && 400 === c.xhr.status ? b.login_failed_user_pass : a.format(b.login_failed_unexpected, {
                code: c.xhr.status
            }));
        },
        submit: function() {
            var a = this.form, c = this;
            a.disable(!0);
            var d = this.model.get("sso_option");
            "" == d ? f.getSSOLoginOptions(this.model.get("email")).scope(this).success(function(b) {
                a.disable(!1), c._onGetLoginOptions(b);
            }).error(function() {
                a.showError(b.get_sso_options_failed), a.disable(!1);
            }) : "email" == d ? e.router.navigate("login") : this.jumpToSSOLogin(d);
        },
        _onGetLoginOptions: function(a) {
            var c = this, d = a && a.data || [];
            if (0 === d.length) this.form.showError(b.user_lookup_email_no_sso); else if (1 === d.length) {
                var e = d[0].group;
                e && e.integrations && (org_id = e.id, idp_id = e.integrations[0].idp_conf.idpid, 
                c.jumpToSSOLogin(idp_id, org_id));
            } else g.error("onGetLoginOptions", a);
        },
        jumpToSSOLogin: function(a, b) {
            var c = this.options.type || "web", d = this.options.target || MX.getOrigin() + location.pathname;
            location.replace(MX.getOrigin() + "/sp/startSSO?type=" + c + "&target=" + encodeURIComponent(d) + "&idpid=" + encodeURIComponent(a) + "&orgid=" + encodeURIComponent(b));
        },
        gotoLogin: function() {
            e.navigate("/login", !0);
        }
    });
}), define("text!template/identity/verifyWelcome.html", [], function() {
    return '<div class="container2">\r\n    <h1 class="page-title">{{lang.verify_welcome_title}}</h1>\r\n\r\n    <form class="form-verify-welcome"  >\r\n\r\n        <div class="form-group" >\r\n            <div class=" verify-message alert"></div>\r\n        </div>\r\n        <div class="form-group">\r\n            <div class="message-desc"></div>\r\n        </div>\r\n    </form>\r\n\r\n</div>';
}), define("text!template/identity/verifyAlert.html", [], function() {
    return '<div class="container2">\n    <h1 class="page-title">{{lang.settings_verify_email}}</h1>\n\n    <form class="form-verify-welcome"  style="text-align: left">\n        <p >\n            {{lang.user_verify_email_undo_tip}}<strong>{{email}}</strong> {{lang.user_verify_email_undo_tip_2}}\n        </p>\n        <p>\n            {{lang.do_not_get_email}}<a href="javascript:;"  data-action="resendVerifyEmail" data-loading-text="{{lang.common_label_sending}}">{{lang.user_verify_email_resend_tip}}</a>\n        </p>\n        <div class="form-group" >\n            <div class=" verify-message alert"></div>\n        </div>\n        <div class="form-group">\n            <div class="message-desc"></div>\n        </div>\n    </form>\n\n</div>\n';
}), define("identity/verifyWelcome", [ "moxtra", "lang", "app", "text!template/identity/verifyWelcome.html", "text!template/identity/verifyAlert.html", "identity/identityBiz" ], function(a, b, c, d, e) {
    "use strict";
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            var a = c.request.page(), d = Moxtra.getMe();
            _.extend(this.$scope, {
                lang: b,
                email: d.email
            }), a ? this.verifyEmail(a) : this.showVerifyUI();
        },
        showVerifyUI: function() {
            var a = Moxtra.getMe(), b = this;
            this.template = e, b.checkAndJump() || this.listenTo(a, "change:email_verified", b.checkAndJump);
        },
        checkAndJump: function() {
            var a = Moxtra.getMe();
            return a.needVerifyEmail ? !1 : (c.request.navigate("timeline", null, null), !0);
        },
        verifyEmail: function(c) {
            var d = this;
            a.identify.verifyEmailToken(c).success(function(a) {
                d.$(".verify-message").html(MX.format(b.user_verify_email_success, {
                    email: MX.escapeHTML(a.data.email)
                })).append('  <a href="#login">' + b.label_free_trial_login_to_get_started + "</a>"), 
                d.$(".verify-message").removeClass("alert-danger").addClass("alert-success"), d.$(".message-desc").html(b.user_verify_email_success_desc);
            }).error(function() {
                d.$(".verify-message").html(b.user_verify_email_expired_desc), d.$(".verify-message").removeClass("alert-success").addClass("alert-danger");
            });
        },
        resendVerifyEmail: function() {
            Moxtra.getMe().resendVerifyEmail().success(function() {
                MX.ui.notifySuccess(b.user_verify_email_resend_success);
            }).error(function() {
                MX.ui.notifyError(b.user_verify_email_resend_failed);
            });
        }
    });
}), define("mx.app3", function() {});