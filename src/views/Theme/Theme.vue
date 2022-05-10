<template>
    <div>
        <base-header
            class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style="min-height: 600px; background-image: url(img/theme/covers/desktop-setup-2.jpg); background-size: cover; background-position: center top"
        >
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">{{ themeModel.name ? themeModel.name : "New Theme" }}</h1>

                        <p class="text-white mt-0 mb-5">{{ themeModel.description ? themeModel.description : "" }}</p>

                        <router-link :to="{ name: 'releases', params: { id: themeId } }" v-if="themeId">
                            <button class="btn btn-default">
                                <i class="fas fa-plus-circle text-success mr-2"></i>
                                Add New Release
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <card shadow type="secondary">
                        <form @submit="submitThemeForm">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input
                                                alternative=""
                                                label="Vendor"
                                                placeholder="Theme Vendor or Provider Name"
                                                input-classes="form-control-alternative"
                                                v-model="themeModel.vendor"
                                            />
                                        </div>

                                        <div class="col-lg-4">
                                            <base-input
                                                alternative=""
                                                label="Name"
                                                placeholder="Theme Name"
                                                input-classes="form-control-alternative"
                                                v-model="themeModel.name"
                                            />
                                        </div>

                                        <div class="col-lg-4">
                                            <base-input
                                                alternative=""
                                                label="Group"
                                                placeholder="Group Name (web, admin, panel etc.)"
                                                input-classes="form-control-alternative"
                                                v-model="themeModel.group"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-12 mt-2">
                                    <div class="form-group">
                                        <base-input alternative="" label="Description">
                                            <textarea
                                                rows="6"
                                                class="form-control form-control-alternative"
                                                placeholder="A few words about theme ..."
                                                v-model="themeModel.description"
                                            ></textarea>
                                        </base-input>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-lg-6">
                                    <label class="font-weight-bold"> Authors </label>

                                    <vue-tags-input
                                        v-model="authorTagModel"
                                        :tags="authorSelectedTags"
                                        :allow-edit-tags="false"
                                        :autocomplete-items="filteredAuthorTagItems"
                                        :avoid-adding-duplicates="true"
                                        @tags-changed="authorTagsChanged"
                                        @before-adding-tag="beforeAddingAuthorTag"
                                    >
                                        <template v-slot:autocomplete-item="props">
                                            <div class="row mx-2 py-1">
                                                <div class="col-lg-1">
                                                    <img
                                                        class="rounded"
                                                        :src="props.item.avatar ? props.item.avatar : 'img/theme/default-placeholder.png'"
                                                        alt="Author Avatar"
                                                        height="30"
                                                        width="30"
                                                    />
                                                </div>

                                                <div class="col-lg-11">
                                                    <label @click="props.performAdd(props.item)" class="w-100 px-2 mt-1">
                                                        {{ props.item.name }}
                                                    </label>
                                                </div>
                                            </div>
                                        </template>
                                    </vue-tags-input>
                                </div>

                                <div class="col-lg-6">
                                    <label class="font-weight-bold"> Categories </label>

                                    <vue-tags-input
                                        v-model="categoryTagModel"
                                        :tags="categorySelectedTags"
                                        :allow-edit-tags="false"
                                        :autocomplete-items="filteredCategoryTagItems"
                                        :avoid-adding-duplicates="true"
                                        @tags-changed="categoryTagsChanged"
                                        @before-adding-tag="beforeAddingCategoryTag"
                                    >
                                        <template v-slot:autocomplete-item="props">
                                            <div class="row mx-2 py-1">
                                                <div class="col-lg-1">
                                                    <img
                                                        class="rounded"
                                                        :src="props.item.image ? props.item.image : 'img/theme/default-placeholder.png'"
                                                        alt="Category Image"
                                                        height="30"
                                                        width="30"
                                                    />
                                                </div>

                                                <div class="col-lg-11">
                                                    <label @click="props.performAdd(props.item)" class="w-100 px-2 mt-1">
                                                        {{ props.item.name }}
                                                    </label>
                                                </div>
                                            </div>
                                        </template>
                                    </vue-tags-input>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <label class="font-weight-bold"> Image </label>

                                            <div id="pond-container"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col">
                                    <label class="font-weight-bold"> Preview </label>

                                    <img
                                        class="img img-fluid img-thumbnail"
                                        :src="themeModel && themeModel.cover ? themeModel.cover : 'img/theme/default-placeholder.png'"
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
import VueTagsInput from "@sipec/vue3-tags-input";

import ThemeService from "@/services/ThemeService";
import AuthorService from "@/services/AuthorService";
import NotificationService from "@/services/NotificationService";
import FilepondService from "@/services/FilepondService";
import CategoryService from "@/services/CategoryService";

export default {
    name: "theme-page",
    components: {
        VueTagsInput,
    },
    data() {
        return {
            pond: null,

            themeId: null,

            themeModel: {
                name: "",
                description: "",
                vendor: "",
                group: "",
                status: true,
                authors: [],
                categories: [],
            },

            authorTagModel: "",
            authorSelectedTags: [],
            authorsList: [],

            categoryTagModel: "",
            categorySelectedTags: [],
            categoryList: [],
        };
    },

    computed: {
        filteredAuthorTagItems() {
            if (this.authorsList && this.authorsList.length) {
                const sugessions = this.authorsList.filter((x) => {
                    return x.name.toLowerCase().indexOf(this.authorTagModel.toLowerCase()) !== -1;
                });

                return sugessions.length ? sugessions : this.authorsList.slice(0, 10);
            }

            return [];
        },

        filteredCategoryTagItems() {
            if (this.categoryList && this.categoryList.length) {
                const sugessions = this.categoryList.filter((x) => {
                    return x.name.toLowerCase().indexOf(this.categoryTagModel.toLowerCase()) !== -1;
                });

                return sugessions.length ? sugessions : this.categoryList.slice(0, 10);
            }

            return [];
        },
    },

    mounted() {
        this.themeId = this.$route.params.id;

        this.loadAuthors();
        this.loadCategories();

        this.initFilepond();

        if (this.themeId && this.themeId != "new") {
            this.getTheme(this.themeId);
        }
    },

    methods: {
        // #region Author

        // load all authors for tags input
        loadAuthors() {
            AuthorService.getAll(0, true).then((response) => {
                this.authorsList = response.data.result.map(function (item) {
                    item.text = item.name;

                    return item;
                });
            });
        },

        // tags changed event
        authorTagsChanged(newTags) {
            this.authorSelectedTags = newTags;
        },

        // before adding author tag
        beforeAddingAuthorTag(tagObject) {
            (this.authorsList && this.authorsList.length
                ? this.authorsList.filter((x) => {
                      return x.name === tagObject.tag.name;
                  }).length
                : 0) > 0
                ? tagObject.addTag()
                : null;
        },

        // #endregion

        // #region Category

        // load all categories for tags input
        loadCategories() {
            CategoryService.getAll(0, true).then((response) => {
                this.categoryList = response.data.result.map(function (item) {
                    item.text = item.name;

                    return item;
                });
            });
        },

        // tags changed event
        categoryTagsChanged(newTags) {
            this.categorySelectedTags = newTags;
        },

        // before adding category tag
        beforeAddingCategoryTag(tagObject) {
            (this.categoryList && this.categoryList.length
                ? this.categoryList.filter((x) => {
                      return x.name === tagObject.tag.name;
                  }).length
                : 0) > 0
                ? tagObject.addTag()
                : null;
        },

        // #endregion

        // setup and create filepond instance
        initFilepond() {
            if (!this.themeId || this.themeId == "new") {
                const token = store.get("userAccessToken");

                FilepondService.setOptions({
                    server: {
                        url: ThemeService.getImageUploadEndpoint(this.themeId),
                        process: {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    },
                });
            }

            this.pond = FilepondService.create();

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        getTheme(id) {
            ThemeService.get(id).then((response) => {
                this.themeModel = response.data.result;

                this.themeModel.authors = response.data.result.authors.map((item) => {
                    item.text = item.name;

                    return item;
                });

                this.authorSelectedTags = this.themeModel.authors;

                this.themeModel.categories = response.data.result.categories.map((item) => {
                    item.text = item.name;

                    return item;
                });

                this.categorySelectedTags = this.themeModel.categories;
            });
        },

        // submit form
        submitThemeForm(e) {
            e.preventDefault();

            const authors = JSON.parse(JSON.stringify(this.authorSelectedTags)).map(function (item) {
                return item.id;
            });

            const categories = JSON.parse(JSON.stringify(this.categorySelectedTags)).map(function (item) {
                return item.id;
            });

            this.themeModel.authors = authors;
            this.themeModel.categories = categories;

            if (this.themeId && this.themeId != "new") {
                ThemeService.update(this.themeId, this.themeModel).then(() => {
                    this.pond.processFile().then(() => {
                        this.themeModel.cover = null;

                        this.pond.removeFile();

                        this.getTheme();
                    });

                    this.getTheme();

                    NotificationService.success("Theme updated successfully");
                });
            } else {
                ThemeService.create(this.themeModel)
                    .then((response) => {
                        const themeId = response.data.result.id,
                            token = store.get("userAccessToken");

                        FilepondService.setOptions({
                            server: {
                                url: ThemeService.getImageUploadEndpoint(themeId),
                                process: {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                },
                            },
                        });

                        this.themeId = themeId;

                        this.pond.processFile();

                        NotificationService.success("Theme created successfully");
                    })
                    .then(() => {
                        this.$router.push({
                            name: "theme",
                            params: {
                                id: this.themeId,
                            },
                        });

                        this.getTheme(this.themeId);
                    });
            }
        },
    },
};
</script>
