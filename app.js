document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });

  function parseNumber(value) {
    if (value === null || value === undefined) return NaN;
    let s = String(value).trim();
    if (s === '') return NaN;
    s = s.replace(/\s+/g, '');
    const hasDot = s.indexOf('.') !== -1;
    const hasComma = s.indexOf(',') !== -1;

    if (hasDot && hasComma) {
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
        s = s.replace(/\./g, '').replace(/,/g, '.');
      } else {  
        s = s.replace(/,/g, '');
      }
    } else if (hasComma) {
      s = s.replace(/,/g, '.');
    } else if (hasDot) {
      const dots = (s.match(/\./g) || []).length;
      if (dots > 1) {
        s = s.replace(/\./g, '');
      } else {
        const parts = s.split('.');
        if (parts[1] && parts[1].length === 3 && parts[0].length > 1) {
          s = s.replace(/\./g, '');
        }
      }
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function formatBRL(n) {
    if (!Number.isFinite(n)) return '-';
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ---------- Desconto ----------
  const kwhInput = document.getElementById('kwh');
  const precoKwhInput = document.getElementById('precoKwh');
  const ilumInput = document.getElementById('ilumPublica');
  const tarifasInput = document.getElementById('tarifas');
  const descontoInput = document.getElementById('descontoPct');
  const saida = document.getElementById('saidaDesconto');
  const botaoCalcular = document.getElementById('calcularDesconto');
  const botaoExcluir = document.getElementById('excluirDesconto');

  botaoCalcular.addEventListener('click', () => {
    const kWh = parseNumber(kwhInput.value);
    const valorKWh = parseNumber(precoKwhInput.value);
    const ilum = parseNumber(ilumInput.value);
    const tarifas = parseNumber(tarifasInput.value);
    const descontoPct = parseNumber(descontoInput.value);

    if ([kWh, valorKWh, ilum, tarifas, descontoPct].some(v => Number.isNaN(v))) {
      alert('Por favor, preencha todos os campos com valores numéricos válidos. Use ponto ou vírgula como separador decimal.');
      return;
    }

    const contaBase = kWh * valorKWh;
    const taxas = ilum + tarifas;
    const contaComTaxas = contaBase + taxas;
    const descontoAmount = contaBase * (descontoPct / 100);
    const contaComDesconto = contaBase - descontoAmount;

    const texto = ` 
CÁLCULO DO DESCONTO

SEM DESCONTO:
(${kWh} KWH) X (R$ ${valorKWh.toFixed(3)}/KWH) = ${formatBRL(contaBase)}
CONTRIB ILUM PUBLICA MUNICIPAL: ${formatBRL(ilum)}
TARIFAS VARIADAS: ${formatBRL(tarifas)}
TOTAL: ${formatBRL(contaComTaxas)} SEM DESCONTO!

COM DESCONTO IGREEN:
DESCONTO IGREEN: ${formatBRL(descontoAmount)}
VALOR DISTIBUIDORA: ${formatBRL(taxas)}
VALOR IGREEN (BOLETO): ${formatBRL(contaComDesconto)}
    `.trim();

    saida.value = texto;
  });

  botaoExcluir.addEventListener('click', () => {
    [kwhInput, precoKwhInput, ilumInput, tarifasInput, descontoInput].forEach(i=>i.value='');
    saida.value = '';
  });

// Dropdown moderno para desconto
const dropdown = document.getElementById('dropdownDesconto');
const selected = dropdown.querySelector('.selected');
const options = dropdown.querySelectorAll('.options li');
const descontoHidden = document.getElementById('descontoPct');

selected.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

options.forEach(option => {
  option.addEventListener('click', () => {
    selected.textContent = option.textContent;
    descontoHidden.value = option.dataset.value;
    dropdown.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

  const qtdMesesInput = document.getElementById('qtdMeses');
  const confirmarMesesBtn = document.getElementById('confirmarMeses');
  const camposConsumo = document.getElementById('camposConsumo');
  const calcularMediaBtn = document.getElementById('calcularMedia');
  const excluirMediaBtn = document.getElementById('excluirMedia');
  const resultadoMedia = document.getElementById('resultadoMedia');

  let entradasKwh = [];
  let nMeses = 0;

  confirmarMesesBtn.addEventListener('click', () => {
    camposConsumo.innerHTML = '';
    entradasKwh = [];
    nMeses = parseInt(qtdMesesInput.value, 10);
    if (!Number.isInteger(nMeses) || nMeses < 1 || nMeses > 13) {
      alert('Digite um número válido entre 1 e 13.');
      return;
    }
    for (let i=0;i<nMeses;i++){
      const div = document.createElement('div');
      div.className = 'campo-mes';
      const label = document.createElement('label');
      label.textContent = `Mês ${i+1} (kWh): `;
      const input = document.createElement('input');
      input.placeholder = 'ex: 150';
      input.dataset.mes = i;
      div.appendChild(label);
      div.appendChild(input);
      camposConsumo.appendChild(div);
      entradasKwh.push(input);
    }
  });

  calcularMediaBtn.addEventListener('click', () => {
    if (entradasKwh.length === 0) {
      alert('Confirme a quantidade de meses antes de calcular.');
      return;
    }
    let total = 0;
    for (const input of entradasKwh) {
      const v = parseNumber(input.value);
      if (Number.isNaN(v)) {
        alert('Preencha todos os campos de consumo com números válidos (use . ou ,).');
        return;
      }
      total += v;
    }
    const media = total / nMeses;
    const tipoConta = Number(document.querySelector('input[name="tipoConta"]:checked').value);
    let mediaAjustada;
    switch(tipoConta) {
      case 1: mediaAjustada = media - 30; break;
      case 2: mediaAjustada = media - 50; break;
      case 3: mediaAjustada = media - 100; break;
      case 4: mediaAjustada = media; break;
      default:
        alert('Tipo de conta inválido.'); return;
    }
    resultadoMedia.textContent = `Média ajustada: ${mediaAjustada.toFixed(2)} kWh`;
  });

  excluirMediaBtn.addEventListener('click', () => {
    qtdMesesInput.value = '';
    camposConsumo.innerHTML = '';
    entradasKwh = [];
    resultadoMedia.textContent = '';
  });

});
