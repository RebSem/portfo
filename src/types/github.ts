export interface GithubProfileResponse {
  login: string;
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  profileUrl: string;
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
