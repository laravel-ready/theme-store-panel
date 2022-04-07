import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
import Themes from "../views/Themes.vue";
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
    }
});

export default router;
