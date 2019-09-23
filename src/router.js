import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/pages/Login'
import Properties from './components/pages/Properties'
import Register from './components/pages/Register'
import MustVerify from './components/pages/MustVerify'
import Email from './components/pages/VerifyEmail'
import PasswordForgot from './components/pages/PasswordForgot'
import PasswordReset from './components/pages/PasswordReset'
import ProfileEdit from './components/pages/ProfileEdit'
import Downloads from './components/pages/Downloads'
import FileDetail from './components/pages/FileDetail'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/vue-app/',
    routes: [
        { path: '/login', component: Login, meta: { onlyNoAuth: true } },
        { path: '/properties', component: Properties, meta: { requiresAuth: true } },
        { path: '/register', component: Register, meta: { onlyNoAuth: true } },
        { path: '/unverified', component: MustVerify, meta: { requiresAuth: true, verify: true } },
        {
            path: '/email/verify/:id/',
            component: Email,
            meta: { requiresAuth: true, verify: true },
        },
        { path: '/password/forgot', component: PasswordForgot, meta: { onlyNoAuth: true } },
        { path: '/password/reset', component: PasswordReset, meta: { onlyNoAuth: true } },
        { path: '/dashboard/profile/edit', component: ProfileEdit, meta: { requiresAuth: true } },
        { path: '/dashboard/downloads', component: Downloads, meta: { requiresAuth: true } },
        { path: '/dashboard/downloads/:id/', component: FileDetail, meta: { requiresAuth: true } },
    ],
})
