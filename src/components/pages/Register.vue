<template>
    <div class="container">
        <loading color="#5e72e4" :active.sync="loading" :is-full-page="true"></loading>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <card>
                    <div class="card-title">Crear cuenta</div>

                    <div class="card-text">
                        <form method="POST" @submit.prevent="submit" aria-label="Crear cuenta">
                            <base-input
                                label="Nombre"
                                :error="nameErrorText"
                                id="name"
                                name="name"
                                v-model="name"
                                required
                                :valid="!nameError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Apellido"
                                :error="lastnameErrorText"
                                id="lastname"
                                name="lastname"
                                v-model="lastname"
                                required
                                :valid="!lastnameError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Correo electrónico"
                                :error="emailErrorText"
                                id="email"
                                name="email"
                                v-model="email"
                                :valid="!emailError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <base-input
                                label="Contraseña"
                                :error="passwordErrorText"
                                id="password"
                                type="password"
                                name="password"
                                v-model="password"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <base-input
                                label="Confirmar contraseña"
                                id="password-confirm"
                                name="password_confirmation"
                                type="password"
                                v-model="passwordConfirm"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <div class="form-group row">
                                <div class="col-12 col-lg text-center mt-4 mt-lg-0 text-lg-left">
                                    <base-button
                                        class="d-none d-lg-inline-block"
                                        size="sm"
                                        type="primary"
                                        nativeType="input"
                                    >
                                        Crear cuenta
                                    </base-button>
                                    <base-button
                                        class="d-lg-none"
                                        size="md"
                                        type="primary"
                                        nativeType="input"
                                    >
                                        Crear cuenta
                                    </base-button>
                                </div>

                                <div class="col-12 col-lg text-center text-lg-right">
                                    <router-link
                                        style="font-size: .7rem"
                                        class="btn btn-link"
                                        to='/login'
                                    >
                                        Ya tengo una cuenta
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
                    <div class="card-title">Registrarse con redes sociales</div>
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

export default {
    name: 'Register',
    components: {
        Loading,
    },
    data() {
        return {
            name: '',
            lastname: '',
            email: '',
            password: '',
            passwordConfirm: '',
            errors: {},
            routeLogin: '/login',
            routeLoginGoogle: '/login/google',
            loading: false,
        }
    },
    computed: {
        nameError() {
            return Array.isArray(this.errors.name) && this.errors.name[0]
        },
        nameErrorText() {
            return this.nameError ? this.errors.name[0] : ''
        },
        lastnameError() {
            return Array.isArray(this.errors.lastname) && this.errors.lastname[0]
        },
        lastnameErrorText() {
            return this.lastnameError ? this.errors.lastname[0] : ''
        },
        emailError() {
            return Array.isArray(this.errors.email) && this.errors.email[0]
        },
        emailErrorText() {
            return this.emailError ? this.errors.email[0] : ''
        },
        passwordError() {
            return Array.isArray(this.errors.password) && this.errors.password[0]
        },
        passwordErrorText() {
            return this.passwordError ? this.errors.password[0] : ''
        },
    },
    methods: {
        submit() {
            this.loading = true
            this.$store.dispatch('register', {
                name: this.name,
                lastname: this.lastname,
                email: this.email,
                password: this.password,
                password_confirmation: this.passwordConfirm,
            })
                .then(() => {
                    this.loading = false
                    this.$router.push('/properties')
                })
                .catch((err) => {
                    this.loading = false
                    this.errors = err.response.data.errors
                })
        },
    },
    filters: {
        undefinedOrFalse: val => val ? undefined : val,
    },
}
</script>
