import puppeteer from 'puppeteer';
import '@babel/runtime/regenerator';

/**
 * 2、end2end， yarn start
 * 测试其运行正常
*/
describe('MobileSelect', () => {
	// end2end测试
	it('MobileSelect', async () => {
		const browser = await puppeteer.launch({
			headless: true
		});
		const page = await browser.newPage();
		await page.goto('http://localhost:9000/');
		
	}, 10000);
});

