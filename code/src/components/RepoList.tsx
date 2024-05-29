import React from 'react';
import { PubRepo } from '../types';

interface RepoListProps {
  publicrepos: PubRepo[];
}

const RepoList: React.FC<{ publicrepos: PubRepo[] }> = ({ publicrepos }) => {
  return (
    <div>
      {publicrepos.slice(0, 5).map((repo) => (
        <div key={repo.name}>
          <h2>{repo.name}</h2>
          <p>Repo Full Name: {repo.full_name}</p>
          <p>Repo URL: <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.html_url}</a></p>
          <p>Description: {repo.description || 'N/A'}</p>
          <p>Language: {repo.language || 'N/A'}</p>
          <p>Fork: {repo.fork.toString()}</p>
          <p>Created At: {repo.created_at}</p>
          <p>Updated At: {repo.updated_at}</p>
          <p>Pushed At: {repo.pushed_at}</p>
          <p>Size: {repo.size}</p>
          <p>Stargazers Count: {repo.stargazers_count}</p>
          <p>Watchers Count: {repo.watchers_count}</p>
          <p>Forks Count: {repo.forks_count}</p>
          <p>License: {repo.license ? repo.license.name : 'N/A'}</p>
          <p>Visibility: {repo.visibility}</p>
          <p>Forks: {repo.forks}</p>
          <p>Watchers: {repo.watchers}</p>
          <p>Default Branch: {repo.default_branch}</p>
        </div>
      ))}
    </div>
  );
};

export default RepoList;
