const fs = require('fs');
const path = require('path');

const BASE = 'C:\\Users\\util\\Desktop\\Limyrx Studio IDE Web';

function readFile(p) {
  return fs.readFileSync(p, 'utf-8');
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf-8');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processFile(englishPath, arabicPath, englishPagePath, arabicPagePath, pageTitleAr, metaDescAr, contentRep, tocHtmlAr) {
  let content = readFile(englishPath);

  // 1. html lang
  content = content.replace('<html lang="en" data-theme="dark">', '<html lang="ar" dir="rtl" data-theme="dark">');

  // 2. Title
  content = content.replace(/<title>[^<]+<\/title>/, `<title>${pageTitleAr} - Limyrx Studio IDE</title>`);

  // 3. Meta description
  content = content.replace(
    /<meta name="description" content="[^"]+">/,
    `<meta name="description" content="${metaDescAr}">`
  );
  content = content.replace(
    /<meta property="og:description" content="[^"]+">/,
    `<meta property="og:description" content="${metaDescAr}">`
  );
  content = content.replace(
    /<meta name="twitter:description" content="[^"]+">/,
    `<meta name="twitter:description" content="${metaDescAr}">`
  );

  // 4. og:title / twitter:title
  const ogTitle = `${pageTitleAr} - Limyrx Studio IDE`;
  content = content.replace(
    /<meta property="og:title" content="[^"]+">/,
    `<meta property="og:title" content="${ogTitle}">`
  );
  content = content.replace(
    /<meta name="twitter:title" content="[^"]+">/,
    `<meta name="twitter:title" content="${ogTitle}">`
  );

  // 5. og:locale
  content = content.replace('<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_PS">');

  // 6. og:url - fix only the og:url property
  content = content.replace(
    /<meta property="og:url" content="https:\/\/limyrxstudio\.dev\/docs\/[^"]+">/,
    `<meta property="og:url" content="https://limyrxstudio.dev${arabicPagePath}">`
  );

  // 7. canonical
  content = content.replace(
    /<link rel="canonical" href="https:\/\/limyrxstudio\.dev\/docs\/[^"]+">/,
    `<link rel="canonical" href="https://limyrxstudio.dev${arabicPagePath}">`
  );

  // 8. Language switcher button
  // The files have flag emojis that we need to match. They appear as "???? English" or similar.
  // We'll use a broad regex to match the aria-label and span content
  content = content.replace(
    /aria-label="[^"]* English"/,
    'aria-label="🇵🇸 العربية"'
  );
  content = content.replace(
    /<span class="lang-switcher-current">[^<]* English<\/span>/,
    '<span class="lang-switcher-current">🇵🇸 العربية</span>'
  );

  // 9. Language switcher menu - English item (remove active/aria-current)
  content = content.replace(
    /(<a href="\/docs\/[^"]+" hreflang="en" class="lang-switcher-option) active" aria-current="true">[^<]*<\/a>/,
    `$1">???? English</a>`
  );
  // Also fix href in case it differs
  content = content.replace(
    /<a href="\/docs\/[^"]+" hreflang="en" class="lang-switcher-option">/,
    `<a href="${englishPagePath}" hreflang="en" class="lang-switcher-option">`
  );

  // 10. Language switcher menu - Arabic item (add active/aria-current)
  content = content.replace(
    /(<a href="\/ar\/docs\/[^"]+" hreflang="ar" class="lang-switcher-option)">[^<]*<\/a>/,
    `$1 active" aria-current="true">🇵🇸 العربية</a>`
  );
  content = content.replace(
    /<a href="\/ar\/docs\/[^"]+" hreflang="ar" class="lang-switcher-option active" aria-current="true">/,
    `<a href="${arabicPagePath}" hreflang="ar" class="lang-switcher-option active" aria-current="true">`
  );

  // 11. Nav translations
  const navReps = {
    '> Docs </a>': '> المستندات </a>',
    '> Roadmap </a>': '> خارطة الطريق </a>',
    '> Support </a>': '> الدعم </a>',
    '> Donate </a>': '> تبرع </a>',
    '>Download</a>': '>تحميل</a>',
    'aria-label="Toggle menu"': 'aria-label="تبديل القائمة"',
  };
  for (const [k, v] of Object.entries(navReps)) {
    content = content.split(k).join(v);
  }

  // 12. Sidebar translations
  const sidebarReps = {
    '> Start here<': '> ابدأ من هنا<',
    '>Overview</a>': '>نظرة عامة</a>',
    '>Install</a>': '>تثبيت</a>',
    '>Quickstart</a>': '>بداية سريعة</a>',
    '>OpenCode Server</a>': '>خادم OpenCode</a>',
    '>Environment Variables</a>': '>متغيرات البيئة</a>',
    '> Workflows<': '> سير العمل<',
    '>Projects</a>': '>المشاريع</a>',
    '>Context</a>': '>السياق</a>',
    '>Notes, Todos &amp; Plans</a>': '>الملاحظات والمهام والخطط</a>',
    '>Scheduled Tasks</a>': '>المهام المجدولة</a>',
    '>Project Actions</a>': '>إجراءات المشروع</a>',
    '>Preview &amp; Dev Servers</a>': '>المعاينة وخوادم التطوير</a>',
    '>Worktree Sessions</a>': '>جلسات Worktree</a>',
    '>Multi-run</a>': '>تشغيل متعدد</a>',
    '>Git &amp; GitHub</a>': '>Git وGitHub</a>',
    '>GitHub Issues &amp; PRs</a>': '>مشكلات GitHub وطلبات السحب</a>',
    '>Magic Prompts</a>': '>الاستعلامات السحرية</a>',
    '>Git Identities</a>': '>هويات Git</a>',
    '> OpenCode setup<': '> إعداد OpenCode<',
    '>Providers, Models &amp; Agents</a>': '>المزودون والنماذج والوكلاء</a>',
    '>MCP Servers</a>': '>خوادم MCP</a>',
    '>Skills</a>': '>المهارات</a>',
    '>Skills Catalog</a>': '>كتالوج المهارات</a>',
    '>Commands &amp; Snippets</a>': '>الأوامر والمقتطفات</a>',
    '>Usage &amp; Quotas</a>': '>الاستخدام والحصص</a>',
    '> Remote access<': '> الوصول عن بعد<',
    '>Tunnels</a>': '>الأنفاق</a>',
    '>Reverse Proxy</a>': '>الوكيل العكسي</a>',
    '>PWA &amp; Mobile</a>': '>PWA والجوال</a>',
    '>Security</a>': '>الأمان</a>',
    '> Customize<': '> تخصيص<',
    '>Themes</a>': '>السمات</a>',
    '>Notifications</a>': '>الإشعارات</a>',
    '>Voice Mode</a>': '>وضع الصوت</a>',
    '>Project Icons</a>': '>أيقونات المشروع</a>',
    '> Desktop<': '> سطح المكتب<',
    '>Remote Instances</a>': '>المثيلات البعيدة</a>',
    '>Desktop Browser</a>': '>متصفح سطح المكتب</a>',
    '>Desktop Tunnels</a>': '>أنفاق سطح المكتب</a>',
    '>SSH Hosts &amp; Proxying</a>': '>مضيفات SSH والوكالة</a>',
    '>Updates</a>': '>التحديثات</a>',
    '> Help<': '> مساعدة<',
    '>Troubleshooting</a>': '>استكشاف الأخطاء</a>',
    '>OpenCode Connection</a>': '>اتصال OpenCode</a>',
    '>Worktrees &amp; Git</a>': '>Worktrees وGit</a>',
    '>Remote Access</a>': '>الوصول عن بعد</a>',
    'aria-label="Main"': 'aria-label="الرئيسية"',
  };
  for (const [k, v] of Object.entries(sidebarReps)) {
    content = content.split(k).join(v);
  }

  // 13. Footer translations
  content = content.split('Found a bug? Open an issue').join('وجدت خطأ؟ افتح مشكلة');
  content = content.split('Join our Discord community').join('انضم إلى مجتمعنا على Discord');

  // 14. Right sidebar "On this page"
  content = content.split('aria-label="On this page"').join('aria-label="في هذه الصفحة"');
  content = content.split('<h2>On this page</h2>').join('<h2>في هذه الصفحة</h2>');

  // 15. TOC items - replace between "في هذه الصفحة</h2> <ul>" and "</ul> </aside>"
  content = content.replace(
    /(<h2>في هذه الصفحة<\/h2> <ul>).*?(<\/ul> <\/aside>)/s,
    `$1${tocHtmlAr}$2`
  );

  // 16. Page-specific content replacements
  for (const [k, v] of Object.entries(contentRep)) {
    content = content.split(k).join(v);
  }

  writeFile(arabicPath, content);
  console.log(`Created: ${arabicPath}`);
}

// ====================================================================
// PAGE DEFINITIONS
// ====================================================================

const pages = [
  // --- commands-snippets ---
  {
    eng: 'docs\\commands-snippets\\index.html', ara: 'ar\\docs\\commands-snippets\\index.html', engPath: '/docs/commands-snippets/', araPath: '/ar/docs/commands-snippets/',
    titleAr: 'الأوامر والمقتطفات',
    metaAr: 'أنشئ أوامر ومقتطفات كود مخصصة لتسريع المهام المتكررة في Limyrx Studio IDE.',
    tocAr: '<li><a href="#commands-snippets">الأوامر والمقتطفات</a></li> <li><a href="#custom-commands">الأوامر المخصصة</a></li> <li><a href="#snippets">المقتطفات</a></li> <li><a href="#sharing">المشاركة</a></li>',
    reps: {
      '<h1 id="commands-snippets">Commands &amp; Snippets</h1>': '<h1 id="commands-snippets">الأوامر والمقتطفات</h1>',
      '<p>Create custom commands and code snippets to speed up repetitive tasks.</p>': '<p>أنشئ أوامر ومقتطفات كود مخصصة لتسريع المهام المتكررة.</p>',
      '<h2 id="custom-commands">Custom Commands</h2>': '<h2 id="custom-commands">الأوامر المخصصة</h2>',
      '<p>Define shell command templates in Settings &gt; Commands. They appear in the command palette and can include variables.</p>': '<p>حدد قوالب أوامر الطرفية في الإعدادات &gt; الأوامر. تظهر في لوحة الأوامر ويمكن أن تتضمن متغيرات.</p>',
      '<h2 id="snippets">Snippets</h2>': '<h2 id="snippets">المقتطفات</h2>',
      '<p>Snippets are reusable code blocks that insert at the cursor. Define them per project or globally.</p>': '<p>المقتطفات هي أجزاء كود قابلة لإعادة الاستخدام تُدرج عند المؤشر. حددها لكل مشروع أو بشكل عام.</p>',
      '<h2 id="sharing">Sharing</h2>': '<h2 id="sharing">المشاركة</h2>',
      '<p>Export and import commands and snippets as JSON files for team sharing.</p>': '<p>صدّر واستورد الأوامر والمقتطفات كملفات JSON للمشاركة الجماعية.</p>',
    }
  },
  // --- git ---
  {
    eng: 'docs\\git\\index.html', ara: 'ar\\docs\\git\\index.html', engPath: '/docs/git/', araPath: '/ar/docs/git/',
    titleAr: 'Git وGitHub',
    metaAr: 'سير عمل Git وGitHub في Limyrx Studio IDE.',
    tocAr: '<li><a href="#git-and-github">Git وGitHub</a></li> <li><a href="#changes-panel">لوحة التغييرات</a></li> <li><a href="#committing">الإيداع</a></li> <li><a href="#branching">الفروع</a></li> <li><a href="#github-integration">تكامل GitHub</a></li> <li><a href="#git-configuration">تكوين Git</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="git-and-github">Git &amp; GitHub</h1>': '<h1 id="git-and-github">Git وGitHub</h1>',
      '<p>Limyrx Studio IDE integrates git operations directly into the UI. The changes panel, commit dialog, and GitHub workflows let you manage version control without leaving the IDE.</p>': '<p>يدمج Limyrx Studio IDE عمليات git مباشرة في الواجهة. تتيح لك لوحة التغييرات ومربع حوار الإيداع وسير عمل GitHub إدارة التحكم في الإصدارات دون مغادرة IDE.</p>',
      '<h2 id="changes-panel">Changes Panel</h2>': '<h2 id="changes-panel">لوحة التغييرات</h2>',
      '<p>The changes panel shows all modified, added, and deleted files in your working tree. Files are grouped by status:</p>': '<p>تعرض لوحة التغييرات جميع الملفات المعدلة والمضافة والمحذوفة في شجرة العمل. يتم تجميع الملفات حسب الحالة:</p>',
      '<li><strong>Modified</strong> - changed since last commit</li>': '<li><strong>معدّل</strong> - تغير منذ آخر إيداع</li>',
      '<li><strong>Staged</strong> - added to the staging area</li>': '<li><strong>مجهّز</strong> - أضيف إلى منطقة التجهيز</li>',
      '<li><strong>Untracked</strong> - new files not yet tracked</li>': '<li><strong>غير متتبّع</strong> - ملفات جديدة غير متتبعة بعد</li>',
      '<p>Click any file to view a side-by-side or unified diff.</p>': '<p>انقر على أي ملف لعرض الفروقات جنباً إلى جنب أو موحدة.</p>',
      '<h2 id="committing">Committing</h2>': '<h2 id="committing">الإيداع</h2>',
      '<p>Stage files with a click, write a commit message, and commit. The IDE supports:</p>': '<p>جهّز الملفات بنقرة واحدة، اكتب رسالة إيداع، وقم بالإيداع. يدعم IDE:</p>',
      '<li>Conventional commits with structured messages</li>': '<li>إيداعات تقليدية برسائل منظمة</li>',
      '<li>AI-generated commit messages based on the diff</li>': '<li>رسائل إيداع مولّدة بالذكاء الاصطناعي بناءً على الفروقات</li>',
      '<li>Co-author attribution</li>': '<li>إسناد المؤلف المشارك</li>',
      '<li>Signing commits with GPG/SSH</li>': '<li>توقيع الإيداعات باستخدام GPG/SSH</li>',
      '<h2 id="branching">Branching</h2>': '<h2 id="branching">الفروع</h2>',
      '<p>Create, switch, merge, and delete branches from the git panel. The visual branch graph shows your commit history across all branches.</p>': '<p>أنشئ وبدّل وادمج واحذف الفروع من لوحة git. يعرض الرسم البياني البصري تاريخ إيداعاتك عبر جميع الفروع.</p>',
      '<h2 id="github-integration">GitHub Integration</h2>': '<h2 id="github-integration">تكامل GitHub</h2>',
      '<p>Authenticate with GitHub to:</p>': '<p>وثّق الاتصال مع GitHub لـ:</p>',
      '<li>Push and pull directly from the IDE</li>': '<li>الدفع والسحب مباشرة من IDE</li>',
      '<li>Create pull requests from a branch</li>': '<li>إنشاء طلبات سحب من فرع</li>',
      '<li>View PR status checks</li>': '<li>عرض فحوصات حالة طلبات السحب</li>',
      '<li>Review and merge PRs</li>': '<li>مراجعة ودمج طلبات السحب</li>',
      '<p>See <a href="/docs/github/">GitHub Issues &amp; PRs</a> for the full workflow.</p>': '<p>راجع <a href="/docs/github/">مشكلات GitHub وطلبات السحب</a> لسير العمل الكامل.</p>',
      '<h2 id="git-configuration">Git Configuration</h2>': '<h2 id="git-configuration">تكوين Git</h2>',
      '<p>Configure git identity, signing keys, and remote URLs from Settings. Multiple <a href="/docs/git-identities/">Git Identities</a> are supported for different projects.</p>': '<p>قم بتكوين هوية git ومفاتيح التوقيع وعناوين URL البعيدة من الإعدادات. يتم دعم <a href="/docs/git-identities/">هويات Git</a> متعددة لمشاريع مختلفة.</p>',
      '<li><a href="/docs/github/">GitHub Issues &amp; PRs</a></li>': '<li><a href="/docs/github/">مشكلات GitHub وطلبات السحب</a></li>',
      '<li><a href="/docs/git-identities/">Git Identities</a></li>': '<li><a href="/docs/git-identities/">هويات Git</a></li>',
      '<li><a href="/docs/worktrees/">Worktree Sessions</a></li>': '<li><a href="/docs/worktrees/">جلسات Worktree</a></li>',
    }
  },
  // --- github ---
  {
    eng: 'docs\\github\\index.html', ara: 'ar\\docs\\github\\index.html', engPath: '/docs/github/', araPath: '/ar/docs/github/',
    titleAr: 'مشكلات GitHub وطلبات السحب',
    metaAr: 'إدارة مشكلات GitHub وطلبات السحب مباشرة من Limyrx Studio IDE.',
    tocAr: '<li><a href="#github-issues-prs">مشكلات GitHub وطلبات السحب</a></li> <li><a href="#github-authentication">مصادقة GitHub</a></li> <li><a href="#issues">المشكلات</a></li> <li><a href="#pull-requests">طلبات السحب</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="github-issues-prs">GitHub Issues &amp; PRs</h1>': '<h1 id="github-issues-prs">مشكلات GitHub وطلبات السحب</h1>',
      '<p>Manage GitHub issues and pull requests directly from Limyrx Studio IDE.</p>': '<p>إدارة مشكلات GitHub وطلبات السحب مباشرة من Limyrx Studio IDE.</p>',
      '<h2 id="github-authentication">GitHub Authentication</h2>': '<h2 id="github-authentication">مصادقة GitHub</h2>',
      '<p>Authenticate with GitHub via OAuth or a personal access token. Go to <strong>Settings &gt; Accounts</strong> and click <strong>Connect GitHub</strong>.</p>': '<p>وثّق الاتصال مع GitHub عبر OAuth أو رمز وصول شخصي. انتقل إلى <strong>الإعدادات &gt; الحسابات</strong> وانقر <strong>اتصال GitHub</strong>.</p>',
      '<h2 id="issues">Issues</h2>': '<h2 id="issues">المشكلات</h2>',
      '<p>Browse, create, and update issues from the GitHub panel. Filter by repository, status, and assignee. You can ask the agent to work on an issue by referencing its number.</p>': '<p>تصفح وأنشئ وحدّث المشكلات من لوحة GitHub. صفّح حسب المستودع والحالة والمسند إليه. يمكنك أن تطلب من الوكيل العمل على مشكلة بالإشارة إلى رقمها.</p>',
      '<h2 id="pull-requests">Pull Requests</h2>': '<h2 id="pull-requests">طلبات السحب</h2>',
      '<p>Create PRs from the current branch, view PR status checks, request reviews, and merge approved PRs — all without leaving the IDE.</p>': '<p>أنشئ طلبات سحب من الفرع الحالي، وعرض فحوصات حالة طلبات السحب، وطلب مراجعات، ودمج طلبات السحب المعتمدة — كل ذلك دون مغادرة IDE.</p>',
      '<li><a href="/docs/git/">Git &amp; GitHub</a></li>': '<li><a href="/docs/git/">Git وGitHub</a></li>',
      '<li><a href="/docs/git-identities/">Git Identities</a></li>': '<li><a href="/docs/git-identities/">هويات Git</a></li>',
    }
  },
  // --- magic-prompts ---
  {
    eng: 'docs\\magic-prompts\\index.html', ara: 'ar\\docs\\magic-prompts\\index.html', engPath: '/docs/magic-prompts/', araPath: '/ar/docs/magic-prompts/',
    titleAr: 'الاستعلامات السحرية',
    metaAr: 'أنشئ واستخدم قوالب استعلامات سحرية قابلة لإعادة الاستخدام في Limyrx Studio IDE.',
    tocAr: '<li><a href="#magic-prompts">الاستعلامات السحرية</a></li> <li><a href="#what-are-magic-prompts">ما هي الاستعلامات السحرية؟</a></li> <li><a href="#creating-prompts">إنشاء الاستعلامات</a></li> <li><a href="#using-prompts">استخدام الاستعلامات</a></li>',
    reps: {
      '<h1 id="magic-prompts">Magic Prompts</h1>': '<h1 id="magic-prompts">الاستعلامات السحرية</h1>',
      '<p>Magic Prompts are reusable, parameterized prompt templates that speed up common workflows.</p>': '<p>الاستعلامات السحرية هي قوالب استعلامات قابلة لإعادة الاستخدام ومُعلمة لتسريع سير العمل الشائع.</p>',
      '<h2 id="what-are-magic-prompts">What Are Magic Prompts?</h2>': '<h2 id="what-are-magic-prompts">ما هي الاستعلامات السحرية؟</h2>',
      '<p>A magic prompt is a template with placeholders (<code>{{variable}}</code>) that you fill in when running. The IDE provides a form UI for each template.</p>': '<p>الاستعلام السحري هو قالب مع عناصر نائبة (<code>{{variable}}</code>) تملؤها عند التشغيل. يوفر IDE واجهة نموذج لكل قالب.</p>',
      '<h2 id="creating-prompts">Creating Prompts</h2>': '<h2 id="creating-prompts">إنشاء الاستعلامات</h2>',
      '<p>Define them in <code>.opencode.jsonc</code>:</p>': '<p>حددها في <code>.opencode.jsonc</code>:</p>',
      '<h2 id="using-prompts">Using Prompts</h2>': '<h2 id="using-prompts">استخدام الاستعلامات</h2>',
      '<p>Open the command palette, select <strong>Magic Prompt</strong>, choose a template, fill in the fields, and the prompt is inserted into the chat input.</p>': '<p>افتح لوحة الأوامر، اختر <strong>استعلام سحري</strong>، واختر قالباً، واملأ الحقول، ويُدرج الاستعلام في إدخال الدردشة.</p>',
    }
  },
  // --- mcp ---
  {
    eng: 'docs\\mcp\\index.html', ara: 'ar\\docs\\mcp\\index.html', engPath: '/docs/mcp/', araPath: '/ar/docs/mcp/',
    titleAr: 'خوادم MCP',
    metaAr: 'وسّع وكيل الذكاء الاصطناعي بخوادم MCP في Limyrx Studio IDE.',
    tocAr: '<li><a href="#mcp-servers">خوادم MCP</a></li> <li><a href="#what-is-mcp">ما هو MCP؟</a></li> <li><a href="#adding-mcp-servers">إضافة خوادم MCP</a></li> <li><a href="#available-mcp-servers">خوادم MCP المتاحة</a></li>',
    reps: {
      '<h1 id="mcp-servers">MCP Servers</h1>': '<h1 id="mcp-servers">خوادم MCP</h1>',
      '<p>MCP (Model Context Protocol) servers extend what the AI agent can do by providing additional tools and data sources.</p>': '<p>خوادم MCP (بروتوكول سياق النموذج) توسع ما يمكن لوكيل الذكاء الاصطناعي فعله من خلال توفير أدوات ومصادر بيانات إضافية.</p>',
      '<h2 id="what-is-mcp">What is MCP?</h2>': '<h2 id="what-is-mcp">ما هو MCP؟</h2>',
      '<p>MCP is an open protocol that lets you plug external tools into your AI agent — databases, APIs, file systems, and more.</p>': '<p>MCP هو بروتوكول مفتوح يتيح لك ربط أدوات خارجية بوكيل الذكاء الاصطناعي — قواعد البيانات وواجهات API وأنظمة الملفات والمزيد.</p>',
      '<h2 id="adding-mcp-servers">Adding MCP Servers</h2>': '<h2 id="adding-mcp-servers">إضافة خوادم MCP</h2>',
      '<p>Go to <strong>Settings &gt; MCP Servers</strong> and click <strong>Add Server</strong>. Provide the server URL and any authentication tokens.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; خوادم MCP</strong> وانقر <strong>إضافة خادم</strong>. قدم عنوان URL للخادم وأي رموز مصادقة.</p>',
      '<h2 id="available-mcp-servers">Available MCP Servers</h2>': '<h2 id="available-mcp-servers">خوادم MCP المتاحة</h2>',
      '<p>The community maintains MCP servers for databases (PostgreSQL, SQLite), APIs (GitHub, Slack, Jira), and file operations.</p>': '<p>يحافظ المجتمع على خوادم MCP لقواعد البيانات (PostgreSQL, SQLite) وواجهات API (GitHub, Slack, Jira) وعمليات الملفات.</p>',
    }
  },
  // --- multi-run ---
  {
    eng: 'docs\\multi-run\\index.html', ara: 'ar\\docs\\multi-run\\index.html', engPath: '/docs/multi-run/', araPath: '/ar/docs/multi-run/',
    titleAr: 'تشغيل متعدد',
    metaAr: 'نفّذ نفس الاستعلام عبر مشاريع متعددة في وقت واحد مع ميزة التشغيل المتعدد في Limyrx Studio IDE.',
    tocAr: '<li><a href="#multi-run">التشغيل المتعدد</a></li> <li><a href="#overview">نظرة عامة</a></li> <li><a href="#configuration">التكوين</a></li> <li><a href="#use-cases">حالات الاستخدام</a></li>',
    reps: {
      '<h1 id="multi-run">Multi-run</h1>': '<h1 id="multi-run">التشغيل المتعدد</h1>',
      '<p>Multi-run lets you execute the same prompt across multiple projects simultaneously \u2014 useful for applying consistent changes across a monorepo or fleet of repositories.</p>': '<p>يتيح لك التشغيل المتعدد تنفيذ نفس الاستعلام عبر مشاريع متعددة في وقت واحد — مفيد لتطبيق تغييرات متسقة عبر مستودع متعدد أو مجموعة من المستودعات.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>Select multiple projects, write a prompt, and the agent works on all of them in parallel. Results are shown per-project in a grid layout.</p>': '<p>اختر مشاريع متعددة، واكتب استعلاماً، ويعمل الوكيل على جميعها بالتوازي. تظهر النتائج لكل مشروع في تخطيط شبكي.</p>',
      '<h2 id="configuration">Configuration</h2>': '<h2 id="configuration">التكوين</h2>',
      '<p>Configure concurrency limits, timeout per project, and failure handling (stop all / continue on error).</p>': '<p>قم بتكوين حدود التزامن والمهلة لكل مشروع ومعالجة الأخطاء (إيقاف الكل / متابعة عند الخطأ).</p>',
      '<h2 id="use-cases">Use Cases</h2>': '<h2 id="use-cases">حالات الاستخدام</h2>',
      '<li>Apply a lint fix across all packages in a monorepo</li>': '<li>تطبيق إصلاح lint عبر جميع الحزم في مستودع متعدد</li>',
      '<li>Update dependency versions across services</li>': '<li>تحديث إصدارات التبعيات عبر الخدمات</li>',
      '<li>Run the same refactoring on multiple codebases</li>': '<li>تشغيل نفس إعادة الهيكلة على قواعد شيفرات متعددة</li>',
    }
  },
  // --- notes-todos-plans ---
  {
    eng: 'docs\\notes-todos-plans\\index.html', ara: 'ar\\docs\\notes-todos-plans\\index.html', engPath: '/docs/notes-todos-plans/', araPath: '/ar/docs/notes-todos-plans/',
    titleAr: 'الملاحظات والمهام والخطط',
    metaAr: 'استخدم أدوات الملاحظات والمهام والخطط المدمجة في Limyrx Studio IDE لتنظيم عملك.',
    tocAr: '<li><a href="#notes-todos-plans">الملاحظات والمهام والخطط</a></li> <li><a href="#notes">الملاحظات</a></li> <li><a href="#todos">المهام</a></li> <li><a href="#plans">الخطط</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="notes-todos-plans">Notes, Todos &amp; Plans</h1>': '<h1 id="notes-todos-plans">الملاحظات والمهام والخطط</h1>',
      '<p>Limyrx Studio IDE includes built-in tools for managing notes, todos, and plans alongside your code.</p>': '<p>يتضمن Limyrx Studio IDE أدوات مدمجة لإدارة الملاحظات والمهام والخطط جنباً إلى جنب مع الكود الخاص بك.</p>',
      '<h2 id="notes">Notes</h2>': '<h2 id="notes">الملاحظات</h2>',
      '<p>Write Markdown notes in the notes panel. Notes are saved as <code>.md</code> files in your project and can be linked to specific files or sessions.</p>': '<p>اكتب ملاحظات Markdown في لوحة الملاحظات. تُحفظ الملاحظات كملفات <code>.md</code> في مشروعك ويمكن ربطها بملفات أو جلسات محددة.</p>',
      '<h2 id="todos">Todos</h2>': '<h2 id="todos">المهام</h2>',
      '<p>The todo panel shows tasks extracted from your codebase (e.g. <code>TODO</code>, <code>FIXME</code>, <code>HACK</code> comments) as well as manually created items.</p>': '<p>تعرض لوحة المهام المهام المستخرجة من قاعدة الشيفرة (مثل تعليقات <code>TODO</code> و<code>FIXME</code> و<code>HACK</code>) بالإضافة إلى العناصر المنشأة يدوياً.</p>',
      '<h2 id="plans">Plans</h2>': '<h2 id="plans">الخطط</h2>',
      '<p>Before starting complex work, use the plan panel to outline steps. The agent can generate plans from your prompt and execute them step by step.</p>': '<p>قبل بدء عمل معقد، استخدم لوحة الخطط لتحديد الخطوات. يمكن للوكيل إنشاء خطط من استعلامك وتنفيذها خطوة بخطوة.</p>',
      '<li><a href="/docs/projects/">Projects</a></li>': '<li><a href="/docs/projects/">المشاريع</a></li>',
      '<li><a href="/docs/context/">Context</a></li>': '<li><a href="/docs/context/">السياق</a></li>',
    }
  },
  // --- notifications ---
  {
    eng: 'docs\\notifications\\index.html', ara: 'ar\\docs\\notifications\\index.html', engPath: '/docs/notifications/', araPath: '/ar/docs/notifications/',
    titleAr: 'الإشعارات',
    metaAr: 'ابقَ على اطلاع بتقدم الجلسات والمهام المكتملة والأحداث المهمة.',
    tocAr: '<li><a href="#notification-types">أنواع الإشعارات</a></li>\n<li><a href="#configuring-notifications">تكوين الإشعارات</a></li>\n<li><a href="#desktop-notifications">إشعارات سطح المكتب</a></li>',
    reps: {
      '<h1 id="notifications">Notifications</h1>': '<h1 id="notifications">الإشعارات</h1>',
      '<p>Stay informed about session progress, completed tasks, and important events.</p>': '<p>ابقَ على اطلاع بتقدم الجلسات والمهام المكتملة والأحداث المهمة.</p>',
      '<h2 id="notification-types">Notification Types</h2>': '<h2 id="notification-types">أنواع الإشعارات</h2>',
      '<li><strong>Session events</strong> - task complete, error, needs review</li>': '<li><strong>أحداث الجلسة</strong> - اكتمال المهمة، خطأ، بحاجة للمراجعة</li>',
      '<li><strong>Git events</strong> - PR merged, push complete</li>': '<li><strong>أحداث Git</strong> - دمج طلب السحب، اكتمال الدفع</li>',
      '<li><strong>Scheduled tasks</strong> - task started, completed, or failed</li>': '<li><strong>المهام المجدولة</strong> - بدأت المهمة أو اكتملت أو فشلت</li>',
      '<li><strong>System</strong> - updates available, connection lost</li>': '<li><strong>النظام</strong> - تحديثات متاحة، فقدان الاتصال</li>',
      '<h2 id="configuring-notifications">Configuring Notifications</h2>': '<h2 id="configuring-notifications">تكوين الإشعارات</h2>',
      '<p>In Settings &gt; Notifications, choose which events trigger notifications and how (sound, badge, toast, or silent).</p>': '<p>في الإعدادات &gt; الإشعارات، اختر الأحداث التي تشغل الإشعارات وكيفية ذلك (صوت، شارة، إشعار منبثق، أو صامت).</p>',
      '<h2 id="desktop-notifications">Desktop Notifications</h2>': '<h2 id="desktop-notifications">إشعارات سطح المكتب</h2>',
      '<p>The desktop app supports native OS notifications with action buttons (e.g., "Review Changes", "Dismiss").</p>': '<p>يدعم تطبيق سطح المكتب إشعارات نظام التشغيل الأصلية بأزرار إجراءات (مثل "مراجعة التغييرات" و"تجاهل").</p>',
    }
  },
  // --- opencode-server ---
  {
    eng: 'docs\\opencode-server\\index.html', ara: 'ar\\docs\\opencode-server\\index.html', engPath: '/docs/opencode-server/', araPath: '/ar/docs/opencode-server/',
    titleAr: 'خادم OpenCode',
    metaAr: 'ثبّت وتهيئة خادم OpenCode، عملية الوكيل الخلفية للبرمجة بمساعدة الذكاء الاصطناعي في Limyrx Studio IDE.',
    tocAr: '<li><a href="#opencode-server">خادم OpenCode</a></li> <li><a href="#installing-opencode-server">تثبيت خادم OpenCode</a></li> <li><a href="#starting-the-server">بدء تشغيل الخادم</a></li> <li><a href="#configuration">التكوين</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="opencode-server">OpenCode Server</h1>': '<h1 id="opencode-server">خادم OpenCode</h1>',
      '<p>OpenCode Server is the backend agent process that powers AI-assisted coding in Limyrx Studio IDE. It runs in your terminal and communicates with the IDE via WebSocket.</p>': '<p>خادم OpenCode هو عملية الوكيل الخلفية التي تشغل البرمجة بمساعدة الذكاء الاصطناعي في Limyrx Studio IDE. يعمل في الطرفية الخاصة بك ويتواصل مع IDE عبر WebSocket.</p>',
      '<h2 id="installing-opencode-server">Installing OpenCode Server</h2>': '<h2 id="installing-opencode-server">تثبيت خادم OpenCode</h2>',
      '<p>The server is distributed as a standalone binary. Install it with:</p>': '<p>يتم توزيع الخادم كملف ثنائي مستقل. ثبّته باستخدام:</p>',
      '<p>Or download the latest release from <a href="https://github.com/limyrx/opencode/releases">GitHub</a>.</p>': '<p>أو قم بتنزيل أحدث إصدار من <a href="https://github.com/limyrx/opencode/releases">GitHub</a>.</p>',
      '<h2 id="starting-the-server">Starting the Server</h2>': '<h2 id="starting-the-server">بدء تشغيل الخادم</h2>',
      '<p>The server listens on <code>localhost:8765</code> by default. Limyrx Studio IDE auto-discovers a running server on the same machine.</p>': '<p>يستمع الخادم على <code>localhost:8765</code> افتراضياً. يكتشف Limyrx Studio IDE تلقائياً خادماً قيد التشغيل على نفس الجهاز.</p>',
      '<h2 id="configuration">Configuration</h2>': '<h2 id="configuration">التكوين</h2>',
      '<p>The server reads <code>.opencode.jsonc</code> from the project root. Key settings include provider credentials, model preferences, and agent behavior.</p>': '<p>يقرأ الخادم <code>.opencode.jsonc</code> من جذر المشروع. تشمل الإعدادات الرئيسية بيانات اعتماد المزود وتفضيلات النموذج وسلوك الوكيل.</p>',
      '<li><a href="/docs/quickstart/">Quickstart</a></li>': '<li><a href="/docs/quickstart/">بداية سريعة</a></li>',
      '<li><a href="/docs/providers/">Providers, Models &amp; Agents</a></li>': '<li><a href="/docs/providers/">المزودون والنماذج والوكلاء</a></li>',
      '<li><a href="/docs/environment/">Environment Variables</a></li>': '<li><a href="/docs/environment/">متغيرات البيئة</a></li>',
    }
  },
  // --- preview ---
  {
    eng: 'docs\\preview\\index.html', ara: 'ar\\docs\\preview\\index.html', engPath: '/docs/preview/', araPath: '/ar/docs/preview/',
    titleAr: 'المعاينة وخوادم التطوير',
    metaAr: 'دمج خوادم التطوير ومعاينة تطبيق الويب مباشرة في Limyrx Studio IDE.',
    tocAr: '<li><a href="#preview-dev-servers">المعاينة وخوادم التطوير</a></li> <li><a href="#dev-server-integration">دمج خادم التطوير</a></li> <li><a href="#preview-panel">لوحة المعاينة</a></li> <li><a href="#port-forwarding">إعادة توجيه المنافذ</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="preview-dev-servers">Preview &amp; Dev Servers</h1>': '<h1 id="preview-dev-servers">المعاينة وخوادم التطوير</h1>',
      '<p>Limyrx Studio IDE integrates with your development servers, showing previews directly in the IDE.</p>': '<p>يتكامل Limyrx Studio IDE مع خوادم التطوير الخاصة بك، ويعرض المعاينات مباشرة في IDE.</p>',
      '<h2 id="dev-server-integration">Dev Server Integration</h2>': '<h2 id="dev-server-integration">دمج خادم التطوير</h2>',
      '<p>When you start a dev server (Vite, Next.js, etc.) via a terminal command or project action, the IDE detects the port and offers to open a preview panel.</p>': '<p>عند تشغيل خادم تطوير (Vite, Next.js, إلخ) عبر أمر طرفية أو إجراء مشروع، يكتشف IDE المنفذ ويعرض فتح لوحة معاينة.</p>',
      '<h2 id="preview-panel">Preview Panel</h2>': '<h2 id="preview-panel">لوحة المعاينة</h2>',
      '<p>The preview panel renders your web app inside the IDE. It supports hot reload, responsive device modes, and URL navigation.</p>': '<p>تعرض لوحة المعاينة تطبيق الويب الخاص بك داخل IDE. تدعم إعادة التحميل السريع وأوضاع الأجهزة المتجاوبة والتنقل عبر URL.</p>',
      '<h2 id="port-forwarding">Port Forwarding</h2>': '<h2 id="port-forwarding">إعادة توجيه المنافذ</h2>',
      '<p>In remote sessions, ports are automatically forwarded so you can access dev servers from your local browser. Configure port ranges in Settings.</p>': '<p>في الجلسات البعيدة، يتم إعادة توجيه المنافذ تلقائياً لتتمكن من الوصول إلى خوادم التطوير من متصفحك المحلي. قم بتكوين نطاقات المنافذ في الإعدادات.</p>',
      '<li><a href="/docs/tunnels/">Tunnels</a></li>': '<li><a href="/docs/tunnels/">الأنفاق</a></li>',
      '<li><a href="/docs/desktop-browser/">Desktop Browser</a></li>': '<li><a href="/docs/desktop-browser/">متصفح سطح المكتب</a></li>',
    }
  },
  // --- project-icons ---
  {
    eng: 'docs\\project-icons\\index.html', ara: 'ar\\docs\\project-icons\\index.html', engPath: '/docs/project-icons/', araPath: '/ar/docs/project-icons/',
    titleAr: 'أيقونات المشروع',
    metaAr: 'تساعد أيقونات المشروع في تمييز المشاريع بنظرة سريعة في لوحة التحكم والشريط الجانبي.',
    tocAr: '<li><a href="#overview">نظرة عامة</a></li>\n<li><a href="#custom-icons">أيقونات مخصصة</a></li>\n<li><a href="#icon-sets">مجموعات الأيقونات</a></li>',
    reps: {
      '<h1 id="project-icons">Project Icons</h1>': '<h1 id="project-icons">أيقونات المشروع</h1>',
      '<p>Project icons help distinguish projects at a glance in the dashboard and sidebar.</p>': '<p>تساعد أيقونات المشروع في تمييز المشاريع بنظرة سريعة في لوحة التحكم والشريط الجانبي.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>Each project displays a small icon. By default, the IDE detects the project type (Node, Python, Rust, etc.) and assigns an appropriate icon.</p>': '<p>يعرض كل مشروع أيقونة صغيرة. افتراضياً، يكتشف IDE نوع المشروع (Node, Python, Rust, إلخ) ويخصص أيقونة مناسبة.</p>',
      '<h2 id="custom-icons">Custom Icons</h2>': '<h2 id="custom-icons">أيقونات مخصصة</h2>',
      '<p>Right-click a project in the sidebar and select <strong>Change Icon</strong>. Upload a PNG or SVG, or pick from the built-in library.</p>': '<p>انقر بزر الماوس الأيمن على مشروع في الشريط الجانبي واختر <strong>تغيير الأيقونة</strong>. حمّل PNG أو SVG، أو اختر من المكتبة المدمجة.</p>',
      '<h2 id="icon-sets">Icon Sets</h2>': '<h2 id="icon-sets">مجموعات الأيقونات</h2>',
      '<p>Install community icon packs from the Skills Catalog. Icon packs can add language-specific, framework-specific, or custom emoji icons.</p>': '<p>ثبّت حزم أيقونات المجتمع من كتالوج المهارات. يمكن لحزم الأيقونات إضافة أيقونات خاصة بلغة برمجة أو إطار عمل معين أو رموز تعبيرية مخصصة.</p>',
    }
  },
  // --- providers ---
  {
    eng: 'docs\\providers\\index.html', ara: 'ar\\docs\\providers\\index.html', engPath: '/docs/providers/', araPath: '/ar/docs/providers/',
    titleAr: 'المزودون والنماذج والوكلاء',
    metaAr: 'تهيئة مزودي الذكاء الاصطناعي والنماذج والوكلاء في Limyrx Studio IDE.',
    tocAr: '<li><a href="#providers-models-and-agents">نظرة عامة</a></li> <li><a href="#supported-providers">المزودون المدعومون</a></li> <li><a href="#adding-a-provider">إضافة مزود</a></li> <li><a href="#model-selection">اختيار النموذج</a></li> <li><a href="#agents">الوكلاء</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="providers-models-and-agents">Providers, Models &amp; Agents</h1>': '<h1 id="providers-models-and-agents">المزودون والنماذج والوكلاء</h1>',
      '<p>Limyrx Studio IDE works with any LLM provider that OpenCode supports. Configure providers, select models, and manage agent behavior from Settings.</p>': '<p>يعمل Limyrx Studio IDE مع أي مزود LLM يدعمه OpenCode. قم بتكوين المزودين واختيار النماذج وإدارة سلوك الوكيل من الإعدادات.</p>',
      '<h2 id="supported-providers">Supported Providers</h2>': '<h2 id="supported-providers">المزودون المدعومون</h2>',
      '<th>Provider</th><th>Models</th><th>API Key Required</th>': '<th>المزود</th><th>النماذج</th><th>مطلوب مفتاح API</th>',
      '<h2 id="adding-a-provider">Adding a Provider</h2>': '<h2 id="adding-a-provider">إضافة مزود</h2>',
      '<p>Go to <strong>Settings &gt; Providers</strong> and click <strong>Add Provider</strong>. Select the provider from the list, enter your API key, and optionally set a custom base URL for self-hosted or proxy endpoints.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; المزودون</strong> وانقر <strong>إضافة مزود</strong>. اختر المزود من القائمة، وأدخل مفتاح API الخاص بك، واختيارياً عيّن عنوان URL أساسي مخصص للنقاط الطرفية المستضافة ذاتياً أو الوكيلة.</p>',
      '<h2 id="model-selection">Model Selection</h2>': '<h2 id="model-selection">اختيار النموذج</h2>',
      '<p>Each provider can have multiple models configured. Set a default model per provider and override per project if needed. Models are ranked by capability and cost:</p>': '<p>يمكن أن يكون لكل مزود نماذج متعددة مكونة. عيّن نموذجاً افتراضياً لكل مزود وقم بالتجاوز لكل مشروع إذا لزم الأمر. يتم ترتيب النماذج حسب القدرة والتكلفة:</p>',
      '<li><strong>Sonnet/4o</strong> - best balance of speed and quality</li>': '<li><strong>Sonnet/4o</strong> - أفضل توازن بين السرعة والجودة</li>',
      '<li><strong>Opus/o1</strong> - maximum reasoning, slower</li>': '<li><strong>Opus/o1</strong> - أقصى استدلال، أبطأ</li>',
      '<li><strong>Haiku/mini</strong> - fastest, good for simple tasks</li>': '<li><strong>Haiku/mini</strong> - الأسرع، مناسب للمهام البسيطة</li>',
      '<h2 id="agents">Agents</h2>': '<h2 id="agents">الوكلاء</h2>',
      '<p>Limyrx Studio IDE supports multiple agent architectures:</p>': '<p>يدعم Limyrx Studio IDE بنى وكيلة متعددة:</p>',
      '<li><strong>OpenCode Agent</strong> - the default general-purpose coding agent</li>': '<li><strong>وكيل OpenCode</strong> - وكيل البرمجة العام الافتراضي</li>',
      '<li><strong>Planner Agent</strong> - plans before executing</li>': '<li><strong>وكيل المخطط</strong> - يخطط قبل التنفيذ</li>',
      '<li><strong>Custom Agents</strong> - defined in your <code>.opencode.jsonc</code></li>': '<li><strong>وكلاء مخصصون</strong> - معرفون في <code>.opencode.jsonc</code></li>',
      '<li><a href="/docs/usage/">Usage &amp; Quotas</a> - track token and API usage</li>': '<li><a href="/docs/usage/">الاستخدام والحصص</a> - تتبع استخدام الرموز وAPI</li>',
      '<li><a href="/docs/mcp/">MCP Servers</a> - extend agent capabilities</li>': '<li><a href="/docs/mcp/">خوادم MCP</a> - توسيع قدرات الوكيل</li>',
      '<li><a href="/docs/skills/">Skills</a> - teach the agent domain knowledge</li>': '<li><a href="/docs/skills/">المهارات</a> - تعليم الوكيل المعرفة المجالية</li>',
    }
  },
  // --- remote-instances ---
  {
    eng: 'docs\\remote-instances\\index.html', ara: 'ar\\docs\\remote-instances\\index.html', engPath: '/docs/remote-instances/', araPath: '/ar/docs/remote-instances/',
    titleAr: 'المثيلات البعيدة',
    metaAr: 'تتيح لك المثيلات البعيدة توصيل تطبيق سطح المكتب بخوادم OpenCode التي تعمل على أجهزة أخرى.',
    tocAr: '<li><a href="#what-are-remote-instances">ما هي المثيلات البعيدة؟</a></li>\n<li><a href="#connecting">الاتصال</a></li>\n<li><a href="#managing-instances">إدارة المثيلات</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="remote-instances">Remote Instances</h1>': '<h1 id="remote-instances">المثيلات البعيدة</h1>',
      '<p>Remote instances let you connect the desktop app to OpenCode servers running on other machines.</p>': '<p>تتيح لك المثيلات البعيدة توصيل تطبيق سطح المكتب بخوادم OpenCode التي تعمل على أجهزة أخرى.</p>',
      '<h2 id="what-are-remote-instances">What Are Remote Instances?</h2>': '<h2 id="what-are-remote-instances">ما هي المثيلات البعيدة؟</h2>',
      '<p>A remote instance is a connection to an OpenCode Server running on a remote machine \u2014 a VPS, a dev server, or a team member\'s workstation.</p>': '<p>المثيل البعيد هو اتصال بخادم OpenCode يعمل على جهاز بعيد — VPS أو خادم تطوير أو محطة عمل أحد أعضاء الفريق.</p>',
      '<h2 id="connecting">Connecting</h2>': '<h2 id="connecting">الاتصال</h2>',
      '<p>In the desktop app, go to <strong>Instances &gt; Add Remote</strong>. Enter the server URL and authentication token. The IDE connects and shows the remote file system.</p>': '<p>في تطبيق سطح المكتب، انتقل إلى <strong>المثيلات &gt; إضافة بعيد</strong>. أدخل عنوان URL للخادم ورمز المصادقة. يتصل IDE ويعرض نظام الملفات البعيد.</p>',
      '<h2 id="managing-instances">Managing Instances</h2>': '<h2 id="managing-instances">إدارة المثيلات</h2>',
      '<p>The instances panel shows all configured connections with status indicators. You can rename, reconfigure, or remove instances.</p>': '<p>تعرض لوحة المثيلات جميع الاتصالات المكونة مع مؤشرات الحالة. يمكنك إعادة تسمية المثيلات أو إعادة تكوينها أو إزالتها.</p>',
      '<li><a href="/docs/desktop-tunnels/">Desktop Tunnels</a></li>': '<li><a href="/docs/desktop-tunnels/">أنفاق سطح المكتب</a></li>',
      '<li><a href="/docs/ssh-hosts-proxying/">SSH Hosts &amp; Proxying</a></li>': '<li><a href="/docs/ssh-hosts-proxying/">مضيفات SSH والوكالة</a></li>',
    }
  },
  // --- reverse-proxy ---
  {
    eng: 'docs\\reverse-proxy\\index.html', ara: 'ar\\docs\\reverse-proxy\\index.html', engPath: '/docs/reverse-proxy/', araPath: '/ar/docs/reverse-proxy/',
    titleAr: 'الوكيل العكسي',
    metaAr: 'شغّل Limyrx Studio IDE خلف وكيل عكسي خاص بك للنطاقات المخصصة و TLS والتحكم في الوصول.',
    tocAr: '<li><a href="#overview">نظرة عامة</a></li>\n<li><a href="#configuration">التكوين</a></li>\n<li><a href="#tls-ssl">TLS/SSL</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="reverse-proxy">Reverse Proxy</h1>': '<h1 id="reverse-proxy">الوكيل العكسي</h1>',
      '<p>Run Limyrx Studio IDE behind your own reverse proxy for custom domains, TLS, and access control.</p>': '<p>شغّل Limyrx Studio IDE خلف وكيل عكسي خاص بك للنطاقات المخصصة و TLS والتحكم في الوصول.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>Place nginx, Caddy, or Traefik in front of the IDE. The IDE speaks HTTP/WebSocket, so any proxy that supports those protocols works.</p>': '<p>ضع nginx أو Caddy أو Traefik أمام IDE. IDE يستخدم HTTP/WebSocket، لذا أي وكيل يدعم تلك البروتوكولات يعمل.</p>',
      '<h2 id="configuration">Configuration</h2>': '<h2 id="configuration">التكوين</h2>',
      '<p>Example nginx config:</p>': '<p>مثال لتكوين nginx:</p>',
      '<h2 id="tls-ssl">TLS/SSL</h2>': '<h2 id="tls-ssl">TLS/SSL</h2>',
      '<p>Terminate TLS at your proxy. The IDE can run without TLS on localhost, but remote access should always use HTTPS.</p>': '<p>أنهِ TLS عند الوكيل الخاص بك. يمكن IDE العمل بدون TLS على localhost، لكن الوصول عن بعد يجب أن يستخدم HTTPS دائماً.</p>',
      '<li><a href="/docs/tunnels/">Tunnels</a></li>': '<li><a href="/docs/tunnels/">الأنفاق</a></li>',
      '<li><a href="/docs/security/">Security</a></li>': '<li><a href="/docs/security/">الأمان</a></li>',
    }
  },
  // --- scheduled-tasks ---
  {
    eng: 'docs\\scheduled-tasks\\index.html', ara: 'ar\\docs\\scheduled-tasks\\index.html', engPath: '/docs/scheduled-tasks/', araPath: '/ar/docs/scheduled-tasks/',
    titleAr: 'المهام المجدولة',
    metaAr: 'جدولة جلسات OpenCode متكررة لمراجعات الكود الآلية وإعادة الهيكلة والصيانة.',
    tocAr: '<li><a href="#scheduled-tasks">المهام المجدولة</a></li> <li><a href="#overview">نظرة عامة</a></li> <li><a href="#creating-a-task">إنشاء مهمة</a></li> <li><a href="#managing-tasks">إدارة المهام</a></li>',
    reps: {
      '<h1 id="scheduled-tasks">Scheduled Tasks</h1>': '<h1 id="scheduled-tasks">المهام المجدولة</h1>',
      '<p>Scheduled tasks let you run OpenCode sessions on a recurring basis \u2014 daily code reviews, weekly refactoring, or automated maintenance.</p>': '<p>تتيح لك المهام المجدولة تشغيل جلسات OpenCode بشكل متكرر — مراجعات الكود اليومية أو إعادة الهيكلة الأسبوعية أو الصيانة الآلية.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>Define a cron expression, select a project, and write a prompt. The IDE runs the task at the scheduled time and notifies you of the result.</p>': '<p>حدد تعبير cron واختر مشروعاً واكتب استعلاماً. يقوم IDE بتشغيل المهمة في الوقت المجدول ويخطرك بالنتيجة.</p>',
      '<h2 id="creating-a-task">Creating a Task</h2>': '<h2 id="creating-a-task">إنشاء مهمة</h2>',
      '<p>Go to <strong>Settings &gt; Scheduled Tasks</strong> and click <strong>New Task</strong>. Set the schedule, target project, and prompt. Optionally configure notifications on completion or failure.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; المهام المجدولة</strong> وانقر <strong>مهمة جديدة</strong>. عيّن الجدول الزمني والمشروع المستهدف والاستعلام. اختيارياً قم بتكوين الإشعارات عند الاكتمال أو الفشل.</p>',
      '<h2 id="managing-tasks">Managing Tasks</h2>': '<h2 id="managing-tasks">إدارة المهام</h2>',
      '<p>The task dashboard shows upcoming runs, history, and status. You can pause, edit, or delete tasks at any time. Failed tasks show logs for debugging.</p>': '<p>تعرض لوحة المهام التشغيلات القادمة والتاريخ والحالة. يمكنك إيقاف أو تعديل أو حذف المهام في أي وقت. تظهر المهام الفاشلة سجلات لتصحيح الأخطاء.</p>',
    }
  },
  // --- security ---
  {
    eng: 'docs\\security\\index.html', ara: 'ar\\docs\\security\\index.html', engPath: '/docs/security/', araPath: '/ar/docs/security/',
    titleAr: 'الأمان',
    metaAr: 'اعتبارات الأمان لتشغيل Limyrx Studio IDE، خاصة في البيئات البعيدة أو الجماعية.',
    tocAr: '<li><a href="#overview">نظرة عامة</a></li>\n<li><a href="#authentication">المصادقة</a></li>\n<li><a href="#best-practices">أفضل الممارسات</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="security">Security</h1>': '<h1 id="security">الأمان</h1>',
      '<p>Security considerations for running Limyrx Studio IDE, especially in remote or team environments.</p>': '<p>اعتبارات الأمان لتشغيل Limyrx Studio IDE، خاصة في البيئات البعيدة أو الجماعية.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>The IDE runs locally by default. When exposed via tunnels or proxy, you should configure authentication and encryption.</p>': '<p>يعمل IDE محلياً افتراضياً. عند التعريض عبر الأنفاق أو الوكيل، يجب تكوين المصادقة والتشفير.</p>',
      '<h2 id="authentication">Authentication</h2>': '<h2 id="authentication">المصادقة</h2>',
      '<p>Options include: password protection, OAuth (GitHub, Google), API tokens, and IP allowlisting.</p>': '<p>تشمل الخيارات: حماية بكلمة مرور و OAuth (GitHub, Google) ورموز API وقائمة IP المسموح بها.</p>',
      '<h2 id="best-practices">Best Practices</h2>': '<h2 id="best-practices">أفضل الممارسات</h2>',
      '<li>Always use HTTPS in production</li>': '<li>استخدم HTTPS دائماً في الإنتاج</li>',
      '<li>Enable authentication for tunnel access</li>': '<li>فعّل المصادقة للوصول عبر الأنفاق</li>',
      '<li>Rotate API keys regularly</li>': '<li>دور مفاتيح API بانتظام</li>',
      '<li>Review session logs for unauthorized access</li>': '<li>راجع سجلات الجلسات للوصول غير المصرح به</li>',
      '<li><a href="/docs/tunnels/">Tunnels</a></li>': '<li><a href="/docs/tunnels/">الأنفاق</a></li>',
      '<li><a href="/docs/reverse-proxy/">Reverse Proxy</a></li>': '<li><a href="/docs/reverse-proxy/">الوكيل العكسي</a></li>',
    }
  },
  // --- skills ---
  {
    eng: 'docs\\skills\\index.html', ara: 'ar\\docs\\skills\\index.html', engPath: '/docs/skills/', araPath: '/ar/docs/skills/',
    titleAr: 'المهارات',
    metaAr: 'علّم وكيل الذكاء الاصطناعي معرفة وسير عمل خاصة بالمجال باستخدام المهارات في Limyrx Studio IDE.',
    tocAr: '<li><a href="#skills">المهارات</a></li> <li><a href="#what-are-skills">ما هي المهارات؟</a></li> <li><a href="#writing-skills">كتابة المهارات</a></li> <li><a href="#managing-skills">إدارة المهارات</a></li>',
    reps: {
      '<h1 id="skills">Skills</h1>': '<h1 id="skills">المهارات</h1>',
      '<p>Skills teach the agent domain-specific knowledge and workflows. They are Markdown files that the agent reads before starting a task.</p>': '<p>تعلم المهارات الوكيل معرفة وسير عمل خاصة بالمجال. هي ملفات Markdown يقرؤها الوكيل قبل بدء مهمة.</p>',
      '<h2 id="what-are-skills">What Are Skills?</h2>': '<h2 id="what-are-skills">ما هي المهارات؟</h2>',
      '<p>A skill is a reusable instruction set written in Markdown. Skills can cover coding standards, architecture decisions, deployment procedures, or anything else the agent should know.</p>': '<p>المهارة هي مجموعة تعليمات قابلة لإعادة الاستخدام مكتوبة بـ Markdown. يمكن أن تغطي المهارات معايير البرمجة وقرارات الهندسة وإجراءات النشر أو أي شيء آخر يجب أن يعرفه الوكيل.</p>',
      '<h2 id="writing-skills">Writing Skills</h2>': '<h2 id="writing-skills">كتابة المهارات</h2>',
      '<p>Create a <code>.md</code> file in your project\'s <code>.opencode/skills/</code> directory. Use frontmatter for metadata:</p>': '<p>أنشئ ملف <code>.md</code> في دليل <code>.opencode/skills/</code> لمشروعك. استخدم frontmatter للبيانات الوصفية:</p>',
      '<h2 id="managing-skills">Managing Skills</h2>': '<h2 id="managing-skills">إدارة المهارات</h2>',
      '<p>Enable, disable, or reorder skills from the Skills panel in Settings. The agent loads enabled skills at session start.</p>': '<p>فعّل أو عطّل أو أعد ترتيب المهارات من لوحة المهارات في الإعدادات. يقوم الوكيل بتحميل المهارات المفعلة عند بدء الجلسة.</p>',
    }
  },
  // --- skills-catalog ---
  {
    eng: 'docs\\skills-catalog\\index.html', ara: 'ar\\docs\\skills-catalog\\index.html', engPath: '/docs/skills-catalog/', araPath: '/ar/docs/skills-catalog/',
    titleAr: 'كتالوج المهارات',
    metaAr: 'تصفح وثبّت المهارات المساهمة من المجتمع من كتالوج المهارات في Limyrx Studio IDE.',
    tocAr: '<li><a href="#skills-catalog">كتالوج المهارات</a></li> <li><a href="#community-catalog">كتالوج المجتمع</a></li> <li><a href="#installing-skills">تثبيت المهارات</a></li> <li><a href="#publishing-skills">نشر المهارات</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="skills-catalog">Skills Catalog</h1>': '<h1 id="skills-catalog">كتالوج المهارات</h1>',
      '<p>The Skills Catalog is a community repository of ready-to-use skills for popular frameworks and workflows.</p>': '<p>كتالوج المهارات هو مستودع مجتمعي لمهارات جاهزة للاستخدام لأطر العمل وسير العمل الشائعة.</p>',
      '<h2 id="community-catalog">Community Catalog</h2>': '<h2 id="community-catalog">كتالوج المجتمع</h2>',
      '<p>Browse skills contributed by the community covering React, Django, Rust, Docker, Kubernetes, and more.</p>': '<p>تصفح المهارات المساهمة من المجتمع والتي تغطي React وDjango وRust وDocker وKubernetes والمزيد.</p>',
      '<h2 id="installing-skills">Installing Skills</h2>': '<h2 id="installing-skills">تثبيت المهارات</h2>',
      '<p>From the catalog, click <strong>Install</strong> on any skill. It downloads to your project\'s <code>.opencode/skills/</code> directory and is immediately available.</p>': '<p>من الكتالوج، انقر <strong>تثبيت</strong> على أي مهارة. يتم تنزيلها إلى دليل <code>.opencode/skills/</code> لمشروعك وتكون متاحة فوراً.</p>',
      '<h2 id="publishing-skills">Publishing Skills</h2>': '<h2 id="publishing-skills">نشر المهارات</h2>',
      '<p>Share your own skills by submitting a PR to the skills catalog repository on GitHub.</p>': '<p>شارك مهاراتك الخاصة عن طريق تقديم PR إلى مستودع كتالوج المهارات على GitHub.</p>',
      '<li><a href="/docs/skills/">Skills</a></li>': '<li><a href="/docs/skills/">المهارات</a></li>',
    }
  },
  // --- ssh-hosts-proxying ---
  {
    eng: 'docs\\ssh-hosts-proxying\\index.html', ara: 'ar\\docs\\ssh-hosts-proxying\\index.html', engPath: '/docs/ssh-hosts-proxying/', araPath: '/ar/docs/ssh-hosts-proxying/',
    titleAr: 'مضيفات SSH والوكالة',
    metaAr: 'يتيح لك تكامل SSH الاتصال بالمضيفات البعيدة وتوكيل حركة المرور من خلالها.',
    tocAr: '<li><a href="#ssh-hosts">مضيفات SSH</a></li>\n<li><a href="#proxy-configuration">تكوين الوكيل</a></li>\n<li><a href="#key-management">إدارة المفاتيح</a></li>',
    reps: {
      '<h1 id="ssh-hosts">SSH Hosts</h1>': '<h1 id="ssh-hosts">مضيفات SSH</h1>',
      '<p>SSH integration lets you connect to remote hosts and proxy traffic through them.</p>': '<p>يتيح لك تكامل SSH الاتصال بالمضيفات البعيدة وتوكيل حركة المرور من خلالها.</p>',
      '<h2 id="ssh-hosts">SSH Hosts</h2>': '<h2 id="ssh-hosts">مضيفات SSH</h2>',
      '<p>Configure SSH hosts in Settings &gt; SSH. The IDE reads your <code>~/.ssh/config</code> and shows configured hosts in the connection panel.</p>': '<p>قم بتكوين مضيفات SSH في الإعدادات &gt; SSH. يقرأ IDE ملف <code>~/.ssh/config</code> الخاص بك ويعرض المضيفات المكونة في لوحة الاتصال.</p>',
      '<h2 id="proxy-configuration">Proxy Configuration</h2>': '<h2 id="proxy-configuration">تكوين الوكيل</h2>',
      '<p>Use SSH hosts as jump boxes for accessing private networks. The IDE sets up local port forwarding automatically.</p>': '<p>استخدم مضيفات SSH كصناديق قفز للوصول إلى الشبكات الخاصة. يقوم IDE بإعداد إعادة توجيه المنفذ المحلي تلقائياً.</p>',
      '<h2 id="key-management">Key Management</h2>': '<h2 id="key-management">إدارة المفاتيح</h2>',
      '<p>Add, remove, or generate SSH keys from Settings. The IDE supports ed25519 and RSA keys, optionally with passphrases stored in the OS keychain.</p>': '<p>أضف أو أزل أو أنشئ مفاتيح SSH من الإعدادات. يدعم IDE مفاتيح ed25519 وRSA، اختيارياً مع عبارات مرور مخزنة في سلسلة مفاتيح نظام التشغيل.</p>',
    }
  },
  // --- themes ---
  {
    eng: 'docs\\themes\\index.html', ara: 'ar\\docs\\themes\\index.html', engPath: '/docs/themes/', araPath: '/ar/docs/themes/',
    titleAr: 'السمات',
    metaAr: 'خصص مظهر Limyrx Studio IDE بسمات مدمجة ومخصصة.',
    tocAr: '<li><a href="#changing-themes">تغيير السمات</a></li>\n<li><a href="#custom-themes">سمات مخصصة</a></li>\n<li><a href="#theme-settings">إعدادات السمة</a></li>',
    reps: {
      '<h1 id="themes">Themes</h1>': '<h1 id="themes">السمات</h1>',
      '<p>Customize the appearance of Limyrx Studio IDE with built-in and custom themes.</p>': '<p>خصص مظهر Limyrx Studio IDE بسمات مدمجة ومخصصة.</p>',
      '<h2 id="changing-themes">Changing Themes</h2>': '<h2 id="changing-themes">تغيير السمات</h2>',
      '<p>Go to <strong>Settings &gt; Appearance</strong>. Choose from light, dark, or system-default mode. Select a color theme from the available list.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; المظهر</strong>. اختر من الوضع الفاتح أو الداكن أو النظام الافتراضي. اختر سمة ألوان من القائمة المتاحة.</p>',
      '<h2 id="custom-themes">Custom Themes</h2>': '<h2 id="custom-themes">سمات مخصصة</h2>',
      '<p>Themes are CSS files placed in <code>~/.limyrx/themes/</code>. They can override colors, fonts, spacing, and panel layout.</p>': '<p>السمات هي ملفات CSS توضع في <code>~/.limyrx/themes/</code>. يمكنها تجاوز الألوان والخطوط والتباعد وتخطيط اللوحات.</p>',
      '<h2 id="theme-settings">Theme Settings</h2>': '<h2 id="theme-settings">إعدادات السمة</h2>',
      '<p>Configure font size, font family, line height, and sidebar width in Settings. Changes apply immediately.</p>': '<p>قم بتكوين حجم الخط ونوع الخط وارتفاع السطر وعرض الشريط الجانبي في الإعدادات. تطبق التغييرات فوراً.</p>',
    }
  },
  // --- troubleshooting ---
  {
    eng: 'docs\\troubleshooting\\index.html', ara: 'ar\\docs\\troubleshooting\\index.html', engPath: '/docs/troubleshooting/', araPath: '/ar/docs/troubleshooting/',
    titleAr: 'استكشاف الأخطاء',
    metaAr: 'حلول للمشكلات الشائعة التي قد تواجهها مع Limyrx Studio IDE.',
    tocAr: '<li><a href="#common-issues">المشكلات الشائعة</a></li>\n<li><a href="#getting-help">الحصول على المساعدة</a></li>\n<li><a href="#debug-logs">سجلات التصحيح</a></li>',
    reps: {
      '<h1 id="troubleshooting">Troubleshooting</h1>': '<h1 id="troubleshooting">استكشاف الأخطاء</h1>',
      '<p>Solutions to common issues you might encounter with Limyrx Studio IDE.</p>': '<p>حلول للمشكلات الشائعة التي قد تواجهها مع Limyrx Studio IDE.</p>',
      '<h2 id="common-issues">Common Issues</h2>': '<h2 id="common-issues">المشكلات الشائعة</h2>',
      '<h3 id="ide-wont-start">IDE Won\'t Start</h3>': '<h3 id="ide-wont-start">IDE لا يعمل</h3>',
      '<p>Check that no other process is using port 8765. Try <code>npx limyrx-studio --port 8766</code>.</p>': '<p>تحقق من عدم استخدام عملية أخرى للمنفذ 8765. جرب <code>npx limyrx-studio --port 8766</code>.</p>',
      '<h3 id="connection-refused">Connection Refused</h3>': '<h3 id="connection-refused">رفض الاتصال</h3>',
      '<p>Ensure OpenCode Server is running. Start it with <code>opencode-server start</code>.</p>': '<p>تأكد من أن خادم OpenCode قيد التشغيل. ابدأه بـ <code>opencode-server start</code>.</p>',
      '<h3 id="tunnel-not-working">Tunnel Not Working</h3>': '<h3 id="tunnel-not-working">النفق لا يعمل</h3>',
      '<p>Check your firewall settings. The tunnel requires outbound WebSocket connectivity to <code>relay.limyrxstudio.dev</code>.</p>': '<p>تحقق من إعدادات جدار الحماية الخاص بك. يتطلب النفق اتصال WebSocket صادر إلى <code>relay.limyrxstudio.dev</code>.</p>',
      '<h2 id="getting-help">Getting Help</h2>': '<h2 id="getting-help">الحصول على المساعدة</h2>',
      '<p>If the troubleshooting guide doesn\'t solve your issue:</p>': '<p>إذا لم يحل دليل استكشاف الأخطاء مشكلتك:</p>',
      '<li>Search the <a href="https://discord.gg/ZYRSdnwwKA">Discord community</a></li>': '<li>ابحث في <a href="https://discord.gg/ZYRSdnwwKA">مجتمع Discord</a></li>',
      '<li>Open a <a href="https://github.com/limyrx/limyrx/issues/new/choose">GitHub issue</a></li>': '<li>افتح <a href="https://github.com/limyrx/limyrx/issues/new/choose">مشكلة GitHub</a></li>',
      '<h2 id="debug-logs">Debug Logs</h2>': '<h2 id="debug-logs">سجلات التصحيح</h2>',
      '<p>Enable debug logging in Settings &gt; Advanced. Logs are written to <code>~/.limyrx/logs/</code>.</p>': '<p>فعّل تسجيل التصحيح في الإعدادات &gt; متقدم. تُكتب السجلات إلى <code>~/.limyrx/logs/</code>.</p>',
    }
  },
  // --- updates ---
  {
    eng: 'docs\\updates\\index.html', ara: 'ar\\docs\\updates\\index.html', engPath: '/docs/updates/', araPath: '/ar/docs/updates/',
    titleAr: 'التحديثات',
    metaAr: 'حافظ على تحديث Limyrx Studio IDE بأحدث الميزات والإصلاحات.',
    tocAr: '<li><a href="#update-channels">قنوات التحديث</a></li>\n<li><a href="#auto-update">التحديث التلقائي</a></li>\n<li><a href="#manual-update">التحديث اليدوي</a></li>',
    reps: {
      '<h1 id="updates">Updates</h1>': '<h1 id="updates">التحديثات</h1>',
      '<p>Keep Limyrx Studio IDE up to date with the latest features and fixes.</p>': '<p>حافظ على تحديث Limyrx Studio IDE بأحدث الميزات والإصلاحات.</p>',
      '<h2 id="update-channels">Update Channels</h2>': '<h2 id="update-channels">قنوات التحديث</h2>',
      '<li><strong>Stable</strong> - thoroughly tested releases</li>': '<li><strong>مستقر</strong> - إصدارات مختبرة بدقة</li>',
      '<li><strong>Beta</strong> - upcoming features, less tested</li>': '<li><strong>بيتا</strong> - ميزات قادمة، أقل اختباراً</li>',
      '<li><strong>Nightly</strong> - latest builds, may be unstable</li>': '<li><strong>ليلي</strong> - أحدث البنيات، قد تكون غير مستقرة</li>',
      '<h2 id="auto-update">Auto-update</h2>': '<h2 id="auto-update">التحديث التلقائي</h2>',
      '<p>The desktop app checks for updates on startup and periodically while running. Updates download in the background and install on restart.</p>': '<p>يتحقق تطبيق سطح المكتب من التحديثات عند بدء التشغيل وبشكل دوري أثناء التشغيل. يتم تنزيل التحديثات في الخلفية وتثبيتها عند إعادة التشغيل.</p>',
      '<h2 id="manual-update">Manual Update</h2>': '<h2 id="manual-update">التحديث اليدوي</h2>',
      '<p>Check for updates via <strong>Help &gt; Check for Updates</strong>. Download the latest version from the <a href="/download">download page</a>.</p>': '<p>تحقق من التحديثات عبر <strong>مساعدة &gt; التحقق من التحديثات</strong>. قم بتنزيل أحدث إصدار من <a href="/download">صفحة التنزيل</a>.</p>',
    }
  },
  // --- usage ---
  {
    eng: 'docs\\usage\\index.html', ara: 'ar\\docs\\usage\\index.html', engPath: '/docs/usage/', araPath: '/ar/docs/usage/',
    titleAr: 'الاستخدام والحصص',
    metaAr: 'تتبع استخدام API وراقب التكاليف وحدد الحصص في Limyrx Studio IDE.',
    tocAr: '<li><a href="#usage-quotas">الاستخدام والحصص</a></li> <li><a href="#usage-tracking">تتبع الاستخدام</a></li> <li><a href="#api-quotas">حصص API</a></li> <li><a href="#cost-management">إدارة التكاليف</a></li> <li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="usage-quotas">Usage &amp; Quotas</h1>': '<h1 id="usage-quotas">الاستخدام والحصص</h1>',
      '<p>Track your API usage, monitor costs, and set quotas to stay within budget.</p>': '<p>تتبع استخدام API الخاص بك وراقب التكاليف وحدد الحصص للبقاء ضمن الميزانية.</p>',
      '<h2 id="usage-tracking">Usage Tracking</h2>': '<h2 id="usage-tracking">تتبع الاستخدام</h2>',
      '<p>The usage dashboard shows token consumption, API calls, and costs per provider, model, and project.</p>': '<p>تعرض لوحة الاستخدام استهلاك الرموز المميزة واستدعاءات API والتكاليف لكل مزود ونموذج ومشروع.</p>',
      '<h2 id="api-quotas">API Quotas</h2>': '<h2 id="api-quotas">حصص API</h2>',
      '<p>Set monthly token or cost limits per provider. The IDE warns you when you approach the limit and can pause sessions if exceeded.</p>': '<p>حدد حدود الرموز الشهرية أو التكاليف لكل مزود. يحذرك IDE عندما تقترب من الحد ويمكنه إيقاف الجلسات إذا تم تجاوزه.</p>',
      '<h2 id="cost-management">Cost Management</h2>': '<h2 id="cost-management">إدارة التكاليف</h2>',
      '<p>Configure cost-saving rules: use cheaper models for simple tasks, set max tokens per session, and cap daily spending.</p>': '<p>قم بتكوين قواعد توفير التكاليف: استخدم نماذج أرخص للمهام البسيطة، وحدد أقصى عدد من الرموز لكل جلسة، وحدد الإنفاق اليومي.</p>',
      '<li><a href="/docs/providers/">Providers, Models &amp; Agents</a></li>': '<li><a href="/docs/providers/">المزودون والنماذج والوكلاء</a></li>',
    }
  },
  // --- voice ---
  {
    eng: 'docs\\voice\\index.html', ara: 'ar\\docs\\voice\\index.html', engPath: '/docs/voice/', araPath: '/ar/docs/voice/',
    titleAr: 'وضع الصوت',
    metaAr: 'يتيح لك وضع الصوت التفاعل مع وكيل الذكاء الاصطناعي باستخدام الكلام.',
    tocAr: '<li><a href="#enabling-voice">تفعيل الصوت</a></li>\n<li><a href="#voice-commands">أوامر الصوت</a></li>\n<li><a href="#supported-languages">اللغات المدعومة</a></li>',
    reps: {
      '<h1 id="voice-mode">Voice Mode</h1>': '<h1 id="voice-mode">وضع الصوت</h1>',
      '<p>Voice mode lets you interact with the AI agent using speech.</p>': '<p>يتيح لك وضع الصوت التفاعل مع وكيل الذكاء الاصطناعي باستخدام الكلام.</p>',
      '<h2 id="enabling-voice">Enabling Voice</h2>': '<h2 id="enabling-voice">تفعيل الصوت</h2>',
      '<p>Click the microphone icon in the chat input, or press <code>Ctrl+Shift+V</code>. Grant microphone access when prompted.</p>': '<p>انقر على أيقونة الميكروفون في إدخال الدردشة، أو اضغط <code>Ctrl+Shift+V</code>. امنح إذن الوصول إلى الميكروفون عندما يُطلب منك.</p>',
      '<h2 id="voice-commands">Voice Commands</h2>': '<h2 id="voice-commands">أوامر الصوت</h2>',
      '<p>Speak naturally: "Add error handling to the login function" or "Run the tests and show me the results." The IDE transcribes and sends to the agent.</p>': '<p>تحدث بشكل طبيعي: "أضف معالجة الأخطاء إلى دالة تسجيل الدخول" أو "شغّل الاختبارات وأظهر لي النتائج." يقوم IDE بنسخ الصوت وإرساله إلى الوكيل.</p>',
      '<h2 id="supported-languages">Supported Languages</h2>': '<h2 id="supported-languages">اللغات المدعومة</h2>',
      '<p>Voice input supports English, Spanish, French, German, Japanese, and Chinese. Transcription language auto-detects or can be set manually.</p>': '<p>يدعم الإدخال الصوتي الإنجليزية والإسبانية والفرنسية والألمانية واليابانية والصينية. يتم اكتشاف لغة النسخ تلقائياً أو يمكن تعيينها يدوياً.</p>',
    }
  },
  // --- install ---
  {
    eng: 'docs\\install\\index.html',
    ara: 'ar\\docs\\install\\index.html',
    engPath: '/docs/install/',
    araPath: '/ar/docs/install/',
    titleAr: 'تثبيت',
    metaAr: 'ثبّت Limyrx Studio IDE على سطح المكتب أو الويب أو VS Code.',
    tocAr: '<li><a href="#install">تثبيت</a></li>\n<li><a href="#desktop-app">تطبيق سطح المكتب</a></li>\n<li><a href="#web-app">تطبيق الويب (PWA)</a></li>\n<li><a href="#vs-code-extension">إضافة VS Code</a></li>\n<li><a href="#next-steps">الخطوات التالية</a></li>',
    reps: {
      '<h1 id="install">Install</h1>': '<h1 id="install">تثبيت</h1>',
      '<p>Limyrx Studio IDE runs as a web app in your browser, as a desktop app for macOS and Windows, and as a VS Code extension. Pick the option that fits your workflow.</p>': '<p>يعمل Limyrx Studio IDE كتطبيق ويب في متصفحك، وكتطبيق سطح مكتب لأنظمة macOS وWindows، وكتوسعة لـ VS Code. اختر الخيار الذي يناسب سير عملك.</p>',
      '<h2 id="desktop-app">Desktop App</h2>': '<h2 id="desktop-app">تطبيق سطح المكتب</h2>',
      '<p>The desktop app bundles its own browser window with native OS integration. It supports menu bar controls, global shortcuts, dock/taskbar badges, and automatic updates.</p>': '<p>يضم تطبيق سطح المكتب نافذة متصفح خاصة به مع تكامل نظام التشغيل الأصلي. يدعم عناصر تحكم شريط القوائم والاختصارات العامة وشارات الإرساء/شريط المهام والتحديثات التلقائية.</p>',
      '<h3 id="macos">macOS</h3>': '<h3 id="macos">macOS</h3>', '<h3 id="windows">Windows</h3>': '<h3 id="windows">Windows</h3>', '<h3 id="linux">Linux</h3>': '<h3 id="linux">Linux</h3>',
      '<p>Or download the <code>.dmg</code> directly from the <a href="/download">download page</a> and drag to Applications.</p>': '<p>أو قم بتنزيل <code>.dmg</code> مباشرة من <a href="/download">صفحة التنزيل</a> واسحبه إلى مجلد التطبيقات.</p>',
      '<h2 id="web-app">Web App (PWA)</h2>': '<h2 id="web-app">تطبيق الويب (PWA)</h2>',
      '<p>Open <code>https://limyrxstudio.dev</code> in Chrome, Edge, or Safari and click the install icon in the address bar. This installs the IDE as a standalone PWA with its own window, offline support, and local file system access via the File System Access API.</p>': '<p>افتح <code>https://limyrxstudio.dev</code> في Chrome أو Edge أو Safari وانقر على أيقونة التثبيت في شريط العنوان. يقوم هذا بتثبيت IDE كـ PWA مستقل مع نافذته الخاصة ودعم عدم الاتصال والوصول إلى نظام الملفات المحلي عبر واجهة File System Access API.</p>',
      '<h2 id="vs-code-extension">VS Code Extension</h2>': '<h2 id="vs-code-extension">إضافة VS Code</h2>',
      '<p>Search for "Limyrx Studio IDE" in the VS Code extensions panel, or install via CLI:</p>': '<p>ابحث عن "Limyrx Studio IDE" في لوحة إضافات VS Code، أو ثبّت عبر CLI:</p>',
      '<h2 id="next-steps">Next Steps</h2>': '<h2 id="next-steps">الخطوات التالية</h2>',
      '<li><a href="/docs/quickstart/">Quickstart</a> - open your first project</li>': '<li><a href="/docs/quickstart/">بداية سريعة</a> - افتح مشروعك الأول</li>',
      '<li><a href="/docs/tunnels/">Tunnels</a> - access your IDE remotely</li>': '<li><a href="/docs/tunnels/">أنفاق</a> - الوصول إلى IDE عن بعد</li>',
      '<li><a href="/docs/opencode-server/">OpenCode Server</a> - set up the AI agent backend</li>': '<li><a href="/docs/opencode-server/">خادم OpenCode</a> - إعداد الخلفية للوكيل AI</li>',
    }
  },
  // --- quickstart ---
  {
    eng: 'docs\\quickstart\\index.html', ara: 'ar\\docs\\quickstart\\index.html', engPath: '/docs/quickstart/', araPath: '/ar/docs/quickstart/',
    titleAr: 'بداية سريعة', metaAr: 'ابدأ مع Limyrx Studio IDE في دقائق.',
    tocAr: '<li><a href="#quickstart">بداية سريعة</a></li>\n<li><a href="#prerequisites">المتطلبات الأساسية</a></li>\n<li><a href="#step-1-start-the-ide">الخطوة 1: تشغيل IDE</a></li>\n<li><a href="#step-2-configure-a-provider">الخطوة 2: إعداد مزود</a></li>\n<li><a href="#step-3-open-a-project">الخطوة 3: فتح مشروع</a></li>\n<li><a href="#step-4-start-a-session">الخطوة 4: بدء جلسة</a></li>\n<li><a href="#step-5-review-and-commit">الخطوة 5: مراجعة وإيداع</a></li>\n<li><a href="#next-steps">الخطوات التالية</a></li>',
    reps: {
      '<h1 id="quickstart">Quickstart</h1>': '<h1 id="quickstart">بداية سريعة</h1>',
      '<p>This guide gets Limyrx Studio IDE running end-to-end with OpenCode in about 5 minutes.</p>': '<p>هذا الدليل يشغّل Limyrx Studio IDE بشكل كامل مع OpenCode في حوالي 5 دقائق.</p>',
      '<h2 id="prerequisites">Prerequisites</h2>': '<h2 id="prerequisites">المتطلبات الأساسية</h2>',
      '<li><a href="/docs/install/">Install</a> Limyrx Studio IDE (any platform)</li>': '<li><a href="/docs/install/">تثبيت</a> Limyrx Studio IDE (أي منصة)</li>',
      '<li>OpenCode (TBA) installed in your terminal</li>': '<li>OpenCode (TBA) مثبت في الطرفية الخاصة بك</li>',
      '<li>An API key from Anthropic, OpenAI, or another supported provider</li>': '<li>مفتاح API من Anthropic أو OpenAI أو أي مزود مدعوم آخر</li>',
      '<h2 id="step-1-start-the-ide">Step 1: Start the IDE</h2>': '<h2 id="step-1-start-the-ide">الخطوة 1: تشغيل IDE</h2>',
      '<p>Launch Limyrx Studio IDE from your desktop dock, or open a terminal and run:</p>': '<p>شغّل Limyrx Studio IDE من شريط سطح المكتب، أو افتح طرفية وشغّل:</p>',
      '<p>The IDE opens to your projects dashboard. If OpenCode Server is running locally, it connects automatically.</p>': '<p>يفتح IDE إلى لوحة المشاريع الخاصة بك. إذا كان خادم OpenCode يعمل محلياً، فإنه يتصل تلقائياً.</p>',
      '<h2 id="step-2-configure-a-provider">Step 2: Configure a Provider</h2>': '<h2 id="step-2-configure-a-provider">الخطوة 2: إعداد مزود</h2>',
      '<p>Navigate to <strong>Settings &gt; Providers</strong> and add your API key. Supported providers include Anthropic, OpenAI, Google Gemini, AWS Bedrock, and others. See <a href="/docs/providers/">Providers, Models &amp; Agents</a> for the full list.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; المزودون</strong> وأضف مفتاح API الخاص بك. المزودون المدعومون يشملون Anthropic وOpenAI وGoogle Gemini وAWS Bedrock وغيرهم. راجع <a href="/docs/providers/">المزودون والنماذج والوكلاء</a> للقائمة الكاملة.</p>',
      '<h2 id="step-3-open-a-project">Step 3: Open a Project</h2>': '<h2 id="step-3-open-a-project">الخطوة 3: فتح مشروع</h2>',
      '<p>Click <strong>Open Folder</strong> and select a local directory. The IDE scans your project structure, picks up any existing OpenCode config, and loads the file tree into the sidebar.</p>': '<p>انقر <strong>فتح مجلد</strong> واختر دليلاً محلياً. يقوم IDE بفحص هيكل مشروعك، ويلتقط أي إعدادات OpenCode موجودة، ويحمّل شجرة الملفات إلى الشريط الجانبي.</p>',
      '<h2 id="step-4-start-a-session">Step 4: Start a Session</h2>': '<h2 id="step-4-start-a-session">الخطوة 4: بدء جلسة</h2>',
      '<p>Type a task in the chat input and press Enter. The agent starts working \u2014 you\u2019ll see its reasoning, tool calls, file edits, and terminal commands stream into the session panel in real time.</p>': '<p>اكتب مهمة في إدخال الدردشة واضغط Enter. يبدأ الوكيل في العمل \u2014 سترى تفكيره واستدعاءات الأدوات وتعديلات الملفات وأوامر الطرفية تتدفق إلى لوحة الجلسة في الوقت الفعلي.</p>',
      '<h2 id="step-5-review-and-commit">Step 5: Review and Commit</h2>': '<h2 id="step-5-review-and-commit">الخطوة 5: مراجعة وإيداع</h2>',
      '<p>When the agent finishes, review the diff in the changes panel. Stage files, write a commit message, and push to GitHub \u2014 all from within the IDE. See <a href="/docs/git/">Git &amp; GitHub</a> for details.</p>': '<p>عندما ينتهي الوكيل، راجع الفروقات في لوحة التغييرات. جهّز الملفات واكتب رسالة الإيداع وادفع إلى GitHub \u2014 كل ذلك من داخل IDE. راجع <a href="/docs/git/">Git وGitHub</a> للتفاصيل.</p>',
      '<li><a href="/docs/projects/">Projects</a> - organize your work</li>': '<li><a href="/docs/projects/">المشاريع</a> - نظّم عملك</li>',
      '<li><a href="/docs/tunnels/">Tunnels</a> - access remotely</li>': '<li><a href="/docs/tunnels/">الأنفاق</a> - الوصول عن بعد</li>',
      '<li><a href="/docs/themes/">Themes</a> - customize the look</li>': '<li><a href="/docs/themes/">السمات</a> - تخصيص المظهر</li>',
    }
  },
  // --- projects ---
  {
    eng: 'docs\\projects\\index.html', ara: 'ar\\docs\\projects\\index.html', engPath: '/docs/projects/', araPath: '/ar/docs/projects/',
    titleAr: 'المشاريع', metaAr: 'إدارة المشاريع في Limyrx Studio IDE.',
    tocAr: '<li><a href="#projects">المشاريع</a></li>\n<li><a href="#opening-a-project">فتح مشروع</a></li>\n<li><a href="#recent-projects">المشاريع الأخيرة</a></li>\n<li><a href="#project-settings">إعدادات المشروع</a></li>\n<li><a href="#multi-root-workspaces">مساحات العمل متعددة الجذور</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="projects">Projects</h1>': '<h1 id="projects">المشاريع</h1>',
      '<p>Projects are the central unit of work in Limyrx Studio IDE. A project is a directory on your filesystem that contains source code, configuration, and any OpenCode-related files.</p>': '<p>المشاريع هي الوحدة المركزية للعمل في Limyrx Studio IDE. المشروع هو دليل على نظام الملفات الخاص بك يحتوي على الكود المصدري والتكوين وأي ملفات متعلقة بـ OpenCode.</p>',
      '<h2 id="opening-a-project">Opening a Project</h2>': '<h2 id="opening-a-project">فتح مشروع</h2>',
      '<p>From the dashboard, click <strong>Open Folder</strong> or use <code>Ctrl+O</code> (<code>Cmd+O</code> on macOS). Navigate to the directory and select it. The IDE loads the file tree, detects git repos, and scans for OpenCode configuration files.</p>': '<p>من لوحة التحكم، انقر <strong>فتح مجلد</strong> أو استخدم <code>Ctrl+O</code> (<code>Cmd+O</code> على macOS). انتقل إلى الدليل واختره. يقوم IDE بتحميل شجرة الملفات واكتشاف مستودعات git وفحص ملفات تكوين OpenCode.</p>',
      '<h2 id="recent-projects">Recent Projects</h2>': '<h2 id="recent-projects">المشاريع الأخيرة</h2>',
      '<p>The dashboard shows your recent projects with timestamps. Click any project to reopen it. You can pin frequently used projects to keep them at the top of the list.</p>': '<p>تعرض لوحة التحكم مشاريعك الأخيرة مع أختام زمنية. انقر على أي مشروع لإعادة فتحه. يمكنك تثبيت المشاريع المستخدمة بشكل متكرر لإبقائها في أعلى القائمة.</p>',
      '<h2 id="project-settings">Project Settings</h2>': '<h2 id="project-settings">إعدادات المشروع</h2>',
      '<p>Each project has its own settings panel where you can configure:</p>': '<p>لكل مشروع لوحة إعدادات خاصة به حيث يمكنك تكوين:</p>',
      '<li><strong>Provider &amp; Model</strong> - override the global model for this project</li>': '<li><strong>المزود والنموذج</strong> - تجاوز النموذج العام لهذا المشروع</li>',
      '<li><strong>OpenCode Config</strong> - path to <code>.opencode.jsonc</code> or equivalent</li>': '<li><strong>تكوين OpenCode</strong> - المسار إلى <code>.opencode.jsonc</code> أو ما يعادله</li>',
      '<li><strong>Project Actions</strong> - define custom scripts accessible in the IDE</li>': '<li><strong>إجراءات المشروع</strong> - تعريف نصوص برمجية مخصصة يمكن الوصول إليها في IDE</li>',
      '<li><strong>Environment</strong> - per-project environment variables</li>': '<li><strong>البيئة</strong> - متغيرات بيئة لكل مشروع</li>',
      '<h2 id="multi-root-workspaces">Multi-root Workspaces</h2>': '<h2 id="multi-root-workspaces">مساحات العمل متعددة الجذور</h2>',
      '<p>Limyrx Studio IDE supports multi-root workspaces. Open multiple projects simultaneously and switch between them from the sidebar. Each project maintains its own session history and settings.</p>': '<p>يدعم Limyrx Studio IDE مساحات العمل متعددة الجذور. افتح مشاريع متعددة في وقت واحد وتبديل بينها من الشريط الجانبي. يحتفظ كل مشروع بسجل جلساته وإعداداته الخاصة.</p>',
      '<h2 id="see-also">See Also</h2>': '<h2 id="see-also">انظر أيضاً</h2>',
      '<li><a href="/docs/worktrees/">Worktree Sessions</a> - isolated parallel work</li>': '<li><a href="/docs/worktrees/">جلسات Worktree</a> - عمل متوازٍ معزول</li>',
      '<li><a href="/docs/project-actions/">Project Actions</a> - custom automation</li>': '<li><a href="/docs/project-actions/">إجراءات المشروع</a> - أتمتة مخصصة</li>',
      '<li><a href="/docs/git/">Git &amp; GitHub</a> - version control</li>': '<li><a href="/docs/git/">Git وGitHub</a> - التحكم في الإصدارات</li>',
    }
  },
  // --- tunnels ---
  {
    eng: 'docs\\tunnels\\index.html', ara: 'ar\\docs\\tunnels\\index.html', engPath: '/docs/tunnels/', araPath: '/ar/docs/tunnels/',
    titleAr: 'الأنفاق',
    metaAr: 'تتيح لك الأنفاق الوصول إلى مثيل Limyrx Studio IDE الخاص بك من أي مكان، حتى خلف NAT أو جدران الحماية.',
    tocAr: '<li><a href="#how-tunnels-work">كيف تعمل الأنفاق</a></li>\n<li><a href="#creating-a-tunnel">إنشاء نفق</a></li>\n<li><a href="#tunnel-security">أمان الأنفاق</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="tunnels">Tunnels</h1>': '<h1 id="tunnels">الأنفاق</h1>',
      '<p>Tunnels let you access your Limyrx Studio IDE instance from anywhere, even behind NAT or firewalls.</p>': '<p>تتيح لك الأنفاق الوصول إلى مثيل Limyrx Studio IDE الخاص بك من أي مكان، حتى خلف NAT أو جدران الحماية.</p>',
      '<h2 id="how-tunnels-work">How Tunnels Work</h2>': '<h2 id="how-tunnels-work">كيف تعمل الأنفاق</h2>',
      '<p>The desktop app or server creates an outbound WebSocket connection to the relay server, which assigns a public URL. Traffic is encrypted end-to-end.</p>': '<p>يقوم تطبيق سطح المكتب أو الخادم بإنشاء اتصال WebSocket صادر إلى خادم الترحيل، الذي يعيّن عنوان URL عام. حركة المرور مشفرة من النهاية إلى النهاية.</p>',
      '<h2 id="creating-a-tunnel">Creating a Tunnel</h2>': '<h2 id="creating-a-tunnel">إنشاء نفق</h2>',
      '<p>Click <strong>Tunnel</strong> in the status bar. Give it a name and the IDE generates a URL like <code>https://my-project.tunnel.limyrxstudio.dev</code>.</p>': '<p>انقر <strong>نفق</strong> في شريط الحالة. أعطه اسماً ويقوم IDE بإنشاء URL مثل <code>https://my-project.tunnel.limyrxstudio.dev</code>.</p>',
      '<h2 id="tunnel-security">Tunnel Security</h2>': '<h2 id="tunnel-security">أمان الأنفاق</h2>',
      '<p>Tunnels are password-protected by default. You can also restrict access by IP, require OAuth, or disable tunnels entirely in Settings.</p>': '<p>الأنفاق محمية بكلمة مرور افتراضياً. يمكنك أيضاً تقييد الوصول حسب IP أو طلب OAuth أو تعطيل الأنفاق بالكامل في الإعدادات.</p>',
      '<h2 id="see-also">See Also</h2>': '<h2 id="see-also">انظر أيضاً</h2>',
      '<li><a href="/docs/reverse-proxy/">Reverse Proxy</a></li>': '<li><a href="/docs/reverse-proxy/">الوكيل العكسي</a></li>',
      '<li><a href="/docs/security/">Security</a></li>': '<li><a href="/docs/security/">الأمان</a></li>',
      '<li><a href="/docs/desktop-tunnels/">Desktop Tunnels</a></li>': '<li><a href="/docs/desktop-tunnels/">أنفاق سطح المكتب</a></li>',
    }
  },
  // --- desktop-tunnels ---
  {
    eng: 'docs\\desktop-tunnels\\index.html', ara: 'ar\\docs\\desktop-tunnels\\index.html', engPath: '/docs/desktop-tunnels/', araPath: '/ar/docs/desktop-tunnels/',
    titleAr: 'أنفاق سطح المكتب',
    metaAr: 'تتيح لك أنفاق سطح المكتب مشاركة الوصول إلى مثيل IDE المحلي الخاص بك من خلال تطبيق سطح المكتب دون خادم منفصل.',
    tocAr: '<li><a href="#overview">نظرة عامة</a></li>\n<li><a href="#setup">الإعداد</a></li>\n<li><a href="#advanced-options">خيارات متقدمة</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="desktop-tunnels">Desktop Tunnels</h1>': '<h1 id="desktop-tunnels">أنفاق سطح المكتب</h1>',
      '<p>Desktop tunnels let you share access to your local IDE instance through the desktop app without a separate server.</p>': '<p>تتيح لك أنفاق سطح المكتب مشاركة الوصول إلى مثيل IDE المحلي الخاص بك من خلال تطبيق سطح المكتب دون خادم منفصل.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>The desktop app can act as a tunnel endpoint, creating a secure outbound connection to the relay service.</p>': '<p>يمكن لتطبيق سطح المكتب العمل كنقطة نهاية للنفق، وإنشاء اتصال آمن صادر إلى خدمة الترحيل.</p>',
      '<h2 id="setup">Setup</h2>': '<h2 id="setup">الإعداد</h2>',
      '<p>Click the tunnel icon in the desktop app status bar. Configure the tunnel name and authentication. Share the generated URL with collaborators.</p>': '<p>انقر على أيقونة النفق في شريط حالة تطبيق سطح المكتب. قم بتكوين اسم النفق والمصادقة. شارك URL المُنشأ مع المتعاونين.</p>',
      '<h2 id="advanced-options">Advanced Options</h2>': '<h2 id="advanced-options">خيارات متقدمة</h2>',
      '<p>Set custom subdomains, configure idle timeouts, and restrict access to specific paths or features.</p>': '<p>عيّن نطاقات فرعية مخصصة، وقم بتكوين مهلات الخمول، وتقييد الوصول إلى مسارات أو ميزات محددة.</p>',
      '<h2 id="see-also">See Also</h2>': '<h2 id="see-also">انظر أيضاً</h2>',
      '<li><a href="/docs/tunnels/">Tunnels</a></li>': '<li><a href="/docs/tunnels/">الأنفاق</a></li>',
      '<li><a href="/docs/remote-instances/">Remote Instances</a></li>': '<li><a href="/docs/remote-instances/">المثيلات البعيدة</a></li>',
    }
  },
  // --- context ---
  {
    eng: 'docs\\context\\index.html', ara: 'ar\\docs\\context\\index.html', engPath: '/docs/context/', araPath: '/ar/docs/context/',
    titleAr: 'السياق',
    metaAr: 'إدارة السياق في Limyrx Studio IDE.',
    tocAr: '<li><a href="#context">السياق</a></li>\n<li><a href="#how-context-works">كيف يعمل السياق</a></li>\n<li><a href="#the-context-panel">لوحة السياق</a></li>\n<li><a href="#context-configuration">تكوين السياق</a></li>\n<li><a href="#relevance-scoring">تسجيل الأهمية</a></li>\n<li><a href="#see-also">انظر أيضاً</a></li>',
    reps: {
      '<h1 id="context">Context</h1>': '<h1 id="context">السياق</h1>',
      '<p>Context is the information the AI agent uses to understand your codebase and task. Limyrx Studio IDE provides a dedicated interface for viewing and managing context in real time.</p>': '<p>السياق هو المعلومات التي يستخدمها الوكيل AI لفهم قاعدة الشيفرة والمهمة الخاصة بك. يوفر Limyrx Studio IDE واجهة مخصصة لعرض وإدارة السياق في الوقت الفعلي.</p>',
      '<h2 id="how-context-works">How Context Works</h2>': '<h2 id="how-context-works">كيف يعمل السياق</h2>',
      '<p>When you start a session, the agent collects context from multiple sources:</p>': '<p>عند بدء جلسة، يجمع الوكيل السياق من مصادر متعددة:</p>',
      '<li><strong>Project files</strong> - the file tree and its structure</li>': '<li><strong>ملفات المشروع</strong> - شجرة الملفات وهيكلها</li>',
      '<li><strong>OpenCode config</strong> - rules, instructions, and preferences</li>': '<li><strong>تكوين OpenCode</strong> - القواعد والتعليمات والتفضيلات</li>',
      '<li><strong>Terminal output</strong> - command results and logs</li>': '<li><strong>مخرجات الطرفية</strong> - نتائج الأوامر والسجلات</li>',
      '<li><strong>Your prompt</strong> - the task description you provide</li>': '<li><strong>طلبك</strong> - وصف المهمة الذي تقدمه</li>',
      '<li><strong>Session history</strong> - previous turns in the current session</li>': '<li><strong>سجل الجلسة</strong> - الأدوار السابقة في الجلسة الحالية</li>',
      '<h2 id="the-context-panel">The Context Panel</h2>': '<h2 id="the-context-panel">لوحة السياق</h2>',
      '<p>Open the context panel from the sidebar to see what the agent is currently reading. Files are listed with their relevance score. You can:</p>': '<p>افتح لوحة السياق من الشريط الجانبي لترى ما يقرؤه الوكيل حالياً. الملفات مدرجة مع درجة أهميتها. يمكنك:</p>',
      '<li><strong>Pin</strong> files to keep them in context</li>': '<li><strong>تثبيت</strong> الملفات لإبقائها في السياق</li>',
      '<li><strong>Exclude</strong> files you don\'t want the agent to see</li>': '<li><strong>استبعاد</strong> الملفات التي لا تريد أن يراها الوكيل</li>',
      '<li><strong>Refresh</strong> context when files change externally</li>': '<li><strong>تحديث</strong> السياق عندما تتغير الملفات خارجياً</li>',
      '<h2 id="context-configuration">Context Configuration</h2>': '<h2 id="context-configuration">تكوين السياق</h2>',
      '<p>In your <code>.opencode.jsonc</code>, you can configure:</p>': '<p>في <code>.opencode.jsonc</code> الخاص بك، يمكنك تكوين:</p>',
      '<h2 id="relevance-scoring">Relevance Scoring</h2>': '<h2 id="relevance-scoring">تسجيل الأهمية</h2>',
      '<p>The agent scores each file for relevance to your current task. Files with higher scores stay in context longer. This helps manage token usage by prioritizing the most important information.</p>': '<p>يقوم الوكيل بتسجيل كل ملف حسب أهميته لمهمتك الحالية. الملفات ذات الدرجات الأعلى تبقى في السياق لفترة أطول. يساعد هذا في إدارة استخدام الرموز المميزة من خلال إعطاء الأولوية للمعلومات الأكثر أهمية.</p>',
      '<li><a href="/docs/projects/">Projects</a> - project-level settings</li>': '<li><a href="/docs/projects/">المشاريع</a> - إعدادات على مستوى المشروع</li>',
      '<li><a href="/docs/providers/">Providers, Models &amp; Agents</a> - model context limits</li>': '<li><a href="/docs/providers/">المزودون والنماذج والوكلاء</a> - حدود سياق النموذج</li>',
      '<li><a href="/docs/usage/">Usage &amp; Quotas</a> - token tracking</li>': '<li><a href="/docs/usage/">الاستخدام والحصص</a> - تتبع الرموز المميزة</li>',
    }
  },
  // --- environment ---
  {
    eng: 'docs\\environment\\index.html', ara: 'ar\\docs\\environment\\index.html', engPath: '/docs/environment/', araPath: '/ar/docs/environment/',
    titleAr: 'متغيرات البيئة',
    metaAr: 'مرجع لمتغيرات البيئة المستخدمة من قبل Limyrx Studio IDE وخادم OpenCode.',
    tocAr: '<li><a href="#environment-variables">متغيرات البيئة</a></li>\n<li><a href="#project-level-variables">متغيرات على مستوى المشروع</a></li>',
    reps: {
      '<h1 id="environment-variables">Environment Variables</h1>': '<h1 id="environment-variables">متغيرات البيئة</h1>',
      '<p>Limyrx Studio IDE and OpenCode Server use environment variables for configuration. These can be set system-wide, in a <code>.env</code> file, or in your project settings.</p>': '<p>يستخدم Limyrx Studio IDE وخادم OpenCode متغيرات البيئة للتكوين. يمكن تعيينها على مستوى النظام، أو في ملف <code>.env</code>، أو في إعدادات مشروعك.</p>',
      '<th>Variable</th><th>Description</th><th>Default</th>': '<th>المتغير</th><th>الوصف</th><th>الافتراضي</th>',
      '<td>Default API key for the configured provider</td>': '<td>مفتاح API الافتراضي للمزود المُكوّن</td>',
      '<td>Port for the OpenCode server</td>': '<td>منفذ خادم OpenCode</td>',
      '<td>Host address to bind to</td>': '<td>عنوان المضيف للربط</td>',
      '<td>Data directory for state and config</td>': '<td>دليل البيانات للحالة والتكوين</td>',
      '<h2 id="project-level-variables">Project-level Variables</h2>': '<h2 id="project-level-variables">متغيرات على مستوى المشروع</h2>',
      '<p>Set per-project environment variables in the project settings panel or in <code>.opencode.jsonc</code>.</p>': '<p>عيِّن متغيرات بيئة لكل مشروع في لوحة إعدادات المشروع أو في <code>.opencode.jsonc</code>.</p>',
    }
  },
  // --- git-identities ---
  {
    eng: 'docs\\git-identities\\index.html', ara: 'ar\\docs\\git-identities\\index.html', engPath: '/docs/git-identities/', araPath: '/ar/docs/git-identities/',
    titleAr: 'هويات Git',
    metaAr: 'إدارة هويات Git متعددة لمشاريع مختلفة في Limyrx Studio IDE.',
    tocAr: '<li><a href="#git-identities">هويات Git</a></li>\n<li><a href="#overview">نظرة عامة</a></li>\n<li><a href="#configuring-identities">تكوين الهويات</a></li>\n<li><a href="#per-project-identity">هوية لكل مشروع</a></li>',
    reps: {
      '<h1 id="git-identities">Git Identities</h1>': '<h1 id="git-identities">هويات Git</h1>',
      '<p>Git Identities let you use different git author information for different projects - useful when you work on both personal and professional repositories.</p>': '<p>تتيح لك هويات Git استخدام معلومات مؤلف Git مختلفة لمشاريع مختلفة - مفيدة عندما تعمل على مستودعات شخصية ومهنية معاً.</p>',
      '<h2 id="overview">Overview</h2>': '<h2 id="overview">نظرة عامة</h2>',
      '<p>Each identity includes name, email, and optional signing key. The IDE automatically picks the right identity based on the project or repository.</p>': '<p>تتضمن كل هوية الاسم والبريد الإلكتروني ومفتاح التوقيع الاختياري. يقوم IDE تلقائياً باختيار الهوية الصحيحة بناءً على المشروع أو المستودع.</p>',
      '<h2 id="configuring-identities">Configuring Identities</h2>': '<h2 id="configuring-identities">تكوين الهويات</h2>',
      '<p>Go to <strong>Settings &gt; Git &gt; Identities</strong> and add identities. Set one as default and override per project as needed.</p>': '<p>انتقل إلى <strong>الإعدادات &gt; Git &gt; الهويات</strong> وأضف هويات. عيّن واحدة كافتراضية وقم بالتجاوز لكل مشروع حسب الحاجة.</p>',
      '<h2 id="per-project-identity">Per-project Identity</h2>': '<h2 id="per-project-identity">هوية لكل مشروع</h2>',
      '<p>In project settings, select which identity to use. You can also configure this in <code>.opencode.jsonc</code> under the <code>git.identity</code> key.</p>': '<p>في إعدادات المشروع، اختر الهوية التي تريد استخدامها. يمكنك أيضاً تكوين هذا في <code>.opencode.jsonc</code> تحت مفتاح <code>git.identity</code>.</p>',
    }
  },
  // --- project-actions ---
  {
    eng: 'docs\\project-actions\\index.html', ara: 'ar\\docs\\project-actions\\index.html', engPath: '/docs/project-actions/', araPath: '/ar/docs/project-actions/',
    titleAr: 'إجراءات المشروع',
    metaAr: 'تعريف وتشغيل إجراءات مشروع مخصصة في Limyrx Studio IDE لأتمتة المهام الشائعة.',
    tocAr: '<li><a href="#project-actions">إجراءات المشروع</a></li>\n<li><a href="#what-are-project-actions">ما هي إجراءات المشروع؟</a></li>\n<li><a href="#defining-actions">تعريف الإجراءات</a></li>\n<li><a href="#running-actions">تشغيل الإجراءات</a></li>',
    reps: {
      '<h1 id="project-actions">Project Actions</h1>': '<h1 id="project-actions">إجراءات المشروع</h1>',
      '<p>Project Actions are custom scripts that appear in the IDE\'s action menu. They let you automate common tasks without leaving the interface.</p>': '<p>إجراءات المشروع هي نصوص برمجية مخصصة تظهر في قائمة إجراءات IDE. تتيح لك أتمتة المهام الشائعة دون مغادرة الواجهة.</p>',
      '<h2 id="what-are-project-actions">What Are Project Actions?</h2>': '<h2 id="what-are-project-actions">ما هي إجراءات المشروع؟</h2>',
      '<p>Actions are defined in your project\'s configuration and can run shell commands, OpenCode sessions, or composite workflows.</p>': '<p>يتم تعريف الإجراءات في تكوين مشروعك ويمكنها تشغيل أوامر شل أو جلسات OpenCode أو سير عمل مركبة.</p>',
      '<h2 id="defining-actions">Defining Actions</h2>': '<h2 id="defining-actions">تعريف الإجراءات</h2>',
      '<p>In <code>.opencode.jsonc</code>:</p>': '<p>في <code>.opencode.jsonc</code>:</p>',
      '<h2 id="running-actions">Running Actions</h2>': '<h2 id="running-actions">تشغيل الإجراءات</h2>',
      '<p>Click the actions button in the toolbar, or use the command palette (<code>Ctrl+Shift+P</code>) and type the action name. Output streams into the terminal panel.</p>': '<p>انقر على زر الإجراءات في شريط الأدوات، أو استخدم لوحة الأوامر (<code>Ctrl+Shift+P</code>) واكتب اسم الإجراء. تتدفق المخرجات إلى لوحة الطرفية.</p>',
    }
  },
  // --- desktop-browser ---
  {
    eng: 'docs\\desktop-browser\\index.html', ara: 'ar\\docs\\desktop-browser\\index.html', engPath: '/docs/desktop-browser/', araPath: '/ar/docs/desktop-browser/',
    titleAr: 'متصفح سطح المكتب',
    metaAr: 'يتضمن تطبيق سطح المكتب متصفح ويب مدمج لمعاينة عملك دون مغادرة IDE.',
    tocAr: '<li><a href="#built-in-browser">المتصفح المدمج</a></li>\n<li><a href="#developer-tools">أدوات المطور</a></li>\n<li><a href="#session-management">إدارة الجلسات</a></li>',
    reps: {
      '<h1 id="desktop-browser">Desktop Browser</h1>': '<h1 id="desktop-browser">متصفح سطح المكتب</h1>',
      '<p>The desktop app includes a built-in web browser for previewing your work without leaving the IDE.</p>': '<p>يتضمن تطبيق سطح المكتب متصفح ويب مدمج لمعاينة عملك دون مغادرة IDE.</p>',
      '<h2 id="built-in-browser">Built-in Browser</h2>': '<h2 id="built-in-browser">المتصفح المدمج</h2>',
      '<p>Open a browser panel from the toolbar. It renders web pages with full DevTools support. Use it to preview your app, test changes, or browse documentation.</p>': '<p>افتح لوحة المتصفح من شريط الأدوات. يعرض صفحات الويب مع دعم كامل لأدوات المطور. استخدمه لمعاينة تطبيقك أو اختبار التغييرات أو تصفح الوثائق.</p>',
      '<h2 id="developer-tools">Developer Tools</h2>': '<h2 id="developer-tools">أدوات المطور</h2>',
      '<p>The browser panel includes Chrome DevTools (Elements, Console, Network, Sources) for debugging.</p>': '<p>تتضمن لوحة المتصفح أدوات مطور Chrome (Elements وConsole وNetwork وSources) لتصحيح الأخطاء.</p>',
      '<h2 id="session-management">Session Management</h2>': '<h2 id="session-management">إدارة الجلسات</h2>',
      '<p>Browser tabs persist across IDE sessions. You can bookmark pages and sync them with your Limyrx account.</p>': '<p>تستمر علامات تبويب المتصفح عبر جلسات IDE. يمكنك وضع إشارة مرجعية للصفحات ومزامنتها مع حساب Limyrx الخاص بك.</p>',
    }
  },
  // --- worktrees ---
  {
    eng: 'docs\\worktrees\\index.html', ara: 'ar\\docs\\worktrees\\index.html', engPath: '/docs/worktrees/', araPath: '/ar/docs/worktrees/',
    titleAr: 'جلسات Worktree',
    metaAr: 'تشغيل جلسات OpenCode متوازية متعددة في worktrees git معزولة باستخدام Limyrx Studio IDE.',
    tocAr: '<li><a href="#worktree-sessions">جلسات Worktree</a></li>\n<li><a href="#what-are-worktrees">ما هي Worktrees؟</a></li>\n<li><a href="#creating-a-worktree">إنشاء Worktree</a></li>\n<li><a href="#switching-between-worktrees">التبديل بين Worktrees</a></li>',
    reps: {
      '<h1 id="worktree-sessions">Worktree Sessions</h1>': '<h1 id="worktree-sessions">جلسات Worktree</h1>',
      '<p>Worktree sessions let you run multiple parallel OpenCode sessions in isolated git worktrees, each with its own branch and working directory.</p>': '<p>تتيح لك جلسات Worktree تشغيل جلسات OpenCode متوازية متعددة في worktrees git معزولة، كل منها بفرعها ودليل العمل الخاص بها.</p>',
      '<h2 id="what-are-worktrees">What Are Worktrees?</h2>': '<h2 id="what-are-worktrees">ما هي Worktrees؟</h2>',
      '<p>A worktree is a separate working directory linked to the same git repository. Each worktree can be on a different branch, letting the agent work on multiple features simultaneously.</p>': '<p>Worktree هو دليل عمل منفصل مرتبط بنفس مستودع git. يمكن لكل worktree أن يكون على فرع مختلف، مما يسمح للوكيل بالعمل على ميزات متعددة في وقت واحد.</p>',
      '<h2 id="creating-a-worktree">Creating a Worktree</h2>': '<h2 id="creating-a-worktree">إنشاء Worktree</h2>',
      '<p>From the project panel, click <strong>New Worktree</strong>. Name it, select a branch (or create one), and the IDE checks out a new worktree and opens it in a new session.</p>': '<p>من لوحة المشروع، انقر <strong>Worktree جديد</strong>. سمّه، واختر فرعاً (أو أنشئ واحداً)، ويقوم IDE بإنشاء worktree جديد وفتحه في جلسة جديدة.</p>',
      '<h2 id="switching-between-worktrees">Switching Between Worktrees</h2>': '<h2 id="switching-between-worktrees">التبديل بين Worktrees</h2>',
      '<p>Switch between worktrees from the sidebar. Each worktree maintains its own session history, file tree, and terminal state.</p>': '<p>بدّل بين worktrees من الشريط الجانبي. يحتفظ كل worktree بسجل جلساته وشجرة الملفات وحالة الطرفية الخاصة به.</p>',
    }
  },
  // --- mobile ---
  {
    eng: 'docs\\mobile\\index.html', ara: 'ar\\docs\\mobile\\index.html', engPath: '/docs/mobile/', araPath: '/ar/docs/mobile/',
    titleAr: 'PWA والجوال',
    metaAr: 'الوصول إلى Limyrx Studio IDE من هاتفك أو جهازك اللوحي عبر تطبيق الويب التقدمي.',
    tocAr: '<li><a href="#pwa-installation">تثبيت PWA</a></li>\n<li><a href="#mobile-features">ميزات الجوال</a></li>\n<li><a href="#touch-controls">التحكم باللمس</a></li>',
    reps: {
      '<h1 id="pwa--mobile">PWA &amp; Mobile</h1>': '<h1 id="pwa--mobile">PWA والجوال</h1>',
      '<p>Access Limyrx Studio IDE from your phone or tablet via the Progressive Web App.</p>': '<p>الوصول إلى Limyrx Studio IDE من هاتفك أو جهازك اللوحي عبر تطبيق الويب التقدمي.</p>',
      '<h2 id="pwa-installation">PWA Installation</h2>': '<h2 id="pwa-installation">تثبيت PWA</h2>',
      '<p>Open <code>https://limyrxstudio.dev</code> in Chrome or Safari on iOS/Android. Tap the share icon and select <strong>Add to Home Screen</strong>.</p>': '<p>افتح <code>https://limyrxstudio.dev</code> في Chrome أو Safari على iOS/Android. انقر على أيقونة المشاركة واختر <strong>إضافة إلى الشاشة الرئيسية</strong>.</p>',
      '<h2 id="mobile-features">Mobile Features</h2>': '<h2 id="mobile-features">ميزات الجوال</h2>',
      '<p>The mobile UI includes a touch-friendly file tree, swipeable panels, and an optimized chat interface for small screens.</p>': '<p>تتضمن واجهة الجوال شجرة ملفات مناسبة للمس، ولوحات قابلة للسحب، وواجهة دردشة محسّنة للشاشات الصغيرة.</p>',
      '<h2 id="touch-controls">Touch Controls</h2>': '<h2 id="touch-controls">التحكم باللمس</h2>',
      '<p>Use gestures: swipe left/right to switch panels, pinch to zoom the file tree, long-press for context menus.</p>': '<p>استخدم الإيماءات: اسحب لليسار/اليمين للتبديل بين اللوحات، اضغط للتكبير في شجرة الملفات، اضغط مطولاً للقوائم السياقية.</p>',
    }
  },
];

// ====================================================================
// RUN
// ====================================================================

for (const p of pages) {
  processFile(
    path.join(BASE, p.eng),
    path.join(BASE, p.ara),
    p.engPath,
    p.araPath,
    p.titleAr,
    p.metaAr,
    p.reps,
    p.tocAr
  );
}

console.log('=== All 36 pages processed ===');
