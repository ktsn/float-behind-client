'use strict';

import $ from 'jquery';
import Cards from './cards';
import CardViewWrapper from './card-view-wrapper';

const pollingInterval = 60000;

export default function cardsController() {
  let wrapper = new CardViewWrapper('#app');

  // Fetch cards from server
  let cards = new Cards();
  cards.startPolling(pollingInterval);

  cards.on('fetch', (cards) => {
    wrapper.addCards(cards);
  });

  wrapper.on('remove', (cardData) => {
    cards.remove(cardData.id);
  });

  // Animation
  requestAnimationFrame(animate);
  function animate(timestamp) {
    wrapper.update(timestamp);
    requestAnimationFrame(animate);
  }
}
