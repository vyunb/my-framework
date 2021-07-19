function extend(who, from, overwrite = true) {
  const ownProps = Object.getOwnPropertyNames(
    Object.getPrototypeOf(from)
  ).concat(Object.keys(from));
  ownProps.forEach((prop) => {
    if (prop === "constructor" || from[prop] === undefined) return;
    if (who[prop] && overwrite) {
      who[`_${prop}`] = who[prop];
    }
    if (typeof from[prop] === "function") who[prop] = from[prop].bind(who);
    else who[prop] = from[prop];
  });
}
module.exports = extend;
