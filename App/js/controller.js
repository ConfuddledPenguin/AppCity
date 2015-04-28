
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
	var fetchingMoreData = false;
	var placesFetched = 0;

	/*
	 * Handles the fact a user has logged in
	 */
	this.handleLoggedIn = function(username, authToken){

		user = new userClass(username, authToken);

		if(localStorage){
			auth = authToken
			localStorage.setItem(localStorageBase + "auth", auth);
			localStorage.setItem(localStorageBase + "username", username);
		}

		$.ajax({
			url: apiBase + "User?request=getUserInfo",
			type: 'GET',
			data: {username: username},
		})
		.done(function(response) {

			if(response["error"]){
				alert("fail");
			}else{

				$.each(response, function(key, val) {
					 user.addUserData(key, val);
				});

				$("#userUsername").text(user.getUserName());

				$('#userCommunityRating').text(user.getUserData("Community_Rating"));

				controller.showUserStats();
			}
		})
		.fail(function(response) {
			alert("Error getting user info");
		});

		if(view.getCurrentView() == "login"){
			view.toggleView("#user", user.getUserName());
			view.toggleMenu(); //need to suppress the menu opening
		}

		view.changeText("#menu-User", user.getUserName());
	};

	this.showUserStats = function(){

		$("#userStats").html("<h2>User statistics</h2>");

		var sauce = $("#user-stat").html();
		var template = Handlebars.compile(sauce);

		var context = {title: "Locations Added", value: user.getUserData("Locations_Added")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Locations Modified", value: user.getUserData("Locations_Modified")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Locations Rated", value: user.getUserData("Locations_Rated")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Guides Added", value: user.getUserData("Guides_Added")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Guides Modified", value: user.getUserData("Guides_Modified")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Guides Rated", value: user.getUserData("Guides_Rated")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Events Created", value: user.getUserData("Events_Created")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Events Modified", value: user.getUserData("Events_Modified")};
		var html = template(context);
		$("#userStats").append(html);

		var context = {title: "Events Rated", value: user.getUserData("Events_Rated")};
		var html = template(context);
		$("#userStats").append(html);

	}

	this.handleLoggedOut = function(){

		user = null;

		if(localStorage){
			localStorage.setItem(localStorageBase + "auth", "");
			localStorage.setItem(localStorageBase + "username", "");
		}

		view.changeText("#menu-User", "Log In");

	};

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

	this.logout = function(){

		$.ajax({
			url: apiBase + 'User?request=logout',
			type: 'POST',
			data: {auth: user.getUserAuth()},
		})
		.done(function(result) {
			
			if(result["error"] === true){
				alert("Error Logging out user");
			}

			if(result["loggedout"] === true){
				alert("User logged out");
			}

			controller.handleLoggedOut();

		})
		.fail(function(result) {
			alert("Fiddlesticks I have gone wrong, sorry about that...");
				console.log(result);
		});
	};

	this.getCurrentSessions = function(){

		$("#sessions-box").html("");

		if(user == null){

			$("#sessions-box").append("<p>You need to log in first</p>");

			return;
		}

		$.ajax({
			url: apiBase + 'User?request=getCurrentSessions',
			type: 'POST',
			data: {auth: user.getUserAuth()},
		})
		.done(function(result) {
			
			var count = 0;
			$.each(result, function(index, val) {
				 count++;
			});

			if(count == 1){

				$("#sessions-box").append("<p>There are no other open sessions</p>");

			}else{

				var sauce = $("#session-management-template").html();
				var template = Handlebars.compile(sauce);

				$.each(result, function(index, val) {

					if(val["Auth_token"] != user.getUserAuth()){

						var expires = val["Expires"];
						var date = new Date(expires*1000);
						var expires = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

						var context = {token: val["Auth_token"], compressedToken: val["Auth_token"].substring(0,5), expires: expires};
						var html = template(context);
						$("#sessions-box").append(html);

						$("#token-delete-"+val["Auth_token"]).click(function(event) {
							
							var token = $("#token-delete-"+val["Auth_token"]).attr('token');

							$.ajax({
								url: apiBase + 'User?request=authClose',
								type: 'POST',
								data: {auth: user.getUserAuth(), authClose: token},
							})
							.done(function(data) {
								
								$('#token-display-'+token).remove();
							})
							.fail(function() {
								alert("Fiddlesticks I have gone wrong. sorry about that...");
							});//close inner jquery
						});//close click action
					}//close for if
				});//close for each
			}
		})
		.fail(function() {
			alert("Fiddlesticks I have gone wrong, sorry about that...");
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

			if(user != null){
				view.toggleView("#user", user.getUserName());
			}else{
				view.toggleView("#login", "Login");
			}
		});

		$("#menu-Settings").click(function(){
			view.toggleView("#settings", "Settings");
		});

		$("#menu-About").click(function(){
			view.toggleView("#about", "About");
		});
	};

	this.displayPlace = function(id){

		$(".place-large-display").removeClass('noDisplay');
		$(".place-large-display").text("");

		var sauce = $("#place-large-template").html();
		var template = Handlebars.compile(sauce);		

		$.ajax({
			url: apiBase + 'Place?request=getPlace',
			type: 'GET',
			data: {ID: id},
		})
		.done(function(result) {
			
			if(result['error']){
				if (result['error'] == true){
					alert("Fiddlesticks, I have gone wrong, sorry about that...");
				}
			}

			var context = {
				title: result['Name'], short_des: result['Short_des'], src: result['Image'],
				phone: result['Phone'], link: result['Link'], id: result['ID'],
				address: result['Address'], rating: result['Av_Rating'], 
			};
			var html = template(context);

			$(".place-large-display").append(html);

			$("#close-large-place").click(function(event) {
				$(".place-large-display").addClass('noDisplay');
			});

			$("#large-placebox-map-icon-"+result['ID']).click(function(event) {
				console.log("Map Icon clicked");
			});

		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		

	}

	this.fillPlaces = function(){

		var sauce = $("#place-template").html();
		var template = Handlebars.compile(sauce);

		$.ajax({
			url: apiBase + 'Place?request=getPlacesPoint',
			type: 'GET',
			data: {lat: 55.87, long: -4, offset: placesFetched},
		})
		.done(function(result) {

			if(result["error"]){
				if(result["error"] == true){
					alert("Fiddlesticks, I have gone wrong, sorry about that...");
					return;
				}
			}

			if(result["noPlaces"]){
				if(result["noPlaces"] == true){
					if(placesFetched == 0){
						alert("Sorry no places nearby, try adding some?");
					}
					return;
				}
			}

			var count = 0;
			$.each(result, function(index, val) {
				 count++;
			});
			placesFetched += count;

			$.each(result, function(index, val) {

				place = val;

				var context = {id: val["ID"], title: val["Name"], short_des: val["Short_des"], src: val["Image"]};
				var html = template(context);
				$("#places-container").append(html);

				$('.small-placebox-' + val['ID']).click(function(event) {
					console.log(val['ID'] + " has been clicked");
					controller.displayPlace(val['ID']);
				});

				$('#small-placebox-map-icon-' + val['ID']).click(function(event) {
					console.log(val['ID'] + " map icon has been clicked");
				});

			});
		})
		.fail(function() {
			console.log("error");
		})
		.always(function(){
			fetchingMoreData = false;
		});		
	}

	this.fillGuides = function(){

		var sauce = $("#guide-template").html();
		var template = Handlebars.compile(sauce);

		var context = {title: "Guide", short_des: "A short description", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 2", short_des: "A short description 2", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 3", short_des: "A short description 3", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 4", short_des: "A short description 4", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 5", short_des: "A short description 5", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 6", short_des: "A short description 6", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);

		var context = {title: "Guide 7", short_des: "A short description 7", src: "#"};
		var html = template(context);
		$("#guide-container").append(html);
	}

	this.fillEvents = function(){

		var sauce = $("#event-template").html();
		var template = Handlebars.compile(sauce);

		var context = {title: "Event", short_des: "A short description", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 2", short_des: "A short description 2", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 3", short_des: "A short description 3", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 4", short_des: "A short description 4", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 5", short_des: "A short description 5", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 6", short_des: "A short description 6", src: "#"};
		var html = template(context);
		$("#event-container").append(html);

		var context = {title: "Event 7", short_des: "A short description 7", src: "#"};
		var html = template(context);
		$("#event-container").append(html);
	}

	/*
	 * initializes the controller
	 */
	this.init = function(){

		controller.initMenuControl();

		//this should be replaced with actual functionality
		controller.fillPlaces();

		//this should be replaced with actual functionality
		controller.fillGuides();

		//this should be replaced with actual functionality
		controller.fillEvents();

		//scrolling menu effect
		$("main").scroll(function(event) {

			var scroll = $("main").scrollTop();
			if(scroll > 0){
				$("#header").addClass('scroll');
			}else{
				$("#header").removeClass('scroll');
			}

			scroll = $('#places-container').height() - $('#places').height() - $('main').scrollTop();

			if(scroll < 300 && fetchingMoreData == false){

				fetchingMoreData = true;

				if(view.getCurrentView() == "places"){
					controller.fillPlaces();
				}
			}
		});

		/*
		 * Load auth and check if we are logged in
		 */
		if (localStorage.getItem( localStorageBase + "auth") && localStorage.getItem( localStorageBase + "username") ) {
        	auth = localStorage.getItem( localStorageBase + "auth");
        	username = localStorage.getItem( localStorageBase + "username");

 			$.ajax({
 				url: apiBase + "User?request=validAuth",
 				type: 'POST',
 				data: {auth: auth},
 			})
 			.done(function(response) {
 				
 				if(response["error"] == true){
 					alert("Fiddlesticks");
 				}else{
 					if(response["loggedin"] == true){
 						alert("User Logged In");
 						controller.handleLoggedIn(username, auth);
 					}else{
 						alert("Need to log in");
 					}
 				}

 			})
 			.fail(function() {
 				console.log("error validating user");
 			});
 			
    	}

		/*
		 * log in controls
		 */
		$("#loginbutton").click(this.login);
		$("#registerbutton").click(this.createUser);

		/*
		 * Settings controls
		 */
		$("#settings-logout").click(this.logout);
		$("#settings-manage-sessions").click(function(){
			controller.getCurrentSessions();
			view.toggleSessions();
		});
	}

	this.init();

}

// hey the window has loaded guess we better do stuff
$(window).load(function() {
	new controller();
});