require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils'); // to set up our SQLite database
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const isEmail = require('isemail');

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;
    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(() => {
  console.log(`
        Server is running!
        Listening on port 4000
        Explore at https://studio.apollographql.com/dev
    `);
});

// Added the `dataSources` function to the `ApolloServer` constructor to connect instances of `LaunchAPI` and `UserAPI` to our graph

// If you use `this.context` in a datasource, it's critical to create a new isntance in the `dataSources` function, rather than sharing a single instance
// Otherwise, `initialize` might be called during the execution of asynchronous code for a particular user, replacing `this.context` with the context of another user

// `context` function defined in `server` is called once for every GraphQL operation that clients send to our server
// The return value of this function becomes the `context` argument that's passed to every resolver that runs as part of that operation
// Here  is what our `context` function does:
// 1. Obtain the value of the `Authorization` header  (if any) included in the incoming request
// 2. Decode the value of the `Authorization` header
// 3. If the decoded value resembles an email address, obtain user details for that email address from the database and return an object that includes those details in the `user` field
// By creating this `context` object at the beginning of each operation's execution, all of our resolvers can access the details for the logged-in user and perform actions specifically for that user
