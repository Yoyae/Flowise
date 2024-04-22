import {
  ICommonObject,
  IDatabaseEntity,
  INode,
  INodeData,
  INodeOutputsValue,
  INodeParams,
} from "../../../src/Interface";
import { DataSource } from "typeorm";
import {
  getBaseClasses,
  getVars 
} from "../../../src/utils";

import { BaseLanguageModel } from '@langchain/core/language_models/base'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

class SwitchCaseFunction_Utilities implements INode {
  label: string;
  name: string;
  version: number;
  description: string;
  type: string;
  icon: string;
  category: string;
  baseClasses: string[];
  inputs: INodeParams[];
  outputs: INodeOutputsValue[];

  constructor() {
    this.label = "Switch Case Model Function";
    this.name = "switchCaseFunction";
    this.version = 1.1;
    this.type = "SwitchCaseFunction";
    this.icon = "switchcasefunction.svg";
    this.category = "Utilities";
    this.description = `Split flows based on Switch Case javascript functions`;
    this.baseClasses = [this.type, ...getBaseClasses(BaseLanguageModel)];
    this.inputs = [
      {
        label: "Input Model GPT",
        name: "inputModelA",
        type: "BaseLanguageModel"
      },
      {
        label: "Input Model Anthropic Maxime",
        name: "inputModelB",
        type: "BaseLanguageModel",
      },
      {
        label: "Input Model Anthropic Melies",
        name: "inputModelC",
        type: "BaseLanguageModel",
      }
    ];
    this.outputs = [
      {
        label: "Selected Model",
        name: "selectedModel",
        baseClasses: [this.type, ...getBaseClasses(BaseChatModel)]
      }
    ]
  }

  async init(
    nodeData: INodeData,
    _: string,
    options: ICommonObject,
  ): Promise<any> {
    const modelA = nodeData.inputs?.inputModelA as BaseLanguageModel;
    const modelB = nodeData.inputs?.inputModelB as BaseLanguageModel;
    const modelC = nodeData.inputs?.inputModelC as BaseLanguageModel;
    const appDataSource = options.appDataSource as DataSource;
    const databaseEntities = options.databaseEntities as IDatabaseEntity;

    const variables = await getVars(appDataSource, databaseEntities, nodeData);
    let isGPT = '0';
    let isAnthropicMaxime = '0';
    variables.forEach((variable) => {
      if(variable.name === 'Use GPT'){
        isGPT = variable.value;
      }
      if(variable.name === 'Use Anthropic Maxime'){
        isAnthropicMaxime = variable.value;
      }
    });
    
    console.log(isGPT);
    console.log(isAnthropicMaxime);

    if(isGPT === '1'){
      return modelA;
    }else if (isAnthropicMaxime === '1'){
      return modelB;
    }else {
      return modelC;
    }

/*
    [
      flowise:dev:   Variable {
      flowise:dev:     id: 'f72f3c4b-fb83-4210-8c5b-820d9cf9f1f8',
      flowise:dev:     name: 'test',
      flowise:dev:     value: '"ABC"',
      flowise:dev:     type: 'static',
      flowise:dev:     createdDate: 2024-04-03T10:26:18.000Z,
      flowise:dev:     updatedDate: 2024-04-03T11:59:47.000Z
      flowise:dev:   }
      flowise:dev: ]
    const switchVariable = nodeData.inputs?.switchVariable as string;
    const caseFunctions = nodeData.inputs?.caseFunctions as Array<{ 
      caseValue: string;
      caseFunction: string;
    }>;
    const defaultFunction = nodeData.inputs?.defaultFunction as string;
    const functionInputVariablesRaw = nodeData.inputs?.functionInputVariables;
    const appDataSource = options.appDataSource as DataSource;
    const databaseEntities = options.databaseEntities as IDatabaseEntity;

    const variables = await getVars(appDataSource, databaseEntities, nodeData);
    const flow = {
      chatflowId: options.chatflowid,
      sessionId: options.sessionId,
      chatId: options.chatId,
      input,
    };

    let inputVars: ICommonObject = {};
    if (functionInputVariablesRaw) {
      try {
        inputVars =
          typeof functionInputVariablesRaw === "object"
            ? functionInputVariablesRaw
            : JSON.parse(functionInputVariablesRaw);
      } catch (exception) {
        throw new Error(
          "Invalid JSON in the Switch Case's Input Variables: " + exception,
        );
      }
    }

    // Some values might be a stringified JSON, parse it
    for (const key in inputVars) {
      let value = inputVars[key];
      if (typeof value === "string") {
        value = handleEscapeCharacters(value, true);
        if (value.startsWith("{") && value.endsWith("}")) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // ignore
          }
        }
        inputVars[key] = value;
      }
    }

    let sandbox: any = { $input: input };
    sandbox["$vars"] = prepareSandboxVars(variables);
    sandbox["$flow"] = flow;

    if (Object.keys(inputVars).length) {
      for (const item in inputVars) {
        sandbox[`$${item}`] = inputVars[item];
      }
    }

    const builtinDeps = process.env.TOOL_FUNCTION_BUILTIN_DEP
      ? defaultAllowBuiltInDep.concat(
          process.env.TOOL_FUNCTION_BUILTIN_DEP.split(","),
        )
      : defaultAllowBuiltInDep;
    const externalDeps = process.env.TOOL_FUNCTION_EXTERNAL_DEP
      ? process.env.TOOL_FUNCTION_EXTERNAL_DEP.split(",")
      : [];
    const deps = availableDependencies.concat(externalDeps);

    const nodeVMOptions = {
      console: "inherit",
      sandbox,
      require: {
        external: { modules: deps },
        builtin: builtinDeps,
      },
    } as any;

    const vm = new NodeVM(nodeVMOptions);
    try {
      const defaultResponse = await vm.run(
        `module.exports = async function() {${defaultFunction}}()`,
        __dirname,
      );
      return {
        output:
          typeof defaultResponse === "string"
            ? handleEscapeCharacters(defaultResponse, false)
            : defaultResponse,
      };
    } catch (e) {
      throw new Error(e);
    }*/
  }
}

module.exports = { nodeClass: SwitchCaseFunction_Utilities };
