const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const bcrypt = require('bcrypt')
const db = require('./db/mongoose')
const User = require('./models/user')
const SECRET_KEY = 'suyash1303';
const jwt = require('jsonwebtoken')

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/assets'))
app.use(express.json());

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

// Handle user login submission
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    //Find the user with the provided email in the database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    //Compare the provided password with the stored password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ erro: 'Invalid credentials! '});
    }

    res.redirect('/');

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ _id: user._id }, SECRET_KEY);
    console.log('User Login Successfull', token);
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const { fullName, email, password, confirm_password } = req.body;

  try{
    //Check if the provided email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    //Check if the password and confirm password match 
    if (password != confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    //Create a new instance using User model
    const newUser = new User({ fullName, email, password });

    // Hash the password before saving it to the database
    const saltRounds = 10;
    newUser.password = await bcrypt.hash(password, saltRounds);

    //Save the new user to the database
    await newUser.save();

    console.log('User Registered Successfully');
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: "Server error" });
  }
})

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