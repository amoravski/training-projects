<?php
require("cred.php");

foreach ($countries as $country) {
    //Gets me decoded json
    $json = file_get_contents("http://api.geonames.org/searchJSON?username=ksuhiyp&country=$country&maxRows=1000");

    $decoded_json = json_decode($json, true)['geonames'];

    // Opens a connection to a MySQL server
    $connection=mysqli_connect ('localhost', $username, $password);
    if (!$connection) {
      die('Not connected : ' . mysqli_connect_error());
    }

    // Set the active MySQL database
    $db_selected = mysqli_select_db($connection,$database);
    if (!$db_selected) {
      die ('Can\'t use db : ' . mysqli_connect_error());
    }

    $query = '';
    for($x=0; $x < sizeof($decoded_json); $x++) {
        if($query == ''){
            $query .= "INSERT INTO $table (geonameid, name,lat,lng,population)
                   VALUES (".
                    $decoded_json[$x]['geonameId'].",
                   '".mysqli_real_escape_string($connection,$decoded_json[$x]['name'])."',
                   '".$decoded_json[$x]['lat']."',
                   '".$decoded_json[$x]['lng']."',
                   ".$decoded_json[$x]['population']."),";
        }
        else {
            $query .= "\n(".$decoded_json[$x]['geonameId'].",
                   '".mysqli_real_escape_string($connection,$decoded_json[$x]['name'])."',
                   '".$decoded_json[$x]['lat']."',
                   '".$decoded_json[$x]['lng']."',
                   ".$decoded_json[$x]['population']."),";
        }
    }
    if($query != '') {
        $query = rtrim($query, ",") . " ON DUPLICATE KEY UPDATE name=VALUES(name), lat=VALUES(lat), lng=VALUES(lng), population=VALUES(population);";
        mysqli_query($connection, $query) or die("MySQL Error: " . mysqli_error($connection));
    }
    mysqli_close($connection);
}

?>
