// This is where the tabs for the graphiql interface are defined. 
// Feel free to add more tabs for more default mutations and queries.

// endpoint: string
// query: string
// variables?: string
// responses?: string[]
// headers?: { [key: string]: string }

module.exports = [{
  query: '# Welcome to the Kickit GraphiQL interface!',
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjFjMzg1NGQ3Yzk4ZDNkMzJmOTYxZmQiLCJpYXQiOjE1Mjg1NzYwODR9.CVF0DRe24HT7ZLzG7K6v_6WYUcGx5wu-lOWIietGb5k"
  },
  endpoint: '/graphql'
}]