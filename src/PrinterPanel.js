import React from 'react';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  column: {
    paddingLeft: '5px',
  },
  wideColumn: {
    flexBasis: '50%',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    width: '100%',
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
          <div className={classes.column} style={{width:"20%"}}>
            <Typography>{props.printer.name}</Typography>
          </div>
          <div className={classes.column} style={{width:"20%"}}>
          <Typography className={classes.secondaryHeading}>{hotend.actual}/{bed.actual}</Typography>
          </div>
          <div className={classes.column} style={{width:"45%"}}>
            <Typography className={classes.secondaryHeading} noWrap >{job.name}</Typography>
          </div>
          <div className={classes.column} style={{width:"10%"}}>
            <Typography className={classes.secondaryHeading}>{job.progress.toFixed(2)}%</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Container>
            <Button variant="contained" className={classes.button}>Cancel</Button>
            <Button variant="contained" className={classes.button}>Preheat</Button>
            <Button variant="contained" className={classes.button}>Restart</Button>
            <Button variant="contained" className={classes.button}>Extrude</Button>
            <Button variant="contained" className={classes.button}><ArrowUpwardIcon className={classes.icon} /></Button>
            <Button variant="contained" className={classes.button}><ArrowDownwardIcon className={classes.icon} /></Button>
          </Container>
        </ExpansionPanelDetails>
      </ExpansionPanel>

    )
}

export default PrinterPanel;