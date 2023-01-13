<template>
    <div class="min-h-full">
        <Disclosure as="nav" class="bg-red-900 noselect" v-slot="{ open }">
            <div class="dragbar"></div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 dragzone">
                            <img class="h-8 noselect" src="./public/logo.png" draggable="false" alt="RedCloud" />
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <router-link v-for="item in navigation" :key="item.name"  :to="item.to" style="padding-right: 10px;" :class="[currentRoute == item.name.toLowerCase() ? 'bg-red-900 text-white' : 'text-red-300 hover:bg-red-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']"
                                    :aria-current="currentRoute == item.name.toLowerCase() ? 'page' : undefined">{{ item.name }}</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <button type="button" class="text-white hover:text-gray-400 mr-3" @click="toggleDarkMode()">
                                <MoonIcon class="block h-6 w-6" aria-hidden="true"  v-if="darkmode"/>
                                <SunIcon class="block h-6 w-6" aria-hidden="true"  v-else/>
                                <span class="sr-only">Dark Mode</span>
                            </button>
                            <button type="button" class="text-white hover:text-gray-400 mr-3" @click="minimizeWindow()">
                                <MinusIcon class="block h-6 w-6" aria-hidden="true" />
                                <span class="sr-only">Minimize Application</span>
                            </button>
                            <button type="button" class="text-white hover:text-red-300"  @click="closeWindow()">
                                <XMarkIcon class="block h-6 w-6" aria-hidden="true" />
                                <span class="sr-only">Close Application</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Disclosure>
        <main>
            <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <router-view style="padding-top: 30px; padding-left: 20px;"></router-view>
            </div>
        </main>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, XMarkIcon, MinusIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { ipcRenderer } from './electron'
import { useRouter } from 'vue-router';

const currentRoute = computed(() => {
    return useRouter().currentRoute.value.name;
})

const darkmode = ref(false)

const navigation = [
    { name: 'Dashboard', to: '/'},
    { name: 'Jobs', to: '/jobs'},
    // { name: 'Settings', to: '/settings'},
]

const pollLogs = async () => {
    setInterval(async function () {
    const response = await window.api.getLatestLogs();
    if (response.length > 0) console.log('main logs', response)
    }, 5000);
}

const pollUpdater = async () => {
    const response = await window.api.pollUpdater();
}

const minimizeWindow = () => {
    ipcRenderer.send("minimizeWindow");
}

const closeWindow = () => {
    ipcRenderer.send("closeWindow");
}

const toggleDarkMode = () => {
    darkmode.value = !darkmode.value;
    if (darkmode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');

    }

}

onMounted(() => {
    const router = useRouter()

    window.addEventListener('message', evt => {
        if (evt.data.type === 'select-dirs') {
        ipcRenderer.send('select-dirs')
        }
    })

    pollUpdater()
    pollLogs()

    router.push("/"); //Reset route
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage))) {
        darkmode.value = true
        document.documentElement.classList.add('dark');
    } else {
        darkmode.value = false
        document.documentElement.classList.remove('dark')
    }
})
</script>

<style>
.dragbar::after {
    -webkit-app-region: drag;
    user-select: none;
    z-index: -1;
}

.dragzone {
    -webkit-app-region: drag;
}

.dragbar {
    position: absolute;
    top: 0px;
    right: 140px;
    -webkit-app-region: drag;
    height: 70px;
    width: 590px;
    z-index: -1;

    /* background-color:red; */
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

/* width */
::-webkit-scrollbar {
  width: 6px;
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