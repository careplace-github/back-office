import { useRef } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Stack, TextField, TextFieldProps } from '@mui/material';
// hooks
import useEventListener from 'src/hooks/useEventListener';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  keyName: string;
  inputs: string[];
};

export default function RHFCodes({ keyName = '', inputs = [], ...other }: Props) {
  const codesRef = useRef<HTMLDivElement>(null);

  const { control, setValue } = useFormContext();

  const handlePaste = (event: any) => {
    let data = event.clipboardData.getData('text');

    data = data.split('');

    inputs.map((input, index) => setValue(input, data[index]));

    event.preventDefault();
  };

  const handleChangeWithNextField = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const { maxLength, value, name } = event.target;

    const fieldIndex = name.replace(keyName, '');

    const fieldIntIndex = Number(fieldIndex);

    const nextfield: HTMLElement | null = document.querySelector(
      `input[name=${keyName}${fieldIntIndex + 1}]`
    );

    if (value.length > maxLength) {
      event.target.value = value[0];
    }

    if (value.length >= maxLength && fieldIntIndex < 6 && nextfield !== null) {
      (nextfield as HTMLElement).focus();
    }

    handleChange(event);
  };

  useEventListener('paste', handlePaste, codesRef);

  // We need to handle the delete key press event to delete the text on the current field and move the focus to the previous field
  const handleDelete = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    const fieldIndex = name.replace(keyName, '');

    const fieldIntIndex = Number(fieldIndex);

    const previousField: HTMLElement | null = document.querySelector(
      `input[name=${keyName}${fieldIntIndex - 1}]`
    );

    const currentField: string = (event.target as HTMLInputElement).value;

    // If the user presses the backspace key and the field is empty, move the focus to the previous field without deleting the text
    if (event.key === 'Backspace' && fieldIntIndex > 1 && currentField === '') {
      (previousField as HTMLElement).focus();

      event.preventDefault();
    }
  };

  const handleArrowKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = event.target as HTMLInputElement;

    const fieldIndex = name.replace(keyName, '');

    const fieldIntIndex = Number(fieldIndex);

    const previousField: HTMLElement | null = document.querySelector(
      `input[name=${keyName}${fieldIntIndex - 1}]`
    );

    const nextField: HTMLElement | null = document.querySelector(
      `input[name=${keyName}${fieldIntIndex + 1}]`
    );

    if (event.key === 'ArrowLeft' && fieldIntIndex > 1) {
      (previousField as HTMLElement).focus();

      event.preventDefault();
    }

    if (event.key === 'ArrowRight' && fieldIntIndex < 6) {
      (nextField as HTMLElement).focus();

      event.preventDefault();
    }
  };

  return (
    <Stack
      direction="row"
      spacing={3}
      justifyContent="center"
      ref={codesRef}
      // Stretch the component to fill the space
      sx={{
        '& > div': {
          width: '100%',
        },
      }}>
      {inputs.map((name, index) => (
        <Controller
          key={name}
          name={`${keyName}${index + 1}`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              autoFocus={index === 0}
              placeholder="-"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeWithNextField(event, field.onChange);
              }}
              onFocus={event => event.currentTarget.select()}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                handleDelete(event, field.name);
                handleArrowKeys(event);
              }}
              InputProps={{
                sx: {
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 },
                  '& input': { p: 0, textAlign: 'center' },
                },
              }}
              inputProps={{
                maxLength: 1,
                type: 'number',
              }}
              {...other}
            />
          )}
        />
      ))}
    </Stack>
  );
}
