// Round-trip a JavaScript value through `JSON.stringify()` and `JSON.parse()`
// in order to compare it against server responses.
//
// Certain value types would otherwise result in failed comparisons.
// Date objects for instance are serialized into strings in JSON.
// However, strings in JSON are never parsed back into Date objects.

function jsonify(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = jsonify;
