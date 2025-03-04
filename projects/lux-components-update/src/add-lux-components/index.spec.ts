import { callRule, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { of as observableOf } from 'rxjs';
import { updateMajorVersion } from '../updates/18.0.0';
import { getPackageJsonDependency, NodeDependencyType, updatePackageJsonDependency } from '../utility/dependencies';
import { appOptions, workspaceOptions } from '../utility/test';
import { UtilConfig } from '../utility/util';
import { addLuxComponents } from './index';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('add-lux-components', () => {
  let appTree: UnitTestTree;
  let runner: SchematicTestRunner;
  let context: SchematicContext;

  const testOptions: any = {};

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', collectionPath);

    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);

    UtilConfig.defaultWaitMS = 0;

    const collection = runner.engine.createCollection(collectionPath);
    const schematic = runner.engine.createSchematic('add-lux-components', collection);
    context = runner.engine.createContext(schematic);

    testOptions.project = appOptions.name;
    testOptions.path = workspaceOptions.newProjectRoot + '/' + appOptions.name;
    testOptions.verbose = true;
  });

  describe('[Rule] addLuxComponents', () => {
    it('Sollte die LUX-Components im Projekt eingerichtet haben', (done) => {
      updatePackageJsonDependency(appTree, {
        type: NodeDependencyType.Default,
        version: updateMajorVersion + '.0.0',
        name: '@angular/common'
      });

      callRule(addLuxComponents(testOptions), observableOf(appTree), context).subscribe(
        (success) => {
          expect(getPackageJsonDependency(appTree, '@ihk-gfi/lux-components').version).toContain(updateMajorVersion);
          expect(success.exists(testOptions.path + '/move-de-files.js')).toBeTrue();
          done();
        },
        (reason) => expect(reason).toBeUndefined()
      );
    });
  });
});
