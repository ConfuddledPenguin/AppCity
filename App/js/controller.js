
/*
 * This would be the controller. It controls appy things
 */
function controller(){

	var localStorageBase = "uk.ac.strath.devweb2014.cs317.group17."
	var auth = '';
	var controller = this;
	var user = null;

	/*
	 * Stores the auth code for fetching
	 *
	 * @param authToken the token to store
	 */ 
	this.storeAuth = function(authToken){

		if(localStorage){
			auth = authToken
			localStorage.setItem(localStorageBase + "auth", auth);
		}
	}

	/*
	 * Logs a user in
	 */ 
	this.login = function(){

		var username = $('#usernameField').val();
			var password = $('#passwordField').val();

			$.ajax({
				url: 'https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/User?request=login',
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

					controller.storeAuth(data["auth"]);
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
				url: 'https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/User?request=createUser',
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
					controller.storeAuth(data["auth"]);
				}

			})
			.fail(function(data) {
				alert("Fiddlesticks I have gone wrong, sorry about that...");
				console.log(data);
			});
	}

	/*
	 * initializes the controller
	 */
	this.init = function(){

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