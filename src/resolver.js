const messages = [];
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';

const resolvers = {
  Query: {
    messages(root, args, context) {
      return messages;
    }
  },

  Mutation: {
    sendMessage(parent, { from, message }, { pubsub }) {
      const message = { id: messages.length + 1, from, message };

      // This .push function is where you would typically implement your database mutation function
      messages.push(message);

      pubsub.publish('CHAT_CHANNEL', { messageSent: message });

      return message;
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubsub }) => {
        return pubsub.asyncIterator(CHAT_CHANNEL);
      }
    }
  }
};

module.exports = resolvers;
