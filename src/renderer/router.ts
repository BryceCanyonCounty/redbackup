import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
});

export default router;