import * as fs from 'fs';
import path from 'path';
import { fixAndroidNDKVersion } from './fix_android_ndk_version';


export function startAppFix(rootPath: string) {
    const filePath = path.join(rootPath, "test", "widget_test.dart");
    
    fs.unlinkSync(filePath);
    fixAndroidNDKVersion();
}
