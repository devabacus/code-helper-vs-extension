import path from "path";
import { cap } from "../../../utils/text_work/text_util";

interface IPathHandle {
    featName: string,
    featurePath: string,
    rootPath: string,
    pageName: string,
    capPageName: string,
    isPage: boolean,
}

export class PathData {

    private filePath:string;

    constructor(filePath: string) {
        if (filePath === '') {
            throw new Error('filePath empty');
        }
        this.filePath = filePath;
    }


    get data() : IPathHandle {

        return {
            featName: this.featureName,
            featurePath: this.feauturePath,
            rootPath: this.rootPath,
            pageName: this.pageName,
            capPageName: this.capPageName,
            isPage: this.isPage,
        };

    }


    get rootPath():string {
        const _rootPath = this.filePath.split('lib')[0];
        return path.resolve(_rootPath);
    }

    get featureName():string {
        return this.filePath.split('features')[1].split('\\')[1];
    }

    get feauturePath():string {
        const _featurePath = this.filePath.split('presentation')[0];
        return path.resolve(_featurePath);
    }

    get pageName():string {
        const fileName = path.parse(this.filePath).name;
        const _pageName = fileName.replace(/_page/g, '');
        return _pageName;
        
    }

    get capPageName():string {
        return this.pageNameList.map((item)=>cap(item)).join('');
    }

    get widgetPageName():string {
        const fileName = path.parse(this.filePath).name;
        const pageNameList = fileName.split('_');
        return pageNameList.map((item)=>cap(item)).join('');
    }

    get isPage() : boolean {
        return path.basename(this.filePath).includes('page');
    }

    private get pageNameList():string[] {
        const fileName = path.parse(this.filePath).name;
        const _pageName = fileName.replace(/_page/g, '');
        const pageNameList = _pageName.split('_');
        return pageNameList;
    }

    
}