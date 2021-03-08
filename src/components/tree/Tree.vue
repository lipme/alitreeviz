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
  <div id="tree">
    <div :class="classModal">
      <div class="modal-background" @click="displayParameters = false"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              Layout parameters
            </div>
          </div>
          <div class="card-content">
            <label class="checkbox">
              <input type="checkbox" v-model="showPhylogram">
              display cladogram instead of phylogram
            </label>
          </div>
        </div>
      </div>
      <button @click="displayParameters = false" class="modal-close is-large" aria-label="close"></button>
    </div>
    <v-card-gene-explore
      color="blue"
      title="Tree"
      :other-buttons="otherButtons"
      @hide="hideTree"
      @show-parameters="toggleParameters"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @left="left"
      @right="right"
      @up="up"
      @down="down"
      @reset="reset"
      @deselectAll="deselectAll"
    >

    <div v-if="nodeInfo != null" class="font-weight-light caption">
      <p>
        {{ nodeInfo.name }}
      </p>
    </div>
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
    </v-card-gene-explore>
  </div>
</template>

<script>
import { VuePhylogram } from 'vue-phylogram'

import { displayParameters } from '@/mixins/displayParameters.js'

import VCardGeneExplore from '@/components/generic/VCardGeneExplore.vue'

export default {
  components: {
    VuePhylogram, VCardGeneExplore
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
      nodeInfo: null,
      otherButtons: [
        { icon: 'mdi-magnify-plus', event: 'zoom-in', tooltip: 'zoom in' },
        { icon: 'mdi-magnify-minus', event: 'zoom-out', tooltip: 'zoom out' },
        { icon: 'mdi-arrow-left', event: 'left', tooltip: 'left' },
        { icon: 'mdi-arrow-right', event: 'right', tooltip: 'right' },
        { icon: 'mdi-arrow-up', event: 'up', tooltip: 'up' },
        { icon: 'mdi-arrow-down', event: 'down', tooltip: 'down' },
        { icon: 'mdi-code-brackets', event: 'reset', tooltip: '[1:1]' },
        { icon: 'mdi-close-outline', event: 'deselectAll', tooltip: 'deselect all' }
      ]
    }
  },
  computed: {
    orderSequences () {
      // return this.$refs.phylo.d3Leaves.map(l => l.data.name)
      const order = {}

      this.$refs.phylo.d3RootNode.leaves().forEach((l, i) => {
        order[l.data.name] = i
      })

      return order
    },
    classModal () {
      return this.displayParameters ? ' modal is-active' : 'modal'
    }
  },
  mounted () {
    this.$emit('ready', this.orderSequences)
  },
  updated () {
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
    },
    hideTree () {
      this.$emit('hide-tree')
    },
    deselectAll () {
      this.$refs.phylo.deselectAll()
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

.title text {
  display: none;
}

.list-info {
  list-style: none inside;
}

.caption {
  margin: 5px;
}
</style>
