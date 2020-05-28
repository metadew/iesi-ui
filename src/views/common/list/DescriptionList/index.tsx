import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

interface IDescriptionListItem {
    label: string | ReactNode;
    value: string | ReactNode;
}

interface IPublicProps {
    items: IDescriptionListItem[];
    noLineAfterListItem?: boolean;
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
    noBorderBottom: {
        borderBottom: 0,
    },
}));

export default function DescriptionList({ items, noLineAfterListItem }: IPublicProps) {
    const classes = useStyles();

    return (
        <dl className={classes.list}>
            {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                    <dt className={classes.label}>{item.label}</dt>
                    <dd
                        className={classNames(classes.value, {
                            [classes.noBorderBottom]: noLineAfterListItem && index === items.length - 1,
                        })}
                    >
                        {item.value}
                    </dd>
                </React.Fragment>
            ))}
        </dl>
    );
}
