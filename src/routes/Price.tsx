import { useQuery } from "@tanstack/react-query";
import { fetchCoinPrice } from "./api";
import styled from "styled-components";

const Box = styled.div`
  background-color: ${(props) => props.theme.boxColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
`;

const P = styled.p`
  font-weight: bold;
  margin-bottom: 3px;
`;
interface PriceData {
  time_open: number;
  time_close: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CoinProps {
  coinId: string;
}

function Price({ coinId }: CoinProps) {
  const { isLoading, data } = useQuery<PriceData[]>({
    queryKey:["Price", coinId], 
    queryFn:() => fetchCoinPrice(coinId), 
    refetchInterval: 10000,
  });

  console.log("Fetched Data:", data);

  const latestData = Array.isArray(data) && data.length > 0 ? data[0] : null;
  const previousData = Array.isArray(data) && data.length > 1 ? data[1] : null;
  const priceChange = latestData?.close && previousData?.close
  ? latestData.close - previousData.close
  : 0;
  const priceChangePercent = previousData
    ? ((priceChange / previousData.close) * 100).toFixed(2)
    : "N/A";
  const changeColor = priceChange >= 0 ? "green" : "red";
  const changeSymbol = priceChange >= 0 ? "▲" : "▼";

  return (
    <Box>
      <Title>${coinId} Price 💰</Title>
      {isLoading ? (
        <p>Loading Price...</p>
      ) : latestData ? (
        <div>
          <P>🔹 Open: ${Number(latestData.open).toFixed(2)}</P>
          <P>🔹 High: ${Number(latestData.high).toFixed(2)}</P>
          <P>🔹 Low: ${Number(latestData.low).toFixed(2)}</P>
          <P>🔹 Close: ${Number(latestData.close).toFixed(2)}</P>
          <P>🔹 24h Volume: {Number(latestData.volume).toLocaleString()}</P>
          {previousData && (
            <p style={{ color: changeColor }}>
              {changeSymbol} {priceChangePercent}% (${priceChange.toFixed(2)})
            </p>
          )}
        </div>
      ) : (
        <p>No Data Available</p>
      )}
    </Box>
  );
}

export default Price;