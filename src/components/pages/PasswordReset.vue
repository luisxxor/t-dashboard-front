
<template>
    <div class="container">
        <loading color="#5e72e4" :active.sync="loading" :is-full-page="true" />
        <div class="row justify-content-center">
            <div class="col-md-8">
                <card>
                    <div class="card-title">Restablecer la contraseña</div>

                    <div class="card-text">
                        <form @submit.prevent="submit" aria-label="Restablecer la contraseña">
                            <base-input
                                label="Correo electrónico"
                                :error="emailErrorText"
                                id="email"
                                name="email"
                                v-model="email"
                                required
                                :valid="!emailError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                             <base-input
                                label="Nueva contraseña"
                                :error="passwordErrorText"
                                id="password"
                                name="password"
                                v-model="password"
                                required
                                type="password"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Confirmar contraseña"
                                id="password-confirm"
                                name="password_confirmation"
                                v-model="passwordConfirm"
                                required
                                type="password"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <div class="form-group row mb-0">
                                <div class="col text-center">
                                    <base-button type="primary" nativeType="input">
                                        Restablecer la contraseña
                                    </base-button>
                                </div>
                                <div class="col text-center">
                                    <router-link class="btn btn-link" to='/login'>
                                        Volver
                                    </router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>

import Loading from 'vue-loading-overlay'
import Swal from 'sweetalert2'

export default {
    name: 'page-reset',
    components: {
        Loading,
    },
    data() {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            errors: {},
            token: '',
        }
    },
    mounted() {
        const url = new URL(window.location.href)
        this.token = url.searchParams.get('token')
    },
    computed: {
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
        tokenError() {
            return Array.isArray(this.errors.token) && this.errors.token[0]
        },
        tokenErrorText() {
            return this.tokenError() ? this.errors.token[0] : ''
        },
    },
    watch: {
        tokenError(val) {
            if (val) {
                Swal.fire({
                    title: 'Error',
                    text: 'El link es inválido o el usuario a verificar no es el mismo.',
                    type: 'error',
                    confirmButtonColor: '#5e72e4',
                    confirmButtonText: 'Aceptar',
                })
                    .then(() => this.$router.push('/password/forgot'))
            }
        },
    },
    methods: {
        submit() {
            this.errors = {}
            this.loading = true
            this.$http.post('/api/password/reset', {
                token: this.token,
                email: this.email,
                password: this.password,
                password_confirmation: this.passwordConfirm,
            })
                .then(() => {
                    this.loading = false
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Has cambiado la contraseña correctamente.',
                        type: 'success',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => this.$router.push('/login'))
                })
                .catch((err) => {
                    this.loading = false
                    if (err.response.status === 422) {
                        this.errors = err.response.data.errors
                    }
                })
        },
    },
    filters: {
        undefinedOrFalse: val => val ? undefined : val,
    },
}
</script>
