import { Position, SnippetString, window } from "vscode";

export async function addServerpodModel() {
    const editor = window.activeTextEditor;
    if (editor) {
        const snippet = new SnippetString(serverpodModelSnippet());
        await editor.insertSnippet(snippet);
    }
}

function serverpodModelSnippet(): string {
    return `class: \${1:Category}
table: \${1/(.*)/\${1:/downcase}/}
fields:
  id: UuidValue?, defaultPersist=random_v7
  isDeleted: bool, default=false
  lastModified: DateTime?
  userId: int
  \${2:title}: \${3:String}
`
        ;
}