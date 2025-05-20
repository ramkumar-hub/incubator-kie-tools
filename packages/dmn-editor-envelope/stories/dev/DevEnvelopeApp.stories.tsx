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
import { useArgs } from "@storybook/preview-api";
import { useRef, useEffect, useMemo } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import * as DmnEditor from "../../dev-webapp/index";
import { DmnEditorStandaloneResource } from "../../dev-webapp/DmnEditorStandaloneChannelApiImpl";

import { DmnEditorStandaloneApi } from "../../dev-webapp/DmnEditorStandaloneApi";

export type DevWebAppProps = {
  initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot: string;
  initialContent: string;
  readOnly: boolean;
  resources: Array<[string, DmnEditorStandaloneResource]>;
  origin: string;
};

function DevWebApp(props?: Partial<DevWebAppProps>) {
  const [args, updateArgs] = useArgs<DevWebAppProps>();
  const editorRef = useRef<DmnEditorStandaloneApi>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const resources = useMemo(() => {
    const inputResources = props?.resources ?? args.resources;
    return inputResources
      ? new Map(
          inputResources.map(([key, value]) => [
            key,
            { contentType: value.contentType, content: Promise.resolve(value.content) },
          ])
        )
      : undefined;
  }, [args.resources, props?.resources]);

  useEffect(() => {
    const editor = DmnEditor.open({
      container: editorContainerRef.current!,
      initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot:
        props?.initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot ??
        args.initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot,
      initialContent: Promise.resolve(props?.initialContent ?? args.initialContent),
      readOnly: props?.readOnly ?? args.readOnly,
      resources: resources,
      origin: props?.origin ?? args.origin ?? "*",
    });

    (editorRef as any).current = editor;

    console.info(
      "Access the 'editor' variable by right clicking the following object and selecting 'Store as temp object'. With this you will be able to interact with the editor API."
    );
    console.info(
      "Remember to select the 'storybook-preview-iframe' in the context selector above, to left of the filter input."
    );
    console.log(editor);

    return () => {
      editor.close();
    };
  }, [args, props, resources]);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div ref={editorContainerRef} id="dmn-editor-container" style={{ height: "100%" }} />
      </div>
    </>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof DevWebApp> = {
  title: "Dev/Envelope App",
  component: DevWebApp,
};

export default meta;
type Story = StoryObj<typeof DevWebApp>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WebApp: Story = {
  render: (args) => DevWebApp(),
  args: {
    initialFileNormalizedPosixPathRelativeToTheWorkspaceRoot: "path1/subpath/newModel1.dmn",
    initialContent: "",
    readOnly: false,
    resources: [],
    origin: "*",
  },
};
