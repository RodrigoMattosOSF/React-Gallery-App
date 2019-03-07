import React from 'react';

//Components
import Photo        from './Photo';
import { Consumer } from './App';
import NotFound     from './NotFound';

const Gallery = (props) => {

    const filter = encodeURIComponent(props.filter);  
    
    return (
        <Consumer>
            { ({ actions, lastSearch, galleries }) => {
                var [data, photos] = [[], []];

                if( filter !== lastSearch && (!galleries.hasOwnProperty(filter) || galleries[filter].length === 0)) {
                    actions.fetchData(filter, (responseData) => {
                        actions.updateState('all', responseData.data.photos.photo);
                    });
                } else {
                    data   = galleries.hasOwnProperty(filter)? galleries[filter] : galleries['all'];
                    photos = data.map( (photo, index) => <Photo key={index} data={photo}/> );
                }
                
                return (
                    <div className="photo-container">
                        <h2>Results</h2>
                        <ul>
                            {
                                (data.length > 0)
                                ?
                                photos
                                :
                                <NotFound />
                            }
                        </ul>
                    </div>
                )
            }}
        </Consumer>
    );
}

export default Gallery;



