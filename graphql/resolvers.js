const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


const resolvers = (models) => ({
  User: {
    async projects(user) {
      return await db.findRecords(models.Project, user.projects)
    },
  },

  Project: {
    async sections(project) {
      return await db.findRefs(models.Section, 'project', project.id)
    },
  },

  Section: {
    async tasks(section) {
      return await db.findRefs(models.Task, 'section', section.id)
    },
  },

  Task: {
    async tasks(task) {
      const section = await db.findRefs(models.Section, 'task', task.id)
      return await db.findRefs(models.task, 'section', section.id)
    },
  },

  Query: {
    getUserById(root, { id }) {
      return db.findRecord(models.User, id)
    },

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
      // Need to make sure they have permission for this task which means we need the project that it belongs to
      // TODO: @nicklewanowicz see if there is a better way of doing this ie, POLR is including tasks in project request
      const section = await db.findRecord(models.Section, task.section)
      const project = await db.findRecord(models.Project, section.project)  
      if (project.owners.indexOf(userId) > -1) {
        return task
      }
      throw new Error(`Unauthorized Action`)
    }
  },
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

    async createSection(root, args) {
      if (args.position === undefined) {
        const sections = await db.findRefs(models.Section, 'project', args.project)
        console.log(sections)
        args.position = sections.length
      }
      return await db.createSection(args)
    },

    createTask(root, args) {
      const task = new models.Task(args);
      task.created = Math.floor(new Date() / 1000)
      return task.save().then((response) => response);
    },

    async updateTask(root, args, context) {
      const userId = getUserId(context)
      return await db.updateRecord(models.Task, args)
    },
  },
});

module.exports = resolvers;
