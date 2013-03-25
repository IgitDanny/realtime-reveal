window.onload = function () {

    var socket = io.connect();

    $('#login-form').submit(function (evt) {
        evt.preventDefault();
        socket.emit('login', $('#user').val(), $('#password').val(), function (logged_in) {
            if (logged_in) {
                $('#login-form').remove();
                $('.contains-presentation-controls').show();
                window.location.hash = 'slide-0';
            } else {
                alert ('Try harder');
            }
        });
    });

    var next = document.getElementById('next');
    var previous = document.getElementById('previous');


    next.onclick = function () {
        socket.emit('next slide');
        return false;
    };

    previous.onclick = function () {
        socket.emit('previous slide');
        return false;
    };

    socket.on('change slide', function (slide) {
        $('.presentation-controls button').show();
        if (slide < 1) {
            // First slide
            slide = 0;
            $('#previous').hide();
        } else if (slide >= (num_slides - 1)) {
            // Last slide
            $('#next').hide();
        }
        window.location.hash = 'slide-' + slide;
    });
};