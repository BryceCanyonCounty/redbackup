import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./views/HomeView.vue";
import AboutView from "./views/JobsView.vue";
import SettingsView from "./views/SettingsView.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: HomeView,
  },
  {
    path: "/jobs",
    name: "jobs",
    component: AboutView,
  },
  // {
  //   path: "/settings",
  //   name: "settings",
  //   component: SettingsView,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
});

export default router;
