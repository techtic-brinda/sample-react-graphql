import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const defaultTheme = createMuiTheme();
// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e1402a',
    },
    secondary: {
      main: '#9373f6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F0F3F8',
    },
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
          fontSize: '16px',
          fontWeight: 400,
          color: defaultTheme.palette.grey[700],
          fontFamily: ["Poppins", 'sans-serif'].join(", ")
        },
        'main .MuiList-root .MuiListItem-gutters': {
          padding: defaultTheme.spacing(2),
          margin: defaultTheme.spacing(2.5, 0),
          boxShadow: '0 1px 8px 0 rgba(0, 0, 0, 0.1)',
          "&:first-child": {
            marginTop: 0,
          },
          "&:last-child": {
            marginBottom: 0,
          },
          '&.MuiPaper-root': {
            borderRadius: defaultTheme.spacing(1.5),
          },
        },

      },
    },
    MuiTypography: {
      h5: {
        color: defaultTheme.palette.grey[800],
        fontWeight: 600,
      },
      subtitle1: {
        color: defaultTheme.palette.grey[800],
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        color: defaultTheme.palette.grey[700],
        fontSize: '1rem',
      }
    },
    MuiPaper: {
      root: {
      },
    },
    MuiCard: {
      root: {
        borderRadius: defaultTheme.spacing(1.5),
        boxShadow: '0 12px 34px 0 rgba(0, 0, 0, 0.1)',
      },
    },
    MuiCardHeader: {
      root: {
        padding: defaultTheme.spacing(5, 5, 1, 5),
      }
    },
    MuiCardContent: {
      root: {
        padding: defaultTheme.spacing(1, 5, 5, 5),
      }
    },
    MuiButton: {
      root: {
        padding: defaultTheme.spacing(3, 2),
      },
      text: {
        textTransform: 'none',
        fontSize: 12,
        padding: '14px 31px',
        color: '#000',
      },
    },
  },
});

export default theme;
