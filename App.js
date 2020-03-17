import 'react-native-gesture-handler';
import React, { Component } from 'react';

import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Login from './screens/Login'
import Home from './screens/Home'
import Chits from './screens/Chits'
import Post from './screens/Post'
import Create from './screens/Create'
import MyProfile from './screens/MyProfile'
import UserProfile from './screens/UserProfile'
import Update from './screens/Update'
import Followers from './screens/Followers'
import Following from './screens/Following'
import Photo from './screens/Photo'
import ProfilePhoto from './screens/ProfilePhoto'
import Search from './screens/Search'
import Drafts from './screens/Drafts'

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
            name="MyProfile"
            component={MyProfile}
            />

          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
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

          <Stack.Screen
            name="Photo"
            component={Photo}/>
            
            <Stack.Screen
            name="ProfilePhoto"
            component={ProfilePhoto}/>

            <Stack.Screen
            name="Search"
            component={Search} 
            />

            <Stack.Screen
            name="Drafts"
            component={Drafts} 
            />
            
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  }
}
export default App