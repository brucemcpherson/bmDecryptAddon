
/**
 * used to expose members of a namespace
 * @param {string} namespace name
 * @param {method} method name
 */
var exposeRun = (namespace, method, ...argArray) => {

  // I'm using whitelisting to ensure that only namespaces 
  // authorized to be run from the client are enabled
  // why? to avoid mistakes, or potential poking somehow from the dev tools
  const whitelist = [{
    namespace: "Server",
    methods: [
      "getActiveSpec",
      "decrypt",
      "getAllEncryptedColumns"
    ]
  }, {
    namespace: null,
    methods: ["globalTest"]
  }];

  // check allowed
  if (whitelist && !whitelist.some(d =>
    namespace === d.namespace &&
    (!d.methods || d.methods.some(e => e === method))
  )) {
    throw (namespace || "this") + "." + method + " is not whitelisted to be run from the client";
  }

  const func = (namespace ? this[namespace][method] : this[method]);

  if (typeof func !== 'function') {
    throw (namespace || "this") + "." + method + " should be a function";
  }
  return func(...argArray)

}


