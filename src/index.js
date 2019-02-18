import './style/common';
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import AddressPicker from './modules/AddressPicker';
import { formatWheelsData } from '~/utils/regionsWheelsHelper.js';

const data = formatWheelsData(window.BY_HEALTH_REGIONS);

window.newAddressPicker = new AddressPicker({
	trigger: '#example', // 触发Dom
	title: '地区选择',
	defaultValue: ['15', '1513', '151315'], // 默认选择的地址
	triggerDisplayData: true, // 是否在"触发Dom"中显示已选数据 默认false(mobile-select中默认true)
	wheels: [
		{ data } // 原始数据
	],
	// callback 确定后的回调，返回两个参数值，indexArr, data (分别代表当前选中wheels的位置和值)。
	callback(indexArr, data){
		console.log('callback', indexArr, data);
	},
	cancel(indexArr, data){
		console.log('取消', indexArr, data);
	}
});
