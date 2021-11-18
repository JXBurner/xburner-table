<!--
 * @Author: jinx
 * @Date: 2021-07-22 18:11:02
 * @LastEditors: jinx
 * @Descripttion: 公共表格组件
-->
<template>
  <div class="mainLdTable">
    <!-- 表格主体 -->
    <el-table
      class="ldTable"
      v-loading="loading"
      :data="tbody"
      :ref="props.ref"
      :id="props.ref"
      :border="props.border"
      :size="props.size"
      :height="props.height"
      :lazy="props.lazy"
      :current-row-key="props.currentRowKey"
      :row-class-name="props.rowClassName"
      :highlight-current-row="props.highlightCurrentRow"
      :header-cell-style="props.headerCellStyle"
      :row-key="setRowKey"
      @selection-change="selectionChange"
      @select-all="selectAll"
      @current-change="currentChange"
      @row-dblclick="rowDblclick"
      @sort-change="sortChange"
      max-height="100%"
    >
      <!-- 多选列 -->
      <el-table-column
        :selectable="check.selectable"
        v-if="check.showCheckBox"
        type="selection"
        width="55"
        align="center"
        :reserve-selection="check.reserveSelection"
      ></el-table-column>
      <!-- 单选列 -->
      <el-table-column v-if="radio.showRadio" width="55" align="center" label="单选">
        <template #default="scope">
          <el-radio v-model="radioItem" :label="scope.row[radio.radioKey]">{{''}}</el-radio>
        </template>
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column v-if="props.showIndex" type="index" width="55" align="center" label="序号"></el-table-column>
      <!-- 数据列 -->
      <template v-for="(item,index) in thead">
        <el-table-column
          v-if="!item.children"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :key="index + '-' + item.key"
          :sort-by="item.key"
          :sortable="item.sortable"
          :sort-method="typeof item.sortMethod==='function'?item.sortMethod:defaultSortFn(item.sortType,item.key)"
          :show-overflow-tooltip="item.showOverflowTooltip"
          align="center"
        >
          <template #default="scope">
            <span
              v-if="item.formatter"
              @click="columnClick(scope.row,item,$event)"
              v-html="item.formatter(scope.row,scope.row[item.key],index)"
            ></span>
            <span
              v-if="!item.formatter"
              @click="columnClick(scope.row,item,$event)"
            >{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <!-- 多级表头 -->
        <tableColumn
          v-if="(item.children && item.children.length>0)"
          :thead="item"
          :props="props"
          @colOptionFn="runColumnClick"
          align="center"
          :key="index"
        ></tableColumn>
      </template>
      <!-- 操作列 -->
      <el-table-column
        v-if="buttonsList&&buttonsList.length||moreBtnsList&&moreBtnsList.length"
        :resizable="false"
        label="操作"
        align="center"
        :fixed="fixedOperate"
        :width="buttonTotalWidth"
      >
        <template #default="{row}">
          <el-button
            v-for="(item, index) in buttonsList"
            :key="'options-'+ index"
            :type="item.type"
            :size="item.size"
            :icon="item.icon"
            :style="'color:'+item.color"
            v-show="buttonsList.length&&item.isShow&&typeof item.isShow==='function'?item.isShow(row):true"
            @click="columnClick(row,item,$event)"
          >{{item.label}}</el-button>
          <el-dropdown trigger="click" v-show="moreBtnsList.length">
            <i class="moreBtns">...</i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item 
                v-for="(item, index) in moreBtnsList"
                :key="'options-'+ index"
                :command="{...row, dropIndex: index}"
                v-show="item.isShow&&typeof item.isShow==='function'?item.isShow(row):true"
              >
              <span @click="columnClick(row,item,$event)">{{item.label}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableColumn from './tableColumn.vue'
export default {
  name: 'mainLdTable',
  components: { tableColumn },
  props: {
    tableInfo: { // 表格配置数据
      type: Object,
      default: () => { return {} },
      required: true
    },
    loading: { // 显示加载动画
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 表格基本属性配置
      props: {
        ref: 'baseTableRef',
        height: '100%',
        size: '',
        showIndex: false, // 序号列
        border: false,
        lazy: false,
        currentRowKey: '', // 当前行的 key，只写属性
        rowClassName: '', // 设置每一行的颜色
        highlightCurrentRow: false, // 点击行是否高亮
        headerCellStyle: { 'text-align': 'center' }
      },
      // 表格数据
      tbody: [],
      // 表头
      thead: [],
      // 操作按钮的总宽度
      buttonTotalWidth: 0,
      // 操作外层按钮
      buttonsList: [],
      // 列表操作按钮
      moreBtnsList:[],
      // 固定操作列，具体参数与element-ui的fixed一致
      fixedOperate: 'right',
      // 表格checkbox
      check: {
        showCheckBox: false,
        selectable: () => true, // 是否有勾选能力
        reserveSelection: false // 数据更新后是否保存勾选的数据
      },
      // 是否显示单选按钮
      radio: {
        showRadio: false,
        radioKey: ''
      },
      // 单选行数据
      curChangeRow: {},
      // 单选行的唯一标识
      radioItem: ''
    }
  },
  computed: {
  },
  watch: {
    tableInfo (val) {
      this.initTable(val)
    }
  },
  methods: {
    /**
     * 初始化表格
     * @author: jinx
     * @Date: 2021-07-24 19:11:51
     * @param {*} obj 父组件传进来表格的基本配置以及数据
     * @return {*}
     */
    initTable (obj) {
      // 没有row-key设置默认row-key,行数据的 Key，用来优化 Table 的渲染，保证数据更新之后保留之前选中的数据（需指定 row-key）
      if (!obj.props || !obj.props['row-key']) {
        if (obj.tbody && obj.tbody.length > 0) {
          obj.tbody.map((v, i) => {
            v['row-key'] = this.setDefaultRowKey(i, obj?.pagination?.page?.pageNo || 1)
          })
          !obj.props && (obj.props = {})
          obj.props['row-key'] = 'row-key'
        }
      }
      this.thead = obj.thead || []
      this.tbody = obj.tbody || []

      this.props = Object.assign({}, this.props, obj.props)
      this.check = Object.assign({}, this.check, obj.check)
      this.radio = Object.assign({}, this.radio, obj.radio)

      this.buttonsList = this.deepCopeArray(obj?.buttonsList?.btnsList) || [] // 外层操作按钮
      this.moreBtnsList = this.deepCopeArray(obj?.buttonsList?.moreBtnsList) || [] // 列表操作按钮
      this.fixedOperate = obj?.buttonsList?.fixed || this.fixedOperate // 操作列固定
      // 计算按钮总长度
      this.buttonTotalWidth = this.buttonsList.reduce((o, v) => {
        isNaN(v.width) && (v.width = 0)
        return o + Number(v.width)
      }, 0)
      // 默认按钮总长度为100
      !this.buttonTotalWidth && (this.buttonTotalWidth = 100)

      // 单选按钮默认选中第一行
      // if (this.radio.showRadio && this.props.currentRowKey && this.props['row-key']) {
      //   // 设置选中行
      //   let arr = obj.tbody.filter(v => v[this.props['row-key']] === this.props.currentRowKey)
      //   // 要根据子组件传过来的行设置radio的选中状态
      //   this.radioItem = this.curChangeRow[this.radio.radioKey]
      //   // 手动触发默认选中行current-change事件
      //   this.$nextTick(() => {
      //     if (this.curChangeRow.id === undefined) {
      //       this.currentChange(arr[0], {})
      //     }
      //   })
      // } else {
      //   this.radioItem = ''
      // }
    },
    /**
     * 深度克隆数组(处理按钮)
     * @name: jinx
     * @Date: 2021-07-24 23:40:07
     * @param {*} arr
     * @return {*}
     */
    deepCopeArray (arr) {
      if (Array.isArray(arr)) {
        var na = arr.reduce((o, v) => {
          if (v.children === undefined) {
            o.push(Object.assign({}, v))
          } else {
            let to = Object.assign({}, v)
            to.children = this.deepCopeArray(to.children)
            o.push(to)
          }
          return o
        }, [])
        return na
      } else {
        return false
      }
    },
    /**
     * 设置默认row-key
     * @author: jinx
     * @Date: 2021-07-22 16:39:48
     * @param {*} index
     * @param {*} num
     * @return {*}
     */
    setDefaultRowKey (index, num) {
      return num + '_' + index
    },
    /**
     * 给表格设置row-key
     * @author: jinx
     * @Date: 2021-07-24 20:31:45
     * @param {*} row 行数据
     * @return {*}
     */
    setRowKey (row) {
      return row[this.props['row-key']]
    },
    /**
     * 某一列的点击事件
     * @author: jinx
     * @Date: 2021-07-24 16:59:40
     * @param {*} row 数据行
     * @param {*} item 单元格数据
     * @param {*} event 点击事件
     * @return {*}
     */
    columnClick (row, item, event) {
      this.$emit('columnClick', row, item, event)
    },
    /**
     * 多级表头时，触发某一列的点击事件
     * @author: jinx
     * @Date: 2021-07-24 17:53:25
     * @param {*} obj
     * @return {*}
     */
    runColumnClick (obj) {
      this.columnClick(obj.row, obj.item, obj.event)
    },
    /**
     * 当选择项发生变化时会触发该事件
     * @author: jinx
     * @Date: 2021-07-24 20:34:47
     * @param {*} selection
     * @return {*}
     */
    selectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     * @author: jinx
     * @Date: 2021-07-24 20:37:49
     * @param {*} selection
     * @return {*}
     */
    selectAll (selection) {
      this.$emit('select-all', selection)
    },
    /**
     * 当表格的当前行发生变化的时候会触发该事件
     * @author: jinx
     * @Date: 2021-07-24 20:42:43
     * @param {*} currentRow
     * @param {*} oldCurrentRow
     * @return {*}
     */
    currentChange (currentRow, oldCurrentRow) {
      if (this.radio?.showRadio) {
        this.radioItem = currentRow[this.radio.radioKey]
        this.curChangeRow = currentRow
      }
      this.$emit('current-change', { currentRow, oldCurrentRow })
    },
    /**
     * 当某一行被双击时会触发该事件,当表格的checkbox打开时会自动勾选
     * @author: jinx
     * @Date: 2021-07-24 20:46:04
     * @param {*} row
     * @param {*} column
     * @param {*} event
     * @return {*}
     */
    rowDblclick (row) {
      if (this.check.showCheckBox === false) {
        return false
      }
      this.$refs[this.props.ref].toggleRowSelection(row)
    },
    /**
     * 远程排序方法
     * @author: jinx
     * @Date: 2021-11-12 11:15:55
     * @param {*}
     * @return {*}
     */
    sortChange (column, prop, order) {
      this.$emit('sort-change', column, prop, order)
    },
    /**
     * 数据列默认排序方式为数字,支持自定义方法
     * @author: jinx
     * @Date: 2021-07-08 10:10:58
     * @param {*} type 为string时按照字符串排序，否则按照数字
     * @param {*} key
     * @return {*}
     */
    defaultSortFn (type, key) {
      if (type !== 'string') {
        return function (a, b) {
          const bigNumberCompare = (a, b) => {
            if (!a && a !== 0) {
              a = ''
            }
            if (!b && b !== 0) {
              b = ''
            }
            let aArr = a.toString().split('.')
            let bArr = b.toString().split('.')
            // 直接比较整数部分长度
            if (aArr[0].length > bArr[0].length) {
              return 1
            } else if (aArr[0].length < bArr[0].length) {
              return -1
            }
            // 如果位数一样可以进行字符串比较
            if (aArr[0] > bArr[0]) {
              return 1
            } else if (aArr[0] < bArr[0]) {
              return -1
            }
            // 如果整数部分字符串也一样就进行小数比较
            if (aArr[1] === undefined || bArr[1] === undefined) {
              if (aArr[1] === undefined && bArr[1] === undefined) {
                return 0
              } else if (aArr[1] === undefined) {
                return aArr[0] >= 0 ? -1 : 1
              } else {
                return aArr[0] >= 0 ? 1 : -1
              }
            } else {
              return aArr[1] - bArr[1]
            }
          }

          let av = parseFloat(a[key]) || a[key]
          let bv = parseFloat(b[key]) || b[key]

          let max = Number.MAX_SAFE_INTEGER
          let min = Number.MIN_SAFE_INTEGER
          if (typeof av === 'number' && typeof bv === 'number') {
            if ((av > max && bv > max) || (av < min && bv < min)) {
              // 超限数字比较
              return bigNumberCompare(av, bv)
            } else {
              // 数字比较
              return av - bv
            }
          } else {
            // 字符串比较
            if (!av) {
              av = ''
            }
            if (!bv) {
              bv = ''
            }
            if (av.toString() > bv.toString()) {
              return 1
            } else if (av.toString() < bv.toString()) {
              return -1
            } else {
              return 0
            }
          }
        }
      } else {
        return undefined
      }
    },
    /**
     * 触发表格的方法
     * @author: jinx
     * @Date: 2021-07-24 18:09:17
     * @param {*} fnName
     * @return {*}
     * 在对应页面使用方法（baseTable的ref：table）：
     * this.$refs.table.tableMethods("clearSelection")()
     * this.$refs.table.tableMethods("toggleRowSelection")(row, true);
     */
    tableMethods (fnName) {
      let fn = this.$refs
      let key = this.props.ref + '_baseTable'
      if (this.props.ref) {
        return fn[key][fnName]
      } else {
        return () => false
      }
    }
  }
}
</script>
<style scoped>
.mainLdTable{
  height: 100%;
}
.moreBtns{
  font-size: 20px;
  margin-left: 10px;
  color: #0584F9;
}
</style>
