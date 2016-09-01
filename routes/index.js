var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var	User = require('../models/user.js');
var Post = require('../models/post.js');
var Comment = require('../models/comment.js')


/* index page */
router.get('/',function (req, res, next) {
	res.render('index', {title: 'pspgbhu的主页'});
})


/* home page. */
router.get('/home', function(req, res, next) {
	var page = parseInt(req.query.p) || 1;
	var sortWay = "time";
	Post.getSome(null, page, sortWay, null,function (err, posts, total) {
		if(err){
			posts = [];
		}
		res.render('home', {
			title: '主页',
			user: req.session.user,
			posts: posts,
			page: page,
			isFirstPage: (page - 1) == 0,
			isLastPage:((page - 1) * 10 + posts.length) == total,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});


/* blog page. */
router.get('/blog',function (req, res, next) {
	var page 		= parseInt(req.query.p) || 1;
	var sortWay = "time";
	var search 	= null;
	
  if(req.query.rank) {
		sortWay = req.query.rank;
	}
	if(req.query.search) {
    search = req.query.search;
  }

	Post.getSome(null, page, sortWay, search,function (err, posts, total) {
		if(err){
			posts = [];
		}
		res.render('blog', {
			title: '主页',
			user: req.session.user,
      search: search,
			posts: posts,
			page: page,
			isFirstPage: (page - 1) == 0,
			isLastPage:((page - 1) * 10 + posts.length) == total,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
})


// /* user */
// router.get('/u/:name', function (req, res) {
// 	User.get(req.params.name, function (err, user) {
// 		if(!user){
// 			req.flash('error', '用户不存在！');
// 			return res.redirect('/');
// 		}
// 		Post.getSome(user.name, page, function (err, posts, total) {
// 			if(err){
// 				req.flash('error', err);
// 				return res.redirect('/');
// 			}
// 			res.render('user', {
// 				title: user.name,
// 				posts: posts,
// 				user : req.session.user,
// 				page: page,
//         isFirstPage: (page - 1) == 0,
//         isLastPage: ((page - 1) * 10 + posts.length) == total,
// 				success: req.flash('success').toString(),
// 				error: req.flash('error').toString()
// 			});
// 		});
// 	});
// });


/* article page */
router.post('/:day/:title',function (req, res) {
	var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

	var comment = {
		"name": req.body.visitorName,
		"email": req.body.visitorEmail,
		"time": time,
		"content": req.body.visitorContent
	}

	var newComment = new Comment(req.params.day, req.params.title, comment);

	newComment.save(function (err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		req.flash('success', '留言成功！');
		return res.redirect('back');
	});
});

router.get('/:day/:title', function (req, res) {
	Post.getOne(req.params.day, req.params.title, function (err, post) {
		if(err){
			req.flash('error', err);
			return res.redirect('/blog')
		}
		res.render('article',{
			title: req.params.title,
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});


/* about page. */
router.get('/about',function (req, res, next) {
	res.render('about', {
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
})


/*
****************************************
*/


/* login page. */
router.get('/login',function (req, res, next) {
	res.render('login',{ 
		title: '登录',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
});

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
    res.redirect('/blog');//登陆成功后跳转到主页
  });
});


/* logout page. */
router.get('/logout',function (req, res, next) {
	req.session.user = null;
	req.flash('success',"登出成功！");
	res.redirect('/')
});


/* reg page. */
router.get('/reg',function (req, res, next) {
	res.render('reg', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
});

router.post('/reg',function (req, res) {
	var name = req.body.name,
			password = req.body.password,
			password_re = req.body.passwordrepeat;
			email = req.body.email
	//检验用户名密码是否为空
	if(name === "" || password === "" || name === null || password === null ){
		req.flash('error','用户名或密码不能为空！')
		return res.redirect('/reg');
	};
	//检验邮箱是否为空
	if(email === "" || email === null){
		req.flash('error','请输入正确的邮箱地址！')
		return res.redirect('/reg');
	}
	//检验两次密码是否一致
	if(password != password_re){
		req.flash('error','两次输入的密码不一致！');
		return res.redirect('/reg');//返回注册页
	};
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
router.get('/post',function (req, res, next) {
	res.render('post',{ 
		title: '发表',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	})
})

router.post('/post',function (req, res) {
	var currentUser = req.session.user;
	var title = req.body.title;
	var article = req.body.post;
	var post = new Post(currentUser.name, title, article);
	if(title ==="" || article ==="" || title === null || article === null){
		req.flash('error','标题或正文不能为空！')
		res.redirect('/post');
	}else{
		post.save(function (err) {
			if(err){
				req.flash('error', err)
				return res.redirect('/')
			}
			req.flash('success','发表成功！')
			res.redirect('/blog');
		});
	}
});


/* upload page. */
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
});
router.post('/upload', upload.single('file'), function (req, res, next) {
	res.json({
		code : 200,
		data : {
			headersHost: req.headers.host,
			name: req.file.originalname
		}
	})
});


/* edit page. */
router.get('/edit/:name/:day/:title', function (req, res){
	var currentUser = req.session.user;
	Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
		if(err){
			req.flash('error',err);
			return res.redirect('back');
		};
		res.render('edit',{
			title: '编辑',
			post: post,
			name: post.name,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
});

router.post('/edit/:name/:day/:title',function (req, res) {
	var currentUser = req.session.user;
	Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
		var url = encodeURI('/' + req.params.day + '/' + req.params.title)
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}
		req.flash('success','修改成功！')
		return res.redirect(url);
	})
})


/* remove page. */
router.get('/remove/:name/:day/:title',function (req, res) {
	var currentUser = req.session.user;
	Post.remove(req.params.name, req.params.day, req.params.title, function (err) {
		if(err){
			req.flash('error', err);
			return res.redirect('back');
		};
		req.flash('success','删除成功！')
		res.redirect('/');
	});
});



// function checkLogin(req, res, next) {
// 	if(req.session.user){
// 		req.flash('error', '已登录！');
// 		res.redirect('back');
// 	}
// 	next();
// }


// function checkLogout(req, res, next) {
// 	if(!req.session.user){
// 		req.flash('error',"未登录！");
// 		res.redirect('back');
// 	}
// 	next();
// }


module.exports = router;
