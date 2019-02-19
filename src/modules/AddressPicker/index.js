import MobileSelect from './../mobile-select';
import { getPositionByDefaultValue } from '~/utils/regionsWheelsHelper.js';
import s from './AddressPicker.scss';
import { inlineStyle } from '~/utils/tools';

class AddressPicker extends MobileSelect {
	constructor(data){
		const { defaultValue, regions, style } = data || {};
		const wheels = [
			{ data: regions } // 原始数据
		];
		const operatedData = {
			triggerDisplayData: false,
			...data,
			position: getPositionByDefaultValue(defaultValue, wheels),
			wheels,
			ensureBtnClass: s.btnEnsure,
			cancelBtnClass: s.btnCancel,
			overlayClass: s.overlay
		};
		super(operatedData);
		const ensureBtnElement = document.querySelector(`.${s.btnEnsure}`);
		const cancelBtnElement = document.querySelector(`.${s.btnCancel}`);
		const overlayElement = document.querySelector(`.${s.overlay}`);
		const {ensureBtn, cancelBtn, overlay} = style || {};

		if (ensureBtn) {
			const inLineEnsureBtn = inlineStyle(ensureBtn);
			inLineEnsureBtn && ensureBtnElement.setAttribute('style', inLineEnsureBtn);
		}
		if (cancelBtn) {
			const inLineCancelBtn = inlineStyle(cancelBtn);
			inLineCancelBtn && cancelBtnElement.setAttribute('style', inLineCancelBtn);
		}
		if (overlay) {
			const inLineOverly = inlineStyle(overlay);
			inLineOverly && overlayElement.setAttribute('style', inLineOverly);
		}
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