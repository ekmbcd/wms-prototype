<template>
  <div>

    <!-- POPUP -->
    <Transition name="fade">
      <div v-if="showLayersPopup" class="layers-popup absolute-center">
        <h3 class="layers-text">LAYERS</h3>
        <draggable
          class="wrapper full-width"
          v-model="brainStore.layers"
          @start="drag=true"
          @end="drag=false"
          item-key="id"
          handle=".handle"
          >

          <!-- LAYER ITEM -->
          <template #item="{element}">
            <div class="item">
              <div class="handle">
                <i class="material-icons drag-icon">drag_handle</i>
                <span>{{element.title}}</span>
              </div>
              <div class="layers-options row">
                <div class="flex-one row align-center spacer">
                  <span class="opacity-text">Opacity</span>
                  <input type="range" min="0" max="100" v-model="element.opacity" class="slider flex-one">
                </div>
                <div class="row align-center">
                  <label :for="element.title" class="material-icons vis-icon">visibility</label>
                  <div class="container" @click="element.active = !element.active">
                    <input type="checkbox" :checked="element.active" :id="element.title">
                    <span class="checkmark"></span>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </draggable>
        <p class="info-text">Drag and drop layers to change rendering order.</p>
      </div>
    </Transition>

    <!-- LAYERS BUTTON -->
    <div class="layers-button" @click="showLayersPopup = !showLayersPopup">
      <div>
        <i class="material-icons">layers</i>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { mapBrainStore } from './stores/mapBrain'

const brainStore = mapBrainStore()
const showLayersPopup = ref(false)
const drag = ref(false)

console.log(brainStore.layers)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.layers-popup {
  background: rgb(69, 77, 77);
  z-index: 200;
  width: 80%;
  max-width: 400px;
  border-radius: 4px;
}

.layers-button {
  position: absolute;
  top: 20px;
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

.layers-button div {
  background-color: #1a1a1a;
  height: 40px;
  width: 40px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.drag-icon {
  padding: 4px 12px;
}

.handle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.wrapper {
  padding: 8px;
  border-radius: 3px;
}
.wrapper .item {
  background: #1a1a1a;
  padding: 5px 0px;
  margin-bottom: 5px;
  border-radius: 3px;
  font-size: 0.8rem;
}
.wrapper .item:last-child {
  margin-bottom: 0;
}

.wrapper .item i{
  font-size: 18px;
  cursor: pointer;
}

.opacity-text {
  color: rgb(180, 180, 180);
  font-size: 0.8rem;
  margin-right: 10px;
}

.layers-options {
  background-color: #313131;
  padding: 10px;
  margin: 4px 4px 0px 4px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.vis-icon {
  font-size: 18px;
  color: rgb(210, 210, 210);
  margin-right: 8px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.spacer {
  margin-right: 20%;
}

.info-text {
  color: rgb(180, 180, 180);
  font-size: 0.7rem;
  margin-bottom: 10px;
  text-align: center;
}

.layers-text {
  margin-top: 8px;
  text-align: center;
}
</style>
