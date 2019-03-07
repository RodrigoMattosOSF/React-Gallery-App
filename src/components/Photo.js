import React from 'react';

const Photo = (props) => (
    <li>
        <img src={props.data.url_m} alt={props.data.title} />
    </li>
);

export default Photo;