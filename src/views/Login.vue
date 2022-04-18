<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        <small>sign in with credentials</small>
                    </div>

                    <form role="form" @submit="submitLoginForm">
                        <base-input formClasses="input-group-alternative mb-3" placeholder="Email" addon-left-icon="ni ni-email-83" v-model="model.email">
                        </base-input>

                        <base-input
                            formClasses="input-group-alternative mb-3"
                            placeholder="Password"
                            type="password"
                            addon-left-icon="ni ni-lock-circle-open"
                            v-model="model.password"
                        >
                        </base-input>

                        <!--<base-checkbox class="custom-control-alternative"> // <span class="text-muted">Remember me</span> // </base-checkbox>-->

                        <div class="text-center">
                            <button class="btn btn-primary mt-3" type="submit">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-6">
                    <a href="#" class="text-light"><small>Forgot password?</small></a>
                </div>

                <div class="col-6 text-right">
                    <router-link to="/register" class="text-light"><small>Create new account</small></router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/AuthService";
import store from "store";

export default {
    name: "login",
    data() {
        return {
            model: {
                email: "",
                password: "",
            },
        };
    },

    mounted() {
        AuthService.initCookieSession();
    },

    methods: {
        submitLoginForm(event) {
            event.preventDefault();
            AuthService.login(this.model).then((response) => {
                store.set("user", response.data.user);
                store.set("userAccessToken", response.data.token);

                this.$router.go();
            });
        },
    },
};
</script>
<style></style>
