<?php

class UserAPI{

	private $method = '';

	public function __construct($method){

	$this->method = $method;

	}

	public function process(){

		switch ($this->method) {
			case 'POST': //creating a user

				return json_encode(array("authCode" => "hfshfghuHGRGJSHGIUHSPUFHJNQPIUGHF"));
			
			default:
				return json_encode("user API reached");
		}
	}
}

?>