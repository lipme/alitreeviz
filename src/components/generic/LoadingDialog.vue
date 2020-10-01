<template>
  <v-dialog v-model="loading" persistent width="300">
    <v-card class="primary alertCard" dark>
      <v-card-text>
        {{ loadingmsg }}
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    loadingmsg: {
      type: String,
      default: 'Loading...'
    },
    loading: {
      type: Boolean,
      default: true
    }
  }
}
</script>
