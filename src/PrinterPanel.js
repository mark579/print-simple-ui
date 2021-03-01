import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import LinearProgress from '@material-ui/core/LinearProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PrinterPanelDetails from './PrinterPanelDetails';

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
  panel: {
    fontSize: 30,
  }
}));

function PrinterPanel(props) {
  const classes = useStyles();
  const printer = props.printer
  const hotend = props.printer.temperature.hotend
  const bed = props.printer.temperature.bed
  const job = props.printer.job

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1c-content"
        id="panel1c-header"
      >
        <span className={classes.column} style={{ width: "20%" }}>
          <Typography >{props.printer.name}</Typography>
        </span>
        <span className={classes.column} style={{ width: "20%" }}>
          <Typography className={classes.secondaryHeading}>{hotend.actual}/{bed.actual}</Typography>
        </span>
        <span className={classes.column} style={{ width: "45%" }}>
          <Typography className={classes.secondaryHeading} noWrap >{job.name}</Typography>
        </span>
        <span className={classes.column} style={{ width: "10%" }}>
          <LinearProgress variant="determinate" value={Number(job.progress.toFixed())} />
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <PrinterPanelDetails name={printer.name} isConnected={printer.connection.state !== "Closed" } ports={props.ports} files={props.printer.files} />
      </AccordionDetails>
    </Accordion>

  )
}

export default PrinterPanel;