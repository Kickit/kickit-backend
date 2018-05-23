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
    createUser(root, args) {
      const user = new models.User(args);
      return user.save().then((response) => response);
    },
    async createProj(root, args) {
      const proj = new models.Project(args);
      proj.owners = [args.owner]
      let owner = await models.User.findById(args.owner)
      owner.projects.push(proj._id)
      await models.User.update({ _id: args.owner} , { $set: {projects: owner.projects} })
      proj.created = Math.floor(new Date() / 1000)
      proj.owners = [args.owner]
      return proj.save().then((response) => response);
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
