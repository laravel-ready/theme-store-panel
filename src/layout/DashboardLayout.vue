<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar :background-color="sidebarBackground" short-title="Argon" title="Argon">
            <template v-slot:links>
                <sidebar-item
                    :link="{
                        name: 'Dashboard',
                        icon: 'ni ni-tv-2 text-primary',
                        path: '/dashboard',
                    }"
                />

                <sidebar-item
                    :link="{
                        name: 'Themes',
                        icon: 'ni ni-planet text-blue',
                        path: '/themes',
                    }"
                />
            </template>
        </side-bar>
        <div class="main-content" :data="sidebarBackground">
            <dashboard-navbar></dashboard-navbar>

            <div @click="toggleSidebar">
                <!-- your content here -->
                <router-view></router-view>
                <content-footer v-if="!$route.meta.hideFooter"></content-footer>
            </div>
        </div>
    </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";

export default {
    components: {
        DashboardNavbar,
        ContentFooter,
    },
    data() {
        return {
            sidebarBackground: "vue", //vue|blue|orange|green|red|primary
        };
    },
    methods: {
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        },
    },
};
</script>
<style lang="scss"></style>
