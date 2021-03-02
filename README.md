# alitreeviz

**Be careful, this a very preliminary version that could contain bugs.**

Visualisation of multiple sequence alignments and phylogenetic trees.

![Screenshot](https://raw.githubusercontent.com/lipme/alitreeviz/master/public/images/screenshot.png)

## Features

- Does not need any server
- Display phylogenetic tree (newick format)
- Display multiple sequence alignment (MSA) (multifasta format)
- Display MSA overview
- Select sequences in the MSA from the phylogenetic tree (the names of the sequences must correspond)
- Display position tracks above the MSA overview and detailed view (text file with one position per row)


## Usage


### Test official instance

Here : https://lipm-browsers.toulouse.inrae.fr/alitreeviz/

### From git repository

You need npm installed on your computer

git clone https://github.com/lipme/alitreeviz.git

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

Now you can use alitreeviz directly since it does not require any server.

#### Compiles and minifies for production
```
npm run build
```

### In Vue project (vue 2 compatible)

```
npm install --save alitreeviz
```

```
<template>
	<alitreeviz />
</template>
<script>
import Alitreeviz from './views/Alitreeviz.vue'

export default {
  name: 'App',

  components: {
    Alitreeviz
  }
}
</script>
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


