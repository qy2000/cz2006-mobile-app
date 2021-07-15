import React, { useContext, useEffect, useRef, useState } from 'react';
import {StyleSheet, Dimensions, View, FlatList, TouchableOpacity, Image} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import { Block, Text } from 'galio-framework';
import { Icon } from '../components';
import { UserContext } from '../context/UserContext';
import chatLocations from '../constants/ChatLocations';

const { width } = Dimensions.get('screen');

export default function LocationChatMenu ({navigation}) {
  const {profile, setchatid} = useContext(UserContext)
  
  const [isLoading, setisLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [arrayholder, setarrayholder] = useState(chatLocations)
  // const [newdataSource, setnewdataSource] = useState([])
  const [dataSource, setdataSource] = useState(arrayholder)
  const flatListRef = useRef(null)
  const [location] = useState(profile.mrt)
  
  const [newdataSource, setnewdataSource] = useState(() => {
    const result = arrayholder.filter((item) => {
      const itemData = item.title.toUpperCase();
      const textData = location.toUpperCase();
      return itemData.indexOf(textData) > -1;
    })
    return(result)
  })

  /**
   * Filters the chatroom based on entered text
   * @param {string} text 
   */
  const SearchFilterFunction = (text) => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter((item) => {
      //applying filter for the inserted text in search bar
      const itemData = item.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setdataSource(newData);
    setSearch(text);
  };

  const passID = (item) => {

    setchatid(item.title)
    navigation.navigate("LocationChat")
    
  };


    const renderInputs = () => {
      return (
        <Block style={styles.searchinput}>
          {/* <Text bold size={16} style={styles.title}>Inputs</Text> */}
          <Block>
            <SearchBar 
              searchIcon={{ size: 24 }}
              onChangeText={(text) => SearchFilterFunction(text)}
              onClear={text => SearchFilterFunction('')}
              placeholder="Search for groups"
              value={search}
              lightTheme 
              round
              style={{ color: 'black' }}
              containerStyle={{backgroundColor: 'white'}}
          />
          </Block>
        </Block>
      )
    }

    const renderCards = ({ item }) => {
      // const { navigate } = this.props.navigation;
      return (
        <Block>
          <TouchableOpacity
            onPress={() => passID(item)}
            style={[
              styles.card,
            ]}
          >
            <Image source={{ uri: item.url }} style={styles.itemImage} />
            <Text style={styles.itemTitle}>{item.title}</Text>
            {/* <Text style={styles.itemText}>{item.id}</Text> */}
          </TouchableOpacity>
        </Block>
      )
    }

    const renderRows = ({ item }) => {
      return (
        <Block>
          <TouchableOpacity
            onPress={() => passID(item)}
            style={[
              styles.item,
            ]}
          >
          <ListItem>
            <Avatar 
              source= {{ uri: item.url }}
              rounded
             />
            <ListItem.Content>
              {/* roundAvatar
              // title= {<Text style={styles.itemTitle}>{item.title}</Text>} */}
              <ListItem.Title> 
                {item.title}
                
              </ListItem.Title>
              {/* <ListItem.Subtitle> {item.id} </ListItem.Subtitle> */}
            </ListItem.Content>
            <Icon 
                size={16}
                name="ios-people"
                family="ionicon"
                color='#ff9900' 
            />
          </ListItem>
          </TouchableOpacity>
        </Block>
      )
    }
  
    return (
    <Block style={styles.viewStyle}>
          {renderInputs()}
          <Text style={styles.title}>Recommended for You</Text>
          <View style={{ height: 150, marginLeft: 15, }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // ref={(ref) => { this.flatListRef = ref; }}
              // ref={flatListRef}
              data={newdataSource}
              renderItem={renderCards}
              enableEmptySections={true}
              style={{ marginTop: 10 }}
              keyExtractor={(item, index) => index.toString()}
            >
            </FlatList>
          </View>
          <Text style={styles.title}>More Chatrooms</Text>
          <FlatList
            ref={flatListRef}
            data={dataSource}
            // ItemSeparatorComponent={ListViewItemSeparator}
            //Item Separator View
            renderItem={renderRows}
            enableEmptySections={true}
            style={{ marginTop: 10 }}
            keyExtractor={(item, index) => index.toString()}
          >
          </FlatList>
          <TouchableOpacity
            onPress={() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 })} style={styles.upButton}>
              <Block>
               <MaterialCommunityIcons name="arrow-up" color={'white'} size={26} />
              </Block>
          </TouchableOpacity>
  </Block> 
    );
  }


const styles = StyleSheet.create({

  viewStyle: {
    width: width,
    // justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  searchinput: {
    width: width,
    // justifyContent: 'center',
    // flex: 1,
    backgroundColor: 'white',
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  card: {
    width: 150,
    alignItems: "center",
    borderBottomColor: "#DDDDDD",
    borderTopStartRadius: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: "#FFD789",
    borderRadius: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 5,
    marginLeft: 15,
    fontWeight: "700",
  },
  item: {
    borderBottomColor: "#ccc",
    borderTopStartRadius: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: '#faebd7',
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    // height:5,
    /*     padding: 30,
        marginVertical: 8,
        marginHorizontal: 16,
        width: "90%", */
  },
  itemText: {
    fontSize: 14,
    //paddingBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 1,
  },
  itemImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  upButton: {
    backgroundColor: "#ff9900",
    borderRadius: 300,
    padding: 12,
    position: 'absolute',
    bottom: 20,
    right: 15
  },
});
