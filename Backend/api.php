<?php

require_once 'api.class.php';

if(!array_key_exists('HTTP_ORIGIN', $_SERVER)){
	$_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try{
	$API = new API($_REQUEST["request"]);
	echo $API->process();
}catch(Exception $e){
	echo json_encode("Opps");
}

?>