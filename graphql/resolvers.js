const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


const resolvers = (models) => ({
  // Relationship Resolvers ------------------------------------------------------------------------
  User: {
    async projects(user) {
      return await db.findRecords(models.Project, user.projects)
    },
  },

  Project: {
    async sections(project) {
      return await db.findRefs(models.Task, 'project', project.id)
    },
  },

  Task: {
    async tasks(task) {
      return await db.findRefs(models.Task, 'section', task.id)
    },
  },

  // Queries --------------------------------------------------------------------------------------
  Query: {
    async getUserByEmail(root, { email }) {
      return await models.User.findOne({ email })
    },
    
    async me(root, args, context) {
      const userId = getUserId(context)
      return await models.User.findById(userId)
    },

    async project(root, { id }, context) {
      const userId = getUserId(context)
      const project = await db.findRecord(models.Project, id)
      if (project.owners.indexOf(userId) > -1) {
        return project
      }
      throw new Error(`Unauthorized Action`)
    },

    async task(root, { id }, context) {
      const userId = getUserId(context)
      const task = await db.findRecord(models.Task, id)
      const project = await db.findRecord(models.Project, task.project)  
      if (project.owners.indexOf(userId) > -1) {
        return task
      }
      throw new Error(`Unauthorized Action`)
    }
  },

  // Mutation --------------------------------------------------------------------------------------
  Mutation: {
    //@nicklewanowicz temporary! Will change to have server sessions
    async signup(root, args) {
      let user = await models.User.findOne( {email: args.email} )
      if (user) {
        throw new Error(`User with email '${user.email}' exists`)
      }

      const password = await bcrypt.hash(args.password, 10)
      args.password = password

      user = new models.User(args)
      await user.save()
    
      const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
      return {
        token,
        user,
      }
    },
    
    //@nicklewanowicz temporary! Will change to have server sessions
    async login(root, args) {
      const user = await models.User.findOne( {email: args.email} )
      if (!user) {
        throw new Error('Invalid Login')
      }

      const valid = await bcrypt.compare(args.password, user.password)
      if (!valid) {
        throw new Error('Invalid Login')
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
      return {
        token,
        user,
      }
    },

    async createProject(root, args, context) {
      const userId = getUserId(context)
      args.owners.push(userId)
      // args.owners= JSON.stringify(args.owners)
      args.created = Math.floor(new Date() / 1000)
      return await db.createProject(args)
    },

    async createTask(root, args, context) {
      const userId = getUserId(context)
      const section = null
      if(args.section){
        section = await db.findRecord(models.Task, args.section)
      }
      const parent = section ? section.id : args.project
      if (await db.userOwnsTask(parent, userId)) {
        return await db.createTask(args)
      }

      throw new Error('Unauthorized Action')
    },

    async updateTask(root, args, context) {
      const userId = getUserId(context)
      const task = await db.findRecord(models.Task, args.id)
      
      if (await db.userOwnsTask(task.project, userId)) {
        return await db.updateRecord(models.Task, args)
      }
      throw new Error('Unauthorized Action')
    },

    async deleteProject(root, args, context) {
      const userId = getUserId(context)
      return await db.deleteProject(args, userId)
    },

    async deleteTask(root, args, context) {
      const userId = getUserId(context)
      return await db.deleteTask(args, userId)
    }
  },
});

module.exports = resolvers;
