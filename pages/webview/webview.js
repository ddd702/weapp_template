Page({
  data: {
    url: '',
  },
  onLoad: function (options) {
    if (options.url) {
      this.setData({ url: decodeURIComponent(options.url) });
    }
  },
  onShareAppMessage: function () {
    return {
      path: `/pages/webview/webview?url=${this.data.url}`,
    };
  },
});
