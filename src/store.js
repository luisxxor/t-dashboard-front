import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)


/**
 * @param {object} filtersData - Object with filters data
 * @param {Array} enabledSlider - Array with the data of enabled sliders
 * @return {Array} [a formatted object with filters data, an array with key names from filters]
 */
function prepareQuery(filtersData, enabledSlider) {
    const data = Object.assign({}, filtersData)

    const sliders = ['bedrooms_interval', 'bathrooms_interval', 'parkings_interval']
    const numeric = ['antiquity_years', 'total_area_m2', 'build_area_m2']
    const numericNames = ['antiquity_interval', 'total_area_interval', 'build_area_interval']

    const formattedValues = {}
    const formattedColumns = []

    // eslint-disable-next-line no-restricted-syntax
    for (const i in data) {
        if (sliders.indexOf(i) > -1) {
            formattedColumns.push(i)
            formattedValues[i] = enabledSlider[i] ? `${data[i][0]}--${data[i][1]}` : ''
        } else if (numeric.indexOf(i) > -1) {
            formattedColumns.push(i)
            const empty = data[i].min === 0 && data[i].max === 0
            formattedValues[numericNames[numeric.indexOf(i)]] = empty ? '--' : `${data[i].min}--${data[i].max}`
        } else {
            formattedColumns.push(i)
            formattedValues[i] = data[i]
        }
    }

    return [formattedValues, formattedColumns]
}

/**
 * @param {object} filtersData - Object with filters data
 * @param {Array} enabledSlider - Array with the data of enabled sliders
 * @return {number} Quantity of active filters
 */
function getActiveFilters(filtersData, enabledSlider) {
    const data = Object.assign({}, filtersData)

    let active = Object.values(enabledSlider).filter(Boolean).length // Get active sliders and add

    const numeric = ['antiquity_years', 'total_area_m2', 'build_area_m2']
    const misc = ['property_type_id', 'publication_date', 'publication_type', 'property_new']

    // eslint-disable-next-line no-restricted-syntax
    for (const i in data) {
        if (numeric.indexOf(i) > -1) {
            if (data[i].max > 0) {
                active += 1
            }
        } else if (misc.indexOf(i) > -1) {
            const publicationDateNotEmpty = (i === 'publication_date' && data[i] !== '')
            const miscAreNotNull = (i !== 'publication_date' && data[i] !== null)

            if (publicationDateNotEmpty || miscAreNotNull) {
                active += 1
            }
        }
    }

    return active
}

export default new Vuex.Store({
    state: {
        activeFilters: 0,
        filters_data: {
            bedrooms_interval: [0, 5],
            bathrooms_interval: [0, 5],
            parkings_interval: [0, 5],
            antiquity_years: {
                min: 0,
                max: 0,
            },
            total_area_m2: {
                min: 0,
                max: 0,
            },
            build_area_m2: {
                min: 0,
                max: 0,
            },
            publication_date: '',
            property_type_id: null,
            publication_type: null,
            property_new: null,
        },
        detailedPropertyShow: false,
        detailedPropertyIndex: null,
        error: false,
        enabled_slider: {
            bedrooms_interval: false,
            bathrooms_interval: false,
            parkings_interval: false,
        },
        initPoint: {
            lat: -9.189966999999998,
            lng: -75.015152,
            address: '',
        },
        markers: [],
        currentPage: 1,
        noResults: false,
        propertiesLoading: false,
        property_types: [],
        resumeLoading: false,
        routes: {
            baseURL: '',
            propertiesPaginate: '',
            propertiesResume: '',
            propertiesSearch: '',
            propertiesExport: '',
            propertiesPurchase: '',
        },
        polygonExists: false,
        properties: [],
        searchResults: {
            per_page: 0,
            total: 0,
            current_page: 1,
            from: 0,
            to: 0,
        },
        resumeProperties: {
            data: [],
            per_page: 0,
            total: 0,
            current_page: 1,
            from: 0,
            to: 0,
        },
        selectAll: false,
        selected_properties: [],
        vertices: [],
        listView: false,
        token: localStorage.getItem('token') || '',
        user: {
            name: '',
            lastname: '',
            email: '',
            phone_number1: '',
            address_line1: '',
            address_line2: '',
        },
        userEmailVerified: false,
        login: {
            error: {
                email: '',
                password: '',
            },
            loading: false,
        },
        registerLoading: false,
    },
    mutations: {
        updateField,
        CLEAR_FILTERS(state) {
            state.filters_data = {
                bedrooms_interval: [0, 5],
                bathrooms_interval: [0, 5],
                parkings_interval: [0, 5],
                antiquity_years: {
                    min: 0,
                    max: 0,
                },
                total_area_m2: {
                    min: 0,
                    max: 0,
                },
                build_area_m2: {
                    min: 0,
                    max: 0,
                },
                publication_date: '',
                property_type_id: null,
                publication_type: null,
                property_new: null,
            }

            state.enabled_slider = {
                bedrooms_interval: false,
                bathrooms_interval: false,
                parkings_interval: false,
            }
        },
        SHOW_LOADING_PROPERTIES(state, payload) {
            state.propertiesLoading = payload
        },
        SHOW_LOADING_RESUME(state, payload) {
            state.resume_loading = payload
        },
        ADD_RESULTS(state, payload) {
            const properties = payload.data.map(v => ({
                ...v.properties,
                _id: v._id,
                selected: state.selectAll,
            }))

            const markers = payload.data.map(v => ({
                lng: parseFloat(v.geometry.coordinates[0]),
                lat: parseFloat(v.geometry.coordinates[1]),
            }))

            state.properties.push(...properties)
            state.markers.push(...markers)

            state.searchResults.current_page = payload.current_page
        },
        UPDATE_RESULTS(state, payload) {
            const response = payload.data
            console.log(response)
            state.searchResults = (({ data, ...others }) => ({ ...others }))(response)
            state.properties = response.data.map(v => ({
                ...v.properties,
                _id: v._id,
                selected: false,
            }))

            state.markers = response.data.map(v => ({
                lng: parseFloat(v.geometry.coordinates[0]),
                lat: parseFloat(v.geometry.coordinates[1]),
            }))

            state.noResults = state.properties.length === 0
            state.error = false
        },
        UPDATE_RESUME(state, payload) {
            state.resumeProperties = payload
            state.error_resume = false
            state.selected_properties = []
        },
        CLEAR_DATA_RESULTS(state) {
            state.selectAll = false
            state.resumeProperties.current_page = 1
            state.currentPage = 1
            state.noResults = false
            state.properties = []
            state.markers = []
        },
        CLEAR_RESUME(state) {
            state.resumeProperties = {
                data: [],
                per_page: 0,
                total: 0,
                current_page: 1,
                from: 0,
                to: 0,
            }
            state.selected_properties = []
        },
        UPDATE_PROPERTY_TYPES(state, payload) {
            state.property_types = payload
        },
        SET_PROPERTIES_ROUTES(state, payload) {
            state.routes.baseURL = payload.baseURL || ''
            state.routes.propertiesPaginate = payload.propertiesPaginate || ''
            state.routes.propertiesResume = payload.propertiesResume || ''
            state.routes.propertiesSearch = payload.propertiesSearch || ''
            state.routes.propertiesExport = payload.propertiesExport || ''
            state.routes.propertiesPurchase = payload.propertiesPurchase || ''
        },
        UPDATE_MAP(state, payload) {
            state.initPoint.lat = payload.initPoint.location.lat()
            state.initPoint.lng = payload.initPoint.location.lng()
            state.initPoint.address = payload.initPoint.address
            state.vertices = payload.vertices
        },
        CLEAR_VERTICES(state) {
            state.vertices = []
        },
        CLEAR_INIT_POINT(state) {
            state.initPoint.lat = -9.189966999999998
            state.initPoint.lng = -75.015152
            state.initPoint.address = ''
        },
        ERROR(state) {
            state.propertiesLoading = false
            state.error = true
        },
        ERROR_RESUME(state) {
            state.resume_loading = false
            state.error = true
        },
        CHANGE_CURRENT_PAGE_RESUME(state, payload) {
            state.resumeProperties.current_page = payload
        },
        SELECT_ALL_PROPERTIES(state, payload) {
            state.selectAll = payload
            state.properties.forEach((v) => { v.selected = payload })
        },
        AUTH_REQUEST(state) {
            state.login.error.email = ''
            state.login.error.password = ''
            state.login.loading = true
        },
        REGISTER_REQUEST(state) {
            state.registerLoading = true
        },
        AUTH_SUCCESS(state, { token, user }) {
            state.login.loading = false
            state.login.error.email = ''
            state.login.error.password = ''
            state.token = token
            state.user = user
            state.userEmailVerified = user.email_verified_at !== null
        },
        REGISTER_SUCCESS(state, { token, user }) {
            state.registerLoading = false
            state.token = token
            state.user = user
            state.userEmailVerified = user.email_verified_at !== null
        },
        AUTH_ERROR(state, { email, password }) {
            state.login.error.email = email
            state.login.error.password = password
            state.login.loading = false
        },
        UPDATE_VERIFIED_STATUS(state) {
            state.userEmailVerified = !!state.user.email_verified_at
        },
        REGISTER_ERROR(state) {
            state.registerLoading = false
        },
        LOGOUT(state) {
            state.token = ''
            state.user = {
                name: '',
                lastname: '',
                email: '',
            }

            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        UPDATE_USER(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
    },
    getters: {
        getField,
        activeFilters: state => getActiveFilters(state.filters_data, state.enabled_slider),
        isAuth: state => !!state.token && state.token !== 'undefined',
        getUserEmailVerified: state => !!state.user.email_verified_at,
    },
    actions: {
        clearDataResults({ commit }) {
            commit('CLEAR_DATA_RESULTS')
        },
        clearFilters({ commit }) {
            commit('CLEAR_FILTERS')
        },
        updatePropertyTypes({ commit }) {
            this._vm.$http.get('/api/peru_properties/index')
                .then((response) => {
                    commit('UPDATE_PROPERTY_TYPES', response.data.data.filters.property_types)
                })
                .catch((err) => {
                    commit('UPDATE_PROPERTY_TYPES', [])
                    console.log(err)
                })
        },
        setPropertiesRoutes({ commit }, payload) {
            commit('SET_PROPERTIES_ROUTES', payload)
        },
        updateMap({ commit, dispatch }, payload) {
            commit('CLEAR_DATA_RESULTS')
            commit('UPDATE_MAP', payload)
            return dispatch('search')
        },
        clearVertices({ commit }) {
            commit('CLEAR_DATA_RESULTS')
            commit('CLEAR_VERTICES')
        },
        resumePageChange({ commit, dispatch, state }, payload) {
            if (state.selectAll) {
                dispatch('selectAllProperties', payload)
            } else {
                commit('CHANGE_CURRENT_PAGE_RESUME', payload)
            }
        },
        search({ commit, dispatch, state }) {
            return new Promise((resolve, reject) => {
                commit('SHOW_LOADING_PROPERTIES', true)
                const formattedData = prepareQuery(state.filters_data, state.enabled_slider)

                this._vm.$http.post(state.routes.propertiesSearch, {
                    lat: state.initPoint.lat,
                    lng: state.initPoint.lng,
                    vertices: state.vertices,
                    filters: formattedData[0],
                    address: state.initPoint.address,
                    perpage: 500,
                })
                    .then((response) => {
                        commit('CLEAR_DATA_RESULTS')
                        commit('UPDATE_RESULTS', response.data)
                        commit('SHOW_LOADING_PROPERTIES', false)
                        resolve('first page done')
                        if (response.data.current_page < response.data.last_page) {
                            dispatch('searchUntilLastPage', 2)
                                .then((paginateResponse) => {
                                    resolve(paginateResponse)
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        }
                    })
                    .catch((err) => {
                        reject(err)
                        console.log(err)
                        commit('ERROR')
                    })
            })
        },
        searchUntilLastPage({ commit, state, dispatch }, page) {
            return new Promise((resolve, reject) => {
                this._vm.$http.post(state.routes.propertiesPaginate, {
                    page,
                    total: state.searchResults.total,
                    searchId: state.searchResults.searchId,
                    perpage: 500,
                })
                    .then((response) => {
                        commit('ADD_RESULTS', response.data)
                        if (response.data.current_page < response.data.last_page) {
                            resolve(`Page ${page} done`)
                            dispatch('searchUntilLastPage', page + 1)
                                .then((paginateResponse) => {
                                    resolve(paginateResponse)
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        }
                    })
                    .catch((err) => {
                        reject(err)
                        commit('ERROR')
                    })
            })
        },
        selectAllProperties({ commit }, payload) {
            commit('SELECT_ALL_PROPERTIES', payload)
        },
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('AUTH_REQUEST')
                this._vm.$http.post('/api/login', user)
                    .then(({ data: { data } }) => {
                        localStorage.setItem('token', data.access_token)
                        localStorage.setItem('user', JSON.stringify(data.user))
                        this._vm.$http.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
                        commit('AUTH_SUCCESS', {
                            token: data.access_token,
                            user: data.user,
                        })
                        resolve(data)
                    })
                    .catch((err) => {
                        const { errors } = err.response.data
                        console.log(errors)
                        const email = errors.email === undefined ? '' : errors.email[0]
                        const password = errors.password === undefined ? '' : errors.password[0]
                        commit('AUTH_ERROR', { email, password })
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        reject(err)
                    })
            })
        },
        clearProperties({ commit }) {
            commit('CLEAR_DATA_RESULTS')
            commit('CLEAR_VERTICES')
            commit('CLEAR_FILTERS')
            commit('CLEAR_INIT_POINT')
        },
        logout({ dispatch, commit }) {
            dispatch('clearProperties')
            commit('LOGOUT')
        },
        register({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('REGISTER_REQUEST')
                this._vm.$http.post('/api/register', payload)
                    .then(({ data: { data } }) => {
                        localStorage.setItem('token', data.access_token)
                        localStorage.setItem('user', JSON.stringify(data.user))
                        this._vm.$http.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
                        commit('REGISTER_SUCCESS', {
                            token: data.access_token,
                            user: data.user,
                        })
                        resolve(data)
                    })
                    .catch((err) => {
                        commit('REGISTER_ERROR')
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        reject(err)
                    })
            })
        },
        verifyEmail({ commit, dispatch }, { id, expires, signature }) {
            return new Promise((resolve, reject) => {
                this._vm.$http.get(`/api/email/verify/${id}`, {
                    params: {
                        expires,
                        signature,
                    },
                })
                    .then((response) => {
                        dispatch('updateUser')
                            .then(() => {
                                commit('UPDATE_VERIFIED_STATUS')
                                resolve(response)
                            })
                            .catch((err) => {
                                reject(err)
                            })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        profileUpdate({ commit }, payload) {
            return new Promise((resolve, reject) => {
                this._vm.$http.put('/api/dashboard/profile', payload)
                    .then((response) => {
                        commit('UPDATE_USER', response.data.data)
                        resolve(response.data.data)
                    })
                    .catch(err => reject(err))
            })
        },
        updateUser({ commit }) {
            return new Promise((resolve, reject) => {
                this._vm.$http.get('/api/dashboard/profile')
                    .then((response) => {
                        commit('UPDATE_USER', response.data.data)
                        resolve(response.data.data)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
    },
})
