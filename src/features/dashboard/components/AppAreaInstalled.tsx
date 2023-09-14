import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  CardHeader,
  Box,
  CardProps,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
// components
import { CustomSmallSelect } from 'src/components/custom-input';
import Chart, { useChart } from 'src/components/chart';
// theme from mui
import { useTheme } from '@mui/material/styles';
import InfoTooltip from 'src/components/tooltip';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  infoMessage?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      year: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
  isLoading?: boolean;
}

export default function AppAreaInstalled({
  title,
  subheader,
  chart,
  isLoading,
  infoMessage,
  ...other
}: Props) {
  const theme = useTheme();
  const { colors, categories, series, options } = chart;

  const [seriesData, setSeriesData] = useState('2023');

  const chartOptions = useChart({
    xaxis: {
      categories,
    },
    thousandSeparator: true,
    coin: '€',
    colors: [theme.palette.primary.main, '#DFE3E8'], // same color for all series
    legend: {
      showForSingleSeries: true,
    },

    ...options,
  });

  return (
    <Box sx={{ position: 'relative', height: 364 /* or any other height */ }}>
      <>
        {isLoading ? (
          <Card {...other} sx={{ height: '100%', width: '100%' }}>
            <CardHeader title={title} subheader={subheader} />
            <CircularProgress
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translateY(-50%) translateX(-50%)',
              }}
            />
          </Card>
        ) : (
          <Card {...other}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              sx={{ p: '24px 24px 0px' }}>
              <Stack direction="row" alignItems="center" justifyContent="flex-start">
                <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>{title}</Typography>
                {infoMessage && (
                  <InfoTooltip
                    text={infoMessage}
                    sx={{
                      width: 15,
                      ml: '5px',
                      height: 15,
                      color: 'text.disabled',
                    }}
                  />
                )}
              </Stack>

              <CustomSmallSelect
                value={seriesData}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSeriesData(event.target.value)
                }>
                {series.map(option => (
                  <option key={option.year} value={option.year}>
                    {option.year}
                  </option>
                ))}
              </CustomSmallSelect>
            </Stack>

            {series.map(item => (
              <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
                {item.year === seriesData && (
                  <Chart
                    type="line"
                    series={item.data}
                    options={chartOptions}
                    height={364}
                    id="annualRevenueChart"
                  />
                )}
              </Box>
            ))}
          </Card>
        )}
      </>
    </Box>
  );
}
