const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@": __dirname, // points @/ to project root
};

module.exports = config;
