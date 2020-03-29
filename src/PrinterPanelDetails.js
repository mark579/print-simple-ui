import React from 'react';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function PrinterPanelDetails(props) {
  const isConnected = props.isConnected;
  if (isConnected) {
    return <OperationalButtons name={props.name} />;
  }
  return <ConnectionButtons name={props.name} ports={props.ports} />;
}

function ConnectionButtons(props) {
  const [values, setValues] = React.useState({
    port: '',
  });

  const classes = useStyles();
  
  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  function portItems(ports) {
    const availablePorts = ports.filter(port => port.available);
    if (availablePorts.length == 0) {
      return <MenuItem value=''>No Ports Available</MenuItem>
    };
    var items = [];
    for (var port of availablePorts) {
      const portKey = `${port.host} - ${port.name}`;
      items.push(<MenuItem key={portKey} value={portKey}>{portKey}</MenuItem>)
    }
    return items;
  }

  function connectRequest(printer_name, port){
    fetch('/api/connect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({printer_name: printer_name, port: port})
    })
  }

  var portItems = portItems(props.ports);
  return (
    <Container>
      <InputLabel htmlFor="port-input">Port</InputLabel>
      <Select
        onChange={handleChange}
        inputProps={{
          value: values.port,
          name: 'port',
          id: 'port-input',
        }}
      >
        {portItems}
      </Select>
      <Button variant="contained" onClick={(e) => connectRequest(props.name, values.port.split('-')[1].trim())} className={classes.button}>Connect</Button>
    </Container>
  );
}

function OperationalButtons(props) {
  const classes = useStyles();

  function preheatRequest(printer_name) {
    fetch('/api/preheat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({printer_name: printer_name})
    })
  }

  function extrudeRequest(printer_name){
    fetch('/api/extrude/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({printer_name: printer_name})
    })
  }

  function jobRequest(printer_name, operation){
    fetch('/api/job/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({printer_name: printer_name, operation: operation})
    })
  }

  function movezRequest(printer_name){
    fetch('/api/movez/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({printer_name: printer_name, z: 10})
    })
  }
  return (
    <Container>
      <Button variant="contained" onClick={(e) => jobRequest(props.name, "cancel")} className={classes.button}>Cancel</Button>
      <Button variant="contained" onClick={(e) => preheatRequest(props.name)} className={classes.button}>Preheat</Button>
      <Button variant="contained" onClick={(e) => jobRequest(props.name, "start")} className={classes.button}>Restart</Button>
      <Button variant="contained" onClick={(e) => extrudeRequest(props.name)} className={classes.button}>Extrude</Button>
      <Button variant="contained" onClick={(e) => movezRequest(props.name)} className={classes.button}><ArrowUpwardIcon className={classes.icon} /></Button>
    </Container>
  );
}

export default PrinterPanelDetails;