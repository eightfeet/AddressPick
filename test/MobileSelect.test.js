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

		/* =======newModal1测试======== */
		await page.click('div#exampleMobile');

		// onShow 正常
		const onShowText = await page.$eval('#onShow', el => el.outerText);
		expect(onShowText).toBe('onShow');
		await page.waitFor(1000);
		// wheels显示正常
		const wheelsPosition = await page.$eval('.mobileId_selectcontainer', el => el.getAttribute('style'));
		expect(wheelsPosition.indexOf('-40px') !== -1).toBe(true);
		
	}, 10000);
});

