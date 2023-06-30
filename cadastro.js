// Verifica se há produtos cadastrados no localStorage
let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || [];

// Verifica se há lista de compras no localStorage
let listaCompras = JSON.parse(localStorage.getItem('listaCompras')) || [];

// Função para atualizar a lista de compras no localStorage
function atualizarListaCompras() {
  localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
}

// Função para atualizar a lista de produtos no localStorage
function atualizarListaProdutos() {
  localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
}

// Função para cadastrar um novo produto
function cadastrarProduto(event) {
  event.preventDefault();

  // Obter os valores do formulário
  const codigo = document.getElementById('codigo').value;
  const nome = document.getElementById('nome').value;
  const unidade = document.getElementById('unidade').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const ativo = document.getElementById('ativo').checked;

  // Criar o objeto do novo produto
  const novoProduto = {
    codigo,
    nome,
    unidade,
    quantidade,
    ativo
  };

  // Adicionar o novo produto à lista
  listaProdutos.push(novoProduto);

  // Atualizar a lista de produtos no localStorage
  atualizarListaProdutos();

  if (quantidade >= 2){
    // Adicionar o produto à lista de compras
    listaCompras.push(novoProduto);
    atualizarListaCompras();
  }

  // Limpar o formulário
  document.getElementById('codigo').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('unidade').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('codigoBarra').value = '';
  document.getElementById('ativo').checked = true;

  alert('Produto cadastrado com sucesso!');
}

function limparFormulario(){
  document.getElementById('codigo').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('unidade').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('codigoBarra').value = '';
  document.getElementById('ativo').checked = true;
}

// Associar a função de cadastrarProduto ao evento submit do formulário
document.getElementById('cadastroForm').addEventListener('submit', cadastrarProduto);
