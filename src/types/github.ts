export interface GithubProfileResponse {
  login: string;
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  profileUrl: string;
  updatedAt?: string;
}

export interface GithubRepoResponse {
  name: string;
  fullName: string;
  description: string;
  repoUrl: string;
  homepageUrl: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  updatedAt: string;
  pushedAt: string;
  visibility: 'public' | 'private';
  topics: string[];
}

export interface ContributionDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

export interface GithubContributionsResponse {
  totalLastYear: number;
  days: ContributionDay[];
}
