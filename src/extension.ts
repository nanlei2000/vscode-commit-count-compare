import * as vscode from 'vscode';
import { getCount } from './core';
export function activate() {
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    9999
  );
  const folders = vscode.workspace.workspaceFolders;
  // if (!folders) {
  //   return;
  // }
  const rootPath = folders![0].uri.path;
  console.log('→: activate -> rootPath', rootPath);
  const pattern = new vscode.RelativePattern(rootPath, '**/*');
  // const watcher = vscode.workspace.createFileSystemWatcher(pattern);

  // watcher.onDidChange(() => {
  //   updateStatus();
  // });
  // vscode.workspace.onDidChangeConfiguration(() => {
  //   updateStatus();
  // });
  updateStatus();

  async function updateStatus(): Promise<void> {
    const res = await getCount(rootPath, 'master');
    console.log('→: activate -> res', res);
    // const maxCountEachType = getMaxCountFromConfig();
    // status.show();
  }
}

export function deactivate() {}
