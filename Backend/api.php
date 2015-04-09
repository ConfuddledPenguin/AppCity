<?php

//get the api
require_once 'api.class.php';

//deal with origin
if(!array_key_exists('HTTP_ORIGIN', $_SERVER)){
	$_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try{
	$API = new API($_REQUEST["url"]);
	echo $API->process();
}catch(Exception $e){
	echo json_encode("Opps");
}

?>