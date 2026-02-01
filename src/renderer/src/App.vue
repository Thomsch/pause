<script setup lang="ts">
import { ref, onMounted } from 'vue'

const duration = ref('30')
const running = ref(false)
const progress = ref(0)

function toggle(): void {
  if (running.value) {
    window.api.stopTimer()
    running.value = false
  } else {
    window.api.startTimer(Number(duration.value))
    running.value = true
  }
}

function isValidInput(): boolean {
  return /^[0-9]+$/.test(duration.value) && Number(duration.value) > 0
}

function openGitHub(): void {
  window.api.openExternal('https://github.com/Thomsch/pause')
}

onMounted(() => {
  window.api.onTimerUpdate((value: string) => {
    progress.value = Number(Number(value).toFixed(2))
  })
  window.api.onTimerStopped(() => {
    progress.value = 0
    running.value = false
  })
})
</script>

<template>
  <div class="controls">
    <input
      v-model="duration"
      type="text"
      maxlength="3"
      size="3"
      pattern="^[0-9]*$"
      :disabled="running"
      class="duration-input"
    />
    <label class="label">minutes of focus</label>
    <button class="toggle-btn" :disabled="!isValidInput()" @click="toggle">
      {{ running ? 'Stop' : 'Start' }}
    </button>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
  </div>
  <a class="github-link" href="https://github.com/Thomsch/pause" @click.prevent="openGitHub">
    Made with <span class="heart">&#9829;</span>
  </a>
</template>

<style scoped>
/* Spectre.css base: 20px root, 0.8rem body = 16px effective */
:deep(html) {
  font-size: 20px;
  line-height: 1.5;
}

* {
  font-family:
    -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.8rem;
  color: #3b4351;
}

.controls {
  display: flex;
  align-items: center;
  margin: 5vw 10vw 0 10vw;
}

.duration-input {
  display: inline-block;
  width: inherit;
  text-align: center;
  appearance: none;
  background: #fff;
  border: 0.05rem solid #bcc3ce;
  border-radius: 5px;
  color: #3b4351;
  font-size: 0.8rem;
  height: 1.8rem;
  line-height: 1.2rem;
  padding: 0.25rem 0.4rem;
  outline: none;
  transition:
    background 0.2s,
    border 0.2s,
    box-shadow 0.2s,
    color 0.2s;
}

.duration-input:focus {
  border-color: #02a4d3;
  box-shadow: 0 0 0 0.1rem rgba(2, 164, 211, 0.2);
}

.label {
  flex-grow: 2;
  margin-left: 0.4rem;
}

.toggle-btn {
  appearance: none;
  background: #02a4d3;
  border: 0.05rem solid #0293bc;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  height: 1.8rem;
  line-height: 1.2rem;
  padding: 0.25rem 0.4rem;
  outline: none;
  text-align: center;
  text-decoration: none;
  transition:
    background 0.2s,
    border 0.2s,
    box-shadow 0.2s,
    color 0.2s;
  user-select: none;
  white-space: nowrap;
}

.toggle-btn:focus {
  box-shadow: 0 0 0 0.1rem rgba(2, 164, 211, 0.2);
}

.toggle-btn:hover:not(:disabled) {
  background: #0290b8;
  border-color: #0280a3;
}

.toggle-btn:disabled {
  cursor: default;
  opacity: 0.5;
  pointer-events: none;
}

.progress-bar {
  margin: 15vh 10vw 0 10vw;
  height: 0.8rem;
  background: #eef0f3;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #02a4d3;
  transition: width 0.1s linear;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.github-link {
  position: fixed;
  bottom: 0.5rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.6rem;
  color: #acb3bf;
  text-decoration: none;
  cursor: pointer;
  transition:
    color 0.3s,
    transform 0.3s;
}

.github-link .heart {
  display: inline-block;
  transition: color 0.3s;
}

.github-link:hover {
  color: #02a4d3;
  transform: translateY(-2px);
}

.github-link:hover .heart {
  color: #02a4d3;
  animation: heartbeat 0.8s ease-in-out;
}
</style>
