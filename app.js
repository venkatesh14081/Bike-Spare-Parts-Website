const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();
const PORT = 1300;

// MongoDB connection
mongoose.connect('mongodb+srv://venkyismjamalapurapu09:venkyism2003@cluster0.tvherku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));

// Array to hold cart items
const cart = [];


// Redirect root URL to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Serve the registration form directly from the route
app.get('/register', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      display: flex; 
      justify-content: flex-start; 
      align-items: center; 
      padding: 0 20px; 
      background-image: url('https://www.pixelstalk.net/wp-content/uploads/2016/06/Free-Pictures-Dirt-Bike-Wallpapers.jpg'); 
      background-size: cover; 
      background-position: center; 
      height: 100vh; 
      color: white; 
      margin: 0;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    form { 
      display: flex; 
      flex-direction: column; 
      width: 350px; 
      background: rgba(0, 0, 0, 0.8); 
      padding: 40px; 
      border-radius: 10px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    h2 { 
      color: #fff; 
      margin-bottom: 20px; 
      text-align: center;
      font-size: 24px;
    }
    label { 
      margin-bottom: 5px; 
      font-size: 14px; 
      color: #ddd;
    }
    input[type="text"], input[type="email"], input[type="password"] { 
      padding: 12px; 
      border: none; 
      border-radius: 5px; 
      background-color: #333; 
      color: #fff; 
      margin-bottom: 15px; 
      font-size: 15px;
    }
    button { 
      padding: 12px; 
      background-color: #007bff; 
      color: white; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer; 
      font-size: 16px; 
      transition: background-color 0.3s;
    }
    button:hover { 
      background-color: #0056b3; 
    }
    p { 
      font-size: 14px;
      text-align: center;
    }
    p a { 
      color: #00bfff; 
      text-decoration: none; 
    }
    p a:hover { 
      text-decoration: underline; 
    }
  </style>
</head>
<body>
  <div class="container">
    <form action="/register" method="post">
      <h2>Register</h2>
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      
      <label for="confirm-password">Confirm Password:</label>
      <input type="password" id="confirm-password" name="confirm-password" required>
      
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="/login">Login here</a></p>
  </div>
</body>
</html>

`);
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  const { username, email, password, 'confirm-password': confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username already taken. Please choose another one.');
    }
    
    const user = new User({ username, email, password }); // Create a new user instance
    await user.save(); // Save user to the database
    res.redirect('/login'); // Redirect to login after successful registration
  } catch (error) {
    res.send('Error registering user: ' + error.message);
  }
});

// Serve the login form directly from the route
app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      display: flex; 
      justify-content: flex-start; 
      align-items: center; 
      padding: 0 20px; 
      background-image: url('https://wallpapercave.com/wp/wp9121954.jpg'); 
      background-size: cover; 
      background-position: center; 
      height: 100vh; 
      color: white; 
      margin: 0;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    form { 
      display: flex; 
      flex-direction: column; 
      width: 350px; 
      background: rgba(0, 0, 0, 0.8); 
      padding: 40px; 
      border-radius: 10px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    h2 { 
      color: #fff; 
      margin-bottom: 20px; 
      text-align: center;
      font-size: 24px;
    }
    label { 
      margin-bottom: 5px; 
      font-size: 14px; 
      color: #ddd;
    }
    input[type="text"], input[type="password"] { 
      padding: 12px; 
      border: none; 
      border-radius: 5px; 
      background-color: #333; 
      color: #fff; 
      margin-bottom: 15px; 
      font-size: 15px;
    }
    input[type="checkbox"] { 
      margin-right: 5px; 
    }
    button { 
      padding: 12px; 
      background-color: #28a745; 
      color: white; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer; 
      font-size: 16px; 
      transition: background-color 0.3s;
    }
    button:hover { 
      background-color: #218838; 
    }
    p { 
      font-size: 14px;
      text-align: center;
    }
    p a { 
      color: #00bfff; 
      text-decoration: none; 
    }
    p a:hover { 
      text-decoration: underline; 
    }
  </style>
</head>
<body>
  <div class="container">
    <form action="/login" method="post">
      <h2>Login</h2>
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      
      <label>
        <input type="checkbox" name="remember"> Remember Me
      </label>
      
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="/register">Register here</a></p>
  </div>
</body>
</html>

`);
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && user.password === password) {
    req.session.username = username; // Store username in session
    req.session.email = user.email;  // Store email in session
    res.redirect('/home'); // Redirect to home page
  } else {
    res.send('Invalid username or password');
  }
});

// Serve the home page with non-veg items
app.get('/home', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  const username = req.session.username; // Get username from session

  // Sample items data
  const items = [
    {
      name: 'Tires',
      price: 3000, // Price in rupees
      image: 'http://cdni.autocarindia.com/ExtraImages/20130227060800_Meteor%20M%20copy.jpg', // Replace with actual image URL
    },
    {
      name: 'Headlights',
      price: 5000, // Price in rupees
      image: 'https://wallpapercave.com/wp/wp8347619.jpg', // Replace with actual image URL
    },
    {
      name: 'Silencer',
      price: 7000, // Price in rupees
      image: 'https://5.imimg.com/data5/BG/HH/BW/SELLER-3065944/dhe-best-sr-42-bike-bullet-silencer-exaust-premium-quality-harley-silencer-filter-glasswool-front-ch-1000x1000.jpg', // Replace with actual image URL
    },
    {
      name: 'Mirrors',
      price: 110, // Price in rupees
      image: 'https://cdn.shopify.com/s/files/1/2505/6516/products/34-0354_1200x1200.jpg?v=1544691558', // Replace with actual image URL
    },
    {
      name: 'Speedometer',
      price: 3000, // Price in rupees
      image: 'https://www.carid.com/images/auto-meter/custom-gauges/4989.jpg', // Replace with actual image URL
    },
    {
      name: 'Disk breaks',
      price: 9000, // Price in rupees
      image: 'https://live.staticflickr.com/3679/11346398896_43d33f4d46.jpg', // Replace with actual image URL
    },
    {
      name: 'Engine oil',
      price: 9000, // Price in rupees
      image: 'https://pictures.topspeed.com/IMG/jpg/201910/guide-selecting-the-.jpg', // Replace with actual image URL
    },
    {
      name: 'Chain Pocket',
      price: 9000, // Price in rupees
      image: 'https://i.pinimg.com/originals/77/6e/38/776e389b1783f0af7cb1dd3f6dff1c78.jpg', // Replace with actual image URL
    },
    {
      name: 'Helmets',
      price: 9000, // Price in rupees
      image: 'https://media.richmondhondahouse.com/wp-content/uploads/2020/04/25150537/0844-1331-03.jpg', // Replace with actual image URL
    },
    {
      name: 'Batteries',
      price: 11000, // Price in rupees
      image: 'https://http2.mlstatic.com/D_NQ_NP_799483-MCO51788987814_102022-O.jpg', // Replace with actual image URL
    },
    {
      name: 'Engine',
      price: 20000, // Price in rupees
      image: 'https://tse2.mm.bing.net/th?id=OIP.N5iRCDQgoeAgWpLyXhOntgAAAA&pid=Api&P=0&h=180', // Replace with actual image URL
    },
    {
      name: 'signal',
      price: 2000, // Price in rupees
      image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/US/ID/XZ/145503052/2-jpg-500x500.jpg', // Replace with actual image URL
    },
    {
      name: 'covers',
      price: 1000, // Price in rupees
      image: 'https://tse2.mm.bing.net/th?id=OIP.DqX8zJHKUhaDcz8N8lYXxAHaHa&pid=Api&P=0&h=180', // Replace with actual image URL
    },
    
    
    
    
  ];

  // Create item cards HTML with Add to Cart button
  const itemCards = items.map(item => {
    return `
      <div class="item-card">
        <img src="${item.image}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
        <form action="/add-to-cart" method="POST" style="display:inline;">
          <input type="hidden" name="itemName" value="${item.name}">
          <input type="hidden" name="itemPrice" value="${item.price}">
          <button type="submit" class="buy-now">Add to Cart</button>
        </form>
      </div>
    `;
  }).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bike</title>
  <style>
    body {
      font-family: 'Poppins', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      background-image: url('https://hdqwalls.com/download/1/honda-crf-450r-riders-jumping-from-the-sand-mud-sa.jpg');
      color: #444;
    }
    #header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(45deg, #FF6B6B, #FFD93D);
      color: white;
      padding: 15px 30px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    #header-bar a {
      color: white;
      text-decoration: none;
      margin-left: 15px;
      font-weight: bold;
    }
    #top-left-heading {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 1px;
      text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    }
    #item-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 30px;
    }
    .item-card {
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      margin: 15px;
      padding: 15px;
      text-align: center;
      width: 220px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .item-card:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    }
    .item-card img {
      max-width: 100%;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
    .item-card img:hover {
      transform: scale(1.1);
    }
    .buy-now {
      padding: 10px 20px;
      background-color: #FF6B6B;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .buy-now:hover {
      background-color: #FF3B3B;
      transform: scale(1.1);
    }

    /* Styled buttons and links */
    .styled-button {
      text-decoration: none;
      color: white;
      padding: 10px 20px;
      background-color: #28a745;
      border-radius: 8px;
      display: inline-block;
      margin-right: 12px;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .styled-button:hover {
      background-color: #1d8035;
      transform: scale(1.08);
    }

    /* Logout button styling */
    form button.styled-button {
      background-color: #28a745;
      border: none;
      cursor: pointer;
    }
    form button.styled-button:hover {
      background-color: #1d8035;
      transform: scale(1.08);
    }
  </style>
</head>
<body>
  <div id="header-bar">
    <div id="top-left-heading">Bike-Bangers</div>
    <div>
      <a href="/profile" id="profile-toggle" class="styled-button">Profile</a>
      <form action="/logout" method="POST" style="display:inline;">
        <button type="submit" class="styled-button">Logout</button>
      </form>
      <a href="/cart" class="styled-button">View Cart</a>
    </div>
  </div>

  <h1 style="color: white; text-align: center; margin-top: 20px;">Welcome, ${username}!</h1>
  <h2 style="color: white; text-align: center;">Bike spare parts</h2>

  <div id="item-container">
    ${itemCards}
  </div>
</body>
</html>
`);
});

// Handle adding items to cart
app.post('/add-to-cart', (req, res) => {
  const { itemName, itemPrice } = req.body;
  const item = { name: itemName, price: itemPrice };
  cart.push(item); // Add item to cart
  res.redirect('/home'); // Redirect to home after adding
});

// Serve the profile page
// Serve the profile page with CRUD buttons
app.get('/profile', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  const username = req.session.username;
  const email = req.session.email; // Get email from session

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; padding-top: 50px; background-color: #f4f4f4; }
    .profile-container { background: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; width: 300px; text-align: center; }
    h2 { color: #333; }
    p { margin-bottom: 10px; }
    .crud-buttons { display: flex; justify-content: space-around; margin-top: 20px; }
    button { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    .delete-button { background-color: #dc3545; }
    .delete-button:hover { background-color: #c82333; }
  </style>
</head>
<body>
  <div class="profile-container">
    <h2>User Profile</h2>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Email:</strong> ${email}</p>
    <div class="crud-buttons">
      <form action="/update-profile" method="GET" style="display:inline;">
        <button type="submit">Update Profile</button>
      </form>
      <form action="/delete-account" method="POST" style="display:inline;">
        <button type="submit" class="delete-button">Delete Account</button>
      </form>
    </div>
    <a href="/home" style="text-decoration: none; color: #007bff;">Back to Home</a>
  </div>
</body>
</html>`);
});
app.post('/delete-account', async (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }

  try {
    await User.deleteOne({ username: req.session.username });
    req.session.destroy(); // Destroy the session after deleting the account
    res.send('Account deleted successfully.');
  } catch (error) {
    res.send('Error deleting account: ' + error.message);
  }
});
app.get('/update-profile', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Profile</title>
    <style>
      body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding-top: 50px; }
      form { display: flex; flex-direction: column; width: 300px; padding: 20px; border-radius: 10px; background: #f4f4f4; }
      label, input, button { margin-bottom: 10px; }
      button { padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; }
      button:hover { background-color: #218838; }
    </style>
  </head>
  <body>
    <h2>Update Profile</h2>
    <form action="/update-profile" method="POST">
      <label for="email">New Email:</label>
      <input type="email" id="email" name="email" required>
      
      <label for="password">New Password:</label>
      <input type="password" id="password" name="password" required>
      
      <button type="submit">Update Profile</button>
    </form>
  </body>
  </html>`);
});
app.post('/update-profile', async (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  const { email, password } = req.body;
  
  try {
    // Update the user's data in the database
    await User.updateOne(
      { username: req.session.username },
      { email: email, password: password }
    );

    res.send('Profile updated successfully.');
  } catch (error) {
    res.send('Error updating profile: ' + error.message);
  }
});



// Handle logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home');
    }
    res.redirect('/login'); // Redirect to login after logout
  });
});
app.get('/cart', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Check if the cart is empty
  if (cart.length === 0) {
    return res.send('<h2>Your cart is empty. <a href="/home">Go back to home</a></h2>');
  }

  // Calculate the total amount, ensuring prices are numbers
  const totalAmount = cart.reduce((sum, item) => {
    // Ensure item.price is treated as a number
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    return sum + price;
  }, 0);

  // Create HTML to display cart items
  const cartItemsHtml = cart.map((item, index) => {
    return `
      <div class="cart-item">
        <p><strong>Item:</strong> ${item.name}</p>
        <p><strong>Price:</strong> ₹${item.price}</p>
        <form action="/remove-from-cart" method="POST" style="display:inline;">
          <input type="hidden" name="itemIndex" value="${index}">
          <button type="submit">Remove</button>
        </form>
      </div>
      <hr>
    `;
  }).join('');

  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Cart</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .cart-item { margin-bottom: 20px; }
      button { padding: 5px 10px; background-color: #d9534f; color: white; border: none; cursor: pointer; }
      button:hover { background-color: #c9302c; }
      .payment-section { margin-top: 20px; }
      .payment-button { padding: 10px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
      .payment-button:hover { background-color: #0056b3; }
      .total-amount { font-weight: bold; margin-top: 20px; }
    </style>
  </head>
  <body>
    <h2>Your Cart</h2>
    ${cartItemsHtml}
    <p class="total-amount">Total Amount: ₹${totalAmount} only</p>
    <div class="payment-section">
      <h3>Payment Options</h3>
      <button class="payment-button" onclick="alert('Proceeding to credit/debit card payment')">Credit/Debit Card</button>
      <button class="payment-button" onclick="alert('Proceeding to UPI payment')">UPI</button>
      <button class="payment-button" onclick="alert('Proceeding to net banking')">Net Banking</button>
    </div>
    <a href="/home">Back to Home</a>
  </body>
  </html>`);
});


app.post('/remove-from-cart', (req, res) => {
  const { itemIndex } = req.body;
  if (itemIndex >= 0 && itemIndex < cart.length) {
    cart.splice(itemIndex, 1); // Remove item from the cart by index
  }
  res.redirect('/cart'); // Redirect back to the cart page after removal
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
