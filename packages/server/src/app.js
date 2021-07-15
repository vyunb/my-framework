const Base = require("./base");
const Router = require("../../router/src/router");
const { parse } = require("regexparam");

const lead = (x) => (x.charCodeAt(0) === 47 ? (x.length === 1 ? "" : x) : "/" + x);

class App extends Base {
	#types = Map;
	constructor(settings = {}) {
		super(settings);
		this.#types = new Map([
			["function", this.#useWares.bind(this)],
			["string", this.#usePath.bind(this)],
		]);
	}

	#useWares = (...wares) => {
		const use = () => {
			for (const route of this.routes) {
				route.handlers = new Set([...wares, ...route.handlers]);
			}
		};
		process.nextTick(use);
	};

	#usePath = (path, ...fns) => {
		for (const { routes } of fns) {
			for (const route of routes) {
				route.path = lead(path) + lead(route.path);
				route.regex = parse(route.path);
			}

			this.routes = new Set(routes);
		}
	};

	use(path, ...args) {
		const action = this.#types.get(typeof path);
		action(path, ...args);
	}
}

module.exports = { App };
