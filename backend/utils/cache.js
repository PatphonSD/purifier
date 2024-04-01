const NodeCache = require("node-cache")

const _cache = new NodeCache()

/**
 * 
 * @param {"on" | "off" | "auto"} state 
 */
const set = (state) => {
    _cache.set("state",state)
    console.log(get())
}

const get = () => {
    return _cache.get("state") || "off"
}

const cache = {
    set , get
}

module.exports = cache