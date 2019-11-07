// Provinces, cities and counties

export function formatWheelsData(data){
	const provinces = [];
	const cities = [];
	const counties = [];
    
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const items = data[key];
			for (const el in items) {
				if (Object.prototype.hasOwnProperty.call(items, el)) {
					const element = items[el];
					if (el.length === 2) {
						provinces.push({
							id: el,
							value: element,
							childs: []
						});
					}
					if (el.length === 4) {
						cities.push({
							id: el,
							value: element,
							childs: []
						});
					}
					if (el.length === 6) {
						counties.push({
							id: el,
							value: element
						});
					}
				}
			}
		}
	}
    
	for (let indexP = 0; indexP < provinces.length; indexP++) {
		const elementP = provinces[indexP];
		const elementPChild = elementP.childs;
	    for (let indexCi = 0; indexCi < cities.length; indexCi++) {
			const elementCi = cities[indexCi];
			const elementCiChild = elementCi.childs;
			if (elementP.id === elementCi.id.slice(0, 2)) {
				elementPChild.push(elementCi);
				for (let indexC = 0; indexC < counties.length; indexC++) {
					const elementC = counties[indexC];
					if (elementCi.id === elementC.id.slice(0, 4)) {
						elementCiChild.push(elementC);
					}
				}
			}
	    }
        
	}

	return provinces;
}

export function getPositionByDefaultValue(defaultval, data, keyMap) {
	const position =[];
	let deepth = 0;

	const loop = (array) => {
		array.forEach((element, index) => {
			if (deepth >= defaultval.length) {
				return;
			}
			if (defaultval[deepth] === element[keyMap.id]) {
				position.push(index);
				deepth++;
				if (Array.isArray(element[keyMap.childs]) && element[keyMap.childs].length > 0) {
					loop(element[keyMap.childs]);
				}
			}
		});
	};

	loop(data);
	return position;
}
