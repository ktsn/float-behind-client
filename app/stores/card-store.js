import _ from 'lodash'
import axios from '../ajax'
import { trackAjaxError } from '../utils/ga'

export default {
  isPolling: false,
  maxId: 0,

  state: {
    cards: []
  },

  startPolling(interval) {
    this.isPolling = true
    this.polling(interval)
  },

  stopPolling() {
    this.isPolling = false
  },

  polling(interval) {
    if (!this.isPolling) {
      return
    }

    axios
      .get('/pages', {
        params: {
          sinceId: this.maxId
        }
      })
      .then((response) => {
        const cards = response.data.result

        if (cards.length > 0) {
          this.maxId = _.last(cards).id + 1
          this.state.cards = this.state.cards.concat(cards)
        }

        setTimeout(() => this.polling(interval), interval)
      })
      .catch((res) => {
        trackAjaxError(res)
        setTimeout(() => this.polling(interval), interval)
      })
  },

  remove(card) {
    axios.delete('/pages/' + card.id)
  }
}
