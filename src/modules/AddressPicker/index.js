import MobileSelect from './../mobile-select';
import { getPositionByDefaultValue } from '~/utils/regionsWheelsHelper.js';

class AddressPicker extends MobileSelect {
	constructor(data){
		const { defaultValue, regions } = data || {};
		const wheels = [
			{ data: regions } // 原始数据
		];
		const operatedData = { triggerDisplayData: false, ...data, position: getPositionByDefaultValue(defaultValue, wheels), wheels };
		console.log(operatedData.trigger);
		super(operatedData);
	}

	setPositionById = (data) => {
		this.initPosition = getPositionByDefaultValue(data, this.wheelsData);
	}

	upDatePicker = (data) => {
		const willData = this.wheelsData[0].data;
		this.setPositionById(data);
		this.updateWheels(willData);
	}

	showPicker = (data) => {
		if (Array.isArray(data) && data.length >= 2) {
			this.upDatePicker(data);
		}
		this.show();
	}
}

export default AddressPicker;