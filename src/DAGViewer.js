import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { Graphviz } from "graphviz-react";
import { graphviz } from "d3-graphviz";
import { Button } from "reactstrap";
import save_svg from "save-svg-as-png";

const dag2dot = (dag) => {
  let dot = "digraph {\n";
  // add node, edges
  for (let [node_id, node] of Object.entries(dag.script.dag)) {
    let label = `${node.module.split("/").slice(-1)[0]} ( `;
    label += JSON.stringify(node.kwargs)
      .replace(/"/g, '\\"')
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/</g, "\\<")
      .replace(/>/g, "\\>");
    label += " )";
    if (node.inputs) {
      let inputs = [];
      for (let [input_name, input] of Object.entries(node.inputs)) {
        inputs.push(`<i_${input.type}> ${input_name}`);
      }
      inputs = inputs.join("|");
      if (inputs.length > 0) {
        //prepend
        label = `{ ${inputs} } | ${label}`;
      }
    }
    if (node.outputs) {
      let outputs = [];
      for (let [output_name, output] of Object.entries(node.outputs)) {
        outputs.push(`<o_${output.type}> ${output_name}`);
      }
      outputs = outputs.join("|");
      if (outputs.length > 0) {
        //append
        label = `${label} | ${outputs}`;
      }
    }
    label = `{ ${label} }`;

    dot += `\t${node_id} [shape=Mrecord, label="${label}"]\n`;

    if (node.inputs) {
      for (let input of Object.values(node.inputs)) {
        let link = `${input.node_id}:${input.type} -> ${node_id}:${input.type}`;
        dot += `\t${link}\n`;
      }
    }
  }
  dot += "\n}\n";
  return dot;
};

export default (props) => {
  const { dag: orig_dag } = props;
  let dag = {
    ...orig_dag
  };

  let dot = "";
  let error_msg = "";
  try {
    if (dag && dag.script && typeof dag.script === "string") {
      dag.script = JSON.parse(
        dag.script
          .replace(/'/g, '"')
          .replace(/True/g, "true")
          .replace(/False/g, "false")
          .replace(/None/g, "null")
      );
    }

    dot = dag2dot(dag);
  } catch (e) {
    console.error(e);
    error_msg = e.toString();
  }
  // gen css from props
  const { width = "100%", height = "100%", style: orig_style } = props;
  // const style = {
  //   ...orig_style,
  //   width,
  //   height
  // };
  const style = useMemo(() => {
    return {
      ...orig_style,
      width,
      height
    };
  }, [orig_style, width, height]);
  const graphvizRoot = useRef(null);

  // update style in Graphviz div
  useEffect(() => {
    if (graphvizRoot.current) {
      const { id } = graphvizRoot.current;
      // use DOM id update style
      const el = document.getElementById(id);
      for (let [k, v] of Object.entries(style)) {
        el.style[k] = v;
      }
    }
  }, [graphvizRoot, style]);
  const reset = useCallback(() => {
    if (graphvizRoot.current) {
      const { id } = graphvizRoot.current;
      graphviz(`#${id}`).resetZoom();
    }
  }, [graphvizRoot]);
  return (
    <div
      style={{
        ...style,
        position: "relative"
      }}
    >
      {dot !== ""
        ? [
            <Graphviz
              dot={dot}
              options={{
                useWorker: false,
                ...style,
                zoom: true,
                ...props
              }}
              ref={graphvizRoot}
            />,
            <Button
              outline
              size="sm"
              onClick={reset}
              style={{
                position: "absolute",
                right: "5%",
                top: "5%"
              }}
            >
              Reset
            </Button>,
            <Button
              outline
              size="sm"
              onClick={() => {
                if (graphvizRoot.current) {
                  const { id } = graphvizRoot.current;
                  save_svg.saveSvgAsPng(
                    // workaround: find SVG node
                    document.getElementById(`${id}`).childNodes[0],
                    `dagviewer-export-${dag.id}.png`,
                    {
                      scale: 1.0,
                      backgroundColor: "white"
                    }
                  );
                }
              }}
              style={{
                position: "absolute",
                right: "5%",
                top: "15%"
              }}
            >
              Export
            </Button>
          ]
        : error_msg}
    </div>
  );
};
