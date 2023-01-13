<template>
    <Modal :open="open" accept="Update" header="Edit Job" reject="Delete" @rejected="remove()" @accepted="accept()"
        @closed="close()">
        <form ref="jobform" @submit.prevent="save()">

            <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job
                Name</label>
            <div class="relative mb-6">
                <input v-model="job.name" type="text" id="input-group-1"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    placeholder="Vorp Server" required>
            </div>
            <div class="relative mb-6">
                    <label for="svc"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service</label>
                    <select id="svc" v-model="job.service"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="mariadb" selected>MariaDB</option>
                        <option value="mysql">MySQL</option>
                    </select>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="dbn" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Database
                        Name</label>
                    <input type="text" id="dbn" v-model="job.db.name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="VorpV2" required>
                </div>
                <div>
                    <label for="dbn" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Database
                        Host</label>
                    <input type="text" id="dbn" v-model="job.db.host"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="localhost" required>
                </div>
                <div>
                    <label for="dbname"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User</label>
                    <input type="text" id="dbname" v-model="job.db.user"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="root" required>
                </div>
                <div>
                    <label for="pass"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="pass" v-model="job.db.pass"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="*********">
                </div>
            </div>
            <div class="relative mb-6">
                <label for="path" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Backup
                    Directory</label>
                <div class="justify-start mt-4 flex w-full">
                    <input v-model="job.path" type="text" id="path"
                        class="bg-gray-50 w-full  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="C:\RedM\Backup" disabled required>
                    <button type="button" @click="selectDir()"
                        class="p-2 mt-3 justify-center text-sm rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Select</button>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="svct" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remove
                        Backups After</label>
                    <select disabled v-model="job.garbage.quantity" id="svct"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option v-for="(value, index) in times[job.garbage.timeframe]" :key="'svcstuff' + value + index" :value="value">
                            {{ value }}</option>
                    </select>
                </div>
                <div>
                    <label for="svcd" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount of
                        Time</label>
                    <select disabled id="svcd" v-model="job.garbage.timeframe"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="days" selected>Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </select>
                </div>
            </div>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="svcf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Backup
                        Frequency</label>
                    <select disabled v-model="job.schedule.frequency" id="svcf"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="days" selected>Daily</option>
                        <option value="weeks">Weekly</option>
                        <option value="months">Monthly</option>
                    </select>
                </div>
                <div>
                    <label for="svcs" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Backup
                        Time</label>
                    <TimePicker :disabled="true" :default="djob" @change="handleChange"></TimePicker>
                </div>
            </div>
            <div class="relative mb-6" v-if="job.schedule.frequency !== 'days'">
                <label for="svcd" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Backup
                    Day</label>
                <select disabled v-model="job.schedule.day" id="svcd"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="1" selected>Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="7">Sunday</option>
                </select>
            </div>
            <p v-show="error.state" class="text-lg font-medium text-red-500">{{ error.message }}</p>
            <input type="submit" style="position:  absolute; left: -999999px;" ref="formsubmit" value="" />
            <div v-show="loading" role="status" class="inline-flex justify-center w-full">
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
        </form>
    </Modal>
</template>

<script>
import Modal from './Modal.vue'
import TimePicker from './TimePicker.vue'

export default {
    data() {
        return {
            loading: false,
            falsedisable: true,
            job: {
                name: '',
                garbage: {
                    timeframe: 'days',
                    quantity: 1,
                },
                schedule: {
                    frequency: 'days',
                    time: '01:00:00 AM',
                    day: 1
                },
                service: 'mariadb',
                db: {
                    name: '',
                    user: '',
                    pass: '',
                    host: ''
                },
                path: '',
                status: 'Waiting',
                lastrun: "Waiting",
                id: null
            },
            times: {
                days: 7,
                weeks: 4,
                months: 12
            },
            error: {
                state: false,
                message: ""
            }
        }
    },
    props: {
        open: { type: Boolean, required: true },
        pos: { type: Number, required: true },
    },
    watch: {
        'job.garbage.timeframe': function (data) {
            this.job.garbage.quantity = 1
        },
        open(data) {
            if (data === true) {
                const response = window.api.getJob(this.pos).then(data => {
                    if (!data) return
                    this.job = data
                })
            }

        }
    },
    components: {
        Modal, TimePicker
    },
    methods: {
        accept() {
            this.falsedisable = false
            const form = this.$refs.formsubmit.click()
            this.falsedisable = true
        },
        async remove() {
            await window.api.remJob(JSON.stringify({ pos: this.pos, id: this.job.id }))

            this.$emit('closed')
        },
        handleChange(data) {
            this.job.schedule.time = data
        },
        async selectDir() {
            let temp = await window.api.selectDir()
            temp = temp.toString()
            this.job.path = temp.replaceAll('directories selected', '')
        },
        async save(e) {
            this.loading = true
            this.error.state = false
            if (this.job.name == '' || this.job.name == null || this.job.path == '' || this.job.path == null || this.job.schedule.time == null) {
                this.loading = false
                this.error.state = true
                this.error.message = "Missing Data!"
                return
            }


            let payload = JSON.stringify({
                data: this.job,
                pos: this.pos
            })

            let res = await window.api.updateJob(payload);
            console.log(res)

            setTimeout(() => {
                if (res == 'done') {
                    this.close()
                } else {
                    this.error.state = true
                    this.error.message = "Error Saving Data!"
                }
                this.loading = false
            }, 700);
        },
        close() {
            this.$emit('closed')
        }
    },
    computed: {
        djob() {
            return this.job
        }
    },
    mounted() {
    }
}
</script>