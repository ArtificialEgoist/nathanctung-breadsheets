import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

class Popup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="">
				<h1>Breadsheets</h1>
				<RaisedButton
					label="Click Me"
					primary={true}
					onTouchTap={() => console.log('you clicked me!')}
				/>
			</div>
		);
	}
}

Popup.propTypes = {};

Popup.defaultProps = {};

export default Popup;