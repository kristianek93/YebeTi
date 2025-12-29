(() => {
  const log = (...a) => { try { console.log("[YebeTi]", ...a); } catch(e){} };

  function showMenu() {
    if (document.getElementById("yebeti-overlay")) return;

    const ov = document.createElement("div");
    ov.id = "yebeti-overlay";
    ov.style.position = "fixed";
    ov.style.left = "0";
    ov.style.top = "0";
    ov.style.width = "100%";
    ov.style.height = "100%";
    ov.style.zIndex = "2147483647";
    ov.style.background = "rgba(0,0,0,0.75)";
    ov.style.display = "flex";
    ov.style.alignItems = "center";
    ov.style.justifyContent = "center";
    ov.style.fontFamily = "sans-serif";
    ov.style.color = "#fff";

    const box = document.createElement("div");
    box.style.maxWidth = "900px";
    box.style.padding = "24px";
    box.style.borderRadius = "16px";
    box.style.background = "rgba(20,20,20,0.95)";
    box.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";

    box.innerHTML = `
      <div style="font-size:28px; font-weight:700; margin-bottom:12px;">YebeTi</div>
      <div style="font-size:16px; opacity:0.9; margin-bottom:18px;">
        Vyber, kam přejít. (Zavřeš: BACK)
      </div>
      <div style="display:flex; gap:14px; flex-wrap:wrap;">
        <button id="yebeti-yt" style="font-size:18px; padding:14px 18px; border-radius:12px; border:0; cursor:pointer;">
          YouTube TV
        </button>
        <button id="yebeti-tt" style="font-size:18px; padding:14px 18px; border-radius:12px; border:0; cursor:pointer;">
          TizenTube (localhost dial)
        </button>
      </div>
      <div style="margin-top:14px; font-size:13px; opacity:0.7;">
        Otevření menu: podrž BACK (cca 0.7s) nebo podrž ▶⏸. Rychlé otevření: WWW.
      </div>
    `;

    ov.appendChild(box);
    document.body.appendChild(ov);

    const close = () => { try { ov.remove(); } catch(e){} };
    const go = (url) => { log("redirect ->", url); location.href = url; };

    document.getElementById("yebeti-yt").onclick = () => go("https://youtube.com/tv");
    document.getElementById("yebeti-tt").onclick = () =>
      go("https://youtube.com/tv?additionalDataUrl=http%3A%2F%2Flocalhost%3A8085%2Fdial%2Fapps%2FYouTube");

    window.addEventListener("keydown", (e) => {
      // zavření menu na BACK
      if (e.key === "Backspace" || e.key === "BrowserBack" || e.key === "Back") close();
    }, { once:false });
  }

  let downAt = 0;
  let downKey = "";

  function isTriggerKey(e) {
    return (
      e.key === "Backspace" || e.key === "BrowserBack" || e.key === "Back" ||
      e.key === "MediaPlayPause" || e.code === "MediaPlayPause" ||
      e.key === "WWW"
    );
  }

  // dlouhý stisk BACK / ▶⏸ otevře menu, WWW otevře hned
  window.addEventListener("keydown", (e) => {
    if (!isTriggerKey(e)) return;

    if (e.key === "WWW") {
      try { e.preventDefault(); e.stopPropagation(); } catch(_) {}
      showMenu();
      return;
    }

    if (downAt) return;
    downAt = Date.now();
    downKey = e.key;
  }, { capture:true });

  window.addEventListener("keyup", (e) => {
    if (!downAt) return;
    if (!isTriggerKey(e)) return;

    const ms = Date.now() - downAt;
    downAt = 0;

    if (ms >= 700) {
      try { e.preventDefault(); e.stopPropagation(); } catch(_) {}
      showMenu();
    }
  }, { capture:true });

  log("loaded. Hold BACK or Play/Pause for menu, or press WWW.");
})();
