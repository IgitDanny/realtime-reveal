window.onload = function () {

    var socket = io.connect();

    socket.on('change slide', function (slide) {
        window.location.hash = '/' + slide + '/';
    });

}