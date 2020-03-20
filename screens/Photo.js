import React, { Component } from 'react';
import {TouchableOpacity,Text,StyleSheet,View,Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Utils from '../utils/utils'

class Photo extends Component {
  constructor(props){
    super(props);
    this.state ={
      chit_id : ''
    }
   }

   /**
  * When component loaded, get chit id
  * for use in attaching image to chit later
  */
   componentDidMount(){
      const id = this.props.route.params.chit_id
      this.setState({chit_id : id})
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
          CAPTURE
        </Text>
        </TouchableOpacity>
    </View>
    </View>
    );
  }

  /**
  * postPhoto() takes image taken from camera and sends it to API
  * for use in attaching with chit.
  */
  postPhoto(image){
    Utils.getToken().then((token) =>{
      return fetch(`http://10.0.2.2:3333/api/v0.0.5/chits/${this.state.chit_id}/photo`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/octet-stream',
            'X-Authorization' : token
          },
          body: image
        })
        .then((response) => {
          if(response.ok){
            
            Alert.alert('Image Attached Successfully')
            this.props.navigation.navigate('Chits')
          }
          else{
            Alert.alert('Image Failed To Be Posted, Please Try Again')
          }
        })
        .catch((error) => {
          console.log(error);
        });
      })
    }

  /**
  * Takes a picture using camera
  */  
  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data);

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

export default Photo