window.onload = function () {

    var socket = io.connect();

    $('#login-form').submit(function (evt) {
        evt.preventDefault();
        socket.emit('login', $('#user').val(), $('#password').val(), function (logged_in) {
            if (logged_in) {
                $('#login-form').remove();
                $('form').show();
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
    }

    previous.onclick = function () {
        socket.emit('previous slide');
        return false;
    }

    socket.on('change slide', function (slide) {
        window.location.hash = slide;
    });
}