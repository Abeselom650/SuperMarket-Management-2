// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("stud");
db.personal.insertMany([{name:"abslam" , age:30},{name:"jane" , age:25},{name:"ficker",age=20"},{name:"raj",age=30} , age:35}]);
db.personal.updateOne({name:"abslam"},{$set:{age:20}});
db.personal.deleteOne({name:"jane"});
db.personal.find({});
