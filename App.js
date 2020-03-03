import 'react-native-gesture-handler';
import React, { Component } from 'react';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import Login from './screens/Login'
import Home from './screens/Home'
import Chits from './screens/Chits'
import Post from './screens/Post'
import Create from './screens/Create'

const Stack = createStackNavigator();

class App extends Component {

  
   render(){
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Home">
          <Stack.Screen
            name = "Home"
            component = {Home}
          />
          <Stack.Screen
            name = "Login"
            component = {Login}
          />

          <Stack.Screen
            name = 'Chits'
            component = {Chits}
            />

          <Stack.Screen
            name="Post"
            component={Post}
            />
          <Stack.Screen
            name="Create"
            component={Create}
            />
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  }
}
export default App