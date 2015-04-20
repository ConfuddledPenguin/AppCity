<?php

class API{

	private $method = 'fa';
	private $request = 'ba';

	public function __construct($request){
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: *");
		header("Content-Type: application/json");

		$this->method = $_SERVER["REQUEST_METHOD"];

		if($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)){
			if($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE'){
				$this->method = 'DELETE';
			}else if($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT'){
				$this->method = 'PUT';
			}else{
				throw new Exception("Unexpected Header");
			}
		}

		$this->request = $request;
	}

	public function process(){

                $api = null;
		switch ($this->request) {
			case 'User':
                            require_once 'UserAPI.class.php';
                            $api = new UserAPI($this->method);
                            break;
                        case 'Place':
                            require_once 'PlaceAPI.class.php';
                            $api = new PlaceAPI($this->method);
                            break;
			default:

				$fish = false;

				if(array_key_exists('fish', $_GET)){
					$fish = $_GET['fish'];
				}

				$data = [
				"Message" => "404 No matching call have your data back",
				"request" => $this->request,
				"banana url arg" => $fish,
				"method" => $this->method,
				];

				return json_encode($data);
		}
                
                return $api->process();
	}
	
}

?>