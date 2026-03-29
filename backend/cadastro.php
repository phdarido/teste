<?php

session_start(); // 🔥 IMPORTANTE

header("Content-Type: application/json");

require_once "conexao.php";

$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$tipo_usuario = $_POST['tipo_usuario'] ?? '';
$documento = $_POST['documento'] ?? '';

if (!$nome || !$email || !$senha || !$tipo_usuario || !$documento) {
    echo json_encode(["erro" => "Preencha todos os campos"]);
    exit;
}

// 🔥 MAPEAMENTO
switch ($tipo_usuario) {

    case "IMOBILIARIA":
        $id_tipo_usuario = 1;
        $id_tipo_documento = 2;
        break;

    case "ALUNO":
        $id_tipo_usuario = 2;
        $id_tipo_documento = 3;
        break;

    case "OUTRO":
        $id_tipo_usuario = 4;
        $id_tipo_documento = 1;
        break;

    default:
        echo json_encode(["erro" => "Tipo inválido"]);
        exit;
}

// verifica duplicidade
$sql = "SELECT id FROM usuarios WHERE email = ? OR documento = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("ss", $email, $documento);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["erro" => "Email ou documento já cadastrado"]);
    exit;
}

// 🔐 hash
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// insert
$sql = "INSERT INTO usuarios 
(id_tipo_usuario, id_tipo_documento, documento, nome, email, senha)
VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

$stmt->bind_param(
    "iissss",
    $id_tipo_usuario,
    $id_tipo_documento,
    $documento,
    $nome,
    $email,
    $senhaHash
);

if ($stmt->execute()) {

    $usuario_id = $stmt->insert_id;

    // 🔥 LOGIN AUTOMÁTICO
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['usuario_nome'] = $nome;

    echo json_encode(["sucesso" => true]);

} else {
    echo json_encode(["erro" => "Erro ao cadastrar"]);
}

$stmt->close();
$conexao->close();