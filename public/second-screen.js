var following_presentation = true;

window.onload = function () {


    if (!window.location.hash) {
        window.location.hash = 'slide-0';
    }

    window.onhashchange = function () {
        if ($(window.location.hash).length < 1) {
            window.location.hash = 'slide-0';
        }
    };

    var socket = io.connect();

    socket.on('change slide', function (slide) {
        // window.location.hash = slide;
        if (following_presentation) {
            window.location.hash = 'slide-' + slide;
        } else {
            show_notification('Change to Current Slide', 'slide-' + slide);
        }
    });

    socket.on('add twitter user', function (id, username) {
        var twitter_box = $('#' + id);
        var link = 'http://www.twitter.com/' + username;
        var img = 'http://api.twitter.com/1/users/profile_image/' + username;
        var html = '<li><a href="' + link + '" target="_blank"><img src="' + img + '"> <span>' + username + '</span></a></li>';
        twitter_box.prepend(html);
    });

    $('.cast-vote').click(function(evt){
        evt.preventDefault();
        var button = $(this);
        var id = button.attr('id');
        console.log('casting vote ' + id);
        socket.emit('vote', id);
    });

    $('.comment-form').submit(function(evt){
        evt.preventDefault();
        var form = $(this);
        var id = form.attr('id');
        var input = '';
        if (form.find('input[type=text]').length == 1) {
            input = form.find('input');
        } else {
            input = form.find('textarea');
        }
        var message = input.val();
        input.val('');
        console.log('submitting comment ' + id);
        socket.emit('comment', id, message);
        return false;
    });

    $('.twitter-user-form').submit(function(evt){
        evt.preventDefault();
        var form = $(this);
        var id = form.attr('id');
        var username = form.find('input').val();
        form.remove();
        socket.emit('twitter user', id, username);
        return false;
    });

};

function show_notification (text, hash) {
    var notification = $('<a class="notification" href="#' + hash + '">' + text + '</a>');
    if ($('.notification').length) {
        //There is already a notification
        $('.notification').fadeOut(500, function () {
            $(this).remove();
            $('body').append(notification);
        });
    } else {
        $('body').append(notification);
    }
    $('.notification').on('click', function () {
        $(this).fadeOut(500).remove();
    });
}
