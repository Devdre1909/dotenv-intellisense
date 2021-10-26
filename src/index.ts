const deleteSpacingRegex: RegExp = /\s/g;

export const extractLines = (text: string): Array<string> => {
  return text
    .toString()
    .split(/\r\n|\n/)
    .filter(
      (line) =>
        line.replace(deleteSpacingRegex, "") !== "" &&
        !line.replace(deleteSpacingRegex, "").includes("#")
    )
    .map((line) => line.replace("=", ";#;"));
};

export const getFileName = (file: string): string => {
  var forwardSlash = file.lastIndexOf("/");
  var backSlash = file.lastIndexOf("\\");
  if (forwardSlash === -1 && backSlash === -1) {
    return file;
  }
  return file.substring(
    forwardSlash > backSlash ? forwardSlash + 1 : backSlash + 1
  );
};

export const languagesSupported = [
  "javascript",
  "javascriptreact",
  "typescriptreact",
  "vue",
];
