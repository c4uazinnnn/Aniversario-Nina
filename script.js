// Contagem até a festa: 11/12/2026 às 21h, horário de Brasília (UTC-3, sem horário de verão).
(function () {
  var el = document.getElementById("contagem");
  if (!el) return;

  var BRASILIA = -3 * 60 * 60 * 1000;
  var DIA = 24 * 60 * 60 * 1000;
  var festa = Date.UTC(2026, 11, 11); // dia da festa (data no calendário de Brasília)

  function atualizar() {
    var agora = new Date(Date.now() + BRASILIA);
    var hoje = Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate());
    var dias = Math.round((festa - hoje) / DIA);

    if (dias > 1) el.textContent = "Faltam " + dias + " dias";
    else if (dias === 1) el.textContent = "Falta 1 dia";
    else if (dias === 0) el.textContent = "É hoje! 💗";
    else el.textContent = "Obrigada por ter vindo! 💗";
  }

  atualizar();
  setInterval(atualizar, 60 * 1000);
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
