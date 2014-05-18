$(document).on("click", ".back_button", function() {
	Cookies.set('old_username', Cookies.get('username'));
	Cookies.expire('username');
	if(Cookies.get('old_username') == 'anonimous') {
		Cookies.expire('old_username');
	}
	location.reload();
});

/*$(document).ready(function() {
	window.setTimeout(function() {
		$('.back_button').fadeTo('slow', 1);
	}, 5000);
});*/

ymaps.ready(function() {
	window.setTimeout(function() {
		$('.back_button').fadeTo('slow', 1);
	}, 300);
});