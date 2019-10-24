import child_process = require('child_process');
import util = require('util');
const exec = util.promisify(child_process.exec);

export async function getCount(
  path: string,
  branch: string
): Promise<Record<'head' | 'compared', number> | undefined> {
  try {
    const cmd = `git rev-list head --count && git rev-list ${branch} --count`;
    const { stdout } = await exec(cmd, {
      cwd: path,
    });
    if (!stdout) {
      return undefined;
    }
    const counts = stdout.split('\n').map(i => +i) as [number, number];
    return {
      head: counts[0],
      compared: counts[1],
    };
  } catch {
    return undefined;
  }
}
