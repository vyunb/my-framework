const { URL } = require("url");

module.exports = (req) => {
	const { searchParams, href, hash, pathname } = new URL("http://" + req.headers.host + req.url);

	req.query = searchParams;
	req.href = href;
	req.hash = hash;
	req.pathname = pathname;
};
