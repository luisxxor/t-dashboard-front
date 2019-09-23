<template>
    <div>
        <base-nav
            type="secondary"
            effect="light"
            :class="{
                'navbar-expand-lg': isAuth,
                'navbar-expand': !isAuth,
            }"
        >
            <a href="/" slot="brand" class="navbar-brand">
                <LogoTasing />
            </a>

            <div class="row" slot="content-header">
                <div class="col-6 collapse-brand">
                    <a href="/" class="navbar-brand">
                        <img src="/img/logo-tasing.svg" alt="Logo tasing">
                    </a>
                </div>
            </div>

            <ul class="navbar-nav ml-lg-auto">
                <li v-if="canProperties" class="nav-item">
                    <router-link
                        class="nav-link nav-link-icon"
                        :class="{active: propertiesActive}"
                        to="/properties"
                    >
                        Propiedades
                    </router-link>
                </li>

                <li v-if="canPurchaseFiles" class="nav-item">
                    <router-link
                        class="nav-link nav-link-icon"
                        :class="{active: purchaseFilesActive}"
                        to="/dashboard/downloads"
                    >
                        Descargas
                    </router-link>
                </li>

                <base-dropdown v-if="isAuth" tag="li" title="Perfil" position="right">
                    <div
                        class="dropdown-header background-profile-dropdown"
                    >
                        <div class="d-flex my-4 align-items-center">
                            <div
                                class="
                                    rounded-circle
                                    bg-primary
                                    d-flex
                                    justify-content-center
                                    align-items-center
                                "
                                style="width: 75px; height: 75px; flex: 1 0 auto;"
                            >
                                <span style="font-size: 2.5rem">{{ user.name.slice(0, 1) }}</span>
                            </div>
                            <div
                                class="d-flex flex-wrap ml-4"
                                style="flex: 1 0 30%; margin-right: 100%"
                            >
                                <span class="lead" style="margin: 0; height: fit-content;">
                                    <strong>{{ user.name }} {{ user.lastname }}</strong>
                                </span>
                                <p style="font-size: .8rem; height: fit-content;">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <router-link
                        class="dropdown-item"
                        to="/dashboard/profile/edit"
                    >
                        Perfil
                    </router-link>
                    <li
                        class="dropdown-item"
                        @click.prevent="logout"
                        style="cursor: pointer"
                    >
                        Salir
                    </li>

                </base-dropdown>
            </ul>
        </base-nav>

        <main class="mt-3" :class="{'overflow-hidden': disableOverflow}">
            <router-view></router-view>
        </main>
    </div>
</template>

<style>
    .background-profile-dropdown {
        background: url(/img/bg-2.jpg);
        background-size: cover;
    }
</style>

<script>
import { mapFields } from 'vuex-map-fields'
import store from './store'

export default {
    name: 'app',
    store,
    mounted() {
        const user = localStorage.getItem('user')
        if (user && user !== 'undefined') {
            this.user = JSON.parse(user)
            this.userEmailVerified = !!this.user.email_verified_at
        }
    },
    computed: {
        ...mapFields({
            user: 'user',
            userEmailVerified: 'userEmailVerified',
        }),
        isAuth() {
            return this.$store.getters.isAuth
        },
        propertiesActive() {
            return this.$route.path === '/properties'
        },
        purchaseFilesActive() {
            return this.$route.path === '/dashboard/downloads'
        },
        disableOverflow() {
            return this.propertiesActive || this.purchaseFilesActive
        },
        canProperties() {
            return this.isAuth && this.userEmailVerified
        },
        canPurchaseFiles() {
            return this.isAuth && this.userEmailVerified
        },
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/login')
                })
        },
    },
}
</script>
