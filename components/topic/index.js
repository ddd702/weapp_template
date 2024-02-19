// index.js
import { getTopic } from '../../api/index';
const loadingmoreBehavior = require('../../behaviors/pagination');

Component({
  behaviors: [loadingmoreBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    pageNo: {
      type: String,
      default: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    errMsg: '',
    formCtx: null,
    formCtxTemp: null,
    smsCodeNeed: {
      //form-sms-code要获取的第三方组件内容
      phone: '',
    },
  },
  observers: {
    pageNo: function (val) {
      this.fetchData();
    },
  },
  attached() {
    console.$t = this;
    // this.fetchData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getFormValue(e) {
      //帮助子组件获取其他表单的值
      const { formCtxTemp } = this.data;
      const tempObj = Object.assign({}, formCtxTemp);
      let errToast = '';
      const silent = e.detail.length === 1;
      e.detail.map(item => {
        const target = this.selectComponent(`#fitem-${item}`);
        const targetData = target.data;
        // console.warn('targetData.required&&!!!targetData.formValue',(targetData.content.required&&!targetData.formValue))
        if (targetData.content.required && !!!targetData.formValue && !silent) {
          target.setData({ errMsg: '此项为必填项' });
          errToast = '信息未填写完整';
        }
        tempObj[item] = {
          formKey: targetData.content.formKey,
          label: targetData.content.label,
          value: targetData.formValue || '',
          required: targetData.content.required,
        };
      });
      if (!errToast) {
        this.setData({
          formCtx: {
            pageNo: this.data.pageNo,
            ...tempObj,
          },
          formCtxTemp: {
            pageNo: this.data.pageNo,
            ...tempObj,
          },
        });
      } else {
        this.setData({
          formCtxTemp: {
            pageNo: this.data.pageNo,
            ...tempObj,
          },
          formCtx: null,
        });
      }
    },
    async fetchData() {
      this.setLoadingmoreDoing();
      const res = await getTopic({
        pageid: this.data.pageNo,
      }).catch(err => {
        this.setData({
          errMsg: err.msg,
        });
        this.resetLoadingmore();
      });
      if (!res) {
        return;
      }
      if (!res.config) {
        res.config = {};
      } else {
        try {
          res.config = JSON.parse(res.config);
        } catch (error) {}
      }
      this.setData(
        {
          config: Object.assign(
            {},
            {
              // 默认的公共配置
              title: '',
              bg: '#ffffff',
              bgImg: '',
              color: '#000000',
              datas: [],
              cover: res.cover,
            },
            res.config,
          ),
          layout: JSON.parse(res.layout.content),
        },
        () => {
          const { config } = this.data;
          this.triggerEvent('topicCb', config);
        },
      );
    },
    onSmsCodeRequest(e) {
      // console.warn('onSmsCodeRequest', e.detail);
      const targetCtx = this.selectComponent(`#fitem-${e.detail}`);
      // console.warn('targetCtx',targetCtx.data.formValue)
      this.setData({
        smsCodeNeed: {
          phone: targetCtx.data.formValue,
        },
      });
    },
  },
});
