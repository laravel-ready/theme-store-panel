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
                    <th>Theme</th>
                    <th>Vendor</th>
                    <th>Group</th>
                    <th>Releases</th>
                    <th>Is Active</th>
                    <th>Is Featured</th>
                    <th>Is Premium</th>
                    <th></th>
                </template>

                <template v-slot:default="row">
                    <th scope="row">
                        <div class="media align-items-center">
                            <router-link :to="{ name: 'category', params: { id: row.item.id } }" class="avatar rounded-circle mr-3">
                                <img :src="row.item.cover ? row.item.cover : 'img/theme/default-placeholder.png'" alt="Category image" />
                            </router-link>

                            <div class="media-body">
                                <span class="name mb-0 text-sm">
                                    <router-link :to="{ name: 'theme', params: { id: row.item.id } }">
                                        {{ `${row.item.name}` }}
                                    </router-link>
                                </span>
                            </div>
                        </div>
                    </th>

                    <td>
                        {{ row.item.vendor }}
                    </td>

                    <td>
                        {{ row.item.group }}
                    </td>

                    <td>
                        <router-link :to="{ name: 'releases', params: { id: row.item.id } }">
                            <button class="btn btn-link border rounded-pill shadow-none" :title="'Total Releases: ' + row.item.releases_count">
                                {{ row.item.releases_count }}

                                <button class="btn btn-sm shadow-none" title="Add new release">
                                    <i class="fas fa-plus ml-2"></i>
                                </button>
                            </button>
                        </router-link>
                    </td>

                    <td>
                        <VueToggle title="" name="statusToggle" :toggled="row.item.status" @toggle="statusItem(row.item)" />
                    </td>

                    <td>
                        <VueToggle title="" name="featureToggle" :toggled="row.item.featured" @toggle="featuredItem(row.item)" />
                    </td>

                    <td>
                        <VueToggle title="" name="premiumToggle" :toggled="row.item.is_premium" @toggle="premiumItem(row.item)" />
                    </td>

                    <td class="text-right">
                        <base-dropdown class="dropdown" position="right">
                            <template v-slot:title>
                                <a class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </a>
                            </template>

                            <router-link :to="{ name: 'releases', params: { id: row.item.id } }">
                                <li class="dropdown-item">Add Release</li>
                            </router-link>

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
    name: "themes-table",
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

        // update item featured status
        featuredItem(item) {
            item.featured = !item.featured;

            this.$emit("featured-item", item.id, item.featured);
        },

        // update item status
        statusItem(item) {
            item.status = !item.status;

            this.$emit("status-item", item.id, item.status);
        },

        // update premium status
        premiumItem(item) {
            item.is_premium = !item.is_premium;

            this.$emit("premium-item", item.id, item.is_premium);
        },
    },
};
</script>
<style></style>
