
# Square Crossword Maker
![drake meme](https://i.imgur.com/FkXN7j2.jpg)

Crossword makers on the web take in a small list of words and create crosswords that contain all the words. Because all the words have to be used, the number of intersection points is usually very small and the generated crosswords look very amateur-ish compared to what you'd find in a publication like the New York Times.

This program does something a little differnet. It takes in a word list of any size, and will try to find all the perfect square crosswords from them. Notably, they're not even guaranteed to exist, so it requires many more words to be passed in than other crossword makers. 

## How to Use
- Create a word list file. The program accepts a json input with an array of words, like how `testData.json` is modeled in the repo. The program will automatically clean the words, so don't worry about removing spaces or making them all lowercase. Do make sure all the words of the same length, however.
- In `index.ts` change the value of `wordsFile` to be the name of the file that you created. Change the value of `WORD_LENGTH` to be the desired length.
- Run `index.ts`. The program will output any found crosswords to the console and save them to a `crosswords.json` file when every successful one is found

## Notes
- Because of the nature of the recursion in here, the run-time performance is `O(pretty bad)`. From my experience word lists of about 5000-6000 were ideal and anything much longer than 10000 will take too long to finish. The algorithm is much faster than a brute-force attempt, but it's still a tedious process to test this many words.
