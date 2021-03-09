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
  <label class="text-reader">
    {{ label }}
    <input ref="input" type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Read file' }
  },
  methods: {
    loadTextFromFile (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
      this.$refs.input.value = ''
    }
  }
}
</script>

<style>
.text-reader {
  /* position: relative;
  overflow: hidden;
  display: inline-block; */

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 4px 6px;
  cursor: pointer;
  font-size:12px;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
