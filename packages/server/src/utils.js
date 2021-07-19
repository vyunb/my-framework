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

const lead = (x) =>
  x.charCodeAt(0) === 47 ? (x.length === 1 ? "" : x) : "/" + x;

function exec(path, result) {
  const out = new URLSearchParams();
  const matches = result.pattern.exec(path);
  let i = 0;
  while (i < result.keys.length) {
    out.set(result.keys[i], matches[++i] || null);
  }
  return out;
}

module.exports = { extend, lead, exec };
