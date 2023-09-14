// @mui
import { Stack, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------

export default function TermsAndConditionsView() {
  return (
    <m.div>
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
          Termos e Condições
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          INTRODUÇÃO
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
          {`Bem-vindo à Careplace, a plataforma que conecta profissionais de saúde a turnos disponíveis em diferentes instituições de saúde (a “Plataforma Careplace”).

A Careplace é uma plataforma gerida pela Careplace, Lda., NIPC 517083817, com sede na Rua Adriano Correia de Oliveira 4 A, 1600-312 Lisboa, doravante apenas denominada “Careplace”.

Estes Termos e Condições regulam a relação entre a CAREPLACE, LDA. (“Careplace”) e os utilizadores da nossa Plataforma (os “Profissionais de Saúde”), em conjunto designados por “Partes”.

A utilização da Plataforma Careplace pressupõe e implica a aceitação deste documento, pelo que deve lê-lo com atenção e contactar-nos em caso de dúvidas para o endereço de e-mail geral@careplace.pt. Ao utilizar a plataforma Careplace, está a concordar com os termos e condições descritos detalhadamente no presente documento.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          1. REQUISITOS PARA CRIAÇÃO DE CONTA
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
          {`1.1. Para aceder ou usar a Plataforma Careplace, deverá ter:

a. Inscrição válida junto de Ordem Profissional portuguesa, se aplicável;
b. Cédula válida para o exercício da profissão, se aplicável;
c. Seguro de responsabilidade civil para o exercício da profissão válido e em vigor;
d. Seguro de acidentes de trabalho para trabalhadores independentes, mesmo que exerçam uma outra atividade por conta de outrem;
e. Uma fotografia de rosto atual que permita à Entidade Contratante identificá-lo(a).

1.2. Antes de estar disponível para as Instituições de Saúde, o seu perfil irá ser previamente validado pela Careplace.

1.3. O Profissional de Saúde declara sob compromisso de honra que as informações por si inseridas na criação do seu perfil são verdadeiras e que a documentação inserida na Plataforma Careplace é autêntica.

1.4. O Profissional de Saúde declara compreender que a prestação de falsas informações na Plataforma Careplace poderá conduzir à interposição de ação judicial por parte da Careplace e pelas Instituições de Saúde visadas, bem como à instauração de processo disciplinar por parte da sua Ordem profissional, se for o caso.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          2. RELAÇÃO CONTRATUAL
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
          {`2.1. A Plataforma Careplace é uma plataforma que liga Profissionais de Saúde e Entidades Contratantes, com vista à contratação daqueles por estas para a prestação de serviços.

2.2. O Profissional de Saúde desempenhará a sua atividade para a Entidade Contratante com independência e autonomia técnica, e não está, de forma alguma, sujeito a instruções da Careplace.

2.3. Enquanto a sua conta na Plataforma Careplace estiver ativa, o Profissional de Saúde está sujeito a estes Termos e Condições. A sua conta vai manter-se ativa até que decida eliminá-la ou suspendê-la.

2.4. A Careplace reserva-se no direito de, a todo o tempo, suspender o funcionamento da Plataforma Careplace ou de eliminar a sua conta, mediante envio de comunicação prévia, sem que tenha de pagar qualquer compensação ou indemnização ao Profissional de Saúde.

2.5. Caso o Profissional de Saúde decida eliminar a sua conta, o seu perfil, dados, histórico e avaliações serão eliminados de forma permanente.

2.6. O Profissional de Saúde não será considerado, para quaisquer efeitos, como colaborador, trabalhador ou representante da Careplace.

2.7. A Careplace e os Profissionais de Saúde expressamente declaram que apenas outorgam os presentes termos e condições por estarem de boa-fé quanto à natureza juridicamente independente da prestação dos serviços, reconhecendo ambas que a contraparte não teria outorgado as presentes condições se das mesmas pudessem emergir relações de trabalho subordinado; ambas renunciam, por isso, mutuamente a questionar a qualificação da relação enquanto contrato de prestação de serviços ou a invocar quaisquer factos ou circunstâncias como eventuais índices de subordinação, sob pena de incorrerem na obrigação de suportar os custos que a outra parte incorra em virtude dessa atuação e para defesa dos seus interesses, incluindo honorários e despesas de mandatário forense que escolha constituir para esse efeito.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          3. CONVITES DAS ENTIDADES CONTRATANTES
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
          {`3.1. As Instituições de Saúde parceiras da Careplace decidem, de acordo com os seus próprios critérios e de acordo com as suas necessidades, quais os perfis de Profissionais de Saúde que mais se adequam ao turno que pretendem preencher, mediante pagamento de um valor previamente determinado.

3.2. Quando selecionar um Profissional de Saúde, a Entidade Contratante remete-lhe um convite para a prestação dos seus serviços através da Plataforma Careplace.

3.3. O convite contém as seguintes informações:

a. Instituição de Saúde;
b. Morada;
c. Data(s) e horário(s);
d. Local da prestação de serviço;
e. Unidade/tipo de serviço;
f. Remuneração horária;
g. Breve descrição das funções.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          4. ACEITAÇÃO DE CONVITE
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
          {`4.1. A partir do momento em que aceita o convite na Plataforma Careplace para prestar atividade em regime de turnos, part-time ou mesmo full-time, o Profissional de Saúde fica obrigado a comparecer e a realizar a atividade, nas exatas condições propostas pela Instituição de Saúde.

4.2. Uma vez aceite o convite, o Profissional de Saúde apenas pode desobrigar-se na Plataforma Careplace com o aviso prévio mínimo de 72 horas de antecedência face à data e hora de início no caso de o convite ser referente a um turno específico, de 7 dias no caso de part-time, e nos termos e condições que lhe forem comunicados pela Entidade Contratante no caso de um full-time.

4.3. Após a aceitação por parte do Profissional de Saúde dos dias e horas em que realizará o serviço, este apenas poderá cancelá-los conforme descrito no ponto anterior ou mediante a apresentação de uma justificação idónea e razoável, assim como de documento que a ateste.

4.4. A Entidade Contratante pode não aceitar a realização dos remanescentes turnos caso o Profissional de Saúde não respeite a comunicação prevista no ponto 4.3 e/ou a justificação apresentada não seja idónea.

4.5. Se o exercício da profissão do Profissional de Saúde estiver dependente da atribuição de cédula profissional, após a aceitação do turno pelo Profissional de Saúde, este obriga-se a, aquando da sua realização, transportar e a apresentar a cédula profissional, se assim solicitado pela Entidade Contratante, reconhecendo expressa e irrevogavelmente o direito da Entidade Contratante a recusar a prestação do serviço caso não apresente a cédula profissional.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          5. AVALIAÇÃO
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
          {`5.1. O serviço prestado pelo Profissional de Saúde está sujeito a avaliação por parte da Entidade Contratante.

5.2. A avaliação é feita pela Entidade Contratante após a prestação de serviço e segue o modelo de avaliação de 1 (uma) estrela a 5 (cinco) estrelas.

5.3. A avaliação ficará a constar do perfil público do Profissional de Saúde e poderá ajudar as Entidades Contratantes a avaliar o nível de satisfação de anteriores clientes quanto aos serviços prestados por cada Profissional de Saúde.

5.4. Após a realização do turno, o Profissional de Saúde poderá avaliar a Entidade Contratante, cuja avaliação segue o modelo do ponto 5.2.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          6. FATURAÇÃO E PAGAMENTO DE HONORÁRIOS
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
          {`6.1. O Profissional de Saúde aceita e concorda, de forma expressa e irrevogável, que os honorários devidos pelos serviços prestados às Entidades Contratantes via Careplace sejam autofaturados por esta última, através do *software* Invoicexpress.

6.2. O Profissional de Saúde obriga-se a criar uma conta no *software* Invoicexpress e a fazer a conexão deste *software* à sua página da Autoridade Tributária.

6.3. Para o correto funcionamento da autofaturação, o Profissional de Saúde obriga-se, inclusive, a completar todos os Dados de Faturação solicitados no seu perfil, na plataforma Careplace. Estes dados incluem respetivamente a morada fiscal completa, NIF, regime de IVA, retenção na fonte, base de incidência em IRS, IBAN e código Swift.

6.4. O pagamento dos honorários do Profissional de Saúde devidos pelos serviços prestados nas Entidades Contratantes depende de instrução expressa deste último na plataforma da Careplace, denominada por *cash-out*.

6.5. O Profissional de Saúde procede ao *default cash-out*, quando dá instrução expressa à Careplace para proceder ao pagamento dos seus honorários, por cada turno realizado, que ocorrerá no primeiro dia do mês seguinte.

6.6. Alternativamente, o Profissional de Saúde poderá proceder ao *custom cash-out*, através de instrução expressa na plataforma Careplace, sendo que o pagamento ocorre no prazo de 2 (dois) dias úteis. O *custom cash-out* encontra-se sujeito a uma penalização sobre o valor dos honorários relativos a turnos antecipados, que corresponde a 0,20€ (vinte cêntimos) + 2,5% sobre o valor ilíquido dos turnos antecipados.

6.7. O Profissional de Saúde declara ser conhecedor de que apenas pode proceder ao *custom cash-out* 72h após realização do respetivo turno, período este necessário para alterações necessárias que possam advir da duração efetiva do turno, tomadas pela Careplace ou Entidades Contratantes.

6.8. O Profissional de Saúde obriga-se, após o bom pagamento por parte da Careplace, a confirmar que tomou conhecimento de cada autofatura emitida, através do envio de mensagem via plataforma da Careplace, e a emitir no Portal das Finanças o recibo por cada autofatura emitida pela Careplace, identificando-as.

6.9. O Profissional de Saúde receberá o montante ilíquido que será apresentado no convite enviado pela Entidade Contratante, de acordo com os termos nele referidos.

6.10. O Profissional de Saúde suporta todos os impostos aplicáveis sobre a sua remuneração, sem prejuízo do dever de retenção na fonte que possa caber à Careplace.

6.11. A Careplace não poderá ser responsabilizada por atrasos bancários na transferência dos montantes solicitados via *cash-out*.

6.12. A Careplace não fica obrigada ao pagamento de contribuições no regime geral de Segurança Social dos trabalhadores por conta de outrem ou como trabalhador independente, relativamente ao Profissional de Saúde, declarando o mesmo que se encontra devidamente enquadrado no regime de Segurança Social dos trabalhadores independentes e com situação contributiva regularizada, obrigando-se a produzir prova perante a Careplace se tal lhe for solicitado. Todos os encargos emergentes desse enquadramento e inscrição são da exclusiva conta do Profissional de Saúde.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          7. PENALIZAÇÕES
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
          {`7.1. Em caso de cancelamento de turnos: Caso o Profissional de Saúde cancele um turno com menos de 72 horas de antecedência, sem a apresentação de justificação, a Careplace poderá desativar o seu perfil na Plataforma Careplace, impedindo-o de se candidatar e aceitar turnos por um período entre 15 (quinze) dias e 6 (seis) meses, não tendo o Profissional de Saúde direito ao pagamento desse respectivo turno.

7.2. Em caso de não comparência no turno: Caso o Profissional de Saúde não cancele um turno aceite na Plataforma Careplace e não se apresente ao serviço como contratado com a Entidade Contratante, a Careplace poderá aplicar em cumulação as seguintes sanções:

- Excluir o Profissional de Saúde imediatamente da Plataforma Careplace;
- Interdição de nova inscrição e acesso à Plataforma Careplace;
- Não pagar os respetivos honorários do(s) turno(s) em causa;
- Se for o caso, apresentar queixa por violação de deveres deontológicos, junto da respetiva Ordem profissional, nomeadamente, por falta de zelo e diligência no cumprimento das suas funções.

7.3. Em caso de incumprimento de normas deontológicas ou destes Termos e Condições: Em caso de denúncia ou condenação do Profissional de Saúde em processo disciplinar de Ordem profissional, ainda que não relacionada com a prestação dos serviços às Instituições de Saúde parceiras da Careplace, a Careplace reserva-se no direito de suspender a conta do Profissional de Saúde na Plataforma Careplace por um período entre 15 (quinze) dias e 3 (três) meses ou eliminá-la permanentemente. Caso a Careplace tenha conhecimento da interposição de processos disciplinares, cíveis ou criminais ao Profissional de Saúde, por factos relacionados com o exercício da sua profissão, informará as Entidades Contratantes da sua rede, para que estas determinem, de acordo com os seus próprios critérios, se quererão ou não recorrer aos serviços do profissional em questão.

7.4. Em caso de upload ou envio de documentos ou informação falsa: Se durante o procedimento de inscrição, o Profissional de Saúde remeter e/ou fornecer à Careplace, seja através de envio por e-mail ou upload na Plataforma Careplace, documentos ou informações falsas, reserva-se a Careplace o direito de excluir temporariamente ou expulsar o Profissional de Saúde da plataforma/APP Careplace, consoante a gravidade da sua conduta, sendo certo que o fornecimento pelo Profissional de Saúde de qualquer documentação falsa ou falsificada, nomeadamente, mas sem excluir, a cédula profissional, implicará a prática do crime de falsificação de documentos, acarretando o respetivo reporte às autoridades competentes.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          8. AUTONOMIA DO PROFISSIONAL DE SAÚDE E NÃO EXCLUSIVIDADE
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
          {`8.1. Enquanto mantenha conta na Plataforma Careplace, o Profissional de Saúde pode prestar serviços a outras entidades.

8.2. O Profissional de Saúde não poderá apresentar-se a terceiros (designadamente em curriculum vitae ou em aplicações, páginas ou sítios da Internet) como trabalhador, quadro ou colaborador da Careplace ou da Entidade Contratante onde presta serviço ou com qualquer título equivalente ou que sugira a existência de qualquer tipo de relacionamento subordinado, dado o seu estatuto profissional juridicamente autónomo.

8.3. O caráter de não exclusividade da presente relação não prejudica, contudo, o dever do Profissional de Saúde em respeitar a atividade na Entidade Contratante para a qual foi contratado e a concorrente daquela.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          9. INSTRUMENTOS DE TRABALHO
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
          {`9.1. O Profissional de Saúde prestará o serviço contratado com recurso aos instrumentos de trabalho disponibilizados pela Entidade Contratante, de acordo com a política de cada instituição.

9.2. A Careplace não é responsável, nem poderá ser responsabilizada, no presente ou no futuro, por danos que o Profissional de Saúde cause ou provoque aos instrumentos de trabalho disponibilizados pela Entidade Contratante, quer esse dano ocorra durante ou imediatamente antes ou após a realização da prestação de serviços contratada, sendo da responsabilidade do Profissional de Saúde os eventuais danos que aquele possa causar.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          10. DANOS E SEGURO
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
          {`10.1. O Profissional de Saúde deverá ter seguro de responsabilidade civil e de acidentes de trabalho como trabalhador independente que cubra todos os riscos inerentes à prestação de serviços.

10.2. O Profissional de Saúde declara e reconhece que qualquer acidente que tenha lugar durante a prestação de serviços corre por sua exclusiva conta, sem que possa imputar à Careplace ou à Entidade Contratante qualquer tipo de responsabilidade, por quaisquer danos emergentes, devendo encontrar-se abrangido por um seguro de acidentes de trabalho, mesmo que já tenha um por trabalhador por conta de outrem.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          11. DESPESAS
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
          11.1. Todas as despesas em que o Profissional de Saúde incorra por força da prestação dos
          serviços serão da sua exclusiva responsabilidade, incluindo transporte e alimentação,
          salvo se previamente aprovadas pela Entidade Contratante na Plataforma Careplace.
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          12. DEONTOLOGIA E CONFIDENCIALIDADE
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
          12.1. O Profissional de Saúde reconhece e declara aceitar que: a. No caso de ser cuidador
          domiciliário, a prestação dos seus serviços de apoio ao domicílio às Entidades
          Contratantes está sujeita ao cumprimento normas de Deontologia Profissional do Regulamento
          do Exercício Profissional dos cuidador domiciliários, aprovado pelo Decreto-Lei n.º
          161/96, de 4 de setembro, alterado pelo Decreto-Lei n.º 104/98, de 21 de abril e que o seu
          incumprimento está sujeito à autoridade do Conselho Jurisdicional da Ordem dos cuidador
          domiciliários. b. Deve cumprir com os deveres especiais de confidencialidade ao não
          revelar ou difundir, por qualquer forma ou meio, a nenhuma outra pessoa, em público ou em
          privado, toda e qualquer informação de que tenha conhecimento no âmbito da prestação dos
          serviços de apoio domiciliário às Entidades Contratantes, quer quanto aos seus pacientes,
          quer quanto à listas de clientes e parceiros quer quanto à gestão interna das Entidades
          Contratantes. 12.2. Além das obrigações de confidencialidade aqui assumidas, as Entidades
          poderão solicitar ao Profissional de Saúde a assinatura de termos de confidencialidade
          adicionais. As obrigações de confidencialidade mantêm-se em vigor mesmo após cessação da
          relação contratual entre o Profissional de Saúde e a Entidade Contratante.
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          13. DADOS PESSOAIS
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
          {`13.1. Dados pessoais do Profissional de Saúde: Os dados pessoais do Profissional de Saúde são recolhidos pela Careplace com base no (i) consentimento e/ou para gestão e execução do mandato de cobrança do crédito por parte da Careplace; (ii) aferição do preenchimento dos requisitos do Profissional de Saúde para integrar a rede da Plataforma Careplace (qualificações académicas e validade de inscrição em Ordem profissional, se for o caso); (iii) partilha de perfil com Entidades Contratantes, de acordo com os termos da Política de Privacidade da Plataforma Careplace.

13.2. Dados pessoais acedidos pelo Profissional de Saúde: No contexto da prestação dos serviços às Entidades Contratantes parceiras da Careplace, os Profissionais de Saúde estão vinculados ao cumprimento das políticas de privacidade fornecidas pelas mesmas, bem como às obrigações de sigilo a que deontologicamente estão adstritos.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          14. PROPRIEDADE INTELECTUAL
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
          14.1 Todos os conteúdos que integram a nossa Plataforma Careplace, bem como a sua
          estrutura e layout, a seleção, organização e apresentação dos seus conteúdos, incluindo as
          suas funcionalidades e o software utilizado, marcas registadas, logótipos e símbolos que
          nela aparecem, estão protegidos por direitos Intelectuais e são propriedade ou foram
          licenciadas à Careplace.15.2 Está expressamente proibida a transferência, difusão,
          publicação, disponibilização ao público por qualquer forma ou meio, a modificação,
          transformação, cópia, utilização, venda, ou partilha, sob qualquer forma, os textos,
          imagens, ou outras informações contidas na nossa loja ou parte dela sem o consentimento
          prévio, por escrito, da Careplace.
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          15. RECLAMAÇÕES
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
          `15.1 Caso tenha algum comentário ou reclamação a fazer relativamente à utilização da
          Plataforma Careplace, por favor contactar geral@careplace.pt. Informa-se ainda que é
          assiste ao Profissional de Saúde o direito de apresentar uma reclamação através do Livro
          de Reclamações Online, disponível em www.livroreclamacoes.pt.
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          16. ALTERAÇÕES A ESTES TERMOS E CONDIÇÕES
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
          {`16.1. Ocasionalmente, a Careplace poderá efetuar alterações a estes Termos e Condições. A versão atualizada dos Termos e Condições será publicada na Plataforma Careplace e as alterações serão notificadas por e-mail a todos os utilizadores, de preferência, com uma antecedência mínima de 10 (dez) dias antes de entrarem em vigor, devendo os Profissionais de Saúde aceitar essas alterações, sempre que aceitarem um novo serviço.

16.2. Ao continuar a utilizar a Plataforma Careplace, os seus utilizadores concordam com as atualizações dos Termos e Condições, pelo que caso não concordem com as mesmas, solicita-se o cancelamento da conta.`}
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          17. LEI APLICÁVEL
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
          17.1. A lei aplicável aos presentes Termos e Condições é a lei portuguesa e qualquer
          litígio relativo à sua interpretação e execução está sujeito à competência dos Tribunais
          da Comarca de Lisboa.
        </Typography>

        <Typography
          variant="h3"
          paragraph
          sx={{
            mb: 3,
          }}>
          18. DÚVIDAS
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
            pb: { xs: 10, sm: 50 },
          }}>
          {`18.1. Ao utilizar a Plataforma Careplace, o Profissional de Saúde declara que leu e compreendeu os respetivos Termos e Condições a que se vinculou.

18.2. Caso existam questões sobre estes Termos e Condições ou sobre os turnos a realizar junto de Instituições de Saúde, por favor contactar geral@careplace.pt.`}
        </Typography>
      </Stack>
    </m.div>
  );
}
