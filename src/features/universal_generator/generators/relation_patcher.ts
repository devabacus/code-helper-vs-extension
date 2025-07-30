// universal_generator/generators/relation_patcher.ts

import path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { GenerationConfig } from '../paths/generation_config';
import { getDictionaryRules } from '../replacement_util';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { getPathInfo } from '../paths/path_handle';
import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { DictionaryPresets } from '../dictionary_presets';

export class RelationPatcher {
    constructor(private fileSystem: IFileSystem) { }

    public async patch(config: GenerationConfig, model: ServerpodModel): Promise<void> {
        console.log('Обнаружены связи, запускается процесс патчинга...');

        const relationTemplateEntity = 'task';
        const templateRelatedEntity = 'category';
        const markerName = 'oneToManyMethods';
        const startMarker = `// === generated_start:${markerName} ===`;
        const endMarker = `// === generated_end:${markerName} ===`;
        const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');

        const relationFields = RelationAnalyzer.manyToOneFields(model.fields);
        if (relationFields.length === 0) {
            return;
        }

        const { sourceBasePath: featureSourcePath } = getPathInfo(config, 'feature/');
        if (!await this.fileSystem.exists(featureSourcePath)) {
            return;
        }

        const templateFiles = await (this.fileSystem as any).readDirectoryRecursive(featureSourcePath);

        for (const templateFilePath of templateFiles) {
            if (!templateFilePath.includes(config.templEntity)) {
                continue;
            }

            const relationTemplatePath = templateFilePath.replaceAll(config.templEntity, relationTemplateEntity);
            if (!await this.fileSystem.exists(relationTemplatePath)) {
                continue;
            }

            const relationTemplateContent = await this.fileSystem.readFile(relationTemplatePath);

            const matched = relationTemplateContent.match(regex);
            if (!matched) {
                continue;
            }
            const blockContent = matched[0];

            const isBlockInClass = relationTemplateContent.trim().endsWith('}');


            let allProcessedBlocks = '';

            for (const relationField of relationFields) {
                if (!relationField.relatedModel) {
                    continue;
                }

                let templateBlock = blockContent;

                // 1. Заменяем основную сущность
                const mainEntityConfig = new GenerationConfig({ ...config, templEntity: relationTemplateEntity, targetEntity: model.className });
                const mainEntityRules = getDictionaryRules(DictionaryPresets.ENTITY, mainEntityConfig);
                for (const rule of mainEntityRules) {
                    templateBlock = templateBlock.replace(new RegExp(rule.from, 'g'), rule.to);
                }

                // 2. Заменяем связанную сущность
                const relatedEntityConfig = new GenerationConfig({ ...config, templEntity: templateRelatedEntity, targetEntity: relationField.relatedModel });
                const relatedEntityRules = getDictionaryRules(DictionaryPresets.ENTITY, relatedEntityConfig);
                for (const rule of relatedEntityRules) {
                    templateBlock = templateBlock.replace(new RegExp(rule.from, 'g'), rule.to);
                }

                // 3. Заменяем ID поле
                const targetIdName = relationField.name.endsWith('Id') ? relationField.name : `${relationField.name}Id`;
                templateBlock = templateBlock.replace(new RegExp(`${templateRelatedEntity}Id`, 'g'), targetIdName);

                allProcessedBlocks += '\n\n' + templateBlock;
            }

            if (allProcessedBlocks.length > 0) {
                const relativePath = path.relative(featureSourcePath, templateFilePath).replace(/\\/g, '/');
                const destinationPath = path.join(config.targetFeaturePath, this._getDestinationPath(new GenerationConfig({ ...config, templEntity: 'category' }), relativePath));

                if (!await this.fileSystem.exists(destinationPath)) {
                    continue;
                }


                const destinationContent = await this.fileSystem.readFile(destinationPath);
                if (isBlockInClass) {
                    const lastBraceIndex = destinationContent.lastIndexOf('}');
                    if (lastBraceIndex !== -1) {
                        const indentedBlock = allProcessedBlocks.trim();
                        const newContent =
                            destinationContent.slice(0, lastBraceIndex) +
                            `\n  ${indentedBlock}\n` +
                            destinationContent.slice(lastBraceIndex);
                        await this.fileSystem.createFile(destinationPath, newContent);
                    }
                } else {
                    await this.fileSystem.createFile(destinationPath, destinationContent + allProcessedBlocks);
                }
            }
        }
    }

    private _getDestinationPath(config: GenerationConfig, relativePath: string): string {
        let destinationRelativePath = relativePath.replaceAll(config.templEntity, config.targetEntity);
        destinationRelativePath = destinationRelativePath.replaceAll(config.templProject, config.targetProject);
        return destinationRelativePath;
    }
}