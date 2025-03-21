import {
    useLocation,
    useParams,
    Outlet,
  } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinPrice} from "./api";
import { Helmet } from "react-helmet";


  interface RouteState {
    name: string;
  }
  interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        merket_cap_change_24h: number;
        precent_change_1h: number;
        precent_change_1y: number;
        precent_change_6h: number;
        precent_change_7d: number;
        precent_change_12h: number;
        precent_change_15m: number;
        precent_change_24h: number;
        precent_change_30d: number;
        precent_change_30m: number;
        precent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
  }
  const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
  `;
  const Tab = styled.span<{ $isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: ${(props)=>props.theme.boxColor};
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
    a {
      display: block;
    }
  `;
  const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
  `;
  const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const Title = styled.h1`
  font-weight: bold;
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
  `;
  const Loader = styled.span`
    text-align: center;
    display: block;
    font-size: 48px;
    color: ${(props) => props.theme.textColor};
  `;
  const Overview = styled.div`
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    background-color: ${(props)=>props.theme.boxColor};
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  `;
  const OverviewItem = styled.div`
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    span:first-child {
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
  `;
  const Description = styled.p`
    margin: 20px 0px;
  `;

  function Coin() {
    const { coinId } = useParams<{coinId:string}>() 
    const { state } = useLocation() as { state: RouteState }; 
    const location = useLocation();
    const isChartActive = location.pathname.includes("/:coinId/chart");
    const isPriceActive = location.pathname.includes("/:coinId/price");
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>({
        queryKey : ["info",coinId],
        queryFn : ()=>fetchCoinInfo(coinId!),
    });
    const { isLoading: priceLoading, data: priceData } = useQuery<PriceData>({
        queryKey : ["price",coinId],
        queryFn : ()=>fetchCoinPrice(coinId!),
        enabled: !!coinId, 
        refetchInterval: 10000, 
    })
  
    const loading = infoLoading || priceLoading;
    return (
      <Container>
        <Helmet><title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title></Helmet>
        <Header>
          <Title>
            {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
          </Title>
        </Header>
        {loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Overview>
              <OverviewItem>
                <span>Rank:</span>
                <span>{infoData?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Symbol:</span>
                <span>${infoData?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Price:</span>
                <span>{priceData?.quotes?.USD?.price ? `$${priceData.quotes.USD.price.toFixed(2)}` : "N/A"}</span>
              </OverviewItem>
            </Overview>
            <Description>{infoData?.description}</Description>
            <Overview>
              <OverviewItem>
                <span>Total Suply:</span>
                <span>{priceData?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Max Supply:</span>
                <span>{priceData?.max_supply}</span>
              </OverviewItem>
            </Overview>
            <Tabs>
                <Tab $isActive={isChartActive}>
                    <Link to={`/${coinId}/chart`}>Chart</Link>
                </Tab>
                <Tab $isActive={isPriceActive}>
                    <Link to={`/${coinId}/price`}>Price</Link>
                </Tab>
            </Tabs>
            <Outlet/>
          </>
        )}
      </Container>
    );
  }
  
  export default Coin;  

