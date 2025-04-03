import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { logInfo } from './logging';

export function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = [sourceFile];
  const result: ts.Node[] = [];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node) {
      result.push(node);
      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren());
      }
    }
  }

  return result;
}

export function addInterface(tree: Tree, filePath: string, interfaceName: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const classNode = nodes.find((n) => n.kind === ts.SyntaxKind.ClassDeclaration);
  if (classNode) {
    const implementsNode = findChild(classNode, ts.SyntaxKind.FirstFutureReservedWord, 'implements');
    const extendsNode = findChild(classNode, ts.SyntaxKind.ExtendsKeyword, 'extends');

    if (implementsNode) {
      const syntaxListNode = findChild(implementsNode.parent, ts.SyntaxKind.SyntaxList);

      if (syntaxListNode) {
        const lastChild = syntaxListNode.getChildren()[syntaxListNode.getChildren().length - 1];

        const updateRecorder = tree.beginUpdate(filePath);
        updateRecorder.insertLeft(lastChild.end, `, ${interfaceName}`);
        tree.commitUpdate(updateRecorder);
        if (logMessage) {
          logInfo(`Interface ${interfaceName} hinzugefügt.`);
        }
      }
    } else {
      if (extendsNode) {
        const updateRecorder = tree.beginUpdate(filePath);
        updateRecorder.insertLeft(extendsNode.parent.end, ` implements ${interfaceName}`);
        tree.commitUpdate(updateRecorder);
        if (logMessage) {
          logInfo(`Interface ${interfaceName} hinzugefügt.`);
        }
      } else {
        const classKeywordNode = findChild(classNode, ts.SyntaxKind.ClassKeyword);

        if (!classKeywordNode) {
          throw new SchematicsException(`Die Klasse ${filePath} hat kein ClassKeyword.`);
        }

        const classIdentifierNode = getNextSibling(classKeywordNode);

        if (!classIdentifierNode) {
          throw new SchematicsException(`Die Klasse ${filePath} hat keinen Namen.`);
        }

        const updateRecorder = tree.beginUpdate(filePath);
        updateRecorder.insertLeft(classIdentifierNode.end, ` implements ${interfaceName}`);
        tree.commitUpdate(updateRecorder);
        if (logMessage) {
          logInfo(`Interface ${interfaceName} hinzugefügt.`);
        }
      }
    }
  }
}

export function removeInterface(tree: Tree, filePath: string, interfaceName: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const classNode = nodes.find((n) => n.kind === ts.SyntaxKind.ClassDeclaration);

  if (classNode) {
    const syntaxListClassNodes = classNode.getChildren().filter((n) => n.kind === ts.SyntaxKind.SyntaxList);

    if (syntaxListClassNodes) {
      syntaxListClassNodes.forEach((syntaxListNode) => {
        const heritageClauseNodes = syntaxListNode.getChildren().filter((n) => n.kind === ts.SyntaxKind.HeritageClause);
        if (heritageClauseNodes) {
          heritageClauseNodes.forEach((heritageClauseNode) => {
            const wordNode = heritageClauseNode.getChildren().find((n) => n.kind === ts.SyntaxKind.FirstFutureReservedWord);
            if (wordNode && wordNode.getText() === 'implements') {
              const interfaceSyntaxNode = heritageClauseNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
              if (interfaceSyntaxNode) {
                const interfaceChildren = interfaceSyntaxNode.getChildren();
                if (interfaceChildren) {
                  if (interfaceChildren.length === 1) {
                    if (interfaceChildren[0].getText() === interfaceName) {
                      const updateRecorder = tree.beginUpdate(filePath);
                      updateRecorder.remove(
                        heritageClauseNode.pos,
                        heritageClauseNode.getChildren()[heritageClauseNode.getChildren().length - 1].end - heritageClauseNode.pos
                      );
                      tree.commitUpdate(updateRecorder);
                      if (logMessage) {
                        logInfo(`Interface ${interfaceName} entfernt.`);
                      }
                    }
                  } else {
                    for (let i = 0; i < interfaceChildren.length; i++) {
                      if (interfaceChildren[i].getText() === interfaceName) {
                        const prevSibling = getPrevSibling(interfaceChildren[i], ts.SyntaxKind.SyntaxList);
                        const nextSibling = getNextSibling(interfaceChildren[i], ts.SyntaxKind.SyntaxList);
                        const updateRecorder = tree.beginUpdate(filePath);
                        if (nextSibling) {
                          updateRecorder.remove(interfaceChildren[i].pos, nextSibling.end - interfaceChildren[i].pos);
                        } else {
                          if (prevSibling) {
                            updateRecorder.remove(prevSibling.pos, interfaceChildren[i].end - prevSibling.pos);
                          } else {
                            updateRecorder.remove(interfaceChildren[i].pos, interfaceChildren[i].end - interfaceChildren[i].pos);
                          }
                        }
                        tree.commitUpdate(updateRecorder);
                        if (logMessage) {
                          logInfo(`Interface ${interfaceName} entfernt.`);
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    }
  }
}

export function addImport(tree: Tree, filePath: string, packageName: string, importName?: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const importNodes = nodes.filter((n) => n.kind === ts.SyntaxKind.ImportDeclaration);

  let importNode: ts.Node | undefined = undefined;
  let found = false;

  if (importNodes) {
    importNodes.forEach((node) => {
      const luxComponentsImport = node
        .getChildren()
        .find((n) => n.kind === ts.SyntaxKind.StringLiteral && (n.getText() === `'${packageName}'` || n.getText() === `"${packageName}"`));
      if (luxComponentsImport) {
        importNode = node;

        if (!found && importName) {
          const importClauseNode = (importNode as ts.Node).getChildren().find((n) => n.kind === ts.SyntaxKind.ImportClause);

          if (importClauseNode) {
            const namedImportsNode = importClauseNode.getChildren().find((n) => n.kind === ts.SyntaxKind.NamedImports);

            if (!namedImportsNode) {
              throw new SchematicsException(`In der Datei ${filePath} gibt es keine NamedImports.`);
            }

            const syntaxListNode = namedImportsNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);

            if (!syntaxListNode) {
              throw new SchematicsException(`In der Datei ${filePath} gibt es keine SyntaxList für den import.`);
            }

            syntaxListNode.getChildren().forEach((n) => {
              if (n.kind === ts.SyntaxKind.ImportSpecifier && n.getText() === importName) {
                found = true;
              }
            });
          }
        }
      }
    });
  }

  if (!found) {
    if (importNode) {
      const importClauseNode = (importNode as ts.Node).getChildren().find((n) => n.kind === ts.SyntaxKind.ImportClause);

      if (importClauseNode) {
        const namedImportsNode = importClauseNode.getChildren().find((n) => n.kind === ts.SyntaxKind.NamedImports);

        if (!namedImportsNode) {
          throw new SchematicsException(`In der Datei ${filePath} gibt es keine NamedImports.`);
        }

        const syntaxListNode = namedImportsNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);

        if (!syntaxListNode) {
          throw new SchematicsException(`In der Datei ${filePath} gibt es keine SyntaxList für den import.`);
        }

        const importChildren = syntaxListNode.getChildren();
        const foundNode = importName ? findChild(syntaxListNode, ts.SyntaxKind.Identifier, importName) : undefined;
        if (!foundNode) {
          const lastChildNode = importChildren[syntaxListNode.getChildren().length - 1];

          const updateRecorder = tree.beginUpdate(filePath);
          updateRecorder.insertLeft(lastChildNode.end, ', ' + importName);
          tree.commitUpdate(updateRecorder);
          if (logMessage) {
            logInfo(`import ${importName} hinzugefügt.`);
          }
        }
      }
    } else {
      const updateRecorder = tree.beginUpdate(filePath);
      if (importName) {
        updateRecorder.insertLeft(0, `import { ${importName} } from '${packageName}';\n`);
      } else {
        updateRecorder.insertLeft(0, `import '${packageName}';\n`);
      }
      tree.commitUpdate(updateRecorder);
      if (logMessage) {
        logInfo(`import ${importName} hinzugefügt.`);
      }
    }
  }
}

export function removeImport(tree: Tree, filePath: string, packageName: string, importName?: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const importNodes = nodes.filter((n) => n.kind === ts.SyntaxKind.ImportDeclaration);

  if (importNodes) {
    importNodes.forEach((importNode) => {
      const importDeclarationChildren = importNode.getChildren();

      if (!importDeclarationChildren) {
        throw new SchematicsException(`In der Datei ${filePath} gibt es keine importDeclaration.`);
      }

      const importNameNode = importDeclarationChildren.find(
        (n) => n.kind === ts.SyntaxKind.StringLiteral && (n.getText() === `'${packageName}'` || n.getText() === `"${packageName}"`)
      );

      if (importNameNode) {
        if (importName) {
          const importClauseNode = importNode.getChildren().find((n) => n.kind === ts.SyntaxKind.ImportClause);

          if (!importClauseNode) {
            throw new SchematicsException(`In der Datei ${filePath} gibt es keine importClause.`);
          }

          const namedImportsNode = importClauseNode.getChildren().find((n) => n.kind === ts.SyntaxKind.NamedImports);

          if (!namedImportsNode) {
            throw new SchematicsException(`In der Datei ${filePath} gibt es keine NamedImports.`);
          }

          const syntaxListNode = namedImportsNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);

          if (!syntaxListNode) {
            throw new SchematicsException(`In der Datei ${filePath} gibt es keine SyntaxList.`);
          }

          const importChildren = syntaxListNode.getChildren();
          if (importChildren) {
            if (importChildren.length === 1) {
              if (importChildren[0].getText() === importName) {
                const updateRecorder = tree.beginUpdate(filePath);
                updateRecorder.remove(importNode.pos, importNode.getChildren()[importNode.getChildren().length - 1].end - importNode.pos);
                tree.commitUpdate(updateRecorder);
                if (logMessage) {
                  logInfo(`import ${importName} entfernt.`);
                }
              }
            } else {
              for (let i = 0; i < importChildren.length; i++) {
                if (importChildren[i].getText() === importName) {
                  const prevSibling = getPrevSibling(importChildren[i], ts.SyntaxKind.SyntaxList);
                  const nextSibling = getNextSibling(importChildren[i], ts.SyntaxKind.SyntaxList);
                  const updateRecorder = tree.beginUpdate(filePath);
                  if (nextSibling) {
                    updateRecorder.remove(importChildren[i].pos, nextSibling.end - importChildren[i].pos);
                  } else {
                    if (prevSibling) {
                      updateRecorder.remove(prevSibling.pos, importChildren[i].end - prevSibling.pos);
                    } else {
                      updateRecorder.remove(importChildren[i].pos, importChildren[i].end - importChildren[i].pos);
                    }
                  }
                  tree.commitUpdate(updateRecorder);
                  if (logMessage) {
                    logInfo(`import ${importName} entfernt.`);
                  }
                }
              }
            }
          }
        } else {
          const updateRecorder = tree.beginUpdate(filePath);
          updateRecorder.remove(importNode.pos, importNode.end - importNode.pos);
          tree.commitUpdate(updateRecorder);
          if (logMessage) {
            logInfo(`import ${importName} entfernt.`);
          }
        }
      }
    });
  }
}

export function addComponentImport(tree: Tree, filePath: string, importName: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const importIdentifierNode = nodes.find((n) => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'imports');

  if (importIdentifierNode) {
    const siblings = importIdentifierNode.parent.getChildren();

    if (siblings) {
      const importArrayNode = siblings.find((n) => n.kind === ts.SyntaxKind.ArrayLiteralExpression);

      if (importArrayNode) {
        const importNode = importArrayNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
        if (importNode) {
          const importChildren = importNode.getChildren();

          if (importChildren) {
            if (importChildren.length > 0) {
              if (!findChild(importNode, ts.SyntaxKind.Identifier, importName)) {
                const updateRecorder = tree.beginUpdate(filePath);
                updateRecorder.insertLeft(importChildren[0].pos, `${importName}, `);

                tree.commitUpdate(updateRecorder);
                if (logMessage) {
                  logInfo(`import ${importName} hinzugefügt.`);
                }
              }
            } else {
              const updateRecorder = tree.beginUpdate(filePath);
              updateRecorder.insertLeft(importNode.end, `${importName}`);

              tree.commitUpdate(updateRecorder);
              if (logMessage) {
                logInfo(`import ${importName} hinzugefügt.`);
              }
            }
          }
        }
      }
    }
  } else {
    const selectIdentifierNode = nodes.find((n) => n.kind === ts.SyntaxKind.Identifier && n.getText() === 'selector');

    if (selectIdentifierNode) {
      const lastNode = selectIdentifierNode.parent.getChildren()[selectIdentifierNode.parent.getChildren().length - 1];
      const updateRecorder = tree.beginUpdate(filePath);
      updateRecorder.insertLeft(lastNode.end, `,\n  imports: [${importName}]`);

      tree.commitUpdate(updateRecorder);
      if (logMessage) {
        logInfo(`import ${importName} hinzugefügt.`);
      }
    }
  }
}

export function removeComponentImport(tree: Tree, filePath: string, providerName: string, logMessage = true) {
  removeComponentArrayValue(tree, filePath, 'imports', providerName, logMessage);
}

export function removeComponentProvider(tree: Tree, filePath: string, providerName: string, logMessage = true) {
  removeComponentArrayValue(tree, filePath, 'providers', providerName, logMessage);
}

function removeComponentArrayValue(tree: Tree, filePath: string, property: string, name: string, logMessage = true) {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const providerIdentifierNode = nodes.find((n) => n.kind === ts.SyntaxKind.Identifier && n.getText() === property);

  if (providerIdentifierNode) {
    const siblings = providerIdentifierNode.parent.getChildren();

    if (siblings) {
      const providerArrayNode = siblings.find((n) => n.kind === ts.SyntaxKind.ArrayLiteralExpression);

      if (providerArrayNode) {
        const providerNode = providerArrayNode.getChildren().find((n) => n.kind === ts.SyntaxKind.SyntaxList);
        if (providerNode) {
          const providerChildren = providerNode.getChildren();

          if (providerChildren) {
            for (let i = 0; i < providerChildren.length; i++) {
              if (providerChildren[i].getText().indexOf(name) >= 0) {
                const prevSibling = getPrevSibling(providerChildren[i], ts.SyntaxKind.SyntaxList);
                const nextSibling = getNextSibling(providerChildren[i], ts.SyntaxKind.SyntaxList);
                const updateRecorder = tree.beginUpdate(filePath);
                if (nextSibling) {
                  updateRecorder.remove(providerChildren[i].pos, nextSibling.end - providerChildren[i].pos);
                } else {
                  if (prevSibling) {
                    updateRecorder.remove(prevSibling.pos, providerChildren[i].end - prevSibling.pos);
                  } else {
                    updateRecorder.remove(providerChildren[i].pos, providerChildren[i].end - providerChildren[i].pos);
                  }
                }
                tree.commitUpdate(updateRecorder);
                if (logMessage) {
                  logInfo(`${name} aus @Component.${property} entfernt.`);
                }
              }
            }
          }
        }
      }
    }
  }
}

export function getSiblings(node: ts.Node, childKind?: ts.SyntaxKind): ts.Node[] {
  let result: ts.Node[] = [];

  if (node && node.parent.getChildren()) {
    if (childKind) {
      const childNode = node.parent.getChildren().find((child) => child.kind === childKind);

      if (!childNode) {
        throw new SchematicsException(`Es konnte kein Knoten vom Typ ${childKind} gefunden werden.`);
      }

      result = [...childNode.getChildren()];
    } else {
      result = [...node.parent.getChildren()];
    }
  }

  return result;
}

export function getPrevSibling(node: ts.Node, childKind?: ts.SyntaxKind): ts.Node | null {
  let result: ts.Node | null = null;

  if (node) {
    let siblings: ts.Node[] = getSiblings(node, childKind);

    if (siblings) {
      const index = siblings.indexOf(node);
      if (index > 0) {
        result = siblings[index - 1];
      }
    }
  }

  return result;
}

export function getNextSibling(node: ts.Node, childKind?: ts.SyntaxKind): ts.Node | null {
  let result: ts.Node | null = null;

  if (node) {
    let siblings: ts.Node[] = getSiblings(node, childKind);

    if (siblings) {
      const index = siblings.indexOf(node);
      if (index >= 0 && index < siblings.length - 1) {
        result = siblings[index + 1];
      }
    }
  }

  return result;
}

export function getNextSiblings(node: ts.Node): ts.Node[] {
  let result: ts.Node[] = [];

  if (node) {
    let siblings: ts.Node[] = getSiblings(node);

    if (siblings) {
      const index = siblings.indexOf(node);
      if (index >= 0 && index < siblings.length - 1) {
        result = siblings.slice(index + 1, siblings.length - 1);
      }
    }
  }

  return result;
}

export function showTree(node: ts.Node, indent: string = '    '): void {
  console.log(indent + ts.SyntaxKind[node.kind]);

  if (node.getChildCount() === 0) {
    console.log(indent + '    Text: ' + node.getText());
  }

  for (let child of node.getChildren()) {
    showTree(child, indent + '    ');
  }
}

export function findChild(node: ts.Node, kind: ts.SyntaxKind, text?: string): ts.Node | undefined {
  if (node.kind === kind && (!text || node.getText() === text)) {
    return node;
  } else {
    for (let child of node.getChildren()) {
      const found = findChild(child, kind, text);

      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

export function getSyntaxListOfClass(tree: Tree, filePath: string): ts.Node {
  const content = (tree.read(filePath) as Buffer).toString();
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  const sourceFile = ts.createSourceFile(`${fileName}`, content, ts.ScriptTarget.Latest, true);
  const nodes = getSourceNodes(sourceFile);

  const classNode = nodes.find((n) => n.kind === ts.SyntaxKind.ClassKeyword);
  if (!classNode) {
    throw new SchematicsException(`Die Klasse in der Datei ${fileName} hat kein ClassKeyword.`);
  }

  const firstPunctuationNode = getNextSiblings(classNode).find((n) => n.kind === ts.SyntaxKind.FirstPunctuation);

  if (!firstPunctuationNode) {
    throw new SchematicsException(`Die Klasse in der Datei ${fileName} hat keine FirstPunctuation.`);
  }

  const syntaxListNode = getNextSibling(firstPunctuationNode);

  if (!syntaxListNode) {
    throw new SchematicsException(`Die Klasse in der Datei ${fileName} hat keine SyntaxList.`);
  }

  return syntaxListNode;
}

export function getConstructor(tree: Tree, filePath: string) {
  return findChild(getSyntaxListOfClass(tree, filePath), ts.SyntaxKind.Constructor);
}

export function getMethod(tree: Tree, filePath: string, methodeName: string): ts.Node | undefined {
  return findChild(getSyntaxListOfClass(tree, filePath), ts.SyntaxKind.MethodDeclaration, methodeName);
}

export function addParameter(tree: Tree, filePath: string, syntaxListNode: ts.Node, service: string) {
  const parameterNodes = syntaxListNode.getChildren();
  const updateRecorder = tree.beginUpdate(filePath);
  if (parameterNodes.length == 0) {
    // Constructor ohne Parameter
    updateRecorder.insertLeft(syntaxListNode.pos, service);
  } else if (parameterNodes.length > 0) {
    // Constructor mit Parameter
    updateRecorder.insertLeft(parameterNodes[parameterNodes.length - 1].end, ', ' + service);
  }
  tree.commitUpdate(updateRecorder);
}

export function addMethod(tree: Tree, filePath: string, _syntaxListNode: ts.Node, method: string) {
  const syntaxList = getSyntaxListOfClass(tree, filePath);
  const methodNodes = syntaxList.getChildren().filter((n) => n.kind === ts.SyntaxKind.MethodDeclaration);

  let startNode = syntaxList;
  if (methodNodes && methodNodes.length > 0) {
    startNode = methodNodes[methodNodes.length - 1];
  }

  const updateRecorder = tree.beginUpdate(filePath);
  updateRecorder.insertLeft(startNode.end, '\n' + method);
  tree.commitUpdate(updateRecorder);
}

export function addConstructorParameter(tree: Tree, filePath: string, service: string) {
  const constructorNode = getConstructor(tree, filePath);
  if (constructorNode) {
    addParameter(tree, filePath, findChild(constructorNode, ts.SyntaxKind.SyntaxList) as ts.Node, service);
    logInfo(`Im Konstruktor den Parameter "${service}" hinzugefügt.`);
  } else {
    const syntaxListNode = getSyntaxListOfClass(tree, filePath);
    const updateRecorder = tree.beginUpdate(filePath);
    updateRecorder.insertLeft(syntaxListNode.pos, `\n  constructor(${service}) {}`);
    tree.commitUpdate(updateRecorder);
    logInfo(`constructor(${service}) {} hinzugefügt.`);
  }
}

export function addClassProperty(tree: Tree, filePath: string, property: string) {
  const syntaxListNode = getSyntaxListOfClass(tree, filePath);

  if (!syntaxListNode) {
    throw new SchematicsException(`Die Klasse in der Datei ${filePath} hat keine Syntaxlist.`);
  }

  const startNode =
    syntaxListNode.getChildren() && syntaxListNode.getChildren().length > 0 ? syntaxListNode.getChildren()[0] : syntaxListNode;

  const updateRecorder = tree.beginUpdate(filePath);
  updateRecorder.insertLeft(startNode.pos, '\n\n  ' + property + '\n');
  tree.commitUpdate(updateRecorder);
  logInfo(`Die Property "${property}" wurde hinzugefügt.`);
}

export function addConstructorContent(tree: Tree, filePath: string, content: string, append: boolean) {
  const constructorNode = getConstructor(tree, filePath);

  if (constructorNode) {
    const blockNode = constructorNode.getChildren().find((n) => n.kind === ts.SyntaxKind.Block);

    if (!blockNode) {
      throw new SchematicsException(`Der Konstruktor in der Klasse ${filePath} hat keinen Block.`);
    }

    const firstPunctuationNode = blockNode.getChildren().find((n) => n.kind === ts.SyntaxKind.FirstPunctuation);

    if (!firstPunctuationNode) {
      throw new SchematicsException(`Der Konstruktor in der Klasse ${filePath} hat keine FirstPunctuation.`);
    }

    const syntaxListNode = getNextSibling(firstPunctuationNode);

    if (syntaxListNode && syntaxListNode.getChildren().length > 0) {
      const start = append
        ? syntaxListNode.getChildren()[syntaxListNode.getChildren().length - 1].end
        : syntaxListNode.getChildren()[0].pos;

      const updateRecorder = tree.beginUpdate(filePath);
      updateRecorder.insertLeft(start, '\n    ' + content);
      tree.commitUpdate(updateRecorder);
    } else {
      const updateRecorder = tree.beginUpdate(filePath);
      updateRecorder.insertLeft(firstPunctuationNode.end, '\n    ' + content + '\n  ');
      tree.commitUpdate(updateRecorder);
    }
    logInfo(`Inhalt ${append ? 'am Ende' : 'am Anfang'} des Konstruktors hinzugefügt.`);
  } else {
    const syntaxListNode = getSyntaxListOfClass(tree, filePath);
    const updateRecorder = tree.beginUpdate(filePath);
    updateRecorder.insertLeft(syntaxListNode.pos, '\n\n' + '  constructor() {\n' + '    router.initialNavigation();\n' + '  }');
    tree.commitUpdate(updateRecorder);
    logInfo(`Konstruktor mit Inhalt hinzugefügt.`);
  }
}
