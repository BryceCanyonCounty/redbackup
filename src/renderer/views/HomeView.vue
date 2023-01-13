<template>
    <div class="home">
        <div class="grid gap-6 mb-6 md:grid-cols-2 ">
            <div
                class="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <LastRun></LastRun>
            </div>
            <div
                class="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <RecentlyCreated></RecentlyCreated>
            </div>
        </div>
    </div>
</template>

<script>
import LastRun from '../components/LastRun.vue'
import RecentlyCreated from '../components/RecentlyCreated.vue'


// @ is an alias to /src
export default {
    name: 'HomeView',
    components: {
        LastRun, RecentlyCreated
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