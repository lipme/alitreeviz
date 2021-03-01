// Copyright 2021 [LIPM]
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
//    limitations under the License.
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

     <vue-slider
      v-if="maxPos < maxLengthSeqs"
      v-model="rangeSlider"
      :max="maxLengthSeqs"
      :min="0"
      :min-range="maxPos"
      :max-range="maxPos"
      :fixed="true"
      :use-keyboard="true"
      @change="moveSlider"
    >
      <template v-slot:dot="{ value, focus }">
        <div :class="['custom-dot', { focus }]"></div>
      </template>
    </vue-slider>

    <vue-slider
      v-if="displaySliderSequences"
      v-model="rangeVerticalSlider"
      :min="0"
      :max="seqs.length - 1"
      :min-range="nbDisplayedSequences"
      :max-range="nbDisplayedSequences"
      :fixed="true"
      :use-keyboard="true"
      direction="ttb"
      :enable-cross="false"
      class="verticalSlider"
      :height="heightVerticalSlider"
      :style="cssVars"
      :tooltip-formatter="tooltipFormatter"
      :tooltip-placement="['top', 'bottom']"
    >
      <template v-slot:dot="{ value, focus }">
        <div :class="['vertical-custom-dot', { focus }]"></div>
      </template>
    </vue-slider>

    <svg-msa
      :start="rangeSlider[0] + 1"
      :end="rangeSlider[1] + 1"
      :seqs="displayedSeqs"
      :tracks="tracks"
      :type="type"
      coloring="auto"
      v-on="$listeners"
    ></svg-msa>
  </div>
</template>

<script>
import { displayParameters } from '@/mixins/displayParameters.js'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import { SvgMsa } from 'vue-svg-msa'
import 'vue-svg-msa/dist/vue-svg-msa.css'

export default {
  components: {
    SvgMsa,
    VueSlider
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
      rangeSliderProxy: null,
      rangeVerticalSliderProxy: null,

      /*
      Number of the first sequence to display
      */
      startVerticalDisplay: 0,
      /*
      Number of sequences to display
      */
      nbDisplayedSequences: 50,
      /*
      Formatter for the tooltip of the vertical slider
      */
      tooltipFormatter: v => `seq ${v}`
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
     * Range for the vertical slider
     */
    rangeVerticalSlider: {
      get: function () {
        const begin = this.startVerticalDisplay
        let end = this.startVerticalDisplay + this.nbDisplayedSequences
        if (end >= this.seqs.length) {
          end = this.seqs.length - 1
        }
        const pos = [begin, end]
        return this.rangeVerticalSliderProxy == null ? pos : this.rangeVerticalSliderProxy
      },
      set: function (newValue) {
        this.rangeVerticalSliderProxy = newValue
      }
    },
    /**
     * Height of the vertical slider
     */
    heightVerticalSlider () {
      return this.displayedSeqs.length * 15
    },
    /**
     * css variables :
     * -vslider-top : position of the vertical slider
     */
    cssVars () {
      return { '--vslider-top': 115 + this.tracks.length * 20 + 'px' }
    },
    /**
     * Selection of seqs to display
     */
    displayedSeqs () {
      const startVerticalDisplay = this.rangeVerticalSlider[0]

      const endDisplay = this.rangeVerticalSlider[1] + 1

      const displayedSeqs = this.seqs.slice(startVerticalDisplay, endDisplay)

      return displayedSeqs
    },
    /**
     * True if the vertical slider has to be displayed
     */
    displaySliderSequences () {
      return !(this.seqs.length < this.nbDisplayedSequences)
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

.vertical-custom-dot {
  width: 100%;
  height: 50%;
  border-radius: 0;
  background-color: #3498db;
  transition: all 0.1s;
}

.verticalSlider {
  position: absolute;
  left: -15px;
  top: var(--vslider-top);
}
</style>
