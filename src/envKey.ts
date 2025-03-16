"use strict";

import * as vscode from "vscode";

export class EnvKeys {
  public constructor(
    public key: string,
    public value: string,
    public fileName: string,
    public location?: string
  ) {}
}

export default EnvKeys;
