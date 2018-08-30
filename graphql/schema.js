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
    public: String
    created: Int!
    owners: [User]
    sections: [Task]
  }

  type Task {
    id: ID!
    title: String!
    description: String
    section: ID
    tasks: [Task]
    created: Int!
    due: Int
    completed: Boolean!
    position: String
  }

  type Query {
    me: User
    getUserByEmail(email: String!): User

    project(id: ID!): Project
    task(id: ID!): Task
  }

  type Mutation {
    signup(first: String!, last: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createProject(owners: [ID], title: String!): Project
    createTask(project: ID, section: ID, position: String!, title: String, description: String, due: Int, completed: Boolean): Task


    updateTask(id: ID!, title: String, description: String, due: Int, completed: Boolean, section: ID): Task
    
    deleteProject(id: ID!): Project
    deleteTask(id: ID!): Task
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = schema;
