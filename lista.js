// Verifica se há produtos cadastrados no localStorage
let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || [];

// Verifica se há lista de compras no localStorage
let listaCompras = JSON.parse(localStorage.getItem('listaCompras')) || [];

// Função para atualizar a lista de compras no localStorage
function atualizarListaCompras() {
  listaCompras = listaProdutos.filter(produto => {
    return produto.quantidadeComprada >= produto.quantidadeNecessaria || produto.coletado;
  });

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
    tr.setAttribute('data-codigo', produto.codigo);

    const codigoTd = criarTd(produto.codigo);
    tr.appendChild(codigoTd);

    const nomeTd = criarTd(produto.nome);
    tr.appendChild(nomeTd);

    const unidadeTd = criarTd(produto.unidade);
    tr.appendChild(unidadeTd);

    const quantidadeCompradoTd = criarTd(produto.quantidade);
    tr.appendChild(quantidadeCompradoTd);

    const quantidadeNecessarioTd = criarTd(2);
    tr.appendChild(quantidadeNecessarioTd);

    const coletadoTd = criarTd();
    if (quantidadeCompradoTd.textContent >= quantidadeNecessarioTd.textContent) {
      coletadoTd.textContent = 'Coletado';
      tr.classList.add('strikethrough'); 
    } else {
      coletadoTd.textContent = 'Não Coletado';
    }
    tr.appendChild(coletadoTd);

    const editarTd = criarTd();
    const editarButton = criarButton('Editar', editarProduto.bind(null, tr));
    editarTd.appendChild(editarButton);
    tr.appendChild(editarTd);

    const salvarTd = criarTd();
    const salvarButton = criarButton('Salvar', salvarProduto.bind(null, tr));
    salvarTd.appendChild(salvarButton);
    salvarTd.style.display = 'none'; // Oculta o botão "Salvar" inicialmente
    tr.appendChild(salvarTd);

    const excluirTd = criarTd();
    const excluirButton = criarButton('Excluir', excluirProduto.bind(null, produto, tr));
    excluirTd.appendChild(excluirButton);
    tr.appendChild(excluirTd);

    tableBody.appendChild(tr);
  });
}

// Função auxiliar para criar uma célula da tabela (td)
function criarTd(textContent) {
  const td = document.createElement('td');
  td.textContent = textContent || '';
  return td;
}

// Função auxiliar para criar um botão
function criarButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.style.backgroundColor = '#6135fd'; // Definir cor do botão
  button.style.fontSize = '15px'; // Aumentar o tamanho do botão
  button.style.color = 'white';
  button.style.padding = '5px 7px 5px 10px';
  return button;
}

// Função para editar um produto
function editarProduto(tr) {
  const editarTd = tr.querySelector('td:nth-last-child(3)');
  const salvarTd = tr.querySelector('td:nth-last-child(2)');
  const excluirTd = tr.querySelector('td:last-child');

  const nomeTd = tr.querySelector('td:nth-child(2)');
  const unidadeTd = tr.querySelector('td:nth-child(3)');
  const quantidadeNecessarioTd = tr.querySelector('td:nth-child(4)');

  const nomeInput = criarInput(nomeTd.textContent);
  nomeInput.style.width = nomeTd.clientWidth + 'px'; // Define a largura do input igual à largura da célula

  const unidadeInput = criarInput(unidadeTd.textContent);
  unidadeInput.style.width = unidadeTd.clientWidth + 'px'; // Define a largura do input igual à largura da célula

  const quantidadeNecessarioInput = criarInput(quantidadeNecessarioTd.textContent);
  quantidadeNecessarioInput.style.width = quantidadeNecessarioTd.clientWidth + 'px'; // Define a largura do input igual à largura da célula

  nomeTd.textContent = '';
  nomeTd.appendChild(nomeInput);

  unidadeTd.textContent = '';
  unidadeTd.appendChild(unidadeInput);

  quantidadeNecessarioTd.textContent = '';
  quantidadeNecessarioTd.appendChild(quantidadeNecessarioInput);

  editarTd.style.display = 'none';
  salvarTd.style.display = '';
  excluirTd.style.display = 'none';
}

// Função para salvar as alterações de um produto
function salvarProduto(tr) {
  const editarTd = tr.querySelector('td:nth-last-child(3)');
  const salvarTd = tr.querySelector('td:nth-last-child(2)');
  const excluirTd = tr.querySelector('td:last-child');

  const nomeTd = tr.querySelector('td:nth-child(2)');
  const unidadeTd = tr.querySelector('td:nth-child(3)');
  const quantidadeNecessarioTd = tr.querySelector('td:nth-child(4)');

  const codigo = parseInt(tr.getAttribute('data-codigo'));
  const nomeInput = nomeTd.querySelector('input');
  const unidadeInput = unidadeTd.querySelector('input');
  const quantidadeNecessarioInput = quantidadeNecessarioTd.querySelector('input');

  const nome = nomeInput.value;
  const unidade = unidadeInput.value;
  const quantidadeNecessario = parseInt(quantidadeNecessarioInput.value);

  const produtoIndex = listaProdutos.findIndex(p => p.codigo === codigo);
  if (produtoIndex !== -1) {
    listaProdutos[produtoIndex].nome = nome;
    listaProdutos[produtoIndex].unidade = unidade;
    listaProdutos[produtoIndex].quantidade = quantidadeNecessario;
    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
  }

  nomeTd.textContent = nome;
  unidadeTd.textContent = unidade;
  quantidadeNecessarioTd.textContent = quantidadeNecessario;

  tr.classList.remove('editing');
  editarTd.style.display = '';
  salvarTd.style.display = 'none';
  excluirTd.style.display = '';

  if (quantidadeComprado >= quantidadeNecessarioTd.textContent || tr.classList.contains('strikethrough')) {
    produto.coletado = true;
  } else {
    produto.coletado = false;
  }
  atualizarListaCompras();

  renderizarTabela(); // Atualizar a tabela após salvar as alterações
}

// Função para excluir um produto
function excluirProduto(produto, tr) {
  if (confirm('Deseja excluir o produto?')) {
    produto.ativo = false;
    tr.remove();

    // Atualizar a lista de compras removendo o produto
    listaCompras = listaCompras.filter(p => p.codigo !== produto.codigo);
    atualizarListaCompras();

    // Remover o produto do localStorage
    listaProdutos = listaProdutos.filter(p => p.codigo !== produto.codigo);
    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
  }
}


// Função auxiliar para criar um campo de input
function criarInput(value) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value || '';
  return input;
}

// Associar a função de marcarComoColetado aos eventos change dos checkboxes
const checkboxes = document.querySelectorAll('#listaTable tbody input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', marcarComoColetado);
});

// Inicializar a tabela de produtos
renderizarTabela();