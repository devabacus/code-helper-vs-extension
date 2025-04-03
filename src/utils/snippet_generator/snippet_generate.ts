import { Position, SnippetString, window } from 'vscode';



export function preSnippetGenerate() {
  const editor = window.activeTextEditor;
  if (editor) {
    const document = editor?.document;
    const selection = editor?.selection;
    const codeBlock = document.getText(selection);
    const newline = selection.end.line + 2;

    editor.edit(async (builder) => {
      builder.insert(new Position(newline, 0), textChanger(codeBlock));
      console.log(codeBlock);
    });
  }
}

export function snippetGenerate() {
  const editor = window.activeTextEditor;
  if (editor) {
    const document = editor?.document;
    const selection = editor?.selection;
    const codeBlock = document.getText(selection);
    const newline = selection.end.line + 2;


    const wrappedSnippet = wrapSnippet(textChanger(codeBlock));
    editor.insertSnippet(new SnippetString(wrappedSnippet), new Position(newline, 0));
  }
}

export function snippetHandle() {

}

function wrapSnippet(snippetBody: string): string {
  return (
    '"${1:snippet name}": {' +
    
    '\n\t"scope": "${TM_FILENAME/.+\\.((py)|(php)|(go)|(js)|(dart)|(cs)|(cpp)|(java)|(ts)|(ps1)|(sh)|(ahk)|(md))$/${2:+python}${3:+php}${4:+go}${5:+javascript,javascriptreact}${6:+dart}${7:+csharp}${8:+cpp}${9:+java}${10:+typescript}${11:+powershell}${12:+shellscript}${13:+ahk}${14:+markdown}/}",' +


    '\n\t"prefix": "${2}",' +
    '\n\t"body": [' +
    '\n' + snippetBody +
    '\t],' +
    '\n\t"description": "${4:${1}}"' +
    '\n},\n'
  );
}


function textChanger(codeText: string): string {
  let changedText = '';
  const textRows = codeText.split('\n'); //Делим - создаем список строк по \n

  for (let row = 0; row < textRows.length; row++) {
    let rowText = escapeChars(textRows[row]);
    
    rowText = addTabs(rowText);

    // 🛠 Если строка пустая, добавляем её в сниппет как просто `""`
    if (rowText.trim() === '') {
      changedText += '"",\n';
    } else {
      changedText += '"' + rowText + '",\n';
    }
  }

  return changedText;
}

function addTabs(codeRow: string): string {
  let spacesCount = codeRow.search(/\S|$/); // Количество пробелов перед текстом
  if (spacesCount === -1) { return ''; } // Если строка пустая, вернуть ""

  let tabsCount = Math.floor(spacesCount / 2); // 2 пробела = 1 \t
  if (tabsCount === 2 || tabsCount === 4) {tabsCount = tabsCount / 2;}; //хз но пока так
  let tabs = '\\t'.repeat(tabsCount); // Генерируем \t

  return tabs + codeRow.trim(); // Добавляем отступы и убираем лишние пробелы справа
}


function escapeChars(codeRow: string): string {
  return codeRow.replace(/"/g, '\\"');
}