window.onload = function () {

    var socket = io.connect();

    socket.on('change slide', function (slide) {
        window.location.hash = '/' + slide + '/';
    });

    socket.on('resize graph', function (bar_id) {
		var bar = $('#' + bar_id);
		console.log(bar_id);
		update_bar (bar);
    });

    socket.on('add comment', function (comment_box_id, message) {
		var comment_box = $('#' + comment_box_id);
		add_to_comment_box (comment_box, message);
    });

    socket.on('add twitter user', function (id, username) {
        var twitter_box = $('#' + id);
        var link = 'http://www.twitter.com/' + username;
        var img = 'http://api.twitter.com/1/users/profile_image/' + username;
        var html = '<li><a href="' + link + '" target="_blank"><img src="' + img + '"> <span>' + username + '</span></a></li>';
        twitter_box.prepend(html);
    });

    $('.bar').click(function(evt){
		var bar = $(this);
		update_bar (bar);
	});

	$('.graph').each(function(){
		resize_graph($(this));
	});

	function update_bar (bar) {
		var graph = bar.parent();
		var votes = bar.attr('data-votes');
		if ('undefined' == typeof votes) {
			votes = 0;
		}
		var max = graph.attr('data-max');
		votes++;
		if (votes > max) {
			max = votes;
			graph.attr('data-max', max);
		}
		bar.attr('data-votes', votes);
		resize_graph(graph);
	}

	function resize_graph (graph) {
		var max = graph.attr('data-max');
		graph.children('.bar').each(function(){
			var bar = $(this);
			var votes = bar.attr('data-votes');
			if ('undefined' == typeof votes) {
				votes = 0;
			}
			var width = (votes / max) * 100;
			if (width > 20) {
				bar.css('width', width + '%');
			} else {
				bar.css('width', 'auto');
			}
		});
	}

	// $('form').submit(function(evt){
	// 	evt.preventDefault();
	// 	var message = $('#message').val();
	// 	$('#message').val('');
	// 	add_to_comment_box($('.live-comments-box'), message);
	// 	return false;
	// });

	function add_to_comment_box(box, comment) {
		console.log(box);
		console.log(comment);
		comment = '<span class="comment">' + comment + "</span>";
		box.prepend(comment);
	}

};