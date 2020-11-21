<template>
  <div id="app">
    <refresh />
  </div>
</template>

<script>
import refresh from './components/refresh.vue'

export default {
  name: 'App',
  components: {
    refresh
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
  width: 100%;
  height: 100%;
}
</style>
