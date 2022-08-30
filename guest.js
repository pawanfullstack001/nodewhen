const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/User.js').User;
const Tickets = require('../models/Tickets.js').Tickets;
const Ticketsappliedjobs = require('../models/Ticketsappliedjobs.js').Ticketsappliedjobs;
const Sequence = require('../models/Sequence.js').Sequence;
const Page = require('../models/Page').Page;
const urljoin = require('url-join');
const json2xls = require('json2xls');
const fs = require('fs');

const Language = require('../models/Language').Language;
const Expertise = require('../models/Expertise').Expertise;
const Heading = require('../models/Heading').Heading;
const Report = require('../models/Report').Report;
const Call = require('../models/Call').Call;
const City = require('../models/City').City;
const Country = require('../models/Country').Country;
const Prefecture = require('../models/Prefecture').Prefecture;
const Request = require('../models/Request').Request;
const Credit = require('../models/Credit').Credit;
const Review = require('../models/Review').Review;
const BPC = require('../models/BPC').BPC;
const Conversion = require('../models/Conversion').Conversion;
const ConversionReply = require('../models/ConversionReply').ConversionReply;
const JobRequest = require('../models/JobRequest').JobRequest;
const UserActivity = require('../models/UserActivity').UserActivity;
const UserSchedule = require('../models/UserSchedule').UserSchedule;
const Transaction = require('../models/Transaction').Transaction;

const formidable = require('formidable');
const vrules = require('../validation_rules.js').app_rules;

const unique = require('array-unique');

const _ = require('lodash');

exports.EmailEdit = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	var old_email = reqdata.old_email;
	var new_email = reqdata.new_email;
	
	
	
	User.findOne({
        email: old_email
    }, function(err, emailCheck) {
        if (err) return next(err);
        if (emailCheck) {
			User.findOne({email: new_email}, function (err, userOne) {
				if(userOne){
					return res.status(203).json({
						data: userOne,
						reply: "New email already exists, Please choose another email",
						meta: req.phoneMeta
					});
				}else{
					User.updateOne({email : old_email},{ $set: {email : new_email}}, function(err, obj) {
						if (err) throw err;
						return res.status(200).json({
							data: {},
							reply: "Email Updated successfully",
							meta: req.phoneMeta
						});
					});
					/* var verification_token = FUNC.crypto(new_email, 'encrypt').toString();
					
					
					var activation_token = FUNC.crypto(verification_token + '_' + NewUser._id.toString(), 'encrypt').toString();
                    var verification_link = urljoin(process.env.APP_URL, 'users/activate/', activation_token); */
				}
				
			});
        }else{
			return res.status(203).json({
				data: {},
				reply: "Old email not found in system. please check you old email",
				meta: req.phoneMeta
			});
		}
	});
}

exports.EmailTest = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	var old_email = reqdata.old_email;
	var new_email = reqdata.new_email;
	
	
	
	User.findOne({
        email: old_email
    }, function(err, emailCheck) {
        if (err) return next(err);
        if (emailCheck) {
			User.findOne({email: new_email}, function (err, userOne) {
				if(userOne){
					return res.status(203).json({
						data: userOne,
						reply: "New email already exists, Please choose another email",
						meta: req.phoneMeta
					});
				}else{
					User.updateOne({email : old_email},{ $set: {email : new_email}}, function(err, obj) {
						if (err) throw err;
						return res.status(200).json({
							data: {},
							reply: "Email Updated successfully",
							meta: req.phoneMeta
						});
					});
					/* var verification_token = FUNC.crypto(new_email, 'encrypt').toString();
					
					
					var activation_token = FUNC.crypto(verification_token + '_' + NewUser._id.toString(), 'encrypt').toString();
                    var verification_link = urljoin(process.env.APP_URL, 'users/activate/', activation_token); */
				}
				
			});
        }else{
			return res.status(203).json({
				data: {},
				reply: "Old email not found in system. please check you old email",
				meta: req.phoneMeta
			});
		}
	});
}

exports.Tickets = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var user_id = reqdata.user_id;
	var lang_from = reqdata.lang_from;
	var lang_to = reqdata.lang_to;
	var when = reqdata.when;
	var duration = reqdata.duration;
	var service_type = reqdata.service_type;
	var currency = reqdata.currency;
	var budget = reqdata.budget;
	var expertise = reqdata.expertise;
	var serachap = {
		user_id : user_id,
		lang_from : lang_from,
		lang_to : lang_to,
		when : when,
		duration : duration,
		service_type : service_type,
		currency : currency,
		budget : budget,
		expertise : expertise
	};
	var NewTicket = new Tickets(serachap);
	NewTicket.save(function(err, new_ticket_data) {
        if (err) return next(err);
        return res.status(200).json({
            data: new_ticket_data,
            reply: "Ticket created successfully",
            meta: req.phoneMeta
        });
    });	
}
exports.TicketEdit = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	var lang_from = reqdata.lang_from;
	var lang_to = reqdata.lang_to;
	var when = reqdata.when;
	var duration = reqdata.duration;
	var service_type = reqdata.service_type;
	var currency = reqdata.currency;
	var budget = reqdata.budget;
	var expertise = reqdata.expertise;
	
	var serachap = {
		lang_from : lang_from,
		lang_to : lang_to,
		when : when,
		duration : duration,
		service_type : service_type,
		currency : currency,
		budget : budget,
		expertise : expertise
	};
	var myquery = {_id : ObjectId(id)};
	var newvalues = { $set: serachap};
	Tickets.updateOne(myquery,newvalues, function(err, obj) {
		if (err) throw err;
		return res.status(200).json({
			data: {},
			reply: "Updated successfully",
			meta: req.phoneMeta
		});
	});	
}

exports.TicketList = function(req, res, next) {
	var reqdata = req.body;
	var user_id = reqdata.user_id;
	Tickets.find({user_id: user_id}, function(err, users) {
		var userMap = [];
		users.forEach(function(user) {
		  var user_details = user;
		  userMap.push(user_details)
		}); 
		return res.status(200).json({
			data: userMap,
			reply: "Ticket list founded successfully",
			meta: req.phoneMeta
		});
	  });
}
exports.TicketDelete = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	
	var serachap = {
		_id : ObjectId(id)
	};
	Tickets.deleteOne(serachap, function(err, obj) {
    if (err) throw err;
    return res.status(200).json({
            data: {},
            reply: "deleted successfully",
            meta: req.phoneMeta
        });
  });
	
}

exports.ApplyJob = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var ticket_id = reqdata.ticket_id;
	var bid_amount = reqdata.bid_amount;
	var currency = reqdata.currency;
	var message = reqdata.message;
	var interpreter_id = reqdata.interpreter_id;
	
	var serachap = {
		interpreter_id : interpreter_id,
		ticket_id : ticket_id,
		bid_amount : bid_amount,
		currency : currency,
		message : message
	};
	var Appliedjobs = new Ticketsappliedjobs(serachap);
	Appliedjobs.save(function(err, new_job_data) {
		if (err) return next(err);
		return res.status(200).json({
			data: new_job_data,
			reply: "Job applied successfully",
			meta: req.phoneMeta
		});
	});
}

exports.OpenJobs = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	var lang_from = reqdata.lang_from;
	var lang_to = reqdata.lang_to;
	var interpreter_id = reqdata.interpreter_id; 
	
	Tickets.find({
		lang_from : lang_from,
		lang_to : lang_to
    }, function(err, tickets) {
        if (err) return next(err);
        if (tickets) {
			var tmp_languages_new = [];
			tickets.forEach((v)=>{
				var corr = v._id;
				var tempObj = {
					_id: v._id
				}
				tmp_languages_new.push(v);
			})
			return res.status(200).json({
				data: tmp_languages_new,
				reply: "Open job successfully listed",
				meta: req.phoneMeta
			});
		}else{
			return res.status(203).json({
				data: {},
				reply: "Not found",
				meta: req.phoneMeta
			});
		}
	});
}

exports.AppliedJobs = function(req, res, next) {
    var reqdata = req.body;
    var localObj = {};
	var id = reqdata.id;
	var lang_from = reqdata.lang_from;
	var lang_to = reqdata.lang_to;
	var interpreter_id = reqdata.interpreter_id; 
	var jobs = [];
	Tickets.find({
		lang_from : lang_from,
		lang_to : lang_to
	}, function(err, tickets) {
		if (err) return next(err);
		if (!tickets) {
			return res.status(203).json({
				jobdata : [],
				reply: "Applied job not found!.",
				meta: req.phoneMeta
			});
		}else{
			 var jobs = [];
			tickets.forEach((j)=>{
				var tempJob = {
					ticket_id: j._id
				}
				jobs.push(tempJob);
			})
			superjobs = jobs;
			////////////////////////
			Ticketsappliedjobs.find({
				interpreter_id : interpreter_id
			}, function(err, ticketsappliedjobs) {
				if (err) return next(err);
				var tmp_languages_new = [];
				ticketsappliedjobs.forEach((v)=>{ 
					Tickets.findOne({_id : ObjectId(v.ticket_id)}).exec((err, doc) => {
					   if (!err) {
						  doc.toObject({ getters: true });
							var tempObj = {
								ticket_id: v.ticket_id,
								lang : doc._id
							}
					   }
					});
					tmp_languages_new.push(tempObj);
					
					
				});
				/* var b = superjobs;
				var a = tmp_languages_new;
				function remove_duplicates(a, b) {
					for (var i = 0, len = a.length; i < len; i++) { 
						for (var j = 0, len2 = b.length; j < len2; j++) { 
							if (a[i].ticket_id === b[j].ticket_id) {
								b.splice(j, 1);
								len2=b.length;
							}
						}
					}
					return b;
					//console.log(b);

				} */
				return res.status(200).json({
					data: tmp_languages_new,
					//data1: superjobs,
					reply: "",
					meta: req.phoneMeta
				});
			});
		}
	});
	/* Ticketsappliedjobs.find({
		interpreter_id : interpreter_id
    }, function(err, tickets) {
        if (err) return next(err);
        if (tickets) {
			
			var tmp_languages_new = [];
			tickets.forEach((v)=>{ 
				var tid = v.ticket_id;
				var tempObj = {
					ticket_id: v.ticket_id
				}
				tmp_languages_new.push(tempObj);
			})
			return res.status(200).json({
				data: tmp_languages_new,
				jobdata : jobs,
				reply: "Applied job successfully listed",
				meta: req.phoneMeta
			});
		}else{
			return res.status(203).json({
				data: {},
				reply: "Not found",
				meta: req.phoneMeta
			});
		}
	}); */
}


exports.Register = function(req, res, next) {

    var reqdata = req.body;

    var localObj = {};

    var full_name = reqdata.full_name;
    var email = reqdata.email.toLowerCase();
    var password = reqdata.password;
    var os = reqdata.os = req.headers["os"];
    var signup_os = reqdata.os = req.headers["os"];
    var source = reqdata.source;
    var language = reqdata.language = req.headers["language"];
    var verification_token = FUNC.crypto(full_name, 'encrypt').toString();

    var gender = reqdata.gender;
    var profile_url = reqdata.profile_url;

    var referral_code = reqdata.referral_code;
    var gdpr_accepted = reqdata.gdpr_accepted;
    var user_type = "normal";
    var is_special = false;
    var currentDate = moment().toDate()

    var userLang = req.user_language && req.user_language == "jap" ? "ja" : req.user_language;

    User.findOne({
        email: email
    }, function(err, emailCheck) {
        if (err) return next(err);

        if (emailCheck) {
            return res.status(203).json({
                data: {},
                reply: _d("email_already_exists", "Email is already exists please enter a different email address"),
                meta: req.phoneMeta
            });
        } else {

            var new_user_details = {
                full_name: full_name,
                email: email,
                source: source,
                user_type: user_type,
                os: os,
                signup_os: signup_os,
                verification_token: verification_token,
                language: language,
                rates: [],
                booking_rates: [],
                native_languages: [],
                speaking_languages: [],
                gdpr_accepted: gdpr_accepted
            };

            async.series({
                referral_check: function(callback) {
                    if (referral_code != undefined && referral_code != "") {
                        User.findOne({
                            role_id: "promoter",
                            referral_code: referral_code,
                            is_active: true,
                            start_date:{$lte:currentDate},
                            end_date:{$gte:currentDate}
                        }, function(err, promoter_detail) {
                            if (promoter_detail) {
                                new_user_details.promoter_id = promoter_detail._id;
                                new_user_details.user_type = "promotional";
                                is_special = promoter_detail.is_special ? true : false;
                                callback();
                            } else {
                                BPC.findOne({
                                    partner_refer_code: referral_code,
                                    is_used: false
                                }).populate("partner_id", "_id role_id is_special").exec(function(err, coupon_code) {
                                    if (coupon_code && coupon_code.partner_id && coupon_code.partner_id.role_id != "hospital") {
                                        if(coupon_code.partner_id.role_id == "promoter"){
                                            new_user_details.promoter_id = coupon_code.partner_id._id;
                                        }else{
                                            new_user_details.partner_id = coupon_code.partner_id._id;
                                        }
                                        new_user_details.coupon_id = coupon_code._id;
                                        new_user_details.user_type = coupon_code.partner_id.role_id && coupon_code.partner_id.role_id == "promoter" ? "promotional" : "partner";
                                        is_special = coupon_code.partner_id.is_special && coupon_code.partner_id.role_id == "promoter" ? true : false;
                                        callback();
                                    } else {
                                        callback(new Error(_d("referral_code_error", "The referral code you entered is not valid")));
                                    }
                                });
                            }
                        });
                    } else {
                        callback();
                    }
                }
            }, function(err, results) {
                if (err) return next(err);

                if (reqdata.source == "email") {

                    new_user_details.password = password;
                    //user is come with special promoter code then user gets 5 min free credits
                    //now changed on 9 April 2019 user gets 10 USD
                    if(is_special){
                        //new_user_details.free_credits = 300;
                        new_user_details.is_promoter_referal = true;
                    }

                    var NewUser = new User(new_user_details);
                    var activation_token = FUNC.crypto(verification_token + '_' + NewUser._id.toString(), 'encrypt').toString();
                    var verification_link = urljoin(process.env.APP_URL, 'users/activate/', activation_token);
                    NewUser.save(function(err, new_user_data) {
                        if (err) return next(err);

                        if(new_user_details.coupon_id && new_user_details.coupon_id != ""){
                            BPC.findOneAndUpdate({
                                _id: ObjectId(new_user_details.coupon_id)
                            }, {
                                $set: { is_used: true }
                            }, {
                                new: true
                            }).exec(function(err, updatecoupon) {
                                if (err) return next(err);
                                FUNC.sendMailDB("app-email-verification", req.user_language, email, {
                                    name: full_name,
                                    email: email,
                                    verification_link: verification_link+'?langTemp='+userLang
                                }, function(err) {

                                    if (err) return next(err);

                                    FUNC.postLogin(new_user_data._id.toString(), reqdata, function(err, user_login_data) {

                                        if (err) return next(err);

                                        return res.status(200).json({
                                            data: user_login_data,
                                            //reply: is_special ? _d("registered_successfully_got_five_minutes_call_free","You got Five minute free") :_d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                            reply: _d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                            meta: req.phoneMeta
                                        });
                                    });
                                });
                            });
                        }else{
                            FUNC.sendMailDB("app-email-verification", req.user_language, email, {
                                name: full_name,
                                email: email,
                                verification_link: verification_link+'?langTemp='+userLang
                            }, function(err) {

                                if (err) return next(err);

                                FUNC.postLogin(new_user_data._id.toString(), reqdata, function(err, user_login_data) {

                                    if (err) return next(err);

                                    return res.status(200).json({
                                        data: user_login_data,
                                        //reply: is_special ? _d("registered_successfully_got_five_minutes_call_free","You got Five minute free") :_d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                        reply: _d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                        meta: req.phoneMeta
                                    });
                                });
                            });
                        }
                    });
                } else if (reqdata.source == "social") {

                    var social_type = reqdata.social_type;
                    var social_id = reqdata.social_id;

                    User.findOne({
                        social_type: social_type,
                        social_id: social_id,
                    }, function(err, socialCheck) {
                        if (err) return next(err);
                        if (socialCheck) {
                            return res.status(203).json({
                                data: {},
                                reply: _d("social_account_already_exists", "Social account already exists."),
                                meta: req.phoneMeta
                            });
                        } else {

                            new_user_details.social_type = social_type;
                            new_user_details.social_id = social_id;

                            //user is come with special promoter code then user gets 5 min free credits
                            //now changed on 9 April 2019 user gets 10 USD
                            if(is_special){
                                //new_user_details.free_credits = 300;
                                new_user_details.is_promoter_referal = true;
                            }

                            var NewUser = new User(new_user_details);
                            var activation_token = FUNC.crypto(verification_token + '_' + NewUser._id.toString(), 'encrypt').toString();
                            var verification_link = urljoin(process.env.APP_URL, 'users/activate/', activation_token);
                            NewUser.save(function(err, new_user_data) {
                                if (err) return next(err);


                                if(new_user_details.coupon_id && new_user_details.coupon_id != "") {
                                    BPC.findOneAndUpdate({
                                        _id: ObjectId(new_user_details.coupon_id)
                                    }, {
                                        $set: {is_used: true}
                                    }, {
                                        new: true
                                    }).exec(function (err, updatecoupon) {
                                        if (err) return next(err);
                                        FUNC.sendMailDB("app-email-verification", req.user_language, email, {
                                            name: full_name,
                                            email: email,
                                            verification_link: verification_link+'?langTemp='+userLang
                                        }, function(err) {
                                            if (err) return next(err);

                                            FUNC.postLogin(new_user_data._id.toString(), reqdata, function(err, user_login_data) {
                                                if (err) return next(err);

                                                return res.status(200).json({
                                                    data: user_login_data,
                                                    //reply: is_special ? _d("registered_successfully_got_five_minutes_call_free","Congratulations, you have received 5 minutes of free call.") :_d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                                    reply: _d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                                    meta: req.phoneMeta
                                                });
                                            });
                                        });
                                    })
                                }else{
                                    FUNC.sendMailDB("app-email-verification", req.user_language, email, {
                                        name: full_name,
                                        email: email,
                                        verification_link: verification_link+'?langTemp='+userLang
                                    }, function(err) {
                                        if (err) return next(err);

                                        FUNC.postLogin(new_user_data._id.toString(), reqdata, function(err, user_login_data) {
                                            if (err) return next(err);

                                            return res.status(200).json({
                                                data: user_login_data,
                                                //reply: is_special ? _d("registered_successfully_got_five_minutes_call_free","You got Five minute free") :_d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                                reply: _d("successful_register_msg", "You are successfully registered, A verification link has been sent on the email address"),
                                                meta: req.phoneMeta
                                            });
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}



exports.Activate = function(req, res, next) {

    var activation_token = req.params.activation_token;

    if (activation_token == undefined || activation_token == '') {
        return res.render('users/activation', {
            title: _d("email_verfication", "'Email Verification'"),
            activation_text: _d("activation_url_wrong", "Wrong activation link")
        });
    } else {
        var activation_text = FUNC.crypto(activation_token, 'decrypt').toString();
        var verification_token = activation_text.split("_")[0];
        var user_id = activation_text.split("_")[1];

        User.findOne({
            _id: ObjectId(user_id),
            verification_token: verification_token
        }, function(err, user_details) {
            if (err) {
                return res.render('users/activation', {
                    title: _d("email_verfication", "'Email Verification'"),
                    activation_text: _d("activation_url_wrong", "Wrong activation link")
                });
            } else {
                if (user_details) {
                    if (user_details.email_verified) {
                        return res.render('users/activation', {
                            title: _d("email_verfication", "'Email Verification'"),
                            activation_text: _d("already_verified", "Your account has been already verified")
                        });
                    } else {
                        User.update({
                            _id: ObjectId(user_id)
                        }, {
                            $set: {
                                email_verified: true
                            }
                        }, function(err, results) {
                            if (err) {
                                return res.render('users/activation', {
                                    title: _d("email_verfication", "'Email Verification'"),
                                    activation_text: err.message
                                });
                            } else {
                                return res.render('users/activation', {
                                    title: _d("email_verfication", "'Email Verification'"),
                                    activation_text: _d("account_activated", "Congratulations your account has been activated")
                                });
                            }
                        });
                    }
                } else {
                    return res.render('users/activation', {
                        title: _d("email_verfication", "'Email Verification'"),
                        activation_text: _d("token_expired", "Token Expired")
                    });
                }
            }
        });
    }
}



exports.Login = function(req, res, next) {

    var reqdata = req.body;
    var localObj = {};


    var email = reqdata.email.toLowerCase();
    var password = reqdata.password;
    reqdata.os = req.headers["os"];
    var device_token = reqdata.device_token;
    var voip_device_token = reqdata.voip_device_token;

    User.findOne({
        $and: [{
            email: email,
            user_type: {$ne: "hospital_partner"}
        }]
    }, {
        _id: 1,
        password: 1,
        is_active: 1,
        email: 1,
        source: 1,
        email_verified: 1,
        is_selfdelete: 1,
        gdpr_accepted: 1
    }, function(err, user) {
        if (err) return next(err);
        if (user) {
            if (!user.is_active) {
                return res.status(203).json({
                    data: {},
                    reply: _d("account_not_active", "Your acccount is not active afas dss"),
                    meta: req.phoneMeta 
                });
            }else{
                bcrypt.compare(password, user.password, function(err, hash_result) {
                    if (err) return next(err);

                    if (hash_result) {

                        reqdata.gdpr_accepted = user.gdpr_accepted;
                        FUNC.postLogin(user._id.toString(), reqdata, function(err, user_login_data) {


                            if (err) return next(err);

                            if (user.is_selfdelete) {
                                res.status(200).json({
                                    data: user_login_data,
                                    reply: _d("your_account_activated", "Your account is activated"),
                                    meta: req.phoneMeta
                                });
                            } else {
                                res.status(200).json({
                                    data: user_login_data,
                                    reply: _d("login_successfully", "You are logged in dddddddsfsd"),
                                    meta: req.phoneMeta
                                });
                            }

                        });
                    } else {
                        return res.status(203).json({
                            data: {},
                            reply: _d("invalid_credentials", "The login credentials you entered are not correct. Please try again"),
                            meta: req.phoneMeta
                        });
                    }
                });
            }
        } else {
            return res.status(203).json({
                data: {},
                reply: _d("invalid_credentials", "The login credentials you entered are not correct. Please try again"),
                meta: req.phoneMeta
            });
        }
    });
}



exports.SocialLogin = function(req, res, next) {

    var reqdata = req.body;
    var localObj = {};

    var social_type = reqdata.social_type;
    var social_id = reqdata.social_id;
    var email = reqdata.email || '';
    reqdata.os = req.headers["os"];
    var device_token = reqdata.device_token;
    var voip_device_token = reqdata.voip_device_token;

    User.findOne({
        social_type: social_type,
        social_id: social_id,
        user_type: {$ne: "hospital_partner"}
    }, {
        _id: 1,
        password: 1,
        is_active: 1,
        email: 1,
        is_selfdelete: 1
    }, function(err, user) {
        if (err) return next(err);

        if (user) {
            if (!user.is_active) {
                return res.status(203).json({
                    data: {},
                    reply: _d("account_not_active", "Your acccount is not active"),
                    meta: req.phoneMeta
                });
            } else {

                reqdata.gdpr_accepted = user.gdpr_accepted;
                FUNC.postLogin(user._id.toString(), reqdata, function(err, user_login_data) {
                    if (err) return next(err);

                    if (user.is_selfdelete) {
                        res.status(200).json({
                            data: user_login_data,
                            id_exist: true,
                            reply: _d("your_account_activated", "Your account is activated"),
                            meta: req.phoneMeta
                        });
                    } else {
                        return res.status(200).json({
                            data: user_login_data,
                            id_exist: true,
                            reply: _d("login_successfully", "You are logged in successfully"),
                            meta: req.phoneMeta
                        });
                    }
                });
            }
        } else {

            if(email && email != ""){
                User.findOne({
                    email: email,
                    user_type: {$ne: "hospital_partner"},
                    social_type :{$ne:null},
                    social_id :{$ne:null}
                }, {
                    _id: 1,
                    password: 1,
                    is_active: 1,
                    email: 1,
                    is_selfdelete: 1,
                    social_type: 1,
                    social_id: 1
                }, function(err, user) {
                    if (err) return next(err);
                    if (user) {
                        if (!user.is_active) {
                            return res.status(203).json({
                                data: {},
                                reply: _d("account_not_active", "Your acccount is not active"),
                                meta: req.phoneMeta
                            });
                        } else {

                            reqdata.gdpr_accepted = user.gdpr_accepted;
                            FUNC.postLogin(user._id.toString(), reqdata, function(err, user_login_data) {
                                if (err) return next(err);

                                User.findOneAndUpdate({
                                    _id: ObjectId(user._id)
                                }, {
                                    $set: {
                                        social_type: social_type,
                                        social_id: social_id
                                    }
                                }).exec(function(err, updateUser) {
                                    if (err) {
                                        if (err) return next(err);
                                    } else {
                                        if (user.is_selfdelete) {
                                            res.status(200).json({
                                                data: user_login_data,
                                                id_exist: true,
                                                reply: _d("your_account_activated", "Your account is activated"),
                                                meta: req.phoneMeta
                                            });
                                        } else {
                                            return res.status(200).json({
                                                data: user_login_data,
                                                id_exist: true,
                                                reply: _d("login_successfully", "You are logged in successfully"),
                                                meta: req.phoneMeta
                                            });
                                        }
                                    }
                                })
                            });
                        }
                    }else{
                        return res.status(200).json({
                            data: {},
                            id_exist: false,
                            reply: "",
                            meta: req.phoneMeta
                        });
                    }

                });
            }else{
                return res.status(200).json({
                    data: {},
                    id_exist: false,
                    reply: "",
                    meta: req.phoneMeta
                });
            }
        }
    });
}


exports.Logout = function(req, res, next) {

    var login_token = req.headers.authorization;

    if (login_token == '' || login_token == undefined) {
        return res.status(440).json({
            data: {},
            reply: _d("token_blank", "Authentication token missing"),
            meta: req.phoneMeta
        });
    }



    User.findOne({
        login_token: login_token,
        is_active: 1
    }, {
        arn_token: 1
    }, function(err, logindata) {
        if (err) {
            return res.status(203).json({
                data: {},
                reply: err.message,
                meta: req.phoneMeta
            });
        } else {



            if (!logindata) {
                return res.status(200).json({
                    data: {},
                    reply: _d("user_logout_msg", "You have logged out successfully"),
                    meta: req.phoneMeta
                });
            } else {
                io.emit('interpreter_status_update', {
                    "user_id": logindata._id.toString(),
                    "is_interpreter_online": false
                });

                User.update({
                        _id: logindata._id
                    }, {
                        $set: {
                            login_token: '',
                            arn_token: '',
                            is_login: false,
                            badge: 0
                        }
                    },
                    function(err, doc) {
                        if (err) return next(err);

                        FUNC.deleteEndpoint(logindata.arn_token, function(err) {
                            return res.status(200).json({
                                data: {},
                                reply: _d("user_logout_msg", "You have logged out successfully"),
                                meta: req.phoneMeta
                            });
                        });
                    });
            }
        }
    });
}



exports.Deactivate = function(req, res, next) {

    var logindata = req.user_data;

    User.update({
            _id: logindata._id
        }, {
            $set: {
                login_token: '',
                arn_token: '',
                is_login: false,
                is_selfdelete: true,
                badge: 0
            }
        },
        function(err, doc) {
            if (err) return next(err);

            FUNC.deleteEndpoint(logindata.arn_token, function(err) {
                return res.status(200).json({
                    data: {},
                    reply: _d("user_deactivate_msg", "Your account has been deactivated successfully"),
                    meta: req.phoneMeta
                });
            });
        });
}



exports.ChangePassword = function(req, res, next) {

    var reqdata = req.body;
    var logindata = req.user_data;
    var localObj = {};

    var old_password = reqdata.old_password;
    var password = reqdata.password;

    bcrypt.compare(old_password, logindata.password, function(err, hash_result) {
        if (err) return next(err);

        if (hash_result) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return next(err);


                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) return next(err);

                    User.update({
                        _id: logindata._id
                    }, {
                        $set: {
                            password: hash
                        }
                    }, function(err, result) {
                        if (err) return next(err);

                        return res.status(200).json({
                            data: {},
                            reply: _d("password_changed_successfully", "Your password has been changed successfully"),
                            meta: req.phoneMeta
                        });
                    });
                });
            });
        } else {
            return res.status(203).json({
                data: {},
                reply: _d("incorrect_old_password", "The old password you entered is not correct, please try again."),
                meta: req.phoneMeta
            });
        }
    });
}


exports.ForgotPassword = function(req, res, next) {

    var reqdata = req.body;
    var email = reqdata.email.toLowerCase();

    User.findOne({
        email: email,
        is_active: true
    }, {
        _id: 1,
        full_name: 1
    }, function(err, user) {
        if (err) return next(err);

        if (user) {

            var reset_token = FUNC.crypto(user.full_name + FUNC.randomString(5), 'encrypt').toString();
            var activation_token = FUNC.crypto(reset_token + '_' + user._id.toString(), 'encrypt').toString();
            var verification_link = urljoin(process.env.APP_URL, '/users/reset_password/', activation_token);

            FUNC.sendMailDB("app-forgot-password", req.user_language, email, {
                verification_link: verification_link,
                name: user.full_name
            }, function(err) {
                if (err) return next(err);

                User.update({
                    _id: user._id
                }, {
                    $set: {
                        'reset_token': reset_token
                    }
                }, function(err, result) {
                    return res.status(200).json({
                        data: {},
                        reply: _d("reset_link_send", "Instructions to reset you password has been send to your email address."),
                        meta: req.phoneMeta
                    });
                });
            });
        } else {
            return res.status(203).json({
                data: {},
                reply: _d("incorrect_email", "Email adresss couldn't match, please try with a different email."),
                meta: req.phoneMeta
            });
        }
    });
}


/*exports.EditProfile = function(req, res, next) {

    var logindata = req.user_data;
    var updateObj = {};
    var expertise_list_arr = [];

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var validation = new Validator(fields, vrules.edit_profile);
        if (validation.fails()) {
            //Validating fails
            var errorObj = validation.errors.all();
            return res.status(203).send({
                data: {},
                reply: errorObj[Object.keys(errorObj)[0]][0],
                meta: req.phoneMeta
            });
        } else {

            var full_name = fields.full_name;
            var currency = fields.currency;
            var gender = fields.gender;
            var native_languages = fields.native_languages;
            var speaking_languages = fields.speaking_languages;
            var is_interpreter = (fields.is_interpreter == 'true' || fields.is_interpreter == '1');

            var city_id = fields.city_id;
            var country_id = fields.country_id;

            var old_image = (logindata.photo != undefined && logindata.photo != "") ? logindata.photo : "";
            var old_video = (logindata.video != undefined && logindata.video != "") ? logindata.video : "";
            var old_video_thumb = (logindata.video_thumb != undefined && logindata.video_thumb != "") ? logindata.video_thumb : "";


            var rates = (logindata.rates == undefined) ? [] : logindata.rates;
            var booking_rates = (logindata.booking_rates == undefined) ? [] : logindata.booking_rates;

            var native_languages_old = [];
            var speaking_languages_old = [];
            var all_language_old = [];

            native_languages_old = logindata.native_languages.map(function(language_id) {
                return language_id.toString();
            });

            speaking_languages_old = logindata.speaking_languages.map(function(language_id) {
                return language_id.toString();
            });

            all_language_old = native_languages_old.concat(speaking_languages_old);


            if (native_languages) {
                native_languages = native_languages.split(",");
                var native_languages_arr = native_languages.map(function(language_id) {
                    return ObjectId(language_id);
                });
            } else {
                native_languages = [];
                var native_languages_arr = [];
            }

            if (speaking_languages) {
                speaking_languages = speaking_languages.split(",");
                var speaking_languages_arr = speaking_languages.map(function(language_id) {
                    return ObjectId(language_id);
                });
            } else {
                speaking_languages = [];
                var speaking_languages_arr = [];
            }

            var all_language = native_languages.concat(speaking_languages.filter(function(item) {
                return native_languages.indexOf(item) === -1;
            }));

            var remove_languages = all_language_old.filter(function(x) {
                return all_language.indexOf(x) < 0
            })
            var add_languages = all_language.filter(function(x) {
                return all_language_old.indexOf(x) < 0
            })



            updateObj.full_name = full_name;
            updateObj.gender = gender;
            updateObj.native_languages = native_languages_arr;
            updateObj.is_interpreter = is_interpreter;
            updateObj.city_id = city_id;
            updateObj.country_id = country_id;
            updateObj.profile_status = "complete";

            if (currency != undefined && currency != null) {
                updateObj.currency = currency;
            }

            if (is_interpreter) {

                updateObj.speaking_languages = speaking_languages_arr;

                for (var i = 0; i < all_language.length; i++) {
                    for (var j = i + 1; j < all_language.length; j++) {
                        if (add_languages.indexOf(all_language[i]) !== -1 || add_languages.indexOf(all_language[j]) !== -1) {
                            rates.push({
                                languages: [ObjectId(all_language[i]), ObjectId(all_language[j])],
                                fee: 0,
                                usd_fee: 0,
                                currency: currency
                            });

                            booking_rates.push({
                                languages: [ObjectId(all_language[i]), ObjectId(all_language[j])],
                                fee: 0,
                                usd_fee: 0,
                                currency: currency
                            });
                        }
                    }
                }

                var updated_rates = rates.filter(function(rateObj) {
                    if (remove_languages.indexOf(rateObj.languages[0].toString()) == -1 && remove_languages.indexOf(rateObj.languages[1].toString()) == -1) {

                        if (currency != undefined && currency != null && currency != logindata.currency) {
                            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
                            rateObj.currency = currency;
                        }
                        return rateObj
                    }
                });

                var updated_booking_rates = booking_rates.filter(function(rateObj) {
                    if (remove_languages.indexOf(rateObj.languages[0].toString()) == -1 && remove_languages.indexOf(rateObj.languages[1].toString()) == -1) {

                        if (currency != undefined && currency != null && currency != logindata.currency) {
                            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
                            rateObj.currency = currency;
                        }
                        return rateObj
                    }
                });

                updateObj.rates = updated_rates;
                updateObj.booking_rates = updated_booking_rates;

                var expertise_list = fields.expertise_list;
                var other_expertise = fields.other_expertise;

                var other_expertise_list = [];
                if (other_expertise) {
                    other_expertise_list = other_expertise.split(",");
                }

                if (expertise_list) {
                    expertise_list = expertise_list.split(",");
                }


                var associations = fields.associations;
                var educations = fields.educations;
                var certificates = fields.certificates;
                var job_types = fields.job_types.split(",");
                var bio = fields.bio;
                var is_online = (fields.is_online == 'true' || fields.is_online == '1');


                if (is_online != logindata.is_online) {
                    io.emit('interpreter_status_update', {
                        "user_id": logindata._id.toString(),
                        "is_interpreter_online": is_online
                    });
                }

                if (associations !== undefined && associations !== "") {
                    updateObj.associations = associations.split(",");
                }

                if (educations !== undefined && educations !== "") {
                    updateObj.educations = educations.split(",");
                }

                if (certificates !== undefined && certificates !== "") {
                    updateObj.certificates = certificates.split(",");
                }

                updateObj.job_types = job_types;
                updateObj.bio = (bio) ? bio : "";
                updateObj.is_online = is_online;

            }

            if (currency != undefined && currency != null && currency != logindata.currency) {
                updateObj.credits = FUNC.round_currency(currency, logindata.credits * currency_rates[logindata.currency][currency]);
                updateObj.earned_credits = FUNC.round_currency(currency, logindata.earned_credits * currency_rates[logindata.currency][currency]);
                updateObj.lifetime_earned_credits = FUNC.round_currency(currency, logindata.lifetime_earned_credits * currency_rates[logindata.currency][currency]);
            }

            async.eachSeries(other_expertise_list, function(expertise_text, callback) {

                var new_expertise = {
                    name: "",
                    name_jap: "",
                    name_zh: "",
                    name_ko: "",
                    name_fr: "",
                    name_pt: "",
                    name_vi: "",
                    name_es: "",
                    user_id: logindata._id,
                    is_deleted: false,
                    status: false
                };

                switch (req.user_language) {
                    case "jap":
                        Expertise.findOne({
                            name_jap: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_jap"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "zh":
                        Expertise.findOne({
                            name_zh: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_zh"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "ko":
                        Expertise.findOne({
                            name_ko: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_ko"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "fr":
                        Expertise.findOne({
                            name_fr: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_fr"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "pt":
                        Expertise.findOne({
                            name_pt: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_pt"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "es":
                        Expertise.findOne({
                            name_es: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_es"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "vi":
                        Expertise.findOne({
                            name_vi: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_vi"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    default:
                        Expertise.findOne({
                            name: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                }
            }, function(err) {
                if (err) return next(err);

                if (is_interpreter) {
                    expertise_list = unique(expertise_list);
                    expertise_list_arr = expertise_list.map(function(expertise_id) {
                        return ObjectId(expertise_id);
                    });

                    updateObj.expertise_list = expertise_list_arr;
                }

                FUNC.UploadImage(files.profile_pic, "image", function(err, image_name) {
                    if (err) return next(err);

                    updateObj.photo = (image_name) ? image_name : old_image;

                    FUNC.UploadImage(files.profile_video, "video", function(err, video_name) {
                        if (err) return next(err);

                        console.log("video_name", video_name)
                        updateObj.video = video_name && video_name.media_name ? video_name.media_name : old_video;
                        updateObj.video_thumb = video_name && video_name.video_thumb ? video_name.video_thumb : old_video_thumb;


                        User.findOneAndUpdate({
                            _id: logindata._id
                        }, {
                            $set: updateObj
                        }, {
                            new: true
                        })
                            .populate("native_languages")
                            .populate("speaking_languages")
                            .populate("expertise_list")
                            .populate("rates.languages")
                            .populate("city_id")
                            .populate("country_id")
                            .exec(function(err, user) {
                                if (err) return next(err);

                                FUNC.update_active_campaign(user.toObject(), function(err) {
                                    if (err) return next(err);

                                    user_details = user.toObject();
                                    var rates_new = user.rates.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                currency: obj.currency,
                                                fee: obj.fee,
                                                usd_fee: obj.usd_fee,
                                                languages: [{
                                                    _id: obj.languages[0]._id,
                                                    name: obj.languages[0]["name_" + req.user_language]
                                                }, {
                                                    _id: obj.languages[1]._id,
                                                    name: obj.languages[1]["name_" + req.user_language]
                                                }]
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                currency: obj.currency,
                                                fee: obj.fee,
                                                usd_fee: obj.usd_fee,
                                                languages: [{
                                                    _id: obj.languages[0]._id,
                                                    name: obj.languages[0]["name"]
                                                }, {
                                                    _id: obj.languages[1]._id,
                                                    name: obj.languages[1]["name"]
                                                }]
                                            }
                                        }
                                    });

                                    var native_new = user.native_languages.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                name: obj["name_" + req.user_language]
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                name: obj["name"]
                                            }
                                        }
                                    });

                                    var speaking_new = user.speaking_languages.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                name: obj["name_" + req.user_language]
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                name: obj["name"]
                                            }
                                        }
                                    });

                                    var expertise_new = user.expertise_list.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                name: obj["name_" + req.user_language],
                                                heading_id: obj.heading_id
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                name: obj["name"],
                                                heading_id: obj.heading_id
                                            }
                                        }
                                    });


                                    if (user_details.country_id != undefined) {
                                        if (req.user_language != "eng") {
                                            user_details.country_id = {
                                                _id: user_details.country_id._id,
                                                name: user_details.country_id["name_" + req.user_language]
                                            }
                                        } else {
                                            user_details.country_id = {
                                                _id: user_details.country_id._id,
                                                name: user_details.country_id["name"]
                                            }
                                        }
                                    }


                                    if (user_details.city_id != undefined) {
                                        if (req.user_language != "eng") {
                                            user_details.city_id = {
                                                _id: user_details.city_id._id,
                                                name: user_details.city_id["name_" + req.user_language]
                                            }
                                        } else {
                                            user_details.city_id = {
                                                _id: user_details.city_id._id,
                                                name: user_details.city_id["name"]
                                            }
                                        }
                                    }

                                    user_details.expertise_list = expertise_new;
                                    user_details.native_languages = native_new;
                                    user_details.speaking_languages = speaking_new;
                                    user_details.rates = rates_new;
                                    user_details.min_rate = FUNC.round_currency(currency, parseFloat(0.5) * currency_rates["USD"][currency]);

                                    return res.status(200).json({
                                        data: user_details,
                                        reply: _d("profile_completed_successfully", "Profile completed successfully"),
                                        meta: req.phoneMeta
                                    });
                                });
                            });
                    })
                });
            });
        }
    });
}*/

exports.EditProfile = function(req, res, next) {

    var logindata = req.user_data;
    var updateObj = {};
    var expertise_list_arr = [];
    var saveFreeCredits = false;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var chkInterpreter = (fields.is_interpreter == 'true' || fields.is_interpreter == '1');
        var validation = chkInterpreter ? new Validator(fields, vrules.edit_profile) : new Validator(fields, vrules.edit_profile_client);
        if (validation.fails()) {
            //Validating fails
            var errorObj = validation.errors.all();
            return res.status(203).send({
                data: {},
                reply: errorObj[Object.keys(errorObj)[0]][0],
                meta: req.phoneMeta
            });
        } else {

            var full_name = fields.full_name;
            var currency = fields.currency;
            var gender = fields.gender;
            var native_languages = fields.native_languages;
            var speaking_languages = fields.speaking_languages;
            var is_interpreter = (fields.is_interpreter == 'true' || fields.is_interpreter == '1');

            var city_id = fields.city_id;
            var country_id = fields.country_id;
            var prefecture_id = fields.prefecture_id;

            var old_image = (logindata.photo != undefined && logindata.photo != "") ? logindata.photo : "";
            var old_video = (logindata.video != undefined && logindata.video != "") ? logindata.video : "";
            var old_video_thumb = (logindata.video_thumb != undefined && logindata.video_thumb != "") ? logindata.video_thumb : "";


            var rates = (logindata.rates == undefined) ? [] : logindata.rates;
            var booking_rates = (logindata.booking_rates == undefined) ? [] : logindata.booking_rates;

            var native_languages_old = [];
            var speaking_languages_old = [];
            var all_language_old = [];

            native_languages_old = logindata.native_languages.map(function(language_id) {
                return language_id.toString();
            });

            speaking_languages_old = logindata.speaking_languages.map(function(language_id) {
                return language_id.toString();
            });

            all_language_old = native_languages_old.concat(speaking_languages_old);


            if (native_languages) {
                native_languages = native_languages.split(",");
                var native_languages_arr = native_languages.map(function(language_id) {
                    return ObjectId(language_id);
                });
            } else {
                native_languages = [];
                var native_languages_arr = [];
            }

            if (speaking_languages) {
                speaking_languages = speaking_languages.split(",");
                var speaking_languages_arr = speaking_languages.map(function(language_id) {
                    return ObjectId(language_id);
                });
            } else {
                speaking_languages = [];
                var speaking_languages_arr = [];
            }

            var all_language = native_languages.concat(speaking_languages.filter(function(item) {
                return native_languages.indexOf(item) === -1;
            }));

            var remove_languages = all_language_old.filter(function(x) {
                return all_language.indexOf(x) < 0
            })
            var add_languages = all_language.filter(function(x) {
                return all_language_old.indexOf(x) < 0
            })



            updateObj.full_name = full_name;
            updateObj.gender = gender;
            updateObj.native_languages = native_languages_arr;
            updateObj.is_interpreter = is_interpreter;
            updateObj.city_id = city_id;
            updateObj.country_id = country_id;
            if(prefecture_id && prefecture_id != "" && updateObj.country_id.toString() == "59ca2eb54c5b0874203b7676"){
                updateObj.prefecture_id = prefecture_id;
            }
            updateObj.profile_status = "complete";

            if (currency != undefined && currency != null) {
                updateObj.currency = currency;
                console.log("currency==>", currency)

                // add free credits if user is_promoter_referal
                // and free credits not give to user
                if(logindata.is_promoter_referal && !logindata.is_free_credits_added){
                    if(currency == "USD"){
                        updateObj.credits = 10;
                    }else{
                        updateObj.credits = FUNC.round_currency(currency, 10 * currency_rates["USD"][currency]);
                    }
                    console.log("updateObj.credits", updateObj.credits);
                    logindata.credits = updateObj.credits;
                    logindata.currency = updateObj.currency;
                    updateObj.is_free_credits_added = true;
                    saveFreeCredits = true
                }
            }

            if (is_interpreter) {

                updateObj.speaking_languages = speaking_languages_arr;

                for (var i = 0; i < all_language.length; i++) {
                    for (var j = i + 1; j < all_language.length; j++) {
                        if (add_languages.indexOf(all_language[i]) !== -1 || add_languages.indexOf(all_language[j]) !== -1) {
                            rates.push({
                                languages: [ObjectId(all_language[i]), ObjectId(all_language[j])],
                                fee: 0,
                                usd_fee: 0,
                                currency: currency
                            });

                            booking_rates.push({
                                languages: [ObjectId(all_language[i]), ObjectId(all_language[j])],
                                fee: 0,
                                usd_fee: 0,
                                currency: currency
                            });
                        }
                    }
                }

                var updated_rates = rates.filter(function(rateObj) {
                    if (remove_languages.indexOf(rateObj.languages[0].toString()) == -1 && remove_languages.indexOf(rateObj.languages[1].toString()) == -1) {

                        if (currency != undefined && currency != null && currency != logindata.currency) {
                            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
                            rateObj.currency = currency;
                        }
                        return rateObj
                    }
                });

                var updated_booking_rates = booking_rates.filter(function(rateObj) {
                    if (remove_languages.indexOf(rateObj.languages[0].toString()) == -1 && remove_languages.indexOf(rateObj.languages[1].toString()) == -1) {

                        if (currency != undefined && currency != null && currency != logindata.currency) {
                            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
                            rateObj.currency = currency;
                        }
                        return rateObj
                    }
                });

                updateObj.rates = updated_rates;
                updateObj.booking_rates = updated_booking_rates;

                var expertise_list = fields.expertise_list;
                var other_expertise = fields.other_expertise;

                var other_expertise_list = [];
                if (other_expertise) {
                    other_expertise_list = other_expertise.split(",");
                }

                if (expertise_list) {
                    expertise_list = expertise_list.split(",");
                }


                var associations = fields.associations;
                var educations = fields.educations;
                var certificates = fields.certificates;
                var job_types = fields.job_types.split(",");
                var bio = fields.bio;
                var is_online = (fields.is_online == 'true' || fields.is_online == '1');


                if (is_online != logindata.is_online) {
                    io.emit('interpreter_status_update', {
                        "user_id": logindata._id.toString(),
                        "is_interpreter_online": is_online
                    });
                }

                if (associations !== undefined && associations !== "") {
                    updateObj.associations = associations.split(",");
                }

                if (educations !== undefined && educations !== "") {
                    updateObj.educations = educations.split(",");
                }

                if (certificates !== undefined && certificates !== "") {
                    updateObj.certificates = certificates.split(",");
                }

                updateObj.job_types = job_types;
                updateObj.bio = (bio) ? bio : "";
                updateObj.is_online = is_online;

            }

            if (currency != undefined && currency != null && currency != logindata.currency) {
                updateObj.credits = FUNC.round_currency(currency, logindata.credits * currency_rates[logindata.currency][currency]);
                updateObj.earned_credits = FUNC.round_currency(currency, logindata.earned_credits * currency_rates[logindata.currency][currency]);
                updateObj.lifetime_earned_credits = FUNC.round_currency(currency, logindata.lifetime_earned_credits * currency_rates[logindata.currency][currency]);
            }

            async.eachSeries(other_expertise_list, function(expertise_text, callback) {

                var new_expertise = {
                    name: "",
                    name_jap: "",
                    name_zh: "",
                    name_ko: "",
                    name_fr: "",
                    name_pt: "",
                    name_vi: "",
                    name_es: "",
                    user_id: logindata._id,
                    is_deleted: false,
                    status: false
                };

                switch (req.user_language) {
                    case "jap":
                        Expertise.findOne({
                            name_jap: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_jap"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "zh":
                        Expertise.findOne({
                            name_zh: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_zh"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "ko":
                        Expertise.findOne({
                            name_ko: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_ko"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "fr":
                        Expertise.findOne({
                            name_fr: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_fr"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "pt":
                        Expertise.findOne({
                            name_pt: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_pt"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "es":
                        Expertise.findOne({
                            name_es: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_es"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    case "vi":
                        Expertise.findOne({
                            name_vi: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name_vi"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                        break;
                    default:
                        Expertise.findOne({
                            name: expertise_text
                        }, function(expertise_details) {
                            if (expertise_details) {
                                if (expertise_details.status == true) {
                                    expertise_list.push(expertise_details._id.toString());
                                } else {
                                    Expertise.update({
                                        _id: expertise_details._id
                                    }, {
                                        $addToSet: {
                                            user_id: logindata._id
                                        }
                                    }, function(err, results) {
                                        callback();
                                    });
                                }
                            } else {
                                new_expertise["name"] = expertise_text;

                                var NewExpertise = new Expertise(new_expertise);
                                NewExpertise.save(function(err, new_expertise_data) {
                                    callback();
                                });
                            }
                        });
                }
            }, function(err) {
                if (err) return next(err);

                if (is_interpreter && expertise_list && Array.isArray(expertise_list)) {
                    expertise_list = unique(expertise_list);
                    expertise_list_arr = expertise_list.map(function(expertise_id) {
                        return ObjectId(expertise_id);
                    });

                    updateObj.expertise_list = expertise_list_arr;
                }

                FUNC.UploadImage(files.profile_pic, "image", function(err, image_name) {
                    if (err) return next(err);

                    updateObj.photo = (image_name) ? image_name : old_image;

                    FUNC.UploadImage(files.profile_video, "video", function(err, video_name) {
                        if (err) return next(err);

                        console.log("video_name", video_name)
                        updateObj.video = video_name && video_name.media_name ? video_name.media_name : old_video;
                        updateObj.video_thumb = video_name && video_name.video_thumb ? video_name.video_thumb : old_video_thumb;

                        var obj = {
                            $set:updateObj
                        };
                        if(updateObj.country_id.toString() != "59ca2eb54c5b0874203b7676") {
                            obj["$unset"] = {
                                prefecture_id:1
                            }
                        }

                        //console.log("obj==>", obj);
                        User.findOneAndUpdate({
                            _id: logindata._id
                        }, obj, {
                            new: true
                        })
                            .populate("native_languages")
                            .populate("speaking_languages")
                            .populate("expertise_list")
                            .populate("rates.languages")
                            .populate("city_id")
                            .populate("country_id")
                            .populate("prefecture_id")
                            .exec(function(err, user) {
                                if (err) return next(err);

                                FUNC.update_active_campaign(user.toObject(), function(err) {
                                    if (err) return next(err);

                                    user_details = user.toObject();
                                    if(user.rates && user.rates.length){
                                        var rates_new = user.rates.map(function(obj) {

                                            if (req.user_language != "eng") {

                                                return {
                                                    _id: obj._id,
                                                    currency: logindata.currency,
                                                    fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                    languages: [{
                                                        _id: obj.languages[0]._id,
                                                        name: obj.languages[0]["name_" + req.user_language]
                                                    }, {
                                                        _id: obj.languages[1]._id,
                                                        name: obj.languages[1]["name_" + req.user_language]
                                                    }]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    currency: logindata.currency,
                                                    fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                    languages: [{
                                                        _id: obj.languages[0]._id,
                                                        name: obj.languages[0]["name"]
                                                    }, {
                                                        _id: obj.languages[1]._id,
                                                        name: obj.languages[1]["name"]
                                                    }]
                                                }
                                            }
                                        });
                                    }

                                    if(user.native_languages && user.native_languages.length){
                                        var native_new = user.native_languages.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });
                                    }

                                    if(user.speaking_languages && user.speaking_languages.length){
                                        var speaking_new = user.speaking_languages.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });
                                    }



                                    if(user.expertise_list && user.expertise_list.length){
                                        var expertise_new = user.expertise_list.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language],
                                                    heading_id: obj.heading_id
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"],
                                                    heading_id: obj.heading_id
                                                }
                                            }
                                        });
                                    }

                                    if (user_details.country_id != undefined) {
                                        if (req.user_language != "eng") {
                                            user_details.country_id = {
                                                _id: user_details.country_id._id,
                                                name: user_details.country_id["name_" + req.user_language]
                                            }
                                        } else {
                                            user_details.country_id = {
                                                _id: user_details.country_id._id,
                                                name: user_details.country_id["name"]
                                            }
                                        }
                                    }


                                    if (user_details.city_id != undefined) {
                                        if (req.user_language != "eng") {
                                            user_details.city_id = {
                                                _id: user_details.city_id._id,
                                                name: user_details.city_id["name_" + req.user_language]
                                            }
                                        } else {
                                            user_details.city_id = {
                                                _id: user_details.city_id._id,
                                                name: user_details.city_id["name"]
                                            }
                                        }
                                    }

                                    if (user_details.prefecture_id != undefined) {
                                        if (req.user_language != "eng") {
                                            user_details.prefecture_id = {
                                                _id: user_details.prefecture_id._id,
                                                name: user_details.prefecture_id["name_jap"]
                                            }
                                        } else {
                                            user_details.prefecture_id = {
                                                _id: user_details.prefecture_id._id,
                                                name: user_details.prefecture_id["name"]
                                            }
                                        }
                                    }

                                    user_details.expertise_list = expertise_new;
                                    user_details.native_languages = native_new;
                                    user_details.speaking_languages = speaking_new;
                                    user_details.rates = rates_new;
                                    user_details.min_rate = FUNC.round_currency(currency, parseFloat(0.5) * currency_rates["USD"][currency]);

                                    if(saveFreeCredits){
                                        var new_transaction_data = {
                                            user_id: logindata._id,
                                            gateway: "promotional-coupon",
                                            type: "credit",
                                            amount: user_details.credits,
                                            currency: user_details.currency,
                                            payment_id: "",
                                            status: "approved"
                                        }

                                        var NewTransaction = new Transaction(new_transaction_data);

                                        NewTransaction.save(function(err, transaction_data) {
                                            return res.status(200).json({
                                                data: user_details,
                                                reply: _d("ten_usd_gifted", "Congratulations, you have been gifted [amount][currency]").replace("[currency]", user_details.currency).replace("[amount]", user_details.credits),
                                                meta: req.phoneMeta
                                            });
                                        });
                                    }else{
                                        return res.status(200).json({
                                            data: user_details,
                                            reply: _d("profile_completed_successfully", "Profile completed successfully"),
                                            meta: req.phoneMeta
                                        });
                                    }
                                });
                            });
                    })
                });
            });
        }
    });
}



exports.EditCurrency = function(req, res, next) {

    var logindata = req.user_data;

    var reqdata = req.body;
    var currency = req.body.currency;

    var rates = (logindata.rates == undefined) ? [] : logindata.rates;
    var booking_rates = (logindata.booking_rates == undefined) ? [] : logindata.booking_rates;

    if (logindata.currency != currency) {
        var updateObj = {};
        updateObj.currency = currency;

        updateObj.credits = FUNC.round_currency(currency, logindata.credits * currency_rates[logindata.currency][currency]);
        updateObj.earned_credits = FUNC.round_currency(currency, logindata.earned_credits * currency_rates[logindata.currency][currency]);
        updateObj.lifetime_earned_credits = FUNC.round_currency(currency, logindata.lifetime_earned_credits * currency_rates[logindata.currency][currency]);

        var updated_rates = rates.filter(function(rateObj) {
            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
            rateObj.currency = currency;
            return rateObj
        });

        var updated_booking_rates = booking_rates.filter(function(rateObj) {
            rateObj.fee = FUNC.round_currency(currency, rateObj.fee * currency_rates[rateObj.currency][currency]);
            rateObj.currency = currency;
            return rateObj
        });

        updateObj.rates = updated_rates;
        updateObj.booking_rates = updated_booking_rates;

        User.findOneAndUpdate({
            _id: logindata._id
        }, {
            $set: updateObj
        }, {
            new: true
        })
            .populate("native_languages")
            .populate("speaking_languages")
            .populate("expertise_list")
            .populate("rates.languages")
            .populate("city_id")
            .populate("country_id")
            .populate("prefecture_id")
            .exec(function(err, user) {
                if (err) return next(err);

                user_details = user.toObject();

                var rates_new = user.rates.map(function(obj) {
                    if (req.user_language != "eng") {
                        return {
                            _id: obj._id,
                            currency: obj.currency,
                            fee: obj.fee,
                            usd_fee: obj.usd_fee,
                            languages: [{
                                _id: obj.languages[0]._id,
                                name: obj.languages[0]["name_" + req.user_language]
                            }, {
                                _id: obj.languages[1]._id,
                                name: obj.languages[1]["name_" + req.user_language]
                            }]
                        }
                    } else {
                        return {
                            _id: obj._id,
                            currency: obj.currency,
                            fee: obj.fee,
                            usd_fee: obj.usd_fee,
                            languages: [{
                                _id: obj.languages[0]._id,
                                name: obj.languages[0]["name"]
                            }, {
                                _id: obj.languages[1]._id,
                                name: obj.languages[1]["name"]
                            }]
                        }
                    }
                });

                var native_new = user.native_languages.map(function(obj) {
                    if (req.user_language != "eng") {
                        return {
                            _id: obj._id,
                            name: obj["name_" + req.user_language]
                        }
                    } else {
                        return {
                            _id: obj._id,
                            name: obj["name"]
                        }
                    }
                });

                var speaking_new = user.speaking_languages.map(function(obj) {
                    if (req.user_language != "eng") {
                        return {
                            _id: obj._id,
                            name: obj["name_" + req.user_language]
                        }
                    } else {
                        return {
                            _id: obj._id,
                            name: obj["name"]
                        }
                    }
                });

                var expertise_new = user.expertise_list.map(function(obj) {
                    if (req.user_language != "eng") {
                        return {
                            _id: obj._id,
                            name: obj["name_" + req.user_language],
                            heading_id: obj.heading_id
                        }
                    } else {
                        return {
                            _id: obj._id,
                            name: obj["name"],
                            heading_id: obj.heading_id
                        }
                    }
                });


                if (user_details.country_id != undefined) {
                    if (req.user_language != "eng") {
                        user_details.country_id = {
                            _id: user_details.country_id._id,
                            name: user_details.country_id["name_" + req.user_language]
                        }
                    } else {
                        user_details.country_id = {
                            _id: user_details.country_id._id,
                            name: user_details.country_id["name"]
                        }
                    }
                }


                if (user_details.city_id != undefined) {
                    if (req.user_language != "eng") {
                        user_details.city_id = {
                            _id: user_details.city_id._id,
                            name: user_details.city_id["name_" + req.user_language]
                        }
                    } else {
                        user_details.city_id = {
                            _id: user_details.city_id._id,
                            name: user_details.city_id["name"]
                        }
                    }
                }

                if (user_details.prefecture_id != undefined) {
                    if (req.user_language != "eng") {
                        user_details.prefecture_id = {
                            _id: user_details.prefecture_id._id,
                            name: user_details.prefecture_id["name_jap"]
                        }
                    } else {
                        user_details.prefecture_id = {
                            _id: user_details.prefecture_id._id,
                            name: user_details.prefecture_id["name"]
                        }
                    }
                }

                user_details.expertise_list = expertise_new;
                user_details.native_languages = native_new;
                user_details.speaking_languages = speaking_new;
                user_details.rates = rates_new;

                return res.status(200).json({
                    data: user_details,
                    reply: _d("currency_updates", "Currency updated successfully"),
                    meta: req.phoneMeta
                });

            });

    } else {
        return res.status(200).json({
            data: {},
            reply: _d("currency_updates", "Currency updated successfully"),
            meta: req.phoneMeta
        });
    }
}


exports.EditRates = function(req, res, next) {

    var logindata = req.user_data;
    var updateObj = {};
    var reqdata = req.body;
    var old_rates = {};


    logindata.rates.map(function(rate) {
        old_rates[rate._id.toString()] = rate.fee;
    });


    var update_rates = reqdata.rates.map(function(rate) {
        rate._id = ObjectId(rate._id);

        var lang1 = ObjectId(rate.languages[0]._id);
        var lang2 = ObjectId(rate.languages[1]._id);
        rate.languages = [lang1, lang2];

        if (rate.fee > 0) {
            rate.usd_fee = parseFloat((rate.fee * currency_rates[rate.currency]["USD"]).toFixed(2));
        } else {
            rate.usd_fee = 0;
        }

        rate.fee = FUNC.round_currency(rate.currency, rate.fee);
        return rate;
    });


    User.findOneAndUpdate({
        _id: logindata._id
    }, {
        $set: {
            rates: update_rates
        }
    }, {
        new: true
    })
        .select("rates")
        .populate("rates.languages")
        .exec(function(err, user) {
            if (err) return next(err);

            user_details = user.toObject();

            var rates_new = user.rates.map(function(obj) {
                if (req.user_language != "eng") {
                    return {
                        _id: obj._id,
                        currency: obj.currency,
                        fee: obj.fee,
                        usd_fee: obj.usd_fee,
                        languages: [{
                            _id: obj.languages[0]._id,
                            name: obj.languages[0]["name_" + req.user_language]
                        }, {
                            _id: obj.languages[1]._id,
                            name: obj.languages[1]["name_" + req.user_language]
                        }]
                    }
                } else {
                    return {
                        _id: obj._id,
                        currency: obj.currency,
                        fee: obj.fee,
                        usd_fee: obj.usd_fee,
                        languages: [{
                            _id: obj.languages[0]._id,
                            name: obj.languages[0]["name"]
                        }, {
                            _id: obj.languages[1]._id,
                            name: obj.languages[1]["name"]
                        }]
                    }
                }
            });

            user_details.rates = rates_new;

            return res.status(200).json({
                data: user_details,
                reply: _d("rates_updated", "Rates updated successfully"),
                meta: req.phoneMeta
            });
        });
}



exports.ResetPassword = function(req, res, next) {

    req.app.locals.layout = 'login_layout';
    var activation_token = req.params.activation_token;

    if (activation_token == undefined || activation_token == '') {
        return res.render('page/not_found.ejs', {
            title: 'Page Not Found',
            activation_text: _d("not_found", "The Page you are looking for not found.")
        });
    } else {
        var activation_text = FUNC.crypto(activation_token, 'decrypt').toString();
        var reset_token = activation_text.split("_")[0];
        var record_id = activation_text.split("_")[1];

        User.findOne({
            _id: ObjectId(record_id),
            reset_token: reset_token
        }, function(err, record_details) {
            if (err) {
                return res.render('page/not_found.ejs', {
                    title: 'Page Not Found',
                    activation_text: _d("not_found", "The Page you are looking for not found.")
                });
            } else {
                if (record_details) {

                    if (req.method == 'GET') {
                        return res.render('users/reset_password', {
                            title: 'Reset Password'
                        });
                    } else if (req.method == 'POST') {

                        var new_password = req.body.new_password;
                        var confirm_password = req.body.confirm_password;

                        if (new_password !== confirm_password) {
                            req.flash('error', 'Password and confirm password must be same.');
                            return res.redirect(urljoin(app_url, 'users', 'reset_password', activation_token));
                        } else {
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(new_password, salt, function(err, hash) {
                                    User.update({
                                        _id: record_id
                                    }, {
                                        $set: {
                                            'password': hash,
                                            "reset_token": ""
                                        }
                                    }, function(err, result) {
                                        return res.redirect(urljoin(app_url, 'users', 'password_reset'));
                                    });
                                });
                            });
                        }
                    }
                } else {
                    return res.render('page/not_found.ejs', {
                        title: 'Page Not Found',
                        activation_text: _d("not_found", "The Page you are looking for not found.")
                    });
                }
            }
        });
    }
}



exports.PasswordReset = function(req, res, next) {

    return res.render('users/password_reset.ejs', {
        title: 'Password Reset',
        activation_text: "Password reset successfully, Please login into mobile application with new password."
    });
}



exports.Listing = function(req, res, next) {


    var logindata = req.user_data;
    var reqdata = req.body;
    var favObj = {};

    var lang_from = reqdata.lang_from;
    var lang_to = reqdata.lang_to;

    var expertise_list = reqdata.expertise_list;

    var associations = reqdata.associations;
    var educations = reqdata.educations;
    var certificates = reqdata.certificates;
    var search_keyword = reqdata.search_keyword;

    var country_id = reqdata.country_id;
    var city_id = reqdata.city_id;
    var is_online = reqdata.is_online;
    var is_professional = reqdata.is_professional;


    var sort_cond = req.query.sort;

    var expertise_list_arr = [];

    var displayed_record = 0;

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);

    var query = {
        is_interpreter: true,
        is_active: true,
        is_selfdelete: {
            $ne: true
        },
        job_types: "on_call",
        "rates.fee": {
            $gt: 0
        }
    };

    var sort_query = {
        is_online: -1,
        is_login: -1,
        avg_rating: -1,
        call_received: -1
    };

    var select_fields = {
        full_name: 1,
        gender: 1,
        photo: 1,
        video:1,
        video_thumb:1,
        rated: 1,
        city_id: 1,
        country_id: 1,
        avg_rating: 1,
        total_rating: 1,
        expertise_list: 1,
        loc: 1,
        is_online: 1,
        is_login: 1,
        is_professional: 1
    };


    if (is_online == true) {
        query.is_online = true;
        query.is_login = true;
    }


    if (is_professional == true) {
        query.is_professional = "verified";
    }


    if (search_keyword != undefined && search_keyword != "") {
        query.full_name = {
            "$regex": RegExp(search_keyword, 'i')
        };
    }

    if (search_keyword != undefined && search_keyword != "") {
        query.full_name = {
            "$regex": RegExp(search_keyword, 'i')
        };
    }

    if (country_id != undefined) {
        query.country_id = ObjectId(country_id);
    }

    if (city_id != undefined) {
        query.city_id = ObjectId(city_id);
    }

    if (expertise_list != undefined && expertise_list != "") {
        expertise_list_arr = expertise_list.split(",").map(function(expertise_id) {
            return ObjectId(expertise_id);
        });
        query.expertise_list = {
            $in: expertise_list_arr
        };
    }


    if (associations != undefined && associations != "") {
        associations_arr = associations.split(",");
        query.associations = {
            $in: associations_arr
        };
    }

    if (educations != undefined && educations != "") {
        educations_arr = educations.split(",");
        query.educations = {
            $in: educations_arr
        };
    }

    if (certificates != undefined && certificates != "") {
        certificates_arr = certificates.split(",");
        query.certificates = {
            $in: certificates_arr
        };
    }

    var language_cond = [];

    if (lang_to != undefined) {
        language_cond.push({
            languages: ObjectId(lang_to)
        });
    }

    if (lang_from != undefined) {
        language_cond.push({
            languages: ObjectId(lang_from)
        });
    }

    if (lang_to != undefined || lang_from != undefined) {
        query.rates = {
            $elemMatch: {
                $and: language_cond,
                fee: {
                    $gt: 0
                }
            }
        };

        if (lang_to != undefined && lang_from != undefined) {
            select_fields.rates = {
                $elemMatch: {
                    $and: language_cond,
                    fee: {
                        $gt: 0
                    }
                }
            };
        } else {
            select_fields.rates = 1;
        }
    } else {
        select_fields.rates = 1;
    }



    async.series({
        user_listing: function(callback) {
            if (lang_to != undefined && lang_from != undefined && (sort_cond == "price_desc" || sort_cond == "price_asc")) {

                var price_sort = (sort_cond == "price_asc") ? 1 : -1;
                select_fields.rates = 1;


                User.aggregate([{
                    "$match": query
                }, {
                    $unwind: "$rates"
                }, {
                    "$match": {
                        $and: [{
                            "rates.languages": ObjectId(lang_to)
                        }, {
                            "rates.languages": ObjectId(lang_from)
                        }],
                        "rates.fee": {
                            $gt: 0
                        }
                    }
                }, {
                    $sort: {
                        "rates.usd_fee": price_sort
                    }
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                }, {
                    $project: select_fields
                }

                ], function(err, users_obj) {

                    User.populate(users_obj, {
                        path: 'expertise_list',
                        model: 'Expertise'
                    }, function(err, users_list) {
                        if (err) return next(err);

                        User.populate(users_list, {
                            path: 'rates.languages',
                            model: 'Language'
                        }, function(err, users_list_new) {
                            if (err) return next(err);

                            User.populate(users_list_new, {
                                path: 'country_id',
                                model: 'Country'
                            }, function(err, users_list_country) {
                                if (err) return next(err);

                                User.populate(users_list_country, {
                                    path: 'city_id',
                                    model: 'City'
                                }, function(err, users) {
                                    if (err) return next(err);

                                    if (users.length > 0) {

                                        var usersArr = [];
                                        displayed_record = users.length;

                                        async.eachSeries(users, function(user, callback) {

                                            var user_details = user;

                                            user_details.profile_photo = (user_details.photo != undefined && user_details.photo != "") ? urljoin(process.env.MEDIA_DISPLAY_PATH, user_details.photo) : "";
                                            user_details.profile_video = (user_details.video != undefined && user_details.video != "") ? urljoin(process.env.MEDIA_DISPLAY_PATH, user_details.video) : "";
                                            user_details.profile_video_thumb = (user_details.video_thumb != undefined && user_details.video_thumb != "") ? urljoin(process.env.MEDIA_DISPLAY_PATH, user_details.video_thumb) : "";
                                            user_details.rates = [user_details.rates];

                                            var rates_new = user.rates.map(function(obj) {
                                                if (req.user_language != "eng") {

                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        usd_fee: obj.usd_fee,
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name_" + req.user_language]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name_" + req.user_language]
                                                        }]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        usd_fee: obj.usd_fee,
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name"]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name"]
                                                        }]
                                                    }
                                                }
                                            });


                                            var expertise_new = user.expertise_list.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language],
                                                        heading_id: obj.heading_id
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"],
                                                        heading_id: obj.heading_id
                                                    }
                                                }
                                            });


                                            if (user_details.country_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name"]
                                                    }
                                                }
                                            }


                                            if (user_details.city_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name"]
                                                    }
                                                }
                                            }

                                            user_details.expertise_list = expertise_new;
                                            user_details.rates = rates_new;


                                            usersArr.push(user_details);
                                            callback();

                                        }, function(err) {
                                            callback(null, usersArr);
                                        });
                                    } else {
                                        callback(null, []);
                                    }
                                });
                            });
                        });
                    });
                });
            } else {


                var listing_query = User.find(query);

                listing_query
                    .select(select_fields)
                    .sort(sort_query)
                    .skip(skip)
                    .limit(limit)
                    .populate("rates.languages")
                    .populate("expertise_list")
                    .populate("city_id")
                    .populate("country_id")
                    .exec('find', function(err, users) {
                        if (err) return next(err);

                        if (users.length > 0) {

                            var usersArr = [];
                            displayed_record = users.length;

                            async.eachSeries(users, function(user, callback) {

                                var user_details = {};
                                user_details = user.toObject();

                                var rates_new = user.rates.map(function(obj) {

                                    if (req.user_language != "eng") {
                                        return {
                                            _id: obj._id,
                                            currency: logindata.currency,
                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                            languages: [{
                                                _id: obj.languages[0]._id,
                                                name: obj.languages[0]["name_" + req.user_language]
                                            }, {
                                                _id: obj.languages[1]._id,
                                                name: obj.languages[1]["name_" + req.user_language]
                                            }]
                                        }
                                    } else {
                                        return {
                                            _id: obj._id,
                                            currency: logindata.currency,
                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                            languages: [{
                                                _id: obj.languages[0]._id,
                                                name: obj.languages[0]["name"]
                                            }, {
                                                _id: obj.languages[1]._id,
                                                name: obj.languages[1]["name"]
                                            }]
                                        }
                                    }
                                });


                                var expertise_new = user.expertise_list.map(function(obj) {
                                    if (req.user_language != "eng") {
                                        return {
                                            _id: obj._id,
                                            name: obj["name_" + req.user_language],
                                            heading_id: obj.heading_id
                                        }
                                    } else {
                                        return {
                                            _id: obj._id,
                                            name: obj["name"],
                                            heading_id: obj.heading_id
                                        }
                                    }
                                });

                                if (user_details.country_id != undefined) {
                                    if (req.user_language != "eng") {
                                        user_details.country_id = {
                                            _id: user_details.country_id._id,
                                            name: user_details.country_id["name_" + req.user_language]
                                        }
                                    } else {
                                        user_details.country_id = {
                                            _id: user_details.country_id._id,
                                            name: user_details.country_id["name"]
                                        }
                                    }
                                }

                                if (user_details.city_id != undefined) {
                                    if (req.user_language != "eng") {
                                        user_details.city_id = {
                                            _id: user_details.city_id._id,
                                            name: user_details.city_id["name_" + req.user_language]
                                        }
                                    } else {
                                        user_details.city_id = {
                                            _id: user_details.city_id._id,
                                            name: user_details.city_id["name"]
                                        }
                                    }
                                }

                                user_details.expertise_list = expertise_new;
                                user_details.rates = rates_new;


                                usersArr.push(user_details);
                                callback();

                            }, function(err) {
                                callback(null, usersArr);
                            });
                        } else {
                            callback(null, [])
                        }
                    });
            }
        }
    }, function(err, results) {
        return res.status(200).json({
            data: results.user_listing,
            max_limit: limit,
            current_page: page,
            displayed_record: displayed_record,
            reply: "",
            miss_count: logindata.miss_count,
            meta: req.phoneMeta
        });
    });
}



exports.Detail = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;
    var favObj = {};

    var user_id = reqdata.user_id;

    User.findOne({
        _id: ObjectId(user_id),
        is_active: 1
    })
        .populate("native_languages")
        .populate("speaking_languages")
        .populate("expertise_list")
        .populate("rates.languages")
        .populate("city_id")
        .populate("country_id")
        .populate("prefecture_id")
        .exec(function(err, user) {

            if (err) return next(err);

            if (!user) {
                return res.status(203).json({
                    data: {},
                    reply: "user not found",
                    meta: req.phoneMeta
                });
            } else {
                user_details = user.toObject();
                try {
                    delete user_details.userActivity;
                }
                catch(err) {
                    console.log(err);
                }
                user_details.is_fav = (logindata.fav_users.indexOf(ObjectId(user_id)) == -1) ? false : true;

                Review.find({
                    rated_user: ObjectId(user_id),
                    comment: {
                        $ne: ""
                    }
                })
                    .select({
                        user_id: 1,
                        rating: 1,
                        comment: 1
                    })
                    .sort({
                        created: -1
                    })
                    .skip(0)
                    .limit(2)
                    .populate("user_id", "is_online is_login full_name photo")
                    .exec('find', function(err, reviews) {

                        user_details.reviews = reviews;

                        FUNC.checkReported(logindata._id, user_id, function(err, report_check) {
                            if (err) return next(err);

                            user_details.is_reported = report_check;


                            var rates_new = user.rates.map(function(obj) {

                                if (req.user_language != "eng") {

                                    return {
                                        _id: obj._id,
                                        currency: logindata.currency,
                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                        languages: [{
                                            _id: obj.languages[0]._id,
                                            name: obj.languages[0]["name_" + req.user_language]
                                        }, {
                                            _id: obj.languages[1]._id,
                                            name: obj.languages[1]["name_" + req.user_language]
                                        }]
                                    }
                                } else {
                                    return {
                                        _id: obj._id,
                                        currency: logindata.currency,
                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                        languages: [{
                                            _id: obj.languages[0]._id,
                                            name: obj.languages[0]["name"]
                                        }, {
                                            _id: obj.languages[1]._id,
                                            name: obj.languages[1]["name"]
                                        }]
                                    }
                                }
                            });

                            var native_new = user.native_languages.map(function(obj) {
                                if (req.user_language != "eng") {
                                    return {
                                        _id: obj._id,
                                        name: obj["name_" + req.user_language]
                                    }
                                } else {
                                    return {
                                        _id: obj._id,
                                        name: obj["name"]
                                    }
                                }
                            });

                            var speaking_new = user.speaking_languages.map(function(obj) {
                                if (req.user_language != "eng") {
                                    return {
                                        _id: obj._id,
                                        name: obj["name_" + req.user_language]
                                    }
                                } else {
                                    return {
                                        _id: obj._id,
                                        name: obj["name"]
                                    }
                                }
                            });

                            var expertise_new = user.expertise_list.map(function(obj) {
                                if (req.user_language != "eng") {
                                    return {
                                        _id: obj._id,
                                        name: obj["name_" + req.user_language],
                                        heading_id: obj.heading_id
                                    }
                                } else {
                                    return {
                                        _id: obj._id,
                                        name: obj["name"],
                                        heading_id: obj.heading_id
                                    }
                                }
                            });


                            if (user_details.country_id != undefined) {
                                if (req.user_language != "eng") {
                                    user_details.country_id = {
                                        _id: user_details.country_id._id,
                                        name: user_details.country_id["name_" + req.user_language]
                                    }
                                } else {
                                    user_details.country_id = {
                                        _id: user_details.country_id._id,
                                        name: user_details.country_id["name"]
                                    }
                                }
                            }


                            if (user_details.city_id != undefined) {
                                if (req.user_language != "eng") {
                                    user_details.city_id = {
                                        _id: user_details.city_id._id,
                                        name: user_details.city_id["name_" + req.user_language]
                                    }
                                } else {
                                    user_details.city_id = {
                                        _id: user_details.city_id._id,
                                        name: user_details.city_id["name"]
                                    }
                                }
                            }

                            if (user_details.prefecture_id != undefined) {
                                if (req.user_language != "eng") {
                                    user_details.prefecture_id = {
                                        _id: user_details.prefecture_id._id,
                                        name: user_details.prefecture_id["name_jap"]
                                    }
                                } else {
                                    user_details.prefecture_id = {
                                        _id: user_details.prefecture_id._id,
                                        name: user_details.prefecture_id["name"]
                                    }
                                }
                            }

                            user_details.expertise_list = expertise_new;
                            user_details.native_languages = native_new;
                            user_details.speaking_languages = speaking_new;
                            user_details.rates = rates_new;

                            // min_amount : "min amount user redeem"
                            // min_amount_credits: "",
                            // min_rate: "min call rate limit"
                            user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                            user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);

                            var startDate = moment().startOf('day').toDate();
                            var endDate = moment(startDate).add(6, 'days');
                            endDate = endDate.endOf('day').toDate();


                            UserSchedule.find({user_id: ObjectId(user_id),start_date_time_utc:{$gte:startDate},end_date_time_utc:{$lte:endDate}}).sort({date:1}).exec(function (err, data) {
                                if (err) return next(err);

                                var weekDay = { "SUN": 0,"MON": 1,"TUE": 2,"WED": 3,"THU": 4,"FRI": 5,"SAT": 6 };
                                var tempData = [];
                                if(data && data.length){
                                    data.forEach(function (v) {
                                        var tempObj = {
                                            _id: v._id,
                                            user_id: v.user_id,
                                            weekday: v.weekday,
                                            date: v.date,
                                            start_date_time_utc: v.start_date_time_utc,
                                            end_date_time_utc: v.end_date_time_utc,
                                            start_date_time: v.start_date_time,
                                            end_date_time: v.end_date_time,
                                            start_date_time_string: v.start_date_time_string,
                                            end_date_time_string: v.end_date_time_string,
                                            time_zone: v.time_zone,
                                            is_available: v.is_available,
                                            dayKey:weekDay[v.weekday],
                                            unavailable_start_date_time:v.unavailable_start_date_time && v.unavailable_start_date_time != "" ? v.unavailable_start_date_time: "",
                                            unavailable_end_date_time:v.unavailable_end_date_time && v.unavailable_end_date_time != "" ? v.unavailable_end_date_time: "",
                                            unavailable_start_date_time_string:v.unavailable_start_date_time_string && v.unavailable_start_date_time_string != "" ? v.unavailable_start_date_time_string: "",
                                            unavailable_end_date_time_string:v.unavailable_end_date_time_string && v.unavailable_end_date_time_string != "" ? v.unavailable_end_date_time_string: ""
                                        }
                                        tempData.push(tempObj)

                                    });
                                }

                                user_details.timing = tempData;
                                FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                    user_details.stripe_added = stripe_added;
                                    user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                    return res.status(200).json({
                                        data: user_details,
                                        reply: "",
                                        meta: req.phoneMeta
                                    });
                                });
                            })

                        });
                    });
            }
        });
}


exports.AddFav = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var user_id = reqdata.user_id;

    User.update({
        _id: logindata._id
    }, {
        $addToSet: {
            fav_users: ObjectId(user_id)
        }
    }, function(err, results) {
        if (err) return next(err);

        return res.status(200).json({
            data: {},
            reply: _d("fav_added", "User marked favorite successfully"),
            meta: req.phoneMeta
        });

    });
}



exports.DeleteFav = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;
    var favObj = {};

    var user_id = reqdata.user_id;

    User.update({
        _id: logindata._id
    }, {
        $pull: {
            fav_users: ObjectId(user_id)
        }
    }, function(err, results) {
        if (err) return next(err);

        return res.status(200).json({
            data: {},
            reply: _d("fav_deleted", "User removed from favorite"),
            meta: req.phoneMeta
        });

    });
}



exports.ListFav = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);

    var query = {
        _id: {
            $in: logindata.fav_users
        },
        is_interpreter: 1,
        is_active: 1
    };

    var listing_query = User.find(query);

    listing_query
        .select("full_name gender photo video video_thumb rated total_rating rates expertise_list loc avg_rating city_id country_id is_online is_login rates")
        .skip(skip)
        .limit(limit)
        .populate("rates.languages")
        .populate("expertise_list")
        .populate("country_id")
        .populate("city_id")
        .exec('find', function(err, users) {
            if (err) return next(err);

            if (users.length > 0) {

                var usersArr = [];
                var displayed_record = users.length;

                async.eachSeries(users, function(user, callback) {

                    var user_details = {};
                    user_details = user.toObject();

                    var rates_new = user.rates.map(function(obj) {
                        if (req.user_language != "eng") {
                            return {
                                _id: obj._id,
                                currency: logindata.currency,
                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                languages: [{
                                    _id: obj.languages[0]._id,
                                    name: obj.languages[0]["name_" + req.user_language]
                                }, {
                                    _id: obj.languages[1]._id,
                                    name: obj.languages[1]["name_" + req.user_language]
                                }]
                            }
                        } else {
                            return {
                                _id: obj._id,
                                currency: logindata.currency,
                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                languages: [{
                                    _id: obj.languages[0]._id,
                                    name: obj.languages[0]["name"]
                                }, {
                                    _id: obj.languages[1]._id,
                                    name: obj.languages[1]["name"]
                                }]
                            }
                        }
                    });


                    var expertise_new = user.expertise_list.map(function(obj) {
                        if (req.user_language != "eng") {
                            return {
                                _id: obj._id,
                                name: obj["name_" + req.user_language],
                                heading_id: obj.heading_id
                            }
                        } else {
                            return {
                                _id: obj._id,
                                name: obj["name"],
                                heading_id: obj.heading_id
                            }
                        }
                    });


                    if (user_details.country_id != undefined) {
                        if (req.user_language != "eng") {
                            user_details.country_id = {
                                _id: user_details.country_id._id,
                                name: user_details.country_id["name_" + req.user_language]
                            }
                        } else {
                            user_details.country_id = {
                                _id: user_details.country_id._id,
                                name: user_details.country_id["name"]
                            }
                        }
                    }


                    if (user_details.city_id != undefined) {
                        if (req.user_language != "eng") {
                            user_details.city_id = {
                                _id: user_details.city_id._id,
                                name: user_details.city_id["name_" + req.user_language]
                            }
                        } else {
                            user_details.city_id = {
                                _id: user_details.city_id._id,
                                name: user_details.city_id["name"]
                            }
                        }
                    }

                    user_details.expertise_list = expertise_new;
                    user_details.rates = rates_new;


                    usersArr.push(user_details);
                    callback();

                }, function(err) {
                    return res.status(200).json({
                        data: usersArr,
                        max_limit: limit,
                        current_page: page,
                        displayed_record: displayed_record,
                        reply: "",
                        miss_count: logindata.miss_count,
                        meta: req.phoneMeta
                    });
                });
            } else {
                return res.status(200).json({
                    data: [],
                    max_limit: limit,
                    current_page: page,
                    displayed_record: 0,
                    reply: "",
                    miss_count: logindata.miss_count,
                    meta: req.phoneMeta
                });
            }
        });
}



exports.MyProfile = function(req, res, next) {

    var logindata = req.user_data;

    return res.status(200).json({
        data: logindata,
        reply: "",
        meta: req.phoneMeta
    });
}



exports.ChangeLanguage = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;
    var language = reqdata.language;

    User.findOneAndUpdate({
        _id: logindata._id
    }, {
        $set: {
            "language": language
        }
    }, {
        upsert: false,
        new: true
    }, function(err, user) {
        if (err) return next(err);

        return res.status(200).json({
            data: {},
            reply: _d("language_changed_successfully", "Language changed successfully", language),
            meta: req.phoneMeta
        });
    });
}



exports.Report = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var description = reqdata.description;
    var user_id = reqdata.user_id;


    var new_report = {
        reported_by: logindata._id,
        reported_user: ObjectId(user_id),
        description: description
    };

    var NewReport = new Report(new_report);
    NewReport.save(function(err, new_report_data) {
        if (err) return next(err);

        return res.status(200).json({
            data: {},
            reply: _d("reported_successfully", "User reported successfully"),
            meta: req.phoneMeta
        });
    });
}



/*exports.OnlineStatus = function(req, res, next) {

    var reqdata = req.body;
    var logindata = req.user_data;

    var is_online = reqdata.is_online;

    is_online = (is_online == 'true' || is_online == true);

    var inverse_online = (!is_online);

    User.update({
        _id: logindata._id
    }, {
        $set: {
            is_online: is_online
        }
    }, function(err, results) {
        if (err) return next(err);

        if (results.nModified === 1) {

            var reply = (is_online) ? _d("go_online", "You are online. Expect calls from clients from now") : _d("go_offline", "You went offline. You won’t be listed for on-call interpretation");
            var User_Status = (is_online) ? "Online" : "Offline";

            io.emit('interpreter_status_update', {
                "user_id": logindata._id.toString(),
                "is_interpreter_online": is_online
            });

            FUNC.update_active_campaign({
                "email": logindata.email,
                "is_online": User_Status,
                "active_campaign_id": logindata.active_campaign_id
            }, function(err) {
                return res.status(200).json({
                    data: {},
                    reply: reply,
                    meta: req.phoneMeta
                });
            });
        } else {
            return res.status(203).json({
                data: {},
                reply: _d("something_went_wrong", "Something Went Wrong"),
                meta: req.phoneMeta
            });
        }
    });
}*/
exports.OnlineStatus = function(req, res, next) {

    var reqdata = req.body;
    var logindata = req.user_data;

    var is_online = reqdata.is_online;

    is_online = (is_online == 'true' || is_online == true);

    var inverse_online = (!is_online);

    User.update({
        _id: logindata._id
    }, {
        $set: {
            is_online: is_online
        }
    }, function(err, results) {
        if (err) return next(err);

        if (results.nModified === 1) {

            var reply = (is_online) ? _d("go_online", "You are online. Expect calls from clients from now") : _d("go_offline", "You went offline. You won’t be listed for on-call interpretation");
            var User_Status = (is_online) ? "Online" : "Offline";

            io.emit('interpreter_status_update', {
                "user_id": logindata._id.toString(),
                "is_interpreter_online": is_online
            });



            FUNC.update_active_campaign({
                "email": logindata.email,
                "is_online": User_Status,
                "active_campaign_id": logindata.active_campaign_id
            }, function(err) {


                if(is_online){
                    //save online record
                    var NewUserActivity = new UserActivity({
                        user_id: logindata._id,
                        is_online: is_online
                    });
                    NewUserActivity.save(function(err, saved_data) {
                        return res.status(200).json({
                            data: {},
                            reply: reply,
                            meta: req.phoneMeta
                        });
                    })
                }else{
                    // update offline record (Last online record)
                    UserActivity.find({user_id: logindata._id, is_online: true})
                        .sort({_id:-1})
                        .limit(1)
                        .exec(function (err, rec) {
                            if(err){
                                return res.status(200).json({
                                    data: {},
                                    reply: reply,
                                    meta: req.phoneMeta
                                });
                            }
                            if(rec && rec.length){
                                UserActivity.update({
                                    _id: rec[0]._id
                                }, {
                                    $set: {
                                        is_online: is_online
                                    }
                                }, function(err, results) {
                                    return res.status(200).json({
                                        data: {},
                                        reply: reply,
                                        meta: req.phoneMeta
                                    });
                                })
                            }else{
                                return res.status(200).json({
                                    data: {},
                                    reply: reply,
                                    meta: req.phoneMeta
                                });
                            }
                        })

                }


            });

        } else {
            return res.status(203).json({
                data: {},
                reply: _d("something_went_wrong", "Something Went Wrong"),
                meta: req.phoneMeta
            });
        }
    });
}



/*exports.ListResources = function(req, res, next) {

    var currencies = [];

    for (var key in currencies_list) {
        if (currencies_list.hasOwnProperty(key)) {
            currencies.push({
                "currency_code": key,
                "currency_name": currencies_list[key]
            });
        }
    }

    Language.find({
        is_deleted: false
    }, {}, {
        sort: {
            "name": 1
        }
    }, function(err, languages) {
        if (err) return next(err);

        Heading.find({}, {}, {
            sort: {
                "_id": 1
            }
        }, function(err, headings) {
            if (err) return next(err);

            User.distinct("associations", {
                is_active: 1,
                is_interpreter: 1
            }, function(err, associations) {
                if (err) return next(err);

                User.distinct("certificates", {
                    is_active: 1,
                    is_interpreter: 1
                }, function(err, certificates) {
                    if (err) return next(err);

                    User.distinct("educations", {
                        is_active: 1,
                        is_interpreter: 1
                    }, function(err, educations) {
                        if (err) return next(err);

                        Country.find({}, {}, {
                            sort: {
                                "name": 1
                            }
                        }, function(err, countries) {
                            if (err) return next(err);

                            var headingArr = [];

                            async.eachSeries(headings, function(heading, callback) {

                                var local = {};
                                local = heading.toObject();
                                Expertise.find({
                                    heading_id: ObjectId(heading._id),
                                    status: true,
                                    is_deleted: false
                                }, function(err, expertise) {
                                    if (err) {
                                        callback();
                                    } else {

                                        var expertise_new = expertise.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language],
                                                    heading_id: obj.heading_id
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"],
                                                    heading_id: obj.heading_id
                                                }
                                            }
                                        });

                                        if (req.user_language != "eng") {
                                            headingArr.push({
                                                _id: local._id,
                                                name: local["name_" + req.user_language],
                                                expertise: expertise_new
                                            });
                                            callback();
                                        } else {
                                            headingArr.push({
                                                _id: local._id,
                                                name: local["name"],
                                                expertise: expertise_new
                                            });
                                            callback();
                                        }
                                    }
                                });
                            }, function(err) {
                                languages_new = languages.map(function(obj) {
                                    if (req.user_language != "eng") {
                                        return {
                                            _id: obj._id,
                                            name: obj["name_" + req.user_language]
                                        }
                                    } else {
                                        return {
                                            _id: obj._id,
                                            name: obj["name"]
                                        }
                                    }
                                });

                                languages_new = languages_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                countries_new = countries.map(function(obj) {
                                    if (req.user_language != "eng") {
                                        return {
                                            _id: obj._id,
                                            name: obj["name_" + req.user_language]
                                        }
                                    } else {
                                        return {
                                            _id: obj._id,
                                            name: obj["name"]
                                        }
                                    }
                                });

                                countries_new = countries_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                return res.status(200).json({

                                    data: {
                                        "languages": languages_new,
                                        "headings": headingArr,
                                        "associations": associations,
                                        "certificates": certificates,
                                        "educations": educations,
                                        "countries": countries_new,
                                        "currencies": currencies
                                    },
                                    reply: "",
                                    meta: req.phoneMeta
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}*/

exports.ListResources = function(req, res, next) {

    var currencies = [];

    for (var key in currencies_list) {
        if (currencies_list.hasOwnProperty(key)) {
            currencies.push({
                "currency_code": key,
                "currency_name": currencies_list[key]
            });
        }
    }

    User.aggregate([
        {
            $group:{
                _id:"$country_id",
                total:{$sum:1}
            }
        },{
            $sort:{
                "total":-1
            }
        }
    ], function(err, sortCountry) {
        if (err) return next(err);

        User.aggregate([
            {
                $match:{
                    "is_interpreter" : true
                }
            },{
                "$redact": {
                    "$cond": {
                        "if": {
                            "$eq": ["$fee", 0]
                        },
                        "then": "$$PRUNE",
                        "else": "$$DESCEND"
                    }
                }
            }, {
                "$unwind": "$rates"
            }, {
                "$unwind": "$rates.languages"
            }, {
                "$group": {
                    "_id": "$rates.languages",
                    "total":{$sum:1}
                }
            },{
                $sort:{
                    "total":-1
                }
            }
        ], function(err, sortLanguages) {
            sortCountry = sortCountry.filter(function( obj ) {
                return obj._id != null && obj._id != "";
            });

            Language.find({
                is_deleted: false
            }, {}, {
                sort: {
                    "name": 1
                }
            }, function(err, languages) {
                if (err) return next(err);

                Heading.find({}, {}, {
                    sort: {
                        "_id": 1
                    }
                }, function(err, headings) {
                    if (err) return next(err);

                    User.distinct("associations", {
                        is_active: 1,
                        is_interpreter: 1
                    }, function(err, associations) {
                        if (err) return next(err);

                        User.distinct("certificates", {
                            is_active: 1,
                            is_interpreter: 1
                        }, function(err, certificates) {
                            if (err) return next(err);

                            User.distinct("educations", {
                                is_active: 1,
                                is_interpreter: 1
                            }, function(err, educations) {
                                if (err) return next(err);

                                Country.find({}, {}, {
                                    sort: {
                                        "name": 1
                                    }
                                }, function(err, countries) {
                                    if (err) return next(err);

                                    var headingArr = [];

                                    async.eachSeries(headings, function(heading, callback) {

                                        var local = {};
                                        local = heading.toObject();
                                        Expertise.find({
                                            heading_id: ObjectId(heading._id)/*,
                                            status: true,
                                            is_deleted: false*/
                                        }, function(err, expertise) {
                                            if (err) {
                                                callback();
                                            } else {

                                                var expertise_new = expertise.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language],
                                                            heading_id: obj.heading_id
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"],
                                                            heading_id: obj.heading_id
                                                        }
                                                    }
                                                });

                                                if (req.user_language != "eng") {
                                                    headingArr.push({
                                                        _id: local._id,
                                                        name: local["name_" + req.user_language],
                                                        expertise: expertise_new
                                                    });
                                                    callback();
                                                } else {
                                                    headingArr.push({
                                                        _id: local._id,
                                                        name: local["name"],
                                                        expertise: expertise_new
                                                    });
                                                    callback();
                                                }
                                            }
                                        });
                                    }, function(err) {
                                        languages_new = languages.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });

                                        var tmp_languages_new = [];

                                        languages_new.forEach((v)=>{
                                            var chk = sortLanguages.filter((t)=>{
                                                if(t._id){
                                                    return t._id.toString() == v._id.toString()
                                                }else{
                                                    return [];
                                                }
                                            })
                                            if(chk && chk.length){
                                                v.total = chk[0].total
                                            }else{
                                                v.total = 0
                                            }
                                            tmp_languages_new.push(v);
                                        })

                                        languages_new = tmp_languages_new.sort(FUNC.sortByTotal)

                                        //languages_new = languages_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                        countries_new = countries.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });

                                        //countries_new = countries_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                        var tmp_countries_new = [];

                                        countries_new.forEach((v)=>{
                                            var chk = sortCountry.filter((t)=>{
                                                if(t._id){
                                                    return t._id.toString() == v._id.toString()
                                                }else{
                                                    return [];
                                                }
                                            })
                                            if(chk && chk.length){
                                                v.total = chk[0].total
                                            }else{
                                                v.total = 0
                                            }
                                            tmp_countries_new.push(v);
                                        })

                                        countries_new = tmp_countries_new.sort(FUNC.sortByTotal)

                                        return res.status(200).json({

                                            data: {
                                                "languages": languages_new,
                                                "headings": headingArr,
                                                "associations": associations,
                                                "certificates": certificates,
                                                "educations": educations,
                                                "countries": countries_new,
                                                "currencies": currencies
                                            },
                                            reply: "",
                                            meta: req.phoneMeta
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
    });
}

exports.ListResources1 = function(req, res, next) {

    var currencies = [];

    for (var key in currencies_list) {
        if (currencies_list.hasOwnProperty(key)) {
            currencies.push({
                "currency_code": key,
                "currency_name": currencies_list[key]
            });
        }
    }

    User.aggregate([
        {
            $group:{
                _id:"$country_id",
                total:{$sum:1}
            }
        },{
            $sort:{
                "total":-1
            }
        }
    ], function(err, sortCountry) {
        if (err) return next(err);

        User.aggregate([
            {
                $match:{
                    "is_interpreter" : true
                }
            },{
                "$redact": {
                    "$cond": {
                        "if": {
                            "$eq": ["$fee", 0]
                        },
                        "then": "$$PRUNE",
                        "else": "$$DESCEND"
                    }
                }
            }, {
                "$unwind": "$rates"
            }, {
                "$unwind": "$rates.languages"
            }, {
                "$group": {
                    "_id": "$rates.languages",
                    "total":{$sum:1}
                }
            },{
                $sort:{
                    "total":-1
                }
            }
        ], function(err, sortLanguages) {
            sortCountry = sortCountry.filter(function( obj ) {
                return obj._id != null && obj._id != "";
            });

            Language.find({
                is_deleted: false
            }, {}, {
                sort: {
                    "name": 1
                }
            }, function(err, languages) {
                if (err) return next(err);
                User.distinct("associations", {
                    is_active: 1,
                    is_interpreter: 1
                }, function(err, associations) {
                    if (err) return next(err);

                    User.distinct("certificates", {
                        is_active: 1,
                        is_interpreter: 1
                    }, function(err, certificates) {
                        if (err) return next(err);

                        User.distinct("educations", {
                            is_active: 1,
                            is_interpreter: 1
                        }, function(err, educations) {
                            if (err) return next(err);

                            Country.find({}, {}, {
                                sort: {
                                    "name": 1
                                }
                            }, function(err, countries) {
                                if (err) return next(err);

                                var headingArr = [];

                                var lang = req.user_language;

                                if(lang != "eng"){
                                    var tempFiled = "$name_"+lang;
                                }else{
                                    var tempFiled = "$name";

                                }
                                Expertise.aggregate([{
                                    $match:{
                                        status: true,
                                        is_deleted: false
                                    }
                                }, {
                                    $project:{
                                        name: tempFiled,
                                        expertise:[]
                                    }
                                },{
                                    $sort : { "name" : 1 }
                                }], function(err, expertise) {
                                    if (err) return next(err);
                                    languages_new = languages.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                name: obj["name_" + req.user_language]
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                name: obj["name"]
                                            }
                                        }
                                    });

                                    var tmp_languages_new = [];

                                    languages_new.forEach((v)=>{
                                        var chk = sortLanguages.filter((t)=>{
                                            if(t._id){
                                                return t._id.toString() == v._id.toString()
                                            }else{
                                                return [];
                                            }
                                        })
                                        if(chk && chk.length){
                                            v.total = chk[0].total
                                        }else{
                                            v.total = 0
                                        }
										//v.state = 'india'
                                        tmp_languages_new.push(v);
                                    })

                                    languages_new = tmp_languages_new.sort(FUNC.sortByTotal)

                                    //languages_new = languages_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                    countries_new = countries.map(function(obj) {
                                        if (req.user_language != "eng") {
                                            return {
                                                _id: obj._id,
                                                name: obj["name_" + req.user_language]
                                            }
                                        } else {
                                            return {
                                                _id: obj._id,
                                                name: obj["name"]
                                            }
                                        }
                                    });

                                    //countries_new = countries_new.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

                                    var tmp_countries_new = [];

                                    countries_new.forEach((v)=>{
                                        var chk = sortCountry.filter((t)=>{
                                            if(t._id){
                                                return t._id.toString() == v._id.toString()
                                            }else{
                                                return [];
                                            }
                                        })
                                        if(chk && chk.length){
                                            v.total = chk[0].total
                                        }else{
                                            v.total = 0
                                        }
                                        tmp_countries_new.push(v);
                                    })

                                    countries_new = tmp_countries_new.sort(FUNC.sortByTotal)

                                    return res.status(200).json({

                                        data: {
                                            "languages": languages_new,
                                            "headings": expertise,
                                            "associations": associations,
                                            "certificates": certificates,
                                            "educations": educations,
                                            "countries": countries_new,
                                            "currencies": currencies
                                        },
                                        reply: "",
                                        meta: req.phoneMeta
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
    });
}



exports.Reviews = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;
    var user_id = req.query.user_id;

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);

    Review.find({
        rated_user: ObjectId(user_id),
        comment: {
            $ne: ""
        }
    })
        .select({
            user_id: 1,
            rating: 1,
            comment: 1
        })
        .sort({
            created: -1
        })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "is_online is_login full_name photo video video_thumb")
        .exec('find', function(err, reviews) {

            if (reviews.length > 0) {

                var usersArr = [];
                var displayed_record = reviews.length;

                return res.status(200).json({
                    data: reviews,
                    max_limit: limit,
                    current_page: page,
                    displayed_record: displayed_record,
                    reply: "",
                    meta: req.phoneMeta
                });
            } else {
                return res.status(200).json({
                    data: [],
                    max_limit: limit,
                    current_page: page,
                    displayed_record: 0,
                    reply: "",
                    meta: req.phoneMeta
                });
            }
        });
}



exports.CmsPage = function(req, res, next) {

    var logindata = req.user_data;
    var page_key = req.params.page_key;
    var language = req.params.language;

    Page.findOne({
        page_key: page_key
    }, function(err, page) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect(admin_url);
        } else {
            if (page) {
                if (language == "fr") {
                    return res.render('page/cms_page', {
                        title: page.title_fr,
                        content: page.content_fr
                    });
                } else {
                    return res.render('page/cms_page', {
                        title: page.title,
                        content: page.content
                    });
                }
            } else {
                return res.render('page/cms_page', {
                    title: "Error: Page not found",
                    content: "Please check the URL you have entered."
                });
            }
        }
    });
}



exports.Credits = function(req, res, next) {

    var logindata = req.user_data;
    var credits = FUNC.round_currency(logindata.currency, logindata.credits);
    var earned_credits = FUNC.round_currency(logindata.currency, logindata.earned_credits);
    var min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
    var min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);

    FUNC.check_stripe_added(logindata.stripe, function(err, stripe_added) {
        var stripe_added = stripe_added;
        var displayMessage = true;
        if(logindata.is_promoter_referal && (parseInt(logindata.free_credits) > 0 || parseInt(logindata.credits) > 0)){
            displayMessage = false;
        }else if(!logindata.is_promoter_referal && (parseInt(logindata.credits) > 0 || logindata.card_data.length)){
            displayMessage = false;
        }

        //if user have unlimited access
        if(logindata.unlimited_access){
            displayMessage = false;
        }
        console.log("displayMessage==>",displayMessage);
        Call.count({user_id:logindata._id, payment_status:{$in:["decline","pending"]}}, function (err, dues) {
            return res.status(200).json({
                data: {
                    purchased_credits: credits,
                    earned_credits: earned_credits,
                    currency: logindata.currency,
                    min_amount: min_amount,
                    min_amount_credits: min_amount_credits,
                    stripe_added: stripe_added,
                    stripe_url: logindata.stripe_url,
                    stripe_success_url: logindata.stripe_success_url,
                    displayMessage:displayMessage,
                    lastPaymentDue: dues == 0 ? false: true,
                    reply: dues == 0 ? "" :_d("last_payment_due", "We were unable to confirm the payment for your last call, in order to keep using washing, please update your payment information.")
                },
                reply: dues == 0 ? "" :_d("last_payment_due", "We were unable to confirm the payment for your last call, in order to keep using washing, please update your payment information."),
                meta: req.phoneMeta
            });
        })

    });
}



exports.RequestCashout = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var amount = reqdata.amount;

    var NewRequest = new Request({
        user_id: logindata._id,
        amount: amount,
        status: "new_request",
        currency: logindata.currency
    });


    NewRequest.save(function(err, new_user_data) {
        if (err) return next(err);

        if (new_user_data) {
            User.update({
                _id: logindata._id
            }, {
                $inc: {
                    earned_credits: -(amount)
                }
            }, function(err, results) {

                FUNC.sendMailDB("cashout-request", "", process.env.SUPPORT_MAIL, {
                    INTERPRETER: logindata.full_name,
                    EMAIL: logindata.email,
                    AMOUNT:amount
                }, function(err) {
                    if (err) return next(err);
                });

                return res.status(200).json({
                    data: {},
                    reply: _d("request_sent_successfully", "Request sent successfully"),
                    meta: req.phoneMeta
                });
            });
        } else {
            return res.status(200).json({
                data: {},
                reply: _d("request_sent_successfully", "Request sent successfully"),
                meta: req.phoneMeta
            });
        }
    });
}



exports.CheckVerification = function(req, res, next) {

    var logindata = req.user_data.toObject();

    FUNC.check_stripe_added(logindata.stripe, function(err, stripe_added) {
        logindata.stripe_added = stripe_added;

        return res.status(200).json({
            data: logindata,
            meta: req.phoneMeta,
            miss_count: logindata.miss_count
        });
    });
}



exports.DeleteDocument = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var doc_id = reqdata.doc_id;

    var doc = logindata.user_docs.filter(function(doc_obj) {
        return (doc_id == doc_obj._id.toString());
    });

    User.update({
        _id: logindata._id
    }, {
        $pull: {
            "user_docs": {
                "_id": ObjectId(doc_id)
            }
        }
    }, function(err, results) {
        if (err) return next(err);

        FUNC.DeleteImageAWS(doc[0].document, "prof_docs/", function(err) {
            return res.status(200).json({
                data: {},
                reply: _d("doc_deleted_successfully", "Document deleted successfully"),
                meta: req.phoneMeta
            });
        });
    });
}



exports.RequestVerification = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    User.update({
        _id: logindata._id
    }, {
        $set: {
            is_professional: "pending"
        }
    }, function(err, results) {

        if (err) return next(err);

        var tempLink = process.env.ADMIN_URL+"admin/get_verified/verified_document/"+logindata._id

        FUNC.sendMailDB("pro-verification-request", req.user_language, process.env.SUPPORT_MAIL, {
            INTERPRETER: logindata.full_name,
            DOCUMENT_LINK: "<a href='" + tempLink + "'> " + tempLink + " </a>"
        }, function(err) {
            if (err) return next(err);

            return res.status(200).json({
                data: "pending",
                reply: _d("verification_request_send", "Verification request has been sent"),
                meta: req.phoneMeta
            });
        });
    });
}


exports.UploadImages = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(files.image && files.image != ""){
            //console.log("files.image", files.image);
            FUNC.UploadImageAWS1(files.image, "chat_images/", function(err, image_name) {
                if (err) return next(err);
                return res.status(200).json({
                    image_url: urljoin(process.env.CHAT_IMG_DISPLAY_PATH, image_name),
                    reply: _d("document_uploaded_successfully", "Document uploaded successfully"),
                    meta: req.phoneMeta
                });
            });
        }else{
            return res.status(203).send({
                data: {},
                reply: _d("required_fields_missing", "Required fields missing"),
                meta: req.phoneMeta
            });
        }
    })
}



exports.UploadDocument = function(req, res, next) {

    var logindata = req.user_data;
    var updateObj = {};

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        var validation = new Validator(fields, vrules.upload_document);
        if (validation.fails()) {
            //Validating fails
            var errorObj = validation.errors.all();
            return res.status(203).send({
                data: {},
                reply: errorObj[Object.keys(errorObj)[0]][0],
                meta: req.phoneMeta
            });
        } else {

            var title = fields.title;

            FUNC.UploadImageAWS(files.document, "chat_images/", function(err, image_name) {
                if (err) return next(err);

                var doc_id = ObjectId();

                User.findOneAndUpdate({
                    _id: logindata._id
                }, {
                    $push: {
                        "user_docs": {
                            _id: doc_id,
                            title: title,
                            document: image_name
                        }
                    }
                }, {
                    new: true
                })
                    .select("user_docs")
                    .exec(function(err, user_details) {
                        if (err) {
                            return next(err);
                        } else {
                            return res.status(200).json({
                                data: {
                                    _id: doc_id,
                                    title: title,
                                    document: image_name,
                                    doc_url: urljoin(process.env.CHAT_IMG_DISPLAY_PATH, image_name)
                                },
                                reply: _d("document_uploaded_successfully", "Document uploaded successfully"),
                                meta: req.phoneMeta
                            });
                        }
                    });
            });
        }
    });
}



exports.CashoutHistory = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);

    var query = {
        user_id: logindata._id
    };

    var listing_query = Request.find(query);

    listing_query
        .skip(skip)
        .limit(limit)
        .sort({
            created: -1
        })
        .exec('find', function(err, requests) {
            if (err) return next(err);

            if (requests.length > 0) {

                var displayed_record = requests.length;

                return res.status(200).json({
                    data: requests,
                    max_limit: limit,
                    current_page: page,
                    displayed_record: displayed_record,
                    reply: "",
                    meta: req.phoneMeta
                });
            } else {
                return res.status(200).json({
                    data: [],
                    max_limit: limit,
                    current_page: page,
                    displayed_record: 0,
                    reply: "",
                    meta: req.phoneMeta
                });
            }
        });
}



exports.PurchaseHistory = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);

    var query = {
        user_id: logindata._id,
        type: "credit"
    };

    //var listing_query = Credit.find(query);
    var listing_query = Transaction.find(query);

    listing_query
        .skip(skip)
        .limit(limit)
        .sort({
            created: -1
        })
        .lean()
        .exec('find', function(err, credits) {
            if (err) return next(err);

            if (credits.length > 0) {

                var displayed_record = credits.length;

                credits.forEach((v)=>{
                    v["credits"] = parseFloat(v.amount);
                    v.created = Math.floor(v.created.getTime() / 1000);
                    v.updated = Math.floor(v.updated.getTime() / 1000);
                })

                return res.status(200).json({
                    data: credits,
                    max_limit: limit,
                    current_page: page,
                    displayed_record: displayed_record,
                    reply: "",
                    meta: req.phoneMeta
                });
            } else {
                return res.status(200).json({
                    data: [],
                    max_limit: limit,
                    current_page: page,
                    displayed_record: 0,
                    reply: "",
                    meta: req.phoneMeta
                });
            }
        });
}



exports.GdprStatusUpdate = function(req, res, next) {

    var logindata = req.user_data;
    var reqdata = req.body;

    var gdpr_accepted = reqdata.gdpr_accepted;

    if (gdpr_accepted) {
        User.update({
            _id: logindata._id
        }, {
            is_selfdelete: false,
            gdpr_accepted: true
        }, function(err, results) {
            if (err) return next(err);

            return res.status(200).json({
                data: {
                    gdpr_accepted: true
                },
                reply: _d("gdpr_accepted", "You have accepted GDPR policy"),
                meta: req.phoneMeta
            });
        });
    } else {
        User.update({
            _id: logindata._id
        }, {
            is_selfdelete: true,
            gdpr_accepted: false
        }, function(err, results) {
            if (err) return next(err);

            return res.status(200).json({
                data: {
                    gdpr_accepted: false
                },
                reply: _d("gdpr_declined", "You have declined GDPR policy"),
                meta: req.phoneMeta
            });
        });
    }
}

exports.ChatList = function (req, res, next) {
    var logindata = req.user_data;


    var chatType = req.query.chat_type ? req.query.chat_type : 'normal'; //normal && job
    var matchQry = {};
    if(chatType == "normal"){
        matchQry = {
            "conversiondata.chat_module": "onetoone"
        }
    }else{
        matchQry = {
            "conversiondata.chat_module" : {
                "$exists":false
            }
        }
    }

    ConversionReply.aggregate([
        {
            $match: {
                $or:[
                    {from_id: logindata._id},
                    {to_id: logindata._id}
                ]
            }
        },
        {
            $group:{
                _id: "$conv_id",
                msg: {"$last":"$msg"},
                conv_id: {$last: '$conv_id'},
                from_id: {$last: '$from_id'},
                rd_msg: {$last: '$rd_msg'},
                to_id: {$last: '$to_id'},
                type: {$last: '$type'},
                msg_type: {$last: '$msg_type'},
                other_details: {$last: '$other_details'},
                created: {$last: '$created'},
                count_unread_msg :  {
                    "$sum": {
                        "$cond": [
                            {
                                "$and": [
                                    {$eq: [ "$rd_msg", false ]},
                                    {$ne: [ "$from_id", logindata._id ]},
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'conversions',
                localField: 'conv_id',
                foreignField: '_id',
                as: 'conversiondata'
            }
        },
        {$unwind: "$conversiondata"},
        /*{
            $match: matchQry
        },*/
        {
            $lookup: {
                from: 'users',
                localField: 'from_id',
                foreignField: '_id',
                as: 'user_from_id_data'
            }
        },
        {
            $unwind: "$user_from_id_data"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'to_id',
                foreignField: '_id',
                as: 'user_to_id_data'
            }
        },
        {
            $unwind: "$user_to_id_data"
        },
        {
            $lookup: {
                from: 'jobrequests',
                localField: 'conversiondata.job_item_id',
                foreignField: '_id',
                as: 'job_data'
            }
        },
        {
            $unwind: { path:"$job_data",preserveNullAndEmptyArrays: true}
        },
        {
            $sort: {
                'created': -1
            }
        },
        {
            $project: {
                "_id": 1,
                "msg": 1,
                "conv_id": 1,
                "from_id": 1,
                "rd_msg": 1,
                "to_id": 1,
                "created": 1,
                "type": 1,
                "msg_type":1,
                "other_details": 1,
                "count_unread_msg":1,
                "conversiondata._id": 1,
                "conversiondata.job_item_id": 1,
                "conversiondata.chat_type": 1,
                "conversiondata.interpreter_id": 1,
                "user_from_id_data._id": 1,
                "user_from_id_data.full_name": 1,
                "user_from_id_data.email": 1,
                "user_from_id_data.photo": 1,
                "user_from_id_data.timezone": 1,
                "user_from_id_data.is_interpreter": 1,
                "user_from_id_data.is_online": 1,
                "user_from_id_data.is_login": 1,
                "user_to_id_data._id": 1,
                "user_to_id_data.full_name": 1,
                "user_to_id_data.email": 1,
                "user_to_id_data.photo": 1,
                "user_to_id_data.timezone": 1,
                "user_to_id_data.is_interpreter": 1,
                "user_to_id_data.is_online": 1,
                "user_to_id_data.is_login": 1,
                "job_data._id": 1,
                "job_data.title": 1
            }
        }
    ], function(err, messages) {


        if (err) return next(err);
        var tempArr = [];

        if(messages && messages.length){

            messages.forEach(function (user) {
                var user_details = user;



                //add message template
                var user_details = user;



                //add message template

                var login_user_type = user_details.conversiondata.interpreter_id.toString() != logindata._id.toString() ? 'user': 'interpreter';

                if(user_details.user_from_id_data._id.toString() == logindata._id.toString()){

                    var current_user1 = user_details.user_to_id_data;
                    var current_user_data  = user_details.user_to_id_data;
                    var login_data = user_details.user_from_id_data;

                    if(user_details.type &&  user_details.type!= '' && user_details.type != 'tip_message'){

                        var offer_amount = '';
                        if(user_details.type == 'amount_updated' || user_details.type == 'interpreter_appplied'  || user_details.type == 'job_payment' || user_details.type == 'tip_amount'){
                            offer_amount = FUNC.offer_amount_data(user_details,login_user_type);
                        }

                        user_details.msg =  FUNC.displayChatInformativeMsg(user_details.type,'you',user_details.msg,current_user_data.full_name,offer_amount,login_user_type);

                    }




                }else{
                    var current_user1 = user_details.user_from_id_data;
                    var current_user_data  = user_details.user_from_id_data;
                    var login_data = user_details.user_to_id_data;

                    if(user_details.type &&  user_details.type!= '' && user_details.type != 'tip_message'){

                        var offer_amount = '';
                        if(user_details.type == 'amount_updated' || user_details.type == 'interpreter_appplied'  || user_details.type == 'job_payment' || user_details.type == 'tip_amount'){
                            offer_amount = FUNC.offer_amount_data(user_details,login_user_type);
                        }

                        user_details.msg =  FUNC.displayChatInformativeMsg(user_details.type,current_user_data.full_name,user_details.msg,'you',offer_amount,login_user_type);

                    }
                }


                var regex = /<br\s*[\/]?>/gi;
                user_details.msg = user_details.msg && user_details.msg != '' && user_details.msg != null ? user_details.msg.replace(regex, "\n") : "";

                user_details.user_from_id_data.profile_photo = (user_details.user_from_id_data.photo != undefined && user_details.user_from_id_data.photo != "") ? urljoin(process.env.MEDIA_DISPLAY_PATH, user_details.user_from_id_data.photo) : "";

                user_details.user_from_id_data.is_online = user_details.user_from_id_data.is_online && user_details.user_from_id_data.is_login ? true : false;
                delete user_details.user_from_id_data.is_login;


                user_details.user_to_id_data.profile_photo = (user_details.user_to_id_data.photo != undefined && user_details.user_to_id_data.photo != "") ? urljoin(process.env.MEDIA_DISPLAY_PATH, user_details.user_to_id_data.photo) : "";
                user_details.user_to_id_data.is_online = user_details.user_to_id_data.is_online && user_details.user_to_id_data.is_login ? true : false;
                delete user_details.user_to_id_data.is_login;

                user_details.created = Math.floor(user_details.created.getTime() / 1000);
                user_details.msg_type = user_details.msg_type && user_details.msg_type != "" ? user_details.msg_type : "text";
                tempArr.push(user_details)
            })


            return res.status(200).json({
                data: {
                    messages: tempArr
                },
                reply: "",
                meta: req.phoneMeta
            });


        }else{
            return res.status(200).json({
                data: {
                    messages: messages
                },
                reply: "",
                meta: req.phoneMeta
            });
        }
    });
}

/*exports.ChatHistory = function (req, res, next) {
    var logindata = req.user_data;

    var interpreter_id = req.params.interpreter_id;
    var job_id =  req.query.job_id && req.query.job_id != '' ? req.query.job_id : '';

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);


    var block = false;
    var blockBy = "";
    var canBlock = true;


    if(job_id && job_id != ''){

        console.log("Job Chat", job_id );

        var qry = {
            job_item_id: ObjectId(job_id),
            $and:[
                {
                    $or:[
                        {from_id: logindata._id},
                        {from_id: ObjectId(interpreter_id)}
                    ]
                },
                {
                    $or:[
                        {to_id: logindata._id},
                        {to_id: ObjectId(interpreter_id)}
                    ]
                }
            ]


        }


        var tempId = job_id.toString();


        Conversion.findOne(qry, function(err, conversations) {
            if (err) return next(err);


            if(conversations && conversations._id){
                ConversionReply.update({conv_id:conversations._id, to_id:logindata._id}, {$set:{rd_msg: true}}, {multi: true}, function (err, res1) {



                    ConversionReply.find({conv_id:conversations._id})
                        .populate("to_id", "full_name photo blocked_user")
                        .populate("from_id", "full_name photo blocked_user")
                        .populate("conv_id", "job_item_id from_id to_id interpreter_id _id")
                        .sort({
                            created: -1
                        })
                        .skip(skip)
                        .limit(limit)
                        .exec('find', function(err, chats) {
                            if (err) return next(err);

                            if(chats && chats.length){

                                var loginUser = logindata._id.toString();
                                var reciverUser = ObjectId(interpreter_id);


                                /!**** start Check Block**********!/

                                if(chats[0] && chats[0].from_id && chats[0].from_id.blocked_user && chats[0].from_id.blocked_user.length && chats[0].to_id && chats[0].to_id._id){

                                    chats[0].from_id.blocked_user.forEach(function (v) {

                                        if(v && v.user_id && v.user_id.toString() == chats[0].to_id._id.toString()){
                                            block = true;
                                            blockBy = chats[0].from_id._id;
                                        }

                                    });

                                }

                                if(chats[0] && chats[0].to_id && chats[0].to_id.blocked_user && chats[0].to_id.blocked_user.length && chats[0].from_id && chats[0].from_id._id){

                                    chats[0].to_id.blocked_user.forEach(function (v) {

                                        if(v && v.user_id && v.user_id.toString() == chats[0].from_id._id.toString()){
                                            block = true;
                                            blockBy = chats[0].to_id._id;
                                        }

                                    });


                                }


                                /!**** End Check Block**********!/


                                chats.forEach(function (v) {
                                    var login_user_type = v.conv_id.interpreter_id.toString() != logindata._id.toString() ? 'user': 'interpreter';

                                    if(v.from_id._id.toString() == logindata._id.toString()){

                                        var current_user1 = v.to_id;
                                        var current_user_data  = v.to_id;
                                        var login_data = v.from_id;

                                        if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                            var offer_amount = '';
                                            if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                            }

                                            v.msg =  FUNC.displayChatInformativeMsg(v.type,'you',v.msg,current_user_data.full_name,offer_amount,login_user_type);

                                        }




                                    }else{
                                        var current_user1 = v.from_id;
                                        var current_user_data  = v.from_id;
                                        var login_data = v.to_id;

                                        if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                            var offer_amount = '';
                                            if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                            }

                                            v.msg =  FUNC.displayChatInformativeMsg(v.type,current_user_data.full_name,v.msg,'you',offer_amount,login_user_type);

                                        }
                                    }

                                    v.conv_id = v.conv_id._id;
                                    var regex = /<br\s*[\/]?>/gi;
                                    v.msg = v.msg && v.msg != "" ? v.msg.replace(regex, "\n") : "";
                                });


                                /!*var result = _(chats)
                                    .groupBy(x => new Date(x.modified).toJSON().slice(0,10))
                                    .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                        return x.modified
                                    })}))
                                    .value();*!/
                                var result = _(chats)
                                    .groupBy(x => moment.unix(x.created).format("YYYY-MM-DD"))
                                    .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                        return x.created
                                    })}))
                                    .value();




                                var tempJobId = job_id && job_id != "" ? ObjectId(job_id): ObjectId("000000000000000000000000");
                                JobRequest.findOne({_id:tempJobId}, function (err, jobData) {

                                    if(err){
                                        if (err) return next(err);
                                    }


                                    if(jobData && jobData._id != "" && jobData._id.toString() !=  "000000000000000000000000" && jobData.proposals && !(_.isEmpty(jobData.proposals))){


                                        var loginUser = logindata._id.toString();
                                        var reciverUser = interpreter_id.toString();



                                        if(jobData.proposals[loginUser] && jobData.proposals[loginUser].offer_accepted){
                                            canBlock = false
                                        }

                                        if(jobData.proposals[reciverUser] && jobData.proposals[reciverUser].offer_accepted){
                                            canBlock = false
                                        }


                                        User.findOne({
                                            _id: ObjectId(interpreter_id),
                                            is_active: 1
                                        })
                                            .populate("native_languages")
                                            .populate("speaking_languages")
                                            .populate("expertise_list")
                                            .populate("rates.languages")
                                            .populate("city_id")
                                            .populate("country_id")
                                            .exec(function(err, user) {
                                                if (err) return next(err);
                                                var user_details = user.toObject();
                                                var rates_new = user.rates.map(function(obj) {

                                                    if (req.user_language != "eng") {

                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name_" + req.user_language]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name_" + req.user_language]
                                                            }]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name"]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name"]
                                                            }]
                                                        }
                                                    }
                                                });

                                                var native_new = user.native_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });

                                                var speaking_new = user.speaking_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });

                                                var expertise_new = user.expertise_list.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language],
                                                            heading_id: obj.heading_id
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"],
                                                            heading_id: obj.heading_id
                                                        }
                                                    }
                                                });

                                                if (user_details.country_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name"]
                                                        }
                                                    }
                                                }

                                                if (user_details.city_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name"]
                                                        }
                                                    }
                                                }

                                                user_details.expertise_list = expertise_new || [];
                                                user_details.native_languages = native_new || [];
                                                user_details.speaking_languages = speaking_new || [];
                                                user_details.rates = rates_new || [];
                                                user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                    user_details.stripe_added = stripe_added;
                                                    user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                    return res.status(200).json({
                                                        data: {
                                                            conv_id: conversations._id,
                                                            socket_chat_id: logindata._id+"_"+tempId,
                                                            from_id: logindata._id,
                                                            connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                            block:block,
                                                            blockBy: blockBy,
                                                            canBlock: canBlock,
                                                            from_name: logindata.full_name || "",
                                                            chats: result,
                                                            user_details:user_details
                                                        },
                                                        next : chats.length == limit ? true : false,
                                                        max_limit: limit,
                                                        reply: "",
                                                        meta: req.phoneMeta
                                                    });
                                                });

                                            })

                                    }else{
                                        User.findOne({
                                            _id: ObjectId(interpreter_id),
                                            is_active: 1
                                        })
                                            .populate("native_languages")
                                            .populate("speaking_languages")
                                            .populate("expertise_list")
                                            .populate("rates.languages")
                                            .populate("city_id")
                                            .populate("country_id")
                                            .exec(function(err, user) {
                                                if (err) return next(err);
                                                var user_details = user.toObject();
                                                var rates_new = user.rates.map(function(obj) {

                                                    if (req.user_language != "eng") {

                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name_" + req.user_language]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name_" + req.user_language]
                                                            }]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name"]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name"]
                                                            }]
                                                        }
                                                    }
                                                });

                                                var native_new = user.native_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });

                                                var speaking_new = user.speaking_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });

                                                var expertise_new = user.expertise_list.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language],
                                                            heading_id: obj.heading_id
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"],
                                                            heading_id: obj.heading_id
                                                        }
                                                    }
                                                });

                                                if (user_details.country_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name"]
                                                        }
                                                    }
                                                }

                                                if (user_details.city_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name"]
                                                        }
                                                    }
                                                }

                                                user_details.expertise_list = expertise_new || [];
                                                user_details.native_languages = native_new || [];
                                                user_details.speaking_languages = speaking_new || [];
                                                user_details.rates = rates_new || [];
                                                user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                    user_details.stripe_added = stripe_added;
                                                    user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                    return res.status(200).json({
                                                        data: {
                                                            conv_id: conversations._id,
                                                            socket_chat_id: logindata._id+"_"+tempId,
                                                            from_id: logindata._id,
                                                            connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                            block:block,
                                                            blockBy: blockBy,
                                                            canBlock: canBlock,
                                                            from_name: logindata.full_name || "",
                                                            chats: result,
                                                            user_details:user_details
                                                        },
                                                        next : chats.length == limit ? true : false,
                                                        max_limit: limit,
                                                        reply: "",
                                                        meta: req.phoneMeta
                                                    });
                                                });

                                            })

                                    }

                                })

                            }else{
                                User.findOne({
                                    _id: ObjectId(interpreter_id),
                                    is_active: 1
                                })
                                    .populate("native_languages")
                                    .populate("speaking_languages")
                                    .populate("expertise_list")
                                    .populate("rates.languages")
                                    .populate("city_id")
                                    .populate("country_id")
                                    .exec(function(err, user) {
                                        if (err) return next(err);
                                        var user_details = user.toObject();
                                        var rates_new = user.rates.map(function(obj) {

                                            if (req.user_language != "eng") {

                                                return {
                                                    _id: obj._id,
                                                    currency: logindata.currency,
                                                    fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                    languages: [{
                                                        _id: obj.languages[0]._id,
                                                        name: obj.languages[0]["name_" + req.user_language]
                                                    }, {
                                                        _id: obj.languages[1]._id,
                                                        name: obj.languages[1]["name_" + req.user_language]
                                                    }]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    currency: logindata.currency,
                                                    fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                    languages: [{
                                                        _id: obj.languages[0]._id,
                                                        name: obj.languages[0]["name"]
                                                    }, {
                                                        _id: obj.languages[1]._id,
                                                        name: obj.languages[1]["name"]
                                                    }]
                                                }
                                            }
                                        });

                                        var native_new = user.native_languages.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });

                                        var speaking_new = user.speaking_languages.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language]
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"]
                                                }
                                            }
                                        });

                                        var expertise_new = user.expertise_list.map(function(obj) {
                                            if (req.user_language != "eng") {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name_" + req.user_language],
                                                    heading_id: obj.heading_id
                                                }
                                            } else {
                                                return {
                                                    _id: obj._id,
                                                    name: obj["name"],
                                                    heading_id: obj.heading_id
                                                }
                                            }
                                        });

                                        if (user_details.country_id != undefined) {
                                            if (req.user_language != "eng") {
                                                user_details.country_id = {
                                                    _id: user_details.country_id._id,
                                                    name: user_details.country_id["name_" + req.user_language]
                                                }
                                            } else {
                                                user_details.country_id = {
                                                    _id: user_details.country_id._id,
                                                    name: user_details.country_id["name"]
                                                }
                                            }
                                        }

                                        if (user_details.city_id != undefined) {
                                            if (req.user_language != "eng") {
                                                user_details.city_id = {
                                                    _id: user_details.city_id._id,
                                                    name: user_details.city_id["name_" + req.user_language]
                                                }
                                            } else {
                                                user_details.city_id = {
                                                    _id: user_details.city_id._id,
                                                    name: user_details.city_id["name"]
                                                }
                                            }
                                        }

                                        user_details.expertise_list = expertise_new || [];
                                        user_details.native_languages = native_new || [];
                                        user_details.speaking_languages = speaking_new || [];
                                        user_details.rates = rates_new || [];
                                        user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                        user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                        user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                        FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                            user_details.stripe_added = stripe_added;
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            return res.status(200).json({
                                                data: {
                                                    conv_id: conversations._id,
                                                    socket_chat_id: logindata._id+"_"+tempId,
                                                    from_id: logindata._id,
                                                    connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                    block:block,
                                                    blockBy: blockBy,
                                                    canBlock: canBlock,
                                                    from_name: logindata.full_name || "",
                                                    chats: [],
                                                    user_details: user_details
                                                },
                                                next: false,
                                                max_limit: limit,
                                                reply: "",
                                                meta: req.phoneMeta
                                            });
                                        });

                                    })

                            }
                        });
                })
            }else{
                return res.status(200).json({
                    data: {},
                    reply: "Unable to proceed request",
                    meta: req.phoneMeta
                });
            }
        });

    }else{

        console.log("Normal", job_id );
        var qry = {
            job_item_id: ObjectId("000000000000000000000000"),
            chat_module: "onetoone",
            $and:[
                {
                    $or:[
                        {from_id: logindata._id},
                        {from_id: ObjectId(interpreter_id)}
                    ]
                },
                {
                    $or:[
                        {to_id: logindata._id},
                        {to_id: ObjectId(interpreter_id)}
                    ]
                }
            ]

        }

        var updateObj = {
            job_item_id:  ObjectId("000000000000000000000000"),
            interpreter_id: ObjectId(interpreter_id),
            from_id: logindata._id,
            to_id: ObjectId(interpreter_id),
            chat_type: "normal_message",
            chat_module: "onetoone"
        }

        var tempId = "000000000000000000000000";


        Conversion.findOneAndUpdate(qry, {
            $set: updateObj
        }, {
            new: true,
            upsert: true
        })
            .exec(function(err, conversations) {
                if (err) return next(err);

                if(conversations && conversations._id){
                    ConversionReply.update({conv_id:conversations._id, to_id:logindata._id}, {$set:{rd_msg: true}}, {multi: true}, function (err, res1) {



                        ConversionReply.find({conv_id:conversations._id})
                            .populate("to_id", "full_name photo blocked_user")
                            .populate("from_id", "full_name photo blocked_user")
                            .populate("conv_id", "job_item_id from_id to_id interpreter_id _id")
                            .sort({
                                created: -1
                            })
                            .skip(skip)
                            .limit(limit)
                            .exec('find', function(err, chats) {
                                if (err) return next(err);



                                if(chats && chats.length){

                                    var loginUser = logindata._id.toString();
                                    var reciverUser = ObjectId(interpreter_id);


                                    /!**** start Check Block**********!/

                                    if(chats[0] && chats[0].from_id && chats[0].from_id.blocked_user && chats[0].from_id.blocked_user.length && chats[0].to_id && chats[0].to_id._id){

                                        chats[0].from_id.blocked_user.forEach(function (v) {

                                            if(v && v.user_id && v.user_id.toString() == chats[0].to_id._id.toString()){
                                                block = true;
                                                blockBy = chats[0].from_id._id;
                                            }

                                        });

                                    }

                                    if(chats[0] && chats[0].to_id && chats[0].to_id.blocked_user && chats[0].to_id.blocked_user.length && chats[0].from_id && chats[0].from_id._id){

                                        chats[0].to_id.blocked_user.forEach(function (v) {

                                            if(v && v.user_id && v.user_id.toString() == chats[0].from_id._id.toString()){
                                                block = true;
                                                blockBy = chats[0].to_id._id;
                                            }

                                        });


                                    }


                                    /!**** End Check Block**********!/


                                    chats.forEach(function (v) {
                                        var login_user_type = v.conv_id.interpreter_id.toString() != logindata._id.toString() ? 'user': 'interpreter';

                                        if(v.from_id._id.toString() == logindata._id.toString()){

                                            var current_user1 = v.to_id;
                                            var current_user_data  = v.to_id;
                                            var login_data = v.from_id;

                                            if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                                var offer_amount = '';
                                                if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                    offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                                }

                                                v.msg =  FUNC.displayChatInformativeMsg(v.type,'you',v.msg,current_user_data.full_name,offer_amount,login_user_type);

                                            }




                                        }else{
                                            var current_user1 = v.from_id;
                                            var current_user_data  = v.from_id;
                                            var login_data = v.to_id;

                                            if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                                var offer_amount = '';
                                                if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                    offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                                }

                                                v.msg =  FUNC.displayChatInformativeMsg(v.type,current_user_data.full_name,v.msg,'you',offer_amount,login_user_type);

                                            }
                                        }

                                        v.conv_id = v.conv_id._id;
                                        var regex = /<br\s*[\/]?>/gi;
                                        v.msg = v.msg && v.msg != "" ? v.msg.replace(regex, "\n") : "";
                                    });


                                    /!*var result = _(chats)
                                        .groupBy(x => new Date(x.modified).toJSON().slice(0,10))
                                        .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                            return x.modified
                                        })}))
                                        .value();*!/

                                    var result = _(chats)
                                        .groupBy(x => moment.unix(x.created).format("YYYY-MM-DD"))
                                        .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                            return x.created
                                        })}))
                                        .value();

                                    User.findOne({
                                        _id: ObjectId(interpreter_id),
                                        is_active: 1
                                    })
                                        .populate("native_languages")
                                        .populate("speaking_languages")
                                        .populate("expertise_list")
                                        .populate("rates.languages")
                                        .populate("city_id")
                                        .populate("country_id")
                                        .exec(function(err, user) {
                                            if (err) return next(err);
                                            var user_details = user.toObject();
                                            var rates_new = user.rates.map(function(obj) {

                                                if (req.user_language != "eng") {

                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name_" + req.user_language]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name_" + req.user_language]
                                                        }]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name"]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name"]
                                                        }]
                                                    }
                                                }
                                            });

                                            var native_new = user.native_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });

                                            var speaking_new = user.speaking_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });

                                            var expertise_new = user.expertise_list.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language],
                                                        heading_id: obj.heading_id
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"],
                                                        heading_id: obj.heading_id
                                                    }
                                                }
                                            });

                                            if (user_details.country_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name"]
                                                    }
                                                }
                                            }

                                            if (user_details.city_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name"]
                                                    }
                                                }
                                            }

                                            user_details.expertise_list = expertise_new || [];
                                            user_details.native_languages = native_new || [];
                                            user_details.speaking_languages = speaking_new || [];
                                            user_details.rates = rates_new || [];
                                            user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                user_details.stripe_added = stripe_added;
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                return res.status(200).json({
                                                    data: {
                                                        conv_id: conversations._id,
                                                        socket_chat_id: logindata._id+"_"+tempId,
                                                        from_id: logindata._id,
                                                        connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                        block:block,
                                                        blockBy: blockBy,
                                                        canBlock: canBlock,
                                                        from_name: logindata.full_name || "",
                                                        chats: result,
                                                        user_details:user_details
                                                    },
                                                    next : chats.length == limit ? true : false,
                                                    max_limit: limit,
                                                    reply: "",
                                                    meta: req.phoneMeta
                                                });
                                            });

                                        })

                                }else{
                                    User.findOne({
                                        _id: ObjectId(interpreter_id),
                                        is_active: 1
                                    })
                                        .populate("native_languages")
                                        .populate("speaking_languages")
                                        .populate("expertise_list")
                                        .populate("rates.languages")
                                        .populate("city_id")
                                        .populate("country_id")
                                        .exec(function(err, user) {
                                            if (err) return next(err);
                                            var user_details = user.toObject();
                                            var rates_new = user.rates.map(function(obj) {

                                                if (req.user_language != "eng") {

                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name_" + req.user_language]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name_" + req.user_language]
                                                        }]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name"]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name"]
                                                        }]
                                                    }
                                                }
                                            });

                                            var native_new = user.native_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });

                                            var speaking_new = user.speaking_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });

                                            var expertise_new = user.expertise_list.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language],
                                                        heading_id: obj.heading_id
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"],
                                                        heading_id: obj.heading_id
                                                    }
                                                }
                                            });

                                            if (user_details.country_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name"]
                                                    }
                                                }
                                            }

                                            if (user_details.city_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name"]
                                                    }
                                                }
                                            }

                                            user_details.expertise_list = expertise_new || [];
                                            user_details.native_languages = native_new || [];
                                            user_details.speaking_languages = speaking_new || [];
                                            user_details.rates = rates_new || [];
                                            user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                user_details.stripe_added = stripe_added;
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                return res.status(200).json({
                                                    data: {
                                                        conv_id: conversations._id,
                                                        socket_chat_id: logindata._id+"_"+tempId,
                                                        from_id: logindata._id,
                                                        connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                        block:block,
                                                        blockBy: blockBy,
                                                        canBlock: canBlock,
                                                        from_name: logindata.full_name || "",
                                                        chats: [],
                                                        user_details:user_details
                                                    },
                                                    next: false,
                                                    max_limit: limit,
                                                    reply: "",
                                                    meta: req.phoneMeta
                                                });
                                            });

                                        })

                                }
                            });
                    })
                }else{
                    return res.status(200).json({
                        data: {},
                        reply: "Unable to proceed request",
                        meta: req.phoneMeta
                    });
                }
            });

    }
}*/

exports.ChatHistory = function (req, res, next) {
    var logindata = req.user_data;

    var interpreter_id = req.params.interpreter_id;
    var job_id =  req.query.job_id && req.query.job_id != '' ? req.query.job_id : '';

    var limit = parseInt(process.env.record_limit);
    var page = (req.query.page != undefined && req.query.page != "") ? parseInt(req.query.page) : 1;
    var skip = parseInt((page - 1) * limit);


    var block = false;
    var blockBy = "";
    var canBlock = true;


    if(job_id && job_id != ''){

        console.log("Job Chat", job_id );

        var qry = {
            job_item_id: ObjectId(job_id),
            $and:[
                {
                    $or:[
                        {from_id: logindata._id},
                        {from_id: ObjectId(interpreter_id)}
                    ]
                },
                {
                    $or:[
                        {to_id: logindata._id},
                        {to_id: ObjectId(interpreter_id)}
                    ]
                }
            ]


        }


        var tempId = job_id.toString();


        Conversion.findOne(qry, function(err, conversations) {
            if (err) return next(err);


            if(conversations && conversations._id){
                ConversionReply.update({conv_id:conversations._id, to_id:logindata._id}, {$set:{rd_msg: true}}, {multi: true}, function (err, res1) {



                    ConversionReply.find({conv_id:conversations._id})
                        .populate("to_id", "full_name photo blocked_user")
                        .populate("from_id", "full_name photo blocked_user")
                        .populate("conv_id", "job_item_id from_id to_id interpreter_id _id")
                        .sort({
                            created: -1
                        })
                        .skip(skip)
                        .limit(limit)
                        .exec('find', function(err, chats) {
                            if (err) return next(err);

                            if(chats && chats.length){

                                var loginUser = logindata._id.toString();
                                var reciverUser = ObjectId(interpreter_id);


                                /**** start Check Block**********/

                                if(chats[0] && chats[0].from_id && chats[0].from_id.blocked_user && chats[0].from_id.blocked_user.length && chats[0].to_id && chats[0].to_id._id){

                                    chats[0].from_id.blocked_user.forEach(function (v) {

                                        if(v && v.user_id && v.user_id.toString() == chats[0].to_id._id.toString()){
                                            block = true;
                                            blockBy = chats[0].from_id._id;
                                        }

                                    });

                                }

                                if(chats[0] && chats[0].to_id && chats[0].to_id.blocked_user && chats[0].to_id.blocked_user.length && chats[0].from_id && chats[0].from_id._id){

                                    chats[0].to_id.blocked_user.forEach(function (v) {

                                        if(v && v.user_id && v.user_id.toString() == chats[0].from_id._id.toString()){
                                            block = true;
                                            blockBy = chats[0].to_id._id;
                                        }

                                    });


                                }


                                /**** End Check Block**********/


                                chats.forEach(function (v) {
                                    var login_user_type = v.conv_id.interpreter_id.toString() != logindata._id.toString() ? 'user': 'interpreter';

                                    if(v.from_id._id.toString() == logindata._id.toString()){

                                        var current_user1 = v.to_id;
                                        var current_user_data  = v.to_id;
                                        var login_data = v.from_id;

                                        if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                            var offer_amount = '';
                                            if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                            }

                                            v.msg =  FUNC.displayChatInformativeMsg(v.type,'you',v.msg,current_user_data.full_name,offer_amount,login_user_type);

                                        }




                                    }else{
                                        var current_user1 = v.from_id;
                                        var current_user_data  = v.from_id;
                                        var login_data = v.to_id;

                                        if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                            var offer_amount = '';
                                            if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                            }

                                            v.msg =  FUNC.displayChatInformativeMsg(v.type,current_user_data.full_name,v.msg,'you',offer_amount,login_user_type);

                                        }
                                    }

                                    v.conv_id = v.conv_id._id;
                                    var regex = /<br\s*[\/]?>/gi;
                                    v.msg = v.msg && v.msg != "" ? v.msg.replace(regex, "\n") : "";
                                });


                                /*var result = _(chats)
                                    .groupBy(x => new Date(x.modified).toJSON().slice(0,10))
                                    .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                        return x.modified
                                    })}))
                                    .value();*/
                                var result = _(chats)
                                    .groupBy(x => moment.unix(x.created).format("YYYY-MM-DD"))
                                    .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                        return x.created
                                    })}))
                                    .value();




                                var tempJobId = job_id && job_id != "" ? ObjectId(job_id): ObjectId("000000000000000000000000");
                                JobRequest.findOne({_id:tempJobId}, function (err, jobData) {

                                    if(err){
                                        if (err) return next(err);
                                    }


                                    if(jobData && jobData._id != "" && jobData._id.toString() !=  "000000000000000000000000" && jobData.proposals && !(_.isEmpty(jobData.proposals))){


                                        var loginUser = logindata._id.toString();
                                        var reciverUser = interpreter_id.toString();



                                        if(jobData.proposals[loginUser] && jobData.proposals[loginUser].offer_accepted){
                                            canBlock = false
                                        }

                                        if(jobData.proposals[reciverUser] && jobData.proposals[reciverUser].offer_accepted){
                                            canBlock = false
                                        }


                                        User.findOne({
                                            _id: ObjectId(interpreter_id),
                                            is_active: 1
                                        }).select({prefecture_id:false})
                                            .populate("native_languages")
                                            .populate("speaking_languages")
                                            .populate("expertise_list")
                                            .populate("rates.languages")
                                            .populate("country_id")
                                            .exec(function(err, user) {
                                                if (err) return next(err);
                                                if (!user) return next(err);
                                                var user_details = user.toObject();
                                                if(user.rates && user.rates.length){
                                                    var rates_new = user.rates.map(function(obj) {

                                                        if (req.user_language != "eng") {

                                                            return {
                                                                _id: obj._id,
                                                                currency: logindata.currency,
                                                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                                languages: [{
                                                                    _id: obj.languages[0]._id,
                                                                    name: obj.languages[0]["name_" + req.user_language]
                                                                }, {
                                                                    _id: obj.languages[1]._id,
                                                                    name: obj.languages[1]["name_" + req.user_language]
                                                                }]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                currency: logindata.currency,
                                                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                                languages: [{
                                                                    _id: obj.languages[0]._id,
                                                                    name: obj.languages[0]["name"]
                                                                }, {
                                                                    _id: obj.languages[1]._id,
                                                                    name: obj.languages[1]["name"]
                                                                }]
                                                            }
                                                        }
                                                    });
                                                }

                                                if(user.native_languages && user.native_languages.length){
                                                    var native_new = user.native_languages.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"]
                                                            }
                                                        }
                                                    });
                                                }

                                                if(user.speaking_languages && user.speaking_languages.length){
                                                    var speaking_new = user.speaking_languages.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"]
                                                            }
                                                        }
                                                    });
                                                }



                                                if(user.expertise_list && user.expertise_list.length){
                                                    var expertise_new = user.expertise_list.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language],
                                                                heading_id: obj.heading_id
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"],
                                                                heading_id: obj.heading_id
                                                            }
                                                        }
                                                    });
                                                }
                                                if (user_details.country_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name"]
                                                        }
                                                    }
                                                }

                                                if (user_details.city_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name"]
                                                        }
                                                    }
                                                }

                                                user_details.expertise_list = expertise_new || [];
                                                user_details.native_languages = native_new || [];
                                                user_details.speaking_languages = speaking_new || [];
                                                user_details.rates = rates_new || [];
                                                user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                    user_details.stripe_added = stripe_added;
                                                    user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                    return res.status(200).json({
                                                        data: {
                                                            conv_id: conversations._id,
                                                            socket_chat_id: logindata._id+"_"+tempId,
                                                            from_id: logindata._id,
                                                            connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                            block:block,
                                                            blockBy: blockBy,
                                                            canBlock: canBlock,
                                                            from_name: logindata.full_name || "",
                                                            chats: result,
                                                            user_details:user_details
                                                        },
                                                        next : chats.length == limit ? true : false,
                                                        max_limit: limit,
                                                        reply: "",
                                                        meta: req.phoneMeta
                                                    });
                                                });

                                            })

                                    }else{
                                        User.findOne({
                                            _id: ObjectId(interpreter_id),
                                            is_active: 1
                                        }).select({prefecture_id:false}).populate("native_languages")
                                            .populate("speaking_languages")
                                            .populate("expertise_list")
                                            .populate("rates.languages")
                                            .populate("country_id")
                                            .exec(function(err, user) {
                                                if (err) return next(err);
                                                if (!user) return next(err);
                                                var user_details = user.toObject();

                                                if(user.rates && user.rates.length){
                                                    var rates_new = user.rates.map(function(obj) {

                                                        if (req.user_language != "eng") {

                                                            return {
                                                                _id: obj._id,
                                                                currency: logindata.currency,
                                                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                                languages: [{
                                                                    _id: obj.languages[0]._id,
                                                                    name: obj.languages[0]["name_" + req.user_language]
                                                                }, {
                                                                    _id: obj.languages[1]._id,
                                                                    name: obj.languages[1]["name_" + req.user_language]
                                                                }]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                currency: logindata.currency,
                                                                fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                                languages: [{
                                                                    _id: obj.languages[0]._id,
                                                                    name: obj.languages[0]["name"]
                                                                }, {
                                                                    _id: obj.languages[1]._id,
                                                                    name: obj.languages[1]["name"]
                                                                }]
                                                            }
                                                        }
                                                    });
                                                }

                                                if(user.native_languages && user.native_languages.length){
                                                    var native_new = user.native_languages.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"]
                                                            }
                                                        }
                                                    });
                                                }

                                                if(user.speaking_languages && user.speaking_languages.length){
                                                    var speaking_new = user.speaking_languages.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language]
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"]
                                                            }
                                                        }
                                                    });
                                                }



                                                if(user.expertise_list && user.expertise_list.length){
                                                    var expertise_new = user.expertise_list.map(function(obj) {
                                                        if (req.user_language != "eng") {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name_" + req.user_language],
                                                                heading_id: obj.heading_id
                                                            }
                                                        } else {
                                                            return {
                                                                _id: obj._id,
                                                                name: obj["name"],
                                                                heading_id: obj.heading_id
                                                            }
                                                        }
                                                    });
                                                }
                                                if (user_details.country_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.country_id = {
                                                            _id: user_details.country_id._id,
                                                            name: user_details.country_id["name"]
                                                        }
                                                    }
                                                }

                                                if (user_details.city_id != undefined) {
                                                    if (req.user_language != "eng") {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        user_details.city_id = {
                                                            _id: user_details.city_id._id,
                                                            name: user_details.city_id["name"]
                                                        }
                                                    }
                                                }

                                                user_details.expertise_list = expertise_new || [];
                                                user_details.native_languages = native_new || [];
                                                user_details.speaking_languages = speaking_new || [];
                                                user_details.rates = rates_new || [];
                                                user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                    user_details.stripe_added = stripe_added;
                                                    user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                    return res.status(200).json({
                                                        data: {
                                                            conv_id: conversations._id,
                                                            socket_chat_id: logindata._id+"_"+tempId,
                                                            from_id: logindata._id,
                                                            connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                            block:block,
                                                            blockBy: blockBy,
                                                            canBlock: canBlock,
                                                            from_name: logindata.full_name || "",
                                                            chats: result,
                                                            user_details:user_details
                                                        },
                                                        next : chats.length == limit ? true : false,
                                                        max_limit: limit,
                                                        reply: "",
                                                        meta: req.phoneMeta
                                                    });
                                                });

                                            })

                                    }

                                })

                            }else{
                                User.findOne({
                                    _id: ObjectId(interpreter_id),
                                    is_active: 1
                                }).select({prefecture_id:false})
                                    .populate("native_languages")
                                    .populate("speaking_languages")
                                    .populate("expertise_list")
                                    .populate("rates.languages")
                                    .populate("country_id")
                                    .exec(function(err, user) {
                                        if (err) return next(err);
                                        if (!user) return next(err);
                                        var user_details = user.toObject();
                                        if(user.rates && user.rates.length){
                                            var rates_new = user.rates.map(function(obj) {

                                                if (req.user_language != "eng") {

                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name_" + req.user_language]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name_" + req.user_language]
                                                        }]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        currency: logindata.currency,
                                                        fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                        languages: [{
                                                            _id: obj.languages[0]._id,
                                                            name: obj.languages[0]["name"]
                                                        }, {
                                                            _id: obj.languages[1]._id,
                                                            name: obj.languages[1]["name"]
                                                        }]
                                                    }
                                                }
                                            });
                                        }

                                        if(user.native_languages && user.native_languages.length){
                                            var native_new = user.native_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });
                                        }

                                        if(user.speaking_languages && user.speaking_languages.length){
                                            var speaking_new = user.speaking_languages.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language]
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"]
                                                    }
                                                }
                                            });
                                        }



                                        if(user.expertise_list && user.expertise_list.length){
                                            var expertise_new = user.expertise_list.map(function(obj) {
                                                if (req.user_language != "eng") {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name_" + req.user_language],
                                                        heading_id: obj.heading_id
                                                    }
                                                } else {
                                                    return {
                                                        _id: obj._id,
                                                        name: obj["name"],
                                                        heading_id: obj.heading_id
                                                    }
                                                }
                                            });
                                        }
                                        if (user_details.country_id != undefined) {
                                            if (req.user_language != "eng") {
                                                user_details.country_id = {
                                                    _id: user_details.country_id._id,
                                                    name: user_details.country_id["name_" + req.user_language]
                                                }
                                            } else {
                                                user_details.country_id = {
                                                    _id: user_details.country_id._id,
                                                    name: user_details.country_id["name"]
                                                }
                                            }
                                        }

                                        if (user_details.city_id != undefined) {
                                            if (req.user_language != "eng") {
                                                user_details.city_id = {
                                                    _id: user_details.city_id._id,
                                                    name: user_details.city_id["name_" + req.user_language]
                                                }
                                            } else {
                                                user_details.city_id = {
                                                    _id: user_details.city_id._id,
                                                    name: user_details.city_id["name"]
                                                }
                                            }
                                        }

                                        user_details.expertise_list = expertise_new || [];
                                        user_details.native_languages = native_new || [];
                                        user_details.speaking_languages = speaking_new || [];
                                        user_details.rates = rates_new || [];
                                        user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                        user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                        user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                        FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                            user_details.stripe_added = stripe_added;
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            return res.status(200).json({
                                                data: {
                                                    conv_id: conversations._id,
                                                    socket_chat_id: logindata._id+"_"+tempId,
                                                    from_id: logindata._id,
                                                    connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                    block:block,
                                                    blockBy: blockBy,
                                                    canBlock: canBlock,
                                                    from_name: logindata.full_name || "",
                                                    chats: [],
                                                    user_details: user_details
                                                },
                                                next: false,
                                                max_limit: limit,
                                                reply: "",
                                                meta: req.phoneMeta
                                            });
                                        });

                                    })

                            }
                        });
                })
            }else{
                return res.status(200).json({
                    data: {},
                    reply: "Unable to proceed request",
                    meta: req.phoneMeta
                });
            }
        });

    }else{

        console.log("Normal", job_id );
        var qry = {
            job_item_id: ObjectId("000000000000000000000000"),
            chat_module: "onetoone",
            $and:[
                {
                    $or:[
                        {from_id: logindata._id},
                        {from_id: ObjectId(interpreter_id)}
                    ]
                },
                {
                    $or:[
                        {to_id: logindata._id},
                        {to_id: ObjectId(interpreter_id)}
                    ]
                }
            ]

        }

        var updateObj = {
            job_item_id:  ObjectId("000000000000000000000000"),
            interpreter_id: ObjectId(interpreter_id),
            from_id: logindata._id,
            to_id: ObjectId(interpreter_id),
            chat_type: "normal_message",
            chat_module: "onetoone"
        }

        var tempId = "000000000000000000000000";


        Conversion.findOneAndUpdate(qry, {
            $set: updateObj
        }, {
            new: true,
            upsert: true
        })
            .exec(function(err, conversations) {
                if (err) return next(err);

                if(conversations && conversations._id){
                    ConversionReply.update({conv_id:conversations._id, to_id:logindata._id}, {$set:{rd_msg: true}}, {multi: true}, function (err, res1) {



                        ConversionReply.find({conv_id:conversations._id})
                            .populate("to_id", "full_name photo blocked_user")
                            .populate("from_id", "full_name photo blocked_user")
                            .populate("conv_id", "job_item_id from_id to_id interpreter_id _id")
                            .sort({
                                created: -1
                            })
                            .skip(skip)
                            .limit(limit)
                            .exec('find', function(err, chats) {
                                if (err) return next(err);



                                if(chats && chats.length){

                                    var loginUser = logindata._id.toString();
                                    var reciverUser = ObjectId(interpreter_id);


                                    /**** start Check Block**********/

                                    if(chats[0] && chats[0].from_id && chats[0].from_id.blocked_user && chats[0].from_id.blocked_user.length && chats[0].to_id && chats[0].to_id._id){

                                        chats[0].from_id.blocked_user.forEach(function (v) {

                                            if(v && v.user_id && v.user_id.toString() == chats[0].to_id._id.toString()){
                                                block = true;
                                                blockBy = chats[0].from_id._id;
                                            }

                                        });

                                    }

                                    if(chats[0] && chats[0].to_id && chats[0].to_id.blocked_user && chats[0].to_id.blocked_user.length && chats[0].from_id && chats[0].from_id._id){

                                        chats[0].to_id.blocked_user.forEach(function (v) {

                                            if(v && v.user_id && v.user_id.toString() == chats[0].from_id._id.toString()){
                                                block = true;
                                                blockBy = chats[0].to_id._id;
                                            }

                                        });


                                    }


                                    /**** End Check Block**********/


                                    chats.forEach(function (v) {
                                        var login_user_type = v.conv_id.interpreter_id.toString() != logindata._id.toString() ? 'user': 'interpreter';

                                        if(v.from_id._id.toString() == logindata._id.toString()){

                                            var current_user1 = v.to_id;
                                            var current_user_data  = v.to_id;
                                            var login_data = v.from_id;

                                            if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                                var offer_amount = '';
                                                if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                    offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                                }

                                                v.msg =  FUNC.displayChatInformativeMsg(v.type,'you',v.msg,current_user_data.full_name,offer_amount,login_user_type);

                                            }




                                        }else{
                                            var current_user1 = v.from_id;
                                            var current_user_data  = v.from_id;
                                            var login_data = v.to_id;

                                            if(v.type &&  v.type!= '' && v.type != 'tip_message'){

                                                var offer_amount = '';
                                                if(v.type == 'amount_updated' || v.type == 'interpreter_appplied'  || v.type == 'job_payment' || v.type == 'tip_amount'){
                                                    offer_amount = FUNC.offer_amount_data(v,login_user_type);
                                                }

                                                v.msg =  FUNC.displayChatInformativeMsg(v.type,current_user_data.full_name,v.msg,'you',offer_amount,login_user_type);

                                            }
                                        }

                                        v.conv_id = v.conv_id._id;
                                        var regex = /<br\s*[\/]?>/gi;
                                        v.msg = v.msg && v.msg != "" ? v.msg.replace(regex, "\n") : "";
                                    });


                                    /*var result = _(chats)
                                        .groupBy(x => new Date(x.modified).toJSON().slice(0,10))
                                        .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                            return x.modified
                                        })}))
                                        .value();*/

                                    var result = _(chats)
                                        .groupBy(x => moment.unix(x.created).format("YYYY-MM-DD"))
                                        .map((value, key) => ({date: key, messages: _.sortBy(value, function (x) {
                                            return x.created
                                        })}))
                                        .value();

                                    User.findOne({
                                        _id: ObjectId(interpreter_id),
                                        is_active: 1
                                    }).select({prefecture_id:false})
                                        .populate("native_languages")
                                        .populate("speaking_languages")
                                        .populate("expertise_list")
                                        .populate("rates.languages")
                                        .populate("country_id")
                                        .exec(function(err, user) {
                                            if (err) return next(err);
                                            if (!user) return next(err);
                                            var user_details = user.toObject();
                                            if(user.rates && user.rates.length){
                                                var rates_new = user.rates.map(function(obj) {

                                                    if (req.user_language != "eng") {

                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name_" + req.user_language]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name_" + req.user_language]
                                                            }]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name"]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name"]
                                                            }]
                                                        }
                                                    }
                                                });
                                            }

                                            if(user.native_languages && user.native_languages.length){
                                                var native_new = user.native_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });
                                            }

                                            if(user.speaking_languages && user.speaking_languages.length){
                                                var speaking_new = user.speaking_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });
                                            }



                                            if(user.expertise_list && user.expertise_list.length){
                                                var expertise_new = user.expertise_list.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language],
                                                            heading_id: obj.heading_id
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"],
                                                            heading_id: obj.heading_id
                                                        }
                                                    }
                                                });
                                            }


                                            if (user_details.country_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name"]
                                                    }
                                                }
                                            }

                                            if (user_details.city_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name"]
                                                    }
                                                }
                                            }

                                            user_details.expertise_list = expertise_new || [];
                                            user_details.native_languages = native_new || [];
                                            user_details.speaking_languages = speaking_new || [];
                                            user_details.rates = rates_new || [];
                                            user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                user_details.stripe_added = stripe_added;
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                return res.status(200).json({
                                                    data: {
                                                        conv_id: conversations._id,
                                                        socket_chat_id: logindata._id+"_"+tempId,
                                                        from_id: logindata._id,
                                                        connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                        block:block,
                                                        blockBy: blockBy,
                                                        canBlock: canBlock,
                                                        from_name: logindata.full_name || "",
                                                        chats: result,
                                                        user_details:user_details
                                                    },
                                                    next : chats.length == limit ? true : false,
                                                    max_limit: limit,
                                                    reply: "",
                                                    meta: req.phoneMeta
                                                });
                                            });

                                        })

                                }else{
                                    User.findOne({
                                        _id: ObjectId(interpreter_id),
                                        is_active: 1
                                    }).select({prefecture_id:false})
                                        .populate("native_languages")
                                        .populate("speaking_languages")
                                        .populate("expertise_list")
                                        .populate("rates.languages")
                                        .populate("country_id")
                                        .exec(function(err, user) {
                                            if (err) return next(err);
                                            if (!user) return next(err);
                                            var user_details = user.toObject();
                                            if(user.rates && user.rates.length){
                                                var rates_new = user.rates.map(function(obj) {

                                                    if (req.user_language != "eng") {

                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name_" + req.user_language]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name_" + req.user_language]
                                                            }]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            currency: logindata.currency,
                                                            fee: FUNC.round_currency(logindata.currency, obj.fee * currency_rates[obj.currency][logindata.currency]),
                                                            languages: [{
                                                                _id: obj.languages[0]._id,
                                                                name: obj.languages[0]["name"]
                                                            }, {
                                                                _id: obj.languages[1]._id,
                                                                name: obj.languages[1]["name"]
                                                            }]
                                                        }
                                                    }
                                                });
                                            }

                                            if(user.native_languages && user.native_languages.length){
                                                var native_new = user.native_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });
                                            }

                                            if(user.speaking_languages && user.speaking_languages.length){
                                                var speaking_new = user.speaking_languages.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language]
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"]
                                                        }
                                                    }
                                                });
                                            }



                                            if(user.expertise_list && user.expertise_list.length){
                                                var expertise_new = user.expertise_list.map(function(obj) {
                                                    if (req.user_language != "eng") {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name_" + req.user_language],
                                                            heading_id: obj.heading_id
                                                        }
                                                    } else {
                                                        return {
                                                            _id: obj._id,
                                                            name: obj["name"],
                                                            heading_id: obj.heading_id
                                                        }
                                                    }
                                                });
                                            }

                                            if (user_details.country_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.country_id = {
                                                        _id: user_details.country_id._id,
                                                        name: user_details.country_id["name"]
                                                    }
                                                }
                                            }

                                            if (user_details.city_id != undefined) {
                                                if (req.user_language != "eng") {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name_" + req.user_language]
                                                    }
                                                } else {
                                                    user_details.city_id = {
                                                        _id: user_details.city_id._id,
                                                        name: user_details.city_id["name"]
                                                    }
                                                }
                                            }

                                            user_details.expertise_list = expertise_new || [];
                                            user_details.native_languages = native_new || [];
                                            user_details.speaking_languages = speaking_new || [];
                                            user_details.rates = rates_new || [];
                                            user_details.min_amount = FUNC.round_currency(logindata.currency, parseFloat(process.env.MIN_CASHOUT_USD) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_amount_credits = FUNC.round_currency(logindata.currency, parseFloat(1) * currency_rates["USD"][logindata.currency]);
                                            user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                            FUNC.check_stripe_added(user_details.stripe, function(err, stripe_added) {
                                                user_details.stripe_added = stripe_added;
                                                user_details.min_rate = FUNC.round_currency(logindata.currency, parseFloat(0.5) * currency_rates["USD"][logindata.currency]);
                                                return res.status(200).json({
                                                    data: {
                                                        conv_id: conversations._id,
                                                        socket_chat_id: logindata._id+"_"+tempId,
                                                        from_id: logindata._id,
                                                        connection_toid: ObjectId(interpreter_id)+"_"+tempId,
                                                        block:block,
                                                        blockBy: blockBy,
                                                        canBlock: canBlock,
                                                        from_name: logindata.full_name || "",
                                                        chats: [],
                                                        user_details:user_details
                                                    },
                                                    next: false,
                                                    max_limit: limit,
                                                    reply: "",
                                                    meta: req.phoneMeta
                                                });
                                            });

                                        })

                                }
                            });
                    })
                }else{
                    return res.status(200).json({
                        data: {},
                        reply: "Unable to proceed request",
                        meta: req.phoneMeta
                    });
                }
            });

    }
}

exports.CheckUnreadMsg = function (req, res, next) {
    var logindata = req.user_data;
    ConversionReply.count({to_id: logindata._id, rd_msg: false}, function (err, countUnreadMsg) {
        if (err) return next(err);
        return res.status(200).json({
            unreadMsg: countUnreadMsg && countUnreadMsg > 0 ? true: false,
            totalUnreadMsg: countUnreadMsg,
            meta: req.phoneMeta
        });

    })
}

exports.AddAvailabilitySchedules = function (req, res, next) {
    var logindata = req.user_data;
    var postData = req.body;

    var weekDay = { "SUN": 0,"MON": 1,"TUE": 2,"WED": 3,"THU": 4,"FRI": 5,"SAT": 6 };

    if(postData && postData.timezone && postData.timezone != "" && postData.schedules && postData.schedules.length){

        UserSchedule.remove({user_id:logindata._id},function (err, chk) {
            var d = new Date();
            postData.scheduleStartDate = moment.unix(parseInt(d.getTime())/1000);
            console.log("postData.scheduleStartDate", postData.scheduleStartDate)
            var temp = postData.scheduleStartDate;
            postData.scheduleEndDate = moment(temp).add(3, 'months');

            User.findOneAndUpdate({
                _id: logindata._id
            }, {
                $set: {
                    timezone: postData.timezone
                }
            }).exec(function(err, updateUser) {
                if (err) {
                    if (err) return next(err);
                } else {
                    var saveArr = [];

                    postData.schedules.forEach(function (v) {
                        var current = postData.scheduleStartDate;
                        var end = postData.scheduleEndDate;
                        var day   = weekDay[v.weekday];
                        var tempArr = [];
                        while (current < end) {
                            var next = moment(nextDay(new Date(current),day));
                            tempArr.push(next);
                            current =  moment(next).add(1, 'days');
                        }

                        tempArr.forEach((d)=>{

                            var tempObj = {};

                            if(req.headers && req.headers['os'] == "ios"){
                                var s = v.start_date_time && v.start_date_time != "" ? parseInt(v.start_date_time)/1000: new Date(d).getTime();
                                var e = v.end_date_time && v.end_date_time != "" ? parseInt(v.end_date_time)/1000: new Date(d).getTime();
                            }else{
                                var s = v.start_date_time && v.start_date_time != "" ? parseInt(v.start_date_time): new Date(d).getTime();
                                var e = v.end_date_time && v.end_date_time != "" ? parseInt(v.end_date_time): new Date(d).getTime();
                            }


                            var new_s = moment(d);



                            new_s.set({hour:moment.unix(s).format("HH"),minute:moment.unix(s).format("mm"),second:0,millisecond:0})
                            new_s.toISOString()
                            new_s.format()

                            var new_e = moment(d);
                            new_e.set({hour:moment.unix(e).format("HH"),minute:moment.unix(e).format("mm"),second:0,millisecond:0})
                            new_e.toISOString()
                            new_e.format()

                            tempObj.user_id = logindata._id;
                            tempObj.weekday = v.weekday;
                            tempObj.date = d;
                            tempObj.start_date_time_utc = new_s;
                            tempObj.end_date_time_utc = new_e;
                            tempObj.start_date_time = v.start_date_time && v.start_date_time != "" ? moment.unix(parseInt(v.start_date_time)): new Date(d);
                            tempObj.end_date_time = v.end_date_time && v.end_date_time != "" ? moment.unix(parseInt(v.end_date_time)): new Date(d);
                            tempObj.start_date_time_string = v.start_date_time_string;
                            tempObj.end_date_time_string = v.end_date_time_string;
                            tempObj.time_zone = postData.timezone;
                            tempObj.is_available = v.is_available;
                            saveArr.push(tempObj);
                        })
                    })

                    UserSchedule.insertMany(saveArr, function (err, data) {
                        if (err) return next(err);

                        //save only show data in user collection
                        var temp = [];
                        var tempData = [];
                        data.forEach((v)=>{
                            if(temp.indexOf(v.weekday) == -1){
                                temp.push(v.weekday);
                                tempData.push(v);
                            }
                        })

                        //Auto online/offile if current time in Interpreters schedules

                        var chkOnOff = tempData.map((item)=>{
                            return item.start_date_time_utc <= parseInt(new Date().getTime())/1000 && parseInt(new Date().getTime())/1000 <= item.end_date_time_utc;
                        });

                        chkOnOff = chkOnOff.indexOf(true) != -1 ? true: false;

                        User.findOneAndUpdate(
                            {_id:logindata._id},
                            {$set:{userActivity:tempData, is_online: chkOnOff}}
                        ).exec(function (err, response) {
                            if (err) return next(err);
                            io.emit('interpreter_status_update', {
                                "user_id": logindata._id.toString(),
                                "is_interpreter_online": chkOnOff
                            });

                            if(chkOnOff){
                                //save online record
                                var NewUserActivity = new UserActivity({
                                    user_id: logindata._id,
                                    is_online: chkOnOff
                                });
                                NewUserActivity.save(function(err, saved_data) {
                                    return res.status(200).json({
                                        data: {},
                                        reply: _d("availability_schedules_added", "Availability schedules successfully added"),
                                        meta: req.phoneMeta
                                    });
                                })
                            }else{
                                UserActivity.find({user_id: logindata._id, is_online: true})
                                    .sort({_id:-1})
                                    .limit(1)
                                    .exec(function (err, rec) {
                                        if(err){
                                            return res.status(200).json({
                                                data: {},
                                                reply: _d("availability_schedules_added", "Availability schedules successfully added"),
                                                meta: req.phoneMeta
                                            });
                                        }
                                        if(rec && rec.length){
                                            UserActivity.update({
                                                _id: rec[0]._id
                                            }, {
                                                $set: {
                                                    is_online: chkOnOff
                                                }
                                            }, function(err, results) {
                                                return res.status(200).json({
                                                    data: {},
                                                    reply: _d("availability_schedules_added", "Availability schedules successfully added"),
                                                    meta: req.phoneMeta
                                                });
                                            })
                                        }else{
                                            return res.status(200).json({
                                                data: {},
                                                reply: _d("availability_schedules_added", "Availability schedules successfully added"),
                                                meta: req.phoneMeta
                                            });
                                        }
                                    })
                            }
                        })
                    })
                }
            })
        })

    }else {
        return res.status(203).json({
            data: {},
            reply: _d("required_fields_missing", "Required Fields are missing"),
            meta: req.phoneMeta
        });
    }
}

exports.getAvailabilitySchedules = function (req, res, next) {
    var logindata = req.user_data;
    if(logindata.userActivity && logindata.userActivity.length){
        logindata.userActivity.forEach((v)=>{
            v.start_date_time_utc = Math.floor(new Date(v.start_date_time_utc).getTime()/1000).toString();
            v.end_date_time_utc = Math.floor(new Date(v.end_date_time_utc).getTime()/1000).toString();
            v.start_date_time = Math.floor(new Date(v.start_date_time).getTime()/1000).toString();
            v.end_date_time = Math.floor(new Date(v.end_date_time).getTime()/1000).toString();
            v.created = Math.floor(new Date(v.created).getTime()/1000).toString();
            v.updated = Math.floor(new Date(v.updated).getTime()/1000).toString();
        })

        var tempObj = {
            timezone: logindata.timezone,
            schedules:logindata.userActivity
        }

        return res.status(200).json({
            data: tempObj,
            reply: "",
            meta: req.phoneMeta
        });

    }else{
        return res.status(200).json({
            data: {
                timezone:"",
                schedules:[
                    {
                        weekday: "SUN",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "MON",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "TUE",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "WED",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "THU",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "FRI",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    },
                    {
                        weekday: "SAT",
                        start_date_time:"",
                        end_date_time:"",
                        is_available: 0,
                        start_date_time_string: "",
                        end_date_time_string:""
                    }
                ]
            },
            reply: "",
            meta: req.phoneMeta
        });
    }
}

exports.getUnAvailabilitySchedules = function (req, res, next) {

    if(req.params.month && req.params.month != "" && req.params.year && req.params.year != ""){
        var current = moment().month(req.params.month).year(req.params.year);
        const startOfMonth = moment(current).startOf('month').toDate();
        const endOfMonth   = moment(current).endOf('month').toDate();
        var logindata = req.user_data;
        UserSchedule.find({
            user_id: logindata._id,
            //is_available: {$in:[0, 2]},
            date : {$gte:startOfMonth , $lte: endOfMonth}
        }).sort({date:1}).exec(function(err, data) {
            if (err) return next(err);
            var temp = [];
            if(data && data.length){
                var mainArr = data;
                mainArr.forEach((item)=>{
                    var tempObj = {
                        "_id": item._id,
                        "updated": item.updated,
                        "created": item.created,
                        "__v": item._v,
                        "user_id": item.user_id,
                        "weekday": item.weekday,
                        "date": item.date,
                        "start_date_time_utc": item.start_date_time_utc,
                        "end_date_time_utc": item.end_date_time_utc,
                        "start_date_time": item.start_date_time,
                        "end_date_time": item.end_date_time,
                        "start_date_time_string": item.start_date_time_string,
                        "end_date_time_string": item.end_date_time_string,
                        "time_zone": item.time_zone,
                        "is_available": item.is_available,
                        "date_string": moment.unix(item.date).format("DD-MM-YYYY"),
                        "unavailable_start_date_time":item.unavailable_start_date_time && item.unavailable_start_date_time != "" ? item.unavailable_start_date_time: "",
                        "unavailable_end_date_time":item.unavailable_end_date_time && item.unavailable_end_date_time != "" ? item.unavailable_end_date_time: "",
                        "unavailable_start_date_time_string":item.unavailable_start_date_time_string && item.unavailable_start_date_time_string != "" ? item.unavailable_start_date_time_string: "",
                        "unavailable_end_date_time_string":item.unavailable_end_date_time_string && item.unavailable_end_date_time_string != "" ? item.unavailable_end_date_time_string: ""
                    };
                    temp.push(tempObj);
                });
            }

            return res.status(200).json({
                data: temp,
                reply: "",
                meta: req.phoneMeta
            });
        });
    }else{
        return res.status(200).json({
            data: [],
            reply: "",
            meta: req.phoneMeta
        });
    }
}

exports.setUnAvailabilitySchedules = function (req, res, next) {
    var logindata = req.user_data;
    var postData = req.body;
    if(!_.isEmpty(postData)){
        //if interpreter not available for fullday
        if(postData && postData.is_available == 0){
            UserSchedule.findOneAndUpdate({_id: ObjectId(postData._id)}, {
                $set: {is_available: postData.is_available, unavailable_start_date_time_string: "", unavailable_end_date_time_string: ""}
            }, {
                new: true
            }).exec(function(err, response) {
                if (err) return next(err);

                var a = moment.unix(response.date).format('MM/DD/YYYY');
                var b = moment().format('MM/DD/YYYY');
                if(moment(a).isSame(b)){
                    User.findOneAndUpdate(
                        {_id:logindata._id},
                        {$set:{is_online: false}}
                    ).exec(function (err, response) {
                        if (err) return next(err);
                        io.emit('interpreter_status_update', {
                            "user_id": logindata._id.toString(),
                            "is_interpreter_online": false
                        });
                        UserActivity.find({user_id: logindata._id, is_online: true})
                            .sort({_id:-1})
                            .limit(1)
                            .exec(function (err, rec) {
                                if(err){
                                    return res.status(200).json({
                                        data: {},
                                        reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                        meta: req.phoneMeta
                                    });
                                }
                                if(rec && rec.length){
                                    UserActivity.update({
                                        _id: rec[0]._id
                                    }, {
                                        $set: {
                                            is_online: false
                                        }
                                    }, function(err, results) {
                                        return res.status(200).json({
                                            data: {},
                                            reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                            meta: req.phoneMeta
                                        });
                                    })
                                }else{
                                    return res.status(200).json({
                                        data: {},
                                        reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                        meta: req.phoneMeta
                                    });
                                }
                            })
                    });
                }else{
                    return res.status(200).json({
                        data: {},
                        reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                        meta: req.phoneMeta
                    });
                }
            });
        }else{
            //if interpreter available for partial day

            if(postData._id && postData._id != ""){

                UserSchedule.findOne({_id: ObjectId(postData._id)},function (err, chkData) {
                    if(err) return next(err);
                    if(chkData && (chkData.is_available == 1 || chkData.is_available == 2)){

                        if(req.headers && req.headers['os'] == "ios"){
                            var s = parseInt(postData.unavailable_start_date_time)/1000;
                            var e = parseInt(postData.unavailable_end_date_time)/1000;

                            var new_s = moment(parseInt(postData.date)*1000);
                            new_s.set({hour:moment.unix(s).format("HH"),minute:moment.unix(s).format("mm"),second:0,millisecond:0})
                            new_s.toISOString()
                            new_s.format()


                            var new_e = moment(parseInt(postData.date)*1000);
                            new_e.set({hour:moment.unix(e).format("HH"),minute:moment.unix(e).format("mm"),second:0,millisecond:0})
                            new_e.toISOString()
                            new_e.format()
                        }else{
                            var new_s = moment(parseInt(postData.date));
                            new_s.set({hour:moment.unix(parseInt(postData.unavailable_start_date_time)).format("HH"),minute:moment.unix(parseInt(postData.unavailable_start_date_time)).format("mm"),second:0,millisecond:0})
                            new_s.toISOString()
                            new_s.format()

                            var new_e = moment(parseInt(postData.date));
                            new_e.set({hour:moment.unix(parseInt(postData.unavailable_end_date_time)).format("HH"),minute:moment.unix(parseInt(postData.unavailable_end_date_time)).format("mm"),second:0,millisecond:0})
                            new_e.toISOString()
                            new_e.format()
                        }


                        UserSchedule.findOneAndUpdate({_id: ObjectId(postData._id)}, {
                            $set: {
                                unavailable_start_date_time_utc: new_s,
                                unavailable_end_date_time_utc: new_e,
                                unavailable_start_date_time: new_s,
                                unavailable_end_date_time: new_e,
                                unavailable_start_date_time_string: postData.unavailable_start_date_time_string,
                                unavailable_end_date_time_string: postData.unavailable_end_date_time_string,
                                is_available: postData.is_available
                            }
                        }, {
                            new: true
                        }).exec(function(err, response) {
                            if (err) return next(err);

                            var chk = response.unavailable_start_date_time/1000 <= parseInt(new Date().getTime())/1000 && parseInt(new Date().getTime())/1000 <= response.unavailable_end_date_time/1000;
                            if(chk){

                                User.findOneAndUpdate(
                                    {_id:logindata._id},
                                    {$set:{is_online: false}}
                                ).exec(function (err, response) {
                                    if (err) return next(err);
                                    io.emit('interpreter_status_update', {
                                        "user_id": logindata._id.toString(),
                                        "is_interpreter_online": false
                                    });
                                    UserActivity.find({user_id: logindata._id, is_online: true})
                                        .sort({_id:-1})
                                        .limit(1)
                                        .exec(function (err, rec) {
                                            if(err){
                                                return res.status(200).json({
                                                    data: {},
                                                    reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                                    meta: req.phoneMeta
                                                });
                                            }
                                            if(rec && rec.length){
                                                UserActivity.update({
                                                    _id: rec[0]._id
                                                }, {
                                                    $set: {
                                                        is_online: false
                                                    }
                                                }, function(err, results) {
                                                    return res.status(200).json({
                                                        data: {},
                                                        reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                                        meta: req.phoneMeta
                                                    });
                                                })
                                            }else{
                                                return res.status(200).json({
                                                    data: {},
                                                    reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                                    meta: req.phoneMeta
                                                });
                                            }
                                        })
                                });

                                return res.status(200).json({
                                    data: {},
                                    reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                    meta: req.phoneMeta
                                });

                            }else{
                                return res.status(200).json({
                                    data: {},
                                    reply: _d("availability_schedules_updated", "Availability schedules successfully updated"),
                                    meta: req.phoneMeta
                                });
                            }
                        });
                    }else{
                        return res.status(203).json({
                            data: {},
                            reply: _d("not_perform_those_action", "You couldn't perform that action. First you need to be available for this date."),
                            meta: req.phoneMeta
                        });
                    }
                })

            }else{
                //if interpreter set unavailable date which is not in DB
                return res.status(203).json({
                    data: {},
                    reply: _d("something_went_wrong", "Something went wrong."),
                    meta: req.phoneMeta
                });
            }

        }
    }else{
        return res.status(203).json({
            data: {},
            reply: _d("required_fields_missing", "Required Fields are missing"),
            meta: req.phoneMeta
        });
    }

}

exports.ExportToXls = function (req, res, next) {
    /*User.find({$or:[{"email": /yopmail/}, {"email": /mailinator/},{email:{$in:["mecituzun@yahoo.com", "uzun.mecit@washing.com" ,"sumitdheeman@gmail.com","sumitdhiman.dhiman088@gmail.com","sumit.d@konstantinfosolutions.com"]}}]})
        .select({_id:1})
        .exec((err, userData)=>{
            if (err) return next(err);
            console.log(userData.length);
            userData = userData.map((v)=>{
                return v._id;
            });
            console.log(userData);
            Call.find({call_to:{$nin:userData}, user_id:{$nin:userData}})
                .select({
                    user_id: 1,
                    call_to: 1,
                    languages: 1,
                    created: 1,
                    currency: 1,
                    status: 1,
                    duration: 1,
                    fee: 1,
                    credits: 1,
                    call_type:1,
                    ping_sent: 1
                })
                .sort({
                    created: -1
                })
                .populate("user_id", "full_name photo _id user_no")
                .populate("call_to", "full_name photo _id user_no")
                .populate("languages")
                .exec('find', function(err, calls) {
                    if (err) return next(err);

                    if(calls.length){

                        var to = _d("TO", "To");
                        var toUserNo = _d("TOUSERNO", "To User No");
                        var From = _d("FROM", "From");
                        var fromUserNo = _d("FROMUSERNO", "FROM User No");
                        var CallType = _d("CALL_TYPE", "Call Type");
                        var Status = _d("STATUS", "Status");
                        var CallCost = _d("CALL_COST", "Call Cost");
                        var Currency = _d("CURRENCY", "Currency");
                        var Duration = _d("DURATION", "Duration");
                        var LanguagePair = _d("LANG_PAIR", "Language Pair");
                        var DateT = _d("DATE", "Date");

                        var newArr = [];
                        calls.forEach(function (v) {

                            var durations = 0;
                            if(v.duration && v.duration != ""){
                                var sec = parseInt(v.duration);
                                var h = Math.floor(sec / 3600);
                                var m = Math.floor(sec % 3600 / 60);
                                var s = Math.floor(sec % 3600 % 60);

                                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                                durations = hDisplay + mDisplay + sDisplay;
                            }else{
                                durations = "0 second"
                            }

                            var status = v.status == "completed" ? "Completed" : v.status == "busy" ? "Busy" : v.status == "no-answer" ? "No answer" : v.status == "in-progress" ? "In Progress" : "No answer";


                            var tempObj = {};
                            tempObj[to] =  v.call_to && v.call_to.full_name ?  v.call_to.full_name : "";
                            tempObj[toUserNo] =  v.call_to && v.call_to.user_no ?  v.call_to.user_no : "";
                            tempObj[From] = v.user_id && v.user_id.full_name ? v.user_id.full_name : "";
                            tempObj[fromUserNo] =  v.user_id && v.user_id.user_no ?  v.user_id.user_no : "";
                            tempObj[CallType] = v.call_type;
                            tempObj[Status] = status;
                            /!*tempObj[CallCost] = v.fee;
                            tempObj[Currency] = v.currency;*!/
                            tempObj[Duration] = durations;
                            tempObj[LanguagePair] = v.languages[0].name + ", " +v.languages[1].name;
                            tempObj[DateT] = moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss");

                            newArr.push(tempObj);
                        });

                        var xls = json2xls(newArr);
                        fs.writeFile(process.env.MEDIA_UPLOAD_PATH + 'call_logs.xlsx', xls,'binary', function (err) {
                            if (err) {
                                throw err;
                            }
                            else {
                                var path = require('path');
                                var mime = require('mime');

                                var file = process.env.MEDIA_UPLOAD_PATH + 'call_logs.xlsx';

                                var filename = path.basename(file);
                                var mimetype = mime.lookup(file);

                                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                                res.setHeader('Content-type', mimetype);

                                var filestream = fs.createReadStream(file);
                                filestream.pipe(res);
                            }
                        })
                    }else{
                        return res.status(200).json({
                            reply: _d("data_not_found", "No data found"),
                            meta: req.phoneMeta
                        });
                    }

                });

        })
    User.find({})
        .populate("native_languages")
        .populate("speaking_languages")
        .populate("expertise_list")
        .populate("country_id")
        .exec(function(err, users) {
            if (err) return next(err);
            var newArr = [];
            users.forEach(function (v) {

                var lang = "";
                if(v.native_languages && v.native_languages.length){
                    lang = v.native_languages.map((v)=>{
                        return v.name
                    });
                    lang = lang.toString();
                }

                var slang = "";
                if(v.speaking_languages && v.speaking_languages.length){
                    slang = v.speaking_languages.map((v)=>{
                        return v.name
                    });
                    slang = slang.toString();
                }

                var expertise = "";
                if(v.expertise_list && v.expertise_list.length){
                    expertise = v.expertise_list.map((v)=>{
                        return v.name
                    });
                    expertise = expertise.toString();
                }

                var tmpObj = {
                    "_id": v._id,
                    "User No": v.user_no,
                    "Name": v.full_name,
                    "Gender": v.gender,
                    "Country":v.country_id && v.country_id.name ? v.country_id.name : "",
                    "Native languages":lang,
                    "speaking_languages":slang,
                    "expertise_list": expertise,
                    "User Type": v.user_type,
                    "Is Interpreter": v.is_interpreter ? "Yes" : "No",
                    "Sign Up Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss")
                }
                newArr.push(tmpObj);
            })

            var xls = json2xls(newArr);
            fs.writeFile(process.env.MEDIA_UPLOAD_PATH + 'users.xlsx', xls,'binary', function (err) {
                if (err) {
                    throw err;
                }
                else {
                    var path = require('path');
                    var mime = require('mime');

                    var file = process.env.MEDIA_UPLOAD_PATH + 'users.xlsx';

                    var filename = path.basename(file);
                    var mimetype = mime.lookup(file);

                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);

                    var filestream = fs.createReadStream(file);
                    filestream.pipe(res);
                }
            })


        });*/

    /*Language.find({
        is_deleted: false
    }, {}, {
        sort: {
            "name": 1
        }
    }, function(err, languages) {
            User.find({$or:[{"email": {$not:/yopmail/}}, {"email": {$not:/mailinator/}},{email:{$nin:["mecituzun@yahoo.com", "uzun.mecit@washing.com" ,"sumitdheeman@gmail.com","sumitdhiman.dhiman088@gmail.com","sumit.d@konstantinfosolutions.com"]}}]})
            .exec(function(err, users) {
                if (err) return next(err);

                var newArr = [];
                async.map(users,function (v, cb) {

                    Transaction.count({user_id:v._id}, function (err, count1) {
                        /!*Call.count({user_id:v._id},function (err, count) {
                            var tmpObj = {
                                "Client Id": v.user_no,
                                "Registration Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss"),
                                "Purchase Credits": count1 > 0 ? "Yes" : "No",
                                "No of Calls": count
                            }
                            newArr.push(tmpObj);
                            cb(null, null)
                        })*!/
                        Call.aggregate([
                            {
                                $match:{
                                    user_id:v._id
                                }
                            },{
                                $group:{
                                    _id:"$languages",
                                    total:{$sum:1}
                                }
                            }
                        ],function (err, rec) {
                            if(rec && rec.length){
                                rec.forEach(function (r) {

                                    var getLangName0 = languages.filter((l)=>{
                                        return l._id.toString() == r._id[0].toString();
                                    })
                                    if(getLangName0 && getLangName0.length){
                                        getLangName0 = getLangName0[0].name
                                    }else{
                                        getLangName0 = "";
                                    }
                                    var getLangName1 = languages.filter((l)=>{
                                        return l._id.toString() == r._id[1].toString();
                                    })

                                    if(getLangName1 && getLangName1.length){
                                        getLangName1 = getLangName1[0].name
                                    }else{
                                        getLangName1 = "";
                                    }

                                    var tmpObj = {
                                        "Client Id": v.user_no,
                                        "Registration Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss"),
                                        "Purchase Credits": count1 > 0 ? "Yes" : "No",
                                        "No of Calls": r.total,
                                        "language pair": getLangName0 + ", "+ getLangName1
                                    }
                                    newArr.push(tmpObj);
                                });

                                cb(null, null)
                            }else{
                                var tmpObj = {
                                    "Client Id": v.user_no,
                                    "Registration Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss"),
                                    "Purchase Credits": count1 > 0 ? "Yes" : "No",
                                    "No of Calls": 0,
                                    "language pair": ""
                                }
                                newArr.push(tmpObj);
                                cb(null, null)
                            }

                        })
                    })


                }, function (err, data) {

                    var xls = json2xls(newArr);
                    fs.writeFile(process.env.MEDIA_UPLOAD_PATH + 'users.xlsx', xls,'binary', function (err) {
                        if (err) {
                            throw err;
                        }
                        else {
                            var path = require('path');
                            var mime = require('mime');

                            var file = process.env.MEDIA_UPLOAD_PATH + 'users.xlsx';

                            var filename = path.basename(file);
                            var mimetype = mime.lookup(file);

                            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                            res.setHeader('Content-type', mimetype);

                            var filestream = fs.createReadStream(file);
                            filestream.pipe(res);
                        }
                    })

                })

            });
    })*/
    /* User.find({$or:[{"email": {$not:/yopmail/}}, {"email": {$not:/mailinator/}},{email:{$nin:["mecituzun@yahoo.com", "uzun.mecit@washing.com" ,"sumitdheeman@gmail.com","sumitdhiman.dhiman088@gmail.com","sumit.d@konstantinfosolutions.com"]}}]})
         .exec(function(err, users) {
             if (err) return next(err);

             var newArr = [];
             async.map(users,function (v, cb) {

                 Transaction.aggregate([
                         {
                             $match:{
                                 user_id:v._id
                             }
                         },{
                             $group:{
                                 _id:"$user_id",
                                 total:{$sum:1},
                                 data:{
                                     $push:"$$ROOT"
                                 }
                             }
                         }
                     ],function (err, rec) {
                     //console.log("rec==>", rec)
                         if(rec && rec[0] && rec[0].data && rec[0].data.length){
                             rec[0].data.forEach(function (r) {

                                 var tmpObj = {
                                     "Client Id": v.user_no,
                                     "Registration Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss"),
                                     "Purchase Credits": "Yes",
                                     "Amount": r.amount,
                                     "Currency": r.currency,
                                     "Gateway": r.gateway,
                                     "Status": r.status,
                                     "type": r.type,
                                     "Purchase Credits Date": moment(r.created).format("MM-DD-YYYY hh:mm:ss"),
                                 }
                                 newArr.push(tmpObj);
                             });
                             cb(null, null)
                         }else{
                             var tmpObj = {
                                 "Client Id": v.user_no,
                                 "Registration Date": moment.unix(v.created).format("MM-DD-YYYY hh:mm:ss"),
                                 "Purchase Credits": "No",
                                 "Amount": "",
                                 "Currency": "",
                                 "Gateway": "",
                                 "Status": "",
                                 "type": "",
                                 "Purchase Credits Date": ""
                             }
                             newArr.push(tmpObj);
                             cb(null, null)
                         }

                     })


             }, function (err, data) {

                 var xls = json2xls(newArr);
                 fs.writeFile(process.env.MEDIA_UPLOAD_PATH + 'users_purchase_history.xlsx', xls,'binary', function (err) {
                     if (err) {
                         throw err;
                     }
                     else {
                         var path = require('path');
                         var mime = require('mime');

                         var file = process.env.MEDIA_UPLOAD_PATH + 'users_purchase_history.xlsx';

                         var filename = path.basename(file);
                         var mimetype = mime.lookup(file);

                         res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                         res.setHeader('Content-type', mimetype);

                         var filestream = fs.createReadStream(file);
                         filestream.pipe(res);
                     }
                 })

             })

         });*/

    Language.find({
        is_deleted: false
    }, {}, {
        sort: {
            "name": 1
        }
    }, function(err, languages) {
        User.aggregate([
            {
                $match:{
                    "is_interpreter":true,
                    "is_active":true,
                    "is_selfdelete":{"$ne":true},
                    "job_types":"on_call",
                    "rates.fee":{"$gt":0},
                    "rates":{
                        "$elemMatch":{"$or":[{"languages":ObjectId("59a3c559891d70748ead0e7a")},{"languages":ObjectId("59a3c559891d70748ead0e7a")}],"fee":{"$gt":0}}
                    }
                }
            },
            {
                $unwind: "$rates"
            }, {
                "$match": {
                    $and: [{
                        "rates.languages": ObjectId("59a3c559891d70748ead0e7a")
                    }, {
                        "rates.languages": ObjectId("59a3c559891d70748ead0e7a")
                    }],
                    "rates.fee": {
                        $gt: 0
                    }
                }
            },{
                $project:{
                    "full_name":1,"email":1,"rates":1
                }
            }
        ], function (err, rec) {


            var newArr = [];
            if(rec &&  rec.length){
                rec.forEach(function (r) {

                    var lang = r.rates.languages.map((v)=>{
                        return v.toString();
                    });
                    console.log("lang", lang)
                    var idx = lang.indexOf("59a3c559891d70748ead0e7a");
                    console.log("idx", idx)
                    if(idx != -1){
                        lang.splice(idx,1)
                    }
                    console.log("lang", lang)
                    var getLangName1 = languages.filter((l)=>{
                        return l._id.toString() == lang[0].toString();
                    })
                    console.log("getLangName1", getLangName1)

                    var tmpObj = {
                        "Name": r.full_name,
                        "Email": r.email,
                        "Language":getLangName1[0].name,
                        "Rate": r.rates.currency == "JPY" ? r.rates.fee :r.rates.fee*currency_rates[r.rates.currency]["JPY"],
                        //"Rate": r.rates.fee,
                        "Currency":"JPY"
                    }
                    newArr.push(tmpObj);
                });

                console.log("newArr", newArr)

                var xls = json2xls(newArr);
                fs.writeFile(process.env.MEDIA_UPLOAD_PATH + 'jap_interpreters.xlsx', xls,'binary', function (err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        var path = require('path');
                        var mime = require('mime');

                        var file = process.env.MEDIA_UPLOAD_PATH + 'jap_interpreters.xlsx';

                        var filename = path.basename(file);
                        var mimetype = mime.lookup(file);

                        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                        res.setHeader('Content-type', mimetype);

                        var filestream = fs.createReadStream(file);
                        filestream.pipe(res);
                    }
                })
            }

        })
    })
}

function nextDay(d, dow){
d.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
return d;
}

exports.postFeedback = function (req, res, next) {
var logindata = req.user_data;
var postData = req.body;
FUNC.sendMailDB("feedback-bug-report", 'en', [process.env.SUPPORT_MAIL, "zocchetti.andrea@washing.com"], {
    APP:"C2C",
    FROM: logindata.full_name,
    EMAIL: logindata.email,
    DATE: moment.unix(parseInt(new Date().getTime())/1000).utcOffset("+09:00").format("MM-DD-YYYY hh:mm:ss A"),
    COMMENT: postData.comment,
    DEVICE_DETAIL: postData.device_detail
}, function(err) { })

return res.status(200).json({
    data: {},
    reply: _d("feedback_submitted", "Feedback submitted successfully"),
    meta: req.phoneMeta
});

}

/*
exports.testRoute =  function(req, res, next) {
    var file = 'calls/CA00106c1fc099036c2740d40ae1045427.wav';
    //console.log('Trying to download file', fileKey);

    var s3 = new AWS.S3({});

    var options = {
        Bucket: 'washingrecordings',
        Key: file,
    };

    s3.getObject(options, function (err, data) {
        console.log(err);
        console.log(data);
        res.attachment(file);
        res.send(data.Body);
    });
}*/
