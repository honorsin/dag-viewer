import React, { useState } from "react";
import "./styles.css";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

//import { JsonEditor } from "jsoneditor-react";
//import "jsoneditor-react/es/editor.min.css";

import DAGViewer from "./DAGViewer";

import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container, CardText } from "reactstrap";

export default function App() {
  const [dag, SetDag] = useState({
    description: "wow",
    id: 310,
    mode: "Merge Tool",
    name: "\u6709DB",
    owner: "user",
    script:
      "{'version': '1.0.0', 'dag': {'0': {'module': 'init_data_loader/QueryFile', 'kwargs': {'file': 'file:///tmpzytne92u.csv', 'data_base_dir': '/data/qme/tmp', 'clean': True}, 'last_modify_timestamp': '2020-11-24T05:22:16', 'outputs': {'source': {'type': 'Source', 'node_id': '0'}}, 'last_fit_timestamp': '2020-11-24T05:22:24', 'name': '0'}, '1': {'module': 'utility/CombineColumns', 'kwargs': {'cols': ['Date', 'Time']}, 'inputs': {'source': {'node_id': '0', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:22:43', 'outputs': {'source': {'type': 'Source', 'node_id': '1'}}, 'last_fit_timestamp': '2020-11-24T05:22:58', 'name': '1'}, '2': {'module': 'utility/Filter', 'kwargs': {'filtering_col': 'Cycle Time [s]', 'op': '>', 'value': '35'}, 'inputs': {'source': {'node_id': '1', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:23:30', 'outputs': {'source': {'type': 'Source', 'node_id': '2'}}, 'last_fit_timestamp': '2020-11-24T05:23:44', 'name': '2'}, '3': {'module': 'utility/Filter', 'kwargs': {'filtering_col': 'Cycle Time [s]', 'op': '<=', 'value': '20'}, 'inputs': {'source': {'node_id': '1', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:23:56', 'outputs': {'source': {'type': 'Source', 'node_id': '3'}}, 'last_fit_timestamp': '2020-11-24T05:24:08', 'name': '3'}, '4': {'module': 'utility/MathEquation', 'kwargs': {'equation': '1', 'new_feature_name': 'defect'}, 'inputs': {'source': {'node_id': '2', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:24:27', 'outputs': {'source': {'type': 'Source', 'node_id': '4'}}, 'last_fit_timestamp': '2020-11-24T05:24:40', 'name': '4'}, '5': {'module': 'utility/MathEquation', 'kwargs': {'equation': '1', 'new_feature_name': 'defect'}, 'inputs': {'source': {'node_id': '3', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:24:58', 'outputs': {'source': {'type': 'Source', 'node_id': '5'}}, 'last_fit_timestamp': '2020-11-24T05:25:13', 'name': '5'}, '6': {'module': 'utility/Concat', 'kwargs': {}, 'inputs': {'source': {'node_id': '4', 'type': 'Source'}, 'target': {'node_id': '5', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:25:40', 'outputs': {'source': {'type': 'Source', 'node_id': '6'}}, 'last_fit_timestamp': '2020-11-24T05:25:50', 'name': '6'}, '7': {'module': 'utility/ColumnSelect', 'kwargs': {'select_columns': ['Date_Time', 'defect']}, 'inputs': {'source': {'node_id': '6', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:26:42', 'outputs': {'source': {'type': 'Source', 'node_id': '7'}}, 'last_fit_timestamp': '2020-11-24T05:26:54', 'name': '7'}, '8': {'module': 'data_align/Merge', 'kwargs': {'how': 'left', 'left_on': ['Date_Time'], 'right_on': ['Date_Time'], 'suffixes': ['_A2_shot_info_CombineColumns', '_A2_SHOT_INFO_DEFECT']}, 'inputs': {'source': {'node_id': '1', 'type': 'Source'}, 'target': {'node_id': '7', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:27:31', 'outputs': {'source': {'type': 'Source', 'node_id': '8'}}, 'last_fit_timestamp': '2020-11-24T05:27:46', 'name': '8'}, '9': {'module': 'utility/Imputation', 'kwargs': {'cols': ['defect'], 'method': 'zero', 'index_col': 'Date_Time'}, 'inputs': {'source': {'node_id': '8', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:28:47', 'outputs': {'source': {'type': 'Source', 'node_id': '9'}}, 'last_fit_timestamp': '2020-11-24T05:29:04', 'name': '9'}, '10': {'module': 'utility/ColumnSelect', 'kwargs': {'select_columns': ['Date_Time', 'defect']}, 'inputs': {'source': {'node_id': '9', 'type': 'Source'}}, 'last_modify_timestamp': '2020-11-24T05:29:34', 'outputs': {'source': {'type': 'Source', 'node_id': '10'}}, 'last_fit_timestamp': '2020-11-24T05:29:46', 'name': '10'}}}",
    timestamp: "Fri, 20 Mar 2020 03:37:30 GMT",
    user_id: 0
  });
  return (
    <div className="App">
      {/* <JsonEditor
        value={dag}
        // height="35vh"
        style={{
          height: "35vh"
        }}
        // options in here

        onChange={e => {
          //console.log(e);
        }}
        innerRef={ref => {
          // ref.style = {
          //   height: "35vh",
          //   ...(ref.style ? ref.style : {})
          // };
          ref.style = "height: 35vh";
          console.log("ref", typeof ref, ref);
        }}
      /> */}
      <Container>
        <Row>
          <CardText>
            You can get DAG from API /api/v1.0/Dag/&lt;id&gt;
            <br />
            and DAG id can get from API /api/v1.0/Experiment/&lt;id&gt;
          </CardText>
        </Row>
        <Row>
          <JSONInput
            height="35vh"
            width="100%"
            placeholder={dag}
            reset={false}
            onKeyPressUpdate={false}
            locale={locale}
            onChange={(e) => {
              if (!e.error) {
                SetDag(e.jsObject);
              }
            }}
          />
        </Row>
        <Row>
          <DAGViewer dag={dag} height="65vh" />
        </Row>
      </Container>
    </div>
  );
}
