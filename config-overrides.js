const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy } = require('customize-cra');
const fs = require('fs');
function loadTheme() {
  const paletteTheme = fs.readFileSync('./theme.less', 'utf-8');
  const lessVars = {};
  const matches = paletteTheme.match(/[@$](.*:[^;]*)/g) || []
  matches.forEach(variable => {
    const definition = variable.split(/:\s*/);
    let value = definition.splice(1).join(':');
    value = value.trim().replace(/^["'](.*)["']$/, '$1');
    lessVars[definition[0].replace(/['"]+/g, '').trim()] = value;
  });
  return lessVars;
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { ...loadTheme() },
  }),
  addDecoratorsLegacy(),
);