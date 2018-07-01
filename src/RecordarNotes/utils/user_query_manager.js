import {RECORDAR_HOST} from 'react-native-dotenv';
const hostName=RECORDAR_HOST;

/*
	log user in 
	@param: username, password 
	@return: jwt token
*/
async function logIn(username, password) {
  return await fetch(`${hostName}/api/user/login`, {
    body: JSON.stringify({
      username: username,
      password: password
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => {console.log(res); return res.json()})
    .catch(err => {
      console.log("user_query.15: " + err);
      return 1;
    });
}

/*
	sign user up
	@param: username, password, email
	@return: jwt token
*/
async function signUp(username, password, email) {
  return await fetch(`${hostName}/api/user/register`, {
    body: JSON.stringify({
      username,
      password,
      email
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => {
      console.log("user_query.15: " + err);
      return 1;
    });
}

export { logIn, signUp };
