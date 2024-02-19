// index.js
import { areaList } from '@vant/area-data';

const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  /**
   * 组件的初始数据
   */
  data: {
    pickerVisible: false,
    areaList,
    selected: [],
  },
  computed: {
    formValue(data) {
      if (data.selected.length == 0) {
        return null;
      }
      let tempObj = {
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
        areaName: '',
        areaCode: '',
      };
      tempObj.provinceName = data.selected[0].name;
      tempObj.provinceCode = data.selected[0].code;
      if (data.selected.length >= 2) {
        tempObj.cityName = data.selected[1].name || '';
        tempObj.cityCode = data.selected[1].code || '';
      }
      if (data.selected.length >= 3) {
        tempObj.areaName = data.selected[2].name || '';
        tempObj.areaCode = data.selected[2].code || '';
      }

      return tempObj;
    },
    formValueText(data) {
      let tempArr = [];
      data.selected.map(item => {
        tempArr.push(item.name);
      });
      return tempArr.join('/');
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm(e) {
      console.warn('YYYY/MM', e);
      this.setData({
        selected: e.detail.values,
        pickerVisible: false,
      });
    },
    openPicker() {
      this.setData({
        pickerVisible: true,
      });
    },
    onClose() {
      this.setData({
        pickerVisible: false,
      });
    },
  },
});
