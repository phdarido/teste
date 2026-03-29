const tipoUsuario = document.getElementById("tipoUsuario")
const labelDocumento = document.getElementById("labelDocumento")
const campoDocumento = document.getElementById("campoDocumento")

// 🔥 muda label automaticamente
tipoUsuario.addEventListener("change", () => {

  const tipo = tipoUsuario.value

  if (tipo === "ALUNO") {
    labelDocumento.textContent = "Matrícula"
  } else if (tipo === "PESSOA") {
    labelDocumento.textContent = "CPF"
  } else if (tipo === "IMOBILIARIA") {
    labelDocumento.textContent = "CNPJ"
  }

  campoDocumento.value = ""
})


// envio
const formCadastro = document.getElementById("formCadastro")
const erroDiv = document.getElementById("erroCadastro")

formCadastro.addEventListener("submit", async (e) => {

  e.preventDefault()
  erroDiv.hidden = true

  const formData = new FormData(formCadastro)

  try {

    const resposta = await fetch('http://localhost/faculdade/backend/cadastro.php', {
      method: 'POST',
      body: formData
    })

    const resultado = await resposta.json()

    if (resultado.sucesso) {
      window.location.href = "index.html"
    } else {
      erroDiv.textContent = resultado.erro
      erroDiv.hidden = false
    }

  } catch (erro) {
    erroDiv.textContent = "Erro no servidor"
    erroDiv.hidden = false
  }
})