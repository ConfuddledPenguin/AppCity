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
  Av_Rating  int(10) NOT NULL DEFAULT 0,
  Lat_coord  FLOAT(10,6) NOT NULL,
  Long_coord FLOAT(10,6) NOT NULL,
  Address    varchar(2048),
  Image      varchar(2048),
  Link       varchar(2048),
  Phone      varchar(32),
  PRIMARY KEY (ID)
);
CREATE TABLE Place_Ratings (
    Username    varchar(255) NOT NULL,
    Place_ID    int(10) NOT NULL,
    Rating      int(2) NOT NULL,
    PRIMARY KEY (Username,Place_ID),
    CONSTRAINT fk_Place_Ratings_Users
        FOREIGN KEY (Username)
        REFERENCES Users (Username)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_Place_Ratings_Places
        FOREIGN KEY (Place_ID)
        REFERENCES Places (ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE Tokens (
  Auth_token varchar(255) NOT NULL, 
  Username   varchar(255) NOT NULL,
  Expires    bigint NOT NULL, 
  PRIMARY KEY (Auth_token)
);
