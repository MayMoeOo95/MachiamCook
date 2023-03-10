/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

const Recipe = require("../models/RecipeM"); // models file -> RecipeM.js

//view all recipes
const create = async (req, res) => {
  try {
    console.log("create body", req.body);
    // const author = req.session.user.userName; //! from User model
    req.body.author = req.session.user.userName;
    console.log("body", req.body);
    // req.body.name = author; //!
    const recipe = await Recipe.create(req.body);
    //res.send("all recipes page");
    res.redirect("recipes");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//add new recipe
const newRecipes = async (req, res) => {
  try {
    // res.send("add new recipes page");
    res.render("recipes/new");
  } catch (error) {
    res.send(error);
  }
};

const index = async (req, res) => {
  try {
    const recipes = await Recipe.find().exec();
    const context = { recipes };
    res.render("recipes", context);
  } catch (error) {
    res.send(error);
  }
};

// show recipe details
const show = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).send("Recipe not found.");
    } else {
      // res.send("show new recipes page");
      res.render("recipes/show", { recipe: recipe });
    }
  } catch (error) {
    res.send(error);
  }
};

//add delete recipe
const del = async (req, res) => {
  try {
    const recipeId = req.params.id; // recipe id
    console.log("Del recipeId is " + recipeId);
    const recipe = await Recipe.findByIdAndDelete(recipeId).exec();
    console.log("Del 2 recipe is " + recipe);
    // res.send("deleted a recipe");
    res.redirect("/users/book");
  } catch (error) {
    res.send(error);
  }
};

// edit recipe
// http://localhost:3000/recipes/edit/640db0de4d221090732d5b4e
const edit = async (req, res) => {
  try {
    const { id } = req.params; // recipe id -> edit.ejs:22 <%=id%>
    // console.log("id is " + id);
    const recipe = await Recipe.findById(id).exec(); // idv recipe details
    // console.log("recipe is " + recipe);
    const context = { id, recipe };
    // res.send("edit a recipe page");
    res.render("recipes/edit.ejs", context);
  } catch (error) {
    res.send(error);
  }
};

// update recipe
// http://localhost:3000/recipes/edit/640db0de4d221090732d5b4e
const update = async (req, res) => {
  const { id } = req.params; // recipe id
  // console.log("update id is " + id);
  const { name, ingredients, methods, category, duration, image } = req.body;
  // console.log(req.body);
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { name, ingredients, methods, category, duration, image },
      { new: true }
    ).exec();
    // res.json(recipe);
    // res.send("updated a recipe");
    res.redirect("/users/book");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

module.exports = {
  index,
  new: newRecipes,
  create,
  show,
  delete: del,
  update,
  edit,
};
