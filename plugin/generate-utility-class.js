const postcss = require('postcss');

module.exports = postcss.plugin('generate-utility-class', ({ property, values, generateClass, removeUnused }) => {
  return (root, result) => {
    let classNames = {};
    let valueRange = [];

    for (let i = values.start; i <= values.end; i += values.step) {
      valueRange.push(parseFloat(i.toFixed(values.decimal)));
    }

    valueRange.forEach(value => {
      let className = `${property[0]}:${value}${values.unit}`;

      if (generateClass) {
        classNames[`.${className}`] = {
          [property]: `${value}${values.unit}`
        };
      } else {
        root.walkRules(rule => {
          if (rule.selector.indexOf(className) !== -1) {
            rule.walkDecls(decl => {
              decl.value = `${value}${values.unit}`;
            });
          }
        });
      }
    });

    if (removeUnused) {
      root.walkRules(rule => {
        rule.selectors.forEach(selector => {
          if (selector.indexOf(property[0]) !== -1) {
            let className = selector.substring(selector.indexOf(property[0]));

            if (!classNames[selector] && !classNames[`.${className}`]) {
              rule.remove();
            }
          }
        });
      });
    }

    root.append(classNames);
  };
});
