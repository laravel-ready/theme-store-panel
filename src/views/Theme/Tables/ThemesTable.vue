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
                    <th>Is Active</th>
                    <th>Is Featured</th>
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
                                        {{ `${row.item.vendor}` }}
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
                        <VueToggle title="" name="statusToggle" :toggled="row.item.status" @toggle="statusItem(row.item)" />
                    </td>

                    <td>
                        <VueToggle title="" name="featureToggle" :toggled="row.item.featured" @toggle="featuredItem(row.item)" />
                    </td>

                    <td class="text-right">
                        <button class="btn btn-sm btn-delete" @click="deleteItem(row.item.id)">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                version="1.1"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
                            </svg>
                        </button>
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
    },
};
</script>
<style></style>
