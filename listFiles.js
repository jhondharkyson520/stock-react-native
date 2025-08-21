const fs = require('fs');
const path = require('path');

const baseDir = __dirname; // pasta do projeto
const ignoreDirs = ['node_modules', '.git']; // pastas para ignorar
const outputFile = path.join(baseDir, 'estrutura.txt'); // arquivo de saída

function listFiles(dir, prefix = '') {
  const items = fs.readdirSync(dir);

  let result = '';

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (ignoreDirs.includes(item)) return;

    if (stat.isDirectory()) {
      result += `${prefix}${item}/\n`;
      result += listFiles(fullPath, prefix + '  '); // recursivo
    } else {
      result += `${prefix}${item}\n`;
    }
  });

  return result;
}

const structure = listFiles(baseDir);

fs.writeFileSync(outputFile, structure, 'utf-8');

console.log(`Estrutura salva em ${outputFile}`);
