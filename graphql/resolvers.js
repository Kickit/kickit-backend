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
      return models.User.findById(id).then((response) => response);
    },

    async getUserByEmail(root, { email }) {
      return await models.User.findOne({ email })
    },

    async getProjById(root, { projectId }) {
      return await models.Project.findById(projectId)
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

    async createProj(root, args) {

      //Create and save project based on arguments
      const proj = new models.Project(args);
      proj.created = Math.floor(new Date() / 1000)
      await proj.save()
      //Pushes new project ID into the projects array of the owners specified
      await models.User.update(
        { email: { $in: proj.owners } },
        { $push: { projects: models.ObjectId(proj._id) } }
      )
      return proj
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
