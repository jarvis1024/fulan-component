/* eslint-disable camelcase,@typescript-eslint/camelcase */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import qs, { ParsedUrlQueryInput } from 'querystring';
import URL from 'url';
import isWeChatClient from '../utils/isWeChatClient';

export enum AuthScope {
  Base = 'snsapi_base',
  UserInfo = 'snsapi_userinfo',
}

type Code = string;

interface WxAuthCache {
  get(): Code;
  set(code: Code): void;
}

const defaultCache: WxAuthCache = {
  get() {
    return sessionStorage.getItem('WX_AUTH_CODE') as Code;
  },
  set(code: Code) {
    sessionStorage.setItem('WX_AUTH_CODE', code);
  },
};

const defaultPrepare = (): string => {
  return window.location.hash;
};

const defaultCallback = ({ state }: CallbackParams): void => {
  if (state && state.indexOf('#') === 0) {
    window.location.hash = state;
  }
};

interface RedirectParams extends ParsedUrlQueryInput {
  appid: string;
  scope: AuthScope;
  redirect_uri: string;
  state?: string;
}

interface CallbackParams {
  code: Code;
  state: string | null;
}

type WxAuthFuncChildren = (state: WxAuthState) => React.ReactNode;

export interface WxAuthProps {
  appid: string;
  redirectUrl?: string;
  scope: AuthScope;
  cache: WxAuthCache;
  children: WxAuthFuncChildren | React.ReactNode;
  onPrepare(): Promise<string | void> | string | void;
  callback(obj: CallbackParams): Promise<void> | void;
}

interface WxAuthState {
  code: string | null;
  state: string | null;
  done: boolean;
}

class WxAuth extends React.Component<WxAuthProps, WxAuthState> {
  public static propTypes = {
    appid: PropTypes.string.isRequired,
    cache: PropTypes.shape({ get: PropTypes.func, set: PropTypes.func }),
    callback: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onPrepare: PropTypes.func,
    redirectUrl: PropTypes.string,
    scope: PropTypes.oneOf([AuthScope.Base, AuthScope.UserInfo]),
  };

  public static defaultProps = {
    scope: AuthScope.Base,
    cache: defaultCache,
    onPrepare: () => {},
    callback: defaultCallback,
  };

  public constructor(props: WxAuthProps) {
    super(props);
    const cacheCode = props.cache.get();
    const cbParams = qs.parse(window.location.search.substr(1));

    this.state = {
      code: cacheCode || Array.isArray(cbParams.code) ? cbParams.code[0] : cbParams.code || null,
      state: Array.isArray(cbParams.state) ? cbParams.state[0] : cbParams.state || null,
      done: false,
    };
  }

  public async componentDidMount() {
    if (!isWeChatClient()) return;

    const { state, code, done } = this.state;
    const { appid, redirectUrl, scope, onPrepare, callback } = this.props;

    const propUrl = URL.parse(redirectUrl || window.location.href.split('#')[0]);
    propUrl.hash = undefined;
    propUrl.search = undefined;

    const { hostname, pathname } = URL.parse(window.location.href);
    const isRedirectUrl = hostname === propUrl.host && pathname === propUrl.pathname;

    if (!code) {
      const redirectParams: RedirectParams = {
        appid,
        scope,
        redirect_uri: URL.format(propUrl),
      };

      let redirectState = onPrepare();
      if (redirectState instanceof Promise) {
        redirectState = await redirectState;
      }
      redirectState = redirectState || defaultPrepare();
      if (typeof redirectState === 'string') {
        redirectParams.state = redirectState;
      }

      const query = qs.stringify(redirectParams);
      window.location.assign(
        `https://https://open.weixin.qq.com/connect/oauth2/authorize?${query}`,
      );
    } else if (isRedirectUrl && !done) {
      const success = callback({ state, code });
      if (success instanceof Promise) {
        await success;
      }

      this.setState({ done: true });
    }
  }

  public render() {
    const { state, code, done } = this.state;
    const { children } = this.props;

    if (!code || !done) return null;

    return typeof children === 'function'
      ? (children as WxAuthFuncChildren)({ state, code, done })
      : children;
  }
}

export default WxAuth;
