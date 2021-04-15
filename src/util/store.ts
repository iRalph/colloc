let store = {
  file: {} as {[k: string]: string}
}

try {
  store = JSON.parse(localStorage.getItem('store'))
} catch {}

const queue = new WeakSet()
const handle = {
  get(target: any, k: any) {
    let v = target[k]
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = target[k] = new Proxy(v, handle)
      queue.add(v)
    }
    return v
  },

  set(target: any, k: any, v: any) {
    if (target[k] === v) return true
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = new Proxy(v, handle)
      queue.add(v)
    }

    target[k] = v
    localStorage.setItem('store', JSON.stringify(store))
    return true
  }
}

export default new Proxy<typeof store>(store, handle)