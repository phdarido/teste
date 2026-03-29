<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "conexao.php";

// Evitar erro se não vier nada
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["erro" => "Método inválido"]);
    exit;
}

$tipo = $_POST['tipo'] ?? null;
$titulo = $_POST['titulo'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$nome = $_POST['contato_nome'] ?? '';
$telefone = $_POST['contato_telefone'] ?? '';
$preco = $_POST['preco'] ?? 0;
$periodo = $_POST['periodo'] ?? null;

// Validação mínima
if (!$tipo || !$titulo || !$descricao) {
    echo json_encode(["erro" => "Dados obrigatórios faltando"]);
    exit;
}

// Mapeamento
$tipos = [
    "MORADIA" => 1,
    "TRANSPORTE" => 2,
    "EMPREGO" => 3
];

$periodos = [
    "/dia" => 1,
    "/mês" => 2,
];

$id_tipo = $tipos[$tipo] ?? null;
$id_periodo = $periodos[$periodo] ?? null;

// SQL
$sql = "INSERT INTO anuncios 
(usuario_id, id_tipo, titulo, descricao, telefone, contato_nome, preco, id_periodo)
VALUES (1, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    echo json_encode(["erro" => "Erro no prepare"]);
    exit;
}

$stmt->bind_param(
    "issssdi",
    $id_tipo,
    $titulo,
    $descricao,
    $telefone,
    $nome,
    $preco,
    $id_periodo
);

if ($stmt->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode([
        "erro" => "Erro ao salvar",
        "detalhe" => $stmt->error
    ]);
}

$stmt->close();
$conexao->close();

?>