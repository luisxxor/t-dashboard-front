<template>
    <div>
        <base-button
            nativeType="button"
            type="success"
            @click="modal = true"
            v-show="selectedProperties.length > 0"
        >Pagar</base-button>
        <modal
            :show.sync="modal"
            size="large"
            modal-classes="modal-dialog large modal-dialog-centered"
            :persistent="paymentLoad"
        >
            <loading color="#5e72e4" :active.sync="paymentLoad" :is-full-page="false"></loading>
            <template slot="header">
                <h5 class="modal-title">Propiedades seleccionadas</h5>
            </template>
            <div>
                <div>
                    <table class="table table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">id</th>
                                <th scope="col">Tipo de propiedad</th>
                                <th scope="col">Dirección</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="index" v-for="(property, index) in paginatedProperties">
                                <td>{{ from + index + 1 }}</td>
                                <td>{{ property.property_type }}</td>
                                <td>{{ property.address }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <span class="mx-auto mt-4 text-center d-block">
                        {{ from + 1 }} ~ {{ to }} de {{ totalSelectedProperties }} propiedades
                    </span>

                    <pagination
                        ref="pagination"
                        v-show="!paymentLoad && paginatedProperties.length > 0"
                        :total="totalSelectedProperties"
                        :page-size="10"
                        :callback="pageChanged"
                        nav-class="padding-10 mt-2 mx-auto flex-100"
                        ul-class="bg-color-red"
                        li-class="txt-color-blue">
                    </pagination>
                </div>

                <base-button
                    @click="mercadopago"
                    type="button"
                    class="mercadoPagoButton btn btn-success"
                    :disabled="selectedPropertiesEmpty"
                >
                    <font-awesome-icon icon="file-excel"></font-awesome-icon>
                    MercadoPago
                </base-button>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="modal = false">Atrás</base-button>
            </template>
        </modal>

    </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import pagination from 'vue-pagination-bootstrap'
import { mapFields } from 'vuex-map-fields'
import Swal from 'sweetalert2'
import store from '../store'
import Modal from './argon/Modal'

export default {
    name: 'Payment',
    store,
    components: {
        Modal,
        pagination,
        Loading,
    },
    data() {
        return {
            modal: false,
            paymentLoad: false,
            perPage: 10,
        }
    },
    computed: {
        ...mapFields({
            properties: 'properties',
            currentPage: 'resumeProperties.current_page',
            selectAll: 'selectAll',
            searchId: 'searchResults.searchId',
            urlProcessPurchase: 'routes.propertiesPurchase',
            urlPropertiesExport: 'routes.propertiesExport',
        }),
        from() {
            return (this.currentPage - 1) * this.perPage
        },
        to() {
            const calculatedTo = this.currentPage * this.perPage
            return calculatedTo > this.totalSelectedProperties
                ? this.totalSelectedProperties
                : calculatedTo
        },
        selectedPropertiesEmpty() {
            return this.selectedProperties.length === 0
        },
        totalSelectedProperties() {
            return this.selectedProperties.length
        },
        paginatedProperties() {
            return this.selectedProperties.slice(this.from, this.to)
        },
        selectedProperties() {
            return this.properties.filter(v => v.selected)
        },
    },
    watch: {
        selectedPropertiesEmpty(val) {
            if (val) {
                this.modal = false
            }
        },
    },
    methods: {
        pageChanged(page) {
            this.currentPage = page
        },
        mercadopago() {
            this.paymentLoad = true

            this.$http.post(this.urlProcessPurchase, {
                searchId: this.searchId,
                selectAll: this.selectAll,
                ids: this.selectedProperties.map(v => v._id),
            })
                .then((response) => {
                    this.paymentLoad = false
                    if (response.status === 200) {
                        window.location.href = response.data.data
                    } else if (response.status === 202) {
                        Swal.fire({
                            title: 'Excelente!',
                            text: 'Archivo generado correctamente, puede localizarlo en la sección Descargas',
                            type: 'success',
                        }).then(() => {
                            console.log('redirect to downloads')
                        })
                    }
                })
                .catch((err) => {
                    this.paymentLoad = false

                    if (err.response.status === 401) {
                        Swal.fire({
                            title: 'No autenticado',
                            text: 'Debe estar logeado para realizar esta acción.',
                            type: 'error',
                            confirmButtonColor: '#5e72e4',
                            confirmButtonText: 'Aceptar',
                        })
                            .then(() => {
                                this.$router.push('/login')
                            })
                    } else if (err.response.status === 422) {
                        Swal.fire({
                            title: 'Ha ocurrido un error',
                            text: 'Intente nuevamente.',
                            type: 'error',
                            confirmButtonColor: '#5e72e4',
                            confirmButtonText: 'Aceptar',
                        })
                    }
                })
        },
    },
}
</script>

<style>
.modal-dialog.large {
    max-width: none;
    width: 95vw;
}
</style>
