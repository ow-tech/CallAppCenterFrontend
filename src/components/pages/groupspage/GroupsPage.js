import React from "react";

import AddGroup from "./AddGroup";
import EditGroup from "./EditGroup";

import "./GroupsPage.css";

const GroupsPage = () => {

  return (
    <div className="group-page">
      <AddGroup />
      <EditGroup />
    </div>
  );
};

export default GroupsPage;
