import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  Button,
//  ActivityIndicator, // For use in the future
  TouchableOpacity,
  TextInput,
  AsyncStorage, // TODO: redux-persist
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./style/style.js";

// COMPONENTS
import Reception from "./components/Reception";
import CatNav from "./components/CatNav";
import TypeNav from "./components/TypeNav";
import SaveButton from "./components/SaveButton";
import PushButton from "./components/PushButton";
import CloneButton from "./components/CloneButton";
import LogoutButton from "./components/LogoutButton";
import CircleList from './components/CircleList'

// context
import NotesContext from './models/RecordarNotes';

/*
	Home Page of Recordar Notes
	Will show Receptionist if not logged in 
	Else shows Recordar Notes
*/
class App extends Component<Props> {

  constructor(props) {

    super(props);
    this.state = {
      curContent: "",
      menuActivated: false
    };
    this.checkStorage();

  }

	componentWillMount = () => {
	}

  /*
		check for offline storage, format : 
			userID: string 
			notes : [] 
				cat_name 
				cat_id 
				data [] 
					type 
					content 
					date 
					hash 
			globTime : []
				cat_name 
				cat_id 
				data: []
					type 
					date
			changes: []
				cat_id 
				type 
				date
	*/
  checkStorage = async () => {

    let storedNotes = await AsyncStorage.getItem("notes");
    let storedUser = await AsyncStorage.getItem("userID");
    let storedTime = await AsyncStorage.getItem("globTime");
    if (storedUser) {
      notes = JSON.parse(notes);
      this.props.context.loadUser(storedUser);
      this.props.context.initClient(storedNotes);
      this.props.loadTime(storedTime);
      this.props.context.renderContent(null);
    }

  }

  renderMenus = (e) => {

    this.setState({ menuActivated: !this.state.menuActivated });

  }

  render() {

    if (!this.props.context.state.userID) {
      return (
				<View>
					<Reception context={this.props.context} />
					<CircleList positionY={100} />
				</View>
			)
    } else {
      if (this.props.context.state.content === null) {
        return (
					<View>
            <Text style={{textAlign:'center'}}> {this.props.context.state.content} </Text>
            <Text style={{textAlign:'center'}}> Loading ... </Text>
					</View>
        );
      } else {

        return (

          <ScrollView >
						{this.state.menuActivated && (
							<View>
								<CatNav context={this.props.context} />
								<TypeNav context={this.props.context} />
							</View>
						)}

						<View
							key={"Menus"}
							style={{
								flexWrap: "wrap",
								alignItems: "flex-end",
								flexDirection: "row",
								marginBottom: 5,
								marginTop: 2
							}}
						>
							<PushButton
								context={this.props.context}
								icon={<Icon name="pencil" size={27} color="#01a699" />}
							/>
							<CloneButton
								context={this.props.context}
								icon={<Icon name="clone" size={27} color="#01a699" />}
							/>
							<SaveButton
								context={this.props.context}
								icon={<Icon name="users" size={27} color="#01a699" />}
							/>

							<TouchableOpacity
								style={styles.MenuActivator}
								onPress={this.renderMenus.bind(this)}
							>
								<Icon name="ellipsis-v" size={43} color="#01a699" />
							</TouchableOpacity>
						</View>

						{this.state.menuActivated && (
							<LogoutButton
								context={this.props.context}
								icon={<Icon name="clone" size={27} color="#01a699" />}
							/>
						)}
						<View key={"editor"} style={{ backgroundColor: "#c2fcfb" }}>
							<TextInput
								multiline={true}
								style={{ fontSize: 13 }}
								onChangeText={async curContent =>
									await this.props.context.saveNotes(null, curContent)
								}
							>
								<Text>{this.props.context.state.content}</Text>
							</TextInput>
						</View>
						<View style={{ height: 81 }} />


					</ScrollView>
				);

      }

    }

  }
}

export default  () => (
	<NotesContext.Provider> 

		<NotesContext.Consumer>

			{ notesContext => 
					<App context={notesContext}/>
			}

		</NotesContext.Consumer>

	</NotesContext.Provider>
);
