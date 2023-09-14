import { m, MotionProps } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box, { BoxProps } from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Iconify from 'src/components/iconify';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function FaqsHero({
  query,
  onSearch,
  onReset,
}: {
  query: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: VoidFunction;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/images/faqs/hero.jpg',
        }),
        height: { md: 560 },
        py: { xs: 10, md: 0 },
        overflow: 'hidden',
        position: 'relative',
      }}>
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}>
          <div>
            <TextAnimate text="Como Podemos" sx={{ color: 'common.white' }} />

            <br />

            <Stack spacing={2} display="inline-flex" direction="row" sx={{ color: 'common.white' }}>
              <TextAnimate
                text="Ajudar?"
                sx={{ color: 'primary.main' }}
                variants={varFade().inRight}
              />
            </Stack>
          </div>

          <m.div variants={varFade().in}>
            <TextField
              fullWidth
              placeholder="Procurar..."
              value={query}
              onChange={onSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={onReset}
                    sx={{
                      cursor: 'pointer',
                    }}>
                    <Iconify icon="carbon:close" width={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 5,
                maxWidth: 360,
                [`& .${outlinedInputClasses.root}`]: {
                  bgcolor: 'common.white',
                },
                [`& .${outlinedInputClasses.input}`]: {
                  typography: 'subtitle1',
                },
              }}
            />
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TextAnimateProps = BoxProps &
  MotionProps & {
    text: string;
  };

function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
      variants={variants || varFade().in}>
      {text}
    </Box>
  );
}
