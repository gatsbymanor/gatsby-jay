const fs = require('fs-extra');
const path = require('path');


// Follows a singleton pattern
export const mountThemeHandler = async (argv) => {
  const themeName = argv.name;
  const targetThemePath = path.join(process.cwd(), `themes`, themeName);

  try {
    const exists = await fs.exists(targetThemePath)

    if (exists) {
      let targetProjectJayConfigPath = path.join(process.cwd(), `jay.json`);
      let targetProjectJayConfig = require(targetProjectJayConfigPath);
      targetProjectJayConfig.theme.name = themeName;
      writeJsonToFile(targetProjectJayConfigPath, targetProjectJayConfig, { spaceDelimiter: '  ' });

    } else {
      console.log('ErrorThe theme cannot be found. Did you add the theme to your project?');
    }
  } catch (e) {
    console.log('Could not find the file path in questions. jay.json might be missing.');
    console.log(e);
  }
}
