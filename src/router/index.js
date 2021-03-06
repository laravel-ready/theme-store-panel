import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";

import Themes from "../views/Theme/Themes.vue";
import Theme from "../views/Theme/Theme.vue";
import Releases from "../views/Release/Releases.vue";

import Categories from "../views/Category/Categories.vue";
import Category from "../views/Category/Category.vue";

import Authors from "../views/Author/Authors.vue";
import Author from "../views/Author/Author.vue";

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

            // themes
            {
                path: "/themes",
                name: "themes",
                components: { default: Themes },
            },
            {
                path: "/themes/new",
                name: "new-theme",
                components: { default: Theme },
            },
            {
                path: "/themes/:id",
                name: "theme",
                component: Theme,
            },

            // theme releases
            {
                path: "/themes/:id/releases",
                name: "releases",
                component: Releases,
            },

            // categories
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

            // authors
            {
                path: "/authors",
                name: "authors",
                components: { default: Authors },
            },
            {
                path: "/author/:id",
                name: "author",
                components: { default: Author },
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
