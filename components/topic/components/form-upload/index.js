// index.js
import { setUrl } from '../../../../utils/tool';

const topicBehaviour = require('../../behaviors/index');
Component({
  behaviors: [topicBehaviour],
  /**
   * 组件的初始数据
   */
  data: {
    formValue: '',
    fileList: [],
    // qnImg: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    viewFile(e) {
      const { fileList } = this.data;
      const { index } = e.currentTarget.dataset;
      wx.previewImage({ urls: fileList, current: fileList[index] });
    },
    delFile(e) {
      let { fileList, formValue } = this.data;
      const { index } = e.currentTarget.dataset;
      fileList.splice(index, 1);
      formValue = fileList.join(',');
      this.setData({
        fileList,
        formValue,
      });
    },
    beforeRead(event) {
      const { file, callback } = event.detail;
      callback(file.type === 'image');
    },
    async afterRead(event) {
      console.log(event);
      wx.uploadFile({
        url: setUrl('/fe/upload'),
        filePath: event.detail.file.url,
        name: 'file',
        formData: {
          token: getApp().Storage.get('token'),
        },
        success: res => {
          const url = setUrl(JSON.parse(res.data).data.url);
          let { fileList, formValue } = this.data;
          fileList.push(url);
          formValue = fileList.join(',');
          this.setData({
            fileList,
            formValue,
          });
        },
      });
    },
  },
});
