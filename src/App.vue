<!--
 * @Author: jinx
 * @Date: 2021-11-09 14:53:54
 * @LastEditors: jinx
 * @Descripttion: 文件描述
-->
<template>
  <div id="app">
    <test msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import test from './view/tableExample/xburner-table-test.vue'

export default {
  name: 'App',
  components: {
    test
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  padding: 10px;
}
</style>
