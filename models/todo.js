const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  todo: String,
  done: Boolean,
  date: String,
  category: String,
  user: String
});

const CategorySchema = new mongoose.Schema({
  category: String,
  user: String
});

let Todo = new mongoose.model('Todo', TodoSchema, 'todolist');
let Category = new mongoose.model('Category', CategorySchema, 'categories');

module.exports = { Todo, Category };
