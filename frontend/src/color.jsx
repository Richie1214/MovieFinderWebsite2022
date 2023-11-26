import { createTheme } from '@mui/material/styles';

const myTheme = createTheme({
  palette: {
    primary: {
      main: '#80deea',
      light: '#b4ffff',
      dark: '#4bacb8',
      contrastText: '#000000'
    },
    secondary: {
      main: '#42a5f5',
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#000000'
    },
    info: {
      main: '#000000'
    }
  }
})

export default myTheme;