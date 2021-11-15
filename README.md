# el-table
二次封装 element ui 的 el-table

### 准备工作
```
1、下载依赖支持可选链式操作符：
@babel/plugin-proposal-optional-chaining

2、babel.config.js配置如下:
plugins: [
    '@babel/plugin-proposal-optional-chaining'
]

3、babel7以上才支持

```
### 插件的安装
#### NPM 
```
npm i ld-table
```
#### 引入插件
```
import Vue from 'vue'
import ldtable from 'ld-table'

Vue.use(ldtable)
```
#### 基本用法
1、基本表格数据展示.初始化表格:initTable();  props为表格属性、thead为表头、tbody为表格数据、buttonsList为操作列、pagination为分页插件;

2、表格data对象里面的props、thead、tbody必填，其他参数可选

引入插件
```
import Vue from 'vue'
import ldtable from 'ld-table'

Vue.use(ldtable)
```

```html
  <ld-table
      ref="table"
      v-loading="loading"
      :data="xBurnerTableData" 
      @columnClick="columnClick"
      @selection-change="selectionChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></ld-table>
```

```javaScript
    initTable () {
      let result = mockData
      this.xBurnerTableData = { // 传给表格data的对象
        props: { // 表格属性为必传
          height: '750', // 必传
          'row-key': 'deviceId', // 行数据的 Key，用来优化 Table 的渲染
          showIndex: true, // 序号列非必传
          size: 'mini', // 非必传
        },
        check: { // 多选复选框非必传
          showCheckBox: true
        },
        radio: { // 单选按钮非必传
          showRadio: true,
          radioKey: 'deviceId' // 单选按钮显示时必填，唯一值
        },
        thead: this.thead, // 表头为必传
        tbody: result.records || [], // 表格数据为必传
        buttonsList: { // 操作按钮非必传
          fixed: 'right',
          btnsList: [
            {
              label: '修改',
              width: 50,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail'
            },
            {
              width: 50,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail',
              icon: 'iconfont icongengduo'
            }
          ]
        },
        pagination: { // 分页插件非必传
          show: true,
          currentPage: result.current,
          pageSize: result.size,
          total: result.total,
          pageSizes: this.pageSizes,
          layout: this.layout
        }
      }
    },
```
多级表头传参
```javaScript
  thead = [
      {
        label: '姓名',
        key: 'name',
        width: 150,
        fixed: 'left', // 固定列
        columnClick: 'openDetail', // 点击事件
        formatter: {function} // 格式化列
      },
      {
        label: "住址",
        key: "address",
        width: "150",
        children：[{
          label: "小嗨",
          key: "xiaoHai",
          width: "150",
          sort: true, // 是否排序
          sortType:"string", // 排序规则
          formatter: {function}, 
          sortMethod: {function}, // 自定义排序规则
        }]
      }
    ]
```

### Table Attributes
| 参数 | 说明 | 类型 | 默认值 |  
| - | :- | :- | :-: |  
| ref | 获取当前插件实例 | string | - |
| tbody | 显示的数据 | array | - | 
| border | 是否带有纵向边框 | Boolean | false | 
| size | Table 的尺寸| string | - |
| height | Table 的高度| string/number | '100% ' |
| row-key | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的 | Function(row)/String | - |
| currentRowKey | 当前行的 key，只写属性 | String,Number | - |
| highlightCurrentRow | 是否要高亮当前行 | boolean | false |
| headerCellStyle | 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。| Function({row, column, rowIndex, columnIndex})/Object | - |
| rowClassName | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className | Function({row, rowIndex})/String | - |



### Table Events

| 事件名 | 说明 | 参数 |  
| :- | :- | :- |
| selection-change | 当选择项发生变化时会触发该事件 | - |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | - |
| current-change | 当表格的当前行发生变化的时候会触发该事件 | - |
| columnClick | 点击表格 | - |
| rowDblclick | 双击自动勾选数据 | - |
| sort-change | 当表格的排序条件发生变化的时候会触发该事件 | { column, prop, order } |

### Table Methods

使用实例：this.$refs.table.tableMethods("toggleRowSelection")(row, true);

| 方法名 | 说明 | 参数 |  
| :- | :- | :- |
| tableMethods | 通过该方法可调用elementui的所有方法 | fnName（方法名） |

### Table-column多选列（check） Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| - | :- | :- | :-: | :-: |
| showCheckBox | 是否显示多选列 | Boolean | false |
| selectable | 是否有勾选能力 | Function(row, index) | - |
| reserveSelection | 数据更新后是否保存勾选的数据| Boolean | false |

### Table-column单选列（radio） Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| - | :- | :- | :-: | :-: |
| showRadio | 是否显示单选列 | Boolean | false |
| radioKey | 单选按钮显示时必填，唯一值 | string  | - |

### Table-column数据列 Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| - | :- | :- | :-: | :-: | 
| thead | 表头 | array | - | 
| showIndex | 是否显示序号列 | Boolean | false |
| showOverflowTooltip | 当内容过长被隐藏时显示 tooltip | Boolean | false |
| fixed | 列是否固定在左侧或者右侧，true 表示固定在左侧 | string, boolean | - | true, left, right |
| sortMethod | 对数据进行排序的时候使用的方法 | Function(a, b) | - | 
| formatter | 用来格式化内容 | Function(row, cellValue, index) | - |
| sort-by | 指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效 | String | 当前列的key |
| sortable | 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件| boolean, string | false | true, false, 'custom'|
| sort-method | 对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个数字 | Function(a, b) | - |

### buttonsList操作列 Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 | 
| - | :- | :- | :-: | :-: |
| fixed | 列是否固定在左侧或者右侧，true 表示固定在左侧 | string, boolean | - | true, left, right |

### buttonsList按钮 Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 | 
| - | :- | :- | :-: | :-: | 
| label | 按钮名字 | string | - | 
| icon | 图标类名 | string | - |
| color | 按钮颜色 | String | - |
| size | 按钮大小 | String | - | medium / small / mini |
| isShow | 按钮权限 | Function | row(当前点击行,返回Boolean类型) |

### buttonsList按钮 Events

| 方法名 | 说明 | 参数 |
| :- | :- | :- |
| columnClick | 点击事件 | row(当前点击行) |

### pagination Attributes

| 参数 | 说明 | 类型 | 默认值 |  
| - | :- | :- | :-: |  
| show | 是否显示分页插件 | Boolean | false | 
| currentPage | 当前页数 | number | 1 |
| pageSize | 每页显示条目个数 | number | 20 |
| total | 总条目数 | number | 0 |
| layout | 组件布局，子组件名用逗号分隔 | String | 'total, sizes, prev, pager, next, jumper' |
| pageSizes | 每页显示个数选择器的选项设置| number[] | [20, 40, 80, 120] |

### pagination Events

| 方法名 | 说明 | 参数 |
| :- | :- | :- |
| handleSizeChange | pageSize 改变时会触发 | 每页条数 |
| handleCurrentChange | currentPage 改变时会触发 | 当前页 |


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
