
# Pixelated

Pixelated is a strategy puzzle where the ultimate goal is to transform a 
multi-colored board into a single colored board.



## Screenshots

![New Game](https://github.com/jkarr/pixelated/blob/main/pixelated/public/newGame.png?raw=true)
![Game Won](https://github.com/jkarr/pixelated/blob/main/pixelated/public/wonGame.png?raw=true)


## Documentation

There are two ways to play pixelated.  You can download the source code and run locally, or you can play at https://www.playpixelated.app

### Run on the web
Visit [https://www.playpixelated.app](https://www.playpixelated.app)

### Run locally
First, you'll need to create a `.env.local` file in the `root` folder.
Populate the file with the following:
```
REACT_APP_REGISTER_USER_API=https://api.playpixelated.app/User
REACT_APP_REGISTER_GAME_API=https://api.playpixelated.app/Game
```
Next, do `npm start` from the root folder and navigate to [http://localhost:3000](http://localhost:3000)

### `Questions`

For questions, please reach out to johnie.karr@hotmail.com with 'Pixelated App' in the subject line.

# Capstone Project Requirements
### First Feature Set

-[x] Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.
-[x] Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.
-[x] Analyze text and display useful information about it. (e.g. word/character count in an input field)

### Second Feature Set

-[x] Create a form and store the submitted values using an external API (e.g. a contact form, survey, etc)
-[x] Persist data to an external API and make the stored data accessible in your app
 (including after reload/refresh).

### Optional

-[x] Develop your project using a common JavaScript framework such as React, Angular, or Vue
-[x] Interact with a database to store and retrieve information (e.g. MySQL, MongoDB, etc)
 ```
  Note: I did not interact with the database directly in this app, but rather in my API, which I wrote in C# and am not exposing the code on GitHub. I'm happy to share with you if interested though.
 ```

### Integrate a third-party API
-[x] I wrote my own API using C#/.net Core and SqlServer. 