var menuVisible = false;

$("#menu-icon").click(function(event) {
	console.log($('#menu'));
	if(!menuVisible){
		$("#menu").addClass('menu-visible');
		menuVisible = true;
	}else{
		$("#menu").removeClass('menu-visible');
		menuVisible = false;
	}
});