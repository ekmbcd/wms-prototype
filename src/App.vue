<template>
  <div class="full-height column">
    <div class="header row">
      <img src="logo.png" alt="logo" class="logo" />
    </div>
    <p class="title">{{ brainStore.abstract }}</p>
    <h1 v-if="brainStore.error" class="fullpage-text">
      AN ERROR HAS OCCURRED. PLEASE TRY AGAIN.
    </h1>
    <Transition v-else mode="out-in">
      <Suspense>
        <!-- component with nested async dependencies -->
        <div class="full-height flex-one" style="padding: 8px;">
          <Map />
        </div>

        <!-- loading state via #fallback slot -->
        <template #fallback>
          <h1>
            Loading...
          </h1>
        </template>
      </Suspense>
    </Transition>
    <div class="footer">
      Some important legal informations
    </div>
  </div>
</template>

<script setup>
import Map from './MapComponent.vue'
import './assets/base.css'
import { mapBrainStore } from './stores/mapBrain'

const brainStore = mapBrainStore()
</script>

<style scoped>
.fullpage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2em;
  text-align: center;
  color: #fff;
}
.header {
  padding: 12px 0px ;
  border-bottom: 1px solid rgb(68, 68, 68);
  gap: 16px;
  align-items: center;
  margin: 0 8px;
}
.logo {
  height: 32px;
  object-fit: cover; /* cover image */
  object-position: center; /* Center the image within the element */
}

.title {
  padding: 20px 8px 0  8px;
}
.footer {
  padding: 8px 0px 20px;
  border-top: 1px solid rgb(68, 68, 68);
  align-items: center;
  text-align: right;
  color: rgb(177, 177, 177);
  margin: 0 8px;
  font-size: 0.7rem;
  font-weight: 400;
}
</style>
