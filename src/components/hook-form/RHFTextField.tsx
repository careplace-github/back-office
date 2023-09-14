// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Box } from '@mui/material';
import Tooltip from 'src/components/tooltip';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  tooltip?: {
    icon?: string;
    text: string;
    iconColor?: string;
    tooltipWidth?: string;
  };
};

export default function RHFTextField({ name, helperText, tooltip, multiline, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <TextField
            {...field}
            fullWidth
            multiline={multiline}
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
          {tooltip && (
            <Tooltip
              sx={{ position: 'absolute', top: '10px', right: '10px' }}
              text={tooltip.text}
              tooltipWidth={tooltip.tooltipWidth}
              icon={tooltip?.icon}
              iconColor={tooltip?.iconColor}
            />
          )}
        </Box>
      )}
    />
  );
}
