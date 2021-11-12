<!--
 * @Author: jinx
 * @Date: 2021-07-22 18:11:13
 * @LastEditors: jinx
 * @Descripttion: 分页组件
-->
<template>
  <div>
    <el-pagination
      class="app-pagination"
      background
      v-if="pagination.show"
      :page-sizes="pagination.pageSizes"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :layout="pagination.layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ldTableColumn',
  props: {
    paginationInfo: { // 分页配置数据
      type: Object,
      default: () => { return {} },
      required: true
    }
  },
  data () {
    return {
      // 分页插件配置参数
      pagination: {
        show: false, // 是否显示分页插件
        currentPage: 1,
        pageSize: 20,
        total: 0,
        // 每页显示条目个数
        pageSizes: [20, 40, 80, 120],
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  computed: {
  },
  watch: {
    paginationInfo (val) {
      this.initPagination(val)
    }
  },
  methods: {
    /**
     * 初始化表格
     * @author: jinx
     * @Date: 2021-07-26 19:11:51
     * @param {*} obj 父组件传进来表格的基本配置以及数据
     * @return {*}
     */
    initPagination (obj) {
      this.pagination.show = obj.show || this.pagination.show
      if (obj.show) {
        this.pagination.currentPage = obj.currentPage || this.pagination.currentPage
        this.pagination.pageSize = obj.pageSize || this.pagination.pageSize
        this.pagination.total = obj.total || this.pagination.total
        this.pagination.pageSizes = obj.pageSizes || this.pagination.pageSizes
        this.pagination.layout = obj.layout || this.pagination.layout
      }
    },
    /**
     * pageSize 改变时会触发
     * @author: jinx
     * @Date: 2021-07-22 16:16:18
     * @param {*}
     * @return {*}
     */
    handleSizeChange (pageSize) {
      this.$emit('size-change', pageSize)
    },
    /**
     * currentPage 改变时会触发
     * @author: jinx
     * @Date: 2021-07-22 16:18:36
     * @param {*} cur
     * @return {*}
     */
    handleCurrentChange (cur) {
      this.$emit('current-change', cur)
    }
  }
}
</script>
