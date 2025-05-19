import path from "path";
import { DefaultProjectStructure } from "../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../core/interfaces/project_structure";
import { cap, pluralConvert, toCamelCase, toSnakeCase } from "../../../utils/text_work/text_util";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../feature/data/datasources/local/tables/drift_table_parser";
import { RelationType, TableRelation } from "../interfaces/table_relation.interface";
import { DataRoutineGenerator } from "./data_routine_generator";

export abstract class RelateDataRoutineGenerator extends DataRoutineGenerator {
  protected projectStructure: ProjectStructure;

  // Common properties derived from the many-to-many relation
  protected intermediateUpper!: string;
  protected intermediateCamel!: string;
  protected intermediateSnake!: string;

  protected sourceTable!: string;
  protected targetTable!: string;

  protected sourceUpper!: string;
  protected targetUpper!: string;
  protected sourceSnake!: string;
  protected targetSnake!: string;

  protected sourceForeignKey!: string;
  protected targetForeignKey!: string;

  protected targetPlural!: string;
  protected targetPluralSnake!: string;
  protected sourcePlural!: string;
  protected sourcePluralSnake!: string;

  protected useCaseSubDirSnake!: string; // e.g., task_tag
  protected manyToManyRelation!: TableRelation;

  private initialized: boolean = false;

  constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
    super(fileSystem);
    this.projectStructure = projectStructure || new DefaultProjectStructure();
  }

  /**
   * Initializes common properties based on the M2M relation from the parser.
   * This method is called by the overridden getPath and getContent methods.
   */
  protected initializeRelationProperties(parser: DriftClassParser): void {
    if (this.initialized && this.intermediateUpper === parser.driftClassNameUpper) {
      // Already initialized for this parser instance/content
      return;
    }

    const tableParser = new DriftTableParser(parser.driftClass);
    const m2mRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!m2mRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} in a RelateDataRoutineGenerator.`);
    }
    this.manyToManyRelation = m2mRelation;

    this.intermediateUpper = parser.driftClassNameUpper;
    this.intermediateCamel = toCamelCase(this.intermediateUpper);
    this.intermediateSnake = toSnakeCase(this.intermediateUpper);

    this.sourceTable = this.manyToManyRelation.sourceTable;
    this.targetTable = this.manyToManyRelation.targetTable;

    this.sourceUpper = cap(this.sourceTable);
    this.targetUpper = cap(this.targetTable);
    this.sourceSnake = toSnakeCase(this.sourceTable);
    this.targetSnake = toSnakeCase(this.targetTable);

    this.sourceForeignKey = this.manyToManyRelation.sourceField;
    this.targetForeignKey = this.manyToManyRelation.targetField;

    this.targetPlural = pluralConvert(this.targetUpper);
    this.targetPluralSnake = toSnakeCase(this.targetPlural);
    this.sourcePlural = pluralConvert(this.sourceUpper);
    this.sourcePluralSnake = toSnakeCase(this.sourcePlural);

    this.useCaseSubDirSnake = `${this.sourceSnake}_${this.targetSnake}`;
    this.initialized = true;
  }

  protected override getPath(featurePath: string, entityName: string, parser?: DriftClassParser): string {
    if (!parser) {
      // This check ensures that 'parser' is treated as non-optional for the rest of the method.
      // Given DataRoutineGenerator.generate always passes a parser, this error shouldn't be hit in normal flow.
      throw new Error(
        `DriftClassParser instance is required for getPath in ${this.constructor.name}. ` +
        `The 'parser' argument was not provided.`
      );
    }
    this.initializeRelationProperties(parser);
    return this.getRelatePath(featurePath, entityName, parser);
  }

  protected override getContent(parser: DriftClassParser): string {
    return this.getRelateContent(parser);
  }

  // New abstract methods for subclasses to implement
  protected abstract getRelatePath(featurePath: string, entityName: string, parser: DriftClassParser): string;
  protected abstract getRelateContent(parser: DriftClassParser): string;
}