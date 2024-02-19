// index.js
const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    formValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFormValueChange(e) {
      const { content, formValue } = this.data;
      if (formValue === e.detail) {
        return;
      }

      this.setData({
        // checkSelect: e.detail,
        formValue: e.detail,
      });
      if (content.formKey === 'interest') {
        this.triggerEvent('getFormValue', ['interest']);
      }
    },
  },
  lifetimes: {},
});
