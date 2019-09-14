let appVersion = require("electron").remote.app.getVersion()
let shell = require("electron").shell

const version = document.querySelector("#version")

version.innerHTML = appVersion

configureOpenRenderedLinksInDefaultBrowser()

function configureOpenRenderedLinksInDefaultBrowser() {
  const aAll = document.querySelectorAll("a")
  if (aAll && aAll.length) {
    aAll.forEach(function(a) {
      a.addEventListener("click", function(event) {
        if (event.target) {
          event.preventDefault()
          let link = event.target.href
          require("electron").shell.openExternal(link)
        }
      })
    })
  }
}
