import Router from "./AppRouter";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {lightTheme,darkTheme } from "./theme";
import { Link } from "react-router-dom";
import { isLightAtom } from "./atom";
import { useRecoilState } from "recoil";


const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
  line-height: 1.2;
}
a {
  text-decoration:none;
  color:${(props) => props.theme.textColor};
  font-weight:500;
}
li{
  background-color:${(props) => props.theme.boxColor};
}
.dark_mode button{
background-color: #333; 
color: #fff
}`;

const Btn = styled.button`
  background: transparent;
  padding: 0px;
  border:0px;
  cursor: pointer;
  position: absolute;
  top: 30px;
  font-size:36px;
  &:hover {
    opacity: 0.8;
  }
`
const Hbtn = styled(Btn)`
  left: 40px;
`
const Mbtn = styled(Btn)`
  right:40px;
`


function App() {
  const [isDark,setIsDark] = useRecoilState(isLightAtom);
 
  return (
    <>
    <ThemeProvider theme = {isDark ? lightTheme:darkTheme}>
      <GlobalStyle />
  <Hbtn>
    <Link to={"/"}>🏠</Link>
  </Hbtn>
  <div>
    <Mbtn onClick={()=>setIsDark((prev)=>!prev)}>{isDark?"⭐":"☀️"}</Mbtn>
  </div>
<Router/>
    <ReactQueryDevtools initialIsOpen={true} />
</ThemeProvider>
    </>
  );
}

export default App;