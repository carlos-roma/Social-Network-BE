const mongoose = require('mongoose');
const User = require('./models/users');
const Thought = require('./models/thought');

mongoose.connect('mongodb://localhost:27017/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { username: 'johnDoe', email: 'john.doe@example.com' },
  { username: 'janeDoe', email: 'jane.doe@example.com' },
  { username: 'bobSmith', email: 'bob.smith@example.com' },
  { username: 'anaMartinez', email: 'ana.martinez@example.com' },
  { username: 'mariaGarcia', email: 'maria.garcia@example.com' },
  { username: 'luisLopez', email: 'luis.lopez@example.com' },
];

const thoughts = [
  {
    thoughtText: 'This is my first thought!',
    username: 'johnDoe',
    reactions: [
      { reactionBody: 'Great thought!', username: 'janeDoe' },
      { reactionBody: 'I totally agree!', username: 'bobSmith' },
    ],
  },
  {
    thoughtText: 'Loving this social network!',
    username: 'janeDoe',
    reactions: [{ reactionBody: 'Me too!', username: 'johnDoe' }],
  },
  {
    thoughtText: 'Happy to be here!',
    username: 'bobSmith',
    reactions: [
      { reactionBody: 'Welcome!', username: 'anaMartinez' },
      { reactionBody: 'Glad you joined!', username: 'mariaGarcia' },
    ],
  },
  {
    thoughtText: '¡Este es mi primer pensamiento!',
    username: 'anaMartinez',
    reactions: [
      { reactionBody: '¡Genial pensamiento!', username: 'mariaGarcia' },
      { reactionBody: '¡Totalmente de acuerdo!', username: 'luisLopez' },
    ],
  },
  {
    thoughtText: '¡Me encanta esta red social!',
    username: 'mariaGarcia',
    reactions: [{ reactionBody: '¡A mí también!', username: 'anaMartinez' }],
  },
  {
    thoughtText: '¡Feliz de estar aquí!',
    username: 'luisLopez',
    reactions: [
      { reactionBody: '¡Bienvenido!', username: 'johnDoe' },
      { reactionBody: '¡Me alegra que te hayas unido!', username: 'janeDoe' },
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connection.dropDatabase();

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded:', createdUsers);

    const createdThoughts = await Thought.insertMany(thoughts);
    console.log('Thoughts seeded:', createdThoughts);

    // Add thoughts to users
    for (const thought of createdThoughts) {
      await User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    }

    // Add friends
    await User.findOneAndUpdate(
      { username: 'johnDoe' },
      { $push: { friends: [createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id] } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { username: 'janeDoe' },
      { $push: { friends: [createdUsers[0]._id, createdUsers[4]._id] } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { username: 'bobSmith' },
      { $push: { friends: [createdUsers[0]._id, createdUsers[3]._id] } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { username: 'anaMartinez' },
      { $push: { friends: [createdUsers[4]._id, createdUsers[5]._id] } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { username: 'mariaGarcia' },
      { $push: { friends: [createdUsers[3]._id, createdUsers[5]._id] } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { username: 'luisLopez' },
      { $push: { friends: [createdUsers[3]._id, createdUsers[4]._id] } },
      { new: true }
    );

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
