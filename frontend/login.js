const formLogin = document.getElementById("formLogin")
const erroDiv = document.getElementById("erroLogin")

formLogin.addEventListener("submit", async (e) => {

  e.preventDefault()
  erroDiv.hidden = true

  const formData = new FormData(formLogin)

  try {

    const resposta = await fetch('http://localhost/faculdade/backend/login.php', {
      method: 'POST',
      body: formData,
      credentials: 'include'
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