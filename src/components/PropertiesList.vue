<template>
    <div
        class="fill-xs-to-sm-available"
        :style="`overflow-y: ${ loadingMessage ? 'hidden' : 'scroll'}`"
        id="content-properties"
        ref="containerProperties"
    >
        <div class="vld-parent d-flex flex-wrap" >
            <loading color="#5e72e4" :active.sync="loadingMessage" :is-full-page="false" />
            <div
                v-if="properties.length > 0"
                class="d-flex justify-content-around align-items-center my-3 w-100"
            >
                <span class="flex-100 text-center">
                    {{ from + 1 }} ~ {{ to }} de {{ total }} propiedades
                </span>
            </div>
            <div class="properties-inner-container" v-if="!listView">
                <card
                    class="border mt-2 property-card content-inner-property-item"
                    :key="index"
                    v-for="(property, index) in paginatedProperties"
                    :class="{
                        'border-selected-argon': paginatedProperties[index].selected
                    }"
                >
                    <div class="switcherContainer">
                        <switches
                            :value.sync="property.selected"
                            theme="bootstrap"
                            color="custom"
                            type-bold="true"
                            @input="onSwitchProperty(property)"
                            :emit-on-mount="false"
                        ></switches>

                        <span class="switcherLabel ml-3">
                            {{ property.selected | selectedLabel }}
                        </span>
                    </div>

                    <carousel
                        :navigationPrevLabel="`<div class='navigation-icon-container'>
                            <i class='ni ni-bold-left lineHeightNone'></i>
                        </div>`"
                        :navigationNextLabel="`<div class='navigation-icon-container'>
                            <i class='ni ni-bold-right lineHeightNone'></i>
                        </div>`"
                        :scrollPerPage="false"
                        v-model="activeImageIndex[index]"
                        :paginationEnabled="false"
                        :perPage="1"
                        :mouseDrag="true"
                        :navigationEnabled="true"
                        class="carousel"
                    >
                        <slide
                            :key="`property_${index}_img_${img_index}`"
                            v-for="(img, img_index) in property.image_list"
                        >
                            <vue-load-image v-if="img_index === activeImageIndex[index]">
                                <img slot="image" :src="img.path"/>
                                <img
                                    slot="preloader"
                                    :src="`/img/loader.gif`"
                                    style="height: 173px; width: auto;"
                                />
                                <img
                                    slot="error"
                                    :src="`/img/no-img-bg.png`"
                                />
                            </vue-load-image>

                        </slide>
                    </carousel>

                    <div class="mx-3">
                        <p class="card-text mt-3 d-flex flex-wrap justify-content-between">
                            <span
                                class="price-text"
                                v-if="property.dollars_price"
                            >
                                US$ {{ property.dollars_price | toCurrency }}
                            </span>
                            <span
                                class="price-text"
                                v-if="property.others_price"
                            >
                                S/ {{ property.others_price | toCurrency }}
                            </span>
                        </p>

                        <p class="card-text d-flex justify-content-between my-3">
                            <badge type="default">{{ property.property_type }}</badge>
                            <span class="propertyDate">
                                {{ property.publication_date | parseDate }}
                            </span>
                        </p>

                        <div class="d-flex justify-content-between numberContainer">
                            <div
                                class="d-flex flex-row align-items-center"
                                v-tooltip.top="'Habitaciones'"
                            >
                                <span><font-awesome-icon icon="bed" /></span>
                                <span class="t-bedrooms">{{ property.bedrooms }}</span>
                            </div>
                            <div
                                class="d-flex flex-row align-items-center"
                                v-tooltip.top="'Baños'"
                            >
                                <span><font-awesome-icon icon="bath" /></span>
                                <span class="t-bathrooms">{{ property.bathrooms }}</span>
                            </div>
                            <div
                                class="d-flex flex-row align-items-center"
                                v-tooltip.top="'Cocheras'"
                            >
                                <span><font-awesome-icon icon="parking" /></span>
                                <span class="t-parkings">{{ property.parkings }}</span>
                            </div>
                        </div>
                    </div>
                </card>
            </div>
            <div class="properties-inner-list w-100" v-if="listView">
                <table
                    class="table properties-table table-hover table-sm"
                    v-if="paginatedProperties.length > 0"
                >
                    <thead class="thead-light">
                        <tr>
                            <th scope="col" class="text-center">Seleccionar</th>
                            <th scope="col" class="text-center">Tipo</th>
                            <th scope="col" class="text-center">Fecha</th>
                            <th scope="col" class="text-center">Precio USD</th>
                            <th scope="col" class="text-center">Precio S/</th>
                            <th scope="col" class="text-center">Habitaciones</th>
                            <th scope="col" class="text-center">Baños</th>
                            <th scope="col" class="text-center">Cocheras</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            :key="index"
                            v-for="(property, index) in paginatedProperties"
                            @click="openProperty(property._id)"
                            style="cursor: pointer;"
                        >
                            <td
                                class="switch-list justify-content-center"
                                style="cursor: pointer;"
                                @click.stop="() => {}"
                            >
                                <switches
                                    :value.sync="property.selected"
                                    theme="bootstrap"
                                    color="custom"
                                    type-bold="true"
                                    :emit-on-mount="false"
                                    @input="onSwitchProperty(property)"
                                ></switches>
                            </td>
                            <td class="text-center">{{ property.property_type }}</td>
                            <td class="text-center">
                                {{ property.publication_date | parseDate }}
                            </td>
                            <td class="text-center">{{ property.dollars_price | toCurrency }}</td>
                            <td class="text-center">{{ property.others_price | toCurrency }}</td>
                            <td class="text-center">{{ property.bedrooms }}</td>
                            <td class="text-center">{{ property.bathrooms }}</td>
                            <td class="text-center">{{ property.parkings }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h4
                class="text-center w-100"
                v-if="showInitialMessage"
            >
                Realice una búsqueda para listar los resultados
            </h4>
            <h4
                class="text-center w-100"
                v-if="errorLoading && !loadingMessage"
            >
                Lo sentimos! ha ocurrido un error, intente nuevamente
            </h4>
            <h4 v-show="noResults" class="text-center noResultsMessage">
                No se encontraron propiedades
            </h4>
            <pagination
                ref="pagination"
                v-show="!loadingMessage && properties.length > 0"
                :total="total"
                :page-size="perPage"
                :callback="pageChanged"
                nav-class="padding-10 mt-3 mx-auto flex-100"
                ul-class="bg-color-red"
                li-class="txt-color-blue">
            </pagination>
        </div>
    </div>
</template>

<script>

import VueLoadImage from 'vue-load-image'
import { mapFields } from 'vuex-map-fields'
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import { Carousel, Slide } from 'vue-carousel'
import 'vue-loading-overlay/dist/vue-loading.css'
import pagination from 'vue-pagination-bootstrap'
import Switches from 'vue-switches'
import Swal from 'sweetalert2'
import store from '../store'

export default {
    name: 'properties-list',
    store,
    components: {
        Carousel,
        Slide,
        Loading,
        pagination,
        Switches,
        VueLoadImage,
    },
    data() {
        return {
            activeImageIndex: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            perPage: 10,
        }
    },
    computed: {
        ...mapFields({
            currentPage: 'currentPage',
            properties: 'properties',
            total: 'searchResults.total',
            loadingMessage: 'propertiesLoading',
            noResults: 'noResults',
            polygonExists: 'polygonExists',
            vertices: 'vertices',
            errorLoading: 'error',
            selectAll: 'selectAll',
            selectAllTotal: 'resumeProperties.total',
            listView: 'listView',
            detailedPropertyShow: 'detailedPropertyShow',
            detailedPropertyIndex: 'detailedPropertyIndex',
        }),
        from() {
            return (this.currentPage - 1) * this.perPage
        },
        to() {
            const calculatedTo = this.currentPage * this.perPage
            return calculatedTo > this.total ? this.total : calculatedTo
        },
        selectedProperties() {
            return this.properties.filter(v => v.selected)
        },
        totalSelected() {
            return this.selectAll ? this.properties.length : this.selectedProperties.length
        },
        showInitialMessage() {
            return !this.noResults && !this.polygonExists && !this.errorLoading
        },
        selectedPropertiesMessage() {
            if (this.totalSelected === 1) {
                return '1 propiedad seleccionada'
            } if (this.totalSelected > 1) {
                return `${this.totalSelected} propiedades seleccionadas`
            }
            return 'Ninguna propiedad seleccionada'
        },
        paginatedProperties() {
            return this.properties.slice(this.from, this.to)
        },
    },
    watch: {
        loadingMessage(val) {
            if (val) {
                this.doWhenLoad()
            } else {
                this.doWhenFinishLoad()
            }
        },
    },
    filters: {
        toCurrency(value) {
            if (typeof value !== 'number') {
                return value
            }

            const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
            })

            return formatter.format(value)
        },
        parseDate(value) {
            return moment(value).format('DD/MM/YYYY')
        },
        selectedLabel(val) {
            return val ? 'Deseleccionar propiedad' : 'Seleccionar propiedad'
        },
    },
    methods: {
        openProperty(_id) {
            const index = this.properties.findIndex(v => v._id === _id)
            this.detailedPropertyIndex = index
            this.detailedPropertyShow = true
        },
        onSwitchProperty(property) {
            if (property.selected && this.selectAll) {
                Swal.fire({
                    title: '¿Seguro?',
                    text: 'Al aceptar, deseleccionarás todas las propiedades.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#5e72e4',
                    cancelButtonColor: '#f5365c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if (result.value) {
                        this.selectAll = false
                        this.properties.forEach((v) => {
                            v.selected = false
                        })
                    }
                })
            } else {
                property.selected = !property.selected
            }
        },
        pageChanged(page) {
            this.activeImageIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.currentPage = page
        },
        doWhenLoad() {
            this.$refs.containerProperties.scrollTop = 0
        },
        doWhenFinishLoad() {
            this.$refs.pagination.currentPage = this.currentPage
        },
    },
}
</script>

<style>

    @import url('https://fonts.googleapis.com/css?family=Comfortaa&display=swap');

    .lineHeightNone {
        line-height: unset;
    }

    .VueCarousel-inner {
        flex-basis: 248px!important;
    }

    .switch-list .vue-switcher--bold div:after {
        margin-left: -24px;
        top: 1px;
        left: 45px;
    }

    .switch-list .vue-switcher div:after {
        height: 13px;
        width: 13px;
    }

    .switch-list .vue-switcher--bold div {
        top: 0px;
        height: 15px;
        width: 35px;
    }

    .switch-list .vue-switcher {
        margin-bottom: 0;
        display: flex;
        justify-content: center;
    }

    .switch-list .vue-switcher--bold div:after {
        margin-left: -24px;
        top: 1px;
        left: 45px;
    }

    .switch-list .vue-switcher--bold--unchecked div:after {
        left: 26px;
    }

    .properties-table th {
        font-size: 11px;
    }

    .properties-table td {
        font-size: 11px;
    }

    .icon-argon-color {
        color: white;
    }

    .VueCarousel-slide img {
        width: 100%;
    }

    label.vue-switcher {
        margin-bottom: -1.1em!important
    }

    .switcherContainer {
        margin-bottom: 1em;
        display: flex;
        justify-content: center;
        width: 100%;
        align-items: center;
    }

    .switcherLabel {
        font-size: 12px;
    }

    .flex-100 {
        flex: 1 0 100%;
    }

    .price-text {
        font-size: 12px;
        font-family: 'Comfortaa', cursive;
    }

    .propertyDate {
        font-size: 12px;
        font-family: 'Comfortaa', cursive;
    }

    .vld-parent {
        height: 100%;
    }

    .spacediv {
        flex: auto;
    }

    .t-bedrooms, .t-bathrooms, .t-parkings {
        font-size: 18px;
        margin-left: .4rem;
    }

    .t-bedrooms {
        color: #00c5dc !important
    }

    .t-bathrooms {
        color: #716aca !important;
    }

    .noResultsMessage {
        width: -webkit-fill-available;
        width: -moz-available;
        width: stretch;
    }

    .property-card {
        max-width: 252px;
    }

    .property-card > .card-body {
        padding: 1.5rem 0 .5rem 0;
        width: 250px;
    }

    .numberContainer span {
        font-size: .8rem;
    }

    .properties-inner-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 250px);
        grid-gap: 8px 12px;
        justify-content: space-evenly;
        margin-right: 8px;

    }

    .border-selected-argon {
        border-color: #5e72e4 !important;
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

    .vue-load-image {
        max-height: 252px;
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
</style>
