#!/usr/bin/env node

/**
 * 📤 Bible SQLite to Clean XML Exporter
 * 
 * This script exports a SQLite Bible database to XML format with clean text.
 * All verses are processed through processVerseText() to remove tags and formatting.
 * 
 * Usage:
 *   node scripts/exportBibleToXml.js <bible-code>
 * 
 * Examples:
 *   node scripts/exportBibleToXml.js kdsh
 *   node scripts/exportBibleToXml.js rvr60
 * 
 * Output: Creates <BIBLE>.xml in the same directory as the .sqlite file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// =====================================================
// TEXT PROCESSING FUNCTIONS (from getData.js)
// =====================================================

function removeTags(str) {
  if (!str || str === "") return "";
  
  const text = str.toString();
  // Remove all HTML/XML tags including <J>, <i>, <br/>, etc.
  // This simpler approach removes ALL tags without exceptions
  return text.replace(/<[^>]+>/g, "");
}

/**
 * Central function to clean and normalize verse text.
 * This is the single source of truth for text cleaning.
 * Removes: HTML tags, line breaks, special chars, extra spaces
 */
function processVerseText(text, requiresCleaning = true) {
  if (!text) return "";
  
  const textWithoutTags = requiresCleaning ? removeTags(text) : text;
  
  return textWithoutTags
    .replace(/<\/?br\s*\/?>/gi, " ")                     // HTML line breaks (in case not removed)
    .replace(/[\r\n•°]+|\\['"][0-9a-fA-F]{2}|\[\d+†?\]/g, "")  // Line breaks, bullets, degrees, hex codes, footnotes
    .replace(/\s{2,}/g, " ")                             // Multiple spaces to single
    .trim();
}

/**
 * Escapes special XML characters but preserves quotes for readability
 */
function escapeXml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    // NOTE: We're NOT escaping quotes (") and apostrophes (') 
    // because they are part of the legitimate text content
    // and don't cause XML parsing issues when inside CDATA-like content
}

// =====================================================
// BIBLE CONFIGURATION
// =====================================================

const BIBLE_CONFIG = {
  kdsh: { 
    name: 'KDSH', 
    fullName: 'Kadosh Israelita Mesiánica',
    shortName: 'Kadosh',
    publisher: 'Restauración de la Biblia',
    description: 'Traducción mesiánica que restaura los nombres hebreos originales',
    copyright: 'Traducción Kadosh Israelita Mesiánica',
    requiresTagCleaning: true 
  },
  lbla: { 
    name: 'LBLA', 
    fullName: 'La Biblia de las Américas',
    shortName: 'LBLA',
    publisher: 'The Lockman Foundation',
    description: 'Traducción literal moderna del español',
    copyright: 'Copyright © 1986, 1995, 1997 by The Lockman Foundation',
    requiresTagCleaning: false 
  },
  nvi: { 
    name: 'NVI', 
    fullName: 'Nueva Versión Internacional',
    shortName: 'NVI',
    publisher: 'Biblica, Inc.',
    description: 'Traducción contemporánea de equivalencia dinámica',
    copyright: 'Copyright © 1999, 2015 by Biblica, Inc.',
    requiresTagCleaning: false 
  },
  ntv: { 
    name: 'NTV', 
    fullName: 'Nueva Traducción Viviente',
    shortName: 'NTV',
    publisher: 'Tyndale House Publishers',
    description: 'Traducción de fácil lectura y comprensión',
    copyright: 'Copyright © 2010 by Tyndale House Foundation',
    requiresTagCleaning: false 
  },
  btx: { 
    name: 'BTX', 
    fullName: 'Biblia Textual',
    shortName: 'BTX',
    publisher: 'Sociedad Bíblica Iberoamericana',
    description: 'Traducción literal basada en textos originales',
    copyright: 'Copyright © 1999 by Sociedad Bíblica Iberoamericana',
    requiresTagCleaning: false 
  },
  rvr60: { 
    name: 'RVR60', 
    fullName: 'Reina Valera 1960',
    shortName: 'RVR60',
    publisher: 'Sociedades Bíblicas Unidas',
    description: 'Revisión clásica de la Biblia en español',
    copyright: 'Copyright © 1960 by American Bible Society',
    requiresTagCleaning: false 
  },
};

// =====================================================
// MAIN EXPORT LOGIC
// =====================================================

async function exportBibleToXml(bibleCode) {
  log('\n📤 BIBLE SQLite TO XML EXPORTER', 'bright');
  log('═'.repeat(70), 'blue');
  
  // Validate bible code
  const bibleKey = bibleCode.toLowerCase();
  if (!BIBLE_CONFIG[bibleKey]) {
    log(`❌ Error: Unknown bible code '${bibleCode}'`, 'red');
    log(`   Available: ${Object.keys(BIBLE_CONFIG).join(', ')}`, 'yellow');
    process.exit(1);
  }
  
  const config = BIBLE_CONFIG[bibleKey];
  const dbPath = path.join(__dirname, '..', 'src', 'db', `${config.name}.sqlite`);
  const xmlPath = path.join(__dirname, '..', 'src', 'db', `${config.name}.xml`);
  
  // Check if file exists
  if (!fs.existsSync(dbPath)) {
    log(`❌ Error: Database not found at ${dbPath}`, 'red');
    process.exit(1);
  }
  
  log(`\n📖 Bible: ${config.name}`, 'cyan');
  log(`📁 Source: ${dbPath}`, 'cyan');
  log(`📁 Output: ${xmlPath}`, 'cyan');
  log(`🏷️  Tag cleaning: ${config.requiresTagCleaning ? 'Yes' : 'No'}`, 'cyan');
  log(`🧹 Text cleaning: processVerseText()`, 'cyan');
  
  try {
    // Check if sqlite3 is available
    try {
      execSync('which sqlite3', { stdio: 'ignore' });
    } catch (error) {
      log(`❌ Error: sqlite3 command not found`, 'red');
      log(`   Please install sqlite3: brew install sqlite3 (macOS)`, 'yellow');
      process.exit(1);
    }
    
    const startTime = Date.now();
    
    // Step 1: Get database metadata from info table
    log(`\n📊 Reading database metadata...`, 'cyan');
    
    let dbMetadata = {};
    try {
      const infoQuery = `SELECT name, value FROM info`;
      const infoResult = execSync(`sqlite3 "${dbPath}" -separator "|" "${infoQuery}"`, { 
        encoding: 'utf-8' 
      }).trim();
      
      if (infoResult) {
        infoResult.split('\n').forEach(line => {
          const [name, value] = line.split('|');
          if (name && value) {
            dbMetadata[name] = value;
          }
        });
        log(`   Found metadata: ${Object.keys(dbMetadata).length} fields`, 'green');
      }
    } catch (error) {
      log(`   No metadata table found, using config defaults`, 'yellow');
    }
    
    // Step 2: Get database statistics
    log(`\n📊 Reading database structure...`, 'cyan');
    const countQuery = `SELECT COUNT(*) FROM verses`;
    const totalVerses = parseInt(
      execSync(`sqlite3 "${dbPath}" "${countQuery}"`, { encoding: 'utf-8' }).trim()
    );
    
    const bookCountQuery = `SELECT COUNT(DISTINCT book_number) FROM books`;
    const totalBooks = parseInt(
      execSync(`sqlite3 "${dbPath}" "${bookCountQuery}"`, { encoding: 'utf-8' }).trim()
    );
    
    log(`   Books: ${totalBooks}`, 'green');
    log(`   Verses: ${totalVerses}`, 'green');
    
    // Step 3: Get all books
    log(`\n📚 Loading books...`, 'cyan');
    const booksQuery = `
      SELECT book_number, long_name, short_name 
      FROM books 
      ORDER BY book_number
    `;
    
    const booksResult = execSync(`sqlite3 "${dbPath}" -separator "|" "${booksQuery}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    }).trim();
    
    const books = booksResult.split('\n').map(line => {
      const [number, longName, shortName] = line.split('|');
      return { number: parseInt(number), longName, shortName };
    });
    
    log(`   Loaded ${books.length} books`, 'green');
    
    // Step 4: Start building XML
    log(`\n📝 Generating XML...`, 'yellow');
    
    // Merge database metadata with config, prioritizing database info
    const bibleTitle = dbMetadata.description || config.fullName;
    const bibleDescription = dbMetadata.detailed_info 
      ? dbMetadata.detailed_info.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      : config.description;
    const bibleLanguage = dbMetadata.language || 'es';
    const bibleLanguageISO = dbMetadata['language_iso639-2b'] || 'spa';
    const bibleCopyright = dbMetadata.detailed_info 
      ? dbMetadata.detailed_info.match(/©[^<]*/g)?.join(' ') || config.copyright
      : config.copyright;
    
    let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    xml += `<XMLBIBLE xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" biblename="${escapeXml(config.shortName)}">\n`;
    
    // Information section (Zefania XML Bible Markup Language standard)
    xml += '  <INFORMATION>\n';
    xml += `    <title>${escapeXml(bibleTitle)}</title>\n`;
    xml += `    <creator>${escapeXml(config.publisher)}</creator>\n`;
    xml += `    <subject>La Santa Biblia</subject>\n`;
    xml += `    <description>${escapeXml(bibleDescription)}</description>\n`;
    xml += `    <publisher>${escapeXml(config.publisher)}</publisher>\n`;
    xml += `    <contributors>Exportado con OBS Bible Stream Verses Plugin por Rafael Montaño</contributors>\n`;
    xml += `    <date>${new Date().toISOString().split('T')[0]}</date>\n`;
    xml += `    <type>Bible</type>\n`;
    xml += `    <format>Zefania XML Bible Markup Language</format>\n`;
    xml += `    <identifier>${config.name}</identifier>\n`;
    xml += `    <source>https://github.com/boraita/obs-bible-plugin</source>\n`;
    xml += `    <language>${bibleLanguageISO.toUpperCase()}</language>\n`;
    xml += `    <coverage>Biblia completa - ${totalBooks} libros, ${totalVerses} versículos</coverage>\n`;
    xml += `    <rights>${escapeXml(bibleCopyright)}</rights>\n`;
    xml += '  </INFORMATION>\n';
    
    // Process each book
    let processedVerses = 0;
    
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const bookSequentialNumber = i + 1; // Sequential numbering 1-66 for ProPresenter compatibility
      const progress = ((i + 1) / books.length * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${progress}% - ${book.longName.padEnd(30)}`);
      
      // Include bsname (book short name) for Zefania XML standard compatibility
      xml += `  <BIBLEBOOK bnumber="${bookSequentialNumber}" bname="${escapeXml(book.longName)}" bsname="${escapeXml(book.shortName)}">\n`;
      
      // Get chapters for this book
      const chaptersQuery = `
        SELECT DISTINCT chapter 
        FROM verses 
        WHERE book_number = ${book.number} 
        ORDER BY chapter
      `;
      
      const chaptersResult = execSync(`sqlite3 "${dbPath}" "${chaptersQuery}"`, {
        encoding: 'utf-8'
      }).trim();
      
      const chapters = chaptersResult.split('\n').map(ch => parseInt(ch));
      
      // Process each chapter
      for (const chapter of chapters) {
        xml += `    <CHAPTER cnumber="${chapter}">\n`;
        
        // Get verses for this chapter
        const versesQuery = `
          SELECT verse, text 
          FROM verses 
          WHERE book_number = ${book.number} AND chapter = ${chapter} 
          ORDER BY verse
        `;
        
        const versesResult = execSync(`sqlite3 "${dbPath}" -separator "|||" "${versesQuery}"`, {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        }).trim();
        
        const verses = versesResult.split('\n').map(line => {
          const parts = line.split('|||');
          return {
            number: parseInt(parts[0]),
            text: parts.slice(1).join('|||') // In case text contains |||
          };
        });
        
        // Write each verse with cleaned text
        for (const verse of verses) {
          const cleanedText = processVerseText(verse.text, config.requiresTagCleaning);
          const escapedText = escapeXml(cleanedText);
          xml += `      <VERS vnumber="${verse.number}">${escapedText}</VERS>\n`;
          processedVerses++;
        }
        
        xml += `    </CHAPTER>\n`;
      }
      
      xml += `  </BIBLEBOOK>\n`;
    }
    
    xml += '</XMLBIBLE>\n';
    
    log(`\n   Processed ${processedVerses} verses`, 'green');
    
    // Step 4: Write XML file
    log(`\n💾 Writing XML file...`, 'yellow');
    fs.writeFileSync(xmlPath, xml, 'utf-8');
    
    const fileSize = (fs.statSync(xmlPath).size / 1024 / 1024).toFixed(2);
    log(`   File size: ${fileSize} MB`, 'green');
    
    const elapsed = Date.now() - startTime;
    log(`\n✅ Export complete in ${(elapsed / 1000).toFixed(2)}s`, 'green');
    
    // Final summary
    log(`\n${'═'.repeat(70)}`, 'green');
    log(`✅ XML EXPORT COMPLETE`, 'bright');
    log(`${'═'.repeat(70)}`, 'green');
    log(`   Output: ${xmlPath}`, 'cyan');
    log(`   Books: ${books.length}`, 'cyan');
    log(`   Verses: ${processedVerses}`, 'cyan');
    log(`   Size: ${fileSize} MB`, 'cyan');
    log(`   Time: ${(elapsed / 1000).toFixed(2)}s`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// =====================================================
// CLI INTERFACE
// =====================================================

function showHelp() {
  log('\n📤 Bible SQLite to XML Exporter', 'bright');
  log('═'.repeat(70), 'blue');
  log('\nUsage:', 'cyan');
  log('  node scripts/exportBibleToXml.js <bible-code>');
  log('\nAvailable Bibles:', 'cyan');
  Object.entries(BIBLE_CONFIG).forEach(([code, config]) => {
    log(`  ${code.padEnd(8)} - ${config.name} (${config.fullName})`, 'yellow');
  });
  log('\nExamples:', 'cyan');
  log('  node scripts/exportBibleToXml.js kdsh');
  log('  node scripts/exportBibleToXml.js rvr60');
  log('\nOutput:', 'cyan');
  log('  Creates <BIBLE-NAME>.xml in src/db/ directory');
  log('  All text is cleaned using processVerseText()');
  log('  XML follows XMLBIBLE standard structure');
  log('');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    showHelp();
    process.exit(0);
  }
  
  const bibleCode = args[0];
  
  exportBibleToXml(bibleCode)
    .then(() => {
      log('\n✅ Done!\n', 'green');
      process.exit(0);
    })
    .catch((error) => {
      log(`\n❌ Failed: ${error.message}\n`, 'red');
      process.exit(1);
    });
}

module.exports = { exportBibleToXml, processVerseText };
