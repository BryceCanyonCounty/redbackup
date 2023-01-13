<template>
    <div class="inline-flex justify-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <select :disabled="disabled" name="" id="" v-model="hours" class="px-2 outline-none appearance-none dark:text-white bg-gray-50 dark:bg-gray-700">
            <option v-for="(value, index) in times.hours" :key="'svcsasdahour' + value + index" :value="index+1 < 10 ? `0${index+1}` : index+1">{{ index+1 < 10 ? `0${index+1}` : index+1 }}</option>
        </select>
        <span class="px-2  outline-none appearance-none dark:text-white bg-none bg-gray-50 dark:bg-gray-700">:</span>
        <select :disabled="disabled" name="" id="" v-model="minutes" class="px-2 outline-none appearance-none bg-none dark:text-white bg-gray-50 dark:bg-gray-700">
            <option v-for="(value, index) in times.minutes" :key="'svcsasdamin' + value + index" :value="index < 10 ? `0${index}` : index">{{ index < 10 ? `0${index}` : index }}</option>
        </select>
        <span class="px-2 outline-none appearance-none dark:text-white bg-none bg-gray-50 dark:bg-gray-700">:</span>
        <select :disabled="disabled" name="" id="" v-model="seconds" class="px-2  outline-none appearance-none bg-none dark:text-white bg-gray-50 dark:bg-gray-700">
            <option v-for="(value, index) in times.seconds" :key="'svcsasdasec' + value + index" :value="index < 10 ? `0${index}` : index">{{ index < 10 ? `0${index}` : index }}</option>
        </select>
        <select :disabled="disabled" name="" id="" v-model="state" class="px-2 outline-none appearance-none bg-none dark:text-white bg-gray-50 dark:bg-gray-700 rounded">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    </div>
</template>

<script>

export default {
    data() {
        return {
            hours: '01',
            minutes: '00',
            seconds: '00',
            state: 'AM',
            times: {
                hours: 12,
                minutes: 60,
                seconds: 60
            },
            defaulted: false
        }
    },
    props: {
        default: { type: Object, required: false, default: {} },
        disabled: { type: Boolean, default: false }
    },
    mounted() {

    },
    watch: {
        default(job) {
            if (job.name) {
                this.defaulted = true
                let times = job.schedule.time.replace(' ', ':').split(':')
                
                this.hours = times[0]
                this.minutes = times[1]
                this.seconds = times[2]
                this.state = times[3]
            }
        },
        hours(data) {
            if (!this.defaulted) this.$emit('change', `${data}:${this.minutes}:${this.seconds} ${this.state}`)
        },
        minutes(data) {
            if (!this.defaulted) this.$emit('change', `${this.hours}:${data}:${this.seconds} ${this.state}`)

        },
        seconds(data) {
            if (!this.defaulted) this.$emit('change', `${this.hours}:${this.minutes}:${data} ${this.state}`)
        },
        state(data) {
            if (!this.defaulted) this.$emit('change', `${this.hours}:${this.minutes}:${this.seconds} ${data}`)
        }
  
    }
}
</script>
<style scoped>

/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>