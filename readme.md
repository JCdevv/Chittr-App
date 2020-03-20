# Chittr

Chittr is a Twitter clone that allows for the posting of short, textual based posts of no more than 141 characters called 'Chits'. The application interfaces with a provided API, allowing a user to create an account, log in, see other chits and follow other users.

Application written using React Native and tested on Android.

## Installation

- Ensure [Android Studio](https://developer.android.com/studio?hl=ru) is installed on your machine and an emulator has been created or local Android device connected with Android Debugging enabled.
- The latest version of the API is required.
- Download the repo and extract to your chosen location.
- Download and install [Node](https://nodejs.org/en/download/)
- Install the [React Native CLI](https://reactnative.dev/docs/getting-started)
- Navigate to application root directory `./your/location/Chittr_App` within terminal.
- Run `npx react-native run-android` in terminal.

## Modules Needed
- Import modules by doing `npm install <module name>` or following install instructions on the linked pages.
- [AsyncStorage](https://github.com/react-native-community/async-storage)
- [React Native FS](https://github.com/itinance/react-native-fs)
- [Native Base](https://nativebase.io/)
- [React Native Background Timer](https://github.com/ocetnik/react-native-background-timer)
- [React Native Camera](https://github.com/react-native-community/react-native-camera)
- [React Native GeoLocation Service](https://github.com/Agontuk/react-native-geolocation-service)
- [React Navigation](https://reactnavigation.org/)

## Notes
- An API key for Google Geocode services is required. See: Chits.js
- Application developed and tested on Android only.
- Application requires various permission on Android: Location and Camera.
- Location functionality is hit and miss on emulator. Using an actual device is recommended, tested working on emulator running API 29 only.

## Contributing
No contribution currently accepted due to this being a University assignment project

## License
MIT
