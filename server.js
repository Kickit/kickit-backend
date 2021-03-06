'use strict'

const Hapi = require('hapi')
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const hapiPlayground = require('graphql-playground-middleware-hapi').default
const mongoose = require('mongoose')
const { makeExecutableSchema } = require('graphql-tools');
const { getUserId } = require('./utils')
const tabs = require('./tabs.js')

const HOST = 'server'
const PORT = 3030


const User    = require('./models/user')
const Project = require('./models/project')
const Task    = require('./models/task')

const myGraphQLSchema = require('./graphql/schema')
const createResolvers = require('./graphql/resolvers')

const executableSchema = makeExecutableSchema({
    typeDefs: [myGraphQLSchema],
    resolvers: createResolvers({ User, Project, Task }),
    introspection: true,
});

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
    tabs,
    endpoint: '/graphql'
  },
}

const endpoints = [api, graphiql]

const init = async () => {
  const server = Hapi.server({
    host: HOST,
    port: PORT,
  })

  try {
    await server.register(endpoints)
    await server.start()
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`)
  }

  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

const connectToMongo = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017/kickit_db1', (err) => {
            if (err) {
                setTimeout(connectToMongo, 5000)
            } else {
                init()
            }
        })
    } catch (err) {
        console.error('Error while connecting to mongo DB - retrying in 5 seconds...')
    }
}

connectToMongo()
