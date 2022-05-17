
# Contributing to Cheddarr

## Development

### Tools Required

- [Python](https://www.python.org/downloads) (3.9 or higher)
- [NodeJS](https://nodejs.org/en/download/) (14.x or higher)
- [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/downloads)

### Getting Started

1. Fork the repository to your own GitHub account and clone it to your local device:

   ```bash
   git clone https://github.com/YOUR_USERNAME/cheddarr.git
   cd cheddarr/
   ```

2. Add the remote `upstream`:

   ```bash
   git remote add upstream https://github.com/sct/cheddarr.git
   ```

3. Create a new branch:

   ```bash
   git checkout -b BRANCH_NAME develop
   ```

4. Run the development environment (backend and frontend):

   ```bash
   cheddarr.py -d run
   yarn
   yarn start
   ```

5. Create your patch and test your changes.

   - Be sure to follow both the [code](#contributing-code) guidelines.
   - Should you need to update your fork, you can do so by rebasing from `upstream`:
     ```bash
     git fetch upstream
     git rebase upstream/develop
     git push origin BRANCH_NAME -f
     ```
     
### Contributing Code

- If you are taking on an existing bug or feature, please comment on the [issue](https://github.com/Jeroli-co/Cheddarr/issues) to avoid multiple people working on the same thing.
- Always rebase your commit to the latest `develop` branch. Do **not** merge `develop` into your branch.
- You can create a "draft" pull request early to get feedback on your work.
- Your code **must** be formatted correctly ([Prettier](https://prettier.io/docs/en/install.html) for frontend and [Black](https://black.readthedocs.io/en/stable/integrations/index.html) for backend), or the tests will fail.
- If you have questions or need help, you can reach out via [Discussions](https://github.com/Jeroli-co/Cheddarr/discussions) or our [Discord server](https://discord.gg/xC3cSjwSVr).
- Only open pull requests to `develop`, never `master`! Any pull requests opened to `master` will be closed.
