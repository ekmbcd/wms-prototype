<template>
  <div>

    <!-- POPUP -->
    <Transition name="fade">
      <div v-if="showLegendPopup" class="legend-popup">
      <div class="close-button" @click="showLegendPopup = false">
          <i class="material-icons">close</i>
        </div>
        <h3 class="text-center">LEGEND</h3>
        <img :src="mapbrain.legendURL" alt="legend">
      </div>
    </Transition>

    <!-- LAYERS BUTTON -->
    <div class="legend-button" @click="showLegendPopup = !showLegendPopup">
      <div>
        <i class="material-icons">legend_toggle</i>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mapBrainStore } from './stores/mapBrain'

const mapbrain = mapBrainStore()
const showLegendPopup = ref(false)

</script>

<style scoped>
.legend-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 8px;
  background: rgba(255,255,255,0.4);
  padding: 2px;
  border-radius: 4px;
  color: #fff;
  z-index: 100;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.legend-button div {
  background-color: #1a1a1a;
  height: 40px;
  width: 40px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.legend-popup {
  background: rgb(69, 77, 77);
  z-index: 200;
  width: 80%;
  max-width: 400px;
  border-radius: 4px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px;
}
</style>
