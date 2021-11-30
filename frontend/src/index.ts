/// <reference types="svelte" />

import App from './components/App.svelte'
import { updateHallOfFame, initiate } from './Facade'

const app = new App({
  target: document.body
})

export default app

initiate()
updateHallOfFame()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
}
