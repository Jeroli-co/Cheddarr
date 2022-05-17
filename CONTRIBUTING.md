
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

   - Be sure to follow both the [code](#contributing-code) and [UI text](#ui-text-style) guidelines.
   - Should you need to update your fork, you can do so by rebasing from `upstream`:
     ```bash
     git fetch upstream
     git rebase upstream/develop
     git push origin BRANCH_NAME -f
     ```
