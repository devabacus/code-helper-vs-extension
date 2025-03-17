import path from 'path';
import { createFile, createFolders } from '../../../utils';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from '../add_barrel_files';
import { routerConfigGenerator, routerContent, routesContent } from '../flutter_content/flutter_constants';
import { startApp } from '../flutter_content/flutter_content';
import { addStartPlugins } from './add_flutter_plugins';

const baseTemplateFolders = [
    'core/routing',
    'core/config',
    'core/providers',
    'core/services',
    'core/theme',
    'core/utils',
];

const templatefiles: Record<string, string> = {
    'core/routing/routes_constants.dart': routesContent,
    'core/routing/router_config.dart': routerContent,
    'core/routing/router_config.g.dart': routerConfigGenerator,
};


const featureFolderPaths = [
    'data/models',
    'data/repositories',
    'data/datasources',
    'domain/entities',
    'domain/usecases',
    'presentation/pages',
    'presentation/widgets',
    'presentation/routing',
    'presentation/providers',
];

const featureFilesPaths = [
    'presentation/routing/router_config.dart',
];

function createFullTemplatePaths(rootPath: string, secondRoot: string, folderPaths: string[]): string[] {
    return folderPaths.map(function (path) {
        return `${rootPath}/lib/${secondRoot}/${path}`;
    });
}

export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map(function (path) {
        return `${rootPath}/lib/${path}`;
    });

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createFile(`${rootPath}/lib/main.dart`, startApp);
    await createIndexDartFiles(`${rootPath}/lib`);
    // await addStartPlugins(rootPath);

}

export async function addFeatureFolders(rootPath: string) {

    const featureName = await getUserInputWrapper(true, "type feature name");
    const featureFolders = createFullTemplatePaths(rootPath, `features/${featureName}`, featureFolderPaths);
    await createFolders(featureFolders);

    createIndexDartFiles(`${rootPath}/lib/features/${featureName}`);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}


