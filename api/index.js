/**
 * @description 全局接口相关
 */
import { req, reqMock } from './tool';
export function updateUserInfo(data, opts) {
  return req({
    url: '/front/wx/user/update',
    data,
    ...opts,
  });
}
/**
 * 获取acg列表
 * */
export function getVipAcg(data, opts) {
  return req({
    method: 'GET',
    url: '/ajax/acg/getlist',
    data,
    ...opts,
  });
}
/**
 * 获取topic数据
 * https://api.70read.com/static/apidoc/index.html#api-Front-TopicGet
 * /front/topic/get
 */
export function getTopic(data, opts) {
  opts = Object.assign({ option: { tokenEnable: false, noToast: true } }, opts);
  return req({
    method: 'GET',
    url: '/front/topic/get?authorid=1',
    data,
    ...opts,
  });
}

/**
 * 获取资源位
 * /front/resource/get
 **/
export function getDataByCode(data, opts) {
  opts = Object.assign({ option: { tokenEnable: false } }, opts);
  return req({
    method: 'GET',
    url: '/front/resource/get?authorid=1',
    data,
    ...opts,
  });
}

