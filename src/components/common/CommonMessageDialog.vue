<script setup>
import { inject, computed } from 'vue';

const dialogRef = inject('dialogRef');
let param = dialogRef.value.data;
const defaultParam = {
  icon: '', // good, bad
  message: ' ',
  isConfirm: false,
  labelConfirm: '확인',
  labelYes: '확인',
  labelNo: '최소',
  onCloseYes: null,
  onCloseNo: null
};
param = { ...defaultParam, ...param };

const htmlTranslate = computed(() => {
  return param.message.replace('\n', '<br />');
});

const iconTranslate = computed(() => {
  switch (param.icon) {
    case 'good':
      return 'check';
    case 'bad':
      return 'exclamation';
    case 'warn':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return '';
  }
});

const onClose = () => {
  dialogRef.value.close();
};

const onCloseYes = () => {
  if (param.onCloseYes) {
    param.onCloseYes();
  }
  onClose();
};
const onCloseNo = () => {
  if (param.onCloseNo) {
    param.onCloseNo();
  }
  onClose();
};
</script>

<template>
  <div class="modal_custom_wrap modal_sm">
    <div class="modal_header">
      <button @click="onClose">
        <span class="material-symbols-rounded">close</span>
      </button>
    </div>
    <div class="modal_body">
      <div v-if="param.icon" class="area_icon_circle" :class="param.icon">
        <span class="material-symbols-rounded"> {{ iconTranslate }} </span>
      </div>
      <p v-html="htmlTranslate"></p>
    </div>
    <div v-if="!param.isConfirm" class="modal_bottom btn_1">
      <button class="bt_btn secondary_outline" @click="onClose">{{ param.labelConfirm }}</button>
    </div>
    <div v-if="param.isConfirm" class="modal_bottom btn_2">
      <button class="bt_btn secondary_outline" @click="onCloseNo">{{ param.labelNo }}</button>
      <button class="bt_btn primary" @click="onCloseYes">{{ param.labelYes }}</button>
    </div>
  </div>
</template>
