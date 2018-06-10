'use strict'

const Hapi = require('hapi')
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const mongoose = require('mongoose')
const { makeExecutableSchema } = require('graphql-tools');
const { getUserId } = require('./utils')

const HOST = 'localhost'
const PORT = 3030


const User    = require('./models/user')
const Project = require('./models/project')
const Section = require('./models/section')
const Task    = require('./models/task')

const myGraphQLSchema = require('./graphql/schema')
const createResolvers = require('./graphql/resolvers')

const executableSchema = makeExecutableSchema({
    typeDefs: [myGraphQLSchema],
    resolvers: createResolvers({ User, Project, Section, Task }),
});

mongoose.connect('mongodb://localhost:27017/kickit_db1');

const init = async () => {
  const server = Hapi.server({
    host: HOST,
    port: PORT,
  })

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: request => ({
        schema: executableSchema,
        context: getUserId(request) 
      }),
      route: {
        cors: true,
      },
    },
  })

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        passHeader: '"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjFjMzg1NGQ3Yzk4ZDNkMzJmOTYxZmQiLCJpYXQiOjE1Mjg1NzYwODR9.CVF0DRe24HT7ZLzG7K6v_6WYUcGx5wu-lOWIietGb5k"',
        endpointURL: '/graphql',
      },
    },
  })

  try {
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

init()