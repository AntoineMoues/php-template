<?php
 $q = isset($_GET["q"]) ? $_GET["q"]  : '';

 if ($q == '') {
     header('Location: '.URL.'form');
 }
 elseif ($q=="form") {
     $page="form";
 }
 else {
    $page = '404';
}

include 'views/pages/'.$page.'.php';
