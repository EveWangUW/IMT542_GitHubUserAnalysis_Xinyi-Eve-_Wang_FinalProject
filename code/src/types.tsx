//the type information of users and repos for typescript type purposes:

//uers
//extracted only the useful fields
export type User = {
  login:string;
  html_url:string;
  name:string | null;
  company:string | null;
  location:string | null;
  bio:string | null;
  public_repos:number;
  followers:number;
  following:number;
  created_at:string;
  updated_at:string;
  email: string | null;
  hireable: boolean | null;
}

// License type
export type License = {
  key: string;
  name: string;
  node_id: string;
  spdx_id: string;
  url: string;
};

//public repos
export type PubRepo = {
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: License | null;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
};

