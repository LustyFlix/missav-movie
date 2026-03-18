const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const cheerio = require("cheerio");

const FLARESOLVERR_URL = "https://mabelle-supervenient-talitha.ngrok-free.dev/v1";

const SITEMAP_URLS = [
  'https://missav.ws/sitemap_items_1.xml',
  'https://missav.ws/sitemap_items_2.xml',
  'https://missav.ws/sitemap_items_3.xml',
  'https://missav.ws/sitemap_items_4.xml',
  'https://missav.ws/sitemap_items_5.xml',
  'https://missav.ws/sitemap_items_6.xml',
  'https://missav.ws/sitemap_items_7.xml',
  'https://missav.ws/sitemap_items_8.xml',
  'https://missav.ws/sitemap_items_9.xml',
  'https://missav.ws/sitemap_items_10.xml',
  'https://missav.ws/sitemap_items_11.xml',
  'https://missav.ws/sitemap_items_12.xml',
  'https://missav.ws/sitemap_items_13.xml',
  'https://missav.ws/sitemap_items_14.xml',
  'https://missav.ws/sitemap_items_15.xml',
  'https://missav.ws/sitemap_items_16.xml',
  'https://missav.ws/sitemap_items_17.xml',
  'https://missav.ws/sitemap_items_18.xml',
  'https://missav.ws/sitemap_items_19.xml',
  'https://missav.ws/sitemap_items_20.xml',
  'https://missav.ws/sitemap_items_21.xml',
  'https://missav.ws/sitemap_items_22.xml',
  'https://missav.ws/sitemap_items_23.xml',
  'https://missav.ws/sitemap_items_24.xml',
  'https://missav.ws/sitemap_items_25.xml',
  'https://missav.ws/sitemap_items_26.xml',
  'https://missav.ws/sitemap_items_27.xml',
  'https://missav.ws/sitemap_items_28.xml',
  'https://missav.ws/sitemap_items_29.xml',
  'https://missav.ws/sitemap_items_30.xml',
  'https://missav.ws/sitemap_items_31.xml',
  'https://missav.ws/sitemap_items_32.xml',
  'https://missav.ws/sitemap_items_33.xml',
  'https://missav.ws/sitemap_items_34.xml',
  'https://missav.ws/sitemap_items_35.xml',
  'https://missav.ws/sitemap_items_36.xml',
  'https://missav.ws/sitemap_items_37.xml',
  'https://missav.ws/sitemap_items_38.xml',
  'https://missav.ws/sitemap_items_39.xml',
  'https://missav.ws/sitemap_items_40.xml',
  'https://missav.ws/sitemap_items_41.xml',
  'https://missav.ws/sitemap_items_42.xml',
  'https://missav.ws/sitemap_items_43.xml',
  'https://missav.ws/sitemap_items_44.xml',
  'https://missav.ws/sitemap_items_45.xml',
  'https://missav.ws/sitemap_items_46.xml',
  'https://missav.ws/sitemap_items_47.xml',
  'https://missav.ws/sitemap_items_48.xml',
  'https://missav.ws/sitemap_items_49.xml',
  'https://missav.ws/sitemap_items_50.xml',
  'https://missav.ws/sitemap_items_51.xml',
  'https://missav.ws/sitemap_items_52.xml',
  'https://missav.ws/sitemap_items_53.xml',
  'https://missav.ws/sitemap_items_54.xml',
  'https://missav.ws/sitemap_items_55.xml',
  'https://missav.ws/sitemap_items_56.xml',
  'https://missav.ws/sitemap_items_57.xml',
  'https://missav.ws/sitemap_items_58.xml',
  'https://missav.ws/sitemap_items_59.xml',
  'https://missav.ws/sitemap_items_60.xml',
  'https://missav.ws/sitemap_items_61.xml',
  'https://missav.ws/sitemap_items_62.xml',
  'https://missav.ws/sitemap_items_63.xml',
  'https://missav.ws/sitemap_items_64.xml',
  'https://missav.ws/sitemap_items_65.xml',
  'https://missav.ws/sitemap_items_66.xml',
  'https://missav.ws/sitemap_items_67.xml',
  'https://missav.ws/sitemap_items_68.xml',
  'https://missav.ws/sitemap_items_69.xml',
  'https://missav.ws/sitemap_items_70.xml',
  'https://missav.ws/sitemap_items_71.xml',
  'https://missav.ws/sitemap_items_72.xml',
  'https://missav.ws/sitemap_items_73.xml',
  'https://missav.ws/sitemap_items_74.xml',
  'https://missav.ws/sitemap_items_75.xml',
  'https://missav.ws/sitemap_items_76.xml',
  'https://missav.ws/sitemap_items_77.xml',
  'https://missav.ws/sitemap_items_78.xml',
  'https://missav.ws/sitemap_items_79.xml',
  'https://missav.ws/sitemap_items_80.xml',
  'https://missav.ws/sitemap_items_81.xml',
  'https://missav.ws/sitemap_items_82.xml',
  'https://missav.ws/sitemap_items_83.xml',
  'https://missav.ws/sitemap_items_84.xml',
  'https://missav.ws/sitemap_items_85.xml',
  'https://missav.ws/sitemap_items_86.xml',
  'https://missav.ws/sitemap_items_87.xml',
  'https://missav.ws/sitemap_items_88.xml',
  'https://missav.ws/sitemap_items_89.xml',
  'https://missav.ws/sitemap_items_90.xml',
  'https://missav.ws/sitemap_items_91.xml',
  'https://missav.ws/sitemap_items_92.xml',
  'https://missav.ws/sitemap_items_93.xml',
  'https://missav.ws/sitemap_items_94.xml',
  'https://missav.ws/sitemap_items_95.xml',
  'https://missav.ws/sitemap_items_96.xml',
  'https://missav.ws/sitemap_items_97.xml',
  'https://missav.ws/sitemap_items_98.xml',
  'https://missav.ws/sitemap_items_99.xml',
  'https://missav.ws/sitemap_items_100.xml'
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

// function getMetaFile(key) {
//   return path.join(META_DIR, key[0] + ".json");
// }

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

    // ---------- EXTRACT ----------
    const original_title = $("meta[property='og:title']").attr("content") || "";
    const overview = $("meta[property='og:description']").attr("content") || "";
    const poster = ($("meta[property='og:image']").attr("content") || "").replace("-n.jpg", ".jpg");
    const releaseDate = $("time").text() || null;
    const duration = $("meta[property='og:video:duration']").attr("content") || 0;

    // encrypted string
    let encryptedString = null;
    $("script").each((i, el) => {
      const content = $(el).html();
      if (content && content.includes(".split('|')")) {
        const splitIndex = content.indexOf(".split('|')");
        const beforeSplit = content.substring(0, splitIndex);
        const lastQuote = beforeSplit.lastIndexOf("'");
        const firstQuote = beforeSplit.lastIndexOf("'", lastQuote - 1);
        encryptedString = beforeSplit.substring(firstQuote + 1, lastQuote);
      }
    });

    const genres = [];
    $(".space-y-2 .text-secondary").each((i, el) => {
      const label = $(el).find("span").text().trim();
      if (label === "Genre:") {
        $(el).find("a.text-nord13").each((_, a) => {
          genres.push({
            id: Math.floor(Math.random() * 100),
            name: $(a).text().trim()
          });
        });
      }
    });

    const cast = [];
    const actressBlock = $(".space-y-2 .text-secondary").filter((i, el) =>
      $(el).find("span").text().trim() === "Actress:"
    );

    actressBlock.find("a.text-nord13").each((_, a) => {
      const name = $(a).text().trim();
      cast.push({
        adult: true,
        gender: 1,
        id: name, // you can change this to slug if needed
        known_for_department: "Acting",
        name: name,
        popularity: null,
        profile_path: "https://placehold.co/200",
        cast_id: null,
        character: null,
        credit_id: null,
        order: null
      });
    });

    const crew = [];
    const makerBlock = $(".text-secondary").filter((i, el) =>
      $(el).find("span").text().trim() === "Maker:"
    );

    makerBlock.find("a.text-nord13").each((_, a) => {
      const name = $(a).text().trim();
      crew.push({
        adult: true,
        gender: null,
        id: $(a).attr("href")?.split("/").pop(), // better unique id
        known_for_department: "Directing",
        name: name,
        popularity: null,
        profile_path: "https://placehold.co/200",
        credit_id: null,
        department: "Directing",
        job: "Director"
      });
    });


    const productionCompanies = [];
    const makerDiv = $(".text-secondary").filter((i, el) =>
      $(el).text().includes("Maker:")
    ).first();
    if (makerDiv.length) {
      makerDiv.find("a").each((_, link) => {
        const name = $(link).attr("href")?.split("/").pop();
        productionCompanies.push({
          id: $(link).text().trim(),
          logo_path: "https://placehold.co/200",
          name: name,
          origin_country: "JP",
        });
      });
    }

    function totalMinutes(sec) {
      return Math.floor(Number(sec) / 60);
    }

    function slugToTitle(slug) {
      return slug.split("-").map((p,i)=>
        i===0 && /^[a-z]+$/i.test(p) ? p.toUpperCase() :
        /^\d+$/.test(p) ? p :
        p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()
      ).join(" ");
    }

    const pathname = new URL(url).pathname;
    const id = pathname.split("/").pop();

    const data = {
      adult: true,
      backdrop_path: null,
      belongs_to_collection: null,
      budget: 0,
      genres,
      homepage: "https://missav.ai",
      id,
      imdb_id: id,
      origin_country: "JP",
      original_language: "jp",
      original_title,
      overview: decodeHtml(overview),
      popularity: 0,
      poster_path: poster,
      production_companies: productionCompanies,
      production_countries: [{ iso_3166_1: "JP", name: "Japan" }],
      release_date: releaseDate,
      revenue: 0,
      runtime: totalMinutes(duration),
      spoken_languages: [{ iso_639_1: "ja", name: "Japanese" }],
      status: "Released",
      tagline: "Adult",
      title: slugToTitle(id),
      video: null,
      vote_average: 0,
      vote_count: 0,
      sources: encryptedString ? [] : [],
      keywords: { keywords: [{ id: null, name: null }] },
      credits: { cast, crew },
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

    // const metaFile = getMetaFile(key);
    // let meta = {};
    // if (fs.existsSync(metaFile)) {
    //   try { meta = JSON.parse(fs.readFileSync(metaFile)); } catch {}
    // }
    // meta[key] = { title: original_title, image: poster, path: relativePath };
    // fs.writeFileSync(metaFile, JSON.stringify(meta));

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
