// import _ from 'lodash';

import vue from 'vue'
import App from '@/Dev.vue'

import '../public/main.css'

let a = 1

new vue({
    el: '#app',
    render: h=> h(App)
})