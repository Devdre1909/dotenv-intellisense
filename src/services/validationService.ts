import * as vscode from "vscode";
import { EnvKeys } from "../envKey";

export interface ValidationResult {
  severity: vscode.DiagnosticSeverity;
  message: string;
  range: vscode.Range;
  source: string;
}

export class ValidationService {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(private envKeys: EnvKeys[]) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection(
      "dotenv-intellisense"
    );
  }

  public validateDocument(document: vscode.TextDocument): void {
    const diagnostics: vscode.Diagnostic[] = [];

    // Find all process.env.* references
    const text = document.getText();
    const envVarRegex = /process\.env\.([A-Za-z0-9_]+)/g;
    let match;

    while ((match = envVarRegex.exec(text))) {
      const varName = match[1];
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);

      // Check if variable is undefined
      if (!this.envKeys.some((key) => key.key === varName)) {
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `Environment variable '${varName}' is not defined in any .env file`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }

      // Check for duplicates
      const duplicates = this.envKeys.filter((key) => key.key === varName);
      if (duplicates.length > 1) {
        const files = duplicates.map((d) => d.fileName).join(", ");
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `Environment variable '${varName}' is defined multiple times (${files})`,
            vscode.DiagnosticSeverity.Information
          )
        );
      }
    }

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  public clearDiagnostics(): void {
    this.diagnosticCollection.clear();
  }

  public dispose(): void {
    this.diagnosticCollection.dispose();
  }
}
