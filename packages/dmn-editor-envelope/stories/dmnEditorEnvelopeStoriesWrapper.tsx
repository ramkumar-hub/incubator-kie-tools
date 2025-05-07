/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from "react";
import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { DmnEditorRoot } from "../dist/DmnEditorRoot";
import * as DmnEditor from "@kie-tools/dmn-editor/dist/DmnEditor";
import {
  WorkspaceEdit,
  ResourceListRequest,
  ResourcesList,
  ResourceContentRequest,
  ResourceContent,
} from "@kie-tools-core/workspace/dist/api";

export function DmnEditorEnvelopeWrapper(props?) {
  const ref = useRef<DmnEditor.DmnEditorRef>(null);

  useEffect(() => {
    if (!dmnEditorRef.current) return;
    dmnEditorRef.current.setContent("example.dmn", "");
  }, []);

  return (
    <>
      <div style={{ position: "absolute", width: "100%", height: "100%", top: "0px", left: "0px" }}>
        <DmnEditorRoot
          exposing={function (s: DmnEditorRoot): void {
            dmnEditorRef.current = s;
          }}
          onNewEdit={function (edit: WorkspaceEdit): void {
            throw new Error("Function not implemented.");
          }}
          onRequestWorkspaceFilesList={function (request: ResourceListRequest): Promise<ResourcesList> {
            throw new Error("Function not implemented.");
          }}
          onRequestWorkspaceFileContent={function (
            request: ResourceContentRequest
          ): Promise<ResourceContent | undefined> {
            throw new Error("Function not implemented.");
          }}
          onOpenFileFromNormalizedPosixPathRelativeToTheWorkspaceRoot={function (
            normalizedPosixPathRelativeToTheWorkspaceRoot: string
          ): void {
            throw new Error("Function not implemented.");
          }}
          workspaceRootAbsolutePosixPath={""}
          keyboardShortcutsService={undefined}
          isReadOnly={false}
        />
      </div>
    </>
  );
}
