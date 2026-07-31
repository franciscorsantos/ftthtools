// Array que armazena o estado da rede. Cada objeto no array representa uma CTO.
let ctos = [];

// Objeto constante que mapeia os modelos de splitter desbalanceado para suas perdas.
// A chave é o modelo (ex: "10/90") e o valor é um array [perda_no_drop, perda_de_passagem].
const PERDAS_DESBAL = {
    "01/99": [21.5, 0.3],
    "02/98": [18.5, 0.4],
    "03/97": [16.5, 0.4],
    "04/96": [15.0, 0.5],
    "05/95": [14.0, 0.6],
    "10/90": [11.0, 0.8],
    "15/85": [9.0, 1.1],
    "20/80": [7.8, 1.4],
    "25/75": [6.8, 1.8],
    "30/70": [6.0, 2.2],
    "35/65": [5.3, 2.7],
    "40/60": [4.7, 3.2],
    "45/55": [4.1, 3.8],
    "50/50": [3.6, 3.6]
};

/**
 * Adiciona uma nova CTO à rede com valores padrão.
 * @param {string} type - O tipo de CTO a ser adicionada ('desbalanceado' ou 'balanceado').
 */
function addCTO(type) {
    if (type === 'desbalanceado') {
        // Adiciona uma CTO desbalanceada padrão.
        ctos.push({ type: 'desbalanceado', modelo: "10/90", perdaInterna: 13.8 });
    } else if (type === 'balanceado') {
        // Adiciona uma CTO balanceada (terminal) padrão.
        ctos.push({ type: 'balanceado', perdaInterna: 13.8 });
    }
    // Redesenha a interface da rede.
    renderizarRede();
}

/**
 * Remove uma CTO da rede com base em seu índice.
 * @param {number} index - O índice da CTO a ser removida.
 */
function removeCTO(index) {
    // Remove 1 elemento do array 'ctos' a partir do índice especificado.
    ctos.splice(index, 1);
    renderizarRede();
}

/**
 * Atualiza o modelo do splitter desbalanceado de uma CTO específica.
 * @param {number} index - O índice da CTO a ser atualizada.
 * @param {string} value - O novo modelo do splitter (ex: "20/80").
 */
function updateSplitter(index, value) {
    ctos[index].modelo = value;
    calcularRede();
}

/**
 * Atualiza a perda do splitter interno de uma CTO específica.
 * @param {number} index - O índice da CTO a ser atualizada.
 * @param {string} value - O novo valor da perda interna (vem como string do select).
 */
function updatePerdaInterna(index, value) {
    ctos[index].perdaInterna = parseFloat(value);
    calcularRede();
}

/**
 * Calcula os níveis de sinal para toda a rede e atualiza a interface.
 */
function calcularRede() {
    const sinalOLT = parseFloat(document.getElementById('olt_signal').value);
    let sinalAtual = sinalOLT;
    let redeAberta = true; // Flag para controlar se o barramento continua.

    // Itera sobre cada CTO no array 'ctos'.
    ctos.forEach((cto, i) => {
        const card = document.getElementById(`cto-${i}`); // O card da CTO
        const txtEntrada = document.getElementById(`entrada-${i}`); // Texto do sinal de entrada
        const txtPerdas = document.getElementById(`perdas-${i}`); // Texto das perdas
        const txtSinal = document.getElementById(`sinal-${i}`); // Texto do sinal do cliente
        const txtPassagem = document.getElementById(`passagem-${i}`); // Texto do sinal de passagem

        // Se a rede já foi terminada por uma CTO anterior, limpa os dados deste card.
        if (!redeAberta || isNaN(sinalAtual)) {
            txtEntrada.innerText = "-";
            txtPerdas.innerText = "-";
            txtSinal.innerText = "-";
            if (txtPassagem) txtPassagem.innerText = "-";
            card.className = "cto-card";
            return;
        }

        txtEntrada.innerText = sinalAtual.toFixed(2) + " dBm";

        if (cto.type === 'desbalanceado') {
            const [perdaDrop, perdaPassagem] = PERDAS_DESBAL[cto.modelo];
            const sinalDeSaida = sinalAtual - perdaPassagem;
            
            txtPerdas.innerText = `Drop: ${perdaDrop}dB / Pass: ${perdaPassagem}dB`;
            txtPassagem.innerText = sinalDeSaida.toFixed(2) + " dBm";
            
            if (cto.perdaInterna > 0) {
                // Esta CTO serve clientes
                const sinalNaPorta = sinalAtual - perdaDrop - cto.perdaInterna - 0.5;
                txtSinal.innerText = sinalNaPorta.toFixed(2) + " dBm";
                // Validação de cor: aplica uma classe CSS com base no nível de sinal na porta do cliente.
                card.className = (sinalNaPorta < -27 || sinalNaPorta > -12) ? "cto-card sinal-ruim" : "cto-card sinal-bom";
            } else {
                // Esta é uma caixa de passagem, sem clientes.
                txtSinal.innerText = "N/A";
                card.className = "cto-card"; // Remove classes de cor de sinal
            }

            // O sinal de entrada da próxima CTO é o sinal de saída (passagem) da CTO atual.
            sinalAtual = sinalDeSaida;

        } else { // cto.type === 'balanceado'
            // Sinal no cliente = Entrada - Perda Splitter Balanceado - Perda Conector
            const sinalNaPorta = sinalAtual - cto.perdaInterna - 0.5;
            
            txtPerdas.innerText = `Splitter: ${cto.perdaInterna.toFixed(1)} dB`;
            txtPassagem.innerText = "FIM"; // Indica visualmente que a rede termina aqui.
            txtSinal.innerText = sinalNaPorta.toFixed(2) + " dBm";
            // Validação de cor para a CTO terminal.
            card.className = (sinalNaPorta < -27 || sinalNaPorta > -12) ? "cto-card sinal-ruim" : "cto-card sinal-bom";
            
            redeAberta = false; // Sinaliza que o barramento foi encerrado.
        }
    });
}

/**
 * Renderiza (desenha) os cards de todas as CTOs na tela.
 * Esta função é chamada sempre que a rede é modificada.
 */
function renderizarRede() {
    const container = document.getElementById('rede_container');
    container.innerHTML = "";
    
    let redeTerminada = false;

    // Itera sobre o array de CTOs e cria o HTML para cada uma.
    ctos.forEach((cto, i) => {
        let cardHTML = '';

        if (cto.type === 'desbalanceado') {
            cardHTML = `
            <div class="cto-card" id="cto-${i}">
                <h6>CTO ${i + 1} (Desbalanceada)</h6>
                
                <label class="form-label small text-muted">Splitter Desbalanceado:</label>
                <!-- O 'onchange' chama a função de atualização passando o índice da CTO e o novo valor. -->
                <select class="form-select form-select-sm mb-2" onchange="updateSplitter(${i}, this.value)">
                    ${Object.keys(PERDAS_DESBAL).map(key => `<option value="${key}" ${cto.modelo == key ? 'selected' : ''}>${key}</option>`).join('')}
                </select>

                <label class="form-label small text-muted">Splitter Interno (Balanceado):</label>
                <select class="form-select form-select-sm mb-2" onchange="updatePerdaInterna(${i}, this.value)">
                    <option value="0" ${cto.perdaInterna == 0 ? 'selected' : ''}>Nenhum (Passagem)</option>
                    <option value="7.5" ${cto.perdaInterna == 7.5 ? 'selected' : ''}>1:4 (7.5 dB)</option>
                    <option value="10.5" ${cto.perdaInterna == 10.5 ? 'selected' : ''}>1:8 (10.5 dB)</option>
                    <option value="13.8" ${cto.perdaInterna == 13.8 ? 'selected' : ''}>1:16 (13.8 dB)</option>
                    <option value="17.0" ${cto.perdaInterna == 17.0 ? 'selected' : ''}>1:32 (17.0 dB)</option>
                </select>

                <div class="text-start small lh-sm mt-2">
                    <span class="text-muted">Entrada: <strong class="text-dark" id="entrada-${i}">-</strong></span><br>
                    <span class="text-muted">Perdas: <strong class="text-dark" id="perdas-${i}">-</strong></span>
                </div>
                <hr class="my-1">
                <div class="text-start small lh-sm">
                    <span>Cliente: <strong id="sinal-${i}">-</strong></span><br>
                    <span class="text-muted">Saída (Pass.): <strong class="text-dark" id="passagem-${i}">-</strong></span>
                </div>
                <!-- Botão para remover a CTO, chamando removeCTO com o índice atual. -->
                <div class="text-center mt-2">
                    <button class="btn btn-sm btn-outline-danger px-3" onclick="removeCTO(${i})">x</button>
                </div>
            </div>`;
        } else { // cto.type === 'balanceado'
            redeTerminada = true;
            cardHTML = `
            <div class="cto-card" id="cto-${i}">
                <h6>CTO ${i + 1} (Balanceada)</h6>
                
                <label class="form-label small text-muted">Splitter Balanceado (Terminal):</label>
                <select class="form-select form-select-sm mb-2" onchange="updatePerdaInterna(${i}, this.value)">
                    <option value="7.5" ${cto.perdaInterna == 7.5 ? 'selected' : ''}>1:4 (7.5 dB)</option>
                    <option value="10.5" ${cto.perdaInterna == 10.5 ? 'selected' : ''}>1:8 (10.5 dB)</option>
                    <option value="13.8" ${cto.perdaInterna == 13.8 ? 'selected' : ''}>1:16 (13.8 dB)</option>
                    <option value="17.0" ${cto.perdaInterna == 17.0 ? 'selected' : ''}>1:32 (17.0 dB)</option>
                </select>

                <!-- Espaço para manter alinhamento com o outro card -->
                <div style="height: 52px;"></div>

                <div class="text-start small lh-sm mt-2">
                    <span class="text-muted">Entrada: <strong class="text-dark" id="entrada-${i}">-</strong></span><br>
                    <span class="text-muted">Perdas: <strong class="text-dark" id="perdas-${i}">-</strong></span>
                </div>
                <hr class="my-1">
                <div class="text-start small lh-sm">
                    <span>Cliente: <strong id="sinal-${i}">-</strong></span><br>
                    <span class="text-muted">Saída (Pass.): <strong class="text-dark" id="passagem-${i}">-</strong></span>
                </div>
                <div class="text-center mt-2">
                    <button class="btn btn-sm btn-outline-danger px-3" onclick="removeCTO(${i})">x</button>
                </div>
            </div>`;
        }

        container.innerHTML += cardHTML;

        // Adiciona uma seta se a rede não terminou e não for o último card.
        if (i < ctos.length - 1 && !redeTerminada) {
            container.innerHTML += '<div class="seta">→</div>';
        }
    });

    // Desabilita os botões de adicionar se a rede foi terminada.
    document.getElementById('add_desbal_btn').disabled = redeTerminada;
    document.getElementById('add_bal_btn').disabled = redeTerminada;

    calcularRede();
}