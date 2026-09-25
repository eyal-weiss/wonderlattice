# Concurrent work on Wonderlattice

The `main` branch in the owner's private repository should represent the last reviewed working version. Each agent creates its own branch and pull request. GitHub hosting of code is separate from publishing the site to visitors.

## Start a task

```sh
git clone https://github.com/eyal-weiss/wonderlattice.git
cd wonderlattice
git switch main
git pull --ff-only
git switch -c agent/descriptive-task-name
```

Use a fresh local checkout or a separate Git worktree for each agent. An agent should state the branch it owns before editing. Reuse an existing agent branch only when explicitly continuing the same task and coordinating with its owner.

## Finish a task

```sh
npm ci
npm run check
git add .
git commit -m "Describe the change"
git push -u origin agent/descriptive-task-name
```

Open a pull request into `main` with a short summary, a test note, and any remaining limitations. Only merge after review. If another pull request changes related files first, update your branch against `main`, resolve conflicts, test again, and then merge. No agent should force-push `main`. A unique branch prevents work from clobbering another agent's branch, but overlapping features still need review and conflict resolution.

## Future AI prompt

> Clone the private Wonderlattice repository I have granted you access to. Read README.md, AGENTS.md, docs/ARCHITECTURE.md, and docs/STATUS.md. Create a new branch named agent/[your-task], implement [TASK], run `npm run check` and any manual checks the change needs, update the status if needed, and open a pull request into main. Do not push directly to main, merge your own pull request, or publish the site. Report the branch, PR, tests, and unfinished risks.

The app works from index.html directly, so npm is optional for using it. `npm run check` runs lint, formatting, model tests, the build, and browser tests, the same checks CI runs on every pull request. Never commit credentials, node_modules, dist, or generated private data. Before inviting an external AI to the private repository, review the access it requests. The repository owner controls access and merges.
