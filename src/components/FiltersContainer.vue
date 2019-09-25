<template>
    <div>
        <base-button
            nativeType="button"
            type="secondary"
            @click="modal = true"
        >
        Filtros
        <badge
            v-show="activeFilters > 0"
            type="info"
            v-tooltip.top="tooltipActiveFilters">
            {{ activeFilters }}
        </badge>
        </base-button>
        <modal
            :show.sync="modal"
            size="large"
            modal-classes="modal-dialog large modal-dialog-centered"
        >
            <template slot="header">
                <h5 class="modal-title" id="filtersModalLabel">Filtros</h5>
            </template>
            <div>
                <filters></filters>
            </div>
            <template slot="footer">
                <v-popover
                    :disabled="polygonExists"
                    trigger="hover"
                >
                    <template slot="popover">
                        <span>Primero debe seleccionar un área en el mapa.</span>
                    </template>
                    <base-button
                        :disabled="!polygonExistsAndNotLoading"
                        @click="search"
                        type="primary"
                    >Buscar</base-button>
                </v-popover>
                <base-button @click="clearFilters" type="info">Limpiar</base-button>
            </template>
        </modal>
    </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import Swal from 'sweetalert2'
import Filters from './Filters'
import Modal from './argon/Modal'
import store from '../store'

export default {
    name: 'FiltersContainer',
    store,
    components: { Filters, Modal },
    data() {
        return {
            modal: false,
        }
    },
    computed: {
        ...mapFields({
            polygonExists: 'polygonExists',
            loading: 'propertiesLoading',
        }),
        polygonExistsAndNotLoading() {
            return this.polygonExists && !this.loading
        },
        activeFilters() {
            return this.$store.getters.activeFilters
        },
        tooltipActiveFilters() {
            const plural = this.activeFilters > 1
            const s = plural ? 's' : ''
            return `${this.activeFilters} filtro${s} activo${s}`
        },
        searchTooltip() {
            return {
                content: 'Primero debe seleccionar un area en el mapa.',
                disabled: this.polygonExists,
            }
        },
    },
    methods: {
        clearFilters() {
            this.$store.dispatch('clearFilters')
        },
        search() {
            this.$store.dispatch('search')
                .then((response) => {
                    console.log(response)
                })
                .catch((err) => {
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
            this.modal = false
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
