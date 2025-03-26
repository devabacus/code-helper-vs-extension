import assert from "assert";
import { PathData } from "../../commands/flutter/utils/path_util";


suite('class path test', () => {


    const pathData1 = new PathData(`g:\\Projects\\Flutter\\a25\\lib\\features\\feature_name\\presentation\\pages\\pagename_page.dart`);
    const pathData2 = new PathData('g:\\Projects\\Flutter\\a25\\lib\\features\\new_feature_name\\presentation\\pages\\pagename_new_page.dart');

    const pathData3 = new PathData('g:\\Projects\\Flutter\\a25\\lib\\features\\new_feature_name\\presentation\\routing\\auth_router_config.dart');

    
    test('get feature path', () => {
        assert.strictEqual(pathData1.feauturePath, 'g:\\Projects\\Flutter\\a25\\lib\\features\\feature_name');
        assert.strictEqual(pathData2.feauturePath, 'g:\\Projects\\Flutter\\a25\\lib\\features\\new_feature_name');
    });

    test('get root path', () => {

        assert.strictEqual(pathData1.rootPath, `g:\\Projects\\Flutter\\a25`);
        assert.strictEqual(pathData2.rootPath, `g:\\Projects\\Flutter\\a25`);

    });

    test('get feature name', () => {
        assert.strictEqual(pathData1.featureName, 'feature_name');
        assert.strictEqual(pathData2.featureName, 'new_feature_name');

    });

    test('get page name', () => {
        assert.strictEqual(pathData1.pageName, 'pagename');
        assert.strictEqual(pathData2.pageName, 'pagename_new');
    });

    test('get cap page name', () => {
        assert.strictEqual(pathData1.capPageName, 'Pagename');
        assert.strictEqual(pathData2.capPageName, 'PagenameNew');
    });

    test('is page', () => {
        assert.strictEqual(pathData1.isPage, true);
        assert.strictEqual(pathData3.isPage, false);
    });


    test('test interface return', () => {
        assert.strictEqual(pathData1.data.rootPath, 'g:\\Projects\\Flutter\\a25');
        assert.strictEqual(pathData1.data.featurePath, 'g:\\Projects\\Flutter\\a25\\lib\\features\\feature_name');
        assert.strictEqual(pathData1.data.featName, 'feature_name');
        assert.strictEqual(pathData1.data.pageName, 'pagename');
        assert.strictEqual(pathData1.data.capPageName, 'Pagename');
        assert.strictEqual(pathData1.data.isPage, true);
        assert.strictEqual(pathData3.data.isPage, false);
    });


});




