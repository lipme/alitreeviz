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
  <v-btn
    v-show="activeShow"
    :title="title"
    class="mr-5"
    dark
    fab
    small
    :color="color"
    @click="$emit('click')"
  >
    {{ label }}
  </v-btn>
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
  watch: {
    show (v) {
      this.activeShow = v
    }
  }
}
</script>
