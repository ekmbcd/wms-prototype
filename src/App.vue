<template>
  <div id="map"></div>
</template>

<script setup>
import L from 'leaflet'
import { onMounted } from 'vue'
import axios from 'axios'

function parseXml (xml, arrayTags) {
  let dom = null
  if (window.DOMParser) dom = (new DOMParser()).parseFromString(xml, 'text/xml')
  else if (window.ActiveXObject) {
    // eslint-disable-next-line no-undef
    dom = new ActiveXObject('Microsoft.XMLDOM')
    dom.async = false
    if (!dom.loadXML(xml)) throw Error(dom.parseError.reason + ' ' + dom.parseError.srcText)
  } else throw new Error('cannot parse xml string!')

  function parseNode (xmlNode, result) {
    if (xmlNode.nodeName === '#text') {
      const v = xmlNode.nodeValue
      if (v.trim()) result['#text'] = v
      return
    }

    const jsonNode = {}
    const existing = result[xmlNode.nodeName]
    if (existing) {
      if (!Array.isArray(existing)) result[xmlNode.nodeName] = [existing, jsonNode]
      else result[xmlNode.nodeName].push(jsonNode)
    } else {
      if (arrayTags && arrayTags.indexOf(xmlNode.nodeName) !== -1) result[xmlNode.nodeName] = [jsonNode]
      else result[xmlNode.nodeName] = jsonNode
    }

    if (xmlNode.attributes) for (const attribute of xmlNode.attributes) jsonNode[attribute.nodeName] = attribute.nodeValue

    for (const node of xmlNode.childNodes) parseNode(node, jsonNode)
  }

  const result = {}
  for (const node of dom.childNodes) parseNode(node, result)

  return result
}

axios.get('https://image.discomap.eea.europa.eu/arcgis/services/UrbanAtlas/UA_UrbanAtlas_2012/MapServer/WMSServer', { params: { request: 'getCapabilities', version: '1.3.0', service: 'WMS' } })
  .then(response => {
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(response.data, "text/xml");

    console.log(parseXml(response.data))
    // const layers = xmlDoc.getElementsByTagName("Layer");
    // const layerNames = [];
    // for (let i = 0; i < layers.length; i++) {
    //   layerNames.push(layers[i].getElementsByTagName("Name")[0].innerHTML);
    // }
    // console.log(layerNames);
  })
  .catch(error => {
    console.log(error)
  })

console.log(L)
onMounted(() => {
  const map = L.map('map').setView([51.505, -0.09], 13)
  // L.tileLayer(
  //   "https://image.discomap.eea.europa.eu/arcgis/services/UrbanAtlas/UA_UrbanAtlas_2012/MapServer/WMSServer?service=WMS&request=GetMap&version=1.3.0",
  //   {
  //     attribution:
  //       'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: "mapbox/streets-v11",
  //     tileSize: 512,
  //     zoomOffset: -1,
  //     accessToken:
  //       "pk.eyJ1IjoianBkZmJ2ZmJkZ3dwZHVjb2hmIiwiYSI6ImNsM2J2ZjZnMjBqaXAzam5yeXgycHJxcTEifQ.Jo9yZyLODxivwboB0ZsLUQ",
  //   }
  // ).addTo(map);

  L.tileLayer.wms('https://image.discomap.eea.europa.eu/arcgis/services/UrbanAtlas/UA_UrbanAtlas_2012/MapServer/WMSServer?', {
    layers: 'City_Boundary,Greater_City_Boundary,City__Boundary56962,Greater_City_Boundary6752'
  }).addTo(map)
})
</script>

<style scoped>
@import "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css";

#map {
  height: 80vh;
}
</style>
