<?php
$_POST = json_decode( file_get_contents("php://input"), true );//получаем на php json данные (для рабоыт с json форматом)
echo var_dump($_POST);