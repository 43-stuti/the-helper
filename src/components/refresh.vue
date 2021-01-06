<template>
    <div>
        <sceneManager/>
    </div>
</template>
<script>
import sceneManager from '@/components/sceneManager.vue'
export default {
   name: 'refresh',
   data() {
       return {
           show:true
       }
   },
   components: {
       sceneManager
   }
}
</script>
<style scoped>
</style>