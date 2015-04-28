<?php

require_once('CoreAPI.class.php');

class GuidesAPI extends CoreAPI {
    
    protected function processPOST() {
        $auth = $this->checkAuth();
        if ($auth !== true) {
            return $auth;
        }
        
        if ($this->request === "addGuide") {
            return $this->addGuide();
        } elseif ($this->request === "rateGuide") {
            return $this->ratePlace();
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
    
    private function addGuide() {
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
            return $this->error("Longitude parameter is required");
        }
        
        $imageURL = array_key_exists("imageURL", $_POST) ? $_POST["imageURL"] : null;
        
        $Username = $this->getUsername($_POST["auth"]);

        if($Username["error"]){
            return $Username;
        }

        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $DB->execute("INSERT INTO Guides (Name, Short_des, Av_Rating, Lat_coord, Long_coord, Image) VALUES(?,?,?,?,?,?)", array($name, $short_desc, 0, $lat, $long, $imageURL));
        


        $DB->execute("UPDATE User_Stats SET Guides_Added = Guides_Added+1 WHERE Username = ?", array($Username));

        return $this->successGuideAdded();
    }

    private function getGuide(){

        if (array_key_exists("ID", $_GET)) {
            $ID = $_GET["ID"];
        } else {
            return $this->error("Place ID parameter is required");
        }

        include_once("sqlHandler/dbconnector.php");
        $DB = new DBPDO();
        $result = $DB->fetch("SELECT * FROM Guides WHERE ID = ?", array($ID)); 
        
        return json_encode($result);       

    }

    private function getGuidesPoint() {

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
            $result = $DB->fetchAll("SELECT *, ( 3959 * acos( cos( radians(?) ) * cos( radians( lat_coord ) ) * cos( radians( long_coord ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat_coord ) ) ) ) AS distance FROM Guides HAVING distance < ? ORDER BY distance LIMIT {$offset}, 10",
                array($lat, $long, $lat, $distance));

            $found = count($result);
            $distance = $distance * 2;
            if($distance > 100){
                if( $found === 0)
                    return json_encode($result);
                return $this->noGuidesNearby();
            }
        }

        return json_encode($result);
    }
    
    private function rateGuide() {
        if (array_key_exists("guide_id", $_POST)) {
            $place_id = $_POST["guide_id"];
        } else {
            return $this->error("Guide ID parameter is required");
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
        
        $currentRating = $DB->fetch("SELECT * FROM Guides_Ratings WHERE Username = ? AND Place_ID = ?",array($username,$place_id));
        if ($currentRating === false) {
            $DB->execute("INSERT INTO Guides_Ratings(Username,Place_ID,Rating) VALUES(?,?,?)",array($username,$guide_id,$rating));
        } else {
            $DB->execute("UPDATE Guides_Ratings SET Rating = ? WHERE Username = ? AND Place_ID = ?",array($rating,$username,$place_id));
        }
        
        $DB->execute("UPDATE Guides SET Av_Rating = (SELECT AVG(Rating) FROM Guides_Ratings WHERE Guide_ID = ?) WHERE ID = ?",array($place_id,$place_id));
        $result = $DB->fetch("SELECT ID, Av_Rating FROM Guides WHERE ID = ?",array($place_id));
        
        return json_encode($result);
    }
    
    ## error responses
    
    ## success responses
    
    private function successGuideAdded() {
        $success = [
            "error" => false,
            "reply" => "Guide has successfully been added"
        ];
        
        return json_encode($success);
    }

    private function noGuideNearby(){
        $success = [
            "error" => false,
            "noPlaces" => true,
            "reply" => "No Guides found nearby"
        ];
        
        return json_encode($success);
    }
    
}

?>
