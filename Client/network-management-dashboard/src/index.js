import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloProviderWrapper from './ApolloClient';

ReactDOM.render(
    <ApolloProviderWrapper>
        <App />
    </ApolloProviderWrapper>,
    document.getElementById('root')
);
