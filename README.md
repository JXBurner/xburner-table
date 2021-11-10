# xburner-table
二次封装 element ui 的 el-table

### 插件的安装
#### NPM 
```
npm i xburner-table
```
#### 引入插件
```
import Vue from 'vue'
import xburnertable from 'xburnertable'

Vue.use(xburnertable)
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
| selectionChange | 当选择项发生变化时会触发该事件 | - |
| selectAll | 当用户手动勾选全选 Checkbox 时触发的事件 | - |
| currentChange | 当表格的当前行发生变化的时候会触发该事件 | - |
| columnClick | 点击表格 | - |
| rowDblclick | 双击自动勾选数据 | - |


### Table Methods

使用实例：this.$refs.table.tableMethods("toggleRowSelection")(row, true);

| 方法名 | 说明 | 参数 |  
| :- | :- | :- |
| tableMethods | 通过该方法可调用elementui的所有方法 | fnName（方法名） |

### Table-column Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| - | :- | :- | :-: |
| thead | 表头 | array | - | 
| showIndex | 是否显示序号列 | Boolean | false |
| showOverflowTooltip | 当内容过长被隐藏时显示 tooltip | Boolean | false |
| showCheckBox | 是否显示多选列 | Boolean | false |
| selectable | 是否有勾选能力 | Function(row, index) | - |
| reserve | 数据更新后是否保存勾选的数据| Boolean | false |
| fixed | 列是否固定在左侧或者右侧，true 表示固定在左侧 | string, boolean | - | true, left, right |
| sortMethod | 对数据进行排序的时候使用的方法 | Function(a, b) | - | 
| formatter | 用来格式化内容 | Function(row, cellValue, index) | - |


### buttonsList操作列 Attributes

| 参数 | 说明 | 类型 | 默认值 | 可选值 | 
| - | :- | :- | :-: |  
| label | 按钮名字 | string | - | 
| icon | 图标类名 | string | - |
| color | 按钮颜色 | String | - |
| size | 按钮大小 | String | - | medium / small / mini |

### buttonsList操作列 Events

| 方法名 | 说明 | 参数 |
| :- | :- | :- |
| columnClick | 点击事件 | row(当前点击行) |
| isShow | 按钮权限 | row(当前点击行) | - |

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


#### 基本用法
基本表格数据展示.初始化表格:initTableData()为入口、props为表格属性、thead为表头、tbody为表格数据;

```html
<xBurner-Table
    ref="table"
    v-loading="loading"
    :data="xBurnerTableData"
    @columnClick="columnClick"
    @selection-change="selectionChange"
    @handleCurrentChange="handleCurrentChange"
    @handleSizeChange="handleSizeChange"
    class="xBurnerTable"
  ></xBurner-Table>
```

```javaScript
    initTable () {
      let result = mockData
      this.xBurnerTableData = {
        props: { // 表格属性
          showIndex: true, // 序号列
          size: 'mini',
          height: '750'
        },
        check: { // 多选复选框
          show: true
        },
        thead: this.thead,
        tbody: result.records || [],
        buttonsList: { // 操作按钮
          fixed: 'right',
          btnsList: [
            {
              label: '修改',
              width: 70,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail'
            },
            {
              width: 70,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail',
              icon: 'iconfont icongengduo'
            }
          ]
        },
        pagination: { // 分页插件
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
          label: "姓名",
          key: "name",
          width: "150",
          children：[{
            label: "小嗨",
            key: "xiaoHai",
            width: "150",
            sortType:"string",
            formatter: {function},
            sortMethod: {function},
          }]
        },
    ]
```
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
