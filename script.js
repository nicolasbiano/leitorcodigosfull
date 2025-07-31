
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("novocodigo");
    const addButton = document.getElementById("adicionar");
    const limparBtn = document.getElementById("limpar");
    const codRegisterDiv = document.querySelector("#codregister div");
    const totalItensSpan = document.querySelector("#totalitens .quantidade");
    const codigosUnicosSpan = document.querySelector("#quantcodigos .quantidade");

    const codigos = {};

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
            spanQtd.classList.add("quantidade-item");

            const spanCodigo = document.createElement("span");
            spanCodigo.textContent = codigo;

            const btnMenos = document.createElement("button");
            btnMenos.textContent = "-";
            btnMenos.onclick = () => {
                if (codigos[codigo] > 1) {
                    codigos[codigo]--;
                } else {
                    delete codigos[codigo];
                }
                renderizarCodigos();
                atualizarContadores();
            };

            const btnMais = document.createElement("button");
            btnMais.textContent = "+";
            btnMais.onclick = () => {
                codigos[codigo]++;
                renderizarCodigos();
                atualizarContadores();
            };

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "🗑";
            btnExcluir.onclick = () => {
                delete codigos[codigo];
                renderizarCodigos();
                atualizarContadores();
            };

            container.appendChild(spanQtd);
            container.appendChild(spanCodigo);
            container.appendChild(btnMenos);
            container.appendChild(btnMais);
            container.appendChild(btnExcluir);

            codRegisterDiv.appendChild(container);
        }
    }

    function adicionarCodigo(codigo) {
        if (codigo.trim() === "") return;
        if (Object.keys(codigos).length >= 5 && !(codigo in codigos)) return;

        if (codigo in codigos) {
            codigos[codigo]++;
        } else {
            codigos[codigo] = 1;
        }

        input.value = "";
        renderizarCodigos();
        atualizarContadores();
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
    });
});
