import puppeteer from 'puppeteer';
import '@babel/runtime/regenerator';
import {installMouseHelper} from './install-mouse-helper';

/**
 * 2、end2end， yarn start
 * 测试正常
*/
describe('MobileSelect', () => {
	// end2end测试
	it('MobileSelect end2end test', async () => {
		const browser = await puppeteer.launch({
			headless: false,
			slowMo: 100
		});
		const page = await browser.newPage();
		await installMouseHelper(page);
		await page.goto('http://localhost:9000/');
		await page.click('div#exampleMobile');

		// trigger, onShow 正常
		const onShowText = await page.$eval('#onShow', el => el.outerText);
		expect(onShowText).toBe('onShow');
		await page.waitFor(1000);

		// wheels 默认选择4月，滚动到-40px（transform 80px-1月 40px-2月 0px-3月；-40px-4月...），显示正常
		const wheelsPosition = await page.$eval('.mobileId_selectcontainer', el => el.getAttribute('style'));
		expect(wheelsPosition.indexOf('-40px') !== -1).toBe(true);

		// id 设置正常
		const idSet = await page.$eval('#mobileId', el => el.getAttribute('class'));
		expect(!!idSet).toBe(true);

		// cancelBtnText 取消按钮设置正常
		const cancelBtnText = await page.$eval('.mobileId_btncancel', el => el.outerText);
		expect(cancelBtnText).toBe('cancel');

		// ensureBtnText 确定按钮设置正常
		const ensureBtnText = await page.$eval('.mobileId_btnensure', el => el.outerText);
		expect(ensureBtnText).toBe('ensure');

		// title 设置正常
		const titleText = await page.$eval('.mobileId_title', el => el.outerText);
		expect(titleText).toBe('选择日期');
		await page.waitFor(200);
		// 点击交互
		await page.click('.mobileId_selectcontainer_2');
		// await page.evaluate(()=>document.querySelector('.mobileId_selectcontainer_2').click());
		

		// const wheelsPosition2 = await page.$eval('.mobileId_selectcontainer', el => el.outerHTML);
		// console.log('wheelsPosition2', wheelsPosition2);
		// await page.waitForSelector('#airplaneSubmit');
		
	}, 10000);
});

