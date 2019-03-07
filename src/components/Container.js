import React from 'react';

// Components
import Header     from './Header';
import SearchForm from './SearchForm';
import Gallery    from './Gallery';

const Container = (props) => {

    const params = props.match.params;
    const filter = params.hasOwnProperty('filter')? params.filter : 'all';

    
    return (
        <div className="container">
            <SearchForm {...props} />
            <Header />  
            <Gallery filter={filter}/>
        </div>
    )            
}

export default Container;