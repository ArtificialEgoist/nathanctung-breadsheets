import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin'; // onTouchTap (http://stackoverflow.com/a/34015469/988941)
injectTapEventPlugin();
import Popup from './Popup.jsx';

const App = () => (
	<MuiThemeProvider>
		<Popup />
	</MuiThemeProvider>
);


ReactDOM.render(
  <App />,
  document.getElementById('breadsheets')
);