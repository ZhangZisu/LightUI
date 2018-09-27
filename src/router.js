import Vue from "vue";
import Router from "vue-router";
import homeView from "./views/home.vue";
import errorView from "./views/error.vue";
import loginView from "./views/login.vue";
import registerView from "./views/register.vue";
import store from "./store";

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
      path: "/register",
      name: "register",
      component: registerView
    },
    {
      path: "/file",
      name: "file",
      component: () =>
        import(/* webpackChunkName: "file" */ "./views/file.vue"),
      props: route => route.query
    },
    {
      path: "/file/upload",
      name: "uploadFile",
      component: () =>
        import(/* webpackChunkName: "file" */ "./views/fileUpload.vue")
    },
    {
      path: "/file/show/:id",
      name: "showFile",
      component: () =>
        import(/* webpackChunkName: "file" */ "./views/fileDetails.vue"),
      props: route => ({ fileID: route.params.id })
    },
    {
      path: "/file/edit/:id",
      name: "editFile",
      component: () =>
        import(/* webpackChunkName: "file" */ "./views/fileEdit.vue"),
      props: route => ({ fileID: route.params.id })
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
      path: "/problem/edit/:id",
      name: "editProblem",
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problemEdit.vue"),
      props: route => ({ id: route.params.id })
    },
    {
      path: "/problem/new",
      name: "newProblem",
      component: () =>
        import(/* webpackChunkName: "problem" */ "./views/problemEdit.vue")
    },
    {
      path: "/solution",
      name: "solution",
      component: () =>
        import(/* webpackChunkName: "solution" */ "./views/solution.vue")
    },
    {
      path: "/solution/show/:id",
      name: "showSolution",
      component: () =>
        import(/* webpackChunkName: "solution" */ "./views/solutionDetails.vue"),
      props: route => ({ id: route.params.id })
    },
    {
      path: "/solution/new",
      name: "newSolution",
      component: () =>
        import(/* webpackChunkName: "solution" */ "./views/solutionNew.vue"),
      props: route => ({
        problemID: route.query.id,
        viewType: route.query.type
      })
    },
    {
      path: "/role",
      name: "role",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/role.vue")
    },
    {
      path: "/role/show/:id",
      name: "showRole",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/roleDetails.vue"),
      props: route => ({ roleID: route.params.id })
    },
    {
      path: "/role/edit/:id",
      name: "editRole",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/roleEdit.vue"),
      props: route => ({ roleID: route.params.id })
    },
    {
      path: "/user",
      name: "user",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/user.vue")
    },
    {
      path: "/user/show/:id",
      name: "showUser",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/userDetails.vue"),
      props: route => ({ userID: route.params.id })
    },
    {
      path: "/user/edit/:id",
      name: "editUser",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/userEdit.vue"),
      props: route => ({ userID: route.params.id })
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter(to, from, next) {
        store.commit("resetAccessToken");
        next("/");
      }
    },
    {
      path: "*",
      name: "notFound",
      component: errorView
    }
  ]
});
