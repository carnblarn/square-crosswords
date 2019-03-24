import { writeFileSync } from 'fs';
import { filter, map, chain } from 'lodash';
import { Trie } from './trie';

const WORD_LENGTH = 5;
const wordsFile = './perfdata';

const words = require(wordsFile);

type crossword = Array<Array<string>>; // [['a', 'a', 'a'], ['b', 'b', 'b'], ['c', 'c', 'c']]

function cleanWord(word: string) {
    let newWord = word.toLowerCase();
    newWord = newWord.replace(' ', '');
    return newWord;
}

const wordsSet = new Set();

const wordsOfLength = chain(words)
    .filter(word => {
        const cleaned = cleanWord(word);
        if (wordsSet.has(cleaned)) {
            return false;
        }
        wordsSet.add(cleanWord(word));
        return true;
    })
    .map(word => {
        return {
            originalWord: word,
            cleanedWord: cleanWord(word),
        };
    })
    .value();

let wordsTrie = new Trie();
for (let i = 0; i < wordsOfLength.length; i++) {
    wordsTrie.add(wordsOfLength[i].cleanedWord);
}

function checkCrosswordStart(crosswordInProgress: crossword) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const startOfWord = [];
        for (let j = 0; j < crosswordInProgress.length; j++) {
            startOfWord.push(crosswordInProgress[j][i]);
        }
        if (!wordsTrie.containsArrayStart(startOfWord)) {
            return false;
        }
    }

    return true;
}

function getWordsForCrossword(crossword: crossword) {
    const words = [];
    for (let i = 0; i < crossword.length; i++) {
        const word = crossword[i].join('');
        words.push(word);
    }
    for (let i = 0; i < crossword.length; i++) {
        let word = '';
        for (let j = 0; j < crossword.length; j++) {
            word += crossword[j][i];
        }
        words.push(word);
    }
    return words;
}
const validCrosswords = [];

function validCrossword(crossword: crossword) {
    const wordsInCrossword = getWordsForCrossword(crossword);
    const uniqueWords = new Set(wordsInCrossword).size;
    // crosswords that contain the same word multiple times are ignored
    if (uniqueWords === WORD_LENGTH * 2) {
        validCrosswords.push(crossword);
        console.log('Number of crosswords found:', validCrosswords.length);
        console.log(crossword);
        const exports = {
            crosswords: validCrosswords,
        };
        writeFileSync(
            `crosswords${WORD_LENGTH}.json`,
            JSON.stringify(exports),
            'utf8'
        );
    }
}

function testColumn(crossword: crossword, columnWords, columnNum: number) {
    for (let i = 0; i < columnWords[columnNum].length; i++) {
        const columnWord = columnWords[columnNum][i];
        const nextCrossword = [...crossword, columnWord];
        const check = checkCrosswordStart(nextCrossword);

        if (!check) {
            continue;
        }
        if (columnNum >= WORD_LENGTH - 1) {
            validCrossword(nextCrossword);
        } else {
            const nextNum = columnNum + 1;
            testColumn(nextCrossword, columnWords, nextNum);
        }
    }
}

for (let h = 0; h < wordsOfLength.length; h++) {
    if (h % 50 === 0) {
        console.log(`${h}/${wordsOfLength.length} starting words tested`);
    }
    const startingWord = wordsOfLength[h].cleanedWord;
    const crossword = [startingWord.split('')];
    const columnWords = [];
    for (let i = 0; i < crossword[0].length; i++) {
        const topLetter = crossword[0][i];
        const wordsInThatColumn = map(
            filter(
                wordsOfLength,
                ({ cleanedWord }) =>
                    cleanedWord.substr(0, 1) === topLetter &&
                    cleanedWord !== startingWord
            ),
            ({ cleanedWord }) => cleanedWord.split('')
        );
        columnWords.push(wordsInThatColumn);
    }

    testColumn([], columnWords, 0);
}
