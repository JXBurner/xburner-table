<!--
 * @Author: jinx
 * @Date: 2021-07-25 17:43:44
 * @LastEditors: jinx
 * @Descripttion: 多级表头
-->
<template>
  <el-table-column align="center" :label="thead.label">
    <template v-for="(item,index) of thead.children">
      <el-table-column
        v-if="!item.children"
        :label="item.label"
        :width="item.width"
        :key="index+'-'+item.key"
        :sort-by="item.key"
        :sortable="item.sort"
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
        <tableColumn v-if="(item.children && item.children.length>0)" :thead="item" :props="props" @colOptionFn="columnClick" :key="index"></tableColumn>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: 'ldTableColumn',
  props: ['thead', 'props'],
  components: {},
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    /**
     * 触发某一行的点击事件
     * @author: jinx
     * @Date: 2021-07-25 18:01:00
     * @param {*} row
     * @param {*} item
     * @param {*} event
     * @return {*}
     */
    columnClick (row, item, event) {
      this.$emit('colOptionFn', { row, item, event })
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    thead () {

    }
  }
}
</script>
<style lang="scss" scoped>
</style>
