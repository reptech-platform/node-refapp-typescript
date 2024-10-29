import { Container } from "inversify";
import * as fs from 'fs';
import * as path from 'path';
import Helper from "../utils/helper.utils";

export default class ContainerConfigLoader {

    private async bindDirectory(iocContainer: Container, dirName: string): Promise<void> {

        const entries = await fs.promises.readdir(dirName, { withFileTypes: true, recursive: true });

        for (const entry of entries) {
            const file = path.join(entry.parentPath, entry.name);
            if (!entry.isDirectory()) {
                const module = require(file);
                Object.keys(module).forEach(className => {
                    const clazz = module[className];
                    iocContainer.bind(`I${className}`).to(clazz).inSingletonScope();
                });
            }
        }

    }

    public async Load(iocContainer: Container): Promise<void> {

        let dirName: any;

        // bind helper
        iocContainer.bind('IHelper').to(Helper).inSingletonScope();

        // bind repositories
        dirName = path.join(__dirname, "..", 'repositories');
        await this.bindDirectory(iocContainer, dirName);

        // bind services
        dirName = path.join(__dirname, "..", 'services');
        await this.bindDirectory(iocContainer, dirName);
    }
}

