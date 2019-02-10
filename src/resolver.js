const messages = [];
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';

const resolvers = {
  Query: {
    messages(root, args, context) {
      return messages;
    }
  },

  Mutation: {
    sendMessage(parent, { author, body }, { pubsub }) {
      console.log('author', author);
      if (body.length <= 0) throw new Error('Message too short');
      const message = { id: messages.length + 1, author, body };

      // This .push function is where you would typically implement your database mutation function
      messages.push(message);

      pubsub.publish('MESSAGE_CHANNEL', { messageSent: message });
      console.log('Message: ', message);
      return message;
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(MESSAGE_CHANNEL);
      }
    }
  }
};

module.exports = resolvers;
