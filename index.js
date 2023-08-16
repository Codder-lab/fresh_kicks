const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const bcrypt = require('bcrypt')
const db = require('./db/mongoose')
const User = require('./models/user')
const Product = require('./models/product')
const Wishlist = require('./models/wishlist')
const SECRET_KEY = 'suyash1303';
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer');
const session = require('express-session');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const _ = require('lodash')

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/assets'))
app.use(express.json());
app.use(session({
  secret: 'suyash1303',
  resave: false,
  saveUninitialized: true
}));

// Set the view engine
app.set('views', [path.join(__dirname, 'views'), __dirname]);
app.set('view engine', 'ejs');

// Set up a route to serve the login form
app.get('/', async (req, res) => {
  try {
    const fullName = req.session.fullName || '';
    const limit = 8;

    const products = await Product.find()
      .limit(limit);

    // Shuffle the array of products randomly
    const shuffledProducts = _.shuffle(products);

    products.forEach(product => {
      product.image_url = `${product.product_name}.png`;
    });

    res.render('index.ejs', { fullName, products: shuffledProducts });
  } catch(error) {
    console.error('Error fetching products: ', error);
  }
});

app.post('/', async (req, res) => {
  try {
    const productData = req.body; // Assuming the request body contains product data

    // Create a new product in the database
    const newProduct = await Product.create(productData);

    res.json(newProduct);
  } catch (error) {
      console.error('Error creating product: ', error);
      res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/login', async (req, res) => {
  const fullName = req.session.fullName || '';

  res.render('login.ejs', { fullName });
});

// Handle user login submission
app.post('/login', async (req, res) => {
  const { email, password, rememberMe, fullName } = req.body;

  try {
    //Find the user with the provided email in the database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    //Compare the provided password with the stored password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials! '});
    }

    // If "Remember Me" is checked, generate a JSON Web Token (JWT) for authentication
    if (rememberMe) {
      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '30d' });
      res.cookie('rememberMeToken', token, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Set the token as a cookie
    }

    res.redirect('/');
    console.log('User Login Successfull');
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/forgot-password', (req, res) => {
  const fullName = req.session.fullName || '';

  res.render('forgotPassword.ejs', { fullName });
})

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const expiresIn = 60 * 60 * 24; // 24 hours
  const resetToken = Math.random().toString(32).substring(7);
  user.resetToken = resetToken;
  user.resetTokenExpires = new Date(Date.now() + expiresIn * 1000);
  await user.save();

  res.redirect(`/reset-password/${resetToken}`);
})

app.get('/reset-password/:token', (req, res) => {
  const fullName = req.session.fullName || '';
  const { token } = req.params;
  res.render('resetPassword.ejs', { token }, { fullName });
})

app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ resetToken: token });
  if (!user) {
    return res.status(400).json({ error: 'Invalid reset token' });
  }

  if (user.resetTokenExpires < Date.now()) {
    return res.status(400).json({ error: 'Reset token has expired' });
  }

  const saltRounds = 10;
  user.password = await bcrypt.hash(password, saltRounds);
  user.resetToken = null;
  await user.save();

  res.redirect('/login');
  console.log('Password Reset Successful');
})

app.get('/register', (req, res) => {
  const fullName = req.session.fullName || '';

  res.render('register.ejs', { fullName });
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

app.get('/collections', async (req, res) => {
  try {
    const fullName = req.session.fullName || '';
    const selectedCategory = req.query.category || ''; // Get the selected category from query parameter

    let query = {};

    if (selectedCategory) {
      query = { category: selectedCategory };
    }

    const products = await Product.find(query);

    // Shuffle the array of products randomly
    const shuffledProducts = _.shuffle(products);

    products.forEach(product => {
      product.image_url = `${product.product_name}.png`;
    });

    res.render('collections.ejs', { fullName, products: shuffledProducts, selectedCategory });
  } catch(error) {
    console.error('Error fetching products: ', error);
  }
});

app.post('/collections', async (req, res) => {
  try {
      const productData = req.body; // Assuming the request body contains product data

      // Create a new product in the database
      const newProduct = await Product.create(productData);

      res.json(newProduct);
  } catch (error) {
      console.error('Error creating product: ', error);
      res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/update', async (req, res) => {
  try {
    const result = await Product.updateOne(
      { product_name: 'product_11' }, // The condition to match
      { $set: { image_url: "/product_11.png" } } // The new field and its value
    );

    console.log('Result:', result);

    if (result.ok) {
      res.json({ message: `${result.nModified} documents updated.` });
    } else {
      res.status(500).json({ error: 'Update operation failed.' });
    }
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/contact', (req, res) => {
  const fullName = req.session.fullName || '';
  res.render('contact.ejs', { fullName });
})

app.get('/about-us', (req, res) => {
  const fullName = req.session.fullName || '';
  res.render('about_us.ejs', { fullName });
})

app.get('/product/:productId', async (req, res) => {
  try {
    const fullName = req.session.fullName || '';
    const productId = req.params.productId;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Fetch the product details from the database
    const product = await Product.findById(productId);
    product.image_url = product.image_url.split(',');

    res.render('productDetails.ejs', { product, fullName });
  } catch (error) {
    console.error('Error fetching product details: ', error);
    res.status(500).json({ error: 'Server Error' });
  }
})

app.post('/product', async (req, res) => {
  try {
    const productData = req.body; // Assuming the request body contains product data

    // Create a new product in the database
    const newProduct = await Product.create(productData);

    res.json(newProduct);
  } catch (error) {
    console.error('Error creating product: ', error);
    res.status(500).json({ error: 'Server Error' });
  }
})

app.get('/wishlist/add/:productId', async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have user authentication
    const fullName = req.session.fullName || '';

    const wishlistItems = await Wishlist.find({ user_id: userId }).populate('product_id');

    res.render('wishlist.ejs', { wishlistItems, fullName });
  } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Server Error' });
  }
})

app.post('/wishlist/add/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.params.userId;

    const wishlistItem = await Wishlist.create({
      product_id: productId,
      user_id: userId
    });

    await wishlistItem.save();

    res.json(wishlistItem);
  } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Server Error' });
  }
})

app.post('/:id', async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    await wishlistItem.remove();

    res.redirect('/wishlist'); // Redirect back to the wishlist page
  } catch (error) {
    console.error('Error deleting wishlist item: ', error);
    res.status(500).json({ error: 'Server Error' });
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});