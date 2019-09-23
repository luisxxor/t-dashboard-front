<template>
    <div>
        <loading color="#5e72e4" :active.sync="loading" :is-full-page="true" />
    </div>
</template>

<script>

import Loading from 'vue-loading-overlay'
import Swal from 'sweetalert2'

export default {
    name: 'verify-email',
    components: {
        Loading,
    },
    data() {
        return {
            loading: false,
        }
    },
    mounted() {
        this.loading = true
        const url = new URL(window.location.href)
        const expires = url.searchParams.get('expires')
        const signature = url.searchParams.get('signature')
        const { id } = this.$route.params

        this.$store.dispatch('verifyEmail', {
            expires,
            signature,
            id,
        })
            .then(() => {
                this.loading = false
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El correo electrónico ha sido verificado correctamente.',
                    type: 'success',
                    confirmButtonColor: '#5e72e4',
                    confirmButtonText: 'Aceptar',
                })
                    .then(() => {
                        this.$router.push('/properties')
                    })
            })
            .catch((err) => {
                this.loading = false
                if (err.response.status === 401) {
                    Swal.fire({
                        title: 'No autenticado',
                        text: 'Debe iniciar sesion para poder verificar su correo electrónico.',
                        type: 'warning',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.$router.push('/login')
                        })
                } else if (err.response.status === 403) {
                    Swal.fire({
                        title: 'Error',
                        text: 'El link es inválido o el usuario a verificar no es el mismo.',
                        type: 'error',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.$router.push('/emailUnverified')
                        })
                }
            })
    },
}
</script>

<style>
</style>
