<?php

require_once('CoreAPI.class.php');

class UserAPI extends CoreAPI {
    
    protected function processPOST() {

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
			return $this>error("Auth Code required");
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

        parent::processPOST();
    }
    
    protected function processGET() {

        //request for user info
        if($this->request === "getUserInfo"){
            return $this->getUserInfo();
        }

        //other actions
        
        parent::processGET();
    }

	private function getUserInfo(){
        
        if(array_key_exists("username", $_GET)){
            $username = $_GET["username"];
        }else{
            return $this->errorUsernameRequired();
        }
        
        include_once("sqlHandler/dbconnector.php");
        $result = $DB->fetch("SELECT * FROM User_Stats WHERE Username =?", array($username));
        
        if ($result === false) {
            return $this->errorUsernameInvalid($username);
        } else {
            return json_encode($result);
        }
	}

	/*
	 * Logs a user in
	 */
	private function login(){

        if(array_key_exists("username", $_POST)){
            $username = $_POST["username"];
        }else{
            return $this->errorUsernameRequired();
        }
        
        if(array_key_exists("phrase", $_POST)){
            $password = $_POST["phrase"];
        }else{
            return $this->errorPasswordRequired();
        }
        
        if($username === "APITEST"){
            return $this->errorUsernameReserved();
        }

        //check user is valid
        include_once("sqlHandler/dbconnector.php");
        $result = $DB->fetch("SELECT password FROM Users WHERE Username =?", array($username));
        $hash = $result["password"];

        if(password_verify($password, $hash)){
            //generate auth token
        	//need to store this along with a date of expiry
        	$token = bin2hex(openssl_random_pseudo_bytes(16));
        	$expireTime = time() + (4 * 7 * 24 * 60 * 60); // expires in 4 weeks

        	$DB->execute("INSERT INTO Tokens VALUES (?,?,?)", array($token, $username, $expireTime));

        	return $this->successLoggedIn($token);
        }else{
            return $this->successIncorrect();
        }
	}

	/*
	 * Creates a user if the username is not already in use
	 */
	private function createUser(){

		if(array_key_exists("username", $_POST)){
            $username = $_POST["username"];

            if(strlen($username) == 0){
                return $this->errorUsernameRequired();
            }

        }else{
            return $this->errorUsernameRequired();
		}

    	if(array_key_exists("phrase", $_POST)){
    		$password = $_POST["phrase"];

			if(strlen($password) == 0){                    
                return $this->errorPasswordRequired();
    		}
        }else{
            return $this->errorPasswordRequired();
        }
               
        if($username === "APITEST"){
            return $this->errorUsernameReserved();
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

            return $this->successLoggedIn($token);

		}else{
            return $this->successUsernameTaken();
		}
	}

	private function logout(){

		$auth = $_POST["auth"];

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
			return $this->error("No auth supplied to close");
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

		$auth = $_POST["auth"];

		$username = $this->getUserName($auth);

		$DB = new DBPDO();
		$result = $DB->fetchall("SELECT Auth_token, Expires FROM Tokens WHERE Username=?", array($username));

		return json_encode($result);

	}

	private function validAuth(){

		if(array_key_exists("auth", $_POST)){
            $auth = $_POST["auth"];
		}else{
            return $this->errorAuthRequired();
		}

		$result = $this->loggedincheck($auth);

		if($result === true){
            return $this->successLoggedIn(null);
		}else{
            return $result;
		}
	}
        
    ## error responses
    
    private function errorUsernameRequired() {
        return $this->error("Username required as a parameter");
    }
    
    private function errorPasswordRequired() {
        return $this->error("Password required as a parameter");
    }
    
    private function errorAuthRequired() {
        return $this->error("No auth supplied to check");
    }

    private function errorUsernameReserved() {
        return $this->error("Username reserved for tests");
    }
    
    private function errorUsernameInvalid($username) {
        return $this->error("{$username}: username does not exist");
    }

    ## success responses
    
    private function successLoggedIn($token) {
        $success = [
            "error" => false,
            "loggedin" => true,
            "reply" => "User logged in"
        ];
        
        if ($token) {
            $success['auth'] = $token;
        }

        return json_encode($success);
    }
    
    private function successIncorrect() {
        return $this->successFail("Username or password incorrect");
    }
    
    private function successUsernameTaken() {
        return $this->successFail("Username already taken");
    }
    
    private function successFail($message) {
        $success = [
            "error" => false,
            "loggedin" => false,
            "reply" => $message
        ];

        return json_encode($success);
    }
}

?>
