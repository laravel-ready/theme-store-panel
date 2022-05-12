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
                        <base-input alternative="" label="Name" placeholder="Name" input-classes="form-control-alternative" v-model="authorModel.name" />
                    </div>

                    <div class="col-lg-12">
                        <base-input alternative="" label="Title" placeholder="Title" input-classes="form-control-alternative" v-model="authorModel.title" />
                    </div>

                    <div class="col-lg-12">
                        <base-input
                            alternative=""
                            label="Contact"
                            placeholder="Contact"
                            input-classes="form-control-alternative"
                            v-model="authorModel.contact"
                        />
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
            style="min-height: 600px; background-image: url(img/theme/covers/notebook.jpg); background-size: cover; background-position: center top"
        >
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Authors</h1>

                        <p class="text-white mt-0 mb-5">
                            Authors will be used in the theme manifest/config file. Author info contains name/nickname and contact detail.
                        </p>

                        <button class="btn btn-default" @click="showFormModal()">
                            <i class="fas fa-plus-circle text-success mr-2"></i>
                            Add Author
                        </button>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <authors-table
                        title="Authors List"
                        :content="authorsData"
                        :isLoading="authorsLoading"
                        @pageChanged="pageChanged"
                        @deleteItem="deleteItem"
                        @featuredItem="setFeatured"
                    ></authors-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthorsTable from "./Tables/AuthorsTable";

import store from "store";

import AuthorService from "@/services/AuthorService";
import FilepondService from "@/services/FilepondService";

export default {
    name: "authors-page",
    components: {
        AuthorsTable,
    },
    data() {
        return {
            pond: null,

            authorsLoading: false,
            authorsData: [],

            authorModel: {
                name: "",
                contact: "",
                title: "",
            },

            isOpenFormModal: false,
        };
    },

    mounted() {
        this.loadAuthors();

        this.initFilepond();
    },

    methods: {
        // setup and create filepond instance
        initFilepond() {
            this.pond = FilepondService.create();

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        loadAuthors() {
            this.authorsLoading = true;

            AuthorService.getAll()
                .then((response) => {
                    this.authorsData = response.data.result;
                })
                .finally(() => {
                    this.authorsLoading = false;
                });
        },

        // show form modal
        showFormModal() {
            this.isOpenFormModal = !this.isOpenFormModal;

            this.authorModel = {
                name: "",
                contact: "",
            };
        },

        // submit form
        submitCategoryForm(e) {
            e.preventDefault();

            AuthorService.create(this.authorModel).then((response) => {
                const authorId = response.data.result.id,
                    token = store.get("userAccessToken");

                FilepondService.setOptions({
                    server: {
                        url: AuthorService.getImageUploadEndpoint(authorId),
                        process: {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    },
                });

                this.pond.processFile().then(() => {
                    this.pond.removeFile();

                    this.loadAuthors();

                    this.isOpenFormModal = false;
                });
            });
        },

        // delete the selected item
        deleteItem(id) {
            AuthorService.delete(id).then(() => {
                this.loadAuthors();
            });
        },

        // set as featured or unset
        setFeatured(id, state) {
            AuthorService.patch(id, {
                featured: state,
            });
        },

        // on page changed update the categories
        pageChanged(page) {
            if (page !== this.authorsData.current_page) {
                this.loadAuthors(page);
            }
        },
    },
};
</script>
