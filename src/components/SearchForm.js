import React from 'react';
import searchSVG from '../search.svg';

import { Consumer } from './App';

const SearchForm = (props) => {

    const searchInput = React.createRef();
    const redirectSearch = () => {
        props.history.push('/');
    }

    return (
        <Consumer>
            { ({ actions, gallery }) => {
                const handleSubmit = (e) => {
                    e.preventDefault();
                    actions.fetchData(searchInput.current.value, (responseData) => {
                        actions.updateState('all', responseData.data.photos.photo);
                        
                        redirectSearch();                 
                    });
                    e.currentTarget.reset();
                    
                }                
    
                return (
                    <form className="search-form" onSubmit={handleSubmit}>
                        <input type="search" name="search" placeholder="Search" ref={searchInput} required/>
                        <button type="submit" className="search-button">
                            <img src={searchSVG} alt="Search Icon"/>
                        </button>
                    </form>
                );
            }}
        </Consumer>
    );    
}

export default SearchForm;