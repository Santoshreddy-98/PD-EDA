import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Backendapi from "./Backendapi";
import loaderimg from "./loadingBest.gif";
import ColorCodingInfo from "./ColorCodingInfo";
import "./home.css";
import { getBackgroundColor } from "./logout";

const DesignAuditorHome = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("Not available !");
  const [projects, setProjects] = useState(["Not available !"]);

  //Dummy checklists if there is no project .
  const [stages, setStages] = useState([
    {
      name: "Synthesis",
      milestone_01_checklist: false,
      milestone_05_checklist: false,
      milestone_08_checklist: false,
      milestone_10_checklist: false,
      milestone_01_percentage: 0,
      milestone_05_percentage: 0,
      milestone_08_percentage: 0,
      milestone_10_percentage: 0,
    },
    {
      name: "Floorplan",
      milestone_01_checklist: false,
      milestone_05_checklist: false,
      milestone_08_checklist: false,
      milestone_10_checklist: false,
      milestone_01_percentage: 0,
      milestone_05_percentage: 0,
      milestone_08_percentage: 0,
      milestone_10_percentage: 0,
    },
    {
      name: "Placement",
      milestone_01_checklist: false,
      milestone_05_checklist: false,
      milestone_08_checklist: false,
      milestone_10_checklist: false,
      milestone_01_percentage: 0,
      milestone_05_percentage: 0,
      milestone_08_percentage: 0,
      milestone_10_percentage: 0,
    },
    {
      name: "CTS",
      milestone_01_checklist: false,
      milestone_05_checklist: false,
      milestone_08_checklist: false,
      milestone_10_checklist: false,
      milestone_01_percentage: 0,
      milestone_05_percentage: 0,
      milestone_08_percentage: 0,
      milestone_10_percentage: 0,
    },
    {
      name: "Route",
      milestone_01_checklist: false,
      milestone_05_checklist: false,
      milestone_08_checklist: false,
      milestone_10_checklist: false,
      milestone_01_percentage: 0,
      milestone_05_percentage: 0,
      milestone_08_percentage: 0,
      milestone_10_percentage: 0,
    },
  ]);
  //Get the list of checklists
  useEffect(() => {
    axios
      .get(`${Backendapi.REACT_APP_BACKEND_API_URL}/getAllDesigns`)
      .then(({ data }) => {
        setProjectData(data);

        if (data.length > 0) {
          setSelectedProject(data[0].projectName);
          const projectList = data.map((project) => project.projectName);
          setProjects(projectList);
          setStages(data[0].stages);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setLoading(false);
      });
  }, []);

  //Dynamically handle checklists
  const handleChangeDesign = ({ target: { value } }) => {
    const project = projectData.find((item) => item.projectName === value);
    if (project) {
      setStages(project.stages);
      setSelectedProject(value);
    } else {
      console.log("Project not found");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {loading ? (
        <center style={{ marginTop: "100px", padding: "10px" }}>
          <img src={loaderimg} alt="loading" />
          <h3>
            Welcome to the{" "}
            <span style={{ color: "green", fontWeight: 600 }}>
              Design Auditor
            </span>{" "}
            Home Page.
          </h3>
        </center>
      ) : (
        <>
          <h1
            style={{
              textAlign: "center",
              padding: "20px",
              marginTop: "30px",
              marginBottom: "30px",
              color: "navy", // Text color
              fontFamily: "Arial, sans-serif", // Font family
              borderRadius: "8px", // Border radius for rounded corners
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow for a subtle elevation
            }}
          >
            DESIGN AUDITOR - CHECKLISTS
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 className="w-50 d-flex mb-4" style={{ marginLeft: "10px" }}>
              Design
                  <select
                    onChange={handleChangeDesign}
                    className="form-select w-50"
                    style={{ marginLeft: "10px", }}
                  >
                    {projects.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
              
            </h3>
          </div>
          <div style={{ width: "100%", margin: "0px auto" }}>
            <div
              style={{
                border: "1px solid #efefef",
                borderRadius: "10px",
                margin: "10px",
                padding: "10px",
                boxShadow: "0 0 10px 2px rgba(0, 0, 0, .1)",
              }}
            >
              <table>
                <thead style={{ backgroundColor: "powderblue" }}>
                  <tr>
                    <th style={{ width: "5%" }}>S.No</th>
                    <th>Stage</th>
                    <th>
                      <MilestoneHeadingComponent milestoneName="Milestone 0.1" />
                    </th>
                    <th>
                      <MilestoneHeadingComponent milestoneName="Milestone 0.5" />
                    </th>
                    <th>
                      <MilestoneHeadingComponent milestoneName="Milestone 0.8" />
                    </th>
                    <th>
                      <MilestoneHeadingComponent milestoneName="Milestone 1.0" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <b>{item.name}</b>
                      </td>
                      <td>
                        <MilestoneComponent
                          stage={item.name}
                          milestonepath="milestone_0.1"
                          selectedProject={selectedProject}
                          milestone={item.milestone_01_checklist}
                          percentage={item.milestone_01_percentage}
                        />
                      </td>
                      <td>
                        <MilestoneComponent
                          stage={item.name}
                          milestonepath="milestone_0.5"
                          selectedProject={selectedProject}
                          milestone={item.milestone_05_checklist}
                          percentage={item.milestone_05_percentage}
                        />
                      </td>
                      <td>
                        <MilestoneComponent
                          stage={item.name}
                          milestonepath="milestone_0.8"
                          selectedProject={selectedProject}
                          milestone={item.milestone_08_checklist}
                          percentage={item.milestone_08_percentage}
                        />
                      </td>
                      <td>
                        <MilestoneComponent
                          stage={item.name}
                          milestonepath="milestone_1.0"
                          selectedProject={selectedProject}
                          milestone={item.milestone_10_checklist}
                          percentage={item.milestone_10_percentage}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* color coding info : */}
              <ColorCodingInfo />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DesignAuditorHome;


export const MilestoneComponent = ({
  selectedProject,
  milestonepath,
  stage,
  milestone,
  percentage,
}) => {
  const navigate = useNavigate();
  const handleRouting = async (stage, checkListType) => {
    navigate(
      `/designAuditorPage/view/${milestonepath}/${selectedProject}/${stage}/${checkListType}`
    );
  };
  return (
    <div className="row">
      <div style={{ borderRight: "2px solid green" }} className="col-6 ">
        {milestone ? (
          <button
            onClick={() => handleRouting(stage, "preChecklist")}
            title={stage + " " + milestonepath}
            className="btn btn-primary mr-2"
          >
            View
          </button>
        ) : (
          <button
            disabled
            style={{ background: "#bcbd9d" }}
            className="btn mr-2"
          >
            View
          </button>
        )}
      </div>
      <div className="col-6">
        <div
          style={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: getBackgroundColor(milestone ? percentage : ""),
          }}
        >
          {milestone ? (
            <b>
              {percentage > 0
                ? Number.isInteger(percentage)
                  ? `${percentage}%`
                  : `${percentage.toFixed(2)}%`
                : "0%"}
            </b>
          ) : (
            <b>-</b>
          )}
        </div>
      </div>
    </div>
  );
};

export const MilestoneHeadingComponent = ({ milestoneName }) => {
  return <div>
    {milestoneName}
    <hr />
    <div className="row">
      <span style={{ borderRight: "2px solid green" }} className="col-6 " >
        Checklist
      </span>
      <span className="col-6">QC Score(%)</span>
    </div>
  </div>

}
