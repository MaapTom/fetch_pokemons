const container = document.querySelector('.content');
const buttonEnviar = document.querySelector('input[type="submit"]');
const input = document.querySelector('input[name="search"]');
const cleanCard = document.querySelector('button');

async function puxarDados() {
  if (input.value == '') {
    alert('Coloque um pokemon no campo')
    return;
  }

  loading(true);  
  const inputValue = input.value.toLowerCase();

  const end = (`https://pokeapi.co/api/v2/pokemon/${inputValue}`);
  const mensagemErro = document.querySelector('.mensagemErro');
  mensagemErro.style.display = 'none';

  input.value = '';

  try{
    const dadosPokemon = await fetch(end);
    const converterJSON = await dadosPokemon.json();
    montarCard(converterJSON);
    
    cleanCard.addEventListener('click', limparCards);
  } catch(erro) {
      mensagemErro.style.display = 'block';
      loading(false);  
      return erro;
  }

}

function loading(boolean){
  const divLoading = document.querySelector('.loading');
  boolean ? divLoading.style.display = 'block' : divLoading.style.display = 'none';
}


async function montarCard(dados) {
  // Imagem
  const url = dados.sprites.other["official-artwork"].front_default;
  const imagem = document.createElement('img');
  imagem.src = url;

  // Nome
  const name = document.createElement('li');
  const textName = document.createTextNode("Nome: " + dados.name);
  name.appendChild(textName);

  // Tipo
  const tipo = document.createElement('li');
  const textTipo = document.createTextNode("Tipo: "+dados.types[0].type.name);
  tipo.appendChild(textTipo);

  // Habilidades
  const habilidades = document.createElement('li');
  const hability = dados.abilities.map((habilidade) =>{
    return habilidade.ability.name;
  })
  const textHabilidade = document.createTextNode("Habilidades: "+hability.toString());
  habilidades.appendChild(textHabilidade);

  // Descrição
  try{
    const dadosDescricao = await fetch(dados.species.url);
    const converteDados = await dadosDescricao.json();
    const descricao = document.createElement('li');

    const textDescricao = document.createTextNode("Descrição: "+converteDados.flavor_text_entries[1].flavor_text) || 'Descricao não encontrada';
    descricao.appendChild(textDescricao);
    renderCard(imagem, name, tipo, descricao , habilidades);

  } catch(erro){
    return erro;
  }
}

function renderCard(...values) {
  const containerUl = document.createElement('ul');
  loading(false)
  values.forEach((value) => {
    containerUl.appendChild(value)
    container.appendChild(containerUl);
  })
}
buttonEnviar.addEventListener('click', puxarDados);

function limparCards(event){
  event.preventDefault();

  container.innerHTML = '';
}