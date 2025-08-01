document.addEventListener("DOMContentLoaded", function () {
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
        const objeto = JSON.parse(dadosSalvos);
        for (let codigo in objeto) {
            codigos[codigo] = objeto[codigo];
        }
    }

    renderizarCodigos();
    atualizarContadores();

    // 👉 Chame aqui:
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
        for (let codigo in codigos) {
            total += codigos[codigo];
        }
        totalItensSpan.textContent = total;
        codigosUnicosSpan.textContent = Object.keys(codigos).length;
    }

    function renderizarCodigos() {
        codRegisterDiv.innerHTML = "";
        for (let codigo in codigos) {
            const container = document.createElement("div");
            container.classList.add("codigo-item");

            const spanQtd = document.createElement("span");
            spanQtd.textContent = codigos[codigo] + "x";
            spanQtd.classList.add("codigo");

            const spanCodigo = document.createElement("span");
            spanCodigo.textContent = codigo;
            spanCodigo.classList.add("codigo");

            const botoesContainer = document.createElement("div");
            botoesContainer.classList.add("botoes-codigo");

            const btnMenos = document.createElement("button");
            btnMenos.textContent = "-";
            btnMenos.classList.add('simbols');
            btnMenos.onclick = () => {
                if (codigos[codigo] > 1) {
                    codigos[codigo]--;
                } else {
                    delete codigos[codigo];
                }
                renderizarCodigos();
                atualizarContadores();
                salvarNoLocalStorage();
            };

            const btnMais = document.createElement("button");
            btnMais.textContent = "+";
            btnMais.classList.add('simbols');
            btnMais.onclick = () => {
                codigos[codigo]++;
                renderizarCodigos();
                atualizarContadores();
                salvarNoLocalStorage();
            };

            const btnExcluir = document.createElement("button");
            btnExcluir.classList.add('eliminar');
            btnExcluir.textContent = "🗑";
            btnExcluir.onclick = () => {
                delete codigos[codigo];
                renderizarCodigos();
                atualizarContadores();
                salvarNoLocalStorage();
            };

            botoesContainer.appendChild(btnMenos);
            botoesContainer.appendChild(btnMais);
            botoesContainer.appendChild(btnExcluir);

            const infoCodigo = document.createElement("div");
            infoCodigo.classList.add("info-codigo");
            infoCodigo.appendChild(spanQtd);
            infoCodigo.appendChild(spanCodigo);

            container.appendChild(infoCodigo);
            container.appendChild(botoesContainer);

            codRegisterDiv.appendChild(container);
        }
    }

    function adicionarCodigo(codigo) {
        if (codigo.trim() === "") return;
        if (Object.keys(codigos).length >= 15 && !(codigo in codigos)) return;

        if (codigo in codigos) {
            codigos[codigo]++;
        } else {
            codigos[codigo] = 1;
        }

        input.value = "";
        renderizarCodigos();
        atualizarContadores();
        salvarNoLocalStorage();
    }

    addButton.addEventListener("click", () => {
        adicionarCodigo(input.value);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            adicionarCodigo(input.value);
        }
    });

    limparBtn.addEventListener("click", () => {
        for (let key in codigos) delete codigos[key];
        renderizarCodigos();
        atualizarContadores();
        localStorage.removeItem("codigos");
    });
});
