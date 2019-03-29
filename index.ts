import { writeFileSync } from 'fs';
import { filter, map, chain, startsWith } from 'lodash';
import { Trie } from './trie';
import { Crossword } from './crossword';

const WORD_LENGTH = 5;
const wordsFile = './perfData';

const words = require(wordsFile);

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

// for a with <= max rows, this will check the columns for whether those words start to exi
function checkStartOfCrosswordColumns(crossword: Crossword) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const column = crossword.getColumn(i);
        if (!wordsTrie.containsArrayStart(column)) {
            return false;
        }
    }

    return true;
}

function checkStartOfCrosswordRows(crossword: Crossword) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const row = crossword.getRow(i);
        if (!wordsTrie.containsArrayStart(row)) {
            return false;
        }
    }
    return true;
}

const validCrosswords = [];

function validCrossword(crossword: Crossword) {
    const wordsInCrossword = crossword.getAllWords();
    const uniqueWords = new Set(wordsInCrossword).size;
    // crosswords that contain the same word multiple times are ignored
    if (uniqueWords === WORD_LENGTH * 2) {
        validCrosswords.push(crossword);
        console.log('Number of crosswords found:', validCrosswords.length);
        crossword.print();
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

function addWordToNextRow(crossword: Crossword, rowNumber: number) {
    const startOfRow = crossword.getRow(rowNumber);
    const filteredWords = wordsTrie.getWordsForStartingArray(startOfRow);
    // crossword.print();
    for (let i = 0; i < filteredWords.length; i++) {
        const rowWord = filteredWords[i];
        const nextCrossword = new Crossword(WORD_LENGTH, crossword);
        nextCrossword.setRow(rowWord, rowNumber);
        const check = checkStartOfCrosswordColumns(nextCrossword);
        if (!check) {
            continue;
        }
        if (rowNumber >= WORD_LENGTH - 1) {
            validCrossword(nextCrossword);
        } else {
            const nextNum = rowNumber;
            // this seems inefficient that the words words is never narrowed down
            // addWordToNextRow(nextCrossword, filteredWords, nextNum);
            addWordToNextColumn(nextCrossword, nextNum);
        }
    }
}

function addWordToNextColumn(crossword: Crossword, columnNumber: number) {
    const startOfColumn = crossword.getColumn(columnNumber);
    // crossword.print();
    const filteredWords = wordsTrie.getWordsForStartingArray(startOfColumn);
    for (let i = 0; i < filteredWords.length; i++) {
        const columnWord = filteredWords[i];
        const nextCrossword = new Crossword(WORD_LENGTH, crossword);
        nextCrossword.setColumn(columnWord, columnNumber);
        const check = checkStartOfCrosswordRows(nextCrossword);
        if (!check) {
            continue;
        }

        const nextNum = columnNumber + 1;
        // this seems inefficient that the words words is never narrowed down
        addWordToNextRow(nextCrossword, nextNum);
    }
}

for (let h = 0; h < wordsOfLength.length; h++) {
    if (h % 50 === 0) {
        console.log(`${h}/${wordsOfLength.length} starting words tested`);
    }
    const startingWord = wordsOfLength[h].cleanedWord;
    // const startingWord = 'merch';
    const crossword = new Crossword(WORD_LENGTH);
    crossword.setRow(startingWord.split(''), 0);
    addWordToNextColumn(crossword, 0);
}
