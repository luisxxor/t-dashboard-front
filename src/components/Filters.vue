<template>
    <div class="col-xl-12">
        <div class="form-row align-items-center">
            <div class="col-sm-12 col-md-6 px-3 col-lg-6 col-xl-4">
                <div class="form-row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label class="mb-0" for="property_type">Tipo:</label>
                    </div>
                    <div class="col-md-8">
                        <select
                            class="form-control custom-select"
                            id="property_type"
                            v-model="property_type"
                        >
                            <option disabled :value="null">
                                Seleccione el tipo de propiedad
                            </option>
                            <option
                                :key="propertyType"
                                v-for="propertyType in propertyTypes"
                                :value="propertyType"
                            >{{ propertyType }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 px-3 col-lg-6 col-xl-4 mt-4 mt-md-0">
                <div class="form-row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label class="mb-0" for="publication_date">Fecha:</label>
                    </div>
                    <div class="col-md-8">
                        <base-input
                            class="mb-0"
                            addon-right-icon="ni ni-calendar-grid-58"
                        >
                            <flat-picker
                                ref="date_picker"
                                class="form-control datepicker"
                                v-model="publication_date"
                                placeholder="Seleccione un rango de fechas"
                                :config="date_options"
                            ></flat-picker>
                        </base-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="slidersAndNumerics">
            <div class="form-row align-items-center my-5">
                <div class="px-3 col-sm-12 col-xl-4">
                    <div class="form-row d-flex">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <base-checkbox v-model="bedrooms_enable">
                                Habitaciones
                            </base-checkbox>
                        </div>
                        <div class="col-sm-9 col-md-8">
                            <vue-slider
                                v-bind="sliders_options"
                                :disabled="!bedrooms_enable"
                                v-model="bedrooms_interval"
                            ></vue-slider>
                        </div>
                    </div>
                </div>
                <div class="px-3 col-sm-12 col-xl-4 my-5 my-xl-0">
                    <div class="form-row d-flex">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <base-checkbox v-model="bathrooms_enable">
                                Baños
                            </base-checkbox>
                        </div>
                        <div class="col-sm-9 col-md-8">
                            <vue-slider
                                v-bind="sliders_options"
                                :disabled="!bathrooms_enable"
                                v-model="bathrooms_interval"
                            ></vue-slider>
                        </div>
                    </div>
                </div>
                <div class="px-3 col-sm-12 col-xl-4">
                    <div class="form-row d-flex">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <base-checkbox v-model="parkings_enable">
                                Cocheras
                            </base-checkbox>
                        </div>
                        <div class="col-sm-9 col-md-8">
                            <vue-slider
                                v-bind="sliders_options"
                                :disabled="!parkings_enable"
                                v-model="parkings_interval"
                            ></vue-slider>
                        </div>
                    </div>
                </div>
            </div>
            <div class="separator"></div>
            <div class="form-row align-items-center my-5">
                <div class="px-2 col-sm-12 col-xl-4">
                    <div class="form-row">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <label for>Antiguedad (años)</label>
                        </div>
                        <div class="col-sm-9 col-md-8 form-row d-flex flex-nowrap">
                            <div class="mr-1 col">
                                <base-input
                                    :min="0"
                                    :max="antiquity_years_max"
                                    v-model="antiquity_years_min"
                                    label="Desde"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                            <div class="ml-1 col">
                                <base-input
                                    :min="antiquity_years_min"
                                    v-model="antiquity_years_max"
                                    label="Hasta"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 col-sm-12 col-xl-4 my-4 my-md-5 my-xl-0">
                    <div class="form-row">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <label for>Area Exclusiva (m2)</label>
                        </div>
                        <div class="col-sm-9 col-md-8 form-row d-flex flex-nowrap">
                            <div class="mr-1 col">
                                <base-input
                                    min="0"
                                    step="0.01"
                                    :max="total_area_m2_max"
                                    v-model="total_area_m2_min"
                                    pattern="\d+"
                                    label="Desde"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                            <div class="ml-1 col">
                                <base-input
                                    :min="total_area_m2_min"
                                    v-model="total_area_m2_max"
                                    step="0.01"
                                    label="Hasta"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-2 col-sm-12 col-xl-4">
                    <div class="form-row">
                        <div class="col-sm-3 col-md-4 d-flex align-items-center">
                            <label for>Area Techada (m2)</label>
                        </div>
                        <div class="col-sm-9 col-md-8 form-row d-flex flex-nowrap">
                            <div class="mr-1 col">
                                <base-input
                                    min="0"
                                    step="0.01"
                                    :max="build_area_m2_max"
                                    v-model="build_area_m2_min"
                                    label="Desde"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                            <div class="ml-1 col">
                                <base-input
                                    :min="build_area_m2_min"
                                    v-model="build_area_m2_max"
                                    step="0.01"
                                    label="Hasta"
                                    type="number"
                                    inputClasses="form-control-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-row align-items-center">
            <div class="px-3 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                <div class="form-row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label class="mb-0" for="property_type">
                            Tipo publicación:
                        </label>
                    </div>
                    <div class="col-md-8">
                        <select
                            class="form-control custom-select"
                            v-model="publication_type"
                        >
                            <option disabled :value="null">
                                Seleccione el tipo de publicación
                            </option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="px-3 col-sm-12 col-md-6 col-lg-6 col-xl-4 mt-4 mt-md-0">
                <div class="form-row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label class="mb-0" for="property_type">
                            Nuevo/Usado
                        </label>
                    </div>
                    <div class="col-md-8">
                        <select
                            class="form-control custom-select"
                            v-model="is_new"
                        >
                            <option disabled :value="null">
                                Seleccione la condición
                            </option>
                            <option :value="true">Nuevo</option>
                            <option :value="false">Usado</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import VueSlider from 'vue-slider-component'
import { mapFields } from 'vuex-map-fields'
import 'flatpickr/dist/flatpickr.css'
import flatPicker from 'vue-flatpickr-component'
import shortcutButtonsPlugin from 'shortcut-buttons-flatpickr'
import { Spanish } from 'flatpickr/dist/l10n/es'
import store from '../store'

Spanish.rangeSeparator = ' -- '

export default {
    name: 'filters',
    store,
    components: { flatPicker, VueSlider },
    mounted() {
        console.log('Component mounted.')
    },
    data() {
        return {
            date_options: {
                // Opciones para el datepicker
                allowInput: true,
                mode: 'range',
                dateFormat: 'd/m/Y',
                wrap: true,
                locale: Spanish,
                onClose(selectedDates, dateStr, fp) {
                    fp.setDate(dateStr)
                },
                plugins: [
                    shortcutButtonsPlugin({
                        // Plugin para añadir los shortcuts al datepicker
                        theme: 'dark',
                        button: [
                            { label: 'Este mes' },
                            { label: 'Últimos 3 meses' },
                            { label: 'Últimos 6 meses' },
                        ],
                        onClick: (index) => {
                            const maxDate = moment()
                                .endOf('month')
                                .format('DD/MM/YYYY')

                            let minDate
                            if (index === 0) {
                                minDate = moment()
                                    .startOf('month')
                                    .format('DD/MM/YYYY')
                            } else if (index === 1) {
                                minDate = moment()
                                    .subtract('2', 'months')
                                    .startOf('month')
                                    .format('DD/MM/YYYY')
                            } else {
                                minDate = moment()
                                    .subtract('5', 'months')
                                    .startOf('month')
                                    .format('DD/MM/YYYY')
                            }

                            this.publication_date = `${minDate} -- ${maxDate}`
                        },
                    }).bind(this),
                ],
            },
            sliders_options: {
                contained: true,
                tooltip: 'always',
                tooltipFormatter: val => (val === 5 ? '5 a más' : val),
                'enable-cross': false,
                min: 0,
                max: 5,
                dotSize: [15, 15],
                height: 5,
                dotStyle: { 'background-color': '#5e72e4' },
                tooltipStyle: {
                    border: '1px solid #D9D9D9',
                    color: '#000',
                    background: '#fff',
                },
                processStyle: { 'background-color': '#716aca' },
                adsorb: true,
            },
        }
    },
    watch: {
        bedrooms_enable(val) {
            if (val === false) {
                this.bedrooms_interval = [0, 5]
            } return val
        },
        bathrooms_enable(val) {
            if (val === false) {
                this.bathrooms_interval = [0, 5]
            } return val
        },
        parkings_enable(val) {
            if (val === false) {
                this.parkings_interval = [0, 5]
            } return val
        },
        publication_date(val) {
            if (val === '') {
                this.$refs.date_picker.fp.clear()
            }
        },
    },
    computed: {
        ...mapFields({
            property_type: 'filters_data.property_type_id',
            publication_date: 'filters_data.publication_date',
            bedrooms_interval: 'filters_data.bedrooms_interval',
            bathrooms_interval: 'filters_data.bathrooms_interval',
            parkings_interval: 'filters_data.parkings_interval',
            antiquity_years_max: 'filters_data.antiquity_years.max',
            antiquity_years_min: 'filters_data.antiquity_years.min',
            total_area_m2_max: 'filters_data.total_area_m2.max',
            total_area_m2_min: 'filters_data.total_area_m2.min',
            build_area_m2_max: 'filters_data.build_area_m2.max',
            build_area_m2_min: 'filters_data.build_area_m2.min',
            publication_type: 'filters_data.publication_type',
            is_new: 'filters_data.property_new',
            bedrooms_enable: 'enabled_slider.bedrooms_interval',
            bathrooms_enable: 'enabled_slider.bathrooms_interval',
            parkings_enable: 'enabled_slider.parkings_interval',
            propertyTypes: 'property_types',
        }),
    },
}
</script>

<style>
.shortcut-buttons-flatpickr-button {
    display: inline-block;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    cursor: pointer;
    color: #fff;
    background-color: #5e72e4;
    border-color: #5e72e4;
    -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11),
        0 1px 3px rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.shortcut-buttons-flatpickr-button:hover {
    transform: translateY(-1px);
    color: #fff;
    background-color: #5e72e4;
    border-color: #5e72e4;
}

.shortcut-buttons-flatpickr-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 0.8rem;
}

@media (max-width: 1200px) and (min-width: 769px) {
    .slidersAndNumerics {
        display: flex;
    }

    .slidersAndNumerics > div {
        flex: 1 0 45%
    }

    .separator {
        flex: 1 0 0!important;
    }
}

@media (max-width: 575px) {
    .vue-slider-dot-tooltip-inner-top::after {
        transform: rotate(180deg) translate(50%)!important;
        top: -10px!important;
    }

    .vue-slider-dot-tooltip-top {
        top: 0!important;
        bottom: -10px!important;
        left: 50%!important;
        -webkit-transform: translate(-50%,100%)!important;
        transform: translate(-50%,100%)!important;
    }
}
</style>
