import React from 'react';
import { mount } from 'enzyme';
import URL from 'url';
import qs from 'querystring';
import WxAuth, { AuthScope } from './WxAuth';

describe('<WxAuth />', () => {
  const appid = 'APPID';

  it('should redirect correctly', () => {
    const state = 'FAKE STATE';
    const prepare = jest.fn(() => state);
    const callback = jest.fn();
    const originAssign = window.location.assign;
    window.location.assign = jest.fn(redirectUri => {
      const url = URL.parse(redirectUri);
      const query = qs.parse(url.query || '');
      expect(query.state).toBe(state);
      expect(query.appid).toBe(appid);
      expect(query.scope).toBe(AuthScope.Base);
      expect(query.redirect_uri).toBe(window.location.href.split('#')[0]);
    });

    const wrapper = mount(
      <WxAuth appid={appid} onPrepare={prepare} callback={callback}>
        <div id="not-render">{"Don't render me."}</div>
      </WxAuth>,
    );

    expect(wrapper.exists('#not-render')).toBe(false);
    expect(prepare).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(window.location.assign).toHaveBeenCalled();

    window.location.assign = originAssign;
    wrapper.unmount();
  });

  it('should handle callback', () => {
    const state = '#STATE';
    const code = 'CODE';

    const originWindow = window;
    const mockLocationSearch = `?${qs.stringify({ code, state })}`;
    Object.defineProperty(global, 'window', {
      writable: true,
      value: Object.create(window),
    });
    Object.defineProperty(window, 'location', {
      value: {
        search: mockLocationSearch,
        hash: '',
        href: window.location.href + mockLocationSearch,
        assign: jest.fn(),
      },
    });
    const callback = jest.fn();
    const prepare = jest.fn();

    const wrapper = mount(
      <WxAuth appid={appid} callback={callback} onPrepare={prepare}>
        <div id="do-render">{'Render me.'}</div>
      </WxAuth>,
    );

    expect(wrapper.state('state')).toBe(state);
    expect(wrapper.state('code')).toBe(code);
    expect(callback).toHaveBeenCalled();
    expect(wrapper.state('done')).toBe(true);
    expect(wrapper.exists('#do-render')).toBe(true);
    expect(window.location.assign).not.toHaveBeenCalled();
    expect(prepare).not.toHaveBeenCalled();

    Object.defineProperty(global, 'window', {
      writable: true,
      value: originWindow,
    });
    wrapper.unmount();
  });
});
