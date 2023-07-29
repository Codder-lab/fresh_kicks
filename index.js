const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/assets'))

// Set the view engine
app.set('views', [path.join(__dirname, 'views'), __dirname]);
app.set('view engine', 'ejs');

// Set up a route to serve the login form
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const isAuthenticated = email === "admin@abc.com" && password === "admin";

  // Check the username and password
  if (isAuthenticated) {
    res.send("Login Successful!");
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.get('/collections', (req, res) => {
  res.render('collections.ejs');
})

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
})

app.get('/about-us', (req, res) => {
  res.render('about_us.ejs');
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});