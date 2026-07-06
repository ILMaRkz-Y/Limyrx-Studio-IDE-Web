const fs = require('fs');
const BASE = 'C:\\Users\\util\\Desktop\\Limyrx Studio IDE Web';

const files = [
  'ar\\docs\\install\\index.html',
  'ar\\docs\\quickstart\\index.html',
  'ar\\docs\\projects\\index.html',
  'ar\\docs\\tunnels\\index.html',
];

for (const f of files) {
  const p = BASE + '\\' + f;
  const c = fs.readFileSync(p, 'utf-8');
  const hasArabic = /[\u0600-\u06FF]/.test(c);
  const lang = c.match(/html lang="([^"]+)"/)[1];
  const dir = c.match(/dir="([^"]+)"/)?.[1] || 'none';
  const locale = c.match(/og:locale" content="([^"]+)"/)[1];
  const title = c.match(/<title>([^<]+)<\/title>/)[1];
  const canonical = c.match(/<link rel="canonical" href="([^"]+)">/)[1];
  const hasActiveAr = c.includes('lang-switcher-option active') && c.includes('/ar/');
  console.log(`${f}:`);
  console.log(`  lang=${lang}, dir=${dir}, locale=${locale}`);
  console.log(`  title=${title}`);
  console.log(`  canonical=${canonical}`);
  console.log(`  hasArabic=${hasArabic}, ar-active=${hasActiveAr}`);
}
