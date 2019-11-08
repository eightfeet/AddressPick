# Picker

AddressPicker   MobileSelect

<a href="http://www.eightfeet.cn/AddressPicker/dist/index.html" traget="_blank" >demo</a>

### MobileSelect

#### parame

| 参数               | 说明                               | 是否必填 | 备注                                                         | 类型     |
| ------------------ | ---------------------------------- | -------- | ------------------------------------------------------------ | -------- |
| id                 | 即将创建MobileSelect的id           | 否       | 不传可自动生成id（MobileSelect + 时间戳 + 100以内的随机数），通过这个id可以识别（或覆写）到Picker的内部DOM元素 | String   |
| trigger            | 触发显示地址选择器的trigger Node   | 是       | class name或id都可以，为了准确找到Node建议使用id，           | String   |
| triggerDisplayData | 是否在trigger Node中显示所选值     | 否       | 默认true<br />(AddressPicker中默认false)                     | Boolean  |
| title              | 设置标题，不填隐藏                 | 否       | 默认不填                                                     | String   |
| onConfirm          | 确认                               | 否       | 确定后的回调，返回两个参数值，1、indexArr（选中值在每个滚动列上的索引位置）, 2、data (所选省市区的value值)。 | Function |
| onCancel           | 取消                               | 否       | 取消后的回调，返回两个参数值，1、indexArr（上次选中值在每个滚动列上的索引位置）, 2、data (上次所选省市区的value值)。 | Function |
| transitionEnd      | 选中项的transition动画结束后的回调 | 否       | 选取后的回调，返回两个参数值，1、indexArr（选中值在每个滚动列上的索引位置）, 2、data (所选省市区的value值)。 | Function |
| onShow             | 显示                               | 否       | 显示picker时的回调                                           | Function |
| onHide             | 隐藏                               | 否       | 隐藏picker时的回调                                           | Function |
| defaultValue       | 默认选择的索引                     | 否       | 显示默认索引位置 ['1', '1', '1']                             | Array    |
| ensureBtnColor     | 确定按钮字体颜色                   | 否       | #000                                                         | String   |
| cancelBtnColor     | 取消按钮字体颜色                   | 否       | #000                                                         | String   |
| textColor          | 文本颜色                           | 否       | #000                                                         | String   |
| titleColor         | 标题颜色                           | 否       | #000                                                         | String   |
| titleBgColor       | 标题背景色                         | 否       | #000                                                         | String   |
| bgColor            | 背景颜色                           | 否       | #000                                                         | String   |
| maskOpacity        | 遮罩层透明度                       | 否       | 0.5                                                          | String   |
| keyMap             |                                    |          |                                                              |          |
| wheels             | 数据结构                           |          |                                                              |          |



#### options

1. ##### show：f() 显示Picker

2. ##### hide: f() 隐藏Picker




### case

```javascript

import { MobileSelect } from './modules/AddressPicker';

const msData = [{
            data: [
                {date:'1月', val: 1, childs: [
                    {date: '1日', val: 1},
                    {date: '2日', val: 2},
                    {date: '3日', val: 3},
                    {date: '4日', val: 4},
                    {date: '5日', val: 5}
                ]},
                {date:'2月', val: 2},
                {date:'3月', val: 3},
                {date:'4月', val: 4},
                {date:'5月', val: 5},
                {date:'6月', val: 6},
                {date:'7月', val: 7},
                {date:'8月', val: 8},
                {date:'9月', val: 9},
                {date:'10月', val: 10},
                {date:'11月', val: 11},
                {date:'12月', val: 12}
            ]
        }]


const picker = MobileSelect({
            id:'mobileId',
            wheels:{
                
            },
            trigger: '#exampleMobile',
            keyMap: {id: 'val', value: 'date', childs: 'childs'},
            cancelBtnText: 'cancel',
            ensureBtnText: 'ensure',
            triggerDisplayData: true,
            onConfirm: function(a, b){
                document.getElementById('onConfirm').innerText='onConfirm'+a[0]+b[0].date;
            },
            onCancel: function(a, b){
                if (a.length === 0) return;
                document.getElementById('onCancel').innerText='onCancel'+a[0]+b[0].date;
            },
            transitionEnd: function(a, b){
                document.getElementById('transitionEnd').innerText='transitionEnd'+a[0]+b[0].date;
            },
            onShow: function(e){
                document.getElementById('onShow').innerText='onShow';
            },
            onHide: function(e){
                document.getElementById('onHide').innerText='onHide';
            },
            position: [3],
            title: '选择日期',
            ensureBtnColor: '#000',
            cancelBtnColor: '#000',
            textColor: 'red',
            titleColor: '#000',
            titleBgColor: '#fff',
            bgColor: '#fff',
            maskOpacity: 0.5
        });
```

