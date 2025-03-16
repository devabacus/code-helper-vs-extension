

// export const ble_manager = `  ble_manager:\n    git:\n      url: https://github.com/devabacus/ble_manager.git\n      ref: v0.0.2\n`;


export const mLogger = `  mlogger:\n    git:\n      url: https://github.com/devabacus/mlogger.git\n      ref: v0.0.1\n`;
export const common_package = `  common_package:\n    path: ../Packages/common_package\n`;

export const startDependency = `${common_package}${mLogger}`;


// function addGitConst(packageName: string, url: string, ref: string):string {
//     return `  ${packageName}:\n    git:\n      url: ${url}\n      ref: ${ref}\n`;
// }


// function addPackConst(packageName: string, path: string):string {
//     return `  ${packageName}:\n    path: ${path}\n`;

// }

// export const common_package = addPackConst("common_package", "../Packages/common_package");
// export const mLogger = addGitConst("mlogger", "https://github.com/devabacus/mlogger.git", "v0.0.1");
// export const ble_manager = addGitConst("ble_manager", "https://github.com/devabacus/ble_manager.git", "v0.0.2");

// export const startDependency = 
