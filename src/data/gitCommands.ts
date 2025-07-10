export interface GitCommand {
  id: string;
  command: string;
  title: string;
  description: string;
  importance: string;
  useCase: string;
  example: string;
  output: string;
  proTip: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const gitCommands: GitCommand[] = [
  {
    id: 'init',
    command: 'git init',
    title: 'Initialize Repository',
    description: 'Creates a new Git repository in the current directory',
    importance: 'This is your first step into Git! Every project starts here.',
    useCase: 'Starting a new project or adding version control to an existing project',
    example: 'git init my-project',
    output: 'Initialized empty Git repository in /path/to/my-project/.git/',
    proTip: 'Use "git init --bare" for repositories that will be cloned from',
    difficulty: 'beginner'
  },
  {
    id: 'status',
    command: 'git status',
    title: 'Check Repository Status',
    description: 'Shows the working tree status - what files are staged, unstaged, or untracked',
    importance: 'Your GPS for Git! Always know where you are in the process.',
    useCase: 'Before making commits, checking what changes are ready',
    example: 'git status',
    output: 'On branch main\nChanges not staged for commit:\n  modified: index.html',
    proTip: 'Use "git status -s" for a cleaner, short format',
    difficulty: 'beginner'
  },
  {
    id: 'add',
    command: 'git add',
    title: 'Stage Changes',
    description: 'Adds file contents to the staging area for the next commit',
    importance: 'Choose what changes to include in your next commit.',
    useCase: 'Preparing specific files or changes for commit',
    example: 'git add index.html\ngit add .\ngit add -A',
    output: '# Files are now staged for commit',
    proTip: 'Use "git add -p" to stage partial changes interactively',
    difficulty: 'beginner'
  },
  {
    id: 'commit',
    command: 'git commit',
    title: 'Save Changes',
    description: 'Records changes to the repository with a descriptive message',
    importance: 'Create snapshots of your project at meaningful points.',
    useCase: 'Saving progress, documenting changes, creating restore points',
    example: 'git commit -m "Add navigation menu"\ngit commit -am "Fix header styling"',
    output: '[main 1a2b3c4] Add navigation menu\n 1 file changed, 5 insertions(+)',
    proTip: 'Write clear commit messages - your future self will thank you!',
    difficulty: 'beginner'
  },
  {
    id: 'log',
    command: 'git log',
    title: 'View History',
    description: 'Shows the commit history for the repository',
    importance: 'See the story of your project and track changes over time.',
    useCase: 'Understanding project history, finding specific commits',
    example: 'git log\ngit log --oneline\ngit log --graph',
    output: 'commit 1a2b3c4d...\nAuthor: John Doe\nDate: Mon Dec 4 10:30:00 2023',
    proTip: 'Use "git log --oneline --graph" for a beautiful visual history',
    difficulty: 'beginner'
  },
  {
    id: 'clone',
    command: 'git clone',
    title: 'Copy Repository',
    description: 'Creates a copy of a remote repository on your local machine',
    importance: 'Get started with existing projects or contribute to open source.',
    useCase: 'Downloading projects from GitHub, contributing to open source',
    example: 'git clone https://github.com/user/repo.git\ngit clone <url> my-folder',
    output: 'Cloning into \'repo\'...\nremote: Counting objects: 100, done.',
    proTip: 'Use "git clone --depth 1" to clone only the latest commit',
    difficulty: 'beginner'
  },
  {
    id: 'remote',
    command: 'git remote',
    title: 'Manage Remotes',
    description: 'Manage set of tracked repositories (remotes)',
    importance: 'Connect your local repository to remote servers like GitHub.',
    useCase: 'Setting up connections to GitHub, GitLab, or other Git servers',
    example: 'git remote -v\ngit remote add origin <url>\ngit remote remove origin',
    output: 'origin  https://github.com/user/repo.git (fetch)\norigin  https://github.com/user/repo.git (push)',
    proTip: 'Use descriptive names for remotes: "upstream" for original, "origin" for your fork',
    difficulty: 'beginner'
  },
  {
    id: 'push',
    command: 'git push',
    title: 'Upload Changes',
    description: 'Uploads local repository content to a remote repository',
    importance: 'Share your work with the world and backup your code.',
    useCase: 'Uploading commits to GitHub, deploying to production',
    example: 'git push origin main\ngit push -u origin feature-branch',
    output: 'Enumerating objects: 5, done.\nTo https://github.com/user/repo.git\n   1a2b3c4..5d6e7f8  main -> main',
    proTip: 'Use "git push -u origin branch" to set upstream tracking',
    difficulty: 'beginner'
  },
  {
    id: 'pull',
    command: 'git pull',
    title: 'Download Changes',
    description: 'Fetches and merges changes from a remote repository',
    importance: 'Stay in sync with team members and get the latest updates.',
    useCase: 'Getting updates from teammates, syncing with remote changes',
    example: 'git pull origin main\ngit pull --rebase origin main',
    output: 'From https://github.com/user/repo\n * branch            main       -> FETCH_HEAD\nUpdating 1a2b3c4..5d6e7f8',
    proTip: 'Use "git pull --rebase" to keep a cleaner history',
    difficulty: 'beginner'
  },
  {
    id: 'branch',
    command: 'git branch / git checkout',
    title: 'Work with Branches',
    description: 'Create, list, or delete branches and switch between them',
    importance: 'Work on features without affecting main code.',
    useCase: 'Feature development, bug fixes, experimentation',
    example: 'git branch feature-login\ngit checkout feature-login\ngit checkout -b new-feature',
    output: 'Switched to branch \'feature-login\'',
    proTip: 'Use "git switch" (newer) instead of "git checkout" for cleaner syntax',
    difficulty: 'intermediate'
  },
  {
    id: 'merge',
    command: 'git merge',
    title: 'Combine Branches',
    description: 'Merges changes from one branch into another',
    importance: 'Integrate completed features into your main codebase.',
    useCase: 'Combining feature branches, integrating team work',
    example: 'git checkout main\ngit merge feature-login\ngit merge --no-ff feature-branch',
    output: 'Merge made by the \'recursive\' strategy.\n index.html | 5 +++++\n 1 file changed, 5 insertions(+)',
    proTip: 'Use "git merge --no-ff" to preserve branch history',
    difficulty: 'intermediate'
  },
  {
    id: 'stash',
    command: 'git stash',
    title: 'Temporarily Save Changes',
    description: 'Temporarily stores changes that aren\'t ready to commit',
    importance: 'Quickly switch contexts without losing work.',
    useCase: 'Switching branches with uncommitted changes, handling interruptions',
    example: 'git stash\ngit stash push -m "WIP: login form"\ngit stash pop',
    output: 'Saved working directory and index state WIP on main: 1a2b3c4 Latest commit',
    proTip: 'Use "git stash list" to see all stashes and "git stash apply" to keep stash',
    difficulty: 'intermediate'
  },
  {
    id: 'reset',
    command: 'git reset',
    title: 'Undo Changes',
    description: 'Resets current HEAD to specified state',
    importance: 'Undo commits or unstage files safely.',
    useCase: 'Undoing commits, unstaging files, fixing mistakes',
    example: 'git reset HEAD~1\ngit reset --soft HEAD~1\ngit reset --hard HEAD~1',
    output: 'HEAD is now at 1a2b3c4 Previous commit message',
    proTip: '--soft keeps changes staged, --mixed (default) unstages, --hard discards',
    difficulty: 'intermediate'
  },
  {
    id: 'revert',
    command: 'git revert',
    title: 'Safely Undo Commits',
    description: 'Creates a new commit that undoes changes from a previous commit',
    importance: 'Undo changes without rewriting history (safer for shared repos).',
    useCase: 'Fixing bugs in production, undoing changes in shared repositories',
    example: 'git revert HEAD\ngit revert 1a2b3c4\ngit revert --no-commit HEAD~3..HEAD',
    output: '[main 9f8e7d6] Revert "Add broken feature"\n 1 file changed, 5 deletions(-)',
    proTip: 'Use revert instead of reset for commits that have been pushed',
    difficulty: 'intermediate'
  },
  {
    id: 'rebase',
    command: 'git rebase',
    title: 'Reapply Commits',
    description: 'Reapplies commits on top of another base commit',
    importance: 'Keep a clean, linear history and resolve conflicts.',
    useCase: 'Cleaning up commit history, staying up-to-date with main branch',
    example: 'git rebase main\ngit rebase -i HEAD~3\ngit rebase --continue',
    output: 'First, rewinding head to replay your work on top of it...\nApplying: Your commit message',
    proTip: 'Use interactive rebase (-i) to squash, reorder, or edit commits',
    difficulty: 'advanced'
  }
];