import {RECORDAR_HOST} from 'react-native-dotenv';
const hostName=RECORDAR_HOST;

//***********************************************************Query Notes
/* notes format:  []  (CODE: "*1*")
   { cat_name 
	 cat_id 
	 data: []
		 {
			 type 
			 content 
			 date 
			 hash
		 }
   }
   @param: notes: to push to server 
   @param: flag: is this push overriding the server 
   @return: 0 for success, 1 for failure
*/
async function push(notes, flag = false, user_id) {
  return await fetch(`${hostName}/api/notes`, {
    body: JSON.stringify({
      query:
        "mutation($Notes: [Note_Input]!, $Flag: String!, $ID: String!) { all_notes_input(notes: $Notes, user_id:$ID, flag: $Flag) {hash }}",
      variables: {
        //temporary, TODO: future: check for changes in localStorage, integrate to
        //this graphql variables to reduce payload transfer
        Notes: notes,
        Flag: "" + flag,
        ID: user_id
      }
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => {
      console.log("query_manager.37 " + err);
      return 1;
    });
}

async function clone(user_id) {
  return await fetch(`${hostName}/api/notes`, {
    body: JSON.stringify({
      query:
        "query($ID:String!) { notes(id: $ID){cat_id, cat_name,data { type, content, hash, date }} }",
      variables: {
        ID: user_id
      }
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(resJSON => {
      return resJSON["data"]["notes"];
    })
    .catch(err => console.log("n_q_m.27: " + err));
}

/*
	fetch notes from server based on a format
	format: []     CODE: "*2*"
	{
		cat_id string
		cat_name string
		data: [] 
			type string
	}
	@params: datas: data to query from server
	@return: notes: data from server, notes in format "*1*"
*/
async function fetchNotes(query_variable, user_id) {
  return await fetch(`${hostName}/api/notes`, {
    body: JSON.stringify({
      query:
        "query ($Notes: [Note_Type]!, $ID: String!) {notes_type(notes: $Notes, id:$ID){cat_id, cat_name, data{ type date content hash}}}",
      variables: {
        Notes: query_variable,
        ID: user_id
      }
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => {
      console.log("query_manager.82: " + err);
      return 1;
    });
}

/*
	query all dates info from server
	@param: JWT
	@return dates data
		format: []          CODE:"*3*"
		{	cat_id 
			cat_name 
			data: []
			{	type 
				date
			}
		}
*/
async function fetchDates(user_id) {
  return await fetch(`${hostName}/api/notes`, {
    body: JSON.stringify({
      query:
        "query($ID:String!) { notes(id: $ID){cat_id, cat_name,data { type, date }} }",
      variables: {
        ID: user_id
      }
    }),
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => {
      console.log("query_manager.102: " + err);
      return [];
    });
}

export { fetchDates, push, clone, fetchNotes };
