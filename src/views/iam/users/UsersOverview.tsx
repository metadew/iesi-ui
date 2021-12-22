import React from 'react';
import { IObserveProps, observe } from 'views/observe';
import {
    createStyles,
    withStyles,
    WithStyles,
    Theme,
} from '@material-ui/core';

const styles = ({ palette }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    userIdToDelete: string;
}

const UsersOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                userIdToDelete: null,
            };
        }

        public render() {
            return (
                <>
                    Coucou
                </>
            );
        }
    },
);

export default observe<TProps>([], UsersOverview);
