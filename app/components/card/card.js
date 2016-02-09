import './card.scss';
import template from './card.html';
import cardStore from '../../stores/card-store';
import * as Behavior from './card-behavior';
import format from '../../filters/format';

const velocitySeed = 20;

export default {
  template,

  props: ['card'],

  data() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      removed: false
    };
  },

  created() {
    this.createdAt = performance.now();

    this.init();
    this.behavior = Behavior.initialBehavior;

    // store mouse position to detect offset during drag
    this.mouse = {
      x: 0,
      y: 0
    };
  },

  ready() {
    this.width = this.$el.offsetWidth;
    this.height = this.$el.offsetHeight;

    const update = (time) => {
      if (this.removed) return;
      this.behavior(this, time);
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  methods: {
    init() {
      const angle = 2 * Math.random() * Math.PI;
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);

      // calculate velocity
      // the size of velocity should always be same value
      this.vx = velocitySeed * cos;
      this.vy = velocitySeed * sin;

      // calculate position
      const xc = this.$parent.width / 2;
      const yc = this.$parent.height / 2;

      // scale sin(angle) and cos(angle) to put card out of wrapper
      const scale = Math.max(Math.abs(sin), Math.abs(cos));
      sin = sin / scale;
      cos = cos / scale;

      // set position against velocity direction
      this.x = xc - xc * cos;
      this.y = yc - yc * sin;
    },

    remove() {
      cardStore.remove(this.card);
      this.removed = true;
    },

    dragStart(x, y) {
      this.behavior = Behavior.noBehavior;

      this.mouse.x = x;
      this.mouse.y = y;
    },

    dragMove(x, y) {
      this.vx = x - this.mouse.x;
      this.vy = y - this.mouse.y;

      this.mouse.x = x;
      this.mouse.y = y;

      this.x += this.vx;
      this.y += this.vy;
    },

    dragEnd() {
      this.behavior = Behavior.thrownBehavior;
    },

    detectTransformStyle() {
      return `translate3d(${this.x}px, ${this.y}px, 0)`;
    },

    onMouseDown(event) {
      this.$dispatch('mouseDownCard', event, this);
    }
  },

  filters: { format }
};
