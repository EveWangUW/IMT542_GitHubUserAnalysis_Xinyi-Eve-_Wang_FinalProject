import React, { useState } from 'react';
import Button from '@mui/material/Button';

// The GraphQL query
const query = `
query GetUser($login: String!) {
  user(login: $login) {
    name
    email
    bio
    createdAt
    updatedAt
    repositories(first: 5) {
      nodes {
        name
        description
        createdAt
        updatedAt
      }
    }
  }
}`;

// The endpoint URL
const url = 'https://api.github.com/graphql';

const GraphQL: React.FC = () => {
  const [login, setLogin] = useState('');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const fetchRepositories = () => {
    // The headers for the request
    const headers = {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json'
    };

    // The request payload
    const payload = {
      query: query,
      variables: { login: login }
    };

    // Make the POST request
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Trigger the download
        downloadJSON(data, 'repositories_data.json');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const downloadJSON = (json: object, filename: string) => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
    <h4>⬇️ Download user and repo information via GraphQL endpoint</h4>
      <input 
        type="text" 
        value={login} 
        onChange={handleChange} 
        placeholder="Enter GitHub username" 
        style={{ marginBottom: '10px', padding: '9px' }} 
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={fetchRepositories}
        disabled={!login}
        style={{ backgroundColor: 'lightblue', marginLeft: '10px' }}
      >
        Download
      </Button>
  </div>
);
};

export default GraphQL;
