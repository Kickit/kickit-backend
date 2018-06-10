const schema = `

  type AuthPayload {
    token: String
    user: User
  }
  
  type User {
    id: ID!
    email: String!
    first: String!
    last: String!
    projects: [Project]
  }

  type Project {
    id: ID!
    title: String
    created: Int!
    owners: [User]
    sections: [Section]
  }

  type Section {
    id: ID!
    title: String
    position: Int
    tasks: [Task]
  }

  type Task {
    id: ID!
    title: String!
    description: String
    tasks: [Task]
    created: Int!
    due: Int
    completed: Boolean!
  }

  type Query {
    getUser: User
    getUserById(id: ID!): User
    getUserByEmail(email: String!): User

    getProjById(id: ID!): Project
    getSectById(id: ID!): Section
    getTaskById(id: ID!): Task
  }

  type Mutation {
    signup(first: String!, last: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createProject(owners: [ID] title: String!): Project
    createSection(project: ID, task: ID, title: String, position: Int): Section
    createTask(sectionId: ID!, title: String, description: String, due: Int, completed: Boolean): Task
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = schema;
