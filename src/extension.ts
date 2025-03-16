// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { extractLines, getFileName, languagesSupported } from ".";
import EnvKeys from "./envKey";
import Fetcher from "./fetcher";
import * as Bluebird from "bluebird";
import { readFileSync } from "fs";
import { TextDocument } from "vscode";
import { EnvHoverProvider } from './providers/hoverProvider';
import { ValidationService } from './services/validationService';

function configureFileObject(uris: vscode.Uri[]) {
  return uris.map((file) => ({
    filePath: file.fsPath,
    fileName: getFileName(file.fsPath),
  }));
}

const completionTriggerChars = ["."];

function unregisterProviders(disposables: vscode.Disposable[]) {
  disposables.forEach((disposable) => disposable.dispose());
  disposables.length = 0;
}

const registerCompletionProvider = (
  languageSelector: string,
  envKeys: EnvKeys[]
) =>
  vscode.languages.registerCompletionItemProvider(
    languageSelector,
    {
      provideCompletionItems(
        document: TextDocument,
        position: vscode.Position
      ): vscode.CompletionItem[] {
        // Get the text of the current line up to the cursor
        const linePrefix = document
          .lineAt(position)
          .text.substring(0, position.character);

        // Only show completions after "process.env."
        if (!linePrefix.endsWith("process.env.")) {
          return [];
        }

        const completionItems = envKeys.map((key) => {
          const completionItem = new vscode.CompletionItem(
            key.key,
            vscode.CompletionItemKind.Variable
          );
          completionItem.insertText = key.key;
          completionItem.detail = typeof key.value;
          completionItem.documentation = key.value;
          // Prevent adding extra space after insertion
          completionItem.keepWhitespace = true;
          completionItem.command = {
            command: "editor.action.triggerSuggest",
            title: "Re-trigger completions",
          };

          return completionItem;
        });
        return completionItems;
      },
    },
    ...completionTriggerChars
  );

const defaultDisposables: vscode.Disposable[] = [];

const onActivate = async () => {
  const config = vscode.workspace.getConfiguration('dotenv-intellisense');
  const maxFiles = config.get<number>('maxFiles', 10);
  const filePatterns = config.get<string[]>('filePatterns', ['**/.env', '**/.env.*']);
  const excludedDirs = config.get<string[]>('excludedDirs', ['**/node_modules/**']);

  // Fetch env files available in workspace with new configuration
  const uris: vscode.Uri[] = await vscode.workspace.findFiles(
    `{${filePatterns.join(',')}}`,
    `{${excludedDirs.join(',')}}`,
    maxFiles
  );

  if (!uris || uris.length === 0) {
    console.log("No .env files found");
    vscode.window.showInformationMessage("No .env files in workspace");
    return;
  }

  if (vscode.workspace.getConfiguration("dotenv-intellisense").debug) {
    vscode.window.showInformationMessage(
      `Found ${uris.length} .env files in your workspace`
    );
  }
  let envKeys: EnvKeys[] = [];

  try {
    await Bluebird.map(configureFileObject(uris), async (uri) => {
      const fileContent = await readFileSync(uri.filePath, "utf-8");
      const allLines = extractLines(fileContent);
      allLines.forEach((line) => {
        const lineSplit = line.split(";#;");
        const key = lineSplit[0];
        const value = lineSplit[1];

        const envKey = new EnvKeys(key, value, uri.fileName, uri.filePath);

        envKeys.push(envKey);
      });
    });
  } catch (error) {
    console.log(error);
  }
  if (vscode.workspace.getConfiguration("dotenv-intellisense").debug) {
    vscode.window.showInformationMessage(
      `Found a total of ${Array.from(envKeys).length} keys, from ${
        uris.length
      } files`
    );
  }

  unregisterProviders(defaultDisposables);

  // Register completion provider
  const provider = (disposable: vscode.Disposable[]) => {
    languagesSupported.forEach((lang) => {
      disposable.push(registerCompletionProvider(lang, envKeys));

      // Register hover provider
      disposable.push(
        vscode.languages.registerHoverProvider(
          lang,
          new EnvHoverProvider(envKeys)
        )
      );
    });
  };

  provider(defaultDisposables);

  // Initialize validation service
  const validationService = new ValidationService(envKeys);
  defaultDisposables.push({ dispose: () => validationService.dispose() });

  // Validate all open documents
  vscode.workspace.textDocuments.forEach(doc => {
    if (languagesSupported.some(lang => doc.languageId === lang)) {
      validationService.validateDocument(doc);
    }
  });

  // Set up document change listeners
  vscode.workspace.onDidChangeTextDocument(event => {
    if (languagesSupported.some(lang => event.document.languageId === lang)) {
      validationService.validateDocument(event.document);
    }
  }, null, defaultDisposables);

  vscode.workspace.onDidOpenTextDocument(document => {
    if (languagesSupported.some(lang => document.languageId === lang)) {
      validationService.validateDocument(document);
    }
  }, null, defaultDisposables);

  vscode.workspace.onDidCloseTextDocument(document => {
    validationService.clearDiagnostics();
  }, null, defaultDisposables);
};

export async function activate(context: vscode.ExtensionContext) {
  console.log("Dotenv intellisense activate");

  onActivate();

  let disposable = vscode.commands.registerCommand(
    "dotenv-intellisense.cache",
    async () => {
      onActivate();
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  unregisterProviders(defaultDisposables);
}
