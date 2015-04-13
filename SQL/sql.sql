USE gvb12182;
CREATE TABLE Users (
  Username varchar(255) NOT NULL, 
  password varchar(255) NOT NULL, 
  PRIMARY KEY (Username)
);
CREATE TABLE User_Stats (
  Username           varchar(255) NOT NULL, 
  Locations_Added    int(10) NOT NULL, 
  Locations_Modified int(10) NOT NULL, 
  Locations_Rated    int(10) NOT NULL, 
  Guides_Added       int(10) NOT NULL, 
  Guides_Modified    int(10) NOT NULL, 
  Guides_Rated       int(10) NOT NULL, 
  Events_Created     int(10) NOT NULL, 
  Events_Modified    int(10) NOT NULL, 
  Events_Rated       int(10) NOT NULL, 
  Community_Rating   int(10) NOT NULL, 
  PRIMARY KEY (Username)
);
CREATE TABLE Places (
  ID         int(10) NOT NULL AUTO_INCREMENT, 
  Name       varchar(255) NOT NULL, 
  Short_des  blob NOT NULL, 
  Long_des   blob, 
  Av_Rating  int(10), 
  Lat_coord  int(10) NOT NULL, 
  Long_coord int(10) NOT NULL, 
  Address    int(10), 
  Place_Type int(10), 
  Image      int(10), 
  Link       int(10), 
  Phone      int(10), 
  PRIMARY KEY (ID)
);
CREATE TABLE Tokens (
  Auth_token varchar(255) NOT NULL, 
  Username   varchar(255) NOT NULL,
  Expires    bigint NOT NULL, 
  PRIMARY KEY (Auth_token)
);
