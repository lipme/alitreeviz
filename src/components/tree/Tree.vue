<template>
  <div id="tree">
    <v-dialog v-model="displayParameters" hide-overlay width="400px">
      <v-card>
        <v-card-title>Layout parameters</v-card-title>
        <v-card-text>
          <v-switch
            v-model="showPhylogram"
            dense
            label="display cladogram instead of phylogram"
          ></v-switch>
          <v-switch v-model="alignLabels" dense label="Align labels"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="displayParameters = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <vue-phylogram
      ref="phylo"
      :newick="tree"
      :height="height"
      :width="width"
      :branch-lengths="showPhylogram"
      :align-labels="alignLabels"
      :selected="nodesToSelect.join(',')"
      :display-leaves="false"
      @click-node="clickNodeFn"
      @click-outside="clickOutsideFn"
      @select-nodes="selectNodes"
      @hover-node="hoverNodeFn"
      @hover-label="hoverNodeFn"
    >
    </vue-phylogram>
    <v-btn x-small dark fab bottom left color="green" @click="zoomIn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="red" @click="zoomOut">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="purple" @click="left">
      <v-icon>keyboard_arrow_left</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="purple" @click="right">
      <v-icon>keyboard_arrow_right</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="purple" @click="up">
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="purple" @click="down">
      <v-icon>keyboard_arrow_down</v-icon>
    </v-btn>
    <v-btn x-small dark fab bottom left color="blue" @click="reset">
      <v-icon>mdi-reload</v-icon>
    </v-btn>
    <div v-if="nodeInfo != null" class="node-info font-weight-light caption">
      <p>
        {{ nodeInfo.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { VuePhylogram } from 'vue-phylogram'

import { displayParameters } from '@/mixins/displayParameters.js'

export default {
  components: {
    VuePhylogram
  },
  mixins: [displayParameters],
  props: {
    height: {
      type: Number,
      default: 800
    },
    tree: {
      type: String,
      default: null
    },
    nodesToSelect: {
      type: Array,
      default: () => {
        return []
      }
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      showPhylogram: true,
      alignLabels: true,
      nodeInfo: null
    }
  },
  computed: {
    orderSequences () {
      // return this.$refs.phylo.d3Leaves.map(l => l.data.name)
      const order = {}

      this.$refs.phylo.d3RootNode.leaves().forEach((l, i) => { order[l.data.name] = i })

      return order
    }
  },
  mounted () {
    this.$emit('ready', this.orderSequences)
  },
  methods: {
    clickNodeFn (e, node) {
      this.$refs.phylo.deselectAll()
      this.$refs.phylo.selectNode(node)
    },
    clickOutsideFn (e, node) {
      this.$refs.phylo.deselectAll()
    },
    hoverNodeFn (e, node) {
      this.nodeInfo = { id: node.data.id, name: node.data.name }
    },
    selectNodes (nodes) {
      this.$emit('select-node', nodes)
    },
    zoomIn () {
      this.$refs.phylo.zoomIn()
    },
    zoomOut () {
      this.$refs.phylo.zoomOut()
    },
    left () {
      this.$refs.phylo.left()
    },
    right () {
      this.$refs.phylo.right()
    },
    up () {
      this.$refs.phylo.up()
    },
    down () {
      this.$refs.phylo.down()
    },
    reset () {
      this.$refs.phylo.reset()
    }
  }
}
</script>

<style>
.svg-pan-zoom-control {
  left: 50px;
  bottom: 50px;
}
</style>
<style src="vue-phylogram/dist/vue-phylogram.css">
/* global styles */
</style>

<style scoped>
.v-label {
  font-size: 12px;
}
.title text {
  display: none;
}

.v-btn {
  margin: 5px;
}

.node-info {
  position: absolute;
  width: auto;
  height: auto;
  max-width: 50%;
  left: 10px;
  bottom: 50px;
  background-color: transparent;
  border: 1px solid purple;
  border-radius: 10px;
  padding: 10px 3px 0px 3px;
}

.list-info {
  list-style: none inside;
}
</style>
