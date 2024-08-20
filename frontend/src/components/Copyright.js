import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://delightful-headlight-c4d.notion.site/a6578068bf2547bc87363c181b9393b9?v=fbff4c9eb54740a3a38d0ac8d2216006">
        Five Stars
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}