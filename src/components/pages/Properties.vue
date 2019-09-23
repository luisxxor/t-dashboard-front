<template>
    <div class="search-result h-100 pl-lg-3 pr-lg-3">
        <DetailPropertyModal></DetailPropertyModal>
        <div class="row">
            <div class="col d-flex flex-wrap">
                <span
                    v-show="propertiesData.length > 0"
                    class="
                        mb-2
                        mb-lg-0
                        mr-lg-4
                        mr-0
                        text-center
                        text-lg-left
                        selectedPropertiesMessage
                    "
                    style="height: fit-content; align-self: center;"
                >
                    {{ selectedPropertiesMessage}}
                </span>

                <div
                    v-show="propertiesData.length > 0"
                    class="d-flex mb-2 mb-lg-0 mr-0 mr-lg-4 selectAllContainer"
                >
                    <base-button
                        class="w-100"
                        @click="selectAllProperties"
                        type="primary"
                        nativeType="button"
                        v-show="propertiesData.length > 0"
                    >
                        {{ selectAllButtonMessage }}
                    </base-button>
                </div>
                <payment
                    class="paymentContainer"
                ></payment>

                <filtersContainer
                    class="ml-0 ml-lg-auto mt-3 mt-lg-0 filtersContainer"
                ></filtersContainer>

                <div class="d-flex mt-4 mt-lg-0 mapListControls">
                    <div class="ml-lg-2 mr-lg-3 d-flex">
                        <base-button
                            @click="listView = false"
                            type="secondary"
                            class="viewSelector m-0"
                            :disabled="!listView"
                        >
                            <font-awesome-icon icon="th"></font-awesome-icon>
                        </base-button>

                        <base-button
                            @click="listView = true"
                            type="secondary"
                            class="viewSelector m-0"
                            :disabled="listView"
                        >
                            <font-awesome-icon icon="list"></font-awesome-icon>
                        </base-button>
                    </div>

                    <base-button @click="showMap = !showMap">
                        {{ showMap ? 'Ocultar mapa' : 'Mostrar mapa' }}
                    </base-button>
                </div>
            </div>
        </div>
        <div class="mt-3 d-flex fill-lg-available">
            <properties-list
                class="propertiesListContainer"
                :class="{'active': !showMap}"
            />
            <div
                class="content-inner-map fill-xs-to-sm-available"
                :style="{
                    'transition': 'all ease .5s',
                    'flex': showMap ? '1 1' : '0 1',
                    'width': showMap ? '100%' : '0',
                }"
            >
                <transition duration="500" leave-active-class="d-flex" leave-to-class="d-none">
                    <base-input v-show="showMap">
                        <gmap-autocomplete
                            class="form-control"
                            :componentRestrictions="{'country': 'pe'}"
                            placeholder="Escriba una dirección"
                            :selectFirstOnEnter="true"
                            @place_changed="setPlace">
                        </gmap-autocomplete>
                        <font-awesome-icon icon="search" slot="addonRight" />
                    </base-input>
                </transition>
                <GmapMap
                    :center="initPoint.location"
                    :zoom.sync="zoom"
                    ref="gmap"
                    style="width: 100%; height: 100%;"
                    :options="{
                        zoomControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: false,
                        disableDefaultUi: false
                    }"
                >
                    <!-- Custom controls -->
                    <div slot="visible">
                        <div class="d-flex justify-content-center pt-1">
                            <transition
                                duration="500"
                                enter-to-class="d-block"
                                enter-active-class="d-none"
                                enter-class="d-none"
                                leave-to-class="d-none"
                            >
                                <base-button
                                    v-show="showMap"
                                    nativeType="button"
                                    type="secondary"
                                    v-if="polygonExistsAndNotLoading"
                                    @click="deleteSelection"
                                >Eliminar selección</base-button>
                            </transition>
                            <transition
                                duration="500"
                                enter-to-class="d-block"
                                enter-active-class="d-none"
                                enter-class="d-none"
                                leave-to-class="d-none"
                            >
                                <base-button
                                    v-show="showMap"
                                    nativeType="button"
                                    type="secondary"
                                    v-if="polygonExistsAndNotLoading"
                                    @click="updateMap"
                                    :disabled="errorEditing"
                                >Actualizar resultados</base-button>
                            </transition>
                        </div>
                    </div>

                    <!-- Base marker -->
                    <GmapMarker
                        v-if="initPoint.show"
                        :position="initPoint.location"
                        :icon="yellowMarkerIcon"
                        :animation="markerAnimation"
                    >
                    </GmapMarker>


                    <!-- Properties markers -->
                    <GmapMarker
                        :key="index"
                        v-for="(m, index) in markers"
                        :position="m"
                        :icon="redMarkerIcon"
                    />
                </GmapMap>
            </div>
        </div>
    </div>
</template>

<style>
    .paymentContainer, .filtersContainer, .selectedPropertiesMessage {
        flex: 1 0 100%;
    }

    .paymentContainer .btn, .filtersContainer .btn {
        display: block;
        width: 100%;
    }

    main {
        height: 100%;
    }

    #app {
        height: 100%;
    }

    .w-50 {
        width: 50vw;
    }

    #content-properties {
        max-height: 100vh;
    }

    .content-inner-map {
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;
    }

    .fill-xs-to-sm-available {
        height: 100vh;
    }

    .fill-lg-available {
        height: inherit;
    }

    .selectAllContainer {
        width: 100%;
    }

    .vue-switcher-theme--bootstrap.vue-switcher-color--custom.vue-switcher--unchecked div {
        background-color: #dcddde!important;
    }

    .vue-switcher-theme--bootstrap.vue-switcher-color--custom div {
        background-color: #5e72e4!important;
    }

    .vue-switcher-theme--bootstrap.vue-switcher-color--custom.vue-switcher--unchecked div:after {
        background-color: #7f8082!important;
    }

    .vue-switcher-theme--bootstrap.vue-switcher-color--custom div:after {
        background-color: #8998EB!important;
    }

    .mapListControls {
        justify-content: space-around;
        width: 100%;
    }

    .propertiesListContainer.active {
        transition: all ease .5s;
        flex: 1 1;
    }

    .propertiesListContainer {
        transition: all ease .5s;
        flex: 0 1;
    }

    @media screen and (min-width: 992px) {
        .mapListControls {
            justify-content: space-around;
            width: auto;
        }

        .propertiesListContainer {
            transition: all ease .5s;
            flex: 1 1;
        }

        .fill-xs-to-sm-available {
            height: calc(100vh - 75px - 1em - 72px)!important;
        }

        .content-inner-map {
            margin-bottom: 0;
        }

        main {
            height: calc(100vh - 1em - 72px);
        }

        #app {
            height: 100vh;
        }

        #content-properties {
            max-height: calc(100vh - 75px - 1em - 72px);
        }

        .fill-lg-available {
            height: fill-available;
        }

        .paymentContainer, .filtersContainer, .selectedPropertiesMessage{
            flex: none;
        }

        .paymentContainer .btn, .filtersContainer .btn {
            display: inherit;
            width: inherit;
        }

        .selectAllContainer {
            width: auto;
        }
    }

</style>

<script>

import { mapFields } from 'vuex-map-fields'
import Swal from 'sweetalert2'
import Payment from '../Payment'
import FiltersContainer from '../FiltersContainer'
import DetailPropertyModal from '../DetailPropertyModal'
import PropertiesList from '../PropertiesList'
import store from '../../store'

/* global google */

export default {
    name: 'Properties',
    store,
    data() {
        return {
            initPoint: {
                location: {
                    lat: -9.189966999999998,
                    lng: -75.015152,
                },
                address: '',
                show: false,
            },
            zoom: 5,
            showMap: true,
            polygon: null,
            drawingManager: null,
            MAX_AREA_IN_METERS: 1000000,
            errorEditing: false,
        }
    },
    watch: {
        polygon(val) {
            this.polygonExists = (val !== null)
        },
    },
    computed: {
        ...mapFields({
            loading: 'propertiesLoading',
            markers: 'markers',
            polygonExists: 'polygonExists',
            propertiesData: 'properties',
            selectAll: 'selectAll',
            listView: 'listView',
        }),
        polygonExistsAndNotLoading() {
            return this.polygonExists && !this.loading
        },
        yellowMarkerIcon() {
            return new google.maps.MarkerImage(
                'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00',
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34),
            )
        },
        redMarkerIcon() {
            return new google.maps.MarkerImage(
                'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569',
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34),
            )
        },
        markerAnimation() {
            return google.maps.Animation.BOUNCE
        },
        totalSelected() {
            if (this.selectAll) {
                return this.propertiesData.length
            }

            return this.propertiesData.filter(v => v.selected).length
        },
        selectAllButtonMessage() {
            return this.selectAll ? 'Deseleccionar todas' : 'Seleccionar todas'
        },
        selectedPropertiesMessage() {
            const plural = this.totalSelected > 1
            return this.totalSelected === 0
                ? 'Ninguna propiedad seleccionada'
                : `${this.totalSelected} propiedad${plural ? 'es' : ''} seleccionada${plural ? 's' : ''}`
        },
    },
    components: {
        FiltersContainer,
        Payment,
        DetailPropertyModal,
        PropertiesList,
    },
    created() {
        this.$store.dispatch('updatePropertyTypes')
        this.$store.dispatch('setPropertiesRoutes', {
            baseURL: '/',
            propertiesPaginate: '/api/peru_properties/properties_paginate',
            propertiesResume: '/properties_paginate_resume',
            propertiesSearch: '/api/peru_properties/properties_ajax',
            propertiesExport: '/api/dashboard/properties/export',
            propertiesPurchase: '/api/purchases/process_purchase',
        })
    },
    methods: {
        selectAllProperties() {
            this.selectAll = !this.selectAll
            this.$store.dispatch('selectAllProperties', this.selectAll)
        },
        setPlace(place) {
            this.initPoint.location = place.geometry.location
            this.initPoint.address = place.formatted_address
            this.initPoint.show = true
            this.zoom = 15
            this.initDrawing()
        },
        editValidation() {
            // VALIDAR area del poligono (metros cuadrados)
            const areaInMeters = google.maps.geometry.spherical.computeArea(this.polygon.getPath())

            if (areaInMeters > this.MAX_AREA_IN_METERS) {
                Swal.fire({
                    title: 'Has excedido el límite',
                    text: `Límite de ${this.MAX_AREA_IN_METERS / 1000} Km2 excedido.`,
                    type: 'error',
                    confirmButtonColor: '#5e72e4',
                    confirmButtonText: 'Aceptar',
                })
                this.errorEditing = true
                return null
            }

            // Validar que la selección contenga el marker inicial
            if (!google.maps.geometry.poly.containsLocation(
                this.initPoint.location,
                this.polygon,
            )) {
                Swal.fire({
                    title: 'Error',
                    text: 'El marker inicial debe estar contenido en el polígono dibujado.',
                    type: 'error',
                    confirmButtonColor: '#5e72e4',
                    confirmButtonText: 'Aceptar',
                })
                this.errorEditing = true
                return null
            }

            this.errorEditing = false
            return null
        },
        allowDrawPolygon() {
            if (this.drawingManager !== null) {
                this.drawingManager.setOptions({
                    drawingMode: google.maps.drawing.OverlayType.POLYGON,
                    drawingControl: true,
                })
            }
        },
        denyDrawPolygon() {
            if (this.drawingManager !== null) {
                this.drawingManager.setOptions({
                    drawingMode: null,
                    drawingControl: false,
                })
            }
        },
        resetMap() {
            if (this.polygon !== null) {
                this.polygon.setMap(null)
                this.polygon = null
            }

            this.$store.dispatch('clearDataResults')
        },
        deleteSelection() {
            this.resetMap()
            this.allowDrawPolygon()
            this.selectAll = false
            this.selected_properties = []
        },
        getVertices() {
            const vertices = []

            const paths = this.polygon.getPaths()

            paths.forEach((element) => {
                // for each para cada objeto MVCArray (coordenadas de cada vertice del polygon)
                element.forEach((element2) => {
                    vertices.push(
                        { lng: element2.lng(), lat: element2.lat() },
                    )
                })
            })

            return vertices
        },
        updateMap() {
            if (!this.errorEditing) {
                this.selectAll = false
                this.selected_properties = []
                const vertices = this.getVertices()
                this.$store.dispatch('updateMap', { vertices, initPoint: this.initPoint })
            }
        },
        initDrawing() {
            if (this.drawingManager === null) {
                this.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: null,
                    drawingControl: false,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                    },
                    polygonOptions: {
                        strokeWeight: 3,
                        clickable: true,
                        editable: true, // POR AHORA
                        draggable: false,
                    },
                })

                this.drawingManager.setMap(this.$refs.gmap.$mapObject)
            }

            if (this.polygon !== null) {
                this.deleteSelection()
            }

            this.allowDrawPolygon()

            google.maps.event.clearListeners(this.drawingManager, 'polygoncomplete')

            google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {
                this.polygon = polygon

                // VALIDAR area del poligono (metros cuadrados)
                const areaInMeters = google.maps.geometry.spherical.computeArea(polygon.getPath())

                if (areaInMeters > this.MAX_AREA_IN_METERS) {
                    Swal.fire({
                        title: 'Has excedido el límite',
                        text: `Límite de ${this.MAX_AREA_IN_METERS / 1000} Km2 excedido.`,
                        type: 'error',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })

                    polygon.setMap(null)
                    this.polygon = null
                    return null
                }

                // Validar que la selección contenga el marker inicial
                if (!google.maps.geometry.poly.containsLocation(
                    this.initPoint.location,
                    polygon,
                )) {
                    Swal.fire({
                        title: 'Error',
                        text: 'El marker inicial debe estar contenido en el polígono dibujado.',
                        type: 'error',
                        confirmButtonColor: '#5e72e4',
                        confirmButtonText: 'Aceptar',
                    })

                    polygon.setMap(null)
                    this.polygon = null
                    return null
                }

                this.denyDrawPolygon()

                const vertices = this.getVertices()

                this.$store.dispatch('updateMap', { vertices, initPoint: this.initPoint })
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

                google.maps.event.addListener(
                    this.polygon.getPath(),
                    'set_at',
                    () => this.editValidation(),
                )
                google.maps.event.addListener(
                    this.polygon.getPath(),
                    'insert_at',
                    () => this.editValidation(),
                )

                google.maps.event.addListener(
                    this.polygon.getPath(),
                    'remove_at',
                    () => this.editValidation(),
                )

                return null
            })
        },
    },
    beforeRouteLeave(to, from, next) {
        this.polygon = null
        this.$store.dispatch('clearProperties')
            .then(() => next())
    },
}

</script>
