import React from 'react';
import {
    // Box,
    // Button,
    // Collapse,
    createStyles,
    darken,
    Theme,
    // Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
// import { IConnection, IConnectionEnvironment, IConnectionParameter } from 'models/state/connections.model';
import { IObserveProps, observe } from 'views/observe';
// import { getAsyncConnectionDetail } from 'state/entities/connections/selectors';
import { StateChangeNotification } from 'models/state.models';
// import { getUniqueIdFromConnection } from 'utils/connections/connectionUtils';
// import { clone } from 'lodash';
// import Loader from 'views/common/waiting/Loader';
// import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
// import { getAsyncConnectionTypes } from 'state/entities/constants/selectors';
// import { withRouter } from 'react-router-dom';
// import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
// import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
// import Translate from '@snipsonian/react/es/components/i18n/Translate';
// import { Alert, Autocomplete } from '@material-ui/lab';
// import { IConnectionType } from 'models/state/constants.models';
// import { IListItem, ListColumns } from 'models/list.models';
// import {
//     triggerCreateConnectionDetail,
//     triggerDeleteConnectionDetail,
//     triggerUpdateConnectionDetail,
// } from 'state/entities/connections/triggers';
// import { checkAuthority, checkAuthorityGeneral } from 'state/auth/selectors';
// import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
// import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
// import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
// import ClosableDialog from 'views/common/layout/ClosableDialog';
// import TextInput from 'views/common/input/TextInput';
// import { getTranslator } from 'state/i18n/selectors';
// import { TRequiredFieldsState } from 'models/form.models';
// import GenericList from 'views/common/list/GenericList';
// import { Delete, Edit } from '@material-ui/icons';
// import DescriptionList from 'views/common/list/DescriptionList';
// import EditEnvironments from '../../connectivity/ConnectionDetail/EditEnvironments';
// import EditParameter from '../../connectivity/EditParameter';
// import DetailActions from '../../connectivity/DetailActions';

const styles = (({ palette }: Theme) => createStyles({
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

type TProps = WithStyles<typeof styles>;

// interface IConnectionTypeColumnNames {
//     name: string;
//     type: string;
// }

// interface IListData {
//     type: string;
// }

interface IComponentState {
    environmentIndex: number;
    editParameterIndex: number;
    isAddingParameter: boolean;
    hasChangesToCheck: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteConnectionOpen: boolean;
}

// const initialConnectionDetail: IConnection = {
//     type: '',
//     securityGroupName: '',
//     name: '',
//     description: '',
//     environments: [],
// };

const EnvironmentDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);
            console.log('ok');
        }
    },
);
export default observe([
    StateChangeNotification.CONSTANTS_ENVIRONMENT_TYPES,
], EnvironmentDetail);
