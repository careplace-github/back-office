import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Radio,
  Tooltip,
  Container,
  Typography,
  RadioGroup,
  CardActionArea,
  FormControlLabel,
} from '@mui/material';
// components
import { useSettingsContext } from 'src/contexts';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  return (
    <StyledRoot>
      <Container component={MotionViewport} sx={{ position: 'relative' }}>
        <Content />
      </Container>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function Content() {
  return (
    <Box sx={{ position: 'relative' }}>
      <Image disabledEffect alt="grid" src="/assets/images/home/presets_grid.png" />

      <Box sx={{ position: 'absolute', width: '110%', top: -45 }}>
        <m.div variants={varFade().inUp}>
          <Image disabledEffect alt="screen" src="/assets/images/home/presets_screen.png" />
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', width: '110%', top: -45 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-5, 10, -5] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image disabledEffect alt="sidebar" src="/assets/images/home/presets_chart.png" />
          </m.div>
        </m.div>
      </Box>
    </Box>
  );
}
