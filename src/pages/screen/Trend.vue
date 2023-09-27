<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

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

import { getTrend } from "@/api/screen";

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
  showChoice: false,
  choiceType: "map",
  titleFontSize: 0,
});

let chartInstance = ref(null);
let trendRef = ref(null);

const showTitle = computed(() => {
  if (!state.allData) {
    return "";
  } else {
    return state.allData[state.choiceType].title;
  }
});

const selectTypes = computed(() => {
  if (!state.allData) {
    return [];
  } else {
    return state.allData.type.filter((item) => {
      return item.key !== state.choiceType;
    });
  }
});

const initChart = () => {
  if (!trendRef || !trendRef.value) return;

  chartInstance.value = echarts.init(trendRef.value);
  // 对图表初始化配置的控制

  const initOption = {
    grid: {
      left: "3%",
      top: "35%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      left: 20,
      top: "15%",
      icon: "circle",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
  };

  chartInstance.value.setOption(initOption);
};

const getData = async () => {
  const res = await getTrend();
  console.log("🚀 ~ file: Rank.vue:88 ~ getData ~ res:", res);
  state.allData = res.data;
  updateChart();
};

const updateChart = () => {
  // 半透明的颜色值
  const colorArr1 = [
    "rgba(11, 168, 44, 0.5)",
    "rgba(44, 110, 255, 0.5)",
    "rgba(22, 242, 217, 0.5)",
    "rgba(254, 33, 30, 0.5)",
    "rgba(250, 105, 0, 0.5)",
  ];
  // 全透明的颜色值
  const colorArr2 = [
    "rgba(11, 168, 44, 0)",
    "rgba(44, 110, 255, 0)",
    "rgba(22, 242, 217, 0)",
    "rgba(254, 33, 30, 0)",
    "rgba(250, 105, 0, 0)",
  ];

  // 类目轴的数据
  const timeArr = state.allData.common.month;
  // y轴的数据 series下的数据
  const valueArr = state.allData[state.choiceType].data;
  const seriesArr = valueArr.map((item, index) => {
    return {
      name: item.name,
      type: "line",
      data: item.data,
      stack: state.choiceType,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colorArr1[index],
          }, // %0的颜色值
          {
            offset: 1,
            color: colorArr2[index],
          }, // 100%的颜色值
        ]),
      },
    };
  });
  // 图例的数据
  const legendArr = valueArr.map((item) => {
    return item.name;
  });
  const dataOption = {
    xAxis: {
      data: timeArr,
    },
    legend: {
      data: legendArr,
    },
    series: seriesArr,
  };

  chartInstance.value.setOption(dataOption);
};

const screenAdapter = () => {
  if (!trendRef || !trendRef.value) return;

  const titleFontSize = (trendRef.value.offsetWidth / 100) * 3.6;
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
      },
    },
    legend: {
      itemWidth: titleFontSize,
      itemHeight: titleFontSize,
      itemGap: titleFontSize,
      textStyle: {
        fontSize: titleFontSize / 2,
      },
    },
  };

  chartInstance.value.setOption({
    title: {
      text: showTitle.value,
    },
  });
  chartInstance.value.setOption(adapterOption);
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
  window.removeEventListener("resize", screenAdapter);
});
</script>

<template>
  <div class="w-full h-full">
    <div
      class="w-full h-full"
      ref="trendRef"
    ></div>
  </div>
</template>
