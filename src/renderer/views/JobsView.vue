<template>
  <div class="max-w-lrg p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
    <!-- <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Jobs</h5> -->
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Job Name
          </th>
          <th scope="col" class="px-6 py-3">
            Schedule
          </th>
          <th scope="col" class="px-6 py-3">
            Last Run
          </th>
          <th scope="col" class="px-6 py-3">
            Last Status
          </th>
          <th scope="col" class="px-6 py-3">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(job, index) in jobs" :key="job.name + index">
          <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
            <div class="pl-3">
              <div class="text-base font-semibold">{{ job.name }}</div>
            </div>
          </th>
          <td class="px-6 py-4">
            <div class="flex items-center">
              Every {{ job.schedule.frequency.replace('s', '') }} at {{ job.schedule.time }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              {{ job.lastrun !== 'Waiting' ? formatTime(job.lastrun) : job.lastrun }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div
                :class="`h-2.5 w-2.5 rounded-full ${job.status === 'Completed' ? 'bg-green-400' : job.status === 'Waiting' ? 'bg-amber-400' : 'bg-red-400'} mr-2`">
              </div> {{ job.status }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <a @click="editJob(index)" type="button" data-modal-show="editUserModal"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6 stroke-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </a>
            </div>
          </td>
        </tr>

      </tbody>
    </table>

    <div class="fixed right-6 bottom-6 group">
      <Popper hover openDelay="200" closeDelay="100" arrow placement="left">
        <button id="popcorn" type="button" @click="opencreater = true"
          class="flex items-center justify-center text-white bg-red-700 rounded-lg w-14 h-14 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none">
          <svg aria-hidden="true" class="w-8 h-8 transition-transform group-hover:rotate-45" fill="none"
            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="sr-only">Open actions menu</span>
        </button>
        <template #content>
          <div>Create Job</div>
        </template>
      </Popper>
    </div>
    <CreateJob :open="opencreater" @closed="opencreater = false"></CreateJob>
    <EditJob :open="openeditor" @closed="openeditor = false" :pos="activepos"></EditJob>
  </div>
</template>

<script>
import CreateJob from '../components/CreateJob.vue'
import EditJob from '../components/EditJob.vue'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      opencreater: false,
      openeditor: false,
      jobs: [],
      activepos: 0,
      datainterval: null
    }
  },
  components: {
    CreateJob, EditJob
  },
  watch: {
    opencreater(data) {
      if (data == false) {
        const response = window.api.getJobs().then(data => {
          this.jobs = data ? JSON.parse(data) : []
        })
      }
    },
    openeditor(data) {
      if (data == false) {
        const response = window.api.getJobs().then(data => {
          this.jobs = data ? JSON.parse(data) : []
        })
      }
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
    }, 30000);
  },
  destroyed() {
    clearInterval(this.datainterval)
  },
  methods: {
    editJob(pos) {
      this.activepos = pos
      this.openeditor = true
    },
    formatTime(lr) {
      return dayjs(lr).format('hh:mm:ss A')
    }
  }
}
</script>
<style scoped>
img {
  width: 80px;
  height: 80px;
  text-align: center;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
<style>
:root {
  --popper-theme-background-color: #eee;
  --popper-theme-background-color-hover: #eee;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #eee;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 12px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.dark {
  --popper-theme-background-color: #333333;
  --popper-theme-background-color-hover: #333333;
  --popper-theme-text-color: white;
  --popper-theme-border-width: 0px;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 12px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
</style>