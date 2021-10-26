import * as vscode from "vscode";

class Fetcher {
  public static async findAllEnvFiles(): Promise<vscode.Uri[]> {
    if (!vscode.workspace.name) {
      return [];
    }
    return await vscode.workspace.findFiles(
      "**/*.env",
      "**/node_modules/**",
      10
    );
  }
}

export default Fetcher;
