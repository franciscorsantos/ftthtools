// Constantes que definem as perdas ópticas padrão.
const PERDA_CABO_KM = 0.25; // Perda em dB por quilômetro de fibra óptica (padrão para 1490nm, downstream).
const PERDA_CONECTOR = 0.5; // Perda padrão em dB por cada conector óptico.

/**
 * Calcula o sinal final em uma rede balanceada e atualiza a interface.
 */
function calcularRedeBalanceada() {
    // Obtém os valores dos campos de input do formulário HTML.
    const sinalOLT = parseFloat(document.getElementById('olt_signal_bal').value);
    const perdaSplitter1 = parseFloat(document.getElementById('splitter_1').value);
    const perdaSplitter2 = parseFloat(document.getElementById('splitter_2').value);
    const distancia = parseFloat(document.getElementById('distancia_km').value);

    // Valida se todos os valores obtidos são números válidos.
    if (isNaN(sinalOLT) || isNaN(perdaSplitter1) || isNaN(perdaSplitter2) || isNaN(distancia)) {
        // Se algum valor for inválido, exibe uma mensagem de erro e interrompe a função.
        document.getElementById('resultado_sinal').innerText = "-";
        document.getElementById('detalhes_perda').innerText = "Por favor, insira valores válidos.";
        return;
    }

    // Calcula as perdas totais com base nos inputs.
    const perdaTotalCabo = distancia * PERDA_CABO_KM;
    // Considera 5 pontos de conexão padrão na rota: ODF(OLT), Entrada CEO, Saída CEO, Entrada CTO, PTO(Cliente).
    const perdaTotalConectores = PERDA_CONECTOR * 5; 

    // Calcula o sinal final que chega ao cliente.
    // A fórmula é: Sinal da OLT - (soma de todas as perdas).
    const sinalFinal = sinalOLT - perdaSplitter1 - perdaSplitter2 - perdaTotalCabo - perdaTotalConectores;

    // Obtém os elementos do DOM onde os resultados serão exibidos.
    const resultadoElement = document.getElementById('resultado_sinal');
    const detalhesElement = document.getElementById('detalhes_perda');
    const cardResultado = document.getElementById('resultado_card');

    // Exibe o sinal final formatado com duas casas decimais.
    resultadoElement.innerText = sinalFinal.toFixed(2) + " dBm";
    // Exibe um resumo detalhado de todas as perdas calculadas.
    detalhesElement.innerHTML = `
        Perda Splitter 1: ${perdaSplitter1.toFixed(2)} dB | 
        Perda Splitter 2: ${perdaSplitter2.toFixed(2)} dB | 
        Perda Cabo (${distancia} km): ${perdaTotalCabo.toFixed(2)} dB | 
        Perda Conectores: ${perdaTotalConectores.toFixed(2)} dB
    `;

    // Atualiza a cor do card de resultado para fornecer feedback visual.
    // Remove as classes de estado anteriores para evitar acúmulo.
    cardResultado.classList.remove('sinal-bom', 'sinal-ruim');
    // Verifica se o sinal está na faixa ideal (geralmente entre -15 e -25 dBm).
    if (sinalFinal >= -25 && sinalFinal <= -15) {
        cardResultado.classList.add('sinal-bom'); // Aplica a classe para sinal bom.
    } else {
        cardResultado.classList.add('sinal-ruim'); // Aplica a classe para sinal ruim ou de atenção.
    }
}

// Adiciona um "ouvinte de evento" que espera o DOM da página ser totalmente carregado.
document.addEventListener('DOMContentLoaded', function() {
    // Chama a função de cálculo uma vez no início para exibir os resultados com os valores padrão dos inputs.
    calcularRedeBalanceada();
});