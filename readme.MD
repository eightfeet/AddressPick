# picker

```sh
npm install @eightfeet/picker
```

### Usage

```javascript
import { MobileSelect } from @eightfeet/picker;

const datePicker = new MobileSelect({
        id: 'datePicker',
        wheels: [
            {data:['周日','周一','周二','周三','周四','周五','周六']},
            {data:['08:00','09:00','10:00','11:00','12:00','13:00','14:00']}
        ],
        trigger: '#datepicker',
        onConfirm: function (data) {
            handleResult(data, '#mobileselect', null, 'mobileselectStringtype')
        }
    });

datePicker.showPicker(['周二', '10：00']);
```



### parame

| 参数          | 类型     | 说明                                                         | 是否必填           |
| ------------- | -------- | ------------------------------------------------------------ | ------------------ |
| id            | String   | 模块ID，模块根节点将以此为id，部分子节点将添加class=“id_功能名” 作为className用于覆写样式（能通过style参数设置样式的尽量不要通过className去覆写），默认id=MobileSelect_时间戳_100位随机数 | 否                 |
| parentId      | String   | 模块挂载的父节点，                                           | 否                 |
| emBase        | Number   | 基础字体大小，模块采用em为单位制，子节点元素单位em的参考值，比如｛emBase:20｝则相当于1em=20px | 否                 |
| trigger       | String   | 引用picker页面的目标触发node，用于点击以唤起picker           | 必填               |
| title         | String   | 设置picker的标题                                             | 否                 |
| wheels        | Object   | picker的原始数据，这里控制picker选择器的类型,见附表          | 必填               |
| keyMap        | Object   | 当wheels为对象类型时，指定数据key，用于展示、值或者子集的字段名 | JSON数据类型时必填 |
| defaultValue  | Array    | 创建picker初始化时默认选择的值，请使用keyMap中valve对应定义的key的值 | 否                 |
| style         | Object   | 控制picker的样式，见style附表                                |                    |
| onConfirm     | Function | 点击确认时的回调，以参数形式返回被选中的结果                 | 否                 |
| onCancel      | Function | 点击取消或者遮罩层时的回调，以参数形式返回上次选中的结果     | 否                 |
| transitionEnd | Function | 滚动结束时的回调，以参数形式返回被选中的结果                 | 否                 |
| onShow        | Function | 显示picker时的回调，返回picker对象                           | 否                 |
| onHide        | Function | 隐藏picker时的回调，返回picker对象                           | 否                 |
| onChange      | Function | 改变选择时的回调，以参数形式返回被选中的结果                 | 否                 |



### options

#### picker.updatePicker(value)

用于更新picker默认值，value是要更新的值



#### picker.showPicker(value);

显示picker，有参数时定位到参数值位置再显示picker



#### picker.getCurValue();

获取当前选中结果的值