import React from 'react';
import { User } from '../types';

interface UserInfoProps {
  user: User;
  timeOnGitHub: string;
  activeLevel: string;
  userValue: { category: string, value: number } | null;
  mostUsedLanguage: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, timeOnGitHub, activeLevel, userValue }) => {
  return (
<div>
  <div>
    <h2>1. Filtered information</h2>
    <div>Login: {user.login}</div>
    <div>Name: {user.name || 'N/A'}</div>
    <div>Profile URL: <a href={user.html_url}>{user.html_url}</a></div>
    <div>Company: {user.company || 'N/A'}</div>
    <div>Location: {user.location || 'N/A'}</div>
    <div>Bio: {user.bio || 'N/A'}</div>
    <div>Public Repositories: {user.public_repos}</div>
    <div>Followers: {user.followers}</div>
    <div>Following: {user.following}</div>
    <div>Joined GitHub: {user.created_at}</div>
    <div>Last Updated: {user.updated_at}</div>
    <div>Email: {user.email || 'N/A'}</div>
    <div>Hireable: {user.hireable ? 'Yes' : 'No'}</div>
  </div>

  <div>
    <h2>2. Newly generated insights</h2>
    <div>Time on GitHub: {timeOnGitHub}</div>
    <div>Active Level: {activeLevel}</div>
    <div>User Value: {userValue ? `${userValue.category} (${userValue.value})` : 'N/A'}</div>
  </div>
  
</div>


  );
};

export default UserInfo;
