<template>
  <div>
    <v-dialog v-model="displayParameters" hide-overlay width="600px">
      <v-card>
        <v-card-title>Alignment overview parameters</v-card-title>
        <v-card-text>
          <v-switch
            v-model="displayMetadata"
            label="Displays Metadata"
          ></v-switch>
          <v-switch
            v-model="displaySelection"
            label="displays selection"
          ></v-switch>
          <v-switch v-model="displayTracks" label="displays tracks"></v-switch>
          <v-switch v-model="displayScale" label="displays scale"></v-switch>
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
  </div>
</template>

<script>
import { MsaOverview } from 'vue-msa-overview'
import { displayParameters } from '@/mixins/displayParameters.js'

export default {
  components: {
    MsaOverview
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
      heightTracks: 20,
      testTracks: [
        {
          features: [
            {
              positions: [
                [1, 20],
                [109, 234]
              ],
              type: 'label1',
              color: 'green'
            },
            {
              positions: [[21, 108]],
              type: 'label2',
              color: 'pink'
            }
          ],
          trackLabel: 'track1'
        },
        {
          features: [
            {
              positions: [
                [2, 32],
                [109, 234]
              ],
              type: 'label1',
              color: 'green'
            },
            {
              positions: [[33, 108]],
              type: 'label2',
              color: 'pink'
            }
          ],
          trackLabel: 'track2'
        }
      ]
    }
  },
  computed: {
    length () {
      console.log(
        this.seqs.map((s) => {
          return s.seq ? s.seq.length : 0
        })
      )
      console.log(
        'max',
        Math.max(
          ...this.seqs.map((s) => {
            return s.seq ? s.seq.length : 0
          })
        )
      )
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
    }
  },
  methods: {
    emitSelect (selection) {
      this.$emit('overviewselect', selection)
    }
  }
}
</script>

<style></style>
