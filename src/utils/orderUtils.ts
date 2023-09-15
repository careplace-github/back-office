import { IOrderProps } from '../types/order';

export const getWeekDayName = (week_day: number) => {
  let text = '';

  if (week_day === 1) {
    text = 'Segunda-feira';
  } else if (week_day === 2) {
    text = 'Terça-feira';
  } else if (week_day === 3) {
    text = 'Quarta-feira';
  } else if (week_day === 4) {
    text = 'Quinta-feira';
  } else if (week_day === 5) {
    text = 'Sexta-feira';
  } else if (week_day === 6) {
    text = 'Sábado';
  } else if (week_day === 7) {
    text = 'Domingo';
  }

  return text;
};

export const getRecurrencyText = (order: IOrderProps) => {
  let text = '';
  const {recurrency} = order.schedule_information;

  if (recurrency === 0) text = 'Pedido Único';
  else if (recurrency === 1) {
    text = 'Semanal';
  } else if (recurrency === 2) {
    text = 'Quinzenal';
  } else if (recurrency === 4) {
    text = 'Mensal';
  }
  return text;
};

/**
 * 
 * This is returning the following:
: 2023- - 2023-; Segunda-feira: 2023- - 2023-; Terça-feira: 2023- - 2023- * It should return the following:
 * Segundas-feiras: 15:30 - 22:00; Quartas-feiras: 10:00 - 14:00; Sextas-feiras: 08:00 - 12:00;
 */
export const getScheduleText = (order: IOrderProps) => {
  const { schedule_information } = order;
  const { schedule } = schedule_information;

  const daysMap = {
    1: 'Segundas-feiras',
    2: 'Terças-feiras',
    3: 'Quartas-feiras',
    4: 'Quintas-feiras',
    5: 'Sextas-feiras',
    6: 'Sábados',
    7: 'Domingos',
  };

  const scheduleText = schedule.map(item => {
    const { week_day, start, end } = item;
    const startTime = new Date(start).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(end).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${daysMap[week_day]}: ${startTime} - ${endTime}`;
  });

  return scheduleText.join('; ');
};

export const getStatusText = (order: IOrderProps) => {
  let text = '';
  const {status} = order;

  if (status === 'new') {
    text = 'Novo';
  } else if (status === 'accepted') {
    text = 'Aguarda Visita';
  } else if (status === 'pending_payment') {
    text = 'Pagamento Pendente';
  } else if (status === 'active') {
    text = 'Ativo';
  } else if (status === 'declined') {
    text = 'Recusado';
  } else if (status === 'completed') {
    text = 'Concluído';
  } else if (status === 'cancelled') {
    text = 'Cancelado';
  }

  return text;
};
