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
<div>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="title">AliTreeViz</h1>
    </div>
    <div class="navbar-end">
      <div class="caption">Explore multiple sequence alignments and phylogenetic trees
        together</div>
    </div>
  </nav>
  <section class="section">
    <alitreeviz />
  </section>
</div>
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

<style scoped>
h1{
  color:white;
  font-size: 32px;
}

nav {
  padding: 10px;
  height: 50px;
}

.section {
  margin:10px;
  padding: 30px 20px 0px 20px;
}

.navbar-end {
  line-height: 60px;
}
.caption {
  font-size:14px;
  display: inline-block;
  vertical-align: bottom;
  line-height: normal;
  }
</style>
