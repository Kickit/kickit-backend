const resolvers = (models) => ({
  Query: {
    getUserById(root, { id }) {
      return models.User.findById(id).then((response) => response);
    },

    getUserByEmail(root, { email }) {
      return models.User.findOne({ email }).then((response) => response);
    },
  },
  Mutation: {
    createUser(root, args) {
      const user = new models.User(args);
      return user.save().then((response) => response);
    },
    createProj(root, args) {
      console.log(root,args)
      const proj = new models.Project(args);
      return proj.save().then((response) => response);
    },
    createSect(root, args) {
      const sect = new models.Section(args);
      return sect.save().then((response) => response);
    },
    createTask(root, args) {
      const task = new models.Task(args);
      return task.save().then((response) => response);
    },
  },
});

module.exports = resolvers;
