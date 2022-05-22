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
import { onMounted, watch } from 'vue'
import { mapBrainStore, SERVER_URL } from './stores/mapBrain'
import { transform, transformExtent } from 'ol/proj.js'

const mapBrain = mapBrainStore()

// getCapabilities and setup layers
await mapBrain.init()

function createLayers () {
  const layers = [
  // world map
    new TileLayer({
      source: new OSM()
    }),
    // wsm layers
    new LayerGroup({
      layers: mapBrain.layers.map(layer => {
        const source = new TileWMS({
          url: SERVER_URL,
          params: {
            LAYERS: layer.layers.join(',')
          }
        })
        return new TileLayer({
          source,
          visible: layer.active,
          opacity: parseInt(layer.opacity) / 100
        })
      })
    })
  ]
  return layers
}

const map = new Map({
  layers: createLayers(),
  controls: defaults({ attribution: false }),
  view: new View({
    // Berlin's coordinates
    center: transform([13.40, 52.52], 'EPSG:4326', 'EPSG:3857'),
    // limit map panning
    extent: transformExtent(mapBrain.extent, 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
})

let timer
// change map layers on brainStore change
watch(mapBrain.layers, () => {
  // debounce inputs
  clearTimeout(timer)
  timer = setTimeout(() => {
    const layers = createLayers()
    map.setLayers(layers)
  }, 500)
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
  background-color: white;
}
</style>
