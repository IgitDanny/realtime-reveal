/**
 * Module dependencies
 */

var express = require('express');

/**
 * Create app
 */

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


var current_slide = 0;

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', __dirname + '/views');

app.use(express.cookieParser());
app.use(express.session({secret: 'presentation secret'}));
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('second-screen');
});

app.get('/admin', function (req, res) {
    res.render('admin', {logged_in: req.session.logged_in});
});

app.post('/admin', function (req, res) {
    console.log(req.body);
    if (!req.body) {
      res.end('Missing body');
    }

    if (req.body.user != 'user' || req.body.password !=  'pass') {
      res.end('Login details incorrect');
    } else {
      req.session.logged_in = true;
      res.render('admin', {logged_in: req.session.logged_in});
    }
});

app.get('/presentation', function (req, res) {
    res.render('presentation');
});

/**
 * Listen
 */
server.listen(3000);

io.sockets.on('connection', function (socket) {
    console.log('Someone connected');

    socket.on('next slide', function () {
      // console.log(client.request.headers);
      if (socket.logged_in) {
        current_slide++;
        io.sockets.emit('change slide', current_slide);
      }
    });

    socket.on('previous slide', function () {
      if (socket.logged_in) {
        current_slide--;
        io.sockets.emit('change slide', current_slide);
      }
    });

    socket.on('login', function(user, password, fn) {
      if (user != 'user' || password !=  'pass') {
        fn(false);
      } else {
        socket.logged_in = true;
        fn(true);
      }
    });
});