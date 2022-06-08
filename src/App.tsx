import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Subscribe from "./notifications/Subscribe";
import {Container} from "@mui/material";
import {ToastContainer} from "react-toastify";

function App() {
  return (
      <Container >
        <ToastContainer />
        <Subscribe/>
      </Container>
  );
}

export default App;
