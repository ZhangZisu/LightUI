import Vue from "vue";
import Router from "vue-router";
import homeView from "./views/home.vue";
import errorView from "./views/error.vue";
import loginView from "./views/login.vue";
import fileView from "./views/file.vue";
import problemView from "./views/problem.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: homeView
    },
    {
      path: "/login",
      name: "login",
      component: loginView
    },
    {
      path: "/file",
      name: "file",
      component: fileView
    },
    {
      path: "/problem",
      name: "problem",
      component: problemView
    },
    {
      path: "*",
      name: "notFound",
      component: errorView
    }
  ]
});

// {
//   path: "/about",
//   name: "about",
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () =>
//     import(/* webpackChunkName: "about" */ "./views/About.vue")
// }
