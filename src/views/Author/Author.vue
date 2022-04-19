<template>
    <div>
        <base-header
            class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style="min-height: 600px; background-image: url(img/theme/covers/notebook-2.jpg); background-size: cover; background-position: center top"
        >
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">{{ category ? category.name : "" }}</h1>

                        <p class="text-white mt-0 mb-5">{{ category ? category.description : "" }}</p>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <card shadow type="secondary" class="mb-5">
                        <form @submit="submitCategoryForm">
                            <div class="row">
                                <div class="col-lg-12">
                                    <base-input
                                        alternative=""
                                        label="Name"
                                        placeholder="Name"
                                        input-classes="form-control-alternative"
                                        v-model="authorModel.name"
                                    />
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
                                <div class="col">
                                    <label class="font-weight-bold"> Image </label>

                                    <div id="pond-container"></div>
                                </div>

                                <div class="col">
                                    <label class="font-weight-bold"> Preview </label>

                                    <img
                                        class="img img-fluid img-thumbnail"
                                        :src="authorModel && authorModel.avatar ? authorModel.avatar : 'img/theme/default-placeholder.png'"
                                        alt="Theme image"
                                    />
                                </div>
                            </div>

                            <div class="row mt-5">
                                <div class="col">
                                    <button class="btn btn-primary float-right">Submit</button>
                                </div>
                            </div>
                        </form>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "store";

import * as FilePond from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import AuthorService from "@/services/AuthorService";
import NotificationService from "@/services/NotificationService";

FilePond.registerPlugin(FilePondPluginImagePreview);

export default {
    name: "author-page",
    components: {},
    data() {
        return {
            author: null,

            pond: null,

            authorModel: {
                name: "",
                contact: "",
            },
        };
    },

    mounted() {
        this.getAuthor(true);
    },

    methods: {
        // setup and create filepond instance
        initFilepond(initWithResult = false) {
            if (!initWithResult) {
                return false;
            }

            const token = store.get("userAccessToken");

            FilePond.setOptions({
                instantUpload: false,
                allowProcess: false,
                maxFiles: 1,
                server: {
                    url: AuthorService.getImageUploadEndpoint(this.authorModel.id),
                    process: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                },
            });

            this.pond = FilePond.create({
                multiple: false,
                name: "filepond",
            });

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        // get current item
        getAuthor(firstInit) {
            AuthorService.get(this.$route.params.id).then((response) => {
                this.authorModel = response.data.result;

                this.initFilepond(firstInit);
            });
        },

        // submit form
        submitCategoryForm(e) {
            e.preventDefault();

            this.authorModel.avatar = null;

            AuthorService.update(this.$route.params.id, this.authorModel).then(() => {
                this.pond.processFile().then(() => {
                    NotificationService.success("Theme updated successfully");

                    this.getAuthor();

                    this.pond.removeFile();
                });
            });
        },
    },
};
</script>
