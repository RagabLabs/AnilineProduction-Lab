import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', fullyParallel:true, workers:2, timeout:60000,
  expect:{timeout:10000}, reporter:[['list'],['json',{outputFile:'test-results/browser.json'}]],
  use:{baseURL:'http://127.0.0.1:4173/AnilineProduction-Lab/',trace:'retain-on-failure',
    launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']}},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{...devices['Pixel 7'],viewport:{width:390,height:844}}}],
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173/AnilineProduction-Lab/',reuseExistingServer:!process.env.CI,timeout:30000},
});
