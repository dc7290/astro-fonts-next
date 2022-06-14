# Contributing

Your contributions are most welcome!
These guidelines will be useful for Issues and PR.

## Pull Request

Fork this repository and create a branch from the latest `main` branch.

### Setup

Run `yarn` to install dependencies.

### Development

You can run the test as follows.

| common      | watch             |
| ----------- | ----------------- |
| `yarn test` | `yarn test:watch` |

### Commit

When committing, changed files are automatically linted and formatted, and commit messages are created interactively by `git-cz`.
(Attention: `git commit` will automatically run `git-cz`.)

The rules for doing so are as follows.

| type     | description                                              |
| -------- | -------------------------------------------------------- |
| feat     | A new feature                                            |
| fix      | A bug fix                                                |
| sec      | A vulnerability fix                                      |
| perf     | A code change that improves performance                  |
| refactor | A code change that neither fixes a bug or adds a feature |
| docs     | Documentation only changes                               |
| release  | Create a release commit                                  |
| style    | Markup, white-space, formatting, missing semi-colons...  |
| test     | Adding missing tests                                     |
| ci       | CI related changes                                       |
| chore    | Build process or auxiliary tool changes                  |
