<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "conexao.php";

$sql = "SELECT 
    a.id,
    a.titulo,
    a.descricao,
    a.telefone,
    a.contato_nome,
    a.preco,
    p.descricao AS periodo,
    t.descricao AS tipo
FROM anuncios a
LEFT JOIN periodo p ON a.id_periodo = p.id
JOIN tipo_anuncio t ON a.id_tipo = t.id
ORDER BY a.id DESC";

$result = $conexao->query($sql);

$anuncios = [];

while ($row = $result->fetch_assoc()) {
    $anuncios[] = $row;
}

echo json_encode($anuncios);

$conexao->close();