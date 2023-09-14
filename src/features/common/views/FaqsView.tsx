// React
import { useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//
import FaqsHero from '../components/faqs-hero';
import FaqsList from '../components/faqs-list';
import FaqsForm from '../components/faqs-form';
import FaqsCategory from '../components/faqs-category';

// ----------------------------------------------------------------------

export default function FaqsView() {
  const [selectedCategory, setSelectedCategory] = useState('Conta');

  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  return (
    <>
      <FaqsHero query={searchQuery} onSearch={handleSearch} onReset={handleReset} />

      <Container
        sx={{
          pb: 10,
          pt: { xs: 0, md: 0 },
          position: 'relative',
        }}>
        <Typography
          variant="h3"
          sx={{
            my: { xs: 5, md: 10 },
          }}>
          Perguntas Frequentes
        </Typography>

        <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}>
          <FaqsList category={selectedCategory} query={searchQuery} />

          <Box sx={{ mt: { xs: 0, sm: -15 } }}>
            <FaqsForm />
          </Box>
        </Box>
      </Container>
    </>
  );
}
