import isWeChatClient from '../isWeChatClient';

describe('isWeChatClient', () => {
  it('return false in Chrome userAgent', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get() {
        return 'Google Chrome Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36.';
      },
    });

    expect(isWeChatClient()).toStrictEqual(false);
  });

  it('return true in MicroMessenger userAgent', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get() {
        return 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92 MicroMessenger/6.7.4(0x1607042c) NetType/4G Language/zh_CN';
      },
    });

    expect(isWeChatClient()).toStrictEqual(true);
  });
});
