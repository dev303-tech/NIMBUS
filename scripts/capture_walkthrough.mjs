import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = '/Users/shauryadevparihar/.gemini/antigravity/brain/66ec322a-498b-4965-a6a9-f49b52b538af';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');
const RECORDING_DIR = path.join(ARTIFACT_DIR, 'recordings');
const FRAMES_DIR = '/tmp/nimbus_frames';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(RECORDING_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function run() {
  console.log('Launching browser for NIMBUS verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=metal'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Wait for intro loader to complete (2.5s)
  console.log('Waiting for atmospheric scene initialization...');
  await new Promise((r) => setTimeout(r, 3200));

  const chapters = [
    { name: 'ch1_stratosphere', scrollRatio: 0.00 },
    { name: 'ch2_cloud_deck', scrollRatio: 0.17 },
    { name: 'ch3_the_layer', scrollRatio: 0.35 },
    { name: 'ch4_the_city', scrollRatio: 0.52 },
    { name: 'ch5_the_forecast', scrollRatio: 0.68 },
    { name: 'ch6_your_air', scrollRatio: 0.83 },
    { name: 'ch7_street_level', scrollRatio: 0.98 },
  ];

  const aqiLevels = [
    { aqi: 30, tag: 'aqi30_pristine' },
    { aqi: 130, tag: 'aqi130_inversion' },
    { aqi: 280, tag: 'aqi280_severe' },
  ];

  // 1. Capture matrix of chapters at AQI 30, 130, 280
  console.log('\n--- Capturing Chapter Screenshots Across AQI States ---');
  for (const level of aqiLevels) {
    console.log(`\nSetting AQI to ${level.aqi} (${level.tag})...`);
    // Inject dev override via window helper or range slider
    await page.evaluate((val) => {
      if (window.__nimbus && window.__nimbus.setAqi) {
        window.__nimbus.setAqi(val);
      }
      const slider = document.querySelector('input[type="range"].dev-slider');
      if (slider) {
        slider.value = String(val);
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, level.aqi);

    // Give shaders time to lerp
    await new Promise((r) => setTimeout(r, 800));

    for (const ch of chapters) {
      console.log(`  Capturing ${ch.name} at AQI ${level.aqi}...`);
      await page.evaluate((ratio) => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, ratio * total);
      }, ch.scrollRatio);

      await new Promise((r) => setTimeout(r, 650));

      const filename = `${ch.name}_${level.tag}.png`;
      const filepath = path.join(SCREENSHOT_DIR, filename);
      await page.screenshot({ path: filepath, type: 'png' });
    }
  }

  // 2. Record full scroll-through on Desktop (1440x900)
  console.log('\n--- Recording Desktop Scroll-Through ---');
  // Reset AQI to 134 (moderate inversion)
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"].dev-slider');
    if (slider) {
      slider.value = '134';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  const desktopFramesDir = path.join(FRAMES_DIR, 'desktop');
  fs.mkdirSync(desktopFramesDir, { recursive: true });

  const totalSteps = 45;
  for (let step = 0; step <= totalSteps; step++) {
    const ratio = step / totalSteps;
    await page.evaluate((r) => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, r * total);
    }, ratio);

    await new Promise((r) => setTimeout(r, 80));
    const frameFile = path.join(desktopFramesDir, `frame_${String(step).padStart(4, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });
  }

  console.log('Compiling desktop scroll-through MP4 video with ffmpeg...');
  const desktopVideo = path.join(RECORDING_DIR, 'desktop_scrollthrough.mp4');
  try {
    execSync(
      `/opt/homebrew/bin/ffmpeg -y -framerate 15 -i "${desktopFramesDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p "${desktopVideo}"`,
      { stdio: 'pipe' }
    );
    console.log(`Saved desktop video to: ${desktopVideo}`);
  } catch (e) {
    console.warn('ffmpeg compilation warning:', e.message);
  }

  // 3. Record full scroll-through on Mobile Viewport (390x844)
  console.log('\n--- Recording Mobile Viewport Scroll-Through ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));

  const mobileFramesDir = path.join(FRAMES_DIR, 'mobile');
  fs.mkdirSync(mobileFramesDir, { recursive: true });

  for (let step = 0; step <= totalSteps; step++) {
    const ratio = step / totalSteps;
    await page.evaluate((r) => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, r * total);
    }, ratio);

    await new Promise((r) => setTimeout(r, 80));
    const frameFile = path.join(mobileFramesDir, `frame_${String(step).padStart(4, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });
  }

  console.log('Compiling mobile scroll-through MP4 video with ffmpeg...');
  const mobileVideo = path.join(RECORDING_DIR, 'mobile_scrollthrough.mp4');
  try {
    execSync(
      `/opt/homebrew/bin/ffmpeg -y -framerate 15 -i "${mobileFramesDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p "${mobileVideo}"`,
      { stdio: 'pipe' }
    );
    console.log(`Saved mobile video to: ${mobileVideo}`);
  } catch (e) {
    console.warn('ffmpeg compilation warning:', e.message);
  }

  await browser.close();
  console.log('\nAll visual deliverables successfully captured!');
}

run().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
