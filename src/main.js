import { createApp } from "vue";
import { createPinia } from "pinia";

import { setupStore } from "./store";
import App from "./App.vue";
import router from "./router";

import "./styles/index.scss";
import "element-plus/dist/index.css";

const app = createApp(App);

setupStore(app);

app.use(router);
app.mount("#app");
