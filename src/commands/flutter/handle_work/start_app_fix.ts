import * as fs from 'fs';
import path from 'path';


export async function startAppFix(rootPath: string) {
    const filePath = path.join(rootPath, "test", "widget_test.dart");
    // g:\Projects\Flutter\a21\
    fs.unlinkSync(filePath);
    const buildGradlePath = path.join(rootPath, "android", "app", "build.gradle.kts");

    const content = fs.readFileSync(buildGradlePath, { encoding: "utf-8" });
    const newContent = content.replace('ndkVersion = flutter.ndkVersion', 'ndkVersion = "27.0.12077973"');
    fs.writeFileSync(buildGradlePath, newContent, { encoding: "utf-8" });

}
