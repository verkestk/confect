var confect = require('..');
var expect = require('chai').expect;

describe('original config object', function() {

  it('should not be modified', function() {

    var original = {
      key1: "val1",
      key2: ["{{key1}}", "{{key1}}!!!"],
      key3: {
        "key4": "{{key1}}.{{key1}}",
        "{{key1}}": "{{key1}}",
        "{{key1}}!!!": "{{key2}}",
        "{{key1}}.{{key1}}": "{{key3.key4}}"
      }
    };

    var originalCopy = {
      key1: "val1",
      key2: ["{{key1}}", "{{key1}}!!!"],
      key3: {
        "key4": "{{key1}}.{{key1}}",
        "{{key1}}": "{{key1}}",
        "{{key1}}!!!": "{{key2}}",
        "{{key1}}.{{key1}}": "{{key3.key4}}"
      }
    };

    confect.resolve(original);
    expect(original).to.deep.equal(originalCopy);
  });
});

describe('config object with no substitutions', function() {

  it('should resolve to an exact copy of the original object', function() {

    var original = {
      key1: "val1",
      key2: ["a", "b", "c", "", "z", "y", "x"],
      key3: {
        "a": "A",
        "b": "B",
        "c": "C",
        "": "",
        "z": "Z",
        "y": "Y",
        "x": "X"
      }
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(original);
  });
});

describe('config object with variable substitutions', function() {

  it('should have full substitutions of strings correctly replaced', function() {
    var original = {
      key1: "val1",
      key2: "{{key1}}"
    };
    var expected = {
      key1: "val1",
      key2: "val1"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of ints correctly replaced', function() {
    var original = {
      key1: 100,
      key2: "{{key1}}"
    };
    var expected = {
      key1: 100,
      key2: 100
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of arrays correctly replaced', function() {
    var original = {
      key1: ["val1", 100],
      key2: "{{key1}}"
    };
    var expected = {
      key1: ["val1", 100],
      key2: ["val1", 100]
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of objects correctly replaced', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      key2: "{{key1}}"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      key2: {
        key1a: "val1",
        key1b: 100
      }
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of deep references correctly replaced', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      key2: "{{key1.key1a}}",
      key3: "{{key1.key1b.key1b2}}"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      key2: "val1",
      key3: "val3"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of strings correctly replaced', function() {
    var original = {
      key1: "val1",
      key2: "{{key1}}!!!"
    };
    var expected = {
      key1: "val1",
      key2: "val1!!!"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of ints correctly replaced', function() {
    var original = {
      key1: 100,
      key2: "{{key1}}0",
      key3: "{{key1}}!",
    };
    var expected = {
      key1: 100,
      key2: "1000",
      key3: "100!"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore partial substitutions of arrays', function() {
    var original = {
      key1: ["val1", 100],
      key2: "{{key1}}!!!"
    };
    var expected = {
      key1: ["val1", 100],
      key2: "{{key1}}!!!"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore partial substitutions of objects', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      key2: "{{key1}}!!!"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      key2: "{{key1}}!!!"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of deep references correctly replaced', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      key2: "{{key1.key1a}}!!!",
      key3: "{{key1.key1b.key1b2}}!!!"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      key2: "val1!!!",
      key3: "val3!!!"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have compound substitutions correctly replaced', function() {

    var original = {
      key1: "val1",
      key2: 100,
      key3: {
        key3a: "val2",
        key3b: 5,
      },
      key4: "{{key1}}.{{key3.key3a}}",
      key5: "{{key2}}.{{key3.key3b}}"
    };

    var expected = {
      key1: "val1",
      key2: 100,
      key3: {
        key3a: "val2",
        key3b: 5,
      },
      key4: "val1.val2",
      key5: "100.5"
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore references to nonexistant values', function() {

    var original = {
      key1: "val1",
      key2: {
        key2a: "val2"
      },
      key3: "{{does.not.exist}}",
      key4: "{{key2a}}"
    };

    var expected = {
      key1: "val1",
      key2: {
        key2a: "val2"
      },
      key3: "{{does.not.exist}}",
      key4: "{{key2a}}"
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });
});

describe('config object with key substitutions', function() {

  it('should have full substitutions of strings correctly replaced', function() {
    var original = {
      key1: "val1",
      "{{key1}}": "val2" 
    };
    var expected = {
      key1: "val1",
      val1: "val2"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of ints correctly replaced', function() {
    var original = {
      key1: 100,
      "{{key1}}": 5
    };
    var expected = {
      key1: 100,
      "100": 5
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore full substitutions of arrays', function() {
    var original = {
      key1: ["val1", 100],
      "{{key1}}": "val2"
    };
    var expected = {
      key1: ["val1", 100],
      "{{key1}}": "val2"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore full substitutions of objects', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      "{{key1}}": "val2"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      "{{key1}}": "val2"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have full substitutions of deep references correctly replaced', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      "{{key1.key1a}}": "val4",
      "{{key1.key1b.key1b2}}": "val5"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      val1: "val4",
      val3: "val5"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of strings correctly replaced', function() {
    var original = {
      key1: "val1",
      "{{key1}}!!!": "val2"
    };
    var expected = {
      key1: "val1",
      "val1!!!": "val2"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of ints correctly replaced', function() {
    var original = {
      key1: 100,
      "{{key1}}0": 1,
      "{{key1}}!": 2,
    };
    var expected = {
      key1: 100,
      "1000": 1,
      "100!": 2
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore partial substitutions of arrays', function() {
    var original = {
      key1: ["val1", 100],
      "{{key1}}!!!": 1
    };
    var expected = {
      key1: ["val1", 100],
      "{{key1}}!!!": 1
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore partial substitutions of objects', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      "{{key1}}!!!": "val2"
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: 100
      },
      "{{key1}}!!!": "val2"
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have partial substitutions of deep references correctly replaced', function() {
    var original = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      "{{key1.key1a}}!!!": 1,
      "{{key1.key1b.key1b2}}!!!": 2
    };
    var expected = {
      key1: {
        key1a: "val1",
        key1b: {
          key1b1: "val2",
          key1b2: "val3",
        }
      },
      "val1!!!": 1,
      "val3!!!": 2
    };
    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should have compound substitutions correctly replaced', function() {

    var original = {
      key1: "val1",
      key2: 100,
      key3: {
        key3a: "val2",
        key3b: 5,
      },
      "{{key1}}.{{key3.key3a}}": 1,
      "{{key2}}.{{key3.key3b}}": 2
    };

    var expected = {
      key1: "val1",
      key2: 100,
      key3: {
        key3a: "val2",
        key3b: 5,
      },
      "val1.val2": 1,
      "100.5": 2
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

  it('should ignore references to nonexistant values', function() {

    var original = {
      key1: "val1",
      key2: {
        key2a: "val2"
      },
      "{{does.not.exist}}": 1,
      "{{key2a}}": 2
    };

    var expected = {
      key1: "val1",
      key2: {
        key2a: "val2"
      },
      "{{does.not.exist}}": 1,
      "{{key2a}}": 2
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });
});

describe('config object with complex substitutions', function() {

  it('should handle multiple levels of indirection', function() {
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

    var expected = {
      key1: "val1",
      key2: ["val1", "val1!!!"],
      key3: {
        "key4": "val1.val1",
        "val1": "val1",
        "val1!!!": ["val1", "val1!!!"],
        "val1.val1": "val1.val1",
        "val1.val1": "{{does.not.exist}}"
      }
    };

    var resolved = confect.resolve(original);
    expect(resolved).to.deep.equal(expected);
  });

});