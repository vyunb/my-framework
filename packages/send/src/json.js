const { ServerResponse } = require("http");

const json =
  (res) =>
  (body, ...args) => {
    res.setHeader("Content-Type", "application/json");
    if (typeof body === "object" && body != null)
      res.end(JSON.stringify(body, null, 2), ...args);
    else if (typeof body === "string") res.end(body, ...args);
    else if (body == null) {
      res.removeHeader("Content-Length");
      res.removeHeader("Transfer-Encoding");
      res.end(null, ...args);
    }

    return res;
  };

module.exports = json;
