import MobileSelect from "./../MobileSelect";
import { getPositionByDefaultValue } from "~/utils/regionsWheelsHelper.js";
import { inlineStyle } from "~/utils/tools";
import m from "./../MobileSelect/MobileSelect.scss";

const stamp = new Date().getTime();

class AddressPicker extends MobileSelect {
	constructor(data) {
		const { defaultValue, regions, style, popularCities } = data || {};
		const wheels = [
			{ data: regions } // 原始数据
		];
		const operatedData = {
			triggerDisplayData: false,
			...data,
			position: getPositionByDefaultValue(defaultValue, wheels),
			wheels,
			id: `AddressPicker-${stamp}${window.Math.floor(
				window.Math.random() * 100
			)}`
		};
		super(operatedData);
		this.popularCities = popularCities;
		this.initAddressPicker(style);
	}

	initAddressPicker = style => {
		const ensureBtnElement = this.mobileSelect.querySelector(`.${m.btnEnsure}`);
		const cancelBtnElement = this.mobileSelect.querySelector(`.${m.btnCancel}`);
		const overlayElement = this.mobileSelect.querySelector(`.${m.overlay}`);
		const contentElement = this.mobileSelect.querySelector(`.${m.content}`);
		const btnBarElement = this.mobileSelect.querySelector(`.${m.btnBar}`);

		if (this.popularCities && Array.isArray(this.popularCities)) {
			let popularCityDom = document.createElement("div");
			popularCityDom.innerHTML = `<h3 class="${m.hottitle}">热门城市</h3>`;
			popularCityDom.classList.add(m.popularcities);
			popularCityDom.classList.add(m.clearfix);

			this.popularCities.forEach(item => {
				const div = document.createElement("div");
				div.innerHTML = item.name;
				div.setAttribute("data-id", item.id);
				div.addEventListener("click", e => {
					let positionData = e.target.getAttribute("data-id");
					if (positionData) {
						positionData = positionData.split(",");
					}
					this.upDatePicker(positionData);
				});
				popularCityDom.appendChild(div);
			});
			contentElement.insertBefore(popularCityDom, btnBarElement);
		}

		const { ensureBtn, cancelBtn, overlay } = style || {};

		if (ensureBtn) {
			const inLineEnsureBtn = inlineStyle(ensureBtn);
			inLineEnsureBtn &&
				ensureBtnElement.setAttribute("style", inLineEnsureBtn);
		}
		if (cancelBtn) {
			const inLineCancelBtn = inlineStyle(cancelBtn);
			inLineCancelBtn &&
				cancelBtnElement.setAttribute("style", inLineCancelBtn);
		}
		if (overlay) {
			const inLineOverly = inlineStyle(overlay);
			inLineOverly && overlayElement.setAttribute("style", inLineOverly);
		}
	};

	setPositionById = data => {
		this.initPosition = getPositionByDefaultValue(data, this.wheelsData);
	};

	upDatePicker = (data, callback) => {
		const willData = this.wheelsData[0].data;
		this.setPositionById(data);
		this.updateWheels(willData);
		window.setTimeout(() => callback && callback(), 100);
	};

	showPicker = data => {
		if (Array.isArray(data) && data.length >= 2) {
			this.upDatePicker(data);
		}
		this.show();
	};
}

export default AddressPicker;
