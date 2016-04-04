import ga from 'google-analytics';

ga('create', process.env.GA_ID, process.env.NODE_ENV === 'production' ? 'auto' : { cookieDomain: 'none' });

export function pageView() {
  ga('send', 'pageview');
}

/**
 * Send status code and error message
 */
export function trackAjaxError(status, err) {
  ga('send', 'event', 'Ajax Response', status, err.message);
}
