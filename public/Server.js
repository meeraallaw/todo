require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Make sure the User model is defined correctly
const Task = require('./models/Task'); // Make sure the Task model is defined correctly



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicPath = path.join(__dirname, 'build'); // Update to point to the build directory

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'todo' // Specify the database name here
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

let database;



app.post('/loginres', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      console.log(`Login successful for user ID: ${user._id}`);
      res.status(200).json({ message: 'Login successful', userId: user._id, image: user.image });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});
/*app.post('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  const { text, completed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newTask = new Task({ text, completed, user: userId });
    await newTask.save();

    user.tasks.push(newTask._id);
    await user.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});*/



app.post('/signupres', async (req, res) => {
  const { email, password, cpassword, image} = req.body;

  if (password !== cpassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, image });
    await newUser.save();
    console.log('User registered successfully');

    // Redirect to login page after successful registration
    res.status(201).json({ message: 'User registered successfully' });
    return res.redirect('/Login'); // Adjust the route if needed
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*app.post('/addtask', async (req, res) => {
  const { text, completed } = req.body;

  try {
    const newTask = new Task({ text, completed });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});*/
app.post('/addtask/:userId', async (req, res) => {
  const { userId } = req.params;
  const { text, completed } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newTask = new Task({ text, completed, user: userId });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.put('/update/:id', async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });
    if (!updatedTask) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send(`Task with ID ${taskId} updated successfully`);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/remove/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send(`Task with ID ${taskId} removed successfully`);
  } catch (error) {
    console.error('Error removing task:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/upload-image", async(req, res)=>{ 
  const {base64}=req.body;
  try {
  Images.create({image: base64}); 
  res.send({Status: "ok"})
  } catch (error) {
  res.send({Status: "error", data: error});
  }
  })

const PORT = process.env.PORT || 5036;
app.listen(PORT, () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connection established');
    database = mongoose.connection.db;
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  console.log(`Server is running on port ${PORT}`);
});
