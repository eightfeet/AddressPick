import s from './MobileSelect.scss';
import { getPositionByDefaultValue } from '~/utils/regionsWheelsHelper.js';
import { createDom, isPC } from '~/utils/htmlFactory';

import template from './template';

function getClass(dom, string) {
	return dom.getElementsByClassName(string);
}

class MobileSelect {
	constructor(config) {
		const { wheels, title } = config;
		const stamp = (new Date()).getTime();

		this.id = config.id || `MobileSelect${stamp}-${window.Math.floor(window.Math.random()*100)}`;
		this.titleText = title || '';
		this.mobileSelect;
		this.wheelsData = wheels;
		this.jsonType = false;
		this.cascadeJsonData = [];
		this.displayJson = [];
		this.curValue = [];
		this.curIndexArr = [];
		this.cascade = false;
		this.startY;
		this.moveEndY;
		this.moveY;
		this.oldMoveY;
		this.offset = 0;
		this.offsetSum = 0;
		this.oversizeBorder;
		this.curDistance = [];
		this.clickStatus = false;
		this.isPC = isPC;
		this.init(config);
	}

	init = config => {
		if (config.wheels[0].data.length === 0) {
			console.error(
				'mobileSelect has been successfully installed, but the data is empty and cannot be initialized.'
			);
			return false;
		}
		this.keyMap = config.keyMap
			? config.keyMap
			: { id: 'id', value: 'value', childs: 'childs' };
		this.checkDataType();
		this.renderWheels(
			this.wheelsData,
			config.cancelBtnText,
			config.ensureBtnText,
			config.titleText
		);
		this.trigger = document.querySelector(config.trigger);
		if (!this.trigger) {
			console.error(
				'mobileSelect has been successfully installed, but no trigger found on your page.'
			);
			return false;
		}
		this.mobileSelect = document.getElementById(this.id);
		this.wheel = getClass(this.mobileSelect, s.wheel);
		this.slider = getClass(this.mobileSelect, s.selectContainer);
		this.wheels = this.mobileSelect.querySelector(`.${s.wheels}`);
		this.liHeight = this.mobileSelect.querySelector('li').offsetHeight;
		this.ensureBtn = this.mobileSelect.querySelector(`.${s.ensure}`);
		this.cancelBtn = this.mobileSelect.querySelector(`.${s.cancel}`);
		this.grayLayer = this.mobileSelect.querySelector(`.${s.grayLayer}`);
		this.popUp = this.mobileSelect.querySelector(`.${s.content}`);
		this.onConfirm = config.onConfirm || function () { };
		this.onCancel = config.onCancel || function () { };
		this.transitionEnd = config.transitionEnd || function () { };
		this.onShow = config.onShow || function () { };
		this.onHide = config.onHide || function () { };
		this.initPosition = [];

		if (config.defaultValue && config.defaultValue.length > 0) {
			this.initPosition = getPositionByDefaultValue(config.defaultValue, this.wheelsData[0].data, this.keyMap);
		}

		if (config.position && config.position.length > 0) {
			this.initPosition = config.position;
		}
		
		this.connector = config.connector || ' ';
		this.triggerDisplayData = !(
			typeof config.triggerDisplayData === 'undefined'
		)
			? config.triggerDisplayData
			: true;
		this.trigger.style.cursor = 'pointer';
		this.checkCascade();
		this.addListenerAll();
		if (this.cascade) {
			this.initCascade();
		}
		//定位 初始位置
		if (this.initPosition.length < this.slider.length) {
			let diff = this.slider.length - this.initPosition.length;
			for (let i = 0; i < diff; i++) {
				this.initPosition.push(0);
			}
		}

		this.setCurDistance(this.initPosition);

		//按钮监听
		this.cancelBtn.addEventListener('click', () => {
			this.hide();
			this.onCancel(this.curIndexArr, this.curValue);
		});

		this.ensureBtn.addEventListener('click', () => {
			this.hide();
			if (!this.liHeight) {
				this.liHeight = this.mobileSelect.querySelector('li').offsetHeight;
			}
			let tempValue = '';
			for (let i = 0; i < this.wheel.length; i++) {
				i === this.wheel.length - 1
					? (tempValue += this.getInnerHtml(i))
					: (tempValue += this.getInnerHtml(i) + this.connector);
			}
			if (this.triggerDisplayData) {
				this.trigger.innerHTML = tempValue;
			}
			this.curIndexArr = this.getIndexArr();
			this.curValue = this.getCurValue();
			this.onConfirm(this.curIndexArr, this.curValue);
		});

		this.trigger.addEventListener('click', () => {
			this.show();
		});
		this.grayLayer.addEventListener('click', () => {
			this.hide();
			this.onCancel(this.curIndexArr, this.curValue);
		});
		this.popUp.addEventListener('click', () => {
			event.stopPropagation();
		});

		this.fixRowStyle(); //修正列数
	};

	show = () => {
		this.mobileSelect.children[0].classList.add(s['mobileSelect-show']);
		if (typeof this.onShow === 'function') {
			this.onShow(this);
		}
	};

	hide = () => {
		this.mobileSelect.children[0].classList.remove(s['mobileSelect-show']);
		if (typeof this.onHide === 'function') {
			this.onHide(this);
		}
	};

	renderWheels = (wheelsData, cancelBtnText, ensureBtnText) => {
		let cancelText = cancelBtnText ? cancelBtnText : '取消';
		let ensureText = ensureBtnText ? ensureBtnText : '确认';
		createDom(
			template({
				wheelsData,
				cancelText,
				ensureText,
				titleText: this.titleText,
				keyMap: this.keyMap,
				id: this.id
			}, this.jsonType),
			this.id
		);
	};

	addListenerAll = () => {
		for (let i = 0; i < this.slider.length; i++) {
			//手势监听
			this.addListenerWheel(this.wheel[i], i);
		}
	};

	addListenerWheel = (theWheel, index) => {
		const _this = this;
		theWheel.addEventListener(
			'touchstart',
			function () {
				_this.touch(event, this.firstChild, index);
			},
			false
		);
		theWheel.addEventListener(
			'touchend',
			function () {
				_this.touch(event, this.firstChild, index);
			},
			false
		);
		theWheel.addEventListener(
			'touchmove',
			function () {
				_this.touch(event, this.firstChild, index);
			},
			false
		);

		if (this.isPC) {
			//如果是PC端则再增加拖拽监听 方便调试
			theWheel.addEventListener(
				'mousedown',
				function () {
					_this.dragClick(event, this.firstChild, index);
				},
				false
			);
			theWheel.addEventListener(
				'mousemove',
				function () {
					_this.dragClick(event, this.firstChild, index);
				},
				false
			);
			theWheel.addEventListener(
				'mouseup',
				function () {
					_this.dragClick(event, this.firstChild, index);
				},
				true
			);
		}
	};

	checkDataType = () => {
		if (typeof this.wheelsData[0].data[0] === 'object') {
			this.jsonType = true;
		}
	};

	checkCascade = () => {
		if (this.jsonType) {
			let node = this.wheelsData[0].data;
			for (let i = 0; i < node.length; i++) {
				if (
					this.keyMap.childs in node[i] &&
					node[i][this.keyMap.childs].length > 0
				) {
					this.cascade = true;
					this.cascadeJsonData = this.wheelsData[0].data;
					break;
				}
			}
		} else {
			this.cascade = false;
		}
	};

	generateArrData = targetArr => {
		let tempArr = [];
		let keyMap_id = this.keyMap.id;
		let keyMap_value = this.keyMap.value;
		for (let i = 0; i < targetArr.length; i++) {
			let tempObj = {};
			tempObj[keyMap_id] = targetArr[i][this.keyMap.id];
			tempObj[keyMap_value] = targetArr[i][this.keyMap.value];
			tempArr.push(tempObj);
		}
		return tempArr;
	};

	initCascade = () => {
		this.displayJson.push(this.generateArrData(this.cascadeJsonData));
		if (this.initPosition.length > 0) {
			this.initDeepCount = 0;
			this.initCheckArrDeep(this.cascadeJsonData[this.initPosition[0]]);
		} else {
			this.checkArrDeep(this.cascadeJsonData[0]);
		}
		this.reRenderWheels();
	};

	initCheckArrDeep = parent => {
		if (parent) {
			if (
				this.keyMap.childs in parent &&
				parent[this.keyMap.childs].length > 0
			) {
				this.displayJson.push(this.generateArrData(parent[this.keyMap.childs]));
				this.initDeepCount++;
				let nextNode =
					parent[this.keyMap.childs][this.initPosition[this.initDeepCount]];
				if (nextNode) {
					this.initCheckArrDeep(nextNode);
				} else {
					this.checkArrDeep(parent[this.keyMap.childs][0]);
				}
			}
		}
	};

	checkArrDeep = parent => {
		//检测子节点深度  修改 displayJson
		if (parent) {
			if (
				this.keyMap.childs in parent &&
				parent[this.keyMap.childs].length > 0
			) {
				this.displayJson.push(this.generateArrData(parent[this.keyMap.childs])); //生成子节点数组
				this.checkArrDeep(parent[this.keyMap.childs][0]); //检测下一个子节点
			}
		}
	};

	checkRange = (index, posIndexArr) => {
		let deleteNum = this.displayJson.length - 1 - index;
		for (let i = 0; i < deleteNum; i++) {
			this.displayJson.pop(); //修改 displayJson
		}
		let resultNode;
		for (let i = 0; i <= index; i++) {
			if (i === 0) resultNode = this.cascadeJsonData[posIndexArr[0]];
			else {
				resultNode = resultNode[this.keyMap.childs][posIndexArr[i]];
			}
		}
		this.checkArrDeep(resultNode);
		//console.log(this.displayJson);
		this.reRenderWheels();
		this.fixRowStyle();
		this.setCurDistance(this.resetPosition(index, posIndexArr));
	};

	resetPosition = (index, posIndexArr) => {
		let tempPosArr = posIndexArr;
		let tempCount;
		if (this.slider.length > posIndexArr.length) {
			tempCount = this.slider.length - posIndexArr.length;
			for (let i = 0; i < tempCount; i++) {
				tempPosArr.push(0);
			}
		} else if (this.slider.length < posIndexArr.length) {
			tempCount = posIndexArr.length - this.slider.length;
			for (let i = 0; i < tempCount; i++) {
				tempPosArr.pop();
			}
		}
		for (let i = index + 1; i < tempPosArr.length; i++) {
			tempPosArr[i] = 0;
		}
		return tempPosArr;
	};

	reRenderWheels = () => {
		//删除多余的wheel
		if (this.wheel.length > this.displayJson.length) {
			let count = this.wheel.length - this.displayJson.length;
			for (let i = 0; i < count; i++) {
				this.wheels.removeChild(this.wheel[this.wheel.length - 1]);
			}
		}
		for (let i = 0; i < this.displayJson.length; i++) {
			//列
			let tempHTML = '';
			if (this.wheel[i]) {
				//console.log('插入Li');
				for (let j = 0; j < this.displayJson[i].length; j++) {
					//行
					tempHTML += `<li data-id="${
						this.displayJson[i][j][this.keyMap.id]
					}">${this.displayJson[i][j][this.keyMap.value]}</li>`;
				}
				this.slider[i].innerHTML = tempHTML;
			} else {
				let tempWheel = document.createElement('div');
				tempWheel.className = s.wheel;
				tempHTML = `<ul class="${s.selectContainer} ${this.id}_selectcontainer">`;
				for (let j = 0; j < this.displayJson[i].length; j++) {
					//行
					tempHTML += `<li class="${this.id}_selectcontainer_${i}_${j}" data-id="${
						this.displayJson[i][j][this.keyMap.id]
					}">${this.displayJson[i][j][this.keyMap.value]}</li>`;
				}
				tempHTML += '</ul>';
				tempWheel.innerHTML = tempHTML;

				this.addListenerWheel(tempWheel, i);
				this.wheels.appendChild(tempWheel);
			}
		}
	};

	updateWheels = data => {
		if (this.cascade) {
			this.cascadeJsonData = data;
			this.displayJson = [];
			this.initCascade();
			if (this.initPosition.length < this.slider.length) {
				let diff = this.slider.length - this.initPosition.length;
				for (let i = 0; i < diff; i++) {
					this.initPosition.push(0);
				}
			}
			this.setCurDistance(this.initPosition);
			this.fixRowStyle();
		}
	};

	updateWheel = (sliderIndex, data) => {
		let tempHTML = '';
		if (this.cascade) {
			console.error(
				'级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源'
			);
			return false;
		} else if (this.jsonType) {
			for (let j = 0; j < data.length; j++) {
				tempHTML +=
					`<li data-id="
					${data[j][this.keyMap.id]}">
					${data[j][this.keyMap.value]}
					</li>`;
			}
			this.wheelsData[sliderIndex] = { data };
		} else {
			for (let j = 0; j < data.length; j++) {
				tempHTML += `<li>${data[j]}</li>`;
			}
			this.wheelsData[sliderIndex] = data;
		}
		this.slider[sliderIndex].innerHTML = tempHTML;
	};

	fixRowStyle = () => {
		let width = (100 / this.wheel.length).toFixed(2);
		for (let i = 0; i < this.wheel.length; i++) {
			this.wheel[i].style.width = width + '%';
		}
	};

	getIndex = distance => {
		return Math.round((2 * this.liHeight - distance) / this.liHeight);
	};

	getIndexArr = () => {
		let temp = [];
		for (let i = 0; i < this.curDistance.length; i++) {
			temp.push(this.getIndex(this.curDistance[i]));
		}
		return temp;
	};

	getCurValue = () => {
		let temp = [];
		let positionArr = this.getIndexArr();
		if (this.cascade) {
			for (let i = 0; i < this.wheel.length; i++) {
				temp.push(this.displayJson[i][positionArr[i]]);
			}
		} else if (this.jsonType) {
			for (let i = 0; i < this.curDistance.length; i++) {
				temp.push(this.wheelsData[i].data[this.getIndex(this.curDistance[i])]);
			}
		} else {
			for (let i = 0; i < this.curDistance.length; i++) {
				temp.push(this.getInnerHtml(i));
			}
		}
		return temp;
	};

	getValue = () => {
		return this.curValue;
	};

	calcDistance = index => {
		return 2 * this.liHeight - index * this.liHeight;
	};

	setCurDistance = indexArr => {
		let temp = [];
		for (let i = 0; i < this.slider.length; i++) {
			temp.push(this.calcDistance(indexArr[i]));
			this.movePosition(this.slider[i], temp[i]);
		}
		this.curDistance = temp;
	};

	fixPosition = distance => {
		return -(this.getIndex(distance) - 2) * this.liHeight;
	};

	movePosition = (theSlider, distance) => {
		theSlider.style.webkitTransform = 'translate3d(0,' + distance + 'px, 0)';
		theSlider.style.transform = 'translate3d(0,' + distance + 'px, 0)';
	};

	locatePosition = (index, posIndex) => {
		this.curDistance[index] = this.calcDistance(posIndex);
		this.movePosition(this.slider[index], this.curDistance[index]);
		if (this.cascade) {
			this.checkRange(index, this.getIndexArr());
		}
	};

	updateCurDistance = (theSlider, index) => {
		if (theSlider.style.transform) {
			this.curDistance[index] = parseInt(
				theSlider.style.transform.split(',')[1],
				10
			);
		} else {
			this.curDistance[index] = parseInt(
				theSlider.style.webkitTransform.split(',')[1],
				10
			);
		}
	};

	getDistance = theSlider => {
		if (theSlider.style.transform) {
			return parseInt(theSlider.style.transform.split(',')[1], 10);
		}
		return parseInt(theSlider.style.webkitTransform.split(',')[1], 10);
	};

	getInnerHtml = sliderIndex => {
		let index = this.getIndex(this.curDistance[sliderIndex]);
		return this.slider[sliderIndex].getElementsByTagName('li')[index].innerHTML;
	};

	touch = (event, theSlider, index) => {
		event = event || window.event;
		switch (event.type) {
			case 'touchstart':
				this.startY = event.touches[0].clientY;
				this.startY = parseInt(this.startY, 10);
				this.oldMoveY = this.startY;
				break;

			case 'touchend':
				this.moveEndY = parseInt(event.changedTouches[0].clientY, 10);
				this.offsetSum = this.moveEndY - this.startY;
				this.oversizeBorder =
					-(theSlider.getElementsByTagName('li').length - 3) * this.liHeight;

				if (this.offsetSum === 0) {
					//offsetSum为0,相当于点击事件
					// 0 1 [2] 3 4
					let clickOffetNum = parseInt(
						(document.documentElement.clientHeight - this.moveEndY) / 40,
						10
					);
					if (clickOffetNum !== 2) {
						let offset = clickOffetNum - 2;
						let newDistance = this.curDistance[index] + offset * this.liHeight;
						if (
							newDistance <= 2 * this.liHeight &&
							newDistance >= this.oversizeBorder
						) {
							this.curDistance[index] = newDistance;
							this.movePosition(theSlider, this.curDistance[index]);
							this.transitionEnd(this.getIndexArr(), this.getCurValue());
						}
					}
				} else {
					//修正位置
					this.updateCurDistance(theSlider, index);
					this.curDistance[index] = this.fixPosition(this.curDistance[index]);
					this.movePosition(theSlider, this.curDistance[index]);

					//反弹
					if (this.curDistance[index] + this.offsetSum > 2 * this.liHeight) {
						this.curDistance[index] = 2 * this.liHeight;
						setTimeout(() => {
							this.movePosition(theSlider, this.curDistance[index]);
						}, 100);
					} else if (
						this.curDistance[index] + this.offsetSum <
						this.oversizeBorder
					) {
						this.curDistance[index] = this.oversizeBorder;
						setTimeout(() => {
							this.movePosition(theSlider, this.curDistance[index]);
						}, 100);
					}
					this.transitionEnd(this.getIndexArr(), this.getCurValue());
				}

				if (this.cascade) {
					this.checkRange(index, this.getIndexArr());
				}

				break;

			case 'touchmove':
				event.preventDefault();
				this.moveY = event.touches[0].clientY;
				this.offset = this.moveY - this.oldMoveY;

				this.updateCurDistance(theSlider, index);
				this.curDistance[index] = this.curDistance[index] + this.offset;
				this.movePosition(theSlider, this.curDistance[index]);
				this.oldMoveY = this.moveY;
				break;
		}
	};

	dragClick = (event, theSlider, index) => {
		event = event || window.event;
		switch (event.type) {
			case 'mousedown':
				this.startY = event.clientY;
				this.oldMoveY = this.startY;
				this.clickStatus = true;
				break;

			case 'mouseup':
				this.moveEndY = event.clientY;
				this.offsetSum = this.moveEndY - this.startY;
				this.oversizeBorder =
					-(theSlider.getElementsByTagName('li').length - 3) * this.liHeight;

				if (this.offsetSum === 0) {
					let clickOffetNum = parseInt(
						(document.documentElement.clientHeight - this.moveEndY) / 40,
						10
					);
					if (clickOffetNum !== 2) {
						let offset = clickOffetNum - 2;
						let newDistance = this.curDistance[index] + offset * this.liHeight;
						if (
							newDistance <= 2 * this.liHeight &&
							newDistance >= this.oversizeBorder
						) {
							this.curDistance[index] = newDistance;
							this.movePosition(theSlider, this.curDistance[index]);
							this.transitionEnd(this.getIndexArr(), this.getCurValue());
						}
					}
				} else {
					//修正位置
					this.updateCurDistance(theSlider, index);
					this.curDistance[index] = this.fixPosition(this.curDistance[index]);
					this.movePosition(theSlider, this.curDistance[index]);

					//反弹
					if (this.curDistance[index] + this.offsetSum > 2 * this.liHeight) {
						this.curDistance[index] = 2 * this.liHeight;
						setTimeout(() => {
							this.movePosition(theSlider, this.curDistance[index]);
						}, 100);
					} else if (
						this.curDistance[index] + this.offsetSum <
						this.oversizeBorder
					) {
						this.curDistance[index] = this.oversizeBorder;
						setTimeout(() => {
							this.movePosition(theSlider, this.curDistance[index]);
						}, 100);
					}
					this.transitionEnd(this.getIndexArr(), this.getCurValue());
				}

				this.clickStatus = false;
				if (this.cascade) {
					this.checkRange(index, this.getIndexArr());
				}
				break;

			case 'mousemove':
				event.preventDefault();
				if (this.clickStatus) {
					this.moveY = event.clientY;
					this.offset = this.moveY - this.oldMoveY;
					this.updateCurDistance(theSlider, index);
					this.curDistance[index] = this.curDistance[index] + this.offset;
					this.movePosition(theSlider, this.curDistance[index]);
					this.oldMoveY = this.moveY;
				}
				break;
		}
	};
	
	updatePicker = (data, callback) => {
		const willData = this.wheelsData[0].data;
		this.initPosition = getPositionByDefaultValue(data, this.wheelsData[0].data, this.keyMap);
		this.updateWheels(willData);
		window.setTimeout(() => callback && callback(), 100);
	};

	showPicker = data => {
		if (Array.isArray(data) && data.length >= 2) {
			this.updatePicker(data);
		}
		this.show();
	};
}

export default MobileSelect;
