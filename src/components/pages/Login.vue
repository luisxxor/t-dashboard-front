<template>
    <div class="container">
        <loading color="#5e72e4" :active.sync="loading" :is-full-page="true"></loading>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <card>
                    <div class="card-title">Iniciar sesión</div>

                    <div class="card-text">
                        <form
                            method="POST"
                            aria-label="Iniciar sesión"
                            @submit.prevent="attemptLogin"
                        >
                            <base-input
                                label="Correo electrónico"
                                :error="emailErrorMessage"
                                id="email"
                                name="email"
                                v-model="email"
                                :valid="!emailError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Contraseña"
                                :error="passwordErrorMessage"
                                v-model="password"
                                id="password"
                                type="password"
                                name="password"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <div class="form-group row">
                                <div class="col-12 col-lg text-center text-lg-left">
                                    <base-checkbox
                                        name="remember"
                                        id="remember"
                                        v-model="remember"
                                    >
                                        Recordarme
                                    </base-checkbox>
                                </div>
                                <div class="col-12 col-lg text-center mt-4 mt-lg-0 text-lg-right">
                                    <base-button
                                        class="d-none d-lg-inline-block"
                                        size="sm"
                                        type="primary"
                                        nativeType="input"
                                        :disabled="loading"
                                    >
                                        Iniciar sesión
                                    </base-button>
                                    <base-button
                                        class="d-lg-none"
                                        size="md"
                                        type="primary"
                                        nativeType="input"
                                        :disabled="loading"
                                    >
                                        Iniciar sesión
                                    </base-button>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col text-center text-lg-left">
                                    <router-link
                                        style="font-size: .7rem"
                                        class="btn btn-link"
                                        to="/password/forgot"
                                    >
                                        ¿Olvidó su Contraseña?
                                    </router-link>
                                </div>
                                <div class="col text-center text-lg-right">
                                    <router-link
                                        style="font-size: .7rem"
                                        class="btn btn-link"
                                        to="/register"
                                    >
                                        Crear cuenta
                                    </router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </card>
            </div>
        </div>
        <div class="row justify-content-center my-3">
            <div class="col-md-6">
                <card>
                    <div class="card-title">Iniciar sesión con redes sociales</div>
                    <div class="card-text">
                        <base-button type="google-plus" icon tag="a" :href="routeLoginGoogle">
                            <span class="btn-inner--icon mr-2">
                                <font-awesome-icon :icon="['fab', 'google']" />
                            </span>
                            <span class="btn-inner--text">Google</span>
                        </base-button>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>

import Loading from 'vue-loading-overlay'
import { mapFields } from 'vuex-map-fields'
import Card from '../argon/Card'
import store from '../../store'

export default {
    name: 'page-login',
    store,
    components: {
        Card,
        Loading,
    },
    data() {
        return {
            email: '',
            password: '',
            remember: false,
            routeLoginGoogle: '/login/google',
        }
    },
    computed: {
        ...mapFields({
            loading: 'login.loading',
            emailErrorMessage: 'login.error.email',
            passwordErrorMessage: 'login.error.password',
        }),
        emailError() {
            return this.emailErrorMessage.length > 0
        },
        passwordError() {
            return this.passwordErrorMessage.length > 0
        },
    },
    methods: {
        attemptLogin() {
            this.$store.dispatch('login', {
                email: this.email,
                password: this.password,
            })
                .then(() => this.$router.push('/properties'))
                .catch(err => console.log(err))
        },
    },
    filters: {
        undefinedOrFalse: val => val ? undefined : val,
    },
}
</script>
