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
			args: ['--window-size=800,800']
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
		await page.waitFor(2000);

		// 点击交互
		await page.evaluate(() => document.getElementsByClassName('mobileId_selectcontainer')[0].children[1].setAttribute('id', 'wheelsposition2'));
		
		// 点击二月检查滚动是否正常
		await page.click('#wheelsposition2');
		const wheelsPosition2 = await page.$eval('.mobileId_selectcontainer', el => el.getAttribute('style'));
		expect(wheelsPosition2.indexOf('40px') !== -1).toBe(true);
		await page.waitFor(2000);

		// 验证点击确定后取之正常
		await page.click('.mobileId_btnensure');
		const february = await page.$eval('#exampleMobile', el => el.outerText);
		expect(february).toBe('2月');

		
	}, 100000);
});

