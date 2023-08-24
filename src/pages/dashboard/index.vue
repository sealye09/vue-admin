<script setup>
import { onMounted, reactive } from "vue";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import { getProducts, getSales, getUsersAge } from "@/api/dashboard";
import useUserStore from "@/store/modules/userStore";

// 注册必须的组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const chartsData = reactive({
  products: {
    names: [],
    sales: [],
  },
  sales: {
    days: [],
    amounts: [],
  },
  age: {},
});
const productsData = reactive([]);
const salesData = reactive([]);
const ageData = reactive([]);

const init = async () => {
  const productsRes = await getProducts();
  const salesRes = await getSales();
  const ageData = await getUsersAge();
  chartsData.products = productsRes.data;
  chartsData.sales = salesRes.data;
  chartsData.age = ageData.data;
  console.log("🚀 ~ file: index.vue:57 ~ init ~ chartsData:", chartsData);
};

const initProductsChart = () => {
  const id = "products-chart";
  if (document.getElementById(id) == null) {
    return;
  }
  echarts.dispose(document.getElementById(id));
  // 使用 ECharts 绘制商品销量图表
  const productChart = echarts.init(document.getElementById(id));
  const productChartOptions = {
    title: {
      text: "商品销量",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: chartsData.products.map((item) => item.name),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartsData.products.map((item) => item.sales),
        type: "bar",
      },
    ],
  };
  productChart.setOption(productChartOptions);
};

const initSalesChart = () => {
  // 使用 ECharts 绘制销售额趋势图表
  const id = "sales-chart";
  if (document.getElementById(id) == null) {
    return;
  }
  echarts.dispose(document.getElementById(id));
  const salesChart = echarts.init(document.getElementById(id));
  const salesChartOptions = {
    title: {
      text: "销售额趋势",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: chartsData.sales.map((item) => item.day),
    },
    yAxis: {},
    series: [
      {
        data: chartsData.sales.map((item) => item.amount),
        type: "line",
      },
    ],
  };
  salesChart.setOption(salesChartOptions);
};

const initAgeChart = () => {
  const id = "age-chart";
  if (document.getElementById(id) == null) {
    return;
  }
  echarts.dispose(document.getElementById(id));
  // 使用 ECharts 绘制用户年龄分布图表 饼状图
  const ageChart = echarts.init(document.getElementById(id));
  const ageChartOptions = {
    title: {
      text: "用户年龄分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: chartsData.age.map((item) => item.name),
    },
    series: [
      {
        name: "年龄分布",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        data: chartsData.age,
      },
    ],
  };
  ageChart.setOption(ageChartOptions);
};

// 返回时间 + 用户名 + 问好
const sayHello = () => {
  const currTime = new Date().toLocaleTimeString();
  const name = useUserStore().info.name;
  return `${name}，欢迎回来，现在是${currTime}。`;
};

onMounted(async () => {
  await init();
  initProductsChart();
  initSalesChart();
  initAgeChart();
});
</script>

<template>
  <div class="space-y-8">
    <span class="text-2xl text-center text-amber-600 hover:text-orange-600/80">
      {{ sayHello() }}
    </span>

    <el-divider />

    <div class="space-y-6">
      <div class="flex justify-between">
        <div
          id="products-chart"
          class="w-[460px] h-[460px]"
        ></div>
        <div
          id="sales-chart"
          class="w-[460px] h-[460px]"
        ></div>
        <div
          id="age-chart"
          class="w-[460px] h-[460px]"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
