import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription MESSAGE_SENT_SUBSCRIPTION {
    messageSent {
      id
      body
      author
    }
  }
`;

const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY {
    messages {
      id
      author
      body
    }
  }
`;
const SEND_MESSAGE_MUTATION = gql`
  mutation SEND_MESSAGE_MUTATION($body: String!, $author: String) {
    sendMessage(body: $body, author: $author) {
      id
      author
      body
    }
  }
`;

class MessagesPage extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewMessages();
  }
  render() {
    if (!this.props.data.messages) return 'Loading';

    const { data } = this.props;
    return data.messages.map(m => {
      return (
        <li key={m.id} className="collection-item avatar">
          <i className="material-icons circle red">play_arrow</i>
          <span className="title">{m.author || 'Guest'}</span>
          <p>{m.body}</p>
        </li>
      );
    });
  }
}

class Messages extends React.Component {
  state = { body: '', author: '' };

  _handleKeyPress = (e, sendMessage) => {
    const { body, author } = this.state;
    if (e.key === 'Enter') {
      sendMessage({
        variables: { author, body }
      });
      this.setState({ body: '' });
    }
  };

  handleSubmit = sendMessage => {
    const { body, author } = this.state;

    sendMessage({
      variables: { author, body }
    });
    this.setState({ body: '' });
  };

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    console.log('this state: ', this.state);
    const { body, author } = this.state;
    return (
      <div
        id="app"
        className="container"
        style={{ paddingTop: 100, maxWidth: 550 }}
      >
        <div className="row">
          <div className="input-field col s12">
            <input
              type="text"
              name="author"
              placeholder="Author name"
              defaultValue={body}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <Query query={MESSAGES_QUERY}>
          {({ subscribeToMore, ...result }) => {
            return (
              <ul className="collection">
                <MessagesPage
                  {...result}
                  subscribeToNewMessages={() =>
                    subscribeToMore({
                      document: NEW_MESSAGES_SUBSCRIPTION,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;

                        const { messageSent } = subscriptionData.data;

                        return Object.assign({}, prev, {
                          messages: [messageSent, ...prev.messages]
                        });
                      }
                    })
                  }
                />
              </ul>
            );
          }}
        </Query>

        <Mutation mutation={SEND_MESSAGE_MUTATION}>
          {sendMessage => {
            return (
              <>
                <input
                  type="text"
                  name="body"
                  placeholder="Type your message..."
                  onChange={this.handleChange}
                  value={this.state.body}
                  onKeyPress={e => this._handleKeyPress(e, sendMessage)}
                />
                <div className="row">
                  <button
                    style={{ width: '100%' }}
                    className="btn btn-primary"
                    onClick={() => this.handleSubmit(sendMessage)}
                  >
                    Send Message
                  </button>
                </div>
              </>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default Messages;
