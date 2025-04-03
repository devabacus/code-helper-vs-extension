import assert from "assert";
import { PathData } from "../../features/utils/path_util";


suite('class path test', () => {


    const pathData1 = new PathData(`g:\\Projects\\Flutter\\a25\\lib\\features\\feature_name\\presentation\\pages\\todo_page.dart`);
    const pathData2 = new PathData('g:\\Projects\\Flutter\\a25\\lib\\features\\new_feature_name\\presentation\\pages\\add_todo_page.dart');

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
        assert.strictEqual(pathData1.pageName, 'todo');
        assert.strictEqual(pathData2.pageName, 'add_todo');
    });

    test('get cap page name', () => {
        assert.strictEqual(pathData1.capPageName, 'Todo');
        assert.strictEqual(pathData2.capPageName, 'AddTodo');
    });

    test('is page', () => {
        assert.strictEqual(pathData1.isPage, true);
        assert.strictEqual(pathData3.isPage, false);
    });

    test('widget name', () => {
        assert.strictEqual(pathData1.widgetPageName, 'TodoPage');
        assert.strictEqual(pathData2.widgetPageName, 'AddTodoPage');
        assert.strictEqual(pathData3.widgetPageName, 'AuthRouterConfig');
    });


    test('uncap name', () => {
        assert.strictEqual(pathData1.unCapPageName, 'todo');
        assert.strictEqual(pathData2.unCapPageName, 'addTodo');
    });



    test('test interface return', () => {
        assert.strictEqual(pathData1.data.rootPath, 'g:\\Projects\\Flutter\\a25');
        assert.strictEqual(pathData1.data.featurePath, 'g:\\Projects\\Flutter\\a25\\lib\\features\\feature_name');
        assert.strictEqual(pathData1.data.featName, 'feature_name');
        assert.strictEqual(pathData1.data.pageName, 'todo');
        assert.strictEqual(pathData1.data.capPageName, 'Todo');
        assert.strictEqual(pathData1.data.widgetPageName, 'TodoPage');
        assert.strictEqual(pathData1.data.isPage, true);
        assert.strictEqual(pathData3.data.isPage, false);
    });


});




