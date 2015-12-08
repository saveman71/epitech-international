'use strict';

/**
 * Transform an array of hash to some hash, using specified key as identifier.
 * toHash([{id:1, a: "lol"}], "id") == {1: {id:1, a: "lol"}}
 *
 * Linearize key can remove the hash structure entirely, using the specified key as a value.
 * toHash([{id:1, a: "lol"}], "id", "a") == {1: "lol"}
 */
var toHash = function(arr, prop, linearizeKey) {
    var hash = {};

    arr.forEach(function(e) {
        var key = e[prop].toString();
        if(linearizeKey) {
            e = e[linearizeKey];
        }

        hash[key] = e;
    });

    return hash;
};

module.exports = toHash;
