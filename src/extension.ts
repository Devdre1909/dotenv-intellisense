// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { extractLines, getFileName, languagesSupported } from ".";
import EnvKeys from "./envKey";
import Fetcher from "./fetcher";
import * as Bluebird from "bluebird";
import { readFileSync } from "fs";
import { TextDocument } from "vscode";

function configureFileObject(uris: vscode.Uri[]) {
  return uris.map((file) => ({
    filePath: file.fsPath,
    fileName: getFileName(file.fsPath),
  }));
}

const completionTriggerChars = [" ", ".", "env."];

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
        const completionItems = envKeys.map((key) => {
          const completionItem = new vscode.CompletionItem(
            key.key,
            vscode.CompletionItemKind.Variable
          );
          completionItem.insertText = key.key;
          completionItem.detail = typeof key.value;
          completionItem.documentation = key.value;

          return completionItem;
        });
        return completionItems;
      },
    },
    ...completionTriggerChars
  );

const defaultDisposables: vscode.Disposable[] = [];

const onActivate = async () => {
  // Fetch env files available in workspace
  const uris: vscode.Uri[] = await Fetcher.findAllEnvFiles();

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

  const provider = (disposable: vscode.Disposable[]) => {
    languagesSupported.forEach((lang) => {
      disposable.push(registerCompletionProvider(lang, envKeys));
    });
  };

  provider(defaultDisposables);
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
