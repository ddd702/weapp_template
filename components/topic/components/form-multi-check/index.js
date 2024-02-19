// index.js
const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  /**
   * 组件的初始数据
   */
  data: {
    autoSize: { maxHeight: 100, minHeight: 40 },
    checkSelect: [],
    inputArray: [],
    // qnImg: '',
  },
  computed: {
    formValue(data) {
      const tempArray = [];
      data.inputArray.map(item => {
        if (data.checkSelect.includes(item.name)) {
          tempArray.push(`${item.name}${item.value ? '(' : ''}${item.value || ''}${item.value ? ')' : ''}`);
        }
      });
      return tempArray.join(';');
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelectChange(e) {
      this.setData({
        checkSelect: e.detail,
      });
    },
    onInputChange(e) {
      const { inputArray } = this.data;
      const { index } = e.currentTarget.dataset;
      inputArray[index].value = e.detail.value;
      this.setData({
        inputArray,
      });
    },
  },
  lifetimes: {
    attached() {
      const { content } = this.data;
      let inputArray = [];
      content.checkList.map(item => {
        inputArray.push({ name: item.value, value: '', checked: false });
      });
      this.setData({
        inputArray,
      });
    },
  },
});
