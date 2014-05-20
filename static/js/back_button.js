$(document).on("click", ".back_button", function() {
	is_LS_available();
	if(Cookies.get('username') != 'anonimous') {
		update_LS();
	} else {
		clear_LS();
	}
	Cookies.expire('username');
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