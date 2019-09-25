<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <card>
                    <div class="card-title">Verifique su dirección de correo electrónico</div>

                    <div class="card-text">
                        Antes de continuar, consulte su correo electrónico
                        para ver un enlace de verificación.
                        Si no ha recibido el correo electrónico,
                        <a
                            @click.prevent="resendVerification"
                            href="javascript:void(0);"
                        >
                            haga clic aquí para solicitar otro.
                        </a>
                    </div>
                </card>
            </div>
        </div>
    </div>
</template>

<script>

import Swal from 'sweetalert2'

export default {
    name: 'must-verify',
    data() {
        return {
            sessionResent: false,
        }
    },
    methods: {
        resendVerification() {
            this.$http.get('/api/email/resend')
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Enviado',
                            text: `
                                Se ha enviado un nuevo enlace de verificación a su dirección 
                                de correo electrónico.`,
                            type: 'success',
                            confirmButtonColor: '#5e72e4',
                            confirmButtonText: 'Aceptar',
                        })
                    } else if (response.status === 202) {
                        this.$store.dispatch('updateUser')
                            .then(() => {
                                Swal.fire({
                                    title: 'Ya verificado',
                                    text: 'El email ya habia sido verificado.',
                                    type: 'warning',
                                    confirmButtonColor: '#5e72e4',
                                    confirmButtonText: 'Aceptar',
                                })
                                    .then(() => {
                                        this.$router.push('/properties')
                                    })
                            })
                            .catch(err => console.log(err))
                    }
                })
                .catch(() => {
                    Swal.fire({
                        title: 'No autenticado',
                        text: 'Debe iniciar sesión para reenviar el enlace de verificación'
                        + ' a su dirección de correo electrónico.',
                        type: 'warning',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.$router.push('/login')
                        })
                })
        },
    },
}
</script>
