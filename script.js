document.addEventListener("DOMContentLoaded", async function () {
  const resposta = await fetch("produtos.json");
  const produtos = await resposta.json();

  console.log("Produtos carregados:", produtos);

  const input = document.getElementById("novocodigo");
  const addButton = document.getElementById("adicionar");
  const limparBtn = document.getElementById("limpar");
  const codRegisterDiv = document.querySelector("#codregister div");
  const totalItensSpan = document.querySelector("#totalitens .quantidade");
  const codigosUnicosSpan = document.querySelector("#quantcodigos .quantidade");

  let codigos = {};

  // Carrega dados salvos
  const dadosSalvos = localStorage.getItem("codigos");
  if (dadosSalvos) {
    codigos = JSON.parse(dadosSalvos);
  }

  renderizarCodigos();
  atualizarContadores();
  atualizarDataAlteracao();

  function salvarNoLocalStorage() {
    localStorage.setItem("codigos", JSON.stringify(codigos));
    const dataAtual = new Date().toLocaleString("pt-BR");
    localStorage.setItem("ultimaAlteracao", dataAtual);
    atualizarDataAlteracao();
  }

  function atualizarDataAlteracao() {
    const ultimaAlteracao = localStorage.getItem("ultimaAlteracao");
    const divAlteracao = document.getElementById("ultima-alteracao");
    divAlteracao.textContent = `Última alteração: ${ultimaAlteracao || "nunca"}`;
  }

  function atualizarContadores() {
    let total = 0;
    for (let codigo in codigos) total += codigos[codigo];
    totalItensSpan.textContent = total;
    codigosUnicosSpan.textContent = Object.keys(codigos).length;
  }

  function renderizarCodigos() {
    codRegisterDiv.innerHTML = "";
    for (let codigo in codigos) {
      const container = document.createElement("div");
      container.classList.add("codigo-item");

      const infoCodigo = document.createElement("div");
      infoCodigo.classList.add("info-codigo");

      // Quantidade
      const spanQtd = document.createElement("span");
      spanQtd.textContent = codigos[codigo] + "x";
      spanQtd.classList.add("quantidade");

      // Código de barras
      const spanCodigo = document.createElement("span");
      spanCodigo.textContent = codigo;
      spanCodigo.classList.add("codigo");

      // Dados do produto
      const produto = produtos[codigo];
      const nomeProduto = produto ? produto.nome : "Produto não cadastrado";
      const SKU = produto ? produto.SKU : "-";

      // Nome e código interno
      const spanNome = document.createElement("span");
      spanNome.textContent = nomeProduto;
      spanNome.classList.add("nome");

      const spanSKU = document.createElement("span");
      spanSKU.textContent = `SKU - ${SKU}`;
      spanSKU.classList.add("cod-interno");

      infoCodigo.appendChild(spanQtd);
      infoCodigo.appendChild(spanCodigo);
      infoCodigo.appendChild(spanNome);
      infoCodigo.appendChild(spanSKU);

      // Botões
      const botoesContainer = document.createElement("div");
      botoesContainer.classList.add("botoes-codigo");

      const btnMenos = document.createElement("button");
      btnMenos.textContent = "-";
      btnMenos.classList.add("simbols");
      btnMenos.onclick = () => {
        if (codigos[codigo] > 1) codigos[codigo]--;
        else delete codigos[codigo];
        renderizarCodigos();
        atualizarContadores();
        salvarNoLocalStorage();
      };

      const btnMais = document.createElement("button");
      btnMais.textContent = "+";
      btnMais.classList.add("simbols");
      btnMais.onclick = () => {
        codigos[codigo]++;
        renderizarCodigos();
        atualizarContadores();
        salvarNoLocalStorage();
      };

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "🗑";
      btnExcluir.classList.add("eliminar");
      btnExcluir.onclick = () => {
        delete codigos[codigo];
        renderizarCodigos();
        atualizarContadores();
        salvarNoLocalStorage();
      };

      botoesContainer.appendChild(btnMenos);
      botoesContainer.appendChild(btnMais);
      botoesContainer.appendChild(btnExcluir);

      container.appendChild(infoCodigo);
      container.appendChild(botoesContainer);
      codRegisterDiv.appendChild(container);
    }
  }

  function adicionarCodigo(codigo) {
    if (codigo.trim() === "") return;
    if (Object.keys(codigos).length >= 25 && !(codigo in codigos)) return;

    codigos[codigo] = (codigos[codigo] || 0) + 1;
    input.value = "";
    renderizarCodigos();
    atualizarContadores();
    salvarNoLocalStorage();
  }

  addButton.addEventListener("click", () => adicionarCodigo(input.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarCodigo(input.value);
    }
  });

  limparBtn.addEventListener("click", () => {
    codigos = {};
    renderizarCodigos();
    atualizarContadores();
    localStorage.removeItem("codigos");
  });
});
