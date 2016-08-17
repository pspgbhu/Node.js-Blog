var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//储存用户信息
User.prototype.save = function (callback) {
	//要储存的信息
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};
	//开打数据库
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);//错误，返回err信息
		}
		//读取users集合
		db.collection('users',function (err, collection) {
			if(err){
				mongodb.close();
				return callback(err)//返回err信息
			}
			//将用户数据插入users集合
			collection.insert(user,{
				safe: true
			},function (err, user) {
				mongodb.close();
				if(err){
					return callback(err);//return err message
				}
				callback(null,user[0]);//success! err is null,and return doc which saved.
			});
		});
	});
};

//read uesr messages
User.get = function (name, callback) {
	//open database
	mongodb.open(function (err, db) {
		if(err){
			return callback(err);//error! return err message
		}
		//read users 集合
		db.collection('users',function (err, collection) {
			if(err){
				mongodb.close();
				return callback(err);
			}
			//query the doc which the value of username(key:name) be named name
			collection.findOne({
				name: name
			},function (err, user) {
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, user);//success! return user messages 
			});
		});
	});
};