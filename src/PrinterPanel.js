import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PrinterPanelDetails from './PrinterPanelDetails'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  column: {
    paddingLeft: '5px',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: 16,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function PrinterPanel(props) {
  const classes = useStyles();
  const printer = props.printer
  const hotend = props.printer.temperature.hotend
  const bed = props.printer.temperature.bed
  const job = props.printer.job

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1c-content"
        id="panel1c-header"
      >
        <div className={classes.column} style={{ width: "20%" }}>
          <Typography>{props.printer.name}</Typography>
        </div>
        <div className={classes.column} style={{ width: "20%" }}>
          <Typography className={classes.secondaryHeading}>{hotend.actual}/{bed.actual}</Typography>
        </div>
        <div className={classes.column} style={{ width: "45%" }}>
          <Typography className={classes.secondaryHeading} noWrap >{job.name}</Typography>
        </div>
        <div className={classes.column} style={{ width: "10%" }}>
          <Typography className={classes.secondaryHeading}>{job.progress.toFixed(2)}%</Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <PrinterPanelDetails name={printer.name} isConnected={printer.connection.state != "Closed" } ports={props.ports} />
      </ExpansionPanelDetails>
    </ExpansionPanel>

  )
}

export default PrinterPanel;