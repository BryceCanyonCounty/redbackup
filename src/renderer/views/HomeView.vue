<template>
    <div class="home">
        <img alt="Vue logo" src="/icon.png">
        <HelloWorld msg="Welcome to Your Electron ready Vue.js App!" />
    </div>
</template>
  
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
export default {
    name: 'HomeView',
    components: {
        HelloWorld
    }
}
</script>
<style scoped>
    img {
        width: 80px;
        height: 80px;
        text-align: center;
    }
</style>