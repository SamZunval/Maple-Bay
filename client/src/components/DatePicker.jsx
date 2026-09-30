import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue(props) {
  const [value, setValue] = React.useState(dayjs('2026-03-24'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ mb: "1em" }}
          label="Birthday"
          value={value}
          onChange={(newValue) => {
             setValue(newValue);
            }
            }
            
            onAccept={() => {
               props.accept(value);
            }
        }
        />
    </LocalizationProvider>
  );
}