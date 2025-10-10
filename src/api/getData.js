import { openDb } from "./connectDb.js";
import { requiresTagCleaning, getBibleMap } from "../config/bibleConfig.js";

const BIBLE_MAP = getBibleMap();
const DEFAULT_BIBLE = "kdsh";

export let openedDb = null;
export let selectedBibleName = null;

export async function selectBible(name) {
  const bibleName = name?.toLowerCase() || DEFAULT_BIBLE;
  
  if (openedDb && selectedBibleName === bibleName) {
    return openedDb;
  }
  
  if (openedDb) {
    try {
      openedDb.close();
    } catch (error) {
      console.warn("⚠️ Error closing previous database:", error);
    }
  }
  
  const bible = BIBLE_MAP[bibleName] || BIBLE_MAP[DEFAULT_BIBLE];
  
  try {
    console.log(`📥 Loading bible: ${bibleName.toUpperCase()}...`);
    const bibleModule = await bible.loader();
    const bibleFile = bibleModule.default;
    
    openedDb = await openDb(bibleFile);
    selectedBibleName = bible.name;
    console.log(`✅ Bible loaded: ${selectedBibleName.toUpperCase()}`);
    return openedDb;
  } catch (error) {
    console.error(`❌ Error opening bible ${bibleName}:`, error);
    throw error;
  }
}

export function closeDb() {
  if (!openedDb) return;
  
  try {
    openedDb.close();
    console.log("🔒 Database closed");
  } catch (error) {
    console.error("❌ Error closing database:", error);
  }
}

async function ensureDbOpen(bibleName = null) {
  if (!openedDb || (bibleName && bibleName !== selectedBibleName)) {
    await selectBible(bibleName || selectedBibleName || DEFAULT_BIBLE);
  }
  return openedDb;
}

export async function getBibleAsJson(bibleName) {
  const db = await ensureDbOpen(bibleName);
  
  if (!db) {
    console.error("❌ Could not open database");
    return [];
  }
  
  try {
    const query = `
      SELECT 
        books.book_number || ':' || verses.chapter || ':' || verses.verse as ari,
        books.long_name || ' ' || verses.chapter || ':' || verses.verse as name,
        verses.text as verse 
      FROM books 
      INNER JOIN verses ON books.book_number = verses.book_number 
      ORDER BY books.book_number, verses.chapter, verses.verse 
      LIMIT 10
    `;
    
    const result = db.exec(query);
    
    if (!result || result.length === 0) {
      return [];
    }
    
    return result[0].values.map((item) => ({
      ari: item[0],
      name: item[1],
      verse: processVerseText(item[2])
    }));
  } catch (error) {
    console.error("❌ Error in getBibleAsJson:", error);
    return [];
  }
}

export async function getBibleChapterBooksList() {
  const db = await ensureDbOpen();
  
  if (!db) {
    console.error("❌ Could not open database");
    return [];
  }
  
  try {
    const query = `
      SELECT DISTINCT books.long_name || ' ' || verses.chapter as bookVerse
      FROM books
      INNER JOIN verses ON books.book_number = verses.book_number
      GROUP BY books.book_number, verses.chapter
      ORDER BY books.book_number, verses.chapter
    `;
    
    const result = db.exec(query);
    return result?.[0]?.values.flatMap((row) => row[0]) ?? [];
  } catch (error) {
    console.error("❌ Error in getBibleChapterBooksList:", error);
    return [];
  }
}

function normalizeBookName(bookName) {
  if (!bookName) return "";
  const trimmed = bookName.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export async function searchCharacters(chapterBook) {
  const db = await ensureDbOpen();
  
  if (!db) {
    console.error("❌ Could not open database");
    return [];
  }
  
  if (!chapterBook || typeof chapterBook !== "string") {
    console.error("❌ Invalid search:", chapterBook);
    return [];
  }
  
  try {
    const parts = chapterBook.trim().split(" ");
    const lastPart = parts[parts.length - 1];
    const hasChapterNumber = !isNaN(Number(lastPart));
    
    const bookName = hasChapterNumber 
      ? normalizeBookName(parts.slice(0, -1).join(" "))
      : normalizeBookName(parts.join(" "));
    
    const chapterNumber = hasChapterNumber ? Number(lastPart) : null;
    const chapterCondition = chapterNumber !== null 
      ? `AND verses.chapter = ${chapterNumber}` 
      : "";
    
    const query = `
      SELECT 
        verses.chapter, 
        verses.verse, 
        verses.text, 
        books.long_name
      FROM books
      INNER JOIN verses ON books.book_number = verses.book_number
      WHERE books.long_name LIKE '${bookName}' ${chapterCondition}
      ORDER BY verses.chapter, verses.verse
    `;
    
    const result = db.exec(query);
    
    if (!result || result.length === 0 || !result[0]?.values) {
      console.log(`ℹ️ No verses found for: ${chapterBook}`);
      return [];
    }
    
    return result[0].values.map((row) => ({
      name: `${row[3]} ${row[0]}:${row[1]}`,
      verse: processVerseText(row[2])
    }));
  } catch (error) {
    console.error("❌ Error in searchCharacters:", error);
    return [];
  }
}

export async function searchInBibleText(text) {
  const db = await ensureDbOpen();
  
  if (!db) {
    console.error("❌ Could not open database");
    return [];
  }
  
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    console.error("❌ Invalid search text:", text);
    return [];
  }
  
  try {
    const sanitizedText = text.replace(/'/g, "''");
    
    const query = `
      SELECT 
        verses.chapter, 
        verses.verse, 
        verses.text, 
        books.long_name
      FROM books
      INNER JOIN verses ON books.book_number = verses.book_number
      WHERE verses.text LIKE '%${sanitizedText}%'
      ORDER BY books.book_number, verses.chapter, verses.verse
    `;
    
    console.log(`🔍 Searching: "${text}" in ${selectedBibleName?.toUpperCase()}`);
    
    const result = db.exec(query);
    
    if (!result || result.length === 0 || !result[0]?.values) {
      console.log(`ℹ️ No results found for: "${text}"`);
      return [];
    }
    
    const results = result[0].values.map((row) => ({
      name: `${row[3]} ${row[0]}:${row[1]}`,
      verse: processVerseText(row[2])
    }));
    
    console.log(`✅ Found ${results.length} verses`);
    return results;
  } catch (error) {
    console.error("❌ Error in searchInBibleText:", error);
    return [];
  }
}

function removeTags(str) {
  if (!str || str === "") return "";
  
  const text = str.toString();
  return text.replace(
    /<(?!\/?i>)(?!i>).*?<\/(?!\/?i>)(?!i>).*?>|<i>|<\/i>/g,
    ""
  );
}

function cleanVerseText(text) {
  if (!text) return "";
  
  return text
    .replace(/<\/?br\s*\/?>/gi, " ")
    .replace(/•/g, "")
    .replace(/°/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function processVerseText(text) {
  if (!text) return "";
  
  const textWithoutTags = requiresTagCleaning(selectedBibleName)
    ? removeTags(text) 
    : text;
  
  return cleanVerseText(textWithoutTags);
}
