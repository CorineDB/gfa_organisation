import "@fullcalendar/core/vdom";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import store from "./stores";
import globalComponents from "./global-components";
import utils from "./utils";
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import "./assets/css/app.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import JsonExcel from "vue-json-excel3";
import phoneValidator from './plugins/phoneValidator';


// import { Vue3SimpleHtml2pdf } from 'vue3-simple-html2pdf'

const app = createApp(App).use(router).use(VueGoodTablePlugin).use(phoneValidator).use(createPinia()).use(store).use(Vue3Toastify, {
  autoClose: 3000,
});

globalComponents(app);
utils(app);
app.component("v-select", vSelect);
app.component("downloadExcel", JsonExcel);
app.mount("#app");
