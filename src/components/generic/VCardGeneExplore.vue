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
  <div class="card">
    <div class="card-header" :style="style">
      <div class="card-header-title" style="color:white;">
      {{ title }}
      </div>
      <generic-button
        v-for="(button, idx) in otherButtons"
        :key="idx"
        :icon="button.icon"
        :event="button.event"
        :tooltip="button.tooltip"
        class="card-header-icon"
        @click="clickOtherButton"
      >
      </generic-button>
      <show-parameters-button class="card-header-icon"
        v-if="parambuttonvisible == true"
        @click="$emit('show-parameters')"
      ></show-parameters-button>
      <show-help-button class="card-header-icon"
       v-if="helpbuttonvisible == true"
        @click="$emit('showHelp')"
      ></show-help-button>
      <minimize-button class="card-header-icon"
        v-if="minimizebuttonvisible == true"
        @click="$emit('hide')"
      ></minimize-button>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import MinimizeButton from '@/components/generic/buttons/MinimizeButton.vue'
import ShowParametersButton from '@/components/generic/buttons/ShowParametersButton.vue'
import ShowHelpButton from '@/components/generic/buttons/ShowHelpButton.vue'
import GenericButton from '@/components/generic/buttons/GenericButton.vue'

export default {
  components: { MinimizeButton, ShowParametersButton, ShowHelpButton, GenericButton },
  props: {
    color: { type: String, default: 'white' },
    title: { type: String, default: '' },
    parambuttonvisible: { type: Boolean, default: true },
    minimizebuttonvisible: { type: Boolean, default: true },
    helpbuttonvisible: { type: Boolean, default: false },
    otherButtons: { type: Array, default: () => [] }
  },
  computed: {
    style () {
      return 'background-color:' + this.color + ';'
    }
  },
  methods: {
    clickOtherButton (event) {
      this.$emit(event)
    }
  }
}
</script>

<style scoped>

.card-header-title{
  font-size:12px;
  height:20px;
}

.card-header-icon {
  color:white;
  padding: 0px;
}

.card {
box-shadow: 8px 10px 5px 0px rgba(0,0,0,0.3);
-webkit-box-shadow: 8px 10px 5px 0px rgba(0,0,0,0.3);
-moz-box-shadow: 8px 10px 5px 0px rgba(0,0,0,0.3);
margin : 0px 0px 10px 0px;
border:solid;
border-color:grey;
border-width: 1px;
}

</style>
