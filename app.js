
/**
 * Module dependencies.
 */

var WebSocketServer = require('websocket').server;
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var  lessMiddleware = require("less-middleware");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 2999);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(lessMiddleware( __dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/reset', routes.reset);
app.post('/add', routes.add);
app.post('/del', routes.del);
app.post('/remove', routes.remove);
//app.post('/users', user.list);
app.post('/addGroup', routes.addGroup);
app.post('/addUser', routes.addUser);
app.post('/delGroup', routes.delGroup);
app.post('/editGroup', routes.editGroup);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


