<template>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
        <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent' : ''">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
                        {{ title }}
                    </h3>
                </div>

                <div class="col">
                    <base-pagination
                        class="float-right"
                        :pageCount="content.last_page"
                        :total="content.last_page"
                        :perPage="content.per_page"
                        :value="content.current_page"
                        @input="changePage"
                    ></base-pagination>
                </div>
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark' : ''"
                :thead-classes="type === 'dark' ? 'thead-dark' : 'thead-light'"
                tbody-classes="list"
                :data="content.data"
                v-if="content.data"
            >
                <template v-slot:columns>
                    <th>Version</th>
                    <th>File Size</th>
                    <th>Notes</th>
                    <th>Is Active</th>
                    <th>Release Date</th>
                    <th></th>
                </template>

                <template v-slot:default="row">
                    <th scope="row">
                        <div class="media align-items-center">
                            <div class="media-body">
                                <span class="name mb-0 text-sm">
                                    {{ `v${row.item.version}` }}

                                    <span class="badge badge-primary ml-2 pt-2" v-if="latestRelease && latestRelease.id == row.item.id"> Current </span>
                                </span>
                            </div>
                        </div>
                    </th>

                    <td>
                        {{ row.item.file_size }}
                    </td>

                    <td>
                        <button
                            class="btn btn-sm px-23 btn-link shadow-none"
                            @click="showDetails(row.item)"
                            :title="`Show release notes for v${row.item.version}`"
                        >
                            Release Notes for v{{ row.item.version }}
                        </button>
                    </td>

                    <td>
                        <VueToggle title="" name="statusToggle" :toggled="row.item.status" @toggle="statusItem(row.item)" />
                    </td>

                    <td>
                        {{ row.item.created_at }}
                    </td>

                    <td class="text-right">
                        <base-dropdown class="dropdown" position="right">
                            <template v-slot:title>
                                <a class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </a>
                            </template>

                            <li class="dropdown-item text-primary" @click="showUpdateFormModal(row.item)">Update Details</li>

                            <li class="dropdown-item text-primary" @click="downloadItem(row.item)">Download</li>

                            <li class="dropdown-item text-danger" @click="deleteItem(row.item.id)">Delete</li>
                        </base-dropdown>
                    </td>
                </template>
            </base-table>
        </div>

        <h3 v-if="!content.data" class="text-center my-4">There is no data to display</h3>

        <div class="card-footer d-flex justify-content-end" :class="type === 'dark' ? 'bg-transparent' : ''" v-if="content.data">
            <base-pagination
                :pageCount="content.last_page"
                :total="content.last_page"
                :perPage="content.per_page"
                :value="content.current_page"
                @input="changePage"
            ></base-pagination>
        </div>
    </div>
</template>

<script>
import VueToggle from "vue-toggle-component";

export default {
    name: "releases-table",
    components: {
        VueToggle,
    },
    props: {
        type: {
            type: String,
        },
        title: String,
        content: null,
        selectedPage: {
            type: Number,
            default: 1,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        latestRelease: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {};
    },

    methods: {
        // navigate to the selected page
        changePage(page) {
            this.$emit("page-changed", page);
        },

        // delete item event
        deleteItem(id) {
            this.$emit("delete-item", id);
        },

        // show notes
        showDetails(item) {
            this.$emit("show-item", item);
        },

        // show update form
        showUpdateFormModal(item) {
            this.$emit("show-update-form-modal", item);
        },

        // download item
        downloadItem(item) {
            this.$emit("download-item", item);
        },

        // update item status
        statusItem(item) {
            item.status = !item.status;

            this.$emit("status-item", item.id, item.status);
        },
    },
};
</script>
<style></style>
