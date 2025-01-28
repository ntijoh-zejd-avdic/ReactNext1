const { Sequelize, DataTypes } = require('sequelize');

// Set up SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // Database file location
});

// Define User model
// User model definition
const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true, // Automatically manage createdAt and updatedAt
  });
  

// Define List model
const List = sequelize.define('List', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Define Todo model
const Todo = sequelize.define('Todo', {
  task: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Set up associations
List.belongsTo(User, { foreignKey: "userId" });
User.hasMany(List, { foreignKey: "userId" });

List.hasMany(Todo, { as: 'tasksList', foreignKey: 'listId' });
Todo.belongsTo(List, { as: 'List', foreignKey: 'listId' });

module.exports = { sequelize, User, List, Todo };
