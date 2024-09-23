import "@fullcalendar/core/vdom";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import "./assets/css/app.css";
// import { Vue3SimpleHtml2pdf } from 'vue3-simple-html2pdf'

const app = createApp(App).use(router).use(VueGoodTablePlugin).use(createPinia());

globalComponents(app);
utils(app);

app.mount("#app");
