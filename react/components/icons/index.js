import { SvgIcon } from "@material-ui/core";

export function DashboardIcon(props) {
    return (
        <SvgIcon {...props}>
            <g fillRule="evenodd">
                <rect width="5" height="8" y="11" fill="#FFF" rx="2" />
                <rect width="3" height="12" x="9" y="6" stroke="#FFF" strokeWidth="2" rx="1.5" />
                <rect width="3" height="17" x="17" y="1" stroke="#FFF" strokeWidth="2" rx="1.5" />
            </g>
        </SvgIcon>
    );
}

export * from './notification';
export * from './dashboard';
export * from './child';
export * from './logout';