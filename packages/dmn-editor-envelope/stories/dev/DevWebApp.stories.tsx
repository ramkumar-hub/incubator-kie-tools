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
import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState, useEffect, useCallback, useMemo, createRef } from "react";
import "@patternfly/react-core/dist/styles/base.css";

import { DmnEditorRoot } from "../../dist/DmnEditorRoot";
import { KeyboardShortcutsService } from "@kie-tools-core/keyboard-shortcuts/dist/envelope/KeyboardShortcutsService";
import { DMN15_SPEC } from "@kie-tools/dmn-marshaller/dist/schemas/dmn-1_5/Dmn15Spec";
import { ns as dmn15ns } from "@kie-tools/dmn-marshaller/dist/schemas/dmn-1_5/ts-gen/meta";
import { generateUuid } from "@kie-tools/boxed-expression-component/dist/api";
import { WorkspaceChannelApi, WorkspaceEdit } from "@kie-tools-core/workspace/dist/api";
import { DefaultKeyboardShortcutsService } from "@kie-tools-core/keyboard-shortcuts/dist/envelope/DefaultKeyboardShortcutsService";
import { getOperatingSystem } from "@kie-tools-core/operating-system";

const sampleDmn = `<?xml version="1.0" encoding="UTF-8"?>
<definitions
  xmlns="${dmn15ns.get("")}"
  expressionLanguage="${DMN15_SPEC.expressionLanguage.default}"
  namespace="https://kie.org/dmn/${generateUuid()}"
  id="${generateUuid()}"
  name="DMN${generateUuid()}">
</definitions>`;

export type DmnEditorRootProps = {
  exposing: (s: DmnEditorRoot) => void;
  onNewEdit: (edit: WorkspaceEdit) => void;
  onRequestWorkspaceFilesList: WorkspaceChannelApi["kogitoWorkspace_resourceListRequest"];
  onRequestWorkspaceFileContent: WorkspaceChannelApi["kogitoWorkspace_resourceContentRequest"];
  onOpenFileFromNormalizedPosixPathRelativeToTheWorkspaceRoot: WorkspaceChannelApi["kogitoWorkspace_openFile"];
  onOpenedBoxedExpressionEditorNodeChange?: (newOpenedNodeId: string | undefined) => void;
  workspaceRootAbsolutePosixPath: string;
  keyboardShortcutsService: KeyboardShortcutsService | undefined;
  isReadOnly: boolean;
};

function DevWeb(args: Partial<DmnEditorRootProps>) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.setContent("example.dmn", sampleDmn);
  }, []);

  return (
    <DmnEditorRoot
      //{...args}
      exposing={(api) => {
        editorRef.current = api;
      }}
      onNewEdit={(edit) => {
        console.log("Storybook: New edit", edit);
      }}
      workspaceRootAbsolutePosixPath={args.workspaceRootAbsolutePosixPath ?? ""}
      onRequestWorkspaceFileContent={async () => {
        return {
          content: sampleDmn,
          normalizedPosixPathRelativeToTheWorkspaceRoot: "example.dmn",
          type: "text", // ✅ REQUIRED FIELD
        };
      }}
      onRequestWorkspaceFilesList={async (req) => {
        return {
          pattern: req.pattern, // ✅ Echo back the requested pattern
          normalizedPosixPathsRelativeToTheWorkspaceRoot: ["example.dmn"],
        };
      }}
      onOpenFileFromNormalizedPosixPathRelativeToTheWorkspaceRoot={(path) => {
        console.log("Storybook: Request to open file", path);
      }}
      keyboardShortcutsService={new DefaultKeyboardShortcutsService({ os: getOperatingSystem() })}
      isReadOnly={args.isReadOnly ?? false}
    />
  );
}

const meta: Meta<typeof DevWeb> = {
  title: "Dev/Web App",
  component: DevWeb,
};

export default meta;
type Story = StoryObj<typeof DevWeb>;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Web: Story = {
  render: (args) => DevWeb(args),
  args: {
    workspaceRootAbsolutePosixPath: "/workspace",
    isReadOnly: false,
  },
};
