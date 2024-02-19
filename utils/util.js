import Config, { table } from '../config';
import { JSEncrypt } from 'wxmp-rsa';
/**
 * 封装七牛云图片的操作(默认会压缩质量到80以及使用webp格式)
 *
 * 更多params参数请参考七牛云官方文档
 * https://developer.qiniu.com/dora/api/1270/the-advanced-treatment-of-images-imagemogr2#imagemogr2-thumbnail-spec
 */
const getQnImg = function (url, params = [], keepParams = true) {
  //七牛云
  if (!url) return '';
  let result = ['?imageMogr2', 'interlace', '1'];
  // 处理原始阿里云参数
  if (keepParams) {
    const origin = (url.match(/imageView2([\/\w,]+)/) || [])[1];
    if (origin) {
      result = result.concat(origin.substr(1).split('/'));
    }
  }
  // 处理调用者的参数
  result = result.concat(params);
  // 处理缺省的参数
  const temp = result.join('/');
  // 是否gif图片
  const isGif = /\.gif/.test(url);
  if (!/quality\//i.test(temp) && !isGif) {
    //没有设置质量, 那么默认给80, 但gif图片不设置, 不然就不动了
    result.push('quality');
    result.push('80');
  }
  // if(!/format/i.test(temp) && !isGif && isSupportWebp){
  //     //如果没有设置格式,同时支持webp格式, 那么用webp
  //     result.push('format')
  //     result.push('webp')
  // }
  return url.replace(/\?.*/, '') + (result.length > 1 ? result.join('/') : '');
};
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const validator = {
  // 手机号校验
  checkPhone(input) {
    return /^1[3-9]\d{9}$/.test(input);
  },
  // 身份证校验
  checkIDCard(input) {
    return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(input);
  },
  checkPasswd(input) {
    return /^[a-zA-Z0-9_]{6,20}$/.test(input);
  },
  checkOnlyChinese(input) {
    return /^[\u4e00-\u9fa5]+$/.test(input);
  },
  checkLegalPersonName(input) {
    return /^[\u4e00-\u9fa5·]+$/.test(input);
  },
  checkOnlyEngAndNum(input) {
    return /^[a-zA-Z0-9]+$/.test(input);
  },
  checkOnlyCnEnNum(input) {
    return /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(input);
  },
  checkPrice(input) {
    if (input == 0) return false;
    if (Number.isNaN(Number(input))) return false;

    return /^\d+(.\d{1,2})?$/.test(input);
  },
  checkTrueName(input) {
    //验证姓名
    return /^([\u4e00-\u9fa5\·|a-zA-Z\.]{1,30})$/.test(input);
  },
  checkAddress(input) {
    return input.length <= 30 && input.length >= 3 && replaceBlank(input).length >= 1;
  },
  checkAdjustPrice(input) {
    // if (String(input).length > 9) return false;
    // return /^\d+\.?\d*$/.test(input); //判断数字(可能为小数)
    return String(input).length <= 9 && /^\d+\.?\d*$/.test(input);
  },
  checkEmail(input) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(input);
  },
  checkTaxNo(input) {
    //检验税号
    return /^[a-zA-Z0-9]{0,25}$/.test(input);
  },
  checkKgInput(input) {
    //校验kg单位的输入
    if (!input) {
      return false;
    }
    if (!Number(input)) {
      return false;
    }
    let gInput = Number(input * 1000); //装换为g单位
    return gInput - parseInt(gInput) === 0;
  },
};

const maskPhone = phone => phone.substr(0, 3) + '****' + phone.substr(7);

const padNumber = n => String(n).padStart(2, 0);

function formatCountdown(countdown) {
  const hour = Math.floor(countdown / (60 * 60 * 1000));
  const min = Math.floor((countdown - hour * 60 * 60 * 1000) / (60 * 1000));
  const sec = Math.floor((countdown - hour * 60 * 60 * 1000 - min * 60 * 1000) / 1000);
  return `${padNumber(hour)}:${padNumber(min)}:${padNumber(sec)}`;
}

/**
 *
 * @param {Number} duration 倒计时总时长, 单位: 微秒
 * @param {Function} update 更新回调函数, 第一个参数为格式化的时分秒, 第二个为timer, 可以主动关掉定时器, 防止内存泄漏
 * @param {Function} complete 完成回调函数
 */
function countdown(duration, update, complete) {
  let n = Number(duration);
  console.log('@countdown duration => ', n);

  let timer = null;
  const fn = () => {
    n -= 1000;

    if (n >= 0) return update(formatCountdown(n), timer);

    if (timer) clearInterval(timer);
    complete();
  };

  fn();
  timer = setInterval(fn, 1000);
}

/**
 *
 * @param {Object} obj 目标对象
 * @returns &拼接的字符串
 */
const qs = obj =>
  Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

function encryptData(data) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(table[Config.current].RSAPublicKey);
  return encrypt.encryptLong(data);
}

function decryptEPay(data) {
  var decrypt = new JSEncrypt();
  decrypt.setPrivateKey(table[Config.current].ePayKey);
  var uncrypted = decrypt.decrypt(data);
  return uncrypted;
}

function sleep(num) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), num * 1000);
  });
}
function replaceBlank(input) {
  //去掉所有空格
  return input ? input.replace(/\s+/g, '') : '';
}
function rpxToPx(num) {
  const deviceWidth = wx.getSystemInfoSync().windowWidth;
  return (deviceWidth / 750) * Number(num);
}
function genLink(inputLink, content = { images: [] }) {
  let link = inputLink || null;
  if (!link) {
    return;
  }
  console.warn('inputLink:', link);
  let url = link.mpPath || link.path;
  switch (link.type) {
    case 'topic':
      url = `/pages/topic/index?id=${link.pageid}`;
      if (link.params) {
        url += '&' + link.params;
      }
      break;
    case 'home':
      url = '/pages/index/index';
      break;
    case 'diy':
      // url = link.path
      if (url === 'viewpic') {
        wx.previewImage({
          urls: content.images || [],
          current: 0,
        });
        url = '';
      }

      break;

    default:
      break;
  }
  if (url) {
    wx.navigateTo({
      url,
    });
  }
}
function byteConvert(bytes, j = 0) {
  if (bytes < 1000 && !j) return bytes + 'B';
  const k = 1024; // 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  if (j) {
    i = j;
    return parseFloat((bytes / Math.pow(k, i)).toPrecision()).toFixed(2);
  } else {
    i = Math.floor(Math.log(bytes) / Math.log(k));
  }
  return parseFloat((bytes / Math.pow(k, i)).toPrecision()).toFixed(2) + ' ' + sizes[i];
}
export {
  validator,
  byteConvert,
  getQnImg,
  rpxToPx,
  formatTime,
  maskPhone,
  countdown,
  qs,
  encryptData,
  decryptEPay,
  sleep,
  replaceBlank,
  genLink,
};

exports.default = {
  validator,
  byteConvert,
  getQnImg,
  rpxToPx,
  formatTime,
  maskPhone,
  countdown,
  qs,
  encryptData,
  sleep,
  replaceBlank,
  genLink,
};
