import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button,Alert } from 'react-native';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import Login from './screens/Login'
import Home from './screens/Home'

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
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  }
}
export default App