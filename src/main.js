import { createApp } from "vue";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { setupStore } from "./store";
import App from "./App.vue";
import router from "./router";

import "element-plus/dist/index.css";
import "./styles/index.scss";

const app = createApp(App);

setupStore(app);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.mount("#app");
