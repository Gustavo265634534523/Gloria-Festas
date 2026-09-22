// Monta gloriafestas/index.html a partir do modelo (louros do logo + tamanho real do vídeo)
const fs = require("fs");
const s = fs.readFileSync(__dirname + "/index.template.html", "utf8");
const louros = fs.readFileSync(__dirname + "/../logo/louros.txt", "utf8");
const bytes = fs.statSync(__dirname + "/../../gloriafestas/assets/hero-scrub.mp4").size;
const out = s.replace("%%LOUROS%%", louros).replace("%%VIDEO_BYTES%%", String(bytes));
if (out.includes("%%")) { console.error("sobrou marcador"); process.exit(1); }
fs.writeFileSync(__dirname + "/../../gloriafestas/index.html", out);
console.log("index.html", out.length, "bytes; video", bytes);
