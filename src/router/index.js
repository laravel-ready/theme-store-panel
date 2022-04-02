import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";

import Dashboard from "../views/Dashboard.vue";
import Themes from "../views/Themes.vue";
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
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    mode: "history",
    linkActiveClass: "active",
    routes,
});

export default router;
