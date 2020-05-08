import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

interface IDescriptionListItem {
    label: string;
    value: string | ReactNode;
}

interface IPublicProps {
    items: IDescriptionListItem[];
}

const useStyles = makeStyles(({ spacing, typography }) => ({
    list: {},
    label: {
        paddingTop: spacing(1),
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(11),
        textTransform: 'uppercase',
    },
    value: {
        marginInlineStart: 0,
        paddingBottom: spacing(1),
        fontSize: typography.pxToRem(14),
        borderBottom: `1px solid ${THEME_COLORS.GREY}`,
    },
}));

export default function DescriptionList({ items }: IPublicProps) {
    const classes = useStyles();

    return (
        <dl className={classes.list}>
            {items.map((item) => (
                <React.Fragment key={JSON.stringify(`${item.label}-{item.value}`)}>
                    <dt className={classes.label}>{item.label}</dt>
                    <dd className={classes.value}>{item.value}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}
