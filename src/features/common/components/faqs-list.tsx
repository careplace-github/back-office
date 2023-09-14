// @mui
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// components
import Iconify from 'src/components/iconify';
import { CSSProperties, useEffect, useState } from 'react';

const _faqs = [
  {
    id: '1',
    category: 'Geral',
    heading: 'Como funciona o Careplace?',
    detail: (
      <p>
        A <b>Careplace Business</b> é uma plataforma revolucionária dedicada a simplificar e
        otimizar a gestão de empresas e profissionais na área dos cuidados domiciliários e da saúde
        geriátrica. O nosso objetivo é fornecer às empresas as ferramentas necessárias para
        prosperarem neste setor em constante evolução. <br /> <br /> <br />
        <b>1. Registo e Perfis de Empresa</b>: O processo começa com o registo na plataforma
        Careplace Business. As empresas podem criar perfis detalhados que incluem informações sobre
        os serviços que oferecem, áreas de atuação, horários de operação e muito mais.
        <br /> <br />
        <b>2. Aceitação de Pedidos</b>: Uma vez registadas, as empresas têm a oportunidade de
        aceitar pedidos de serviços domiciliários diretamente através da plataforma. Estes pedidos
        são provenientes de utilizadores que procuram cuidados de alta qualidade para os seus entes
        queridos.
        <br /> <br />
        <b>3. Gestão Simplificada</b>: A Careplace Business oferece uma gama de ferramentas de
        gestão poderosas. As empresas podem gerir eficientemente os pedidos recebidos,
        colaboradores, agendas, faturação e muito mais, tudo a partir de um único local.
        <br /> <br />
        <b>4. Sem Custos de Registo para Aceitação de Pedidos</b>: A aceitação de pedidos através da
        Careplace Business é completamente gratuita para as empresas. Não cobramos quaisquer taxas
        de registo para acesso à nossa base de utilizadores.
        <br /> <br />
        <b>5. Melhorias na Eficiência Operacional</b>: Com as nossas ferramentas integradas, as
        empresas podem reduzir os custos operacionais, melhorar a eficiência dos processos e, ao
        mesmo tempo, oferecer um serviço de alta qualidade. <br /> <br />
        <b>6. Suporte e Assistência</b>: A Careplace Business está sempre disponível para fornecer
        suporte e assistência às empresas registadas na plataforma. A nossa equipa está pronta para
        ajudar a aproveitar ao máximo as funcionalidades da Careplace Business. <br /> <br />
        <b> 7. Expansão dos Serviços</b>: Estamos empenhados em expandir continuamente a nossa
        plataforma para incluir novos serviços e funcionalidades que beneficiem as empresas e
        profissionais do setor geriátrico. <br /> <br />
        <br /> Em resumo, a <b>Careplace Business</b> é muito mais do que apenas uma plataforma de
        gestão; é uma parceria que pode ajudar as empresas a prosperar na área dos cuidados
        domiciliários e da saúde geriátrica. Estamos aqui para simplificar processos, fornecer
        suporte e contribuir para o sucesso contínuo das empresas que servem aqueles que mais
        precisam de cuidados.
      </p>
    ),
  },
  {
    id: '2',
    category: 'Geral',

    heading: 'Para quem é a Careplace Business?',
    detail: (
      <p>
        A <b>Careplace Business</b> destina-se a um amplo público-alvo composto por empresas,
        profissionais independentes e organizações que operam no setor dos cuidados domiciliários e
        da saúde geriátrica. A nossa plataforma foi concebida para servir as seguintes categorias de
        utilizadores:
        <br /> <br /> <br />
        <b> 1. Empresas de Cuidados Domiciliários</b>: Empresas especializadas em cuidados
        domiciliários, que prestam uma variedade de serviços, como cuidados pessoais, assistência
        médica, acompanhamento, entre outros, a indivíduos que necessitam de cuidados em casa. A
        Careplace Business ajuda estas empresas a gerir as operações de forma mais eficiente e a
        atrair uma base de clientes diversificada.
        <br /> <br />
        <b> 2. Lares de Idosos e Residências Sénior</b>: Estabelecimentos dedicados ao acolhimento
        de idosos que necessitam de cuidados de longo prazo. A Careplace Business pode ser usada
        para gerir a ocupação, manter registros de pacientes e oferecer serviços adicionais aos
        residentes.
        <br /> <br />
        <b> 3. Fornecedores de Equipamento Médico</b>: Empresas que fornecem equipamentos médicos
        essenciais, como cadeiras de rodas, camas hospitalares e dispositivos de assistência. A
        plataforma pode ser usada para listar e alugar ou vender esses equipamentos aos utilizadores
        que deles necessitam.
        <br /> <br />
        <b>4. Profissionais de Saúde Geriátrica</b>: Profissionais independentes, como enfermeiros,
        terapeutas e cuidadores, que oferecem serviços personalizados a idosos e pessoas com
        necessidades de saúde específicas. A plataforma permite-lhes encontrar oportunidades de
        trabalho, gerir os seus horários e fornecer cuidados de alta qualidade.
        <br /> <br />
        <b>5. Outras Entidades Relacionadas com Geriatria</b>: Qualquer entidade ou organização
        envolvida no setor dos cuidados geriátricos, incluindo instituições de ensino, associações
        profissionais e grupos de apoio, pode encontrar valor na Careplace Business.
        <br /> <br /> <br />
        Em resumo, a <b>Careplace Business</b> é uma plataforma versátil que serve como ponto de
        encontro para todos os que trabalham no campo dos cuidados domiciliários e da saúde
        geriátrica. O nosso objetivo é fornecer ferramentas e recursos que ajudem a melhorar a
        eficiência, a transparência e a qualidade dos serviços prestados neste setor vital.
      </p>
    ),
  },
  {
    id: '3',
    category: 'Geral',
    heading: 'Como é que aceito um pedido?',
    detail: (
      <p>
        Aceitar um pedido na <b>Careplace Business</b> é um processo simplificado para os
        prestadores de serviços. Siga os seguintes passos:
        <br />
        <br />
        <b>1. Notificação do Pedido:</b> Assim que um cliente solicitar um serviço ou fizer um
        pedido através da plataforma Careplace Business, você receberá uma notificação imediata,
        seja por e-mail ou diretamente na plataforma.
        <br />
        <br />
        <b>2. Análise do Pedido:</b> Analise cuidadosamente os detalhes do pedido, incluindo os
        serviços solicitados, a data e hora desejadas, o local e quaisquer outras informações
        fornecidas pelo cliente.
        <br />
        <br />
        <b>3. Avaliação de Disponibilidade:</b> Verifique a sua disponibilidade para atender ao
        pedido. Certifique-se de que pode cumprir os requisitos do cliente na data e hora
        solicitadas. Se estiver disponível, prossiga para o próximo passo.
        <br />
        <br />
        <b>4. Aceitação do Pedido:</b> Através da plataforma Careplace Business, você pode aceitar
        oficialmente o pedido. Assim que o pedido for aceite, o cliente será notificado
        automaticamente da confirmação.
        <br />
        <br />
        <b>5. Início da Prestação de Serviço:</b> Após aceitar o pedido, você pode começar a prestar
        o serviço conforme combinado com o cliente. Certifique-se de que a comunicação com o cliente
        seja contínua e transparente ao longo do processo, garantindo que ambas as partes estejam
        alinhadas com as expectativas e que o serviço seja fornecido de forma eficaz e satisfatória.
        <br />
        <br />
        <b>6. Avaliação e Feedback:</b> Após a conclusão do serviço, encoraje o cliente a fornecer
        feedback através da plataforma Careplace Business. As avaliações e opiniões dos clientes são
        valiosas para a sua reputação na plataforma.
        <br />
        <br />
        Em resumo, a <b>Careplace Business</b> é uma plataforma versátil que serve como ponto de
        encontro para todos os que trabalham no campo dos cuidados domiciliários e da saúde
        geriátrica. O nosso objetivo é fornecer ferramentas e recursos que ajudem a melhorar a
        eficiência, a transparência e a qualidade dos serviços prestados neste setor vital.
      </p>
    ),
  },

  {
    id: '4',
    category: 'Geral',

    heading: 'Existe algum custo de registo?',
    detail: (
      <p>
        A <b>Careplace Business</b> é uma plataforma inovadora criada especificamente para empresas
        e profissionais de saúde geriátrica. Destina-se a todas as empresas que oferecem serviços de
        cuidados geriátricos, desde cuidadores individuais até lares de idosos, e a todos os
        profissionais de saúde geriátrica, como enfermeiros, fisioterapeutas e médicos
        especializados em geriatria.
        <br /> <br />
        Através da <b>Careplace Business</b>, as empresas e profissionais podem aceder a um conjunto
        abrangente de ferramentas e funcionalidades que simplificam a gestão de serviços, clientes e
        operações financeiras. A plataforma permite-lhes aceitar pedidos de clientes, agendar
        visitas de triagem, gerir colaboradores e processar faturação, tudo num único local
        conveniente.
        <br /> <br />
        Para começar a utilizar a <b>Careplace Business</b>, convidamo-lo a registar-se na nossa
        plataforma de demonstração em{' '}
        <a
          href="http://www.business.careplace.pt/demo"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#2E9EDD' } as CSSProperties}>
          <b>www.business.careplace.pt/demo</b>
        </a>
        . O registo é <b>gratuito</b>, e poderá explorar todas as funcionalidades e ferramentas que
        oferecemos para empresas e profissionais de saúde geriátrica. Experimente agora e descubra
        como a Careplace Business pode impulsionar o seu negócio na área de cuidados geriátricos.
      </p>
    ),
  },
  {
    id: '5',
    category: 'Geral',

    heading: 'Como são feitos os pagamentos?',
    detail: (
      <p>
        Os pagamentos na <b>Careplace Business</b> são processados através da nossa plataforma,
        garantindo assim que a remuneração dos prestadores de serviço é assegurada e transferida
        diretamente para a conta registada.
        <br /> <br />
        Isso proporciona segurança e conveniência tanto para as empresas como para os clientes que
        utilizam os nossos serviços, garantindo que recebam o pagamento de forma eficaz e sem
        complicações.
      </p>
    ),
  },
];

// ----------------------------------------------------------------------

export default function FaqsList({ category, query }: { category: string; query: string }) {
  const [faqs, setFaqs] = useState(_faqs);

  if (category === undefined) {
    category = 'Geral';
  }

  useEffect(() => {
    setFaqs(_faqs.filter(faq => faq.category === category));
  }, [category]);

  useEffect(() => {
    setFaqs(_faqs.filter(faq => faq.heading.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  return (
    <div>
      {faqs.map(accordion => (
        <Accordion key={accordion.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
