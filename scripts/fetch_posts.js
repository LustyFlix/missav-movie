const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const cheerio = require("cheerio");

const FLARESOLVERR_URL = "https://mabelle-supervenient-talitha.ngrok-free.dev/v1";

const SITEMAP_URLS = [
  'https://missav.ws/sitemap_items_100.xml'
];

const POSTS_DIR = path.join(__dirname, "../data/posts");
const INDEX_DIR = path.join(__dirname, "../data/index");

[POSTS_DIR, INDEX_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ---------- FETCH ----------
async function fetchWithFlareSolverr(url) {
  const res = await fetch(FLARESOLVERR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmd: "request.get", url, maxTimeout: 60000 })
  });

  const data = await res.json();
  if (!data.solution) throw new Error("FlareSolverr failed");
  return data.solution.response;
}

async function smartFetch(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
  } catch {}
  console.log("⚡ FlareSolverr:", url);
  return await fetchWithFlareSolverr(url);
}

// ---------- SITEMAP ----------
async function fetchSitemap(url) {
  const xml = await smartFetch(url);
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);

  return result.urlset.url.map(u => {
    if (u["xhtml:link"]) {
      const en = u["xhtml:link"].find(x => x.$.hreflang === "en");
      return en ? en.$.href : null;
    }
    return null;
  }).filter(Boolean);
}

// ---------- HELPERS ----------
function decodeHtml(str = "") {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

function getKey(url) {
  const match = url.match(/([a-z0-9\-]+)$/i);
  return match ? match[1].toLowerCase() : "unknown";
}

function getIndexFile(key) {
  return path.join(INDEX_DIR, key[0] + ".json");
}

function slugFromUrl(url) {
  const clean = url.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");
  const parts = clean.split("/");
  const lang = parts.includes("en") ? "en" : "xx";
  const id = parts[parts.length - 1] || "unknown";

  const safeId = id.replace(/[^a-z0-9\-]/gi,"").toLowerCase();
  const slug = `${lang}-${safeId}.json`;

  const dir = path.join(POSTS_DIR, lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});

  return path.join(lang, slug);
}

// ---------- 🔓 DECODER ----------
function decodePackedToQualities(pipeString) {
  if (!pipeString) return [];

  const packedEvalString = `
    (function(p,a,c,k,e,d){
      e=function(c){return c.toString(36)};
      if(!''.replace(/^/,String)){
        while(c--){d[c.toString(a)]=k[c]||c.toString(a)}
        k=[function(e){return d[e]}];
        e=function(){return'\\\\w+'};
        c=1
      };
      while(c--){
        if(k[c]){
          p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])
        }
      }
      return p
    })(
      'f=\\'8://7.6/5-4-3-2-1/e.0\\';d=\\'8://7.6/5-4-3-2-1/c/9.0\\';b=\\'8://7.6/5-4-3-2-1/a/9.0\\';',
      16,
      16,
      '${pipeString}'.split('|'),
      0,
      {}
    )
  `;

  let decoded = "";
  try {
    decoded = eval(packedEvalString);
  } catch {
    return [];
  }

  const getUrl = (key) => {
    const match = decoded.match(new RegExp(`${key}='([^']+)'`));
    return match ? match[1] : null;
  };

  return [
    { name: "High", url: getUrl("source1280"), type: "hls" },
    { name: "Medium", url: getUrl("source842"), type: "hls" },
    { name: "Low", url: getUrl("source"), type: "hls" }
  ].filter(x => x.url);
}

// ---------- MAIN ----------
async function downloadPost(url) {
  try {
    const key = getKey(url);
    const indexFile = getIndexFile(key);

    if (fs.existsSync(indexFile)) {
      const data = JSON.parse(fs.readFileSync(indexFile));
      if (data[key]) return console.log("⏩ Skip:", key);
    }

    const html = await smartFetch(url);
    const $ = cheerio.load(html);

    const original_title = $("meta[property='og:title']").attr("content") || "";
    const overview = $("meta[property='og:description']").attr("content") || "";
    const poster = ($("meta[property='og:image']").attr("content") || "").replace("-n.jpg", ".jpg");
    const releaseDate = $("time").text() || null;
    const duration = $("meta[property='og:video:duration']").attr("content") || 0;

    // 🔥 Extract packed string
    const encryptedString = html.match(/16,16,(.*?)\.split/)?.[1] || "";

    const pathname = new URL(url).pathname;
    const id = pathname.split("/").pop();

    const data = {
      id,
      title: original_title,
      overview: decodeHtml(overview),
      poster_path: poster,
      release_date: releaseDate,
      runtime: Math.floor(Number(duration) / 60),
      sources: decodePackedToQualities(encryptedString)
    };

    const relativePath = slugFromUrl(url);
    const filePath = path.join(POSTS_DIR, relativePath);

    fs.writeFileSync(filePath, JSON.stringify(data,null,2));

    let idx = {};
    if (fs.existsSync(indexFile)) {
      try { idx = JSON.parse(fs.readFileSync(indexFile)); } catch {}
    }

    idx[key] = relativePath;
    fs.writeFileSync(indexFile, JSON.stringify(idx));

    console.log("✅ Saved:", key);

  } catch (err) {
    console.error("❌ Error:", url, err.message);
  }
}

// ---------- RUN ----------
(async ()=>{
  for(const sitemap of SITEMAP_URLS){
    console.log("📄 Sitemap:", sitemap);
    const urls = await fetchSitemap(sitemap);

    for(const url of urls){
      await downloadPost(url);
    }
  }
})();
