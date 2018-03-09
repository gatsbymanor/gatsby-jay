const themeCollection = [
  'massively',
  'lens',
  'photon',
  'tessellate',
  'dimension',
  'identity',
];


export const listThemesHandler = (argv) => {
  const themeName = argv.name;
  themeCollection.map(theme => {
    console.log(theme);
  });
}
