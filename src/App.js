import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PrinterPanel from "./PrinterPanel";
import EtsyOrders from "./EtsyOrders";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PrintIcon from "@material-ui/icons/Print";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import "./App.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: "rgb(245,245,245)",
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const menu = {
    printers: 1,
    orders: 2,
  };
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(menu.printers);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getStatus = () => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  const renderPrinterPanels = () => {
    if (data == null) {
      return "Loading...";
    }
    const printers = data.printers;
    const items = [];
    for (var printer of printers) {
      items.push(
        <PrinterPanel printer={printer} ports={data.ports} key={printer.name} />
      );
    }
    return items;
  };

  useEffect(() => {
    const interval = setInterval(() => getStatus(), 1500);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    handleDrawerClose();
  }, [selectedMenu]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Print
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            key="Printers"
            onClick={() => {
              setSelectedMenu(menu.printers);
            }}
          >
            <ListItemIcon>
              <PrintIcon />
            </ListItemIcon>
            <ListItemText primary="Printers" />
          </ListItem>
          <ListItem
            button
            key="Orders"
            onClick={() => {
              setSelectedMenu(menu.orders);
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper
          elevation={3}
          className={clsx(classes.menuButton, {
            [classes.hide]: selectedMenu != menu.printers,
          })}
        >
          {renderPrinterPanels()}
        </Paper>
        <Paper
          elevation={3}
          className={clsx(classes.menuButton, {
            [classes.hide]: selectedMenu != menu.orders,
          })}
        >
          <EtsyOrders />
        </Paper>
      </main>
    </div>
  );
}
