var mongodb = require('./db');
var markdown = require('markdown').markdown;

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
  	post: this.post,
    comments: []
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

//读取所有文章及其相关信息
Post.getFive =function (name, page,callback) {
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
			collection.count(query,function (err, total) {
        collection.find(query, {
          skip: (page - 1) * 5,
          limit: 5
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if(err){
            return callback(err);
          };
          docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
          });
          callback(null, docs, total);
  			});
			});
		});
	});
};

//获取一篇文章
Post.getOne = function (day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if(err){
      return callback(err);
    }
    //读取posts集合
    db.collection('posts',function (err,collection) {
      //跟据用户名，发表时间及文章名进行查询
      collection.findOne({
        "time.day": day,
        "title": title
      }, function (err, doc) {
        mongodb.close();
        if(err){
          return callback(err);
        };
        if(doc){
          doc.post = markdown.toHTML(doc.post);
          if(doc.comments){
            doc.comments.forEach(function (comment) {
              comment.content = markdown.toHTML(comment.content)
            });
          }
        };
        callback(null, doc);
      });
    });
  });
};

//返回原始发表的内容（markdown 格式）
Post.edit = function (name, day, title, callback) {
  mongodb.open(function (err, db) {
    if(err){
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      },function (err, doc) {
        mongodb.close();
        if(err){
          return callback(err);
        };
        callback(null, doc);
      })
    })
  })
}

//更新一篇文章
Post.update = function (name, day, title, post, callback) {
  mongodb.open(function (err, db) {
    if(err){
      return callback(err);
    }
    db.collection('posts',function (err, collection) {
      if(err){
        return callback(err);
      };
      collection.update({
        "name": name,
        "time.day": day,
        "title": title
      },{
        $set: {post: post}
      },function (err) {
        mongodb.close();
        if(err){
          return callback(err);
        };
        callback(null)
      })
    })
  })
}

//删除一篇文章
Post.remove = function (name, day, title, callback) {
  mongodb.open(function (err, db) {
    if(err){
      return callback(err);
    } 
    db.collection('posts', function (err, collection) {
      if(err){
         return callback(err);
      }
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      },function (err) {
        mongodb.close();
        if(err){
          callback(err);
        };
        callback(null);
      });
    });
  });
};