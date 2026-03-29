<?php

$servidor = "localhost";
$database = "portal_anuncios";
$usuario = "root";
$senha = "";

$conexao = new mysqli($servidor, $usuario, $senha, $database);

if ($conexao->connect_errno) {
    die("Erro na conexão: " . $conexao->connect_error);
}

$conexao->set_charset("utf8mb4");

?>