// =================== Alternar abas ===================
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(tab => tab.classList.remove("active"));

      button.classList.add("active");
      const alvo = document.getElementById(button.dataset.tab);
      if (alvo) alvo.classList.add("active");
    });
  });

  // Botões
  document.getElementById("btnCalcularDesconto")
    .addEventListener("click", calcularDesconto);
  document.getElementById("btnLimparDesconto")
    .addEventListener("click", limparDesconto);
  document.getElementById("btnCriarCampos")
    .addEventListener("click", criarCampos);
  document.getElementById("btnCalcularMedia")
    .addEventListener("click", calcularMedia);
});

// =================== Função auxiliar ===================
function parseValue(id) {
  const el = document.getElementById(id);
  if (!el || typeof el.value !== "string") return NaN;
  const val = el.value.trim().replace(",", ".");
  return parseFloat(val);
}

// =================== Calculadora de Desconto ===================
function calcularDesconto() {
  const kWh = parseValue("kWh");
  const valorkWh = parseValue("valorkWh");
  const ilumPublica = parseValue("ilumPublica");
  const tarifas = parseValue("tarifas");
  const descontoPercent = parseValue("desconto");

  if ([kWh, valorkWh, ilumPublica, tarifas, descontoPercent].some(v => isNaN(v))) {
    alert("Por favor, preencha todos os campos com valores numéricos válidos.");
    return;
  }

  const contaBase = kWh * valorkWh;
  const taxas = ilumPublica + tarifas;
  const contaComTaxas = contaBase + taxas;
  const desconto = contaBase * (descontoPercent / 100);
  const contaComDesconto = contaBase - desconto + taxas;

  const resultado = `
CÁLCULO DO DESCONTO

SEM DESCONTO:
(${kWh} KWH) X (R$ ${valorkWh.toFixed(3)}/KWH) = R$ ${contaBase.toFixed(2)}
CONTRIB ILUM PUBLICA MUNICIPAL: R$ ${ilumPublica.toFixed(2)}
TARIFAS VARIADAS: R$ ${tarifas.toFixed(2)}
TOTAL: R$ ${contaComTaxas.toFixed(2)} SEM DESCONTO! 

COM DESCONTO IGREEN:
VALOR ORIGINAL: R$ ${contaComTaxas.toFixed(2)}
DESCONTO IGREEN: -R$ ${desconto.toFixed(2)}
TOTAL A PAGAR: R$ ${contaComDesconto.toFixed(2)} COM DESCONTO!
  `;

  const res = document.getElementById("resultadoDesconto");
  if (res) res.value = resultado;
}

function limparDesconto() {
  ["kWh","valorkWh","ilumPublica","tarifas","desconto","resultadoDesconto"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
}

// =================== Calculadora de Média ===================
function criarCampos() {
  const qtdMeses = parseInt(document.getElementById("qtdMeses").value);
  const container = document.getElementById("camposMeses");
  container.innerHTML = "";

  if (isNaN(qtdMeses) || qtdMeses < 1 || qtdMeses > 13) {
    alert("Digite um número válido entre 1 e 13.");
    return;
  }

  for (let i = 1; i <= qtdMeses; i++) {
    const label = document.createElement("label");
    label.textContent = `Mês ${i} (kWh):`;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "mesInput";
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  }
}

function calcularMedia() {
  const inputs = document.querySelectorAll(".mesInput");
  let total = 0;

  for (const input of inputs) {
    const valor = input.value.trim().replace(",", ".");
    const num = parseFloat(valor);
    if (isNaN(num)) {
      alert("Preencha todos os campos com números válidos.");
      return;
    }
    total += num;
  }

  const nMeses = inputs.length;
  const media = total / nMeses;

  const tipoConta = document.querySelector("input[name='tipoConta']:checked").value;
  let mediaAjustada;

  switch (parseInt(tipoConta)) {
    case 1:
      mediaAjustada = media - 30;
      break;
    case 2:
      mediaAjustada = media - 50;
      break;
    case 3:
      mediaAjustada = media - 100;
      break;
    default:
      alert("Tipo de conta inválido.");
      return;
  }

  const res = document.getElementById("resultadoMedia");
  if (res) res.textContent = `Média ajustada: ${mediaAjustada.toFixed(2)} kWh`;
}