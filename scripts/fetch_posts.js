const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const cheerio = require("cheerio");

const FLARESOLVERR_URL = "https://mabelle-supervenient-talitha.ngrok-free.dev/v1";

const SITEMAP_URLS = [
  'https://missav.ws/sitemap_items_1.xml',
  'https://missav.ws/sitemap_items_2.xml'
];

const POSTS_DIR = path.join(__dirname, "../data/posts");
const INDEX_DIR = path.join(__dirname, "../data/index");
const META_DIR = path.join(__dirname, "../data/meta");

[POSTS_DIR, INDEX_DIR, META_DIR].forEach(dir => {
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
function getKey(url) {
  const match = url.match(/([a-z0-9\-]+)$/i);
  return match ? match[1].toLowerCase() : "unknown";
}

function getIndexFile(key) {
  return path.join(INDEX_DIR, key[0] + ".json");
}

function getMetaFile(key) {
  return path.join(META_DIR, key[0] + ".json");
}

function slugFromUrl(url) {
  const clean = url.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");
  const parts = clean.split("/");
  const langs = ["en","cn","zh","ja","ko","ms","th","de","fr","vi","id","fil","pt"];
  let lang = "xx";
  for (const p of parts) if (langs.includes(p)) lang = p;
  const id = parts[parts.length - 1] || "unknown";
  const safeId = id.replace(/[^a-z0-9\-]/gi,"").toLowerCase();
  const slug = `${lang}-${safeId}.json`;
  const level1 = safeId.slice(0,2)||"00";
  const level2 = safeId.slice(2,4)||"00";
  const level3 = safeId.slice(4,6)||"00";
  const dir = path.join(POSTS_DIR, lang, level1, level2, level3);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  return path.join(lang, level1, level2, level3, slug);
}

// ---------- DECODE VIDEO SOURCES (NO PUPPETEER) ----------
function decodePackedSources(encryptedString) {
  if (!encryptedString) return [];
  // The string is normally split by | and packed like JS obfuscator
  const parts = encryptedString.split("|");

  // Example decoding logic (adapt to real pattern)
  return [
    { name: "High Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[0], type: "hls" },
    { name: "Medium Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[1], type: "hls" },
    { name: "Low Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[2], type: "hls" }
  ];
}

// ---------- MAIN DOWNLOAD ----------
async function downloadPost(url) {
  try {
    const key = getKey(url);
    const indexFile = getIndexFile(key);

    if (fs.existsSync(indexFile)) {
      const data = JSON.parse(fs.readFileSync(indexFile));
      if (data[key]) { console.log("⏩ Skip:", key); return; }
    }

    const html = await smartFetch(url);
    const $ = cheerio.load(html);

    // ---------- EXTRACT DATA ----------
    const title = $("meta[property='og:title']").attr("content") || $("title").text() || key;
    const description = $("meta[property='og:description']").attr("content") || null;
    const poster = $("meta[property='og:image']").attr("content") || null;
    const releaseDate = $("time").first().text() || null;
    const duration = parseInt($("meta[property='og:video:duration']").attr("content")) || null;

    let genres = [];
    $(".space-y-2 .text-secondary").each((_, el) => {
      const label = $(el).find("span").text().trim();
      if (label==="Genre:") $(el).find("a").each((_, a)=>genres.push($(a).text().trim()));
    });

    let cast = [];
    $(".space-y-2 .text-secondary").each((_, el) => {
      const label = $(el).find("span").text().trim();
      if (label==="Actress:") $(el).find("a").each((_, a)=>cast.push($(a).text().trim()));
    });

    let maker = null;
    $(".text-secondary").each((_, el)=>{
      const label = $(el).find("span").text().trim();
      if(label==="Maker:") maker = $(el).find("a").first().text().trim();
    });

    // ---------- ENCRYPTED SOURCE STRING ----------
    let encryptedString = null;
    $("script").each((_, el)=>{
      const content = $(el).html();
      if(content && content.includes(".split('|')")){
        const splitIndex = content.indexOf(".split('|')");
        const beforeSplit = content.substring(0, splitIndex);
        const lastQuote = beforeSplit.lastIndexOf("'");
        const firstQuote = beforeSplit.lastIndexOf("'", lastQuote-1);
        encryptedString = beforeSplit.substring(firstQuote+1,lastQuote);
      }
    });

    // ---------- FINAL JSON ----------
    const sources = decodePackedSources(encryptedString);

    const data = {
      id: key,
      title,
      description,
      poster,
      release_date: releaseDate,
      duration,
      genres,
      cast,
      maker,
      sources,
      url
    };

    const relativePath = slugFromUrl(url);
    const filePath = path.join(POSTS_DIR, relativePath);
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));

    // ---------- INDEX ----------
    let idx = {};
    if (fs.existsSync(indexFile)) { try { idx = JSON.parse(fs.readFileSync(indexFile)); } catch {} }
    idx[key] = relativePath;
    fs.writeFileSync(indexFile, JSON.stringify(idx));

    // ---------- META ----------
    const metaFile = getMetaFile(key);
    let meta = {};
    if (fs.existsSync(metaFile)) { try { meta = JSON.parse(fs.readFileSync(metaFile)); } catch {} }
    meta[key] = { title, image: poster, path: relativePath };
    fs.writeFileSync(metaFile, JSON.stringify(meta));

    console.log("✅ Saved JSON:", key);

  } catch (err) {
    console.error("❌ Error:", url, err.message);
  }
}

// ---------- RUN ----------
(async ()=>{
  for(const sitemap of SITEMAP_URLS){
    console.log("📄 Sitemap:", sitemap);
    const urls = await fetchSitemap(sitemap);
    const BATCH = 3;
    for(let i=0;i<urls.length;i+=BATCH){
      await Promise.all(urls.slice(i,i+BATCH).map(downloadPost));
    }
  }
})();
