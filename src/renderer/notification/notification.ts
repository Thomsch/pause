import { invoke } from '@tauri-apps/api/core'

document.querySelector('#resume')!.addEventListener('click', () => {
  invoke('resume')
})

document.querySelector('#postpone')!.addEventListener('click', () => {
  invoke('postpone')
})
