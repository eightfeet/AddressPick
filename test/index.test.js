import puppeteer from 'puppeteer';
import '@babel/runtime/regenerator';

import Modal from './../src/index';

const modal = new Modal({
	id: 'modalId',
	closable: false
});

/**
 * 1、虚拟一个实例检查他的正确性 modal，
 * 2、end2end， yarn start
 * http://localhost:9000/ 页面里存在两个实列newModal1， newModal2，
 * newModal2的父级是indom
 * create方法的noRemoval 分别是false(默认)，true
 * 测试其运行正常
*/
describe('Modal', () => {
	it('new Modal() should to be an object', () => {
		expect(Object.prototype.toString.apply(modal)).toBe('[object Object]');
	});

	it('Modal.state.id = modalId', () => {
		expect(modal.state.id).toBe('modalId');
	});

	it('Modal.state.closable = false', () => {
		expect(modal.state.closable).toBe(false);
	});

	// end2end测试
	it('Modal created and working', async () => {
		const browser = await puppeteer.launch({
			headless: true
		});
		const page = await browser.newPage();
		await page.goto('http://localhost:9000/');

		/* =======newModal1测试======== */
		await page.click('div#example1');

		// healder 正常
		const headerText = await page.$eval('.modal1_header', el => el.outerText);
		expect(headerText).toBe('Modal1');

		// article 正常
		const articleText = await page.$eval('.modal1_article', el => el.outerText);
		expect(articleText).toBe('Click on me to close.');

		// footer 正常
		const footerText = await page.$eval('.modal1_footer', el => el.outerText);
		expect(footerText).toBe('footer');

		// close 正常
		const closeHtml = await page.$eval('.modal1_close', el => el.outerHTML);
		expect(closeHtml.indexOf('z-index: 100') !== -1 ).toBe(true);

		// Modal1关闭时成功移除弹窗模块
		await page.evaluate(()=>document.querySelector('.modal1_close').click());
		await page.waitFor(1000);
		const aHandle = await page.evaluateHandle(() => document.body);
		const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
		const htmlResult = await resultHandle.jsonValue();
		expect(htmlResult.indexOf('id="modal1"') === -1).toBe(true);


		/* =======newModal2测试======== */
		// 父级下生成Modal正常
		await page.click('div#example2');
		const md2parentDom = await page.$eval('#modal2', el => el.innerHTML);
		expect(md2parentDom.indexOf('modal2_wrap') !== -1).toBe(true);

		// modal2关闭时只隐藏Modal但不移除Modal
		await page.evaluate(()=>document.querySelector('.modal2_close').click());
		await page.waitFor(1000);
		const md2parentDomHideGetStyle = await page.$eval('#modal2', el => el.getAttribute('style'));
		expect(md2parentDomHideGetStyle.indexOf('display: none') !== -1).toBe(true);

		// emBase 检查父级基准字体大小设置是否正常
		expect(md2parentDomHideGetStyle.indexOf('font-size: 12px') !== -1).toBe(true);

		// shouldCloseOnOverlayClick 点击浮层关闭Modal
		await page.click('div#example2');
		await page.waitFor(1000);
		let md2OverlyClickGetDomStyle = await page.$eval('#modal2', el => el.getAttribute('style'));
		expect(md2OverlyClickGetDomStyle.indexOf('display: block') !== -1).toBe(true);

		await page.evaluate(()=>document.querySelector('.modal2_overlay').click());
		await page.waitFor(1000);
		md2OverlyClickGetDomStyle = await page.$eval('#modal2', el => el.getAttribute('style'));
		expect(md2OverlyClickGetDomStyle.indexOf('display: none') !== -1).toBe(true);
	}, 10000);
});

