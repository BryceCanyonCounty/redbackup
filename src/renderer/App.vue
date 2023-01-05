<template>
  <div id="app">
    <div class="nav"></div>
    <div class="control-panel">
      <mdicon class="minicon" name="minus" @click="minimizeWindow()"></mdicon>
      <mdicon class="closeicon" name="window-close" @click="closeWindow()"></mdicon>
    </div>
    <div class="navitem" style="margin-top: 60px;">
      <router-link to="/" style="padding-right: 10px;">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>  

    <router-view style="padding-top: 30px; padding-left: 20px;"></router-view>
  </div>
</template>
<script lang="ts">
import { ipcRenderer } from './electron'

export default {
  data() {
    return {
    };
  },
  mounted() {
    this.pollUpdater()
    this.pollLogs()

    this.$router.push("/");
  },
  methods: {
    async pollLogs() {
      setInterval(async function () {
        const response = await window.api.getLatestLogs();
        if (response.length > 0) console.log('main logs', response)
      }, 5000);
    },
    async pollUpdater() {
      const response = await window.api.pollUpdater();
    },
    minimizeWindow() {
      ipcRenderer.send("minimizeWindow");
    },
    closeWindow() {
      ipcRenderer.send("closeWindow");
    }
  }
};
</script>
<style>

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;


  
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  background-color: #1F1D1E;
}


ol {
  width: 250px;
  margin: 0 auto;
  text-align: left;
}

a {
  color: #479251; 
}

.navitem {
  text-align: left;
  margin-left: 20px;
  margin-bottom: 4px;
  color: #fff;
}
.navitem a {
  text-decoration: none;
  color: rgb(90, 90, 88);
}
.navitem a {
  text-decoration: none;
  -webkit-touch-callout: none;
  user-select: none;
}
.navitem a:hover,
.navitem a:active,
.navitem a.active-link,
.navitem a.exact-active-link {
  color: rgb(255, 255, 255);
  transition: all .3s ease;
}

.nav {
  height: 31px;
  width: calc(100% - 60px);
  -webkit-app-region: drag;
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.control-panel {
  position: absolute;
  top: 10px;
  right: 6px;
  z-index: 99999;
  width: 60px;
}

.closeicon {
  margin-left: 6px;
  transition: all .3s ease;
}
.minicon {
  transition: all .3s ease;
}
.closeicon svg:hover,
.minicon svg:hover {
  cursor: pointer;
}
.closeicon svg:hover {
  fill: #9b3737;
}
.minicon svg:hover {
  fill: #808080;
}

</style>