'use strict'

const Hapi = require('hapi')
const { graphqlHapi } = require('apollo-server-hapi')
const hapiPlayground = require('graphql-playground-middleware-hapi').default
const mongoose = require('mongoose')
const { makeExecutableSchema } = require('graphql-tools')
const tabs = require('./tabs.js')

const User    = require('./models/user')
const Project = require('./models/project')
const Task    = require('./models/task')

const myGraphQLSchema = require('./graphql/schema')
const createResolvers = require('./graphql/resolvers')

mongoose.connect('mongodb://localhost:27017/kickit_db1')

const HOST = 'localhost'
const PORT = 3030

const server = Hapi.server({
  host: HOST,
  port: PORT
})

const executableSchema = makeExecutableSchema({
    typeDefs: [myGraphQLSchema],
    resolvers: createResolvers({ User, Project, Task }),
    introspection: true
})

const api = {
  plugin: graphqlHapi,
  options: {
    path: '/graphql',
    graphqlOptions: request => ({
      schema: executableSchema,
      context: request
    }),
    route: {
      cors: true,
    },
  },
}

const graphiql = {
  plugin: hapiPlayground,
  options: {
    path: '/graphiql',
    endpoint: '/graphql',
    tabs,
  },
}

const endpoints = [api, graphiql]

const init = async () => {
  console.log(`Setting up server...`)
  try {
    await server.register(endpoints)
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`)
  }
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()