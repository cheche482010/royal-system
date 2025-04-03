<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      <div class="toast-icon">
        <CheckCircleIcon v-if="type === 'success'" class="icon" />
        <XCircleIcon v-if="type === 'error'" class="icon" />
        <InfoIcon v-if="type === 'info'" class="icon" />
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <button class="toast-close" @click="close">
        <XIcon class="close-icon" />
      </button>
    </div>
  </transition>
</template>

<script src="./Toast.js"></script>
<style scoped src="./Toast.scss" lang="scss"></style>