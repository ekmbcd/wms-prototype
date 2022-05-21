<template>
  <div id="map"></div>
</template>

<script setup>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import { Tile as TileLayer, Group as LayerGroup } from 'ol/layer'
import { defaults } from 'ol/control'
import TileWMS from 'ol/source/TileWMS'
import View from 'ol/View'
import { onMounted } from 'vue'
import { mapBrainStore, SERVER_URL } from './stores/mapBrain'
import { transform } from 'ol/proj.js'

const mapBrain = mapBrainStore()

// getCapabilities and setup layers
mapBrain.init()

const layers = [
  // world map
  new TileLayer({
    source: new OSM()
  }),
  // wsm layers
  new LayerGroup({
    layers: [
      new TileLayer({
        source: new TileWMS({
          url: SERVER_URL,
          params: { LAYERS: 'Land_Use_vector52160,Land_Use_Raster1402' }
          // params: { LAYERS: mapBrain.layersString }
        })
      }),
      new TileLayer({
        source: new TileWMS({
          url: SERVER_URL,
          params: { LAYERS: 'City_Boundary,City__Boundary56962' }
          // params: { LAYERS: mapBrain.layersString }
        })
      })
    ]
  })
]

const map = new Map({
  layers,
  controls: defaults({ attribution: false }),
  view: new View({
    // Berlin's coordinates
    center: transform([13.40, 52.52], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
})

// need page to render to get reference to html element
onMounted(() => {
  map.setTarget('map')
})

</script>

<style scoped>

#map {
  width: 100%;
  height: 100%;
}
</style>
