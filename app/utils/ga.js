import ga from 'google-analytics';

ga('create', process.env.GA_ID, process.env.NODE_ENV === 'production' ? 'auto' : { cookieDomain: 'none' });

export function pageView() {
  ga('send', 'pageview');
}

/**
 * Send status code and error message
 */
export function trackAjaxError(res) {
  const req = res.request;

  const endpoint = `${req.method} ${req.root}/${req.url}`;

  // Extract an error message from server
  // If there is no message in response data, use status code
  const message = res.data.error && res.data.error.message || res.status;

  ga('send', 'event', 'Ajax Error', endpoint, message);
}
