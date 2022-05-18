<template>
  <div>test</div>
   <div id="map"></div>
</template>

<script setup>
import L from 'leaflet'

console.log(L)
setTimeout(() => {
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);
}, 1000)


</script>

<style scoped>
#map { height: 180px; }

</style>
