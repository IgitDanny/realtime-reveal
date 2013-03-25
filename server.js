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
  , io = require('socket.io').listen(server)
  , $ = require('jquery')
  , slides = []
  , presentation_html = require('fs').readFileSync('./views/presentation.html', 'utf8');

// Increase listeners
app.setMaxListeners(0);
io.setMaxListeners(0);

var slides_html = $(presentation_html).find('section');

$.each(slides_html, function (i) {
  var slide = $(this)
    , speaker_notes = false
    , second_screen = false
    , title = false
    , comment_box = false
    , poll = false
    , twitter_users = false;

  title = slide.attr('title');

  if (slide.find('.speaker-notes').length == 1) {
    speaker_notes = slide.find('.speaker-notes').first();
    speaker_notes = speaker_notes.html();
  }
  if (slide.find('.second-screen').length == 1) {
    second_screen = slide.find('.second-screen').first();
    second_screen = second_screen.html();
  }
  if (slide.find('.comment-box').length > 0) {
    comment_box = [];
    slide.find('.comment-box').each(function(i){
      var id = $(this).attr('id');
      comment_box[i] = id;
    });
  }
  if (slide.find('.poll').length > 0) {
    poll = [];
    slide.find('.poll').each(function(i){
      var this_poll = $(this);
      var id = this_poll.attr('id');
      var poll_bars = this_poll.find('.bar');
      var bars = [];
      poll_bars.each(function(x){
        var bar = $(this);
        var title = bar.attr('title');
        var id = bar.attr('id');
        bars[x] = {
          title: title,
          id: id
        };
      });
      poll[i] = {
        id: id,
        bars: bars
      };
    });
  }
  if (slide.find('.twitter-users').length == 1) { // only allow one twitter box per slide
    var twitter_box = slide.find('.twitter-users').first();
    var id = twitter_box.attr('id');
    twitter_users = id;
  }
  slides[i] = {
    title: title,
    notes: speaker_notes,
    second_screen: second_screen,
    comment_box: comment_box,
    poll: poll,
    twitter_users: twitter_users
  };
});

var current_slide = 0
  , num_slides = slides.length;


app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('views', __dirname + '/views');

app.use(express.cookieParser());
app.use(express.session({secret: 'presentation secret'}));
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/components'));

app.get('/', function (req, res) {
    res.render('second-screen', {slides: slides});
});

app.get('/admin', function (req, res) {
    res.render('admin', {logged_in: req.session.logged_in, slides: slides, num_slides: num_slides});
});

app.get('/presentation', function (req, res) {
    res.render('presentation');
});

/**
 * Listen
 */
server.listen(21472);

io.sockets.on('connection', function (socket) {
    console.log('Someone connected');

    socket.on('next slide', function () {
      // console.log(client.request.headers);
      if (socket.logged_in) {
        current_slide++;
        if (current_slide > (num_slides - 1)) {
          current_slide = num_slides - 1;
        }
        io.sockets.emit('change slide', current_slide);
      }
    });

    socket.on('previous slide', function () {
      if (socket.logged_in) {
        current_slide--;
        if (current_slide < 0) {
          current_slide = 0;
        }
        io.sockets.emit('change slide', current_slide);
      }
    });

    socket.on('vote', function(id) {
      io.sockets.emit('resize graph', id);
    });

    socket.on('comment', function(id, message) {
      io.sockets.emit('add comment', id, message);
    });

    socket.on('login', function(user, password, fn) {
      if (user != 'user' || password !=  'pass') {
        fn(false);
      } else {
        socket.logged_in = true;
        fn(true);
      }
    });

    socket.on('twitter user', function(id, username) {
      // Remove @ sign
      if (username.charAt(0) == '@') {
        username = username.substring(1);
      }
      id = id + '-container';
      io.sockets.emit('add twitter user', id, username);
    });
});