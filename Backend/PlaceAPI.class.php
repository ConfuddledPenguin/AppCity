<?php

require_once('CoreAPI.class.php');

class PlaceAPI extends CoreAPI {
    
    protected function processPOST() {
        $auth = $this->checkAuth();
        if ($auth !== true) {
            return $auth;
        }
        
        if ($this->request === "addPlace") {
            return $this->addPlace();
        }
        
        parent::processPOST();
    }
    
    protected function processGET() {
        parent::processGET();
    }
    
    private function addPlace() {
        if (array_key_exists("name", $_POST)) {
            $name = $_POST["name"];
        } else {
            return $this->error("Name parameter is required");
        }
        
        if (array_key_exists("short_desc", $_POST)) {
            $short_desc = $_POST["short_desc"];
        } else {
            return $this->error("Short description parameter is required");
        }
        
        if (array_key_exists("lat", $_POST)) {
            $lat = $_POST["lat"];
        } else {
            return $this->error("Latitude parameter is required");
        }
        
        if (array_key_exists("long", $_POST)) {
            $long = $_POST["long"];
        } else {
            return $this->error("Longitude parameter is reuqired");
        }
        
        $long_desc = array_key_exists("long_desc", $_POST) ? $_POST["long_desc"] : "";
        $address = array_key_exists("address", $_POST) ? $_POST["address"] : "";
        $link = array_key_exists("link", $_POST) ? $_POST["link"] : "";
        $phone = array_key_exists("phone", $_POST) ? $_POST["phone"] : "";
        
        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $DB->execute("INSERT INTO Places(Name,Short_des,Lat_coord,Long_coord,Long_des,Address,Link,Phone) VALUES (?,?,?,?,?,?,?,?)", array($name,$short_desc,$lat,$long,$long_desc,$address,$link,$phone));
        
        return $this->successPlaceAdded();
    }
    
    ## error responses
    
    ## success responses
    
    private function successPlaceAdded() {
        $success = [
            "error" => false,
            "reply" => "Place has successfully been added"
        ];
        
        return json_encode($success);
    }
    
}

?>
