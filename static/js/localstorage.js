function is_LS_available() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

function update_LS() {
    var username = Cookies.get('username');
    localStorage.setItem('old_username', username);
};

function extract_from_LS () {
    var username = localStorage.getItem('old_username');
    return username;
}

function clear_LS () {
    localStorage.removeItem('old_username');
}