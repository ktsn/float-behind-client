'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Cards from './cards';
import CardView from './card-view';
import Native from './native';

const pollingInterval = 60000;

export default function cardsController() {
  let $wrapper = $('#app');

  let drag = {
    target: null,
    moved: false
  };
  $wrapper.on('mousedown', '.js-card', (event) => {
    drag.target = $(event.currentTarget).data('obj');
    drag.target.dragStart(event);
    drag.moved = false;
  });
  $wrapper.on({
    mousemove: (event) => {
      if (drag.target) {
        drag.target.dragMove(event);
        drag.moved = true;
      }
    },
    mouseup: (event) => {
      if (drag.target && drag.moved) {
        drag.target.dragEnd(event);
      } else {
        Native.requestPreviewCard(drag.target.data.url);
      }

      drag.target = null;
      drag.moved = false;
    },
    click: (event) => {
      event.preventDefault();
    }
  });

  // Fetch cards from server
  let cards = new Cards();
  cards.startPolling(pollingInterval);

  let views = [];

  cards.on('fetch', (cards) => {
    let cs = _.map(cards, (c) => new CardView(c, $wrapper));
    _.forEach(cs, (c) => $wrapper.append(c.$el));

    views = views.concat(cs);
  });

  // Animation
  requestAnimationFrame(animate);
  function animate(timestamp) {
    _.forEach(views, (v) => v.update(timestamp));
    requestAnimationFrame(animate);
  }
}
