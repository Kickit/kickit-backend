'use strict'

const Hapi = require('hapi')
const { graphqlHapi } = require('apollo-server-hapi')
const mongoose = require('mongoose')

const HOST = 'localhost'
const PORT = 3000


const User = require('./models/user')

const myGraphQLSchema = require('./graphql/schema')
const createResolvers = require('./graphql/resolvers')

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
      graphqlOptions: {
        schema: myGraphQLSchema,
      },
      route: {
        cors: true,
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