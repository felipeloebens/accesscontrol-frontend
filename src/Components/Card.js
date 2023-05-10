import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components'

const CardRoot = styled(Card)`
  max-width: 250px;
`
const TittleTypography = styled(Typography)`
   font-size: 14px;
`

const PosTypography = styled(Typography)`
    margin-bottom: 12px;
`
const Bullet = styled.span`
    display: 'inline-block';
    margin: '0 2px';
    transform: 'scale(0.8)';
`

export default function SimpleCard() {

  const bull = <Bullet>•</Bullet>;

  return (
    <CardRoot>
      <CardContent>
        <TittleTypography color="textSecondary" gutterBottom>
          Word of the Day
        </TittleTypography>
        <Typography variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <PosTypography color="textSecondary">
          adjective
        </PosTypography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </CardRoot>
  );
}