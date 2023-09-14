import { ApexOptions } from 'apexcharts';
// @mui
import { Box, Card, Typography, CardProps, CircularProgress, Stack, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// utils
import { fNumber, fPercent } from 'src/utils/formatNumber';
// components
import Iconify from 'src/components/iconify';
import InfoTooltip from 'src/components/tooltip';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  sufix?: string;
  percentage?: number;
  percentageMessage?: string;
  infoMessage?: string;
  tooltipMessage?: string;
  isLoading?: boolean;
  chart?: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
    type?: 'line' | 'area' | 'bar';
  };
}

export default function EcommerceWidgetSummary({
  title,
  percentage,
  percentageMessage,
  tooltipMessage,
  infoMessage,
  sufix,
  total,
  chart,
  isLoading,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  let chartOptions;

  let colors;
  let series;
  let options;

  if (chart) {
    colors = chart.colors || [theme.palette.primary.light, theme.palette.primary.main];
    series = chart.series;
    options = chart?.options;

    chartOptions = useChart({
      colors: [colors[1]],
      fill: {
        type: 'gradient',
        gradient: {
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 100, color: colors[1] },
          ],
        },
      },
      chart: {
        animations: {
          enabled: true,
        },
        sparkline: {
          enabled: true,
        },
      },
      tooltip: {
        x: {
          show: false,
        },
        y: {
          formatter: (value: number) => fNumber(value),
          title: {
            formatter: () => '',
          },
        },
        marker: {
          show: false,
        },
      },
      ...options,
    });
  }

  const percent = percentage || 0;

  const renderTrending = (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={
          percent < 0
            ? 'eva:trending-down-fill'
            : percent > 0
            ? 'eva:trending-up-fill'
            : 'lucide:equal'
        }
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: alpha(theme.palette.success.main, 0.16),
          ...(percent < 0 && {
            color: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.16),
          }),
          ...(percent === 0 && {
            color: 'text.disabled',
            bgcolor: alpha(theme.palette.grey[500], 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}

        {fPercent(percent)}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {` ${percentageMessage}`}
        </Box>
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" paragraph>
          {title}
        </Typography>

        {!isLoading && (
          <InfoTooltip
            text={infoMessage || ''}
            sx={{
              width: 15,
              height: 15,
              color: 'text.disabled',
              position: 'absolute',
              top: '24px',
              right: '24px',
            }}
          />
        )}

        <Typography variant="h3" gutterBottom>
          {isLoading ? '-' : fNumber(total) + (sufix || '')}
        </Typography>

        {percentage !== undefined && renderTrending}
      </Box>

      {!isLoading && (
        <Chart
          type="line"
          series={[{ data: series }]}
          options={chartOptions}
          width={96}
          height={64}
        />
      )}

      {isLoading && (
        <CircularProgress size="15px" sx={{ position: 'absolute', top: '24px', right: '24px' }} />
      )}
    </Card>
  );
}
