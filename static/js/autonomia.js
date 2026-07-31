/**
 * Formata um valor de horas em uma string legível (ex: "1 dia(s) 2 hora(s) 30 minuto(s)").
 * @param {number} horas - A duração total em horas (pode ser um número decimal).
 * @returns {string} A duração formatada.
 */
function formatarDuracao(horas) {
    // Validação inicial para garantir que o número é válido.
    if (isNaN(horas) || horas < 0) {
        return "Cálculo inválido";
    }

    // Calcula o número de dias, horas e minutos.
    const dias = Math.floor(horas / 24);
    const horasRestantes = Math.floor(horas % 24);
    const minutosRestantes = Math.round((horas * 60) % 60);

    let resultado = "";
    // Constrói a string de resultado parte por parte.
    if (dias > 0) {
        resultado += `${dias} dia(s) `;
    }
    if (horasRestantes > 0) {
        resultado += `${horasRestantes} hora(s) `;
    }
    if (minutosRestantes > 0) {
        resultado += `${minutosRestantes} minuto(s)`;
    }

    // Retorna a string final, removendo espaços extras, ou um valor padrão se for muito curto.
    return resultado.trim() || "Menos de um minuto";
}

/**
 * Calcula a autonomia de um sistema de baterias com base nos inputs do usuário.
 */
function calcularAutonomia() {
    // Obtém os valores dos campos de input do formulário.
    const consumo = parseFloat(document.getElementById('consumo_watts').value);
    const capacidade = parseFloat(document.getElementById('capacidade_bateria').value);
    const tensao = parseFloat(document.getElementById('tensao_bateria').value);
    const eficiencia = parseFloat(document.getElementById('eficiencia_sistema').value);

    // Obtém os elementos do DOM onde os resultados serão exibidos.
    const resultadoElement = document.getElementById('resultado_autonomia');
    const detalhesElement = document.getElementById('detalhes_calculo');

    // Valida se os valores são números válidos e positivos.
    if (isNaN(consumo) || isNaN(capacidade) || isNaN(tensao) || isNaN(eficiencia) || consumo <= 0 || capacidade <= 0) {
        // Se a validação falhar, exibe uma mensagem de erro e interrompe a função.
        resultadoElement.innerText = "-";
        detalhesElement.innerText = "Por favor, insira valores válidos e positivos.";
        return;
    }

    // 1. Calcula a energia total da bateria em Watt-hora (Wh). Fórmula: Capacidade (Ah) * Tensão (V).
    const energiaTotalWh = capacidade * tensao;
    // 2. Calcula a energia efetiva, considerando a eficiência do sistema (perdas no nobreak/inversor).
    const energiaEfetivaWh = energiaTotalWh * (eficiencia / 100);
    // 3. Calcula a autonomia em horas. Fórmula: Energia Efetiva (Wh) / Consumo (W).
    const autonomiaHoras = energiaEfetivaWh / consumo;

    // Exibe o resultado principal formatado pela função auxiliar.
    resultadoElement.innerText = formatarDuracao(autonomiaHoras);
    // Exibe os detalhes do cálculo para transparência.
    detalhesElement.innerHTML = `
        Energia da Bateria: ${energiaTotalWh.toFixed(2)} Wh <br>
        Energia Efetiva (${eficiencia}%): ${energiaEfetivaWh.toFixed(2)} Wh <br>
        Autonomia (horas): ${autonomiaHoras.toFixed(2)} h
    `;
}

// Adiciona um "ouvinte de evento" que espera o DOM da página ser totalmente carregado.
document.addEventListener('DOMContentLoaded', function() {
    // Chama a função de cálculo uma vez no início para exibir os resultados com os valores padrão dos inputs.
    calcularAutonomia();
});