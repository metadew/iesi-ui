import { ReactElement, ReactText } from 'react';

export type TTranslatorComponent = ReactElement<{
    msg: string;
    placeholders?: { [key: string]: ReactText };
}>;
