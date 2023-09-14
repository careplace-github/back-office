// react
import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// contexts
import { useSettingsContext } from 'src/contexts';
// components
// lib
import fetch from 'src/lib/fetch';
//
import AppAreaInstalled from '../components/AppAreaInstalled';
import DashboardWidgetSummary from '../components/DashboardWidgetSummary';
import DashboardWidgetChartSummary from '../components/DashboardWidgetChartSummary';

// ----------------------------------------------------------------------

type IDashboardOverview = {
  pending_orders: {
    value: number;
  };
  active_clients: {
    active_clients_by_month: number[];
    value: number;
    month_over_month_percentage: number;
  };
  monthly_billing: {
    value: number;
    month_over_month_percentage: number;
    monthly_billing_by_month: number[];
  };

  year_to_date_billing: {
    value: number;
    year_over_year_percentage: number;
  };

  orders_average: {
    order_average_by_month: number[];
    current_year_order_average: number;
    previous_year_order_average: number;
    yearly_order_average_month_over_month_percentage: number;

    current_month_order_average: number;
    previous_month_order_average: number;
    monthly_order_average_month_over_month_percentage: number;
  };

  new_clients: {
    value: number;
    month_over_month_percentage: number;
    new_clients_by_month: number[];
  };
};

type IDashboardAnnualBilling = {
  year: string;
  data: {
    name: string;
    data: number[];
  }[];
};

// ----------------------------------------------------------------------

export default function DashboardView() {
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isAnnualBillingLoading, setIsAnnualBillingLoading] = useState(true);

  const [dashboardOverview, setDashboardOverview] = useState<IDashboardOverview>(
    {} as IDashboardOverview
  );
  const [annualBillingChartData, setAnnualBillingChartData] = useState(
    [] as IDashboardAnnualBilling[]
  );

  const getDashboardOverview = useCallback(async () => {
    try {
      const getDashboardOverviewData = await fetch('/api/dashboard/overview', {
        method: 'GET',
      }).then(response => response.data);
      setDashboardOverview(getDashboardOverviewData);
      setIsOverviewLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getDashboardAnnualBilling = useCallback(async () => {
    const annualBilling = await fetch('/api/dashboard/annual-billing', {
      method: 'GET',
    }).then(response => response.data.annual_billing);

    const transformedData = transformData(annualBilling.value);
    setAnnualBillingChartData(transformedData);
    setIsAnnualBillingLoading(false);
  }, []);

  useEffect(() => {
    getDashboardOverview();
    getDashboardAnnualBilling();
  }, [getDashboardOverview, getDashboardAnnualBilling]);

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DashboardWidgetSummary
            isLoading={isOverviewLoading}
            title="Pedidos Pendentes"
            total={dashboardOverview?.pending_orders?.value}
            infoMessage="Pedidos pendentes no mês atual. Um pedido (apoio domiciliário) é considerado pendente se o mesmo não tiver sido aceite."
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardWidgetSummary
            isLoading={isOverviewLoading}
            title="Faturação Mensal"
            sufix="€"
            total={dashboardOverview?.monthly_billing?.value}
            percentage={dashboardOverview?.monthly_billing?.month_over_month_percentage}
            percentageMessage="(mês anterior)"
            infoMessage="Faturação no mês atual. Este valor apenas inclui faturação de clientes cujos pedidos (apoio domiciliário) tenham sido realizados através da plataforma."
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              type: 'line',
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardWidgetSummary
            isLoading={isOverviewLoading}
            title="Faturação Acumulada"
            sufix="€"
            total={dashboardOverview?.year_to_date_billing?.value}
            infoMessage="Faturação acumulada desde o início do ano até ao dia atual. Este valor apenas inclui faturação de clientes cujos pedidos (apoio domiciliário) tenham sido realizados através da plataforma."
            percentageMessage="(ano anterior)"
            percentage={dashboardOverview?.year_to_date_billing?.year_over_year_percentage}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardWidgetChartSummary
            isLoading={isOverviewLoading}
            title="Clientes Ativos"
            total={dashboardOverview?.active_clients?.value}
            percentage={dashboardOverview?.active_clients?.month_over_month_percentage}
            percentageMessage="(mês anterior)"
            infoMessage="Clientes ativos no mês atual. Um cliente é considerado ativo se tiver realizado pelo menos um pedido (apoio domiciliário) através da plataforma no mês atual (e se o pedido se encontrar ativo)."
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: dashboardOverview?.active_clients?.active_clients_by_month,
              type: 'line',
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardWidgetChartSummary
            isLoading={isOverviewLoading}
            title="Novos Clientes"
            total={dashboardOverview?.new_clients?.value}
            percentage={dashboardOverview?.new_clients?.month_over_month_percentage}
            percentageMessage="(mês anterior)"
            infoMessage="Novos clientes no mês atual. Um cliente é considerado novo se tiver realizado o seu primeiro pedido (apoio domiciliário) através da plataforma no mês atual (e se o pedido se encontrar ativo)."
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: dashboardOverview?.new_clients?.new_clients_by_month,
              type: 'bar',
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardWidgetChartSummary
            isLoading={isOverviewLoading}
            title="Valor Médio por Pedido"
            sufix="€"
            total={dashboardOverview?.orders_average?.current_month_order_average}
            percentageMessage="(mês anterior)"
            percentage={
              dashboardOverview?.orders_average?.monthly_order_average_month_over_month_percentage
            }
            infoMessage="Valor médio por pedido no mês atual. Este valor apenas inclui faturação de clientes cujos pedidos (apoio domiciliário) tenham sido realizados através da plataforma."
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: dashboardOverview?.orders_average?.order_average_by_month,
              type: 'line',
            }}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12} sx={{ pb: 10 }}>
          <AppAreaInstalled
            title="Faturação Anual"
            infoMessage="Faturação mensal durante o ano selecionado. Este valor apenas inclui faturação de clientes cujos pedidos (apoio domiciliário) tenham sido realizados através da plataforma."
            subheader=""
            chart={{
              categories: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez',
              ],
              series: annualBillingChartData,
            }}
            isLoading={isAnnualBillingLoading}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

function transformData(dataArray) {
  const transformedData: IDashboardAnnualBilling[] = [];

  for (let i = 0; i < dataArray.length - 1; i += 1) {
    const seriesData = dataArray[i].data?.map(({ month, revenue }) => {
      return revenue;
    });

    transformedData.push({
      year: (dataArray[i].year as Number).toString(),
      data: [
        {
          name: 'Faturação',
          data: seriesData,
        },
      ],
    });
  }
  const currentMonth = new Date().getMonth() + 1;
  const lastYearBillingSeriesData = dataArray[dataArray.length - 1].data?.map(
    ({ month, revenue }) => {
      if (month <= currentMonth) {
        return revenue;
      }
      /**
       * else {
        return null;
      }
      */
      return null;
    }
  );

  const forecastBillingSeriesData = dataArray[dataArray.length - 1].data?.map(
    ({ month, revenue }) => {
      if (month >= currentMonth) {
        return revenue;
      }
      /**
       *  else {
        return null;
      }
       */
      return null;
    }
  );

  transformedData.push({
    year: (dataArray[dataArray.length - 1].year as Number).toString(),
    data: [
      {
        name: 'Faturação',
        data: lastYearBillingSeriesData,
      },
      {
        name: 'Previsão',
        data: forecastBillingSeriesData,
      },
    ],
  });

  return transformedData;
}

// ----------------------------------------------------------------------
