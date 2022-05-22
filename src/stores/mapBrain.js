import { defineStore } from 'pinia'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import ImageWMS from 'ol/source/ImageWMS'
import axios from 'axios'

export const SERVER_URL = 'https://image.discomap.eea.europa.eu/arcgis/services/UrbanAtlas/UA_UrbanAtlas_2012/MapServer/WMSServer'

export const mapBrainStore = defineStore({
  id: 'mapBrain',
  state: () => ({
    layers: [],
    layersString: '',
    abstract: '',
    legendURL: '',
    extent: [],
    error: false
  }),
  getters: {
  },
  actions: {

    async init () {
      try {
        const parser = new WMSCapabilities()
        const response = await axios.get(
          SERVER_URL,
          { params: { request: 'getCapabilities', version: '1.3.0', service: 'WMS' } }
        )
        const result = parser.read(response.data)
        console.log('parse', result)

        this.abstract = result.Service.Abstract
        this.layers = []

        // group layers of the same type together
        for (const layer of result.Capability.Layer.Layer) {
          // the response's layers titles are not consistent, so this is messier than it should be
          const layerInfo = this.layers.find(l => {
            const cleanString = layer.Title.replace('  ', ' ').replaceAll('_', ' ')
            return l.title.substring(0, 8) === cleanString.substring(0, 8)
          }) || {}

          // layerInfo is empty
          if (!layerInfo.title) {
            // clean the title
            layerInfo.title = layer.Title.replace('  ', ' ').replaceAll('_', ' ')
              .replace(' Vector', '').replace(' Raster', '')
            layerInfo.layers = []
            layerInfo.opacity = '100'
            layerInfo.active = true
          }
          // not all layers have an abstract
          if (!layerInfo.abstract) {
            layerInfo.abstract = layer.Abstract
          }

          layerInfo.layers.push(layer.Name)
          if (layerInfo.layers.length === 1) {
            this.layers.push(layerInfo)
          }
        }
        console.log('layers', this.layers)

        // extent to be used for the map
        this.extent = result.Capability.Layer.EX_GeographicBoundingBox

        // contains all layers as a comma separated string
        const allLayers = this.layers.reduce((acc, l) => acc.concat(l.layers), []).join(',')

        // get the legend image url
        const wmsSource = new ImageWMS({
          url: SERVER_URL,
          params: {
            LAYERS: allLayers
          }
        })
        this.legendURL = wmsSource.getLegendUrl()
      } catch (e) {
        console.error(e)
      }
    }
    // // returns a string of the active layers with the right scaleDenominator
    // setLayersString (resolution) {
    //   const layersString = this.activeLayers.map(layerGroup => {
    //     let layerName = ''
    //     for (const layer of layerGroup.layers) {
    //       if ((!layer.maxScale || layer.maxScale >= resolution) &&
    //             (!layer.minScale || layer.minScale <= resolution)) {
    //         layerName = layer.name
    //         break
    //       }
    //     }
    //     return layerName
    //   }).join(',')
    //   console.log('eee', layersString)
    //   this.layersString = layersString
    // }
  }
})
