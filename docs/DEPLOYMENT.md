# GitHub Pages deployment

## النشر خطوة بخطوة

1. فك ملف ZIP. افتح مجلد `AnilineProduction-Lab` داخله.
2. أنشئ مستودعًا في حساب **RagabLabs** باسم **AnilineProduction-Lab**.
3. ارفع **محتويات المجلد** إلى جذر المستودع. يجب أن يكون `package.json` و`index.html` ومجلد `src` في الجذر، وليس داخل مجلد إضافي. ارفع مجلد `.github` أيضًا.
4. من المستودع افتح **Settings → Pages → Build and deployment → Source** واختر **GitHub Actions**.
5. اجعل الفرع الرئيسي اسمه `main`. يشغّل رفع الملفات إليه سير العمل، ويمكن تشغيله يدويًا من **Actions → Build, verify and deploy GitHub Pages → Run workflow**.
6. انتظر نجاح التثبيت والاختبارات والبناء والنشر. يظهر رابط النشر في نتيجة سير العمل.

الرابط المتوقع بعد النشر:

`https://ragablabs.github.io/AnilineProduction-Lab/`

المشروع مُجهَّز للنشر ولم يُنشر على حسابك أثناء هذا التسليم. إذا كان المستودع خاصًا فإتاحة Pages تخضع لإعدادات حساب GitHub وخطته.

## Configuration

`vite.config.ts` sets `base: '/AnilineProduction-Lab/'`. All routes use hashes, e.g. `/AnilineProduction-Lab/#/calculator/20`, so refreshing a calculator does not request a missing server-side route. Fonts, scripts, icons and styles are build assets at the same repository subpath.

Changing the GitHub username alone does not require a base-path edit. Renaming the repository does: change the Vite base, Playwright baseURL/webServer URL and README URLs, then rebuild and retest. Deploying to a domain root also requires changing base to `/` and updating the test URL.

The Pages workflow installs the pinned lockfile, runs scientific tests, builds, installs the Playwright Chromium browser and runs browser tests before uploading `dist`. The deployment job needs `pages: write`, `id-token: write` and the `github-pages` environment.

## Local production preview

```bash
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/AnilineProduction-Lab/`. The included `dist` folder is a prebuilt production copy. Development source edits need a fresh build before production preview. Double-clicking HTML from disk does not satisfy the configured HTTP repository path.

## Diagnose a blank page

- Confirm the repository name and `base` match exactly, including case.
- Confirm the published artifact is `dist`, containing `index.html` and `assets`.
- Confirm the repository root contains the source, package manifest and lockfile.
- Read the failing Actions step before changing code; no API keys or application server are required.
- If a renamed repository serves stale assets, rebuild and refresh the page.

No deployment or public repository creation was performed as part of producing this archive.
