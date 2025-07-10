import { GitRepository, GitFile, GitCommit, GitBranch, GitRemote, GitStash, GitTag } from '../types/git';

export class GitSimulator {
  private repo: GitRepository;
  private commandHistory: string[] = [];

  constructor() {
    this.repo = this.createEmptyRepo();
  }

  private createEmptyRepo(): GitRepository {
    return {
      initialized: false,
      currentBranch: 'main',
      branches: [],
      commits: [],
      workingDirectory: [],
      stagingArea: [],
      remotes: [],
      stashes: [],
      tags: [],
      config: {
        'user.name': 'Git User',
        'user.email': 'user@example.com'
      }
    };
  }

  private generateHash(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private findBranch(name: string): GitBranch | undefined {
    return this.repo.branches.find(b => b.name === name);
  }

  private findCommit(hash: string): GitCommit | undefined {
    return this.repo.commits.find(c => c.hash.startsWith(hash));
  }

  private getCurrentCommit(): GitCommit | undefined {
    const currentBranch = this.findBranch(this.repo.currentBranch);
    return currentBranch ? this.findCommit(currentBranch.commit) : undefined;
  }

  private addSampleFiles(): void {
    this.repo.workingDirectory = [
      { name: 'README.md', status: 'modified', content: '# My Project\n\nThis is a sample project.' },
      { name: 'index.html', status: 'modified', content: '<!DOCTYPE html>\n<html>\n<head><title>Hello</title></head>\n<body><h1>Hello World</h1></body>\n</html>' },
      { name: 'style.css', status: 'untracked', content: 'body { font-family: Arial; }' },
      { name: 'script.js', status: 'untracked', content: 'console.log("Hello World");' }
    ];
  }

  executeCommand(command: string): { output: string; error?: boolean } {
    this.commandHistory.push(command);
    const parts = command.trim().split(/\s+/);
    const gitCommand = parts[1];

    if (!command.startsWith('git ')) {
      if (command === 'clear') {
        return { output: 'CLEAR_TERMINAL' };
      }
      if (command === 'ls') {
        const files = this.repo.workingDirectory.map(f => f.name).join('  ');
        return { output: files || 'No files in directory' };
      }
      if (command === 'pwd') {
        return { output: '/user/repo' };
      }
      return { output: `Command not found: ${command}`, error: true };
    }

    if (!gitCommand) {
      return { output: 'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]\n           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]\n           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]\n           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]\n           <command> [<args>]' };
    }

    try {
      switch (gitCommand) {
        case 'init':
          return this.gitInit(parts.slice(2));
        case 'status':
          return this.gitStatus(parts.slice(2));
        case 'add':
          return this.gitAdd(parts.slice(2));
        case 'commit':
          return this.gitCommit(parts.slice(2));
        case 'log':
          return this.gitLog(parts.slice(2));
        case 'branch':
          return this.gitBranch(parts.slice(2));
        case 'checkout':
          return this.gitCheckout(parts.slice(2));
        case 'switch':
          return this.gitSwitch(parts.slice(2));
        case 'merge':
          return this.gitMerge(parts.slice(2));
        case 'remote':
          return this.gitRemote(parts.slice(2));
        case 'push':
          return this.gitPush(parts.slice(2));
        case 'pull':
          return this.gitPull(parts.slice(2));
        case 'fetch':
          return this.gitFetch(parts.slice(2));
        case 'clone':
          return this.gitClone(parts.slice(2));
        case 'stash':
          return this.gitStash(parts.slice(2));
        case 'reset':
          return this.gitReset(parts.slice(2));
        case 'revert':
          return this.gitRevert(parts.slice(2));
        case 'rebase':
          return this.gitRebase(parts.slice(2));
        case 'cherry-pick':
          return this.gitCherryPick(parts.slice(2));
        case 'tag':
          return this.gitTag(parts.slice(2));
        case 'diff':
          return this.gitDiff(parts.slice(2));
        case 'show':
          return this.gitShow(parts.slice(2));
        case 'config':
          return this.gitConfig(parts.slice(2));
        case 'bisect':
          return this.gitBisect(parts.slice(2));
        default:
          return { output: `git: '${gitCommand}' is not a git command. See 'git --help'.`, error: true };
      }
    } catch (error) {
      return { output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, error: true };
    }
  }

  private gitInit(args: string[]): { output: string; error?: boolean } {
    if (this.repo.initialized) {
      return { output: 'Reinitialized existing Git repository in /user/repo/.git/', error: true };
    }

    this.repo.initialized = true;
    this.repo.branches = [{ name: 'main', commit: '' }];
    this.addSampleFiles();

    const repoName = args[0] || 'repo';
    return { output: `Initialized empty Git repository in /user/${repoName}/.git/` };
  }

  private gitStatus(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository (or any of the parent directories): .git', error: true };
    }

    const currentBranch = this.findBranch(this.repo.currentBranch);
    const hasCommits = currentBranch && currentBranch.commit;

    let output = `On branch ${this.repo.currentBranch}\n`;

    if (!hasCommits) {
      output += '\nNo commits yet\n';
    }

    const staged = this.repo.stagingArea;
    const modified = this.repo.workingDirectory.filter(f => f.status === 'modified');
    const untracked = this.repo.workingDirectory.filter(f => f.status === 'untracked');

    if (staged.length > 0) {
      output += '\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n';
      staged.forEach(file => {
        const statusText = file.status === 'added' ? 'new file' : file.status;
        output += `\t${statusText}:   ${file.name}\n`;
      });
    }

    if (modified.length > 0) {
      output += '\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n';
      modified.forEach(file => {
        output += `\t${file.status}:   ${file.name}\n`;
      });
    }

    if (untracked.length > 0) {
      output += '\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n';
      untracked.forEach(file => {
        output += `\t${file.name}\n`;
      });
    }

    if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
      output += '\nnothing to commit, working tree clean';
    } else if (staged.length === 0) {
      output += '\nno changes added to commit (use "git add" or "git commit -a")';
    }

    return { output };
  }

  private gitAdd(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?', error: true };
    }

    const filesToAdd = args[0] === '.' ? this.repo.workingDirectory.map(f => f.name) : args;

    filesToAdd.forEach(fileName => {
      const file = this.repo.workingDirectory.find(f => f.name === fileName);
      if (file) {
        // Remove from staging area if already there
        this.repo.stagingArea = this.repo.stagingArea.filter(f => f.name !== fileName);
        // Add to staging area
        this.repo.stagingArea.push({ ...file, status: file.status === 'untracked' ? 'added' : file.status });
        // Remove from working directory if it was untracked
        if (file.status === 'untracked') {
          this.repo.workingDirectory = this.repo.workingDirectory.filter(f => f.name !== fileName);
        }
      }
    });

    return { output: '' };
  }

  private gitCommit(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (this.repo.stagingArea.length === 0) {
      return { output: 'nothing to commit, working tree clean', error: true };
    }

    const messageIndex = args.indexOf('-m');
    if (messageIndex === -1 || messageIndex === args.length - 1) {
      return { output: 'Aborting commit due to empty commit message.', error: true };
    }

    const message = args[messageIndex + 1];
    const hash = this.generateHash();
    const currentBranch = this.findBranch(this.repo.currentBranch);

    const commit: GitCommit = {
      hash,
      author: this.repo.config['user.name'],
      email: this.repo.config['user.email'],
      date: new Date(),
      message,
      files: this.repo.stagingArea.map(f => f.name),
      parent: currentBranch?.commit || undefined
    };

    this.repo.commits.push(commit);
    
    // Update branch to point to new commit
    if (currentBranch) {
      currentBranch.commit = hash;
    }

    const filesChanged = this.repo.stagingArea.length;
    this.repo.stagingArea = [];

    return { output: `[${this.repo.currentBranch} ${hash}] ${message}\n ${filesChanged} file${filesChanged !== 1 ? 's' : ''} changed` };
  }

  private gitLog(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const currentBranch = this.findBranch(this.repo.currentBranch);
    if (!currentBranch || !currentBranch.commit) {
      return { output: 'fatal: your current branch does not have any commits yet', error: true };
    }

    const isOneline = args.includes('--oneline');
    const isGraph = args.includes('--graph');

    let commits = this.getCommitHistory(currentBranch.commit);
    
    if (isOneline) {
      let output = '';
      commits.forEach(commit => {
        const prefix = isGraph ? '* ' : '';
        output += `${prefix}${commit.hash} ${commit.message}\n`;
      });
      return { output: output.trim() };
    }

    let output = '';
    commits.forEach((commit, index) => {
      if (index > 0) output += '\n';
      output += `commit ${commit.hash}${commit.hash === currentBranch.commit ? ' (HEAD -> ' + this.repo.currentBranch + ')' : ''}\n`;
      output += `Author: ${commit.author} <${commit.email}>\n`;
      output += `Date:   ${commit.date.toDateString()}\n\n`;
      output += `    ${commit.message}\n`;
    });

    return { output };
  }

  private getCommitHistory(commitHash: string): GitCommit[] {
    const commits: GitCommit[] = [];
    let currentHash: string | undefined = commitHash;

    while (currentHash) {
      const commit = this.findCommit(currentHash);
      if (!commit) break;
      commits.push(commit);
      currentHash = commit.parent;
    }

    return commits;
  }

  private gitBranch(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      // List branches
      let output = '';
      this.repo.branches.forEach(branch => {
        const prefix = branch.name === this.repo.currentBranch ? '* ' : '  ';
        output += `${prefix}${branch.name}\n`;
      });
      return { output: output.trim() };
    }

    const branchName = args[0];
    
    if (args.includes('-d') || args.includes('--delete')) {
      // Delete branch
      if (branchName === this.repo.currentBranch) {
        return { output: `error: Cannot delete branch '${branchName}' checked out at '/user/repo'`, error: true };
      }
      
      const branchIndex = this.repo.branches.findIndex(b => b.name === branchName);
      if (branchIndex === -1) {
        return { output: `error: branch '${branchName}' not found.`, error: true };
      }
      
      this.repo.branches.splice(branchIndex, 1);
      return { output: `Deleted branch ${branchName}.` };
    }

    // Create new branch
    if (this.findBranch(branchName)) {
      return { output: `fatal: A branch named '${branchName}' already exists.`, error: true };
    }

    const currentBranch = this.findBranch(this.repo.currentBranch);
    const newBranch: GitBranch = {
      name: branchName,
      commit: currentBranch?.commit || ''
    };

    this.repo.branches.push(newBranch);
    return { output: '' };
  }

  private gitCheckout(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: you must specify path(s) to restore', error: true };
    }

    if (args[0] === '-b') {
      // Create and checkout new branch
      if (args.length < 2) {
        return { output: 'error: switch `b\' requires a value', error: true };
      }
      
      const branchName = args[1];
      if (this.findBranch(branchName)) {
        return { output: `fatal: A branch named '${branchName}' already exists.`, error: true };
      }

      const currentBranch = this.findBranch(this.repo.currentBranch);
      const newBranch: GitBranch = {
        name: branchName,
        commit: currentBranch?.commit || ''
      };

      this.repo.branches.push(newBranch);
      this.repo.currentBranch = branchName;
      return { output: `Switched to a new branch '${branchName}'` };
    }

    // Switch to existing branch
    const branchName = args[0];
    const targetBranch = this.findBranch(branchName);
    
    if (!targetBranch) {
      return { output: `error: pathspec '${branchName}' did not match any file(s) known to git`, error: true };
    }

    if (branchName === this.repo.currentBranch) {
      return { output: `Already on '${branchName}'` };
    }

    this.repo.currentBranch = branchName;
    return { output: `Switched to branch '${branchName}'` };
  }

  private gitSwitch(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: missing branch or commit argument', error: true };
    }

    if (args[0] === '-c') {
      // Create and switch to new branch
      if (args.length < 2) {
        return { output: 'error: option `-c\' requires a value', error: true };
      }
      
      return this.gitCheckout(['-b', args[1]]);
    }

    return this.gitCheckout(args);
  }

  private gitMerge(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: no merge head specified', error: true };
    }

    const branchName = args[0];
    const targetBranch = this.findBranch(branchName);
    
    if (!targetBranch) {
      return { output: `merge: ${branchName} - not something we can merge`, error: true };
    }

    if (branchName === this.repo.currentBranch) {
      return { output: 'Already up to date.' };
    }

    // Simulate merge
    const currentBranch = this.findBranch(this.repo.currentBranch);
    if (!currentBranch) {
      return { output: 'error: current branch not found', error: true };
    }

    const mergeCommit: GitCommit = {
      hash: this.generateHash(),
      author: this.repo.config['user.name'],
      email: this.repo.config['user.email'],
      date: new Date(),
      message: `Merge branch '${branchName}'`,
      files: [],
      parent: currentBranch.commit
    };

    this.repo.commits.push(mergeCommit);
    currentBranch.commit = mergeCommit.hash;

    return { output: `Merge made by the 'recursive' strategy.` };
  }

  private gitRemote(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: this.repo.remotes.filter(r => r.type === 'fetch').map(r => r.name).join('\n') };
    }

    if (args[0] === '-v') {
      let output = '';
      const remoteNames = [...new Set(this.repo.remotes.map(r => r.name))];
      remoteNames.forEach(name => {
        const fetchRemote = this.repo.remotes.find(r => r.name === name && r.type === 'fetch');
        const pushRemote = this.repo.remotes.find(r => r.name === name && r.type === 'push');
        if (fetchRemote) output += `${name}\t${fetchRemote.url} (fetch)\n`;
        if (pushRemote) output += `${name}\t${pushRemote.url} (push)\n`;
      });
      return { output: output.trim() };
    }

    if (args[0] === 'add') {
      if (args.length < 3) {
        return { output: 'error: usage: git remote add <name> <url>', error: true };
      }
      
      const [, name, url] = args;
      this.repo.remotes.push(
        { name, url, type: 'fetch' },
        { name, url, type: 'push' }
      );
      return { output: '' };
    }

    if (args[0] === 'remove' || args[0] === 'rm') {
      if (args.length < 2) {
        return { output: 'error: usage: git remote remove <name>', error: true };
      }
      
      const name = args[1];
      this.repo.remotes = this.repo.remotes.filter(r => r.name !== name);
      return { output: '' };
    }

    return { output: `error: Unknown subcommand: ${args[0]}`, error: true };
  }

  private gitPush(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const remoteName = args[0] || 'origin';
    const branchName = args[1] || this.repo.currentBranch;

    const remote = this.repo.remotes.find(r => r.name === remoteName && r.type === 'push');
    if (!remote) {
      return { output: `fatal: '${remoteName}' does not appear to be a git repository`, error: true };
    }

    const branch = this.findBranch(branchName);
    if (!branch || !branch.commit) {
      return { output: `error: src refspec ${branchName} does not match any`, error: true };
    }

    // Set upstream if -u flag is present
    if (args.includes('-u')) {
      branch.upstream = `${remoteName}/${branchName}`;
    }

    return { output: `To ${remote.url}\n   ${branch.commit.substring(0, 7)}..${this.generateHash().substring(0, 7)}  ${branchName} -> ${branchName}` };
  }

  private gitPull(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const remoteName = args[0] || 'origin';
    const branchName = args[1] || this.repo.currentBranch;

    const remote = this.repo.remotes.find(r => r.name === remoteName && r.type === 'fetch');
    if (!remote) {
      return { output: `fatal: '${remoteName}' does not appear to be a git repository`, error: true };
    }

    return { output: `From ${remote.url}\n * branch            ${branchName}     -> FETCH_HEAD\nAlready up to date.` };
  }

  private gitFetch(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const remoteName = args[0] || 'origin';
    const remote = this.repo.remotes.find(r => r.name === remoteName && r.type === 'fetch');
    
    if (!remote) {
      return { output: `fatal: '${remoteName}' does not appear to be a git repository`, error: true };
    }

    return { output: `From ${remote.url}\n * [new branch]      main       -> ${remoteName}/main` };
  }

  private gitClone(args: string[]): { output: string; error?: boolean } {
    if (args.length === 0) {
      return { output: 'fatal: You must specify a repository to clone.', error: true };
    }

    const url = args[0];
    const repoName = args[1] || url.split('/').pop()?.replace('.git', '') || 'repository';

    // Reset and initialize new repo
    this.repo = this.createEmptyRepo();
    this.repo.initialized = true;
    this.repo.branches = [{ name: 'main', commit: this.generateHash() }];
    this.repo.remotes = [
      { name: 'origin', url, type: 'fetch' },
      { name: 'origin', url, type: 'push' }
    ];

    // Add initial commit
    const initialCommit: GitCommit = {
      hash: this.repo.branches[0].commit,
      author: 'Repository Owner',
      email: 'owner@example.com',
      date: new Date(),
      message: 'Initial commit',
      files: ['README.md']
    };
    this.repo.commits.push(initialCommit);

    return { output: `Cloning into '${repoName}'...\nremote: Enumerating objects: 3, done.\nremote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 3\nReceiving objects: 100% (3/3), done.` };
  }

  private gitStash(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0 || args[0] === 'push') {
      // Stash changes
      const filesToStash = [...this.repo.workingDirectory, ...this.repo.stagingArea];
      if (filesToStash.length === 0) {
        return { output: 'No local changes to save' };
      }

      const message = args.includes('-m') ? args[args.indexOf('-m') + 1] : `WIP on ${this.repo.currentBranch}`;
      const stash: GitStash = {
        id: `stash@{${this.repo.stashes.length}}`,
        message,
        branch: this.repo.currentBranch,
        files: filesToStash,
        timestamp: new Date()
      };

      this.repo.stashes.unshift(stash);
      this.repo.workingDirectory = [];
      this.repo.stagingArea = [];

      return { output: `Saved working directory and index state ${stash.id}: ${message}` };
    }

    if (args[0] === 'list') {
      if (this.repo.stashes.length === 0) {
        return { output: '' };
      }
      
      let output = '';
      this.repo.stashes.forEach(stash => {
        output += `${stash.id}: ${stash.message}\n`;
      });
      return { output: output.trim() };
    }

    if (args[0] === 'pop') {
      if (this.repo.stashes.length === 0) {
        return { output: 'No stash entries found.', error: true };
      }

      const stash = this.repo.stashes.shift()!;
      this.repo.workingDirectory.push(...stash.files.filter(f => f.status !== 'added'));
      this.repo.stagingArea.push(...stash.files.filter(f => f.status === 'added'));

      return { output: `On branch ${this.repo.currentBranch}\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\nDropped ${stash.id} (${stash.message})` };
    }

    if (args[0] === 'drop') {
      if (this.repo.stashes.length === 0) {
        return { output: 'No stash entries found.', error: true };
      }

      const stash = this.repo.stashes.shift()!;
      return { output: `Dropped ${stash.id} (${stash.message})` };
    }

    return { output: `error: unknown subcommand: ${args[0]}`, error: true };
  }

  private gitReset(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const isHard = args.includes('--hard');
    const isSoft = args.includes('--soft');
    const target = args.find(arg => !arg.startsWith('--')) || 'HEAD';

    if (target === 'HEAD' && this.repo.stagingArea.length > 0) {
      // Unstage files
      this.repo.workingDirectory.push(...this.repo.stagingArea);
      this.repo.stagingArea = [];
      return { output: '' };
    }

    if (target.includes('HEAD~')) {
      const steps = parseInt(target.split('~')[1]) || 1;
      const currentBranch = this.findBranch(this.repo.currentBranch);
      
      if (!currentBranch || !currentBranch.commit) {
        return { output: 'fatal: ambiguous argument \'HEAD~1\': unknown revision', error: true };
      }

      let targetCommit = this.findCommit(currentBranch.commit);
      for (let i = 0; i < steps && targetCommit?.parent; i++) {
        targetCommit = this.findCommit(targetCommit.parent);
      }

      if (!targetCommit) {
        return { output: `fatal: ambiguous argument '${target}': unknown revision`, error: true };
      }

      currentBranch.commit = targetCommit.hash;

      if (isHard) {
        this.repo.workingDirectory = [];
        this.repo.stagingArea = [];
      } else if (!isSoft) {
        this.repo.stagingArea = [];
      }

      return { output: `HEAD is now at ${targetCommit.hash.substring(0, 7)} ${targetCommit.message}` };
    }

    return { output: `fatal: ambiguous argument '${target}': unknown revision`, error: true };
  }

  private gitRevert(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: no commit specified', error: true };
    }

    const commitRef = args[0];
    let targetCommit: GitCommit | undefined;

    if (commitRef === 'HEAD') {
      const currentBranch = this.findBranch(this.repo.currentBranch);
      targetCommit = currentBranch ? this.findCommit(currentBranch.commit) : undefined;
    } else {
      targetCommit = this.findCommit(commitRef);
    }

    if (!targetCommit) {
      return { output: `fatal: bad revision '${commitRef}'`, error: true };
    }

    const revertCommit: GitCommit = {
      hash: this.generateHash(),
      author: this.repo.config['user.name'],
      email: this.repo.config['user.email'],
      date: new Date(),
      message: `Revert "${targetCommit.message}"\n\nThis reverts commit ${targetCommit.hash}.`,
      files: targetCommit.files,
      parent: this.findBranch(this.repo.currentBranch)?.commit
    };

    this.repo.commits.push(revertCommit);
    const currentBranch = this.findBranch(this.repo.currentBranch);
    if (currentBranch) {
      currentBranch.commit = revertCommit.hash;
    }

    return { output: `[${this.repo.currentBranch} ${revertCommit.hash.substring(0, 7)}] Revert "${targetCommit.message}"` };
  }

  private gitRebase(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: no branch specified', error: true };
    }

    const targetBranch = args[0];
    const branch = this.findBranch(targetBranch);

    if (!branch) {
      return { output: `fatal: invalid upstream '${targetBranch}'`, error: true };
    }

    if (args.includes('-i')) {
      return { output: 'Successfully rebased and updated refs/heads/' + this.repo.currentBranch + '.' };
    }

    return { output: `First, rewinding head to replay your work on top of it...\nApplying: your commits\nSuccessfully rebased and updated refs/heads/${this.repo.currentBranch}.` };
  }

  private gitCherryPick(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: no commit specified', error: true };
    }

    const commitRef = args[0];
    const targetCommit = this.findCommit(commitRef);

    if (!targetCommit) {
      return { output: `fatal: bad revision '${commitRef}'`, error: true };
    }

    const cherryPickCommit: GitCommit = {
      hash: this.generateHash(),
      author: this.repo.config['user.name'],
      email: this.repo.config['user.email'],
      date: new Date(),
      message: targetCommit.message,
      files: targetCommit.files,
      parent: this.findBranch(this.repo.currentBranch)?.commit
    };

    this.repo.commits.push(cherryPickCommit);
    const currentBranch = this.findBranch(this.repo.currentBranch);
    if (currentBranch) {
      currentBranch.commit = cherryPickCommit.hash;
    }

    return { output: `[${this.repo.currentBranch} ${cherryPickCommit.hash.substring(0, 7)}] ${targetCommit.message}` };
  }

  private gitTag(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      // List tags
      return { output: this.repo.tags.map(t => t.name).sort().join('\n') };
    }

    const tagName = args[0];
    const currentBranch = this.findBranch(this.repo.currentBranch);
    
    if (!currentBranch || !currentBranch.commit) {
      return { output: 'fatal: Failed to resolve \'HEAD\' as a valid ref.', error: true };
    }

    if (args.includes('-d')) {
      // Delete tag
      const tagIndex = this.repo.tags.findIndex(t => t.name === tagName);
      if (tagIndex === -1) {
        return { output: `error: tag '${tagName}' not found.`, error: true };
      }
      
      this.repo.tags.splice(tagIndex, 1);
      return { output: `Deleted tag '${tagName}'` };
    }

    // Create tag
    if (this.repo.tags.find(t => t.name === tagName)) {
      return { output: `fatal: tag '${tagName}' already exists`, error: true };
    }

    const isAnnotated = args.includes('-a') || args.includes('-m');
    const messageIndex = args.indexOf('-m');
    const message = messageIndex !== -1 ? args[messageIndex + 1] : undefined;

    const tag: GitTag = {
      name: tagName,
      commit: currentBranch.commit,
      message,
      annotated: isAnnotated
    };

    this.repo.tags.push(tag);
    return { output: '' };
  }

  private gitDiff(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.includes('--staged') || args.includes('--cached')) {
      if (this.repo.stagingArea.length === 0) {
        return { output: '' };
      }
      return { output: 'diff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n line 1\n line 2\n+new line\n line 3' };
    }

    if (this.repo.workingDirectory.length === 0) {
      return { output: '' };
    }

    return { output: 'diff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n line 1\n line 2\n+modified line\n line 3' };
  }

  private gitShow(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    const commitRef = args[0] || 'HEAD';
    let targetCommit: GitCommit | undefined;

    if (commitRef === 'HEAD') {
      const currentBranch = this.findBranch(this.repo.currentBranch);
      targetCommit = currentBranch ? this.findCommit(currentBranch.commit) : undefined;
    } else {
      targetCommit = this.findCommit(commitRef);
    }

    if (!targetCommit) {
      return { output: `fatal: bad revision '${commitRef}'`, error: true };
    }

    return { output: `commit ${targetCommit.hash}\nAuthor: ${targetCommit.author} <${targetCommit.email}>\nDate:   ${targetCommit.date.toDateString()}\n\n    ${targetCommit.message}\n\ndiff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n line 1\n+new line\n line 2` };
  }

  private gitConfig(args: string[]): { output: string; error?: boolean } {
    if (args.length === 0) {
      return { output: 'error: no configuration specified', error: true };
    }

    if (args[0] === '--list' || args[0] === '-l') {
      let output = '';
      Object.entries(this.repo.config).forEach(([key, value]) => {
        output += `${key}=${value}\n`;
      });
      return { output: output.trim() };
    }

    if (args.length === 1) {
      // Get config value
      const key = args[0];
      const value = this.repo.config[key];
      return { output: value || '' };
    }

    if (args.length === 2) {
      // Set config value
      const [key, value] = args;
      this.repo.config[key] = value;
      return { output: '' };
    }

    return { output: 'error: invalid configuration', error: true };
  }

  private gitBisect(args: string[]): { output: string; error?: boolean } {
    if (!this.repo.initialized) {
      return { output: 'fatal: not a git repository', error: true };
    }

    if (args.length === 0) {
      return { output: 'error: no subcommand specified', error: true };
    }

    const subcommand = args[0];

    switch (subcommand) {
      case 'start':
        return { output: 'status: waiting for both good and bad commits' };
      case 'bad':
        return { output: 'Bisecting: 5 revisions left to test after this (roughly 3 steps)' };
      case 'good':
        return { output: 'Bisecting: 2 revisions left to test after this (roughly 1 step)' };
      case 'reset':
        return { output: 'Previous HEAD position was 1234567... commit message' };
      default:
        return { output: `error: unknown subcommand: ${subcommand}`, error: true };
    }
  }

  getRepository(): GitRepository {
    return { ...this.repo };
  }
}