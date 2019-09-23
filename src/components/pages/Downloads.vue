<template>
    <div class="m-content">
        <div class="row">
            <div class="col-xl-8 offset-xl-2">
                <card>
                    <div class="card-title">
                        <h3 class="text-center">
                            Descargas
                        </h3>
                    </div>
                    <div class="card-text">
                        <loading
                            color="#5e72e4"
                            :active.sync="loading"
                            :is-full-page="false"
                        />
                        <div class="table-responsive downloadsTable">
                            <table
                                class="table table-sm table-hover"
                                id="purchaseFiles-table"
                            >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre del archivo</th>
                                        <th>Cantidad de propiedades</th>
                                        <th>Precio</th>
                                        <th>Estatus MP</th>
                                        <th class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="purchaseFiles.length > 0">
                                    <tr
                                        :key="index"
                                        v-for="(purchaseFile, index) in purchaseFiles"
                                    >
                                        <th scope="row">{{ purchaseFile.id }}</th>
                                        <td>{{ purchaseFile.file_name }}</td>
                                        <td>{{ purchaseFile.row_quantity }}</td>
                                        <td>{{ purchaseFile.amount }}</td>
                                        <td>{{ purchaseFile.mp_status }}</td>
                                        <td class="text-center">

                                            <div
                                                class='d-flex justify-content-around'
                                            >
                                                <!-- listado de las propiedades descargadas -->
                                                <router-link
                                                    :to="routeBaseShow.replace(
                                                        'id',
                                                        purchaseFile.id
                                                    )"
                                                    class="eyeButton"
                                                    v-tooltip.top="'Ver detalle'"
                                                >
                                                    <font-awesome-icon icon="eye" />
                                                </router-link>
                                                <!-- descargar archivo excel -->
                                                <a
                                                    href="#"
                                                    @click="excelExport(purchaseFile.id)"
                                                    class="downloadButton"
                                                    v-tooltip.top="'Descargar archivo'"
                                                >
                                                    <font-awesome-icon icon="download" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="6" class="text-center">
                                            No hay registros
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
    name: 'page-purchase-files',
    components: {
        Loading,
    },
    data() {
        return {
            purchaseFiles: [],
            routeBaseShow: '/dashboard/downloads/id/',
            routeBaseExport: '/api/purchases/purchase_files/{id}/export',
            loading: false,
        }
    },
    mounted() {
        this.loading = true
        this.$http.get('/api/purchases/purchase_files')
            .then((response) => {
                this.purchaseFiles = Object.values(response.data.data)
                this.loading = false
            })
            .catch((err) => {
                this.loading = false
                if (err.response.status === 401) {
                    Swal.fire({
                        title: 'No autenticado',
                        text: 'Debe iniciar sesion.',
                        type: 'error',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.$router.push('/login')
                        })
                }
            })
    },
    methods: {
        excelExport(id) {
            this.$http.post(this.routeBaseExport.replace('{id}', id), {
                format: 'xlsx',
            })
                .then((response) => {
                    window.location.href = response.data.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
}
</script>

<style type="text/css">
    .downloadsTable tr{
        font-size: 14px;
        text-align: center;
    }

    .downloadsTable th {
        font-size: 14px;
        text-align: center;
    }


    .downloadButton {
        transition: all ease .5s;
        color: #2dce89;
    }

    .downloadButton:hover {
        color: #1a7b51;
        transform: scale(1.3);
    }

    .eyeButton {
        transition: all ease .5s;
        color: #5e72e4;
    }

    .eyeButton:hover {
        color: #334294;
        transform: scale(1.3);
    }
</style>
