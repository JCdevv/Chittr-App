import React, { Component } from 'react';
import { CheckBox, TextInput, View, Button,Alert,PermissionsAndroid,StyleSheet,TouchableOpacity,Text } from 'react-native';
import Geolocation, { watchPosition } from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';


class Post extends Component {
  constructor(props){
    super(props);
    this.state ={
      content: '',
      long: 0,
      lat: 0,
      timestamp: 0,
      isChecked: false,
      isPhoto: false,
      locationEnabled: false,
      chit_id: ''
    }
   }

   componentDidMount(){
     this.requestLocationPermission()
    
   }

   async requestLocationPermission(){
    try {
      const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Lab04 Location Permission',
        message:'This app requires access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.setState({locationEnabled: true})
      console.log('You can access location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
    } catch (err) {
      console.warn(err);
    }
  }

   getLocation = () =>{
    if(!this.state.locationEnabled){
        this.state.locationEnabled = requestLocationPermission();
      }
     Geolocation.getCurrentPosition((position) =>{
       let json = position
       this.setState({long : JSON.parse(json)['longitude']})
       this.setState({lat :  JSON.parse(json)['latitude']})

       this.post()
     },
     (error) =>{
       Alert.alert(error.message)
     },
     {
       enableHighAccuracy: true,
       timeout: 20000,
     }
     )
   }
   async getID(){
    try {
      let id = await AsyncStorage.getItem('id')
      console.log(id)
      if(id !== null) {
        return id
      }
      return id
    } catch(e) {
      console.error(e)
    }
  }

   post(){
    let res = JSON.stringify({
      timestamp: this.state.timestamp,
      chit_content: this.state.content,
      'location' : {
        longitude: this.state.long,
        latitude: this.state.lat
      }
    });

    console.log(res);
    
    this.getToken().then((token) =>{
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization' : token
        },
        body: res
      })
      .then((response) => {
        response.json().then(json => {
          if(this.state.isPhoto == true){
            let id = (json)['chit_id']
            this.props.navigation.navigate('Photo',{
              chit_id : id
            })
            
          }
          else{
            this.props.navigation.navigate('Chits')
          }
        })
      })
      .catch((error) => {
        Alert.alert("Error Posting Chit!")
        console.error(error);
      });
    })
  }

  async getToken(){
    try {
      let token = await AsyncStorage.getItem('token')
      console.log("Token is!: " + token)
      if(token !== null) {
        return token
      }
      return token
    } catch(e) {
      console.error(e)
    }
  }
  render(){
  
    return(
    <View>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={content => this.setState({content: content})}
      />
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={()=>{
          this.setState({isChecked:!this.state.isChecked
          })
        }}
      isChecked={this.state.isChecked}
      leftText={"CheckBox"}
      />
      
      <Button
        onPress={() => {
          let time = Math.round(+new Date()/1000)
          this.setState({timestamp: time})
          
          if(this.state.isChecked == true){
            console.log("location enabled and using location")
            this.getLocation()
          }
          else{
            this.post()
          }

        }}
      title="Post"
      />

    <Button
        onPress={() => {
          this.setState({isPhoto : true})
          
          if(this.state.isChecked == true){
            this.getLocation()
          }
          else{
            this.post()
            
          }
        }
        }
      title="Post and Add Photo"
      />
     </View>
    );
  }
}

export default Post