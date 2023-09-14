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
    type?:
      | 'line'
      | 'area'
      | 'bar'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'radar'
      | 'polarArea'
      | 'pie'
      | 'donut'
      | 'rangeBar'
      | 'histogram'
      | 'boxPlot'
      | 'treemap';
  };
}

export default function DashboardWidgetSummary({
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

    chartOptions = {
      colors: colors.map(colr => colr[1]),
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
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '68%',
          borderRadius: 1,
        },
      },
      tooltip: {
        x: { show: false },
        y: {
          formatter: (value: number) => fNumber(value),
          title: {
            formatter: () => '',
          },
        },
        marker: { show: false },
      },
      ...options,
    };
  }

  const percent = percentage || 0;

  const renderTrending = tooltipMessage ? (
    <Tooltip title={tooltipMessage} placement="top">
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

        <Typography variant="subtitle2" component="div" noWrap sx={{ fontSize: '15px' }}>
          {percent > 0 && '+'}
          {fPercent(percent)}

          {percentageMessage && (
            <Box component="span" sx={{ color: 'text.secondary' }}>
              {` ${percentageMessage}`}
            </Box>
          )}
        </Typography>
      </Stack>
    </Tooltip>
  ) : (
    <>
      <Stack direction="column" alignItems="center" sx={{ mt: 2, mb: 1 }}>
        <Stack direction="row" alignItems="center">
          <Iconify
            icon={
              percent < 0
                ? 'eva:trending-down-fill'
                : percent > 0
                ? 'eva:trending-up-fill'
                : 'tabler:equal'
            }
            sx={{
              mr: 1,
              p: 0.5,
              width: 20,
              height: 20,
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
          <Typography variant="subtitle2" component="div" noWrap sx={{ fontSize: '13px' }}>
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Typography>
        </Stack>

        {percentageMessage && (
          <Stack direction="row" alignItems="center">
            <Typography
              component="div"
              noWrap
              sx={{ fontSize: '10px', mt: '2px', color: 'text.secondary' }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>
                {` ${percentageMessage}`}
              </Box>
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );

  return (
    <Card
      sx={{ display: 'flex', alignItems: 'center', position: 'relative', p: 3, ...sx }}
      {...other}>
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

        {isLoading && (
          <CircularProgress size="15px" sx={{ position: 'absolute', top: '24px', right: '24px' }} />
        )}
      </Box>

      {percentage !== undefined && renderTrending}
    </Card>
  );
}
