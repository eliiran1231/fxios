# Fxios.d.ts
this library is for interacting with https://www.fxp.co.il via JavaScript

## Types 
The following types are defined in the file: 

- User: contains information about a user, such as name, id, subname, and isConnected.
- Message: contains information about a message, such as author, id, VBQuote, content, and reply.
- Like: contains information about a like, such as messageLiked and memberLiked.
- Thread: contains information about a thread, such as content, id, title, author, time, and tag.
- PM: contains information about a private message, such as content, author, id, title, time, and reply.

## Code Examples
Here are some code examples showing how to use Fxios: 

### Login
This example shows how to login to the API using a username and password:

```
const fxios = new Fxios();
fxios.login('username', 'password').then(() => {
  console.log('Login successful!');
});
```

### Make a Like
This example shows how to make a like for a message:

```
fxios.makelike(commentId);
```

### Send a Message
This example shows how to send a message in a thread:

```
fxios.sendMessage(showtherdId, 'Hello world!');
```

### Create a New Thread
This example shows how to create a new thread:

```
fxios.newthread(forumId, tag, 'My Thread Title', 'Content of my new thread');
```

### Get User Info
This example shows how to get user info:

```
fxios.getUserInfo(id).then((user) => {
  console.log(user);
});
```

### Listen for New Messages
This example shows how to listen for new messages:

```
fxios.onNewMessage((msg) => {
  console.log(msg);
});
```
