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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "dotenv-intellisence" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "dotenv-intellisence.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from dotenv-intellisence!"
      );

      const envKeys: EnvKeys[] = [];

      // Fetch env files available in workspace
      const uris: vscode.Uri[] = await Fetcher.findAllEnvFiles();

      if (!uris || uris.length === 0) {
        console.log("No .env files found");
        vscode.window.showInformationMessage("No .env files in workspace");
        return;
      }

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

      console.log(envKeys);
      vscode.window.showInformationMessage(
        `Found a total of ${envKeys.length} keys`
      );

      const provider = (disposable: vscode.Disposable[]) => {
        languagesSupported.forEach((lang) => {
          disposable.push(registerCompletionProvider(lang, envKeys));
        });
      };

      provider(defaultDisposables);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  unregisterProviders(defaultDisposables);
}
