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
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
        <div class="text-h3">AliTreeViz</div>
      </div>

      <v-spacer></v-spacer>

      <span class="mr-2 caption"
        >Explore multiple sequence alignments and phylogenetic trees
        together</span
      >
    </v-app-bar>

    <v-main>
      <alitreeviz />
    </v-main>
  </v-app>
</template>

<script>
import Alitreeviz from './views/Alitreeviz.vue'

export default {
  name: 'App',

  components: {
    Alitreeviz
  },

  data: () => ({
    //
  })
}
</script>
