function Get-FileContent {
    param([string]$Path)
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Write-ArabicFile {
    param(
        [string]$EnglishPath,
        [string]$ArabicPath,
        [string]$EnglishPagePath,
        [string]$ArabicPagePath,
        [string]$PageTitleAr,
        [string]$MetaDescAr,
        [string]$ContentReplacementsJson,
        [string]$TocHtmlAr
    )

    $content = Get-FileContent -Path $EnglishPath
    $reps = $ContentReplacementsJson | ConvertFrom-Json

    $content = $content -replace '<html lang="en" data-theme="dark">', '<html lang="ar" dir="rtl" data-theme="dark">'
    $content = $content -replace '<title>[^<]+</title>', "<title>$PageTitleAr - Limyrx Studio IDE</title>"
    $content = $content -replace '<meta name="description" content="[^"]+">', '<meta name="description" content="' + $MetaDescAr + '">'
    $content = $content -replace '<meta property="og:description" content="[^"]+">', '<meta property="og:description" content="' + $MetaDescAr + '">'
    $content = $content -replace '<meta name="twitter:description" content="[^"]+">', '<meta name="twitter:description" content="' + $MetaDescAr + '">'
    $content = $content -replace '<meta property="og:title" content="[^"]+">', '<meta property="og:title" content="' + $PageTitleAr + ' - Limyrx Studio IDE">'
    $content = $content -replace '<meta name="twitter:title" content="[^"]+">', '<meta name="twitter:title" content="' + $PageTitleAr + ' - Limyrx Studio IDE">'
    $content = $content -replace '<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="ar_PS">'
    $content = $content -replace 'https://limyrxstudio.dev/docs/[^"'"'"']*', "https://limyrxstudio.dev$ArabicPagePath"
    $content = $content -replace '<link rel="canonical"[^>]+>', '<link rel="canonical" href="https://limyrxstudio.dev' + $ArabicPagePath + '">'

    $content = $content -replace 'aria-label="\?\?\?\? English"', 'aria-label="????????? ??????"'
    $content = $content -replace '<span class="lang-switcher-current">\?\?\?\? English</span>', '<span class="lang-switcher-current">????????? ??????</span>'

    $content = $content -replace '<a href="/docs/[^"]+" hreflang="en" class="lang-switcher-option active" aria-current="true">\?\?\?\? English</a>', '<a href="' + $EnglishPagePath + '" hreflang="en" class="lang-switcher-option">???? English</a>'
    $content = $content -replace '<a href="/ar/docs/[^"]+" hreflang="ar" class="lang-switcher-option">\?\?\?\? ??????</a>', '<a href="' + $ArabicPagePath + '" hreflang="ar" class="lang-switcher-option active" aria-current="true">????????? ??????</a>'

    foreach ($key in $reps.PSObject.Properties) {
        $content = $content -replace [regex]::Escape($key.Name), $key.Value
    }

    $pattern = '(?<=<h2>\xd9\x81\xd9\x8a \xd9\x87\xd8\xb0\xd9\x87 \xd8\xa7\xd9\x84\xd8\xb5\xd9\x81\xd8\xad\xd8\xa9</h2> <ul>).*?(?=</ul> </aside>)'
    $content = $content -replace $pattern, $TocHtmlAr

    [System.IO.File]::WriteAllText($ArabicPath, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Output "Created: $ArabicPath"
}

Write-Output "Script functions loaded"