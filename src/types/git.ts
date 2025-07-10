export interface GitFile {
  name: string;
  status: 'untracked' | 'modified' | 'added' | 'deleted' | 'renamed';
  content?: string;
  originalName?: string; // for renamed files
}

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  files: string[];
  parent?: string;
}

export interface GitBranch {
  name: string;
  commit: string;
  upstream?: string;
}

export interface GitRemote {
  name: string;
  url: string;
  type: 'fetch' | 'push';
}

export interface GitStash {
  id: string;
  message: string;
  branch: string;
  files: GitFile[];
  timestamp: Date;
}

export interface GitTag {
  name: string;
  commit: string;
  message?: string;
  annotated: boolean;
}

export interface GitRepository {
  initialized: boolean;
  currentBranch: string;
  branches: GitBranch[];
  commits: GitCommit[];
  workingDirectory: GitFile[];
  stagingArea: GitFile[];
  remotes: GitRemote[];
  stashes: GitStash[];
  tags: GitTag[];
  config: Record<string, string>;
}