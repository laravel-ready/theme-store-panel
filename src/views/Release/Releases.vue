<template>
    <div>
        <!-- Form Modal -->
        <modal ref="formModal" v-model:show="isOpenFormModal" modalClasses="modal-lg">
            <template v-slot:header>
                <h1>Release Form</h1>
            </template>

            <card shadow type="secondary">
                <form @submit="submitNewReleaseForm">
                    <div class="row">
                        <div class="col-lg-12">
                            <base-input
                                alternative=""
                                label="Version"
                                placeholder="Version"
                                input-classes="form-control-alternative"
                                v-model="releaseModel.version"
                            />
                        </div>

                        <div class="col-lg-12">
                            <div class="form-group">
                                <base-input alternative="" label="Notes">
                                    <textarea
                                        rows="6"
                                        class="form-control form-control-alternative"
                                        placeholder="Add notes for this release ..."
                                        v-model="releaseModel.notes"
                                    ></textarea>
                                </base-input>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <label class="font-weight-bold"> Theme Files </label>

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

        <!-- Form Update Modal -->
        <modal ref="formModal" v-model:show="isOpenUpdateFormModal" modalClasses="modal-lg">
            <template v-slot:header>
                <h1>Release Form</h1>
            </template>

            <card shadow type="secondary">
                <form @submit="submitUpdateReleaseForm">
                    <div class="row">
                        <div class="col-lg-12">
                            <base-input
                                alternative=""
                                label="Version"
                                placeholder="Version"
                                input-classes="form-control-alternative"
                                v-model="releaseModel.version"
                            />
                        </div>

                        <div class="col-lg-12">
                            <div class="form-group">
                                <base-input alternative="" label="Notes">
                                    <textarea
                                        rows="6"
                                        class="form-control form-control-alternative"
                                        placeholder="Add notes for this release ..."
                                        v-model="releaseModel.notes"
                                    ></textarea>
                                </base-input>
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
        </modal>

        <!-- Notes Modal -->
        <modal ref="formModal" v-model:show="isOpenNotesModal" modalClasses="modal-lg">
            <template v-slot:header>
                <h1>
                    {{ showItemDetailsModel ? `v${showItemDetailsModel.version}` : "-" }}
                </h1>
            </template>

            <card shadow type="secondary">
                <p v-if="showItemDetailsModel" v-html="showItemDetailsModel.notes" style="white-space: pre"></p>
            </card>
        </modal>

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
                        <h1 class="display-2 text-white">{{ themeData ? themeData.name : "-" }} Releases</h1>

                        <p class="text-white mt-0 mb-5">Releases contains theme versions and theme installation files.</p>

                        <button class="btn btn-default" @click="showFormModal()">
                            <i class="fas fa-plus-circle text-success mr-2"></i>
                            New Release
                        </button>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <releases-table
                        title="Release List"
                        :content="themeReleasesData"
                        :isLoading="releasesLoading"
                        :latestRelease="latestRelease"
                        @pageChanged="pageChanged"
                        @deleteItem="deleteItem"
                        @showItem="showNotesModal"
                        @showUpdateFormModal="showUpdateFormModal"
                        @statusItem="setStatus"
                        @downloadItem="downloadFile"
                    ></releases-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "store";
import { saveAs } from "file-saver";

import ReleasesTable from "./Tables/ReleasesTable";

import ThemeService from "@/services/ThemeService";
import ReleaseService from "@/services/ReleaseService";
import FilepondService from "@/services/FilepondService";
import NotificationService from "@/services/NotificationService";

export default {
    name: "releases-page",
    components: {
        ReleasesTable,
    },
    data() {
        return {
            themeData: null,

            releasesLoading: false,
            themeReleasesData: [],
            latestRelease: null,

            themeId: null,

            isOpenFormModal: false,
            isOpenNotesModal: false,
            isOpenUpdateFormModal: false,

            releaseModel: {
                notes: "",
                version: "",
                theme_id: null,
            },

            showItemDetailsModel: null,
        };
    },

    mounted() {
        this.themeId = this.$route.params.id;

        this.getTheme();

        this.loadReleases();

        this.initFilepond();
    },

    methods: {
        getTheme() {
            ThemeService.get(this.themeId).then((response) => {
                this.themeData = response.data.result;
            });
        },

        // load items
        loadReleases(page = 1) {
            if (!this.releasesLoading) {
                ReleaseService.getAll(this.themeId, page).then((response) => {
                    this.themeReleasesData = response.data.result;

                    this.latestRelease = response.data.latestRelease;
                });
            }
        },

        // show form modal
        showFormModal() {
            this.isOpenFormModal = !this.isOpenFormModal;

            this.releaseModel = {
                notes: "",
                version: "",
                theme_id: this.themeId,
            };
        },

        // show notes modal
        showNotesModal(item) {
            this.isOpenNotesModal = !this.isOpenNotesModal;

            this.showItemDetailsModel = item;
        },

        // show notes modal
        showUpdateFormModal(item) {
            this.isOpenUpdateFormModal = !this.isOpenUpdateFormModal;

            this.releaseModel = item;
        },

        // setup and create filepond instance
        initFilepond() {
            this.pond = FilepondService.create({
                acceptedFileTypes: ["application/x-zip-compressed"],
                maxFileSize: null,
            });

            document.querySelector("#pond-container").appendChild(this.pond.element);
        },

        // submit create form
        submitNewReleaseForm(e) {
            e.preventDefault();

            ReleaseService.create(this.releaseModel).then((response) => {
                const categoryId = response.data.result.id,
                    token = store.get("userAccessToken");

                FilepondService.setOptions({
                    server: {
                        url: ReleaseService.getImageUploadEndpoint(categoryId),
                        process: {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    },
                });

                this.pond.processFile().then(() => {
                    this.pond.removeFile();

                    this.loadReleases();

                    this.isOpenFormModal = false;

                    NotificationService.success("Release created successfully");
                });
            });
        },

        // submit update form
        submitUpdateReleaseForm(e) {
            e.preventDefault();

            ReleaseService.update(this.releaseModel.id, this.releaseModel).then(() => {
                this.isOpenUpdateFormModal = false;

                NotificationService.success("Release details updated successfully");
            });
        },

        // delete the selected item
        deleteItem(id) {
            ReleaseService.delete(id).then(() => {
                this.loadReleases();
            });
        },

        // update item status
        setStatus(id, state) {
            ReleaseService.patch(id, {
                status: state,
            }).then(() => {
                this.loadReleases();
            });
        },

        downloadFile(item) {
            ReleaseService.download(item.id).then((response) => {
                const blob = new Blob([response.data], {
                    type: "application/zip",
                });

                saveAs(blob, `${this.themeData.name}-v${item.version}.zip`);
            });
        },

        // on page changed update the categories
        pageChanged(page) {
            if (page !== this.themeReleasesData.current_page) {
                this.loadReleases(page);
            }
        },
    },
};
</script>
