import React from 'react';
import MUIButton, { ButtonProps } from '@material-ui/core/Button';
import './button.scss';

function Button(props: ButtonProps) {
    return (
        <MUIButton
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            className="Button"
        >
            Button
        </MUIButton>
    );
}

export default Button;
