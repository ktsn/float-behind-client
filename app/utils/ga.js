import ga from 'google-analytics';

ga('create', process.env.GA_ID, 'auto');
ga('send', 'pageview');
