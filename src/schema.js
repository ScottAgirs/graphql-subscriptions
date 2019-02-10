const typeDefs = `
type Message {
  id: Int!
  author: String
  body: String!
}

type Query {
    messages: [Message]
}

type Mutation {
  sendMessage(author: String, body: String!): Message
}

type Subscription {
  messageSent: Message
}
`;
module.exports = typeDefs;
