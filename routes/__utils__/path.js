function path(prefix) {
  return function append(suffix) {
    return prefix + suffix;
  };
}

module.exports = path;
