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
                    <th>Category</th>
                    <th>Description</th>
                    <th>Is Featured</th>
                    <th></th>
                </template>

                <template v-slot:default="row">
                    <th scope="row">
                        <div class="media align-items-center">
                            <router-link :to="{ name: 'category', params: { id: row.item.id } }" class="avatar rounded-circle mr-3">
                                <img :src="row.item.image ? row.item.image : 'img/theme/default-placeholder.png'" alt="Category image" />
                            </router-link>

                            <div class="media-body">
                                <span class="name mb-0 text-sm">
                                    <router-link :to="{ name: 'category', params: { id: row.item.id } }">
                                        {{ row.item.name }}
                                    </router-link>
                                </span>
                            </div>
                        </div>
                    </th>

                    <td class="text-break text-truncate" style="width: 100px">
                        {{ row.item.description.length > 50 ? row.item.description.substring(0, 50) + "..." : row.item.description }}
                    </td>

                    <td>
                        <toggle v-model="row.item.featured" @change="featuredItem(row.item)"></toggle>
                    </td>

                    <td class="text-right">
                        <base-dropdown class="dropdown" position="right">
                            <template v-slot:title>
                                <a class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </a>
                            </template>

                            <li class="dropdown-item" @click="deleteItem(row.item.id)">Delete</li>
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
import Toggle from "@vueform/toggle";

export default {
    name: "categories-table",
    components: {
        Toggle,
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

        // update item featured statue
        featuredItem(item) {
            this.$emit("featured-item", item.id, item.featured);
        },
    },
};
</script>
<style></style>
