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
import { useState } from "react";
import { TextInput } from "@patternfly/react-core/dist/js/components/TextInput";
import { Validated } from "../../../types";

interface GenericTextInputProps {
  id: string;
  value: string | undefined;
  validated: Validated;
  onChange: (_value: string) => void;
  onBlur: () => void;
}

export const GenericTextInput = (props: GenericTextInputProps) => {
  const { onBlur } = props;

  const [state, setState] = useState(props.value);

  const onChange = (_value: string) => {
    props.onChange(_value);
    setState(_value);
  };

  return (
    <TextInput
      id={props.id}
      value={state}
      onChange={(_event, _value: string) => onChange(_value)}
      onBlur={onBlur}
      validated={props.validated}
      isRequired={true}
      className="text-input"
      type="text"
    />
  );
};
