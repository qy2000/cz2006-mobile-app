import React from 'react';
import { StyleSheet, StatusBar, Dimensions, Image, View, TouchableOpacity } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
const { height, width } = Dimensions.get('screen');


export default class Onboarding extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Block style={styles.headerPadding} />
        <Block style={styles.logo}>
          <Image
            source={require('../assets/images/onboarding.png')}
            style={styles.logoimg}
          />
        </Block>
        <Block style={styles.logoTextPadding} />

        <Block style={styles.login}>
          <Block>
            <Button color='#03adfc' style={styles.loginButton} onPress={() => navigation.navigate('Login')}>LOG IN</Button>
          </Block>
          


          <Block style={styles.signUpBlock}>

            <Block style={{flex: 3, alignItems: 'flex-end', }}>
              <Text>DON'T HAVE AN ACCOUNT?</Text>
            </Block>

            <Block style={{flex: 2}}>
              <TouchableOpacity style={styles.signupButton} onPress={()=>navigation.navigate('SignUp')}>
                <Text style={{padding: 5, fontWeight: '100', color: 'blue',}}>SIGN UP</Text>
              </TouchableOpacity>
            </Block>

          </Block>

        </Block>
        <Block style={styles.bottomPadding} />

      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerPadding: {
    flex: 14
  },
  logo: {
    flex: 8
  },
  logoimg: {
    flex: 1,
    height: 200,
    width: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoTextPadding: {
    flex: 5
  },
  login: {
    flex: 5,
    alignItems: 'center'
  },
  loginButton: {
    width: 220,
    height: 40,
    borderRadius: 10
  },
  signUpBlock: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginLeft: 20
  },
  signupButton: {
    flex: 2,    
    alignItems: "center",
    width: 70,
    justifyContent: 'center',
  },
  bottomPadding: {
    flex: 14
  },
});
