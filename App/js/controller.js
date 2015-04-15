
/*
 * This would be the controller. It controls appy things
 */
function controller(){

	var view = new viewStuff(this);

	var localStorageBase = "uk.ac.strath.devweb2014.cs317.group17."
	var apiBase = "https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/";
	var auth = '';
	var controller = this;
	var user = null;

	/*
	 * Handles the fact a user has logged in
	 */
	this.handleLoggedIn = function(username, authToken){

		if(localStorage){
			auth = authToken
			localStorage.setItem(localStorageBase + "auth", auth);
		}

		$.ajax({
			url: apiBase + "User?request=getUserInfo",
			type: 'GET',
			data: {username: username},
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			alert("Error getting user info");
		})
	}

	/*
	 * Logs a user in
	 */ 
	this.login = function(){

		var username = $('#usernameField').val();
		var password = $('#passwordField').val();

		$.ajax({
			url: apiBase + 'User?request=login',
			type: 'POST',
			data: {username: username, phrase: password},
		})
		.done(function(data) {

			console.log(data);

			console.log("error " + data["error"]);

			if(data["error"] == true){
				alert("Error logging user in");
			}

			if(data["loggedin"] == false)
				alert(data["reply"]);
			else if(data["loggedin"] == true){
				alert(data["reply"]);
				controller.handleLoggedIn(username, data["auth"]);
			}

		})
		.fail(function() {
			console.log("Fiddlesticks I have gone wrong, sorry about that...");
		});

	}

	/*
	 * Creates a user
	 */ 
	this.createUser = function(){

		var username = $('#usernameField').val();
			var password = $('#passwordField').val();

			$.ajax({
				url: apiBase + 'User?request=createUser',
				type: 'POST',
				data: {username: username, phrase: password},
			})
			.done(function(data) {

				console.log(data);

				console.log("error " + data["error"]);

				if(data["error"] == true){
					alert("Error Creating user");
				}

				if(data["loggedin"] == false)
					alert("DEAL WITH LOG IN FAIL");
				else if(data["loggedin"] == true){
					alert(data["reply"]);
					controller.handleLoggedIn(username, data["auth"]);
				}

			})
			.fail(function(data) {
				alert("Fiddlesticks I have gone wrong, sorry about that...");
				console.log(data);
			});
	}

	this.initMenuControl = function(){

		$("#menu-icon").click(view.toggleMenu);

		$("#menu-Explore").click(function(){
			view.toggleView("#explore", "Explore");
		});

		$("#menu-Places").click(function(){
			view.toggleView("#places", "Places");
		});

		$("#menu-Guides").click(function(){
			view.toggleView("#guides", "Guides");
		});

		$("#menu-Events").click(function(){
			view.toggleView("#events", "Events");
		});

		$("#menu-User").click(function(){
			view.toggleView("#login", "Login");
		});

		$("#menu-Settings").click(function(){
			view.toggleView("#settings", "Settings");
		});

		$("#menu-About").click(function(){
			view.toggleView("#about", "About");
		});

	};

	/*
	 * initializes the controller
	 */
	this.init = function(){

		controller.initMenuControl();

		/*
		 * Load auth
		 */

		if (localStorage.getItem( localStorageBase + "auth")) {
        	auth = localStorage.getItem( localStorageBase + "auth");
    	}

		/*
		 * log in
		 */

		$("#loginbutton").click(this.login);

		$("#registerbutton").click(this.createUser);

	}

	this.init();

}

// hey the window has loaded guess we better do stuff
$(window).load(function() {
	new controller();
});