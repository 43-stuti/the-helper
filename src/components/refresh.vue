<template>
    <div class="h-100">
        <b-overlay :show="show">
            <sceneManager/>
            <template v-slot:overlay>
                <div class="text-center">
                    <p>Little things matter</p>
                    <b-button
                        ref="cancel"
                        variant="primary"
                        size="sm"
                        aria-describedby="cancel-label"
                        @click="show = false"
                    >
                        Lets' go to her.
                    </b-button>
                </div>
            </template>
        </b-overlay>
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