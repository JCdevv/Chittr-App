import React, { Component } from 'react';
import {TouchableOpacity,Text,StyleSheet,View,Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Utils from '../utils/utils'


class ProfilePhoto extends Component {
  constructor(props){
    super(props);
  }

   render() {
     return (
      <View style={styles.container}>
        <RNCamera ref={ref => {
          this.camera = ref;
          }}
        style={styles.preview}
        />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
         onPress={this.takePicture.bind(this)}
         style={styles.capture}>
        <Text style={{ fontSize: 16 }}>
          CAPTURE NEW PROFILE PHOTO
        </Text>
        </TouchableOpacity>
    </View>
    </View>
    );
  }
  /**
  * postPhoto() takes image taken from camera and sends it to API
  * for use in updating profile picture of the user
  */
  postPhoto(uri){
    Utils.getToken().then((token) =>{
      const {navigation} = this.props

      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/octet-stream',
            'X-Authorization' : token
          },
          body: uri
        })
        .then((response) => {
          if(response.ok){
            
            Alert.alert('Image Uploaded Successfully')
            navigation.navigate('MyProfile')
          }
          else{
            Alert.alert('Image Failed To Be Uploaded, Please Try Again')
          }
        })
        .catch((error) => {
          console.log(error);
        });
      })
    }

  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);

      this.postPhoto(data)
      
    }
  };
}
   const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column',height: 200 },
    preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' , height: 400},
    capture: { flex: 0, borderRadius: 5, padding: 15, paddingHorizontal: 20,
    alignSelf: 'center', margin: 20, }
  });

export default ProfilePhoto