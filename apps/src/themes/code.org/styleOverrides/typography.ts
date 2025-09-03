import {Components, Theme} from '@mui/material/styles';

export const TYPOGRAPHY_OVERRIDES: Components<Theme>['MuiTypography'] = {
  defaultProps: {
    variantMapping: {
      body3: 'p',
      body4: 'p',
    },
  },
  styleOverrides: {
    root: ({theme}) => ({
      color: 'var(--text-neutral-primary)',
      // Caption styles
      '&.MuiTypography-caption': {
        color: 'var(--text-neutral-primary)',
        fontSize: '0.875rem', // 14px
        fontWeight: '600',
        lineHeight: 1.54,
        margin: theme.spacing(1, 0, 0), // 8px 0 0
      },
    }),
    gutterBottom: ({theme}) => ({
      '&.MuiTypography-h1': {
        marginBottom: theme.spacing(3), // 24px
      },
      '&.MuiTypography-h2': {
        marginBottom: theme.spacing(2.125), // 16px
      },
      '&.MuiTypography-h3': {
        marginBottom: theme.spacing(1.75), // 14px
      },
      '&.MuiTypography-h4': {
        marginBottom: theme.spacing(1.5), // 12px
      },
      '&.MuiTypography-h5': {
        marginBottom: theme.spacing(1.125), // 10px
      },
      '&.MuiTypography-h6': {
        marginBottom: theme.spacing(1), // 8px
      },
      '&.MuiTypography-body1': {
        marginBottom: theme.spacing(2), // 16px
      },
      '&.MuiTypography-body2': {
        marginBottom: theme.spacing(2), // 16px
      },
      '&.MuiTypography-body3': {
        marginBottom: theme.spacing(1.5), // 12px
      },
      '&.MuiTypography-body4': {
        marginBottom: theme.spacing(1.25), // 10px
      },
      '&.MuiTypography-overline': {
        marginBottom: theme.spacing(2), // 16px
      },
      '&.MuiTypography-caption': {
        marginBottom: theme.spacing(2), // 16px
      },
    }),
  },
};
