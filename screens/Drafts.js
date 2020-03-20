import React, { Component } from 'react';
import { TextInput,FlatList, ActivityIndicator, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Utils from '../utils/utils'
import BackgroundTimer from 'react-native-background-timer';


var RNFS = require('react-native-fs');

class Drafts extends Component {
  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      drafts: [],
      content: '',
      currentDraft: '',
      index: 0
    }
   }
  
   /**
  * Reads current drafts file and returns the contents of the file so drafts can be displayed
  */
  readDraft(){
    RNFS.readDir(RNFS.DocumentDirectoryPath +"/config/") // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
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

      return 'no file';
    })
    .then((contents) => {  
      console.log("Contents of currently being read file" + contents)
      if(contents == ''){
        Alert.alert("No Drafts Current Saved")
        this.props.navigation.navigate("Post")
      }
      //Drafts stored in JSON, parse it and then set drafts state value to drafts returned
      const json = JSON.parse(contents)
      this.setState({drafts : json})
      this.setState({isLoading: false})
      
    })
    .catch((err) => {
      console.log(err.message)
    });
  }  

  /**
  * Removes a draft from current draft list based on which index is passed
  */
  deleteDraft(index){
    let currentDrafts = this.state.drafts
    currentDrafts.splice(index,1)
    this.setState({drafts: currentDrafts})

  }

  /**
  * Makes a new directory called config to store drafts file
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
  * Updates the value of the current draft that has been edited
  */
  updateDraft(){
    let currentDrafts = this.state.drafts

    currentDrafts[this.state.index] = this.state.content
  
    this.setState({drafts: currentDrafts})
  }

  /**
  * Once drafts have all been edited, user can save all drafts permanently. This writes updated list of drafts to storage
  */
  saveAllDrafts(){
    //Path of drafts file
    const path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';
    //Gets current final version of edited drafts from state
    const finalDrafts = this.state.drafts
    //Turns JSON array object to string so can be stored in file
    const draft = JSON.stringify(finalDrafts)
    //Writing a string that is shorter than the existing string does not overwrite the longer string, just the equal size of the shorter string
    //And the end of the longer string is tacked onto the end and NOT removed. So - we remove the file every time we need to update.
    //
    RNFS.unlink(path)
      .then(() => {
      console.log('FILE DELETED');
     })

    //Writes new drafts to file 
    RNFS.writeFile(path, draft, 'utf8')
      .then((success) => {
      Alert.alert("Drafts Saved")
      this.propse.navigation.navigate('Post')
    })
      .catch((err) => {
      console.log(err.message);
    });

  }

  /**
  * Creates directory if not present for drafts and then reads any drafts currently in drafts file
  */
  componentDidMount(){
    this.makeDirectory()
    this.readDraft()
  }

  
  
  /**
  * Post allows the user to post a draft from the drafts pafe
  */
  post(index,chit){
    const text = this.state.content
    //If chit is over 141 chars, error
    if(text.length > 141){
      Alert.alert(`Chits can be no longer than 141 characters. Your chit is ${text.length} long`)
      throw new Error('Length > 141')
    }else{
      const date =  Date.now();

      const res = JSON.stringify({
        timestamp: date,
        chit_content: chit,
      });
      console.log(res);
      Utils.getToken().then((token) =>{
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
          if(response.ok){
            Alert.alert("Chit Posted Successfully")
            navigation.navigate('Chits')
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
    if(this.state.isLoading){
      return(
      <View>
        <ActivityIndicator/>
      </View>
      )
    }

    return(
      <View style = {{flex: 1,backgroundColor: '#121212'}}> 
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1,color: 'white' }} 
          defaultValue = {this.state.currentDraft}
          onChangeText={content => this.setState({content: content})}
        />

        <Button
          onPress={() => {
            this.updateDraft()    
          }}
        title="Update Draft" />

        <Button
          onPress={() => {
            this.saveAllDrafts()    
          }}
        title="Save All Drafts" />

        <FlatList
          data={this.state.drafts}
          renderItem={
            ({item,index}) => 
            <View style= {{
              flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#3700B3'
            }}>
              
              <Text style={{
                color: '#BB86FC'
              }}>{item}</Text>

              <View style={{flexDirection: 'row'}}>
                <Button
                  color = '#3700B3'
                  onPress={() => {
                    this.setState({currentDraft : item})
                    this.setState({index: index})    
                }}
                title='Edit Draft'/>  

                <Button
                  color = '#3700B3'
                  onPress={() => {
                    this.post(index,item)    
                }}
                title='Post Draft'
                />  

                <Button
                  color = '#3700B3'
                  onPress={() => {
                    this.deleteDraft(index)  
                 }}
              title='Delete Draft'
              />   
              </View>

              <Button
                  color = '#3700B3'
                  onPress={() => {
                  Alert.alert('Draft Scheduled In 15 Minutes Time')
                    BackgroundTimer.setTimeout(() => { 
                        this.post(index,item)
                    
                      }, 
                      150000);
                }}
                title='Post Draft In 15 Minutes'/>
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
        /> 
      </View>
    );
  }
}

export default Drafts