const typeDefs = `
type Message {
  id: Int!
  from: String!
  body: String!
}

type Query {
    messages: [Message]
}

type Mutation {
  sendMessage(from: String!, body: String!): Message
}

type Subscription {
  messageSent: Message
}
`;
module.exports = typeDefs;
