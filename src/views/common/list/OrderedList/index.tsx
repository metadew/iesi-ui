import React, { ReactNode } from 'react';

interface IPublicProps {
    items: string[] | ReactNode;
}

const OrderedList = ({ items }: IPublicProps) => {
    console.log(typeof items);
    return (
        <ol>
            {/* {items.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                    {item}
                </li>
            ))} */}
        </ol>
    );
}

export default OrderedList;
