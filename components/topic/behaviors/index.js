import { genLink } from '../../../utils/util';
module.exports = Behavior({
  properties: {
    content: {
      type: Object,
      value: {},
    },
  },
  data: {
    errMsg: '',
    myBehaviorData: 'my-behavior-data',
  },
  created: function () {
    console.log('[my-behavior] created');
  },
  attached: function () {
    console.log('[my-behavior] attached');
  },
  ready: function () {
    console.log('[my-behavior] ready');
  },

  methods: {
    onFormValueChange(e) {
      console.warn('onFormValueChange', e.detail);
      const { content } = this.data;
      let errMsg = '';
      if (e.detail.value === '' && !!content.required) {
        errMsg = '此项为必填项';
      }
      if (!!e.detail.value && !!content.regExp) {
        errMsg = new RegExp(content.regExp).test(e.detail.value) ? '' : '填写格式错误';
      }
      this.setData({
        errMsg,
      });
    },
    myBehaviorMethod: function () {
      console.log('[my-behavior] log by myBehaviorMehtod');
    },
    onLinkClick(e) {
      const { opts } = e.currentTarget.dataset;
      console.log('[my-behavior]onLinkClick link', opts.link);
      genLink(opts.link, {
        images: [this.data.content.img || opts.img] || [],
      });
    },
  },
});
