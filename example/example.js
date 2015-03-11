var confetti = require('..');

var original = {
  key1: "val1",
  key2: ["{{key1}}", "{{key1}}!!!"],
  key3: {
    "key4": "{{key1}}.{{key1}}",
    "{{key1}}": "{{key1}}",
    "{{key1}}!!!": "{{key2}}",
    "{{key1}}.{{key1}}": "{{key3.key4}}",
    "{{key3.val1}}.{{key1}}": "{{does.not.exist}}"
  }
};
var resolved = confetti(original);

console.log(resolved);