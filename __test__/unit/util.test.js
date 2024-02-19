import { validator, maskPhone, replaceBlank, decryptEPay } from '../../utils/util';

describe('Test validator checkPrice', () => {
  test('大于0的正整数', () => {
    expect(validator.checkPrice(0)).toBe(false);
    expect(validator.checkPrice('-102')).toBe(false);
    expect(validator.checkPrice('102')).toBe(true);
  });

  test('小数点最大位数为两位', () => {
    expect(validator.checkPrice('102.')).toBe(false);
    expect(validator.checkPrice('102.1')).toBe(true);
    expect(validator.checkPrice('102.12')).toBe(true);
    expect(validator.checkPrice('102.223')).toBe(false);
  });

  test('数字中不能包含字符(除了.之外)', () => {
    expect(validator.checkPrice('sdf')).toBe(false);
    expect(validator.checkPrice('1sdf.223')).toBe(false);
  });

  test('input可以用number或者string类型', () => {
    expect(validator.checkPrice(123)).toBe(true);
    expect(validator.checkPrice('123')).toBe(true);
  });
});

describe('Test validator checkAdjustPrice', () => {
  test('一口价调价', () => {
    expect(validator.checkAdjustPrice(102)).toBe(true);
    expect(validator.checkAdjustPrice(0.11)).toBe(true);
    expect(validator.checkAdjustPrice(11.234)).toBe(true);
    expect(validator.checkAdjustPrice('0$11')).toBe(false);
    expect(validator.checkAdjustPrice(123456789123456789)).toBe(false);
  });
});

describe('Test maskPhone', () => {
  test('normal case', () => {
    expect(maskPhone('13800138000')).toBe('138****8000');
  });
});

describe('encrypt/decrypt', () => {
  test('易宝加密解密', () => {
    let got = decryptEPay('APy9Xr3ZEI0iFnMNVvbVUgyPSKU1K+u+VgtJPyF2rlYj5lko7EVkiE1RcvJQZQiJPHdfg0EmsBuqmxIMZYINDHc=');
    console.log('watch ', got);
    expect(got).toBe('220505079410603');
  });
});
describe('Test replaceBlank', () => {
  test('normal case', () => {
    expect(replaceBlank('138 00 138 000')).toBe('13800138000');
  });
});
describe('Test validator checkKgInput', () => {
  test('错误格式的数字', () => {
    expect(validator.checkKgInput('138.19122')).toBe(false);
  });
  test('错误的数字类型', () => {
    expect(validator.checkKgInput('1243ddd')).toBe(false);
  });
  test('错误的数字1', () => {
    expect(validator.checkKgInput('0')).toBe(false);
  });
  test('正确的数字1', () => {
    expect(validator.checkKgInput('1234')).toBe(true);
  });
  test('正确的数字2', () => {
    expect(validator.checkKgInput('1.123')).toBe(true);
  });
  test('正确的数字3', () => {
    expect(validator.checkKgInput('1234.1')).toBe(true);
  });
});

describe('Test checkAddress', () => {
  test('normal case', () => {
    expect(validator.checkAddress('1 1')).toBe(true);
  });
  test('normal case1', () => {
    expect(validator.checkAddress('大尽快接单1 1')).toBe(true);
  });
  test('normal case1', () => {
    expect(validator.checkAddress(' 1')).toBe(false);
  });
});
