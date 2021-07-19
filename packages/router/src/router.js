const { parse } = require("regexparam");
const METHODS = [
  "ACL",
  "BIND",
  "CHECKOUT",
  "CONNECT",
  "COPY",
  "DELETE",
  "GET",
  "HEAD",
  "LINK",
  "LOCK",
  "M-SEARCH",
  "MERGE",
  "MKACTIVITY",
  "MKCALENDAR",
  "MKCOL",
  "MOVE",
  "NOTIFY",
  "OPTIONS",
  "PATCH",
  "POST",
  "PRI",
  "PROPFIND",
  "PROPPATCH",
  "PURGE",
  "PUT",
  "REBIND",
  "REPORT",
  "SEARCH",
  "SOURCE",
  "SUBSCRIBE",
  "TRACE",
  "UNBIND",
  "UNLINK",
  "UNLOCK",
  "UNSUBSCRIBE",
];

class Router {
  constructor() {
    this.routes = new Set();
    for (const method of METHODS) {
      this[method.toLowerCase()] = this.add(method);
    }
  }

  add(method) {
    return (path, ...fns) => {
      const handlers = new Set(fns);
      const regex = parse(path);
      this.routes.add({ path, method, handlers, regex });
      return this;
    };
  }
}

module.exports = { Router };
