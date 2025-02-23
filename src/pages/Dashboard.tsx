import { Route, Routes, useNavigate } from "react-router-dom";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import Booking from "./screens/bookingManagment.tsx";
import Customer from "./screens/customerManagment.tsx";
import BookingDetails from "./screens/bookingdetails.tsx";
import CustomerList from "./screens/customerlist.tsx";
import Inventory from "./screens/InventoryManagment.tsx";
import Payment from "./screens/paymentManagment.tsx";
import Report from "./screens/ReportGeneration.tsx";
import Room from "./screens/RoomManagment.tsx";
import Service from "./screens/ServiceManagment.tsx";
import Staff from "./screens/staffManagment.tsx";
import BATreeView from "../components/BaTreeview.tsx";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const treeStructure = [
    {
      moduleName: "Booking Management",
      child: [
        { name: "Booking", route: "booking" },
        { name: "Booking Details", route: "BookingDetails" },
      ],
    },
    {
      moduleName: "Inventory Management",
      child: [{ name: "Inventory", route: "inventory" }],
    },
    {
      moduleName: "Customer Management",
      child: [
        { name: "Customer", route: "Customer" },
        { name: "Customer List", route: "customerlist" },
      ],
    },
    {
      moduleName: "Payment Management",
      child: [{ name: "Payment", route: "payment" }],
    },
    {
      moduleName: "Rooms Management",
      child: [{ name: "Rooms", route: "rooms" }],
    },
    {
      moduleName: "Staff Management",
      child: [{ name: "Staff", route: "staff" }],
    },
    {
      moduleName: "Report Management",
      child: [{ name: "Report", route: "report" }],
    },
    {
      moduleName: "Service Management",
      child: [{ name: "Service", route: "service" }],
    },
    
  ];

  const navigateScreen = (route: string) => {
    navigate(`/dashboard/${route}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            The Hotel Management System (HMS)
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <BATreeView treeStructure={treeStructure} navigateScreen={navigateScreen} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="booking" element={<Booking />} />
          <Route path="BookingDetails" element={<BookingDetails />} />
          <Route path="customer" element={<Customer />} />
          <Route path="customerlist" element={<CustomerList />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="payment" element={<Payment />} />
          <Route path="report" element={<Report />} />
          <Route path="rooms" element={<Room />} />
          <Route path="service" element={<Service />} />
          <Route path="staff" element={<Staff />} />
        </Routes>
      </Main>
    </Box>
  );
}