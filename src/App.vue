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
      <Explore />
    </v-main>
  </v-app>
</template>

<script>
import Explore from './views/Explore.vue'

export default {
  name: 'App',

  components: {
    Explore
  },

  data: () => ({
    //
  })
}
</script>
