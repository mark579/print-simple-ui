import React,  { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein, days) {
  return { name, calories, fat, carbs, protein, days };
}

const rows = [
  createData('Nintendo Switch Ergonomic Joy-Con Holder Grip 3D Printed', "8 Silver", "", "", 1, 8),
  createData('Nintendo SNES 8Bitdo SNES30 SFC30 Controller Holder Display Stand 3D Printed', 237, 9.0, 37, 4.3),
  createData('Nintendo SNES 8Bitdo SNES30 SFC30 Controller Holder Display Stand 3D Printed', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function EtsyOrders() {
  const classes = useStyles();
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders()
  }, [])

  const getOrders = () => {
    fetch("/etsy/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders));
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead> 
          <TableRow className={classes.head}>
            <StyledTableCell>Order</StyledTableCell>
            <StyledTableCell align="right">Primary Color</StyledTableCell>
            <StyledTableCell align="right">Seconday Color</StyledTableCell>
            <StyledTableCell align="right">Slot Amount</StyledTableCell>
            <StyledTableCell align="right">Quantity</StyledTableCell>
            <StyledTableCell align="right">Ship (Days)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <StyledTableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.primary_color}</TableCell>
              <TableCell align="right">{row.secondary_color}</TableCell>
              <TableCell align="right">{row.slot_amount}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.days_from_due_date}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
