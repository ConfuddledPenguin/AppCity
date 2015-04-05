<!DOCTYPE html>
<html>
<head>
	<style>
		body{margin:40px auto;max-width:650px;line-height:1.6;font-size:18px;color:#444;padding:0 10px}
		h1,h2,h3{line-height:1.2}
	</style>
	<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script type="text/javascript">	

		function clicked(){

			$.ajax({
				url: 'https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/banana',
				type: 'GET',
			})
			.done(function(data) {
				$(".basicdisplay").html(JSON.stringify(data));
			})
			.fail(function() {
				$(".basicdisplay").html("oops");
			})
			.always(function() {
				console.log("complete");
			});
		}

		function createUser(){

			$.ajax({
				url: 'https://devweb2014.cis.strath.ac.uk/~gvb12182/CS317/AppCity/api/v1/User',
				type: 'POST',
				data: {Username: "APITEST", password: "bobisawesome"},
			})
			.done(function(data) {
				$(".createUserDisplay").html(JSON.stringify(data));
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			
		}

	</script>
</head>
<body>
	<h1>Hello, this be an api</h1>
	<h2>Well it will be in the future, hopefully</h2>

	<p>This is the documentation for the api produced for the class CS317 AppCity
		project. JQuery is heavily loved here</p>
	
	<h2>Contents</h2>
	<ul>
		<li><a href="#basic">Basic Connection</a></li>
		<li>
			<a href="#userAPI">User API</a>
			<ul>
				<li><a href="#createUser">Create User</a></li>
			</ul>
		</li>
	</ul>
	<h2 id="basic">A basic connection</h2>
	<p>This connects the api making a 'GET' request on banana. This just returns the sent info.</p>
	<button onClick="clicked();">Click Me</button>
	<p class="basicdisplay"></p>
	<h2 id=userAPI>User API</h2>
	<h3 id='createUser'>Create User</h3>
	<p>This creates a user called APItest</p>
	<button onClick="createUser();">Create User</button>
	<p class="createUserDisplay"></p>
</body>
</html>