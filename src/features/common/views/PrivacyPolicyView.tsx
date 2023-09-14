// @mui
import { Stack, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

export default function PrivacyPolicyView() {
  return (
    <Stack
      spacing={3}
      sx={{
        my: { xs: 5, sm: 25 },
        mb: { xs: 0, sm: 25 },
        mx: 'auto',
        maxWidth: 1000,
        alignItems: 'center',
        textAlign: { xs: 'center', md: 'left' },
        px: { xs: 4, sm: 0 },
      }}>
      <Typography
        variant="h2"
        paragraph
        sx={{
          mb: { xs: 3, sm: 10 },
          textAlign: 'center',
          fontWeight: '700',
        }}>
        Política de Privacidade
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        1. OBJETO
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`A Careplace assume um firme compromisso com a privacidade e com os direitos das pessoas que utilizam a Careplace enquanto titulares de dados pessoais.

A Careplace concebeu a Careplace de acordo com os princípios da privacidade desde a sua conceção e por defeito, efetuando as atividades de tratamento de dados pessoais necessárias de acordo com o Regulamento Geral sobre a Proteção de Dados (“RGPD”) e com a Lei n.º 58/2019, de 8 agosto, que assegura a execução na ordem jurídica nacional do referido Regulamento, e demais legislação aplicável.

A Careplace protege a privacidade, confidencialidade e segurança dos dados introduzidos por utilizadores particulares (os Profissionais de Saúde) e pelos representantes legais dos seus parceiros (as Instituições de Saúde).

Este documento sistematiza todas as atividades de tratamento de dados realizadas pela Careplace bem como o respetivo enquadramento legal.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        2. ENTIDADE RESPONSÁVEL PELO TRATAMENTO DE DADOS PESSOAIS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        A Careplace (CAREPLACE LDA., pessoa coletiva com o NIPC 517083817, com sede na Rua Adriano
        Correia de Oliveira 4 A, 1600-312 Lisboa) entidade que explora a Careplace e é a responsável
        pelo tratamento dos dados pessoais dos utilizadores da Careplace, para as finalidades
        referidas na presente política de privacidade, nos termos e para os efeitos do disposto no
        artigo 24.º do RGPD.
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        3. DADOS PESSOAIS TRATADOS PELA Careplace
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`Para a prestação dos seus serviços, a Careplace trata os dados introduzidos por utilizadores particulares (os Profissionais de Saúde) e pelos representantes legais dos seus parceiros (as Instituições de Saúde).

Em momento algum a Careplace recolhe, acede ou por outra via trata quaisquer dados, incluindo de saúde, de pacientes ou utentes das Instituições de Saúde suas parceiras.

Caso uma Instituição de Saúde efetue a contratação da prestação de serviços de Profissionais de Saúde registados na Careplace, a Careplace tratará ainda dados referentes à faturação dos mesmos pelos Profissionais de Saúde à Instituição de Saúde.

Assim sendo, a Careplace trata os seguintes dados:

A. Dos Profissionais de Saúde

Para o funcionamento da Careplace é necessário o registo e tratamento de dados pessoais dos Profissionais de Saúde que se registam na plataforma. Para essa finalidade de registo e utilização da Careplace, são recolhidos e tratados os seguintes dados, com base no consentimento dos Profissionais de Saúde:

- nome, e-mail, morada postal, fotografia, contacto telefónico, número do cartão de cidadão e número de cédula profissional e respetiva fotografia da cédula.

Todos estes dados são necessários à criação do perfil dos Profissionais de Saúde, sendo que a recusa ou retirada do consentimento para o tratamento dos mesmos, poderá implicar a impossibilidade da manutenção de um perfil na Careplace.

Para gestão e execução do mandato de cobrança do crédito da prestação dos serviços prestados pelos Profissionais de Saúde à Instituição de Saúde, a Careplace tratará ainda os dados que constem nos recibos-verdes a emitir pelos Profissionais de Saúde.

B. Dos representantes legais das Instituições de Saúde

Estes dados serão tratados na estrita medida da prossecução das necessárias diligências pré-contratuais bem como para execução do contrato entre as Instituições de Saúde e da Careplace.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        4. TRANSMISSÃO DE DADOS PESSOAIS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`Os dados dos Profissionais de Saúde poderão ser consultados e pesquisados por Instituições de Saúde inscritas na Careplace, exclusivamente para fins de recrutamento e seleção de candidatos.

Os dados pessoais podem ainda ser transmitidos a entidades que prestem serviços à Careplace (“subcontratantes”) para que os tratem em nome e por conta da Careplace, por exemplo, fornecedores relacionados com o nosso sistema de e-mail marketing ou gestão contabilística.

No entanto, nestes casos, a Careplace tomará as medidas contratuais necessárias para procurar garantir que os subcontratantes respeitam e protegem os dados pessoais do titular, nomeadamente, celebrando contratos escritos com todos os nossos subcontratantes em que os mesmos devem assumir os compromissos revistos na lei e medidas de segurança adequadas a manter a privacidade, integralidade e confidencialidade dos dados.

Por força da lei, os dados poderão ainda ter de ser comunicados à Autoridade Tributária, autoridades judiciárias, órgãos de polícia criminal, entre outras.

No entanto, sempre que tal seja necessário, implementaremos os mecanismos necessários para garantir que essa partilha, é realizada de acordo com a legislação aplicável em matéria de proteção de dados e dentro dos limites, finalidades e fundamentos definidos nesta Política.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        5. TRANSFERÊNCIAS INTERNACIONAIS DE DADOS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`A Careplace não transferirá os seus dados pessoais para qualquer país fora do Espaço Económico Europeu.

Caso, no âmbito das suas relações comerciais com prestadores de serviços da Careplace, os subcontratantes necessitem de transferir os dados pessoais de Profissionais de Saúde ou representantes legais das Instituições de Saúde, a Careplace adotará as medidas contratuais necessárias para assegurar que os subcontratantes efetuam essa transferência nos termos legalmente exigidos.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        6. SEGURANÇA E CONFIDENCIALIDADE DOS DADOS PESSOAIS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        A Careplace adota as medidas de segurança adequadas para proteger os dados pessoais dos
        Utilizadores para não sejam acedidos por pessoas não autorizadas. Para o efeito utiliza
        sistemas de segurança, regras e outros procedimentos, de modo a garantir a proteção dos
        dados pessoais, bem como para prevenir o acesso não autorizado aos dados, o uso impróprio, a
        sua divulgação, perda ou destruição.
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        7. PERÍODO DE CONSERVAÇÃO DOS DADOS PESSOAIS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`A. Pela Careplace

A Careplace trata e conserva os seus dados pessoais conforme as finalidades para que os mesmos são tratados e apenas pelo período de tempo necessário para o cumprimento das finalidades que motivaram a sua recolha e conservação, e sempre de acordo com a lei, as orientações e as decisões da CNPD, ou, consoante o que for aplicável, até que exerça o seu direito de oposição, eliminação ou retire o consentimento.

A Careplace conservará os dados do perfil dos Profissionais de Saúde até que estes retirem o consentimento para o seu tratamento ou eliminem a sua conta na Careplace.

Os dados de faturação dos serviços dos Profissionais de Saúde às Instituições de Saúde poderão ser conservados pelos prazos legal ou contratualmente aplicáveis.

Depois de decorrido o respetivo período de conservação legalmente exigido, a Careplace eliminará ou anonimizará os dados sempre que os mesmos não devam ser conservados para finalidade distinta que possa subsistir.

B. Pelas Instituições de Saúde

As Instituições de Saúde apenas poderão tratar os dados pessoais dos Profissionais de Saúde acedidos através da Careplace estritamente na medida da sua relação contratual com a Careplace: acesso e consulta.

Caso contratem os serviços de certo Profissional de Saúde, deverão tratá-los e conservá-los de acordo com as suas próprias políticas de privacidade e reter os seus dados pelos prazos legalmente aplicáveis, nomeadamente só contatar para o telefone daquele única e exclusivamente para efeitos da execução do turno contratado.

O tratamento de dados pessoais dos Profissionais de Saúde pelas Instituições de Saúde fora da Careplace não será oponível à Careplace.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        8. COMUNICAÇÕES DE MARKETING
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        Os utilizadores podem actualizar, editar ou apagar os seus dados pessoais a qualquer momento
        bem como opor-se à utilização dos dados facultados para fins de marketing, para o envio de
        comunicações informativas ou outras, devendo para tal fazê-lo por e-mail para
        geral@careplace.pt. Os utilizadores podem também facilmente subscrever ou cancelar as
        diferentes campanhas de emails da Careplace clicando na opção “unsubscribe” em qualquer
        e-mail que receber da Careplace.
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        9. DIREITOS DOS TITULARES DE DADOS PESSOAIS
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`O titular dos dados pessoais, e sempre que se encontrem preenchidos os necessários requisitos legais para o efeito, poderá exercer junto da Careplace os seguintes direitos:

- Direito de Acesso: direito de aceder aos seus dados pessoais, solicitando-nos informações sobre os concretos dados que a Careplace tem sobre o titular dos dados, bem como as características dos tratamentos de dados que realizamos;
- Direito de Retificação: direito de retificar qualquer informação a seu respeito que entenda estar desatualizada ou incorreta;
- Direito de Oposição: nos casos em que o tratamento de dados for efetuado com base em interesses legítimos prosseguidos pela Careplace, ou o tratamento de dados for efetuado para efeitos de marketing direto ou definição de perfis, poderá, a qualquer altura, opor-se ao tratamento dos seus dados pessoais.
- Direito à Limitação do tratamento dos seus dados: direito de solicitar à Careplace a limitação do tratamento dos seus dados pessoais, em determinadas circunstâncias;
- Direito ao apagamento dos seus dados: tem o direito de solicitar, em determinadas circunstâncias, o apagamento dos seus dados pessoais;
- Direito à Portabilidade dos seus dados: tem o direito de nos solicitar os dados pessoais que nos tenha fornecido, num formato estruturado, de uso corrente e de leitura automática, bem como, a transferência dos mesmos para outro Responsável;
- Direito de retirar o consentimento: Nos casos em que o tratamento de dados dependa de consentimento, o seu titular terá o direito de retirar. Se o consentimento for legalmente necessário para o tratamento de dados pessoais, o titular dos dados tem o direito de retirar consentimento em qualquer altura, embora esse direito não comprometa a licitude do tratamento efetuado com base no consentimento previamente dado, nem o tratamento posterior dos mesmos dados, baseado noutra base legal. No caso de dados necessários para criação do perfil dos Profissionais de Saúde na Careplace, a retirada do consentimento poderá pôr em causa a manutenção do perfil na plataforma.

Caso o titular dos dados pretenda exercer qualquer um dos seus direitos, deverá contactar a Careplace, por escrito, através do e-mail dpd@careplace.pt ou por carta, enviada para a Rua Frederico George, 33-B, Loja 4, 1600-012 Lisboa.

Poderá ser-lhe pedido que faça prova da sua identidade de modo a assegurar que a partilha dos dados pessoais é apenas efetuada com o seu titular.

O titular dos dados deverá ter presente que em certos casos, por exigência legal, o seu pedido poderá não ser imediatamente satisfeito. De qualquer modo, será informado das medidas tomadas nesse sentido, no prazo de um mês a contar da data da sua receção.

Tem ainda o direito de apresentar uma reclamação à Comissão Nacional de Proteção de Dados em https://www.cnpd.pt/.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        10. SEGURANÇA DA CONTA
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
        }}>
        {`Os nomes de utilizador e passwords definidas no registo no portal, são para uso exclusivo da pessoa a quem são emitidos. As passwords devem ser mantidas confidenciais e seguras.

A Careplace pode negar o acesso a um nome de utilizador, se acreditar que ele está a ser utilizado por uma pessoa não autorizada ou que o utilizador está a violar os Termos e Condições da Careplace.`}
      </Typography>

      <Typography
        variant="h3"
        paragraph
        sx={{
          mb: 3,
        }}>
        11. ALTERAÇÕES A ESTA POLÍTICA DE PRIVACIDADE
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          mb: 5,
          pb: 10,
        }}>
        {`A Careplace poderá ter a necessidade de alterar a presente Política de Privacidade, caso em que, se legalmente exigido, as respetivas alterações serão notificadas aos titulares dos dados, por email. As alterações deverão entrar em vigor no prazo de 15 dias após a referida notificação.

A versão atualizada será publicada no website da Careplace, de forma acessível aos titulares dos dados.`}
      </Typography>

      <Typography
        sx={{
          pb: { xs: 10, sm: 50 },
        }}>
        {' '}
        Política revista e atualizada a 1 de Setembro de 2023.{' '}
      </Typography>
    </Stack>
  );
}
