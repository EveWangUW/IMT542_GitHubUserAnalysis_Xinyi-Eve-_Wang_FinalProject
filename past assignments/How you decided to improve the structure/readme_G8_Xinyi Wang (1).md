# About: 
## 3-5 sentences of describing the use, audience and access of your information
My project is a github profile analysis app. 
In terms of use, it can fulfill two functions:
One is that this app will retrieve lists of github account information and their analysis based on lists provided by the customer company.
The other is that the company can enter the github username and get their user profile data from github as per their needs.
This data will be manupulated to be more portable and presented to the client in a data visualization. Both raw data and manipulated data will be made available for download.
The audience is companies that want to harvest candidates who are very good at a certain programming language or domain, reducing their third-party costs of going to a headhunter.
The access of my information is through the REST API technology provided by github. I will make api calls to their endpoints to retrieve the relevant information.

# Methodology: 
## 5-10 sentences or bullets describing how you generated the information structure and maintain it
First I would make api calls to get a gihub username list with users who are very popular on github. Then I will use their username to make get request to the github api endpoints to get information on the user, retrieve the data that is in json format, and then analyze and manupulate the information, then display it on the webpage through visualizations. The same api call is made if the user enters one single user name to get that specific user's profile analysis

I will store and maintain both the raw and manupulated json data from the api call in a json file on the google drive, and provide a download link on the website for users to download.

Ideally, I will also add a dynamodb database or s3 bucket to store the information I retrieved from each user, so that this information can be made available to companies to download and access. 

# Access: 
## 5-10 sentences or bullets describing the steps a user takes to access the information
Without my profile analysis app to directly generate the user analysis report, a company trying to find a candidate would have to manually open the user's github, and face a huge amount of confusing information to retrieve and analyze, which is very time-consuming and exhausting!

With my app, a user can easily access information in two ways. The first way is to directly download the analysis reports of the best accounts in github, including downloading the raw or already manipulated and analyzed data in json format. The other way is to enter the username of the ideal candidate to get an analysis of their profile with data visualization, with choices of downloading the raw and manupulated json data supporting the data visualization as well. 

A company that wants to reference current employee performance to set a reasonable bar for external hires can ask employees to provide their github api key, which can be entered in my app and allow the company to see the visualized analysis of the employee's private and public repo, and have access to downloads of the raw and manipulated json data supporting the above analysis through a json file link on google drive. 

# Structure: 
## Description of the main fields, types, properties of information schema
This is an example of the main information schema:
{
    "login": "EveWangUW",
    "html_url": "https://github.com/EveWangUW",
    "name": "EveWang",
    "company": null,
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "public_repos": 24,
    "private_repos": 10, 
    "followers": 0,
    "following": 0,
    "created_at": "2023-08-16T07:12:54Z",
    "updated_at": "2024-05-03T01:02:37Z",
    "time_on_github":"9 months", 
    "most_popular_repo":"ActiveRecall-StudyBestFriend",
    "most_frequently_used_lanaguage":"Java",
    "programming_skill_level":100,
    "contribution_timeline":" ",
    "active_level":"", 
    "other_user_analysis_metrics":" ",
    "other_repo_analysis_metrics":" ",
    "other_user_data_visualizations":" ",
    "other_repo_data_visualizations":" "
}
Based on this, the main fields, types, properties of information schema are as follows:
1. User information
login:
    Type: string
    Properties: User's GitHub login/username
html_url:
    Type: string
    Properties: URL to the user's GitHub profile
name:
    Type: string
    Properties: User's name                                 
company:
    Type: string
    Properties: Company where the user works
location:
    Type: string
    Properties: User's location
email:
    Type: string
    Properties: User's email
hireable:
    Type: boolean
    Properties: User's hireable status
bio:
    Type: string
    Properties: User's biography
public_repos:
    Type: integer
    Properties: Number of public repositories
private_repos:
    Type: integer
    Properties: Number of private repositories
followers:
    Type: integer
    Properties: Number of followers
following:
    Type: integer
    Properties: Number of users the user is following
created_at:
    Type: string (datetime)
    Properties: Account creation date
updated_at:
    Type: string (datetime)
    Properties: Last profile update date
time_on_github:
    Type: string
    Properties: Time since account creation

2. Repository and language Information
most_popular_repo:
    Type: string
    Properties: Name of the most popular repository
most_frequently_used_language:
    Type: string
    Properties: Most frequently used programming language

3. User analysis metrics
programming_skill_level:
    Type: integer
    Properties: User's programming skill level
contribution_timeline:
    Type: string
    Properties: User's contribution timeline
active_level:
    Type: string
    Properties: User's activity level
other_user_analysis_metrics:
    Type: string
    Properties: Additional user analysis metrics

4. Repository analysis metrics
other_repo_analysis_metrics:
    Type: string
    Properties: Additional repository analysis metrics
other_repo_data_visualizations:
    Type: string
    Properties: Additional repository data visualizations

# Example: 
## Show example request and response for at least one intended use of information that demonstrates access and structure
Request:
1. information about the user
- client: typescript:
  const fetchUserData = async () => {
    try{
      const responseUser=await fetch (`https://api.github.com/users/${username}`);
      const dataUser=await responseUser.json();
      setUser(dataUser);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  };
- server: java with springboot:
1/controller:
@GetMapping("/{username}")
    public String getUser(@PathVariable String username){
        return gitHubApiService.getUser(username);
    }
2/service:
@Service
    public String getUser (String username){
        String userUrl = "https://api.github.com/users/" + username;
        return restTemplate.getForObject(userUrl, String.class);
        //what is the responseType?
    }

2. the public repos of a user
- client:typescript:
  const fetchPublicRepoData = async () => {
    try {
      const responsePublic = await fetch(`https://api.github.com/users/${username}/repos`);
      const dataPublic = await responsePublic.json();
      setPublicrepos(dataPublic);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
- server: java with springboot:
1/controller:
@GetMapping("/{username}/repos")
    public String getUserRepos(@PathVariable String username) {
        return gitHubApiService.getUserRepos(username);
    }
2/service:
@Service:
public String getUserRepos(String username) {
        String repoUrl = "https://api.github.com/users/" + username + "/repos";
        return restTemplate.getForObject(repoUrl, String.class);
        //return this to the controller
    }

Response:

I combined the response from the getuser and getuserrepos request above, added some manuplated data and calculated field to generate the sample response below:

{
    "login": "EveWangUW",
    "html_url": "https://github.com/EveWangUW",
    "name": "EveWang",
    "company": null,
    "location": null,
    "email": null,
    "hireable": null,
    "bio": null,
    "public_repos": 24,
    "private_repos": 10, 
    "followers": 0,
    "following": 0,
    "created_at": "2023-08-16T07:12:54Z",
    "updated_at": "2024-05-03T01:02:37Z",
    "time_on_github":"9 months", 
    "most_popular_repo":"ActiveRecall-StudyBestFriend",
    "most_frequently_used_lanaguage":"Java",
    "programming_skill_level":100, 
    "contribution_timeline":" ",
    "active_level":"", 
    "other_user_analysis_metrics":" ",
    "other_repo_analysis_metrics":" ",
    "other_user_data_visualizations":" ",
    "other_repo_data_visualizations":" "
}

PS: 
1. "programming_skill_level" can be calculated based on: number of followers * number of stargazes * number of forks of the user. It has the type integer. 
2. "private_repos" can only be accessed with API key of the github user
3. "time_on_github":"9 months" is calculated based on "created_at" and "updated_at"
4. "most_popular_repo" can be calculated based on comparing the "stargazers_count" and "watchers_count" in all repositories
5. "most_frequently_used_lanaguage":"Java" can be calculated based on the count of "language" in each repository. 
6. "contribution_timeline" can be shown as a line chart, with time on the x axis and activities and quantified results from repositories on the y axis. 
7. "active_level" can be calcualted based on the update frequency of the user's repositories