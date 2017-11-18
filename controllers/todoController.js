var bodyParser = require('body-parser');
var mongoose =  require('mongoose');

// connect to db
mongoose.connect('mongodb://admin:admin@ds051913.mlab.com:51913/todo');

// create a schema - blueprint
var todoSchema = new mongoose.Schema({
  item:String
});

var Todo = mongoose.model('Todo',todoSchema);
var urlencodedParser = bodyParser.urlencoded({extended:false});


module.exports = function(app){
  app.get('/todo',function(req,res){
    // get data from mongodb and render it to view
    Todo.find({},function(err,data){
      if (err){
        throw err;
      }

      res.render('todo',{todos:data});
    });
  });

  app.post('/todo',urlencodedParser,function(req,res){
    // get data from view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if (err){
        throw err;
      }
      res.json(data);
    })
  });

  app.delete('/todo/:item',function(req,res){
    // delete the reuested item from mongodb
    Todo.find({item:req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
      if(err){
        throw err;
      }
      res.json(data);
    });
  });
};
