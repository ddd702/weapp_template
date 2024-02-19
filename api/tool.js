import request from '../utils/request';
/**
 * @description 再封装下request
 * @param {*} arg
 *
 */
export function req(arg) {
  const DEFAULT_OPTION = { tokenEnable: true, noToast: false, keepLogin: true };
  const { url, data, loading, option, method = 'post' } = arg;
  return new Promise((resolve, reject) => {
    loading &&
      wx.showLoading({
        mask: true,
      });
    request({
      url,
      data,
      method,
      option: Object.assign(DEFAULT_OPTION, option),
    })
      .then(res => {
        wx.hideLoading();
        resolve(res.data);
      })
      .catch(e => {
        wx.hideLoading();
        reject(e);
      });
  });
}
/**
 * ddd专用的mock
 * api.70read的mock
 */
export function reqMock(arg) {
  const { url, data, loading, option = { tokenEnable: false }, method = 'get' } = arg;
  return new Promise((resolve, reject) => {
    loading &&
      wx.showLoading({
        mask: true,
      });
    request({
      url: `https://api.zcxnb.cn/front/resource/get?code=${url}`,
      data,
      method,
      option,
    })
      .then(res => {
        let out = {};
        try {
          out = JSON.parse(res.data.data);
        } catch (error) {}
        console.log('reqMock req', out);
        // res.data = JSON.parse(res.data.data);
        resolve(out.data);
      })
      .catch(reject)
      .finally(() => wx.hideLoading());
  });
}
