define("text!template/settings/profile.html", [], function() {
    return '<div class="mx-profile-detail">\n    <div class="user-panel ">\n        <div class="row marginTop15 paddingTop5">\n            <div class="avatar-container">\n            </div>\n\n            <div class="col-md-6 col-md-offset-1">\n                <form id="user_profile_form">\n                    {{#unless unique_id}}\n                	<div class="form-group profile-email">\n	                	<label></label>\n	                    <button type="button" class="btn btn-link change-email js-sso-field" data-action="changeEmail">{{lang.change}}</button>\n	                    {{#unless emailVerified}}\n	                    <button type="button" class="btn btn-link verify-email" style="padding-left:0;" data-action="verifyEmail">{{lang.settings_verify_email}}</button>\n	                    {{/unless}}\n	                </div>\n                    {{/unless}}\n                    <div class="form-group">\n                        <input type="text" class="form-control js-sso-field" name="firstName"  placeholder="{{lang.first_name}}">\n                    </div>\n                    <div class="form-group">\n                        <input type="text" class="form-control js-sso-field" name="lastName"  placeholder="{{lang.last_name}}">\n                    </div>\n	                <div class="form-group">\n	                    <input type="text" class="form-control" name="phoneNumber" placeholder="{{lang.phone_number}}">\n	                </div>\n	                <div class="form-group">\n                        <span>{{lang.timezone_colon}}</span>\n	                	{{!-- https://github.com/boost-vault/date_time/blob/master/date_time_zonespec.csv --}}\n	                	<select id="timezone" name="timezone" class="form-control">\n	                		{{#each zones}}\n	                		<option value="{{name}}">{{display}}</option>\n	                		{{/each}}\n	                	</select>\n	                </div>\n                    {{#unless unique_id}}\n	                <div class="form-group">\n	                    <div>\n					      <input type="checkbox" name="enable_digest_emails" id="enableDigest"> <label for="enableDigest" style="font-weight: normal;">{{lang.settings_daily_digest_email}}</label>\n					    </div>\n	                </div>\n                    {{/unless}}\n\n\n	                <button type="submit" class="btn btn-primary">{{lang.update}}</button>\n\n                </form>\n\n                <div class="account-type">\n                	<strong>{{lang.settings_account_type}}:</strong>\n                    <span href="javascript:;" >{{lang.settings_free_edition}}</span>\n                    <!-- {{#if isBusinessTrial}}\n                    <button type="button" data-action="buyNow" class="btn btn-link buy-now">{{lang.settings_buy_now}}</button>\n                    {{else}}\n                    <button type="button" data-action="freeTrial" class="btn btn-link buy-now">{{lang.label_free_trial}}</button>\n                    {{/if}} -->\n                </div>\n\n                <!-- <div class="storage-usage">\n\n                </div> -->\n\n			</div>\n		</div>\n\n		<div class="row marginTop15">\n			<div class="panel-group col-md-6 col-md-offset-5" id="profile_accordion">\n                {{#unless unique_id}}\n		            <div class="change-pass-panel panel panel-default">\n		                <div class="panel-heading">\n                            <h4 class="panel-title">\n                                <a data-toggle="collapse" data-parent="#profile_accordion" href="#change_pass_panel" class="collapsed">\n                                    <i class="micon-arrow-right" />\n                                    {{lang.change_password}}\n                                </a>\n                            </h4>\n		                </div>\n		                <div id="change_pass_panel" class="panel-collapse collapse">\n		                    <div class="panel-body">\n		                        <form id="change_pass_form" role="form">\n		                        	<div class="form-group" >\n										<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="oldpass" class="form-control" data-error-style="inline" placeholder="{{lang.old_password}}" autocomplete="off">\n									</div>\n		                            <div class="form-group" >\n										<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="pass" class="form-control" data-error-style="inline" placeholder="{{lang.new_password}}" autocomplete="off">\n									</div>\n\n									<div class="form-group" >\n										<input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="confpass" class="form-control" data-error-style="inline" placeholder="{{lang.confirm_password}}" autocomplete="off">\n									</div>\n\n\n		                            <button type="submit" class="btn btn-primary">{{lang.change_password}}</button>\n		                        </form>\n		                    </div>\n		                </div>\n		            </div>\n                {{/unless}}\n		            <div class="mx-branding-send-feedback panel panel-default {{#unless branding.showFeedback}}hide{{/unless}}">\n		                <div class="panel-heading">\n                            <h4 class="panel-title">\n		                        <a data-toggle="collapse" data-parent="#profile_accordion" href="#send_feedback" class="collapsed">\n                                    <i class="micon-arrow-right" />\n		                            {{lang.settings_send_feedback}}\n		                        </a>\n                            </h4>\n		                </div>\n                        <div id="send_feedback" class="panel-collapse collapse">\n		                    <div class="panel-body">\n								<form id="send_feedback_form" class="form-horizontal" role="form">\n		                            <div class=" col-sm-12">\n			                            <div class="form-group">\n			                                <textarea class="form-control vertResize" name="feedback_text"  rows="3" placeholder="{{lang.send_feedback_hint}}"></textarea>\n			                            </div>\n		                            </div>\n\n		                            <div class="form-group">\n		                                <div class="col-sm-10">\n		                                    <button type="submit" class="btn btn-primary">{{lang.send}}</button>\n		                                </div>\n		                            </div>\n		                        </form>\n		                    </div>\n		                </div>\n		            </div>\n\n	        </div>\n		</div>\n	</div>\n\n\n</div>\n';
}), define("text!template/settings/profileAvatar.html", [], function() {
    return '<div class="col-md-4 btn-container">\n    <div class="mx-user contact-avatar">\n        <img id="user_avatar" class="img-circle" onerror="this.src=\'{{default_avatar}}\'" src="{{avatar}}">\n    </div>\n    <div class="change-avatar">\n    <div class="row">\n        <div class="col-xs-12">\n            {{#if isDefaultAvatar}}\n        	<a href="javascript:;"  id="changeavatar_flashuploader">\n        		{{lang.settings_change_photo}}\n        	</a>\n            {{else}}\n            <a href="javascript:;" data-toggle="dropdown" data-action="refreshUploader">\n                {{lang.settings_change_photo}}\n                <span class="caret"></span>\n            </a>\n            <ul class="dropdown-menu" role="menu">\n                <li>\n                    <a href="javascript:;" id="changeavatar_flashuploader">\n                        <i class="micon-upload"></i><span>{{lang.settings_upload_photo}}</span>\n                    </a>\n                </li>\n                <li>\n                    <a href="javascript:;" data-action="removePhoto">\n                        <i class="micon-trash"></i><span>{{lang.settings_remove_photo}}</span>\n                    </a>\n                </li>\n            </ul>\n\n            {{/if}}\n        </div>\n    </div>\n    </div>\n\n</div>\n';
}), define("text!template/settings/storageUsage.html", [], function() {
    return '<div class="storage-usage-wrap">\n	<strong>{{lang.storage_usage}}:</strong> ({{used}} / {{remaining}})\n	<div class="progress">\n	  <div class="progress-bar progress-bar-{{level}} {{cls}}" role="progressbar" aria-valuenow="{{percent}}" aria-valuemin="0" aria-valuemax="100" style="width: {{percent}}%">\n	    {{percent}}%\n	  </div>\n	</div>\n</div>';
}), define("settings/profile", [ "moxtra", "lang", "const", "app", "text!template/settings/profile.html", "text!template/settings/profileAvatar.html", "text!template/settings/storageUsage.html", "component/uploader/uploader", "user/userModel", "user/userBiz", "binder/fileProgress", "group/groupBiz", "component/dialog/inputDialog", "common/userCap", "admin/branding/helper", "identity/logout" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    var q = i.extend({
        accountType: b.settings_free_edition,
        enable_digest_emails: !0,
        emailVerified: !0,
        validation: {
            firstName: {
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
            phoneNumber: {
                required: !1,
                pattern: /^\+?[0-9-.() ]{0,16}$/,
                msg: b.settings_invalid_phone_number
            }
        }
    }), r = a.Model.extend({
        oldpass: "",
        pass: "",
        confpass: "",
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
    }), s = a.Model.extend({
        feedback_text: "",
        validation: {
            feedback_text: {
                required: !0
            }
        }
    }), t = Handlebars.compile(f), u = Handlebars.compile(g);
    return a.Controller.extend({
        template: e,
        handleAction: !0,
        init: function() {
            var a = this;
            this.$scope.lang = b, this.$scope.branding = {
                showFeedback: o.isShowFeedback()
            }, this.$scope.zones = Moxtra.util.getZones();
            var c = Moxtra.getMe(), d = this.profileModel = new q(c, {
                parse: !0
            });
            d.set("enable_digest_emails", void 0 == c.enable_digest_emails ? !0 : c.enable_digest_emails), 
            d.set("emailVerified", c.email_verified || !1), d.set("timezone", c.timezone || b.myprofile_option_america_la), 
            this.$scope.unique_id = c.unique_id, c.picture4x ? d.set("avatar", "/user/" + c.picture4x) : d.set("avatar", c.avatar), 
            c.groupId && (d.set("groupAccessType", c.groupAccessType), d.set("groupStatus", c.groupStatus), 
            "GROUP_NORMAL_SUBSCRIPTION" === c.groupStatus ? d.set("accountType", b.business_edition) : (d.set("accountType", b.business_edition_trial), 
            this.$scope.isBusinessTrial = !0), l.getIntegrationList(c.groupId).success(function(b) {
                MX.each(b.data, function(b) {
                    b.saml_email_domain && b.saml_email_domain_verified && (a.$(".change-pass-panel").hide(), 
                    a.$("#user_profile_form").find(".js-sso-field").prop("disabled", !0));
                });
            })), this.model = d, this.listenTo(d, "change:avatar", this.updateAvatar), this.changePassModel = new r(), 
            this.sendFeedbackModel = new s();
        },
        updateEmail: function(a) {
            this.$(".profile-email label").html(MX.escapeHTML(a.get("email"))), a.get("groupStatus") ? this.$(".change-email").hide() : (this.$(".change-email").show(), 
            a.get("emailVerified") ? this.$(".verify-email").hide() : this.$(".verify-email").show());
        },
        updateAccountType: function(a) {
            this.$(".account-type span").html(MX.escapeHTML(a.get("accountType")));
            var b = a.get("groupStatus"), c = a.get("groupAccessType");
            b ? "GROUP_TRIAL_SUBSCRIPTION" === b && "GROUP_OWNER_ACCESS" === c ? this.$(".buy-now").show() : this.$(".buy-now").hide() : this.$(".buy-now").show();
        },
        updateAvatar: function(a) {
            var d = this.$(".avatar-container"), e = a.toJSON();
            (e.avatar === c.defaults.user.avatar || e.avatar === Moxtra.getMe().branding.getDefaultUserAvatar()) && (e.isDefaultAvatar = !0), 
            e = _.extend(e, {
                lang: b,
                default_avatar: c.defaults.user.avatar
            }), d.find("#user_avatar").length ? d.find("#user_avatar").attr("src", e.avatar) : (d.empty(), 
            d.html($(t(e))));
        },
        updateTimezone: function(a) {
            var c = a.get("timezone");
            this.$("#timezone").val(c ? c : b.myprofile_option_america_la);
        },
        updateStorageUsage: function() {
            var a = this, c = Moxtra.getMe(), d = n.getMaxCloudSize(), e = 0, f = 0, g = 0, h = "success", i = "";
            d && (f = MX.lang.formatSize(c.total_cloud_size), g = MX.lang.formatSize(d), e = Math.round(c.total_cloud_size / d * 1e3) / 10, 
            10 > e ? i = "gray" : e > 60 && 80 > e ? h = "warning" : e >= 80 && (h = "danger"), 
            a.$(".storage-usage").html($(u({
                lang: b,
                used: f,
                remaining: g,
                percent: e,
                level: h,
                cls: i
            }))));
        },
        rendered: function() {
            this.user_profile_form = new MX.Form({
                parent: this,
                form: this.$("#user_profile_form"),
                model: this.profileModel,
                submit: this.updateProfile,
                scope: this
            }), this.change_pass_form = new MX.Form({
                parent: this,
                form: this.$("#change_pass_form"),
                model: this.changePassModel,
                submit: this.changePassword,
                scope: this
            }), this.send_feedback_form = new MX.Form({
                parent: this,
                form: this.$("#send_feedback_form"),
                model: this.sendFeedbackModel,
                submit: this.sendFeedback,
                scope: this
            }), this.updateEmail(this.profileModel), this.updateAccountType(this.profileModel), 
            this.updateAvatar(this.profileModel), this.updateTimezone(this.profileModel), this.initUploader();
        },
        initUploader: function() {
            var a = this;
            h.register("changeAvatar", {
                browse_button: "changeavatar_flashuploader",
                url: function() {
                    return "/user/upload?type=original";
                },
                filters: {
                    mime_types: [ {
                        title: b.image_files,
                        extensions: "jpeg,jpg,gif,png"
                    } ]
                },
                success: function(b, c) {
                    var d = JSON.parse(c.response);
                    a.profileModel.set("avatar", "/user/" + d.object.user.picture4x), h.refresh("changeAvatar", $("#changeavatar_flashuploader"));
                },
                error: function() {
                    h.refresh("changeAvatar", $("#changeavatar_flashuploader"));
                }
            }), h.refresh("changeAvatar", $("#changeavatar_flashuploader")), this.recovery(function() {
                h.unregister("changeAvatar");
            });
        },
        refreshUploader: function() {
            setTimeout(function() {
                h.refresh("changeAvatar", $("#changeavatar_flashuploader"));
            }, 100);
        },
        removePhoto: function() {
            var c = this;
            new a.ui.Dialog({
                title: b.settings_remove_photo,
                content: "<div>" + b.settings_remove_photo_confirm + "</div>",
                buttons: [ {
                    text: b.yes,
                    className: "btn-primary",
                    click: function() {
                        var a = this;
                        j.removePhoto().success(function() {
                            c.profileModel.set("avatar", Moxtra.getMe().branding.getDefaultUserAvatar()), new MX.ui.Notify({
                                type: "success",
                                content: b.settings_remove_photo_succeed
                            }), a.close();
                        }).error(function() {
                            new MX.ui.Notify({
                                type: "error",
                                content: b.settings_remove_photo_failed
                            }), a.close();
                        });
                    }
                }, {
                    text: b.no,
                    click: function() {
                        this.close();
                    }
                } ]
            });
        },
        verifyEmail: function() {
            j.resendVerifyEmail().success(function() {
                MX.ui.notifySuccess(b.user_verify_email_resend_success);
            }).error(function() {
                MX.ui.notifyError(b.user_verify_email_resend_failed);
            });
        },
        changeEmail: function() {
            var a = this;
            new MX.ui.Dialog(new m({
                model: a.profileModel,
                title: b.settings_change_email,
                input: {
                    name: "email",
                    placeholder: b.settings_please_enter_your_new_email
                },
                buttons: [ {
                    text: b.change,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    if (!a.profileModel.isValid(!1)) {
                        var c = this;
                        c.dialog.progress(), j.updateEmail(a.profileModel.get("email")).success(function() {
                            MX.ui.notifySuccess(b.change_email_success), c.dialog.progress(!1), c.dialog.close(), 
                            d.navigate("/logout");
                        }).error(function(a) {
                            MX.ui.notifyError(a && a.xhr && 409 === a.xhr.status ? b.change_email_conflict : b.change_email_failed), 
                            c.dialog.progress(!1);
                        });
                    }
                }
            }));
        },
        changePassword: function() {
            var a = this.changePassModel.toJSON(), c = this;
            j.changePassword(a.oldpass, a.pass).success(function() {
                MX.ui.notifySuccess(b.change_password_success), c.recovery(new p());
            }).error(function(a) {
                MX.ui.notifyError(400 == a.xhr.status ? b.settings_please_enter_correct_password : b.change_password_failed);
            });
        },
        sendFeedback: function() {
            var a = this, c = this.sendFeedbackModel.toJSON();
            j.sendFeedback(c.feedback_text).success(function() {
                a.sendFeedbackModel.set("feedback_text", ""), MX.ui.notifySuccess(b.send_feedback_success);
            }).error(function() {
                MX.ui.notifySuccess(b.send_feedback_failed);
            });
        },
        updateProfile: function() {
            var a = this.profileModel.toJSON(), c = {
                first_name: a.firstName,
                last_name: a.lastName,
                name: a.firstName + " " + a.lastName,
                phone_number: a.phoneNumber,
                enable_digest_emails: a.enable_digest_emails,
                timezone: a.timezone
            };
            j.updateProfile(c).success(function() {
                MX.ui.notifySuccess(b.update_profile_success);
            }).error(function() {
                MX.ui.notifyError(b.update_profile_failed);
            });
        },
        freeTrial: function() {
            d.navigate("/trial");
        },
        buyNow: function() {
            d.navigate("/admin/upgrade");
        }
    });
}), define("text!template/settings/setpass.html", [], function() {
    return '<div class="mx-padding30">\n\n        <div class="row">\n            <!-- <div class="col-md-offset-4 col-md-4"> -->\n            <div class="col-md-4">\n                <div class="form-group" >\n                    <p>{{lang.set_moxtra_password}}</p>\n                </div>\n                <form id="change_pass_form" role="form" class="form-signin form-changepass">\n                    <div class="form-group" >\n                        <input type="text" autocapitalize="off" autocorrect="off" disabled autocomplete="off" name="email" class="form-control" data-error-style="inline" autocomplete="off">\n                    </div>\n                    <div class="form-group" >\n                        <input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="pass" class="form-control" data-error-style="inline" placeholder="{{lang.password}}" autocomplete="off">\n                    </div>\n\n                    <div class="form-group" >\n                        <input type="password" autocapitalize="off" autocorrect="off" autocomplete="off" name="confpass" class="form-control" data-error-style="inline" placeholder="{{lang.confirm_password}}" autocomplete="off">\n                    </div>\n\n                    <button type="submit" class="btn btn-primary">{{lang.common_set_password}}</button>\n                </form>\n\n                <div>\n                    <p>{{lang.download_moxtra_for_mobile}}</p>\n                    <div class="form-group padding15">\n                        <a target="_blank" href="https://itunes.apple.com/app/id590571587?mt=8"><img src="themes/images/appstore.a93677bc.png" width="142" height="42"/></a>\n                        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.moxtra.binder"><img src="themes/images/googleplay.2c5ce0e1.png" width="124" height="44"/></a>\n                    </div>\n                </div>\n\n                <div>\n                    <p>{{lang.open_and_login_mobile_app}}</p>\n                </div>\n\n            </div>\n            <!-- <div class="col-md-6 changepass-iframe">\n                <iframe src="https://www.moxtra.com/secure/sfdc/download-iframe/" width="500" height="257" border="0" scrolling="auto" style="border:0;"></iframe>\n            </div> -->\n\n    </div>\n\n\n</div>';
}), define("settings/setpass", [ "moxtra", "lang", "const", "text!template/settings/setpass.html", "user/userBiz" ], function(a, b, c, d, e) {
    var f = a.Model.extend({
        defaults: {
            pass: "",
            confpass: "",
            email: ""
        },
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
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b;
            var a = Moxtra.getMe();
            this.model = new f({
                email: a.email
            });
        },
        rendered: function() {
            this.form = new a.Form({
                parent: this,
                form: this.$("#change_pass_form"),
                model: this.model,
                submit: this.submit,
                scope: this
            });
        },
        submit: function() {
            var a = this.form, b = this;
            a.disable(!0), e.updateProfile(b.model).scope(b).success(b.setPassSuccess).error(b.setPassError).complete(function() {
                a.disable(!1);
            });
        },
        setPassSuccess: function() {
            this.form.showSuccess(b.set_password_success);
        },
        setPassError: function() {
            this.form.showError(b.set_password_failed);
        }
    });
}), define("text!template/settings/settings.html", [], function() {
    return '<div class="page-body" >\n    <div id="mxPageBody_Col_1">\n        <div class="mx-settings mx-list">\n            <ul class="mx-sub-nav">\n                <li id="profile"><a href="javascript:;" data-action="setCurrSubView" data-param="profile">{{lang.profile}}</a></li>\n                <li id="billing" class="hide"><a href="javascript:;" data-action="setCurrSubView" data-param="billing">{{lang.plan_and_billing}}</a></li>\n\n                {{#if showTodo}}\n                <li id="assigntome"><a href="javascript:;"  data-action="setCurrSubView" data-param="assigntome">{{lang.to_do}} ({{lang.assigned_to_me}})</a></li>\n                {{/if}}\n\n                {{#unless isIntegrationAgent}}\n                <li id="logout"><a href="javascript:;" data-action="setCurrSubView" data-param="logout">{{lang.logout}}</a></li>\n                {{/unless}}\n            </ul>\n            <div class="mx-get-moxtra-faq">\n                {{#unless isIntegrationAgent}}\n                <span><a href="http://www.moxtra.com/download/" target="_blank">{{lang.get_moxtra_desktop}}</a>{{lang.improve_productive}}</span>\n                <hr />\n                {{/unless}}\n                <a href="http://support.moxtra.com" target="_blank">{{lang.read_faq}}</a>\n\n            </div>\n        </div>\n\n    </div>\n    <div id="mxPageBody_Col_2">\n       	{{lang.loading}}\n    </div>\n</div>\n';
}), define("settings/settings", [ "moxtra", "lang", "const", "text!template/settings/settings.html", "app", "settings/profile", "buy/billing", "settings/mytodo", "admin/branding/helper", "component/dialog/dialog" ], function(a, b, c, d, e, f, g, h, i) {
    {
        var j = {
            profile: f,
            billing: g,
            assigntome: h
        };
        MX.logger("Settings");
    }
    return a.Controller.extend({
        template: d,
        handleAction: !0,
        init: function() {
            this.$scope.lang = b, this.listenTo(e.request, "change:page", this.showSubView), 
            this.$scope.isIntegrationAgent = !!e.isIntegrationAgent(), this.$scope.showTodo = i.isShowTodo(), 
            $(this.container).addClass("mx-layout-three");
        },
        rendered: function() {
            var a = e.request.page(), b = this;
            a || (a = "profile", e.request.page(a, !1)), MX.loading(!0), Moxtra.onReady(function() {
                if (MX.loading(!1), e.config.global.mx_production) b.$("#billing").remove(), delete j.billing; else {
                    var a = Moxtra.getMe(), d = Moxtra.getMyGroup() || {};
                    d.id && a.groupAccessType == c.group.userRole.owner && a.groupStatus == c.group.status.normal ? b.$("#billing").removeClass("hide") : (b.$("#billing").remove(), 
                    delete j.billing);
                }
                b.highlight(), b._setCurrSubView();
            });
        },
        showSubView: function() {
            var a = e.request.page();
            a && this._setCurrSubView(a), this.highlight();
        },
        highlight: function() {
            var a, b = e.request.page(), c = this.currPage, d = this;
            return c && c !== b && this.$("#" + c).removeClass("active"), b && (a = d.$("#" + b), 
            a.addClass("active")), this.currPage = b, a;
        },
        setCurrSubView: function(a) {
            "logout" === a ? this._setCurrSubView(a) : "services" === a && e.request.sequence() ? (e.request.sequence(""), 
            this.subView && (this.subView.destroy(), this.subView = null), this._setCurrSubView(a)) : e.request.page(a, !1);
        },
        _setCurrSubView: function(a) {
            var c = this.subView, a = a || e.request.page();
            if ("logout" === a) return e.sendMessage({
                action: "logout",
                session_id: Moxtra.getMe().sessionId
            }), void new MX.ui.Dialog({
                title: b.confirm_logout,
                content: b.are_you_sure_to_logout,
                buttons: [ {
                    text: b.yes,
                    className: "btn-danger",
                    click: function() {
                        this.close(), MX.logout(function() {
                            Moxtra.logout(), e.request.navigate("login"), e.localStatus.remove("mxMeetInvitees"), 
                            location.reload();
                        });
                    }
                }, {
                    text: b.no,
                    click: function() {
                        this.close();
                    }
                } ]
            });
            j[a] || (a = "profile");
            var d = j[a];
            if (c) {
                if (c instanceof d) return;
                c.destroy();
            }
            $("#mxPageBody_Col_2").empty(), c = this.subView = new d({
                renderTo: "#mxPageBody_Col_2"
            }), c.$el.addClass(a), this.recovery(c), this.highlight();
        }
    });
}), define("user/avatar", [ "moxtra", "lang", "text!template/user/avatarView.html" ], function(a, b, c) {
    return a.Controller.extend({
        template: c,
        init: function() {
            this.$scope.lang = b, this.listenTo(this.model, "change", this.updateView);
        }
    });
}), define("../framework/viewer/dsView", [ "moxtra", "lang", "app", "meet/meetBiz", "meet/connector/util", "text!template/viewer/dsView.html" ], function(a, b, c, d, e, f) {
    var g = Handlebars.compile(f), h = MX.logger("dsView");
    return a.Controller.extend({
        tagName: "div",
        className: "mx-viewer-subview mx-viewer-ds",
        handleAction: !0,
        init: function(a) {
            this.listenTo(a.parent, "modelChange", this._onModelChange), a.parent.collection && this.listenTo(a.parent.collection, "remove", this._onModelRemoved), 
            this.dsModel = d.getDSModel(), this.listenTo(this.dsModel, "change:aLoad", this._AttendeeLoad), 
            this.listenTo(this.dsModel, "change:aConnected", this._AttendeeConnected), this.listenTo(this.dsModel, "change:aStarted", this._AttendeeStarted), 
            this.listenTo(this.dsModel, "change:aReconnect", this._AttendeeReconnect), this.listenTo(this.dsModel, "change:aTimeout", this._AttendeeTimeout), 
            this.listenTo(this.dsModel, "change:aStopped", this._AttendeeStopped), this.listenTo(this.dsModel, "change:aNotSupported", this._AttendeeNotSupported), 
            this.listenTo(this.dsModel, "change:aResize", this._AttendeeResize), this.listenTo(this.dsModel, "change:pStarted", this._PresenterStarted), 
            this.listenTo(this.dsModel, "change:pStopped", this._PresenterStopped), this.listenTo(this.dsModel, "change:pNotSupported", this._PresenterNotSupported), 
            this.listenTo(this.dsModel, "change:destoryAction", this._PresenterDestoryPage);
        },
        _onModelRemoved: function(a) {
            /ds/.test(a.get("type")) && (h.log("[_onModelRemoved] dsview removed, reset dsModel"), 
            this.dsModel.reset());
        },
        _onModelChange: function(a, b) {
            if (a) {
                var c = a.get("type");
                return /ds/.test(c) ? this.show(a, b) : void this.hide();
            }
        },
        show: function(a, b) {
            this.model = a, this.parent = b, h.logServer(e.logFormat("[dsView show] set ds sequence to dsModel, sequence: " + a.get("sequence"))), 
            this.dsModel.setSequence(a.get("sequence")), this.$el.empty().show(), this._render(a), 
            this.start();
        },
        _render: function(a) {
            var c = {
                lang: b
            };
            _.extend(c, a.toJSON()), this.$el.html(g(c)), this._setMessage(b.loading), this.$viewer = this.$(".ds-attendee-viewer"), 
            h.logServer(e.logFormat("[dsView _render] ds page rendered, sequence: " + a.get("sequence")));
        },
        _AttendeeLoad: function() {
            this._setMessage(b.screenshare_msg_attendee_loading), new MX.ui.Notify({
                type: "success",
                content: b.screenshare_msg_status_started
            });
        },
        _AttendeeConnected: function() {
            this.$viewer.empty(), this.$viewer.css("background-color", "#5E5E5A"), this._setMessage();
        },
        _AttendeeStarted: function(a) {
            h.logServer(e.logFormat("[dsView _AttendeeStarted] model: " + JSON.stringify(a.toJSON())));
        },
        _AttendeeReconnect: function() {
            new MX.ui.Notify({
                type: "error",
                content: b.screenshare_msg_attendee_reconnect
            });
        },
        _AttendeeTimeout: function() {
            new MX.ui.Notify({
                type: "error",
                content: b.screenshare_msg_attendee_network_disconnected
            });
        },
        _AttendeeStopped: function(a) {
            h.logServer(e.logFormat("[dsView _AttendeeStopped:begin] attendee stopped, model: " + JSON.stringify(a.toJSON()))), 
            new MX.ui.Notify({
                type: "info",
                content: b.screenshare_msg_status_stopped
            }), this.hide(), this._cleanUp(), h.logServer(e.logFormat("[dsView _AttendeeStopped:end] attendee stopped, model: " + JSON.stringify(a.toJSON())));
        },
        _AttendeeNotSupported: function() {
            -1 != navigator.platform.indexOf("Mac") ? this._setMessage(b.screenshare_msg_browser_supported_on_mac) : -1 != navigator.platform.indexOf("Win") && this._setMessage(b.screenshare_msg_browser_supported_on_win);
        },
        _AttendeeResize: function(a) {
            var b = a.getAttendeeResize();
            h.log("[Attendee] resize: ", b), b.width && this.model.set("width", b.width), b.height && this.model.set("height", b.height), 
            this.parent.zoom();
        },
        _PresenterStarted: function(a) {
            h.logServer(e.logFormat("[dsView _PresenterStarted] model: " + JSON.stringify(a.toJSON()))), 
            this._setMessage(b.screenshare_msg_started);
        },
        _PresenterStopped: function(a) {
            h.logServer(e.logFormat("[dsView _PresenterStopped:begin] presenter stopped, model: " + JSON.stringify(a.toJSON()))), 
            this.hide(), h.logServer(e.logFormat("[dsView _PresenterStopped:end] presenter stopped, model: " + JSON.stringify(a.toJSON())));
        },
        _PresenterNotSupported: function() {
            -1 != navigator.platform.indexOf("Mac") ? this._setMessage(b.screenshare_msg_browser_supported_on_mac) : -1 != navigator.platform.indexOf("Win") && this._setMessage(b.screenshare_msg_browser_supported_on_win);
        },
        _PresenterDestoryPage: function() {
            h.logServer(e.logFormat("[dsView _PresenterDestoryPage] ds page deleted.")), this._cleanUp();
        },
        start: function() {
            h.log("dsView, call biz to start DS"), h.logServer(e.logFormat("[dsView start] try to call biz.startDS()")), 
            d.startDS();
        },
        _setMessage: function(a) {
            var b = this.$(".ds-message .message-text");
            b.empty(), a ? (this.$(".ds-message").removeClass("hide"), b.append(a)) : this.$(".ds-message").addClass("hide");
        },
        _cleanUp: function() {
            if (this.model) {
                var a = this.parent.collection.get(this.model.get("sequence"));
                h.log("hide dsView", a), h.logServer(e.logFormat("[dsView _cleanUp] remove ds model from collection, sequence: " + this.model.get("sequence"))), 
                this.parent.collection.remove(a);
            }
            h.logServer(e.logFormat("[dsView _cleanUp] reset ds model.")), this.dsModel.reset();
        },
        hide: function() {
            h.log("[hide] hide dsview page"), this.$el.loading(!1), this.$el.empty(), this.$el.hide();
        }
    });
}), define("../framework/viewer/imageView", [ "moxtra", "app" ], function(a, b) {
    "use strict";
    var c = a.logger("Viewer:ImageView");
    return a.Controller.extend({
        tagName: "div",
        className: "mx-viewer-subview mx-viewer-image",
        init: function(a) {
            this.listenTo(a.parent, "modelChange", this._onModelChange), this.listenTo(a.parent, "resize", this.adjustImage), 
            this.parent = a.parent;
        },
        _onModelChange: function(a, b) {
            if (a) {
                var d = this, e = (d.loader = new Image(), a.get("type"));
                return this.model && this.stopListening(this.model), this.model = a, this.listenTo(a, "change:rotate", this.onRotate, this), 
                /image|pdf/.test(e) ? (c.debug("model change in image view"), this.show(a, b)) : void this.hide();
            }
        },
        onRotate: function(a) {
            this.rotate(a);
        },
        show: function(a, c, d) {
            this.isShow = !0;
            var e = this;
            if (e.$el.empty().show(), a) {
                var f = (a.get("sequence"), a.get("rotate") || 0);
                e.$el.loading({
                    length: 7,
                    color: "#fff"
                });
                var g = $(document.createElement("img")).attr({
                    src: b.const.defaults.blankImg,
                    height: "100%",
                    width: "100%"
                });
                g.on("load", function() {
                    e.$el.loading(!1);
                }).on("error", function() {
                    e.$el.loading(!1);
                }), d ? g.attr("src", a.get("originalResource")) : g.attr("src", a.get("source")), 
                g.appendTo(e.el), 0 !== f && this.rotate(f);
            }
        },
        hide: function() {
            this.isShow = !1, this.$el.loading(!1), this.$el.empty(), this.$el.hide();
        },
        rotate: function(a) {
            a % 90 !== 0 && (a = 0);
            var b = "rotate(" + a + "deg)";
            this.$("img").css({
                "-o-transform": b,
                "-webkit-transform": b,
                "-moz-transform": b,
                "-ms-transform": b,
                transform: b
            }), this.parent.zoom(), this.adjustImage(this.parent.viewRealSize);
        },
        adjustImage: function(a) {
            var b = this.parent.model.get("rotate") || 0, c = a.width, d = a.height, e = (d - c) / 2;
            this.$("img").css(b % 180 !== 0 ? {
                height: c,
                width: d,
                left: 0 - e,
                bottom: e
            } : {
                height: d,
                width: c,
                left: 0,
                bottom: 0
            });
        }
    });
}), define("../framework/viewer/mediaView", [ "moxtra", "text!template/viewer/audioView.html", "text!template/viewer/videoView.html" ], function(a, b, c) {
    "use strict";
    var d = a.logger("Viewer:AudioView"), e = {
        audio: Handlebars.compile(b),
        video: Handlebars.compile(c)
    };
    return e.note = e.video, a.Controller.extend({
        tagName: "div",
        className: "mx-viewer-subview mx-viewer-media",
        handleAction: MX.env.isMobile ? !0 : !1,
        init: function(a) {
            this.listenTo(a.parent, "modelChange", this._onModelChange), this.listenTo(a.parent, "close", this._onClose), 
            this._player = {}, this.parent = a.parent;
        },
        _onClose: function() {
            if (this.player()) try {
                this.player().pause();
            } catch (a) {}
        },
        _onModelChange: function(a, b) {
            if (a) {
                var c = this, d = a.get("type");
                if (this.model && this.stopListening(this.model), !/audio|video|note/.test(d)) return c.hide();
                c.model = a, this.listenTo(a, "change", function(a) {
                    var b = a.changed;
                    b && (b && void 0 !== b.rotate && c.onRotate(), void 0 !== b.source && (c.player().src = a.get("source")), 
                    "video" === a.get("type") && void 0 !== b.thumbnail && (c.player().poster = a.get("thumbnail")));
                }, this), MX.env.isFF && (this._player = {}, this.$el.empty()), c.show(a, b);
            }
        },
        onRotate: function(a, b) {
            this.rotate(b);
        },
        _onResize: function(a) {
            this.model && "audio" === this.model.get("type") && this.$(".mejs-audio").top(a.height / 2), 
            this.$el.css(a);
        },
        player: function() {
            if (!this.model) return null;
            var a = this.model.get("type");
            return "note" === a && (a = "video"), this._player[a];
        },
        show: function(a, b) {
            var c = this;
            if (c.$el.show(), a) {
                if (MX.env.isMobile) return void c.$el.append(e[a.get("type")](_.extend(a.toJSON(), {
                    isMobile: !0,
                    width: c.parent.viewRealSize.width,
                    height: c.parent.viewRealSize.height
                })));
                var d = a.get("type");
                if ("note" === d && (d = "video"), this.$el.removeClass("video" === d ? "audio" : "video").addClass(d), 
                this.player()) {
                    var f = a.toJSON();
                    c.player().setSrc(f.source);
                    var g = $(c.player()).data("mediaelementplayer");
                    if ("video" === d) {
                        var h = this.parent.viewRealSize;
                        g.setPlayerSize(h.width, h.height), c.player().poster = f.thumbnail, c.$el.addClass("no-svg");
                    } else g.setPlayerSize(400, 30);
                } else c.$el.append(e[a.get("type")](a.toJSON())), c.$(d).mediaelementplayer({
                    iPadUseNativeControls: !0,
                    iPhoneUseNativeControls: !0,
                    flashName: "lib/mediaelement/build/flashmediaelement.f82e1f90.swf",
                    success: function(a) {
                        c._player[d] = a, a.addEventListener("play", function() {
                            c._triggerEvent("play", b);
                        }), a.addEventListener("pause", function() {
                            c._triggerEvent("pause", b);
                        }), a.addEventListener("ended", function() {
                            c._triggerEvent("end", b);
                        }), addEventListener("seeked", function() {
                            c._triggerEvent(c.player.paused ? "pause" : "play", b);
                        }), a.load();
                    }
                });
                var i = a.get("rotate");
                i && i > 0 && c.rotate(i);
            }
        },
        hide: function() {
            var a = this;
            try {
                a.player() && a.player().stop();
            } catch (b) {}
            a.$el.hide(), MX.env.isMobile && a.$el.empty();
        },
        _triggerEvent: function(a, b) {
            var c = this;
            b.suppress_event ? b.suppress_event = !1 : b.trigger("viewer:pageAction", {
                view: c.model.get("type"),
                cmd: a,
                currentTime: c.player().currentTime,
                page_sequence: c.model.get("sequence"),
                video_sequence: c.model.get("sequence")
            });
        },
        playOnMobile: function(a) {
            window.open(a, "", "top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
        },
        play: function(a) {
            if (!this.player()) {
                var b = this;
                return void setTimeout(function() {
                    b.play(a);
                }, 1e3);
            }
            try {
                MX.isNumber(a) && a >= 0 && this.player().setCurrentTime(a), this.player().play();
            } catch (c) {
                d.error(c);
            }
        },
        pause: function(a) {
            try {
                MX.isNumber(a) && a >= 0 && this.player().setCurrentTime(a), this.player().pause();
            } catch (b) {
                d.error(b);
            }
        },
        end: function() {
            try {
                this.player().pause(), this.player().setCurrentTime(this.player().duration);
            } catch (a) {
                d.error(a);
            }
        },
        rotate: function(a) {
            a % 90 !== 0 && (a = 0);
            var b = "rotate(" + a + "deg)";
            if (this.$("video").css({
                "-o-transform": b,
                "-webkit-transform": b,
                "-moz-transform": b,
                "-ms-transform": b,
                transform: b
            }), a % 180 !== 0) {
                var c = this.parent.viewRealSize;
                $(this.player()).css({
                    width: c.width,
                    height: c.height
                });
            }
        }
    });
}), define("../framework/viewer/static", [ "moxtra", "text!template/viewer/button.html" ], function(a, b) {
    var c = MX.ns("MX.viewer"), d = {}, e = {};
    return c.extend({
        btnTpl: Handlebars.compile(b),
        registerPlugin: function(a, b) {
            d[a] = b;
        },
        getPlugin: function(a) {
            return d[a];
        },
        addCommand: function(a, b) {
            e[a] = b;
        },
        getCommands: function() {
            return e;
        }
    }), c;
}), define("../framework/viewer/svgView", [ "moxtra", "app", "painter", "binder/binderBiz", "uuid", "const" ], function(a, b, c, d, e, f) {
    var g = a.logger("Viewer:SvgView");
    return window.uuid = e, a.Controller.extend({
        tagName: "div",
        className: "mx-viewer-subview mx-viewer-svg",
        init: function(a) {
            this.listenTo(a.parent, "modelChange", this._onModelChange), this.listenTo(a.parent, "resize", this._onResize), 
            this.parent = a.parent;
        },
        _onModelChange: function(a, c) {
            if (a) {
                var d = this;
                d.model && (d.stopListening(a), d.model.contents && d.stopListening(d.model.contents), 
                MX.Painter.Helper.stopPlay());
                var e = a.get("type");
                if (b.config.global.mx_production) {
                    if (!/whiteboard|pdf|image/.test(e)) return d.hide();
                } else {
                    if (!/whiteboard|pdf|image|ds/.test(e)) return d.hide();
                    if ("ds" === e && c.userRole == f.binder.role.Presenter) return d.hide();
                }
                "whiteboard" == e ? d.$el.css("background-color", "#fff") : d.$el.css("background-color", "transparent"), 
                this.listenTo(a, "change:rotate", this._onRotate), a.contents && (this.listenTo(a.contents, "add", function(b) {
                    d.addElement(b, a.sequence);
                }), this.listenTo(a.contents, "remove", function(a) {
                    d.painter && d.painter.deleteElement(a.client_uuid);
                }), this.listenTo(a.contents, "modelChange", function(b) {
                    d.addElement(b, a.sequence);
                }), a.contents.length || null !== Moxtra.util.getPublicViewToken() && a.getPageInfo()), 
                d.model = a, d.show(a, c);
            }
        },
        _onRotate: function() {
            var a = this.model.toJSON(), b = a.rotate, c = a.width, d = a.height;
            b % 180 != 0 && (c = d, d = a.width), this.painter && this.painter.resize({
                width: c,
                height: d
            }, 1);
        },
        _onResize: function(a) {
            a || (a = this.parent.viewRealSize), this.viewScale = this.parent.viewScaleNumber, 
            this.painter && this.painter.resize(a, this.viewScale);
        },
        show: function(a, b) {
            var c = this;
            if (c.$el.empty(), a) {
                var e = a.toJSON(), f = b.viewRealSize, h = e.width, i = e.height;
                e.rotate % 180 != 0 && (h = i, i = e.width), this.painter = new MX.Painter.Page({
                    displayWidth: f.width,
                    displayHeight: f.height,
                    width: h,
                    height: i,
                    renderTo: this.el
                }), g.debug("init painter", this.painter.id), this._onResize(), c.$el.show(), g.debug("load data ", e);
                var j;
                (j = a.contents) ? this.listenTo(j, "inited", function() {
                    j.each(function(b) {
                        c.addElement(b, a.sequence);
                    });
                }) : (d.getBoardPageData(e.boardid, e.sequence, e.token).scope(this).success(this._onSuccess).error(this._onError), 
                c.$el.loading({
                    length: 7,
                    color: "#fff"
                })), this.trigger("show");
            }
        },
        _onSuccess: function(a) {
            this.$el.loading(!1);
            var b = a && a.data && a.data.sequence, a = MX.pick(a, [ "data.contents" ], {
                format: function() {
                    return "items";
                }
            }), c = this;
            MX.each(a.items, function(a) {
                c.addElement(a, b);
            });
        },
        addElement: function(a, b) {
            if (this.model && (!b || !this.model || b === this.model.get("sequence"))) if (a.is_deleted) this.painter.deleteElement(a.client_uuid); else {
                var c = MX.Painter.Helper.svgToModel(a.svg_tag, a.client_uuid, a, this.model);
                c && this.painter && this.painter.addElement(c);
            }
        },
        _onError: function() {
            this.$el.loading(!1);
        },
        hide: function() {
            var a = this;
            a.$el.empty(), this.painter && this.painter.destroy(), a.$el.hide();
        },
        editable: function(a) {
            var b = this, c = a ? "editable" : "uneditable";
            return this.painter ? (b.painter.editable(a), void b.trigger(c, b.painter)) : (this.testCount || (this.testCount = 0), 
            this.testCount++, void setTimeout(function() {
                b.testCount < 4 && b.editable(a);
            }, 100));
        },
        activeCommand: function(a) {
            this.painter && this.painter.activeCommand(a);
        },
        runCommand: function(a) {
            return this.painter && this.painter.runCommand(a);
        }
    });
}), define("../framework/viewer/viewer", [ "moxtra", "app", "lang", "text!template/viewer/main.html", "const", "viewer/plugin/pager", "viewer/plugin/thumbnails", "viewer/plugin/comments", "component/dialog/inputDialog", "admin/branding/helper", "meet/brandingCache", "binder/binderBiz", "viewer/imageView", "viewer/mediaView", "viewer/webView", "viewer/svgView", "viewer/dsView", "viewer/fileView", "viewer/static", "viewer/command/close", "viewer/plugin/fullscreen", "viewer/plugin/meet", "viewer/plugin/options", "viewer/plugin/zoom", "viewer/plugin/annotate", "viewer/plugin/participants", "viewer/plugin/addPages", "viewer/plugin/delete", "viewer/plugin/editWebdoc", "viewer/plugin/originalResource" ], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    var t = a.logger("Viewer");
    a.ns("MX.Viewer");
    var u = [ "pager", "annotate", "comments", "delete", "options", "zoom", "thumbnails", "image", "media", "svg", "web", "note", "fullscreen", "originalResource" ];
    return MX.Viewer = MX.Controller.extend({
        template: d,
        skin: "no-header",
        handleAction: !0,
        keepInstance: !0,
        plugins: [ "pager", "annotate", "editWebdoc", "comments", "options", "thumbnails", "zoom", "note", "fullscreen", "originalResource" ],
        commands: [ "close" ],
        init: function(a) {
            a || (a = {}), _.extend(this, _.pick(a, [ "skin", "plugins", "commands", "userRole", "roleContext", "keepInstance", "disableESC", "showApplicationContainer", "token" ])), 
            a.collection && this.binding(a.collection), this.views = {}, MX.env.isMobile && (this.$scope.hideFooter = !0, 
            a.collection && 1 === a.collection.length && (this.$scope.hidePageTitle = !0)), 
            this.$scope.lang = c, this.$scope.showApplicationContainer = this.showApplicationContainer, 
            j.isShowAddFile() || (this.plugins = _.without(this.plugins, "addPages")), b.isWindowsAgent() && (this.plugins = _.without(this.plugins, "originalResource")), 
            (b.isMacAgentAppstore() || b.isMacAgentLocal()) && (this.plugins = _.without(this.plugins, "note"));
        },
        getPagesCollection: function(a) {
            var b = new Moxtra.Collection({
                model: "Moxtra.model.BoardPage",
                attributeId: "sequence",
                index: [ "page_group" ]
            });
            return a.each(function(a) {
                var c = a.pages;
                if (c.length) c.each(function(a) {
                    b.push(a);
                }); else {
                    var d = new Moxtra.model.BoardPage({
                        sequence: a.client_uuid,
                        client_uuid: a.client_uuid,
                        name: a.displayName,
                        page_type: Moxtra.const.PAGE_TYPE_ANY
                    });
                    d.parent = a, b.push(d);
                }
            }), b;
        },
        binding: function(a) {
            this.collection && this.stopListening(this.collection), "BoardFile" === a.model.$name && (a = this.getPagesCollection(a)), 
            this.collection = a, this.listenTo(this.collection, "remove", this._onRemovePage), 
            this.listenTo(this.collection, "add", this._onAddPage), this.listenTo(this.collection, "annotate", this._onAnnotate), 
            this._currentPageIndex = 0, this._currentSequence = -1, this.viewScale = "Fit";
            var b = this;
            this.listenTo(a, "inited", function() {
                a.length || b._toNoPageStatus();
            });
        },
        _sequenceChange: function() {
            t.debug("sequence change ");
        },
        _onAddPage: function() {
            var a = this.collection.length;
            if (a >= 1) {
                this._toNormalStatus();
                var b = this.getView("pager");
                a - 1 > this._currentPageIndex && b.activePanel("next");
            } else this._toNoPageStatus();
        },
        _onAnnotate: function(a, b) {
            if (a === this.model.get("sequence")) {
                var c = this.getView("svg");
                c && MX.each(b, function(b) {
                    c.addElement(b, a);
                });
            }
        },
        setUserRole: function(a) {
            this.userRole = a, this.model && this.customPluginByRole(this.model.get("pageType") || this.model.page_type);
        },
        customPluginByRole: function(a) {
            "use strict";
            var c, d, f, g, h = {
                addPages: "1",
                annotate: "10",
                comments: "100",
                "delete": "1000",
                meet: "10000",
                note: "100000",
                options: "1000000",
                pager: "10000000",
                participants: "100000000",
                thumbnails: "1000000000",
                zoom: "10000000000",
                close: "100000000000",
                fullscreen: "1000000000000"
            }, i = e.binder.role, j = e.roleContext, l = e.binder.pageType;
            switch (this.userRole) {
              case i.Owner:
              case i.Editor:
                g = "1111111111111";
                break;

              case i.Viewer:
                g = "1111111010100";
                break;

              case i.Host:
              case i.Attendee:
                g = k.getBoolTag(e.meet.tags.disableAttendeeAnnotate) ? "1010100000000" : "1010100000010";
                break;

              case i.Presenter:
                g = "1011111001011";
                break;

              case i.PublicViewer:
                g = "1111010000000";
            }
            switch (this.roleContext) {
              case j.meet:
                d = "1011110001011";
                break;

              case j.note:
                d = "1011010001011";
                break;

              case j.public:
                d = "1111010000000";
                break;

              case j.binder:
                d = "1111011111111";
                break;

              case j.annotate:
                d = "1111010000010";
            }
            switch (a) {
              case l.whiteboard:
              case l.image:
              case l.pdf:
                f = "1111111111111";
                break;

              case l.video:
              case l.audio:
              case l.note:
                f = "1111111111101";
                break;

              case l.any:
                f = "0101111001001";
                break;

              case l.web:
              case l.url:
                f = "1111111111101";
                break;

              case l.ds:
                f = "1000100000000";
                break;

              default:
                f = "0100101000001";
            }
            (b.isIntegrationAgent() || navigator.userAgent.indexOf(e.flags.windowsAgent) > 0) && (f = f.replace(/^\d/, "0")), 
            c = parseInt(g, 2) & parseInt(d, 2) & parseInt(f, 2);
            var m, n, o;
            for (var p in h) o = (parseInt(h[p], 2) & c) > 0, n = o ? "show" : "hide", m = this.getView(p) || this.getCommand(p), 
            m && (!o || o && !this.isNoPage) && m[n]();
        },
        _toNormalStatus: function() {
            this.isNoPage !== !1 && (this.setUserRole(this.userRole), this.isNoPage = !1, this._pagetitle.show());
        },
        _toNoPageStatus: function() {
            this.isNoPage = !0;
            var a = this;
            MX.each(u, function(b) {
                var c = a.getView(b);
                c && a.getView(b).hide();
            }), this._pagetitle.hide();
        },
        _onRemovePage: function(a) {
            this.collection.length < 1 ? this._toNoPageStatus() : a.get("sequence") === b.request.sequence() && (this._currentPageIndex--, 
            this._currentPageIndex < 0 && (this._currentPageIndex = 0), this.nextPage());
        },
        nextPage: function() {
            var a, b, c = this, d = c.collection, e = d.length;
            0 !== e && (a = d.get(c._currentSequence), b = c._currentPageIndex + 1, a || (b = c._currentPageIndex), 
            b = Math.min(b, e - 1), a = d.at(b), a && this.gotoPage(a.get("sequence")), t.debug("nextPage ", b));
        },
        prevPage: function() {
            var a, b = this, c = b.collection, d = c.length;
            if (0 !== d) {
                a = this._currentPageIndex - 1, a = Math.max(a, 0);
                var e = c.at(a);
                e && b.gotoPage(e.get("sequence")), t.debug("prevPage ", a);
            }
        },
        gotoPage: function(a) {
            var b = this, c = b.collection, d = c.get(a);
            (0 === a || !d) && c.length > 0 && (d = c.at(0), a = d.get("sequence")), d && (t.debug("gotoPage", a), 
            this._currentSequence !== a && 0 !== a && (this._currentSequence = a, this._currentPageIndex = c.indexOf(d), 
            this.setModel(d), this.customPluginByRole(d.get("pageType") || d.page_type), this.sendMessage(a), 
            this.trigger("switchPage", {
                page_sequence: a
            })), 0 === this._currentPageIndex && this.trigger("onFirstPage"), b._currentPageIndex === c.length - 1 && this.trigger("onLastPage"));
        },
        setModel: function(a) {
            if (a) {
                this.model = a, t.debug("trigger modelChange type is: [{0}] sequence is:{1}", a.get("type"), a.get("sequence")), 
                this.zoom(), this.trigger("modelChange", a, this);
                var b = "";
                "ds" === a.get("type") ? $(".page-title").hide() : (b = this.getName(), b ? $(".page-title").show() : $(".page-title").hide()), 
                this._pagetitle.text(b).attr("title", b);
            }
        },
        getName: function() {
            var a, b, c = this.model, d = c.get("name");
            return c.get("page_group") && c.getParent && (b = c.getParent("Board"), b && (a = b.getCacheObject(c.get("page_group")), 
            d = a && a.displayName)), d;
        },
        rendered: function() {
            function a() {
                return setTimeout(function() {
                    $(".page-title").hide();
                }, 3e3);
            }
            var b = this, c = b.skin;
            c && b.$el.addClass(c), b._container = b.$(".mx-viewer-container"), b._plugins = b.$(".mx-viewer-plugins"), 
            b._tips = b.$(".mx-viewer-tips"), b._application = b.$(".mx-application-container"), 
            b._floatbar = b.$(".mx-viewer-floatbar"), b._footerLeft = b.$(".mx-footer-left"), 
            b._footerRight = b.$(".mx-footer-right"), b._side = b.$(".mx-viewer-side"), b._wrap = b.$(".mx-viewer-wrap"), 
            b._pagetitle = b.$(".page-title span"), b.createView("media", n), b.createView("image", m), 
            b.createView("web", o), b.createView("ds", q), b.createView("any", r), b.createView("svg", p), 
            MX.each(this.plugins, function(a) {
                var c = s.getPlugin(a);
                c || t.error("not find plugin [{0}]", a), b.createView(a, c);
            });
            var d = s.getCommands();
            this.cmds = {}, MX.each(this.commands, function(a) {
                var c = d[a];
                MX.isFunction(c) && (b.cmds[a] = c(b));
            }), setTimeout(function() {
                b._onAddPage();
            }, 100), this.inAnnotate = !1, this.$(".mx-viewer-btn").tooltip(), MX.env.isMobile && ($("body").swipe({
                swipeLeft: function() {
                    b.nextPage();
                },
                swipeRight: function() {
                    b.prevPage();
                }
            }), $(document).on("swipeleft", function() {
                b.nextPage();
            }).on("swiperight", function() {
                b.prevPage();
            }));
            var e = a();
            $(window).on("mousemove", function() {
                clearTimeout(e), b._pagetitle.text() && $(".page-title").show(), e = a();
            });
        },
        getView: function(a) {
            return this.views[a];
        },
        getCommand: function(a) {
            return this.cmds[a];
        },
        getContainer: function(a) {
            return this["_" + (a || "container")];
        },
        createView: function(a, b) {
            var c = new b({
                parent: this
            });
            return c.renderTo(this.getContainer(c.container || "container")), this.views[a] = c, 
            this.recovery(c);
        },
        open: function(a, c) {
            var d = b.request;
            if (a = a || d.sequence(), !a) return void this.close();
            if (this.show(), c) {
                var e = this.getView(c);
                e && e.showPanel && e.showPanel({
                    page_sequence: a,
                    isFocus: !0
                });
            }
            this.gotoPage(a);
        },
        sendMessage: function(a) {
            a = parseInt(a, 10);
            var c = "", d = "";
            if (this.model) {
                c = this.model.get("boardid");
                var e = this.model.getParent && this.model.getParent("Board");
                if (c ? e || (e = Moxtra.getBoard(c)) : c = e && e.id, e && 0 !== a && this.model.page_group) {
                    var f = e.getCacheObject(this.model.page_group);
                    f && !f.isVirtual && (d = f.client_uuid);
                }
                b.sendMessage({
                    action: "view_binder_page",
                    binder_id: c,
                    page_id: a,
                    file_id: d,
                    session_id: Moxtra.getMe().sessionId,
                    token: this.token
                });
            }
        },
        close: function() {
            this._isOpen && (this._isOpen = !1, this._hide(), this.trigger("close"), this.sendMessage(0), 
            this._currentSequence = -1, this._plugins.css("opacity", 1), this.keepInstance || (this.destroy(), 
            this.$el.remove()), this.trigger("resetActiveCommand", "", this));
        },
        show: function() {
            if (!this._isOpen) {
                var a = this;
                this.$el.show(), $(window).on("keydown.mxViewer", function(b) {
                    var c = b.target && b.target.tagName || "";
                    /INPUT|TEXTAREA/.test(c) || b.keyCode === Moxtra.const.KEYBOARD_BackSpace && a.$el.is(":visible") && (b.stopPropagation(), 
                    b.preventDefault());
                }), $(document.body).addClass("noScroll").on("keyup.mxViewer", $.proxy(a.onKeyUp, a)), 
                this._isOpen = !0, $(window).on("resize", function() {
                    a.zoom(), a.adjustSideWidth();
                });
            }
        },
        onKeyUp: function(a) {
            switch (a.keyCode) {
              case e.keys.Left:
                this.prevPage();
                break;

              case e.keys.Right:
                this.nextPage();
                break;

              case e.keys.Escape:
                this.fullscreenMode || this.disableESC || this.close();
            }
        },
        _hide: function() {
            $(document.body).removeClass("noScroll").off(".mxViewer"), $(window).off(".mxViewer"), 
            this.$el.hide(), $(document.body).removeClass("disable-select");
        },
        zoom: function(a) {
            var b, c, d = this.model, e = this;
            if (d) {
                if (a = parseFloat(a || this.viewScale || "Fit"), isNaN(a)) return this._zoomToFit();
                var f = e.$(".mx-viewer-wrap"), g = f.height(), h = f.width();
                e.viewScaleNumber = a, e.viewScale = a, b = d.get("width") || .8 * h, c = d.get("height") || g;
                var i, j = d.get("rotate") || 0, k = d.get("type");
                /image|video|pdf|note/.test(k) && j % 180 !== 0 && (i = b, b = c, c = i), 300 > b && /video|audio/.test(k) && (b = 300);
                var l = 0;
                l = g > c * a ? (g - c * a) / 2 : 0, e.viewRealSize = {
                    width: b * a,
                    height: c * a,
                    top: l
                }, e._container.css(e.viewRealSize), e.trigger("resize", e.viewRealSize);
            }
        },
        _zoomToFit: function() {
            var a = this.model;
            if (a) {
                var b, c, d, e, f = this, g = f.$(".mx-viewer-wrap"), h = g.height(), i = g.width();
                e = b = a.get("width") || i, c = a.get("height") || h;
                var j, k = a.get("rotate") || 0, l = a.get("type");
                /image|video|pdf|note/.test(l) && k % 180 !== 0 && (j = b, b = c, c = j), /video/.test(l) && 320 > b && (b = 320), 
                /audio/.test(l) && 400 > b && (b = 400);
                var m = b / c || 1;
                c = Math.min(c, h), /web/.test(l) || (d = m * c, b = Math.min(i, d), d !== b && (c = b / m)), 
                (0 === b || 0 === c) && (b = i || 600, c = h || 400), this.viewScaleNumber = b / e, 
                this.viewScale = "Fit", this.viewRealSize = {
                    width: b,
                    height: c,
                    top: (h - c) / 2
                }, this._container.css(this.viewRealSize), this.trigger("resize", this.viewRealSize);
            }
        },
        showSide: function() {
            var a = this.$el;
            if (a.hasClass("open-side") || a.addClass("open-side"), !this._side.is(":visible")) {
                var b = this;
                $(window).on("resize.mxViewer", function() {
                    b.zoom(), b.adjustSideWidth();
                }), this._side.show(), this.adjustSideWidth();
            }
        },
        adjustSideWidth: function() {
            if (this._side.is(":visible")) {
                var a = this.$el.width() - 300;
                this._wrap.width(a), this._plugins.width(a), this._tips.width(a), this._application.width(a);
            }
        },
        hideSide: function(a) {
            this._wrap.width("100%"), this._plugins.width("100%"), this._tips.width("100%"), 
            this._application.width("100%"), this._side.hide(), this.$el.removeClass("open-side"), 
            a || $(window).off("resize.mxViewer");
        },
        showSharingPanel: function() {
            this.roleContext === e.roleContext.meet && (this._container.removeClass("hide"), 
            this._plugins.removeClass("hide"), this._footerLeft.removeClass("hide"), this._footerRight.removeClass("hide"));
        },
        hideSharingPanel: function() {
            this.roleContext === e.roleContext.meet && (this._container.addClass("hide"), this._plugins.addClass("hide"), 
            this._footerLeft.addClass("hide"), this._footerRight.addClass("hide"));
        }
    }), MX.Viewer;
}), define("../framework/viewer/webView", [ "moxtra", "binder/binderBiz", "app", "lang", "text!template/viewer/urlView.html" ], function(a, b, c, d, e) {
    var f = a.logger("Viewer:WebView"), e = Handlebars.compile(e);
    return a.Controller.extend({
        tagName: "div",
        className: "mx-viewer-subview mx-viewer-web",
        init: function(a) {
            this.parent = a.parent, this.listenTo(a.parent, "modelChange", this._onModelChange);
        },
        _onModelChange: function(a, b) {
            if (a) {
                var c = this, d = (c.loader = new Image(), a.get("type"));
                return this.model && this.stopListening(this.model), this.model = a, /url|web/.test(d) ? (this.$el.empty(), 
                this.show(a, b)) : void this.hide();
            }
        },
        _onResize: function(a) {
            this.$el.css(a);
        },
        show: function(a) {
            if (this.$el.show(), a) {
                var b = this;
                this["_load" + MX.capitalize(a.get("type"))](a), this.listenTo(a, "change:vector", function() {
                    b["_load" + MX.capitalize(a.get("type"))](a);
                });
            }
        },
        createIframe: function(a) {
            var b = $(document.createElement("iframe")).appendTo(this.el);
            return a && (a = $.proxy(a, this), b.on("load", function() {
                b.off("load"), a(this);
            })), b;
        },
        _loadWeb: function(a) {
            f.debug(a), this.$el.loading({
                length: 7,
                color: "#fff"
            });
            var b = this;
            $.ajax({
                type: "GET",
                dataType: "html",
                url: Moxtra.util.makeAccessTokenUrl(a.get("source")),
                success: function(c) {
                    b._onGetData(c, a);
                },
                error: function() {
                    b._onError();
                },
                complete: function() {
                    b.$el.loading(!1);
                }
            });
        },
        _onGetData: function(a) {
            /^</gi.test(a) || (a = a.substr(1, a.length - 2)), a = a.replace(/\\"/g, '"').replace(/\\n/g, "").replace(/<a\s([^>]*)href=['"]([^'"]+)/gi, function(a, b, c) {
                return /^(?:https?|ftp|mailto)/i.test(c) || (c = "http://" + c), '<a target="_blank" ' + b + 'href="' + c;
            }), this.iframe && this.iframe.remove();
            var b = this, d = b.model.get("boardid") || c.request.page(), e = b.model.get("sequence") || c.request.page(), f = this.createIframe(function(c) {
                var f = c.contentDocument || c.contentWindow && c.contentWindow.document;
                f && (f.open(), a = ' <base href="/board/' + d + "/" + e + '/"/><style type="text/css">p {margin:2px 0; padding:0}</style>' + a, 
                f.write(a), f.close(), MX.env.isMobile && $(f).swipe({
                    swipeLeft: function() {
                        $(parent.document).trigger("swipeleft");
                    },
                    swipeRight: function() {
                        $(parent.document).trigger("swiperight");
                    },
                    swipeUp: function() {
                        try {
                            f.body.style.height = "", f.body.style.width = "";
                            var a = f.body.scrollTop, d = f.body.scrollHeight, e = b.parent.viewRealSize.height, g = 0;
                            g = a + .8 * e, g > d && (g = d), c.contentWindow.scrollTo(0, g), setTimeout(function() {
                                f.body.style.height = "100%", f.body.style.width = "100%";
                            }, 20);
                        } catch (h) {
                            console.error(h);
                        }
                    },
                    swipeDown: function() {
                        try {
                            f.body.style.height = "", f.body.style.width = "";
                            var a = f.body.scrollTop, d = b.parent.viewRealSize.height, e = 0;
                            e = a - .8 * d, 0 > e && (e = 0), c.contentWindow.scrollTo(0, e), setTimeout(function() {
                                f.body.style.height = "100%", f.body.style.width = "100%";
                            }, 20);
                        } catch (g) {
                            console.error(g);
                        }
                    }
                }));
            });
            f.attr("src", "about:blank"), MX.env.isMobile ? f.attr("scrolling", "no") : f.attr("scrolling", "auto"), 
            this.iframe = f, f.height(this.parent.viewRealSize.height), $(window).bind("resize", function() {
                b.iframe.height(b.parent.viewRealSize.height);
            });
        },
        _loadUrl: function(a) {
            this.$el.loading({
                length: 7,
                color: "#fff"
            });
            var c = a.get("boardid"), d = a.get("sequence") + "";
            a.$name && null !== Moxtra.util.getPublicViewToken() ? a.getPageInfo().setScope(this).success(this._onGetUrl).error(this._onError) : b.getBoardPageData(c, d).scope(this).success(this._onGetUrl).error(this._onError);
        },
        _onError: function() {
            this.$el.loading(!1);
        },
        _onGetUrl: function(a) {
            var b;
            if (a && a.data) {
                var c = a.data.url;
                this.$el.loading(!1), b = this.model.toJSON(), b.url = c, b.lang = d, b.defaults_thumbnail_file = Moxtra.config.defaults.thumbnail_file, 
                this.$el.append(e(b));
            } else this.$el.loading(!1), b = this.model.toJSON(), b.lang = d, this.$el.append(e(b));
        },
        hide: function() {
            this.$el.loading(!1), this.$el.empty(), this.$el.hide();
        }
    });
}), define("../framework/viewer/command/close", [ "moxtra", "lang", "viewer/static" ], function(a, b, c) {
    c.addCommand("close", function(a) {
        var d = $(c.btnTpl({
            title: b.press_esc_to_close,
            action: "close",
            className: "mx-viewer-close mx-viewer-btn",
            icon: "micon-close  ",
            attribute: "data-placement=bottom"
        }));
        return a.getContainer("plugins").append(d), d;
    });
}), define("../framework/viewer/plugin/fullscreen", [ "moxtra", "text!template/viewer/button.html", "viewer/static", "lang", "fullscreen" ], function(a, b, c, d) {
    c.registerPlugin("fullscreen", a.Controller.extend({
        container: "footerLeft",
        template: b,
        init: function(a) {
            _.extend(this.$scope, {
                lang: d,
                title: d.fullscreen,
                icon: "micon-screen-max"
            }), this.parent = a.parent;
        },
        rendered: function() {
            var b, c = !1, d = this.parent;
            screenfull.onchange = function() {
                c = !c, c ? (b.find("i").removeClass("micon-screen-max").addClass("micon-screen-min"), 
                d.fullscreenMode = !0, a.env.isIE && d && d.zoom(1), d.$el.addClass("is-fullscreen")) : (b.find("i").removeClass("micon-screen-min").addClass("micon-screen-max"), 
                _.delay(function() {
                    d.fullscreenMode = !1;
                }, 1e3), d.$el.removeClass("is-fullscreen"));
            };
            var e = this.$el;
            e.on("click", function() {
                screenfull.toggle(d.el), setTimeout(function() {
                    d.zoom();
                }, 2e3), c || (d.trigger("fullscreen"), d.fullscreenMode = !0);
            }), screenfull.enabled && e.hide(), b = e;
        }
    }));
}), define("../framework/viewer/plugin/addPages", [ "moxtra", "text!template/viewer/addPages.html", "viewer/static", "lang", "binder/binderBiz", "binder/binderActions", "app", "component/uploader/uploader" ], function(a, b, c, d, e, f, g, h) {
    c.registerPlugin("addPages", a.Controller.extend({
        container: "footerRight",
        template: b,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = d, _.extend(this.$scope, {
                title: d.btn_comment,
                action: "refreshUploader",
                icon: "micon-plus"
            }), this.parent = a.parent, this.binderActions = f;
        },
        rendered: function() {
            this.$el.on("hide.bs.dropdown", function() {
                h.hide("addPageToBinder");
            });
        },
        refreshUploader: function() {
            var a = this.$el;
            setTimeout(function() {
                h.refresh("addPageToBinder", a.find("#addpage_flashuploader"));
            }, 100);
        }
    }));
}), define("../framework/viewer/plugin/annotate", [ "moxtra", "app", "lang", "text!template/viewer/annotate.html", "viewer/static", "binder/binderBiz", "component/uploader/uploader" ], function(a, b, c, d, e, f, g) {
    var h = a.logger("Viewer:Annotate"), i = [ {
        action: "activeCommand",
        param: "Line",
        icon: "micon-annotate",
        title: c.tool_draw
    }, {
        action: "activeCommand",
        param: "HighLighter",
        icon: "micon-highlighter",
        title: c.tool_highlighter
    }, {
        action: "activeCommand",
        param: "Text",
        icon: "micon-text",
        title: c.tool_text
    }, {
        action: "uploadImage",
        param: "Image",
        icon: "micon-image",
        title: c.tool_image,
        id: "uploadImageToPage"
    }, {
        action: "activeCommand",
        param: "Arrow",
        icon: "micon-svg-arrow",
        title: c.tool_arrow
    }, {
        action: "activeCommand",
        param: "Shape",
        icon: "micon-shape",
        title: c.tool_shape,
        create: "createShapePickMenu"
    }, {
        action: "activeCommand",
        param: "LaserPointer",
        icon: "micon-laser-pointer",
        title: c.tool_laserpointer
    }, {
        action: "activeCommand",
        icon: "micon-select",
        param: "Select",
        title: c.tool_select
    }, {
        action: "activeCommand",
        param: "Rubber",
        icon: "micon-eraser",
        title: c.tool_eraser
    }, {
        action: "runCommand",
        param: "Undo",
        icon: "micon-undo",
        title: c.tool_undo
    }, {
        action: "runCommand",
        param: "Redo",
        icon: "micon-redo",
        title: c.tool_redo
    } ];
    e.registerPlugin("annotate", a.Controller.extend({
        template: d,
        container: "footerRight",
        handleAction: !0,
        init: function(a) {
            this.parent = a.parent;
            var b = this.parent.getView("svg"), c = this;
            h.debug("init annotate "), this.listenTo(b, "editable", function() {
                c.painter = b.painter, c.initAnnotate(!0);
            }, this), this.listenTo(b, "uneditable", function() {
                c.initAnnotate(!1);
            }, this), this.listenTo(a.parent, "close", this.hidePanel, this), this.listenTo(a.parent, "modelChange", this.onModelChange, this), 
            this.listenTo(a.parent, "resetActiveCommand", this.getCurrentActiveCommand, this), 
            this.btns = {}, this.commands = {};
        },
        getPainter: function() {
            return this.parent.getView("svg").painter || {};
        },
        onModelChange: function(a) {
            if (a) {
                var b = this, c = a.get("type");
                /whiteboard|pdf|image/.test(c) ? b.$el.show() : b.$el.hide(), this.isOpen && (this.hidePanel(), 
                this.showPanel());
            }
        },
        onAddFile: function(a) {
            var c = a.toJSON(), d = this.parent.viewRealSize, e = {
                x: Math.floor(.2 * d.width),
                y: Math.floor(.2 * d.height),
                width: 230,
                height: 180,
                file: c.name,
                url: "",
                percent: c.percent,
                client_uuid: c.client_uuid,
                id: c.client_uuid
            }, f = b.request.toJSON();
            a.set({
                boardId: f.page,
                sequence: f.sequence
            });
            var g = this.getPainter().runCommand("Image", e);
            a.on("change", function(a) {
                var b = a.get("percent");
                100 == b && (b = 95), g.set({
                    percent: b
                }), h.debug("update progress");
            });
        },
        initAnnotate: function(a) {
            this._initFlag !== a && (a ? this.getPainter() && this.getPainter().on("addElement", this.onAddElement, this).on("changeElement", this.onUpdateElement, this).on("deleteElement", this.onRemoveElement, this).on("showLaserPointer", this.onShowLaserPointer, this).on("hideLaserPointer", this.onHideLaserPointer, this).on("updateLaserPointer", this.onUpdateLaserPointer, this).on("activeCommand", this.onActiveCommand, this).on("selectElement", this.onSelectElement, this).editable(!0) : this.getPainter() && this.getPainter().off(null, null, this).editable(!1), 
            this._initFlag = a);
        },
        showLaserPointer: function(a, b) {
            this.getPainter().getCommand("LaserPointer").showLaserPointer(a, b);
        },
        hideLaserPointer: function() {
            this.getPainter().getCommand("LaserPointer").hideLaserPointer();
        },
        updateLaserPointer: function(a, b) {
            this.getPainter().getCommand("LaserPointer").updateLaserPointer(a, b);
        },
        _getButtonCustomRegex: function(a) {
            function b(a, b) {
                var c = e.get(a + b);
                return c ? d[a][b] = c : c = d[a][b], c;
            }
            var c, d = MX.Painter.Page.prototype.defaults, e = Moxtra.storage("annotate"), f = a;
            switch (a || (a = this.getPainter().command || this._type), a) {
              case "Arrow":
                c = /fill|lineSize/, this.btns.fill.updateValue(b(a, "fill")), this.btns.lineSize.updateValue(d.Arrow["stroke-width"]);
                break;

              case "Line":
                c = /color|lineSize/, this.btns.color.updateValue(b(a, "stroke")), this.btns.lineSize.updateValue(d.Line["stroke-width"]);
                break;

              case "HighLighter":
                c = /color|lineSize/, this.btns.color.updateValue(b(a, "stroke")), this.btns.lineSize.updateValue(d.HighLighter["stroke-width"]);
                break;

              case "Text":
                c = /fill|textFont|textSize/, this.btns.fill.updateValue(b(a, "fill")), this.btns.textSize.updateValue(d.Text["font-size"]), 
                this.btns.textFont.updateValue(d.Text["font-family"]);
                break;

              case "Shape":
                c = /color|lineSize|shape/, this.btns.fill.updateValue(b(a, "fill")), this.btns.color.updateValue(b(a, "stroke")), 
                this.btns.lineSize.updateValue(d.Shape["stroke-width"]);
                break;

              default:
                c = /group/;
            }
            return this._type = f, c;
        },
        onActiveCommand: function(a) {
            var b, c = (MX.Painter.Page.prototype.defaults, a);
            if ("Select" == c) {
                var d = this.getPainter().getSelectedModel();
                d && (c = d.get("name"));
            } else this.getPainter().select();
            b = this._getButtonCustomRegex(c), this.showButtons(b);
            var e = this.getPainter().command;
            MX.each(this.commands, function(a, b) {
                a.hasClass("active") && a.removeClass("active"), b == e && a.addClass("active");
            });
        },
        showButtons: function(a) {
            if (this.getPainter() && this.getPainter().command) {
                {
                    this.getPainter().command;
                }
                MX.each(this.btns, function(b, c) {
                    a.test(c) ? b.show() : b.hide();
                });
            }
        },
        onSelectElement: function(a) {
            if (!a) return this.showButtons(this._getButtonCustomRegex());
            var b, c = a.toJSON(), d = this;
            switch (h.debug(c.style), c.name) {
              case "Arrow":
                d.btns.fill.updateValue(c.style.fill), d.btns.lineSize.updateValue(c.style["stroke-width"]), 
                b = /fill|lineSize/;
                break;

              case "Line":
                d.btns.color.updateValue(c.style.stroke), d.btns.lineSize.updateValue(c.style["stroke-width"]), 
                b = /color|lineSize/;
                break;

              case "HighLighter":
                d.btns.color.updateValue(c.style.stroke), d.btns.lineSize.updateValue(c.style["stroke-width"]), 
                b = /color|lineSize/;
                break;

              case "Text":
                d.btns.fill.updateValue(c.style.fill), d.btns.textSize.updateValue(c.style["font-size"]), 
                d.btns.textFont.updateValue(c.style["font-family"]), b = /fill|textSize|textFont/;
                break;

              case "Shape":
                d.btns.color.updateValue(c.style.stroke), d.btns.fill.updateValue(c.style.fill), 
                d.btns.lineSize.updateValue(c.style["stroke-width"]), b = /color|lineSize/, "line" === c.style["data-shape"] && (b = /color|lineSize/);
                break;

              default:
                b = /group/;
            }
            this.showButtons(b);
        },
        onShowLaserPointer: function(a) {
            h.debug("showLaserPointer"), this.trigger("showLaserPointer", this._formatPoint(a));
        },
        onHideLaserPointer: function() {
            h.debug("hideLaserPointer"), this.trigger("hideLaserPointer", this._formatPoint([]));
        },
        onUpdateLaserPointer: function(a) {
            h.debug("updateLaserPointer", a), this.trigger("updateLaserPointer", this._formatPoint(a));
        },
        _formatPoint: function(a) {
            return {
                sequence: this.parent.model.get("sequence") || 0,
                x: a[0] || 0,
                y: a[1] || 0
            };
        },
        onAddElement: function(a) {
            var b = a.get("id"), c = this.getPainter().getView(b), d = MX.Painter.Helper.toSVGText(a, c), e = this.parent.model;
            if (e.$name || (e = Moxtra.getBoardPages(e.get("boardid")).get(e.get("sequence"))), 
            h.debug("addElement", b, d, a.toJSON()), null != d) {
                var f = new Moxtra.model.BoardPageElement(), g = null;
                f.set("svg_tag", d), f.set("client_uuid", b), "Arrow" === a.get("name") && (g = Moxtra.const.PAGE_ELEMENT_TYPE_ARROW), 
                f.create(e, g);
            }
        },
        onUpdateElement: function(a) {
            var b = a.get("id"), c = this.getPainter().getView(b), d = MX.Painter.Helper.toSVGText(a, c), e = this.parent.model;
            h.debug("updateElement", b, d, a.toJSON()), e.$name || (e = Moxtra.getBoardPages(e.get("boardid")).get(e.get("sequence")));
            var f = e.contents.get(b);
            f && null != d && (f.set("svg_tag", d), f.update());
        },
        onRemoveElement: function(a) {
            h.info("deleteElement:", a.get("id"));
            var b = this.parent.model.toJSON();
            f.deleteAnnotation({
                is_deleted: !0,
                client_uuid: a.get("id"),
                boardid: b.boardid,
                sequence: b.sequence
            });
        },
        hidePanel: function() {
            this.parent.getView("svg").editable(!1), this.showButtons(/hideall/), this.$(".actions").removeClass("open"), 
            g.hide("addImageToPage"), this.isOpen = !1, this.$(".J-switch").removeClass("micon-arrow-right").addClass("micon-annotate"), 
            this.parent.inAnnotate = !1;
        },
        hide: function() {
            this.hidePanel(), this.$el.hide();
        },
        show: function() {
            if (this.$el.show(), "whiteboard" === this.parent.model.get("type")) {
                var a = this;
                setTimeout(function() {
                    a.showPanel();
                }, 50);
            }
        },
        showPanel: function() {
            this.parent.getView("svg").editable(!0), this.isOpen = !0, this.$(".actions").addClass("open"), 
            this.$(".J-switch").removeClass("micon-annotate").addClass("micon-arrow-right");
            var a = this;
            this.parent.inAnnotate = !0, setTimeout(function() {
                var b = '[data-param="' + (a.getCurrentActiveCommand() || "Line") + '"]';
                a.$(b).click(), g.refresh("addImageToPage", $("#uploadImageToPage"));
            }, 500), g.refresh("addImageToPage", $("#uploadImageToPage"));
        },
        activeCommand: function(a) {
            this.currBtnEl && this.currBtnEl.removeClass("active"), this.currBtnEl = $(this.handleEvent.currentTarget), 
            this.parent.getView("svg").activeCommand(a), this.currBtnEl.addClass("active"), 
            this.getCurrentActiveCommand(a);
        },
        runCommand: function(a) {
            return this.parent.getView("svg").runCommand(a);
        },
        createShapePickMenu: function(a) {
            var b = '<div class="dropdown dropup"> <a data-toggle="dropdown" class=" mx-viewer-btn  mouse-hand" title="' + c.tool_shape + '" data-action="activeCommand" data-param="Shape" data-original-title=""><i class="micon-shape"></i><span class="caret"></span></a><input type="hidden">' + this._createShapeMenu() + "</div>", d = $(b), e = this;
            d.appendTo(a), d.find(".btn").dropdown();
            d.find("input");
            return d.delegate(".dropdown-menu a", "click", function(a) {
                var b = $(a.currentTarget), c = b.data("value");
                MX.Painter.Page.prototype.defaults.Shape["data-shape"] = c, "line" === c && e.showButtons(/color|lineSize/);
            }), d.find("a.mx-viewer-btn");
        },
        rendered: function() {
            function a(a, b, c) {
                var e = d.painter.getSelectedModel();
                if (e) {
                    a = a || e.get("name"), "color" === b && (b = "stroke");
                    var f = $.extend({}, e.get("style"));
                    f[b] = c, d.painter.update({
                        style: f
                    });
                } else a = d.painter.command, "color" == b && (b = "stroke");
                d.painter.defaults[a][b] = c, m.set(a + b, c);
            }
            var d = this, j = MX.Painter.Page.prototype.defaults, d = this, k = this.$(".actions");
            MX.each(i, function(a) {
                if (a.create) {
                    if (MX.isFunction(d[a.create])) {
                        var b = d[a.create].call(d, k);
                        d.commands[a.param] = b;
                    }
                } else {
                    var b = $(e.btnTpl(a));
                    d.commands[a.param] = b, b.appendTo(k);
                }
            });
            var l = g.register("addImageToPage", {
                browse_button: "uploadImageToPage",
                filters: {
                    mime_types: [ {
                        title: c.image_files,
                        extensions: "jpeg,jpg,gif,png"
                    } ]
                },
                url: function() {
                    var a = b.request.toJSON();
                    return "/board/upload?id=" + a.page + "&seq=" + a.sequence + (f.isSilentMessageOn(a.page) ? "&pnoff=1" : "");
                },
                success: function(a, b) {
                    var c = JSON.parse(b.response), e = MX.get("object.board.pages.0.resources.0", c);
                    if (!e) return d.painter.deleteElement(a.get("client_uuid")), void h.error("upload file fail!");
                    var f = MX.get("object.board.pages.0", c), g = MX.get("object.board", c);
                    h.debug("upload success>", c);
                    var i = new Image(), j = d.painter.getModel(a.get("client_uuid")), k = Moxtra.util.makeAccessTokenUrl("/board/" + g.id + "/" + f.sequence + "/" + encodeURIComponent(e.name));
                    i.onload = function() {
                        j.set({
                            percent: 100
                        }), j.set({
                            url: k
                        }), d.painter.commit("addElement", j);
                    }, i.onerror = function() {
                        MX.ui.notifyError("load image error.");
                    }, setTimeout(function() {
                        i.src = Moxtra.util.makeAccessTokenUrl("/board/" + g.id + "/" + f.sequence + "/" + e.name);
                    }, 1e3);
                    var l = j.clone().set({
                        url: k
                    });
                    d.painter.trigger("changeElement", l, j);
                },
                error: function() {
                    g.refresh("addImageToPage", d.$("#uploadImageToPage"));
                }
            });
            this.listenTo(l, "add", this.onAddFile, this);
            var m = Moxtra.storage("annotate");
            this.createPickerMenu({
                value: j.Shape.fill,
                createMenu: this.createColorMenu,
                update: function(a, b) {
                    var c = b;
                    "transparent" === c && (c = "#ccc"), a.html('<i class="colorpicker-box smail" style="background-image: none !important;background-color: ' + b + '">&nbsp;</i>');
                },
                onSelect: function(b) {
                    a(null, "fill", b);
                }
            }, "fill"), this.createPickerMenu({
                value: j.Line.stroke,
                createMenu: this.createColorMenu,
                update: function(a, b) {
                    var c = b;
                    "transparent" === c && (c = "#ccc"), a.html('<i class="colorpicker-box smail" style="background-image: none !important;background-color: ' + b + '">&nbsp;</i>');
                },
                onSelect: function(b) {
                    a(null, "color", b);
                }
            }, "color"), this.createPickerMenu({
                value: j.Line["stroke-width"],
                update: function(a, b) {
                    b = parseFloat(b), a.html(MX.format('<i style="height:${val}px;background-color:#ccc;display: block;margin-top: ${margin}px ;width: 15px;background-image: none!important;"></i>', {
                        margin: Math.max(15 - b, 0),
                        val: b
                    }));
                },
                createMenu: this.createLineSize,
                onSelect: function(b) {
                    a("Line", "stroke-width", b);
                }
            }, "lineSize"), this.createPickerMenu({
                value: j.Text["font-family"],
                createMenu: this.createFontMenu,
                onSelect: function(b) {
                    a("Text", "font-family", b);
                }
            }, "textFont"), this.createPickerMenu({
                value: j.Text["font-size"] + "px",
                createMenu: this.createFontSizeMenu,
                onSelect: function(b) {
                    a("Text", "font-size", parseInt(b));
                }
            }, "textSize"), this.createPickerMenu({
                value: j.HighLighter["stroke-opacity"],
                createMenu: this.createHighLighterOpacityMenu,
                onSelect: function(b) {
                    a("HighLighter", "stroke-opacity", b);
                }
            }, "opacity"), this.$el.append(e.btnTpl({
                title: c.annotate,
                action: "toggleAnnotate",
                icon: "micon-annotate J-switch"
            }));
        },
        toggleAnnotate: function() {
            this.$(".actions").hasClass("open") ? this.hidePanel() : this.showPanel();
        },
        createFontSizeMenu: function() {
            var a, b, c = [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48 ], d = [ '<ul class="dropdown-menu xe-font-menu">' ];
            for (a = 0; a < c.length; a++) {
                b = c[a];
                var e = Math.min(b, 20);
                d.push('<li><a data-value="' + b + 'px" style="font-size:' + b + "px;line-height:" + e + 'px;">' + b + "px</a></li>");
            }
            return d.push("</ul>"), d.join("");
        },
        createLineSize: function() {
            var a, b, c = [ 1, 2, 3, 6, 8, 10 ], d = [ '<ul class="dropdown-menu ">' ];
            for (a = 0; a < c.length; a++) b = c[a], d.push('<li><a data-value="' + b + '" ><div style="height:' + b + "px;background-color:#444;margin:" + (15 - b / 2) + 'px 0 "></div></a></li>');
            return d.push("</ul>"), d.join("");
        },
        createHighLighterOpacityMenu: function() {
            var a, b, c = [ .25, .5, .75, 1 ], d = [ '<ul class="dropdown-menu ">' ];
            for (a = 0; a < c.length; a++) b = c[a], d.push('<li><a data-value="' + b + '" style="line-height:10px; opacity:' + b + ';">' + b + "</a></li>");
            return d.push("</ul>"), d.join("");
        },
        createFontMenu: function() {
            var a, b, c = Object.keys(MX.Painter.FONT), d = [ '<ul class="dropdown-menu xe-font-menu">' ];
            for (a = 0; a < c.length; a++) b = c[a], d.push('<li><a data-value="' + b + '" style="font-family:' + b + ', sans-serif;">' + b + "</a></li>");
            return d.push("</ul>"), d.join("");
        },
        createColorMenu: function() {
            var a, b, d = [ '<div class="dropdown-menu colorpicker-menu">' ];
            d.push('<div style="padding-left: 10px"><a href="javascript:;" class="transparent" data-value="transparent" ><i class="micon-color-disabled"></i>' + c.transparent + "</a></div>");
            var e = [ "000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080", "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "0066de", "800080", "969696", "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0", "FF99CC", "FFCC99", "FFFF99", "CCFFCC", "CCFFFF", "99CCFF", "CC99FF", "FFFFFF" ];
            for (a = 0; a < e.length; a++) b = e[a], d.push('<a href="javascript:;" class="color" data-value="#' + b + '" style="background-color:#' + b + ';">&nbsp;</a>');
            return d.push("</div>"), d.join("");
        },
        _createShapeMenu: function() {
            var a, b, d = [ "rectangle", "triangle", "ellipse", "line" ], e = [ '<ul class="dropdown-menu">' ];
            for (a = 0; a < d.length; a++) b = c["tool_shape_" + d[a]] || d[a], e.push('<li><a href="javascript:;" data-value="' + d[a] + '"><i class="micon-shape-' + d[a] + '"></i>' + b + "</a></li>");
            return e.push("</ul>"), e.join("");
        },
        createPickerMenu: function(a, b, c) {
            var d = '<div class="dropdown options-menu dropup"><button class="btn-link dropdown-toggle " type="button" data-toggle="dropdown"><span class="info showbox"> Fit</span><span class="caret"></span></button><input type="hidden">' + a.createMenu() + "</div>", e = $(d);
            e.hide(), e.appendTo(c || this.$(".sub-actions")), e.find(".btn").dropdown();
            var f = e.find("input");
            return f.on("change", function() {
                a.update ? a.update(e.find(".showbox"), this.value) : e.find(".showbox").html(MX.escapeHTML(this.value));
            }), e.delegate(".dropdown-menu a", "click", function(b) {
                var c = $(b.currentTarget), d = c.data("value");
                f.val(d).trigger("change"), a.onSelect && a.onSelect(d);
            }), a.value && f.val(a.value).trigger("change"), e.updateValue = function(b) {
                a.update ? a.update(e.find(".showbox"), b) : e.find(".showbox").html(MX.escapeHTML(b));
            }, this.btns[b] = e, e;
        },
        uploadImage: function() {
            g.refresh("addImageToPage", $("#uploadImageToPage"));
        },
        getCurrentActiveCommand: function(a) {
            return "string" != typeof a ? this.currentActiveCommand : void (this.currentActiveCommand = a);
        }
    }));
}), define("../framework/viewer/plugin/comments", [ "moxtra", "app", "lang", "text!template/viewer/comments.html", "text!template/viewer/commentItem.html", "binder/binderBiz", "viewer/static", "component/editor/inlineEditor", "component/selector/inputTextSelector" ], function(a, b, c, d, e, f, g, h, i) {
    "use strict";
    var j = Handlebars.compile(e), k = a.Controller.extend({
        template: e,
        handleAction: !0,
        events: {
            "click .play-btn": "play"
        },
        init: function() {
            if (this.$scope.lang = c, $.extend(this.$scope, this.model.toJSON()), this.model.resource) {
                var a = this.model.resource_length;
                a = (a - a % 100) / 1e3, this.$scope.duration = 3 === (a + "").length ? "0" + a : a, 
                this.$scope.durationWitdh = 4 * a + 40;
            }
            this.listenTo(this.model, "change", this.update);
        },
        rendered: function() {
            if (this.model.resource) {
                var a = this;
                a.$el.find(".bar").css({
                    width: "0%"
                }), a.$el.find("audio").mediaelementplayer({
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
            }
        },
        update: function() {
            this.model.user.$name || (this.model.user = this.model.creator), $.extend(this.$scope, this.model.toJSON());
            var a = this;
            setTimeout(function() {
                a.updateView(a.$scope);
            }, 500);
        },
        play: function(a) {
            var b = $(a.target).closest("a").find(".micon-play-with-circle");
            b.hasClass("micon-stop") ? (this.player && this.player.stop(), this._resetPlayer()) : (this.player && this.player.play(), 
            b.addClass("micon-stop"));
        },
        _updateDuration: function(a) {
            this.duration = Math.floor(10 * parseFloat(a)) / 10;
            var b = this.duration + "";
            3 == b.length && (b = "0" + b), this.$el.find(".voice-time").html(b), this.$el.find(".voice-progress").css({
                width: 40 + 4 * b + "px"
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
            this._resetPlayer();
        },
        _resetPlayer: function() {
            this.player.setCurrentTime(0), this.$el.find(".micon-play-with-circle").removeClass("micon-stop"), 
            this.$el.find(".bar").css({
                width: "0%"
            });
        }
    });
    g.registerPlugin("comments", a.Controller.extend({
        template: d,
        container: "side",
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = c, this.countEl = $('<span class="ic-badge"></span>'), this.parent = a.parent;
            var b = $(g.btnTpl({
                title: c.comment,
                action: "toggleComment",
                icon: "micon-comment"
            }));
            this.isShow = !1, b.on("click", $.proxy(this.toggleView, this)), this.countEl.appendTo(b), 
            this.btn = b, this.parent.getContainer("footerRight").append(b), this.recovery(this.comments), 
            this.parent.on("close", this.hidePanel, this), this.parent.on("modelChange", this.update, this);
        },
        show: function() {
            this.btn.show();
        },
        hide: function() {
            this.btn.hide();
        },
        toggleView: function() {
            this.isShow ? this.hidePanel() : this.showPanel({
                isFocus: !0
            });
        },
        showPanel: function(a) {
            this.isShow = !0, this.parent.showSide(), this.parent.userRole === Moxtra.const.BOARD_READ ? this.$(".mx-comment-input").hide() : (this.$('textarea[name="comments"]').show(), 
            a && a.isFocus && this.$(".mx-comment-input textarea").focus()), this.scrollToBottom(), 
            this.btn.tooltip("hide");
        },
        hidePanel: function() {
            this.isShow = !1, this.parent.hideSide();
        },
        rendered: function() {
            var a = this;
            this.$('textarea[name="comments"]').on("keydown", $.proxy(this.postComment, this)).on("keyup", function(b) {
                a.typeAhead(b), b.keyCode !== Moxtra.const.KEYBOARD_Escape && b.stopPropagation();
            }).autosize().trigger("autosize.resize"), this.$el.delegate(".page-comment-item", "mouseenter", function() {
                var b = parseInt($(this).attr("data-param")), c = a.comments.get(b);
                c && Date.now() - c.created_time <= Moxtra.const.LIMITED_COMMENTS_DELETE_TIME && $(this).find(".delete,.edit-comment").css("opacity", "0.8");
            }), this.$el.delegate(".page-comment-item", "mouseleave", function() {
                $(this).find(".delete, .edit-comment").css("opacity", "0");
            }), MX.env.isIE && this.$('textarea[name="comments"]').placeholder(), this.container = this.$(".mx-comments-container");
        },
        update: function(a) {
            if (a.page_type === Moxtra.const.PAGE_TYPE_ANY) return void this.hide();
            this.show(), this.stopListening(this.comments);
            var c = b.request.toJSON(), d = this.parent.model, e = d.get("boardid") || c.page, f = d.get("sequence") || c.sequence;
            if (this.req = c, c.page && f) {
                this.container.empty();
                var g = Moxtra.getBoardPages(e), h = g.get(f);
                if (this.comments = h && h.comments, !this.comments) return;
                this.updateView(), this.listenTo(this.comments, "inited", this.updateView), this.listenTo(this.comments, "add", this.addItem), 
                this.listenTo(this.comments, "remove", this.removeItem);
            } else this.comments.destroy();
        },
        scrollToBottom: function() {
            var a = this;
            setTimeout(function() {
                a.container.scrollTop(a.container.get(0).scrollHeight);
            }, 100);
        },
        updateView: function() {
            if (this.comments) {
                var a = this.comments, b = this, c = b.container;
                c.empty(), a.each(function(a) {
                    b.addItem(a);
                }), b.countEl.text(a.length <= 0 ? "" : a.length);
            }
        },
        addItem: function(a) {
            a.user.$name || (a.user = this.parent.model.parent.members.get(a.user.id));
            var b = this.$("#comment" + a.client_uuid);
            b.length && b.remove(), new k({
                renderTo: this.container,
                model: a
            }), this.countEl.text(this.comments.length);
        },
        removeItem: function(a) {
            this.$("#comment" + a.get("sequence")).remove(), this.countEl.text(this.comments.length);
        },
        editPageComment: function(a) {
            var d = this.comments.get(a), e = b.request.toJSON(), g = this.parent.model, i = g.get("boardid") || e.page, j = g.get("sequence") || e.sequence, k = this.handleEvent, l = $(k.currentTarget).closest(".page-comment-item");
            new h({
                replaceElement: l.find(".comment-entity"),
                model: d,
                bindingPath: "text",
                onSubmit: function() {
                    var b = this, e = d.get("text");
                    $("#comment" + d.get("sequence")).find(".comment-text").text(e), f.updatePageComment(i, j, a, e).success(function() {
                        MX.ui.notifySuccess(c.update_comment_success), b.exitEdit();
                    }).error(function() {
                        MX.ui.notifyError(c.update_comment_failed);
                    });
                }
            });
        },
        removePageComment: function(a) {
            var d = b.request.toJSON(), e = this.parent.model, g = e.get("boardid") || d.page, h = e.get("sequence") || d.sequence, i = this.handleEvent, j = $(i.currentTarget).closest(".page-comment-item");
            MX.ui.Confirm(c.confirm_delete_comment, function() {
                f.removePageComment(g, h, a).success(function() {
                    MX.ui.notifySuccess(c.delete_comment_success), j.remove();
                }).error(function() {
                    MX.ui.notifyError(c.delete_comment_failed);
                });
            });
        },
        postComment: function(a) {
            if (this.typeAheadMode && this.inputSelector.handleKeyDown(a), a.stopPropagation(), 
            a.keyCode === b.const.keys.Enter && !a.shiftKey && (a.preventDefault(), !this.typeAheadMode)) {
                var d = $(a.target), e = $.trim(d.val());
                if (e.length > 0) {
                    var f = this, g = this.parent.model, h = new Moxtra.model.Comment();
                    h.set("text", e), h.create(g).error(function() {
                        MX.ui.notifyError(c.post_comment_failed);
                    }).success(function() {
                        f.scrollToBottom();
                    }), this.container.append(j({
                        text: e,
                        user: {
                            user: Moxtra.getMe()
                        },
                        sequence: h.client_uuid,
                        creator: {
                            user: Moxtra.getMe(),
                            avatar: Moxtra.getMe().avatar
                        }
                    })), d.val("").trigger("autosize.resize");
                }
            }
        },
        typeAhead: function(a) {
            var c = $(a.target), d = c.val(), e = this, f = /(?:^|[\b\s]+)@(\S*)$/, g = this.parent.model.parent;
            if (50 === a.keyCode || this.typeAheadMode && a.keyCode !== b.const.keys.Enter && a.keyCode !== b.const.keys.Up && a.keyCode !== b.const.keys.Down && a.keyCode !== b.const.keys.Escape) if (d && f.test(d)) {
                this.inputSelector || (this.inputSelector = new i({
                    collection: g.members,
                    renderTo: ".page-comment-typeahead-helper",
                    textarea: c,
                    contextBox: $(".mx-comments-container")
                }), this.inputSelector.onAutoInput(function(a) {
                    c.val(c.val().replace(/@[^\s@]*$/, "@" + a + " ")).focus(), e.$(".page-comment-typeahead-helper").hide(), 
                    e.typeAheadMode = !1;
                }), this.recovery(this.inputSelector)), this.$(".page-comment-typeahead-helper").show(), 
                this.typeAheadMode = !0;
                var h = d.match(f)[1];
                this.inputSelector.filter(h), "" === this.inputSelector.selectedText() && this.$(".page-comment-typeahead-helper").hide();
            } else this.typeAheadMode && (this.$(".page-comment-typeahead-helper").hide(), this.typeAheadMode = !1); else a.keyCode !== b.const.keys.Enter || a.shiftKey ? a.keyCode === b.const.keys.Escape && (this.$(".page-comment-typeahead-helper").hide(), 
            this.typeAheadMode = !1) : (a.preventDefault(), this.typeAheadMode ? (c.val(c.val().replace(/@\w*$/g, "@" + this.inputSelector.selectedText() + " ")), 
            this.$(".page-comment-typeahead-helper").hide(), this.typeAheadMode = !1) : this.typeAheadMode = !1);
        },
        resendComment: function() {}
    }));
}), define("../framework/viewer/plugin/delete", [ "moxtra", "text!template/viewer/button.html", "viewer/static", "lang", "binder/binderBiz", "app", "const" ], function(a, b, c, d, e, f, g) {
    c.registerPlugin("delete", a.Controller.extend({
        container: "footerRight",
        template: b,
        init: function(a) {
            _.extend(this.$scope, {
                lang: d,
                title: d["delete"],
                icon: "micon-trash",
                className: "mxbrand-hide-delete"
            }), this.parent = a.parent;
        },
        rendered: function() {
            var a = this.parent, b = this.$el;
            b.on("click", function() {
                if (a.model) {
                    var b = a.model.toJSON(), c = f.request.toJSON(), h = b.boardid || c.page, i = b.sequence || c.sequence, j = {};
                    a.roleContext === g.roleContext.meet && (j.className = "mx-branding-meet-dialog-btn"), 
                    MX.ui.Confirm(d.binder_delete_this_file, function() {
                        e.deletePages(h, [ i ]).success(function() {
                            MX.ui.notifySuccess(d.binder_delete_file_success), setTimeout(function() {
                                a.nextPage();
                            }, 200);
                        }).error(function() {
                            MX.ui.notifyError(d.binder_delete_resource_file_failed);
                        });
                    }, null, j);
                }
            }), b.hide();
        }
    }));
}), define("../framework/viewer/plugin/editWebdoc", [ "moxtra", "text!template/viewer/button.html", "viewer/static", "lang", "binder/binderActions", "binder/binderPageModel", "app" ], function(a, b, c, d, e, f) {
    c.registerPlugin("editWebdoc", a.Controller.extend({
        container: "footerRight",
        template: b,
        init: function(a) {
            _.extend(this.$scope, {
                lang: d,
                title: d.edit,
                icon: "micon-edit"
            }), this.parent = a.parent, this.listenTo(a.parent, "modelChange", this._onModelChange);
        },
        _onModelChange: function(a) {
            if (a) {
                var b = this, c = (b.loader = new Image(), a.get("type"));
                "web" == c ? this.$el.show() : this.hide();
            }
        },
        _openEditor: function(a) {
            var b = this.parent;
            e.editWebDoc(a.boardid, a.sequence).on("save", function(c) {
                var d = MX.get("pages.0", c);
                if (d) {
                    var e = new f(c.pages[0], {
                        parse: !0,
                        boardid: a.boardid
                    });
                    b.model.set(e.toJSON());
                }
            });
        },
        showPanel: function() {
            var a = this.parent, b = this;
            if (a.model) {
                var c = a.model.toJSON(), d = Moxtra.getBoard(c.boardid).pages.get(c.sequence);
                setTimeout(function() {
                    d && d.isLocked ? b.conflictWarning(c, d) : d.lock().success(function() {
                        b._openEditor(c);
                    }).error(function() {
                        b.conflictWarning(c, d);
                    });
                }, 1e3);
            }
        },
        rendered: function() {
            var a = this.parent, b = this, c = this.$el;
            c.on("click", function() {
                if (a.model) {
                    var c = a.model.toJSON(), d = Moxtra.getBoard(c.boardid).pages.get(c.sequence);
                    d && d.isLocked ? b.conflictWarning(c, d) : d.lock().success(function() {
                        b._openEditor(c);
                    }).error(function() {
                        b.conflictWarning(c, d);
                    });
                }
            }), c.hide();
        },
        conflictWarning: function(a, b) {
            var c = this;
            if (b.isLockByMe) MX.ui.Confirm(d.webdoc_locked_by_self, function() {
                b.lock().success(function() {
                    c._openEditor(a);
                });
            }); else {
                var e = b.parent.members.get(b.editor);
                e = e.user || e, MX.ui.Alert(MX.format(d.webdoc_locked, {
                    username: MX.get("name", e)
                }));
            }
        }
    }));
}), define("../framework/viewer/plugin/meet", [ "moxtra", "app", "text!template/viewer/button.html", "viewer/static", "lang", "meet/meet" ], function(a, b, c, d, e, f) {
    d.registerPlugin("note", a.Controller.extend({
        container: "footerRight",
        template: c,
        init: function(a) {
            _.extend(this.$scope, {
                lang: e,
                title: e.create_note,
                icon: "micon-rec-empty"
            }), this.parent = a.parent;
        },
        rendered: function() {
            var a = this.parent, c = this.$el;
            c.on("click", function() {
                var d = b.request.page(), e = a.collection, g = new Moxtra.Collection({
                    model: "Moxtra.model.BoardPage"
                }), h = {}, i = [];
                e && e.length > 0 && _.each(e, function(a) {
                    a.file && a.file.pages && (h[a.page_group] = a.file);
                }), _.each(h, function(a) {
                    a.pages && _.each(a.pages, function(a) {
                        g.push(a);
                    });
                }), MX.each(g, function(a) {
                    i.push(a.sequence);
                });
                var j = g.indexOf(a.model);
                0 > j && (j = 0), a.progress(!0), c.addClass("disabled"), f.start({
                    isNote: !0,
                    boardId: d,
                    currPage: j,
                    pages: i,
                    success: function() {
                        a.progress(!1), a.close();
                    }
                });
            });
        }
    }));
}), define("../framework/viewer/plugin/options", [ "moxtra", "text!template/viewer/optionsMenu.html", "viewer/static", "lang", "binder/binderBiz", "binder/binderActions", "app", "admin/branding/helper", "component/dialog/inputDialog" ], function(a, b, c, d, e, f, g, h, i) {
    c.registerPlugin("options", a.Controller.extend({
        container: "footerLeft",
        template: b,
        handleAction: !0,
        init: function(a) {
            this.$scope.lang = d, this.$scope.branding = {
                showTodoTab: h.isShowTodo()
            }, this.parent = a.parent, this.$scope.isViewer = this.parent.userRole === Moxtra.const.BOARD_READ, 
            this.binderActions = f, this.listenTo(a.parent, "modelChange", this._onModelChange);
        },
        _onModelChange: function(a) {
            var b = this.$('[data-id="rotate"]'), c = a.get("type");
            /image|pdf/.test(c) ? b.show() : b.hide(), b = this.$('[data-id="originalResource"]'), 
            /image|pdf/.test(c) && a.originalResource ? b.show() : b.hide();
        },
        rendered: function() {
            this.btns = this.$(".dropdown-menu li");
        },
        filterMenu: function(a) {
            var b, c;
            this.btns.each(function() {
                c = $(this).find("a"), b = c.data("id"), a(b) ? c.show() : c.hide();
            });
        },
        getModelInfo: function() {
            var a, b, c, d = this.parent.model, e = d.get("page_type") === Moxtra.const.PAGE_TYPE_ANY, f = d.getParent("Board"), g = d.file && 1 === d.file.pages.length, h = d.contents.length > 0;
            return a = e ? d.client_uuid : d.page_group, f && (b = f.getCacheObject(a), c = b && b.parent), 
            {
                model: d,
                board: f,
                isResource: e,
                isSingleFile: g,
                hasAnnotate: h,
                fileId: a,
                parent: c
            };
        },
        copyPageTo: function() {
            var a = this.getModelInfo();
            a.board && (a.isResource || a.isSingleFile ? f.copyFilesTo([ a.fileId ], a.board.id, a.parent) : f.copyPageTo(a.board.id, [ a.model.sequence ]));
        },
        sharePage: function() {
            var a = this.getModelInfo();
            a.board && (a.isResource || a.isSingleFile ? f.shareFiles(a.board.id, [ a.fileId ], [], a.parent) : f.sharePages(a.board.id, [ a.model.sequence ]));
        },
        downloadPage: function() {
            var a = this.getModelInfo();
            a.board && (a.isResource || a.isSingleFile ? f.downloadResources(a.board.id, [ a.fileId ]) : f.downloadPages(a.board.id, [ a.model.sequence ]));
        },
        rotatePage: function() {
            var a = this.parent.model.toJSON(), b = this, c = (a.rotate || 0) + 90, f = a.sequence;
            if (c >= 360 && (c -= 360), /note|video/.test(a.type)) {
                MX.ui.notifySuccess(d.rotate_a_page_success);
                var h = b.parent.model;
                (f = h.get("sequence")) && h.set("rotate", c);
            } else e.rotatePages(a.boardid || g.request.page(), [ {
                sequence: a.sequence,
                rotate: c
            } ]).success(function() {
                MX.ui.notifySuccess(d.rotate_a_page_success);
                var a = b.parent.model;
                (f = a.get("sequence")) && a.set("rotate", c);
            }).error(function() {
                MX.ui.notifyError(d.rotate_a_page_failed);
            });
        },
        removePage: function() {
            var a, b, c = this.parent, e = !1, f = this.parent.model, g = f.getParent("Board");
            MX.ui.Confirm(d.binder_delete_this_file, function() {
                f.page_group && g ? (a = g.getCacheObject(f.page_group), a.isVirtual ? b = f.delete() : (a.pages.length > 1 && (e = !0), 
                b = a.delete(), b.success(function() {
                    f.destroy();
                }))) : "BoardFile" === f.parent.$name ? (b = f.parent.delete(), b.success(function() {
                    f.destroy();
                })) : b = f.delete(), b.success(function() {
                    MX.ui.notifySuccess(d.binder_delete_file_success), e ? c.close() : c.nextPage();
                }).error(function() {
                    MX.ui.notifyError(d.binder_delete_resource_file_failed);
                });
            });
        },
        createTodo: function() {
            var a = this.getModelInfo();
            a.board && (a.isResource || a.isSingleFile ? f.createTodo(a.board.id, [], [ a.fileId ], a.parent) : f.createTodo(a.board.id, [ a.model.sequence ], [], a.parent));
        },
        originalResource: function() {
            window.open(this.parent.model.originalResource, "originalResource");
        },
        renameFile: function() {
            var a = this.parent, b = MX.Model.extend({
                defaults: {
                    newName: ""
                },
                validation: {
                    newName: [ {
                        required: !0,
                        msg: d.please_enter_page_title
                    } ]
                }
            }), c = a.model, e = new b();
            e.set("newName", a.getName()), new MX.ui.Dialog(new i({
                model: e,
                title: d.rename,
                input: {
                    name: "newName",
                    placeholder: d.please_enter_page_title
                },
                buttons: [ {
                    text: d.cancel,
                    position: "left",
                    click: function() {
                        this.pop();
                    }
                }, {
                    text: d.done,
                    className: "btn-primary",
                    position: "right",
                    click: "onSubmit"
                } ],
                onSubmit: function() {
                    var a, b = this;
                    if (e.isValid(!0) && !b.inProgress) {
                        b.inProgress = !0, b.dialog.progress();
                        var f, g, h = e.get("newName"), i = c.getParent("Board");
                        if ("BoardFile" === c.parent.$name) c.parent.set("name", h), a = c.parent.update(); else {
                            if (f = c.page_group, g = i.getCacheObject(f), !g) return;
                            g.set("name", h), a = g.update();
                        }
                        a.success(function() {
                            $(".page-title span").text(h).attr("title", h), $(".JS_FileName").text(h), MX.ui.notifySuccess(d.rename_page_title_success), 
                            b.inProgress = !1, b.dialog.progress(!1), b.dialog.close();
                        }).error(function() {
                            MX.ui.notifyError(d.rename_page_title_failed), b.dialog.progress(!1);
                        });
                    }
                }
            }));
        }
    }));
}), define("../framework/viewer/plugin/pager", [ "moxtra", "text!template/viewer/pager.html", "viewer/static", "lang" ], function(a, b, c, d) {
    c.registerPlugin("pager", a.Controller.extend({
        container: "plugins",
        template: b,
        init: function(a) {
            this.$scope.lang = d, this.$scope.onMobile = !!MX.env.isMobile, this.listenTo(a.parent, "onFirstPage", this._onFirstPage), 
            this.listenTo(a.parent, "onLastPage", this._onLastPage), this.listenTo(a.parent, "switchPage", this._onSwitchPage);
        },
        _onSwitchPage: function() {
            this.$(".mx-viewer-btn").removeClass("disabled").tooltip("hide");
        },
        _onLastPage: function() {
            this.$(".btn-next").addClass("disabled").tooltip("destroy");
        },
        _onFirstPage: function() {
            this.$(".btn-prev").addClass("disabled").tooltip("destroy");
        },
        activePanel: function(a) {
            this.$(".btn-" + a).removeClass("disabled");
        },
        unactivePanel: function(a) {
            this.$(".btn-" + a).addClass("disabled");
        }
    }));
}), define("../framework/viewer/plugin/participants", [ "moxtra", "text!template/viewer/participantSide.html", "viewer/static" ], function(a, b, c) {
    c.registerPlugin("participants", a.Controller.extend({
        template: b,
        container: "side",
        handleAction: !0,
        init: function(a) {
            this.parent = a.parent;
        },
        rendered: function() {}
    }));
}), define("../framework/viewer/plugin/thumbnails", [ "moxtra", "app", "lang", "text!template/viewer/thumbnails.html", "text!template/viewer/thumbnailItem.html", "viewer/static" ], function(a, b, c, d, e, f) {
    a.logger("Viewer:Pager");
    f.registerPlugin("thumbnails", a.Controller.extend({
        container: "plugins",
        template: d,
        handleAction: !0,
        init: function(a) {
            this.listenTo(a.parent, "modelChange", this.focusItem), this.listenTo(a.parent, "close", this.hidePanel), 
            this.listenTo(a.parent, "resize", this.onResize), this.parent = a.parent;
            var b = $(MX.viewer.btnTpl({
                title: c.thumbnail,
                action: "toggleThumbnails",
                icon: "micon-thumbnail"
            }));
            b.on("click", $.proxy(this.toggle, this)), this.btn = b, this.isShow = !1, this.parent.getContainer("footerLeft").append(b);
        },
        onResize: function() {
            this.isShow && (this.hidePanel(), this.showPanel());
        },
        show: function() {
            this.btn.show();
        },
        hide: function() {
            this.btn.hide(), this.hidePanel();
        },
        focusItem: function(a) {
            if (a) {
                var b;
                this.sequence && this.$('[data-param="' + this.sequence + '"]').removeClass("active"), 
                b = a.get("sequence");
                var c = this.$('[data-param="' + b + '"]');
                if (c.length) {
                    c.addClass("active");
                    var d, e = c.position().left;
                    d = Math.max(e - 100, 0);
                }
                this.model = a, this.sequence = b;
            }
        },
        rendered: function() {
            this.box = this.$(".thumbnails-space");
        },
        thumbnailsNext: function() {
            var a = this.box.get(0), b = this.box.scrollLeft();
            a.offsetWidth <= a.scrollWidth - b && this.box.animate({
                scrollLeft: "+=" + a.offsetWidth
            }, 200);
        },
        thumbnailsPrev: function() {
            var a = this.box.get(0), b = this.box.scrollLeft();
            b > 0 && (b = Math.max(0, b - a.offsetWidth), this.box.animate({
                scrollLeft: b
            }, 200));
        },
        toggle: function() {
            return this.isShow ? this.hidePanel() : this.showPanel(), this.isShow;
        },
        showPanel: function() {
            var c;
            if (!this.list) {
                var d = this.box;
                this.list = new a.List({
                    renderTo: d,
                    speedup: !0,
                    unifyLazyload: !0,
                    template: e,
                    lazyload: d,
                    $scope: {
                        blankImg: b.const.defaults.blankImg
                    }
                }), c = !0;
            }
            this.list.collection && this.list.collection.$id == this.parent.collection.$id || (this.list.binding(this.parent.collection), 
            this.box.trigger("scroll")), this.parent.collection.$name || this.list.filter(function(a) {
                var b = a.get("type");
                return "ds" == b ? !1 : !0;
            }), this.$el.show(), this.focusItem(this.model), this.isShow = !0;
        },
        hidePanel: function() {
            this.$el.hide(), this.isShow = !1;
        }
    }));
}), define("../framework/viewer/plugin/zoom", [ "moxtra", "viewer/static", "lang" ], function(a, b, c) {
    b.registerPlugin("zoom", a.Controller.extend({
        container: "footerLeft",
        tagName: "div",
        handleAction: !0,
        init: function(a) {
            this.parent = a.parent, this.$el.css("display", "inline");
            var d = $(b.btnTpl({
                title: c.zoom_in,
                action: "zoomIn",
                icon: "micon-zoom-in"
            }));
            this.$el.append(d), d = $(b.btnTpl({
                title: c.zoom_out,
                action: "zoomOut",
                icon: "micon-zoom-out"
            })), this.listenTo(a.parent, "modelChange", this._onModelChange), this.$el.append(d);
        },
        _onModelChange: function(a) {
            var b = a.get("type");
            /audio|video|note/.test(b) ? this.$el.addClass("hide") : this.$el.removeClass("hide");
        },
        zoomIn: function() {
            var a = this.parent, b = a.viewScaleNumber + .25;
            2 > b && a.zoom(b);
        },
        zoomOut: function() {
            var a = this.parent, b = a.viewScaleNumber - .25;
            b > .2 && a.zoom(b);
        }
    }));
}), define("mx.app4", function() {});