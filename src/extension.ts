import * as vscode from 'vscode';
import { getCount } from './core';
export function activate() {
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    9999
  );
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) {
    return;
  }
  const rootPath = folders[0].uri.path;
  const pattern = new vscode.RelativePattern(rootPath, '.git/logs/HEAD');
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);
  /**
   *  "commitCountCompare.comparedBranch": {
            "type": "string",
            "default": "dev",
            "description": "Branch which `head` compared to"
          }
   */
  function getComparedBranch(): string {
    let config = vscode.workspace.getConfiguration('commitCountCompare');
    const maxCountEachType = config.get<string>('comparedBranch');
    return maxCountEachType || 'master';
  }
  watcher.onDidChange(() => {
    updateStatus();
  });
  vscode.workspace.onDidChangeConfiguration(() => {
    updateStatus();
  });
  updateStatus();

  async function updateStatus(): Promise<void> {
    const branch = getComparedBranch();
    const res = await getCount(rootPath, branch);
    if (!res) {
      status.hide();
    } else {
      const diff = res.head - res.compared;
      status.text = `${Math.abs(diff)}${
        diff > 0 ? '+' : diff === 0 ? '' : '-'
      } (${branch})`;
      status.show();
    }
  }
}

export function deactivate() {}
