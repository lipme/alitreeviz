export const displayParameters = {
  props: {
    showParameters: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { displayParametersProxy: null }
  },
  computed: {
    displayParameters: {
      get: function () {
        return this.displayParametersProxy == null
          ? this.showParameters
          : this.displayParametersProxy
      },
      set: function (newValue) {
        this.displayParametersProxy = newValue
        if (newValue === false) {
          this.$emit('hideParameters')
        }
      }
    }
  },
  watch: {
    showParameters () {
      this.displayParametersProxy = null
    }
  },
  methods: {
    closeParameters () {
      this.displayParameters = false
    }
  }
}
