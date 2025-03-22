
export const mLogger = `  mlogger:\n    git:\n      url: https://github.com/devabacus/mlogger.git\n      ref: v0.0.1\n`;
export const common_package = `  common_package:\n    path: ../Packages/common_package\n`;
export const new_local_package = (pkgName: string) => `  ${pkgName}:\n    path: ../\n`;;

export const new_plugin = (plugin: string) => `  ${plugin}\n`;;







export const startDependency = `${common_package}${mLogger}`;
