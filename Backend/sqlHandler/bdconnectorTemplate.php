<?php

/*
 * Template for the dbconnector, fill with the relevant info and rename
 * to dbconnector.php
 */

define('DATABASE_NAME', 'name');
define('DATABASE_USER', 'user');
define('DATABASE_PASS', 'pass');
define('DATABASE_HOST', 'host');
include_once('class.DBPDO.php');
$DB = new DBPDO();

?>