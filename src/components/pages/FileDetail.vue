<template>
    <div class="container-fluid">
        <div class="table-responsive scrollAndMaxHeight">
            <loading color="#5e72e4" :active.sync="propertiesLoading" :is-full-page="false" />
            <table class="table table-sm table-hover">
                <thead class="thead-light">
                    <th
                        :key="index"
                        scope="col"
                        class="font-12"
                        v-for="(header, index) in headers"
                    >{{ header }}</th>
                </thead>
                <tbody v-if="properties.length > 0">
                    <tr
                        :key="index"
                        v-for="(listProperty, index) in properties"
                        @click="showPropertyDetails(listProperty._id)"
                        style="cursor: pointer;"
                    >
                        <td class="font-12">
                            {{ listProperty.property_type }}
                            <span
                                v-if="listProperty.property_new"
                                class="badge badge-success"
                            >
                                Nuevo
                            </span>
                        </td>
                        <td class="font-12">{{ listProperty.region }}</td>
                        <td class="font-12">{{ listProperty.dollars_price | toCurrency}}</td>
                        <td class="font-12">{{ listProperty.antiquity_years | antiquity }}</td>
                        <td class="font-12">{{ listProperty.bedrooms | ifNullReturnNA }}</td>
                        <td class="font-12">{{ listProperty.bathrooms | ifNullReturnNA }}</td>
                        <td class="font-12">{{ listProperty.parkings | ifNullReturnNA }}</td>
                        <td class="font-12">{{ listProperty.pool | humanizeBoolean }}</td>
                        <td class="font-12">{{ listProperty.elevator | humanizeBoolean }}</td>
                        <td class="font-12">{{ listProperty.total_area_m2 | ifNullReturnNA }}</td>
                        <td class="font-12">{{ listProperty.build_area_m2 | ifNullReturnNA }}</td>

                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="11" class="text-center">
                            No hay registros
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

            <modal
                modalClasses="modal-dialog-scrollable modal-property-detail"
                :show.sync="showProperty"
                :showClose="true"
            >
                <slot name="closeButton">
                    <button type="button"
                        class="close"
                        @click="showProperty = false"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span :aria-hidden="!showProperty">×</span>
                    </button>
                </slot>
                <div class="d-flex flex-wrap justify-content-around">
                    <div class="flex-100">
                        {{ property.property_type }}
                        <span
                            v-if="property.property_new"
                            class="badge badge-success"
                        >
                            Nuevo
                        </span>
                    </div>
                    <div class="modalSection mt-3">
                        <carousel
                            :navigationPrevLabel="`<div class='navigation-icon-container'>
                                <i class='ni ni-bold-left lineHeightNone'></i>
                            </div>`"
                            :navigationNextLabel="`<div class='navigation-icon-container'>
                                <i class='ni ni-bold-right lineHeightNone'></i>
                            </div>`"
                            :scrollPerPage="false"
                            v-model="activeImage"
                            :paginationEnabled="false"
                            :perPage="1"
                            :mouseDrag="true"
                            :navigationEnabled="true"
                            class="carousel modalSection"
                        >
                            <slide
                                class="detailedSlide"
                                :key="img_index"
                                v-for="(img, img_index) in property.image_list"
                            >
                                <vue-load-image>
                                    <img slot="image" :src="img.path"/>
                                    <img
                                        slot="preloader"
                                        :src="`/img/loader.gif`"
                                    />
                                    <img
                                        slot="error"
                                        :src="`/img/no-img-bg.png`"
                                    />
                                </vue-load-image>

                            </slide>
                        </carousel>
                    </div>

                    <div class="modalSection mt-3 d-flex align-items-center">
                        <div class="table-responsive">
                            <table class="table table-sm mb-0">
                                <tr>
                                    <th scope="row" class="font-weight-bold">Precio:</th>
                                    <td>US$ {{ property.dollars_price | toCurrency }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Dirección:</th>
                                    <td>{{ property.address | ifNullReturnNA }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Antigüedad:</th>
                                    <td>{{ property.antiquity_years | antiquity }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">
                                        Área de construcción:
                                    </th>
                                    <td>{{ property.build_area_m2 | area }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Área total:</th>
                                    <td>{{ property.total_area_m2 | area }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Habitaciones:</th>
                                    <td>{{ property.bedrooms | ifNullReturnNA }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Baños:</th>
                                    <td>{{ property.bathrooms | ifNullReturnNA }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Cocheras:</th>
                                    <td>{{ property.parkings | ifNullReturnNA }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Piscina:</th>
                                    <td>{{ property.pool | humanizeBoolean }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="font-weight-bold">Elevador:</th>
                                    <td>{{ property.elevator | humanizeBoolean }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div class="modalSection full mt-md-4 mt-3">
                        <span class="d-block mb-2">
                            {{ property.comment_subtitle }}
                        </span>
                        <span>
                            {{ property.comment_description }}
                        </span>
                    </div>
                </div>
            </modal>
    </div>
</template>

<style type="text/css">
    .font-12 {
        font-size: 12px;
    }

    .scrollAndMaxHeight {
        max-height: calc(100vh - 75px - 1.5em);
        overflow-y: auto;
    }

    .flex-100 {
        flex-basis: 100%;
    }

    .lineHeightNone {
        line-height: unset;
    }

    .VueCarousel-inner {
        flex-basis: 100%!important;
    }

    .icon-argon-color {
        color: white;
    }

    .VueCarousel-slide img {
        width: 100%;
        min-height: 252px;
    }

    .modal-property-detail {
        max-width: auto;
    }

    button.VueCarousel-navigation-button {
        display: inline-block;
        background-color: #172b4d!important;
        border-radius: 50%;
    }

    .navigation-icon-container {
        color: white;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        text-decoration: none;
        height: 24px;
        width: 24px;
    }

    button.VueCarousel-navigation-button.VueCarousel-navigation-next {
        right: 40px;
    }

    button.VueCarousel-navigation-button.VueCarousel-navigation-prev {
        left: 40px;
    }

    .VueCarousel-navigation {
        opacity: 0;
    }

    .VueCarousel:hover .VueCarousel-navigation {
        opacity: inherit;
        transition: all ease .5s;
    }

    .detailedStyle .vue-load-image {
        max-height: auto!important;
    }

    button.VueCarousel-navigation-button:not(.VueCarousel-navigation--disabled):hover {
        opacity: 1;
    }

    .VueCarousel-navigation--disabled {
        cursor: no-drop!important;
    }

    .modalSection {
        flex-basis: 100%;
    }

    .modalSection .table td,
    .modalSection .table th,
    .modalSection > span {
        font-size: 12px;
    }

    @media screen and (min-width: 992px) {
        .modalSection {
            flex-basis: 45%;
        }

        .modalSection.full {
            flex-basis: 100%;
        }

        .modal-property-detail {
            max-width: 95vw;
        }

        .modalSection .table td,
        .modalSection .table th,
        .modalSection > span {
            font-size: 16px;
        }
    }
</style>

<script type="text/javascript">

import Swal from 'sweetalert2'
import moment from 'moment'
import VueLoadImage from 'vue-load-image'
import { Carousel, Slide } from 'vue-carousel'
import Loading from 'vue-loading-overlay'
import Modal from '../argon/Modal'
import store from '../../store'

export default {
    name: 'page-file-detail',
    store,
    components: {
        Carousel,
        Modal,
        VueLoadImage,
        Slide,
        Loading,
    },
    data() {
        return {
            activeImage: 0,
            headers: [
                'Tipo',
                'Región',
                'Precio USD',
                'Antigüedad',
                'Habitaciones',
                'Baños',
                'Cocheras',
                'Piscina',
                'Elevador',
                'Area total (M2)',
                'Area de construcción (M2)',
            ],
            property: {
                address: '',
                antiquity_years: 0,
                bathrooms: 0,
                bedrooms: 0,
                build_area_m2: 0,
                comment_description: '',
                comment_subtitle: '',
                distance: 0,
                dollars_price: 0,
                elevator: false,
                image_list: [],
                latitude: '',
                link: '',
                location: '',
                longitude: '',
                others_price: 0,
                parkings: 0,
                pool: false,
                property_new: false,
                property_type: '',
                publication_date: moment(),
                publication_type: '',
                reference_place: '',
                region: '',
                total_area_m2: 0,
                urbanization: null,
                _id: 0,
            },
            showProperty: false,
            properties: [],
            propertiesLoading: false,
        }
    },
    mounted() {
        this.propertiesLoading = true

        this.$http.get(`/api/purchases/purchase_files/${this.$route.params.id}/records`)
            .then((response) => {
                this.properties = response.data.data
                this.propertiesLoading = false
            })
            .catch((err) => {
                this.propertiesLoading = false
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
                } else {
                    Swal.fire({
                        title: 'Ha ocurrido un error',
                        type: 'error',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })
                        .then(() => {
                            this.$router.push('/dashboard/downloads/')
                        })
                }
            })
    },
    filters: {
        antiquity: (val) => {
            if (!(val === null || Array.isArray(val))) {
                return val > 1 ? `${val} Años` : `${val} Año`
            }
            return 'N/A'
        },
        area: val => (val === null ? 'N/A' : `${val} m2`),
        ifNullReturnNA: val => (val === null ? 'N/A' : val),
        humanizeBoolean: val => ((val === null || val === false) ? 'No' : 'Si'),
        parseDate: value => moment(value).format('DD/MM/YYYY'),
        toCurrency: (value) => {
            if (typeof value !== 'number') {
                return value
            }
            const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
            })

            return formatter.format(value)
        },
    },
    methods: {
        showPropertyDetails(id) {
            this.property = this.properties.find(v => v._id === id)
            this.showProperty = true
        },
        closeModal() {
            this.activeImage = 0
            this.property = {
                address: '',
                antiquity_years: 0,
                bathrooms: 0,
                bedrooms: 0,
                build_area_m2: 0,
                comment_description: '',
                comment_subtitle: '',
                distance: 0,
                dollars_price: 0,
                elevator: false,
                image_list: [],
                latitude: '',
                link: '',
                location: '',
                longitude: '',
                others_price: 0,
                parkings: 0,
                pool: false,
                property_new: false,
                property_type: '',
                publication_date: moment(),
                publication_type: '',
                reference_place: '',
                region: '',
                total_area_m2: 0,
                urbanization: null,
                _id: 0,
            }
        },
    },
    watch: {
        showProperty(val) {
            return val || this.closeModal()
        },
    },
}
</script>
