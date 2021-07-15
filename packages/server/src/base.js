const { createServer } = require("http");
const error = require("./error");
const extend = require("./extend");

function exec(path, result) {
	const out = new URLSearchParams();
	const matches = result.pattern.exec(path);
	let i = 0;
	while (i < result.keys.length) {
		out.set(result.keys[i], matches[++i] || null);
	}
	return out;
}

class Base {
	routes = new Set();
	wares = new Set();
	constructor(settings) {
		this.error = settings.errorHandler || error;
		this.nomatch = settings.noMatchHandler || this.error.bind(null, { code: 404 });
		this.attach = (req, res) => setImmediate(this.#handler.bind(this, req, res, undefined), req, res);
	}

	#find(method, path) {
		for (const route of this.routes) {
			const found = route.regex.pattern.test(path);
			if (found && method === route.method) {
				const params = exec(path, route.regex);
				return [true, route, params];
			}
		}
		return [false, this.nomatch];
	}

	#handler = (req, res) => {
		extend(req);
		const [found, route, params] = this.#find(req.method, req.pathname);

		if (!found) return this.nomatch(req, res);

		req.params = params;

		if (!res.finished) {
			const handlers = route.handlers.values();
			const next = (err) => (err ? error(err, req, res) : loop());
			const loop = () => {
				const { value } = handlers.next();
				value && value(req, res, next);
			};
			loop();
		}
	};

	listen = (port, cb, host = "0.0.0.0") => {
		const server = createServer();
		server.on("request", this.attach).listen(port, host, cb);
	};
}

module.exports = Base;
