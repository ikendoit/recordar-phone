import React, {Component} from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { YellowBox } from 'react-native';
import Notes from './RecordarNotes';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
//YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
export default class Recordar extends Component {

	constructor(props) {

		super(props)

	}

  render(){

		return (

			<Router> 

				<Scene key="root" >

					<Scene key="Notes" component={Notes} title="Notes" initial/>

				</Scene>

			</Router>

		)

  }

}
