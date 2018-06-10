const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


const resolvers = (models) => ({
  User: {
    async projects(user) {
      return await models.Project.find(
        {
           _id: { $in: user.projects }
        }
     )
    },
  },

  Query: {
    getUserById(root, { id }) {
      return db.findRecord(models.User, id)
    },

    async getUserByEmail(root, { email }) {
      return await models.User.findOne({ email })
    },

    getProjById(root, { projectId }) {
      return db.findRecord(models.Project, id)
    },
    async getUser(root, args) {
      const userId = getUserId(args.headers)
      return await models.User.findById(userId)
    }
  },
  Mutation: {
    //@nicklewanowicz temporary! Will change to have server sessions
    async signup(root, args) {
      // Check if user already signed up
      let user = await models.User.findOne( {email: args.email} )
      if (user) {
        throw new Error(`User with email '${user.email}' exists`)
      }

      //Bcrypt and save user document
      const password = await bcrypt.hash(args.password, 10)
      args.password = password

      user = new models.User(args)
      await user.save()
    
      //Sign jwt token for user
      const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
      return {
        token,
        user,
      }
    },
    
    //@nicklewanowicz temporary! Will change to have server sessions
    async login(root, args) {
      //Verify user record exists in DB
      const user = await models.User.findOne( {email: args.email} )
      if (!user) {
        throw new Error('Invalid Login')
      }
      //Authenticate password
      const valid = await bcrypt.compare(args.password, user.password)
      if (!valid) {
        throw new Error('Invalid Login')
      }
      
      //Sign session token
      const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
      return {
        token,
        user,
      }
    },

    async createProject(root, args) {
      args.created = Math.floor(new Date() / 1000)
      return await db.createProject(args)
    },
    createSect(root, args) {
      debugger
      const sect = new models.Section(args);
      return sect.save().then((response) => response);
    },
    createTask(root, args) {
      const task = new models.Task(args);
      task.created = Math.floor(new Date() / 1000)
      return task.save().then((response) => response);
    },
  },
});

module.exports = resolvers;
