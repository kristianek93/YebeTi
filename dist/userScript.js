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
        Otevři: dlouhý ENTER/OK. Zavřeš: BACK.
      </div>
      <div style="display:flex; gap:14px; flex-wrap:wrap;">
        <button id="yebeti-yt" style="font-size:18px; padding:14px 18px; border-radius:12px; border:0; cursor:pointer;">
          YouTube TV
        </button>
        <button id="yebeti-tt" style="font-size:18px; padding:14px 18px; border-radius:12px; border:0; cursor:pointer;">
          TizenTube (localhost dial)
        </button>
      </div>
    `;

    ov.appendChild(box);
    document.body.appendChild(ov);

    const close = () => { try { ov.remove(); } catch(e){} };
    const go = (url) => { log("redirect ->", url); location.href = url; };

    document.getElementById("yebeti-yt").onclick = () => go("https://youtube.com/tv");
    document.getElementById("yebeti-tt").onclick = () =>
      go("https://youtube.com/tv?additionalDataUrl=http%3A%2F%2Flocalhost%3A8085%2Fdial%2Fapps%2FYouTube");

    const onKey = (e) => {
      const k = e.key;
      // zavření overlaye
      if (k === "Escape" || k === "Backspace" || k === "BrowserBack" || k === "Back") close();
    };
    window.addEventListener("keydown", onKey);
  }

  // LONG PRESS detector: Enter/OK (fallback i Space)
  let downAt = 0;
  let downKey = "";

  function isOkKey(e) {
    return (
      e.key === "Enter" ||
      e.key === "OK" ||
      e.code === "Enter" ||
      e.key === " " ||
      e.code === "Space"
    );
  }

  window.addEventListener("keydown", (e) => {
    if (!isOkKey(e)) return;
    if (downAt) return; // už držíš
    downAt = Date.now();
    downKey = e.key || e.code || "Enter";
  });

  window.addEventListener("keyup", (e) => {
    if (!downAt) return;
    if (!isOkKey(e)) return;

    const ms = Date.now() - downAt;
    downAt = 0;

    // dlouhý stisk = menu (650ms je fajn kompromis)
    if (ms >= 650) {
      try { e.preventDefault(); e.stopPropagation(); } catch(_) {}
      showMenu();
    }
  });

  log("loaded. Long-press ENTER/OK to open YebeTi menu.");
})();
