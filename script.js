// Contagem ao vivo até a festa: 11/12/2026 às 21h de Brasília (00:00 UTC do dia 12).
(function () {
  var el = document.getElementById("contagem");
  if (!el) return;

  var ALVO = Date.UTC(2026, 11, 12, 0, 0, 0); // 21h de Brasília (UTC-3)
  var FIM = Date.UTC(2026, 11, 12, 9, 0, 0);   // 12/12 às 06h de Brasília
  var SEG = 1000;
  var MIN = 60 * SEG;
  var HORA = 60 * MIN;
  var DIA = 24 * HORA;

  var nums = null;
  var msg = null;

  function doisDigitos(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function criarCaixas() {
    el.textContent = "";
    msg = null;
    nums = [];

    var caixas = document.createElement("div");
    caixas.className = "caixas";
    var legendas = ["dias", "horas", "min", "seg"];

    for (var i = 0; i < legendas.length; i++) {
      var caixa = document.createElement("div");
      caixa.className = "caixa";
      var numero = document.createElement("strong");
      numero.textContent = "00";
      var legenda = document.createElement("span");
      legenda.textContent = legendas[i];
      caixa.appendChild(numero);
      caixa.appendChild(legenda);
      caixas.appendChild(caixa);
      nums.push(numero);
    }

    el.appendChild(caixas);
  }

  function mostrarTexto(texto) {
    nums = null;
    el.textContent = "";
    msg = document.createElement("p");
    msg.className = "contagem-texto";
    msg.textContent = texto;
    el.appendChild(msg);
  }

  function atualizar() {
    var agora = Date.now();

    if (agora >= FIM) {
      if (!msg || msg.textContent !== "Obrigada por ter vindo! 💗") {
        mostrarTexto("Obrigada por ter vindo! 💗");
      }
      el.setAttribute("aria-label", "Obrigada por ter vindo!");
      return;
    }

    var falta = ALVO - agora;

    if (falta <= 0) {
      if (!msg || msg.textContent !== "A festa começou! 💗") {
        mostrarTexto("A festa começou! 💗");
      }
      el.setAttribute("aria-label", "A festa começou!");
      return;
    }

    if (!nums) criarCaixas();

    var d = Math.floor(falta / DIA);
    var h = Math.floor(falta / HORA) % 24;
    var m = Math.floor(falta / MIN) % 60;
    var s = Math.floor(falta / SEG) % 60;
    var valores = [doisDigitos(d), doisDigitos(h), doisDigitos(m), doisDigitos(s)];

    for (var i = 0; i < nums.length; i++) {
      if (nums[i].textContent !== valores[i]) nums[i].textContent = valores[i];
    }

    el.setAttribute("aria-label", "Faltam " + d + " dias, " + h + " horas, " + m + " minutos e " + s + " segundos para a festa");
  }

  atualizar();
  setInterval(atualizar, 1000);
})();

// Vídeo: autoplay sem som e botão "Toque para ouvir"
(function () {
  var video = document.querySelector(".video");
  var botao = document.getElementById("ativar-som");
  if (!video) return;

  var semMovimento = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function tentarTocar() {
    try {
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    } catch (e) {}
  }

  if (semMovimento) {
    video.autoplay = false;
    video.pause();
  } else {
    tentarTocar();
  }

  if (!botao) return;

  function esconderBotao() {
    if (!botao.hidden) botao.hidden = true;
  }

  // Se tirarem o mudo pelos controles do vídeo, o botão também some.
  video.addEventListener("volumechange", function () {
    if (!video.muted) esconderBotao();
  });
})();

// Botão "Copiar chave Pix"
(function () {
  var botao = document.getElementById("copiar-pix");
  if (!botao) return;

  var textoOriginal = botao.textContent;
  var timer;

  function copiarAntigo(texto) {
    var area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(area);
    return ok ? Promise.resolve() : Promise.reject();
  }

  botao.addEventListener("click", function () {
    var chave = botao.getAttribute("data-chave");
    var copia = navigator.clipboard && window.isSecureContext
      ? navigator.clipboard.writeText(chave).catch(function () { return copiarAntigo(chave); })
      : copiarAntigo(chave);

    copia.then(function () {
      botao.textContent = "Copiado! ✓";
      botao.classList.add("copiado");
      clearTimeout(timer);
      timer = setTimeout(function () {
        botao.textContent = textoOriginal;
        botao.classList.remove("copiado");
      }, 2000);
    }, function () {
      botao.textContent = "Chave: " + chave;
    });
  });
})();
