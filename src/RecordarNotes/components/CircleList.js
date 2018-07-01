import React, { Component } from "react";
import {
  ScrollView,
  View,
  TouchableHighlight,
  Modal,
	FlatList,
	ListItem,
	PanResponder,
	Animated
} from "react-native";
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

import { styles } from "../style/style.js";

export default class CircleList extends Component<Props> {

	state = {
		// make this variable responsive to screen
		width: 200,
		percent: 0,
		centerX: 200, 
		centerY: 200/2,
	}

  constructor(props) {
    super(props);
  }

	generateCircle = (Ypos, width, color, index) => ({
		position: 'absolute',
		right: 0-width/2, 
		bottom: Ypos - width/2,
		width: width, 
		height: width,
		borderRadius: width/2,
		backgroundColor: color,
		zIndex: index
	})

	componentWillMount(){

		this._panResponder = PanResponder.create({
			// Ask to be the responder:
			//onStartShouldSetPanResponder: (evt, gestureState) => true,
			//onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			//onMoveShouldSetPanResponder: (evt, gestureState) => true,
			//onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			////onPanResponderGrant: (evt, gestureState) => {
			////	console.log(evt)
			////	console.log(gestureState)
			////},
			////onPanResponderMove: (evt, gestureState) => {
			////	console.log(evt)
			////	console.log(gestureState)
			////	return true;
			////},
			//onPanResponderRelease: (evt, gestureState) => {
			//	console.log(gestureState)
			//	console.log(evt)
			//},
			//onShouldBlockNativeResponder: (evt, gestureState) => {
			//	console.log(gestureState)
			//	console.log(evt)
			//	return true
			//},
		});

	}

	getCoordinatesForPercent(percent) {
		// percent = 0..1
		const x = Math.cos(2 * Math.PI * percent)*this.state.centerX;
		const y = Math.sin(2 * Math.PI * percent)*this.state.centerY;
		//return [x, y];
		return `${x} ${y}`
	}

	generateSlices(centerX, centerY, width) {
		let slices = [];
		let currentAngle = 0; 
		for (let i = 0 ; i < 6 ; i++){
			slices.push(	
				<Path fill="black" d={`M ${this.getCoordinatesForPercent(currentAngle)} A ${width} ${width} 0 0 1 ${this.getCoordinatesForPercent(currentAngle+0.1666)} L ${centerX} ${centerY}`}></Path>
			)
			currentAngle+=0.1666
		}

		return slices;
	}

  render() {

		const width = this.state.width;
		const centerX = width;
		const centerY = width/2;
		const Ypos = this.props.positionY; 

    return (

			<Svg height={width}	width={width} style={{ position: 'absolute', bottom: Ypos, right: 20, backgroundColor: 'lightpink'}}>

				<Circle
						cx={width}
						cy={width/2}
						r={width/2}
						stroke="blue"
						strokeWidth="2.5"
						fill="green"
				/>
				{/*this.generateSlices(centerX,centerY, width)*/}
				<Path fill="black" d={`M ${centerX*0.5} ${centerY * 1} A ${width} ${width} 0 0 1 ${centerX } ${centerY * Math.cos(2 * Math.PI * 0.5)} L ${centerX} ${centerY}`}></Path>


			</Svg>

    );
  }
}
