import { Command } from "../../../core/interfaces/command";
import { DartTestGeneratorFactory } from "../factories/test_generator_factory";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";
import { RelationType, TableRelation } from "../interfaces/table_relation.interface";

export class GenerateTestFilesCommand implements Command {
    
    private isRelationTable: boolean;
    private relations: TableRelation[]; // Хотя они могут не использоваться активно на этом этапе, хорошо их иметь
    private classParser: DriftClassParser;

    constructor(
        private testGeneratorFactory: DartTestGeneratorFactory,
        private featureTestPath: string,
        private driftClassName: string,
        commandData: {
            classParser: DriftClassParser;
            isRelationTable: boolean;
            relations: TableRelation[];
        }
    ) {
        this.classParser = commandData.classParser; 
        this.isRelationTable = commandData.isRelationTable;
        this.relations = commandData.relations;
    }

    async execute(): Promise<void> {

        // Если это НЕ связующая таблица "многие ко многим"
        if (!this.isRelationTable) {
            // Для обычных таблиц генерируем полный набор тестов, как и раньше.
            // Это позволит проверить, что ничего не сломалось для них.
            
            console.log(`Генерация стандартного набора тестов для обычной таблицы: ${this.driftClassName}.`);
            await this.testGeneratorFactory.createTestDaoGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestLocalSourceGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestRepositoryImplGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCasesCreateGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCasesDeleteGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCasesUpdateGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCasesGetByIdGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCasesGetListGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
            await this.testGeneratorFactory.createTestUseCaseWatchGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);
        } else {
            // Если это связующая таблица "многие ко многим"
            const manyToManyRelation = this.relations.find(r => r.relationType === RelationType.MANY_TO_MANY);
            if (manyToManyRelation) {
                console.log(`Обнаружена связующая таблица: ${this.driftClassName}. Связывает ${manyToManyRelation.sourceTable} и ${manyToManyRelation.targetTable}.`);
                
                // ПОКА ЧТО для связующих таблиц можно либо ничего не генерировать,
                // либо генерировать только самый минимум, например, тест для DAO, если он предполагается.
                // Это позволит проверить, что определение типа таблицы работает.

                // Например, временно генерируем только тест для DAO, чтобы посмотреть, что создастся
                // или даже просто логируем, что мы ее определили и пропустили.
                console.log(`Планируется специальная генерация тестов для связующей таблицы ${this.driftClassName} (пока пропускается или генерируется минимум).`);
                
                // Если ты хочешь УБЕДИТЬСЯ, что createTestDaoGenerator не падает на данных от связующей таблицы:
                // (но помни, что стандартный шаблон теста DAO может быть не идеален для связующей таблицы)
                // console.log(`Пробуем сгенерировать тест DAO для связующей таблицы ${this.driftClassName}, чтобы проверить совместимость генератора.`);
                // await this.testGeneratorFactory.createTestDaoGenerator().generate(this.featureTestPath, this.driftClassName, this.classParser);

                // На данном этапе, чтобы не ломать ничего и проверить только определение,
                // можно просто ничего не делать для isRelationTable === true, или только логировать.
            } else {
                // Эта ситуация маловероятна, если isRelationTable === true, то manyToManyRelation должен найтись.
                // Но можно добавить лог на всякий случай.
                console.warn(`Таблица ${this.driftClassName} определена как связующая, но детали связи "многие ко многим" не найдены.`);
            }
        }
    }
}