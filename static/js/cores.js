// Array de objetos que representa o padrão de cores ABNT para cabos de fibra óptica.
// Cada objeto contém o nome da cor e seu código hexadecimal para exibição.
const coresABNT = [
    { nome: "Verde", hex: "#7DFF22" },    // Cor do tema: --verde-neon (ajustado para melhor visibilidade)
    { nome: "Amarelo", hex: "#ffc107" },
    { nome: "Branco", hex: "#F0F4F8" },   // Cor do tema: --branco-neve
    { nome: "Azul", hex: "#00A3FF" },      // Cor do tema: --azul-eletrico
    { nome: "Vermelho", hex: "#dc3545" }, // Cor do tema: --vermelho-erro
    { nome: "Violeta", hex: "#9400D3" },  // DarkViolet, mais vibrante
    { nome: "Marrom", hex: "#A0522D" },   // Sienna, mais visível em fundo escuro
    { nome: "Rosa", hex: "#e83e8c" },      // Padrão (bom contraste)
    { nome: "Preto", hex: "#343a40" },      // Cinza escuro para ser visível
    { nome: "Cinza", hex: "#94A3B8" },     // Cor do tema: --cinza-suave
    { nome: "Laranja", hex: "#fd7e14" },   // Padrão (bom contraste)
    { nome: "Aqua", hex: "#20c997" }       // Padrão (bom contraste)
];

// Array de objetos que representa o padrão de cores EIA/TIA-598.
// A ordem das cores é diferente do padrão ABNT.
const coresEIA = [
    { nome: "Azul", hex: "#00A3FF" },
    { nome: "Laranja", hex: "#fd7e14" },
    { nome: "Verde", hex: "#7DFF22" },
    { nome: "Marrom", hex: "#A0522D" },
    { nome: "Cinza", hex: "#94A3B8" }, // Slate
    { nome: "Branco", hex: "#F0F4F8" },
    { nome: "Vermelho", hex: "#dc3545" },
    { nome: "Preto", hex: "#343a40" },
    { nome: "Amarelo", hex: "#ffc107" },
    { nome: "Violeta", hex: "#9400D3" },
    { nome: "Rosa", hex: "#e83e8c" }, // Rose
    { nome: "Aqua", hex: "#20c997" }
];

/**
 * Encontra e exibe as cores do grupo (loose tube) e da fibra com base no número inserido pelo usuário.
 */
function encontrarFibra() {
    // Obtém os elementos do DOM necessários.
    const inputElement = document.getElementById('numero_fibra');
    const resultadoElement = document.getElementById('resultado_cores');
    const switchElement = document.getElementById('padrao_switch');
    
    // Lê o número da fibra e o estado do switch de padrão (ABNT ou EIA).
    const numeroFibra = parseInt(inputElement.value, 10);
    const usarEIA = switchElement.checked;

    // Determina qual array de cores usar com base no switch.
    const cores = usarEIA ? coresEIA : coresABNT;

    // Valida se o número da fibra está dentro do intervalo esperado (1 a 144).
    if (isNaN(numeroFibra) || numeroFibra < 1 || numeroFibra > 144) {
        resultadoElement.innerHTML = `<p class="text-muted">Por favor, insira um número de fibra válido entre 1 e 144.</p>`;
        return;
    }

    // Converte o número da fibra (base 1) para um índice de array (base 0).
    const indice = numeroFibra - 1;

    // Calcula o índice do grupo (tubo). Cada grupo tem 12 fibras.
    // Math.floor arredonda para baixo, encontrando o grupo correto.
    const indiceGrupo = Math.floor(indice / 12);
    // Calcula o índice da fibra dentro do seu grupo usando o operador de módulo (resto da divisão).
    const indiceFibra = indice % 12;

    // Obtém os objetos de cor correspondentes do array.
    const corGrupo = cores[indiceGrupo];
    const corFibra = cores[indiceFibra];

    // Gera o HTML do resultado e o insere na página.
    resultadoElement.innerHTML = `
        <div class="row">
            <div class="col-sm-6 mb-3 mb-sm-0">
                <h5>Grupo (Tubo Loose)</h5>
                <p class="fs-4 mb-0"><span class="color-swatch" style="background-color: ${corGrupo.hex};"></span> ${indiceGrupo + 1} - ${corGrupo.nome}</p>
            </div>
            <div class="col-sm-6">
                <h5>Fibra</h5>
                <p class="fs-4 mb-0"><span class="color-swatch" style="background-color: ${corFibra.hex};"></span> ${indiceFibra + 1} - ${corFibra.nome}</p>
            </div>
        </div>
    `;
}