<template>
    <div>
        <base-header
            class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style="min-height: 600px; background-image: url(img/theme/covers/lego-2.jpg); background-size: cover; background-position: center top"
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
                                <div class="col-lg-8">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <base-input
                                                alternative=""
                                                label="Name"
                                                placeholder="Name"
                                                input-classes="form-control-alternative"
                                                v-model="categoryModel.name"
                                            />
                                        </div>

                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <base-input alternative="" label="Description">
                                                    <textarea
                                                        rows="11"
                                                        class="form-control form-control-alternative"
                                                        placeholder="A few words about category ..."
                                                        v-model="categoryModel.description"
                                                    ></textarea>
                                                </base-input>
                                            </div>
                                        </div>

                                        <div class="col-lg-12">
                                            <label class="font-weight-bold"> Image </label>

                                            <div id="pond-container"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-4 mt-4">
                                    <div class="row">
                                        <div class="col">
                                            <img
                                                class="img img-fluid img-thumbnail"
                                                :src="category && category.image ? category.image : 'img/theme/default-placeholder.png'"
                                                alt="Category image"
                                            />
                                        </div>
                                    </div>
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

import CategoryService from "@/services/CategoryService";
import NotificationService from "@/services/NotificationService";
import FilepondService from "@/services/FilepondService";

export default {
    name: "category-page",
    components: {},
    data() {
        return {
            categoryId: this.$route.params.id,
            category: null,

            pond: null,

            categoryModel: {
                name: "",
                description: "",
            },
        };
    },

    mounted() {
        this.getCategory(true);
    },

    methods: {
        // setup and create filepond instance
        initFilepond(initWithResult = false) {
            if (!initWithResult) {
                return false;
            }

            const token = store.get("userAccessToken");

            FilepondService.setOptions({
                server: {
                    url: CategoryService.getImageUploadEndpoint(this.category.id),
                    process: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                },
            });

            this.pond = FilepondService.create();

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        // get current category
        getCategory(firstInit) {
            CategoryService.get(this.categoryId).then((response) => {
                this.category = response.data.result;

                this.categoryModel = {
                    name: response.data.result.name,
                    description: response.data.result.description,
                };

                this.initFilepond(firstInit);
            });
        },

        // submit category form
        submitCategoryForm(e) {
            e.preventDefault();

            CategoryService.update(this.categoryId, this.categoryModel).then(() => {
                NotificationService.success("Theme updated successfully");

                this.pond.removeFile();

                this.category.image = null;

                this.getCategory();
            });
        },
    },
};
</script>
