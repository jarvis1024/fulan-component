function isWeChatClient(): boolean {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
}

export default isWeChatClient;
