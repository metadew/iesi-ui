import React from 'react';
import { Typography, Button } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { RouteComponentProps } from '@reach/router';
import logo, { ReactComponent as SvgLogo } from './logo.svg';
import './app.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default (props: RouteComponentProps) => (
    <div className="App">
        <Button variant="contained" color="primary" href="/" startIcon={<ArrowBack />}>
            Go back
        </Button>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <SvgLogo title="logo" className="App-logo" />

            <p>
                Edit
                {' '}
                <code>src/App.tsx</code>
                {' '}
                and
                {' '}
                <strong>save</strong>
                {' '}
                to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </a>
            <Typography variant="h1">Responsive h1</Typography>
            <Typography variant="body1">
                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.Quos blanditiis
                tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus,
                cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                quibusdam.
            </Typography>
            <Typography variant="h2">Responsive h2</Typography>
            <Typography variant="h3">Responsive h3</Typography>
            <Typography variant="h4">Responsive h4</Typography>
            <Typography variant="h5">Responsive h5</Typography>
            <Typography variant="h6">Responsive h6</Typography>
            <Button variant="contained" color="secondary">
                Hello
            </Button>
            <h2>Contained</h2>
            <div>
                <Button variant="contained" color="primary">
                    Contained Primary
                </Button>
                <Button variant="contained" color="secondary">
                    Contained Secondary
                </Button>
            </div>
            <h2>Text</h2>
            <div>
                <Button variant="text" color="primary">
                    Text Primary
                </Button>
                <Button variant="text" color="secondary">
                    Text Secondary
                </Button>
            </div>
            <h2>Outlined</h2>
            <div>
                <Button variant="outlined" color="primary">
                    Outlined Primary
                </Button>
                <Button variant="outlined" color="secondary">
                    Outlined Secondary
                </Button>
            </div>
            <h2>Icons</h2>
            <div>
                <Button variant="outlined" color="primary" startIcon={<DeleteIcon />}>
                    Outline Primary Icon-prepend
                </Button>
                <Button variant="outlined" color="secondary" endIcon={<SaveIcon />}>
                    Outline Secondary Icon-append
                </Button>
            </div>
        </header>
    </div>
);
