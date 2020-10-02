<template
  >
  <div class="fillHeight">
    <!-- dialog visible during the page loading -->
    <loading-dialog
      :loading="loading"
      :loadingmsg="loadingmsg"
    ></loading-dialog>

    <v-alert
      v-model="errored"
      type="error"
      dark
      width="500px"
      @click="errored = false"
      dismissible
    >
      {{ errormsg }}
    </v-alert>

    <v-row v-if="!errored" dense justify="space-between" class="mt-3 ml-3">
      <v-col class="text-left">
        <v-row justify="start">
          <file-upload-field
            label
            button-label="Get Multifasta alignment file"
            @load="loadFasta"
          ></file-upload-field>
          <file-upload-field
            label
            button-label="Get newick file"
            @load="loadNewick"
          ></file-upload-field>
        </v-row>
      </v-col>
      <v-col class="text-right">
        <v-row justify="end">
          <panel-button
            label="T"
            color="blue"
            title="Display Tree"
            :show="!displayTree"
            @click="showTree"
          ></panel-button>
          <panel-button
            label="A"
            color="#006400"
            title="Display Alignment"
            :show="!displayAln"
            @click="showAln"
          ></panel-button>
          <panel-button
            label="O"
            color="orange"
            title="Display Alignment Overview"
            :show="!displayOverview"
            @click="showOverview"
          ></panel-button>
        </v-row>
      </v-col>
    </v-row>
    <v-container v-if="!loading && !errored" fluid class="align-stretch">
        <v-row no-gutters >
            <v-col
              ref="colTree"
              v-resize="resizeTree"
              style="min-height: 600px;max-height:800px;"
              cols="12"
          :md="nbColsTreePanel"
          v-show="displayTree"
          v-if="tree != null"
            >
              <v-card-gene-explore
                color="blue"
                title="Tree"
                @showParameters="showTreeParameters = true"
                @hide="hideTree"
              >
                <tree
                  ref="tree"
                  :height="heightTree - 100"
                  :width="widthTree - 20"
                  :show-parameters="showTreeParameters"
                  :tree="tree"
                  :nodes-to-select="nodeToSelect"
                  @select-node="selectNodes"
                  @hideParameters="showTreeParameters = false"
                ></tree>
              </v-card-gene-explore>
            </v-col>
        <v-col
          cols="12"
          :md="nbColsAlignmentPanel"
          v-show="displayOverview || displayAln"
          v-if="seqs != null"
        >
          <v-row justify="space-between" no-gutters>
            <v-col
              ref="colOverview"
              v-resize="resizeOverview"
              v-show="displayOverview"
            >
              <v-card-gene-explore
                color="orange"
                title="Alignment Overview"
                @showParameters="showAlignmentOverviewParameters = true"
                @hide="hideOverview"
              >
                <v-container class="overviewContainer">
                  <overview-panel
                    :show-parameters="showAlignmentOverviewParameters"
                    :seqs="seqs"
                    :selection="overviewSelection"
                    :width="widthOverview"
                    :tracks="tracks"
                    @hideParameters="showAlignmentOverviewParameters = false"
                  ></overview-panel>
                </v-container>
              </v-card-gene-explore>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col v-show="displayAln">
              <v-card-gene-explore
                color="#006400"
                title="Alignment Details"
                @showParameters="showAlignmentParameters = true"
                @hide="hideAln"
              >
                <alignment-panel
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
                ></alignment-panel>
              </v-card-gene-explore>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'

import resize from 'vue-resize-directive'
import OverviewPanel from '@/components/overview/OverviewPanel.vue'
import Tree from '@/components/tree/Tree.vue'
import AlignmentPanel from '@/components/alignment/AlignmentPanel.vue'
import VCardGeneExplore from '@/components/generic/VCardGeneExplore.vue'
import PanelButton from '@/components/generic/buttons/PanelButton.vue'
import LoadingDialog from '@/components/generic/LoadingDialog.vue'

import FileUploadField from '@/components/file/FileGetContentField'

const nbPositionsDisplayed = 60

const Fasta = require('biojs-io-fasta')

export default {
  directives: {
    resize
  },
  components: {
    Tree,
    AlignmentPanel,
    OverviewPanel,
    LoadingDialog,
    PanelButton,
    VCardGeneExplore,
    FileUploadField
  },
  data () {
    return {
      tree: null,
      seqs: null,
      selectedNodeId: '',
      selectSeqIds: [],
      /**
       * array of objects genotypes
       */
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

      errored: false,
      loading: false,

      errormsg:
        'Enable to load json file. Please make sure the json file is well formatted.',
      loadingmsg: 'Loading...',

      nbPositionsDisplayed: nbPositionsDisplayed,
      overviewSelection: {
        startSeq: -1,
        endSeq: 100000000,
        startPos: 0,
        endPos: nbPositionsDisplayed
      },
      selectionFromOverview: {
        startPos: 0,
        endPos: nbPositionsDisplayed
      }
    }
  },

  computed: {
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

      const l = endSeq - startSeq + 1

      const selectedSeqs = []

      for (let index = 0; index < l; index++) {
        const seq = this.seqs[index]
        selectedSeqs.push(seq)
      }

      return selectedSeqs
    }
  },
  watch: {
    lengthSequence (newValue) {
      const startPos = Math.floor(
        (newValue - 1 - nbPositionsDisplayed / 2) / 2
      )
      const endPos = startPos + nbPositionsDisplayed
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
      console.log('selectNodes', ids)
      if (this.seqs != null) {
        const indices = []
        for (let index = 0; index < this.seqs.length; index++) {
          const seq = this.seqs[index]
          if (ids.includes(seq.name)) {
            indices.push(index)
          }
        }

        console.log({ indices })

        const min = Math.min(...indices)
        const max = Math.max(...indices)
        this.overviewSelection = Object.assign({}, this.overviewSelection, {
          startSeq: min,
          endSeq: max
        })
      }

      Vue.nextTick()
    },
    /**
     * Reset all the views
     */
    reset () {
      this.loadLocus()
      this.displayOverview = true
      this.displayAln = true
      this.displayTree = true
      this.displayStats = false
      this.selectedGenotypes = []
    },

    resizeTree () {
      console.log('resize tree')
      if (this.loading === false) {
        this.heightTree =
          'colTree' in this.$refs ? this.$refs.colTree.clientHeight : 400
        this.widthTree =
          'colTree' in this.$refs ? this.$refs.colTree.clientWidth : 600
      }
    },
    resizeOverview () {
      if (this.loading === false) {
        this.widthOverview =
          'colOverview' in this.$refs
            ? this.$refs.colOverview.clientWidth - 50
            : 600
      }
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
        endPos: nbPositionsDisplayed
      }
    },
    resetSelectionFromOverview () {
      this.selectionFromOverview = {
        startPos: 0,
        endPos: nbPositionsDisplayed
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
    selectGenotypes (selectedgenotypes) {
      this.selectedGenotypes = selectedgenotypes
    },
    displayError (msg) {
      this.errored = true
      this.errormsg = msg
    },
    loadFasta (multifasta) {
      this.seqs = Fasta.parse(multifasta)
      this.displayAln = true
      this.displayOverview = true
    },
    loadNewick (newick) {
      this.tree = newick
      this.displayTree = true
    }
  },
  /**
   * Generic behaviour if an error is captured
   */
  errorCaptured (err) {
    this.errored = true
    this.errormsg =
      'Error : data is maybe badly formatted, please contact Atlas admin'
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

.v-card {
  margin: 5px;
}

.v-alert {
  margin: 100px auto;
}

.fillHeight {
  height:100%;
}
</style>
