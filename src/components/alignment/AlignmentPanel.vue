<template>
  <div>
    <!-- Dialog to change parameters -->
    <v-dialog v-model="displayParameters" hide-overlay width="600px">
      <v-card>
        <v-card-title>Multiple Alignment Layout</v-card-title>
        <v-card-text>
          <v-switch
            v-model="aaColoring"
            label="on: amino acid coloring, off: nucleotide coloring"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeParameters()">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <svg-msa
      :start="rangeSlider[0] + 1"
      :end="rangeSlider[1] + 1"
      :seqs="seqs"
      :tracks="tracks"
      :type="type"
      coloring="auto"
      v-on="$listeners"
    ></svg-msa>
  </div>
</template>

<script>
import { displayParameters } from '@/mixins/displayParameters.js'

import { SvgMsa } from 'vue-svg-msa'
import 'vue-svg-msa/dist/vue-svg-msa.css'

export default {
  components: {
    SvgMsa
  },
  // import :
  // showParameters props
  // displayParametersProxy data
  // displayParameters computed
  // closeParameters method
  mixins: [displayParameters],
  props: {
    seqs: {
      type: Array,
      default: function () {
        return []
      }
    },
    tracks: {
      type: Array,
      default: function () {
        return []
      }
    },
    currentid: {
      type: String,
      default: ''
    },
    maxPos: {
      type: Number,
      default: 160
    },
    showHelp: { type: Boolean, default: false },
    start: { type: Number, default: 0 },
    end: { type: Number, default: -1 },
    /**
     * array of LEAVE ids which will be highlight in the msa:
     * Can not be used directly: have to look for the node id including these leave
     */
    selectedids: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      aaColoring: true,
      currentNodeId: this.currentid,
      currentDepth: 6,
      lastDisplayedSeqIndex: 35, // not used
      selectedLeafIds: this.selectedids,
      radiobuttonDistanceColorDisabled: false,
      rangeSliderProxy: null
    }
  },
  computed: {
    maxLengthSeqs () {
      return Math.max(...this.seqs.map((s) => s.seq.length))
    },
    rangeSlider: {
      get: function () {
        const begin = this.start
        const end = this.end
        const positions = [begin, end]
        return this.rangeSliderProxy == null
          ? positions
          : this.rangeSliderProxy
      },
      set: function (newValue) {
        this.rangeSliderProxy = newValue
      }
    },
    /**
     * return an array of metadata object
     * Note that at the moment it returns just the metadata of the root node of the tree
     * TODO: search the metadata in all the tree (?)
     */
    getMetadata () {
      return this.tree.getRootMetadata()
    },
    type () {
      return this.aaColoring ? 'aa' : 'nt'
    }
  },
  watch: {
    currentid (v) {
      this.currentNodeId = v
    },
    start (v) {
      this.rangeSlider[0] = v
    },
    selectedids (v) {
      this.selectedLeafIds = v
    }
  },
  mounted () {
    this.scroll()
  },
  methods: {
    /**
     * Update the current node ID and emit its value
     */
    updateCurrentNodeId (newId) {
      this.currentNodeId = newId
      this.$emit('select-node', [this.currentNodeId])
    },
    scroll () {
      window.onscroll = () => {
        const bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight
        const roundBottomOfWindow =
          Math.round(
            document.documentElement.scrollTop + window.innerHeight
          ) === document.documentElement.offsetHeight
        if (bottomOfWindow || roundBottomOfWindow) {
          this.lastDisplayedSeqIndex += 5
        }
      }
    },
    closeHelpEvent () {
      this.$emit('hideHelp')
    },
    moveSlider (pos) {
      this.$emit('extract', pos)
    }
  }
}
</script>
<style scoped>
.metadata-btn {
  pointer-events: none;
  opacity: 0.4;
}

.vue-slider {
  margin: 12px;
}

.custom-dot {
  width: 50%;
  height: 100%;
  border-radius: 0;
  background-color: #3498db;
  transition: all 0.1s;
}
.custom-dot:hover {
  width: 100%;
}
</style>
