<script setup>
import { computed } from "vue";
import useUserStore from "@/store/modules/userStore";

const props = defineProps({
  type: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "default",
  },
  onClick: {
    type: Function,
    default: () => {},
  },
  button: {
    type: String,
    default: "",
  },
});

const hasPermission = computed(() => {
  return useUserStore().hasButton(props.button);
});

const isDisabled = computed(() => {
  return props.disabled || !hasPermission.value;
});
</script>

<template>
  <el-button
    :type="type"
    :disabled="isDisabled"
    :size="size"
    @click="onClick"
  >
    <slot />
  </el-button>
</template>
