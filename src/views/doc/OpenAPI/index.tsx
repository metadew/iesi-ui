import React from 'react';
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { IObserveProps } from 'views/observe';

const styles = ({ palette }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
    });

interface IComponentState {
    loading: true;
}
type TProps = WithStyles<typeof styles>;

const OpenAPI = withStyles(styles)(
    class extends React.PureComponent<TProps & IObserveProps, IComponentState> {
        public render() {
            return (
                <div>TODO: Implement empty page</div>
            );
        }
    },
);

export default OpenAPI;
