import yargs from "./dep.ts";
import { Octokit } from "./dep.ts";
import { log } from "./dep.ts";
import { output } from "./results.ts";

const baseUrl = "https://api.github.com";
export type state = "closed" | "open";

interface Arguments {
  base: string;
  baseUrl: string;
  owner: string;
  repo: string;
  sha: string;
  token: string;

  // Tekton results
  resultPullRequestId: string;
  resultPullRequestNumber: string;
  resultPullRequestState: string;
}

export interface PullRequest {
  base: Base;
  body: string;
  id: number;
  number: number;
  title: string;
  state: state;
  url: string;
}

interface Base {
  ref: string;
}

async function run({
  base,
  baseUrl,
  repo,
  owner,
  sha,
  token: auth,
  resultPullRequestId,
  resultPullRequestNumber,
  resultPullRequestState,
}: Arguments) {
  const octokit = new Octokit({
    auth,
    baseUrl,
  });

  const prs = (
    await octokit.request(`GET /repos/${owner}/${repo}/commits/${sha}/pulls`, {
      owner,
      repo,
      commit_sha: sha,
    })
  ).data as PullRequest[];

  if (!prs.length) {
    throw new Error(`Pull request for commit ${sha} not found`);
  }

  log.info("Found pull requests for commit", prs.length);

  const pr = prs.find((pr) => {
    if (pr.base) {
      return pr.base.ref === base;
    }
  });

  if (!pr) throw new Error(`Pull request for commit ${sha} not found`);

  await output(pr, {
    id: resultPullRequestId,
    number: resultPullRequestNumber,
    state: resultPullRequestState,
  });
}

export default yargs(Deno.args)
  .scriptName("github-find-pull-request-by-commit")
  .command(
    "$0",
    "Find pull request by commit",
    () => {},
    async (argv: Arguments) => {
      await run(argv);
    }
  )
  .option("base", {
    type: "string",
    description: "Base reference to query",
    default: "main",
  })
  .option("baseUrl", {
    type: "string",
    description: "URL of the GitHub API",
    default: baseUrl,
  })
  .option("owner", {
    type: "string",
    description: "Owner (user or organization name) of the repository.",
  })
  .option("repo", {
    type: "string",
    description: "Name of the repository.",
  })
  .option("resultPullRequestId", {
    type: "string",
    description: "Id of the pull request.",
  })
  .option("resultPullRequestNumber", {
    type: "string",
    description: "Number of the pull request.",
  })
  .option("resultPullRequestState", {
    type: "string",
    description: "State of the pull request.",
  })
  .option("repo", {
    type: "string",
    description: "Name of the repository.",
  })
  .require("sha", {
    type: "string",
    description: "SHA of the commit.",
  })
  .option("token", {
    type: "string",
    description: "GitHub access token",
    default: Deno.env.get("GITHUB_TOKEN"),
  })
  .strictCommands()
  .demandCommand(1)
  .parse();
