import { m } from 'framer-motion';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { varFade, MotionViewport } from 'src/components/animate';
import { useState } from 'react';

export default function FaqsForm() {
  const [name, setName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const mailtoLink = `mailto:${encodeURIComponent(
      'suporte@careplace.pt'
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    // Open mail client with the mailto link in a new tab
    window.open(mailtoLink, '_blank');
  };

  return (
    <Stack component={MotionViewport} spacing={3}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h4">Não encontrou o que procurava?</Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField
          fullWidth
          label="Nome"
          onChange={event => {
            setName(event.target.value);
          }}
        />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField
          fullWidth
          label="Email"
          onChange={event => {
            setRecipientEmail(event.target.value);
          }}
        />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField
          fullWidth
          label="Assunto"
          onChange={event => {
            setSubject(event.target.value);
          }}
        />
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField
          fullWidth
          label="Mensagem"
          multiline
          rows={4}
          onChange={event => {
            setMessage(event.target.value);
          }}
        />
      </m.div>

      <m.div variants={varFade().inUp}>
        <div style={{ textAlign: 'right' }}>
          <Button
            size="large"
            variant="contained"
            onClick={handleSubmit}
            sx={{
              marginLeft: 'auto', // Align the button to the right
            }}>
            Submeter
          </Button>
        </div>
      </m.div>
    </Stack>
  );
}
