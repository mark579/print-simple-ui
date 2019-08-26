import React from 'react';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PrinterPanel from './PrinterPanel';
import { withStyles } from '@material-ui/core/styles';

import './App.css';

const styles = theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.timer = setInterval(()=> this.getStatus(), 1500);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  getStatus(){
    fetch('/status')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  renderPrinterPanels(){
    const data = this.state.data;
    if (data == null){
      return "Loading..."
    }
    const printers = data.printers;
    const items = [];
    for (var printer of printers){
      items.push(<PrinterPanel printer={printer} ports={data.ports} key={printer.name}/>)
    }
    return items
  }
  
  render() {
    const { classes } = this.props;
    return (
    <div >
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Octoprint Printers
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper className={classes.root}>
        {this.renderPrinterPanels()}
      </Paper>
    </div>
  )};
}

export default withStyles(styles)(App);
