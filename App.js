import 'react-native-gesture-handler';
import React, { Component } from 'react';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Login from './screens/Login'
import Home from './screens/Home'
import Chits from './screens/Chits'
import Post from './screens/Post'
import Create from './screens/Create'
import Profile from './screens/Profile'
import Update from './screens/Update'
import Followers from './screens/Followers'
import Following from './screens/Following'

const Stack = createStackNavigator();

class App extends Component {

  
   render(){
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#BB86FC'
            },
          }}>
          

          <Stack.Screen
            name = "Home"
            component = {Home}
          />
          <Stack.Screen
            name = "Login"
            component = {Login}
          />

          <Stack.Screen
            name = "Chits"
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
          
          <Stack.Screen
            name="Profile"
            component={Profile}
            />

          <Stack.Screen
            name="Update"
            component={Update}
            />

          <Stack.Screen
            name="Followers"
            component={Followers}
            /> 
            
          <Stack.Screen
            name="Following"
            component={Following}
            /> 
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  }
}
export default App