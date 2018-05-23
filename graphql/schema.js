const schema = `
  type User {
    id: ID!
    email: String!
    first: String!
    last: String!
    projects: [Project]
  }

  type Project {
    id: String!
    title: String
    created: Int!
    owners: [User]
  }

  type Section {
    id: String!
    title: String
    position: Int
  }

  type Task {
    id: String!
    title: String!
    description: String
    created: Int!
    due: Int
    completed: Boolean!
  }

  type Query {
    getUserById(id: ID!): User
    getUserByEmail(email: String!): User

    getProjById(id: ID!): Project
    getSectById(id: ID!): Section
    getTaskById(id: ID!): Task
  }

  type Mutation {
    createUser(email: String!): User
    createProj(owner: String! title: String): Project
    createSect(projectId: ID!): Section
    createTask(sectionId: ID!): Task
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = schema;
