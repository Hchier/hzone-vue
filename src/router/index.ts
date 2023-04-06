import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/zone",
        name: "zone",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/ZoneView.vue"),
    },
    {
        path: "/blog/:id",
        name: "blog",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/BlogView.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
    },
    {
        path: "/notice",
        name: "notice",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/NoticeView.vue"),
    },
    {
        path: "/privateChat",
        name: "privateChat",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/ChatFrameView.vue"),
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
