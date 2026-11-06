const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");
const elPontos = document.getElementById("pontos");
const elPontosFinal = document.getElementById("pontos-final");
const elFim = document.getElementById("fim");
const btnReiniciar = document.getElementById("btn-reiniciar");

const CELULAS = 20;                         
const TAMANHO = canvas.width / CELULAS;     
const VELOCIDADE = 120;                     

const COR_FUNDO_1 = "#f7e3ee";
const COR_FUNDO_2 = "#f1d3e4";
const COR_CABECA = "#8e2a62";
const COR_CORPO = "#c45a95";
const COR_COMIDA = "#ff2e93";

let cobra, direcao, proximaDirecao, comida, pontos, timer, jogando;

function iniciar() {
  const meio = Math.floor(CELULAS / 2);
  cobra = [{ x: meio, y: meio }];           
  direcao = { x: 1, y: 0 };                 
  proximaDirecao = direcao;
  pontos = 0;
  jogando = true;
  elPontos.textContent = pontos;
  elFim.hidden = true;
  comida = sortearComida();
  desenhar();

  clearInterval(timer);
  timer = setInterval(passo, VELOCIDADE);
}

function sortearComida() {
  const livres = [];
  for (let x = 0; x < CELULAS; x++) {
    for (let y = 0; y < CELULAS; y++) {
      const ocupada = cobra.some(function (p) { return p.x === x && p.y === y; });
      if (!ocupada) livres.push({ x: x, y: y });
    }
  }
  if (livres.length === 0) return null;     
  return livres[Math.floor(Math.random() * livres.length)];
}

function passo() {
  direcao = proximaDirecao;

  const cabeca = {
    x: (cobra[0].x + direcao.x + CELULAS) % CELULAS,
    y: (cobra[0].y + direcao.y + CELULAS) % CELULAS
  };

  const comeu = comida && cabeca.x === comida.x && cabeca.y === comida.y;

  if (!comeu) cobra.pop();

  if (cobra.some(function (p) { return p.x === cabeca.x && p.y === cabeca.y; })) {
    cobra.unshift(cabeca);
    fimDeJogo();
    return;
  }

  cobra.unshift(cabeca);

  if (comeu) {
    pontos++;
    elPontos.textContent = pontos;
    comida = sortearComida();
    if (!comida) {                         
      fimDeJogo();
      return;
    }
  }

  desenhar();
}

function fimDeJogo() {
  jogando = false;
  clearInterval(timer);
  desenhar();
  elPontosFinal.textContent = pontos;
  elFim.hidden = false;
  btnReiniciar.focus();
}

function desenhar() {
  for (let x = 0; x < CELULAS; x++) {
    for (let y = 0; y < CELULAS; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? COR_FUNDO_1 : COR_FUNDO_2;
      ctx.fillRect(x * TAMANHO, y * TAMANHO, TAMANHO, TAMANHO);
    }
  }

  if (comida) {
    ctx.fillStyle = COR_COMIDA;
    ctx.fillRect(comida.x * TAMANHO + 2, comida.y * TAMANHO + 2, TAMANHO - 4, TAMANHO - 4);
  }

  cobra.forEach(function (p, i) {
    ctx.fillStyle = i === 0 ? COR_CABECA : COR_CORPO;
    ctx.fillRect(p.x * TAMANHO + 1, p.y * TAMANHO + 1, TAMANHO - 2, TAMANHO - 2);
  });
}

const TECLAS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

document.addEventListener("keydown", function (e) {
  const nova = TECLAS[e.key];
  if (!nova) return;

  e.preventDefault();                       
  if (!jogando) return;

  if (nova.x === -direcao.x && nova.y === -direcao.y) return;
  proximaDirecao = nova;
});

btnReiniciar.addEventListener("click", iniciar);

iniciar();