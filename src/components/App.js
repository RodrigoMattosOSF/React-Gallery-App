import React, { Component } from 'react';
import { 
    Route,
    Switch
} from 'react-router-dom';
import axios from 'axios';

// Config
import apiKey from '../config.js';

//Static
import '../css/App.css';
import loadingSVG from '../loading.svg';

//Components
import Container  from './Container';

const AppContext = React.createContext();

export default class App extends Component {

    state = {
        galleries : {
            all : []
        },
        ready : false,
        readySearches : 0,
        lastSearch : '',
    }

    allowedTags = [
        'cats',
        'dogs',
        'computers'
    ]    

    constructor(props) {
        super(props);
        this.props = props;

        this.handleFetchData   = this.handleFetchData.bind(this);
        this.handleUpdateState = this.handleUpdateState.bind(this);
        this.handleNotReady    = this.handleNotReady.bind(this);

        axios.interceptors.request.use((config) => {
            this.handleNotReady()
            return config;
        });
    }

    handleNotReady() {
        this.setState(prevState => {
            return {
                ...prevState,
                ready : false
            }
        });
    }

    handleUpdateState(filter, data) {
        this.setState(prevState => {
            let galleries     = prevState.galleries;
            galleries[filter] = data;
            
            return {
                galleries     : galleries,
                ready         : true,
                readySearches : prevState.readySearches
            }
        });
    }

    handleFetchData(query, callback) {
        axios.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + "&tags="+ query + '&per_page=24&content_type=1&extras=url_m&format=json&nojsoncallback=1')
            .then(callback)
            .then(() => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        lastSearch : query
                    }
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data.', error);
                this.handleUpdateState('all', []);
            });
    }

    componentDidMount() {
        this.allowedTags.forEach( (tag, index) => {
            this.handleFetchData(tag, (responseData) => {
                this.setState(prevState => {
                    let galleries     = prevState.galleries;
                    galleries[tag]    = responseData.data.photos.photo;
                    let readySearches = prevState.readySearches + 1;

                    return {
                        galleries     : galleries,
                        ready         : (this.allowedTags.length === readySearches),
                        readySearches : readySearches
                    }
                });
            });
        });
    }

    render() {
        return (
            <AppContext.Provider value={{
                galleries   : this.state.galleries,
                allowedTags : this.allowedTags,
                lastSearch  : this.state.lastSearch,
                actions     : {
                    fetchData   : this.handleFetchData,
                    updateState : this.handleUpdateState,
                    notReady    : this.handleNotReady
                }
            }}>
                {
                    (this.state.ready)
                    ?              
                        <Switch>
                            <Route exact path="/" component={Container} />
                            <Route path={"/:filter"} component={Container} />                            
                        </Switch>
                    :
                        <p>
                            <img src={loadingSVG} alt="Loading...."/>
                        </p>
                }
            </AppContext.Provider>
        );
    }
}

export const Consumer = AppContext.Consumer;
