# Picker

AddressPicker   MobileSelect

<a href="http://www.eightfeet.cn/AddressPicker/dist/index.html" traget="_blank" >demo</a>

### AddressPicker

地址选择器 AddressPicker extends MobileSelect

#### parame

| 参数               | 说明                             | 是否必填 | 备注                                                         | 类型     |
| ------------------ | -------------------------------- | -------- | ------------------------------------------------------------ | -------- |
| id                 | 所创建AddressPicker的id          | 否       | 不传可自动生成id（AddressPicker + 时间戳 + 100以内的随机数） | String   |
| trigger            | 触发显示地址选择器的trigger Node | 是       | 建议使用id，如<br />{<br />      trigger: "#trigger"<br />}  | String   |
| triggerDisplayData | 是否在trigger Node中显示所选值   | 否       | 默认false<br />(MobileSelect中默认true)                      | Boolean  |
| title              | 设置标题，不填隐藏               | 否       | 默认不填                                                     | String   |
| defaultValue       | 默认选择的地址                   | 否       | 数组，省市区id组成<br />['15', '1513', '151315']             | Array    |
| onConfirm          | 确认                             | 否       | 确定后的回调，返回两个参数值，1、indexArr（选中值在wheels上的位置）, 2、data (所选省市区的value值)。 | Function |
| onCancel           | 取消                             | 否       | 取消后的回调，返回两个参数值，1、indexArr（上次选中值在wheels上的位置）, 2、data (上次所选省市区的value值)。 | Function |
| popularCities      | 显示热门城市                     | 否       | 默认不填隐藏<br />数据结构<br />[<br />    { name: '北京', id: ['12', '1210'] },<br />    { name: '上海', id: ['34', '3410'] },<br />...<br />] | Array    |
| style              | 样式定义                         | 否       | 定义AddressPicker样式<br /> {<br />    overlay: 覆盖层, <br />    confirmBtn: 确定按钮, <br />    cancelBtn: 取消按钮， <br />    popularCities: 热门城市<br />    popularCitiesTitle: 热门城市标题<br />    popularCitiesItem: 热门城市项<br />} <br /> | css      |



#### options

1. ##### showPicker：f(data) 显示AddressPicker

   data: Array 省市区id

   > 如 ['10','1010','101010']

2. ##### upDatePicker: f(data, callback) 显示

   data: Array 省市区id

   > 如 ['10','1010','101010']

   callback: f() 更新选择地址后的回调



### case

```javascript

import AddressPicker from './modules/AddressPicker';

// 省市区数据源
const regions = [
  {
    "id": "10",
    "value": "安徽",
    "childs": [
      {
        "id": "1010",
        "value": "安庆",
        "childs": [
          {
            "id": "101010",
            "value": "迎江区"
          },
          {
            "id": "101011",
            "value": "大观区"
          },
          {
            "id": "101012",
			"value": ...
		  }
		]
	  }
	]
  }
  ...
]

// 热门城市
const popularCities = [
    {name: '北京', id: ['12', '1210']},
    {name: '上海', id: ['34', '3410']},
    {name: '广州', id: ['15', '1513']},
    {name: '深圳', id: ['15', '1524']},
    {name: '杭州', id: ['43', '4311']},
    {name: '南京', id: ['26', '2613']},
    {name: '天津', id: ['37', '3710']},
    {name: '苏州', id: ['26', '2616']},
    {name: '长沙', id: ['24', '2411']},
    {name: '重庆', id: ['13', '1310']},
    {name: '成都', id: ['32', '3212']}
];

const newPicker = new AddressPicker({
    id: '555666',
    trigger: '#example', // 触发Dom
    title: '请选择省市区', // 设置标题
    // defaultValue: ['15', '1513', '151315'], // 默认选择的地址
    triggerDisplayData: true, // 是否在"触发Dom"中显示已选数据 默认false
    regions: regions, // 原始数据
    popularCities: popularCities,
    //确定后的回调，返回两个参数值，indexArr, data (分别代表当前选中wheels的位置和值)。
    onConfirm: function(indexArr, data){
        console.log('callback', indexArr, data);
    },
    // 取消后的回调
    onCancel: function(indexArr, data){
        console.log('取消', indexArr, data);
    },
    // 控制样式
    style: {
        // 确定按钮
        confirmBtn: {
            backgroundColor: '#7fb581',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px'
        },
        // 取消按钮
        cancelBtn: {
            backgroundColor: '#eee',
            padding: '5px 10px',
            borderRadius: '5px'
        },
        // 半透明覆盖层
        overlay: {
        },
        // 热门城市
        popularCities: {
            backgroundColor: '#efefef',
        },
        popularCitiesTitle: {
        },
        popularCitiesItem: {
        }
    }
});

document.getElementById('exampleshow').onclick = function(){
		// 更新省市区位置 arguments:([省id, 市id, 区id], callback)
		window.newPicker.upDatePicker(['19', '1922', '192215'], () => {
			// 显示AddressPicker
			window.newPicker.showPicker();
		})
	};
```

