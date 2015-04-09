<?php

class UserAPI{

	private $method = '';

	private $request = '';

	public function __construct($method){

		$this->method = $method;

		if(array_key_exists('request', $_GET)){
			$this->request = $_GET['request'];
		}
	}

	public function process(){

		switch ($this->method) {
			case 'POST': 

				return $this->processPOST();
			
			case 'GET': 

				return $this->processGET();

			default:
				return json_encode("How did you get here? Use the API right");
		}
	}

	private function processPOST(){

		//user is authenticating
		if($this->request === "login"){
			return $this->login();
		}else if($this->request === "createUser"){
			return $this->createUser();
		}

		//check if user is logged in
		//before allowing any other actions
		@require_once 'functions.php';
		loggedincheck($username, $auth);

		//other actions

		//and if here we don't know what they want
		$return = [
				"error" => true,
				"errorMessage" => "Request unknown",
			];
		return json_encode($return);
	}

	private function processGET(){
		return json_encode("User API reached via get");
	}

	/*
	 * Logs a user in
	 */
	private function login(){

		if(array_key_exists("username", $_POST)){
				$username = $_POST["username"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Username required",
			];
			return json_encode($return);
		}

		if(array_key_exists("phrase", $_POST)){
			$password = $_POST["phrase"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Password required",
			];
			return json_encode($return);
		}

		if($username === "APITEST"){
			$return = [
				"error" => true,
				"errorMessage" => "User reserved for tests",
			];
			return json_encode($return);
		}

		//check user is valid
		//	Get password hash for username from db

		$hash = "";

		if(password_verify($password, $hash)){

			//generate auth token
			//need to store this along with a date of expiry
			$token = bin2hex(openssl_random_pseudo_bytes(16));

			$return = [
					"error" => false,
					"loggedin" => true,
					"reply" => "User logged in",
					"auth" => $token,
				];

			return json_encode($return);
		}else{

			$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "User name or password incorrect",
				];

			return json_encode($return);
		}
	}

	/*
	 * Creates a user if the username is not already in use
	 */
	private function createUser(){

		if(array_key_exists("username", $_POST)){
				$username = $_POST["username"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Username required",
			];
			return json_encode($return);
		}

		if(array_key_exists("phrase", $_POST)){
			$password = $_POST["phrase"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Password required",
			];
			return json_encode($return);
		}

		//check username isn't already present in the db
		if(true){

			$hash = password_hash($password, PASSWORD_BCRYPT);

			//generate auth token
			$token = bin2hex(openssl_random_pseudo_bytes(16));

			//store user info in db

			$return = [
					"error" => false,
					"loggedin" => true,
					"reply" => "User logged in",
					"auth" => $token,
				];

			return json_encode($return);

		}else{

			$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "User name already used",
				];

			return json_encode($return);
		}
	}
}

?>