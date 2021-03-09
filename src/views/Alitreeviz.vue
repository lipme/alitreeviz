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
<template
  >
  <div>
    <article class="message is-danger" v-if="errored">
      <div class="message-header">
        <p>Error</p>
        <button class="delete" aria-label="delete" @click="errored = false"></button>
      </div>
      <div class="message-body">
        {{errormsg}}
      </div>
    </article>

    <article class="message is-warning" v-if="errorConsistency">
      <div class="message-header">
        <p>Warning</p>
        <button class="delete" aria-label="delete" @click="errorConsistency = false"></button>
      </div>
      <div class="message-body">
      Warning : The tree and the MSA are not consistent (not the same id), strange behaviours can appear !
      </div>
    </article>

    <div class="columns">
      <div class="column" is-narrow>
        <div class="columns">
          <div class="column is-narrow">
            <file-upload-field
                label
                button-label="Load Multifasta alignment file"
                @load="loadFasta"
              ></file-upload-field>
          </div>
          <div class="column is-narrow">
            <file-upload-field
                label
                button-label="Load newick file"
                @load="loadNewick"
              ></file-upload-field>
          </div>
          <div class="column is-narrow">
            <file-upload-field
                label
                button-label="Load new position file"
                @load="loadPositionFile"
                title="Load a position file. The first column must contain single positions or ranges, i.e 2 positions separated by '-' (e.g 100-110)"
              ></file-upload-field>
          </div>
          <!-- <div class="column is-narrow">
            <panel-button
                label=""
                :color="colorTrack"
                :show="true"
                title="Click to change color of the new track"
                @click="toggleColorPicker"
              ></panel-button>
          </div> -->
          <div style="width:auto;">
            <div class="column is-narrow" style="float:left;">
              <input type="color"
                  v-model="colorTrack"
                  title="change the color of the new track"
                />
            </div>
            <div class="column is-narrow" style="float:left;">
              <input type="text"
                  v-model="labelTrack"
                  style="padding : 2px; max-width: 100px;border:solid;border-color:black;border-radius:3%;border-width:2px;"
                  label="track label"
                  placeholder="Track label"
                  title="change the label of the new track"
                />
            </div>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="columns flexright" >
          <div class="column is-narrow">
            <panel-button
                label="T"
                color="blue"
                title="Display Tree"
                :show="!displayTree"
                @click="showTree"
              ></panel-button>
          </div>
          <div class="column is-narrow">
            <panel-button
                label="A"
                color="#006400"
                title="Display Alignment"
                :show="!displayAln"
                @click="showAln"
              ></panel-button>
          </div>
          <div class="column is-narrow">
            <panel-button
                label="O"
                color="orange"
                title="Display Alignment Overview"
                :show="!displayOverview"
                @click="showOverview"
              ></panel-button>
          </div>
          <div class="column is-narrow">
            <panel-button
                color="red"
                label="Reset"

                title="Reset all"
                show
                @click="reset"
                >
            </panel-button>
          </div>
      </div>
    </div>

    </div>

    <div class="columns panels" v-if="!errored">
        <div :class="classColTree"  ref="colTree"
          v-resize="resizeTree" v-show="displayTree"
          v-if="tree != null" style="height:90vh;">
            <tree
              ref="tree"
              :height="heightTree - 100"
              :width="widthTree - 20"
              :show-parameters="showTreeParameters"
              :tree="tree"
              :nodes-to-select="nodeToSelect"
              @ready="setSequenceOrder"
              @select-node="selectNodes"
              @hideParameters="showTreeParameters = false"
              @hide-tree="hideTree"
            ></tree>
        </div>

        <div v-resize="resizeOverview" :class="classColAln"
          ref="colOverview" v-show="displayOverview || displayAln"
          v-if="seqs != null" style="height:90vh;">
                <overview-panel
                  v-show="displayOverview"
                  :show-parameters="showAlignmentOverviewParameters"
                  :seqs="seqs"
                  :selection="overviewSelection"
                  :width="widthOverview"
                  :tracks="tracks"
                  @hideParameters="showAlignmentOverviewParameters = false"
                  @hide-overview="hideOverview"
                ></overview-panel>

                <alignment-panel
                  v-show="displayAln"
                  :max-pos="nbPositionsDisplayed"
                  :start="selectionFromOverview.startPos"
                  :end="selectionFromOverview.endPos"
                  :show-parameters="showAlignmentParameters"
                  :show-help="showAlignmentHelp"
                  :tracks="tracks"
                  :seqs="selectedSeqs"
                  :currentid="selectedNodeId"
                  :selectedids="selectSeqIds"
                  @hideHelp="showAlignmentHelp = false"
                  @hideParameters="showAlignmentParameters = false"
                  @select-node="selectNodes"
                  @extract="setSelectionFromAlignment"
                  @hide-aln="hideAln"
                ></alignment-panel>
          </div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'

import resize from 'vue-resize-directive'
import OverviewPanel from '@/components/overview/OverviewPanel.vue'
import Tree from '@/components/tree/Tree.vue'
import AlignmentPanel from '@/components/alignment/AlignmentPanel.vue'
import PanelButton from '@/components/generic/buttons/PanelButton.vue'

import FileUploadField from '@/components/file/FileGetContentField'

const Fasta = require('biojs-io-fasta')

const NBPOSITIONS = 160

export default {
  name: 'alitreeviz',
  directives: {
    resize
  },
  components: {
    Tree,
    AlignmentPanel,
    OverviewPanel,
    PanelButton,
    FileUploadField
  },
  data () {
    return {
      tree: null,
      seqs: null,
      selectedNodeId: '',
      selectSeqIds: [],
      tracks: [],

      heightTree: 400,
      widthTree: 600,
      widthOverview: 600,

      displayTree: true,
      displayAln: true,
      displayOverview: true,

      showTreeParameters: false,
      showAlignmentParameters: false,
      showAlignmentOverviewParameters: false,
      showAlignmentHelp: false,
      showColorPicker: false,
      colorTrack: '#FF2000',
      labelTrack: 'track',

      errored: false,

      errormsg:
        'Enable to load json file. Please make sure the json file is well formatted.',

      nbPositionsDisplayed: NBPOSITIONS,
      overviewSelection: {
        startSeq: -1,
        endSeq: 100000000,
        startPos: 0,
        endPos: NBPOSITIONS
      },
      selectionFromOverview: {
        startPos: 0,
        endPos: NBPOSITIONS
      },
      orderSequences: null,
      errorConsistencyProxy: null
    }
  },

  computed: {
    classColTree () {
      return ((!this.displayAln && !this.displayOverview) || this.seqs === null) ? 'column is-full' : 'column is-one-third'
    },
    classColAln () {
      return (!this.displayTree || this.tree == null) ? 'column is-full' : 'column is-two-thirds'
    },
    lengthSequence () {
      if (this.seqs != null && this.seqs.length > 0) {
        return this.seqs[0].seq.length
      }
      return 0
    },
    nbColsAlignmentPanel () {
      return this.tree != null && this.displayTree ? 8 : 12
    },
    nbColsTreePanel () {
      return this.seqs != null && (this.displayAln || this.displayOverview)
        ? 4
        : 12
    },
    nodeToSelect () {
      return [this.selectedNodeId]
    },
    selectedSeqs () {
      let startSeq = this.overviewSelection.startSeq
      let endSeq = this.overviewSelection.endSeq

      if (startSeq < 0) {
        startSeq = 0
      }
      if (endSeq >= this.seqs.length) {
        endSeq = this.seqs.length - 1
      }

      let selectedSeqs = []

      for (let index = startSeq; index <= endSeq; index++) {
        const seq = this.seqs[index]
        selectedSeqs.push(seq)
      }

      if (selectedSeqs.length === 0) {
        selectedSeqs = this.seqs
      }

      if (this.orderSequences != null) {
        selectedSeqs = selectedSeqs.sort((a, b) => {
          return this.orderSequences[a.name] - this.orderSequences[b.name]
        })
      }

      return selectedSeqs
    },
    /**
     * ids of the sequences
     */
    sequenceIds () {
      return this.seqs === null ? [] : this.seqs.map((s) => s.name)
    },
    /**
     * ids of the leaves of thre tree
     */
    leaveIds () {
      return this.orderSequences === null
        ? []
        : Object.keys(this.orderSequences)
    },
    /**
     * Check consistency between sequence ids and tree leave ids
     */

    errorConsistency: {
      get: function () {
        if (this.errorConsistencyProxy === null) {
          if (this.sequenceIds.length > 0 && this.leaveIds.length > 0) {
            return !this.sequenceIds.every((s) => this.leaveIds.includes(s))
          }
          return false
        } else {
          return this.errorConsistencyProxy
        }
      },
      set: function (newValue) {
        this.errorConsistencyProxy = newValue
      }
    }
  },
  watch: {
    lengthSequence (newValue) {
      const startPos = Math.floor(
        (newValue - 1 - this.nbPositionsDisplayed / 2) / 2
      )
      const endPos = startPos + this.nbPositionsDisplayed
      if (startPos >= 0 && endPos < newValue) {
        this.selectionFromOverview = Object.assign(
          this.selectionFromOverview,
          {},
          { startPos: startPos, endPos: endPos }
        )
        this.overviewSelection = Object.assign(
          this.overviewSelection,
          {},
          { startPos: startPos, endPos: endPos }
        )
      }
    }
  },

  methods: {
    /**
     * Call when the user change the root node to display
     *  change the selectednode id
     *  compute the overviewSelection positions
     */
    selectNodes (ids) {
      if (this.seqs != null) {
        let indices = []
        for (let index = 0; index < this.seqs.length; index++) {
          const seq = this.seqs[index]
          if (ids.includes(seq.name)) {
            indices.push(index)
          }
        }

        if (indices.length === 0) {
          indices = [0, this.seqs.length - 1]
        }

        const min = Math.min(...indices)
        const max = Math.max(...indices)
        this.overviewSelection = Object.assign({}, this.overviewSelection, {
          startSeq: min,
          endSeq: max
        })
      }

      Vue.nextTick()
    },

    resizeTree () {
      this.heightTree =
          'colTree' in this.$refs ? this.$refs.colTree.clientHeight : 400
      this.widthTree =
          'colTree' in this.$refs ? this.$refs.colTree.clientWidth : 600
    },
    resizeOverview () {
      this.widthOverview =
          'colOverview' in this.$refs
            ? this.$refs.colOverview.clientWidth - 50
            : 600
    },
    showTree () {
      this.displayTree = true
    },
    hideTree () {
      this.displayTree = false
    },
    showAln () {
      this.displayAln = true
    },
    hideAln () {
      this.displayAln = false
    },
    hideSearch () {
      this.displaySearch = false
    },
    showOverview () {
      this.displayOverview = true
    },
    hideOverview () {
      this.displayOverview = false
    },
    showStats () {
      this.displayStats = true
    },
    showSearch () {
      this.displaySearch = true
    },
    hideStats () {
      this.displayStats = false
    },
    /**
     * Methods used by msa overview
     */
    resetOverviewSelection () {
      this.overviewSelection = {
        startSeq: -1,
        endSeq: 100000000,
        startPos: 0,
        endPos: this.nbPositionsDisplayed
      }
    },
    resetSelectionFromOverview () {
      this.selectionFromOverview = {
        startPos: 0,
        endPos: this.nbPositionsDisplayed
      }
    },
    selectSequencesFromOverview (selection) {
      const leaveIds = []

      const startSeq =
        selection.startSeq > 0 && selection.startSeq < this.seqs.length
          ? selection.startSeq
          : 0

      const endSeq =
        selection.endSeq > 0 && selection.endSeq < this.seqs.length
          ? selection.endSeq
          : this.seqs.length - 1

      for (let i = startSeq; i <= endSeq; i++) {
        leaveIds.push(this.seqs[i].id)
      }

      this.selectSeqIds = leaveIds

      // const parameters = { n: 10000000, commonAncestor: null }
      // this.tree.getCommonAncestor(this.tree.data, leaveIds, parameters)

      // if (parameters.commonAncestor != null) {
      //   this.selectedNodeId = parameters.commonAncestor
      // }

      this.selectionFromOverview = {
        startPos: selection.startPos,
        endPos: selection.endPos
      }
    },
    setSelectionFromAlignment (pos) {
      this.overviewSelection = Object.assign({}, this.overviewSelection, {
        startPos: pos[0],
        endPos: pos[1]
      })
    },
    displayError (msg) {
      this.errored = true
      this.errormsg = msg
    },
    loadFasta (multifasta) {
      this.seqs = Fasta.parse(multifasta)
      this.sortSequences()
      this.displayAln = true
      this.displayOverview = true
    },
    loadNewick (newick) {
      this.selectNodes([])
      this.tree = null
      this.tree = newick
      this.displayTree = true
    },
    loadPositionFile (content) {
      const positions = []

      const lines = content.split(/[\r\n]+/)

      lines.forEach((line) => {
        const cols = line.split('\t')
        const pos = cols[0].split('-')
        let pos1, pos2
        if (pos.length === 1) {
          pos1 = Number.parseInt(pos[0])
          pos2 = pos1
        } else if (pos.length === 2) {
          pos1 = Number.parseInt(pos[0])
          pos2 = Number.parseInt(pos[1])
        }

        if (Number.isInteger(pos1) && Number.isInteger(pos2)) {
          const pos1pos2 = [pos1, pos2]
          positions.push(pos1pos2)
        }
      })

      if (positions.length > 0) {
        const track = { trackLabel: this.labelTrack }
        track.features = []
        const feature = {
          positions: positions,
          color: this.colorTrack,
          type: 'pos',
          'fill-opacity': 1
        }
        track.features.push(feature)
        this.tracks.push(track)
      }
    },
    toggleColorPicker () {
      this.showColorPicker = !this.showColorPicker
    },
    setSequenceOrder (order) {
      this.orderSequences = order
      this.sortSequences()
    },
    sortSequences () {
      if (this.orderSequences != null && this.seqs != null) {
        this.seqs = this.seqs.sort((a, b) => {
          return this.orderSequences[a.name] - this.orderSequences[b.name]
        })
      }
    },
    reset () {
      this.tree = null
      this.seqs = null
      this.tracks = []
      this.displayError = false
      this.orderSequences = null
      this.resetOverviewSelection()
      this.resetSelectionFromOverview()
    }
  },
  /**
   * Generic behaviour if an error is captured
   */
  errorCaptured (err) {
    this.errored = true
    this.errormsg =
      'Error : data is maybe badly formatted, please contact admin'
    console.error('Captured error : ', err.stack)
    return false
  }
}
</script>

<style scoped>
.overviewContainer {
  height: 330px;
  min-width: 650px;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0px;
}

.fillHeight {
  height: 100%;
}

.main {
  margin: 10px;
}

.column {
  padding : 2px;
}

.flexright {
  display: flex;
  align-items: flex-end;
}

.panels {
  margin-top:5px;
  margin-left:-22px;
}

</style>
