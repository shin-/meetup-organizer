
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var sio = require('stack.io');

require('./lib/chat');

sio.debug = true;
var io = sio();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000);
io.browser(app);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
