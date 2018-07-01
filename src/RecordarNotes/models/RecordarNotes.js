import React, { Component } from "react";
import { AsyncStorage } from "react-native";
//React Context API
const RecordarNotesContext = React.createContext("RecordarNotes");

class RecordarNotes extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      userID: null,
      categories: [],
      category: null,
      type: null,
      content: null,
      globTime: [],
      conflicts: [],
      changes: []
    };
  }

  //TODO: anytime method is called => considered a data => no need to bind, context is always what it expects to be
  loadUser = id => {
    this.setState({ userID: id });
  };

  //when calll multiple set state => put to a queue
  //async
  loadNotes = notes => {
    this.setState({ notes });
  };

  loadCategories = categories => {
    this.setState({ categories });
  };

  loadCategory = category => {
    this.setState({ category });
  };

  loadChanges = changes => {
    this.setState({ changes });
  };

  /*
			load server's current time
			so we can compare and know if a third party has changed our notes
	*/
  loadTimes = globTime => {
    this.setState({ globTime });
  };

  /*
			load the conflict data
			so that we know what note has conflict
	*/
  loadConflicts = conflicts => {
    this.setState({ conflicts });
  };

  /*
			render new content based on typeName 
			update to state.content
	*/
  renderContent = typeName => {
    if (this.state.category) {
      //iterate through all note object
      for (let note of this.state.notes) {
        if (note.cat_name === this.state.category) {
          //iterate through data list of this category
          for (let type of note.data) {
            if (typeName === null || typeName === type.type) {
              this.setState({ type: type.type, content: type.content });
              return type.content;
            }
          }
        }
      }
    }
    this.setState({
      content:
        "no data found, please create a new category and its type before adding important information (click the 3 dots symbol to create)"
    });
    return;
  };

  /*
			init client app 
			populate the app with data fetched from server 
			update state: content, categories, category (set default to first category ) 
			@param: serverNote: notes from server, format: 
					cat_id 
					cat_name 
					data: [] 
							type 
							content 
							date 
							hash
	*/
  initClient = serverNotes => {
    //server's timestamps
    let times = [];
    //load list of categories
    let categories = [];
    //init variables: times and categories
    for (let note of serverNotes) {
      let timed_note = {
        cat_id: note.cat_id,
        cat_name: note.cat_name,
        data: []
      };
      for (let timed_type of note.data) {
        timed_note.data.push({
          date: timed_type.date,
          type: timed_type.type
        });
      }
      if (categories.indexOf(note.cat_name) < 0) categories.push(note.cat_name);
      times.push(timed_note);
    }

    this.setState({
      conflicts: [],
      categories,
      category: categories[0],
      notes: serverNotes,
      globTime: times,
      type: null,
      content: null
    });
    return;
  };

  /*
	on change anything (category, type) 
	save the data offline (update this.state with latest local changes)
			@param: current_notes : changed notes data by the UI
							current_content: changed content of a note by the UI
				cases: 
					params: (null, content) => update current content to current notes
					params: (notes, null) => save new notes to current context
			@return: 
	*/
  saveNotes = async (currentNotes, currentContent) => {
    //pass null = current_content if we just want to save the current notes, not update the current content to state.notes
    if (currentContent === null && currentNotes !== null) {
      await AsyncStorage.setItem("recordar", JSON.stringify(currentNotes));
      this.setState({ notes: currentNotes });
      return;
    }

    //check if content has been change:
    //update new date to note storage
    //add id and type of changed note to localStorage
    if (this.state.content !== currentContent) {
      //get current date, format it in SQL datetime format: YYYY/MM/DD HH:MM:SS
      let date = new Date();
      let curTime =
        date.getYear() +
        1900 +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
      let newNotes = [];

      //update new data to this.state.notes
      for (let note of this.state.notes) {
        //iterate through every data list of note object
        for (let data of note.data) {
          if (
            data.type === this.state.type &&
            note.cat_name === this.state.category
          ) {
            //update new data and date to redux notes store
            data.content = currentContent;
            data.date = curTime;
            data.hash = "Hashing hashing";
          }
        }
        newNotes.push(note);
      }

      let changes = JSON.parse(await AsyncStorage.getItem("changes"));
      if (!changes) {
        changes = [];
      }

      let changeData = {
        cat_id: this.state.category,
        type: this.state.type,
        date: curTime
      };
      let contained = false;
      for (let change of changes) {
        if (
          change.cat_id === changeData.cat_id &&
          change.type === changeData.type
        ) {
          change.date = changeData.date;
          contained = true;
        }
      }
      if (!contained) {
        changes.push(changeData);
      }
      await AsyncStorage.setItem("changes", JSON.stringify(changes));
      await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
      this.setState({ notes: newNotes });
      return;
    }
    return;
  };

  /* 
		delete all data currently
	*/
  reset = async () => {
    await AsyncStorage.removeItem("notes");
    await AsyncStorage.removeItem("globTime");
    await AsyncStorage.removeItem("userID");
    return {
      user_id: null,
      notes: [],
      categories: [],
      category: null,
      type: null,
      content: null,
      glob_time: [],
      conflicts: []
    };
  };

  render() {
		const value = {
			state: this.state,
			loadUser: this.loadUser,
			initClient: this.initClient,
			saveNotes: this.saveNotes,
			loadNotes: this.loadNotes,
			loadCategories: this.loadCategories,
			loadCategory: this.loadCategory,
			loadTimes: this.loadTimes,
			loadConflicts: this.loadConflicts,
			renderContent: this.renderContent,
			reset: this.reset
		}

    return (
      <RecordarNotesContext.Provider value={value} >
				{this.props.children}
      </RecordarNotesContext.Provider>
    );
  }
}

export default {
	Consumer: RecordarNotesContext.Consumer, 
	Provider: RecordarNotes
}
