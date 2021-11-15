<template>
  <div class="xBurnerTable">
    <ldtable
    ref="table"
    v-loading="loading"
    :data="xBurnerTableData"
    @columnClick="columnClick"
    @selection-change="selectionChange"
    @sort-change="sortChange"
    @handleCurrentChange="handleCurrentChange"
    @handleSizeChange="handleSizeChange"
  ></ldtable>
  </div>
</template>

<script>
import { mockData } from '@/view/mockData/tableData'

import ldtable from '@/xburner-table/lib/index.vue'
export default {
  data () {
    return {
      sort: '', // 远程排序标识
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
          sortable: true,
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
          sortable: true,
          width: 100
        },
        {
          label: '总仓道数',
          key: 'totalChannel',
          showOverflowTooltip: true,
          sortable: 'custom',
          width: 100
        },
        {
          label: '可借宝',
          key: 'currCDBCnt',
          showOverflowTooltip: true,
          sortable: 'custom',
          width: 100
        },
        {
          label: '借出未还',
          key: 'rentNotReturnCnt',
          showOverflowTooltip: true,
          sortable: 'custom',
          width: 100
        },
        {
          label: '日均租借',
          key: 'avgRentTimes',
          showOverflowTooltip: true,
          width: 100
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
      this.xBurnerTableData = { // 传给表格data的对象
        props: { // 表格属性为必传
          height: '750', // 必传
          'row-key': 'deviceId', // 非必传
          showIndex: true, // 序号列非必传
          size: 'mini', // 非必传
          border: true, // 非必传
          currentRowKey:  result.records.length > 0 ? result.records[0].deviceId : "", // 提供给单选按钮的唯一值,默认选中行
          rowClassName: scope =>  scope.row.deviceId === 8002 ? "row-error" : "", // 处理行样式，非必传
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
          btnsList: [ // 外层操作列表非必传
            {
              label: '修改',
              width: 60,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail'
            },
            {
              label: '新增',
              width: 60,
              type: 'text',
              size: 'small',
              columnClick: 'openDetail'
            },
          ],
          moreBtnsList: [ // 操作列表非必传dropdown
            {
              label: '删除',
              columnClick: 'deleteFn'
            },
            {
              label: '详情',
              isShow: ()=> true,
              columnClick: 'openDetail'
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
    /**
     * 删除
     * @author: jinx
     * @Date: 2021-11-15 16:27:13
     * @param {*}
     * @return {*}
     */
    deleteFn(row) {
      this.$message.success(row.terminal + '：删除成功')
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
    },
    /**
     * 远程排序
     * @author: jinx
     * @Date: 2021-11-15 10:40:39
     * @param {*}
     * @return {*}
     */
    sortChange (column) {
      let prop = column.column
      let valueName = prop.sortBy
        switch (prop.sortBy) {
          case 'offlineTime':
            valueName = 'offLineMinute'
            break
          case 'totalChannel':
            valueName = 'maxCDBCnt'
            break
          case 'currCDBCnt':
            valueName = 'currCdb'
            break
          case 'rentNotReturnCnt':
            valueName = 'rentNotReturnCdb'
            break
          case 'takeOfferCnt':
            valueName = 'takeOfferCnt'
            break
        }
        let soreType = prop.order && prop.order.split('ending')
        if (soreType !== null) {
          this.sort = [valueName, soreType[0]].join(',')
          this.initTable()
        }
        this.$message.success(this.sort)
    }
  },
  components: {
    ldtable
  }

}
</script>

<style>
.xBurnerTable{
  height: 100%;
}
</style>
