/**
 * Checks if age, height and weight are invalid or not
 * @param {string} age 
 * @param {string} height 
 * @param {string} weight 
 * @returns if input is invalid
 */
export function invalidInput(age, height, weight){
    if(invalidAge(age))
        return true
    if(invalidHeight(height))
        return true;
    if(invalidWeight(weight))
        return true;
    
    return false;
}

/**
 * Checks if the username is invalid
 * @param {string} username 
 * @returns if username is invalid
 */
export function invalidUsername(username){
    if(username === "")
        return true;
    if(username.length < 0 || username.length > 13)
        return true;
    
    return false;
}

/**
 * Checks if the age is invalid
 * @param {string} age 
 * @returns if age is invalid
 */
function invalidAge(age){
    if(age === "")
        return true;
    let intAge = parseInt(age);
    if(intAge == NaN)
        return true;
    if(intAge < 0 || intAge > 110)
        return true;
        
    return false;
}

/**
 * Checks if the height is invalid
 * @param {string} height 
 * @returns if height is invalid
 */
function invalidHeight(height){
    if(height === "")
        return true;
    let intHeight = parseInt(height);
    if(intHeight == NaN)
            return true;
    if(intHeight < 50 || intHeight > 250)
        return true;

    return false;
}

/**
 * Checks if the weight is invalid
 * @param {string} weight 
 * @returns if weight is invalid
 */
function invalidWeight(weight){
    if(weight === "")
        return true;
    let intWeight = parseInt(weight);
    if(intWeight == NaN)
            return true;
    if(intWeight < 10 || intWeight > 300)
        return true;

    return false;
}

/**
 * Calculates the user's BMI using his height and weight
 * @param {int} weight 
 * @param {int} height 
 * @returns user's BMI
 */
export function getBMI(weight, height) {
    let bmi = weight / (((height / 100) * height) / 100);
    return bmi.toFixed(1);
}

/**
 * Calculates the user's recommended calorie intake everyday
 * @param {string} gender 
 * @param {int} weight 
 * @param {int} height 
 * @param {int} age 
 * @returns recommended daily calorie intake
 */
export function getRecomendedCal(gender, weight, height, age) {
    if (gender == 'Male'){
        var recommendedCal = (66.5 + 13.8*weight + 5*height - 6.8*age)*1.375;
    }else{var recommendedCal =  (655.1 + 9.563*weight + 1.85*height - 4.676*age)*1.375}
    return recommendedCal.toFixed(0);
}