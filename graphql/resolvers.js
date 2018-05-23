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

      //Create and save project based on arguments
      const proj = new models.Project(args);
      proj.created = Math.floor(new Date() / 1000)
      await proj.save()

      console.log(proj._id)
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
