const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const url =
  'mongodb+srv://wadii:balerionisbae@todolist-fq3ya.mongodb.net/todo?retryWrites=true';
const localurl = 'mongodb://localhost/todo';

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'my secret'
  })
);

// on connecte
mongoose.connect(url, { useNewUrlParser: true }).catch(err => {
  console.log('Error ' + err);
});

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  else return res.redirect('/todo');
});

app
  .route('/login')
  .get((req, res) => {
    res.sendFile('/public/index.html', { root: __dirname });
  })
  .post(routes.login);

app.get('/todo', (req, res) => {
  if (req.session.user)
    return res.sendFile('/public/todo.html', { root: __dirname });
  else return res.redirect('/login');
});

app.get('/api/*', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    return next();
  }
});

app.route('/api/lists').get(routes.get_lists);

app.post('/api/lists/:category', routes.insert_list);

app
  .route('/api/list')
  .get(routes.list)
  .post(routes.add);

app
  .route('/api/list/:list_id')
  .put(routes.update)
  .delete(routes.remove);
app
  .route('/api/list/todo/:list_id')
  .get(routes.get_todo)
  .put(routes.update_todo);

app.get('/api/list/user', routes.get_current_user);
app.get('/logout', routes.logout);
app
  .route('/signup')
  .get((req, res) => {
    res.sendFile('/signup.html', { root: path.join(__dirname, 'public/') });
  })
  .post(routes.signup);

app.listen(3001, () => {
  console.log('express started on 3001');
});
