const bibleJson = require('./bible');
function jsonToExample({bible}) {
    const books = bible.b;
    return books.flatMap((book, i) => {
        const bookName = book.$.n;
        const listofChapters = book.c;
        return listofChapters.flatMap(chapter => {
            const chapterNumber = chapter.$.n;
            const listofVerses = chapter.v;
            return listofVerses.flatMap(verse => {
                return {
                    ari: `${i}:${chapterNumber}:${verse.$.n}`,
                    name: `${bookName} ${chapterNumber}:${verse.$.n}`,
                    verse: verse._
                }
            });
        });
    });
}
const bible = jsonToExample(bibleJson)

saveFileJson = (bible) => {
    const fs = require('fs');
    fs.writeFile('parsedBible.json', JSON.stringify(JSON.parse(bible)), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
saveFileJson(bible)
