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
     <div :class="classModal">
      <div class="modal-background" @click="closeParameters"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              Alignment overview parameters
            </div>
          </div>
          <div class="card-content">
            <label class="checkbox">
              <input type="checkbox" v-model="displaySelection">
              displays selection
            </label>
            <br />
            <label class="checkbox">
              <input type="checkbox" v-model="displayTracks">
              displays tracks
            </label>
            <br />
            <label class="checkbox">
              <input type="checkbox" v-model="displayScale">
              displays scale
            </label>
            <br />
            <label class="checkbox">
              <input type="checkbox" v-model="aaColoring">
              on: amino acid coloring, off: nucleotide colorin
            </label>
          </div>
        </div>
      </div>
      <button @click="closeParameters" class="modal-close is-large" aria-label="close"></button>
    </div>
   <v-card-gene-explore
      color="orange"
      title="Alignment Overview"
      @hide="hideAlignment"
      @show-parameters="toggleParameters"
    >
    <msa-overview
      :display-letters-mask="!displayMetadata"
      :display-metadata-mask="displayMetadata"
      :display-selection-mask="displaySelection"
      :display-tracks="displayTracks"
      :display-scale="displayScale"
      :seqs="seqs"
      :selection="selection"
      :selectable="false"
      :width="width"
      :tracks="tracks"
      :height-tracks="20"
      :colorStyle="coloringMode"
      @select="emitSelect"
    ></msa-overview>
   </v-card-gene-explore>
  </div>
</template>

<script>
import { MsaOverview } from 'vue-msa-overview'
import { displayParameters } from '@/mixins/displayParameters.js'

import VCardGeneExplore from '@/components/generic/VCardGeneExplore.vue'

export default {
  components: {
    MsaOverview, VCardGeneExplore
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
      default: () => {
        return []
      }
    },
    selection: {
      type: Object,
      default: () => {
        return {
          startSeq: -1,
          endSeq: 100000000,
          startPos: -1,
          endPos: 100000000
        }
      }
    },
    width: {
      type: Number,
      default: 600
    },
    tracks: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      aaColoring: true,
      displayMetadata: false,
      displaySelection: true,
      displayTracks: true,
      displayScale: true,
      trackSep: 5,
      heightTracks: 20
    }
  },
  computed: {
    length () {
      return Math.max(
        ...this.seqs.map((s) => {
          return s.seq ? s.seq.length : 0
        })
      )
    },
    trackHeight () {
      return (
        (this.heightTracks - this.tracks.length * this.trackSep) /
        this.tracks.length
      )
    },
    coloringMode () {
      return this.aaColoring ? 'aa' : 'nt'
    },
    classModal () {
      return this.displayParameters ? ' modal is-active' : 'modal'
    }
  },
  methods: {
    emitSelect (selection) {
      this.$emit('overviewselect', selection)
    },
    hideAlignment () {
      this.$emit('hide-overview')
    }
  }
}
</script>

<style></style>
