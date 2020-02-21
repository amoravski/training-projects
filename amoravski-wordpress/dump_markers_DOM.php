<?php
    require("cred.php");
    $dbhost =   'localhost';
    $dbuser =   'wpuser'; 
    $dbpwd  =   'strongpassword'; 
    $dbname =   'wordpress';
    $db =   new mysqli( $dbhost, $dbuser, $dbpwd, $dbname );

    $population = 0;
    if(array_key_exists("population",$_POST)) {
        $population = $_POST["population"];
    }
    
    if(array_key_exists("lat1",$_POST)) {
        $sql="select * from $table where lat >= $_POST[lat1] AND lat <= $_POST[lat2] AND lng >= $_POST[lng1] AND lng <= $_POST[lng2] AND population >= $population";
    }
    else {
        $sql="select * from $table where population > $population";
    }
    $result=$db->query( $sql );
    $attribs=array('name','lat','lng', 'population');

    $dom=new DOMDocument('1.0','utf-8');
    $dom->formatOutput=true;
    $dom->standalone=true;
    $dom->recover=true;

    $root=$dom->createElement('tbl_master_property');
    $dom->appendChild( $root );

    while( $rs=$result->fetch_object() ){
        $node=$dom->createElement('property');
        $root->appendChild( $node );

        foreach( $attribs as $attrib ){
            $attr = $dom->createAttribute( $attrib );
            $value= $dom->createTextNode( $rs->$attrib );
            $attr->appendChild( $value );
            $node->appendChild( $attr );
        }
    }

    header("Content-Type: application/xml");
    echo $dom->saveXML();

?>
