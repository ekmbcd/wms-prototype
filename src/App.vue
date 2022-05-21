<template>
  <div id="map"></div>
</template>

<script setup>
import 'ol/ol.css'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import { Tile as TileLayer } from 'ol/layer'
import TileWMS from 'ol/source/TileWMS'
import View from 'ol/View'
import { onMounted } from 'vue'
import { mapBrainStore, SERVER_URL } from './stores/mapBrain'

const mapBrain = mapBrainStore()

mapBrain.init()

let currentZoom = 0

onMounted(() => {
  const layers = [
    // world map
    new TileLayer({
      source: new OSM()
    }),
    // wsm layers
    new TileLayer({
      source: new TileWMS({
        url: SERVER_URL,
        params: { LAYERS: 'Land_Use_vector52160' }
        // params: { LAYERS: mapBrain.layersString }
      })
    })
  ]
  const map = new Map({
    layers,
    target: 'map',
    view: new View({
      center: [0, 0],
      zoom: 4
    })
  })

  map.on('moveend', () => {
    const newZoom = map.getView().getZoom()
    // zoom event
    if (newZoom !== currentZoom) {
      currentZoom = newZoom
      console.log(map.getView().getResolution())
      mapBrain.setLayersString(map.getView().getResolution())
    }
  })
})

</script>

<style scoped>

#map {
  width: 100%;
  height: 80vh;
}
</style>
