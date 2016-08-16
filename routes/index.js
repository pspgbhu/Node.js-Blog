var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var	User = require('../models/user.js');

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index',{ title: '主页'});
});

/* login page. */
router.get('/login',function (req, res, next) {
	res.render('login',{ title: '登录'})
})

router.post('/login',function (req, res) {
})

/* reg page. */
router.get('/reg',function (req, res, next) {
	res.render('reg',{ title: '注册'})
})

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
			//req.flash('error', err);
			// return res.redirect('/')
			return res.send('error')
		}
		if(user) {
			req.flash('error','用户已存在！')
			// return res.redirect('/reg')
			return res.send('已存在')
		}
		//如果不存在则新增用户
		newUser.save(function (err, user) {
			if(err){
				// req.flash('error', err)
				// return res.redirect('/reg')
				return res.send('error2')
			}
			req.session.user = newUser;//用户信息存入session
			req.flash('success','注册成功!')
			res.redirect('/');
		})
	})
})

/* post page. */
router.get('/post',function (req, res, next) {
	res.render('post',{ title: '发表'})
})

router.post('/post',function (req, res) {
})


module.exports = router;
