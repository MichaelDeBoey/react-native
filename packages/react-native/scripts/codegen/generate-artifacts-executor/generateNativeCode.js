/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const generateSpecsCLIExecutor = require('../generate-specs-cli-executor');
const {CORE_LIBRARIES_WITH_OUTPUT_FOLDER} = require('./constants');
const {codegenLog} = require('./utils');
const fs = require('fs');
const os = require('os');
const path = require('path');

function generateNativeCode(
  outputPath /*: string */,
  schemaInfos /*: $ReadOnlyArray<$FlowFixMe> */,
  includesGeneratedCode /*: boolean */,
  platform /*: string */,
) /*: Array<void> */ {
  return schemaInfos.map(schemaInfo => {
    generateCode(outputPath, schemaInfo, includesGeneratedCode, platform);
  });
}

function generateCode(
  outputPath /*: string */,
  schemaInfo /*: $FlowFixMe */,
  includesGeneratedCode /*: boolean */,
  platform /*: string */,
) {
  if (shouldSkipGenerationForFBReactNativeSpec(schemaInfo, platform)) {
    codegenLog(
      '[Codegen - FBReactNativeSpec] Skipping iOS code generation for FBReactNativeSpec as it has been generated already.',
      true,
    );
    return;
  }

  const libraryName = schemaInfo.library.config.name;
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), libraryName));
  const tmpOutputDir = path.join(tmpDir, 'out');
  fs.mkdirSync(tmpOutputDir, {recursive: true});

  codegenLog(`Generating Native Code for ${libraryName} - ${platform}`);
  const useLocalIncludePaths = includesGeneratedCode;
  generateSpecsCLIExecutor.generateSpecFromInMemorySchema(
    platform,
    schemaInfo.schema,
    tmpOutputDir,
    libraryName,
    'com.facebook.fbreact.specs',
    schemaInfo.library.config.type,
    useLocalIncludePaths,
  );

  // Finally, copy artifacts to the final output directory.
  const outputDir =
    reactNativeCoreLibraryOutputPath(libraryName, platform) ?? outputPath;
  fs.mkdirSync(outputDir, {recursive: true});
  // $FlowFixMe[prop-missing] - `fs.cpSync` is missing in Flow libdefs.
  fs.cpSync(tmpOutputDir, outputDir, {recursive: true});
  codegenLog(`Generated artifacts: ${outputDir}`);
}

function reactNativeCoreLibraryOutputPath(
  libraryName /*: string */,
  platform /*: string */,
) {
  return CORE_LIBRARIES_WITH_OUTPUT_FOLDER[libraryName]
    ? CORE_LIBRARIES_WITH_OUTPUT_FOLDER[libraryName][platform]
    : null;
}

function shouldSkipGenerationForFBReactNativeSpec(
  schemaInfo /*: $FlowFixMe */,
  platform /*: string */,
) {
  if (
    platform !== 'ios' ||
    schemaInfo.library.config.name !== 'FBReactNativeSpec'
  ) {
    return false;
  }

  const fbReactNativeSpecOutputPath =
    CORE_LIBRARIES_WITH_OUTPUT_FOLDER.FBReactNativeSpec.ios;
  const fbReactNativeSpecAbsolutePath = path.resolve(
    fbReactNativeSpecOutputPath,
  );
  return (
    fbReactNativeSpecAbsolutePath.includes('node_modules') &&
    fs.existsSync(fbReactNativeSpecAbsolutePath) &&
    fs.readdirSync(fbReactNativeSpecAbsolutePath).length > 0
  );
}

module.exports = {
  generateNativeCode,
  generateCode,
};
