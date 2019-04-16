import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import qs, { ParsedUrlQueryInput } from 'querystring';
import URL from 'url';
import isWeChatClient from '../utils/isWeChatClient';

export enum AuthScope {
  Base = 'snsapi_base',
  UserInfo = 'snsapi_userinfo',
}

type Code = string | null;

type WxAuthCache = {
  get(): Code;
  set(code: Code): void;
};

const defaultCache: WxAuthCache = {
  get() {
    return sessionStorage.getItem('WX_AUTH_CODE') as Code;
  },
  set(code: Code) {
    sessionStorage.setItem('WX_AUTH_CODE', code as string);
  },
};

const defaultPrepare = (): string => {
  return window.location.hash;
};

const defaultSuccess = ({ state }: CallbackParams) => {
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

interface CallbackParams extends ParsedUrlQueryInput {
  code: Code;
  state: string | null;
}

export interface WxAuthProps {
  appid: string;
  redirectUrl: string;
  scope: AuthScope;
  cache: WxAuthCache;
  onPrepare: () => Code | Promise<Code> | void;
  onSuccess: (obj: CallbackParams) => Promise<void> | void;
}

interface WxAuthState {
  code: string | null;
  state: string | null;
  done: boolean;
}

class WxAuth extends Component<WxAuthProps, WxAuthState> {
  static propTypes = {
    appid: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string.isRequired,
    scope: PropTypes.string,
    cache: PropTypes.shape({ get: PropTypes.func, set: PropTypes.func }),
    onPrepare: PropTypes.func,
    onSuccess: PropTypes.func,
  };

  static defaultProps = {
    scope: AuthScope.Base,
    cache: defaultCache,
    onPrepare: defaultPrepare,
    onSuccess: defaultSuccess,
  };

  static getDerivedStateFromProps(nextProps: WxAuthProps, state: WxAuthState) {
    if (!state.code) {
      const cacheCode = nextProps.cache.get();
      if (cacheCode) {
        return { code: cacheCode };
      }

      if (window.location.search) {
        const cbParams = qs.parse(window.location.search.substr(1));

        if (cbParams.code) {
          return { code: cbParams.code, state: cbParams.state };
        }
      }
    }

    return null;
  }

  state = {
    code: null,
    state: null,
    done: false,
  };

  async componentDidMount() {
    if (!isWeChatClient()) return;

    const { state, code, done } = this.state;
    const { appid, redirectUrl, scope, onPrepare, onSuccess } = this.props;

    const propUrl = URL.parse(redirectUrl);
    propUrl.hash = undefined;
    propUrl.search = undefined;

    const { hostname, pathname } = URL.parse(window.location.href);
    const isRedirectUrl = hostname === propUrl.host && pathname == propUrl.pathname;

    if (!code) {
      const redirect_uri = URL.format(propUrl);
      const redirectParams: RedirectParams = {
        appid,
        scope,
        redirect_uri,
      };

      let redirectState = onPrepare();
      if (redirectState instanceof Promise) {
        redirectState = await redirectState;
      }
      if (typeof redirectState === 'string') {
        redirectParams.state = redirectState;
      }

      window.location.href = `https://https://open.weixin.qq.com/connect/oauth2/authorize?${qs.stringify(
        redirectParams,
      )}`;
    } else if (isRedirectUrl && !done) {
      const success = onSuccess({ state, code });
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

    return typeof children === 'function' ? children({ state, code }) : children;
  }
}

export default WxAuth;
