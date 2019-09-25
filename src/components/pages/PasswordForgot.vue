<template>
    <div class="container">
        <loading color="#5e72e4" :active.sync="loading" :is-full-page="true"></loading>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <card>
                    <div class="card-title">Restablecer la contraseña</div>

                    <div class="card-text">
                        <p>Le enviaremos un enlace a su correo electrónico para restablecer
                         su contraseña, por favor ingrese su correo a continuación: </p>

                        <form @submit.prevent="submit" aria-label="Restablecer la contraseña">
                            <base-input
                                label="Correo electrónico"
                                :error="emailErrorMessage"
                                id="email"
                                name="email"
                                v-model="email"
                                class="my-3"
                                required
                                :valid="!emailError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <div class="form-group row mb-0">
                                <div class="col text-center">
                                    <base-button
                                        :disabled="loading"
                                        type="primary"
                                        nativeType="input"
                                    >
                                        Enviar enlace
                                    </base-button>
                                </div>
                                <div class="col text-center">
                                    <router-link class="btn btn-link" to="/login">
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
    name: 'page-email',
    components: {
        Loading,
    },
    data() {
        return {
            email: '',
            emailErrorMessage: '',
            loading: false,
        }
    },
    computed: {
        emailError() {
            return !!this.emailErrorMessage
        },
    },
    methods: {
        submit() {
            this.loading = true
            this.$http.post('/api/password/email', {
                email: this.email,
            })
                .then(() => {
                    Swal.fire({
                        title: 'Enviado',
                        text: 'Enlace enviado al correo electrónico correctamente.',
                        type: 'success',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.emailErrorMessage = ''
                            this.loading = false
                        })
                })
                .catch(({ response: { data: { errors: { email: [email] } } } }) => {
                    this.emailErrorMessage = email
                    this.loading = false
                })
        },
    },
    filters: {
        undefinedOrFalse: val => val ? undefined : val,
    },
}
</script>
