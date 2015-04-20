<?php

class CoreAPI {
    
    protected $method = '';
    protected $request = '';
    
    public function __construct($method) {
        $this->method = $method;

        if(array_key_exists('request', $_GET)){
            $this->request = $_GET['request'];
        }
    }
    
    public function process() {
        switch ($this->method) {
            case 'POST':
                return $this->processPOST();
            case 'GET':
                return $this->processGET();
            default:
                return json_encode("How did you get here? Use the API right.");
        }
    }
    
    protected function processPOST() {
        return $this->errorUnknownRequest();
    }
    
    protected function processGET() {
        return $this->errorUnknownRequest();
    }
    
    private function errorUnknownRequest() {
        $error = [
            "error" => true,
            "errorMessage" => "Request unknown."
        ];
        
        return json_encode($error);
    }
    
    protected function loggedincheck($auth){
        include_once("sqlHandler/dbconnector.php");
	$result = $DB->fetch("SELECT * FROM Tokens WHERE Auth_token =?", array($auth));
        $not_logged = [
            "error" => false,
            "loggedin" => false
        ];
        
        if ($result === false) {
            $not_logged['reply'] = "Unknown token";
        } else {
            if ($result["Expires"] > time()) {
                return true;
            } else {
                $not_logged['reply'] = "Expired token";
            }
        }
        
        return json_encode($not_logged);
    }
    
}

?>
