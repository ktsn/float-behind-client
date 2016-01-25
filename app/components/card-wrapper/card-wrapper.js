'use strict';

import './card-wrapper.scss';
import template from './card-wrapper.html';
import card from '../card/card';
import cardStore from '../../stores/card-store';
import Native from '../../utils/native';
import {getAbsolutePosition} from '../../utils/position';

const pollingInterval = 60000;

export default {
  template,

  data() {
    return cardStore.state;
  },

  created() {
    // the data for storing dragging component
    this.drag = {
      target: null,
      moved: false
    };
  },

  ready() {
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;

    cardStore.startPolling(pollingInterval);
  },

  methods: {
    dragStart(cardVM, x, y) {
      cardVM.dragStart(x, y);
    },

    dragMove(cardVM, x, y) {
      cardVM.dragMove(x, y);
    },

    dragEnd(cardVM, moved) {
      if (moved) {
        cardVM.dragEnd();
      } else {
        Native.requestPreviewCard(cardVM.card.url);
      }
    },

    onMouseMove(event) {
      if (this.drag.target === null) {
        return;
      }
      this.drag.moved = true;

      // detect mouse position
      const elPosition = getAbsolutePosition(this.$el);
      const x = event.pageX - elPosition.x;
      const y = event.pageY - elPosition.y;

      this.dragMove(this.drag.target, x, y);
    },

    onMouseUp(event) {
      if (this.drag.target === null) {
        return;
      }

      this.dragEnd(this.drag.target, this.drag.moved);

      this.drag.target = null;
      this.drag.moved = false;
    }
  },

  events: {
    mouseDownCard(cardVM) {
      // detect mouse position
      const elPosition = getAbsolutePosition(this.$el);
      const x = event.pageX - elPosition.x;
      const y = event.pageY - elPosition.y;

      this.drag.target = cardVM;
      this.drag.moved = false;
      this.dragStart(cardVM, x, y);
    }
  },

  components: { card }
};
