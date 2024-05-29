import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { fetchUserData, fetchPublicRepoData } from '../functions/api';
import UserInfo from './UserInfo';
import RepoList from './RepoList';
import { User, PubRepo } from '../types';
import GraphQL from './graphql';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function GitHub() {
  const [username, setUsername] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [publicrepos, setPublicrepos] = useState<PubRepo[]>([]);
  const [userDataJSON, setUserDataJSON] = useState<string>('');
  const [combinedInfoJSON, setCombinedInfoJSON] = useState<string>('');
  const [combinedInfoJSON2, setCombinedInfoJSON2] = useState<string>('');
  const [combinedInfoJSON3, setCombinedInfoJSON3] = useState<string>('');
  
  const [timeOnGitHub, setTimeOnGitHub] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<string>('');
  const [userValue, setUserValue] = useState<{ category: string, value: number } | null>(null);
  const [mostUsedLanguage, setMostUsedLanguage] = useState<string>('');
  const [averageRepoSize, setAverageRepoSize] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [totalForks, setTotalForks] = useState<number>(0);
  const [averageStars, setAverageStars] = useState<number>(0);
  const [averageForks, setAverageForks] = useState<number>(0);
  const [repositoryActivity, setRepositoryActivity] = useState<string>('');

  //1. user information manipulation and generation of insights:
  const calculateTimeOnGitHub = (createdAt: string): string => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const daysOnGitHub = Math.floor(timeDiff / (1000 * 3600 * 24));
    return `${daysOnGitHub} days`;
  };

  const calculateActiveLevel = (updatedAt: string): string => {
    const currentDate = new Date();
    const updatedDate = new Date(updatedAt);
    const timeDiff = currentDate.getTime() - updatedDate.getTime();
    const daysSinceLastUpdate = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysSinceLastUpdate <= 30) {
      return "Very Active";
    } else if (daysSinceLastUpdate <= 90) {
      return "Relatively Active";
    } else if (daysSinceLastUpdate <= 365) {
      return "Not Very Active";
    } else {
      return "Not Active";
    }
  };

  const calculateUserValue= (followers: number, publicRepos: number): { category: string, value: number } => {
    const weightFollowers = 0.6;
    const weightPublicRepos = 0.4;
    const userValue = (followers * weightFollowers) + (publicRepos * weightPublicRepos);
    const thresholdGood = 100;

    let category = "";
    if (userValue < thresholdGood) {
      category = "Relatively good user value";
    } else if (userValue < 2 * thresholdGood) {
      category = "Okay user value";
    } else {
      category = "Great user value";
    }

    return { category, value: userValue };
  };

  //2. user repo information manipulation and generation of insights
  const calculateMostUsedLanguage = (repos: PubRepo[]): string => {
    const languageCount: { [key: string]: number } = {};
    repos.forEach((repo: PubRepo) => {
      if (repo.language) {
        if (languageCount[repo.language]) {
          languageCount[repo.language]++;
        } else {
          languageCount[repo.language] = 1;
        }
      }
    });
    return Object.keys(languageCount).reduce((a, b) => languageCount[a] > languageCount[b] ? a : b, '');
  };

  const calculateAverageRepoSize = (repos: PubRepo[]): number => {
    if (repos.length === 0) return 0;
    const totalSize = repos.reduce((sum, repo) => sum + repo.size, 0);
    return totalSize / repos.length;
  };

  const calculateTotalStars = (repos: PubRepo[]): number => {
    return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  };

  const calculateTotalForks = (repos: PubRepo[]): number => {
    return repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  };

  const calculateAverageStars = (repos: PubRepo[]): number => {
    if (repos.length === 0) return 0;
    return calculateTotalStars(repos) / repos.length;
  };

  const calculateAverageForks = (repos: PubRepo[]): number => {
    if (repos.length === 0) return 0;
    return calculateTotalForks(repos) / repos.length;
  };

  const calculateRepositoryActivity = (repos: PubRepo[]): string => {
    const currentDate = new Date();
    const lastPushedDates = repos.map(repo => new Date(repo.pushed_at).getTime()); // Extract timestamp
    const mostRecentPush = new Date(Math.max.apply(null, lastPushedDates));
    const daysSinceLastPush = Math.floor((currentDate.getTime() - mostRecentPush.getTime()) / (1000 * 3600 * 24));
    
    if (daysSinceLastPush <= 30) {
      return "Very Active";
    } else if (daysSinceLastPush <= 90) {
      return "Relatively Active";
    } else if (daysSinceLastPush <= 365) {
      return "Not Very Active";
    } else {
      return "Not Active";
    }
  };
  
  //enable the download original json data function
  const downloadJSON = (json: string, filename: string) => {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      
  //the analysis function
  const GenerateAnalysis = async () => {
    if (username.trim() !== '') {
      //set the user data
      const dataUser = await fetchUserData(username);
      if (dataUser) {
        setUser(dataUser);
        setUserDataJSON(JSON.stringify(dataUser, null, 2));

        const filteredUser = {
          login: dataUser.login,
          html_url: dataUser.html_url,
          name: dataUser.name,
          company: dataUser.company,
          location: dataUser.location,
          bio: dataUser.bio,
          public_repos: dataUser.public_repos,
          followers: dataUser.followers,
          following: dataUser.following,
          created_at: dataUser.created_at,
          updated_at: dataUser.updated_at,
          email: dataUser.email,
          hireable: dataUser.hireable
        };

        const additionalInfo = {
          timeOnGitHub: calculateTimeOnGitHub(dataUser.created_at),
          activeLevel: calculateActiveLevel(dataUser.updated_at),
          userValue: calculateUserValue(dataUser.followers, dataUser.public_repos)
        };

        setTimeOnGitHub(additionalInfo.timeOnGitHub);
        setActiveLevel(additionalInfo.activeLevel);
        setUserValue(additionalInfo.userValue);

        const combinedInfo = {
          ...filteredUser,
          ...additionalInfo
        };

        setCombinedInfoJSON(JSON.stringify(combinedInfo, null, 2));
        //set the public repo data
      const dataPublic = await fetchPublicRepoData(username);
      if (dataPublic) {
        setPublicrepos(dataPublic);

        setMostUsedLanguage(calculateMostUsedLanguage(dataPublic));
        setAverageRepoSize(calculateAverageRepoSize(dataPublic));
        setTotalStars(calculateTotalStars(dataPublic));
        setTotalForks(calculateTotalForks(dataPublic));
        setAverageStars(calculateAverageStars(dataPublic));
        setAverageForks(calculateAverageForks(dataPublic));
        setRepositoryActivity(calculateRepositoryActivity(dataPublic));
        
      }
     
      const additionalInfo2 = {
        MostUsedLanguage: calculateMostUsedLanguage(dataPublic),
        AverageRepoSize: calculateAverageRepoSize(dataPublic),
        TotalStars:calculateTotalStars(dataPublic),
        TotalForks:calculateTotalForks(dataPublic),
        AverageStars:calculateAverageStars(dataPublic),
        AverageForks:calculateAverageForks(dataPublic),
        RepositoryActivity:calculateRepositoryActivity(dataPublic)
      };
    
      setCombinedInfoJSON2(JSON.stringify(additionalInfo2, null, 2));
      
      const combinedAnalysis = {
        githubUserAndRepoAnalysis: {
          newUserData: {
            ...filteredUser,
            ...additionalInfo
          },
          newRepoData: {
            ...additionalInfo2
          }
        }
      };

      setCombinedInfoJSON3(JSON.stringify(combinedAnalysis, null, 2));
      }
    }
    
  };

  return (
<ThemeProvider theme={theme}>
  <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Arial' }}>
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          GitHub User and Repo Analysis
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          for Recruiters 🔍
        </Typography>
      </Box>
      <Box mb={3}>
        <TextField
          label="GitHub Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
      </Box>
      <Box mb={1}>
        <Button variant="contained" color="primary" onClick={GenerateAnalysis} style={{ backgroundColor: 'lightblue' }}>
          ✅ Generate Analysis
        </Button>
      </Box>
      <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '16px' }}>
        
      </Grid>
      <GraphQL/>
      <br/>
      <Typography variant="h5" style={{ backgroundColor: 'lightblue', borderRadius: '10px', padding: '5px' }}>👩🏻‍💻 User Analysis</Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          {user && (
            <UserInfo user={user} timeOnGitHub={timeOnGitHub} activeLevel={activeLevel} userValue={userValue} mostUsedLanguage={mostUsedLanguage} />
          )}
        </Grid>
      </Grid>
      <br/>
      <br/>
      <Typography variant="h5" style={{ backgroundColor: 'lightblue', borderRadius: '10px', padding: '5px' }}>👨🏼‍💻 Repository Analysis</Typography>
      {mostUsedLanguage && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <br/>
            <Typography variant="body1">Most Frequently Used Programming Language: {mostUsedLanguage}</Typography>
            <Typography variant="body1">Average Repository Size: {averageRepoSize} KB</Typography>
            <Typography variant="body1">Total Stars: {totalStars}</Typography>
            <Typography variant="body1">Total Forks: {totalForks}</Typography>
            <Typography variant="body1">Average Stars per Repository: {averageStars.toFixed(2)}</Typography>
            <Typography variant="body1">Average Forks per Repository: {averageForks.toFixed(2)}</Typography>
            <Typography variant="body1">Repository Activity Level: {repositoryActivity}</Typography>
          </Grid>
        </Grid>
      )}

      <br/>
      <br/>
      <Typography variant="h5" style={{ backgroundColor: 'lightblue', borderRadius: '10px', padding: '5px' }}>💻 JSON Format Data</Typography>
      <br/>

                <Box
            width="100%"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          >
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom style={{ marginRight: '10px' }}>
                Original User Data:
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => downloadJSON(userDataJSON, `${username}_data.json`)}
                disabled={!userDataJSON}
                style={{ backgroundColor: 'lightblue' }}
              >
                ⬇️ Download Original User Data
              </Button>
            </Box>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
              {userDataJSON}
            </pre>
          </Box>

        
              <Box
              width="100%"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom style={{ marginRight: '10px' }}>
                  Original Repo Data:
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => downloadJSON(JSON.stringify(publicrepos, null, 2), `${username}_repos.json`)}
                  disabled={publicrepos.length === 0}
                  style={{ backgroundColor: 'lightblue' }}
                >
                  ⬇️ Download Original Repository Data
                </Button>
              </Box>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}
              >
                {publicrepos.length > 0 ? JSON.stringify(publicrepos[0], null, 2) : ''}
              </pre>
            </Box>


            <Box
              width="100%"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
            >
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom style={{ marginRight: '10px' }}>
                New User Data:
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => downloadJSON(combinedInfoJSON, `${username}_data.json`)}
                disabled={!userDataJSON}
                style={{ backgroundColor: 'lightblue' }}
              >
                ⬇️ Download New User Data
              </Button>
            </Box>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
              {combinedInfoJSON}
            </pre>
          </Box>


            
            <Box
              width="100%"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom style={{ marginRight: '10px' }}>
                  New Repo Data:
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadJSON(combinedInfoJSON2, `${username}_data.json`)}
                  disabled={!userDataJSON}
                  style={{ backgroundColor: 'lightblue' }}
                >
                  ⬇️ Download New Repo Data
                </Button>
              </Box>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}
              >
                {combinedInfoJSON2}
              </pre>
            </Box>

        

                    <Box
          width="100%"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom style={{ marginRight: '10px' }}>
              New User and Repo Data:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => downloadJSON(combinedInfoJSON3, `${username}_data.json`)}
              disabled={!userDataJSON}
              style={{ backgroundColor: 'lightblue' }}
            >
              ⬇️ Download Combined
            </Button>
          </Box>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '10px'
            }}
          >
            {combinedInfoJSON3}
          </pre>
        </Box>


      <Typography variant="h5" style={{ backgroundColor: 'lightblue', borderRadius: '10px', padding: '5px' }}>✍️ Filtered User Repository Details (first 5 repos)</Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          {publicrepos.length > 0 && (
            <RepoList publicrepos={publicrepos} />
          )}
        </Grid>
      </Grid>
    </Paper>
  </Container>
</ThemeProvider>  
  );
}  
