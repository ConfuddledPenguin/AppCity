
/*
 * This block of js handles general ui events.
 */

/* 
 * Menu Control
 */

var menuVisible = false;
var currentView = $("#explore");

function menutoggle(){
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

$("#menu-icon").click(menutoggle);

$("#menu-Explore").click(function(event) {
	currentView.addClass('noDisplay');
	$("#explore").removeClass('noDisplay');
	currentView = $("#explore");
	$("#headerTitle").text("Explore");
	menutoggle();
});

$("#menu-Places").click(function(event) {
	currentView.addClass('noDisplay');
	$("#places").removeClass('noDisplay');
	currentView = $("#places");
	$("#headerTitle").text("Places");
	menutoggle();
});

$("#menu-Guides").click(function(event) {
	currentView.addClass('noDisplay');
	$("#guides").removeClass('noDisplay');
	currentView = $("#guides");
	$("#headerTitle").text("Guides");
	menutoggle();
});

$("#menu-Events").click(function(event) {
	currentView.addClass('noDisplay');
	$("#events").removeClass('noDisplay');
	currentView = $("#events");
	$("#headerTitle").text("Events");
	menutoggle();
});

$("#menu-User").click(function(event) {
	currentView.addClass('noDisplay');
	$("#login").removeClass('noDisplay');
	currentView = $("#login");
	$("#headerTitle").text("Log In");
	menutoggle();
});

$("#menu-Settings").click(function(event) {
	currentView.addClass('noDisplay');
	$("#settings").removeClass('noDisplay');
	currentView = $("#settings");
	$("#headerTitle").text("Settings");
	menutoggle();
});

$("#menu-About").click(function(event) {
	currentView.addClass('noDisplay');
	$("#about").removeClass('noDisplay');
	currentView = $("#about");
	$("#headerTitle").text("About");
	menutoggle();
});

/*
 * Email injection
 */

$("#tomemail").text("hello@tom-maxwell.com");
$("#tomemail").attr("href","mailto:hello@tom-maxwell.com");

/*
 * User Control
 */

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