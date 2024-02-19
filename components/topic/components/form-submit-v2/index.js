// index.js
import { sleep } from '../../../../utils/util';
import { setUrl } from '../../../../tool/req';

const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  properties: {
    layout: {
      type: Array,
      value: [],
    },
    parentCtx: null,
  },
  /**
   * 组件的初始数据
   */
  data: {
    resultShow: false,
    result: {
      wxQrCode: '',
      salesName: '',
      phone: '',
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    makePhone() {
      const { result } = this.data;
      wx.makePhoneCall({
        phoneNumber: result.phone,
      });
    },
    onComfirm() {
      wx.navigateBack();
    },
    async onSubmit() {
      // console.log('onSubmit',this.data.content.dataKeys)
      const { content, layout } = this.data;
      const submitData = { content: [] };
      let submitKeys = [];
      if (content.allKeysSwitch) {
        submitKeys = layout.reduce((pre, cur) => {
          if (cur.content.formKey) {
            pre.push(cur.content.formKey);
          }
          return pre;
        }, []);
      } else {
        submitKeys = content.dataKeys.split(';');
      }
      this.triggerEvent('getFormValue', submitKeys);
      await sleep(0.3);
      const { parentCtx } = this.data;
      if (parentCtx) {
        submitData.pageNo = parentCtx.pageNo;
        submitData.token = getApp().Storage.get('token');
        submitData.openid = getApp().Storage.get('openid');
        const { system, model, version } = wx.getSystemInfoSync();
        submitData.ua = JSON.stringify({ system, model, version });
        submitKeys.map(item => {
          submitData.content.push({
            columnKey: parentCtx[item].formKey,
            columnName: parentCtx[item].label,
            columnValue: parentCtx[item].value,
          });
        });
      } else {
        return wx.showToast({
          title: '信息未填写完整',
          icon: 'none',
        });
      }
      console.warn('onSubmit submitData', content, submitData);
      wx.request({
        url: setUrl(content.apiUrl || '/fe/form/send'),
        data: submitData,
        method: 'POST',
        fail() {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
          });
        },
        success: res => {
          console.log(res.data);
          if (res.data.code === 200) {
            this.setData({
              resultShow: true,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            });
          }
        },
      });
    },
  },
});
