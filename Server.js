var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
//var mongoOp     =   require("./models/mongo");
//var session     =   require("./models/session");
var jwt         =   require('jsonwebtoken');
var router      =   express.Router();
//var mongoose    =   require('mongoose');
global.config   =   require('./config/config');

var cors = require('cors');
app.use(cors());
/*
var mongoose = require('mongoose')
var conn = mongoose.createConnection('mongodb://localhost/db1');
var conn2 = mongoose.createConnection('mongodb://localhost/db2');
var Schema = new mongoose.Schema({})
var model1 = conn.model('User', Schema);
var model2 = conn2.model('Item', Schema);
model1.find({}, function() {
    console.log("this will print out last");
});
model2.find({}, function() {
    console.log("this will print out first");
});
*/

/*
var mongoose = require('mongoose')
var conn = mongoose.createConnection('mongodb://172.17.0.3:27017/db1');
//var conn2 = mongoose.createConnection('mongodb://localhost/db2');
var Schema = new mongoose.Schema({})
var mongoOp = conn.model('User', Schema);
//var model2 = conn2.model('Item', Schema);
*/



var mongoose    =   require('mongoose');
mongoose.Promise = global.Promise;

//var userdb = mongoose.connect('mongodb://mongodb:27017/MDB');
var userdb = mongoose.createConnection('mongodb://mongodbhost:27017/MDB1');

//var mongoSchema =   userdb.Schema;
var userSchema  = {
    "userEmail" : String,
    "userPassword" : String
};
mongoOp =  userdb.model('userLogin',userSchema);



//var sessiondb = mongoose.connect('mongodb://mongodb:27017/MDB');
var sessiondb = mongoose.createConnection('mongodb://mongodbhost:27017/MDB2');

var mongoSchemaSess =   sessiondb.Schema;
var sessionSchema  = {
    "email" : String,
    "sessionToken" : String
};

session = sessiondb.model('userSession',sessionSchema);




//mongoose.connect('mongodb://localhost:27017/demoDb');
//mongoose.Promise = global.Promise;
//database = mongoose.createConnection('mongodb://mongodbhost:27017/MDB');
//mongoose.connect('mongodb://mongodb:27017/MDB');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


router.post('/logout', function(req, res){
    var data = {
        email: req.body.email,
    };
    session.findOne(data).lean().exec(function(err, db){
        if(err){
            return res.json({error: true});
        }
        if(!db){
            return res.status(404).json({'message':'Session not found!'});
        }
        else{
          session.remove({ "email" : req.body.email },function(err){
              if(err) {
                  response = {"error" : true,"message" : "Error deleting data"};
              } else {
                  response = {"error" : false,"message" : "Data associated with "+req.body.email+"is deleted"};
              }
              res.json(response);
          });
        }
    })
});

router.post('/token', function(req, res){
    var data = {
        email: req.body.email,
    };
    session.findOne(data).lean().exec(function(err, db){
        if(err){
            return res.json({error: true});
        }
        if(!db){
            return res.status(404).json({'message':'Session not found!'});
        }
        res.json({token: db.sessionToken});
    })
});




router.post('/signup', function(req, res){

  // req.body.email
  //req.body.password
  mongoOp.findOne({'userEmail': req.body.email }).lean().exec(function(err, db){
      if(err){
          return res.json({error: true});
      }
      if(!db){
          //no existe
          var db = new mongoOp();
          var response = {};
          db.userEmail = req.body.email;
          db.userPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');

          db.save(function(err){
              if(err) {
                  response = {"error" : true,"message" : "Error adding data"};
              } else {
                  response = {"error" : false};
              }
              res.json(response);
          });

      }
      else{
        //si existe
        res.json({error:true});
      }
  })
});


insertToken = function insertToken( email ,token ){

    session.findOne({'email': email}).lean().exec(function(err,ses){
        if(err){
            //return res.json({error: true});
            console.log('hay un error en la segunda bd');
        }
        if(!ses){
            console.log('message no hay nada en la 2da base de datos!');
            //return res.status(404).json({'message':'no hay nada en la 2da base de datos!'});

            var dbs = new session();
            dbs.sessionToken = token;
            dbs.email = email;
            dbs.save(function(err){
            })

        }else {
            console.log('esto quiere decir que si existe el correo');
        }

    })


}

//insertToken( "0qe89w7r89w");


router.post('/authenticate', function(req, res){

    var data = {
        userEmail: req.body.email,
        userPassword: require('crypto').createHash('sha1').update(req.body.password).digest('base64')

       // mongoOp.findById(req.params.id,function(err,data){
        //if(err) {


    };
    mongoOp.findOne(data).lean().exec(function(err, db){
        if(err){
            return res.json({error: true});
        }
        if(!db){
            return res.json({'error':true});
        }
        console.log(db);
        //console.log(db.userEmail);
        var token = jwt.sign(db, global.config.jwt_secret, {
            expiresIn: 1440 // expires in 1 hour
        });
        console.log('entrando al metodo inserttoken');
        insertToken( db.userEmail, token );


        res.json({error:false, token: token});
    })
});




router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
            if(err) {
                response = {"error" : true};
            } else {
                response = data;
            }
            res.json(response);
        });
    })
    .post(function(req,res){
        var db = new mongoOp();
        var response = {};
        db.userEmail = req.body.email;
        //db.userPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        db.userPassword = req.body.password;
        db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                if(req.body.userEmail !== undefined) {
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    data.userPassword = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
                }
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

app.use('/',router);


app.listen(5000);
console.log("Listening to PORT 5000");
