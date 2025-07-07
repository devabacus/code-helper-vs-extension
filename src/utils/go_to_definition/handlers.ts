// src/utils/go_to_definition/handlers.ts
import { 
    getDefinitionContext, 
    shouldUseCustomLogic, 
    executeDefaultGoToDefinition,
    executeDefaultPeekDefinition 
} from './definition_router';
import { customGoToDefinition } from './go_to_definition_provider';
import { customPeekDefinition } from './peek_to_definition_provider';

export async function goToDefinition(): Promise<void> {
    const context = getDefinitionContext();
    if (!context) {return;}

    if (shouldUseCustomLogic(context)) {
        await customGoToDefinition(context.document, context.position, context.word);
    } else {
        await executeDefaultGoToDefinition(context);
    }
}

export async function peekDefinition(): Promise<void> {
    const context = getDefinitionContext();
    if (!context) return;

    if (shouldUseCustomLogic(context)) {
        await customPeekDefinition(context.document, context.position, context.word);
    } else {
        await executeDefaultPeekDefinition(context);
    }
}