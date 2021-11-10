<template>
  <div class="xBurnerTable">
    <xburnertable
    ref="table"
    v-loading="loading"
    :data="xBurnerTableData"
    @columnClick="columnClick"
    @selection-change="selectionChange"
    @handleCurrentChange="handleCurrentChange"
    @handleSizeChange="handleSizeChange"
  ></xburnertable>
  </div>
</template>

<script>
import xburnertable from '@/lib/xburner-table/lib/index.vue'
import { mockData } from '@/view/mockData/tableData'

export default {
  data () {
    return {
      loading: false,
      xBurnerTableData: {}, // 表格数据
      pageSizes: [20, 40, 80, 120], // 每页显示条目个数
      layout: 'total, sizes, prev, pager, next, jumper'
    }
  },
  computed: {
    thead () {
      return [
        {
          label: '设备ID',
          key: 'terminal',
          width: 150,
          fixed: 'left',
          columnClick: 'openDetail',
          formatter: (row) => `<span style="color:#0584F9">${row.terminal}</span>`
        },
        {
          label: '设备型号',
          key: 'deviceType',
          width: 150,
          showOverflowTooltip: true
        },
        {
          label: '网点信息',
          children: [{
            label: '网点',
            key: 'name',
            showOverflowTooltip: true,
            formatter: (row) => row?.shop?.name || ''
          },
          {
            label: '地址',
            key: 'address',
            showOverflowTooltip: true,
            width: 160,
            formatter: (row) => row?.shop?.address || ''
          }]
        },
        {
          label: '设备状态',
          key: 'deviceState',
          formatter: (row) => this.formatterDeviceState(row.deviceState)
        },
        {
          label: '离线时长',
          key: 'offlineTime',
          sort: true,
          width: 100
        },
        {
          label: '异常',
          key: 'exceptionItem',
          showOverflowTooltip: true,
          width: 260,
          formatter: (row) => row?.exceptionItem.join(',')
        },
        {
          label: '健康分',
          key: 'healthScore',
          showOverflowTooltip: true,
          sort: true
        },
        {
          label: '总仓道数',
          key: 'totalChannel',
          showOverflowTooltip: true,
          sort: true
        },
        {
          label: '可借宝',
          key: 'currCDBCnt',
          showOverflowTooltip: true,
          sort: true
        },
        {
          label: '借出未还',
          key: 'rentNotReturnCnt',
          showOverflowTooltip: true,
          sort: true
        },
        {
          label: '日均租借',
          key: 'avgRentTimes',
          showOverflowTooltip: true,
          sort: true
        },
        {
          label: '关联工单',
          key: 'devopsTask',
          showOverflowTooltip: true,
          columnClick: 'openDetail',
          formatter: (row) => this.formatterDevopsTask(row)
        },
        {
          label: '处理人',
          key: 'devopsTask',
          formatter: (row) => row?.devopsTask?.length === 1 ? row.devopsTask[0].dealUserName : ''
        }
      ]
    }
  },
  mounted () {
    this.initTable()
  },
  methods: {
    /**
     * 触发列点击事件
     * @author: jinx
     * @Date: 2021-10-14 14:14:31
     * @param {*} obj
     * @return {*}
     */
    columnClick (obj) {
      let columnClick = obj.item.columnClick
      if (typeof this[columnClick] === 'function') this[columnClick](obj.row)
    },
    /**
     * 渲染表格
     * @author: jinx
     * @Date: 2021-10-14 14:27:44
     * @param {*}
     * @return {*}
     */
    initTable () {
      let result = mockData
      this.xBurnerTableData = {
        props: {
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
    /**
     * 打开详情
     * @author: jinx
     * @Date: 2021-11-08 09:51:09
     * @param {*}
     * @return {*}
     */
    openDetail () {
      this.$message.success('操作成功')
    },
    /**
     * 勾选数据
     * @author: jinx
     * @Date: 2021-07-24 19:15:14
     * @param {*}
     * @return {*}
     */
    selectionChange (selection) {
      console.log(selection)
    },
    /**
     * 分页-换页
     * @author: jinx
     * @Date: 2021-11-09 16:33:18
     * @param {*} val
     * @return {*}
     */
    handleCurrentChange (val) {
      this.pageNo = val
      this.initTable()
    },
    /**
     * 分页size改变
     * @author: jinx
     * @Date: 2021-11-09 16:33:06
     * @param {*} val
     * @return {*}
     */
    handleSizeChange (val) {
      this.pageNo = 1
      this.pageSize = val
      this.initTable()
    },
    /**
     * 格式化设备状态
     * @author: jinx
     * @Date: 2021-11-04 17:00:55
     * @param {*} deviceState
     * @return {*}
     */
    formatterDeviceState (deviceState) {
      switch (deviceState) {
        case 1:
          return '在线'
        case 2:
          return '离线'
        case 3:
          return '失联'
        default:
          return '--'
      }
    },
    /**
     * 格式化关联工单
     * @author: jinx
     * @Date: 2021-11-04 17:02:22
     * @param {*}
     * @return {*}
     */
    formatterDevopsTask (row) {
      if (row?.devopsTask?.length > 1) {
        return `<span style="color:#0584F9">多个工单</span>`
      }
      if (row?.devopsTask?.length === 1) {
        return row?.devopsTask[0].taskType
      }
    }
  },
  components: { xburnertable }

}
</script>

<style>
.xBurnerTable{
  height: 100%;
}
</style>
