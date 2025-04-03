npm install -g @vscode/vsce

code --install-extension mrfrolk.code-helper


# code --uninstall-extension mrfrolk.code-helper && code --install-extension mrfrolk.code-helper
code --list-extensions
code --disable-extensions


vsce package
code --uninstall-extension mrfrolk.code-helper
code --install-extension code-helper-0.0.1.vsix
