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
        
        return parent::processPOST();
    }
    
    protected function processGET() {
        if ($this->request === "getPlaces") {
            return $this->getPlaces();
        }
        
        return parent::processGET();
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
        
        $long_desc = array_key_exists("long_desc", $_POST) ? $_POST["long_desc"] : null;
        $address = array_key_exists("address", $_POST) ? $_POST["address"] : null;
        $imageURL = array_key_exists("imageURL", $_POST) ? $_POST["imageURL"] : null;
        $link = array_key_exists("link", $_POST) ? $_POST["link"] : null;
        $phone = array_key_exists("phone", $_POST) ? $_POST["phone"] : null;
        
        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $DB->execute("INSERT INTO Places(Name,Short_des,Lat_coord,Long_coord,Long_des,Address,Image,Link,Phone) VALUES (?,?,?,?,?,?,?,?,?)", array($name,$short_desc,$lat,$long,$long_desc,$address,$imageURL,$link,$phone));
        
        return $this->successPlaceAdded();
    }
    
    private function getPlaces() {
        if (array_key_exists("tl_lat", $_GET)) {
            $tl_lat = $_GET["tl_lat"];
        } else {
            return $this->error("Top-left latitude parameter is required");
        }
        
        if (array_key_exists("tl_long", $_GET)) {
            $tl_long = $_GET["tl_long"];
        } else {
            return $this->error("Top-left longitude parameter is reuqired");
        }
        
        if (array_key_exists("br_lat", $_GET)) {
            $br_lat = $_GET["br_lat"];
        } else {
            return $this->error("Bottom-right latitude parameter is required");
        }
        
        if (array_key_exists("br_long", $_GET)) {
            $br_long = $_GET["br_long"];
        } else {
            return $this->error("Bottom-right longitude parameter is reuqired");
        }
        
        if (array_key_exists("offset", $_GET)) {
            $offset = $_GET["offset"];
        } else {
            return $this->error("Offset parameter is required");
        }
        
        include_once('sqlHandler/dbconnector.php');
        $DB = new DBPDO();
        // offset inserted using variable interpolation as prepared statements treat all values as strings.
        $result = $DB->fetchAll("SELECT * FROM Places WHERE Lat_coord <= ? AND Lat_coord >= ? AND Long_coord >= ? AND Long_coord <= ? LIMIT {$offset},10",array($tl_lat,$br_lat,$tl_long,$br_long));
        
        if ($result === false) {
            return $this->error("Failed to fetch places");
        } else {
            return json_encode($result);
        }
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
