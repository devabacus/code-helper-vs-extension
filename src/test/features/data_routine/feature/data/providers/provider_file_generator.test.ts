import path from "path";
import { ProviderFileGenerator } from "../../../../../../features/data_routine/add_providers";
import { MockFileSystem } from "../../../../../mocks/mock_file_system";
import * as assert from "assert";




suite('Provider file generator tests', () => {
    
    let mockFileSystem: MockFileSystem;
    let providerFilegenerator: ProviderFileGenerator;

    setup(()=>{
        mockFileSystem = new MockFileSystem();
        providerFilegenerator = new ProviderFileGenerator(mockFileSystem);
    });

    test('Должна быть создана папке с drift классом в providers в каждом слое. Должно быть создано корректно три файла', async () => {
        

        const featurePath = path.join("test", "feature");
        const driftClassName = "testClass";

        await providerFilegenerator.addProviderFiles(featurePath, driftClassName);
        
        const presentationFolderPath = path.join(featurePath, "presentation", "providers", "testClass");
        assert.ok(mockFileSystem.createdFolders.includes(presentationFolderPath), "Должа быть папка в слое presentation/providers/название_drift_таблицы");

        assert.strictEqual(Object.keys(mockFileSystem.createdFiles).length, 3, "Должно быть создано 3 файла");

        const presentationProviderPath = path.join(presentationFolderPath, 'testClass_state_providers.dart');
        assert.ok(mockFileSystem.createdFiles[presentationProviderPath], 'Presentation provider file should exist');
        assert.ok(mockFileSystem.createdFiles[presentationProviderPath].includes('TestClasses'), 'Presentation provider should contain "TestClasses"');
        
        const dataProviderPath = path.join(featurePath, 'data', 'providers', 'testClass_data_providers.dart');
        assert.ok(mockFileSystem.createdFiles[dataProviderPath], 'Data provider file should exist');
        assert.ok(mockFileSystem.createdFiles[dataProviderPath].includes('TestClassLocalDataSource'), 'Data provider should contain "TestClassLocalDataSource"');
        
        const usecaseProviderPath = path.join(featurePath, 'domain', 'providers', 'testClass_usecase_providers.dart');
        assert.ok(mockFileSystem.createdFiles[usecaseProviderPath], 'Usecase provider file should exist');
        assert.ok(mockFileSystem.createdFiles[usecaseProviderPath].includes('CreateTestClassUseCase'), 'Usecase provider should contain "CreateTestClassUseCase"');



    });
});
