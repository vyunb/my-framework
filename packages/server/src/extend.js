const { URL } = require("url");
const { json } = require("../../send/src");

module.exports = function (req, res) {
  const { searchParams, href, hash, pathname } = new URL(
    "http://" + req.headers.host + req.url
  );
  const [found, route, params] = this.find(req.method, pathname);
  if (!found) return this.nomatch(req, res);

  {
    req.params = params;
    req.query = searchParams;
    req.href = href;
    req.hash = hash;
    req.pathname = pathname;
    res.json = json(res);

    this.handler(req, res, route);
  }
};
