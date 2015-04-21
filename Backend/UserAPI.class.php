<?php

class UserAPI{

	private $method = '';

	private $request = '';

	private $DB = null;

	public function __construct($method){

		$this->method = $method;

		if(array_key_exists('request', $_GET)){
			$this->request = $_GET['request'];
		}
	}

	public function loggedincheck($auth){

		include_once("sqlHandler/dbconnector.php");
		$result = $DB->fetch("SELECT * FROM Tokens WHERE Auth_token =?", array($auth));

		if($result === false){
			$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "Unknown Token",
				];

			return json_encode($return);
		}else{

			if($result["Expires"] > time()){
				return true;
			}else{
				$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "Expired token",
				];

			return json_encode($return);
			}
		}
	}

	public function getUsername($auth){

		include_once("sqlHandler/dbconnector.php");
		$DB = new DBPDO();
		$result = $DB->fetch("SELECT * FROM Tokens WHERE Auth_token =?", array($auth));

		if($result === false){
			$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "Unknown Token",
				];

			return json_encode($return);
		}else{

			if($result["Expires"] > time()){
				return $result["Username"];
			}else{
				$return = [
					"error" => false,
					"loggedin" => false,
					"reply" => "Expired token",
				];

			return json_encode($return);
			}
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
		}else if($this->request === "validAuth"){
			return $this->validAuth();
		}

		if(array_key_exists("auth", $_POST)){
			$auth = $_POST["auth"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Auth Code required",
			];
			return json_encode($return);
		}

		//check if user is logged in
		//before allowing any other actions
		$result = $this->loggedincheck($auth);

		if($result === true){
			
		}else{
			return $result;
		}

		if ($this->request === "logout") {
			return $this->logout();
		}else if($this->request === "getCurrentSessions"){
			return $this->getCurrentSessions();
		}else if($this->request === "authClose"){
			return $this->authClose();
		}

		//and if here we don't know what they want
		$return = [
				"error" => true,
				"errorMessage" => "Request unknown",
			];
		return json_encode($return);
	}

	private function processGET(){

		//request for user info
		if($this->request === "getUserInfo"){
			return $this->getUserInfo();
		}

		//other actions

		//and if here we don't know what they want
		$return = [
				"error" => true,
				"errorMessage" => "Request unknown",
			];
		return json_encode($return);
	}

	private function getUserInfo(){

		if(array_key_exists("username", $_GET)){
				$username = $_GET["username"];
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Username required as a parameter",
			];

			return json_encode($result);
		}

		include_once("sqlHandler/dbconnector.php");
		$result = $DB->fetch("SELECT * FROM User_Stats WHERE Username =?", array($username));

		return json_encode($result);
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
		include_once("sqlHandler/dbconnector.php");
		$result = $DB->fetch("SELECT password FROM Users WHERE Username =?", array($username));

		$hash = $result["password"];

		if(password_verify($password, $hash)){

			//generate auth token
			//need to store this along with a date of expiry
			$token = bin2hex(openssl_random_pseudo_bytes(16));
			$expireTime = (4*7*24*3600) + time(); // expires in 4 weeks

			$DB->execute("INSERT INTO Tokens VALUES (?,?,?)", array($token, $username, $expireTime));

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

				if(strlen($username) == 0){
					$return = [
						"error" => true,
						"errorMessage" => "Username required",
					];
					return json_encode($return);
				}
		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Username required",
			];
			return json_encode($return);
		}

		if(array_key_exists("phrase", $_POST)){
			$password = $_POST["phrase"];

			if(strlen($password) == 0){
				$return = [
					"error" => true,
					"errorMessage" => "Password required",
				];
				return json_encode($return);
			}

		}else{
			$return = [
				"error" => true,
				"errorMessage" => "Password required",
			];
			return json_encode($return);
		}

		//check username isn't already present in the db
		include_once("sqlHandler/dbconnector.php");
		$result = $DB->fetch("SELECT Username FROM Users WHERE Username =?", array($username));

		if($result === false){

			$hash = password_hash($password, PASSWORD_BCRYPT);

			//generate auth token
			$token = bin2hex(openssl_random_pseudo_bytes(16));
			$expireTime = time() + (((3600 * 24) * 7) * 4); // expires in 4 weeks

			//store user info in db
			
			$DB->execute("INSERT INTO Users VALUES (?,?)", array($username, $hash));
			$DB->execute("INSERT INTO Tokens VALUES (?,?,?)", array($token, $username, $expireTime));
			$DB->execute("INSERT INTO User_Stats VALUES (?,?,?,?,?,?,?,?,?,?,?)", array($username, 0,0,0,0,0,0,0,0,0,0));

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
					"reply" => "User name already taken",
				];

			return json_encode($return);
		}
	}

	private function logout(){

		if(array_key_exists("auth", $_POST)){
			$auth = $_POST["auth"];
		}else{
			$return = [
					"error" => true,
					"reply" => "No auth supplied to check",
				];

			return json_encode($return);
		}

		include_once("sqlHandler/dbconnector.php");
		$DB = new DBPDO();
		$DB->execute("DELETE FROM Tokens WHERE Auth_token=?", array($auth));

		$return = [
					"error" => false,
					"loggedout" => true,
					"reply" => "User logged out",
				];

		return json_encode($return);

	}

	private function authClose(){

		$auth = $_POST["auth"];

		if(array_key_exists("authClose", $_POST)){
			$authClose = $_POST["authClose"];
		}else{
			$return = [
					"error" => true,
					"reply" => "No auth supplied to close",
				];

			return json_encode($return);
		}


		include_once("sqlHandler/dbconnector.php");
		$DB = new DBPDO();
		$username = $this->getUsername($auth);
		$DB->execute("DELETE FROM Tokens WHERE Auth_token=? AND Username=?", array($authClose, $username));

		$return = [
					"error" => false,
					"closed" => true,
					"sessionClosed" => $authClose,
					"reply" => "Session closed",
				];

		return json_encode($return);

	}

	private function getCurrentSessions(){

		if(array_key_exists("auth", $_POST)){
			$auth = $_POST["auth"];
		}else{
			$return = [
					"error" => true,
					"reply" => "No auth supplied to check",
				];

			return json_encode($return);
		}

		$username = $this->getUserName($auth);

		$DB = new DBPDO();
		$result = $DB->fetchall("SELECT Auth_token, Expires FROM Tokens WHERE Username=?", array($username));

		return json_encode($result);

	}

	private function validAuth(){

		if(array_key_exists("auth", $_POST)){
			$auth = $_POST["auth"];
		}else{
			$return = [
					"error" => true,
					"reply" => "No auth supplied to check",
				];

			return json_encode($return);
		}

		$result = $this->loggedincheck($auth);

		if($result === true){
			$return = [
					"error" => false,
					"loggedin" => true,
					"reply" => "User logged in",
				];

			return json_encode($return);
		}else{
			return $result;
		}

	}
}

?>