import creatTemplate from '~/modules/Modal/template/index.js';

describe('Create a Modal template', () => {
	it('The default value is correct without parameters id', () => {
		const template = creatTemplate();
		expect((
			template.indexOf('modal_wrap') !== -1 &&
			template.indexOf('modal_overlay') !== -1 &&
			template.indexOf('modal_content_wrap') !== -1 &&
			template.indexOf('modal_content') !== -1 &&
			template.indexOf('modal_modules') !== -1 &&
			template.indexOf('animate_zoom_in') !== -1 &&
			template.indexOf('z-index:100; transition-duration: 0.3s; -webkit-transition-duration: 0.3s;') !== -1
		)).toBe(true);
	});

	it('The returned result should be correct when the parameter id = "mid"', () => {
		const template = creatTemplate(null, null, 'mid');
		expect((
			template.indexOf('mid_wrap') !== -1 &&
			template.indexOf('mid_overlay') !== -1 &&
			template.indexOf('mid_content_wrap') !== -1 &&
			template.indexOf('mid_content') !== -1 &&
			template.indexOf('mid_modules') !== -1
		)).toBe(true);
	});

	it('The default value is correct without parameters "elements"', () => {
		const template = creatTemplate();
		expect((
			template.indexOf('modal_header') === -1 &&
			template.indexOf('modal_article') === -1 &&
			template.indexOf('modal_footer') === -1
		)).toBe(true);
	});

	it('The returned result should be correct when the parameter "elements"', () => {
		const template = creatTemplate({
			header: '<div>this is header</div>',
			article: '<div>this is article</div>',
			footer: '<div>this is footer</div>'
		});
		expect((
			template.indexOf('modal_header') !== -1 &&
			template.indexOf('<div>this is header</div>') !== -1 &&
			template.indexOf('modal_article') !== -1 &&
			template.indexOf('<div>this is article</div>') !== -1 &&
			template.indexOf('modal_footer') !== -1 &&
			template.indexOf('<div>this is footer</div>') !== -1
		)).toBe(true);
	});

	it('The returned result should be correct when the parameter "config"', () => {
		const template = creatTemplate(null, {
			style:{
				overlay:{ backgroundColor: 'red' },
				content:{ backgroundColor: 'green' },
				modify:[{ backgroundColor: 'yellow' }],
				close:{ backgroundColor: 'blue' }
			},
			closable: true,
			zIndex: 2000,
			animation: {
				form: 'fadeInRight',
				duration: '500'
			}
		}, null);
		expect((
			template.indexOf('background-color:red;') !== -1 &&
			template.indexOf('background-color:green;') !== -1 &&
			template.indexOf('background-color:yellow;') !== -1 &&
			template.indexOf('z-index:2000') !== -1 &&
			template.indexOf('animate_in_right') !== -1 &&
			template.indexOf('transition-duration: 500s') !== -1
		)).toBe(true);
	});

	// 设置Modal不可关闭时，不会有close Node
	it('The returned result should be correct when the parameter "config.closable = false"', () => {
		const template = creatTemplate(null, {
			closable: false,
			style: {
				close:{ backgroundColor: 'blue' }
			}
		}, null);
		expect((
			template.indexOf('modal_close') === -1
		)).toBe(true);
	});

});