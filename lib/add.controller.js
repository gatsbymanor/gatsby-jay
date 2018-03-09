const fs = require('fs-extra');
const path = require('path');

export const addThemeHandler = async (argv) => {
  const themeName = argv.name;
  const themePagesDir = path.join(process.cwd(), `themes`, themeName);

  try {
    await fs.ensureDir(themePagesDir)
    clone(themeName, themePagesDir);
  } catch (e) {
    console.log('Error: ', err);
    console.log('Makes sure you spelled the theme correctly.');
  }
}
