export class Crossword {
    crossword: Array<Array<string>>;
    wordLength: number;

    constructor(wordLength: number, crossword?: Crossword) {
        this.crossword = [];
        this.wordLength = wordLength;
        if (!crossword) {
            for (let i = 0; i < wordLength; i++) {
                const row = [];
                for (let j = 0; j < wordLength; j++) {
                    row.push('');
                }
                this.crossword.push(row);
            }
        } else {
            const theCrossword = crossword.crossword;
            for (let i = 0; i < wordLength; i++) {
                const row = [];
                for (let j = 0; j < wordLength; j++) {
                    row.push(theCrossword[i][j]);
                }
                this.crossword.push(row);
            }
        }
    }

    setRow = (newRow: Array<string>, rowNum: number) => {
        const newNewRow = [...newRow];
        this.crossword = [
            ...this.crossword.slice(0, rowNum),
            newNewRow,
            ...this.crossword.slice(rowNum + 1),
        ];
    };

    setColumn = (newColumn: Array<string>, columnNum: number) => {
        const newNewColumn = [...newColumn];
        for (let i = 0; i < this.wordLength; i++) {
            for (let j = 0; j < this.wordLength; j++) {
                if (j === columnNum) {
                    this.crossword[i][j] = newColumn[i];
                }
            }
        }
    };

    getColumn = (columnNum: number): Array<string> => {
        const column = [];
        for (let i = 0; i < this.wordLength; i++) {
            for (let j = 0; j < this.wordLength; j++) {
                if (j === columnNum) {
                    const letter = this.crossword[i][j];
                    if (!letter) {
                        return column;
                    }
                    column.push(letter);
                }
            }
        }
        return column;
    };

    getRow = (rowNum: number): Array<string> => {
        const row = [];
        for (let i = 0; i < this.wordLength; i++) {
            const letter = this.crossword[rowNum][i];
            if (!letter) {
                return row;
            }
            row.push(letter);
        }
        return row;
    };

    getAllWords = () => {
        const words = [];
        for (let i = 0; i < this.crossword.length; i++) {
            const word = this.crossword[i].join('');
            words.push(word);
        }
        for (let i = 0; i < this.crossword.length; i++) {
            let word = '';
            for (let j = 0; j < this.crossword.length; j++) {
                word += this.crossword[j][i];
            }
            words.push(word);
        }
        return words;
    };

    print = () => {
        for (let i = 0; i < this.wordLength; i++) {
            console.log(this.crossword[i].join(' '));
        }
    };
}
