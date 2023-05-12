import {createApp} from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

axios.defaults.baseURL = "http://localhost:9527";

const app = createApp(App)

app
    .use(store)
    .use(router)
    .use(ElementPlus)
    .mount("#app");


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}