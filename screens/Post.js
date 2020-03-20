import React, { Component } from 'react';
import { TextInput, StyleSheet, Button,Alert,PermissionsAndroid,Switch,Text,View} from 'react-native';
import { Container } from 'native-base'
import Geolocation, { watchPosition } from 'react-native-geolocation-service'
import Utils from '../utils/utils'

var RNFS = require('react-native-fs');

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

   /**
  * When component loaded, request location permissions
  * and create director for draft storage
  */
  componentDidMount(){
    requestLocationPermission()
    this.makeDirectory()
     
   }

  /**
  * Called when the user enabled the location toggle switch
  * sets the current switch value and location enabled value
  * to current switch value (true/false)
  */
  toggleLocation = (value) => {
    this.setState({switchValue: value})
    this.setState({locationEnabled: value})
  }
  /**
  * creates a new directory called config for use with draft storage
  */
  makeDirectory = () => {
    //Makes directory. DocumentDirectoryPath is within 'files' folder on the device
    RNFS.mkdir(RNFS.DocumentDirectoryPath+"/config/")
    .then((result) => {
      console.log('result', result)
    })
    .catch((err) => {
        console.warn('err', err)
    })
  }

  /**
  * readDraft() reads drafts currently present within drafts file if present
  */
  readDraft(){
    //Reads directory, 
    RNFS.readDir(RNFS.DocumentDirectoryPath + "/config/") 
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
    //if file contents is empty, store the draft on it's own
   
    const currentDraft = this.state.content
    let array = JSON.parse(contents)
    array.push(currentDraft) 
    const finalArray = JSON.stringify(array)
    this.saveDraft(finalArray)
    
  })
  .catch((err) => {
    //Error is thrown due to first app start not having drafts.txt, therefore create it..
    console.log(err.message)
    const array = JSON.stringify([
      this.state.content
    ])

    this.saveDraft(array)
  });
  }  

  /**
  * saveDraft() writes a list of drafts to a file
  */
  saveDraft(storedDrafts){
    //Get current file path
    const path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';

    //Write drafts to file
    RNFS.writeFile(path, storedDrafts, 'utf8')
      .then((success) => {
      console.log('FILE WRITTEN!');
    })
      .catch((err) => {
      console.log(err.message);
    });
  }

  /**
  * post() posts a chit to the server
  */
  post(){
    //Get current content of text box
    const text = this.state.content
    //If chit length is greater than 141, throw error and alert user of this
    if(text.length > 141){
      Alert.alert(`Chits can be no longer than 141 characters. Your chit is ${text.length} long`)
      throw new Error('Length > 141')
    }else{
      //Get current date timestamp
      const date =  Date.now();
      //Create JSO object of data needed for chit posting
      const res = JSON.stringify({
        timestamp: date,
        chit_content: this.state.content,
        'location' : {
          longitude: this.state.long,
          latitude: this.state.lat
        }
      });

      console.log(res)
      //Token authorisation needed for this endpoint, so get token stored in asyncstorage during login
      Utils.getToken().then((token) =>{
        //Make http request
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
          const {navigation} = this.props
          //If OK - no error
          if(response.ok){
            //Alert user of successful chit post
            Alert.alert('Chit Posted Successfully')
            response.json().then(json => {
              //If chit has pressed button wanting to attach image, send them to camera screen to add image
              if(this.state.isPhoto == true){
                let id = (json)['chit_id']
                navigation.navigate('Photo',{
                  chit_id : id
                })
              }
              else{
                navigation.navigate('Chits')
              }
            })
          }
          else{
            Alert.alert('Error Posting Chit')
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
      <Container style={styles.container}>
        <Text style={styles.text}> Enter Your Chit and Select An Option </Text>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 ,color: 'white'}} 
          placeholderTextColor={'white'}
          onChangeText={content => this.setState({content: content})}
        />
        <View style={{flexDirection: 'row'}}>
         <Switch
             style={{marginLeft: 120}}
             onValueChange = {this.toggleLocation}
             value = {this.state.switchValue}
             trackColor={{true: '#3700B3', false: 'grey'}}/> 

          <Text style={styles.text}> Enable Location</Text>
      </View>      
             
      <Button
        color = '#3700B3'
        onPress={() => {   
          if(this.state.locationEnabled == true){
            this.getLocation()
          }
          else{
            this.post()
          }
        }}
      title='Post'
      />

     <Button
        color = '#3700B3'
        onPress={() => {
          this.setState({isPhoto : true})
          
          if(this.state.locationEnabled == true){
            this.getLocation()
          }
          else{
            this.post()
          }
        }}
      title='Post and Add Photo'
      />
     <Button
        color = '#3700B3'
        onPress={() => {
         this.readDraft()
        }}
      title='Save Draft'
      />
     

     <Button
        color = '#3700B3'
        onPress={() => {
          this.props.navigation.navigate('Drafts')
        }}
      title='View Drafts'
    />
    </Container>
    );
  }
  /**
  * getLocation() gets the current location of device
  * and stores the latitude and longitude in state values
  * for use in post() method
  */
  async getLocation(){
    //if location is not enabled, request again
    if(!this.state.locationEnabled){
        this.state.locationEnabled = requestLocationPermission();
    } 
    //Get current position
    Geolocation.getCurrentPosition((position) =>{
      const json = position
      //Set states using long and lat values present in JSON
      this.setState({long :  json.coords.longitude})
      this.setState({lat :  json.coords.latitude})
      
      //Post
      this.post()
    },
    (error) =>{
      Alert.alert(error.message)
    },
    {
       timeout: 20000,
       enableHighAccuracy: false
     })
   }
}

export default Post

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#121212',justifyContent: 'center', flexDirection: 'column'},
  titleText: {color: '#BB86FC',textAlign: 'center',fontSize: 40,marginTop: 10},
  text: {color: '#BB86FC',textAlign: 'center',fontSize: 15,marginTop: 3}

});

/**
* requestLocationPermission() requests location permissions from the user
* So that current location can be retrieved.
*/

async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:'This app requires access to your location.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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