const { createServer } = require("http");
const { Router } = require("../../router/src/router");
const { exec } = require("./utils");
const extendMiddleware = require("./extend");
const error = require("./error");

class Base extends Router {
  routes = new Set();
  wares = new Set();
  settings = Object.create({});
  constructor(settings = {}) {
    super(settings);
    this.settings = settings;
    this.error = settings.errorHandler || error;
    this.nomatch =
      settings.noMatchHandler || this.error.bind(null, { code: 404 });
    this.attach = (req, res) =>
      setImmediate(extendMiddleware.bind(this, req, res), req, res);
    extendMiddleware.bind(this);
  }

  find(method, path) {
    for (const route of this.routes) {
      const found = route.regex.pattern.test(path);
      if (found && method === route.method) {
        const params = exec(path, route.regex);
        return [true, route, params];
      }
    }
    return [false];
  }

  handler(req, res, route) {
    if (!res.finished) {
      const handlers = route.handlers.values();
      const next = (err) => (err ? error(err, req, res) : loop());
      const loop = () => {
        const { value } = handlers.next();
        value && value(req, res, next);
      };
      loop();
    }
  }

  listen(port, cb, host = "0.0.0.0") {
    const server = createServer();
    server.on("request", this.attach).listen(port, host, cb);
  }
}

module.exports = Base;
