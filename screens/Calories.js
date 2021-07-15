import React, { Component, Fragment} from 'react';
import { StyleSheet, Dimensions, ScrollView, View, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('screen');
import Modal from 'react-native-modal';
import {
  exercises, 
  foods, 
  intensity,  
  cal_table_msg, 
  cal_table_colour, 
  cal_exercise, 
  cal_food, 
  storeExerciseCalories, 
  getExerciseCalories,
  removeExercise,
  storeFoodCalories, 
  getFoodCalories,
  removeFood,
  setNetCal,
} from '../controller/CaloriesManager';
import { getRecomendedCal } from '../controller/ProfileManager';

export default class Calories extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHead1: ['Food', 'Servings', 'Calories'],
      tableData1: [],
      tableHead2: ['Exercise', 'Minutes', 'Intensity', 'Calories Burnt'],
      tableData2: [],
      isModalVisible: false,
      //For Food Portion
      selectedFood:'',
      selectedFoodCal: 0,
      selectedServing: 0,
      //For Exercise Portion
      selectedEx: '',
      selectedExCal: 0,
      selectedMin: 0,
      selectedMul: 0,
      selectedIntensity: '',
      exerciseIntensity: 0,
      };
    
  };
  toggleModal(){
    // this.setState(prevState => ({ isChecked: !prevState.isChecked }));
    this.setState(currentState => ({ isModalVisible: !currentState.isModalVisible }));
  };
  
  /**
   * Automatically loads the user's calories when first entering this screen
   */
  componentDidMount() {

    getFoodCalories()
      .then((FoodList) => {
        this.setState({
          tableData1: FoodList
        })  
      });
    
    getExerciseCalories()
      .then((ExList) => {
        this.setState({
          tableData2: ExList
        })  
    });
  }
  
  render = () => {
    const state = this.state;
    //WIP Calculate Calories From Table...
    function calc_table_food(){
      var food_calories_total = 0;
      if (state.tableData1 != null){
        for (var k = 0; k < state.tableData1.length; k++)
          food_calories_total += state.tableData1[k][2];
      }else{}
      return food_calories_total
    }
    
    function calc_table_exercise(){
      var ex_calories_total = 0;
      
      if (state.tableData2 != null){
        for (var k = 0; k < state.tableData2.length; k++)
          ex_calories_total += state.tableData2[k][3];
      }else{}
      return ex_calories_total;
    }

    
    var recommended = 2140;
    var calories_consumed = calc_table_food();
    var calories_burnt = calc_table_exercise();
    function calc_net_calories(recommended,calories_consumed,calories_burnt){
      var net_calories = recommended - calories_consumed + calories_burnt;
      return setNetCal(net_calories);
    }
    var net_cal = calc_net_calories(recommended,calories_consumed,calories_burnt);
    //var net_cal = recommended - calories_consumed + calories_burnt;
    var exercise_cal = cal_exercise(
      this.state.selectedExCal,
      this.state.selectedMin,
      this.state.selectedMul);

    var food_cal = cal_food(
      this.state.selectedFoodCal,
      this.state.selectedServing)


    return(
      
      <ScrollView backgroundColor="#FFFFEE" showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled"> 
        <Block row space='evenly' style={styles.calories}>
          <Block middle flex>
            <Text center bold size={15}>Recommended</Text>
            <Text center bold size={15}>Intake</Text>
            <Block shadow middle style={styles.infoBox}>
              <Text bold size={28} style={{marginBottom: -5}}>{recommended}</Text>
              <Text muted size={20}>kcal</Text>
            </Block>
          </Block>
          <Block middle flex>
            <Text center bold size={15}>Calories</Text>
            <Text center bold size={15}>Consumed</Text>
            <Block shadow middle style={styles.infoBox}>
              <Text bold size={28} style={{marginBottom: -5}}>{calories_consumed}</Text>
              <Text muted size={20}>kcal</Text>
            </Block>
          </Block>  
          <Block middle flex>
            <Text center bold size={15}>Calories</Text>
            <Text center bold size={15}>Burned</Text>
            <Block shadow middle style={styles.infoBox}>
              <Text bold size={28} style={{marginBottom: -5}}>{calories_burnt}</Text>
              <Text muted size={20}>kcal</Text>
            </Block>
          </Block> 
        </Block>
        <Block>
          <Block middle flex style ={{paddingVertical:10}}>
            <Text center bold size={15}>{cal_table_msg(net_cal)}</Text>
            <Block middle flex style={styles.infoBox2} {...cal_table_colour(net_cal)}>
              <Text bold size={28}>{net_cal} kcal</Text>   
            </Block>
          </Block>
        </Block>
        
        <Block>
          <Block style={{padding: 16, paddingTop: 30}}>
            
            <Block style={{alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
              <Text bold size={18} style={{paddingVertical:10}}>Input Food Consumed</Text>
              <Button 
                  color='#76BA1B'  
                  style={{ width: 40, height: 40, left: 118}}
                  onPress={()=>this.toggleModal()}
                >+</Button>
                
                <Modal isVisible={state.isModalVisible}>
                  <View style={{ paddingVertical:width/3, flex: 1, justifyContent: "center", alignItems: "center" }}>
                      
                    </View>
                </Modal>
              
              <Button
                  color='#CD5C5C' 
                  style={{width: 40, height: 40, left: 108 }}
                  onPress={()=>{
                    removeFood("@food_Key");
                    getFoodCalories()
                      .then((FoodList) => {
                        this.setState({
                          tableData1: FoodList
                        })  
                      });
                    alert("Removed All Food") 
                  }}
                >—</Button>
              {/* <Button
                  color='#CD5C5C' 
                  style={{width: 60, height: 40, left: -60 }}
                  onPress={()=>{
                    
                    getFoodCalories()
                      .then((FoodList) => {
                        console.log(FoodList);
                        this.setState({
                          tableData1: FoodList
                        })  
                      });
                    
                  }}
                >Reload</Button> */}
                </Block>
            <Table flex borderStyle={{borderWidth: 1, borderColor: '#777'}} style={{borderRadius: 5, overflow: 'hidden'}}>
              <Row data={state.tableHead1} style={styles.head} textStyle={styles.text}/>
              <Rows data={state.tableData1} style={{backgroundColor: '#F6EEE2'}} textStyle={styles.text}/>
            </Table>
          </Block>
          <Modal isVisible={state.isModalVisible}>
                <View style={{ flex: 0, justifyContent: "flex-end", alignItems: "center" }}>
                    <Block shadow style={styles.inputFoodBox}>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text size={18} style={{marginBottom: 5}}> Food:       </Text>
                        <SearchableDropdown
                          //onItemSelect called after the selection from the dropdown
                          onItemSelect={(item, index) => {
                            this.setState({
                              selectedFood: item.name,
                              selectedFoodCal: item.cal
                            })
                          }}
                          //suggestion container style
                          containerStyle={{ width:width/2, padding: 5 }}
                          
                          itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#eee',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                          }}
                          //itemTextStyle={{ color: '#222' }}
                          itemsContainerStyle={{ maxHeight: 90}}
                          items={foods}
                          //mapping of exercises array
                          //defaultIndex={2}
                          resetValue={false}
                          //reset textInput Value with true and false state
                          placeholder ={this.state.selectedFood=="" ? 'Select Food': this.state.selectedFood}
                          textInputProps={
                            {
                              underlineColorAndroid: "transparent",
                              style: {
                                padding: 10,
                                borderWidth: 1,
                                borderColor: '#444',
                                borderRadius: 5,
                              },
                            }
                          }
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </Block>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text size={18} style={{marginBottom: 5}}>Servings:  </Text>
                          <TextInput
                            style={{
                              width:width/2.1,
                              padding: 10,
                              borderWidth: 1,
                              borderColor: '#444',
                              borderRadius: 5,}}
                            value={this.state.selectedServing}
                            onChangeText={(selectedServing) => this.setState({selectedServing})}
                            placeholder="Input Servings"
                            keyboardType="numeric"
                          />
                      </Block>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text bold size={16} style={{width: width/4, height: 60, marginBottom: 5}}>
                          Calories Consumed: 
                          {food_cal}
                        </Text>
                        <Button 
                          style={{width: width/6, height: 40}} 
                          onPress={()=>{   
                            if (this.state.selectedServing > 0 && food_cal > 0)     
                              {storeFoodCalories([this.state.selectedFood, this.state.selectedServing, food_cal])
                                .then(() => getFoodCalories())
                                .then((FoodList) => {
                                  console.log(FoodList);
                                  this.setState({tableData1: FoodList})  
                                });
                            }else{alert("Error / All information required")}
                            this.toggleModal();       
                          }}
                        >Confirm</Button>
                        <Button 
                          style={{width: width/6, height: 40}} 
                          onPress={()=>this.toggleModal()}
                        >Cancel</Button>
                      </Block>
                    </Block>
                  </View>
                <View style={{ flex: 0.1}}/>
                <View style={{ flex: 0, justifyContent: "flex-end", alignItems: "center" }}>
                  <Block shadow style={styles.inputExBox}>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text size={18} style={{marginBottom: 5}}>Exercise: </Text>
                        <SearchableDropdown
                          onItemSelect={(item, index) => {
                            this.setState({
                              selectedEx: item.name,
                              selectedExCal: item.cal
                            })
                          }}
                          //suggestion container style
                          containerStyle={{ width:width/2, padding: 5 }}
                          
                          itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#eee',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                          }}
                          //itemTextStyle={{ color: '#222' }}
                          itemsContainerStyle={{ maxHeight: 90}}
                          items={exercises}
                          //mapping of exercises array
                          //defaultIndex={2}
                          resetValue={false}
                          //reset textInput Value with true and false state
                          textInputProps={
                            {
                              underlineColorAndroid: "transparent",
                              style: {
                                padding: 10,
                                borderWidth: 1,
                                borderColor: '#444',
                                borderRadius: 5,
                              },
                            }
                          }
                          placeholder = {this.state.selectedEx=="" ? 'Select Exercise': this.state.selectedEx}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </Block>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text size={18} style={{marginBottom: 5}}>Minutes:  </Text>
                          <TextInput
                            style={{
                              width:width/2.1,
                              padding: 10,
                              borderWidth: 1,
                              borderColor: '#444',
                              borderRadius: 5,}}
                            value={this.state.selectedMin}
                            onChangeText={(selectedMin) => this.setState({ selectedMin })}
                            placeholder="Input Minutes"
                            keyboardType="numeric"
                          />
                      </Block>
                      <Block style={{paddingHorizontal:1, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text size={18} style={{marginBottom: 5}}>Intensity: </Text>
                        <SearchableDropdown
                          //onItemSelect called after the selection from the dropdown
                          onItemSelect={(item, index) => {
                            this.setState({
                              selectedMul: item.multiply,
                              selectedIntensity: item.name
                            })
                          }}
                          //suggestion container style
                          containerStyle={{ width:width/2, padding: 5 }}
                          
                          itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#eee',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                          }}
                          //itemTextStyle={{ color: '#222' }}
                          itemsContainerStyle={{ maxHeight: 90}}
                          items={intensity}
                          //mapping of intensity array
                          //defaultIndex={2}
                          resetValue={false}
                          //reset textInput Value with true and false state
                          placeholder ={this.state.selectedIntensity=="" ? 'Select Intensity': this.state.selectedIntensity}
                          underlineColorAndroid= "transparent"
                          textInputStyle={{
                            // Inserted text style
                            padding: 10,
                            borderWidth: 1,
                            borderColor: '#444',
                            borderRadius: 5,
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </Block>
                      <Block style={{paddingHorizontal:10, alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
                        <Text bold size={18} style={{width: width/4, height: 50, marginBottom: 5}}>
                          Calories Burnt: 
                          {exercise_cal}
                        </Text>
                        <Button 
                          style={{width: width/6, height: 40}} 
                          onPress={()=>{
                            if (this.state.selectedMin > 0 && exercise_cal > 0)     
                              {storeExerciseCalories([this.state.selectedEx, this.state.selectedMin, this.state.selectedIntensity, exercise_cal])
                                .then(() => getExerciseCalories())
                                .then((ExList) => {
                                  this.setState({
                                    tableData2: ExList
                                  })  
                                });
                            }else{alert("Error / All information required")}
                            this.toggleModal();
                          }}
                        >Confirm</Button>
                        <Button 
                          style={{width: width/6, height: 40}} 
                          onPress={()=>this.toggleModal()}
                        >Cancel</Button>
                      </Block>
                    </Block>
                </View>
              </Modal>
        <Block style={{padding: 16, paddingTop: 10}}>
          <Block style={{alignItems:"center", flexDirection:"row", flexWrap: "wrap"}}>
            <Text bold size={18} style={{paddingVertical:10}}>Input Exercise</Text>
              <Button 
                color='#76BA1B'  
                style={{ width: 40, height: 40, left: 180}}
                onPress={()=>this.toggleModal()}
              >+</Button>
              
            
              <Button
                color='#CD5C5C' 
                style={{width: 40, height: 40, left: 170 }}
                onPress={()=>{
                  removeExercise("@exercise_Key");
                  getExerciseCalories()
                    .then((ExList) => {
                      this.setState({
                        tableData2: ExList
                      })  
                    });
                  alert("Removed All Exercises") 
                }}
              >—</Button>
              {/* <Button
                color='#CD5C5C' 
                style={{width: 60, height: 40, left: 2 }}
                onPress={()=>{
                  getExerciseCalories()
                    .then((ExList) => {
                      this.setState({
                        tableData2: ExList
                      })  
                    });
                }}
              >Reload</Button> */}
              </Block>
          
          <Table flex borderStyle={{borderWidth: 1, borderColor: '#777'}} style={{borderRadius: 5, overflow: 'hidden'}}>
            <Row data={state.tableHead2} style={styles.head} textStyle={styles.text}/>
            <Rows data={state.tableData2} style={{backgroundColor: '#F6EEE2'}} textStyle={styles.text}/>
          </Table>

          
        </Block>
        </Block>
      </ScrollView>   
    )
  }


  render() {
    return (
      <Block flex center style={styles.home}>
        {this.render()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,  
  },
  calories: {
    alignItems:'center', 
    flex: 1,     
    marginTop: 10, 
    marginBottom: 10,
  },
  infoBox: {
    height: width/6,
    width: width/4.5,
    borderRadius: 10,
    flex: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
    zIndex: 1,
    backgroundColor: "#FFD789",
  },

  infoBox2: {
    paddingVertical: width/30,
    paddingHorizontal: width/20,
    borderRadius: 10,
    borderWidth: 0,
    flex: 0,
    marginTop: 10,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
    zIndex: 1
  },

  inputExBox: {
    padding: 20,
    width: width/1.2,
    borderRadius: 10,
    flex: 0,
    alignItems: 'center',
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
    zIndex: 1,
    backgroundColor: "white",
  },

  inputFoodBox: {
    padding: 20,
    width: width/1.2,
    borderRadius: 10,
    flex: 0,
    alignItems: 'center',
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    elevation: 10,
    zIndex: 1,
    backgroundColor: "white",
  },

  container: {
    width: width,
    flex: 1,  
    alignItems: 'center', 
    backgroundColor: '#F5FCFF'
  },
  
  tableContainer: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  head: { 
    height: 40, 
    backgroundColor: '#CEB396' 
  },
  text: { 
    margin: 6, 
  }
});
