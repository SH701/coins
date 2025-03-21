import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "./api";
import ApexChart  from "react-apexcharts"
import { isLightAtom } from "../atom";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

interface OhlcvData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const Btn = styled.button`
  background:none;
  border:none;
  padding-left: 1px;
  &:focus,&:hover{
   transform: scale(1.5);
  }
  font-size: 24px;
`

function Chart() {
  const { coinId } = useParams<{ coinId: string }>();
  const [isDark] = useRecoilState(isLightAtom);
  const [charttype,setCharttype] = useState<"line" | "candlestick">("line");
  const { isLoading, data } = useQuery<OhlcvData[]>({
    queryKey:["ohlcv", coinId],
    queryFn: () =>fetchCoinHistory(coinId!),
    refetchInterval:10000,
});
const exceptData = Array.isArray(data) ?data : []; 

const lineChart = exceptData.map((i)=>{
  return{
    x:i.time_close,
    y:[i.open,i.high,i.low,i.close]
  }
})

const candleChart = exceptData.map((i) => {
  return {
    x: i.time_close, 
    y: [i.open, i.high, i.low, i.close], 
  };
});
  return (
    <div>
      <div>
        <Btn onClick={()=>setCharttype("line")}>📈</Btn>
        <Btn onClick={()=>setCharttype("candlestick")}>📊</Btn>
      </div>
  {isLoading ? (
    "Loading Chart..."
  ) : (
    <ApexChart
      type={charttype}
      series={[
        {
          name: "Price",
          data: charttype==="line"? lineChart : candleChart, 
        }
      ]}
      options={{
        theme:{
          mode:isDark? "dark" : "light"
        },
        chart: { type: "candlestick",
          background:"transparent",
          toolbar:{
            show:false,
          } 
        },
        plotOptions: {
        candlestick: {
          colors: {
            upward: isDark? "#3FE0C5":"#037DD9", 
            downward: "#FF4560",
            },
          },
        },
        tooltip: {
          enabled: true,
          x: {
            formatter: (value) => new Date(value*1000).toLocaleString(),
          },
          y: {
            formatter: (_, { seriesIndex, dataPointIndex, w }) => {
              const data =
                w?.globals?.initialSeries?.[seriesIndex]?.data?.[dataPointIndex]?.y || [0, 0, 0, 0];
              const tColor =isDark? "#fff" : "#000"
              return `
             <div style=" 
                border-radius: 5px;">
              <b style="color:${tColor}">$${data[3]}</b>
             </div>
            `;
            },
          },
        },
        xaxis:{
          labels: { show: false }, 
          axisBorder: { show: false }, 
          axisTicks: { show: false }, 
        },
        yaxis: {
          show: false,
        },
        grid:{
          show:false,
        },
      }}
    />
  )}
</div>
  );
};
export default Chart;