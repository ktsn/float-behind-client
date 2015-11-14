'use strict';

import Fetcher from './scripts/fetcher';

let f = new Fetcher();
f.startPolling(5000);
f.on('fetch', (data) => {
  
});
