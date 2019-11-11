import jssCamelCase from 'jss-camel-case';
// 翻译js中的驼峰css
const { onProcessStyle } = new jssCamelCase();

/**
 * Prefix Browser Support
 * It supports all major browsers with the following versions. For other, unsupported browses, we automatically use a fallback.

 * Chrome: 55+
 * Android (Chrome): 55+
 * Android (Stock Browser): 5+
 * Android (UC): 11+
 * Firefox: 52+
 * Safari: 9+
 * iOS (Safari): 9+
 * Opera: 30+
 * Opera (Mini): 12+
 * IE: 11+
 * IE (Mobile): 11+
 * Edge: 12+
 * It will only add prefixes if a property still needs them in one of the above mentioned versions.
 * Therefore, e.g. border-radius will not be prefixed at all.
 */
import { prefix } from 'inline-style-prefixer';

/**
 * @export
 * @param {Object} style
 * @returns
 */
export function inlineStyle(style) {
	let oprationStyle = prefix(style || {});
	oprationStyle = onProcessStyle(oprationStyle);
	const keys = Object.keys(oprationStyle);
	let result = null;
	keys.forEach(item => {
		result = (result||'') + `${item}:${oprationStyle[item]};`;
	});
	return result;
}

export function fixpx(px) {
	// eslint-disable-next-line no-undef
	return px ? `${parseFloat(px)/parseFloat(__BASEFONT__)}em`: 0;
}


export function setCssEndEvent(element, type) {
	return new Promise((resolve) => {
		if (!element) {
			resolve(false);
			return;
		}
		let eventName = null;
		const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
		function end(event) {
			const target = event.srcElement || event.target;
			if (target === element) {
				element.removeEventListener(eventName, end);
				resolve(event);
			}
		}
		if (element.style[`Webkit${capitalized}`] !== undefined) {
			eventName = `webkit${capitalized}End`;
		}
		if (element.style.OTransition !== undefined) {
			eventName = `o${type}End`;
		}
		if (element.style[type] !== undefined) {
			eventName = `${type}end`;
		}
		element.addEventListener(eventName, end);
	});
}

export function onceElementTransitionEnd(element, options = {}) {
	return new Promise((resolve) => {
		setCssEndEvent(element, 'transition', options).then(resolve);
	});
}

export function dormancyFor(time) {
	return new Promise(resolve => window.setTimeout(()=>resolve(), time));
}