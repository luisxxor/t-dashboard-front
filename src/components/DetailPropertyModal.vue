<template>
    <modal :show.sync="detailedPropertyShow" :showClose="true">
        <slot name="closeButton">
            <button type="button"
                class="close"
                @click="detailedPropertyShow = false"
                data-dismiss="modal"
                aria-label="Close"
            >
                <span :aria-hidden="!detailedPropertyShow">×</span>
            </button>
        </slot>
        <div v-if="property">
            <div class="switcherContainer">
                <switches
                    :value.sync="property.selected"
                    theme="bootstrap"
                    color="custom"
                    type-bold="true"
                    @input="onSwitchProperty"
                    :emit-on-mount="false"
                ></switches>

                <span class="switcherLabel ml-3">{{ property.selected | selectedLabel }}</span>
            </div>

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
                class="carousel"
            >
                <slide
                    class="detailedSlide"
                    :key="img_index"
                    v-for="(img, img_index) in property.image_list"
                >
                    <vue-load-image>
                        <img slot="image" :src="img.path"/>
                        <img slot="preloader" :src="`/img/loader.gif`" />
                        <img
                            slot="error"
                            :src="`/img/no-img-bg.png`"
                        />
                    </vue-load-image>

                </slide>
            </carousel>

            <p class="card-text mt-4 d-flex flex-wrap">
                <span
                    class="price-text flex-100"
                    v-if="property.dollars_price"
                >
                    US$ {{ property.dollars_price | toCurrency }}
                </span>
                <span
                    class="price-text flex-100"
                    :class="{'mt-2': property.dollars_price }"
                    v-if="property.others_price"
                >
                    S/ {{ property.others_price | toCurrency }}
                </span>
            </p>

            <p class="card-text d-flex justify-content-between my-3">
                <badge type="default">{{ property.property_type }}</badge>
                <span style="font-size: 16px">{{ property.publication_date | parseDate }}</span>
            </p>

            <div class="d-flex justify-content-between" style="margin-right: 6px">
                <div class="d-flex flex-column align-items-center">
                    <span>Hab</span>
                    <span class="t-bedrooms">{{ property.bedrooms }}</span>
                </div>
                <div class="d-flex flex-column align-items-center" style="margin-left: 12px">
                    <span>Baños</span>
                    <span class="t-bathrooms">{{ property.bathrooms }}</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <span>Cocheras</span>
                    <span class="t-parkings">{{ property.parkings }}</span>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import VueLoadImage from 'vue-load-image'
import moment from 'moment'
import { Carousel, Slide } from 'vue-carousel'
import Switches from 'vue-switches'
import Swal from 'sweetalert2'
import store from '../store'
import Modal from './argon/Modal'

export default {
    name: 'detail-property-modal',
    store,
    components: {
        Modal,
        VueLoadImage,
        Carousel,
        Slide,
        Switches,
    },
    watch: {
        detailedPropertyShow(val) {
            return val ? null : (() => {
                this.activeImage = 1
                this.detailedPropertyIndex = null
            })()
        },
    },
    data() {
        return {
            activeImage: 1,
            prevIcon: '<i class="fas fa-chevron-left icon-argon-color" />',
            nextIcon: '<i class="fas fa-chevron-right icon-argon-color" />',
        }
    },
    computed: {
        ...mapFields({
            detailedPropertyShow: 'detailedPropertyShow',
            detailedPropertyIndex: 'detailedPropertyIndex',
            selectAll: 'selectAll',
            properties: 'properties',
        }),
        property() {
            return this.detailedPropertyIndex !== null
                ? this.properties[this.detailedPropertyIndex]
                : null
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
        onSwitchProperty() {
            if (this.property.selected && this.selectAll) {
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
                        this.$store.dispatch('selectAllProperties', false)
                    }
                })
            } else {
                this.property.selected = !this.property.selected
            }
        },
    },
}
</script>

<style>
    .detailedSlide {
        flex-basis: 100%;
    }
</style>
