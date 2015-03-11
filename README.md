# confect

> a configuration object manager

Confect is a configruation object manager for Java Script. It has one party trick: supporting configuration value inheritance. Any configuration property can inherit the value from another property.

## Installation

```sh
$ npm install confect
```

## Usage

```javascript
var confect = require('..');

var config = {
	src: "./app/src",

	styles: {
		src: "{{src}}/styles"
		less: {
			src: "{{styles.src}}/less"
		}
	},
};

var confection = confect(config);
```

That would result in the following object:

```javascript
{
	src: "./app/src",

	styles: {
		src: "./app/src/styles"
		less: {
			src: "./app/src/styles/less"
		}
	},
}

```

Confect is fairly powerful and let's you do many sorts of config value inheritance - not just on values, but also on keys:

```javascript
var config = {
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
```

Which would resolve to:

```javascript
{
    key1: "val1",
    key2: ["val1", "val1!!!"],
    key3: {
        "key4": "val1.val1",
        "val1": "val1",
        "val1!!!": ["val1", "val1!!!"],
        "val1.val1": "val1.val1",
        "val1.val1": "{{does.not.exist}}"
    }
}
```

### What doesn't it do?

* It does not support combining values in any way except string concatenation.
* It does not support using array or object values in key inheritance.
* It does not support cyclical relationships - don't even try!

## Wish List

If you'd like to contribute to this library, here are some things that would be cool.

* config object merging
  * should do a merge *before* resolving inherited values
* resolution against a JSON file rather than a javascript object
  * JSON format could include a property for inheriting from another JSON file (see config object merging)