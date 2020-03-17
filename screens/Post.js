import React, { Component } from 'react';
import { TextInput, View, Button,Alert,PermissionsAndroid,Switch} from 'react-native';
import Geolocation, { watchPosition } from 'react-native-geolocation-service'
import AsyncStorage from '@react-native-community/async-storage';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import BackgroundTask from 'react-native-background-task'

var RNFS = require('react-native-fs');

BackgroundTask.define(() => {
  console.log("running!")
  let date =  Date.now();

  let res = JSON.stringify({
    timestamp: date,
    chit_content: this.state.content,
    'location' : {
      longitude: this.state.long,
      latitude: this.state.lat
    }
  });

  console.log(res)
    this.getToken().then((token) =>{
      return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Typee': 'application/json',
          'X-Authorization' : token
        },
        body: res
      })
      .then((response) => {
        response.json().then(json => {
        })
      })
      .catch((error) => {
        console.error(error);
      });
    })
  
  BackgroundTask.finish()
})

class Post extends Component {
  constructor(props){
    super(props);
    this.state ={
      content: '',
      long: 0,
      lat: 0,
      timestamp: 0,
      switchValue: false,
      isPhoto: false,
      locationEnabled: false,
      draft: false,
      drafts: '',
      chit_id: ''
    }
   }

   componentDidMount(){
     requestLocationPermission()
     this.makeDirectory()
     
   }

   toggleLocation = (value) => {
    this.setState({switchValue: value})
    this.setState({locationEnabled: value})
 }

 makeDirectory = () => {
  RNFS.mkdir(RNFS.DocumentDirectoryPath+"/config/")
      .then((result) => {
          console.log('result', result)
      })
      .catch((err) => {
          console.warn('err', err)
      })
}

  readDraft(){
    RNFS.readDir(RNFS.DocumentDirectoryPath + "/config/") // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);

    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1], 'utf8');
    }
    else{
      console.log("empty")
    }

    return 'no file';
  })
  .then((contents) => {

    if(contents == ''){
      this.saveDraft(this.state.content)
    }
    else{
      var currentDraft = this.state.content
      var finalDrafts = contents += "\n" + currentDraft
      this.saveDraft(finalDrafts)
    }
    
    
    
  })
  .catch((err) => {
    //Error is thrown due first app start not having drafts.txt, therefore create it..
    this.saveDraft(this.state.content)
  });
  }  
  saveDraft(storedDrafts){
    var path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';

    RNFS.writeFile(path, storedDrafts, 'utf8')
      .then((success) => {
      console.log('FILE WRITTEN!');
    })
      .catch((err) => {
      console.log(err.message);
    });
  }

  post(){
    let text = this.state.content
    if(text.length > 141){
      Alert.alert("Chits can be no longer than 141 characters. Your chit is " + text.length + " long")
      throw new Error('Length > 141')
    }else{
      let date =  Date.now();

      let res = JSON.stringify({
        timestamp: date,
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
          if(response.ok){
            Alert.alert("Chit Posted Successfully")
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
          }
          else{
            Alert.alert("Error Posting Chit")
          }
        })
        .catch((error) => {
          console.log(error);
        });
      })
    } 
  }


  render(){
  
    return(
    <View>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
        onChangeText={content => this.setState({content: content})}
      />
      <Switch
          title="This is a test"
          style={{marginTop:30}}
          onValueChange = {this.toggleLocation}
          value = {this.state.switchValue}/>      
      <Button
        onPress={() => {
        
          if(this.state.locationEnabled == true){
            console.log("location enabled and using location")
            this.getLocation()
          }
          else if(this.state.scheduleEnabled){

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
          
          if(this.state.locationEnabled == true){
            this.getLocation()
          }
          else if(this.state.scheduleEnabled){
            
          }
          else{
            this.post()
          }
        }
        }
      title="Post and Add Photo"
      />

      <Button
        onPress={() => {
          
          Alert.alert("Chit Has Been Schedule For Within 15 Minutes From Now")
          
          }
        }
      title="Schedule Post"
      />

    <Button
      onPress={() => {
        this.readDraft()
      }}
      title="Save Draft"
      />
     

    <Button
    onPress={() => {
      this.props.navigation.navigate('Drafts')
    }}
    title="View Drafts"
    />
    </View>
    );
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

  async getLocation(){
    if(!this.state.locationEnabled){
        this.state.locationEnabled = requestLocationPermission();
      }
      Geolocation.getCurrentPosition((position) =>{
      let json = position
    
      this.setState({long :  json.coords.longitude})
      this.setState({lat :  json.coords.latitude})

      this.post()
     },
     (error) =>{
       Alert.alert(error.message)
     },
     {
       timeout: 20000,
     }
     )
   }
}

export default Post

async function requestLocationPermission(){
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