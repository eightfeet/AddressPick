import './style/common';
if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import MobileSelect from './modules/mobile-select';
const MBS = new MobileSelect({
	trigger: '#example',
	title: '地区选择',
	wheels: [
		{data:[
			{
				id:'1',
				value:'附近',
				childs:[
					{id:'1',value:'1000米'},
					{id:'2',value:'2000米'},
					{id:'3',value:'3000米'},
					{id:'4',value:'5000米'},
					{id:'5',value:'10000米'}
				]
			},
			{id:'2',value:'上城区'},
			{id:'3',value:'下城区'},
			{id:'4',value:'江干区'},
			{id:'5',value:'拱墅区'},
			{id:'6',value:'西湖区'}
		]}
	],
	transitionEnd(indexArr, data){
		console.log(indexArr, data);
	},
	callback(indexArr, data){
		console.log(data);
	}
});

console.log(MBS);

// import Modal from '@eightfeet/modal';


// let btn = document.getElementById('example');

// btn.onclick
	
