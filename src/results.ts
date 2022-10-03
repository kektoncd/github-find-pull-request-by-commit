import { PullRequest } from "./cli.ts";
import { log } from "./dep.ts";

interface ResultDestination {
  id: string;
  number: string;
  state: string;
}

export async function output(pr: PullRequest, des: ResultDestination) {
  return await Promise.all([
    (async () => {
      if (des.id) {
        log.info(`Output pull request id ${pr.id}`);
        await Deno.writeTextFile(des.id, pr.id.toString());
      }
    })(),
    (async () => {
      if (des.number) {
        log.info(`Output pull request number ${pr.number}`);
        await Deno.writeTextFile(des.number, pr.number.toString());
      }
    })(),
    (async () => {
      if (des.state) {
        log.info(`Output pull request state ${pr.state}`);
        await Deno.writeTextFile(des.state, pr.state.toString());
      }
    })(),
  ]);
}
