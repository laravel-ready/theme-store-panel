<template>
    <div>
        <base-header
            class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style="min-height: 600px; background-image: url(img/theme/covers/desktop-setup.jpg); background-size: cover; background-position: center top"
        >
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Themes</h1>

                        <p class="text-white mt-0 mb-5">Manage all themes, update details, add or update relases and relase notes and other options.</p>

                        <router-link :to="{ name: 'new-theme' }">
                            <button class="btn btn-default" @click="showFormModal()">
                                <i class="fas fa-plus-circle text-success mr-2"></i>
                                New Theme
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <themes-table
                        title="Theme List"
                        :content="themesData"
                        :isLoading="themesLoading"
                        @pageChanged="pageChanged"
                        @deleteItem="deleteItem"
                        @featuredItem="setFeatured"
                        @statusItem="setStatus"
                    ></themes-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ThemesTable from "./Tables/ThemesTable";
import ThemeService from "@/services/ThemeService";

export default {
    name: "themes-page",
    components: {
        ThemesTable,
    },
    data() {
        return {
            themesLoading: false,
            themesData: [],
        };
    },

    mounted() {
        this.loadThemes();
    },

    methods: {
        // load categories
        loadThemes(page = 1) {
            if (!this.themesLoading) {
                ThemeService.getAll(page).then((response) => {
                    this.themesData = response.data.result;
                });
            }
        },

        // delete the selected item
        deleteItem(id) {
            ThemeService.delete(id).then(() => {
                this.loadThemes();
            });
        },

        // set as featured or unset
        setFeatured(id, state) {
            ThemeService.patch(id, {
                featured: state,
            });
        },

        // update item status
        setStatus(id, state) {
            ThemeService.patch(id, {
                status: state,
            });
        },

        // on page changed update the categories
        pageChanged(page) {
            if (page !== this.themesData.current_page) {
                this.loadThemes(page);
            }
        },
    },
};
</script>
