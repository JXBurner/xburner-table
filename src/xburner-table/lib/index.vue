<!--
 * @Author: jinx
 * @Date: 2021-07-24 20:10:26
 * @LastEditors: jinx
 * @Descripttion: 公共表格功能见readme
-->
<template>
  <div class="base-table">
    <!-- 表格主体 -->
    <com-table
    ref="comTable"
    :tableInfo="tableInfo"
    :loading="loading"
    @columnClick="columnClick"
    @selection-change="selectionChange"
    @select-all="selectAll"
    @current-change="currentChange"
    @sort-change="sortChange"
    >
    </com-table>
    <!-- 分页 -->
    <footer class="table-footer">
      <com-pagination :paginationInfo="paginationInfo" @current-change="handleCurrentChange" @size-change="handleSizeChange"></com-pagination>
    </footer>
  </div>
</template>

<script>
import comTable from './table/table.vue'
import comPagination from './pagination/pagination.vue'
export default {
  components: { comTable, comPagination },
  props: {
    data: { // 表格配置数据
      type: Object,
      default: () => { return {} },
      required: true
    },
    loading: { // 显示加载动画
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 表格配置
      tableInfo: {},
      // 分页配置
      paginationInfo: {}
    }
  },
  computed: {
  },
  watch: {
    data (val) {
      this.initTableData(val)
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
    initTableData (obj) {
      this.tableInfo = obj || {}
      this.paginationInfo = obj.pagination || {}
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
      this.$emit('columnClick', { row, item, event })
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
      this.$emit('current-change', { currentRow, oldCurrentRow })
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
      this.$refs.table.tableMethods(fnName)()
    },
    /**
     * pageSize 改变时会触发
     * @author: jinx
     * @Date: 2021-07-22 16:16:18
     * @param {*}
     * @return {*}
     */
    handleSizeChange (pageSize) {
      this.$emit('handleSizeChange', pageSize)
    },
    /**
     * currentPage 改变时会触发
     * @author: jinx
     * @Date: 2021-07-22 16:18:36
     * @param {*} cur
     * @return {*}
     */
    handleCurrentChange (cur) {
      this.$emit('handleCurrentChange', cur)
    }
  }
}
</script>
<style scoped>
.base-table{
  height: 100%;
}
.table-footer{
  float: right;
  margin-top: 10px;
}
</style>
