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
                        <h1 class="display-2 text-white">{{ category ? category.name : "" }}</h1>

                        <p class="text-white mt-0 mb-5">{{ category ? category.description : "" }}</p>
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

                                <div class="col-lg-12">
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
                                <div class="col-lg-12">
                                    <label class="font-weight-bold"> Authors </label>

                                    <vue-tags-input
                                        v-model="inputTagModel"
                                        :tags="inputSelectedTags"
                                        :allow-edit-tags="false"
                                        :autocomplete-items="filteredItems"
                                        :avoid-adding-duplicates="true"
                                        @tags-changed="tagsChanged"
                                        @before-adding-tag="beforeAddingTag"
                                    >
                                        <template v-slot:autocomplete-item="props">
                                            <label @click="props.performAdd(props.item)" class="w-100 px-2 mt-1">
                                                {{ props.item.name }}
                                            </label>
                                        </template>
                                    </vue-tags-input>
                                </div>
                            </div>

                            <div class="row mt-4">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "store";

import * as FilePond from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import ThemeService from "@/services/ThemeService";
import AuthorService from "@/services/AuthorService";

FilePond.registerPlugin(FilePondPluginImagePreview);

export default {
    name: "theme",
    components: {},
    data() {
        return {
            pond: null,

            themeModel: {
                name: "",
                description: "",
                vendor: "",
                group: "",
                status: true,
                authors: [],
            },

            inputTagModel: "",
            inputSelectedTags: [],

            authorsList: [],
        };
    },

    computed: {
        filteredItems() {
            return this.authorsList && this.authorsList.length
                ? this.authorsList.filter((x) => {
                      return x.name.toLowerCase().indexOf(this.inputTagModel.toLowerCase()) !== -1;
                  })
                : [];
        },
    },

    mounted() {
        this.loadAuthors();

        this.initFilepond();

        this.themeModel = {
            name: "thm",
            description: "dsa dasd as",
            vendor: "venn",
            group: "admin",
            // status: true,
            authors: [],
        };
    },

    methods: {
        // load all authors for tags input
        loadAuthors() {
            AuthorService.getAll().then((response) => {
                this.authorsList = response.data.result.map(function (item) {
                    item.text = item.name;

                    return item;
                });
            });
        },

        // before adding author tag
        beforeAddingTag(tagObject) {
            (this.authorsList && this.authorsList.length
                ? this.authorsList.filter((x) => {
                      return x.name === tagObject.tag.name;
                  }).length
                : 0) > 0
                ? tagObject.addTag()
                : null;
        },

        // tags changed event
        tagsChanged(newTags) {
            this.inputSelectedTags = newTags;
        },

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

        // submit category form
        submitThemeForm(e) {
            e.preventDefault();

            const authors = JSON.parse(JSON.stringify(this.inputSelectedTags)).map(function (item) {
                return item.id;
            });

            this.themeModel.authors = authors;

            ThemeService.create(this.themeModel).then((response) => {
                const themeId = response.data.result.id,
                    token = store.get("userAccessToken");

                FilePond.setOptions({
                    server: {
                        url: ThemeService.getImageUploadEndpoint(themeId),
                        process: {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    },
                });

                this.pond.processFile().then(() => {
                    this.pond.removeFile();
                });
            });
        },
    },
};
</script>
