<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";

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

import { getSeller } from "@/api/screen";

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

const state = reactive({
  allData: null,
  currentPage: 1,
  totalPage: 0,
  timerId: null,
});

let chartInstance = ref(null);
let sellerRef = ref(null);

const initChart = () => {
  if (!sellerRef || !sellerRef.value) return;

  chartInstance.value = echarts.init(sellerRef.value);
  // 对图表初始化配置的控制
  const initOption = {
    title: {
      text: "▎商家销售统计",
      left: 20,
      top: 20,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
    },
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          position: "right",
        },
      },
    ],
  };
  chartInstance.value.setOption(initOption);

  chartInstance.value.on("mouseover", () => {
    clearInterval(state.timerId);
  });
  chartInstance.value.on("mouseout", () => {
    startInterval();
  });
};

const getData = async () => {
  const res = await getSeller();
  console.log("🚀 ~ file: Seller.vue:87 ~ getData ~ res:", res);
  state.allData = res.data;

  state.allData.sort((a, b) => {
    return a.value - b.value;
  });
  // 每5个元素显示一页
  state.totalPage =
    state.allData.length % 5 === 0 ? state.allData.length / 5 : state.allData.length / 5 + 1;
  updateChart();
  // 启动定时器
  startInterval();
};

const updateChart = () => {
  const start = (state.currentPage - 1) * 5;
  const end = state.currentPage * 5;
  const showData = state.allData.slice(start, end);

  const dataOption = {
    yAxis: {
      data: showData.map((item) => item.name),
    },
    series: [
      {
        data: showData,
      },
    ],
  };
  chartInstance.value.setOption({
    title: {
      text: `▎商家销售统计（第${state.currentPage}页）`,
    },
  });
  chartInstance.value.setOption(dataOption);
};

const startInterval = () => {
  if (state.timerId) {
    clearInterval(state.timerId);
  }
  state.timerId = setInterval(() => {
    state.currentPage++;
    if (state.currentPage > state.totalPage) {
      state.currentPage = 1;
    }
    updateChart();
  }, 5000);
};

const screenAdapter = () => {
  if (!sellerRef || !sellerRef.value) return;

  const titleFontSize = (sellerRef.value.offsetWidth / 100) * 2.6;
  // 和分辨率大小相关的配置项
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
      },
    },
    series: [
      {
        barWidth: titleFontSize,
        itemStyle: {
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
        },
      },
    ],
  };
  chartInstance.value.setOption(adapterOption);
  // 手动的调用图表对象的 resize 才能产生效果
  chartInstance.value.resize();
};

onMounted(() => {
  initChart();
  getData();
  window.addEventListener("resize", screenAdapter);
  // 在页面加载完成的时候, 主动进行屏幕的适配
  screenAdapter();
});

onUnmounted(() => {
  clearInterval(state.timerId);
  // 在组件销毁的时候, 需要将监听器取消掉
  window.removeEventListener("resize", screenAdapter);
});
</script>

<template>
  <div class="w-full h-full">
    <div
      class="w-full h-full"
      ref="sellerRef"
    ></div>
  </div>
</template>
