# Message Map

Message Map is a way of viewing your Facebook Messenger history. 

You can download your Messenger data from https://facebook.com/dyi.

## Running

To run this project locally you need Node.js. This can be downloaded [here](https://nodejs.org/en/download/).

Clone this repo and install required dependencies:

```
git clone https://github.com/pjpscriv/message-map.git
cd message-map
npm install
```

This may take a few minutes. The main dependencies of this project are Angular and D3. Once these are installed, the app can be run with:

```
npm start
```

The app will be served to `http://localhost:4200/`.

### Building

If you only want to build the application without serving it, run: 
```
ng build
```

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Testing

Run [Karma](https://karma-runner.github.io) unit tests with:

```
ng test
```

Run [Protractor](http://www.protractortest.org/) end to end tests with: 

```
ng e2e
```

## Credit

Message Map is a fork of [FBMessage](https://github.com/adurivault/FBMessage) created by [MathReynaud](https://github.com/MathReynaud) & [adurivault](https://github.com/adurivault).
