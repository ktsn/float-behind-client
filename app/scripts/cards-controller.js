'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Cards from './cards';
import CardView from './card-view';
import Native from './native';

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
        let $anchor = $(event.currentTarget).find('a');
        Native.requestPreviewCard($anchor.attr('href'));
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
  cards.startPolling(50000);

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
