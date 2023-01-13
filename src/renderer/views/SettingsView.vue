<template>
  <div class="max-w-lrg p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
    <form>
      <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Default Backup
        Location</label>
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FolderIcon class="block h-6 w-6 stroke-grey-400 dark:stroke-white" aria-hidden="true" />
        </div>
        <input v-model="settings.path" type="text" id="input-group-1"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
          placeholder="C:\RedCloud\Backups">
      </div>

      <!-- <div class="relative mb-6">
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="settings.startup" type="checkbox" class="sr-only peer">
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
          </div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">Run on Startup</span>
        </label>
      </div> -->

      <!-- <div class="relative mb-6">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="settings.minimized" class="sr-only peer">
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
          </div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">Run Minimized</span>
        </label>
      </div> -->

      <div class=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:text-white">
        <button type="button"
          :disabled="loading"
          class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          @click="save()">Save</button>

        <div v-show="loading" role="status" class="inline-flex justify-center">
          <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { FolderIcon } from '@heroicons/vue/24/outline'

export default {
  data() {
    return {
      settings: {
        path: '',
        startup: false,
        minimized: false
      },
      loading: false
    }
  },
  components: {
    FolderIcon
  },
  methods: {
    async save() {
      this.loading = true
      if (this.settings.path == '' || this.settings.path == null) {
        this.loading = false
        return
      }
      let res = await window.api.saveSettings(JSON.stringify(this.settings));
      setTimeout(() => {
        this.loading = false
      }, 700);
    }
  },
  mounted() {
    const response = window.api.getSettings().then(data => {
      this.settings = {
        ...this.settings,
        ...data ? JSON.parse(data) : {}
      }
    })
  }
}
</script>

<style scoped>
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