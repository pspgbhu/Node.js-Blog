var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var	User = require('../models/user.js');


/* home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: '主页',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

/* login page. */
router.get('/login',checkLogin);
router.get('/login',function (req, res, next) {
	res.render('login',{ 
		title: '登录',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
});

router.post('/login',checkLogin);
router.post('/login',function (req, res) {
	//生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.username, function (err, user) {
  	console.log(req.body.username)
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});


/* reg page. */
router.get('/reg',checkLogin)
router.get('/reg',function (req, res, next) {
	res.render('reg', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
})
router.post('/reg',checkLogin);
router.post('/reg',function (req, res) {
	var name = req.body.name,
		password = req.body.password,
		password_re = req.body.passwordrepeat;
	//检验两次密码是否一致
	if(password != password_re){
		req.flash('error','两次输入的密码不一致！');
		return res.redirect('/');//返回注册页
	}


	//生成密码的md5值
	var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
	});
	//检查用户名是否存在
	User.get(newUser.name, function (err, user){
		if(err) {
			req.flash('error', err);
			return res.redirect('/')
		}
		if(user) {
			req.flash('error','用户已存在！')
			return res.redirect('/reg')
		}
		//如果不存在则新增用户
		newUser.save(function (err, user) {
			if(err){
				req.flash('error', err)
				return res.redirect('/reg')
			}
			req.session.user = newUser;//用户信息存入session
			req.flash('success','注册成功!')
			res.redirect('/');
		})
	})
})

/* post page. */
router.get('/post',checkLogout);
router.get('/post',function (req, res, next) {
	res.render('post',{ 
		title: '发表',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
})

router.post('/post',function (req, res) {
})

/* logout page. */
router.get('/logout',checkLogout);
router.get('/logout',function (req, res, next) {
	req.session.user = null;
	req.flash('success',"登出成功！");
	res.redirect('/')
});

function checkLogin(req, res, next) {
	if(req.session.user){
		req.flash('error', '已登录！');
		res.redirect('back');
	}
	next();
}

function checkLogout(req, res, next) {
	if(!req.session.user){
		req.flash('error',"未登录！");
		res.redirect('back');
	}
	next();
}

module.exports = router;
