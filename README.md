# Project description
This GitHub user analysis project aims to help recruiters in tech find ideal candidates with the right programming skillsets by allowing the recruiters to enter the GitHub account of the candidate in a website and obtain new insights on the candidates and their repositories that are easy to understand and available for further analysis through downloads. 

# How to run the application
1. Visit the website this application is hosted on (powered by Amazon S3):
http://githubanalysiseve.s3-website-ap-southeast-2.amazonaws.com/
(The URL will be taken down after the assignment grades are released)

2. Download the code in the 'code' folder, open the terminal and go into this folder, then run:
```
npm install (or 'npm install --legacy-peer-deps' to bypass peer dependency issues during installation)
npm start
```
This should start the application on local host!

# Note:
1. You can see the detailed data manipulation process (how I calculated the new data fields) by visiting: code/src/components/github, in the github.tsx, you will see two sections:
- 1) user information manipulation and generation of insights
- 2) user repo information manipulation and generation of insights
These two sections are where most of the calculation and manipulation are done!

2. It is possible that the graphql endpoint (graphql search function) may not work due to GitHub token expiration (which is why in my presentation, it did not work).
I updated the token again before I submit my final project assignment but just in case it does not work during grading, you can see the manipulated new user and repo data retrieved from the graphql endpoint by visiting the folder 'new_information_structure_example' and see the 'new_graphql_user_repo_combined.json'!

Enjoy! ;)