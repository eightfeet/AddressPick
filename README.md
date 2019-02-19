## 地址选择 AddressPicker
### AddressPicker extends MobileSelect
### case
```javascript

import AddressPicker from './modules/AddressPicker';
import { formatWheelsData } from '~/utils/regionsWheelsHelper.js';


/**
 * window.BY_HEALTH_REGIONS 省市区数据源，
 * cdn 地址为 http://by-health-cdn.oss-cn-beijing.aliyuncs.com/region/regions.js
 * 建议在项目头部预先引入
 *
 * window.BY_HEALTH_REGIONS的数据格式不能满足AddressPicker的数据结构，
 * 这里通过formatWheelsData对他做了一次格式化
 *
*/

const regions = formatWheelsData(window.BY_HEALTH_REGIONS);
window.newPicker = new AddressPicker({
	trigger: '#example', // 触发Dom
	title: '请选择省市区', // 设置标题
	defaultValue: ['15', '1513', '151315'], // 默认选择的地址
	// triggerDisplayData: true, // 是否在"触发Dom"中显示已选数据 默认false(mobile-select中默认true)
	regions, // 原始数据
	// callback 确定后的回调，返回两个参数值，indexArr, data (分别代表当前选中wheels的位置和值)。
	callback(indexArr, data){
		console.log('callback', indexArr, data);
	},
	// 取消后的回调
	cancel(indexArr, data){
		console.log('取消', indexArr, data);
	},
	// 控制样式
	style: {
		// 确定按钮
		ensureBtn: {
		},
		// 取消按钮
		cancelBtn: {
		},
		// 半透明覆盖层
		overlay: {
		}
	}
});

document.getElementById('exampleshow').onclick = function(){
	// 更新省市区位置（[省id, 市id, 区id]）
	window.newPicker.upDatePicker(['19', '1922', '192215']);
};
```
