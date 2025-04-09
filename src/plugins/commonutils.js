import CommonMessageDialog from '@/components/common/CommonMessageDialog.vue';

import { cloneDeep } from 'es-toolkit';

let globalProperties;

export default {
  install: (app, options) => {
    globalProperties = app.config.globalProperties;
  }
};

const defaultMessageDialogParam = {
  props: { pt: { content: { style: 'border-radius: 12px;' } }, showHeader: false, modal: true },
  data: {
    icon: ''
  }
};

export const useMessagePop = () => {
  return {
    alert: (message, icon = '') => {
      const param = cloneDeep(defaultMessageDialogParam);
      param.data.message = message;
      param.data.icon = icon;
      globalProperties.$dialog.open(CommonMessageDialog, param);
    },
    confirm: (dataParam) => {
      const param = cloneDeep(defaultMessageDialogParam);
      param.data = { ...param.data, ...dataParam };
      param.data.isConfirm = true;
      globalProperties.$dialog.open(CommonMessageDialog, param);
    },
    toast: (detail, severity = 'success', summary = 'success', group = 'apptc', life = 2500) => {
      const param = {
        detail: detail,
        severity: severity,
        summary: summary,
        group: group,
        life: life
      };
      globalProperties.$toast.add(param);
    }
  };
};

export const useDynamicDialog = () => {
  return {
    open: (component, param) => {
      return globalProperties.$dialog.open(component, param);
    }
  };
};

export const useDateFormatter = () => {
  return {
    fullDate: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 오전/오후 표시
        timeZone: 'Asia/Seoul' // UTC 시간대로 설정
      });
    },
    halfDate: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // 오전/오후 표시
          timeZone: 'Asia/Seoul' // UTC 시간대로 설정
        })
        .slice(0, 12)
        .replaceAll(' ', '');
    },
    quartDate: (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // 오전/오후 표시
          timeZone: 'Asia/Seoul' // UTC 시간대로 설정
        })
        .slice(0, 8)
        .replaceAll(' ', '');
    }
  };
};
