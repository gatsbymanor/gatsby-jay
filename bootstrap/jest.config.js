module.exports = {
  verbose: true,
  modulePathIgnorePatterns: [
    "node_modules/",
    ".cache/",
  ],
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "identity-obj-proxy"
  },
  setupFiles: [
    "./test/shim.js",
    "./test/jestSetup.js"
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"]
};
