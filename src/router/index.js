import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
import Themes from "../views/Theme/Themes.vue";
import Theme from "../views/Theme/Theme.vue";
import NewTheme from "../views/Theme/NewTheme.vue";
import Login from "../views/Login.vue";
import Categories from "../views/Category/Categories.vue";
import Category from "../views/Category/Category.vue";

import store from "store";

const routes = [
    {
        path: "/",
        redirect: "/dashboard",
        component: DashboardLayout,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                components: { default: Dashboard },
            },
            {
                path: "/themes",
                name: "themes",
                components: { default: Themes },
            },
            {
                path: "/themes/new",
                name: "new-theme",
                components: { default: NewTheme },
            },
            {
                path: "/themes/:id",
                name: "theme",
                component: Theme,
            },
            {
                path: "/categories",
                name: "categories",
                components: { default: Categories },
            },
            {
                path: "/categories/:id",
                name: "category",
                component: Category,
            },
        ],
    },
    {
        path: "/",
        redirect: "login",
        component: AuthLayout,
        children: [
            {
                path: "/login",
                name: "login",
                components: { default: Login },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    mode: "history",
    linkActiveClass: "active",
    routes,
});

router.beforeEach(async (to) => {
    if ((!store.get("userAccessToken") || !store.get("user")) && to.name !== "login") {
        return { name: "login" };
    } else if (store.get("userAccessToken") && store.get("user") && to.name === "login") {
        return { name: "dashboard" };
    }
});

export default router;
