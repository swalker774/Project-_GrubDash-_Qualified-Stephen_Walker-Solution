const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const errorHandler = require("../errors/errorHandler");
const notFound = require("../errors/notFound");

// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router.use(errorHandler);
router.use(notFound);

module.exports = router;
