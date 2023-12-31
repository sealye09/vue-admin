import { createApp } from "vue";
import { createPinia } from "pinia";

import { pinia, setupStore } from "@/store";
import App from "@/App.vue";
import router from "@/router";
import vPermission from "./directive/vPermission";

import "@/styles/index.scss";
import "element-plus/dist/index.css";

const app = createApp(App);

// async function call() {
//   setupStore(app);
// }

setupStore(app);

app.use(router);

import "@/router/permisstion.js";

app.use(vPermission);

app.mount("#app");
