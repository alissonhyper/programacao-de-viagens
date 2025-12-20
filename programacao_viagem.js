/* =====================================================
   UTILITÁRIOS
===================================================== */
function listaComE(lista) {
    if (lista.length === 0) return "";
    if (lista.length === 1) return lista[0];
    if (lista.length === 2) return lista.join(" e ");
    return lista.slice(0, -1).join(", ") + " e " + lista.slice(-1);
}

function formatarData(data) {
    if (!data) return "";
    const p = data.split("-");
    const d = new Date(p[0], p[1] - 1, p[2]);
    const dias = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
    return `${dias[d.getDay()]} (${p[2]}/${p[1]}/${p[0]})`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

/* =====================================================
   SALVAMENTO AUTOMÁTICO (LOCALSTORAGE)
===================================================== */
function salvarDados() {
    const dadosGerais = {
        data: document.getElementById("data").value,
        inicio: document.getElementById("inicio").value,
        tecnico: document.getElementById("tecnico").value,
        auxiliar: document.getElementById("auxiliar").value
    };
    localStorage.setItem("prog_dadosGerais", JSON.stringify(dadosGerais));

    const servicos = [];
    document.querySelectorAll(".servico").forEach((s, i) => {
        if(s.checked) servicos.push(i);
    });
    localStorage.setItem("prog_servicos", JSON.stringify(servicos));

    const materiaisVar = [];
    const qtds = document.querySelectorAll(".qtd-mat");
    const modelos = document.querySelectorAll(".modelo-mat");
    qtds.forEach((q, i) => {
        materiaisVar.push({
            qtd: q.value,
            modelo: modelos[i].value
        });
    });
    localStorage.setItem("prog_materiaisVar", JSON.stringify(materiaisVar));

    const materiaisUni = {
        conApc: document.getElementById("qtd-con-apc").value,
        conUpc: document.getElementById("qtd-con-upc").value,
        nota: document.getElementById("qtd-nota").value,
        chave: document.getElementById("qtd-chave").value,
        almoco: document.getElementById("opt-almoco").value
    };
    localStorage.setItem("prog_materiaisUni", JSON.stringify(materiaisUni));

    const dadosCidades = [];
    document.querySelectorAll(".bloco-cidade").forEach((b, i) => {
        dadosCidades.push({
            ativo: document.querySelectorAll(".cidade")[i].checked,
            nome: document.querySelectorAll(".nome-cidade")[i].value,
            clientes: document.querySelectorAll(".clientes")[i].value,
            status: document.querySelectorAll(".status")[i].value
        });
    });
    localStorage.setItem("prog_cidades", JSON.stringify(dadosCidades));
}

function carregarDados() {
    const dadosGerais = JSON.parse(localStorage.getItem("prog_dadosGerais"));
    if (dadosGerais) {
        document.getElementById("data").value = dadosGerais.data || "";
        document.getElementById("inicio").value = dadosGerais.inicio || "";
        document.getElementById("tecnico").value = dadosGerais.tecnico || "";
        document.getElementById("auxiliar").value = dadosGerais.auxiliar || "";
    }

    const servicos = JSON.parse(localStorage.getItem("prog_servicos"));
    if (servicos) {
        const checkboxes = document.querySelectorAll(".servico");
        servicos.forEach(index => {
            if(checkboxes[index]) checkboxes[index].checked = true;
        });
    }

    const matVar = JSON.parse(localStorage.getItem("prog_materiaisVar"));
    if (matVar) {
        const qtds = document.querySelectorAll(".qtd-mat");
        const modelos = document.querySelectorAll(".modelo-mat");
        matVar.forEach((m, i) => {
            if(qtds[i]) qtds[i].value = m.qtd;
            if(modelos[i]) modelos[i].value = m.modelo;
        });
    }

    const matUni = JSON.parse(localStorage.getItem("prog_materiaisUni"));
    if (matUni) {
        document.getElementById("qtd-con-apc").value = matUni.conApc || "";
        document.getElementById("qtd-con-upc").value = matUni.conUpc || "";
        document.getElementById("qtd-nota").value = matUni.nota || "";
        document.getElementById("qtd-chave").value = matUni.chave || "";
        document.getElementById("opt-almoco").value = matUni.almoco || "";
    }

    const dadosCidades = JSON.parse(localStorage.getItem("prog_cidades"));
    if (dadosCidades) {
        document.querySelectorAll(".bloco-cidade").forEach((b, i) => {
            if (dadosCidades[i]) {
                document.querySelectorAll(".cidade")[i].checked = dadosCidades[i].ativo;
                document.querySelectorAll(".nome-cidade")[i].value = dadosCidades[i].nome;
                document.querySelectorAll(".clientes")[i].value = dadosCidades[i].clientes;
                document.querySelectorAll(".status")[i].value = dadosCidades[i].status;
            }
        });
    }
}

/* =====================================================
   FUNÇÃO DE COPIAR
===================================================== */
function copiarTexto(idElemento) {
    const textarea = document.getElementById(idElemento);
    if (!textarea.value) {
        alert("Não há texto para copiar! Gere a programação primeiro.");
        return;
    }
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textarea.value).then(() => {
        alert("Texto copiado com sucesso! ✅");
    }).catch(err => {
        console.error("Erro ao copiar", err);
        alert("Erro ao copiar. Tente selecionar manualmente.");
    });
}

/* =====================================================
   ABRIR / FECHAR CIDADES
===================================================== */
function atualizarCidades() {
    const checks = document.querySelectorAll(".cidade");
    const blocos = document.querySelectorAll(".bloco-cidade");
    blocos.forEach((b, i) => {
        b.style.display = checks[i].checked ? "block" : "none";
    });
}

/* =====================================================
   GERAR PROGRAMAÇÃO
===================================================== */
function gerarTexto() {
    let t = "";

    const data = document.getElementById("data").value;
    const inicio = document.getElementById("inicio").value;
    const tecnico = document.getElementById("tecnico").value;
    const auxiliar = document.getElementById("auxiliar").value;

    t += `PROGRAMAÇÃO DA VIAGEM - ${formatarData(data)}\n`;
    t += "----------------------------------------------------------------------------\n";
    t += `🔧 EQUIPE: ${tecnico} e ${auxiliar}\n`;

    const cidades = [];
    document.querySelectorAll(".cidade").forEach((c, i) => {
        if (c.checked) {
            const nome = document.querySelectorAll(".nome-cidade")[i].value.trim();
            if (nome) cidades.push(nome);
        }
    });

    const servicos = [...document.querySelectorAll(".servico:checked")].map(s => s.value);

    t += `📍 DESIGNAÇÃO: ${listaComE(cidades)} – ${listaComE(servicos)}\n`;
    t += `🕗 INÍCIO: ${inicio}\n\n`;

    // --- BLOCO MATERIAIS ---
    t += "----------------------------------------------------------------------------\n";
    t += "MATERIAIS LEVADOS:\n";

    const qtds = document.querySelectorAll(".qtd-mat");
    const modelos = document.querySelectorAll(".modelo-mat");
    
    qtds.forEach((q, i) => {
        if (q.value && parseInt(q.value) > 0) {
            t += `${pad(q.value)} ${modelos[i].value}\n`;
        }
    });

    const conApc = document.getElementById("qtd-con-apc").value;
    if (conApc && conApc > 0) t += `${pad(conApc)} CONECTOR APC\n`;

    const conUpc = document.getElementById("qtd-con-upc").value;
    if (conUpc && conUpc > 0) t += `${pad(conUpc)} CONECTOR UPC\n`;

    const almoco = document.getElementById("opt-almoco").value;
    if (almoco) t += `${almoco}\n`;

    const nota = document.getElementById("qtd-nota").value;
    if (nota && nota > 0) t += `${pad(nota)} NOTA DE ABASTECIMENTO\n`;

    const chave = document.getElementById("qtd-chave").value;
    if (chave && chave > 0) t += `${pad(chave)} CHAVE DA LOJA\n`;
    
    t += "\n";
    // -----------------------

    document.querySelectorAll(".bloco-cidade").forEach((b, i) => {
        if (!document.querySelectorAll(".cidade")[i].checked) return;

        const nomeCidade = b.querySelector(".nome-cidade").value.trim();
        const clientes = b.querySelector(".clientes").value.split("\n");
        const status = b.querySelector(".status").value.split("\n");

        if (!nomeCidade) return;

        t += "----------------------------------------------------------------------------\n";
        t += `${i + 1}ª CIDADE: ${nomeCidade.toUpperCase()}\n`;
        t += "----------------------------------------------------------------------------\n";
        t += "ATENDIMENTOS AGENDADOS:\n";

        clientes.forEach((c, idx) => {
            if (!c.trim()) return;
            let linha = `${idx + 1}. ${c.toUpperCase()}`;
            if (status[idx]) linha += ` - ${status[idx].toUpperCase()}`;
            t += linha + "\n";
        });

        t += "\n";
    });

    document.getElementById("resultado").value = t;
}

/* =====================================================
   EVENTOS (CARREGAMENTO INICIAL)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    atualizarCidades();
    document.querySelectorAll(".cidade").forEach(c =>
        c.addEventListener("change", atualizarCidades)
    );
});

/* =====================================================
   INICIAR ENCERRAMENTO
===================================================== */
function iniciarEncerramento() {
    const container = document.getElementById("lista-encerramento");
    container.innerHTML = "";
    container.style.display = "block";

    let existeCliente = false;

    document.querySelectorAll(".bloco-cidade").forEach((b, iCidade) => {
        if (!document.querySelectorAll(".cidade")[iCidade].checked) return;

        const nomeCidade = b.querySelector(".nome-cidade").value.trim();
        const clientes = b.querySelector(".clientes").value.split("\n");
        const status = b.querySelector(".status").value.split("\n");

        if (!nomeCidade) return;

        let contador = 0;

        const tituloCidade = document.createElement("h3");
        tituloCidade.innerText = `CIDADE: ${nomeCidade.toUpperCase()}`;
        container.appendChild(tituloCidade);

        clientes.forEach((cliente, i) => {
            if (!cliente.trim()) return;

            existeCliente = true;
            contador++;

            const div = document.createElement("div");
            div.className = "bloco-encerramento";
            div.dataset.cliente = cliente.toUpperCase();
            div.dataset.status = status[i] ? status[i].toUpperCase() : "";

            div.innerHTML = `
                <strong>${contador}. ${cliente.toUpperCase()}</strong><br>
                ${status[i] ? status[i].toUpperCase() : ""}

                <div class="linha" style="margin-top:5px;">
                    <label>
                        <input type="radio" name="enc_${iCidade}_${contador}" value="realizado">
                        REALIZADO
                    </label>

                    <label>
                        <input type="radio" name="enc_${iCidade}_${contador}" value="nao">
                        NÃO REALIZADO
                    </label>
                </div>

                <div class="campo-atendente" style="display:none; margin-top:5px;">
                    <input type="text" placeholder="Nome do atendente">
                </div>
            `;

            container.appendChild(div);

            const radios = div.querySelectorAll("input[type=radio]");
            const campo = div.querySelector(".campo-atendente");

            radios.forEach(r => {
                r.addEventListener("change", () => {
                    if (r.value === "realizado") {
                        campo.style.display = "block";
                    } else {
                        campo.style.display = "none";
                        campo.querySelector("input").value = "";
                    }
                });
            });
        });
    });

    if (!existeCliente) {
        container.innerHTML = "<strong>Nenhum cliente encontrado para encerramento.</strong>";
    }
}

/* =====================================================
   GERAR TEXTO FINAL DO ENCERRAMENTO
===================================================== */
function gerarEncerramento() {
    let t = "";

    document.querySelectorAll("#lista-encerramento h3").forEach(tituloCidade => {
        t += "----------------------------------------------------------------------------\n";
        t += `${tituloCidade.innerText}\n`;
        t += "----------------------------------------------------------------------------\n";
        t += "ATENDIMENTOS AGENDADOS:\n";

        let bloco = tituloCidade.nextElementSibling;
        let contador = 1;

        while (bloco && !bloco.matches("h3")) {
            if (bloco.classList.contains("bloco-encerramento")) {
                const cliente = bloco.dataset.cliente;
                const status = bloco.dataset.status;
                const radio = bloco.querySelector("input[type=radio]:checked");

                if (radio) {
                    if (radio.value === "realizado") {
                        const atendente =
                            bloco.querySelector(".campo-atendente input").value.trim();

                        t += `${contador}. ${cliente} - ${status} (REALIZADO)\n`;
                        t += `*O.S NA MESA DE: ${atendente || "__________"}\n`;
                    } else {
                        t += `${contador}. ${cliente} - ${status} (NÃO REALIZADO)\n`;
                        t += `*O.S RETORNOU A BANDEJA\n`;
                    }
                    contador++;
                }
            }
            bloco = bloco.nextElementSibling;
        }

        t += "\n";
    });

    t += "----------------------------------------------------------------------------\n";
    document.getElementById("resultado-encerramento").value = t;
}