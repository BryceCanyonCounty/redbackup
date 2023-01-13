<template>

    <div class="relative overflow-x-auto sm:rounded-lg">
        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Recently
                    Created</h5>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
                <tr v-for="(rjob, index) in recentjobs" :key="rjob.id + index">
                    <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="pl-3">
                            <div class="text-base font-semibold">{{ rjob.name }}</div>
                            <div class="font-small text-gray-500">{{ formatLastRun(rjob.createdat) }}</div>
                        </div>
                    </th>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div :class="`h-2.5 w-2.5 rounded-full ${rjob.status === 'Completed' ? 'bg-green-400' : rjob.status === 'Waiting' ? 'bg-amber-400' : 'bg-red-400'} mr-2`"></div> {{ rjob.status }}
                        </div>
                    </td>
                </tr>
                <tr v-if="recentjobs.length <= 0">
                    <td class="px-6 py-4 w-full">
                        <div class="flex items-center text-center">No Recent Jobs</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>
  
<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// @ is an alias to /src
export default {
    data() {
        return {
            datainterval: null,
            jobs: []
        }
    },
    mounted() {
        const response = window.api.getJobs().then(data => {
            this.jobs = data ? JSON.parse(data) : []
        })

        this.datainterval = setInterval(() => {
            const response = window.api.getJobs().then(data => {
                this.jobs = data ? JSON.parse(data) : []
            })
        }, 40000);
    },
    destroyed() {
        clearInterval(this.datainterval)
    },
    computed: {
        recentjobs() {
            return _.filter(this.jobs, (job) => {
                const date1 = dayjs()
                return date1.diff(job.createdat, 'hour', true) < 4
            })
        }
    },
    methods: {
        formatLastRun(lr) {
            return dayjs(lr).fromNow()
        }
    }
}
</script>
<style scoped>

</style>