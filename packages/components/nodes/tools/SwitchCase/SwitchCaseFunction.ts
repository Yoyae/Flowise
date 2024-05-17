import {
    ICommonObject,
    IDatabaseEntity,
    INode,
    INodeData,
    INodeOutputsValue,
    INodeParams,
} from '../../../src/Interface';
import { DataSource } from 'typeorm';
import { getBaseClasses, getVars } from '../../../src/utils';

import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

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
        this.label = 'Switch Case Model Function';
        this.name = 'switchCaseFunction';
        this.version = 1.1;
        this.type = 'SwitchCaseFunction';
        this.icon = 'switchcasefunction.svg';
        this.category = 'Utilities';
        this.description = `Split flows based on Switch Case javascript functions`;
        this.baseClasses = [this.type, ...getBaseClasses(BaseLanguageModel)];
        this.inputs = [
            {
                label: 'Input Model GPT',
                name: 'inputModelA',
                type: 'BaseLanguageModel',
            },
            {
                label: 'Input Model Anthropic Maxime',
                name: 'inputModelB',
                type: 'BaseLanguageModel',
            },
            {
                label: 'Input Model Anthropic Melies',
                name: 'inputModelC',
                type: 'BaseLanguageModel',
            },
        ];
        this.outputs = [
            {
                label: 'Selected Model',
                name: 'selectedModel',
                baseClasses: [this.type, ...getBaseClasses(BaseChatModel)],
            },
        ];
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const modelA = nodeData.inputs?.inputModelA as BaseLanguageModel;
        const modelB = nodeData.inputs?.inputModelB as BaseLanguageModel;
        const modelC = nodeData.inputs?.inputModelC as BaseLanguageModel;
        const appDataSource = options.appDataSource as DataSource;
        const databaseEntities = options.databaseEntities as IDatabaseEntity;

        const variables = await getVars(appDataSource, databaseEntities, nodeData);
        let isGPT = '0';
        let isAnthropicMaxime = '0';
        variables.forEach((variable) => {
            if (variable.name === 'Use GPT') {
                isGPT = variable.value;
            }
            if (variable.name === 'Use Anthropic Maxime') {
                isAnthropicMaxime = variable.value;
            }
        });

        if (isGPT === '1') {
            return modelA;
        } else if (isAnthropicMaxime === '1') {
            return modelB;
        } else {
            return modelC;
        }
    }
}

module.exports = { nodeClass: SwitchCaseFunction_Utilities };
