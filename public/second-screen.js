var following_presentation = true;

window.onload = function () {


    if (!window.location.hash) {
        window.location.hash = 'welcome';
    }

    window.onhashchange = function () {
        if ($(window.location.hash).length < 1) {
            window.location.hash = 'welcome';
        }
    }

    var socket = io.connect();

    socket.on('change slide', function (slide) {
        // window.location.hash = slide;
        if (following_presentation) {
            window.location.hash = 'slide' + slide;
        } else {
            show_notification('Change to Current Slide', 'slide' + slide);
        }
    });
}

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