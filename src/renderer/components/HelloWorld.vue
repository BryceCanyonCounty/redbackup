<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <p>
        This is a full-fledge Vue 3 + Electron boilerplate to get you developing beautiful and responsive UI's in no time!
      </p>
      <h3>Features</h3>
      <ol>
        <li><a href="https://vuejs.org/" target="_blank" rel="noopener">Vue</a> 3 and <a href="https://www.electronjs.org/" target="_blank" rel="noopener">Electron</a></li>
        <li>Typescript support</li>
        <li>Github Auto update/check <br/><small>change the "repository" in the package.json to your repo to make this work</small></li>
        <li>Hot Middle Refresh with <a href="https://babeljs.io/" target="_blank" rel="noopener">vite</a></li>
        <li>Page Routing via <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
        <li>State Management via <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
        <li>ES6 Ready via<a href="https://babeljs.io/" target="_blank" rel="noopener">babel</a></li>
      </ol>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    }
  }
  </script>