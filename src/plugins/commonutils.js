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

// export const useConvertCode = () => {
//   const convert = async (codeList, code) => {
//     if (!code) return '';

//     let name = '';

//     codeList.map((item) => {
//       if (item.code === code) {
//         name = item.name;
//         return;
//       }
//     });

//     return name;
//   };

//   return {
//     convert
//   };
// };
