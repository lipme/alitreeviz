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
<div  v-show="activeShow">
  <button
    :title="title"
    class="button is-rounded is-small"
    :style="styleButton"
    @click="$emit('click')"
  >
  {{label}}
  </button>
  </div>
</template>
<script>
export default {
  props: {
    label: { type: String, default: '' },
    color: { type: String, default: 'blue' },
    title: { type: String, default: '' },
    show: { type: Boolean, defaut: false }
  },
  data () {
    return {
      activeShow: this.show
    }
  },
  computed: {
    styleButton () {
      return 'background-color:' + this.color + ';color:white;'
    }
  },
  watch: {
    show (v) {
      this.activeShow = v
    }
  }
}
</script>

<style scoped>
.button{border-radius: 50%; box-shadow: 3px 4px 8px 0px rgba(0,0,0,0.69);
-webkit-box-shadow: 3px 4px 8px 0px rgba(0,0,0,0.69);
-moz-box-shadow: 3px 4px 8px 0px rgba(0,0,0,0.69);
border:none}
</style>
