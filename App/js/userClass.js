
/*
 * Represents a user in all their glory
 */ 
function userClass(username, auth){

	//a map of the data
	var userData = [];

	/*
	 * Gets the user name
	 *
	 * @return the username
	 */
	this.getUserName = function(){
		return username;
	};

	/*
	 * Gets the user auth
	 *
	 * @return the auth
	 */
	this.getUserAuth = function(){
		return auth;
	};

	/*
	 * Adds the user data
	 *
	 * @param dataName the data you are adding
	 * @param the data to add
	 */ 
	this.addUserData = function(dataName, data){
		userData[dataName] = data;
	};

	/*
	 * Gets the user data
	 *
	 * @param dataName the data you wish for
	 *
	 * @return the data if it exists, otherwise false
	 */ 
	this.getUserData = function(dataName){
		if(userData[dataName]){
			return userData[dataName];
		}else{
			return false;
		}
	};

	/*
	 * Increments the user data
	 *
	 * @param dataName the data you increment
	 *
	 * @return the data if it exists, otherwise false
	 */ 
	this.incrementUserData = function(dataName){
		if(userData[dataName]){
			userData[dataName]++;
			return userData[dataName];
		}else{
			return false;
		}	
	}
}