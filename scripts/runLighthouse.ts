import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import fs from 'fs/promises';
import path from 'path';

const [,, url, id] = process.argv;

(async () => {
  const browser = await launch({ chromeFlags: ['--headless'] });

  const result = await lighthouse(url, {
    port: browser.port,
    output: 'json',
    logLevel: 'info',
  });

  const reportPath = path.join(process.cwd(), 'results');
  await fs.mkdir(reportPath, { recursive: true });

  if(!result){
    throw new Error('result is unvali')
  }
  await fs.writeFile(
    path.join(reportPath, `${id}.json`),
    JSON.stringify(result.lhr, null, 2)
  );

  await browser.kill();
})();
