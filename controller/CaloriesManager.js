import React, { Component, Fragment} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export var exercises = [
    {id: 1, name: 'Running', cal: 13,},
    {id: 2, name: 'Swimming', cal: 9,},
    {id: 3, name: 'Weight Lifting', cal: 8,},
    {id: 4, name: 'Basketball', cal: 11,},
    {id: 5, name: 'Cycling', cal: 12,},
    {id: 6, name: 'Walking', cal: 5,},
    {id: 7, name: 'Yoga', cal: 7,},
    {id: 8, name: 'Jump Rope', cal: 10,},
  ];

export var intensity = [
  {id: 1, name: 'Low', multiply: 1,},
  {id: 2, name: 'Mid', multiply: 1.2,},
  {id: 3, name: 'High', multiply: 1.5,},
]

export var foods = [
  {id: 1, name: 'Plain Rice', cal:140},
  {id: 2, name: 'Bread', cal:90},
  {id: 3, name: 'Noodles', cal:200},
  {id: 4, name: 'Potatoes', cal:210},
  {id: 5, name: 'Fried Rice', cal:500},
  {id: 6, name: 'Beef', cal:300},
  {id: 7, name: 'Chicken', cal:220},
  {id: 8, name: 'Fish', cal:150},
  {id: 9, name: 'Apple', cal:44},
  {id: 10, name: 'Egg', cal:90},
  {id: 11, name: 'Burger', cal:450},
  {id: 12, name: 'Ice Cream', cal:200},
]

var net_calories = 2140;

/**
 * Set the user's net calorie
 * @param {int} value the net calorie to be set
 * @returns net_calories
 */
export function setNetCal(value){
  net_calories = value;
  return net_calories;
}

/**
 * Allows other components to retrieve user's net calories
 * @param {bool} focused 
 * @returns net_calories
 */
export function getNetCal(focused){
  if (focused)
    return net_calories;
}

/**
 * Returns a message based on the user's net calories
 * @param {int} net_calories 
 * @returns message
 */
export function cal_table_msg(net_calories){
  if (net_calories >= 0) return 'You can still consume...';
  else if (net_calories < 0) return 'You consumed an excess of...';
}

/**
 * Returns the color of the background based on the user's net calories
 * @param {int} net_calories 
 * @returns css color style
 */
export function cal_table_colour(net_calories){
  if (net_calories >= 0) return {backgroundColor: '#76BA1B'};
  else if (net_calories < 0) return {backgroundColor: '#CD5C5C'};
}

/**
 * Calculates and returns the output calorie due to exercise done
 * @param {int} ex 
 * @param {int} min 
 * @param {double} intensity 
 * @returns output_calorie
 */
export function cal_exercise(ex, min, intensity){
  return Math.round(ex * min * intensity);
}

/**
 * Calculates and returns the input calories due to food consumed
 * @param {int} cal 
 * @param {int} serv 
 * @returns input_calorie
 */
export function cal_food(cal, serv){
  return Math.round(cal * serv);
}

/**
 * Stores the food calories in the AsyncStorage for future usage
 * @param {int} value 
 * @returns 
 */
export const storeFoodCalories = async (value) => {
  try {
    
    var jsonValue = await AsyncStorage.getItem('@food_Key')
    if (jsonValue != null){
      jsonValue = JSON.parse(jsonValue);
      jsonValue.push(value);
      AsyncStorage.setItem('@food_Key', JSON.stringify(jsonValue));
      
      console.log("Saved: " + value);
    }else{
      AsyncStorage.setItem("@food_Key", JSON.stringify([]));
      jsonValue = await AsyncStorage.getItem('@food_Key')
      jsonValue = JSON.parse(jsonValue);
      jsonValue.push(value);
      AsyncStorage.setItem('@food_Key', JSON.stringify(jsonValue));
      
      console.log("Saved New: " + value);
    }
  } catch (error) {
    console.log(error);
    return null;
    // error reading value
  }
};

/**
 * Remove a food item from the AsyncStorage
 * @param {string} key 
 * @returns success
 */
export const removeFood = async(key) => {
  try {
    await AsyncStorage.removeItem(key);
    AsyncStorage.setItem("@food_Key", JSON.stringify([]));
    return true;
  }
  catch(exception) {
    return false;
  }
}

/**
 * Reads the AsyncStorage and returns all the food calories consumed by the user
 * @returns food_calories
 */
export const getFoodCalories = async() => {
  
    try {
        jsonValue = await AsyncStorage.getItem('@food_Key')
        jsonValue = JSON.parse(jsonValue);
        console.log(jsonValue);
        return jsonValue;
      } catch(e) {
        console.log("read error");
        return null;
      }
}

/**
 * Stores the exercise calories into the AsyncStorage
 * @param {int} value 
 * @returns 
 */
export const storeExerciseCalories = async (value) => {
  try {
    
    var jsonValue = await AsyncStorage.getItem('@exercise_Key')
    if (jsonValue != null){
      jsonValue = JSON.parse(jsonValue);
      jsonValue.push(value);
      AsyncStorage.setItem('@exercise_Key', JSON.stringify(jsonValue));
      
      console.log("Saved: " + value);
    }else{
      AsyncStorage.setItem("@exercise_Key", JSON.stringify([]));
      jsonValue = await AsyncStorage.getItem('@exercise_Key')
      jsonValue = JSON.parse(jsonValue);
      jsonValue.push(value);
      AsyncStorage.setItem('@exercise_Key', JSON.stringify(jsonValue));
      
      console.log("Saved New: " + value);
    }
  } catch (error) {
    console.log(error);
    return null;
    // error reading value
  }
};

/**
 * Remove a particular exercise from the AsyncStorage
 * @param {string} key 
 * @returns success
 */
export const removeExercise = async(key) => {
  try {
    await AsyncStorage.removeItem(key);
    AsyncStorage.setItem("@exercise_Key", JSON.stringify([]));
    return true;
  }
  catch(exception) {
    return false;
  }
}

/**
 * Reads the AsyncStorage and returns all the exercise calories
 * @returns exercise_calories
 */
export const getExerciseCalories = async () => {
  
    try {
        jsonValue = await AsyncStorage.getItem('@exercise_Key')
        jsonValue = JSON.parse(jsonValue);
        return jsonValue;
      } catch(e) {
        console.log("read error");
        return null;
      }
}