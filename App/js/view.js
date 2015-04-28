
/*
 * This bt does viewy stuff
 */ 
function viewStuff(controller){

	var viewStuff = this;
	var menuVisible = false;
	var sessionsVisible = false;
	var currentView = $("#explore");

	/*
	 * Init the view
	 */
	this.init = function(){

		/*
		 * Email injection for about
		 */
		$("#tomemail").text("hello@tom-maxwell.com");
		$("#tomemail").attr("href","mailto:hello@tom-maxwell.com");


		/*
		 * Log in
		 */

		//get a background image
		if(navigator.geolocation) {

		    navigator.geolocation.getCurrentPosition(function(position) {

		    var width = $("#login").width();
		    var height = $("#login").height();
		 	var url = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=13&size=" + width + "x" + height;

		 	var css = "url('"+ url +"')";

			$("#login").children('.container').css('background-image', css);

		    });
		}

		$(".loginInput").focus(function(event) {
			$('#loginbox').css('top', '0.5rem');
		});

	}

	/*
	 * Toggles the menu
	 */
	this.toggleMenu = function(){

		if(!menuVisible){
			$("#menu").addClass('menu-visible');
			$("main").addClass('fade-out');
			menuVisible = true;
		}else{
			$("#menu").removeClass('menu-visible');
			$("main").removeClass('fade-out');
			menuVisible = false;
		}
	}

	this.toggleSessions = function(){

		if(!sessionsVisible){
			$("#sessions-box").removeClass('noDisplay');
			sessionsVisible = true;
		}else{
			$("#sessions-box").addClass('noDisplay');
			sessionsVisible = false;
		}
	}

	/*
	 * Toggles the view
	 */
	this.toggleView = function(swapTo, title){

		currentView.addClass('noDisplay');
		$(swapTo).removeClass('noDisplay');
		currentView = $(swapTo);
		$("#headerTitle").text(title);
		viewStuff.toggleMenu();
	};

	this.getCurrentView = function(){
		return currentView.attr('id');
	}

	this.changeText = function(id, text){
		$(id).text(text);
	}

	this.showMessage = function(text){
		$("#message-text").text(text);
		$(".message").addClass('messageVisable');

		setTimeout(this.hideMessage, 2000);
	}

	this.hideMessage = function(){
		$(".message").removeClass('messageVisable');		
	}

	this.init();

}