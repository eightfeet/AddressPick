import './style/common';
import data from './data.json';
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import MobileSelect from './modules/mobile-select';

// import Modal from '@eightfeet/modal';


// let btn = document.getElementById('example');

// btn.onclick

// import { createDom, removeDom } from '~/utils/htmlFactory.js';


// eslint-disable-next-line no-unused-vars
const newAddressPicker = new MobileSelect({
	trigger: '#example',
	title: '地区选择',
	wheels: [
		{data}
	],
	callback(arr, data){
		console.log(9999, data);
	}
});
