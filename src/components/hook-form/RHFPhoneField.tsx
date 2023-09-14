// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Box } from '@mui/material';
import { MuiTelInput, MuiTelInputProps } from 'mui-tel-input';
import Tooltip from 'src/components/tooltip';
import styled from 'styled-components';
// ----------------------------------------------------------------------

type Props = MuiTelInputProps & {
  phone?: string;
  name: string;
  defaultCountry?: string;
  label?: string;
  forceCallingCode?: boolean;
  helperText?: string;
  flagSize?: string;
  tooltip?: {
    icon?: string;
    text: string;
    iconColor?: string;
    tooltipWidth?: string;
  };
  onChange?: (value: string) => void;
};

/**
 * @see https://viclafouch.github.io/mui-tel-input/docs/css/
 */
// Country code font size should be the same has the input font size
const MuiTelInputStyled = styled(MuiTelInput)`
  .MuiTelInput-Input {
    font-size: 0.875rem;
  }
  .MuiTelInput-Typography-calling-code {
    font-size: 0.875rem;
    &.MuiTypography-root {
      font-size: 0.875rem;
    }
  }
  .MuiTypography-root {
    font-size: 0.875rem;
    margin-top: 1px;
  }
`;

/**
 * @see https://viclafouch.github.io/mui-tel-input/docs/api-reference/
 */
export default function RHFPhoneField({
  forceCallingCode,
  defaultCountry,
  name,
  helperText,
  flagSize,
  tooltip,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <MuiTelInputStyled
            {...field}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            forceCallingCode={forceCallingCode}
            defaultCountry={defaultCountry || 'PT'}
            helperText={error ? error?.message : helperText}
            onChange={field.onChange}
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
