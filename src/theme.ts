import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme: Theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});

export default theme;
