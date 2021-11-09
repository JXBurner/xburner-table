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
      :current-page="pagination.page.pageNo"
      :page-size="pagination.page.pageSize"
      :total="pagination.page.total"
      :layout="pagination.paginationLayout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagination',
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
        fn: '',
        page: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        // 每页显示条目个数
        pageSizes: [20, 40, 80, 120],
        paginationLayout: 'total, sizes, prev, pager, next, jumper'
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
        this.pagination.page = obj.page || this.pagination.page
        this.pagination.pageSizes = obj.pageSizes || this.pagination.pageSizes
        this.pagination.paginationLayout = obj.paginationLayout || this.pagination.paginationLayout
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
