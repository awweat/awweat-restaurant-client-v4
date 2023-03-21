export const attrParser = (els, key) => {
  let elFixed = []
  // if (el.id) elFixed.id = el.id
  if (!Array.isArray(els)) {
    if (key === 'image' && els) return els.attributes
  }
  if (!els) {
    return
  }
  els.map(function (key, index) {
    if (els[index].id) {
      elFixed[index] = { ...parser(els[index].attributes) }
      elFixed[index].id = els[index].id
    }
  })
  return elFixed
}

export const parser = (el) => {
  let res = {}
  let keys = Object.keys(el)
  for (let i = 0; i < keys.length; i++) {
    const element = el[keys[i]]
    if (typeof element != 'object') {
      res[keys[i]] = element
    } else {
      if (keys[i] === 'optionSets') {
        res[keys[i]] = element
      } else {
        if (element) res[keys[i]] = attrParser(element.data, keys[i])
      }
    }
  }
  return res
}
