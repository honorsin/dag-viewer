import React from "react";
import {
  DiagramEngine,
  DiagramWidget,
  //DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel
} from "@projectstorm/react-diagrams";

//import { CanvasWidget } from "@projectstorm/react-canvas-core";
// import { tan } from "mathjs";

// const dag_py_str =
//   "{'version': '1.0.0', 'dag': {'0': {'module': 'init_data_loader/QueryDB', 'kwargs': {'source': 'functionQuery', 'm': 'arange', 'c': 3, 'r': 3}, 'last_modify_timestamp': '2020-03-20T03:34:10', 'outputs': {'source': {'type': 'Source', 'node_id': '0'}}, 'last_fit_timestamp': '2020-03-20T03:34:13', 'name': 'a935d88c-6a5b-11ea-a934-0242ac1c000d'}, '1': {'module': 'init_data_loader/QueryDB', 'kwargs': {'source': 'oracle-multitable', 't': 'npw', 'm': 'M-A14A'}, 'last_modify_timestamp': '2020-03-20T03:35:21', 'outputs': {'source': {'type': 'Source', 'node_id': '1'}}, 'last_fit_timestamp': '2020-03-20T03:35:24', 'name': 'd37f6db0-6a5b-11ea-8b9b-0242ac1c000d'}, '2': {'module': 'utility/Concat', 'kwargs': {}, 'inputs': {'source': {'node_id': '0', 'type': 'Source'}, 'target': {'node_id': '1', 'type': 'Source'}}, 'last_modify_timestamp': '2020-03-20T03:35:39', 'outputs': {'source': {'type': 'Source', 'node_id': '2'}}, 'last_fit_timestamp': '2020-03-20T03:35:42', 'name': 'de43f0a4-6a5b-11ea-bfa5-0242ac1c000d'}, '3': {'module': 'init_data_loader/QueryDB', 'kwargs': {'source': 'functionQuery', 'm': 'arange', 'c': 3, 'r': 3}, 'last_modify_timestamp': '2020-03-17T08:21:24', 'outputs': {'source': {'type': 'Source', 'node_id': '3'}}, 'last_fit_timestamp': '2020-03-17T08:21:27', 'name': '4a2ec3b0-6828-11ea-bfa5-0242ac1c000d'}, '4': {'module': 'data_align/Merge', 'kwargs': {'how': 'left', 'left_on': ['A', 'B', 'C'], 'right_on': ['A', 'B', 'C'], 'suffixes': ['_C_Concat_D', '_A']}, 'inputs': {'source': {'node_id': '2', 'type': 'Source'}, 'target': {'node_id': '3', 'type': 'Source'}}, 'last_modify_timestamp': '2020-03-20T03:36:24', 'outputs': {'source': {'type': 'Source', 'node_id': '4'}}, 'last_fit_timestamp': '2020-03-20T03:36:27', 'name': 'f9090334-6a5b-11ea-b035-0242ac1c000d'}}}";
// let dag = JSON.parse(dag_py_str.replace(/'/g, '"'));

import "@projectstorm/react-diagrams";

const DAGViewer = props => {
  const { dag } = props;
  if (typeof dag.script === "string") {
    dag.script = JSON.parse(dag.script.replace(/'/g, '"'));
  }
  console.log(dag);

  const engine = new DiagramEngine();
  engine.installDefaultFactories();

  const model = new DiagramModel();

  const mymodel = {};
  for (let [node_id, node] of Object.entries(dag.script.dag)) {
    const node_model = new DefaultNodeModel(node.module);
    // alls.push(
    //   // new DefaultNodeModel({
    //   //   name: node.module
    //   // })
    //   new DefaultNodeModel(node.module)
    // );
    const inPorts = {},
      outPorts = {};
    if (node.inputs)
      for (let [input_name, input] of Object.entries(node.inputs)) {
        let p = node_model.addInPort(input_name);
        // inPorts[input.type] = p
        inPorts[input_name] = p;
      }
    if (node.outputs)
      for (let [output_name, output] of Object.entries(node.outputs)) {
        let p = node_model.addOutPort(output_name);
        outPorts[output.type] = p;
      }
    // `$.ports.*.[in, labels]`
    // in is true mean InPort
    // console.log(node_model);
    node_model.setPosition(100, parseInt(node_id, 10) * 400 + 100);
    model.addAll(node_model);
    mymodel[node_id] = {
      model: node_model,
      in: inPorts,
      out: outPorts
    };
  }
  // create links
  for (let [node_id, node] of Object.entries(dag.script.dag)) {
    if (node.inputs)
      for (let [input_name, input] of Object.entries(node.inputs)) {
        let outp = mymodel[input.node_id]["out"][input.type];
        let inp = mymodel[node_id]["in"][input_name];
        let link = outp.link(inp);
        link.addLabel("hi");
        model.addAll(link);
      }
  }

  console.log("model: ", model);
  console.log("mymodel: ", mymodel);

  model.serializeDiagram();
  engine.setDiagramModel(model);
  return (
    <DiagramWidget
      diagramEngine={engine}
      smartRouting={true}
      maxNumberPointsPerLink={0}
    />
  );
};

export default DAGViewer;
