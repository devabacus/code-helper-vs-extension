import { Position, SnippetString, window } from "vscode";

export async function addServerpodModel() {
    const editor = window.activeTextEditor;
    if (editor) {
        const snippet = new SnippetString(serverpodModelSnippet());
        await editor.insertSnippet(snippet);
    }
}

export async function addServerpodMapModel() {
    const editor = window.activeTextEditor;
    if (editor) {
        const snippet = new SnippetString(serverpodMapModelSnippet());
        await editor.insertSnippet(snippet);
    }
}

function serverpodModelSnippet(): string {
    return `class: \${1:Category}
table: \${1/(.*)/\${1:/downcase}/}
fields:
  id: UuidValue?, defaultPersist=random_v7
  userId: int
  customerId: UuidValue, relation(parent=customer, onDelete=Cascade)
  createdAt: DateTime
  lastModified: DateTime
  isDeleted: bool, default=false
  \${2:title}: \${3:String}
`
;
}


function serverpodMapModelSnippet(): string {
    const d1 = `\${1/(.*)/\${1:/downcase}/}`;
    const d2 = `\${2/(.*)/\${1:/downcase}/}`;
    
    const tableName = `${d1}_${d2}_map`;

    return `class: \${1:Entity1}\${2:Entity2}Map
table: ${tableName}
fields:
  id: UuidValue?, defaultPersist=random_v7
  ${d1}: \${1:Entity1}?, relation
  ${d2}: \${2:Entity2}?, relation
  userId: int
  customerId: UuidValue, relation(parent=customer, onDelete=Cascade)
  createdAt: DateTime
  lastModified: DateTime
  isDeleted: bool, default=false
indexes:
  idx_${tableName}_${d1}Id_${d2}Id:
    fields: ${d1}Id, ${d2}Id
    unique: true

# нужно добавить в ${d1}.spy.yaml и ${d2}.spy.yaml
# ${d1}\${2:Entity2}Maps: List<\${1:Entity1}\${2:Entity2}Map>?, relation
`;
}

