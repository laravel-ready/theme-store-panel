<template>
    <!-- Form Modal -->
    <modal ref="formModal" v-model:show="isOpenFormModal" modalClasses="modal-lg">
        <template v-slot:header>
            <h1>Category Form</h1>
        </template>

        <card shadow type="secondary">
            <form @submit="submitCategoryForm">
                <div class="row">
                    <div class="col-lg-12">
                        <base-input alternative="" label="Name" placeholder="Name" input-classes="form-control-alternative" v-model="categoryModel.name" />
                    </div>

                    <div class="col-lg-12">
                        <div class="form-group">
                            <base-input alternative="" label="Description">
                                <textarea
                                    rows="6"
                                    class="form-control form-control-alternative"
                                    placeholder="A few words about category ..."
                                    v-model="categoryModel.description"
                                ></textarea>
                            </base-input>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <label class="font-weight-bold"> Image </label>

                        <div id="pond-container"></div>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col">
                        <button class="btn btn-primary float-right">Submit</button>
                    </div>
                </div>
            </form>
        </card>
    </modal>

    <div>
        <base-header
            class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style="min-height: 600px; background-image: url(img/theme/covers/lego.jpg); background-size: cover; background-position: center top"
        >
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Categories</h1>

                        <p class="text-white mt-0 mb-5">Organize themes with categories. Categories are useful for searching, listing, and featuring.</p>

                        <button class="btn btn-default" @click="showFormModal()">
                            <i class="fas fa-plus-circle text-success mr-2"></i>
                            Add Category
                        </button>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <categories-table
                        title="Category List"
                        :content="categoriesData"
                        :isLoading="categoriesLoading"
                        @pageChanged="pageChanged"
                        @deleteItem="deleteCategory"
                        @featuredItem="setFeaturedCategory"
                    ></categories-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CategoriesTable from "./Tables/CategoriesTable";
import baseUrl from "./../../helpers/BaseUrl";

import * as FilePond from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import store from "store";

import CategoryService from "@/services/CategoryService";

FilePond.registerPlugin(FilePondPluginImagePreview);

export default {
    name: "categories",
    components: {
        CategoriesTable,
    },
    data() {
        return {
            pond: null,

            categoriesLoading: false,
            categoriesData: [],

            categoryModel: {
                name: "",
                description: "",
            },

            isOpenFormModal: false,
        };
    },

    mounted() {
        this.loadCategories();

        this.initFilepond();
    },

    methods: {
        // setup and create filepond instance
        initFilepond() {
            FilePond.setOptions({
                instantUpload: false,
                allowProcess: false,
                maxFiles: 1,
            });

            this.pond = FilePond.create({
                multiple: false,
                name: "filepond",
            });

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        // load categories
        loadCategories(page = 1) {
            if (!this.categoriesLoading) {
                CategoryService.getAll(page).then((response) => {
                    this.categoriesData = response.data.result;
                });
            }
        },

        // show category form modal
        showFormModal() {
            this.isOpenFormModal = !this.isOpenFormModal;

            this.categoryModel = {
                name: "",
                description: "",
            };
        },

        // submit category form
        submitCategoryForm(e) {
            e.preventDefault();

            CategoryService.create(this.categoryModel).then((response) => {
                const categoryId = response.data.result.id,
                    token = store.get("userAccessToken");

                FilePond.setOptions({
                    server: {
                        url: `${baseUrl}/api/theme-store/private/v1/categories/${categoryId}/upload`,
                        process: {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    },
                });

                this.pond.processFile().then(() => {
                    this.pond.removeFile();

                    this.loadCategories();

                    this.isOpenFormModal = false;
                });
            });
        },

        // delete the selected category
        deleteCategory(id) {
            CategoryService.delete(id).then(() => {
                this.loadCategories();
            });
        },

        // set as featured or unset
        setFeaturedCategory(id, state) {
            CategoryService.patch(id, {
                featured: state,
            });
        },

        // on page changed update the categories
        pageChanged(page) {
            if (page !== this.categoriesData.current_page) {
                this.loadCategories(page);
            }
        },
    },
};
</script>
