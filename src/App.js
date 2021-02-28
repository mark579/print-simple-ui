import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PrinterPanel from './PrinterPanel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PrintIcon from '@material-ui/icons/Print';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './App.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'rgb(245,245,245)',
    padding: theme.spacing(3, 2),
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function App() {
  const menu = {
    'printers': 1,
    'orders': 2
  }
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(menu.printers)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getStatus = ()=> {
    fetch('/api/status')
      .then(response => response.json())
      .then(data => setData(data));
  };

  const renderPrinterPanels = ()=> {
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

  useEffect(()=> {
    const interval = setInterval(()=> getStatus(), 1500);
    return () => {
      clearInterval(interval);
    }
  });

  useEffect(()=> {
    handleDrawerClose();
  }, [selectedMenu])

  return(
    <div >
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" className={clsx(classes.menuButton, open && classes.hide)} onClick={handleDrawerOpen} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Print
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" color="inherit">
            Menu
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key='Printers' onClick={() => {setSelectedMenu(menu.printers)}}>
            <ListItemIcon><PrintIcon/></ListItemIcon>
            <ListItemText primary='Printers' />
          </ListItem>
          <ListItem button key='Orders' onClick={() => {setSelectedMenu(menu.orders)}}>
            <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
            <ListItemText primary='Orders' />
          </ListItem>
        </List>
      </Drawer>
      {selectedMenu == menu.printers && 
        <Paper className={classes.root} elevation={3} >
          {renderPrinterPanels()}
        </Paper>
      }
      {selectedMenu == menu.orders && 
        <Paper className={classes.root} elevation={3} >
          Orders Here!
        </Paper>
      }
    </div>
  );
}