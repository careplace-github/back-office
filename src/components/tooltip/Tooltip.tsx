import { Theme } from '@mui/material/styles'; // or "@mui/system"
import { Tooltip as MuiTooltip } from '@mui/material';
import { SxProps } from '@mui/system'; // or "@mui/material"
import Iconify from '../iconify/Iconify';

type TooltipProps = {
  text: string;
  icon?: string;
  placement?:
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | undefined;
  iconColor?: string;
  tooltipWidth?: string;
  sx?: SxProps<Theme>; // add the `sx` prop here
};

export default function Tooltip({
  iconColor,
  tooltipWidth = '250px',
  text,
  icon = 'foundation:info',
  placement = 'top',
  sx, // destructure `sx`
  ...other // catch-all for other props
}: TooltipProps) {
  return (
    <MuiTooltip
      arrow
      title={text}
      placement={placement}
      sx={{
        '.MuiTooltip-tooltip': {
          // Target the tooltip class
          maxWidth: tooltipWidth,
        },
      }}
      {...other} // spread other props here
    >
      <Iconify
        sx={{
          color: iconColor ?? 'text.secondary',
          ...sx, // spread `sx` here
        }}
        icon={icon}
        width="15px"
        height="15px"
      />
    </MuiTooltip>
  );
}
