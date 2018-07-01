import React, { Component } from "react";
import { TouchableOpacity, Alert, AsyncStorage } from "react-native";

// COMPONENTS
import { push, fetchDates, fetchNotes } from "../utils/notes_query_manager";
import { styles } from "../style/style.js";
import diff from "./differ";

export default class SaveButton extends Component<Props> {
  constructor(props) {
    super(props);
  }

  /*
		update current state.notes with new data from server, diff the contents conflicts
	*/
  async update_notes(server) {
    let current_notes = this.props.context.state.notes;
    let current_changes = JSON.parse(await AsyncStorage.getItem("changes"));
    for (let note of server) {
      for (let type of note.data) {
        let found_note = false;
        for (let state_note of current_notes) {
          if (
            state_note.cat_id === note.cat_id &&
            state_note.cat_name === note.cat_name
          ) {
            found_note = true;
            let found_type = false;
            for (let state_type of state_note.data) {
              if (state_type.type === type.type) {
                state_type.content = diff.diff(
                  state_type.content + "\n",
                  type.content + "\n"
                );
                state_type.date = type.date;
                found_type = true;
                break;
              }
            }
            if (!found_type) {
              state_note.data.push({
                type: type.type,
                date: type.date,
                content: type.content,
                hash: type.hash
              });
            }
            break;
          }
        }
        if (!found_note) {
          current_notes.push(note);
        }
      }
    }
    await AsyncStorage.setItem("notes", JSON.stringify(current_notes));
    //update context store
    this.props.context.saveNotes(
      current_notes,
      this.props.context.state.content
    );
  }

  /* 
		Check if anyone else has changed our data on the server
	*/
  async compare() {
    let newTimes = await fetchDates(this.props.context.state.userID);
    newTimes = newTimes.data.notes;
    //flag to check if data from server is conflicted
    let conflicted = false;
    //check if anyone else has changed our data on the server
    let differences = [];
    //make a copy of the original global time
    let cur_times = this.props.context.state.globTime;
    //check to see what the server have that are different from our local cur_notes
    for (let note of newTimes) {
      let cur_difference = {
        cat_id: note.cat_id,
        cat_name: note.cat_name,
        data: []
      };
      for (let type of note.data) {
        for (let timed_note of cur_times) {
          if (timed_note.cat_id === note.cat_id) {
            let found = false;
            for (let timed_type of timed_note.data) {
              if (
                timed_type.type == type.type &&
                timed_type.date == type.date
              ) {
                found = true;
                break;
              }
            }
            if (!found) {
              let type_only = { type: type.type };
              cur_difference.data.push(type_only);
            }
          }
        }
      }

      if (cur_difference.data.length > 0) {
        differences.push(cur_difference);
      }
    }
    return differences;
  }

  /*
		when "save" button is clicked: 
			+	save current progress
			+	sync with online server
	*/
  async onSave(e) {
    //reset conflict storage so we don't highlight purple notes anymore
    this.props.context.loadConflicts([]);
    await this.props.context.saveNotes(null, this.props.context.state.content);
    //check if another user changed our notes on the server
    let differentDatas = await this.compare();

    //if there is conflicted notes between local machine and server
    if (differentDatas.length > 0) {
      let server = await fetchNotes(
        differentDatas,
        this.props.context.state.userID
      );
      console.log(differentDatas);
      //problem with internet
      if (server === 1) {
        Alert.alert("warning", "Unstable Internet");
        return;
      }
      console.log(server);
      this.props.context.loadConflicts(differentDatas);
      await this.update_notes(server.data.notes_type);
      this.props.context.renderContent(null);
    }

    //Override server with our (Now) resolved notes
    let flag_push = await push(
      this.props.context.state.notes,
      false,
      this.props.context.state.userID
    );

    if (flag_push === 1) {
      console.log("internet broken");
      Alert.alert("warning", "Unstable Internet Connection");
    } else {
      if (differentDatas.length > 0) {
        Alert.alert("warning", "You Have Conflicted Notes");
      } else {
        Alert.alert("success", "Notes Synced With Server");
      }
    }
    //update our current global time (server stored time) with our latest timestamps
    let new_times = [];
    for (let note of this.props.context.state.notes) {
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
      new_times.push(timed_note);
    }

    //add to current redux storage for quick access
    this.props.context.loadTimes(new_times);

    //add to localStorage for long term store
    await AsyncStorage.setItem("globTime", JSON.stringify(new_times));
    //remove "changes" from localStorage
    await AsyncStorage.removeItem("changes");
  }

  render() {
    return (
      <TouchableOpacity
        key={"conflict"}
        style={styles.MenuActivator}
        onPress={this.onSave.bind(this)}
      >
        {this.props.icon}
      </TouchableOpacity>
    );
  }
}
