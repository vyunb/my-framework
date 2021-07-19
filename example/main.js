const { App } = require("../packages/server/src/app");
const { Router } = require("../packages/router/src/router");

const app = new App();
const router = new Router();

router.get("/users", (req, res) => res.end("users route"));
router.get("/user/:id", (req, res) => res.end(req.params.get("id")));
router.get("/accounts", (req, res) => {
  res.json({
    accounts: [1, 2, 3],
  });
});

const mw = (req, res, next) => {
  console.log(req.pathname);
  next();
};

app.use(mw);
app.use("/api", router);

app.get("/", (req, res, next) => {
  res.json({
    msg: "ok",
  });
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log("working");
});
