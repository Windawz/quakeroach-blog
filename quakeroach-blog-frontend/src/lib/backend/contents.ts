export namespace Contents { 
  type Element = TextElement | CommandElement;

  interface TextElement {
    kind: "text";
    text: string;
  }

  interface CommandElement {
    kind: "command";
    name: string;
    args: string[];
  }

  interface ParseContentsResult {
    elements: Element[];
    failures: ParseContentsFailure[];
  }

  interface ParseContentsFailure {
    error: CommandParseError;
    index: number;
  }
  
  function parseContents(contents: string): ParseContentsResult {
    const elements: Element[] = [];
    const failures: ParseContentsFailure[] = [];
    const openBracketIndexStack: number[] = [];

    let state: "text" | "nonText" = "text";
    let buffer: string = "";

    for (let i = 0; i < contents.length; i++) {
      if (contents[i] === "<") {
        if (state === "text") {
          elements.push({
            kind: "text",
            text: buffer,
          });
          state = "nonText";
          openBracketIndexStack.push(i);
          buffer = '';
          continue;
        }
      } else if (contents[i] === ">") {
        if (state === "nonText" && openBracketIndexStack.length > 0) {
          const matchingOpenBracketIndex = openBracketIndexStack.pop()!;
          const parseResult = parseCommand(buffer);
          
          if (parseResult.kind === "error") {
            failures.push({
              error: parseResult,
              index: matchingOpenBracketIndex,
            });
          } else {
            elements.push(parseResult.element);
            state = "text";
            buffer = '';
            continue;
          }
        }
      }

      buffer += contents[i];
    }

    return {
      elements,
      failures,
    };
  }

  type CommandParseResult = CommandParseSuccess | CommandParseError;

  interface CommandParseSuccess {
    kind: "success";
    element: CommandElement;
  }

  interface CommandParseError {
    kind: "error";
    message: string;
  }

  function parseCommand(source: string): CommandParseResult {
    const openParenIndex = source.indexOf("(");
    if (openParenIndex === -1) {
      return {
        kind: "error",
        message: "Command has no opening parenthesis",
      };
    }

    const closeParenIndex = source.lastIndexOf(")");
    if (closeParenIndex === -1) {
      return {
        kind: "error",
        message: "Command has no closing parenthesis",
      };
    }

    const name = source.slice(0, openParenIndex).trim();
    if (name === "") {
      return {
        kind: "error",
        message: "Command name is empty",
      };
    }

    const argsSource = source.slice(openParenIndex, closeParenIndex).trim();

    const args = argsSource.split(",").map((x) => x.trim());
    if (args.length > 0 && !args.every((x) => x !== "")) {
      return {
        kind: "error",
        message: "Command argument list contains empty arguments",
      };
    }

    return {
      kind: "success",
      element: {
        kind: "command",
        name,
        args,
      },
    };
  }
}