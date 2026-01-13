export const firebaseConfig = {
  apiKey: "AIzaSyCMOOpIoaurHT2CyhHEN4vZxGmzedhaIwM",
  authDomain: "separacaofull.firebaseapp.com",
  databaseURL: "https://separacaofull-default-rtdb.firebaseio.com",
  projectId: "separacaofull",
  storageBucket: "separacaofull.firebasestorage.app",
  messagingSenderId: "137169730444",
  appId: "1:137169730444:web:0ed636854db0fe6f4734a9",
  measurementId: "G-LVQ56WFB5G"
};

import { doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Carregar produtos do Firestore
  let produtos = {};
  if (window.db) {
    const db = window.db;
    try {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const barcode = data.codigoFull || doc.id; // Use codigoFull se existir, senão doc.id
        produtos[barcode] = data;
      });
      console.log("Produtos carregados do Firestore:", produtos);
    } catch (error) {
      console.error("Erro ao carregar produtos do Firestore:", error);
    }
  }

  const input = document.getElementById("novocodigo");
  const addButton = document.getElementById("adicionar");
  const limparBtn = document.getElementById("limpar");
  const codRegisterDiv = document.querySelector("#codregister div");
  const totalItensSpan = document.querySelector("#totalitens .quantidade");
  const codigosUnicosSpan = document.querySelector("#quantcodigos .quantidade");

  let codigos = {};

  // Aguarde o Firebase carregar (window.db estará disponível)
  if (!window.db) {
    console.error("Firebase não inicializado.");
    return;
  }
  const db = window.db;

  // Função para salvar no Firestore
  async function salvarNoFirestore() {
    try {
      await setDoc(doc(db, "codigos", "usuario-padrao"), { // Use um ID único, ex.: UID do usuário
        codigos: codigos,
        ultimaAlteracao: new Date().toISOString()
      });
      console.log("Dados salvos no Firestore.");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  // Função para carregar do Firestore
  async function carregarDoFirestore() {
    try {
      const docSnap = await getDoc(doc(db, "codigos", "usuario-padrao"));
      if (docSnap.exists()) {
        const data = docSnap.data();
        codigos = data.codigos || {};
        atualizarDataAlteracao(data.ultimaAlteracao);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  }

  // Carregue dados do Firestore
  await carregarDoFirestore();
  renderizarCodigos();
  atualizarContadores();

  function atualizarDataAlteracao(ultimaAlteracao) {
    const divAlteracao = document.getElementById("ultima-alteracao");
    if (ultimaAlteracao) {
      const data = new Date(ultimaAlteracao).toLocaleString("pt-BR");
      divAlteracao.textContent = `Última alteração: ${data}`;
    } else {
      divAlteracao.textContent = "Última alteração: nunca";
    }
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
      const SKU = produto ? (produto.SKU || produto.sku) : "-";

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
        salvarNoFirestore();
      };

      const btnMais = document.createElement("button");
      btnMais.textContent = "+";
      btnMais.classList.add("simbols");
      btnMais.onclick = () => {
        codigos[codigo]++;
        renderizarCodigos();
        atualizarContadores();
        salvarNoFirestore();
      };

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "🗑";
      btnExcluir.classList.add("eliminar");
      btnExcluir.onclick = () => {
        delete codigos[codigo];
        renderizarCodigos();
        atualizarContadores();
        salvarNoFirestore();
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
    salvarNoFirestore();
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
    salvarNoFirestore(); // Ou delete o documento se quiser limpar completamente
  });
});
