import { Route, Routes } from "react-router-dom";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import Price from "./routes/Price";
import Chart from "./routes/Chart";
import styled from "styled-components";

const Div = styled.div`
  padding-left: 90px;
  font-size: 28px;
  font-weight: 600;
`

function AppRouter() {
    return (
      <Routes>
      <Route path="/" element={<Coins />} />
      <Route path="/:coinId" element={<Coin />}>
        <Route path="price" element={<Price coinId={""} />} />
        <Route path="chart" element={<Chart />} />
        <Route index element={<Div>Basic Coin Information</Div>} />
      </Route>
    </Routes>
    );
  }
  
  export default AppRouter;