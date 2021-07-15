import React, { useState, useContext, useEffect } from 'react';
import { 
  StyleSheet, 
  View,  
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Linking,
  Animated
} from 'react-native';

import { SocialIcon, Divider } from 'react-native-elements'

import { Block, Button, Checkbox, Text, theme } from 'galio-framework';
const { height, width } = Dimensions.get('screen');
import { Input } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UserContext } from '../context/UserContext';
import { userEmailSignup } from '../controller/SignupManager'



export default function SignUp({navigation}) {
//   static navigationOptions = {
//     title: 'Login',
//   };

  const {login} = useContext(UserContext)
  const [checkedPrivacyPolicy, setCheckedPrivacyPolicy] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [signUpError, setSignUpError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorCode, setErrorCode] = useState("")
  const [signUpErrorTextOpacity, setOpacity] = useState(new Animated.Value(1));
  
  /**
   * Checks if an email is valid
   * @param {string} email 
   * @returns valid
   */
  function emailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Helper function to check if password is valid or not
   * @param {string} password 
   * @returns 
   */
  function passwordValid(password) {
    if(password.length < 6)
      return false;
    
    let containUppercase=false, containLowercase=false, containNumber=false;
    let curr = '';
    for(let i=0; i<password.length; i++){
      if(containUppercase && containLowercase && containNumber)
        break;
      curr = password[i]
      if((/[1-9]/).test(curr))
        containNumber = true;
      else {
        if((/[a-z]/).test(curr))
          containLowercase = true;
        else if((/[A-Z]/).test(curr))
          containUppercase = true;
      }
    }

    return containUppercase && containLowercase && containNumber; 
  }

  /**
   * Prints different error messages based on user's input
   */
  function handleSignUp() {
    setOpacity(new Animated.Value(1))
    setErrorMessage("")

    if(!emailValid(email)){
      setErrorMessage("Invalid email address!")
      setSignUpError(true)
    }
    else if(password != confirmPassword){
      setErrorMessage("Passwords not the same, please input again!")
      setSignUpError(true)
    }
    else if(!passwordValid(password)){
      setErrorMessage("Password is invalid!")
      setSignUpError(true)
    }
    else if(!checkedPrivacyPolicy){
      setErrorMessage("Please read the privacy policy!")
      setSignUpError(true)
    }
    else
    {
      userEmailSignup(email, password)
      .then((msg) => {
        if(msg.signUpError) {
          setSignUpError(true)
          setErrorCode(msg.signUpErrorCode)
          translateErrorCodeToMessage()
        }
        else {
          setSignUpError(false)
          login(msg.uid, null) //no profile set yet
          navigation.navigate('Setup')
        }
      })
    }
  }

  /**
   * Converts Firebase error code into an easily understood, helpful message
   */
  function translateErrorCodeToMessage(){
    if(errorCode == "auth/email-already-in-use")
      setErrorMessage("Email already in use!");
  }

  useEffect(() => {
    Animated.timing(signUpErrorTextOpacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }, [signUpErrorTextOpacity])
 
  return (
    <KeyboardAwareScrollView extraScrollHeight={70} enableOnAndroid={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{padding: 24, flex: 1}}>

          <Block style={{flex: 3, marginTop: -10, marginLeft: -15}}>
            <TouchableOpacity onPress={()=>navigation.navigate("Onboarding")}>
              <Icon name="arrow-left" size={40}></Icon>
            </TouchableOpacity>
          </Block>

          <Block style={{flex: 12, flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Image source={require('../assets/images/onboarding.png')} style={{ height: 200, width: 200, alignSelf: 'center', resizeMode: 'contain', marginTop: -50}} />
            <Text style={{alignSelf: 'center', fontWeight:'800', fontSize: 32, marginTop: -50}}>Create your account</Text>
          </Block>

          <Block style={{flex: 8, marginTop: 20}}>
            <TouchableOpacity>
                  <SocialIcon
                    title='CONTINUE WITH FACEBOOK'
                    button
                    type='facebook'
                    onPress={()=>alert("sign up with facebook")}
                  />
              </TouchableOpacity>

              <TouchableOpacity>
                <SocialIcon
                  title='CONTINUE WITH GOOGLE'
                  button
                  type='google'
                  onPress={()=>alert("sign up with google")}
                />
              </TouchableOpacity>
          </Block>

          <Block style={{flexDirection: 'row', alignItems: 'center', flex: 2, marginTop: 30, marginBottom: 30}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            <View>
              <Text style={{width: 50, textAlign: 'center'}}>OR</Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          </Block>

          <Block style={{flex: 14}}>
            <Input
                label='EMAIL ADDRESS'
                placeholder='Email'
                leftIcon={ <Icon name='mail' size={20}/> }
                value = {email}
                onChangeText = {setEmail}
              />

              <Input placeholder="Password"
                label='PASSWORD'
                secureTextEntry={true}
                leftIcon={ <Icon name='lock' size={20}/> }
                value = {password}
                onChangeText = {setPassword}               
              />

              <Input placeholder="Confirm Password"
                label='PASSWORD'
                secureTextEntry={true}
                leftIcon={ <Icon name='lock' size={20}/> }  
                value = {confirmPassword}             
                onChangeText = {setConfirmPassword}
              />
              
              <View style={{flexDirection: 'row-reverse'}}>
                <Checkbox flexDirection='row-reverse' checkboxStyle={{marginRight: 20}} label= "" checked={checkedPrivacyPolicy} onChange={() => {setCheckedPrivacyPolicy(!checkedPrivacyPolicy)}}/>
                <Text style={{marginRight: 10}}>{'I have read the '}
                  <Text style={{textDecorationLine: 'underline', color: 'blue'}} onPress={()=> Linking.openURL('http://www.google.com')}>Privacy Policy</Text>
                </Text>
              </View>
              
              <Button
                style={{alignSelf:'center', width: 200, marginTop: 20}}
                fontWeight='bold'
                color='#03adfc'
                onPress={() => handleSignUp()}>
                GET STARTED!
              </Button>

              {
                signUpError ? 
                <Animated.Text style={{ opacity: signUpErrorTextOpacity, alignSelf:'center', color:'red' }}>{errorMessage}</Animated.Text> :
                <Text style={{alignSelf:'center', color:'black'}}></Text>
              }
          </Block>

          {/* https://stackoverflow.com/questions/42831685/disable-back-button-in-react-navigation */}
          {/* Use the following line for production (To remove the back button) */}
          {/* <TouchableHighlight onPress={() => this.props.navigation.replace('Home')}> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
  
}

