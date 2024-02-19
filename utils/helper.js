export function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          return resolve(res.code);
        }

        return reject();
      },
    });
  });
}
export function getTabBarInstance() {
  let page = getPageInstance();
  if (page) {
    return page.getTabBar();
  }
  return null;
}
export function getTabBarInstances() {
  let pages = getCurrentPages();
  let out = [];
  if (pages) {
    pages.forEach(page => {
      if (page.getTabBar()) {
        out.push(page.getTabBar());
      }
    });
  }
  return out;
}
export function getPageInstance(index = -1) {
  //获取页面的实例，默认是当前页面index=-1
  return getCurrentPages().slice(index)[0];
}
export function goBack() {
  wx.navigateBack({
    fail: function (e) {
      goPage({ url: '/pages/index/index' });
    },
  });
}
export function goPage(opts = { url, redirect: false }) {
  wx[opts.redirect ? 'redirectTo' : 'navigateTo']({
    url: opts.url,
    fail: function (e) {
      wx.switchTab({
        url: opts.url,
      });
    },
  });
}
export const getTrueLink = function (url) {
  return 'https://asset.dstory.fun' + url;
};
export function getUrl(path, options = {}) {
  //拼接path和options得到标准的url
  if (!/^\//.test(path)) {
    path = `/${path}`;
  }
  let params = ``;
  Object.keys(options).forEach((key, index) => {
    params += `${index === 0 ? '?' : '&'}${key}=${options[key]}`;
  });
  return path + params;
}
export default {
  getCode,
  goPage,
  getUrl,
  goBack,
  getTrueLink,
  getTabBarInstances,
  getTabBarInstance,
  getPageInstance,
};
