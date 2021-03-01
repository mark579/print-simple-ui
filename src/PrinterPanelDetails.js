import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import CancelIcon from "@material-ui/icons/Cancel";
import PrintIcon from "@material-ui/icons/Print";
import RestartIcon from "@material-ui/icons/Autorenew";
import ExtruderIcon from "./icons/ExtruderIcon";
import ThermometerIcon from "./icons/ThermometerIcon";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: 36,
  },
  hot: {
    fill: "red",
  },
  warm: {
    fill: "orange",
  },
  fileBox: {
    display: "flex",
  },
  fileSelector: {
    margin: "auto",
  },
}));

function PrinterPanelDetails(props) {
  const isConnected = props.isConnected;

  if (isConnected) {
    return <OperationalButtons name={props.name} files={props.files} />;
  }

  return <ConnectionButtons name={props.name} ports={props.ports} />;
}

function ConnectionButtons(props) {
  const [values, setValues] = React.useState({
    port: "",
  });

  const classes = useStyles();

  function handleChange(event) {
    setValues((oldValues) => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  function portItems(ports) {
    const availablePorts = ports.filter((port) => port.available);
    if (availablePorts.length === 0) {
      return <MenuItem value="">No Ports Available</MenuItem>;
    }
    var items = [];
    for (var port of availablePorts) {
      const portKey = `${port.host} - ${port.name}`;
      items.push(
        <MenuItem key={portKey} value={portKey}>
          {portKey}
        </MenuItem>
      );
    }
    return items;
  }

  function connectRequest(printer_name, port) {
    fetch("/api/connect/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ printer_name: printer_name, port: port }),
    });
  }
  return (
    <Container>
      <InputLabel htmlFor="port-input">Port</InputLabel>
      <Select
        onChange={handleChange}
        inputProps={{
          value: values.port,
          name: "port",
          id: "port-input",
        }}
      >
        {portItems(props.ports)}
      </Select>
      <Button
        variant="contained"
        onClick={(e) =>
          connectRequest(props.name, values.port.split("-")[1].trim())
        }
        className={classes.button}
      >
        Connect
      </Button>
    </Container>
  );
}

function OperationalButtons(props) {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = React.useState("");
  const [heatLevel, setHeatLevel] = React.useState(0);

  function preheatRequest(printer_name) {
    var nextHeatLevel = heatLevel;
    if (heatLevel === 2) {
      nextHeatLevel = 0;
    } else {
      nextHeatLevel = nextHeatLevel + 1;
    }
    fetch("/api/preheat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        printer_name: printer_name,
        heat_level: nextHeatLevel,
      }),
    });
    setHeatLevel(nextHeatLevel);
  }

  function extrudeRequest(printer_name) {
    fetch("/api/extrude/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ printer_name: printer_name }),
    });
  }

  function jobRequest(printer_name, operation) {
    fetch("/api/job/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        printer_name: printer_name,
        operation: operation,
      }),
    });
  }

  function movezRequest(printer_name) {
    fetch("/api/movez/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ printer_name: printer_name, z: 10 }),
    });
  }

  function printFile(printer_name) {
    fetch("/api/print_file/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        printer_name: printer_name,
        file_name: selectedFile,
      }),
    });
  }

  function fileMenuItems(files) {
    var menuItems = [
      <MenuItem value="" key="placeholder" disabled>
        {" "}
        Select Object{" "}
      </MenuItem>,
    ];
    if (files) {
      menuItems.push(
        files.map((f) => (
          <MenuItem key={f} value={f}>
            {fileDisplay(f)}
          </MenuItem>
        ))
      );
    }
    return menuItems;
  }

  function fileDisplay(fullPath) {
    var lastSlash = fullPath.lastIndexOf("/");
    var period = fullPath.lastIndexOf(".");
    return fullPath.substr(lastSlash + 1, period - lastSlash - 1);
  }

  function handleChange(e) {
    setSelectedFile(e.target.value);
  }

  function heatClasses() {
    switch (heatLevel) {
      case 0:
        return classes.icon;
      case 1:
        return `${classes.icon} ${classes.warm}`;
      case 2:
        return `${classes.icon} ${classes.hot}`;
      default:
        return classes.icon;
    }
  }

  return (
    <Container>
      <Box display="flex">
        <Box flexGrow={1}>
          <Button
            variant="contained"
            onClick={(e) => jobRequest(props.name, "cancel")}
            className={classes.button}
          >
            <CancelIcon color="secondary" className={classes.icon} />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => preheatRequest(props.name)}
            className={classes.button}
          >
            <ThermometerIcon className={heatClasses()} />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => jobRequest(props.name, "start")}
            className={classes.button}
          >
            <RestartIcon className={classes.icon} />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => extrudeRequest(props.name)}
            className={classes.button}
          >
            <ExtruderIcon className={classes.icon} />
          </Button>
          <Button
            variant="contained"
            onClick={(e) => movezRequest(props.name)}
            className={classes.button}
          >
            <ArrowUpwardIcon className={classes.icon} />
          </Button>
        </Box>
        <Box className={classes.fileBox}>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              className={classes.fileSelector}
              value={selectedFile}
              onChange={handleChange}
              displayEmpty
              id="file-selector"
            >
              {fileMenuItems(props.files)}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={(e) => printFile(props.name)}
            className={classes.button}
          >
            <PrintIcon className={classes.icon} />
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default PrinterPanelDetails;
