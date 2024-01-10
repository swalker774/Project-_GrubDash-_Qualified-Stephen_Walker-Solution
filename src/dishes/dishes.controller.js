const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function validateDishBody(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  let message;
  if (!name) message = "Dish must include a name";
  else if (!description) message = "Dish must include a description";
  else if (!price) message = "Dish must include a price";
  else if (price <= 0 || !Number.isInteger(price))
    message = "Dish must have a price that is an integer greater than 0";
  else if (!image_url) message = "Dish must include a image_url";

  if (message) {
    return next({
      status: 400,
      message: message,
    });
  }
  next();
}

function validateDishId(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish with id ${dishId} not found`,
  });
}

function validateDishBodyId(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  if (!id || id === dishId) {
    res.locals.dishId = dishId;
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  res.locals.dish = {
    id: res.locals.dishId,
    name: name,
    description: description,
    image_url: image_url,
    price: price,
  };
  res.json({ data: res.locals.dish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [validateDishBody, create],
  read: [validateDishId, read],
  update: [validateDishId, validateDishBody, validateDishBodyId, update],
  list,
};
