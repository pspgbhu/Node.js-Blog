var mongodb = require('./db');

function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

Post.prototype.save = function (callback) {
	//储存各种时间，方便以后拓展
	var date = new Date();
	var time = {
		date: date,
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  };
  //要存入数据库的文档
  var post = {
  	name: this.name,
  	time: time,
  	title: this.title,
  	post: this.post
  };
  //打开数据库
  mongodb.open(function (err, db) {
  	if(err){
  		return callback(err);
  	}
  	//读取posts集合
  	db.collection('posts',function (err, collection) {
  		if(err){
  			mongodb.close();
  			return callback(err);
  		}
  		//将文档插入posts集合
  		collection.insert(post,{
  			safa: true
  		},function (err) {
  			mongodb.close();
  			if(err){
  				return callback(err);
  			}
  			callback(null);
  		});
  	});
  });
};

//读取文章及其相关信息
Post.get =function (name, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);
		}
		//读取posts集合
		db.collection('posts',function (err, collection) {
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			//跟据query对象查找文章
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
				mongodb.close();
				if(err){
					return callback(err);
				};
				callback(null, docs);
			})
		});
	});
};
