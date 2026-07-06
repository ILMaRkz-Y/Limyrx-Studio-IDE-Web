param(
    [string]$BaseDir = "C:\Users\util\Desktop\Limyrx Studio IDE Web"
)

function Get-FileContent {
    param([string]$Path)
    return Get-Content -Raw -LiteralPath $Path
}

function Write-ArabicFile {
    param(
        [string]$EnglishPath,
        [string]$ArabicPath,
        [string]$EnglishPagePath,
        [string]$ArabicPagePath,
        [string]$PageTitleAr,
        [string]$MetaDescAr,
        [hashtable]$ContentReplacements,
        [string]$TocHtmlAr
    )

    $content = Get-FileContent -Path $EnglishPath

    # 1. html lang
    $content = $content -replace '<html lang="en" data-theme="dark">', '<html lang="ar" dir="rtl" data-theme="dark">'

    # 2. Title
    $englishTitle = " - Limyrx Studio IDE"
    $content = $content -replace '<title>[^<]+</title>', "<title>$PageTitleAr$englishTitle</title>"

    # 3. Meta description
    $content = $content -replace '<meta name="description" content="[^"]+">', '<meta name="description" content="' + $MetaDescAr + '">'
    $content = $content -replace '<meta property="og:description" content="[^"]+">', '<meta property="og:description" content="' + $MetaDescAr + '">'
    $content = $content -replace '<meta name="twitter:description" content="[^"]+">', '<meta name="twitter:description" content="' + $MetaDescAr + '">'

    # 4. og:title
    $content = $content -replace '<meta property="og:title" content="[^"]+">', '<meta property="og:title" content="' + $PageTitleAr + $englishTitle + '">'
    $content = $content -replace '<meta name="twitter:title" content="[^"]+">', '<meta name="twitter:title" content="' + $PageTitleAr + $englishTitle + '">'

    # 5. og:locale
    $content = $content -replace '<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_PS">'

    # 6. og:url
    $content = $content -replace 'https://limyrxstudio.dev/docs/[^"]*', "https://limyrxstudio.dev$ArabicPagePath"

    # 7. canonical
    $content = $content -replace '<link rel="canonical"[^>]+>', '<link rel="canonical" href="https://limyrxstudio.dev' + $ArabicPagePath + '">'

    # 8. Language switcher button
    $content = $content -replace 'aria-label="\?\?\?\? English"', 'aria-label="🇵🇸 العربية"'
    $content = $content -replace '<span class="lang-switcher-current">\?\?\?\? English</span>', '<span class="lang-switcher-current">🇵🇸 العربية</span>'

    # 9. Language switcher menu - English item (remove active/aria-current)
    $content = $content -replace '<a href="/docs/[^"]+" hreflang="en" class="lang-switcher-option active" aria-current="true">\?\?\?\? English</a>', '<a href="' + $EnglishPagePath + '" hreflang="en" class="lang-switcher-option">???? English</a>'

    # 10. Language switcher menu - Arabic item (add active/aria-current)
    $content = $content -replace '<a href="/ar/docs/[^"]+" hreflang="ar" class="lang-switcher-option">\?\?\?\? العربية</a>', '<a href="' + $ArabicPagePath + '" hreflang="ar" class="lang-switcher-option active" aria-current="true">🇵🇸 العربية</a>'

    # 11. Nav translations
    $navReplacements = @{
        '> Docs </a>' = '> المستندات </a>'
        '> Roadmap </a>' = '> خارطة الطريق </a>'
        '> Support </a>' = '> الدعم </a>'
        '> Donate </a>' = '> تبرع </a>'
        '>Download</a>' = '>تحميل</a>'
        'aria-label="Toggle menu"' = 'aria-label="تبديل القائمة"'
    }
    foreach ($key in $navReplacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $navReplacements[$key]
    }

    # 12. Sidebar translations
    $sidebarReplacements = @{
        '> Start here<' = '> ابدأ من هنا<'
        '>Overview</a>' = '>نظرة عامة</a>'
        '>Install</a>' = '>تثبيت</a>'
        '>Quickstart</a>' = '>بداية سريعة</a>'
        '>OpenCode Server</a>' = '>خادم OpenCode</a>'
        '>Environment Variables</a>' = '>متغيرات البيئة</a>'
        '> Workflows<' = '> سير العمل<'
        '>Projects</a>' = '>المشاريع</a>'
        '>Context</a>' = '>السياق</a>'
        '>Notes, Todos &amp; Plans</a>' = '>الملاحظات والمهام والخطط</a>'
        '>Scheduled Tasks</a>' = '>المهام المجدولة</a>'
        '>Project Actions</a>' = '>إجراءات المشروع</a>'
        '>Preview &amp; Dev Servers</a>' = '>المعاينة وخوادم التطوير</a>'
        '>Worktree Sessions</a>' = '>جلسات Worktree</a>'
        '>Multi-run</a>' = '>تشغيل متعدد</a>'
        '>Git &amp; GitHub</a>' = '>Git وGitHub</a>'
        '>GitHub Issues &amp; PRs</a>' = '>مشكلات GitHub وطلبات السحب</a>'
        '>Magic Prompts</a>' = '>الاستعلامات السحرية</a>'
        '>Git Identities</a>' = '>هويات Git</a>'
        '> OpenCode setup<' = '> إعداد OpenCode<'
        '>Providers, Models &amp; Agents</a>' = '>المزودون والنماذج والوكلاء</a>'
        '>MCP Servers</a>' = '>خوادم MCP</a>'
        '>Skills</a>' = '>المهارات</a>'
        '>Skills Catalog</a>' = '>كتالوج المهارات</a>'
        '>Commands &amp; Snippets</a>' = '>الأوامر والمقتطفات</a>'
        '>Usage &amp; Quotas</a>' = '>الاستخدام والحصص</a>'
        '> Remote access<' = '> الوصول عن بعد<'
        '>Tunnels</a>' = '>الأنفاق</a>'
        '>Reverse Proxy</a>' = '>الوكيل العكسي</a>'
        '>PWA &amp; Mobile</a>' = '>PWA والجوال</a>'
        '>Security</a>' = '>الأمان</a>'
        '> Customize<' = '> تخصيص<'
        '>Themes</a>' = '>السمات</a>'
        '>Notifications</a>' = '>الإشعارات</a>'
        '>Voice Mode</a>' = '>وضع الصوت</a>'
        '>Project Icons</a>' = '>أيقونات المشروع</a>'
        '> Desktop<' = '> سطح المكتب<'
        '>Remote Instances</a>' = '>المثيلات البعيدة</a>'
        '>Desktop Browser</a>' = '>متصفح سطح المكتب</a>'
        '>Desktop Tunnels</a>' = '>أنفاق سطح المكتب</a>'
        '>SSH Hosts &amp; Proxying</a>' = '>مضيفات SSH والوكالة</a>'
        '>Updates</a>' = '>التحديثات</a>'
        '> Help<' = '> مساعدة<'
        '>Troubleshooting</a>' = '>استكشاف الأخطاء</a>'
        '>OpenCode Connection</a>' = '>اتصال OpenCode</a>'
        '>Worktrees &amp; Git</a>' = '>Worktrees وGit</a>'
        '>Remote Access</a>' = '>الوصول عن بعد</a>'
        'aria-label="Main"' = 'aria-label="الرئيسية"'
    }
    foreach ($key in $sidebarReplacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $sidebarReplacements[$key]
    }

    # 13. Footer translations
    $content = $content -replace 'Found a bug\? Open an issue', 'وجدت خطأ؟ افتح مشكلة'
    $content = $content -replace 'Join our Discord community', 'انضم إلى مجتمعنا على Discord'

    # 14. Right sidebar "On this page"
    $content = $content -replace 'aria-label="On this page"', 'aria-label="في هذه الصفحة"'
    $content = $content -replace '<h2>On this page</h2>', '<h2>في هذه الصفحة</h2>'

    # 15. TOC items - replace the TOC list items
    # First extract the TOC section and replace it
    $pattern = '(?<=<h2>في هذه الصفحة</h2> <ul>).*?(?=</ul> </aside>)'
    $content = $content -replace $pattern, $TocHtmlAr

    # 16. Page-specific content replacements
    foreach ($key in $ContentReplacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $ContentReplacements[$key]
    }

    # 17. Fix sidebar active class links - they still have English text but the active class should stay
    # No changes needed for href links per requirement

    # Write the Arabic file
    [System.IO.File]::WriteAllText($ArabicPath, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Output "Created: $ArabicPath"
}

# ====================================================================
# PROCESS ALL FILES
# ====================================================================

# --- install ---
$engPath = Join-Path $BaseDir "docs\install\index.html"
$araPath = Join-Path $BaseDir "ar\docs\install\index.html"
$engPagePath = "/docs/install/"
$araPagePath = "/ar/docs/install/"
$pageTitleAr = "تثبيت"
$metaDescAr = "ثبّت Limyrx Studio IDE على سطح المكتب أو الويب أو VS Code."
$tocHtmlAr = "<li><a href=""#install"">تثبيت</a></li>
<li><a href=""#desktop-app"">تطبيق سطح المكتب</a></li>
<li><a href=""#web-app"">تطبيق الويب (PWA)</a></li>
<li><a href=""#vs-code-extension"">إضافة VS Code</a></li>
<li><a href=""#next-steps"">الخطوات التالية</a></li>"
$contentRep = @{
    '<h1 id="install">Install</h1>' = '<h1 id="install">تثبيت</h1>'
    '<p>Limyrx Studio IDE runs as a web app in your browser, as a desktop app for macOS and Windows, and as a VS Code extension. Pick the option that fits your workflow.</p>' = '<p>يعمل Limyrx Studio IDE كتطبيق ويب في متصفحك، وكتطبيق سطح مكتب لأنظمة macOS وWindows، وكتوسعة لـ VS Code. اختر الخيار الذي يناسب سير عملك.</p>'
    '<h2 id="desktop-app">Desktop App</h2>' = '<h2 id="desktop-app">تطبيق سطح المكتب</h2>'
    '<p>The desktop app bundles its own browser window with native OS integration. It supports menu bar controls, global shortcuts, dock/taskbar badges, and automatic updates.</p>' = '<p>يضم تطبيق سطح المكتب نافذة متصفح خاصة به مع تكامل نظام التشغيل الأصلي. يدعم عناصر تحكم شريط القوائم والاختصارات العامة وشارات الإرساء/شريط المهام والتحديثات التلقائية.</p>'
    '<h3 id="macos">macOS</h3>' = '<h3 id="macos">macOS</h3>'
    '<h3 id="windows">Windows</h3>' = '<h3 id="windows">Windows</h3>'
    '<h3 id="linux">Linux</h3>' = '<h3 id="linux">Linux</h3>'
    '<p>Or download the <code>.dmg</code> directly from the <a href="/download">download page</a> and drag to Applications.</p>' = '<p>أو قم بتنزيل <code>.dmg</code> مباشرة من <a href="/download">صفحة التنزيل</a> واسحبه إلى مجلد التطبيقات.</p>'
    '<h2 id="web-app">Web App (PWA)</h2>' = '<h2 id="web-app">تطبيق الويب (PWA)</h2>'
    '<p>Open <code>https://limyrxstudio.dev</code> in Chrome, Edge, or Safari and click the install icon in the address bar. This installs the IDE as a standalone PWA with its own window, offline support, and local file system access via the File System Access API.</p>' = '<p>افتح <code>https://limyrxstudio.dev</code> في Chrome أو Edge أو Safari وانقر على أيقونة التثبيت في شريط العنوان. يقوم هذا بتثبيت IDE كـ PWA مستقل مع نافذته الخاصة ودعم عدم الاتصال والوصول إلى نظام الملفات المحلي عبر واجهة File System Access API.</p>'
    '<h2 id="vs-code-extension">VS Code Extension</h2>' = '<h2 id="vs-code-extension">إضافة VS Code</h2>'
    '<p>Search for "Limyrx Studio IDE" in the VS Code extensions panel, or install via CLI:</p>' = '<p>ابحث عن "Limyrx Studio IDE" في لوحة إضافات VS Code، أو ثبّت عبر CLI:</p>'
    '<h2 id="next-steps">Next Steps</h2>' = '<h2 id="next-steps">الخطوات التالية</h2>'
    '<li><a href="/docs/quickstart/">Quickstart</a> - open your first project</li>' = '<li><a href="/docs/quickstart/">بداية سريعة</a> - افتح مشروعك الأول</li>'
    '<li><a href="/docs/tunnels/">Tunnels</a> - access your IDE remotely</li>' = '<li><a href="/docs/tunnels/">أنفاق</a> - الوصول إلى IDE عن بعد</li>'
    '<li><a href="/docs/opencode-server/">OpenCode Server</a> - set up the AI agent backend</li>' = '<li><a href="/docs/opencode-server/">خادم OpenCode</a> - إعداد الخلفية للوكيل AI</li>'
}
Write-ArabicFile -EnglishPath $engPath -ArabicPath $araPath -EnglishPagePath $engPagePath -ArabicPagePath $araPagePath -PageTitleAr $pageTitleAr -MetaDescAr $metaDescAr -ContentReplacements $contentRep -TocHtmlAr $tocHtmlAr

# --- quickstart ---
$engPath = Join-Path $BaseDir "docs\quickstart\index.html"
$araPath = Join-Path $BaseDir "ar\docs\quickstart\index.html"
$engPagePath = "/docs/quickstart/"
$araPagePath = "/ar/docs/quickstart/"
$pageTitleAr = "بداية سريعة"
$metaDescAr = "ابدأ مع Limyrx Studio IDE في دقائق."
$tocHtmlAr = "<li><a href=""#quickstart"">بداية سريعة</a></li>
<li><a href=""#prerequisites"">المتطلبات الأساسية</a></li>
<li><a href=""#step-1-start-the-ide"">الخطوة 1: تشغيل IDE</a></li>
<li><a href=""#step-2-configure-a-provider"">الخطوة 2: إعداد مزود</a></li>
<li><a href=""#step-3-open-a-project"">الخطوة 3: فتح مشروع</a></li>
<li><a href=""#step-4-start-a-session"">الخطوة 4: بدء جلسة</a></li>
<li><a href=""#step-5-review-and-commit"">الخطوة 5: مراجعة وإيداع</a></li>
<li><a href=""#next-steps"">الخطوات التالية</a></li>"
$contentRep = @{
    '<h1 id="quickstart">Quickstart</h1>' = '<h1 id="quickstart">بداية سريعة</h1>'
    '<p>This guide gets Limyrx Studio IDE running end-to-end with OpenCode in about 5 minutes.</p>' = '<p>هذا الدليل يشغّل Limyrx Studio IDE بشكل كامل مع OpenCode في حوالي 5 دقائق.</p>'
    '<h2 id="prerequisites">Prerequisites</h2>' = '<h2 id="prerequisites">المتطلبات الأساسية</h2>'
    '<li><a href="/docs/install/">Install</a> Limyrx Studio IDE (any platform)</li>' = '<li><a href="/docs/install/">تثبيت</a> Limyrx Studio IDE (أي منصة)</li>'
    '<li>OpenCode (TBA) installed in your terminal</li>' = '<li>OpenCode (TBA) مثبت في الطرفية الخاصة بك</li>'
    '<li>An API key from Anthropic, OpenAI, or another supported provider</li>' = '<li>مفتاح API من Anthropic أو OpenAI أو أي مزود مدعوم آخر</li>'
    '<h2 id="step-1-start-the-ide">Step 1: Start the IDE</h2>' = '<h2 id="step-1-start-the-ide">الخطوة 1: تشغيل IDE</h2>'
    '<p>Launch Limyrx Studio IDE from your desktop dock, or open a terminal and run:</p>' = '<p>شغّل Limyrx Studio IDE من شريط سطح المكتب، أو افتح طرفية وشغّل:</p>'
    '<p>The IDE opens to your projects dashboard. If OpenCode Server is running locally, it connects automatically.</p>' = '<p>يفتح IDE إلى لوحة المشاريع الخاصة بك. إذا كان خادم OpenCode يعمل محلياً، فإنه يتصل تلقائياً.</p>'
    '<h2 id="step-2-configure-a-provider">Step 2: Configure a Provider</h2>' = '<h2 id="step-2-configure-a-provider">الخطوة 2: إعداد مزود</h2>'
    '<p>Navigate to <strong>Settings &gt; Providers</strong> and add your API key. Supported providers include Anthropic, OpenAI, Google Gemini, AWS Bedrock, and others. See <a href="/docs/providers/">Providers, Models &amp; Agents</a> for the full list.</p>' = '<p>انتقل إلى <strong>الإعدادات &gt; المزودون</strong> وأضف مفتاح API الخاص بك. المزودون المدعومون يشملون Anthropic وOpenAI وGoogle Gemini وAWS Bedrock وغيرهم. راجع <a href="/docs/providers/">المزودون والنماذج والوكلاء</a> للقائمة الكاملة.</p>'
    '<h2 id="step-3-open-a-project">Step 3: Open a Project</h2>' = '<h2 id="step-3-open-a-project">الخطوة 3: فتح مشروع</h2>'
    '<p>Click <strong>Open Folder</strong> and select a local directory. The IDE scans your project structure, picks up any existing OpenCode config, and loads the file tree into the sidebar.</p>' = '<p>انقر <strong>فتح مجلد</strong> واختر دليلاً محلياً. يقوم IDE بفحص هيكل مشروعك، ويلتقط أي إعدادات OpenCode موجودة، ويحمّل شجرة الملفات إلى الشريط الجانبي.</p>'
    '<h2 id="step-4-start-a-session">Step 4: Start a Session</h2>' = '<h2 id="step-4-start-a-session">الخطوة 4: بدء جلسة</h2>'
    '<p>Type a task in the chat input and press Enter. The agent starts working — you\'ll see its reasoning, tool calls, file edits, and terminal commands stream into the session panel in real time.</p>' = '<p>اكتب مهمة في إدخال الدردشة واضغط Enter. يبدأ الوكيل في العمل — سترى تفكيره واستدعاءات الأدوات وتعديلات الملفات وأوامر الطرفية تتدفق إلى لوحة الجلسة في الوقت الفعلي.</p>'
    '<h2 id="step-5-review-and-commit">Step 5: Review and Commit</h2>' = '<h2 id="step-5-review-and-commit">الخطوة 5: مراجعة وإيداع</h2>'
    '<p>When the agent finishes, review the diff in the changes panel. Stage files, write a commit message, and push to GitHub — all from within the IDE. See <a href="/docs/git/">Git &amp; GitHub</a> for details.</p>' = '<p>عندما ينتهي الوكيل، راجع الفروقات في لوحة التغييرات. جهّز الملفات واكتب رسالة الإيداع وادفع إلى GitHub — كل ذلك من داخل IDE. راجع <a href="/docs/git/">Git وGitHub</a> للتفاصيل.</p>'
    '<li><a href="/docs/projects/">Projects</a> - organize your work</li>' = '<li><a href="/docs/projects/">المشاريع</a> - نظّم عملك</li>'
    '<li><a href="/docs/tunnels/">Tunnels</a> - access remotely</li>' = '<li><a href="/docs/tunnels/">الأنفاق</a> - الوصول عن بعد</li>'
    '<li><a href="/docs/themes/">Themes</a> - customize the look</li>' = '<li><a href="/docs/themes/">السمات</a> - تخصيص المظهر</li>'
}
Write-ArabicFile -EnglishPath $engPath -ArabicPath $araPath -EnglishPagePath $engPagePath -ArabicPagePath $araPagePath -PageTitleAr $pageTitleAr -MetaDescAr $metaDescAr -ContentReplacements $contentRep -TocHtmlAr $tocHtmlAr

# --- projects ---
$engPath = Join-Path $BaseDir "docs\projects\index.html"
$araPath = Join-Path $BaseDir "ar\docs\projects\index.html"
$engPagePath = "/docs/projects/"
$araPagePath = "/ar/docs/projects/"
$pageTitleAr = "المشاريع"
$metaDescAr = "إدارة المشاريع في Limyrx Studio IDE."
$tocHtmlAr = "<li><a href=""#projects"">المشاريع</a></li>
<li><a href=""#opening-a-project"">فتح مشروع</a></li>
<li><a href=""#recent-projects"">المشاريع الأخيرة</a></li>
<li><a href=""#project-settings"">إعدادات المشروع</a></li>
<li><a href=""#multi-root-workspaces"">مساحات العمل متعددة الجذور</a></li>
<li><a href=""#see-also"">انظر أيضاً</a></li>"
$contentRep = @{
    '<h1 id="projects">Projects</h1>' = '<h1 id="projects">المشاريع</h1>'
    '<p>Projects are the central unit of work in Limyrx Studio IDE. A project is a directory on your filesystem that contains source code, configuration, and any OpenCode-related files.</p>' = '<p>المشاريع هي الوحدة المركزية للعمل في Limyrx Studio IDE. المشروع هو دليل على نظام الملفات الخاص بك يحتوي على الكود المصدري والتكوين وأي ملفات متعلقة بـ OpenCode.</p>'
    '<h2 id="opening-a-project">Opening a Project</h2>' = '<h2 id="opening-a-project">فتح مشروع</h2>'
    '<p>From the dashboard, click <strong>Open Folder</strong> or use <code>Ctrl+O</code> (<code>Cmd+O</code> on macOS). Navigate to the directory and select it. The IDE loads the file tree, detects git repos, and scans for OpenCode configuration files.</p>' = '<p>من لوحة التحكم، انقر <strong>فتح مجلد</strong> أو استخدم <code>Ctrl+O</code> (<code>Cmd+O</code> على macOS). انتقل إلى الدليل واختره. يقوم IDE بتحميل شجرة الملفات واكتشاف مستودعات git وفحص ملفات تكوين OpenCode.</p>'
    '<h2 id="recent-projects">Recent Projects</h2>' = '<h2 id="recent-projects">المشاريع الأخيرة</h2>'
    '<p>The dashboard shows your recent projects with timestamps. Click any project to reopen it. You can pin frequently used projects to keep them at the top of the list.</p>' = '<p>تعرض لوحة التحكم مشاريعك الأخيرة مع أختام زمنية. انقر على أي مشروع لإعادة فتحه. يمكنك تثبيت المشاريع المستخدمة بشكل متكرر لإبقائها في أعلى القائمة.</p>'
    '<h2 id="project-settings">Project Settings</h2>' = '<h2 id="project-settings">إعدادات المشروع</h2>'
    '<p>Each project has its own settings panel where you can configure:</p>' = '<p>لكل مشروع لوحة إعدادات خاصة به حيث يمكنك تكوين:</p>'
    '<li><strong>Provider &amp; Model</strong> - override the global model for this project</li>' = '<li><strong>المزود والنموذج</strong> - تجاوز النموذج العام لهذا المشروع</li>'
    '<li><strong>OpenCode Config</strong> - path to <code>.opencode.jsonc</code> or equivalent</li>' = '<li><strong>تكوين OpenCode</strong> - المسار إلى <code>.opencode.jsonc</code> أو ما يعادله</li>'
    '<li><strong>Project Actions</strong> - define custom scripts accessible in the IDE</li>' = '<li><strong>إجراءات المشروع</strong> - تعريف نصوص برمجية مخصصة يمكن الوصول إليها في IDE</li>'
    '<li><strong>Environment</strong> - per-project environment variables</li>' = '<li><strong>البيئة</strong> - متغيرات بيئة لكل مشروع</li>'
    '<h2 id="multi-root-workspaces">Multi-root Workspaces</h2>' = '<h2 id="multi-root-workspaces">مساحات العمل متعددة الجذور</h2>'
    '<p>Limyrx Studio IDE supports multi-root workspaces. Open multiple projects simultaneously and switch between them from the sidebar. Each project maintains its own session history and settings.</p>' = '<p>يدعم Limyrx Studio IDE مساحات العمل متعددة الجذور. افتح مشاريع متعددة في وقت واحد وتبديل بينها من الشريط الجانبي. يحتفظ كل مشروع بسجل جلساته وإعداداته الخاصة.</p>'
    '<h2 id="see-also">See Also</h2>' = '<h2 id="see-also">انظر أيضاً</h2>'
    '<li><a href="/docs/worktrees/">Worktree Sessions</a> - isolated parallel work</li>' = '<li><a href="/docs/worktrees/">جلسات Worktree</a> - عمل متوازٍ معزول</li>'
    '<li><a href="/docs/project-actions/">Project Actions</a> - custom automation</li>' = '<li><a href="/docs/project-actions/">إجراءات المشروع</a> - أتمتة مخصصة</li>'
    '<li><a href="/docs/git/">Git &amp; GitHub</a> - version control</li>' = '<li><a href="/docs/git/">Git وGitHub</a> - التحكم في الإصدارات</li>'
}
Write-ArabicFile -EnglishPath $engPath -ArabicPath $araPath -EnglishPagePath $engPagePath -ArabicPagePath $araPagePath -PageTitleAr $pageTitleAr -MetaDescAr $metaDescAr -ContentReplacements $contentRep -TocHtmlAr $tocHtmlAr

# --- tunnels ---
$engPath = Join-Path $BaseDir "docs\tunnels\index.html"
$araPath = Join-Path $BaseDir "ar\docs\tunnels\index.html"
$engPagePath = "/docs/tunnels/"
$araPagePath = "/ar/docs/tunnels/"
$pageTitleAr = "الأنفاق"
$metaDescAr = "تتيح لك الأنفاق الوصول إلى مثيل Limyrx Studio IDE الخاص بك من أي مكان، حتى خلف NAT أو جدران الحماية."
$tocHtmlAr = "<li><a href=""#how-tunnels-work"">كيف تعمل الأنفاق</a></li>
<li><a href=""#creating-a-tunnel"">إنشاء نفق</a></li>
<li><a href=""#tunnel-security"">أمان الأنفاق</a></li>
<li><a href=""#see-also"">انظر أيضاً</a></li>"
$contentRep = @{
    '<h1 id="tunnels">Tunnels</h1>' = '<h1 id="tunnels">الأنفاق</h1>'
    '<p>Tunnels let you access your Limyrx Studio IDE instance from anywhere, even behind NAT or firewalls.</p>' = '<p>تتيح لك الأنفاق الوصول إلى مثيل Limyrx Studio IDE الخاص بك من أي مكان، حتى خلف NAT أو جدران الحماية.</p>'
    '<h2 id="how-tunnels-work">How Tunnels Work</h2>' = '<h2 id="how-tunnels-work">كيف تعمل الأنفاق</h2>'
    '<p>The desktop app or server creates an outbound WebSocket connection to the relay server, which assigns a public URL. Traffic is encrypted end-to-end.</p>' = '<p>يقوم تطبيق سطح المكتب أو الخادم بإنشاء اتصال WebSocket صادر إلى خادم الترحيل، الذي يعيّن عنوان URL عام. حركة المرور مشفرة من النهاية إلى النهاية.</p>'
    '<h2 id="creating-a-tunnel">Creating a Tunnel</h2>' = '<h2 id="creating-a-tunnel">إنشاء نفق</h2>'
    '<p>Click <strong>Tunnel</strong> in the status bar. Give it a name and the IDE generates a URL like <code>https://my-project.tunnel.limyrxstudio.dev</code>.</p>' = '<p>انقر <strong>نفق</strong> في شريط الحالة. أعطه اسماً ويقوم IDE بإنشاء URL مثل <code>https://my-project.tunnel.limyrxstudio.dev</code>.</p>'
    '<h2 id="tunnel-security">Tunnel Security</h2>' = '<h2 id="tunnel-security">أمان الأنفاق</h2>'
    '<p>Tunnels are password-protected by default. You can also restrict access by IP, require OAuth, or disable tunnels entirely in Settings.</p>' = '<p>الأنفاق محمية بكلمة مرور افتراضياً. يمكنك أيضاً تقييد الوصول حسب IP أو طلب OAuth أو تعطيل الأنفاق بالكامل في الإعدادات.</p>'
    '<h2 id="see-also">See Also</h2>' = '<h2 id="see-also">انظر أيضاً</h2>'
    '<li><a href="/docs/reverse-proxy/">Reverse Proxy</a></li>' = '<li><a href="/docs/reverse-proxy/">الوكيل العكسي</a></li>'
    '<li><a href="/docs/security/">Security</a></li>' = '<li><a href="/docs/security/">الأمان</a></li>'
    '<li><a href="/docs/desktop-tunnels/">Desktop Tunnels</a></li>' = '<li><a href="/docs/desktop-tunnels/">أنفاق سطح المكتب</a></li>'
}
Write-ArabicFile -EnglishPath $engPath -ArabicPath $araPath -EnglishPagePath $engPagePath -ArabicPagePath $araPagePath -PageTitleAr $pageTitleAr -MetaDescAr $metaDescAr -ContentReplacements $contentRep -TocHtmlAr $tocHtmlAr

Write-Output "=== Batch 1 complete (install, quickstart, projects, tunnels) ==="
