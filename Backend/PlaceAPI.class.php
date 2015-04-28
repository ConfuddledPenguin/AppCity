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
        } elseif ($this->request === "ratePlace") {
            return $this->ratePlace();
        } elseif( $this->request === "getRating") {
            return $this->getRating();
        }
        
        return parent::processPOST();
    }
    
    protected function processGET() {
        if ($this->request === "getPlacesArea") {
            return $this->getPlacesArea();
        } elseif ($this->request === "getPlacesPoint") {
            return $this->getPlacesPoint();
        } elseif ($this->request === "getPlace"){
            return $this->getPlace();
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
        $imageURL = array_key_exists("imageURL", $_POST) ? $_POST["imageURL"] : ("https://maps.googleapis.com/maps/api/streetview?size=400x400&location="+$lat+","+$long+"&fov=70&key=AIzaSyB6Gc0XW1xBwcIXwnRC3EZt2gP8_yrHwF0");
        $link = array_key_exists("link", $_POST) ? $_POST["link"] : null;
        $phone = array_key_exists("phone", $_POST) ? $_POST["phone"] : null;
        
        $Username = $this->getUsername($_POST["auth"]);

        if(! is_String($Username)){
            return $Username;
        }

        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $DB->execute("INSERT INTO Places(Name,Short_des,Lat_coord,Long_coord,Long_des,Address,Image,Link,Phone) VALUES (?,?,?,?,?,?,?,?,?)", array($name,$short_desc,$lat,$long,$long_desc,$address,$imageURL,$link,$phone));
        
        $DB->execute("UPDATE User_Stats SET Locations_Added = Locations_Added+1 WHERE Username = ?", array($Username));

        return $this->successPlaceAdded();
    }

    private function getPlace(){

        if (array_key_exists("ID", $_GET)) {
            $ID = $_GET["ID"];
        } else {
            return $this->error("Place ID parameter is required");
        }

        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $result = $DB->fetch("SELECT * FROM Places WHERE ID = ?", array($ID)); 
        
        return json_encode($result);       

    }

    private function getPlacesPoint() {

        if (array_key_exists("lat", $_GET)) {
            $lat = $_GET["lat"];
        } else {
            return $this->error("latitude parameter is required");
        }
        
        if (array_key_exists("long", $_GET)) {
            $long = $_GET["long"];
        } else {
            return $this->error("longitude parameter is required");
        }

        if (array_key_exists("offset", $_GET)) {
            $offset = $_GET["offset"];
        } else {
            return $this->error("Offset parameter is required");
        }

        include_once('sqlHandler/dbconnector.php');
        $DB = new DBPDO();
        
        $found = 0;
        $distance = 25;

        while ($found + $offset < 10 + $offset) {
            $result = $DB->fetchAll("SELECT *, ( 3959 * acos( cos( radians(?) ) * cos( radians( lat_coord ) ) * cos( radians( long_coord ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat_coord ) ) ) ) AS distance FROM Places HAVING distance < ? ORDER BY distance LIMIT {$offset}, 10",
                array($lat, $long, $lat, $distance));

            $found = count($result);
            $distance = $distance * 2;
            if($distance > 100){
                if( $found === 0)
                    return json_encode($result);
                return $this->noPlacesNearby();
            }
        }

        return json_encode($result);
    }
    
    private function getPlacesArea() {
        if (array_key_exists("tl_lat", $_GET)) {
            $tl_lat = $_GET["tl_lat"];
        } else {
            return $this->error("Top-left latitude parameter is required");
        }
        
        if (array_key_exists("tl_long", $_GET)) {
            $tl_long = $_GET["tl_long"];
        } else {
            return $this->error("Top-left longitude parameter is required");
        }
        
        if (array_key_exists("br_lat", $_GET)) {
            $br_lat = $_GET["br_lat"];
        } else {
            return $this->error("Bottom-right latitude parameter is required");
        }
        
        if (array_key_exists("br_long", $_GET)) {
            $br_long = $_GET["br_long"];
        } else {
            return $this->error("Bottom-right longitude parameter is required");
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
    
    private function ratePlace() {
        if (array_key_exists("place_id", $_POST)) {
            $place_id = $_POST["place_id"];
        } else {
            return $this->error("Place ID parameter is required");
        }
        
        if (array_key_exists("auth", $_POST)) {
            $auth = $_POST["auth"];
        } else {
            return $this->error("Auth parameter is required");
        }
        
        if (array_key_exists("rating", $_POST)) {
            $rating = $_POST["rating"];
            if ($rating < 0 || $rating > 10) {
                return $this->error("Rating must be in range 0..10");
            }
        } else {
            return $this->error("Rating parameter is required");
        }
        
        include_once('sqlHandler/dbconnector.php');
        $DB = new DBPDO();
        $username = $DB->fetch("SELECT Username FROM Tokens WHERE Auth_token = ?",array($auth));
        
        if ($username === false) {
            return $this->error("Cannot find user");
        } else {
            $username = $username["Username"];
        }
        
        $currentRating = $DB->fetch("SELECT * FROM Place_Ratings WHERE Username = ? AND Place_ID = ?",array($username,$place_id));
        if ($currentRating === false) {
            $DB->execute("INSERT INTO Place_Ratings(Username,Place_ID,Rating) VALUES(?,?,?)",array($username,$place_id,$rating));
        } else {
            $DB->execute("UPDATE Place_Ratings SET Rating = ? WHERE Username = ? AND Place_ID = ?",array($rating,$username,$place_id));
        }
        
        $DB->execute("UPDATE Places SET Av_Rating = (SELECT AVG(Rating) FROM Place_Ratings WHERE Place_ID = ?) WHERE ID = ?",array($place_id,$place_id));
        $result = $DB->fetch("SELECT ID, Av_Rating FROM Places WHERE ID = ?",array($place_id));

        $DB->execute("UPDATE User_Stats SET Locations_Rated = Locations_Rated + 1 WHERE Username = ?", array($username));
        
        return json_encode($result);
    }

    private function getRating(){

        if (array_key_exists("place_id", $_POST)) {
            $place_id = $_POST["place_id"];
        } else {
            return $this->error("Place ID parameter is required");
        }
        
        if (array_key_exists("auth", $_POST)) {
            $auth = $_POST["auth"];
        } else {
            return $this->error("Auth parameter is required");
        }

        include_once('sqlHandler/dbconnector.php');
        $DB = new DBPDO();
        $username = $DB->fetch("SELECT Username FROM Tokens WHERE Auth_token = ?",array($auth));
        
        if ($username === false) {
            return $this->error("Cannot find user");
        } else {
            $username = $username["Username"];
        }

        $currentRating = $DB->fetch("SELECT * FROM Place_Ratings WHERE Username = ? AND Place_ID = ?",array($username,$place_id));

        return json_encode($currentRating);

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

    private function noPlacesNearby(){
        $success = [
            "error" => false,
            "noPlaces" => true,
            "reply" => "No Places found nearby"
        ];
        
        return json_encode($success);
    }
    
}

?>
