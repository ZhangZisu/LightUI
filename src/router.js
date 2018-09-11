import Vue from "vue";
import Router from "vue-router";
import homeView from "./views/home.vue";
import errorView from "./views/error.vue";
import loginView from "./views/login.vue";

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
      component: () => import(/* webpackChunkName: "file" */ "./views/file.vue")
    },
    {
      path: "/problem",
      name: "problem",
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problem.vue")
    },
    {
      path: "/problem/show/:id",
      name: "showProblem",
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problemDetails.vue"),
      props: route => ({ id: route.params.id })
    },
    {
      path: "*",
      name: "notFound",
      component: errorView
    }
  ]
});
