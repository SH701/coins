/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react-hooks/rules-of-hooks */
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchCoinPrice, fetchCoins } from "./api";
import { Helmet } from "react-helmet";

interface ICoin {
  change_24h: any;
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  price: string;
}
interface Changeprops{
  change:number;
}
const Container = styled.div`
  padding: 0px 20px;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 20px;
  
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CoinsList = styled.ul`
  margin-top:20px;
`;
const CoinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  color:${(props)=>props.theme.textColor};
  font-weight: bold;
  background-color: ${(props)=>props.theme.boxColor};
  border-radius: 24px 24px 4px 4px;
  border-bottom: 1px solid rgba(169, 159, 159, 0.284);
`;
const SubCoinHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding:0 70px;
`
const Title = styled.h1`
  font-weight:600;
  font-size: 48px;
  color:${(props)=>props.theme.accentColor};
`;
const Loader = styled.span`
  text-align: center;
  display: block;
  font-size: 48px;
  color: ${(props) => props.theme.textColor};
`;

const Coin = styled.li`
  border-bottom: 1px solid rgba(169, 159, 159, 0.284);
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  padding: 12px 30px;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const Linked = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Np = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap:80px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 40px;
`;

const Rank = styled.span`
  font-size: 18px;
  font-weight: 600;
  width: 30px; /* 랭크 숫자 정렬 */
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
`;

const CoinName = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  flex: 1;
`;

const Change = styled.span<Changeprops>`
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.change > 0 ? "#16c784" : "#ea3943")};
  text-align: right;
  flex: 0.5;
  max-width: 60px;  /* 최소 크기 지정 */
  width: auto;
`;


function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>({
    queryKey:["allCoins"],
    queryFn:fetchCoins,
  }); 
  const priceQueries = useQueries({
    queries: data?.slice(0, 50).map((coin) => ({
      queryKey: ["price", coin.id],
      queryFn: () => fetchCoinPrice(coin.id),
      enabled: !!coin.id,
      staleTime: 1000 * 60 * 10,
      refetchInterval: undefined,
    })) || [],
  });
  
  return (
    <Container>
      <Helmet><title>Digital Gold Top 50
      </title></Helmet>
      <Header>
        <Title>Digital Gold Top 50</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          <CoinHeader>
            <span>#</span>
            <SubCoinHeader>
            <span>Name</span>
            <span>Price</span>
            </SubCoinHeader>
            <span>24h Change</span>
          </CoinHeader>
          {data?.slice(0, 50).map((coin, index) => {
            const priceData = priceQueries[index]?.data;
            const price = priceData?.quotes?.USD?.price ?? 0;
            const changeValue = priceData?.quotes?.USD?.percent_change_24h ?? 0;
            return (
              <Coin key={coin.id}>
                <Linked to={`/${coin.id}`} state={{ name: coin.name }}>
                <Rank>{index+1}</Rank>
                  <Np>
                    <CoinInfo>
                  <Img
                    src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                  />
                  <CoinName>{coin.name}</CoinName>
                  </CoinInfo>
                  <Price>{price > 0 ? `$${price.toFixed(0)}` : "N/A"}</Price>
                  <Change change={changeValue}>{changeValue?`${changeValue.toFixed(2)}%` : "N/A"}</Change>
                  </Np>
                </Linked>     
              </Coin>
            );
          })};
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;