const posts = [

{
titulo:"Carona Jacareí → São José dos Campos",
preco:20,
periodo:"/dia",
tag:"TRANSPORTE",
descricao:"Carona diária saindo às 7h do centro de Jacareí até a Univap em São José dos Campos.",
autor:"Carlos Henrique",
email:"carlos@email.com",
telefone:"(12) 99111-2222",
imagem:"https://source.unsplash.com/400x300/?car"
},

{
titulo:"Dividir apartamento perto da faculdade",
preco:800,
periodo:"/mês",
tag:"MORADIA",
descricao:"Quarto disponível em apartamento mobiliado a 10 minutos da faculdade.",
autor:"Ana Paula",
email:"ana@email.com",
telefone:"(12) 98888-3333",
imagem:"https://source.unsplash.com/400x300/?apartment"
},

{
titulo:"Estágio em desenvolvimento web",
preco:1200,
periodo:"/mês",
tag:"ESTÁGIO",
descricao:"Empresa procura estudante para estágio em programação com PHP e JavaScript.",
autor:"Tech Solutions",
email:"rh@techsolutions.com",
telefone:"(12) 97777-4444",
imagem:"https://source.unsplash.com/400x300/?programming"
},

{
titulo:"Carona para faculdade período noturno",
preco:15,
periodo:"/dia",
tag:"TRANSPORTE",
descricao:"Saída às 18h do bairro Villa Branca para universidades em São José.",
autor:"Juliana Souza",
email:"juliana@email.com",
telefone:"(12) 96666-5555",
imagem:"https://source.unsplash.com/400x300/?road"
},

{
titulo:"Quarto individual em república estudantil",
preco:650,
periodo:"/mês",
tag:"MORADIA",
descricao:"República organizada com internet, cozinha equipada e lavanderia.",
autor:"República Universitária",
email:"contato@republica.com",
telefone:"(12) 95555-6666",
imagem:"https://source.unsplash.com/400x300/?student-house"
},

{
titulo:"Estágio em marketing digital",
preco:1000,
periodo:"/mês",
tag:"ESTÁGIO",
descricao:"Agência busca estudante criativo para trabalhar com redes sociais e anúncios.",
autor:"Agência Criativa",
email:"rh@agenciacriativa.com",
telefone:"(12) 94444-7777",
imagem:"https://source.unsplash.com/400x300/?marketing"
},

{
titulo:"Carona compartilhada para São Paulo",
preco:50,
periodo:"/viagem",
tag:"TRANSPORTE",
descricao:"Saída sexta-feira às 17h para São Paulo, divisão de combustível.",
autor:"Pedro Lima",
email:"pedro@email.com",
telefone:"(12) 93333-8888",
imagem:"https://source.unsplash.com/400x300/?highway"
},

{
titulo:"Apartamento para dividir com estudante",
preco:900,
periodo:"/mês",
tag:"MORADIA",
descricao:"Apartamento amplo próximo ao centro com garagem e internet.",
autor:"Fernanda Alves",
email:"fernanda@email.com",
telefone:"(12) 92222-9999",
imagem:"https://source.unsplash.com/400x300/?home"
},

{
titulo:"Estágio em suporte de TI",
preco:1300,
periodo:"/mês",
tag:"ESTÁGIO",
descricao:"Empresa de tecnologia busca estagiário para suporte técnico e manutenção.",
autor:"InfoTech",
email:"contato@infotech.com",
telefone:"(12) 91111-0000",
imagem:"https://source.unsplash.com/400x300/?technology"
}

]

const container=document.getElementById("cardsContainer")

function renderCards(lista){

const noResults=document.getElementById("noResults")

container.innerHTML=""

if(lista.length===0){

noResults.style.display="block"
return

}else{

noResults.style.display="none"

}

lista.forEach(post=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`

<img src="${post.imagem}">

<div class="card-content">

<div class="card-header">
<h3>${post.titulo}</h3>
<div class="price">R$${post.preco}${post.periodo}</div>
</div>

<div class="tag">${post.tag}</div>

<div class="descricao-preview">${post.descricao}</div>

<div class="autor">${post.autor}</div>

</div>

<div class="card-overlay">

<h3>Contato</h3>

<p>${post.email}</p>
<p>${post.telefone}</p>

</div>

`

container.appendChild(card)

})

ativarAnimacao()

}

/* EXPANSÃO */

function ativarAnimacao(){

document.querySelectorAll(".card").forEach(card=>{

let timer

card.addEventListener("mouseenter",()=>{

timer=setTimeout(()=>{

card.classList.add("expanded")

},1200)

})

card.addEventListener("mouseleave",()=>{

clearTimeout(timer)

card.classList.remove("expanded")

})

})

}

/* FILTROS */

let tagSelecionada="all"
let precoMax=3000

function aplicarFiltros(){  

const filtrados=posts.filter(p=>{

const tagOk=tagSelecionada==="all"||p.tag===tagSelecionada
const precoOk=p.preco<=precoMax

return tagOk && precoOk

})

renderCards(filtrados)

}

/* TAG */

document.querySelectorAll(".tag-filter").forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".tag-filter").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

tagSelecionada=btn.dataset.tag

aplicarFiltros()

}

})

/* SLIDER */

const slider=document.getElementById("priceSlider")
const input=document.getElementById("priceInput")

slider.oninput=()=>{

input.value=slider.value

precoMax=parseInt(slider.value)

const percent=(slider.value-slider.min)/(slider.max-slider.min)*100

slider.style.background = "linear-gradient(#4CAF50,#4CAF50) 0/100% 100% no-repeat,#ddd"
aplicarFiltros()

}

input.oninput=()=>{

slider.value=input.value

precoMax=parseInt(input.value)

aplicarFiltros()

}

renderCards(posts)