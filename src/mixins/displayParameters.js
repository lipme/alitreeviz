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
export const displayParameters = {
  props: {
    showParameters: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { displayParametersProxy: null }
  },
  computed: {
    displayParameters: {
      get: function () {
        return this.displayParametersProxy == null
          ? this.showParameters
          : this.displayParametersProxy
      },
      set: function (newValue) {
        this.displayParametersProxy = newValue
        if (newValue === false) {
          this.$emit('hideParameters')
        }
      }
    }
  },
  watch: {
    showParameters () {
      this.displayParametersProxy = null
    }
  },
  methods: {
    closeParameters () {
      this.displayParameters = false
    },
    toggleParameters () {
      this.displayParameters = !this.displayParameters
    }
  }
}
