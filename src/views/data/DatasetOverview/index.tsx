import React from 'react';
import {
    createStyles,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { observe, IObserveProps } from 'views/observe';

const styles = () => createStyles({});

interface IDatasetState {
    datasetIdToDelete: string;
}

type TProps = WithStyles<typeof styles>;

const DatasetOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IDatasetState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                datasetIdToDelete: null,
            };
        }

        public render() {
            return (
                <>
                    <div>Coucou</div>
                </>
            );
        }
    },
);

export default observe<TProps>([], DatasetOverview);
