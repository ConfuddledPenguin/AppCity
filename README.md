AppCity App
=========

###Description##

This was a project for the class CS317 at the university of Strathclyde. The class focuses on mobile development and the issues it creates in terms of user interaction. It is more about the design rather than development, hence the web app.

We have decided to create an app that encourages users to share events and places in their local community involving them in the community and getting them learning about and exploring there local area. Of course this can also be used when away from the users local area, as a crowd sourced tourist guide. 


###Tools, Frameworks and fonts###

CSS written in [sass](http://sass-lang.com/).

[JQuery](http://jquery.com/) heavily used and loved.

[handlebars.js](http://handlebarsjs.com/) used for templating.

DataBase connections handled by [edrackham's](http://edrackham.com/) handy [class](https://github.com/a1phanumeric/PHP-MySQL-Class).

Using [iconmoon](https://icomoon.io/) fonts for the icons.

Using the google fonts to get [roboto](http://www.google.com/fonts/specimen/Roboto).

###Set Up###

There are three main folders in this project.

The App folder contains the html5 app, the contents should be placed in the root directory that you wish to serve the app from.

The Backend folder contains the php API that the App requires to run. The contents should be placed in the folder 'api/v1' relative to the root folder the app is deployed in. This folder contains the sqlHandler folder, in here there is a dbconnectorTemplate file that should be copies with the name "dbconnector.php" and then have the db information added.

The last folder SQL, contains the SQL commands required to set up the database. 


###License###

Copyright 2014 


Thomas Maxwell	-	gvb12182@uni.strath.ac.uk

Marcin Biolik   -

David Clark			- qnb12183@uni.strath.ac.uk


This project can not be copied and/or distributed without the express permission of the authors.
