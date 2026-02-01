export {}

declare global {
  interface Window {
    notificationApi: {
      resume: () => void
      postpone: () => void
    }
  }
}

document.querySelector('#resume')!.addEventListener('click', () => {
  window.notificationApi.resume()
})

document.querySelector('#postpone')!.addEventListener('click', () => {
  window.notificationApi.postpone()
})
