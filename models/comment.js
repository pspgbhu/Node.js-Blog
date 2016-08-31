var mongodb = require('./db');

function Comment(day, title, comment) {
	this.day = day;
	this.title = title;
	this.comment = comment;
}

module.exports = Comment;


Comment.prototype.save = function (callback) {
	var day = this.day,
			title = this.title,
			comment = this.comment;

	mongodb.open(function (err, db) {
		if(err){
			mongodb.close();
			return callback(err);
		};

		db.collection('posts',function (err, collection) {
			if(err){
				mongodb.close();
				return callback(err);
			};

			collection.update({
				"time.day": day,
				"title": title,
			},{
				$push:{"comments": comment}
			},function (err) {
				mongodb.close();
				if(err){
					return callback(err);
				};
				callback(null);
			});
			
		});
	});
};