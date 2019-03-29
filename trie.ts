function NodeChild(data) {
    this.data = data;
    this.isWord = false;
    this.prefixes = 0;
    this.children = {};
}

export function Trie() {
    this.root = new NodeChild('');
}

Trie.prototype.add = function(word) {
    if (!this.root) {
        return null;
    }
    this._addNode(this.root, word);
};
Trie.prototype._addNode = function(node, word) {
    if (!node || !word) {
        return null;
    }
    node.prefixes++;
    var letter = word.charAt(0);
    var child = node.children[letter];
    if (!child) {
        child = new NodeChild(letter);
        node.children[letter] = child;
    }
    var remainder = word.substring(1);
    if (!remainder) {
        child.isWord = true;
    }
    this._addNode(child, remainder);
};

Trie.prototype.contains = function(word) {
    if (!this.root) {
        return false;
    }
    return this._contains(this.root, word);
};
Trie.prototype._contains = function(node, word) {
    if (!node || !word) {
        return false;
    }
    var letter = word.charAt(0);
    var child = node.children[letter];
    if (child) {
        var remainder = word.substring(1);
        if (!remainder && child.isWord) {
            return true;
        } else {
            return this._contains(child, remainder);
        }
    } else {
        return false;
    }
};

function sliceFirst(base) {
    var newArray = [];
    for (var i = 1; i < base.length; i++) {
        newArray[i - 1] = base[i];
    }
    return newArray;
}

Trie.prototype.containsArray = function(word) {
    return this._containsArray(this.root, word);
};
Trie.prototype._containsArray = function(node, word) {
    var child = node.children[word[0]];
    if (child) {
        const newArray = sliceFirst(word);
        if (newArray.length === 0 && child.isWord) {
            return true;
        } else {
            return this._containsArray(child, newArray);
        }
    } else {
        return false;
    }
};

Trie.prototype.containsArrayStart = function(word) {
    return this._containsArrayStart(this.root, word);
};
Trie.prototype._containsArrayStart = function(node, word) {
    var child = node.children[word[0]];
    if (child) {
        const newArray = sliceFirst(word);
        if (newArray.length === 0) {
            return true;
        } else {
            return this._containsArrayStart(child, newArray);
        }
    } else {
        return false;
    }
};

Trie.prototype.countWords = function() {
    if (!this.root) {
        return console.log('No root node found');
    }
    var queue = [this.root];
    var counter = 0;
    while (queue.length) {
        var node = queue.shift();
        if (node.isWord) {
            counter++;
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    return counter;
};
Trie.prototype.getWords = function() {
    var words = [];
    var word = '';
    this._getWords(this.root, words, word);
    return words;
};

Trie.prototype._getWords = function(node, words, word) {
    for (var child in node.children) {
        if (node.children.hasOwnProperty(child)) {
            word += child;
            if (node.children[child].isWord) {
                words.push(word);
            }
            this._getWords(node.children[child], words, word);
            word = word.substring(0, word.length - 1);
        }
    }
};

Trie.prototype.getWordsForStartingArray = function(start: Array<string>) {
    const words = [];
    const word = start;
    let node = this.root;
    for (let i = 0; i < start.length; i++) {
        if (!node.children[start[i]]) {
            break;
        }
        node = node.children[start[i]];
    }
    this._getWordsForStartingArray(node, words, word);
    return words;
};
Trie.prototype._getWordsForStartingArray = function(node, words, word) {
    for (var child in node.children) {
        if (node.children.hasOwnProperty(child)) {
            const newWord = [...word, child];
            if (node.children[child].isWord) {
                words.push(newWord);
            }
            this._getWordsForStartingArray(
                node.children[child],
                words,
                newWord
            );
        }
    }
};

Trie.prototype.printByLevel = function() {
    if (!this.root) {
        return console.log('No root node found');
    }
    var newline = new NodeChild('\n');
    var queue = [this.root, newline];
    var string = '';
    while (queue.length) {
        var node = queue.shift();
        string += node.data.toString() + (node.data !== '\n' ? ' ' : '');
        if (node === newline && queue.length) {
            queue.push(newline);
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    console.log(string.trim());
};

Trie.prototype.print = function() {
    if (!this.root) {
        return console.log('No root node found');
    }
    var newline = new NodeChild('|');
    var queue = [this.root, newline];
    var string = '';
    while (queue.length) {
        var node = queue.shift();
        string += node.data.toString() + ' ';
        if (node === newline && queue.length) {
            queue.push(newline);
        }
        for (var child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                queue.push(node.children[child]);
            }
        }
    }
    console.log(string.slice(0, -2).trim());
};

var trie = new Trie();
trie.add('one');
trie.add('otf');
trie.add('otb');
trie.add('atb');
// console.log(trie.getWordsForStartingArray(['o']));
// trie.add('two');
// trie.add('fifth');
// trie.add('fifty');
// trie.printByLevel();
