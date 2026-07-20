const fs = require('fs');
const path = require('path');

const fonts = {
  'Inter': 'inter',
  'Space Grotesk': 'space-grotesk',
  'JetBrains Mono': 'jetbrains-mono',
  'Playfair Display': 'playfair-display',
  'Plus Jakarta Sans': 'plus-jakarta-sans',
  'Caveat': 'caveat',
  'Nunito': 'nunito',
  'Nunito Sans': 'nunito-sans',
  'DM Serif Display': 'dm-serif-display',
  'Baloo 2': 'baloo-2',
  'DM Sans': 'dm-sans',
  'Sora': 'sora',
  'Lora': 'lora'
};

function replaceFonts(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceFonts(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Remove @import lines
      const importRegex = /@import url\(['"]https:\/\/fonts\.googleapis\.com[^'"]+['"]\);/g;
      if (importRegex.test(content)) {
        content = content.replace(importRegex, '');
        changed = true;
      }
      
      let originalContent = content;
      for (const [fontName, varName] of Object.entries(fonts)) {
        content = content.split("'" + fontName + "'").join("var(--font-" + varName + ")");
        content = content.split('"' + fontName + '"').join("var(--font-" + varName + ")");
      }
      
      if (changed || originalContent !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated CSS:', fullPath);
      }
    }
  }
}

replaceFonts(path.join(__dirname, '../app'));
