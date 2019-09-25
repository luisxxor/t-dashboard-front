<template>
    <div class="container-fluid" style="overflow-y: auto;">
        <div class="row">
            <div class="offset-md-2 col-md-8">
                <loading color="#5e72e4" :active.sync="loading" :is-full-page="false"></loading>
                <form
                    @submit.prevent="submit"
                    id="dashboard_profiles_edit"
                >
                    <slot name="patch"></slot>

                    <card>
                        <div class="card-title">
                            <h3>Editar información de perfil</h3>
                        </div>
                        <div class="card-text">
                            <base-input
                                label="Nombres"
                                :error="nameErrorText"
                                id="name"
                                name="name"
                                v-model="name"
                                :valid="!nameError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <base-input
                                label="Apellidos"
                                :error="lastnameErrorText"
                                id="lastname"
                                name="lastname"
                                v-model="lastname"
                                :valid="!lastnameError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <base-input
                                label="Correo electrónico"
                                disabled
                                :error="emailErrorText"
                                id="email"
                                name="email"
                                v-model="email"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>

                            <base-input
                                label="Teléfono"
                                :error="phone_number1ErrorText"
                                id="phone_number1"
                                name="phone_number1"
                                v-model="phone_number1"
                                :valid="!phone_number1Error | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Dirección"
                                :error="address_line1ErrorText"
                                id="address_line1"
                                name="address_line1"
                                v-model="address_line1"
                                :valid="!address_line1Error | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                :error="address_line2ErrorText"
                                id="address_line2"
                                name="address_line2"
                                v-model="address_line2"
                                :valid="!address_line2Error | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>

                            <base-input
                                label="Contraseña"
                                :error="passwordErrorText"
                                id="password"
                                name="password"
                                v-model="password"
                                type="password"
                                :valid="!passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                            ></base-input>
                        </div>

                    </card>

                    <card>

                        <div class="card-text">
                            <p>Ingrese su contraseña actual para confirmar los cambios</p>

                            <base-input
                                :error="old_passwordErrorText"
                                id="old_password"
                                name="old_password"
                                v-model="old_password"
                                type="password"
                                :valid="!old_passwordError | undefinedOrFalse"
                                inputClasses="form-control-sm"
                                required
                            ></base-input>
                        </div>
                        <footer>
                            <div class="d-flex">
                                <base-button nativeType="submit" type="primary">
                                    Guardar cambios
                                </base-button>
                                <router-link to="/properties" class="btn btn-secondary">
                                    Cancelar
                                </router-link>
                            </div>
                        </footer>

                    </card>
                </form>

            </div>
        </div>
    </div>
</template>

<script>

import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay'

export default {
    name: 'profile-edit',
    components: {
        Loading,
    },
    mounted() {
        const user = JSON.parse(localStorage.getItem('user'))

        this.address_line1 = user.address_line1
        this.address_line2 = user.address_line2
        this.email = user.email
        this.name = user.name
        this.lastname = user.lastname
        this.phone_number1 = user.phone_number1
    },
    data() {
        return {
            address_line1: '',
            address_line2: '',
            email: '',
            name: '',
            lastname: '',
            phone_number1: '',
            password: '',
            old_password: '',
            errors: {},
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
        phone_number1Error() {
            return Array.isArray(this.errors.phone_number1) && this.errors.phone_number1[0]
        },
        phone_number1ErrorText() {
            return this.phone_number1Error ? this.errors.phone_number1[0] : ''
        },
        address_line1Error() {
            return Array.isArray(this.errors.address_line1) && this.errors.address_line1[0]
        },
        address_line1ErrorText() {
            return this.address_line1Error ? this.errors.address_line1[0] : ''
        },
        address_line2Error() {
            return Array.isArray(this.errors.address_line2) && this.errors.address_line2[0]
        },
        address_line2ErrorText() {
            return this.address_line2Error ? this.errors.address_line2[0] : ''
        },
        passwordError() {
            return Array.isArray(this.errors.password) && this.errors.password[0]
        },
        passwordErrorText() {
            return this.passwordError ? this.errors.password[0] : ''
        },
        old_passwordError() {
            return Array.isArray(this.errors.old_password) && this.errors.old_password[0]
        },
        old_passwordErrorText() {
            return this.old_passwordError ? this.errors.old_password[0] : ''
        },
    },
    methods: {
        submit() {
            this.loading = true
            this.$store.dispatch('profileUpdate', {
                name: this.name,
                lastname: this.lastname,
                email: this.email,
                phone_number1: this.phone_number1 ? `${this.phone_number1}` : '',
                address_line1: this.address_line1,
                address_line2: this.address_line2,
                password: this.password ? `${this.password}` : '',
                old_password: this.old_password,
            })
                .then(() => {
                    this.loading = false
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Has actualizado tu perfil correctamente.',
                        type: 'success',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => this.$router.go())
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        Swal.fire({
                            title: 'No autenticado',
                            text: 'Debe iniciar sesión para poder realizar esta acción.',
                            type: 'warning',
                            confirmButtonColor: '#5e72e4',
                            confirmButtonText: 'Aceptar',
                        })
                            .then(() => {
                                this.$router.push('/login')
                            })
                    } else if (err.response.status === 422) {
                        this.loading = false
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
