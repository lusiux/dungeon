export function onEnter (handler: (event: any) => void) {
    return (event: any) => {
      if (event.keyCode !== 13) return
  
      event.preventDefault()
      handler(event)
    }
  }