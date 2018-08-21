import createBodyClickListener from './body-click-listener'

// const EVENT_LIST = ['click', 'contextmenu', 'keydown']

export default {
  name: 'context-menu',
  props: {
    id: {
      type: String,
      default: 'default-ctx'
    }
  },
  data() {
    return {
      locals: {},
      align: 'left',
      ctxTop: 0,
      ctxLeft: 0,
      ctxVisible: false,
      ctxHeight: 0, //右键菜单的高度
      parentTarght: null, //父级元素
      bodyClickListener: createBodyClickListener(
        (e) => {
          if (e instanceof KeyboardEvent && e.keyCode === 27) {
            this.ctxVisible = false
            this.$emit('ctx-cancel', this.locals)
            return
          }
          let isOpen = !!this.ctxVisible
          let outsideClick = isOpen && !this.$el.contains(e.target)

          if (outsideClick) {
            if (e.which !== 1 && e.which !== 3) {
              e.preventDefault()
              // e.stopPropagation()
              return false;
            } else {
              this.ctxVisible = false
              this.$emit('ctx-cancel', this.locals)
              // e.stopPropagation()
            }
          } else {
            this.ctxVisible = false
            this.$emit('ctx-close', this.locals)
          }
        }
      )
    }
  },
  methods: {

    /*
     * this function handles some cross-browser compat issues
     * thanks to https://github.com/callmenick/Custom-Context-Menu
     */
    setPositionFromEvent(e) {
      e = e || window.event

      const scrollingElement = document.scrollingElement || document.documentElement

      if (e.pageX || e.pageY) {
        this.ctxLeft = e.pageX
        this.ctxTop = e.pageY - scrollingElement.scrollTop
      } else if (e.clientX || e.clientY) {
        this.ctxLeft = e.clientX + scrollingElement.scrollLeft
        this.ctxTop = e.clientY + scrollingElement.scrollTop
      }
      this.parentTarght = e.relatedTarget

      this.$nextTick(() => {
        const marginButton = 15
        const menu = this.$el
        const minHeight = (menu.style.minHeight || menu.style.height).replace('px', '') || 0
        const minWidth = (menu.style.minWidth || menu.style.width).replace('px', '') || 0
        const scrollHeight = this.$children.length > 0 ? this.$children.length * this.$children[0].$el.scrollHeight : minHeight
        const scrollWidth = menu.scrollWidth || minWidth

        const largestHeight = document.body.clientHeight - scrollHeight - marginButton;
        const largestWidth = document.body.clientWidth - scrollWidth - marginButton;

        if (largestHeight < 100) {
          this.ctxTop = 100
          this.ctxHeight = document.body.clientHeight - marginButton - 100
        } else if (this.ctxTop > largestHeight) {
          this.ctxTop = largestHeight;
          this.ctxHeight = scrollHeight
        } else {
          this.ctxHeight = scrollHeight
        }
        if (this.ctxLeft > largestWidth) {
          if (this.parentTarght) {
            let parentLeft = 0
            parentLeft = this.parentTarght.offsetParent.offsetParent.offsetParent.offsetLeft
            this.ctxLeft = parentLeft - scrollWidth;
          } else {
            this.ctxLeft = largestWidth
          }
        }
      })
      return e
    },

    open(e, data) {
      if (this.ctxVisible) this.ctxVisible = false
      if (this.$children.length <= 0) {
        return
      }
      this.ctxVisible = true
      this.$emit('ctx-open', this.locals = data || {})
      this.setPositionFromEvent(e)
      this.$el.setAttribute('tab-index', -1)
      this.bodyClickListener.start()
      return this
    }
  },
  watch: {
    ctxVisible(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.bodyClickListener.stop((e) => {
          // console.log('context menu sequence finished', e)
          // this.locals = {}
        })
      }
    }
  },
  computed: {
    ctxStyle() {
      return {
        'display': this.ctxVisible ? 'block' : 'none',
        'top': (this.ctxTop || 0) + 'px',
        'left': (this.ctxLeft || 0) + 'px'
      }
    }
  }
}
