<?php

session_start();
header("Content-Type: application/json");

require_once "conexao.php";

$login = $_POST['login'] ?? '';
$senha = $_POST['senha'] ?? '';

if (!$login || !$senha) {
    echo json_encode(["erro" => "Preencha todos os campos"]);
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email = ? OR nome = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("ss", $login, $login);
$stmt->execute();

$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if ($usuario && password_verify($senha, $usuario['senha'])) {

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];

    echo json_encode(["sucesso" => true]);

} else {
    echo json_encode(["erro" => "Login e/ou senha incorretos"]);
}

$stmt->close();
$conexao->close();