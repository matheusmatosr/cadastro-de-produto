// Verifica se há produtos cadastrados no localStorage
let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || [];

// Verifica se há lista de compras no localStorage
let listaCompras = JSON.parse(localStorage.getItem('listaCompras')) || [];

// Função para atualizar a lista de compras no localStorage
function atualizarListaCompras() {
  localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
}

// Função para renderizar a tabela de produtos
function renderizarTabela() {
  const tableBody = document.querySelector('#listaTable tbody');
  tableBody.innerHTML = '';

  listaProdutos.forEach(produto => {
    // Verificar se o produto está ativo
    if (!produto.ativo) return;

    const tr = document.createElement('tr');

    const codigoTd = document.createElement('td');
    codigoTd.textContent = produto.codigo;
    tr.appendChild(codigoTd);

    const nomeTd = document.createElement('td');
    nomeTd.textContent = produto.nome;
    tr.appendChild(nomeTd);

    const unidadeTd = document.createElement('td');
    unidadeTd.textContent = produto.unidade;
    tr.appendChild(unidadeTd);

    const quantidadeNecessarioTd = document.createElement('td');
    quantidadeNecessarioTd.textContent = produto.quantidade;
    tr.appendChild(quantidadeNecessarioTd);

    const quantidadeCadastradoTd = document.createElement('td');
    quantidadeCadastradoTd.textContent = 0; // Quantidade cadastrada inicialmente é 0
    tr.appendChild(quantidadeCadastradoTd);

    const quantidadeCompradoTd = document.createElement('td');
    quantidadeCompradoTd.textContent = 0; // Quantidade comprada inicialmente é 0
    tr.appendChild(quantidadeCompradoTd);

    const coletadoTd = document.createElement('td');
    coletadoTd.textContent = '';
    tr.appendChild(coletadoTd);

    tableBody.appendChild(tr);
  });
}

// Função para marcar um produto como coletado
function marcarComoColetado(event) {
  const checkbox = event.target;
  const tr = checkbox.closest('tr');
  const codigo = parseInt(tr.querySelector('td:first-child').textContent);
  const quantidadeNecessario = parseInt(tr.querySelector('td:nth-child(4)').textContent);
  const quantidadeCompradoTd = tr.querySelector('td:nth-child(6)');

  if (checkbox.checked) {
    // Marcar como coletado
    tr.classList.add('strikethrough');
    quantidadeCompradoTd.textContent = quantidadeNecessario;
  } else {
    // Desmarcar como coletado
    tr.classList.remove('strikethrough');
    quantidadeCompradoTd.textContent = 0;
  }

  // Atualizar a lista de compras
  const produto = listaCompras.find(produto => produto.codigo === codigo);
  if (produto) {
    produto.coletado = checkbox.checked;
    produto.quantidadeComprado = parseInt(quantidadeCompradoTd.textContent);
  } else {
    listaCompras.push({
      codigo,
      coletado: checkbox.checked,
      quantidadeComprado: parseInt(quantidadeCompradoTd.textContent)
    });
  }

  // Atualizar a lista de compras no localStorage
  atualizarListaCompras();
}

// Associar a função de marcarComoColetado aos eventos change dos checkboxes
const checkboxes = document.querySelectorAll('#listaTable tbody input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', marcarComoColetado);
});

// Inicializar a tabela de produtos
renderizarTabela();
