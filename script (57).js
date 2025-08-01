let dados = [];

async function carregarDados() {
  const res = await fetch('dados.json');
  dados = await res.json();

  preencherHospitais();
  preencherMeses();
  aplicarFiltros();
}

function preencherHospitais() {
  const hospitais = [...new Set(dados.map(item => item.HOSPITAL).filter(Boolean))];
  const select = document.getElementById('hospitalSelect');
  hospitais.forEach(hospital => {
    const opt = document.createElement('option');
    opt.value = hospital;
    opt.textContent = hospital;
    select.appendChild(opt);
  });
}

function preencherMeses() {
  const meses = [...new Set(dados.map(item => item.MÊS).filter(Boolean))];
  meses.sort((a, b) => new Date('01/' + a) - new Date('01/' + b)); // ordena cronologicamente

  const inicio = document.getElementById('mesInicio');
  const fim = document.getElementById('mesFim');

  meses.forEach(m => {
    const opt1 = new Option(m, m);
    const opt2 = new Option(m, m);
    inicio.appendChild(opt1);
    fim.appendChild(opt2);
  });
}

function aplicarFiltros() {
  const hospital = document.getElementById('hospitalSelect').value;
  const nomeBusca = document.getElementById('searchInput').value.toLowerCase();
  const mesInicio = document.getElementById('mesInicio').value;
  const mesFim = document.getElementById('mesFim').value;

  let filtrado = dados;

  if (hospital !== 'Todos') {
    filtrado = filtrado.filter(d => d.HOSPITAL === hospital);
  }

  if (nomeBusca) {
    filtrado = filtrado.filter(d => d.NOME.toLowerCase().includes(nomeBusca));
  }

  if (mesInicio) {
    filtrado = filtrado.filter(d => compararMeses(d.MÊS, mesInicio) >= 0);
  }

  if (mesFim) {
    filtrado = filtrado.filter(d => compararMeses(d.MÊS, mesFim) <= 0);
  }

  renderizar(filtrado);
}

function compararMeses(m1, m2) {
  const [mes1, ano1] = m1.split('/').map(Number);
  const [mes2, ano2] = m2.split('/').map(Number);
  return (ano1 - ano2) || (mes1 - mes2);
}

function renderizar(lista) {
  const div = document.getElementById('resultado');
  div.innerHTML = '';
  if (lista.length === 0) {
    div.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  lista.forEach(dado => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <strong>${dado.NOME}</strong><br>
      Hospital: ${dado.HOSPITAL || '-'}<br>
      Mês: ${dado.MÊS || '-'}<br>
      Valor: R$ ${dado.VALOR || 0}<br>
      Status: <strong>${dado.STATUS || 'Desconhecido'}</strong>
    `;
    div.appendChild(card);
  });
}

document.getElementById('hospitalSelect').addEventListener('change', aplicarFiltros);
document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
document.getElementById('mesInicio').addEventListener('change', aplicarFiltros);
document.getElementById('mesFim').addEventListener('change', aplicarFiltros);

carregarDados();
